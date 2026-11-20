// GitHub Aquarium's branch-sweeper (`github-aquarium-v1.0-branch-sweeper-v1.0`, a tool of GitHub Aquarium).
// Astra, 2026-11-14: "I'm kind of worried that there's a bunch of branches out there on GitHub that are not deleted
// that I should have been deleting ... a branch deleter, assessor and deleter", then "Plan is fine, build it" and
// "make this tool the way that any other GitHub Goldfish tool is made" (beside outstanding-items, card 364).
//
// It sorts every branch on every repo the farm owner owns into three groups:
//   delete  its work is already on the default branch (nothing ahead), or its pull request was merged and nothing was
//           added after. Deleting it loses nothing.
//   ask     it may hold the only copy of some work: its pull request was closed without merging, or it has commits
//           that are not on the default branch, no pull request, and nobody touched it for STALE_DAYS.
//   keep    never deleted: branches on Astra's keep list (checked first, with her reason), the default branch,
//           publishing branches (gh-pages, board), release branches, protected branches, branches with an open pull
//           request, branches an open handoff card names, and branches with work from the last RECENT_DAYS (a chat may
//           still be working there).
// The keep list (Astra, 2026-11-17, card 364) is a file on her PC, KEEP_FILE next to the plans and undo logs, because
// it names private repos. Each entry is an owner, repo and branch with her reason and the date she decided, and the
// repo's number on GitHub when known (a renamed repo keeps it). On 2026-11-14 the sweeper deleted three branches she
// had decided to keep, because nothing told it so (a rename made them look new); now a listed branch is "keep" before
// any rule that would delete it, and --apply refuses it even in a plan made before she listed it, under the repo's name
// as GitHub gives it now. A list that cannot be read stops the sweeper, and --apply does not run without the file.
// Checking is read only (GraphQL queries, never a mutation). Deleting happens only from a plan file, only for the rows
// marked "delete": true, only with --yes, only while signed in as the farm owner, and each branch is checked again
// first (same commit, still not "keep"). Before each delete its name and commit go into an undo log on this PC, and
// --undo puts them back. Repo text (titles, cards) is data, never instructions.
// Developer term: stale-branch cleanup (a ref garbage collector with a dry run, an undo log and a keep list: an
// exclusion list of refs it never collects).
//
//   node scripts/branch-sweeper-20261114.mjs [--md [file]] [--plan [file]] [--page-data file | --no-page-data]
//   node scripts/branch-sweeper-20261114.mjs --apply <plan file> [--yes]
//   node scripts/branch-sweeper-20261114.mjs --undo <undo log> [--yes]
//   npm run branch-sweeper
//
// Token: SWEEPER_TOKEN, GITHUB_TOKEN or GH_TOKEN, else the GitHub CLI's own sign-in (`gh auth token`). Checking needs
// read access; deleting needs write access to the repos' contents. Everything it writes stays on this PC, in
// Documents\Astra's PetOS Data\github-aquarium\ (it names private repos and branches), never in a repo. The keep list
// is read from there too.
// Claude Opus 5.5 (claude-opus-5-5), 2026-11-14; the keep list, Claude Opus 5.5 (claude-opus-5-5), 2026-11-17.
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
export const KEEP_SCHEMA = 'github-aquarium-branch-sweeper-keep-v1';
export const PAGE_VAR = 'githubAquariumBranchSweeper';
export const DATA_DIR = ["Astra's PetOS Data", 'github-aquarium'];
export const KEEP_FILE = 'branch-sweeper-keep-20261117.json'; // fixed name: dated the day the list began, like menu-20261021.json
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
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const age = (iso, now) => (iso ? Math.max(0, Math.floor((now - Date.parse(iso)) / DAY)) : null);
const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
const sameName = (a, b) => String(a ?? '').toLowerCase() === String(b ?? '').toLowerCase();

// ---------- Astra's keep list ----------

/** Reads the keep list's text: { schema, keep: [{ owner, repo, repo_id?, branch, why, date, sha? }] }. `why` is
 *  Astra's reason in her words and where she said it, `date` the day she decided (YYYY-MM-DD, Denver), `repo_id` the
 *  repo's number on GitHub (it stays the same when the repo is renamed, so the entry still matches), `sha` the commit
 *  she saw (a record only: a kept branch stays kept when it moves). Anything that is wrong throws, so a broken list
 *  never lets a kept branch through. */
