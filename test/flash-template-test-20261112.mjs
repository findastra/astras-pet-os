// The Flash Audit's page checks follow the Model Pet Program (Astra, 2026-11-12: "those two things kind of need to go
// hand in hand, so that when we do audits and we're looking at user interface, that we're auditing it based off of
// what's on the template, and then those are items on the Flash audit"). Claude Opus 5.5 (claude-opus-5-5), 2026-11-12.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { TEMPLATE_PARTS, TEMPLATE_CHECKS, ORDER_CHECK, PHONE_PAGE, checkPage, pageParts, templateAudit } from '../scripts/flash-template-20261112.mjs';
import { AUTOMATED, PREFLIGHT_LEFT_OUT, checkResults } from '../scripts/flash-audit-checks-20261108.mjs';
import { readMatrix } from '../scripts/flash-matrix-20261018.mjs';
import { readSpawnerSources, spawnerFiles, spawnerPages, pagePath, PANELS, MODEL_PROGRAM, HUB, esc } from '../scripts/pet-program-pages-20261018.mjs';

const root = fileURLToPath(new URL('..', import.meta.url)).replace(/[\\/]$/, '');
const matrix = readMatrix(`${root}/docs/flash-audit-20261014.md`).rows;
const src = readSpawnerSources(root);
const files = spawnerFiles(src);
const model = files[MODEL_PROGRAM.page];
const checks = (html, repo = 'some-pet') => checkPage(model, html, { repo });
const ids = (rows) => rows.map((r) => r.check);

test('every part of the template is one Flash Audit check, in the template\'s order', () => {
  for (const p of PANELS) assert.ok(TEMPLATE_PARTS.some((x) => x.part === p), `the template's ${p} has no Flash Audit check`);
  assert.deepEqual(pageParts(model).map((p) => p.part), TEMPLATE_PARTS.map((p) => p.part), 'the checks run top to bottom, like the template');
  assert.equal(new Set(TEMPLATE_CHECKS).size, TEMPLATE_CHECKS.length, 'one part, one check');
  const at = matrix.findIndex((r) => r.id === TEMPLATE_CHECKS[0]);
  assert.deepEqual(matrix.slice(at, at + TEMPLATE_CHECKS.length).map((r) => r.id), TEMPLATE_CHECKS, 'the matrix lists them together, in the same order');
  const doc = readFileSync(`${root}/docs/flash-audit-20261014.md`, 'utf8');
  const section = doc.slice(doc.indexOf('### 6. The page: the Model Pet Program, part by part'), doc.indexOf('### 7. Tutorials'));
  for (const id of TEMPLATE_CHECKS) assert.match(section, new RegExp(`\\| (⚪|🔵) ${id} \\|`), `${id} is in "6. The page"`);
});

test('the template passes every one of its own checks', () => {
  assert.deepEqual(checks(model, 'model-pet-program'), []);
});

