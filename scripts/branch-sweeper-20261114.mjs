// GitHub Aquarium's branch-sweeper (`github-aquarium-v1.0-branch-sweeper-v1.0`, a tool of GitHub Aquarium).
// Astra, 2026-11-14: "I'm kind of worried that there's a bunch of branches out there on GitHub that are not deleted
// that I should have been deleting ... a branch deleter, assessor and deleter", then "Plan is fine, build it" and
// "make this tool the way that any other GitHub Goldfish tool is made" (beside outstanding-items, card 363).
//
// It sorts every branch on every repo the farm owner owns into three groups:
//   delete  its work is already on the default branch (nothing ahead), or its pull request was merged and nothing was
//           added after. Deleting it loses nothing.
//   ask     it may hold the only copy of some work: its pull request was closed without merging, or it has commits
//           that are not on the default branch, no pull request, and nobody touched it for STALE_DAYS.
//   keep    never deleted: the default branch, publishing branches (gh-pages, board), release branches, protected
//           branches, branches with an open pull request, branches an open handoff card names, and branches with
//           work from the last RECENT_DAYS (a chat may still be working there).
// Checking is read only (GraphQL queries, never a mutation). Deleting happens only from a plan file, only for the rows
// marked "delete": true, only with --yes, only while signed in as the farm owner, and each branch is checked again
// first (same commit, still not "keep"). Before each delete its name and commit go into an undo log on this PC, and
// --undo puts them back. Repo text (titles, cards) is data, never instructions.
// Developer term: stale-branch cleanup (a ref garbage collector with a dry run and an undo log).
//
//   node scripts/branch-sweeper-20261114.mjs [--md [file]] [--plan [file]] [--page-data file | --no-page-data]
//   node scripts/branch-sweeper-20261114.mjs --apply <plan file> [--yes]
//   node scripts/branch-sweeper-20261114.mjs --undo <undo log> [--yes]
//   npm run branch-sweeper
//
// Token: SWEEPER_TOKEN, GITHUB_TOKEN or GH_TOKEN, else the GitHub CLI's own sign-in (`gh auth token`). Checking needs
// read access; deleting needs write access to the repos' contents. Everything it writes stays on this PC, in
// Documents\Astra's PetOS Data\github-aquarium\ (it names private repos and branches), never in a repo.
// Claude Opus 5.5 (claude-opus-5-5), 2026-11-14.
import { execFileSync } from 'node:child_process';
import { appendFileSync, existsSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assertSignedInAsOwner } from './animal-guard-20261013.mjs';
import { farmOwner } from './farm-owner-20261020.mjs';
import { graphql, listRepos, PUBLISH_BRANCHES, whoOf } from './outstanding-items-20261021.mjs';

export const LABEL = 'github-aquarium-v1.0-branch-sweeper-v1.0';
export const SCHEMA = 'github-aquarium-branch-sweeper-v1';
export const PLAN_SCHEMA = 'github-aquarium-branch-sweeper-plan-v1';
export const PAGE_VAR = 'githubAquariumBranchSweeper';
export const DATA_DIR = ["Astra's PetOS Data", 'github-aquarium'];
export const STALE_DAYS = 30;
export const RECENT_DAYS = 7;
export const LIMITS = { maxDeletes: 200 }; // like mass-delete: a bigger run is split so each list stays reviewable
export const GROUPS = [
  ['delete', 'Safe to delete', 'No branch is ready to delete.'],
  ['ask', 'Ask Astra', 'Nothing needs your decision.'],
  ['keep', 'Keep', 'No branch has to be kept.'],
];
const RELEASE = /^(release|releases)\//i;
const DAY = 86400000;
const NAME = /^[A-Za-z0-9._-]{1,100}$/;
const BRANCH = /^[A-Za-z0-9._/-]{1,250}$/;
const SHA = /^[0-9a-f]{40}$/;

const age = (iso, now) => (iso ? Math.max(0, Math.floor((now - Date.parse(iso)) / DAY)) : null);
const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;