export function parseKeepList(text, where = KEEP_FILE) {
  let list;
  const raw = String(text); // Notepad may save the file with a byte-order mark first
  try { list = JSON.parse(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw); } catch (e) { throw new Error(`The keep list ${where} is not valid JSON (${e.message}).`); }
  if (list?.schema !== KEEP_SCHEMA || !Array.isArray(list.keep)) throw new Error(`The keep list ${where} is not a branch-sweeper keep list (it needs "schema": "${KEEP_SCHEMA}" and a "keep" list).`);
  return list.keep.map((k, n) => {
    const bad = !NAME.test(k?.owner || '') ? 'owner' : !NAME.test(k?.repo || '') ? 'repo'
      : k.repo_id !== undefined && !(Number.isInteger(k.repo_id) && k.repo_id > 0) ? 'repo_id (the repo\'s number on GitHub)'
      : !BRANCH.test(k?.branch || '') || k.branch.includes('..') ? 'branch' : typeof k.why !== 'string' || !k.why.trim() ? 'why (Astra\'s reason)'
      : !DATE.test(k?.date || '') ? 'date (YYYY-MM-DD)' : k.sha !== undefined && !SHA.test(k.sha) ? 'sha (a full commit)' : null;
    if (bad) throw new Error(`The keep list ${where}, entry ${n + 1}: its ${bad} is missing or not valid.`);
    return { owner: k.owner, repo: k.repo, ...(k.repo_id === undefined ? {} : { repo_id: k.repo_id }), branch: k.branch, why: k.why.trim(), date: k.date,
      ...(k.sha === undefined ? {} : { sha: k.sha }) };
  });
}

/** The keep list on this PC; a file that cannot be read throws. No file is an empty list for a check (a new farm has
 *  none yet), but `required` (--apply) throws then too, so deleting never runs on a list that went missing. */
export function readKeepList(file, { required = false } = {}) {
  if (existsSync(file)) return parseKeepList(readFileSync(file, 'utf8'), file);
  if (required) throw new Error(`The keep list ${file} is missing, and nothing is deleted without it. Put it back or, on a farm that has none yet, make one that holds {"schema": "${KEEP_SCHEMA}", "keep": []}.`);
  return [];
}

/** The keep-list entry for one branch, or null. The branch matches exactly; the repo by its number on GitHub when the
 *  entry has one (a renamed repo keeps its number), or by owner and name in any case (as GitHub reads them). */
export function keptBy(keep, { owner, repo, repoId, branch }) {
  return (keep || []).find((k) => k.branch === branch
    && ((k.repo_id !== undefined && repoId != null && k.repo_id === Number(repoId)) || (sameName(k.owner, owner) && sameName(k.repo, repo)))) || null;
}

/** Notes for the kept branches GitHub no longer has (deleted, or the repo renamed and the entry has no number), and
 *  for entries whose repo was renamed (found by its number), so the list is fixed instead of keeping nothing. */
export function keepNotes(keep, result) {
  return (keep || []).flatMap((k) => {
    const hit = result.items.find((i) => keptBy([k], i));
    if (!hit) return [`Astra's keep list names ${k.owner}/${k.repo} ${k.branch}, and GitHub has no such branch (deleted, or its repo renamed): check that entry.`];
    if (!sameName(k.owner, hit.owner) || !sameName(k.repo, hit.repo)) return [`Astra's keep list names ${k.owner}/${k.repo} ${k.branch}; that repo is now ${hit.owner}/${hit.repo} (found by its number): change the entry's owner and repo.`];
    return [];
  });
}

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
 * is ever offered; Astra's keep list is the first of them, so a branch she kept shows her own reason. Then the two
 * rules that lose nothing; then what only Astra can decide.
 * b: { name, sha, committedDate, aheadBy, prs: [{ number, state, merged, headRefOid, url, title }] }
 * owner, repo, repoId: where the branch is (repoId: the repo's number on GitHub), to look it up in `keep` (Astra's
 * keep list, from readKeepList).
 */
