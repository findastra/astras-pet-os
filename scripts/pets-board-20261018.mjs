// Pets Board: one live chart of every pet, rebuilt from GitHub (Astra, 2026-10-18: "so I can just go to this chart
// and see what is going on with the pets at any point"). Nothing here is kept by hand: the order and names come from
// pet-programs.json, mood and needs from the Farmer's status/pets-status.json, live pages from pets.json, and pull
// requests, checks, who is working and the last change from GitHub. Claude Opus 5.5 (claude-opus-5-5), 2026-10-18.
//
//   BOARD_TOKEN=<read-only token> node scripts/pets-board-20261018.mjs [--out BOARD.md]
//
// .github/workflows/pets-board.yml runs it every 30 minutes and saves the result on the `board` branch, so the board
// is never more than half an hour old and nobody merges anything for it. Without a token that can read private repos,
// private pets show as private.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const OWNER = 'findastra';
const HUB = 'astras-pet-os';
const RAW = `https://raw.githubusercontent.com/${OWNER}/${HUB}/main`;
const SITE = `https://${OWNER}.github.io/${HUB}`;

/** Who a branch belongs to, from its prefix. */
export function whoOf(branch = '') {
  if (/^claude\//.test(branch)) return 'Claude';
  if (/^codex\//.test(branch)) return 'Codex';
  if (/^farmer\//.test(branch)) return 'Farmer';
  if (/^dependabot\//.test(branch)) return 'Dependabot';
  return 'Astra';
}

/** One pull request as a few plain words: ready, conflict, checks failing, checking or draft. */
export function prState(pr) {
  if (pr.isDraft) return 'draft';
  const checks = pr.checks; // SUCCESS, FAILURE, ERROR, PENDING, EXPECTED or null (no checks)
  if (pr.mergeable === 'CONFLICTING') return 'conflict';
  if (checks === 'FAILURE' || checks === 'ERROR') return 'checks failing';
  if (pr.mergeable === 'UNKNOWN' || checks === 'PENDING' || checks === 'EXPECTED') return 'checking';
  return 'ready';
}

const esc = (s) => String(s ?? '').replace(/\\/g, '\\\\').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
const day = (iso) => (iso ? iso.slice(0, 10) : '—');

/**
 * Build the board's markdown from plain data, with no network: used by the script and by the tests.
 * repos: { name: { private, pushedAt, lastCommit, prs: [{ number, title, url, headRefName, isDraft, mergeable, checks }] } }
 * sites: { name: 'up' | 'down (404)' | ... }
 */
export function buildBoard({ programs, registry, status, repos, sites, now, iconFor }) {
  const reg = [...(registry.pets || []), ...(registry.pipeline || [])];
  // status/pets-status.json keys pets by repo (older repo names included), so look a pet up by repo, then by name.
  const byRepo = status?.pets && !Array.isArray(status.pets) ? status.pets : Object.fromEntries((status?.pets || []).map((p) => [p.repo, p]));
  const moodOf = (p) => byRepo[p.repo] || Object.values(byRepo).find((x) => x.pet === p.icon) || null;
  const askOf = (p) => (status?.needs_astra || []).filter((n) => n.repo === p.repo || n.pet === p.icon).map((n) => n.need);
  const L = [];
  L.push('# Pets Board', '');
  L.push(`Every pet, in the order they were made. Rebuilt from GitHub every 30 minutes; last change to this chart ${now}. Moods come from the Farmer's round of ${day(status?.updated)}.`, '');
  L.push('| # | Pet | Program | Mood | Needs you | Pull requests | Working on it | Last change | Site |', '|--:|---|---|---|---|---|---|---|---|');
  for (const p of [...programs].sort((a, b) => a.number - b.number)) {
    const r = repos[p.repo] || null;
    const e = reg.find((x) => x.repo === p.repo) || {};
    // The program's name opens its pet program page (Astra, 2026-10-19: "one click always points to program page").
    const live = (e.interface_url && !/^https?:/.test(e.interface_url) ? `${SITE}/${e.interface_url}` : null) || e.interface_live_url || e.interface_url || null;
    const icon = iconFor(p);
    const pet = `${icon ? `<img src="${icon}" width="24" alt=""> ` : ''}[${esc(p.icon)}](https://github.com/${OWNER}/${p.repo})`;
    const program = live ? `[${esc(p.program)}](${live})` : `[${esc(p.program)}](https://github.com/${OWNER}/${p.repo})`;
    const m = moodOf(p);
    const says = (m?.says || '').replace(/^Need:\s*/i, '');
    const mood = m ? `${m.mood}${says && !/^Need/i.test(m.says || '') ? `: ${esc(says.length > 60 ? says.slice(0, 57) + '…' : says)}` : ''}` : '—';
    const prs = r?.prs || [];
    const ready = prs.filter((x) => prState(x) === 'ready');
    const asks = [...new Set([...askOf(p), ...(m?.needs || []).map((n) => (typeof n === 'string' ? n : n.need || n.msg || ''))].filter(Boolean))];
    const needs = [...asks.map(esc), ...(ready.length ? [`OK to merge ${ready.map((x) => `#${x.number}`).join(', ')}`] : [])];
    const prCell = r?.hidden ? 'private' : prs.length ? prs.map((x) => `[#${x.number}](${x.url}) ${prState(x)}`).join('<br>') : '—';
    const who = [...new Set(prs.map((x) => whoOf(x.headRefName)))].join(', ') || '—';
    const site = live ? (sites[p.repo] || 'not checked') : '—';
    L.push(`| ${p.number} | ${pet} | ${program} | ${mood} | ${needs.join('<br>') || '—'} | ${prCell} | ${who} | ${r?.hidden ? 'private' : day(r?.lastCommit)} | ${site} |`);
  }
  L.push('');
  L.push('**Pull requests:** ready (can merge, checks pass), conflict, checks failing, checking (GitHub is still working it out), draft. **Working on it:** whose branch the pull request comes from. Say "OK" in a chat to merge: the assistant does the merge.', '');
  L.push(`<sub>Built by \`scripts/pets-board-20261018.mjs\` in [${HUB}](https://github.com/${OWNER}/${HUB}). Do not edit this file; it is rebuilt.</sub>`, '');
  return L.join('\n');
}

async function graphql(token, query) {
  const res = await fetch('https://api.github.com/graphql', { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'pets-board' }, body: JSON.stringify({ query }) });
  const j = await res.json();
  if (!res.ok || (j.errors && !j.data)) throw new Error(`GitHub said ${res.status}: ${JSON.stringify(j.errors || j).slice(0, 300)}`);
  return j.data;
}

async function fetchRepos(token, names) {
  const out = {};
  for (let i = 0; i < names.length; i += 20) {
    const part = names.slice(i, i + 20);
    const q = `query { ${part.map((n, k) => `r${k}: repository(owner: "${OWNER}", name: "${n}") { name isPrivate pushedAt defaultBranchRef { target { ... on Commit { committedDate } } } pullRequests(states: OPEN, first: 30, orderBy: {field: CREATED_AT, direction: ASC}) { nodes { number title url headRefName isDraft mergeable commits(last: 1) { nodes { commit { statusCheckRollup { state } } } } } } }`).join(' ')} }`;
    const data = await graphql(token, q);
    part.forEach((n, k) => {
      const r = data[`r${k}`];
      if (!r) { out[n] = { hidden: true, prs: [] }; return; }
      out[n] = { private: r.isPrivate, pushedAt: r.pushedAt, lastCommit: r.defaultBranchRef?.target?.committedDate || null,
        prs: r.pullRequests.nodes.map((x) => ({ number: x.number, title: x.title, url: x.url, headRefName: x.headRefName, isDraft: x.isDraft, mergeable: x.mergeable, checks: x.commits.nodes[0]?.commit.statusCheckRollup?.state || null })) };
    });
  }
  return out;
}

async function checkSites(urls) {
  const out = {};
  await Promise.all(Object.entries(urls).map(async ([repo, url]) => {
    try {
      const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 15000);
      const res = await fetch(url, { method: 'GET', redirect: 'follow', signal: ctl.signal, headers: { 'User-Agent': 'pets-board' } });
      clearTimeout(t);
      out[repo] = res.ok ? 'up' : `down (${res.status})`;
    } catch { out[repo] = 'no answer'; }
  }));
  return out;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const root = new URL('../', import.meta.url);
  const read = (f) => JSON.parse(readFileSync(new URL(f, root), 'utf8'));
  const token = process.env.BOARD_TOKEN || process.env.FARMER_TOKEN || process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (!token) { console.error('Set BOARD_TOKEN (a read-only GitHub token).'); process.exit(1); }
  const programs = read('pet-programs.json').programs;
  const registry = read('pets.json');
  let status = null; try { status = read('status/pets-status.json'); } catch {}
  // Icons: the file named after the repo or the pet, else the one INTELLIGENCE-LEVELS.md shows beside the pet's name
  // (some icons keep an older repo name, such as vrchat-ai-astra for Astra Wisp).
  const files = (() => { try { return readdirSync(new URL('art/icons/', root)).filter((f) => f.endsWith('.png')); } catch { return []; } })();
  const levels = (() => { try { return readFileSync(new URL('INTELLIGENCE-LEVELS.md', root), 'utf8'); } catch { return ''; } })();
  const byPet = Object.fromEntries([...levels.matchAll(/art\/icons\/([\w.-]+\.png)[^|]*\|\s*([^|]+?)\s*\|/g)].map((m) => [m[2], m[1]]));
  const slug = (s) => String(s).toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const iconFor = (p) => { const f = files.find((x) => x.startsWith(`${p.repo}-`)) || files.find((x) => x.startsWith(`${slug(p.icon)}-`)) || byPet[p.icon]; return f ? `${RAW}/art/icons/${f}` : null; };
  const repos = await fetchRepos(token, [...new Set(programs.map((p) => p.repo))]);
  const reg = [...(registry.pets || []), ...(registry.pipeline || [])];
  // "Site" is whether the pet's own site or today's app answers (app_url since 2026-10-19), not its program page.
  const urls = Object.fromEntries(programs.map((p) => { const e = reg.find((x) => x.repo === p.repo) || {}; const a = e.app_url; const u = e.interface_live_url || (a && !/^https?:/.test(a) ? `${SITE}/${a}` : a); return [p.repo, u]; }).filter(([, u]) => u));
  const sites = await checkSites(urls);
  const now = new Date().toLocaleString('en-US', { timeZone: 'America/Denver', dateStyle: 'medium', timeStyle: 'short' }) + ' Denver';
  const md = buildBoard({ programs, registry, status, repos, sites, now, iconFor });
  const i = process.argv.indexOf('--out');
  if (i > 0) writeFileSync(process.argv[i + 1], md); else process.stdout.write(md);
  console.error(`board: ${programs.length} pets, ${Object.values(repos).reduce((n, r) => n + r.prs.length, 0)} open pull requests, ${Object.keys(sites).length} sites checked`);
  process.exit(0); // open keep-alive connections would hold the process otherwise
}