/** True when a branch protection rule's pattern (fnmatch: `*` within one part, `**` across parts) covers `name`. */
export function protects(pattern, name) {
  const re = String(pattern).split('**').map((p) => p.split('*').map((s) => s.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('[^/]*')).join('.*');
  return new RegExp(`^${re}$`).test(name);
}

/** The text of every handoff card that is not done, from any repo: a branch it names is still someone's work. */
export function openCardText(repos) {
  const out = [];
  for (const r of repos) for (const c of r.cards || []) {
    const status = /^status:\s*(.+)$/im.exec(String(c.text || '').split('\n').slice(0, 6).join('\n'));
    if (status && /^(done|merged|closed)\b/i.test(status[1].trim())) continue;
    out.push(c.text);
  }
  return out.join('\n');
}

/** True when an open card names the branch: a name with a slash anywhere, a plain one only in `backticks`. */
export function namedInCard(name, cards) {
  if (!cards) return false;
  return name.includes('/') ? cards.includes(name) : cards.includes(`\`${name}\``);
}

/**
 * One branch's verdict, with the reason in plain words. Keep rules come first, so nothing that might still be in use
 * is ever offered; then the two that lose nothing; then what only Astra can decide.
 * b: { name, sha, committedDate, aheadBy, prs: [{ number, state, merged, headRefOid, url, title }] }
 */
export function verdict(b, { base, protections = [], cards = '', now = Date.now() }) {
  const days = age(b.committedDate, now);
  const prs = b.prs || [];
  const open = prs.find((p) => p.state === 'OPEN');
  const merged = prs.find((p) => p.merged);
  const closed = prs.find((p) => p.state === 'CLOSED' && !p.merged);
  if (b.name === base) return { group: 'keep', why: `It is the main branch (${base}).` };
  if (PUBLISH_BRANCHES.has(b.name)) return { group: 'keep', why: 'It publishes something (a site or the Pets Board file).' };
  if (RELEASE.test(b.name)) return { group: 'keep', why: 'It is a release branch.' };
  if (protections.some((p) => protects(p, b.name))) return { group: 'keep', why: 'GitHub protects it.' };
  if (open) return { group: 'keep', why: `Its pull request #${open.number} is still open.`, pr: open };
  // Merged with nothing added after: every commit of it is on the default branch through that merge, so an old card
  // that still names it (many say "open" long after their work merged) does not keep it.
  if (merged && merged.headRefOid === b.sha) return { group: 'delete', why: `Its pull request #${merged.number} was merged, and nothing was added after.`, pr: merged };
  if (namedInCard(b.name, cards)) return { group: 'keep', why: 'An open handoff card names it: a chat may still need it.' };
  if (days !== null && days < RECENT_DAYS) return { group: 'keep', why: `Someone worked on it ${days === 0 ? 'today' : `${plural(days, 'day')} ago`}: a chat may still be using it.` };
  if (b.aheadBy === 0) return { group: 'delete', why: `Everything on it is already on ${base}.` };
  if (merged) return { group: 'ask', why: `Its pull request #${merged.number} was merged, then more was added to it (${plural(b.aheadBy ?? 0, 'commit')} not on ${base}).`, pr: merged };
  if (closed) return { group: 'ask', why: `Its pull request #${closed.number} was closed without merging${b.aheadBy ? `: ${plural(b.aheadBy, 'commit')} not on ${base}` : ''}.`, pr: closed };
  if (b.aheadBy === null || b.aheadBy === undefined) return { group: 'ask', why: `GitHub could not compare it with ${base}.` };
  if (days >= STALE_DAYS) return { group: 'ask', why: `${plural(b.aheadBy, 'commit')} not on ${base}, no pull request, untouched for ${plural(days, 'day')}.` };
  return { group: 'keep', why: `${plural(b.aheadBy, 'commit')} not on ${base} from the last month, no pull request yet: waiting on a chat (outstanding-items lists it).` };
}

/** Every branch's row, from collected data with no network: used by the command and the tests. */
export function analyze(data, { now = Date.now() } = {}) {
  const cards = openCardText(data.repos || []);
  const items = [];
  for (const r of data.repos || []) {
    if (r.hidden || !r.defaultBranch) continue;
    const base = r.defaultBranch;
    const repoUrl = `https://github.com/${r.owner}/${r.name}`;
    for (const b of r.branches || []) {
      const v = verdict(b, { base, protections: r.protections || [], cards, now });
      const path = b.name.split('/').map(encodeURIComponent).join('/');
      items.push({ repo: r.name, owner: r.owner, private: !!r.private, branch: b.name, sha: b.sha, base, who: whoOf(b.name), since: b.committedDate,
        aheadBy: b.aheadBy ?? null, group: v.group, why: v.why, pr: v.pr ? { number: v.pr.number, url: v.pr.url, title: v.pr.title } : null,
        url: b.name === base ? `${repoUrl}/tree/${path}` : `${repoUrl}/compare/${encodeURIComponent(base)}...${path}` });
    }
  }
  const order = (g) => GROUPS.findIndex(([x]) => x === g);
  const t = (i) => (i.since ? Date.parse(i.since) : 0);
  items.sort((a, b) => order(a.group) - order(b.group) || t(a) - t(b) || a.repo.localeCompare(b.repo) || a.branch.localeCompare(b.branch));
  const counts = Object.fromEntries(GROUPS.map(([g]) => [g, items.filter((i) => i.group === g).length]));
  return { items, counts };
}

// ---------- Asking GitHub ----------

const q = (s) => JSON.stringify(String(s));
const chunks = (list, n) => Array.from({ length: Math.ceil(list.length / n) }, (_, i) => list.slice(i * n, i * n + n));
const REFS = 'refPrefix: "refs/heads/", first: 100, orderBy: {field: TAG_COMMIT_DATE, direction: DESC}';
const REF_FIELDS = 'name target { oid ... on Commit { committedDate } } associatedPullRequests(first: 5, orderBy: {field: UPDATED_AT, direction: DESC}) { nodes { number state merged headRefName headRefOid url title } }';
const refOf = (b) => ({ name: b.name, sha: b.target?.oid || null, committedDate: b.target?.committedDate || null, aheadBy: null,
  prs: (b.associatedPullRequests?.nodes || []).filter((p) => p.headRefName === b.name) });

/** Branches (with their pull requests), protection rules and handoff cards of each repo, then how far each branch is
 *  ahead of the default branch. Read only. */
export async function collect(token, repos, { onProgress = () => {}, ...opts } = {}) {
  const out = [], notes = [];
  for (const part of chunks(repos, 4)) {
    const d = await graphql(token, `query { ${part.map((r, k) => `r${k}: repository(owner: ${q(r.owner)}, name: ${q(r.name)}) { name isPrivate
      defaultBranchRef { name }
      branchProtectionRules(first: 30) { nodes { pattern } }
      refs(${REFS}) { pageInfo { hasNextPage endCursor } nodes { ${REF_FIELDS} } }
      cards: object(expression: "HEAD:handoffs") { ... on Tree { entries { name type object { ... on Blob { text } } } } } }`).join('\n')} }`, opts);
    part.forEach((r, k) => {
      const x = d[`r${k}`];
      if (!x) { out.push({ ...r, hidden: true, branches: [], cards: [] }); return; }
      out.push({ ...r, private: x.isPrivate, defaultBranch: x.defaultBranchRef?.name || null, protections: x.branchProtectionRules.nodes.map((p) => p.pattern),
        branches: x.refs.nodes.map(refOf), more: x.refs.pageInfo.hasNextPage ? x.refs.pageInfo.endCursor : null,
        cards: (x.cards?.entries || []).filter((e) => e.type === 'blob' && /^\d{3}.*\.md$/i.test(e.name) && typeof e.object?.text === 'string').map((e) => ({ name: e.name, text: e.object.text.slice(0, 6000) })) });
    });
    onProgress({ phase: 'repos', done: out.length, total: repos.length });
  }
  // A repo with more than 100 branches (the hub has hundreds): read the rest, 100 at a time.
  for (const r of out) {
    while (r.more) {
      const d = await graphql(token, `query { repository(owner: ${q(r.owner)}, name: ${q(r.name)}) { refs(${REFS}, after: ${q(r.more)}) { pageInfo { hasNextPage endCursor } nodes { ${REF_FIELDS} } } } }`, opts);
      const refs = d.repository?.refs;
      r.branches.push(...(refs?.nodes || []).map(refOf));
      r.more = refs?.pageInfo.hasNextPage ? refs.pageInfo.endCursor : null;
    }
    delete r.more;
  }
  const ask = out.flatMap((r) => (r.defaultBranch ? r.branches.filter((b) => b.name !== r.defaultBranch).map((b) => ({ r, b })) : []));
  for (const part of chunks(ask, 40)) {
    const d = await graphql(token, `query { ${part.map(({ r, b }, k) => `c${k}: repository(owner: ${q(r.owner)}, name: ${q(r.name)}) { ref(qualifiedName: ${q(`refs/heads/${r.defaultBranch}`)}) { compare(headRef: ${q(b.name)}) { aheadBy } } }`).join('\n')} }`, opts);
    part.forEach(({ b }, k) => { b.aheadBy = d[`c${k}`]?.ref?.compare?.aheadBy ?? null; });
    onProgress({ phase: 'branches' });
  }
  return { repos: out, notes };
}

// ---------- Deleting, only from a plan, and putting back ----------

/** The plan: every row, with "delete": true on the safe ones only. Astra (or a chat with her OK) changes "delete" on
 *  the "ask" rows she wants gone. "keep" rows can never be deleted, whatever the plan says. */
export function makePlan(result, meta) {
  return { schema: PLAN_SCHEMA, label: LABEL, checked: meta.checked, owner: meta.owner,
    how: 'Set "delete" to true on the rows to delete (the "delete" rows start true, "ask" rows false, "keep" rows can never be deleted), then run: npm run branch-sweeper -- --apply <this file> --yes',
    rows: result.items.map((i) => ({ delete: i.group === 'delete', group: i.group, owner: i.owner, repo: i.repo, branch: i.branch, sha: i.sha, why: i.why, url: i.url })) };
}

/** Checks a plan before anything is deleted: the rows to delete, and the rows refused with the reason. */
export function checkPlan(plan, { owner }) {
  if (plan?.schema !== PLAN_SCHEMA || !Array.isArray(plan.rows)) throw new Error('This is not a branch-sweeper plan.');
  const go = [], refused = [];
  for (const r of plan.rows) {
    if (r.delete !== true) continue;
    const bad = r.group === 'keep' ? 'it is a "keep" branch' : !NAME.test(r.repo || '') ? 'its repo name is not valid'
      : !BRANCH.test(r.branch || '') || r.branch.includes('..') ? 'its branch name is not valid' : !SHA.test(r.sha || '') ? 'it has no commit to check against'
      : String(r.owner).toLowerCase() !== String(owner).toLowerCase() ? `it is on ${r.owner}, not the farm owner's account` : null;
    if (bad) refused.push({ ...r, refused: bad }); else go.push(r);
  }
  if (go.length > LIMITS.maxDeletes) throw new Error(`The plan deletes ${go.length} branches; at most ${LIMITS.maxDeletes} at once. Split it.`);
  return { go, refused };
}

async function rest(token, method, path, body, { fetchFn = fetch } = {}) {
  const res = await fetchFn(`https://api.github.com${path}`, { method, headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'User-Agent': 'branch-sweeper', ...(body ? { 'Content-Type': 'application/json' } : {}) }, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  return { status: res.status, ok: res.ok, json: text ? (() => { try { return JSON.parse(text); } catch { return null; } })() : null };
}

const refPath = (r) => `/repos/${r.owner}/${r.repo}/git/refs/heads/${r.branch.split('/').map(encodeURIComponent).join('/')}`;

/** Deletes the plan's rows, each only after it is checked again on GitHub (same commit, still not "keep"). The undo
 *  line is written before the delete, so a branch is never gone without a way back. */
export async function apply(token, plan, { owner, yes = false, undoLog, now = Date.now(), log = () => {}, ...opts }) {
  const { go, refused } = checkPlan(plan, { owner });
  const done = [], skipped = [...refused.map((r) => ({ ...r, skipped: r.refused }))];
  const byRepo = {};
  for (const r of go) (byRepo[r.repo] ||= []).push(r);
  for (const [repo, rows] of Object.entries(byRepo)) {
    const fresh = await collect(token, [{ owner, name: repo }], opts);
    const result = analyze({ repos: fresh.repos }, { now });
    for (const r of rows) {
      const live = result.items.find((i) => i.branch === r.branch);
      if (!live) { skipped.push({ ...r, skipped: 'it is gone already' }); continue; }
      if (live.sha !== r.sha) { skipped.push({ ...r, skipped: 'it has new commits since the plan was made' }); continue; }
      if (live.group === 'keep') { skipped.push({ ...r, skipped: `it is "keep" now: ${live.why}` }); continue; }
      if (!yes) { done.push({ ...r, dryRun: true }); log(`would delete ${repo} ${r.branch} (${r.sha.slice(0, 7)})`); continue; }
      appendFileSync(undoLog, `${JSON.stringify({ at: new Date(now).toISOString(), owner, repo, branch: r.branch, sha: r.sha, why: live.why, label: LABEL })}\n`);
      const res = await rest(token, 'DELETE', refPath({ owner, ...r }), null, opts);
      if (res.status === 204) { done.push(r); log(`deleted ${repo} ${r.branch}`); }
      else skipped.push({ ...r, skipped: `GitHub said ${res.status}${res.json?.message ? `: ${res.json.message}` : ''}` });
    }
  }
  return { done, skipped };
}

/** Puts deleted branches back from an undo log, each at the commit it had. A branch that exists again is left alone. */
export async function undo(token, lines, { owner, yes = false, log = () => {}, ...opts }) {
  const done = [], skipped = [];
  for (const r of lines) {
    if (String(r.owner).toLowerCase() !== String(owner).toLowerCase() || !NAME.test(r.repo || '') || !BRANCH.test(r.branch || '') || !SHA.test(r.sha || '')) { skipped.push({ ...r, skipped: 'not a line this farm can put back' }); continue; }
    if (!yes) { done.push({ ...r, dryRun: true }); log(`would put back ${r.repo} ${r.branch} at ${r.sha.slice(0, 7)}`); continue; }
    const res = await rest(token, 'POST', `/repos/${owner}/${r.repo}/git/refs`, { ref: `refs/heads/${r.branch}`, sha: r.sha }, opts);
    if (res.status === 201) { done.push(r); log(`put back ${r.repo} ${r.branch}`); }
    else skipped.push({ ...r, skipped: res.status === 422 ? 'it exists already, or GitHub no longer has that commit' : `GitHub said ${res.status}` });
  }
  return { done, skipped };
}

// ---------- What it writes ----------

const cell = (s) => String(s ?? '').replace(/\\/g, '\\\\').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
const day = (iso) => (iso ? String(iso).slice(0, 10) : '—');

export function toMarkdown(result, meta) {
  const L = ['# Branches: delete, ask or keep', '',
    `Checked ${meta.checkedWords || day(meta.checked)} on ${meta.owner}'s ${meta.repoCount} repos by GitHub Aquarium's branch-sweeper (\`${LABEL}\`). Checking changed nothing.`, ''];
  for (const [g, title, empty] of GROUPS) {
    const mine = result.items.filter((i) => i.group === g);
    L.push(`## ${title} (${mine.length})`, '');
    if (!mine.length) { L.push(empty, ''); continue; }
    L.push('| # | Repo | Branch | Why | Last commit | Link |', '|--:|---|---|---|---|---|');
    mine.forEach((i, n) => L.push(`| ${n + 1} | ${cell(i.repo)}${i.private ? ' (private)' : ''} | \`${cell(i.branch)}\` | ${cell(i.why)} | ${day(i.since)} | ${i.url} |`));
    L.push('');
  }
  if (meta.notes?.length) L.push('## Not covered', '', ...meta.notes.map((n) => `- ${n}`), '');
  return L.join('\n');
}

/** The file GitHub Aquarium's page reads on this PC: one global, never fetched from anywhere else. */
export function pageData(result, meta) {
  // The main branches are left out: every repo has one, and listing them would bury the branches that matter.
  const items = result.items.filter((i) => i.group !== 'keep' || i.branch !== i.base);
  const counts = Object.fromEntries(GROUPS.map(([g]) => [g, items.filter((i) => i.group === g).length]));
  const data = { schema: SCHEMA, label: LABEL, checked: meta.checked, owner: meta.owner, repos: meta.repoCount, counts, notes: meta.notes || [], items };
  return `// Written by ${LABEL} on this PC. Private: never commit it.\nwindow.${PAGE_VAR} = ${JSON.stringify(data)};\n`;
}

export const dataFile = (name) => join(homedir(), 'Documents', ...DATA_DIR, name);

function token() {
  const t = process.env.SWEEPER_TOKEN || process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (t) return t;
  try { return execFileSync('gh', ['auth', 'token'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return null; }
}

const isMain = () => { try { return !!process.argv[1] && realpathSync(fileURLToPath(import.meta.url)) === realpathSync(process.argv[1]); } catch { return false; } };

if (isMain()) {
  const args = process.argv.slice(2);
  const opt = (name) => { const i = args.indexOf(name); return i < 0 ? undefined : args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true; };
  const registry = JSON.parse(readFileSync(new URL('../pets.json', import.meta.url), 'utf8'));
  const owner = farmOwner(registry);
  const t = token();
  if (!t) { console.error('No GitHub token: sign in with `gh auth login`, or set GITHUB_TOKEN.'); process.exit(1); }
  const yes = args.includes('--yes');
  const writing = typeof opt('--apply') === 'string' || typeof opt('--undo') === 'string';
  if (writing) {
    const me = (await graphql(t, 'query { viewer { login } }')).viewer.login;
    assertSignedInAsOwner(registry, me);
    const log = (s) => console.error(`  ${s}`);
    let r;
    if (typeof opt('--apply') === 'string') {
      const undoLog = dataFile(`branch-sweeper-undo-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.jsonl`);
      mkdirSync(dirname(undoLog), { recursive: true });
      r = await apply(t, JSON.parse(readFileSync(opt('--apply'), 'utf8')), { owner, yes, undoLog, log });
      if (yes && r.done.length) console.error(`undo log: ${undoLog} (put them back: npm run branch-sweeper -- --undo "${undoLog}" --yes)`);
    } else {
      const lines = readFileSync(opt('--undo'), 'utf8').split(/\r?\n/).filter(Boolean).map((l) => JSON.parse(l));
      r = await undo(t, lines, { owner, yes, log });
    }
    for (const s of r.skipped) console.error(`  skipped ${s.repo} ${s.branch}: ${s.skipped}`);
    console.error(`${yes ? 'Done' : 'Dry run (nothing changed; add --yes)'}: ${r.done.length} ${typeof opt('--apply') === 'string' ? 'deleted' : 'put back'}, ${r.skipped.length} skipped.`);
    process.exit(0);
  }
  const repos = await listRepos(t, owner);
  const got = await collect(t, repos, { onProgress: (p) => p.phase === 'repos' && process.stderr.write(`  repos ${p.done}/${p.total}\n`) });
  const data = { owner, checked: new Date().toISOString(), ...got };
  const result = analyze(data);
  const shown = data.repos.filter((r) => !r.hidden);
  const meta = { owner, checked: data.checked, repoCount: shown.length, notes: data.notes,
    checkedWords: new Date(data.checked).toLocaleString('en-US', { timeZone: 'America/Denver', dateStyle: 'medium', timeStyle: 'short' }) + ' Denver' };
  const md = opt('--md');
  if (md === true) process.stdout.write(toMarkdown(result, meta));
  else if (typeof md === 'string') writeFileSync(md, toMarkdown(result, meta));
  const plan = opt('--plan');
  if (plan) {
    const file = typeof plan === 'string' ? plan : dataFile(`branch-sweeper-plan-${data.checked.slice(0, 10).replace(/-/g, '')}.json`);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, JSON.stringify(makePlan(result, meta), null, 1));
    console.error(`plan: ${file}`);
  }
  if (!args.includes('--no-page-data')) {
    const file = typeof opt('--page-data') === 'string' ? opt('--page-data') : dataFile('branch-sweeper-page-data.js');
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, pageData(result, meta));
    console.error(`page data: ${file}${existsSync(file) ? '' : ' (not written)'}`);
  }
  const c = result.counts;
  console.error(`branch-sweeper: ${meta.repoCount} repos, ${result.items.length} branches. Safe to delete ${c.delete} · ask Astra ${c.ask} · keep ${c.keep}.`);
  process.exit(0);
}
