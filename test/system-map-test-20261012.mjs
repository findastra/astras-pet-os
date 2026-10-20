// The System Map: every link names a known node, kind and state, and the page is up to date.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-12.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { systemMapData, buildSystemMap, petIcons, applyAccessDoc, applyPartsDoc, partsRows, SYSTEM_MAP } from '../scripts/system-map-20261012.mjs';
import { redactData } from '../scripts/public-safety-20261014.mjs';

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

// Astra, 2026-10-18: the programs made by you and by others are told apart, and every card shows L1 to L4 with each
// level's R W X. Claude Opus 5.5 (claude-opus-5-5).
test('ring 3 is made by you and ring 5 by others', () => {
  const data = systemMapData(registry, extra, programs);
  const ring = (id) => data.rings.find((r) => r.ring === id);
  assert.equal(ring('3').made, 'you');
  assert.equal(ring('5').made, 'others');
});

test('every grant says which levels (L1 to L4) hold it', () => {
  for (const g of extra.access.grants) {
    assert.ok(Array.isArray(g.level) && g.level.every((l) => ['L1', 'L2', 'L3', 'L4'].includes(l)), `${g.id}: level`);
  }
  const level = (id) => extra.access.grants.find((g) => g.id === id).level;
  assert.deepEqual(level('owner'), ['L4']);
  assert.deepEqual(level('seat-animals'), ['L3']);
  assert.deepEqual(level('adviser'), [], 'the adviser is outside your levels');
});

test('every gap a grant names is in the Known gaps table', () => {
  const doc = read(SYSTEM_MAP.doc);
  const rows = doc.split(/\r?\n/);
  for (const g of extra.access.grants) for (const gap of g.gaps || []) assert.ok(rows.some((r) => r.startsWith(`| ${gap} | `)), `${g.id}: gap ${gap} is not in Known gaps`);
});

test('PROTECTION-RINGS.md shows the same rings and grants as the map (run npm run build)', () => {
  const doc = read(SYSTEM_MAP.doc);
  assert.equal(doc, applyAccessDoc(doc, extra));
});

