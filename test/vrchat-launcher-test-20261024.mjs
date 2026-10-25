// Rift Rabbit's Launch buttons (Astra, 2026-10-24): only Rift Rabbit's page loads the launcher script, and it only ever
// talks to Rift Rabbit's own launcher on this PC, at the address and with the code from one fixed file in Documents.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-24.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { readSpawnerSources, spawnerFiles, pagePath, DIR, LAUNCHER_JS } from '../scripts/pet-program-pages-20261018.mjs';
import { findSensitive } from '../scripts/public-safety-20261014.mjs';

const root = fileURLToPath(new URL('..', import.meta.url)).replace(/[\\/]$/, '');
const files = spawnerFiles(readSpawnerSources(root));
const js = readFileSync(`${root}/${DIR}/${LAUNCHER_JS}`, 'utf8');
const rabbit = files[pagePath('rift-rabbit')];

test('only Rift Rabbit\'s page loads the launcher script, after the page script', () => {
  assert.ok(rabbit.includes(`<script src="${LAUNCHER_JS}"></script>`));
  assert.ok(rabbit.indexOf('pet-program-page-') < rabbit.indexOf(LAUNCHER_JS));
  for (const [path, html] of Object.entries(files)) if (path !== pagePath('rift-rabbit')) assert.ok(!html.includes(LAUNCHER_JS), path);
});

test('every mode has a Launch button, off until the watch on this PC answers, and a place for its steps', () => {
  const buttons = rabbit.match(/<button type="button" class="button off" disabled data-launch-go[^>]*>Launch \d\.\d<\/button>/g) || [];
  assert.equal(buttons.length, 8, 'two headsets, four modes each');
  assert.equal((rabbit.match(/data-launch-run hidden/g) || []).length, 8);
});

test('the launcher script reads where to ask only from one fixed file, only on this PC, and only 127.0.0.1', () => {
  assert.match(js, /var LOCAL_LAUNCH = "\.\.\/\.\.\/\.\.\/\.\.\/Astra's PetOS Data\/rift-rabbit\/vr-launch-page-data\.js";/);
  assert.match(js, /if \(!\(location\.protocol === 'file:' \|\| \/\^\(localhost\|127\\\.0\\\.0\\\.1\|\\\[::1\\\]\)\$\/\.test\(location\.hostname\)\)\) return;/);
  assert.deepEqual([...js.matchAll(/script\.setAttribute\('src', (\w+)/g)].map((m) => m[1]), ['LOCAL_LAUNCH']);
  assert.ok(js.includes("!/^http:\\/\\/127\\.0\\.0\\.1:\\d{2,5}\\/$/.test(d.url)"), 'the address must be this PC');
  assert.equal((js.match(/fetch\(/g) || []).length, 1, 'one way out');
  assert.match(js, /fetch\(launcher\.url \+ path, \{ method: 'POST'/);
});

test('the launcher script puts text in with textContent only and runs no code from the watch', () => {
  assert.doesNotMatch(js, /innerHTML|outerHTML|insertAdjacentHTML|document\.write|eval\(|new Function/);
  assert.deepEqual(findSensitive(js), []);
});

// The tracker drawing (Astra, 2026-10-25: "One diagram, and the headset changes too"): one drawing above both headsets,
// every tracker on it once with its serial, the Double pairs as her DoubleHip DoubleChest Tracker has them, and both
// headsets drawn so the page can show the one picked.
test('one tracker drawing, with each tracker once and the Double pairs from her DoubleHip DoubleChest Tracker', async () => {
  const { TRACKERS } = await import('../scripts/vrchat-launch-panel-20261023.mjs');
  assert.equal((rabbit.match(/data-trk-diagram/g) || []).length, 1);
  assert.ok(rabbit.indexOf('data-trk-diagram') < rabbit.indexOf('data-launch-headset='), 'above the headset boxes');
  for (const t of TRACKERS) assert.equal((rabbit.match(new RegExp(`data-serial="${t.serial}"`, 'g')) || []).length, 1, t.serial);
  const pair = (p) => TRACKERS.filter((t) => t.pair === p).map((t) => t.sticker).join(' ');
  assert.equal(pair('hip'), '[W] [C]');
  assert.equal(pair('chest'), '[ ] [M]');
  assert.deepEqual(TRACKERS.filter((t) => t.head).map((t) => t.serial), ['LHR-6963FCE5']);
  assert.ok(rabbit.includes('trk-hs-quest-pro') && rabbit.includes('trk-hs-quest-3'));
  assert.ok(rabbit.includes('data-launch-device="Quest Pro"') && rabbit.includes('data-launch-device="Quest 3"'));
});
