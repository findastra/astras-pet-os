// GitHub Aquarium's branch-sweeper (Astra, 2026-11-14: "a branch deleter, assessor and deleter", then "Plan is fine,
// build it"). Every branch is sorted into delete, ask or keep; nothing that may still be in use is ever offered;
// deleting needs a plan, --yes and a fresh check, and writes the undo line first. Claude Opus 5.5, 2026-11-14.
// Astra's keep list (branches she decided to keep are never offered for deleting again): Claude Opus 5.5, 2026-11-17.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { analyze, apply, checkPlan, keepNotes, keptBy, makePlan, namedInCard, openCardText, pageData, parseKeepList, protects, readKeepList, toMarkdown, undo, verdict, KEEP_FILE, KEEP_SCHEMA, LABEL, LIMITS, PLAN_SCHEMA, RECENT_DAYS, STALE_DAYS } from '../scripts/branch-sweeper-20261114.mjs';

const NOW = Date.parse('2026-11-14T20:00:00Z');
const ago = (days) => new Date(NOW - days * 86400000).toISOString();
const SHA = 'a'.repeat(40), NEW = 'b'.repeat(40);
const br = (o) => ({ name: 'claude/x', sha: SHA, committedDate: ago(40), aheadBy: 0, prs: [], ...o });
const v = (o, extra = {}) => verdict(br(o), { base: 'main', now: NOW, ...extra });
const merged = (o) => ({ number: 4, state: 'MERGED', merged: true, headRefOid: SHA, url: 'https://github.com/o/r/pull/4', title: 'A change', ...o });

test('main, publishing, release, protected and open-pull-request branches are always kept', () => {
  assert.equal(v({ name: 'main' }).group, 'keep');
  assert.equal(v({ name: 'gh-pages' }).group, 'keep');
  assert.equal(v({ name: 'release/1.0' }).group, 'keep');
  assert.equal(v({ name: 'dev' }, { protections: ['dev'] }).group, 'keep');
  assert.equal(v({ name: 'claude/a' }, { protections: ['claude/*'] }).group, 'keep');
  assert.equal(v({ prs: [merged({ number: 2 }), { number: 9, state: 'OPEN', merged: false }] }).group, 'keep');
});

