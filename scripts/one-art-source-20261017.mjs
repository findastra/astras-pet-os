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
//
// One home for every pet picture (Astra, 2026-10-24, all recommended; docs/one-art-source-20261017.md, "Addresses that
// never change"): the hub must stay public, since every hosted picture stops loading while it is private; and with
// --links every text file in every repo is read for links to a dated hub picture that should name art/latest instead
// (scripts/one-picture-home-20261024.mjs). --save writes the result where GitHub Aquarium's outstanding items read it,
// on this PC only (it names private repos): Documents\Astra's PetOS Data\one-art-source\one-art-source-check.json.
//   node scripts/one-art-source-20261017.mjs --links --save          the daily check Startup Star runs
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { datedLinks, latestPlan } from './one-picture-home-20261024.mjs';

// Astra-only on purpose (card 058, Part 3, 2026-10-20): every pet picture lives in Astra's PetOS itself (findastra/astras-pet-os, upstream), and this check (Flash Audit A58) reads every repo on her account. It keeps her account, findastra, and never reads a farm's pets.json github_owner.
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
// The repo is fuzzboi-factory since 2026-10-17 (hub #36); its README picture is the project's own art.
// Spoonfed is an Expo phone app: its spoon logo in assets/ is the app's brand icon, which its build reads from the app
// folder, not a picture of Spoonfed Sugarcube (2026-10-24).
const fuzzArt = (path) => !path.startsWith('site/layers/');
const PROJECT_ART = { fuzzbois: fuzzArt, 'fuzzboi-factory': fuzzArt, spoonfed: (path) => path.startsWith('assets/') };

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
    if (PROJECT_ART[repo] === fuzzArt || PET_DIR.test(f.path) || MOOD.test(name) || APP_ICON.test(f.path)) found.push({ repo, path: f.path, kind: 'pet-art-outside-hub', hub: null });
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

// Where --save puts the result, under Documents like the outstanding items (AppData is a private copy for each app).
export const SAVE_PATH = ["Astra's PetOS Data", 'one-art-source', 'one-art-source-check.json'];
export const savePath = () => join(homedir(), 'Documents', ...SAVE_PATH);
// Text files that may link a picture: pages, scripts, Markdown, JSON.
const TEXT = /\.(md|json|html?|js|mjs|cjs|css|cs|ps1|py|ts|tsx|vue|ya?ml)$/i;
export const HUB_RECORDS = /^(changes|handoffs|docs|test)\//;
export const isLinkFile =(f) => TEXT.test(f.path) && !/(^|\/)(node_modules|vendor|dist)\/|package-lock\.json$/.test(f.path) && !(f.size > 400000);

/** Links to dated hub pictures in one repo's text files ({ path: text }), as findings. */
export function linkFindings(repo, texts, plan) {
  const found = [];
  for (const [path, text] of Object.entries(texts)) for (const l of datedLinks(text, plan)) found.push({ repo, path, kind: 'dated-link', hub: l.from, to: l.to });
  return found;
}

