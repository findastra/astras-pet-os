// White Hat Lab's Ghost In The Walls watch: the record of guest devices, from made-up readings (never the router).
// Claude Opus 5.5 (claude-opus-5-5), 2026-11-26.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fold, once, page, ready, read, KEY, GUESTS, PAGE_DATA, LOG } from '../scripts/ghost-walls-watch-20261126.mjs';

const phone = { mac: 'AA:BB:CC:00:00:01', ip: '10.0.0.21', name: 'phone', band: '5 GHz' };
const laptop = { mac: 'AA:BB:CC:00:00:02', ip: '10.0.0.22', name: '', band: '2.4 GHz' };
const T = Date.parse('2026-11-26T12:00:00Z');

test('a new device joins once, stays in one visit, and a second visit counts after it left', () => {
  let { record, lines } = fold({ ok: true, guests: [phone] }, {}, T);
  assert.equal(record.devices[phone.mac].visits, 1);
  assert.match(lines[0], /^joined: phone .*first time/);
  ({ record, lines } = fold({ ok: true, guests: [phone, laptop] }, record, T + 1800e3));
  assert.equal(record.devices[phone.mac].visits, 1, 'still the same visit');
  assert.deepEqual(lines.map((l) => l.split(':')[0]), ['joined']);
  ({ record, lines } = fold({ ok: true, guests: [laptop] }, record, T + 3600e3));
  assert.match(lines.join('\n'), /left: phone/);
  ({ record, lines } = fold({ ok: true, guests: [phone, laptop] }, record, T + 5400e3));
  assert.equal(record.devices[phone.mac].visits, 2);
  assert.match(lines[0], /visit 2/);
  assert.equal(record.devices[phone.mac].first_seen, new Date(T).toISOString());
});

test('the page lists guests on now first by last seen, with counts', () => {
  const { record } = fold({ ok: true, guests: [phone, laptop] }, {}, T);
  const d = page(record, { ok: true });
  assert.equal(d.guests_now, 2);
  assert.equal(d.seen, 2);
  assert.ok(d.devices.every((x) => x.on_now));
  assert.equal(d.last, 'ok');
});

test('a failed look keeps the record and nobody is marked as left', () => {
  const out = mkdtempSync(join(tmpdir(), 'ghost-walls-'));
  try {
    once({ out, reading: { ok: true, guests: [phone] }, now: T });
    const d = once({ out, reading: { ok: false, why: 'Could not sign in to the router.' }, now: T + 1800e3 });
    assert.equal(d.guests_now, 1);
    assert.equal(d.last, 'Could not sign in to the router.');
    const log = readFileSync(join(out, LOG), 'utf8');
    assert.match(log, /joined: phone/);
    assert.match(log, /look failed/);
    assert.doesNotMatch(log, /left:/);
    assert.ok(existsSync(join(out, GUESTS)) && existsSync(join(out, PAGE_DATA)));
    assert.match(readFileSync(join(out, PAGE_DATA), 'utf8'), /window\.whiteHatLabGhostWalls = /);
  } finally { rmSync(out, { recursive: true, force: true }); }
});

test('it only looks once the router login is set, and never shows the login', () => {
  assert.equal(ready({ env: {}, userEnv: () => '' }), false);
  assert.equal(ready({ env: { [KEY]: 'x' }, userEnv: () => '' }), true);
  const src = readFileSync(new URL('../scripts/ghost-walls-watch-20261126.mjs', import.meta.url), 'utf8');
  assert.doesNotMatch(src, /console\.log\([^)]*pass/);
});

test('the reader answers in JSON and refuses politely with no login', { skip: !hasPython() && 'no python' }, () => {
  const r = read({ env: { ...process.env, [KEY]: '' }, userEnv: () => '' });
  assert.equal(r.ok, false);
  assert.equal(r.code, 2);
  assert.match(r.why, /WHITE_HAT_LAB_ROUTER_PASSWORD/);
});

function hasPython() { try { execFileSync('python', ['--version'], { stdio: 'ignore' }); return true; } catch { return false; } }

test('the guest list page reads only local data, builds with textContent, and its tool box embeds it', () => {
  const js = readFileSync(new URL('../apps/white-hat-lab-ghost-walls-20261126.js', import.meta.url), 'utf8');
  assert.ok(!/innerHTML/.test(js), 'textContent only');
  assert.ok(!/fetch\(|XMLHttpRequest/.test(js), 'the page sends nothing');
  assert.match(js, /ghost-walls-page-data-20261126\.js/);
  const map = JSON.parse(readFileSync(new URL('../system-map.json', import.meta.url), 'utf8'));
  const list = Array.isArray(map.nodes) ? map.nodes : Object.values(map.nodes || map).flat();
  const node = list.find((n) => n && n.id === 'ghost-in-the-walls-tool');
  assert.match(node.embed, /white-hat-lab-ghost-walls-20261126\.html$/);
});

test("White Hat Lab's tool pages tell their box the content's own height, so a box can shrink", () => {
  for (const f of ['white-hat-lab-tools-20261117.js', 'white-hat-lab-port-watch-20261119.js', 'white-hat-lab-ghost-walls-20261126.js']) {
    const js = readFileSync(new URL(`../apps/${f}`, import.meta.url), 'utf8');
    assert.match(js, /tool-panel-height', height: Math\.ceil\(document\.body\.getBoundingClientRect\(\)\.height\)/, f);
  }
});
