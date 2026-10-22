// Pet packs come onto a farm (Astra, 2026-10-22: "Start Part 5b here: pet packs come onto a farm, checked file by file
// against the pet's own repo on GitHub, with --unchecked on purpose, the pet's code next to the farm, and the
// uninstaller removing pack folders"; Part 5b of card 058, docs/farm-lock-20261021.md). These tests never ask GitHub:
// a throwaway git repo stands in for the pet's repo, and checkPack is given it. Claude Opus 5.5 (claude-opus-5-5), 2026-10-22.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { appendFileSync, copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DRAFTS_LIST, RECEIPT, choosePets, farmPets, writeFarmFiles } from '../scripts/farm-setup-20261019.mjs';
import { CATALOG, LOCK } from '../scripts/farm-lock-20261021.mjs';
import { applyPlan, checkFarm, planAddPack, planRemove, readFarm, writeLock } from '../scripts/farm-pets-20261021.mjs';
import { checkPack, codeDifferences, codeFolder, folderChanges, readPack } from '../scripts/farm-pets-packs-20261022.mjs';
import { MANIFEST, buildPack, repoAt, unzip, zip } from '../scripts/pet-packs-20261020.mjs';
import { readSpawnerSources } from '../scripts/pet-program-pages-20261018.mjs';

const root = fileURLToPath(new URL('..', import.meta.url)).replace(/[\\/]$/, '');
const read = (rel) => readFileSync(join(root, rel), 'utf8').replace(/^﻿/, '');
const json = (path) => JSON.parse(readFileSync(path, 'utf8').replace(/^﻿/, ''));
const sha256 = (b) => createHash('sha256').update(b).digest('hex');
const temp = () => mkdtempSync(join(tmpdir(), 'farm-packs-test-'));
const NOW = '2026-10-22T09:00:00-06:00';
const all = farmPets(root);
const src = readSpawnerSources(root);
const NONE = () => 'none';

// A throwaway git repo standing in for Forensic Ferret's repo (evidence-locker), as in the pet-packs tests.
function fakeRepo(files) {
  const dir = temp();
  const git = (...a) => execFileSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', '-c', 'core.autocrlf=false', ...a], { cwd: dir, stdio: 'pipe' });
  git('init', '-q', '-b', 'main');
  for (const [p, body] of Object.entries(files)) { mkdirSync(join(dir, p, '..'), { recursive: true }); writeFileSync(join(dir, p), body); }
  git('add', '-A'); git('commit', '-q', '-m', 'A pet at one version');
  return { gitDir: join(dir, '.git'), done: () => rmSync(dir, { recursive: true, force: true }) };
}
const PET = {
  'README.md': '# Evidence Locker\n\n*By Astra.*\n\nBuild it on Windows.\n',
  'pet.json': JSON.stringify({ pet: 'Forensic Ferret', version: '0.2.0-test' }),
  'src/main.cs': 'class A { }\r\n',
};
/** A pet pack of a fake repo: { pack (readPack), zip, git } */
function packOf(files) {
  const git = fakeRepo(files);
  const built = buildPack(src, 'evidence-locker', { repoFiles: repoAt(git.gitDir), date: '20261022', root, allowPrivate: true });
  return { zip: built.zip, files: built.files, pack: readPack(built.zip, built.name), git };
}
const fromGit = (git) => (registry, repo, commit) => repoAt(git.gitDir, commit);

/** An installed Windows farm in `base/astras-pet-os`, as the installer leaves it, with a farm lock. */
function installedFarm(base, picks = [], { linux = false } = {}) {
  const dir = join(base, linux ? 'farm' : 'astras-pet-os');
  mkdirSync(join(dir, CATALOG, 'desktop-art'), { recursive: true });
  copyFileSync(join(root, 'system-map.json'), join(dir, 'system-map.json'));
  if (linux) writeFileSync(join(dir, RECEIPT), JSON.stringify({ product: "Astra's PetOS", version: 'v-test', farm: 'scratch', release_dir: root }));
  else {
    copyFileSync(join(root, 'pets.json'), join(dir, CATALOG, 'pets.json'));
    copyFileSync(join(root, DRAFTS_LIST), join(dir, CATALOG, DRAFTS_LIST));
    writeFileSync(join(dir, 'install-receipt.json'), JSON.stringify({ product: "Astra's PetOS", version: 'v-test', mode: 'farm', farm: 'scratch', source_commit: null }));
  }
  writeFarmFiles(linux ? root : join(dir, CATALOG), dir, choosePets(all, { farm: 'scratch', pets: picks }).keep);
  writeLock(readFarm(dir), { now: NOW });
  return dir;
}

