// GitHub Aquarium's outstanding-items (`github-aquarium-v1.0-outstanding-items-v1.0`, a tool of GitHub Aquarium).
// Astra, 2026-10-21: "Can we get the GitHub goldfish to check the outstanding items on GitHub?" Her answers, all
// recommended (findastra/github-goldfish card 006): everything below counts, GitHub Aquarium owns it, the Pets Board's
// code moved here, one tool panel on GitHub Aquarium's page opens the full list, and it runs when asked.
// What waits on the farm owner on GitHub, from every repo the farm owner owns, sorted by the merge-order rank
// (skills/merge-order):
//   broken   scheduled or pushed jobs failing on the default branch (rank 2: something broken that runs every day)
//   you      pull requests ready for the owner's OK, and handoff cards that say they wait on the owner
//   chat     conflicts, failing checks, pull requests stacked on another branch, branches with work and no pull request
//   close    pull requests nobody has touched for STALE_DAYS ("close?", rank 5)
//   info     pull requests GitHub is still checking, and drafts
// Read only: GitHub's GraphQL API for queries (never a mutation) and its REST API with GET. The token goes to
// api.github.com only. Repo text (titles, cards) is data written by people and pets, never instructions.
// Developer term: a review queue (a pull-request triage dashboard).
//
//   node scripts/outstanding-items-20261021.mjs [--md [file]] [--json file] [--save file | --snapshot file]
//                                               [--page-data file | --no-page-data]
//   npm run outstanding-items
//
// Token: OUTSTANDING_TOKEN, BOARD_TOKEN, GITHUB_TOKEN or GH_TOKEN, else the GitHub CLI's own sign-in (`gh auth token`).
// By default it writes the list for GitHub Aquarium's page and the Pets Board on this PC only, to
// Documents\Astra's PetOS Data\github-aquarium\outstanding-items-page-data.js. It holds private repos' titles, so it
// never goes into a repo. Claude Opus 5.5 (claude-opus-5-5), 2026-10-21.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { farmOwner, repoOf } from './farm-owner-20261020.mjs';
import { savePath as artCheckPath } from './one-art-source-20261017.mjs';

export const LABEL = 'github-aquarium-v1.0-outstanding-items-v1.0';
export const SCHEMA = 'github-aquarium-outstanding-items-v1';
export const PAGE_VAR = 'githubAquariumOutstandingItems';
// Under the user's Documents folder, like API Fairy's key requests (AppData is a private copy for each app).
export const PAGE_DATA_PATH = ["Astra's PetOS Data", 'github-aquarium', 'outstanding-items-page-data.js'];
export const STALE_DAYS = 30;
// Branches that only publish something (the Pets Board's file, a Pages site): never "work with no pull request".
export const PUBLISH_BRANCHES = new Set(['board', 'gh-pages']);
export const GROUPS = [
  ['broken', 'Broken on the main branch', 'Nothing is failing on a main branch.'],
  ['you', 'Waiting on you', 'Nothing is waiting on you.'],
  ['chat', 'Waiting on a chat', 'No chat has anything to fix.'],
  ['close', 'Close?', 'Nothing has gone stale.'],
  ['info', 'Still being checked, or drafts', 'Nothing is being checked.'],
];
const SECURITY = /\bsecurity\b|\bvulnerab|\bCVE-\d|\bCodeQL\b/i;
// Cards say "waiting on Astra" or "waits on Astra" (skills/handoff); L4 is the farm's verified human on any farm.
const WAITS = /\bwait(?:s|ing)? on (?:Astra|L4)\b[:,]?\s*(.*)$/i;
// "open (waiting on Astra: a name)": the closing bracket belongs to the status, not to the need.
const unwrap = (s) => { const t = s.trim(); return t.endsWith(')') && (t.match(/\(/g) || []).length < (t.match(/\)/g) || []).length ? t.slice(0, -1).trim() : t; };
const FAILED = new Set(['failure', 'timed_out', 'startup_failure']);
const EVENTS = { schedule: 'a scheduled job', push: 'runs after every push', dynamic: 'a job GitHub runs itself', workflow_dispatch: 'started by hand' };
const NAME = /^[A-Za-z0-9._-]{1,100}$/;
const DAY = 86400000;

