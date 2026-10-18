// Flash Audit A58, One art source: every pet picture lives only in this hub's art/ and desktop-art/.
// Read-only. Claude Opus 5.5 (claude-opus-5-5), 2026-10-17, for Astra (docs/one-art-source-20261017.md).
//
// Lists every picture in every findastra repo that is a copy of a hub file (same bytes, by git blob hash) or looks
// like pet art kept outside the hub, and checks the desktop pets' local draft list. Correct when the only copies left
// are the written exceptions.
//
//   GITHUB_TOKEN=... node scripts/one-art-source-20261017.mjs                 every repo's default branch
//   node scripts/one-art-source-20261017.mjs --branch claude/one-art-source-20261017   that branch where a repo has it
//   node scripts/one-art-source-20261017.mjs --trees trees.json               offline: { repo: { private, ref, files: [{ path, sha }] } }
//   node scripts/one-art-source-20261017.mjs --drafts <desktop-drafts.json>   check another draft list (default: this hub's)
//   add --json for machine-readable output
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const OWNER = 'findastra';
export const HUB = 'astras-pet-os';
export const HUB_RAW = `https://raw.githubusercontent.com/${OWNER}/${HUB}/main/`;
const IMG = /\.(png|webp|gif|jpe?g|svg|ico|bmp)$/i;
const MOOD = /^(bug-)?(idle|blink|happy|curious|worried|sad|sick|alarmed|sleep|neutral|shocked|sleeping|unwell)(-\d{8})?\.png$/;
const PET_DIR = /(^|\/)(pet-art|desktop-art|draft-art)\/|^art\/(frames|sheets|pets|icons|drafts|app-icons)\/|^art\/[^/]+\.png$/;
const APP_ICON = /(^|\/)(icon(-\d{8})?|[\w-]+-icon-\d{8}|fairy)\.(png|ico)$/;
// Pictures that are not pictures of a pet: program screenshots (A55), worlds, avatars, site art.
const NOT_PET = /^(Assets|docs|socials|public|diagrams|3d|legacy)\/|\/public\/|^art\/(projects|worlds|avatars|lettering|banner|procreate-export)\//;
// The Fuzzbois art project is its own program; only its 32 layers are Fuzzboi Friend's pictures (now in the hub).
const PROJECT_ART = { fuzzbois: (path) => !path.startsWith('site/layers/') };

/** Written exceptions (Flash Audit A58). */
export const EXCEPTIONS = [
  { repo: 'claude-bot', why: "Claude Bot's exact copy of ChatGPT's BSOD may not be public: it lives only in his private repo (Astra, 2026-10-17). The hub keeps the earlier orange-screen twin icon." },
];

/** Classify one non-hub repo's files against the hub's picture hashes. */
export function classify(repo, files, hubBySha) {
  const found = [];
  for (const f of files) {
    if (!IMG.test(f.path)) continue;
    const hub = hubBySha.get(f.sha);
    const name = f.path.split('/').pop();
    if (hub) { found.push({ repo, path: f.path, kind: 'copy', hub: hub[0] }); continue; }
    if (NOT_PET.test(f.path) || PROJECT_ART[repo]?.(f.path)) continue;
    if (repo === 'fuzzbois' || PET_DIR.test(f.path) || MOOD.test(name) || APP_ICON.test(f.path)) found.push({ repo, path: f.path, kind: 'pet-art-outside-hub', hub: null });
  }
  return found;
}

/** Check the desktop pets' draft list: hub-relative paths only, apart from a written exception marked private. */
export function checkDrafts(list) {
  const problems = [];
  for (const p of list?.pets || []) {
    const paths = [p.idle, p.blink, ...(p.variants || []).flatMap((v) => v.layers || [])].filter(Boolean);
    const outside = paths.filter((x) => /^[A-Za-z]:[\\/]|^[\\/]|\.\.[\\/]/.test(x));
    if (!outside.length) continue;
    if (p.private === true && EXCEPTIONS.some((e) => e.repo === p.id)) continue;
    problems.push({ id: p.id, outside: outside.length, example: outside[0] });
  }
  return problems;
}

