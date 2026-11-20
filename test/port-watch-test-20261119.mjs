// White Hat Weasel's port watch (scripts/port-watch-20261119.mjs): labels, reach, peers, the daily ask, the menu Startup
// Star runs, and that only our own servers can be closed. No Windows calls: every test hands it a made-up look.
// Claude Opus 5.5 (claude-opus-5-5), 2026-11-19.
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { classify, reach, where, privacy, build, ask, menu, mood, close, once, LEFTOVER_MS, PAGE_DATA, SCHEMA } from '../scripts/port-watch-20261119.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const HOME = 'C:\\Users\\example';
const now = Date.parse('2026-11-19T20:00:00Z');
const old = new Date(now - LEFTOVER_MS - 60000).toISOString(), fresh = new Date(now - 60000).toISOString();
const raw = () => ({
  listen: [
    { LocalAddress: '127.0.0.1', LocalPort: 8813, OwningProcess: 11 },
    { LocalAddress: '127.0.0.1', LocalPort: 8886, OwningProcess: 12 },
    { LocalAddress: '127.0.0.1', LocalPort: 38761, OwningProcess: 13 },
    { LocalAddress: '0.0.0.0', LocalPort: 57621, OwningProcess: 14 },
    { LocalAddress: '::', LocalPort: 135, OwningProcess: 15 },
  ],
  conn: [
    { LocalAddress: '127.0.0.1', LocalPort: 8813, RemoteAddress: '127.0.0.1', RemotePort: 50000, State: 'Established', OwningProcess: 11 },
    { LocalAddress: '192.168.1.70', LocalPort: 57621, RemoteAddress: '192.168.1.20', RemotePort: 50001, State: 'Established', OwningProcess: 14 },
    { LocalAddress: '192.168.1.70', LocalPort: 50002, RemoteAddress: '35.186.224.1', RemotePort: 443, State: 'Established', OwningProcess: 14 },
  ],
  procs: [
    { id: 11, name: 'node.exe', cmd: `node ${HOME}\\.claude\\tools\\editorial-preview-tool\\editorial-preview-tool-20261111.mjs serve ${HOME}\\Documents`, started: old },
    { id: 12, name: 'node.exe', cmd: `node ${HOME}\\.claude\\tools\\editorial-preview-tool\\editorial-preview-tool-20261111.mjs serve x`, started: fresh },
    { id: 13, name: 'node.exe', cmd: `"node.exe" "${HOME}\\Documents\\Astra's PetOS\\ai-discord-presence\\openai-discord-presence\\src\\server.js"`, started: old },
    { id: 14, name: 'Spotify.exe', cmd: 'Spotify.exe', started: old },
    { id: 15, name: 'svchost.exe', cmd: '', started: old },
  ],
});

test('each port gets a kind and a label Astra knows', () => {
  assert.equal(classify('node.exe', 'editorial-preview-tool-20261111.mjs serve').kind, 'preview');
  assert.equal(classify('python.exe', 'python -m http.server 8797').kind, 'preview');
  assert.deepEqual(classify('node.exe', 'ai-discord-presence\\openai-discord-presence\\src\\server.js').label, 'OpenAI Discord Presence');
  assert.equal(classify('svchost.exe', '').kind, 'windows');
  assert.equal(classify('Spotify.exe', 'Spotify.exe').label, 'Spotify');
  assert.match(classify('mystery.exe', '').label, /not in the Weasel’s list yet/);
});

test('reach and where say who can get in, in plain words', () => {
  assert.equal(reach('127.0.0.1').reach, 'this-pc');
  assert.equal(reach('::1').reach, 'this-pc');
  assert.equal(reach('0.0.0.0').reach, 'network');
  assert.equal(reach('100.77.169.84').reach, 'tailscale');
  assert.equal(where('127.0.0.1'), 'this PC');
  assert.equal(where('192.168.1.20'), 'home network');
  assert.equal(where('100.77.1.2'), 'Tailscale');
  assert.equal(where('fd7a:115c:a1e0::1'), 'Tailscale');
  assert.equal(where('35.186.224.1'), 'internet');
});

test('the user folder never shows', () => {
  assert.equal(privacy(`node ${HOME}\\x.mjs`, HOME), 'node %USERPROFILE%\\x.mjs');
  assert.equal(privacy('node c:/users/example/x.mjs', HOME), 'node %USERPROFILE%/x.mjs');
  const { ports } = build(raw(), {}, now, HOME);
  assert.ok(!JSON.stringify(ports).includes('example'));
});

