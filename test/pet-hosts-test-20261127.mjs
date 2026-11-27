// One farm across all your devices, every pet once (Astra, 2026-11-27): "We dont want duplicate pets right? This Pet
// OS is being designed so pets can live across devices in a unified group of devices right?" pets.json lists the
// farm's devices in `hosts`, and every pet's `server` names the one host it runs on in `host` (card 451). A record,
// not a lock: until Startup Star and the Linux package read `host`, this test only keeps the record true.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => readFileSync(join(root, file), 'utf8');
const pets = JSON.parse(read('pets.json'));
const map = JSON.parse(read('system-map.json'));
const lists = { pets: pets.pets, pipeline: pets.pipeline, seeds: (pets.seeds || {}).pets, candidates: pets.candidates, retired_pets: pets.retired_pets };
const entries = Object.entries(lists).flatMap(([list, l]) => (Array.isArray(l) ? l : []).map((p) => ({ list, p })));
const hosts = Object.entries(pets.hosts || {}).filter(([id]) => id !== 'about');
const hostIds = new Set(hosts.map(([id]) => id));
const agents = new Set(Object.keys((pets.needs_key || {}).core || {}));
const osKinds = new Set(Object.keys((pets.needs_key || {}).os || {}));

test('pets.json lists the farm\'s hosts, each a Device on the System Map, named by its kind only', () => {
  assert.ok(pets.hosts && typeof pets.hosts.about === 'string', 'pets.json has `hosts` with its `about`');
  assert.ok(hosts.length >= 1, 'at least one host: the farm\'s first computer');
  for (const [id, host] of hosts) {
    const node = map.nodes.find((n) => n.id === id);
    assert.ok(node, `${id}: a node on the System Map`);
    assert.ok(['Device', 'Hardware'].includes(node.category), `${id}: a Device on the System Map, not ${node.category}`);
    assert.ok(osKinds.has(host.os), `${id}: os "${host.os}" is one of needs_key.os`);
    assert.ok(host.agent === null || agents.has(host.agent), `${id}: its host agent is a core part (needs_key.core) or null (not built)`);
    assert.equal(typeof host.job, 'string', `${id}: says what it is for`);
  }
});

test('no host record holds an address, a MAC or a computer name pattern (the hub is public)', () => {
  const text = JSON.stringify(pets.hosts);
  assert.doesNotMatch(text, /\b(?:\d{1,3}\.){3}\d{1,3}\b/, 'no IPv4 address');
  assert.doesNotMatch(text, /\b[0-9a-f]{2}(?:[:-][0-9a-f]{2}){5}\b/i, 'no MAC address');
  assert.doesNotMatch(text, /\b[a-z0-9-]+\.(?:local|lan|home|ts\.net)\b/i, 'no network host name');
});

test('every pet server runs on exactly one host, and only a server has a host', () => {
  const withServer = entries.filter(({ p }) => p.server !== undefined);
  assert.ok(withServer.length > 0, 'at least one pet names its server');
  for (const { list, p } of withServer) {
    assert.equal(typeof p.host, 'string', `${list}/${p.repo}: its server names one host (a string, never a list: one host at a time)`);
    assert.ok(hostIds.has(p.host), `${list}/${p.repo}: host "${p.host}" is in pets.json hosts`);
  }
  for (const { list, p } of entries.filter(({ p }) => p.host !== undefined && p.server === undefined)) {
    assert.fail(`${list}/${p.repo}: has a host but no server (host says where its server runs)`);
  }
});

test('a pet runs only on a host whose system it can run on', () => {
  for (const { list, p } of entries.filter(({ p }) => p.host !== undefined)) {
    const os = ((p.needs || {}).os) || [];
    if (os.length === 0) continue; // runs anywhere its program runs
    const hostOs = pets.hosts[p.host].os;
    assert.ok(os.includes(hostOs), `${list}/${p.repo}: needs ${os.join(' or ')}, but host ${p.host} is ${hostOs}`);
  }
});

test('each repo appears once across the lists, so no pet has a second copy with its own host', () => {
  const repos = entries.filter(({ p }) => p.host !== undefined).map(({ p }) => p.repo);
  assert.equal(new Set(repos).size, repos.length, `one entry per pet with a server: ${repos.join(', ')}`);
});
