// GitHub Aquarium's outstanding-items and the Pets Board (Astra, 2026-10-21: "Can we get the GitHub goldfish to check
// the outstanding items on GitHub?", then all recommended in findastra/github-goldfish card 006). The list is sorted by
// the merge-order rank, says who acts on each item, never changes GitHub, and stays on Astra's PC: the panel and the
// Pets Board read one fixed file there and show made-up examples anywhere else. Claude Opus 5.5, 2026-10-21.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { analyze, cardNeed, cardTitles, graphql, pageData, prState, toMarkdown, GROUPS, LABEL, PAGE_DATA_PATH, SCHEMA, STALE_DAYS } from '../scripts/outstanding-items-20261021.mjs';
import { readSpawnerSources, spawnerFiles, spawnerPages, pagePath, DIR, ASSETS, PET_PANELS, OUTSTANDING_EXAMPLES, OUTSTANDING_GROUPS, OUTSTANDING_BOARD } from '../scripts/pet-program-pages-20261018.mjs';
import { systemMapData } from '../scripts/system-map-20261012.mjs';

const root = fileURLToPath(new URL('..', import.meta.url)).replace(/[\\/]$/, '');
const read = (f) => readFileSync(`${root}/${f}`, 'utf8');
const NOW = Date.parse('2026-10-21T20:00:00Z');
const pr = (o) => ({ number: 1, title: 'A change', url: 'https://github.com/o/r/pull/1', headRefName: 'claude/x', baseRefName: 'main', isDraft: false, mergeable: 'MERGEABLE', checks: 'SUCCESS', createdAt: '2026-10-20T00:00:00Z', updatedAt: '2026-10-21T00:00:00Z', ...o });
const repo = (o) => ({ owner: 'o', name: 'r', private: false, defaultBranch: 'main', prs: [], branches: [], cards: [], jobs: [], ...o });
const one = (r) => analyze({ owner: 'o', repos: [repo(r)] }, { now: NOW }).items;

test('a pull request reads as ready, stacked, conflict, checks failing, checking or draft', () => {
  assert.equal(prState(pr()), 'ready');
  assert.equal(prState(pr({ baseRefName: 'codex/feature' }), 'main'), 'stacked');
  assert.equal(prState(pr({ baseRefName: 'codex/feature' })), 'ready', 'without the default branch, nothing is called stacked');
  assert.equal(prState(pr({ mergeable: 'CONFLICTING' }), 'main'), 'conflict');
  assert.equal(prState(pr({ checks: 'FAILURE' }), 'main'), 'checks failing');
  assert.equal(prState(pr({ mergeable: 'UNKNOWN' }), 'main'), 'checking');
  assert.equal(prState(pr({ isDraft: true }), 'main'), 'draft');
});

test('each item says who acts: you, a chat, close? or nobody yet', () => {
  const group = (o) => one({ prs: [pr(o)] })[0].group;
  assert.equal(group({}), 'you');
  assert.equal(group({ mergeable: 'CONFLICTING' }), 'chat');
  assert.equal(group({ checks: 'ERROR' }), 'chat');
  assert.equal(group({ baseRefName: 'claude/base' }), 'chat');
  assert.equal(group({ mergeable: 'UNKNOWN' }), 'info');
  assert.equal(group({ isDraft: true }), 'info');
  assert.equal(group({ updatedAt: new Date(NOW - (STALE_DAYS + 1) * 86400000).toISOString() }), 'close');
  assert.equal(group({ updatedAt: new Date(NOW - (STALE_DAYS - 1) * 86400000).toISOString() }), 'you', 'a month is the line for stale');
  assert.deepEqual(GROUPS.map(([g]) => g), ['broken', 'you', 'chat', 'close', 'info']);
});

