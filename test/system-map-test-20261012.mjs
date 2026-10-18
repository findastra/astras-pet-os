// The System Map: every link names a known node, kind and state, and the page is up to date.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-12.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { systemMapData, buildSystemMap, petIcons, applyAccessDoc, SYSTEM_MAP } from '../scripts/system-map-20261012.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = (f) => readFileSync(root + f, 'utf8');
const registry = JSON.parse(read('pets.json'));
const extra = JSON.parse(read(SYSTEM_MAP.extra));
const programs = JSON.parse(read(SYSTEM_MAP.programs)).programs;

test('every System Map link has known ends, kind and state', () => {
  const data = systemMapData(registry, extra, programs); // throws on an unknown node, kind or state
  const ids = new Set(data.nodes.map((n) => n.id));
  for (const l of data.links) { assert.ok(ids.has(l.from)); assert.ok(ids.has(l.to)); }
  for (const n of data.nodes) assert.ok(data.types[n.type], `unknown node type: ${n.type}`);
});

test('the Farmer reaches every pet, and every seed and roadmap pet is his to hatch', () => {
  const data = systemMapData(registry, extra, programs);
  const host = data.nodes.find((n) => n.type === 'host').id;
  for (const n of data.nodes.filter((x) => ['pet', 'pipeline', 'seed', 'roadmap'].includes(x.type)))
    assert.ok(data.links.some((l) => (l.from === host && l.to === n.id) || (l.to === host && l.from === n.id)), `${n.name} is not linked to the Farmer`);
});

test('private pets send nothing but their own registry entry to the Farmer', () => {
  const data = systemMapData(registry, extra, programs);
  const host = data.nodes.find((n) => n.type === 'host').id;
  for (const p of registry.relations.private)
    for (const l of data.links.filter((x) => x.from === p))
      assert.ok(l.to === host && l.carries === 'registry', `${p} is private but sends ${l.carries} to ${l.to}`);
});

test('system-map-20261012.html is up to date (run npm run build)', () => {
  process.chdir(root);
  assert.equal(read(SYSTEM_MAP.output), buildSystemMap(registry, extra, read(SYSTEM_MAP.template), petIcons(JSON.parse(read('art/frames/index.json'))), programs));
});

test('every node sits on one of the six architecture layers, and every link has a layer', () => {
  const data = systemMapData(registry, extra, programs);
  for (const n of data.nodes) assert.ok(data.layers[n.layer], `${n.id} has no layer`);
  for (const l of data.links) assert.ok([0, 1, 2, 3, 4, 5, 6].includes(l.layer));
  const pet = data.links.find((l) => l.from === 'mail-snail' && l.to === 'finance-finch');
  assert.equal(pet.layer, 4, 'pet to pet is layer 4');
  assert.equal(data.links.find((l) => l.from === 'openai' && l.carries === 'art').layer, 0, 'the art pipeline is development, not runtime');
  assert.equal(data.links.find((l) => l.from === 'claude-bot' && l.to === 'claude').layer, 5, 'a pet calling a model is the harness layer');
  assert.ok(!data.links.some((l) => l.carries === 'builds' && data.nodes.find((n) => n.id === l.from).type === 'model'), 'models do not build pets; assistants do');
});

test('every pet with a repo has a measured code list with a reason for each language', () => {
  const data = systemMapData(registry, extra, programs);
  for (const n of data.nodes.filter((x) => ['host', 'pet', 'pipeline'].includes(x.type))) {
    assert.ok(n.code, `${n.name} has no code list`);
    for (const l of n.code.languages) assert.ok(l.why && l.why.length > 20, `${n.name}: no reason for ${l.language}`);
  }
});


// Rings and grants (Astra, 2026-10-17, option A): a ring says where a thing lives; R W X lives on grants, each with a
// status. Claude Opus 5.5 (claude-opus-5-5).
test('every node lives on a known ring, and only registered pets, their programs and the core are animals', () => {
  const data = systemMapData(registry, extra, programs);
  const rings = new Set(data.rings.map((r) => r.ring));
  for (const n of data.nodes) assert.ok(rings.has(n.ring), `${n.name} has no ring`);
  const by = (id) => data.nodes.find((n) => n.id === id);
  assert.equal(by('pet-directory').ring, '0');
  assert.equal(by('claude-code').ring, '4', 'Claude Code is a ring around its AI, with the farmhands');
  assert.equal(by('kennel').ring, '5', 'the Kennel is outside the harness');
  for (const n of data.nodes.filter((x) => ['seed', 'roadmap'].includes(x.type))) assert.ok(!n.animal, `${n.name} is not an animal until Astra registers it`);
  for (const n of data.nodes.filter((x) => ['pet', 'pipeline', 'host'].includes(x.type))) assert.ok(n.animal, `${n.name} is a registered animal`);
  for (const n of data.nodes.filter((x) => !['0', '1', '2', '3'].includes(x.ring))) assert.ok(!n.animal, `${n.name} is outside the harness`);
});

