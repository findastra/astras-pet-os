// One home for every pet picture (Astra, 2026-10-24, all recommended): art/latest gives every dated picture a name that
// never changes, the build keeps it current, the hub's own pages link it, and the checker finds copies, dated links and
// a private hub. Claude Opus 5.5, 2026-10-24.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { datedLinks, fixLinks, latestPath, latestPlan, planFor, HUB_RAW, LATEST } from '../scripts/one-picture-home-20261024.mjs';
import { audit, describe, isLinkFile, HUB_RECORDS } from '../scripts/one-art-source-20261017.mjs';
import { analyze, artItems } from '../scripts/outstanding-items-20261021.mjs';

const root = fileURLToPath(new URL('..', import.meta.url)).replace(/[\\/]$/, '');

test('a stable name is the same path under art/latest without its date; frames and moods are already stable', () => {
  assert.equal(latestPath('art/icons/chat-rat-20261012.png'), 'art/latest/icons/chat-rat.png');
  assert.equal(latestPath('desktop-art/rgbee/idle-20261011.png'), 'art/latest/desktop-art/rgbee/idle.png');
  assert.equal(latestPath('art/app-icons/chat-rat/icon-20261009.ico'), 'art/latest/app-icons/chat-rat/icon.ico');
  assert.equal(latestPath('desktop-art/fuzzboi-friend/layers/eyes.png'), 'art/latest/desktop-art/fuzzboi-friend/layers/eyes.png');
  assert.equal(latestPath('art/frames/drum-dog/idle.png'), null);
  assert.equal(latestPath('art/moods/rgbee/happy.png'), null);
  assert.equal(latestPath('desktop-art/chat-rat/desktop-pet-20261011.json'), null);
});

test('the newest drawing wins, and a dated one beats an undated twin', () => {
  const plan = latestPlan(['desktop-art/rgbee/idle-20261011.png', 'desktop-art/rgbee/idle-20261024.png', 'desktop-art/rgbee/idle-20261018.png', 'art/drafts/x/happy.png', 'art/drafts/x/happy-20261009.png']);
  assert.deepEqual(plan, { 'art/latest/desktop-art/rgbee/idle.png': 'desktop-art/rgbee/idle-20261024.png', 'art/latest/drafts/x/happy.png': 'art/drafts/x/happy-20261009.png' });
});

test('art/latest in this hub is current: the same pictures as its plan, byte for byte, and nothing else', () => {
  const plan = planFor(root);
  const index = JSON.parse(readFileSync(join(root, LATEST, 'index.json'), 'utf8'));
  assert.deepEqual(index.pictures, plan, 'run npm run build');
  assert.equal(index.base, HUB_RAW);
  const walk = (d) => readdirSync(join(root, d)).flatMap((n) => (statSync(join(root, d, n)).isDirectory() ? walk(`${d}/${n}`) : [`${d}/${n}`]));
  const files = walk(LATEST).filter((p) => p !== `${LATEST}/index.json`).sort();
  assert.deepEqual(files, Object.keys(plan).sort(), 'art/latest holds exactly the planned pictures');
  for (const [stable, source] of Object.entries(plan)) assert.ok(readFileSync(join(root, stable)).equals(readFileSync(join(root, source))), `${stable} is ${source}`);
  assert.ok(Object.keys(plan).length > 400);
});

test('dated links move to art/latest on every address and in the offline fallback; stable links stay', () => {
  const plan = latestPlan(['art/icons/rgbee-20261012.png', 'desktop-art/rgbee/idle-20261011.png', 'art/frames/rgbee/idle.png']);
  const text = [
    `<img src="${HUB_RAW}art/icons/rgbee-20261012.png" onerror="this.src='../astras-pet-os/art/icons/rgbee-20261012.png'">`,
    '![](https://cdn.jsdelivr.net/gh/findastra/astras-pet-os@main/desktop-art/rgbee/idle-20261011.png)',
    `${HUB_RAW}art/frames/rgbee/idle.png ${HUB_RAW}art/latest/icons/rgbee.png`,
  ].join('\n');
  assert.equal(datedLinks(text, plan).length, 3);
  const fixed = fixLinks(text, plan);
  assert.ok(fixed.includes(`${HUB_RAW}art/latest/icons/rgbee.png" onerror="this.src='../astras-pet-os/art/latest/icons/rgbee.png'`));
  assert.ok(fixed.includes('@main/art/latest/desktop-art/rgbee/idle.png'));
  assert.ok(fixed.includes(`${HUB_RAW}art/frames/rgbee/idle.png`));
  assert.deepEqual(datedLinks(fixed, plan), []);
  // An older drawing's link moves too: the stable name always shows the newest one.
  assert.equal(datedLinks(`${HUB_RAW}desktop-art/rgbee/idle-20261001.png`, latestPlan(['desktop-art/rgbee/idle-20261011.png'])).length, 1);
});