test('the order is the merge-order rank: security, broken jobs, what others build on, oldest first, stale last', () => {
  const items = analyze({ owner: 'o', repos: [repo({
    prs: [
      pr({ number: 5, title: 'Newer change', createdAt: '2026-10-20T00:00:00Z' }),
      pr({ number: 4, title: 'Older change', createdAt: '2026-10-10T00:00:00Z' }),
      pr({ number: 3, title: 'Fix a security finding', createdAt: '2026-10-19T00:00:00Z' }),
      pr({ number: 2, title: 'The base', headRefName: 'claude/base', createdAt: '2026-10-18T00:00:00Z' }),
      pr({ number: 1, title: 'Built on the base', baseRefName: 'claude/base', createdAt: '2026-10-11T00:00:00Z' }),
      pr({ number: 9, title: 'Forgotten', updatedAt: '2026-09-01T00:00:00Z', createdAt: '2026-09-01T00:00:00Z' }),
    ],
    jobs: [{ name: 'Daily round', event: 'schedule', status: 'completed', conclusion: 'failure', url: 'https://github.com/o/r/actions/runs/1', createdAt: '2026-10-21T17:00:00Z' }],
  })] }, { now: NOW }).items;
  assert.deepEqual(items.map((i) => i.number || i.kind), ['job', 3, 2, 4, 5, 1, 9]);
  assert.equal(items[0].group, 'broken');
  assert.equal(items.find((i) => i.number === 2).note, 'other pull requests are built on it');
  assert.match(items.find((i) => i.number === 1).note, /built on claude\/base/);
});

test('jobs: only a finished run that failed on the default branch is broken', () => {
  const job = (o) => ({ name: 'Build', event: 'push', status: 'completed', conclusion: 'failure', url: 'https://github.com/o/r/actions/runs/2', createdAt: '2026-10-21T00:00:00Z', ...o });
  assert.equal(one({ jobs: [job()] }).length, 1);
  for (const o of [{ conclusion: 'success' }, { conclusion: 'cancelled' }, { conclusion: 'skipped' }, { status: 'in_progress', conclusion: null }]) assert.equal(one({ jobs: [job(o)] }).length, 0, JSON.stringify(o));
});

test('cards: only an open card that waits on the owner, with its own words as data', () => {
  assert.deepEqual(cardNeed('status: open (waiting on Astra: a name for the tool)\nfor: any\n---'), { status: 'open (waiting on Astra: a name for the tool)', need: 'a name for the tool' });
  assert.equal(cardNeed('status: open, waits on Astra: merge (#155)\nfor: any').need, 'merge (#155)');
  assert.equal(cardNeed('status: open (waiting on Astra: three decisions (slides))\nfor: any').need, 'three decisions (slides)');
  assert.ok(cardNeed('status: open\nfor: astra\n---'), 'a card for Astra waits on her');
  assert.equal(cardNeed('status: done 2026-10-20 (waiting on Astra earlier)\nfor: any'), null, 'done is done');
  assert.equal(cardNeed('status: open: any assistant\nfor: any'), null);
  assert.equal(cardNeed('no status line, waiting on Astra'), null);
  assert.deepEqual(cardTitles('| [066: Unity Stable notes](066-any-notes-20261021.md) | any | open |'), { '066-any-notes-20261021.md': '066: Unity Stable notes' });
  const items = one({ cards: [{ name: '066-any-notes-20261021.md', text: 'status: open, waits on Astra: three answers\nfor: any' }, { name: '065-any-done-20261020.md', text: 'status: done\nfor: any' }],
    cardsReadme: '| [066: Unity Stable notes](066-any-notes-20261021.md) | any | open |' });
  assert.equal(items.length, 1);
  assert.equal(items[0].group, 'you');
  assert.equal(items[0].title, '066: Unity Stable notes');
  assert.equal(items[0].url, 'https://github.com/o/r/blob/main/handoffs/066-any-notes-20261021.md');
});

test('branches: work with no pull request, never a publishing branch, an open pull request or a merged branch', () => {
  const items = one({ prs: [pr({ headRefName: 'claude/open' })], branches: [
    { name: 'main', aheadBy: 0 }, { name: 'board', aheadBy: 12 }, { name: 'claude/open', aheadBy: 3 },
    { name: 'claude/merged', aheadBy: 0 }, { name: 'codex/left', aheadBy: 2, committedDate: '2026-10-15T00:00:00Z' }, { name: 'claude/unknown', aheadBy: null },
  ] });
  const branches = items.filter((i) => i.kind === 'branch');
  assert.deepEqual(branches.map((b) => b.branch), ['codex/left']);
  assert.equal(branches[0].group, 'chat');
  assert.equal(branches[0].url, 'https://github.com/o/r/compare/main...codex/left');
});