test('a branch with all its work on main, or merged with nothing added after, is safe to delete', () => {
  assert.equal(v({ aheadBy: 0 }).group, 'delete');
  const m = v({ aheadBy: 3, prs: [merged()] }); // a squash merge leaves the branch "ahead", but the work is on main
  assert.equal(m.group, 'delete');
  assert.match(m.why, /#4 was merged, and nothing was added after/);
  assert.equal(v({ aheadBy: 3, committedDate: ago(1), prs: [merged()] }).group, 'delete', 'merged today is still safe');
});

test('recent work and branches an open card names are kept, so a working chat never loses its branch', () => {
  assert.equal(v({ committedDate: ago(RECENT_DAYS - 1) }).group, 'keep', 'a new empty branch a chat just made');
  assert.equal(v({ aheadBy: 2, committedDate: ago(STALE_DAYS - 1) }).group, 'keep');
  const cards = openCardText([{ cards: [{ name: '001-a.md', text: 'status: open\n---\nbranch `claude/x`' }] }]);
  assert.equal(v({}, { cards }).group, 'keep');
  assert.equal(v({ prs: [merged()] }, { cards }).group, 'delete', 'a merged branch is safe even if an old card names it');
  assert.equal(openCardText([{ cards: [{ name: '002-a.md', text: 'status: done\nclaude/x' }, { name: '003-a.md', text: 'status: merged\nclaude/x' }] }]), '');
  assert.equal(namedInCard('dev', 'we develop'), false, 'a plain name counts only in backticks');
  assert.equal(namedInCard('dev', 'branch `dev`'), true);
});

test('what only Astra can decide is "ask": closed unmerged, more added after a merge, or old work with no pull request', () => {
  assert.equal(v({ aheadBy: 2, prs: [{ number: 5, state: 'CLOSED', merged: false }] }).group, 'ask');
  assert.equal(v({ aheadBy: 2, sha: NEW, prs: [merged()] }).group, 'ask');
  assert.match(v({ aheadBy: 7, committedDate: ago(STALE_DAYS + 5) }).why, /7 commits not on main, no pull request, untouched for 35 days/);
  assert.equal(v({ aheadBy: null }).group, 'ask');
});

test('protection patterns match like GitHub: * inside one part, ** across parts', () => {
  assert.equal(protects('release/*', 'release/1'), true);
  assert.equal(protects('release/*', 'release/a/b'), false);
  assert.equal(protects('release/**', 'release/a/b'), true);
  assert.equal(protects('main', 'mainline'), false);
});

const data = { owner: 'o', repos: [{ owner: 'o', name: 'r', private: true, defaultBranch: 'main', protections: [], cards: [],
  branches: [br({ name: 'main' }), br({ name: 'claude/done' }), br({ name: 'codex/old', aheadBy: 4 })] }] };

test('the list sorts delete, ask, keep, and the page data leaves out the main branches and stays private', () => {
  const r = analyze(data, { now: NOW });
  assert.deepEqual(r.items.map((i) => [i.branch, i.group]), [['claude/done', 'delete'], ['codex/old', 'ask'], ['main', 'keep']]);
  assert.deepEqual(r.counts, { delete: 1, ask: 1, keep: 1 });
  assert.match(r.items[0].url, /^https:\/\/github\.com\/o\/r\/compare\/main\.\.\.claude\/done$/);
  const js = pageData(r, { owner: 'o', checked: ago(0), repoCount: 1 });
  assert.match(js, new RegExp(`^// Written by ${LABEL.replace(/\./g, '\\.')} on this PC\\. Private: never commit it\\.\\nwindow\\.githubAquariumBranchSweeper = \\{`));
  assert.ok(!js.includes('"branch":"main"'));
});

test('a plan starts with only the safe rows ticked and can never delete a "keep" row', () => {
  const plan = makePlan(analyze(data, { now: NOW }), { owner: 'o', checked: ago(0) });
  assert.equal(plan.schema, PLAN_SCHEMA);
  assert.deepEqual(plan.rows.filter((r) => r.delete).map((r) => r.branch), ['claude/done']);
  plan.rows.forEach((r) => { r.delete = true; });
  const { go, refused } = checkPlan(plan, { owner: 'o' });
  assert.deepEqual(go.map((r) => r.branch), ['claude/done', 'codex/old']);
  assert.deepEqual(refused.map((r) => [r.branch, r.refused]), [['main', 'it is a "keep" branch']]);
  assert.equal(checkPlan({ ...plan, rows: plan.rows.map((r) => ({ ...r, owner: 'someone-else' })) }, { owner: 'o' }).go.length, 0, 'never another account');
  assert.equal(checkPlan({ ...plan, rows: [{ ...plan.rows[0], branch: '../x' }] }, { owner: 'o' }).go.length, 0);
  const big = { ...plan, rows: Array.from({ length: LIMITS.maxDeletes + 1 }, (_, i) => ({ ...plan.rows[0], branch: `claude/b${i}` })) };
  assert.throws(() => checkPlan(big, { owner: 'o' }), /at most 200/);
});

/** A pretend GitHub: answers the sweeper's queries from `branches` for one repo (its name and number now: a renamed
 *  repo answers under its new name), records every write. */
function fakeGitHub(branches, { name = 'r', id = 7 } = {}) {
  const writes = [];
  const fetchFn = async (url, init) => {
    const reply = (status, body) => ({ ok: status < 300, status, json: async () => body, text: async () => (body ? JSON.stringify(body) : '') });
    if (url.endsWith('/graphql')) {
      const { query } = JSON.parse(init.body);
      assert.ok(!/mutation/.test(query), 'checking never writes');
      if (/compare/.test(query)) return reply(200, { data: Object.fromEntries(branches.filter((b) => b.name !== 'main').map((b, k) => [`c${k}`, { ref: { compare: { aheadBy: b.aheadBy } } }])) });
      return reply(200, { data: { r0: { name, databaseId: id, isPrivate: true, defaultBranchRef: { name: 'main' }, branchProtectionRules: { nodes: [] }, cards: null,
        refs: { pageInfo: { hasNextPage: false }, nodes: branches.map((b) => ({ name: b.name, target: { oid: b.sha, committedDate: b.committedDate }, associatedPullRequests: { nodes: [] } })) } } } });
    }
    writes.push([init.method, url, init.body || null]);
    return reply(init.method === 'DELETE' ? 204 : 201, null);
  };
  return { fetchFn, writes };
}

test('deleting re-checks each branch, does nothing without --yes, and writes the undo line before the delete', async () => {
  const plan = { schema: PLAN_SCHEMA, rows: [
    { delete: true, group: 'delete', owner: 'o', repo: 'r', branch: 'claude/done', sha: SHA },
    { delete: true, group: 'delete', owner: 'o', repo: 'r', branch: 'claude/moved', sha: SHA },
    { delete: true, group: 'delete', owner: 'o', repo: 'r', branch: 'claude/gone', sha: SHA },
  ] };
  const live = [br({ name: 'main' }), br({ name: 'claude/done' }), br({ name: 'claude/moved', sha: NEW })];
  const undoLog = join(mkdtempSync(join(tmpdir(), 'sweeper-')), 'undo.jsonl');
  const dry = fakeGitHub(live);
  const d = await apply('t', plan, { owner: 'o', undoLog, now: NOW, fetchFn: dry.fetchFn });
  assert.equal(dry.writes.length, 0, 'a dry run changes nothing');
  assert.deepEqual(d.done.map((r) => r.branch), ['claude/done']);
  assert.deepEqual(d.skipped.map((r) => [r.branch, r.skipped]).sort(), [['claude/gone', 'it is gone already'], ['claude/moved', 'it has new commits since the plan was made']]);
  const real = fakeGitHub(live);
  const r = await apply('t', plan, { owner: 'o', yes: true, undoLog, now: NOW, fetchFn: real.fetchFn });
  assert.deepEqual(real.writes, [['DELETE', 'https://api.github.com/repos/o/r/git/refs/heads/claude/done', null]]);
  assert.equal(r.done.length, 1);
  const line = JSON.parse(readFileSync(undoLog, 'utf8').trim());
  assert.deepEqual([line.repo, line.branch, line.sha], ['r', 'claude/done', SHA]);
  // A branch that became "keep" since the plan (someone pushed to it today) is left alone.
  const busy = fakeGitHub([br({ name: 'claude/done', committedDate: ago(0), aheadBy: 1 })]);
  const b = await apply('t', { ...plan, rows: [plan.rows[0]] }, { owner: 'o', yes: true, undoLog, now: NOW, fetchFn: busy.fetchFn });
  assert.equal(busy.writes.length, 0);
  assert.match(b.skipped[0].skipped, /^it is "keep" now/);
  // Undo puts it back at the same commit.
  const back = fakeGitHub([]);
  const u = await undo('t', [line], { owner: 'o', yes: true, fetchFn: back.fetchFn });
  assert.equal(u.done.length, 1);
  assert.deepEqual(back.writes, [['POST', 'https://api.github.com/repos/o/r/git/refs', JSON.stringify({ ref: 'refs/heads/claude/done', sha: SHA })]]);
});

// Astra's keep list (2026-11-17): a branch she decided to keep never goes into a delete plan again. On 2026-11-14 the
// sweeper deleted three branches she had decided to keep, because nothing told it so (card 364). The real list names
// private repos and stays on her PC; these names are made up.
const KEPT = { owner: 'o', repo: 'r', branch: 'claude/kept', why: 'Astra 2026-11-14: these branches stay. Restored 2026-11-16.', date: '2026-11-14', sha: SHA };
const keepText = (keep = [KEPT]) => JSON.stringify({ schema: KEEP_SCHEMA, keep });
const HER_REASON = `On Astra's keep list: ${KEPT.why}`;
/** One repo as collect() reads it: main, a kept branch that would be "delete" without the list, and a done branch. */
const listed = (id) => ({ owner: 'o', repos: [{ owner: 'o', name: 'r', ...(id ? { id } : {}), private: true, defaultBranch: 'main', protections: [], cards: [],
  branches: [br({ name: 'main', committedDate: ago(90) }), br({ name: 'claude/kept', committedDate: ago(40), prs: [merged()] }), br({ name: 'claude/done' })] }] });
const tmpLog = () => join(mkdtempSync(join(tmpdir(), 'sweeper-')), 'undo.jsonl');

test('a branch on Astra\'s keep list is "keep" with her reason, before every rule that would delete it', () => {
  const keep = parseKeepList(keepText());
  const at = { owner: 'o', repo: 'r', keep };
  // Merged with nothing added after, and all its work on main: both are "delete" without the list.
  assert.deepEqual(v({ name: 'claude/kept', aheadBy: 3, prs: [merged()] }, at), { group: 'keep', why: HER_REASON, kept: true });
  assert.equal(v({ name: 'claude/kept', aheadBy: 0 }, at).group, 'keep');
  assert.equal(v({ name: 'claude/kept', aheadBy: 2, prs: [{ number: 5, state: 'CLOSED', merged: false }] }, at).group, 'keep', 'never "ask" either');
  assert.equal(v({ name: 'claude/kept', aheadBy: 0 }, { ...at, owner: 'O', repo: 'R' }).group, 'keep', 'owner and repo in any case, as GitHub reads them');
  // Only that branch, in that repo, on that account.
  assert.equal(v({ name: 'claude/Kept', aheadBy: 0 }, at).group, 'delete', 'a branch name is exact');
  assert.equal(v({ name: 'claude/kept', aheadBy: 0 }, { ...at, repo: 'other' }).group, 'delete');
  assert.equal(v({ name: 'claude/kept', aheadBy: 0 }, { ...at, owner: 'someone-else' }).group, 'delete');
  assert.equal(v({ name: 'claude/kept', aheadBy: 0 }).group, 'delete', 'no list, nothing kept by it');
  assert.equal(keptBy(keep, { owner: 'O', repo: 'r', branch: 'claude/kept' }), keep[0]);
  assert.equal(keptBy(keep, { owner: 'o', repo: 'r', branch: 'claude/other' }), null);
});

test('the keep list must be whole: no file yet is an empty list, and anything wrong in it stops the sweeper', () => {
  assert.equal(KEEP_FILE, 'branch-sweeper-keep-20261117.json');
  const dir = mkdtempSync(join(tmpdir(), 'sweeper-keep-'));
  const file = join(dir, KEEP_FILE);
  assert.deepEqual(readKeepList(file), [], 'a farm with no keep list yet');
  writeFileSync(file, String.fromCharCode(0xfeff) + keepText()); // Notepad saves a byte-order mark
  assert.deepEqual(readKeepList(file), [KEPT]);
  assert.deepEqual(parseKeepList(keepText([{ ...KEPT, sha: undefined }])).map((k) => 'sha' in k), [false], 'the commit is optional');
  assert.throws(() => parseKeepList('{ "schema": '), /is not valid JSON/);
  assert.throws(() => parseKeepList(JSON.stringify({ keep: [KEPT] })), /is not a branch-sweeper keep list/);
  for (const [field, value] of [['owner', ''], ['repo', 'a b'], ['repo_id', '7'], ['repo_id', -1], ['repo_id', 1.5], ['branch', '../x'], ['why', ' '], ['date', '11/14/2026'], ['sha', 'abc']]) {
    assert.throws(() => parseKeepList(keepText([KEPT, { ...KEPT, [field]: value }])), new RegExp(`entry 2: its ${field}`), `${field} ${value}`);
  }
  assert.deepEqual(parseKeepList(keepText([{ ...KEPT, repo_id: 7 }]))[0].repo_id, 7);
  // --apply reads it with `required`: a list that went missing stops the deleting, where a check just has none.
  assert.throws(() => readKeepList(join(dir, 'gone.json'), { required: true }), /is missing, and nothing is deleted without it/);
  assert.deepEqual(readKeepList(join(dir, 'gone.json')), []);
});

test('a renamed repo keeps its kept branches: an entry with the repo\'s number matches it under any name', () => {
  const keep = parseKeepList(keepText([{ ...KEPT, repo: 'old-name', repo_id: 7 }]));
  assert.equal(v({ name: 'claude/kept', aheadBy: 0 }, { owner: 'o', repo: 'r', repoId: 7, keep }).group, 'keep');
  assert.equal(v({ name: 'claude/kept', aheadBy: 0 }, { owner: 'o', repo: 'r', repoId: 8, keep }).group, 'delete', 'another repo, another number');
  assert.equal(v({ name: 'claude/kept', aheadBy: 0 }, { owner: 'o', repo: 'old-name', repoId: 8, keep }).group, 'keep', 'the name still counts');
  const row = { delete: true, group: 'delete', owner: 'o', repo: 'r', repo_id: 7, branch: 'claude/kept', sha: SHA };
  assert.deepEqual(checkPlan({ schema: PLAN_SCHEMA, rows: [row] }, { owner: 'o', keep }).refused.map((x) => x.branch), ['claude/kept']);
  const r = analyze(listed(7), { now: NOW, keep });
  assert.equal(makePlan(r, { owner: 'o', checked: ago(0) }).rows.find((x) => x.branch === 'claude/kept').repo_id, 7, 'plans carry the number');
  assert.deepEqual(keepNotes(keep, r),
    ['Astra\'s keep list names o/old-name claude/kept; that repo is now o/r (found by its number): change the entry\'s owner and repo.']);
});

test('a plan made before a rename cannot delete a kept branch: --apply checks the repo under the name GitHub gives now', async () => {
  // The plan says "r"; the repo is "renamed" now (GitHub answers the old name with it); the list names the new name.
  const keep = parseKeepList(keepText([{ ...KEPT, repo: 'renamed' }]));
  const old = { schema: PLAN_SCHEMA, rows: [{ delete: true, group: 'delete', owner: 'o', repo: 'r', branch: 'claude/kept', sha: SHA }] };
  assert.equal(checkPlan(old, { owner: 'o', keep }).go.length, 1, 'the plan alone cannot tell');
  const gh = fakeGitHub([br({ name: 'claude/kept' })], { name: 'renamed' });
  const a = await apply('t', old, { owner: 'o', yes: true, undoLog: tmpLog(), now: NOW, keep, fetchFn: gh.fetchFn });
  assert.deepEqual([gh.writes, a.skipped.map((x) => x.skipped)], [[], [`it is "keep" now: ${HER_REASON}`]]);
  // A branch that is not kept is deleted under the repo's name now, and its undo line says that name.
  const log = tmpLog();
  const done = fakeGitHub([br({ name: 'claude/done' })], { name: 'renamed' });
  await apply('t', { ...old, rows: [{ ...old.rows[0], branch: 'claude/done' }] }, { owner: 'o', yes: true, undoLog: log, now: NOW, keep, fetchFn: done.fetchFn });
  assert.deepEqual(done.writes, [['DELETE', 'https://api.github.com/repos/o/renamed/git/refs/heads/claude/done', null]]);
  assert.equal(JSON.parse(readFileSync(log, 'utf8')).repo, 'renamed');
});

test('the list, the page and the plan show a kept branch as "keep" with her reason, her branches first', () => {
  const keep = parseKeepList(keepText());
  const r = analyze(listed(), { now: NOW, keep });
  assert.deepEqual(r.items.map((i) => [i.branch, i.group]), [['claude/done', 'delete'], ['claude/kept', 'keep'], ['main', 'keep']], 'before the older main branch');
  const row = r.items.find((i) => i.branch === 'claude/kept');
  assert.deepEqual([row.why, row.kept], [HER_REASON, true]);
  assert.equal(r.items.find((i) => i.branch === 'main').kept, undefined);
  assert.match(toMarkdown(r, { owner: 'o', checked: ago(0), repoCount: 1 }), /\| 1 \| r \(private\) \| `claude\/kept` \| On Astra's keep list: Astra 2026-11-14: these branches stay\. Restored 2026-11-16\. \|/);
  const js = pageData(r, { owner: 'o', checked: ago(0), repoCount: 1 });
  const page = JSON.parse(js.slice(js.indexOf(' = ') + 3, js.lastIndexOf(';')));
  assert.deepEqual(page.items.map((i) => [i.branch, i.group, i.why]), [['claude/done', 'delete', 'Everything on it is already on main.'], ['claude/kept', 'keep', HER_REASON]]);
  assert.deepEqual(page.counts, { delete: 1, ask: 0, keep: 1 }, 'the main branch is left out, her branch is not');
  const plan = makePlan(r, { owner: 'o', checked: ago(0) });
  assert.deepEqual(plan.rows.filter((x) => x.delete).map((x) => x.branch), ['claude/done'], 'a kept row starts unticked');
  assert.match(plan.how, /keep list/);
});

test('--apply refuses a kept branch like any other "keep" row, even from a plan made before she listed it', async () => {
  const keep = parseKeepList(keepText());
  // A plan made with the list: ticking the kept row does not help.
  const plan = makePlan(analyze(listed(), { now: NOW, keep }), { owner: 'o', checked: ago(0) });
  plan.rows.forEach((x) => { x.delete = true; });
  const checked = checkPlan(plan, { owner: 'o', keep });
  assert.deepEqual(checked.go.map((x) => x.branch), ['claude/done']);
  assert.deepEqual(checked.refused.map((x) => [x.branch, x.refused]), [['claude/kept', `it is on Astra's keep list: ${KEPT.why}`], ['main', 'it is a "keep" branch']]);
  // The plan of 2026-11-14 said "delete" before the list existed: refused before GitHub is asked anything.
  const old = { schema: PLAN_SCHEMA, rows: [
    { delete: true, group: 'delete', owner: 'o', repo: 'r', branch: 'claude/kept', sha: SHA },
    { delete: true, group: 'delete', owner: 'o', repo: 'r', branch: 'claude/done', sha: SHA },
  ] };
  const gh = fakeGitHub([br({ name: 'main' }), br({ name: 'claude/kept' }), br({ name: 'claude/done' })]);
  const undoLog = join(mkdtempSync(join(tmpdir(), 'sweeper-')), 'undo.jsonl');
  const a = await apply('t', old, { owner: 'o', yes: true, undoLog, now: NOW, keep, fetchFn: gh.fetchFn });
  assert.deepEqual(gh.writes, [['DELETE', 'https://api.github.com/repos/o/r/git/refs/heads/claude/done', null]], 'only the branch that is not kept');
  assert.deepEqual(a.skipped.map((x) => [x.branch, x.skipped]), [['claude/kept', `it is on Astra's keep list: ${KEPT.why}`]]);
  assert.deepEqual(readFileSync(undoLog, 'utf8').trim().split('\n').map((l) => JSON.parse(l).branch), ['claude/done'], 'no undo line for a branch it left alone');
  // Its dry run says the same, and the same branch with the list gone would be deleted: the list is what keeps it.
  const one = { ...old, rows: [old.rows[0]] };
  const dry = await apply('t', one, { owner: 'o', undoLog, now: NOW, keep, fetchFn: fakeGitHub([br({ name: 'claude/kept' })]).fetchFn });
  assert.deepEqual([dry.done.length, dry.skipped.map((x) => x.branch)], [0, ['claude/kept']]);
  const none = await apply('t', one, { owner: 'o', undoLog, now: NOW, fetchFn: fakeGitHub([br({ name: 'claude/kept' })]).fetchFn });
  assert.deepEqual(none.done.map((x) => [x.branch, x.dryRun]), [['claude/kept', true]]);
});

test('a kept branch that is not on GitHub any more is reported, so a renamed repo or a lost branch is noticed', () => {
  const keep = parseKeepList(keepText([KEPT, { ...KEPT, branch: 'claude/lost' }, { ...KEPT, repo: 'renamed' }]));
  const r = analyze(listed(), { now: NOW, keep });
  assert.deepEqual(keepNotes(keep, r), [
    'Astra\'s keep list names o/r claude/lost, and GitHub has no such branch (deleted, or its repo renamed): check that entry.',
    'Astra\'s keep list names o/renamed claude/kept, and GitHub has no such branch (deleted, or its repo renamed): check that entry.',
  ]);
  assert.deepEqual(keepNotes([], r), []);
});

test('GitHub Aquarium\'s page has the branch-sweeper tool box with made-up examples, and the map lists the tool', () => {
  const page = readFileSync(new URL('../apps/pet-programs/github-goldfish-20261018.html', import.meta.url), 'utf8');
  assert.match(page, /<div class="toolbox branch-sweeper">/);
  assert.match(page, /id="branch-sweeper"/);
  assert.match(page, /<script type="application\/json" id="branch-sweeper-examples">/);
  assert.equal((page.match(/toolbox-name" aria-expanded="true">branch-sweeper</g) || []).length, 1, 'listed once, not again in the plain tool list');
  const map = JSON.parse(readFileSync(new URL('../system-map.json', import.meta.url), 'utf8'));
  const node = map.nodes.find((n) => n.id === 'branch-sweeper');
  assert.deepEqual([node.of, node.type, node.label], ['program-2', 'tool', LABEL]);
  assert.ok(map.access.grants.some((g) => g.subjects.includes('id:branch-sweeper') && g.w === 'yes' && g.status === 'written'), 'its write grant is asked for, not enforced');
});