test("the hub's own pages and notes link art/latest; its records keep their dated links", () => {
  const plan = planFor(root);
  const tracked = execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' }).split('\n').filter(Boolean);
  const dated = [];
  for (const path of tracked) {
    if (HUB_RECORDS.test(path) || !isLinkFile({ path }) || !existsSync(join(root, path))) continue;
    const n = datedLinks(readFileSync(join(root, path), 'utf8'), plan).length;
    if (n) dated.push(`${path}: ${n}`);
  }
  assert.deepEqual(dated, [], 'node scripts/one-picture-home-20261024.mjs --fix <file>');
});

test('the checker fails on a private hub and on a dated link, and says so in plain words', () => {
  const hub = { private: true, files: [{ path: 'art/icons/rgbee-20261012.png', sha: 'i1' }, { path: 'art/latest/icons/rgbee.png', sha: 'i1' }],
    texts: { 'INTELLIGENCE-LEVELS.md': `${HUB_RAW}art/icons/rgbee-20261012.png`, 'changes/old-20261012.md': `${HUB_RAW}art/icons/rgbee-20261012.png` } };
  const r = audit({ 'astras-pet-os': hub, rgbee: { files: [{ path: 'README.md', sha: 'r' }], texts: { 'README.md': `<img src="${HUB_RAW}art/icons/rgbee-20261012.png">` } } }, null);
  assert.equal(r.verdict, 'Incorrect');
  assert.deepEqual(r.findings.map((f) => [f.repo, f.kind, f.path]), [['astras-pet-os', 'hub-private', ''], ['astras-pet-os', 'dated-link', 'INTELLIGENCE-LEVELS.md'], ['rgbee', 'dated-link', 'README.md']]);
  assert.match(describe(r.findings[0]), /private: no hosted picture loads/);
  assert.match(describe(r.findings[2]), /README\.md links a dated picture: .*rgbee-20261012\.png \(should be .*latest\/icons\/rgbee\.png\)/);
  hub.private = false; hub.texts = {};
  assert.equal(audit({ 'astras-pet-os': hub, rgbee: { files: [] } }, null).verdict, 'Correct');
});

test("the daily check's findings show in GitHub Aquarium's outstanding items, one row per repo", () => {
  const now = Date.parse('2026-10-24T12:00:00Z');
  const check = { checked: '2026-10-24T06:00:00Z', findings: [{ repo: 'astras-pet-os', kind: 'hub-private', path: '' },
    { repo: 'vscode-angel', kind: 'copy', path: 'desktop-art/vscode-angel/idle-20261011.png' }, { repo: 'vscode-angel', kind: 'dated-link', path: 'README.md' }] };
  const items = artItems(check, { now });
  assert.deepEqual(items.map((i) => [i.group, i.title]), [['broken', 'astras-pet-os is private: no hosted pet picture loads'], ['chat', 'vscode-angel: 1 picture kept outside the hub, 1 link to a dated picture']]);
  assert.equal(artItems({ checked: '2026-10-20T06:00:00Z', findings: [] }, { now })[0].title, 'The daily picture check last ran 2026-10-20');
  assert.deepEqual(artItems(null), []);
  const r = analyze({ owner: 'findastra', repos: [] }, { now, art: check });
  assert.equal(r.counts.broken, 1);
  assert.equal(r.counts.chat, 1);
});