test('the Markdown is one numbered chart per group, each row with its link', () => {
  const result = analyze({ owner: 'o', repos: [repo({ prs: [pr({ number: 7, title: 'Ready | now' })] })] }, { now: NOW });
  const md = toMarkdown(result, { owner: 'o', checked: '2026-10-21T20:00:00Z', repoCount: 1, privateCount: 0, notes: ['r: only the oldest 50 were read.'] });
  assert.match(md, /^# What waits on you on GitHub/);
  assert.match(md, /## Waiting on you \(1\)\n\n\| # \| Do this \| What \| Repo \| Since \| Link \|/);
  assert.match(md, /\| 1 \| Merge: say OK in a chat \| #7 Ready \\\| now \| r \| 2026-10-20 \| https:\/\/github\.com\/o\/r\/pull\/1 \|/);
  assert.match(md, /## Broken on the main branch \(0\)\n\nNothing is failing on a main branch\./);
  assert.match(md, /## Not covered\n\n- r: only the oldest 50 were read\./);
  assert.ok(md.includes(LABEL));
});

test('the page data is one global with its schema, for this PC only', () => {
  const result = analyze({ owner: 'o', repos: [repo({ prs: [pr()] })] }, { now: NOW });
  const js = pageData(result, { owner: 'o', checked: '2026-10-21T20:00:00Z', repoCount: 1, privateCount: 0 }, []);
  assert.match(js, /^\/\/ Written by github-aquarium-v1\.0-outstanding-items-v1\.0 on this PC\. Private: never commit it\.\nwindow\.githubAquariumOutstandingItems = \{/);
  const d = JSON.parse(js.slice(js.indexOf('= ') + 2).replace(/;\n$/, ''));
  assert.equal(d.schema, SCHEMA);
  assert.equal(d.items.length, 1);
  assert.deepEqual(PAGE_DATA_PATH, ["Astra's PetOS Data", 'github-aquarium', 'outstanding-items-page-data.js']);
});

test('it only reads GitHub: queries and GETs, never a mutation, the token to api.github.com only', async () => {
  await assert.rejects(graphql('t', 'mutation { deleteRef(input: {}) { clientMutationId } }', { fetchFn: () => { throw new Error('must not be sent'); } }), /only reads GitHub/);
  const src = read('scripts/outstanding-items-20261021.mjs');
  assert.deepEqual([...src.matchAll(/method: '([A-Z]+)'/g)].map((m) => m[1]).sort(), ['GET', 'POST'], 'one POST (GraphQL queries) and one GET');
  const calls = [...src.matchAll(/fetchFn\(([^,]+),/g)].map((m) => m[1]);
  assert.equal(calls.length, 2, 'two requests in the whole tool');
  for (const c of calls) assert.match(c, /^[`']https:\/\/api\.github\.com[/$]/, `${c}: only api.github.com gets the token`);
  assert.doesNotMatch(src.replace(/\/\*\*[\s\S]*?\*\/|\/\/.*$/gm, ''), /\bmutation\s*\{|writeFileSync\([^)]*(?:pets\.json|system-map)/);
  assert.match(read('scripts/pets-board-20261018.mjs'), /import \{ collect, petRows, prState, whoOf, LABEL \} from '\.\/outstanding-items-20261021\.mjs'/, 'the Pets Board reads GitHub through this tool, one copy');
  assert.doesNotMatch(read('scripts/pets-board-20261018.mjs'), /api\.github\.com/);
});

test('it is GitHub Aquarium\'s tool on the map, with the Pets Board as its native program', () => {
  const map = JSON.parse(read('system-map.json'));
  const tool = map.nodes.find((n) => n.id === 'outstanding-items');
  const board = map.nodes.find((n) => n.id === 'pets-board');
  assert.equal(tool.of, 'program-2'); assert.equal(tool.type, 'tool'); assert.equal(tool.label, LABEL);
  assert.equal(board.of, 'program-2'); assert.equal(board.type, 'own-program'); assert.equal(board.label, 'github-aquarium-v1.0-pets-board-v1.0');
  assert.ok(map.links.some((l) => l.from === 'outstanding-items' && l.to === 'github'));
  // A native program shows on its pet program page only through a link from the program (2026-10-21: without it the
  // page said "Native programs · 0").
  assert.ok(map.links.some((l) => l.from === 'program-2' && l.to === 'pets-board' && l.carries === 'opens'), 'GitHub Aquarium opens its Pets Board');
  const page = spawnerFiles(readSpawnerSources(root))[pagePath('github-goldfish')];
  assert.match(page, /<h3>Native programs · 1<\/h3>[\s\S]*?class="item-name"[^>]*>Pets Board<\/(a|span)>/, 'the page lists the Pets Board as a native program');
  assert.ok(systemMapData, 'the map builds from it');
  assert.match(read('package.json'), /"outstanding-items": "node scripts\/outstanding-items-20261021\.mjs"/);
});

test('GitHub Aquarium\'s page has the panel after the four levels and the R W X panel; no other page does', () => {
  const files = spawnerFiles(readSpawnerSources(root));
  const page = files[pagePath('github-goldfish')];
  const at = page.indexOf('>github-goldfish-outstanding-items-tool-panel<');
  assert.ok(at > page.indexOf('>github-goldfish-session-notes-panel<') && at < page.indexOf('>github-goldfish-emotions<'), 'after the R W X panel and the session notes, side by side since 2026-10-22');
  for (const [id, label] of OUTSTANDING_GROUPS) assert.ok(page.includes(`<fieldset class="request-group outstanding-group g-${id}"><legend>${label}</legend>`), `${label} has its name in its border`);
  assert.doesNotMatch(page, /class="[^"]*\boutstanding-group (?:broken|you|chat|close|info)\b/, 'no bare group class: `chat` is the chat pill\'s');
  assert.ok(page.includes(`href="${OUTSTANDING_BOARD}"`), 'the Open button goes to the Pets Board');
  assert.equal(typeof PET_PANELS['github-goldfish'], 'function', 'GitHub Aquarium has its own pet panel');
  for (const d of spawnerPages(readSpawnerSources(root))) if (d.repo !== 'github-goldfish') assert.ok(!files[pagePath(d.repo)].includes('outstanding-items-tool-panel'), `${d.repo} has no outstanding-items panel`);
  const m = page.match(/<script type="application\/json" id="outstanding-examples">([^<]*)<\/script>/);
  assert.deepEqual(JSON.parse(m[1]), OUTSTANDING_EXAMPLES);
  for (const e of OUTSTANDING_EXAMPLES) { assert.equal(e.example, true); assert.match(e.title, /^Example: /); assert.match(e.repo, /^example-/); assert.match(e.url, /^https:\/\//); }
});

test('the panel and the Pets Board read the list only from one fixed file on Astra\'s PC, and only there', () => {
  const js = read(`${DIR}/${ASSETS.js}`);
  const board = read('apps/pets-board-20261021.html');
  assert.match(js, /var LOCAL_ITEMS = "\.\.\/\.\.\/\.\.\/\.\.\/Astra's PetOS Data\/github-aquarium\/outstanding-items-page-data\.js";/);
  assert.match(board, /var LOCAL_LIST = "\.\.\/\.\.\/\.\.\/Astra's PetOS Data\/github-aquarium\/outstanding-items-page-data\.js";/);
  assert.match(js, /script\.setAttribute\('src', LOCAL_ITEMS\)/);
  assert.match(board, /script\.setAttribute\('src', LOCAL_LIST\)/);
  for (const [name, src] of [['page script', js], ['Pets Board', board]]) {
    assert.match(src, /var onThisPC = location\.protocol === 'file:' \|\| \/\^\(localhost\|127\\\.0\\\.0\\\.1\|\\\[::1\\\]\)\$\/\.test\(location\.hostname\);/, `${name}: on this PC only`);
    assert.match(src, /d\.schema !== 'github-aquarium-outstanding-items-v1'/, `${name}: checks the list before it shows it`);
    assert.match(src, /new URL\(u\)\.protocol === 'https:'/, `${name}: only https links become links`);
    assert.doesNotMatch(src, /innerHTML|outerHTML|insertAdjacentHTML|document\.write|fetch\(|XMLHttpRequest/, `${name}: textContent only, nothing fetched`);
  }
  const ex = JSON.parse(board.match(/<script type="application\/json" id="examples">([\s\S]*?)<\/script>/)[1]);
  assert.equal(ex.example, true);
  for (const i of ex.items) { assert.equal(i.example, true); assert.match(i.title, /^Example: /); }
  assert.doesNotMatch(board, /(?:href=|"url":)"https:\/\/github\.com\/[^/"]+\/(?!astras-pet-os\/blob\/main\/skills\/)/, 'the public page links no repo but the skills it explains');
});