test('a pack is read and checked against itself: every file listed with its SHA-256, nothing else, safe paths only', () => {
  const p = packOf(PET);
  try {
    assert.deepEqual(p.pack.stops, []);
    assert.equal(p.pack.repo, 'evidence-locker');
    assert.deepEqual(Object.keys(p.pack.code).sort(), ['README.md', 'pet.json', 'src/main.cs']);
    const files = unzip(p.zip);
    const top = p.pack.top;
    const again = (change) => { const f = { ...files }; change(f); return readPack(zip(f, '20261022'), 'changed.zip').stops.join('\n'); };
    assert.match(again((f) => { f[`${top}/evidence-locker/README.md`] = Buffer.from('# changed\n'); }), /evidence-locker\/README\.md is not the file the manifest names/);
    assert.match(again((f) => { f[`${top}/evidence-locker/extra.txt`] = Buffer.from('hi\n'); }), /evidence-locker\/extra\.txt is in the zip but not in its manifest/);
    assert.match(again((f) => { delete f[`${top}/evidence-locker/pet.json`]; }), /evidence-locker\/pet\.json is in the manifest but not in the zip/);
    assert.match(again((f) => { f['../outside.txt'] = Buffer.from('x'); }), /could write outside its folder/);
    assert.match(again((f) => { f['other-folder/x.txt'] = Buffer.from('x'); }), /2 folders at its top/);
    assert.match(again((f) => { delete f[`${top}/${MANIFEST}`]; }), /no pet-pack-20261020\.json, so it is not a pet pack/);
    assert.match(readPack(Buffer.from('not a zip'), 'x.zip').stops.join(), /is not a pet pack zip/);
  } finally { p.git.done(); }
});

