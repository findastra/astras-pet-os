// GitHub Aquarium's branch-sweeper (Astra, 2026-11-14: "a branch deleter, assessor and deleter", then "Plan is fine,
// build it"). Every branch is sorted into delete, ask or keep; nothing that may still be in use is ever offered;
// deleting needs a plan, --yes and a fresh check, and writes the undo line first. Claude Opus 5.5, 2026-11-14.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { analyze, apply, checkPlan, makePlan, namedInCard, openCardText, pageData, protects, undo, verdict, LABEL, LIMITS, PLAN_SCHEMA, RECENT_DAYS, STALE_DAYS } from '../scripts/branch-sweeper-20261114.mjs';

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

/** A pretend GitHub: answers the sweeper's queries from `branches`, records every write. */
function fakeGitHub(branches) {
  const writes = [];
  const fetchFn = async (url, init) => {
    const reply = (status, body) => ({ ok: status < 300, status, json: async () => body, text: async () => (body ? JSON.stringify(body) : '') });
    if (url.endsWith('/graphql')) {
      const { query } = JSON.parse(init.body);
      assert.ok(!/mutation/.test(query), 'checking never writes');
      if (/compare/.test(query)) return reply(200, { data: Object.fromEntries(branches.filter((b) => b.name !== 'main').map((b, k) => [`c${k}`, { ref: { compare: { aheadBy: b.aheadBy } } }])) });
      return reply(200, { data: { r0: { name: 'r', isPrivate: true, defaultBranchRef: { name: 'main' }, branchProtectionRules: { nodes: [] }, cards: null,
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
