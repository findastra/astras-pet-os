// The Flash Audit on The Farm (Astra, 2026-11-08: "I think the flash audit needs to be a panel on the farm so that each
// of those shows up as a tool and I can click it"; deck "The Farm: art and lights", "All recommended": a tool box in
// The Farm's L1, the last results at once, Run through a helper on her PC, and The Farm owns it). Claude Opus 5.5, 2026-11-08.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { AUTOMATED, GOLDFISH_WORDS, AUDITOR, HELPER, HELPER_PORT, HELPER_PAGE_DATA, checkResults, latestLedger, LABEL } from '../scripts/flash-audit-checks-20261108.mjs';
import { createHelper, LOCAL } from '../scripts/flash-audit-helper-20261108.mjs';
import { readMatrix } from '../scripts/flash-matrix-20261018.mjs';
import { readSpawnerSources, spawnerFiles, pagePath } from '../scripts/pet-program-pages-20261018.mjs';

const root = fileURLToPath(new URL('..', import.meta.url)).replace(/[\\/]$/, '');
const matrix = readMatrix(`${root}/docs/flash-audit-20261014.md`).rows;

test('the checks the page runs are exactly the ones the auditor checks by itself', () => {
  const src = readFileSync(`${root}/${AUDITOR}`, 'utf8');
  assert.deepEqual([...new Set(src.match(/'A\d{2}'/g).map((s) => s.slice(1, -1)))].sort(), [...AUTOMATED].sort());
  for (const id of [...AUTOMATED, ...GOLDFISH_WORDS]) assert.ok(matrix.some((r) => r.id === id), `${id} is a check in the matrix`);
});

test('a check over every pet program: who passes and each finding', () => {
  const ledger = { date: '20261108', pets: [
    { icon: 'One', repo: 'one', audited: { ref: 'main' }, rows: [{ check: 'A55', status: 'Missing', detail: 'no idle picture' }] },
    { icon: 'Two', repo: 'two', audited: { ref: 'main' }, rows: [{ check: 'A14', status: 'Incorrect', detail: 'x' }] },
    { icon: 'Three', repo: 'three', audited: null, rows: [] },
  ] };
  const r = checkResults(ledger, 'A55');
  assert.equal(r.audited, 2, 'a pet with no repo to read is not counted');
  assert.equal(r.passing, 1);
  assert.deepEqual(r.findings.map((f) => [f.pet, f.status]), [['One', 'Missing']]);
  assert.equal(r.counts.Missing, 1);
  const saved = latestLedger(root);
  assert.ok(saved && /^\d{8}$/.test(saved.date) && saved.pets.length > 50, 'the newest saved run is found');
});