export function audit(trees, drafts) {
  const hub = trees[HUB];
  if (!hub) throw new Error(`No tree for ${HUB}`);
  const hubBySha = new Map();
  // Pet pictures only: the hub's screenshots and System Map renders (docs/) may be shown elsewhere.
  for (const f of hub.files) if (IMG.test(f.path) && /^(art|desktop-art)\//.test(f.path)) { if (!hubBySha.has(f.sha)) hubBySha.set(f.sha, []); hubBySha.get(f.sha).push(f.path); }
  const findings = [], exceptions = [];
  for (const [repo, t] of Object.entries(trees)) {
    if (repo === HUB || !t.files) continue;
    const found = classify(repo, t.files, hubBySha);
    if (!found.length) continue;
    if (EXCEPTIONS.some((e) => e.repo === repo)) exceptions.push({ repo, count: found.length });
    else findings.push(...found);
  }
  const draftProblems = drafts ? checkDrafts(drafts) : null;
  const ok = findings.length === 0 && (!draftProblems || draftProblems.length === 0);
  return { verdict: ok ? 'Correct' : 'Incorrect', findings, exceptions, draftProblems };
}

async function gh(path, token) {
  const r = await fetch(`https://api.github.com${path}`, { headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'one-art-source', ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`GitHub ${r.status} for ${path}`);
  return r.json();
}

async function fetchTrees(branch, token) {
  const repos = [];
  for (let page = 1; ; page++) {
    const batch = await gh(`/users/${OWNER}/repos?type=owner&per_page=100&page=${page}`, token);
    if (!batch?.length) break;
    repos.push(...batch);
  }
  // A token for the account also lists its private repos.
  if (token) for (let page = 1; ; page++) {
    const batch = await gh(`/user/repos?affiliation=owner&per_page=100&page=${page}`, token);
    if (!batch?.length) break;
    for (const r of batch) if (r.owner?.login === OWNER && !repos.some((x) => x.name === r.name)) repos.push(r);
  }
  const trees = {};
  for (const r of repos) {
    let ref = r.default_branch, t = null;
    if (branch) { t = await gh(`/repos/${OWNER}/${r.name}/git/trees/${encodeURIComponent(branch)}?recursive=1`, token); if (t) ref = branch; }
    if (!t) t = await gh(`/repos/${OWNER}/${r.name}/git/trees/${encodeURIComponent(r.default_branch)}?recursive=1`, token);
    if (!t) continue;
    trees[r.name] = { private: r.private, ref, truncated: t.truncated, files: t.tree.filter((e) => e.type === 'blob').map((e) => ({ path: e.path, sha: e.sha })) };
  }
  return trees;
}

function arg(name) { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : null; }

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const readJson = (file) => JSON.parse(readFileSync(file, 'utf8').replace(/^﻿/, ''));   // PowerShell writes a BOM
  const treesFile = arg('--trees');
  const trees = treesFile ? readJson(treesFile) : await fetchTrees(arg('--branch'), process.env.GITHUB_TOKEN);
  // The draft list lives in this hub since 2026-10-18; an older one in %LOCALAPPDATA% is checked only if the hub has none.
  const hubList = fileURLToPath(new URL('../desktop-art/desktop-drafts-20261018.json', import.meta.url));
  const draftsFile = arg('--drafts') || (existsSync(hubList) ? hubList : process.env.LOCALAPPDATA && join(process.env.LOCALAPPDATA, 'astras-pet-apps', 'desktop-drafts-20261011.json'));
  const drafts = draftsFile && existsSync(draftsFile) ? readJson(draftsFile) : null;
  const result = audit(trees, drafts);
  if (process.argv.includes('--json')) console.log(JSON.stringify(result, null, 1));
  else {
    console.log(`A58 One art source: ${result.verdict}`);
    console.log(`Repos read: ${Object.keys(trees).length}${arg('--branch') ? ` (branch ${arg('--branch')} where it exists)` : ''}`);
    const by = {};
    for (const f of result.findings) (by[f.repo] ||= []).push(f);
    for (const [repo, list] of Object.entries(by)) {
      console.log(`\n${repo} (${trees[repo].ref}): ${list.length}`);
      for (const f of list.slice(0, 12)) console.log(`  ${f.kind === 'copy' ? 'copy of hub ' + f.hub : 'pet art outside the hub'}: ${f.path}`);
      if (list.length > 12) console.log(`  ... and ${list.length - 12} more`);
    }
    for (const e of result.exceptions) console.log(`\nException, written down: ${e.repo} keeps ${e.count} pictures. ${EXCEPTIONS.find((x) => x.repo === e.repo).why}`);
    if (result.draftProblems === null) console.log('\nDesktop draft list: not on this PC, not checked.');
    else if (!result.draftProblems.length) console.log('\nDesktop draft list: every picture is in the hub (Claude Bot excepted).');
    else for (const d of result.draftProblems) console.log(`\nDesktop draft list: ${d.id} reads ${d.outside} file(s) outside the hub, e.g. ${d.example}`);
  }
  process.exitCode = result.verdict === 'Correct' ? 0 : 1;
}