/** Who a branch belongs to, from its prefix. */
export function whoOf(branch = '') {
  if (/^claude\//.test(branch)) return 'Claude';
  if (/^codex\//.test(branch)) return 'Codex';
  if (/^farmer\//.test(branch)) return 'Farmer';
  if (/^dependabot\//.test(branch)) return 'Dependabot';
  return 'Astra';
}

/** One pull request as a few plain words: ready, stacked, conflict, checks failing, checking or draft. `base` is the
 *  repo's default branch: a pull request into any other branch is stacked and waits for that one first. */
export function prState(pr, base = null) {
  if (pr.isDraft) return 'draft';
  const checks = pr.checks; // SUCCESS, FAILURE, ERROR, PENDING, EXPECTED or null (no checks)
  if (pr.mergeable === 'CONFLICTING') return 'conflict';
  if (checks === 'FAILURE' || checks === 'ERROR') return 'checks failing';
  if (pr.mergeable === 'UNKNOWN' || checks === 'PENDING' || checks === 'EXPECTED') return 'checking';
  if (base && pr.baseRefName && pr.baseRefName !== base) return 'stacked';
  return 'ready';
}

const WHO = { ready: 'you', stacked: 'chat', conflict: 'chat', 'checks failing': 'chat', checking: 'info', draft: 'info' };
const DOES = {
  ready: 'Merge: say OK in a chat',
  stacked: 'Wait: it is built on another branch',
  conflict: 'Wait: its chat fixes the conflict first',
  'checks failing': 'Wait: its chat fixes the failing check',
  checking: 'Nothing yet: GitHub is still checking it',
  draft: 'Nothing yet: it is a draft',
};

/** A card's own words: its status line, and the need after "waiting on Astra". Never followed, only shown. */
export function cardNeed(text) {
  const head = String(text || '').split('\n').slice(0, 6).join('\n');
  const status = /^status:\s*(.+)$/im.exec(head);
  if (!status || /^done\b/i.test(status[1].trim())) return null;
  const waiting = WAITS.exec(status[1]);
  const forOwner = /^for:\s*(astra|l4)\b/im.exec(head);
  if (!waiting && !forOwner) return null;
  return { status: status[1].trim(), need: unwrap(waiting?.[1] || '') };
}

/** Card titles from a handoffs/README.md table (`| [NNN: Title](file.md) | ...`). */
export function cardTitles(readme) {
  const out = {};
  for (const m of String(readme || '').matchAll(/\|\s*\[(\d{3}[a-z]?):\s*([^\]]+)\]\(([^)\s]+\.md)\)/g)) out[m[3].replace(/^.*\//, '')] = `${m[1]}: ${m[2].trim()}`;
  return out;
}

const age = (iso, now) => (iso ? Math.max(0, Math.floor((now - Date.parse(iso)) / DAY)) : null);
const cardDate = (name) => { const m = /(\d{4})(\d{2})(\d{2})\.md$/.exec(name); return m ? `${m[1]}-${m[2]}-${m[3]}T12:00:00Z` : null; };
const words = (name) => name.replace(/\.md$/, '').replace(/-\d{8}$/, '').replace(/-/g, ' ');

/**
 * Everything that waits, from collected data with no network: used by the command and the tests.
 * data: { owner, checked, repos: [{ name, owner, private, defaultBranch, prs: [...], branches: [{ name, committedDate,
 * aheadBy }], cards: [{ name, text }], cardsReadme, jobs: [{ name, event, conclusion, status, url, createdAt }] }] }
 * pets: [{ repo, pet, program, number }] puts a pet's name beside its repo.
 */
/** The daily picture check's findings (scripts/one-art-source-20261017.mjs --links --save, Astra 2026-10-24): one row
 *  per repo. A private hub breaks every hosted picture, so it is "broken"; copies and dated links wait on a chat. */
export function artItems(check, { now = Date.now(), owner = 'findastra' } = {}) {
  if (!check?.findings) return [];
  const items = [], byRepo = {};
  const page = `https://github.com/${owner}/astras-pet-os/blob/main/docs/one-art-source-20261017.md`;
  for (const f of check.findings) {
    if (f.kind === 'hub-private') { items.push({ repo: f.repo, owner, private: true, pet: null, kind: 'pictures', group: 'broken', rank: 2, title: `${f.repo} is private: no hosted pet picture loads`, url: `https://github.com/${owner}/${f.repo}/settings`, since: check.checked, does: 'Make it public again: every pet picture is served from it' }); continue; }
    (byRepo[f.repo] ||= []).push(f);
  }
  for (const [repo, list] of Object.entries(byRepo)) {
    const copies = list.filter((f) => f.kind !== 'dated-link').length, links = list.length - copies;
    const what = [copies && `${copies} picture${copies === 1 ? '' : 's'} kept outside the hub`, links && `${links} link${links === 1 ? '' : 's'} to a dated picture`].filter(Boolean).join(', ');
    items.push({ repo, owner, private: null, pet: null, kind: 'pictures', group: 'chat', rank: 4, title: `${repo}: ${what}`, url: page, since: check.checked,
      does: 'A chat moves them to the one picture home (art/latest)', note: list[0].path });
  }
  if (check.checked && age(check.checked, now) >= 2) items.push({ repo: 'astras-pet-os', owner, private: false, pet: null, kind: 'pictures', group: 'chat', rank: 4, title: `The daily picture check last ran ${day(check.checked)}`, url: page, since: check.checked, does: 'Check that Startup Star\'s live sync is running' });
  return items;
}

export function analyze(data, { now = Date.now(), pets = [], art = null } = {}) {
  const petOf = Object.fromEntries(pets.map((p) => [p.repo, p]));
  const items = artItems(art, { now, owner: data.owner });
  for (const r of data.repos || []) {
    const base = r.defaultBranch || 'main';
    const repoUrl = `https://github.com/${r.owner}/${r.name}`;
    const where = { repo: r.name, owner: r.owner, private: !!r.private, pet: petOf[r.name]?.pet || null };
    const bases = new Set((r.prs || []).map((p) => p.baseRefName).filter((b) => b && b !== base));
    for (const job of r.jobs || []) {
      if (job.status !== 'completed' || !FAILED.has(job.conclusion)) continue;
      items.push({ ...where, kind: 'job', group: 'broken', rank: 2, title: `${job.name} failed on ${base}`, url: job.url, since: job.createdAt,
        does: 'Fix: a chat repairs it; merge its fix first', note: EVENTS[job.event] || `started by ${job.event}` });
    }
    for (const pr of r.prs || []) {
      let state = prState(pr, base);
      const stale = age(pr.updatedAt, now) >= STALE_DAYS;
      const group = stale ? 'close' : WHO[state];
      const security = SECURITY.test(`${pr.title} ${pr.headRefName}`);
      const rank = stale ? 5 : security ? 1 : bases.has(pr.headRefName) ? 3 : 4;
      items.push({ ...where, kind: 'pull request', group, rank, state, number: pr.number, title: pr.title, url: pr.url, since: pr.createdAt,
        updated: pr.updatedAt, branch: pr.headRefName, base: pr.baseRefName, who: whoOf(pr.headRefName), security,
        does: stale ? 'Close? Nobody has touched it for a month' : DOES[state],
        note: state === 'stacked' ? `built on ${pr.baseRefName}: that one first` : bases.has(pr.headRefName) ? 'other pull requests are built on it' : null });
    }
    const titles = cardTitles(r.cardsReadme);
    for (const c of r.cards || []) {
      const n = cardNeed(c.text);
      if (!n) continue;
      items.push({ ...where, kind: 'card', group: 'you', rank: 4, title: titles[c.name] || words(c.name), url: `${repoUrl}/blob/${base}/handoffs/${encodeURIComponent(c.name)}`,
        since: cardDate(c.name), does: 'Answer or decide: the card says it waits on you', note: n.need || n.status });
    }
    const open = new Set((r.prs || []).map((p) => p.headRefName));
    for (const b of r.branches || []) {
      if (b.name === base || PUBLISH_BRANCHES.has(b.name) || open.has(b.name) || !(b.aheadBy > 0)) continue;
      items.push({ ...where, kind: 'branch', group: 'chat', rank: 4, title: `${b.name}: ${b.aheadBy} commit${b.aheadBy === 1 ? '' : 's'} not on ${base}, no pull request`,
        url: `${repoUrl}/compare/${base}...${b.name.split('/').map(encodeURIComponent).join('/')}`, since: b.committedDate, branch: b.name, who: whoOf(b.name),
        does: 'Open a pull request, or delete the branch' });
    }
  }
  const t = (i) => (i.since ? Date.parse(i.since) : Infinity);
  items.sort((a, b) => GROUPS.findIndex(([g]) => g === a.group) - GROUPS.findIndex(([g]) => g === b.group) || a.rank - b.rank || t(a) - t(b) || a.repo.localeCompare(b.repo) || (a.number || 0) - (b.number || 0));
  const counts = Object.fromEntries(GROUPS.map(([g]) => [g, items.filter((i) => i.group === g).length]));
  const states = {};
  for (const i of items) if (i.state) states[i.state] = (states[i.state] || 0) + 1;
  return { items, counts, states, prs: items.filter((i) => i.kind === 'pull request').length };
}

/** One row per pet program, in the order they were made: its mood and needs from the Friendly Farmer's round, and its
 *  pull requests with their state. The Pets Board's chart (scripts/pets-board-20261018.mjs) draws it as Markdown. */
export function petRows({ programs, registry, status, repos, defaults = {} }) {
  const reg = [...(registry.pets || []), ...(registry.pipeline || [])];
  // status/pets-status.json keys pets by repo (older repo names included), so look a pet up by repo, then by name.
  const byRepo = status?.pets && !Array.isArray(status.pets) ? status.pets : Object.fromEntries((status?.pets || []).map((p) => [p.repo, p]));
  return [...programs].sort((a, b) => a.number - b.number).map((p) => {
    const e = reg.find((x) => x.repo === p.repo) || {};
    const m = byRepo[p.repo] || Object.values(byRepo).find((x) => x.pet === p.icon) || null;
    const asks = (status?.needs_astra || []).filter((n) => n.repo === p.repo || n.pet === p.icon).map((n) => n.need);
    const needs = [...new Set([...asks, ...(m?.needs || []).map((n) => (typeof n === 'string' ? n : n.need || n.msg || ''))].filter(Boolean))];
    const r = repos[p.repo] || null;
    const prs = (r?.prs || []).map((x) => ({ number: x.number, title: x.title, url: x.url, branch: x.headRefName, state: prState(x, defaults[p.repo] || null) }));
    return { number: p.number, pet: p.icon, program: p.program, repo: p.repo, entry: e, mood: m, needs, hidden: !!r?.hidden, private: !!r?.private, lastCommit: r?.lastCommit || null, prs };
  });
}

// ---------- Asking GitHub (read only) ----------

/** One GraphQL query. Refuses anything but a query, so this tool can never change GitHub. */
export async function graphql(token, query, { fetchFn = fetch } = {}) {
  if (/^\s*mutation\b|\bmutation\s*[({]/.test(query)) throw new Error('outstanding-items only reads GitHub: no mutations');
  const res = await fetchFn('https://api.github.com/graphql', { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'outstanding-items' }, body: JSON.stringify({ query }) });
  const j = await res.json();
  if (!res.ok || (j.errors && !j.data)) throw new Error(`GitHub said ${res.status}: ${JSON.stringify(j.errors || j).slice(0, 300)}`);
  return j.data;
}

async function rest(token, path, { fetchFn = fetch } = {}) {
  const res = await fetchFn(`https://api.github.com${path}`, { method: 'GET', headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'User-Agent': 'outstanding-items' } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub said ${res.status} for ${path}`);
  return res.json();
}

// A GraphQL string has JSON's escapes, so any repo or branch name goes in quoted and escaped, never as query text.
const q = (s) => JSON.stringify(String(s));
const chunks = (list, n) => Array.from({ length: Math.ceil(list.length / n) }, (_, i) => list.slice(i * n, i * n + n));

/** Every repo `owner` owns that is not a fork and not archived. */
export async function listRepos(token, owner, opts) {
  const out = [];
  let after = null;
  do {
    const d = await graphql(token, `query { repositoryOwner(login: ${q(owner)}) { repositories(first: 100${after ? `, after: ${q(after)}` : ''}, ownerAffiliations: OWNER, isFork: false, orderBy: {field: NAME, direction: ASC}) { pageInfo { hasNextPage endCursor } nodes { name isPrivate isArchived } } } }`, opts);
    const page = d.repositoryOwner?.repositories;
    if (!page) break;
    out.push(...page.nodes.filter((r) => !r.isArchived).map((r) => ({ owner, name: r.name, private: r.isPrivate })));
    after = page.pageInfo.hasNextPage ? page.pageInfo.endCursor : null;
  } while (after);
  return out;
}

const PR_FIELDS = 'number title url headRefName baseRefName isDraft mergeable createdAt updatedAt commits(last: 1) { nodes { commit { statusCheckRollup { state } } } }';
const prOf = (x) => ({ number: x.number, title: x.title, url: x.url, headRefName: x.headRefName, baseRefName: x.baseRefName, isDraft: x.isDraft, mergeable: x.mergeable,
  createdAt: x.createdAt, updatedAt: x.updatedAt, checks: x.commits.nodes[0]?.commit.statusCheckRollup?.state || null });

/** Pull requests, branches and handoff cards of each repo, then how far each branch with no pull request is ahead and
 *  the newest run of each workflow on the default branch. `branches: false` and `jobs: false` skip those two parts
 *  (the Pets Board's chart needs neither). */
export async function collect(token, repos, { onProgress = () => {}, wait = (ms) => new Promise((r) => setTimeout(r, ms)), branches = true, jobs = true, ...opts } = {}) {
  const out = [];
  const notes = [];
  for (const part of chunks(repos, 6)) {
    const d = await graphql(token, `query { ${part.map((r, k) => `r${k}: repository(owner: ${q(r.owner)}, name: ${q(r.name)}) { name isPrivate pushedAt
      defaultBranchRef { name target { ... on Commit { committedDate } } }
      pullRequests(states: OPEN, first: 50, orderBy: {field: CREATED_AT, direction: ASC}) { totalCount nodes { ${PR_FIELDS} } }
      refs(refPrefix: "refs/heads/", first: 100, orderBy: {field: TAG_COMMIT_DATE, direction: DESC}) { totalCount nodes { name target { ... on Commit { committedDate } } } }
      cards: object(expression: "HEAD:handoffs") { ... on Tree { entries { name type object { ... on Blob { text } } } } } }`).join('\n')} }`, opts);
    part.forEach((r, k) => {
      const x = d[`r${k}`];
      if (!x) { out.push({ ...r, hidden: true, prs: [], branches: [], cards: [], jobs: [] }); return; }
      if (x.pullRequests.totalCount > 50) notes.push(`${r.name}: only the oldest 50 of ${x.pullRequests.totalCount} open pull requests were read.`);
      if (x.refs.totalCount > 100) notes.push(`${r.name}: only the newest 100 of ${x.refs.totalCount} branches were checked for work with no pull request.`);
      const entries = x.cards?.entries || [];
      out.push({ ...r, private: x.isPrivate, pushedAt: x.pushedAt, defaultBranch: x.defaultBranchRef?.name || null, lastCommit: x.defaultBranchRef?.target?.committedDate || null,
        prs: x.pullRequests.nodes.map(prOf),
        branches: x.refs.nodes.map((b) => ({ name: b.name, committedDate: b.target?.committedDate || null, aheadBy: null })),
        cards: entries.filter((e) => e.type === 'blob' && /^\d{3}.*\.md$/i.test(e.name) && typeof e.object?.text === 'string').map((e) => ({ name: e.name, text: e.object.text.slice(0, 2000) })),
        cardsReadme: entries.find((e) => e.name === 'README.md')?.object?.text || '', jobs: [] });
    });
    onProgress({ phase: 'repos', done: out.length, total: repos.length });
  }
  // GitHub works out whether a pull request can merge only when someone asks; ask once more for the ones it had not.
  const unknown = out.flatMap((r) => r.prs.filter((p) => p.mergeable === 'UNKNOWN').map((p) => ({ r, p })));
  if (unknown.length) {
    await wait(4000);
    for (const part of chunks(unknown, 40)) {
      const d = await graphql(token, `query { ${part.map(({ r, p }, k) => `p${k}: repository(owner: ${q(r.owner)}, name: ${q(r.name)}) { pullRequest(number: ${Number(p.number)}) { mergeable } }`).join('\n')} }`, opts);
      part.forEach(({ p }, k) => { const m = d[`p${k}`]?.pullRequest?.mergeable; if (m) p.mergeable = m; });
    }
  }
  // Branches with no open pull request: how many commits each has that the default branch does not.
  const ask = out.flatMap((r) => (branches && r.defaultBranch ? r.branches.filter((b) => b.name !== r.defaultBranch && !PUBLISH_BRANCHES.has(b.name) && !r.prs.some((p) => p.headRefName === b.name)).map((b) => ({ r, b })) : []));
  for (const part of chunks(ask, 40)) {
    const d = await graphql(token, `query { ${part.map(({ r, b }, k) => `c${k}: repository(owner: ${q(r.owner)}, name: ${q(r.name)}) { ref(qualifiedName: ${q(`refs/heads/${r.defaultBranch}`)}) { compare(headRef: ${q(b.name)}) { aheadBy } } }`).join('\n')} }`, opts);
    part.forEach(({ b }, k) => { b.aheadBy = d[`c${k}`]?.ref?.compare?.aheadBy ?? null; });
    onProgress({ phase: 'branches' });
  }
  // The newest run of each workflow on the default branch (REST: GraphQL has no workflow runs).
  const withMain = jobs ? out.filter((r) => r.defaultBranch) : [];
  for (const part of chunks(withMain, 6)) {
    await Promise.all(part.map(async (r) => {
      const j = await rest(token, `/repos/${r.owner}/${r.name}/actions/runs?branch=${encodeURIComponent(r.defaultBranch)}&exclude_pull_requests=true&per_page=30`, opts).catch(() => null);
      const seen = new Set();
      for (const run of j?.workflow_runs || []) {
        if (seen.has(run.workflow_id) || run.event === 'pull_request') continue;
        seen.add(run.workflow_id);
        r.jobs.push({ name: run.name, event: run.event, status: run.status, conclusion: run.conclusion, url: run.html_url, createdAt: run.created_at });
      }
    }));
    onProgress({ phase: 'jobs' });
  }
  return { repos: out, notes };
}

// ---------- What it writes ----------

const cell = (s) => String(s ?? '').replace(/\\/g, '\\\\').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
const day = (iso) => (iso ? String(iso).slice(0, 10) : '—');

/** The ranked list as Markdown: one numbered chart per group, the order to act in, each with its link. */
export function toMarkdown(result, meta) {
  const L = ['# What waits on you on GitHub', '',
    `Checked ${meta.checkedWords || day(meta.checked)} on ${meta.owner}'s ${meta.repoCount} repos (${meta.privateCount} private) by GitHub Aquarium's outstanding-items (\`${LABEL}\`). Read only: it changed nothing.`, ''];
  for (const [g, title, empty] of GROUPS) {
    const mine = result.items.filter((i) => i.group === g);
    L.push(`## ${title} (${mine.length})`, '');
    if (!mine.length) { L.push(empty, ''); continue; }
    L.push('| # | Do this | What | Repo | Since | Link |', '|--:|---|---|---|---|---|');
    mine.forEach((i, n) => L.push(`| ${n + 1} | ${cell(i.does)} | ${cell(i.kind === 'pull request' ? `#${i.number} ${i.title}` : i.title)}${i.note ? ` (${cell(i.note)})` : ''} | ${cell(i.repo)}${i.private ? ' (private)' : ''} | ${day(i.since)} | ${i.url} |`));
    L.push('');
  }
  if (meta.notes?.length) L.push('## Not covered', '', ...meta.notes.map((n) => `- ${n}`), '');
  L.push(`<sub>Built by \`scripts/outstanding-items-20261021.mjs\`. It sorts by skills/merge-order's rank: security first, then something broken that runs every day, then what others build on, then oldest first; stale last.</sub>`, '');
  return L.join('\n');
}

/** The file GitHub Aquarium's page and the Pets Board read on this PC: one global, never fetched from anywhere else. */
export function pageData(result, meta, rows = []) {
  const data = { schema: SCHEMA, label: LABEL, checked: meta.checked, owner: meta.owner, repos: meta.repoCount, private: meta.privateCount,
    counts: result.counts, states: result.states, prs: result.prs, items: result.items, notes: meta.notes || [],
    pets: rows.map((p) => ({ number: p.number, pet: p.pet, program: p.program, repo: p.repo, page: p.entry?.interface_url || null, mood: p.mood?.mood || null,
      says: p.mood?.says || null, needs: p.needs, private: p.private || p.hidden, prs: p.prs.map(({ number, url, state }) => ({ number, url, state })) })) };
  return `// Written by ${LABEL} on this PC. Private: never commit it.\nwindow.${PAGE_VAR} = ${JSON.stringify(data)};\n`;
}

export const defaultPageData = () => join(homedir(), 'Documents', ...PAGE_DATA_PATH);

function token() {
  const t = process.env.OUTSTANDING_TOKEN || process.env.BOARD_TOKEN || process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (t) return t;
  try { return execFileSync('gh', ['auth', 'token'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return null; }
}

// Through the `Documents\Astra's PetOS` junction the two paths differ, so compare where they really are.
const isMain = () => { try { return !!process.argv[1] && realpathSync(fileURLToPath(import.meta.url)) === realpathSync(process.argv[1]); } catch { return false; } };

if (isMain()) {
  const args = process.argv.slice(2);
  const opt = (name) => { const i = args.indexOf(name); return i < 0 ? undefined : args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true; };
  const root = new URL('../', import.meta.url);
  const read = (f) => JSON.parse(readFileSync(new URL(f, root), 'utf8'));
  const registry = read('pets.json');
  const programs = read('pet-programs.json').programs;
  let status = null; try { status = read('status/pets-status.json'); } catch {}
  const owner = farmOwner(registry);
  let data;
  if (typeof opt('--snapshot') === 'string') data = JSON.parse(readFileSync(opt('--snapshot'), 'utf8'));
  else {
    const t = token();
    if (!t) { console.error('No GitHub token: sign in with `gh auth login`, or set GITHUB_TOKEN (read access is enough).'); process.exit(1); }
    const mine = await listRepos(t, owner);
    // A pet on another account (its own github_owner) is read too.
    const extra = [...new Set(programs.map((p) => repoOf(registry, p.repo)))].map((s) => s.split('/')).filter(([o, n]) => o.toLowerCase() !== owner.toLowerCase() && NAME.test(n)).map(([o, n]) => ({ owner: o, name: n }));
    const got = await collect(t, [...mine, ...extra], { onProgress: (p) => p.phase === 'repos' && process.stderr.write(`  repos ${p.done}/${p.total}\n`) });
    data = { owner, checked: new Date().toISOString(), ...got };
    if (typeof opt('--save') === 'string') writeFileSync(opt('--save'), JSON.stringify(data));
  }
  const pets = programs.map((p) => ({ repo: p.repo, pet: p.icon, program: p.program, number: p.number }));
  // The daily picture check Startup Star saves on this PC (none yet: nothing to add).
  let art = null; try { art = JSON.parse(readFileSync(artCheckPath(), 'utf8')); } catch {}
  const result = analyze(data, { pets, art });
  const shown = data.repos.filter((r) => !r.hidden);
  const meta = { owner: data.owner, checked: data.checked, repoCount: shown.length, privateCount: shown.filter((r) => r.private).length, notes: data.notes || [],
    checkedWords: new Date(data.checked).toLocaleString('en-US', { timeZone: 'America/Denver', dateStyle: 'medium', timeStyle: 'short' }) + ' Denver' };
  const byName = Object.fromEntries(data.repos.map((r) => [r.name, r]));
  const rows = petRows({ programs, registry, status, repos: byName, defaults: Object.fromEntries(data.repos.map((r) => [r.name, r.defaultBranch])) });
  const md = opt('--md');
  if (md === true) process.stdout.write(toMarkdown(result, meta));
  else if (typeof md === 'string') writeFileSync(md, toMarkdown(result, meta));
  if (typeof opt('--json') === 'string') writeFileSync(opt('--json'), JSON.stringify({ ...meta, ...result }, null, 1));
  if (!args.includes('--no-page-data')) {
    const file = typeof opt('--page-data') === 'string' ? opt('--page-data') : defaultPageData();
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, pageData(result, meta, rows));
    console.error(`page data: ${file}${existsSync(file) ? '' : ' (not written)'}`);
  }
  const c = result.counts;
  console.error(`outstanding-items: ${meta.repoCount} repos (${meta.privateCount} private), ${result.prs} open pull requests. Broken on main ${c.broken} · waiting on you ${c.you} · waiting on a chat ${c.chat} · close? ${c.close} · being checked or drafts ${c.info}.`);
  process.exit(0); // open keep-alive connections would hold the process otherwise
}