export function audit(trees, drafts) {
  const hub = trees[HUB];
  if (!hub) throw new Error(`No tree for ${HUB}`);
  const plan = latestPlan(hub.files.map((f) => f.path));
  const hubBySha = new Map();
  // Pet pictures only: the hub's screenshots and System Map renders (docs/) may be shown elsewhere.
  for (const f of hub.files) if (IMG.test(f.path) && /^(art|desktop-art)\//.test(f.path)) { if (!hubBySha.has(f.sha)) hubBySha.set(f.sha, []); hubBySha.get(f.sha).push(f.path); }
  const findings = [], exceptions = [];
  for (const [repo, t] of Object.entries(trees)) {
    if (!t.files) continue;
    // The hub's own pages and notes link pictures too: they must name art/latest like everyone else.
    if (repo !== HUB) {
      const found = classify(repo, t.files, hubBySha);
      if (found.length && EXCEPTIONS.some((e) => e.repo === repo)) exceptions.push({ repo, count: found.length });
      else findings.push(...found);
    }
    // The hub's records (changes/, handoffs/, docs/) say what a page showed on their day, and its tests hold examples:
    // they keep their dated links.
    const texts = repo === HUB ? Object.fromEntries(Object.entries(t.texts || {}).filter(([p]) => !HUB_RECORDS.test(p))) : t.texts;
    if (texts) findings.push(...linkFindings(repo, texts, plan));
  }
  // Raw addresses and the hub's site answer 404 while the hub is private (2026-10-20 to 2026-10-21): it stays public.
  if (hub.private === true) findings.unshift({ repo: HUB, path: '', kind: 'hub-private', hub: null });
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

/** Every text file of every repo that names the hub, read for --links. A file's bytes never change under its git hash,
 *  so `cache` ({ sha: text, or '' when it never names the hub }) keeps what earlier runs read: the first run reads a few
 *  thousand files (most of an hour's GitHub allowance), a daily run only the files that changed since. */
export async function fetchTexts(trees, token, cache = {}, get = gh) {
  let read = 0;
  for (const [repo, t] of Object.entries(trees)) {
    t.texts = {};
    for (const f of t.files.filter(isLinkFile)) {
      if (!(f.sha in cache)) {
        const b = await get(`/repos/${OWNER}/${repo}/git/blobs/${f.sha}`, token);
        const text = b?.content ? Buffer.from(b.content, 'base64').toString('utf8') : '';
        cache[f.sha] = text.includes(HUB) ? text : '';
        read++;
      }
      if (cache[f.sha]) t.texts[f.path] = cache[f.sha];
    }
  }
  return read;
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
    trees[r.name] = { private: r.private, ref, truncated: t.truncated, files: t.tree.filter((e) => e.type === 'blob').map((e) => ({ path: e.path, sha: e.sha, size: e.size })) };
  }
  return trees;
}

/** One finding in plain words, for the console and the outstanding items. */
export function describe(f) {
  if (f.kind === 'hub-private') return `${HUB} is private: no hosted picture loads until it is public again`;
  if (f.kind === 'dated-link') return `${f.path} links a dated picture: ${f.hub.split('/').slice(-3).join('/')} (should be ${f.to.split('/').slice(-3).join('/')})`;
  return `${f.kind === 'copy' ? 'copy of hub ' + f.hub : 'pet art outside the hub'}: ${f.path}`;
}

function arg(name) { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : null; }

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const readJson = (file) => JSON.parse(readFileSync(file, 'utf8').replace(/^﻿/, ''));   // PowerShell writes a BOM
  const treesFile = arg('--trees');
  // The daily check on Astra's PC has no GITHUB_TOKEN: it uses the GitHub CLI's own sign-in, as the outstanding items do.
  let token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (!token && !treesFile) try { token = execFileSync('gh', ['auth', 'token'], { encoding: 'utf8' }).trim(); } catch { token = undefined; }
  const trees = treesFile ? readJson(treesFile) : await fetchTrees(arg('--branch'), token);
  // With --save, the files read are remembered beside the result (on this PC only: it holds private repos' text).
  const saveTo = process.argv.includes('--save') ? (arg('--save') && !arg('--save').startsWith('--') ? arg('--save') : savePath()) : null;
  if (process.argv.includes('--links') && !treesFile) {
    const cacheFile = saveTo && join(dirname(saveTo), 'one-art-source-text-cache.json');
    let cache = {}; try { if (cacheFile) cache = readJson(cacheFile); } catch { cache = {}; }
    const read = await fetchTexts(trees, token, cache);
    if (cacheFile) {
      // Keep only files some repo still has, so the cache never grows past today's repos.
      const live = new Set(Object.values(trees).flatMap((t) => t.files.map((f) => f.sha)));
      mkdirSync(dirname(cacheFile), { recursive: true });
      writeFileSync(cacheFile, JSON.stringify(Object.fromEntries(Object.entries(cache).filter(([sha]) => live.has(sha)))));
    }
    console.error(`Links: read ${read} text file(s) from GitHub; the rest were remembered.`);
  }
  // The draft list lives in this hub since 2026-10-18; an older one in %LOCALAPPDATA% is checked only if the hub has none.
  const hubList = fileURLToPath(new URL('../desktop-art/desktop-drafts-20261018.json', import.meta.url));
  const draftsFile = arg('--drafts') || (existsSync(hubList) ? hubList : process.env.LOCALAPPDATA && join(process.env.LOCALAPPDATA, 'astras-pet-apps', 'desktop-drafts-20261011.json'));
  const drafts = draftsFile && existsSync(draftsFile) ? readJson(draftsFile) : null;
  const result = audit(trees, drafts);
  if (saveTo) {
    mkdirSync(dirname(saveTo), { recursive: true });
    writeFileSync(saveTo, JSON.stringify({ checked: new Date().toISOString(), links: process.argv.includes('--links'), repos: Object.keys(trees).length, ...result }, null, 1) + '\n');
  }
  if (process.argv.includes('--json')) console.log(JSON.stringify(result, null, 1));
  else {
    console.log(`A58 One art source: ${result.verdict}`);
    console.log(`Repos read: ${Object.keys(trees).length}${arg('--branch') ? ` (branch ${arg('--branch')} where it exists)` : ''}`);
    const by = {};
    for (const f of result.findings) (by[f.repo] ||= []).push(f);
    for (const [repo, list] of Object.entries(by)) {
      console.log(`\n${repo} (${trees[repo].ref}): ${list.length}`);
      for (const f of list.slice(0, 12)) console.log(`  ${describe(f)}`);
      if (list.length > 12) console.log(`  ... and ${list.length - 12} more`);
    }
    for (const e of result.exceptions) console.log(`\nException, written down: ${e.repo} keeps ${e.count} pictures. ${EXCEPTIONS.find((x) => x.repo === e.repo).why}`);
    if (result.draftProblems === null) console.log('\nDesktop draft list: not on this PC, not checked.');
    else if (!result.draftProblems.length) console.log('\nDesktop draft list: every picture is in the hub (Claude Bot excepted).');
    else for (const d of result.draftProblems) console.log(`\nDesktop draft list: ${d.id} reads ${d.outside} file(s) outside the hub, e.g. ${d.example}`);
  }
  process.exitCode = result.verdict === 'Correct' ? 0 : 1;
}