test('a page unlike the template fails the check of the part that differs', () => {
  const page = files[pagePath('rift-rabbit')];
  assert.deepEqual(checks(page, 'rift-rabbit'), [], 'Rift Rabbit\'s page matches the template today');
  const cut = (html, part) => { const p = pageParts(html).find((x) => x.part === part); return html.slice(0, p.at) + html.slice(p.end); };
  // A part that is not there is Missing on its own check.
  assert.deepEqual(checks(cut(page, 'clicker-training-panel'), 'rift-rabbit').map((r) => [r.check, r.status]), [['A41', 'Missing']]);
  assert.deepEqual(checks(cut(page, 'friends-list-panel'), 'rift-rabbit').map((r) => [r.check, r.status]), [['A39', 'Missing']]);
  // Parts out of order, or a panel the template does not have.
  const parts = pageParts(page), emo = parts.find((p) => p.part === 'emotions-panel'), notes = parts.find((p) => p.part === 'session-notes-panel');
  const swapped = page.slice(0, notes.at) + page.slice(emo.at, emo.end) + page.slice(notes.end, emo.at) + page.slice(notes.at, notes.end) + page.slice(emo.end);
  assert.ok(ids(checks(swapped, 'rift-rabbit')).includes(ORDER_CHECK), 'emotions before the session notes');
  const extra = page.replace('<details class="panel levels"', '<details class="panel special" open><summary><span class="legend">rift-rabbit-special-panel</span></summary><p>x</p></details><details class="panel levels"');
  assert.deepEqual(ids(checks(extra, 'rift-rabbit')), [ORDER_CHECK], 'a special panel above the levels');
  // A part drawn differently: how it folds, its More details, what it holds.
  const cyber = parts.find((p) => p.part === 'cyberhome-panel');
  const folding = page.slice(0, cyber.at) + page.slice(cyber.at, cyber.end).replace(' data-stays-open', '').replace('<summary tabindex="-1">', '<summary>') + page.slice(cyber.end);
  assert.deepEqual(ids(checks(folding, 'rift-rabbit')), ['A62']);
  const l1 = parts.find((p) => p.part === 'L1-control-panel');
  const noAbout = page.slice(0, l1.at) + page.slice(l1.at, l1.end).replace(/<details class="about">(?![\s\S]*<details class="about">)[\s\S]*?<\/dl><\/details>/, '') + page.slice(l1.end);
  assert.deepEqual(ids(checks(noAbout, 'rift-rabbit')), ['A66'], 'L1 without its More details');
  assert.deepEqual(ids(checks(page.replace(/(<span class="version"[^>]*>)v(\d+)\.(\d+)\.\d+/, '$1v$2.$3'), 'rift-rabbit')), ['A63'], 'a version with no patch number');
  assert.deepEqual(ids(checks(page.replace(/<span class="item-name">play-with<\/span>/, '<span class="item-name">play</span>'), 'rift-rabbit')), ['A67'], 'no play-with trick');
  assert.deepEqual(ids(checks(page.replace('footer-title">Find Out More<', 'footer-title">More<'), 'rift-rabbit')), ['A51']);
  assert.deepEqual(ids(checks(page.replace(/<span class="key update"><\/span>/, ''), 'rift-rabbit')), ['A65'], 'the key to the lights without yellow');
  // A level no grant reaches keeps its row, saying nothing here: still missing, and the check says so instead of "no
  // row" (Astra, 2026-11-13: "ok fix them"; The Farm's L1 said nothing here). The Farm's own tools now hold an L1 grant.
  const bareL1 = page.replace(/<details class="rwx-row"><summary><span class="lv">L1<\/span>[\s\S]*?<\/details>(?=<details class="rwx-row"><summary><span class="lv">L2<)/,
    '<div class="rwx-row none"><span class="lv">L1</span><span class="should">Should be</span><span class="gwho">a program or tool · nothing here</span></div>');
  const bare = checks(bareL1, 'rift-rabbit');
  assert.deepEqual(bare.map((r) => [r.check, r.status]), [['A70', 'Missing']], 'L1 with nothing here');
  assert.match(bare[0].detail, /says nothing here: no grant reaches it/);
  assert.ok(!ids(checks(files[pagePath(HUB)], HUB)).includes('A70'), 'The Farm\'s R W X has a row with a grant at every level');
  // Data Chip's phone is Data Dealer's only.
  assert.deepEqual(checks(files[pagePath(PHONE_PAGE)], PHONE_PAGE), []);
  assert.deepEqual(ids(checks(files[pagePath(PHONE_PAGE)], 'rift-rabbit')), ['A44'], 'the phone on another pet\'s page');
  // Pills and lights like the template's.
  assert.deepEqual(ids(checks(page.replace(/(<li class="pill"><span class="lights">(?:<button[^>]*><\/button>){2}<\/span>)/, '$1<img src="x.png" alt="">'), 'rift-rabbit')), ['A46'], 'an app icon in a pill');
  assert.deepEqual(ids(checks(page.replace(/<span class="lights">(<button[^>]*><\/button>)<button[^>]*><\/button><\/span>/, '<span class="lights">$1</span>'), 'rift-rabbit')), ['A48'], 'one light where two belong');
});

test('every build checks every pet program page, and The Farm\'s flash-audit checks show it with no Run', () => {
  const pages = spawnerPages(src);
  const results = templateAudit(model, pages.map((d) => ({ repo: d.repo, pet: d.pet, home: d.home, page: pagePath(d.repo), html: files[pagePath(d.repo)] })));
  assert.equal(results.pets.length, pages.length);
  const farm = files[pagePath(HUB)];
  const box = farm.slice(farm.indexOf('<ul class="items flash-checks"'));
  for (const id of TEMPLATE_CHECKS) {
    const at = box.indexOf(`data-check="${id}"`), next = box.indexOf('<li class="pill flash-check"', at + 1);
    const li = box.slice(at, next < 0 ? box.length : next);
    const res = checkResults(results, id);
    assert.ok(li.includes(`${res.passing} of ${res.audited} pet program pages match`), `${id} shows the build's result`);
    assert.ok(li.includes('href="model-pet-program-20261102.html"'), `${id} links the template`);
    assert.ok(!li.includes('data-flash-run='), `${id} needs no Run: the build checks it`);
    for (const f of res.findings) assert.ok(li.includes(`<b>${esc(f.pet)}</b>`), `${id}: ${f.pet}'s finding is listed`);
  }
});

test('the auditor no longer counts checks it does not run, and takes none of the old page markers', () => {
  for (const id of TEMPLATE_CHECKS) assert.ok(!AUTOMATED.includes(id), `${id} is compared with the template, not run by the auditor`);
  for (const id of ['A41', 'A44', 'A45', 'A52']) assert.ok(PREFLIGHT_LEFT_OUT.includes(id), `Goldfish's preflight row ${id} looks for a retired page marker`);
  const auditor = readFileSync(`${root}/scripts/idle-flash-audit-20261017.mjs`, 'utf8');
  assert.match(auditor, /!PREFLIGHT_LEFT_OUT\.includes\(r\.check\)/);
});