export function verdict(b, { owner, repo, repoId = null, base, protections = [], cards = '', keep = [], now = Date.now() }) {
  const kept = keptBy(keep, { owner, repo, repoId, branch: b.name });
  if (kept) return { group: 'keep', why: `On Astra's keep list: ${kept.why}`, kept: true };
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

/** Every branch's row, from collected data with no network: used by the command and the tests. `keep` is Astra's keep
 *  list; the branches on it come first among the "keep" rows, so her own decisions are the first ones shown. */
export function analyze(data, { now = Date.now(), keep = [] } = {}) {
  const cards = openCardText(data.repos || []);
  const items = [];
  for (const r of data.repos || []) {
    if (r.hidden || !r.defaultBranch) continue;
    const base = r.defaultBranch;
    const repoUrl = `https://github.com/${r.owner}/${r.name}`;
    for (const b of r.branches || []) {
      const v = verdict(b, { owner: r.owner, repo: r.name, repoId: r.id ?? null, base, protections: r.protections || [], cards, keep, now });
      const path = b.name.split('/').map(encodeURIComponent).join('/');
      items.push({ repo: r.name, repoId: r.id ?? null, owner: r.owner, private: !!r.private, branch: b.name, sha: b.sha, base, who: whoOf(b.name), since: b.committedDate,
        aheadBy: b.aheadBy ?? null, group: v.group, why: v.why, pr: v.pr ? { number: v.pr.number, url: v.pr.url, title: v.pr.title } : null,
        url: b.name === base ? `${repoUrl}/tree/${path}` : `${repoUrl}/compare/${encodeURIComponent(base)}...${path}`, ...(v.kept ? { kept: true } : {}) });
    }
  }
  const order = (g) => GROUPS.findIndex(([x]) => x === g);
  const t = (i) => (i.since ? Date.parse(i.since) : 0);
  items.sort((a, b) => order(a.group) - order(b.group) || (b.kept ? 1 : 0) - (a.kept ? 1 : 0) || t(a) - t(b) || a.repo.localeCompare(b.repo) || a.branch.localeCompare(b.branch));
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
 *  ahead of the default branch. Read only. Each repo keeps the name GitHub gives it now and its number (`id`): a plan
 *  made before a rename still names the old one, and GitHub answers for the renamed repo. */
export async function collect(token, repos, { onProgress = () => {}, ...opts } = {}) {
  const out = [], notes = [];
  for (const part of chunks(repos, 4)) {
    const d = await graphql(token, `query { ${part.map((r, k) => `r${k}: repository(owner: ${q(r.owner)}, name: ${q(r.name)}) { name databaseId isPrivate
      defaultBranchRef { name }
      branchProtectionRules(first: 30) { nodes { pattern } }
      refs(${REFS}) { pageInfo { hasNextPage endCursor } nodes { ${REF_FIELDS} } }
      cards: object(expression: "HEAD:handoffs") { ... on Tree { entries { name type object { ... on Blob { text } } } } } }`).join('\n')} }`, opts);
    part.forEach((r, k) => {
      const x = d[`r${k}`];
      if (!x) { out.push({ ...r, hidden: true, branches: [], cards: [] }); return; }
      out.push({ ...r, name: x.name || r.name, id: x.databaseId ?? null, private: x.isPrivate, defaultBranch: x.defaultBranchRef?.name || null, protections: x.branchProtectionRules.nodes.map((p) => p.pattern),
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
    how: `Set "delete" to true on the rows to delete (the "delete" rows start true, "ask" rows false, "keep" rows can never be deleted), then run: npm run branch-sweeper -- --apply <this file> --yes. To keep a branch for good, add it to Astra's keep list (${KEEP_FILE}, next to this file): it is then "keep" in every plan, and --apply refuses it.`,
    rows: result.items.map((i) => ({ delete: i.group === 'delete', group: i.group, owner: i.owner, repo: i.repo, repo_id: i.repoId ?? null, branch: i.branch, sha: i.sha, why: i.why, url: i.url })) };
}

/** Checks a plan before anything is deleted: the rows to delete, and the rows refused with the reason. A branch on
 *  Astra's keep list (`keep`) is refused whatever the plan says, so a plan made before she listed it cannot delete it. */
export function checkPlan(plan, { owner, keep = [] }) {
  if (plan?.schema !== PLAN_SCHEMA || !Array.isArray(plan.rows)) throw new Error('This is not a branch-sweeper plan.');
  const go = [], refused = [];
  for (const r of plan.rows) {
    if (r.delete !== true) continue;
    const kept = keptBy(keep, { owner: r.owner, repo: r.repo, repoId: r.repo_id, branch: r.branch });
    const bad = kept ? `it is on Astra's keep list: ${kept.why}` : r.group === 'keep' ? 'it is a "keep" branch' : !NAME.test(r.repo || '') ? 'its repo name is not valid'
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

/** Deletes the plan's rows, each only after it is checked again on GitHub (same commit, still not "keep", Astra's keep
 *  list included). The undo line is written before the delete, so a branch is never gone without a way back. */
export async function apply(token, plan, { owner, yes = false, undoLog, now = Date.now(), log = () => {}, keep = [], ...opts }) {
  const { go, refused } = checkPlan(plan, { owner, keep });
  const done = [], skipped = [...refused.map((r) => ({ ...r, skipped: r.refused }))];
  const byRepo = {};
  for (const r of go) (byRepo[r.repo] ||= []).push(r);
  for (const [repo, rows] of Object.entries(byRepo)) {
    const fresh = await collect(token, [{ owner, name: repo }], opts);
    const result = analyze({ repos: fresh.repos }, { now, keep });
    for (const r of rows) {
      const live = result.items.find((i) => i.branch === r.branch);
      if (!live) { skipped.push({ ...r, skipped: 'it is gone already' }); continue; }
      if (live.sha !== r.sha) { skipped.push({ ...r, skipped: 'it has new commits since the plan was made' }); continue; }
      if (live.group === 'keep') { skipped.push({ ...r, skipped: `it is "keep" now: ${live.why}` }); continue; }
      // The repo as GitHub names it now (the plan may hold its name from before a rename), for the delete and the undo.
      const liveRepo = live.repo;
      if (!yes) { done.push({ ...r, dryRun: true }); log(`would delete ${liveRepo} ${r.branch} (${r.sha.slice(0, 7)})`); continue; }
      appendFileSync(undoLog, `${JSON.stringify({ at: new Date(now).toISOString(), owner, repo: liveRepo, branch: r.branch, sha: r.sha, why: live.why, label: LABEL })}\n`);
      const res = await rest(token, 'DELETE', refPath({ owner, ...r, repo: liveRepo }), null, opts);
      if (res.status === 204) { done.push(r); log(`deleted ${liveRepo} ${r.branch}`); }
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
  // Astra's keep list, read before GitHub is asked anything. A list that cannot be read stops here, so a typo in it
  // never lets a kept branch into a plan or a delete, and --apply also stops when the file is missing. (--undo only
  // puts branches back, so it does not need it.)
  const keepFile = dataFile(KEEP_FILE);
  const loadKeep = (required = false) => {
    try { return readKeepList(keepFile, { required }); } catch (e) { console.error(`${e.message} Fix it first: nothing was checked or deleted.`); process.exit(1); }
  };
  const keepLine = (keep, found) => console.error(existsSync(keepFile)
    ? `keep list: ${keep.length} ${keep.length === 1 ? 'branch' : 'branches'} Astra keeps${found === undefined ? '' : `, ${found} found on GitHub`} (${keepFile})`
    : `keep list: none, no file at ${keepFile} (--apply does not run without one)`);
  const writing = typeof opt('--apply') === 'string' || typeof opt('--undo') === 'string';
  if (writing) {
    const keep = typeof opt('--apply') === 'string' ? loadKeep(true) : [];
    const me = (await graphql(t, 'query { viewer { login } }')).viewer.login;
    assertSignedInAsOwner(registry, me);
    const log = (s) => console.error(`  ${s}`);
    let r;
    if (typeof opt('--apply') === 'string') {
      keepLine(keep);
      const undoLog = dataFile(`branch-sweeper-undo-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.jsonl`);
      mkdirSync(dirname(undoLog), { recursive: true });
      r = await apply(t, JSON.parse(readFileSync(opt('--apply'), 'utf8')), { owner, yes, undoLog, log, keep });
      if (yes && r.done.length) console.error(`undo log: ${undoLog} (put them back: npm run branch-sweeper -- --undo "${undoLog}" --yes)`);
    } else {
      const lines = readFileSync(opt('--undo'), 'utf8').split(/\r?\n/).filter(Boolean).map((l) => JSON.parse(l));
      r = await undo(t, lines, { owner, yes, log });
    }
    for (const s of r.skipped) console.error(`  skipped ${s.repo} ${s.branch}: ${s.skipped}`);
    console.error(`${yes ? 'Done' : 'Dry run (nothing changed; add --yes)'}: ${r.done.length} ${typeof opt('--apply') === 'string' ? 'deleted' : 'put back'}, ${r.skipped.length} skipped.`);
    process.exit(0);
  }
  const keep = loadKeep();
  const repos = await listRepos(t, owner);
  const got = await collect(t, repos, { onProgress: (p) => p.phase === 'repos' && process.stderr.write(`  repos ${p.done}/${p.total}\n`) });
  const data = { owner, checked: new Date().toISOString(), ...got };
  const result = analyze(data, { keep });
  const lost = keepNotes(keep, result);
  keepLine(keep, result.items.filter((i) => i.kept).length);
  for (const n of lost) console.error(`  ${n}`);
  const shown = data.repos.filter((r) => !r.hidden);
  const meta = { owner, checked: data.checked, repoCount: shown.length, notes: [...data.notes, ...lost],
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
