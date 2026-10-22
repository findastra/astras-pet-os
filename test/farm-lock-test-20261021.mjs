// The farm lock and the Friendly Farmer's farm-pets tool (Astra, 2026-10-21: "All recommended on the six farm lock
// questions"; Part 5a of card 058, docs/farm-lock-20261021.md): a pet picked from scratch brings the pets it requires, the
// farm lock says exactly what a farm runs, the Farmer adds one pet or takes one away without breaking another, and the
// installer's PowerShell twin gives the same needs and the same lock as Node. Claude Opus 5.5 (claude-opus-5-5), 2026-10-21.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DRAFTS_LIST, choosePets, farmPets, writeFarm, writeFarmFiles } from '../scripts/farm-setup-20261019.mjs';
import { CATALOG, LOCK, SCHEMA, buildLock, canonicalJson, coreParts, denverNow, entryHash, missingNeeds, requiredClosure } from '../scripts/farm-lock-20261021.mjs';
import { TOOL_LABEL, applyPlan, checkFarm, planAdd, planRemove, readFarm, writeLock } from '../scripts/farm-pets-20261021.mjs';
import { ownerOf, upstream } from '../scripts/farm-owner-20261020.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = (rel) => readFileSync(join(root, rel), 'utf8').replace(/^﻿/, '');
const json = (path) => JSON.parse(readFileSync(path, 'utf8').replace(/^﻿/, ''));
const TOOL = join(root, 'scripts', 'farm-pets-20261021.mjs');
const temp = () => mkdtempSync(join(tmpdir(), 'farm-lock-test-'));
const NOW = '2026-10-21T22:30:00-06:00';
const all = farmPets(root);
const ids = (pets) => pets.map((p) => p.id);

/** An installed Windows farm in `dir`, as the installer leaves it: the release's catalog, the farm's own lists, a receipt. */
function installedFarm(dir, picks, { mode = 'farm' } = {}) {
  mkdirSync(join(dir, CATALOG, 'desktop-art'), { recursive: true });
  copyFileSync(join(root, 'pets.json'), join(dir, CATALOG, 'pets.json'));
  copyFileSync(join(root, DRAFTS_LIST), join(dir, CATALOG, DRAFTS_LIST));
  copyFileSync(join(root, 'system-map.json'), join(dir, 'system-map.json'));
  writeFileSync(join(dir, 'install-receipt.json'), `﻿${JSON.stringify({ product: "Astra's PetOS", version: 'v-test', mode, farm: 'scratch', source_commit: null })}`);
  const choice = choosePets(all, { farm: 'scratch', pets: picks });
  writeFarmFiles(join(dir, CATALOG), dir, choice.keep);
  return choice;
}

test('one text and one hash for one value: keys in order, escaped as JSON.stringify, whole numbers only', () => {
  assert.equal(canonicalJson({ b: [1, 'x\n\u0001"\\é'], a: null, c: { z: true, y: false } }), '{"a":null,"b":[1,"x\\n\\u0001\\"\\\\é"],"c":{"y":false,"z":true}}');
  assert.throws(() => canonicalJson({ scale: 0.5 }), /not a whole number/);
  assert.equal(entryHash({ a: 1, b: 2 }), entryHash({ b: 2, a: 1 }), 'the order keys are written in does not matter');
  assert.match(entryHash({}), /^[0-9a-f]{64}$/);
  assert.match(denverNow(new Date('2026-10-22T04:30:00Z')), /^2026-10-21T22:30:00-06:00$/);
  assert.match(denverNow(new Date('2026-12-01T19:00:00Z')), /^2026-12-01T12:00:00-07:00$/, 'Denver winter time');
});