test("The Farm's L1 has the flash-audit tool box: 61 checks in the matrix's order, Run only where the auditor checks", () => {
  const html = spawnerFiles(readSpawnerSources(root))[pagePath('astras-pet-os')];
  const box = html.slice(html.indexOf('<div class="toolbox pet-box flash-audit'), html.indexOf('>friendly-farmer-L2-control-panel<'));
  assert.ok(box.length > 1000, 'the tool box is on the page');
  assert.match(html.slice(html.indexOf('>friendly-farmer-L1-control-panel<'), html.indexOf('>friendly-farmer-L2-control-panel<')), /class="toolbox pet-box flash-audit/, 'in L1');
  const ids = [...box.matchAll(/<li class="pill flash-check" data-check="(A\d{2})">/g)].map((m) => m[1]);
  assert.deepEqual(ids, matrix.map((r) => r.id), 'every check, most important first');
  for (const r of matrix) {
    const at = box.indexOf(`data-check="${r.id}"`), next = box.indexOf('<li class="pill flash-check"', at + 1);
    const li = box.slice(at, next < 0 ? box.length : next);
    assert.ok(li.includes(`<span class="item-name">${r.dot} ${r.id} `), `${r.id} shows its dot`);
    assert.equal(li.includes(`data-flash-run="${r.id}"`), AUTOMATED.includes(r.id), `${r.id}: Run only where the auditor checks it`);
    if (GOLDFISH_WORDS.includes(r.id)) assert.ok(li.includes('GitHub Goldfish’s check'), `${r.id} is Goldfish's`);
  }
  assert.equal((html.match(/class="item-name">flash-audit</g) || []).length, 0, 'the tool is the box, not a second pill');
  assert.match(html, /<script src="\.\.\/flash-audit-control-20261108\.js"><\/script>/, 'its Run buttons and newest results');
  const others = spawnerFiles(readSpawnerSources(root))[pagePath('rift-rabbit')];
  assert.doesNotMatch(others, /flash-audit-control|class="items flash-checks"/, 'only on The Farm');
});

test('the Flash Audit is The Farm\'s tool on the System Map; Goldfish keeps the word checks', () => {
  const map = JSON.parse(readFileSync(`${root}/system-map.json`, 'utf8'));
  const node = map.nodes.find((n) => n.id === 'flash-audit');
  assert.equal(node.of, 'farm');
  assert.equal(node.label, LABEL);
  const doc = readFileSync(`${root}/docs/flash-audit-20261014.md`, 'utf8');
  assert.match(doc, /Owner: \*\*Friendly Farmer\*\*, program \*\*The Farm\*\*/);
  assert.match(doc, new RegExp(`Tool label: \`${LABEL}\``));
});

test('the helper takes a run only from a page this PC serves, one run at a time, and writes the page data', async () => {
  for (const ok of ['http://127.0.0.1:40080', 'http://localhost', 'http://[::1]']) assert.match(ok, LOCAL);
  for (const bad of ['https://findastra.github.io', 'http://127.0.0.1.evil.com', 'null', 'http://localhost.evil.com:1']) assert.doesNotMatch(bad, LOCAL);
  const dir = mkdtempSync(join(tmpdir(), 'flash-helper-'));
  try {
    mkdirSync(join(dir, 'farm', 'scripts'), { recursive: true });
    // A stand-in auditor: waits a moment, then writes one pet's ledger where it is told.
    writeFileSync(join(dir, 'farm', 'scripts', 'fake-auditor.mjs'), "import { mkdirSync, writeFileSync } from 'node:fs';\nsetTimeout(() => { mkdirSync(process.argv[2], { recursive: true }); writeFileSync(process.argv[2] + '/ledger.json', JSON.stringify([{ icon: 'One', repo: 'one', audited: { ref: 'main' }, rows: [{ check: 'A55', status: 'Missing', detail: 'no idle picture' }] }])); }, 300);\n");
    const data = join(dir, 'data');
    const { server, state } = createHelper({ root: join(dir, 'farm'), data, auditor: 'scripts/fake-auditor.mjs' });
    await new Promise((r) => server.listen(0, '127.0.0.1', r));
    const base = `http://127.0.0.1:${server.address().port}`;
    const post = (origin) => fetch(`${base}/run`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(origin ? { Origin: origin } : {}) }, body: JSON.stringify({ check: 'A55' }) });
    assert.equal((await post('https://findastra.github.io')).status, 403, 'another site cannot start a run');
    assert.equal((await post(null)).status, 403, 'a request with no page behind it cannot either');
    const first = await post('http://127.0.0.1:40080');
    assert.equal(first.status, 202);
    assert.equal(first.headers.get('access-control-allow-origin'), 'http://127.0.0.1:40080');
    assert.equal((await post('http://127.0.0.1:40080')).status, 409, 'one run at a time');
    for (let i = 0; i < 100 && state.running; i++) await new Promise((r) => setTimeout(r, 50));
    const status = await (await fetch(`${base}/status`)).json();
    assert.equal(status.exit, 0, status.error || 'the run finished');
    const page = readFileSync(join(data, 'flash-audit-page-data.js'), 'utf8');
    assert.match(page, /^window\.flashAuditLedger = \{"date":"\d{8}","pets":\[\{"icon":"One"/);
    assert.ok(existsSync(join(data, 'ledger-latest.json')));
    // Where it answers is written on this PC only, for the page to read (no committed file names a local address).
    assert.equal(readFileSync(join(data, HELPER_PAGE_DATA), 'utf8'), `window.flashAuditHelper = {"control":"${base}"};\n`);
    server.close();
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('Startup Star starts the Flash Audit helper at sign-in, on its own port', () => {
  const cs = readFileSync(`${root}/scripts/desktop-pets-20261011.cs`, 'utf8');
  assert.match(cs, /list\.Add\(new Entry\{Repo="flash-audit",Pet="Flash Audit",Exe=node,Marker="flash-audit-helper",Needs=Path\.Combine\(PetFiles\.Root,"scripts","flash-audit-helper-20261108\.mjs"\)\}\);/);
  assert.match(cs, /AlsoAtSignIn=\{[^}]*"flash-audit"\}/);
  assert.equal(HELPER, 'scripts/flash-audit-helper-20261108.mjs');
  assert.equal(HELPER_PORT, 38778);
  const js = readFileSync(`${root}/apps/flash-audit-control-20261108.js`, 'utf8');
  assert.ok(js.includes(HELPER_PAGE_DATA), 'the page finds the helper through the file it writes');
  assert.doesNotMatch(js, new RegExp(`:${HELPER_PORT}\\b`), 'and never names its address');
});
