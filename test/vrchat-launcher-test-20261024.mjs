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
  assert.equal(buttons.length, 10, 'two headsets, five modes each');
  assert.equal((rabbit.match(/data-launch-run hidden/g) || []).length, 10);
  assert.equal((rabbit.match(/data-launch-switch="rooted"/g) || []).length, 2, 'a Rooted with Magisk tick on each headset');
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

// tracker-strapper (Astra, 2026-10-25, her drawing): her 27 spots once each, in her numbers, before the launches; every
// device id is one Rift Rabbit's launcher knows; today's spots and pairs match the launcher's first settings; the pickers
// stay off until the launcher on this PC answers.
test('tracker-strapper: 27 spots in her numbers, above the launches, today\'s spots, pickers off until the launcher answers', async () => {
  const { SPOTS, DEVICES, WORN, PAIRS, PAIR_SPOTS } = await import('../scripts/vrchat-launch-panel-20261023.mjs');
  assert.deepEqual(SPOTS.map((s) => s.n), Array.from({ length: 27 }, (_, i) => i + 1));
  assert.equal(new Set(SPOTS.map((s) => s.code)).size, 27);
  assert.equal((rabbit.match(/data-strapper/g) || []).length, 1);
  assert.ok(rabbit.indexOf('data-strapper') < rabbit.indexOf('data-launch-headset='), 'above the headset boxes');
  for (const s of SPOTS) {
    assert.equal((rabbit.match(new RegExp(`data-strap-dot="${s.code}"`, 'g')) || []).length, 1, s.code);
    assert.match(rabbit, new RegExp(`<select data-strap-spot="${s.code}" disabled>`));
  }
  const ids = Object.values(DEVICES).flat().map(([id]) => id);
  assert.ok(ids.every((id) => /^(quest-pro|quest-3|(index|quest-pro|quest-3)-controller-(left|right)|hand-tracking|vive-tracker-0[1-9])$/.test(id)));
  assert.deepEqual(WORN, { F: 'quest-pro', H: 'vive-tracker-08', FS: 'vive-tracker-05', BS: 'vive-tracker-03', FW: 'vive-tracker-09', BW: 'vive-tracker-04', RK: 'vive-tracker-06', LK: 'vive-tracker-02', RF: 'vive-tracker-01', LF: 'vive-tracker-07', RH: 'index-controller-right', LH: 'index-controller-left' });
  assert.deepEqual(PAIRS, { hip: ['FW', 'BW'], chest: ['FS', 'BS'] });
  assert.equal(PAIR_SPOTS.hip.length, 8, 'any two of the eight waist spots');
  // 2026-10-26: no list of every position, no 27-locations line, no pair pickers: the pairs set themselves.
  assert.ok(!rabbit.includes('27 locations tracking') && !rabbit.includes('data-strap-worn') && !rabbit.includes('data-strap-pair'));
  assert.doesNotMatch(rabbit, /--ignore-trackers|data-trk-/, 'no Steam line and no old drawing');
  assert.match(js, /ask\('\/spots'/, 'changes go to the launcher');
  // Her later notes (2026-10-25): a woman, chest and sternum rings like the waist's, a picker on the spot itself, a short list.
  // 2026-10-26: her front and back side by side; each spot draws the device on it; the hoops hang from the ceiling.
  assert.ok(rabbit.includes('strap-figure strap-front') && rabbit.includes('strap-figure strap-back'), 'a front view and a back view');
  for (const k of ['tracker', 'index', 'qpro-ctrl', 'q3-ctrl', 'qpro', 'q3', 'hand']) assert.ok(rabbit.includes(`<symbol id="ico-${k}"`), k);
  assert.equal((rabbit.match(/class="strap-lyra"/g) || []).length, 2, 'two aerial hoops');
  assert.ok(rabbit.includes('<html lang="en" data-pet="rift-rabbit">'), 'its own colours');
  assert.ok(rabbit.includes('strap-hair'));
  assert.equal((rabbit.match(/data-strap-pop hidden/g) || []).length, 1, 'one picker that opens on the spot clicked');
  assert.match(rabbit, /<div class="strap-store" hidden>/);
  });

// The dongle map (Astra, 2026-10-26): its tool sits after tracker-strapper, its Scan button stays off until the
// launcher on this PC answers, and the launcher script asks the launcher for it.
test('dongle map: a tool after tracker-strapper, off until the launcher answers', () => {
  assert.ok(rabbit.indexOf('data-strapper') < rabbit.indexOf('data-dongle-map') && rabbit.indexOf('data-dongle-map') < rabbit.indexOf('data-launch-headset='));
  assert.match(rabbit, /<button type="button" class="button off" disabled data-dongle-scan>Scan USB<\/button>/);
  assert.match(js, /ask\('\/usb-map'\)/);
});