test('a picked pet brings every pet it requires, all the way down; optional pets never come by themselves', () => {
  const pick = (...p) => requiredClosure(all, p, ['farmer']);
  assert.deepEqual(pick('forensic-ferret'), { keep: ['log-lynx', 'forensic-ferret'], neededBy: { 'log-lynx': ['evidence-locker'] }, stops: [] });
  assert.deepEqual(pick('packet-piranha', 'forensic-ferret').neededBy, { 'log-lynx': ['packet-river', 'evidence-locker'] });
  assert.deepEqual(pick('log-lynx', 'forensic-ferret').neededBy, {}, 'a pet picked and needed counts as picked');
  assert.deepEqual(pick('rgbee').keep, ['rgbee'], 'RGBee only works better with API Fairy (optional)');
  assert.deepEqual(requiredClosure(all, ['forensic-ferret'], ['farmer', 'log-lynx']).keep, ['forensic-ferret'], 'a pet already here is not brought again');
  const fake = [{ id: 'a', name: 'A', repo: 'a', needs: { pets: [{ repo: 'b', how: 'required' }] } }, { id: 'b', name: 'B', repo: 'b', needs: { pets: [{ repo: 'a', how: 'required' }] } },
    { id: 'c', name: 'C', repo: 'c', needs: { pets: [{ repo: 'nowhere', how: 'required' }] } }];
  assert.match(requiredClosure(fake, ['a']).stops.join(), /a loop of required pets: a > b > a/);
  assert.match(requiredClosure(fake, ['c']).stops.join(), /C needs nowhere, which is not one of this farm's pets/);
  for (const p of all) {
    const r = requiredClosure(all, [p.id], ['farmer']);
    assert.deepEqual(r.stops, [], `${p.id}: every pet it requires is one of the installer's pets`);
  }
});

test('setting up a farm from scratch (Linux) brings the needed pets and writes the farm lock, which keeps its history', () => {
  const dir = temp();
  try {
    const choice = choosePets(all, { farm: 'scratch', pets: ['evidence-locker', 'goldfish', 'voicemeeter-bug'] });
    assert.deepEqual(choice.picked, ['forensic-ferret', 'goldfish', 'voicemeeter-bug']);
    assert.deepEqual(choice.keep, ['goldfish', 'voicemeeter-bug', 'log-lynx', 'forensic-ferret']);
    assert.deepEqual(choice.neededBy, { 'log-lynx': ['evidence-locker'] });
    writeFarm(root, dir, choice, { version: 'v-test', now: NOW });
    const lock = json(join(dir, LOCK));
    assert.equal(lock.schema, SCHEMA);
    assert.deepEqual(lock.pets.map((p) => [p.id, p.chosen, p.needed_by]), [['farmer', true, []], ['goldfish', true, []], ['voicemeeter-bug', true, []],
      ['log-lynx', false, ['evidence-locker']], ['forensic-ferret', true, []]]);
    const pet = (id) => lock.pets.find((p) => p.id === id);
    assert.deepEqual(pet('goldfish').missing.map((m) => [m.kind, m.id, m.state]), [['core', 'daily-round', 'not on this farm'], ['program', 'github', 'not checked']], 'answer 4: it comes in, and the lock marks it');
    assert.deepEqual(pet('voicemeeter-bug').missing.map((m) => m.name), ['Voicemeeter']);
    assert.equal(pet('forensic-ferret').entry.sha256, entryHash(json(join(dir, 'pets.json')).pets.find((p) => p.art === 'forensic-ferret')));
    assert.equal(pet('forensic-ferret').account, upstream().owner);
    assert.equal(lock.farm.github_owner, upstream().owner);
    assert.ok(!JSON.stringify(lock).includes(tmpdir()), 'no folder path of this computer in the farm lock');
    writeFarm(root, dir, choosePets(all, { farm: 'scratch', pets: ['goldfish'] }), { version: 'v-test', now: NOW });
    const again = json(join(dir, LOCK));
    assert.deepEqual(again.history.map((h) => h.did), ['set up', 'set up']);
    assert.deepEqual(ids(again.pets), ['farmer', 'goldfish']);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('the Friendly Farmer adds a pet with what it needs, says what he cannot add, and the farm lock follows', () => {
  const dir = temp();
  try {
    installedFarm(dir, ['goldfish']);
    let farm = readFarm(dir);
    assert.equal(farm.kind, 'installed');
    assert.deepEqual(checkFarm(farm), [`This farm has no farm lock (${LOCK}) yet: write one with lock.`]);
    writeLock(farm, { now: NOW });
    farm = readFarm(dir);
    assert.deepEqual(checkFarm(farm), []);
    const plan = planAdd(farm, ['evidence-locker', 'Voicemeeter Bug', 'nobody']);
    assert.deepEqual(plan.changes.map((c) => [c.id, c.chosen]), [['voicemeeter-bug', true], ['log-lynx', false], ['forensic-ferret', true]]);
    assert.match(plan.changes[1].says, /^needed by Forensic Ferret: It is built against Log Den/);
    assert.match(plan.stops.join(), /no pet called 'nobody'/);
    assert.throws(() => applyPlan(farm, plan, { restart: () => 'none' }), /Not done/);
    assert.equal(json(join(dir, 'pets.json')).pets.length, 2, 'a plan changes nothing');
    const good = planAdd(farm, ['evidence-locker', 'voicemeeter-bug']);
    assert.deepEqual(good.stops, []);
    assert.deepEqual(good.missing.map((m) => [m.name, m.items.map((i) => i.name)]), [['Voicemeeter Bug', ['Voicemeeter']]]);
    assert.ok(good.notes.some((n) => /works with Packet Piranha \(packet-river, optional\): not on your farm/.test(n)));
    let restarted = 0;
    const { lock } = applyPlan(farm, good, { restart: () => { restarted += 1; return 'restarted'; }, now: NOW });
    assert.equal(restarted, 1, 'Startup Star restarts so the desktop pets show it');
    assert.deepEqual(json(join(dir, 'pets.json')).pets.map((p) => p.art), ['farmer', 'goldfish', 'voicemeeter-bug', 'log-lynx', 'forensic-ferret']);
    assert.deepEqual(lock.history.map((h) => [h.did, h.pets]), [['lock', []], ['add', ['voicemeeter-bug', 'log-den', 'evidence-locker']]]);
    farm = readFarm(dir);
    assert.deepEqual(checkFarm(farm), []);
    assert.deepEqual(planAdd(farm, ['log-lynx']).notes[0], 'Log Lynx is on your farm already, because another pet needs it. Now it counts as one you chose.');
    // A hand edit shows.
    const edited = json(join(dir, 'pets.json'));
    edited.pets.find((p) => p.art === 'goldfish').job = 'changed by hand';
    writeFileSync(join(dir, 'pets.json'), JSON.stringify(edited));
    assert.match(checkFarm(readFarm(dir)).join('\n'), /GitHub Goldfish's entry is not the one the farm lock was written with[\s\S]*differs from the one on the farm's list/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('a pet that others need is not taken away without --with-dependents; one that came only as a need goes with --and-unneeded', () => {
  const dir = temp();
  try {
    installedFarm(dir, ['packet-river', 'evidence-locker']);
    writeLock(readFarm(dir), { chosen: ['packet-piranha', 'forensic-ferret'], now: NOW });
    const farm = readFarm(dir);
    const stop = planRemove(farm, ['log-den']);
    assert.deepEqual(stop.stops, ['Packet Piranha needs Log Lynx: take Packet Piranha away first, or both together with --with-dependents.',
      'Forensic Ferret needs Log Lynx: take Forensic Ferret away first, or both together with --with-dependents.']);
    const all3 = planRemove(farm, ['log-den'], { withDependents: true });
    assert.deepEqual(all3.stops, []);
    assert.deepEqual(all3.changes.map((c) => c.id).sort(), ['forensic-ferret', 'log-lynx', 'packet-piranha']);
    const one = planRemove(farm, ['evidence-locker']);
    assert.deepEqual(one.changes.map((c) => c.id), ['forensic-ferret'], 'Packet Piranha still needs Log Lynx');
    assert.ok(one.notes.includes("Nothing else goes: each pet's data on this computer, its pictures and its repo on GitHub stay."));
    assert.deepEqual(planRemove(farm, ['farmer']).stops, ['Friendly Farmer is a core pet: on every farm, it cannot be taken away.']);
    applyPlan(farm, planRemove(farm, ['packet-river']), { restart: () => 'none', now: NOW });
    const after = readFarm(dir);
    const last = planRemove(after, ['evidence-locker']);
    assert.match(last.notes.join(), /Log Lynx came only because another pet needed it, and nothing on your farm needs it now\. Take it away too with --and-unneeded/);
    const tidy = planRemove(after, ['evidence-locker'], { andUnneeded: true });
    assert.deepEqual(tidy.changes.map((c) => c.id), ['forensic-ferret', 'log-lynx']);
    applyPlan(after, tidy, { restart: () => 'none', now: NOW });
    assert.deepEqual(json(join(dir, 'pets.json')).pets.map((p) => p.art), ['farmer']);
    assert.deepEqual(checkFarm(readFarm(dir)), []);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('developer mode and Linux have no desktop pets; a Windows-only program is marked, not refused', () => {
  const parts = coreParts({ kind: 'installed', os: 'linux', mode: 'farm' });
  assert.deepEqual(parts, { 'startup-star': false, 'daily-round': false });
  assert.deepEqual(coreParts({ kind: 'installed', os: 'windows', mode: 'developer' })['startup-star'], false);
  const registry = JSON.parse(read('pets.json'));
  const bug = all.find((p) => p.id === 'voicemeeter-bug');
  assert.deepEqual(missingNeeds(bug.needs, { os: 'linux', parts }, registry, JSON.parse(read('system-map.json'))).map((m) => [m.kind, m.name, m.state]),
    [['os', 'Windows 10 or 11', 'not this computer'], ['program', 'Voicemeeter', 'not checked']]);
  const claude = { pets: [], core: [{ part: 'startup-star', how: 'required' }], programs: [], os: [] };
  assert.deepEqual(missingNeeds(claude, { os: 'windows', parts: coreParts({ kind: 'installed', os: 'windows', mode: 'developer' }) }, registry, {})
    .map((m) => m.name), ['Startup Star']);
});

test('a hub copy changes its pets only by pull request; lock records it, with each clone next to it', () => {
  const base = temp();
  try {
    const hub = join(base, 'astras-pet-os');
    mkdirSync(join(hub, 'desktop-art'), { recursive: true });
    for (const f of ['pets.json', DRAFTS_LIST, 'system-map.json', 'package.json']) copyFileSync(join(root, f), join(hub, f));
    const g = (cwd, ...a) => execFileSync('git', ['-C', cwd, ...a], { stdio: 'pipe' });
    g(base, 'init', '-q', hub);
    const clone = join(base, 'log-den');
    mkdirSync(clone);
    g(base, 'init', '-q', clone);
    writeFileSync(join(clone, 'README.md'), 'Log Lynx\n');
    g(clone, 'add', '.'); g(clone, '-c', 'user.name=t', '-c', 'user.email=t@example.com', 'commit', '-q', '-m', 'x');
    writeFileSync(join(clone, 'notes.txt'), 'not committed\n');
    const farm = readFarm(hub);
    assert.equal(farm.kind, 'hub copy');
    const r = spawnSync(process.execPath, [TOOL, 'add', 'goldfish', '--yes', '--farm', hub], { encoding: 'utf8' });
    assert.equal(r.status, 1);
    assert.match(r.stderr, /hub copy \(git\).*changes only by pull request/);
    const lock = writeLock(farm, { now: NOW });
    assert.equal(lock.pets.length, all.length);
    const lynx = lock.pets.find((p) => p.id === 'log-lynx');
    assert.equal(lynx.code.folder, '../log-den');
    assert.equal(lynx.code.uncommitted, true);
    assert.match(lynx.code.commit, /^[0-9a-f]{40}$/);
    assert.equal(lock.pets.find((p) => p.id === 'goldfish').code, null);
  } finally { rmSync(base, { recursive: true, force: true }); }
});

test('the farm-pets command: plan first, then --yes; check and lock', () => {
  const dir = temp();
  const run = (...a) => spawnSync(process.execPath, [TOOL, ...a, '--farm', dir], { encoding: 'utf8', env: { ...process.env, ASTRAS_PET_OS_NO_STAR_RESTART: '1' } });
  try {
    installedFarm(dir, []);
    assert.match(run('lock').stdout, /Wrote farm-lock-20261021\.json: 1 pet \(Friendly Farmer\)/);
    const plan = run('plan', 'add', 'evidence-locker');
    assert.equal(plan.status, 0, plan.stderr);
    assert.match(plan.stdout, /\+ Log Lynx \(log-den\): needed by Forensic Ferret/);
    assert.match(plan.stdout, /To do it: node scripts\/farm-pets-20261021\.mjs add evidence-locker --yes/);
    assert.equal(json(join(dir, 'pets.json')).pets.length, 1, 'plan changes nothing');
    assert.equal(run('add', 'evidence-locker').status, 0);
    assert.equal(json(join(dir, 'pets.json')).pets.length, 1, 'without --yes it only shows the plan');
    const done = run('add', 'evidence-locker', '--yes');
    assert.equal(done.status, 0, done.stderr);
    assert.match(done.stdout, /Done\. The farm lock/);
    assert.deepEqual(json(join(dir, 'pets.json')).pets.map((p) => p.art), ['farmer', 'log-lynx', 'forensic-ferret']);
    assert.equal(run('check').stdout.trim(), 'The farm is what its farm lock says.');
    const refused = run('remove', 'log-den', '--yes');
    assert.equal(refused.status, 1);
    assert.match(refused.stdout, /STOP: Forensic Ferret needs Log Lynx/);
    assert.match(run('help').stdout, /plan add <pet\.\.\.>/);
    assert.equal(spawnSync(process.execPath, [TOOL, 'check', '--farm', tmpdir()], { encoding: 'utf8' }).status, 1, 'not a farm');
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('an install made before the farm catalog asks for the installer once more', () => {
  const dir = temp();
  try {
    installedFarm(dir, []);
    rmSync(join(dir, CATALOG), { recursive: true });
    assert.throws(() => readFarm(dir), /installed before the Friendly Farmer kept its list of pets \(farm-catalog\)\. Run the installer once more/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('the installer keeps the catalog, writes the farm lock, ticks needed pets and never ships a farm lock of its own', () => {
  const installer = read('installer/install-astras-pet-os-20261014.ps1');
  assert.match(installer, /robocopy \$source \$InstallDir \/E \/XD \.git node_modules bin \.claude \$farmCatalog \/XF \$farmLock /);
  assert.match(installer, /Copy-Item -LiteralPath \(Join-Path \$source 'pets\.json'\) -Destination \(Join-Path \$catalogDir 'pets\.json'\)/);
  assert.match(installer, /New-FarmLock \$InstallDir \$chosenIds \$lockInfo/);
  assert.match(installer, /\$farmLock = 'farm-lock-20261021\.json'/);
  assert.match(installer, /NeededBy = 'Needed by \{0\}\.'/);
  assert.match(installer, /\$upstreamOwner = '(\w+)'/);
  assert.equal(/\$upstreamOwner = '(\w+)'/.exec(installer)[1], upstream().owner, "the installer's upstream is upstream()");
  const ignored = read('.gitignore').split(/\r?\n/);
  assert.ok(ignored.includes(LOCK) && ignored.includes(`${CATALOG}/`), '.gitignore: a farm lock and a farm catalog are never committed');
});

test('farm-pets is a tool of The Farm on the System Map', () => {
  const node = JSON.parse(read('system-map.json')).nodes.find((n) => n.id === 'farm-pets');
  assert.equal(node.label, TOOL_LABEL);
  assert.equal(node.of, 'farm');
  assert.equal(node.type, 'tool');
});

const windows = { skip: process.platform !== 'win32' && 'needs Windows PowerShell' };

/** Runs the installer's own functions, taken out of it unchanged, with `body` after them; returns its output as JSON. */
function installerFunctions(body) {
  const q = (s) => `'${s.replace(/'/g, "''")}'`;
  const names = ['Read-Json', 'Get-Field', 'Get-FarmPets', 'ConvertTo-JsonText', 'ConvertTo-CanonicalJson', 'Get-EntryHash', 'Get-NeedsByRepo', 'Get-PetNeeds',
    'Get-RequiredRepos', 'Resolve-NeededPets', 'Add-NeededPets', 'Find-FarmPicks', 'Get-MissingNeeds', 'Get-ProgramNames', 'Get-PetAccount', 'New-FarmLock'];
  const script = [
    '[Console]::OutputEncoding = [Text.Encoding]::UTF8',
    `$ast = [System.Management.Automation.Language.Parser]::ParseFile(${q(join(root, 'installer', 'install-astras-pet-os-20261014.ps1'))}, [ref]$null, [ref]$null)`,
    `$defs = $ast.FindAll({ param($n) $n -is [System.Management.Automation.Language.FunctionDefinitionAst] -and @(${names.map(q).join(',')}) -contains $n.Name }, $true)`,
    'Add-Type -AssemblyName System.Web.Extensions',
    '$json = New-Object System.Web.Script.Serialization.JavaScriptSerializer; $json.MaxJsonLength = 16777216',
    "$draftsList = 'desktop-art\\desktop-drafts-20261018.json'; $farmLock = 'farm-lock-20261021.json'; $farmCatalog = 'farm-catalog'",
    `$upstreamOwner = ${q(upstream().owner)}`,
    'foreach ($d in $defs) { . ([scriptblock]::Create($d.Extent.Text)) }',
    body,
  ].join('\n');
  const file = join(temp(), 'run.ps1');
  writeFileSync(file, `﻿${script}`);
  try { return JSON.parse(execFileSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', file], { encoding: 'utf8', maxBuffer: 1 << 26 })); }
  finally { rmSync(join(file, '..'), { recursive: true, force: true }); }
}

test("the installer's twin hashes every pet's entry as Node does, and needs the same pets (Windows)", windows, () => {
  const q = (s) => `'${s.replace(/'/g, "''")}'`;
  const out = installerFunctions([
    `$reg = Read-Json ${q(join(root, 'pets.json'))}; $drafts = Read-Json ${q(join(root, DRAFTS_LIST))}`,
    `$all = Get-FarmPets ${q(root)}; $core = @($all | Where-Object { $_.Core } | ForEach-Object { $_.Id })`,
    '$hashes = [ordered]@{}; foreach ($p in @($reg.pets)) { $hashes["pets:$($p.art)"] = Get-EntryHash $p }; foreach ($d in @($drafts.pets)) { $hashes["drafts:$($d.id)"] = Get-EntryHash $d }',
    '$needs = [ordered]@{}; foreach ($p in $all) { $r = Resolve-NeededPets $all $reg @($p.Id) $core; $needs[$p.Id] = [ordered]@{ keep = [object[]]$r.Keep; neededBy = $r.NeededBy; stops = [object[]]$r.Stops } }',
    "$both = Resolve-NeededPets $all $reg @('packet-piranha','forensic-ferret') $core",
    '$accounts = [ordered]@{}; foreach ($p in $all) { $accounts[$p.Repo] = Get-PetAccount $reg $p.Repo }',
    "ConvertTo-CanonicalJson ([ordered]@{ hashes = $hashes; needs = $needs; both = [ordered]@{ keep = [object[]]$both.Keep; neededBy = $both.NeededBy }; accounts = $accounts; picks = [object[]]@(Find-FarmPicks $all @('Forensic Ferret, log-den', 'goldfish')) })",
  ].join('\n'));
  const reg = JSON.parse(read('pets.json')), drafts = JSON.parse(read(DRAFTS_LIST));
  const hashes = Object.fromEntries([...reg.pets.map((p) => [`pets:${p.art}`, entryHash(p)]), ...drafts.pets.map((d) => [`drafts:${d.id}`, entryHash(d)])]);
  assert.deepEqual(out.hashes, hashes);
  for (const p of all) {
    const r = requiredClosure(all, [p.id], ['farmer']);
    assert.deepEqual(out.needs[p.id], { keep: r.keep, neededBy: r.neededBy, stops: r.stops }, p.id);
  }
  assert.deepEqual(out.both, { keep: ['log-lynx', 'packet-piranha', 'forensic-ferret'], neededBy: requiredClosure(all, ['packet-piranha', 'forensic-ferret'], ['farmer']).neededBy });
  assert.deepEqual(out.picks, ['forensic-ferret', 'log-lynx', 'goldfish']);
  for (const p of all) assert.equal(out.accounts[p.repo], ownerOf(reg, p.repo), p.repo);
});

test("the installer's farm lock is the one Node writes for the same farm (Windows)", windows, () => {
  const dir = temp();
  const q = (s) => `'${s.replace(/'/g, "''")}'`;
  try {
    const choice = installedFarm(dir, ['evidence-locker', 'goldfish', 'voicemeeter-bug', 'rgbee', 'chat-rat']);
    for (const [mode, star] of [['farm', true], ['developer', false]]) {
      const ps = installerFunctions([
        `$info = @{ Version = 'v-test'; Commit = $null; Mode = ${q(mode)}; Os = 'windows'; Parts = [ordered]@{ 'startup-star' = $${star}; 'daily-round' = $false } }`,
        `$lock = New-FarmLock ${q(dir)} @(${choice.picked.map(q).join(',')}) $info (Get-ProgramNames ${q(root)}) $null 'set up' ${q(NOW)}`,
        'ConvertTo-CanonicalJson $lock',
      ].join('\n'));
      const farmFiles = { registry: json(join(dir, 'pets.json')), drafts: json(join(dir, DRAFTS_LIST)) };
      const node = buildLock({ farm: farmFiles, onFarm: farmPets(dir), chosen: choice.picked,
        info: { kind: 'installed', release: { version: 'v-test', commit: null }, mode, os: 'windows', parts: coreParts({ kind: 'installed', os: 'windows', mode }),
          writtenBy: 'installer/install-astras-pet-os-20261014.ps1', cameFrom: 'installer' },
        extra: JSON.parse(read('system-map.json')), did: { did: 'set up', pets: farmPets(dir).map((p) => p.repo) }, now: NOW });
      assert.deepEqual(ps, JSON.parse(JSON.stringify(node)), mode);
    }
    // The Farmer reads the installer's lock and finds the farm as it says.
    const ps = installerFunctions([
      `$info = @{ Version = 'v-test'; Commit = $null; Mode = 'farm'; Os = 'windows'; Parts = [ordered]@{ 'startup-star' = $true; 'daily-round' = $false } }`,
      `ConvertTo-CanonicalJson (New-FarmLock ${q(dir)} @(${choice.picked.map(q).join(',')}) $info (Get-ProgramNames ${q(root)}) $null 'set up' ${q(NOW)})`,
    ].join('\n'));
    writeFileSync(join(dir, LOCK), `${canonicalJson(ps)}\n`);
    assert.deepEqual(checkFarm(readFarm(dir)), []);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