test('pet program names come from pet-programs.json, and every pet on the map has its program on the map', () => {
  const data = systemMapData(registry, extra, programs);
  for (const n of data.nodes.filter((x) => x.program !== undefined)) assert.equal(n.name, programs.find((p) => p.number === n.program).program);
  assert.ok(!data.nodes.some((n) => /^pet-program-\d+$/.test(n.name) && programs.find((p) => p.number === n.program)?.assigned), 'an assigned name shows as pet-program-#');
  const ids = new Set(data.nodes.map((n) => n.id));
  const hidden = new Set(registry.relations.private); // private pets send nothing, so their programs stay off the map
  for (const p of programs.filter((x) => ['registered', 'pipeline'].includes(x.stage) && x.assigned && ids.has(x.repo) && !hidden.has(x.repo)))
    assert.ok(data.nodes.some((n) => n.program === p.number), `${p.program} (#${p.number}) is not on the map`);
  // Seeds and roadmap pets (Astra, 2026-10-18): their programs are drawn as planned, and are not animals.
  const early = new Set(data.nodes.filter((n) => ['seed', 'roadmap'].includes(n.type)).map((n) => n.name));
  for (const p of programs.filter((x) => ['seed', 'roadmap'].includes(x.stage) && x.assigned && early.has(x.icon))) {
    const n = data.nodes.find((m) => m.program === p.number);
    assert.ok(n, `${p.program} (#${p.number}) is not on the map`);
    assert.ok(!n.animal, `${p.program} is an animal before its pet is registered`);
  }
  // Names come from the list, never from an old hard-coded spelling.
  assert.equal(data.nodes.find((n) => n.id === 'spoonfed').name, programs.find((p) => p.repo === 'spoonfed').icon);
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

// Astra, 2026-10-18: on a phone both panes fold and the map is flat 2D you drag and pinch, never turned.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-18.
test('on touch screens the map opens flat with no turning, and both panes fold', () => {
  const page = read('system-map-20261012.html');
  assert.match(page, /const TOUCH = matchMedia\('\(pointer: coarse\)'\)\.matches/);
  assert.match(page, /if\(TOUCH\) controls\.enabled = false;/, 'the trackball must not turn the map on touch');
  assert.match(page, /if\(TOUCH\)\{ flat=true;/, 'touch screens open on the flat map');
  assert.match(page, /let autoSpin = !TOUCH/, 'no spin on touch');
  assert.match(page, /id="nSpin"[^>]*|class="btn no-touch" id="nSpin"/);
  assert.match(page, /class="dims no-touch"/, 'the 3D switch is hidden on touch');
  assert.match(page, /id="hudMin"/, 'the key panel has its fold button');
  assert.match(page, /\.hud\.min>:not\(\.hudtop\)\{display:none!important\}/);
  assert.match(page, /\.side\.min>:not\(\.sidehead\)\{display:none!important\}/, 'the card folds to its name');
  assert.match(page, /if\(TOUCH\)\{ setHudMin\(true\); hudEl\.querySelectorAll\('details\.sec\[open\]'\)/, 'keys start closed on touch');
});

// Native programs, native tools, native tricks (Astra, 2026-10-19: "dont show on the system map at all, unless we are
// calling it a native program"; "make sure that the entire tool trick and program registry is a table on github").
test('native tools and tricks are never drawn: they belong to a pet program, whose card lists them in sections that fold', () => {
  const data = systemMapData(registry, extra, programs);
  const ids = new Map(data.nodes.map((n) => [n.id, n]));
  const parts = data.nodes.filter((n) => ['tool', 'trick'].includes(n.type));
  assert.ok(parts.some((n) => n.type === 'trick'), 'tricks are on the map data');
  for (const n of parts) {
    const o = ids.get(n.of);
    assert.ok(o && !['tool', 'trick'].includes(o.type), `${n.id} belongs to a program or pet, not to "${n.of}"`);
    assert.equal(n.ring, o.ring === '2' ? '3' : o.ring, `${n.id} sits on its pet program's ring`);
    if (n.type === 'trick') assert.match(n.label, /-trick-v\d/, `${n.id}: a trick box label says trick`);
  }
  // Opened on their own, so native programs of The Farm, still drawn, still on ring 0.
  for (const id of ['desktop-host', 'system-map']) { assert.equal(ids.get(id).type, 'own-program', id); assert.equal(ids.get(id).ring, '0', id); }
  // No code, only written steps: tricks.
  for (const id of ['vcc-package-manager', 'vrchat-avatar-upload']) assert.equal(ids.get(id).type, 'trick', id);
  const page = read(SYSTEM_MAP.template);
  assert.ok(page.includes('DATA.nodes = DATA.nodes.filter(n=>!PART[n.id]);'), 'the map draws no tool or trick');
  assert.ok(page.includes('via:(a||b).name'), 'a line of a tool is drawn from its pet program, marked via');
  assert.ok(page.includes("el('details','parts')"), 'the card lists them in a section that folds');
  assert.ok(!/'Hammer'/.test(page), 'no hammer in the key: no tool is drawn');
});

test('TOOLS-AND-TRICKS.md holds the whole registry as one table, up to date (run npm run build)', () => {
  const doc = read(SYSTEM_MAP.parts);
  assert.equal(doc, applyPartsDoc(doc, redactData(registry, 'pets.json', []), redactData(extra, 'system-map.json', []), programs));
  const rows = partsRows(registry, extra, programs);
  const listed = new Set(rows.map((r) => r.id));
  for (const n of extra.nodes.filter((x) => ['tool', 'trick'].includes(x.type) || (x.type === 'own-program' && x.program === undefined)))
    assert.ok(listed.has(n.id), `${n.id} is missing from the registry table`);
  for (const k of ['own-program', 'tool', 'trick', 'program']) assert.ok(rows.some((r) => r.kind === k), `no ${k} rows`);
  for (const p of registry.relations.private) assert.ok(!rows.some((r) => programs.find((q) => q.repo === p && q.number === r.number)), `${p} is private`);
});

// Every place that shows a pet opens its pet program page (Astra, 2026-10-19), the map card too.
test('every pet on the map links its pet program page, and its pet program card links it too', () => {
  const data = systemMapData(registry, extra, programs);
  const regs = [...registry.pets, ...registry.pipeline];
  for (const n of data.nodes.filter((x) => ['host', 'pet', 'pipeline'].includes(x.type))) {
    assert.equal(n.page, regs.find((p) => p.repo === n.repo).interface_url, `${n.id}: the map links pets.json interface_url`);
    assert.match(n.page, /^apps\/pet-programs\/[a-z0-9-]+\.html$/, `${n.id}: its pet program page`);
    assert.ok(existsSync(root + n.page), `${n.id}: ${n.page} is missing`);
  }
  const page = read(SYSTEM_MAP.template);
  assert.ok(page.includes("p.append(document.createTextNode('Pet Program: '))"), 'the card says Pet Program');
  assert.ok(page.includes('m.page&&m.home&&m.home.number===n.program'), 'a pet program card links its pet\'s page');
});

// Option C (Astra, 2026-10-19): "W R X what it should be, then some kind of easy indicator of whether that is reflected
// in the current code". Every In code (enforced) grant names its proof; the build refuses one that does not.
test('every In code grant names its proof, and the build refuses one without', () => {
  assert.deepEqual(Object.fromEntries(Object.entries(extra.access.statuses).map(([k, s]) => [k, s.mark])),
    { enforced: 'In code', written: 'Rule only', planned: 'Not built' });
  for (const g of extra.access.grants) {
    if (g.status !== 'enforced') { assert.equal(g.evidence, undefined, `${g.id}: only an In code grant names proof`); continue; }
    assert.ok(g.evidence?.length, `${g.id}: In code needs its proof`);
    for (const e of g.evidence) {
      const [kind] = Object.keys(e);
      assert.ok(['test', 'script', 'setting'].includes(kind), `${g.id}: proof is a test, script or setting`);
      if (kind !== 'setting') assert.ok(existsSync(root + e[kind]), `${g.id}: ${e[kind]} is in the repo`);
    }
  }
  const change = (id, evidence) => { const x = structuredClone(extra); x.access.grants.find((g) => g.id === id).evidence = evidence; return x; };
  assert.throws(() => systemMapData(registry, change('farmer-round', []), programs), /names no evidence/);
  assert.throws(() => systemMapData(registry, change('farmer-round', [{ test: 'test/no-such-test.mjs' }]), programs), /not in the repo/);
  assert.throws(() => systemMapData(registry, change('seat-core', [{ setting: 'a rule' }]), programs), /cannot name evidence/);
  const page = read(SYSTEM_MAP.template);
  assert.ok(page.includes("el('span','should','Should be')"), 'every level row on a card says what it should be');
  assert.ok(page.includes('function proofLine(g)'), 'a card shows the proof of every In code');
  assert.ok(read('PROTECTION-RINGS.md').includes('**Proof:** [`test/farmer-rounds-pr-test-20261017.mjs`]'), 'PROTECTION-RINGS.md names each proof (run npm run build)');
});