test('a pack must be one of the farm\'s pets, from the account its list names, for this computer, with no key in it', () => {
  const base = temp();
  const p = packOf(PET);
  try {
    const farm = readFarm(installedFarm(base));
    const repack = (change) => { const f = unzip(p.zip); const top = p.pack.top; const m = JSON.parse(f[`${top}/${MANIFEST}`]); change(m, f, top); f[`${top}/${MANIFEST}`] = Buffer.from(JSON.stringify(m)); return readPack(zip(f, '20261022'), 'x.zip'); };
    const stops = (pack, f = farm) => checkPack(f, pack, { getRepo: fromGit(p.git) }).stops.join('\n');
    assert.match(stops(repack((m) => { m.source.repo = 'someone-else/evidence-locker'; })), /came from someone-else\/evidence-locker, but this farm's list says Forensic Ferret lives at findastra\/evidence-locker: a lookalike is refused/);
    assert.match(stops(repack((m) => { m.repo = 'nobody-here'; })), /is not on this farm's list of pets/);
    assert.match(stops(repack((m) => { m.repo = 'astras-pet-os'; })), /core of Astra's PetOS/);
    assert.match(stops(p.pack, { ...farm, info: { ...farm.info, os: 'linux' } }), /Forensic Ferret's code runs on windows, not on this computer \(linux\)/);
    const key = ['sk', 'ant', 'a'.repeat(30)].join('-');
    const leaky = repack((m, f, top) => { const b = Buffer.from(`token ${key}\n`); f[`${top}/evidence-locker/notes.md`] = b; m.files.push({ path: 'evidence-locker/notes.md', sha256: sha256(b), bytes: b.length }); });
    assert.deepEqual(leaky.stops, []);
    assert.match(stops(leaky), /notes\.md holds 1 OpenAI or Anthropic API key/);
  } finally { p.git.done(); rmSync(base, { recursive: true, force: true }); }
});

test("checked against the pet's own repo: code that differs is always refused; code that cannot be checked needs --unchecked", () => {
  const base = temp();
  const p = packOf(PET);
  const other = fakeRepo({ ...PET, 'src/main.cs': 'class B { }\r\n' });
  try {
    const farm = readFarm(installedFarm(base));
    assert.deepEqual(checkPack(farm, p.pack, { getRepo: fromGit(p.git) }).stops, []);
    assert.equal(checkPack(farm, p.pack, { getRepo: fromGit(p.git) }).checked, true);
    const changed = { getRepo: (r, repo) => repoAt(other.gitDir, 'HEAD') };
    assert.match(checkPack(farm, p.pack, changed).stops.join(), /This pack's code is not findastra\/evidence-locker at [0-9a-f]{7}: src\/main\.cs differs from the repo\. It was changed after it was built: never use it/);
    assert.match(checkPack(farm, p.pack, { ...changed, unchecked: true }).stops.join(), /never use it/, '--unchecked never lets in code that differs');
    const offline = { getRepo: () => { throw new Error('findastra/evidence-locker at abc1234 could not be read from GitHub (no internet)'); } };
    assert.match(checkPack(farm, p.pack, offline).stops.join(), /could not be read from GitHub \(no internet\)\. If you trust whoever gave you this pack, add --unchecked/);
    const on = checkPack(farm, p.pack, { ...offline, unchecked: true });
    assert.deepEqual(on.stops, []);
    assert.equal(on.checked, false);
    assert.match(on.notes.join(), /Not checked against GitHub, on purpose \(--unchecked\)/);
    assert.deepEqual(codeDifferences({ a: Buffer.from('1') }, { files: { a: Buffer.from('1'), b: Buffer.from('2') } }), ['b is in the repo but not in the pack']);
  } finally { p.git.done(); other.done(); rmSync(base, { recursive: true, force: true }); }
});

test('a pack brings its pet, the pets it needs and its code next to the farm; the farm lock lists every file', () => {
  const base = temp();
  const p = packOf(PET);
  try {
    const dir = installedFarm(base);
    const plan = planAddPack(readFarm(dir), p.pack, { getRepo: fromGit(p.git) });
    assert.deepEqual(plan.stops, []);
    assert.deepEqual(plan.changes.map((c) => c.id), ['log-lynx', 'forensic-ferret']);
    assert.match(plan.changes[1].says, /^you asked for it; its code from evidence-locker-pet-pack-20261022\.zip \(0\.2\.0-test at [0-9a-f]{7}\) goes into .*evidence-locker, checked file by file against findastra\/evidence-locker/);
    assert.ok(plan.notes.some((n) => n.startsWith('Nothing from a pack runs by itself')));
    assert.ok(!existsSync(join(base, 'evidence-locker')), 'a plan writes nothing');
    const { lock } = applyPlan(readFarm(dir), plan, { restart: NONE, now: NOW });
    const folder = join(base, 'evidence-locker');
    assert.equal(readFileSync(join(folder, 'src', 'main.cs'), 'utf8'), 'class A { }\r\n', 'the code as committed, line endings too');
    const code = lock.pets.find((x) => x.id === 'forensic-ferret').code;
    assert.deepEqual({ ...code, files: undefined, pack_sha256: undefined, manifest_sha256: undefined, commit: undefined }, {
      came_from: 'pet-pack', pack: 'evidence-locker-pet-pack-20261022.zip', folder: '../evidence-locker', version: '0.2.0-test', tag: null,
      checked_against_github: true, files: undefined, pack_sha256: undefined, manifest_sha256: undefined, commit: undefined });
    assert.equal(code.pack_sha256, sha256(p.zip));
    assert.deepEqual(Object.keys(code.files), ['README.md', 'pet.json', 'src/main.cs']);
    assert.equal(lock.pets.find((x) => x.id === 'log-lynx').code, null, 'a pet that came as a need brings no code');
    assert.deepEqual(lock.history.at(-1), { at: NOW, did: 'add', pets: ['log-den', 'evidence-locker'], from: 'evidence-locker-pet-pack-20261022.zip', by: 'scripts/farm-pets-20261021.mjs' });
    assert.deepEqual(checkFarm(readFarm(dir)), []);
    appendFileSync(join(folder, 'README.md'), 'changed by hand\n');
    assert.match(checkFarm(readFarm(dir)).join(), /Forensic Ferret's code in .*evidence-locker is not what its pet pack brought: README\.md was changed/);
  } finally { p.git.done(); rmSync(base, { recursive: true, force: true }); }
});

test('a newer pack replaces the code it brought, never a changed folder or one the Farmer did not put there', () => {
  const base = temp();
  const v1 = packOf(PET);
  const v2 = packOf({ ...PET, 'pet.json': JSON.stringify({ pet: 'Forensic Ferret', version: '0.3.0-test' }), 'src/new.cs': 'class C { }\n' });
  try {
    const dir = installedFarm(base, ['evidence-locker']);
    mkdirSync(join(base, 'evidence-locker'));
    writeFileSync(join(base, 'evidence-locker', 'mine.txt'), 'my own clone\n');
    assert.match(planAddPack(readFarm(dir), v1.pack, { getRepo: fromGit(v1.git) }).stops.join(), /is there already, and the Farmer did not put it there/);
    rmSync(join(base, 'evidence-locker'), { recursive: true });
    applyPlan(readFarm(dir), planAddPack(readFarm(dir), v1.pack, { getRepo: fromGit(v1.git) }), { restart: NONE, now: NOW });
    const update = planAddPack(readFarm(dir), v2.pack, { getRepo: fromGit(v2.git) });
    assert.deepEqual(update.stops, []);
    assert.match(update.changes[0].says, /replaces evidence-locker-pet-pack-20261022\.zip \(0\.2\.0-test at [0-9a-f]{7} becomes 0\.3\.0-test at [0-9a-f]{7}\)/);
    applyPlan(readFarm(dir), update, { restart: NONE, now: NOW });
    assert.ok(existsSync(join(base, 'evidence-locker', 'src', 'new.cs')));
    assert.deepEqual(checkFarm(readFarm(dir)), []);
    writeFileSync(join(base, 'evidence-locker', 'notes.txt'), 'mine\n');
    assert.match(planAddPack(readFarm(dir), v1.pack, { getRepo: fromGit(v1.git) }).stops.join(), /changed since its pack came in \(notes\.txt was added\): move your changes out of it first/);
  } finally { v1.git.done(); v2.git.done(); rmSync(base, { recursive: true, force: true }); }
});

test("taking the pet away takes its pack's code too, but only while every file is the one the Farmer put there", () => {
  const base = temp();
  const p = packOf(PET);
  try {
    const dir = installedFarm(base);
    applyPlan(readFarm(dir), planAddPack(readFarm(dir), p.pack, { getRepo: fromGit(p.git) }), { restart: NONE, now: NOW });
    writeFileSync(join(base, 'evidence-locker', 'notes.txt'), 'mine\n');
    const keep = planRemove(readFarm(dir), ['evidence-locker']);
    assert.match(keep.notes.join(), /Forensic Ferret's code in .*evidence-locker stays: it changed since its pack came in \(notes\.txt was added\)\. Delete it yourself/);
    rmSync(join(base, 'evidence-locker', 'notes.txt'));
    const go = planRemove(readFarm(dir), ['evidence-locker'], { andUnneeded: true });
    assert.match(go.changes[0].says, /its code from its pet pack in .*evidence-locker goes too/);
    applyPlan(readFarm(dir), go, { restart: NONE, now: NOW });
    assert.ok(!existsSync(join(base, 'evidence-locker')));
    assert.deepEqual(json(join(dir, 'pets.json')).pets.map((x) => x.art), ['farmer']);
    assert.deepEqual(folderChanges(join(base, 'nothing-here'), {}), ['the folder is gone']);
  } finally { p.git.done(); rmSync(base, { recursive: true, force: true }); }
});

test('on Linux a pack\'s code goes with the pet services (~/.local/share/astras-pet-os/pets/<repo>)', () => {
  const base = temp();
  try {
    const farm = readFarm(installedFarm(base, [], { linux: true }));
    assert.equal(farm.layout, 'linux');
    assert.deepEqual(codeFolder(farm, 'role-fairy'), { rel: '../pets/role-fairy', abs: join(base, 'pets', 'role-fairy') });
    assert.deepEqual(codeFolder({ ...farm, layout: 'windows' }, 'role-fairy').rel, '../role-fairy');
  } finally { rmSync(base, { recursive: true, force: true }); }
});

test('the command line: one pet pack at a time, and a broken pack stops before GitHub is asked', () => {
  const base = temp();
  const p = packOf(PET);
  const run = (...a) => spawnSync(process.execPath, [join(root, 'scripts', 'farm-pets-20261021.mjs'), ...a], { encoding: 'utf8', env: { ...process.env, ASTRAS_PET_OS_NO_STAR_RESTART: '1' } });
  try {
    const dir = installedFarm(base);
    const f = unzip(p.zip);
    f[`${p.pack.top}/evidence-locker/README.md`] = Buffer.from('# changed\n');
    writeFileSync(join(base, 'broken.zip'), zip(f, '20261022'));
    const broken = run('plan', 'add', join(base, 'broken.zip'), '--farm', dir);
    assert.equal(broken.status, 1);
    assert.match(broken.stdout, /STOP: evidence-locker\/README\.md is not the file the manifest names/);
    assert.match(run('add', join(base, 'broken.zip'), 'goldfish', '--farm', dir).stderr, /Add one pet pack at a time/);
    assert.match(run('help').stdout, /plan add <pet pack\.zip> \[--unchecked\]/);
  } finally { p.git.done(); rmSync(base, { recursive: true, force: true }); }
});

test('the installer says where a leaving pet\'s pack code stays; the packs module never names an account', () => {
  assert.match(read('installer/install-astras-pet-os-20261014.ps1'), /leaves the farm, but the code its pet pack brought stays in \$folder/);
  assert.doesNotMatch(read('scripts/farm-pets-packs-20261022.mjs'), /findastra/i);
});

const windows = { skip: process.platform !== 'win32' && 'needs Windows PowerShell' };

test('the uninstaller removes a pack folder that is unchanged and keeps one that changed (Windows)', windows, () => {
  const base = temp();
  try {
    const dir = join(base, 'astras-pet-os');
    mkdirSync(dir);
    writeFileSync(join(dir, 'install-receipt.json'), '{}');
    const files = (folder, body) => { mkdirSync(join(base, folder, 'src'), { recursive: true }); for (const [p, b] of Object.entries(body)) writeFileSync(join(base, folder, p), b); return Object.fromEntries(Object.entries(body).map(([p, b]) => [p, sha256(Buffer.from(b))])); };
    const same = files('evidence-locker', { 'README.md': 'a\n', 'src/main.cs': 'b\n' });
    const changed = files('log-den', { 'README.md': 'c\n' });
    writeFileSync(join(base, 'log-den', 'mine.txt'), 'changed by hand\n');
    const code = (folder, f) => ({ came_from: 'pet-pack', folder: `../${folder}`, files: f });
    writeFileSync(join(dir, LOCK), JSON.stringify({ pets: [{ id: 'forensic-ferret', pet: 'Forensic Ferret', code: code('evidence-locker', same) },
      { id: 'log-lynx', pet: 'Log Lynx', code: code('log-den', changed) }, { id: 'x', pet: 'X', code: { came_from: 'pet-pack', folder: '../../elsewhere', files: {} } }] }));
    const said = execFileSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', join(root, 'installer', 'uninstall-astras-pet-os-20261014.ps1'),
      '-InstallDir', dir, '-ShortcutDir', join(base, 'shortcuts')], { encoding: 'utf8', timeout: 60000 });
    assert.match(said, /Removed .*evidence-locker, the code Forensic Ferret's pet pack brought\./);
    assert.match(said, /Kept .*log-den \(Log Lynx's code from its pet pack\): 1 of its files changed since it came in, starting with mine\.txt was added\./);
    assert.match(said, /Left as it is: \.\.\/\.\.\/elsewhere is not a folder a pet pack goes in\./);
    assert.ok(!existsSync(join(base, 'evidence-locker')));
    assert.ok(existsSync(join(base, 'log-den', 'mine.txt')));
    for (let i = 0; i < 40 && existsSync(dir); i++) execFileSync(process.execPath, ['-e', 'setTimeout(() => {}, 250)']);
    assert.ok(!existsSync(dir), 'the install folder goes, as before');
  } finally { rmSync(base, { recursive: true, force: true }); }
});