test('the port list: connections now, peers kept, left-over previews', () => {
  const state = {};
  const { ports, peers } = build(raw(), state, now, HOME);
  const by = Object.fromEntries(ports.map((p) => [p.port, p]));
  assert.equal(by[8813].leftover, true, 'a preview open more than two hours looks left over');
  assert.equal(by[8886].leftover, false, 'a fresh preview does not');
  assert.equal(by[38761].leftover, false, 'our own helpers are never called left over');
  assert.equal(by[57621].reach, 'network');
  assert.deepEqual(by[57621].connections, [{ from: '192.168.1.20', where: 'home network', state: 'Established' }]);
  assert.deepEqual(by[57621].talks_out, { internet: 1 });
  assert.equal(by[57621].peers[0].from, '192.168.1.20');
  assert.equal(by[135].label.startsWith('Windows: remote procedure calls'), true);
  // A later look with nobody connected keeps the peer as "last seen".
  const later = raw(); later.conn = [];
  const again = build(later, { peers }, now + 600000, HOME);
  assert.equal(again.ports.find((p) => p.port === 57621).peers[0].from, '192.168.1.20');
  assert.equal(again.ports.find((p) => p.port === 57621).connections.length, 0);
});

test('he asks once a day, and only about ports still open', () => {
  const { ports } = build(raw(), {}, now, HOME);
  const first = ask(ports, {}, now);
  assert.deepEqual(first.ports, [8813]);
  const same = ask(ports, { ask: first }, now + 3600000);
  assert.equal(same.asked, first.asked, 'the same day keeps the same ask');
  const closed = ask(ports.filter((p) => p.port !== 8813), { ask: first }, now + 3600000);
  assert.deepEqual(closed.ports, []);
  assert.equal(mood(first).mood, 'curious');
  assert.equal(mood(closed).mood, 'idle');
  assert.equal(ask(ports.filter((p) => !p.leftover), {}, now), null);
});

test('the menu only offers our own servers, in words Startup Star accepts', () => {
  const { ports } = build(raw(), {}, now, HOME);
  const m = menu(ports, ask(ports, {}, now));
  assert.equal(m.schema, 'astras-pet-os-menu-v1');
  const closes = m.items.filter((i) => i.args && i.args[0] === '--close').map((i) => Number(i.args[1]));
  assert.deepEqual(closes.sort((a, b) => a - b), [8813, 8886, 38761]);
  // BackgroundPets.SafeArg in scripts/desktop-pets-20261011.cs
  const safe = /^(--[a-z][a-z-]*|[a-z0-9][a-z0-9.:-]*)$/;
  for (const i of m.items) for (const a of i.args || []) assert.match(a, safe);
  assert.match(m.items[0].text, /1 port look/);
});

test('close stops only our own servers', () => {
  const killed = [];
  const kill = (pid) => killed.push(pid);
  assert.equal(close(57621, { raw: raw(), home: HOME, kill }).ok, false, 'Spotify is not ours');
  assert.equal(close(135, { raw: raw(), home: HOME, kill }).ok, false, 'Windows is never closed');
  assert.equal(close('abc', { raw: raw(), home: HOME, kill }).ok, false);
  assert.equal(close(9999, { raw: raw(), home: HOME, kill }).ok, false);
  assert.deepEqual(killed, []);
  assert.equal(close(8813, { raw: raw(), home: HOME, kill }).ok, true);
  assert.deepEqual(killed, [11]);
});

test('once writes the page data, menu and mood where Startup Star and the page read them', () => {
  const base = mkdtempSync(join(tmpdir(), 'port-watch-'));
  const at = { out: join(base, 'docs'), menu: join(base, 'local') };
  const d = once({ where: at, raw: raw(), now, home: HOME });
  assert.equal(d.schema, SCHEMA);
  const page = readFileSync(join(at.out, PAGE_DATA), 'utf8');
  assert.match(page, /^\/\/ Written by White Hat Weasel/);
  assert.match(page, /window\.whiteHatLabPortWatch = /);
  assert.ok(existsSync(join(at.menu, 'menu-20261021.json')));
  assert.equal(JSON.parse(readFileSync(join(at.menu, 'mood-20261021.json'), 'utf8')).program, 'white-hat-lab');
});

test('Startup Star starts the port watch at sign-in and runs its menu with the script first', () => {
  const cs = readFileSync(join(root, 'scripts', 'desktop-pets-20261011.cs'), 'utf8');
  assert.match(cs, /Repo="white-hat-lab",Pet="White Hat Weasel",Exe=node,Marker="port-watch-20261119"/);
  assert.match(cs, /AlsoAtSignIn=\{[^}]*"white-hat-lab"/);
  assert.match(cs, /MenuPrefix=new\[\]\{Quote\(list\[list\.Count-1\]\.Needs\)\}/);
  assert.match(cs, /if\(e\.MenuPrefix!=null\)/);
});

test('the port-watch tool box sits under the port check, and its page reads only local data', () => {
  const map = JSON.parse(readFileSync(join(root, 'system-map.json'), 'utf8'));
  const nodes = map.nodes || map;
  const list = Array.isArray(nodes) ? nodes : Object.values(nodes).flat();
  const ids = list.filter((n) => n && n.of === 'program-67' && n.type === 'tool').map((n) => n.id);
  assert.deepEqual(ids.slice(0, 2), ['port-check-tool', 'port-watch-tool']);
  const js = readFileSync(join(root, 'apps', 'white-hat-lab-port-watch-20261119.js'), 'utf8');
  assert.ok(!/innerHTML/.test(js), 'textContent only');
  assert.ok(!/fetch\(|XMLHttpRequest/.test(js), 'the page sends nothing');
});