test('R W X lives on grants with a status, never on a ring', () => {
  const data = systemMapData(registry, extra, programs);
  for (const r of data.rings) for (const k of ['r', 'w', 'x', 'rwx']) assert.equal(r[k], undefined, `ring ${r.ring} carries ${k}`);
  for (const g of data.access.grants) {
    assert.ok(['enforced', 'written', 'planned'].includes(g.status), `${g.id}: status`);
    assert.ok(g.how && g.how.length > 30, `${g.id}: say how it holds`);
  }
  // No written rule may be drawn as a lock: the core's pull-request rule is written only until agents have their own identity.
  assert.equal(data.access.grants.find((g) => g.id === 'seat-core').status, 'written');
  // Every node has its grants listed, and Astra's reaches everything else.
  for (const n of data.nodes) {
    assert.ok(n.access && Array.isArray(n.access.on) && Array.isArray(n.access.by), `${n.name}: no access lists`);
    if (n.id !== 'astra') assert.ok(n.access.on.includes('owner'), `${n.name}: Astra's grant does not reach it`);
  }
  const pet = data.nodes.find((n) => n.id === 'github-goldfish');
  assert.ok(pet.access.on.includes('seat-animals') && !pet.access.on.includes('seat-core'), 'an animal gets the animals grant, not the core one');
  assert.ok(!data.nodes.find((n) => n.id === 'pole-puff').access.on.includes('seat-animals'), 'a seed is not an animal, so the animals grant does not reach it');
  assert.ok(data.nodes.find((n) => n.id === 'chatgpt').access.by.includes('adviser'));
  assert.ok(!data.nodes.find((n) => n.id === 'voicemeeter').access.on.includes('adviser'), 'a grant of all "no" shows only on its subject');
});

test('every gap a grant names is in the Known gaps table', () => {
  const doc = read(SYSTEM_MAP.doc);
  for (const g of extra.access.grants) for (const gap of g.gaps || []) assert.match(doc, new RegExp(`^\| ${gap} \|`, 'm'), `${g.id}: gap ${gap}`);
});

test('PROTECTION-RINGS.md shows the same rings and grants as the map (run npm run build)', () => {
  const doc = read(SYSTEM_MAP.doc);
  assert.equal(doc, applyAccessDoc(doc, extra));
});

test('pet program names come from pet-programs.json, and every registered or pipeline pet has its program on the map', () => {
  const data = systemMapData(registry, extra, programs);
  for (const n of data.nodes.filter((x) => x.program !== undefined)) assert.equal(n.name, programs.find((p) => p.number === n.program).program);
  assert.ok(!data.nodes.some((n) => /^pet-program-\d+$/.test(n.name) && programs.find((p) => p.number === n.program)?.assigned), 'an assigned name shows as pet-program-#');
  const ids = new Set(data.nodes.map((n) => n.id));
  const hidden = new Set(registry.relations.private); // private pets send nothing, so their programs stay off the map
  for (const p of programs.filter((x) => ['registered', 'pipeline'].includes(x.stage) && x.assigned && ids.has(x.repo) && !hidden.has(x.repo)))
    assert.ok(data.nodes.some((n) => n.program === p.number), `${p.program} (#${p.number}) is not on the map`);
});

// Groups (Astra, 2026-10-18): the 13 trackers connect to what uses them, not to a "13 trackers" node.
test('a line to a group reaches each member, and no member hangs off its group', () => {
  const data = systemMapData(registry, extra, programs);
  const groups = data.nodes.filter((n) => n.group).map((n) => n.id);
  assert.ok(groups.includes('vr-trackers'), 'the trackers are a group');
  for (const l of data.links) {
    const ends = [l.from, l.to].filter((id) => groups.includes(id));
    if (ends.length === 1) assert.fail(`${l.from} -> ${l.to} ends on a group instead of its members`);
  }
  const trackers = data.nodes.filter((n) => n.in === 'vr-trackers');
  assert.equal(trackers.length, 13);
  for (const t of trackers) for (const program of ['steamvr', 'space-calibrator', 'double-hip-tracker'])
    assert.ok(data.links.some((l) => l.from === program && l.to === t.id), `${t.name} is not connected to ${program}`);
  for (const t of trackers) assert.ok(data.links.some((l) => l.from === t.id && l.to === 'vrchat' && l.carries === 'tracking'), `${t.name} does not feed VRChat full-body tracking`);
});
