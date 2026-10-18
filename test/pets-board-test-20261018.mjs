// Pets Board: the chart is built from data, never kept by hand, and its job only ever writes the board branch.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { buildBoard, prState, whoOf } from '../scripts/pets-board-20261018.mjs';

const read = (f) => readFileSync(new URL('../' + f, import.meta.url), 'utf8');

test('a pull request reads as ready, conflict, checks failing, checking or draft', () => {
  assert.equal(prState({ mergeable: 'MERGEABLE', checks: 'SUCCESS' }), 'ready');
  assert.equal(prState({ mergeable: 'MERGEABLE', checks: null }), 'ready');
  assert.equal(prState({ mergeable: 'CONFLICTING', checks: 'SUCCESS' }), 'conflict');
  assert.equal(prState({ mergeable: 'MERGEABLE', checks: 'FAILURE' }), 'checks failing');
  assert.equal(prState({ mergeable: 'UNKNOWN', checks: null }), 'checking');
  assert.equal(prState({ isDraft: true, mergeable: 'MERGEABLE' }), 'draft');
});

test('who is working on it comes from the branch name', () => {
  assert.equal(whoOf('claude/flash-audit-fixes-20261017'), 'Claude');
  assert.equal(whoOf('codex/l3-activity-20261016'), 'Codex');
  assert.equal(whoOf('farmer/rounds-20261018'), 'Farmer');
  assert.equal(whoOf('fix-typo'), 'Astra');
});

test('every pet gets one row, in the order they were made, and only ready pull requests ask for an OK', () => {
  const programs = [{ number: 2, icon: 'Goldfish', program: 'Aquarium', repo: 'gold' }, { number: 1, icon: 'Farmer', program: 'The Farm', repo: 'hub' }, { number: 3, icon: 'Secret', program: 'Vault', repo: 'secret' }];
  const repos = {
    hub: { lastCommit: '2026-10-18T01:00:00Z', prs: [{ number: 7, url: 'u7', headRefName: 'claude/x', mergeable: 'MERGEABLE', checks: 'SUCCESS' }, { number: 8, url: 'u8', headRefName: 'codex/y', mergeable: 'CONFLICTING' }] },
    gold: { lastCommit: '2026-10-17T01:00:00Z', prs: [] },
    secret: { hidden: true, prs: [] },
  };
  const status = { updated: '2026-10-11T00:00:00Z', pets: { hub: { pet: 'Farmer', mood: 'sick', says: 'Need: a token', needs: [] } }, needs_astra: [{ repo: 'hub', pet: 'Farmer', need: 'a token' }] };
  const md = buildBoard({ programs, registry: { pets: [] }, status, repos, sites: {}, now: 'now', iconFor: () => null });
  const rows = md.split('\n').filter((l) => /^\| \d/.test(l));
  assert.deepEqual(rows.map((l) => l.split('|')[1].trim()), ['1', '2', '3']);
  assert.match(rows[0], /OK to merge #7/);
  assert.doesNotMatch(rows[0], /OK to merge[^|]*#8/);
  assert.match(rows[0], /#8\]\(u8\) conflict/);
  assert.match(rows[0], /Claude, Codex/);
  assert.match(rows[0], /a token/);
  assert.match(rows[2], /\| private \|/);
});

test('the board job only writes BOARD.md on the board branch, with pinned actions', (t) => {
  // The workflow file is added separately (pushing workflows needs the token's "workflow" permission).
  if (!existsSync(new URL('../.github/workflows/pets-board.yml', import.meta.url))) return t.skip('.github/workflows/pets-board.yml is not added yet');
  const wf = read('.github/workflows/pets-board.yml').replace(/\r\n/g, '\n');
  const perms = /^permissions:\n((?:  .+\n)+)/m.exec(wf);
  assert.ok(perms, 'one top-level permissions block');
  assert.deepEqual(perms[1].trim().split('\n').map((l) => l.trim()), ['contents: write']);
  assert.equal((wf.match(/^\s*permissions:/gm) || []).length, 1, 'no job widens them');
  for (const m of wf.matchAll(/uses:\s*(\S+)/g)) assert.match(m[1], /@[0-9a-f]{40}$/, `${m[1]} is pinned by commit SHA`);
  assert.match(wf, /git push -q origin HEAD:board/);
  assert.doesNotMatch(wf, /origin (HEAD:)?main|gh pr (create|merge)|--force|-f /, 'never main, never a pull request, never a force-push');
});
