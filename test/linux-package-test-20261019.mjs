// The Linux package (Astra, 2026-10-19): the farm setup in Node agrees with the Windows installer, the astras-pet-os
// command, pet services that are off unless turned on, Linux Penguin bundled at a pinned commit, and a .deb that
// Debian's tools can read. Claude Opus 5.5 (claude-opus-5-5), 2026-10-19.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { gunzipSync } from 'node:zlib';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DRAFTS_LIST, choosePets, farmPets, writeFarm } from '../scripts/farm-setup-20261019.mjs';
import { SERVICES, serviceExitCode } from '../scripts/linux-cli-20261019.mjs';
import { BUNDLED, NOT_SHIPPED, PACKAGE, PLACED, buildDeb, debVersion, readDeb, readTar, tar, ustarName } from '../scripts/linux-deb-20261019.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = (rel) => readFileSync(join(root, rel), 'utf8').replace(/^﻿/, '');
const cli = join(root, 'scripts', 'linux-cli-20261019.mjs');
const temp = () => mkdtempSync(join(tmpdir(), 'astras-pet-os-linux-test-'));

test('the farm has one core pet, the Friendly Farmer, and never a private draft', () => {
  const pets = farmPets(root);
  assert.deepEqual(pets.filter((p) => p.core).map((p) => p.id), ['farmer']);
  assert.equal(new Set(pets.map((p) => p.id)).size, pets.length, 'every pet id once');
  const privateIds = JSON.parse(read(DRAFTS_LIST)).pets.filter((d) => d.private === true).map((d) => d.id);
  for (const id of privateIds) assert.ok(!pets.some((p) => p.id === id && p.draft), `${id} is private`);
});

test("Astra's example pets, or from scratch with picks by id, repo or name; an unknown pet names the ids", () => {
  const pets = farmPets(root);
  assert.equal(choosePets(pets, { farm: 'example' }).onFarm.length, pets.length);
  const goldfish = pets.find((p) => p.id === 'goldfish');
  const pick = choosePets(pets, { farm: 'Scratch', pets: [`${goldfish.repo}, goldfish`, goldfish.name] });
  assert.deepEqual(pick.keep, ['goldfish'], 'each pet once, however it is named');
  assert.deepEqual(pick.onFarm.map((p) => p.id), ['farmer', 'goldfish']);
  assert.deepEqual(choosePets(pets, { farm: 'scratch' }).onFarm.map((p) => p.id), ['farmer'], 'the Farmer alone');
  assert.throws(() => choosePets(pets, { farm: 'scratch', pets: ['nobody'] }), /no example pet called 'nobody'.*goldfish/);
  assert.throws(() => choosePets(pets, { farm: 'zoo' }), /Choose a farm/);
  assert.deepEqual(choosePets(pets, { farm: 'scratch', pets: ['GoldFish'] }).keep, ['goldfish'], 'case does not matter, as in the installer');
});

test("the farm is written to the person's own folder, kept to the chosen pets as the installer keeps them", () => {
  const dir = temp();
  try {
    const pets = farmPets(root);
    const receipt = writeFarm(root, dir, choosePets(pets, { farm: 'scratch', pets: ['goldfish', 'chat-rat'] }), { version: 'v-test' });
    assert.deepEqual(JSON.parse(readFileSync(join(dir, 'pets.json'), 'utf8')).pets.map((p) => p.art), ['farmer', 'goldfish']);
    assert.deepEqual(JSON.parse(readFileSync(join(dir, DRAFTS_LIST), 'utf8')).pets.map((d) => d.id), ['chat-rat']);
    assert.deepEqual(receipt.pets, ['farmer', 'goldfish', 'chat-rat']);
    assert.equal(receipt.farm, 'scratch');
    writeFarm(root, dir, choosePets(pets, { farm: 'example' }));
    assert.equal(JSON.parse(readFileSync(join(dir, 'pets.json'), 'utf8')).pets.length, JSON.parse(read('pets.json')).pets.length);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('the Node farm setup lists exactly the pets the Windows installer lists', { skip: process.platform !== 'win32' && 'the installer runs on Windows' }, () => {
  // The installer's own Get-FarmPets, taken out of it unchanged (it is never run as a whole here). Paths are quoted for
  // PowerShell, since Astra's folder has an apostrophe; output is UTF-8, since jobs have curly quotes.
  const q = (s) => `'${s.replace(/'/g, "''")}'`;
  const script = [
    '[Console]::OutputEncoding = [Text.Encoding]::UTF8',
    `$ast = [System.Management.Automation.Language.Parser]::ParseFile(${q(join(root, 'installer', 'install-astras-pet-os-20261014.ps1'))}, [ref]$null, [ref]$null)`,
    "$defs = $ast.FindAll({ param($n) $n -is [System.Management.Automation.Language.FunctionDefinitionAst] -and @('Read-Json','Get-Field','Get-FarmPets') -contains $n.Name }, $true)",
    'Add-Type -AssemblyName System.Web.Extensions',
    '$json = New-Object System.Web.Script.Serialization.JavaScriptSerializer; $json.MaxJsonLength = 16777216',
    "$draftsList = 'desktop-art\\desktop-drafts-20261018.json'",
    'foreach ($d in $defs) { . ([scriptblock]::Create($d.Extent.Text)) }',
    `$all = Get-FarmPets ${q(root)}`,
    '$all | ForEach-Object { "$($_.Id)|$($_.Core)|$($_.Draft)|$($_.Repo)|$($_.Job)" }',
  ].join('; ');
  const ps = execFileSync('powershell', ['-NoProfile', '-Command', script], { encoding: 'utf8' }).trim().split(/\r?\n/);
  const node = farmPets(root).map((p) => [p.id, p.core ? 'True' : 'False', p.draft ? 'True' : 'False', p.repo, p.job].join('|'));
  assert.deepEqual(node, ps);
});

function run(args, env = {}) {
  const r = spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8', env: { ...process.env, ...env }, input: '' });
  return { code: r.status, out: r.stdout, err: r.stderr };
}

test('the astras-pet-os command: help, the pet list, setup, and plain refusals', () => {
  const home = temp();
  const env = { XDG_DATA_HOME: join(home, 'data'), XDG_CONFIG_HOME: join(home, 'config') };
  try {
    const help = run([], env);
    assert.equal(help.code, 0);
    for (const c of ['setup', 'list-pets', 'map', 'desk', 'penguin', 'services', 'service on|off', 'stop']) assert.ok(help.out.includes(`astras-pet-os ${c}`), c);
    assert.match(help.out, /Linux Penguin/);
    assert.match(run(['list-pets'], env).out, /farmer\s+core \(always on\)/);
    assert.equal(run(['setup'], env).code, 1, 'with no terminal and no --farm it asks for a choice instead of guessing');
    const ok = run(['setup', '--farm', 'scratch', '--pets', 'goldfish'], env);
    assert.equal(ok.code, 0, ok.err);
    const receipt = JSON.parse(readFileSync(join(env.XDG_DATA_HOME, 'astras-pet-os', 'farm', 'farm-receipt.json'), 'utf8'));
    assert.deepEqual(receipt.pets, ['farmer', 'goldfish']);
    const bad = run(['setup', '--farm', 'scratch', '--pets', 'nobody'], env);
    assert.equal(bad.code, 1);
    assert.match(bad.err, /You can pick: goldfish/);
    assert.equal(run(['fly'], env).code, 1);
  } finally { rmSync(home, { recursive: true, force: true }); }
});

test('pet services are off until someone turns one on, and a pet that is not ready is refused', () => {
  assert.deepEqual(Object.keys(SERVICES).sort(), ['chat-rat', 'role-fairy'], 'Role Fairy and Chat Rat first (Astra, 2026-10-19)');
  for (const [id, s] of Object.entries(SERVICES)) {
    assert.match(s.repo, /^[a-z0-9-]+$/, id);
    assert.ok(s.steps[0].startsWith(`git clone https://github.com/findastra/${s.repo}.git`), `${id}: the person clones it`);
    assert.ok(s.warning, `${id} says what to watch out for`);
  }
  assert.match(SERVICES['role-fairy'].warning, /one computer only/);
  const home = temp();
  try {
    const r = run(['service', 'on', 'role-fairy'], { XDG_DATA_HOME: join(home, 'data'), XDG_CONFIG_HOME: join(home, 'config') });
    assert.equal(r.code, 1);
    assert.match(r.err, /need Linux with systemd|not on this computer yet/);
    assert.match(run(['service', 'on', 'nobody']).err, /no pet service called 'nobody'/);
  } finally { rmSync(home, { recursive: true, force: true }); }
  const unit = read('linux/astras-pet-os-pet-20261019.service');
  assert.match(unit, /^ExecStart=\/usr\/bin\/astras-pet-os service run %i$/m);
  assert.match(unit, /^EnvironmentFile=-%E\/astras-pet-os\/pets\/%i\.env$/m, 'secrets in the person\'s own config, never in the unit');
  assert.match(unit, /^WantedBy=default\.target$/m);
  assert.equal(serviceExitCode(null, 'SIGTERM'), 0, 'systemd stopping a pet is not a failure');
  assert.equal(serviceExitCode(null, 'SIGKILL'), 1);
  assert.equal(serviceExitCode(3, null), 3);
});

test('the app menu entries run commands the astras-pet-os command has', () => {
  for (const [from, to] of PLACED.filter(([f]) => f.endsWith('.desktop'))) {
    const entry = read(from);
    assert.match(entry, /^\[Desktop Entry\]\nType=Application\n/, to);
    const command = /^Exec=astras-pet-os (\w+)$/m.exec(entry)?.[1];
    assert.ok(['map', 'desk', 'stop'].includes(command), `${to}: Exec=${command}`);
  }
  assert.match(read('linux/astras-pet-os-20261019.sh'), /^exec node \/usr\/share\/astras-pet-os\/scripts\/linux-cli-20261019\.mjs "\$@"$/m);
});

test('Linux Penguin is bundled from his own repo at a full commit id', () => {
  const { pets } = JSON.parse(read(BUNDLED));
  assert.deepEqual(pets.map((p) => p.repo), ['linux-iceberg']);
  for (const p of pets) {
    assert.match(p.commit, /^[0-9a-f]{40}$/);
    assert.ok(p.include.includes('tools/') && p.include.includes('skills/'));
    assert.ok(!p.include.includes('LICENSE'), 'the license is in the copyright file, once');
  }
});

test('long and non-ASCII names use plain ustar, which dpkg reads; pax headers, which dpkg refuses, are never written', () => {
  const long = `./usr/share/${'deep/'.repeat(25)}file.txt`;
  assert.deepEqual(ustarName(long), { name: 'file.txt', prefix: long.slice(0, long.lastIndexOf('/')) });
  const folder = long.slice(0, -'file.txt'.length);
  assert.ok(ustarName(folder).name.endsWith('/'), 'a folder keeps its slash');
  const entries = readTar(tar([{ path: long, mode: 0o644, data: Buffer.from('a') }, { path: './usr/share/é.txt', mode: 0o755, data: Buffer.from('bc') }], 0));
  assert.deepEqual(entries.find((e) => e.path === long)?.data.toString(), 'a');
  assert.ok(entries.some((e) => e.path === folder && e.type === '5'), 'its folder reads back whole too');
  assert.equal(entries.find((e) => e.path === './usr/share/é.txt')?.mode, 0o755);
  assert.equal(entries[0].path, './', 'folders come before what is in them');
  assert.deepEqual(entries.filter((e) => e.type === 'x' || e.type === 'g'), []);
  for (const e of entries) assert.equal(e.magic, 'ustar\u000000', e.path);
  assert.throws(() => ustarName(`./${'x'.repeat(101)}`), /too long for a tar header dpkg can read/);
  assert.throws(() => ustarName(`./${'a/'.repeat(130)}b`), /too long/);
});

test('the .deb: one package for every machine, every file checked, nothing that runs at install', () => {
  const out = temp();
  try {
    const built = buildDeb({ tree: 'HEAD', outDir: out, bundled: false }); // offline; the bundle is checked above
    const version = debVersion(JSON.parse(read('package.json')).version);
    assert.ok(built.path.endsWith(`${PACKAGE}_${version}_all.deb`));
    const deb = readDeb(readFileSync(built.path));
    assert.deepEqual(deb.members, ['debian-binary', 'control.tar.gz', 'data.tar.gz']);
    assert.deepEqual(deb.control.filter((e) => e.type === '0').map((e) => e.path), ['./control', './md5sums'], 'no maintainer scripts');
    assert.equal(deb.fields.Package, PACKAGE);
    assert.equal(deb.fields.Version, version);
    assert.equal(deb.fields.Architecture, 'all');
    assert.equal(deb.fields.Depends, 'nodejs (>= 20)');
    const files = new Map(deb.files.filter((e) => e.type === '0').map((e) => [e.path, e]));
    const sums = deb.control.find((e) => e.path === './md5sums').data.toString().trim().split('\n');
    assert.equal(sums.length, files.size);
    for (const line of sums) {
      const [sum, path] = line.split('  ');
      assert.equal(createHash('md5').update(files.get(`./${path}`).data).digest('hex'), sum, path);
    }
    for (const e of deb.files) assert.ok(e.path === './' || e.path.startsWith('./usr/'), e.path);
    assert.equal(files.get(`./usr/bin/${PACKAGE}`).mode, 0o755);
    for (const [, to] of PLACED) assert.ok(files.has(to), to);
    for (const page of ['system-map-20261012.html', 'apps/astras-pet-apps-20261008.html', 'pets.json', 'scripts/linux-cli-20261019.mjs', 'scripts/farm-setup-20261019.mjs'])
      assert.ok(files.has(`./usr/share/${PACKAGE}/${page}`), page);
    const kept = execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' }).split('\n').filter((f) => NOT_SHIPPED.some((re) => re.test(f)));
    for (const f of ['installer/install-astras-pet-os-20261014.ps1', '.gitignore', 'LICENSE', 'linux/astras-pet-os-20261019.sh'])
      assert.ok(kept.includes(f), `${f} is kept out`);
    for (const f of kept) assert.ok(!files.has(`./usr/share/${PACKAGE}/${f}`), `${f} is not shipped`);
    assert.deepEqual(deb.files.filter((e) => e.type === 'x' || e.type === 'g').map((e) => e.path), [], 'no pax headers: dpkg refuses them');
    for (const e of [...deb.files, ...deb.control]) assert.equal(e.magic, 'ustar\u000000', e.path);
    const longest = [...files.keys()].sort((a, b) => Buffer.byteLength(b) - Buffer.byteLength(a))[0];
    assert.ok(Buffer.byteLength(longest) > 100, `a path over 100 bytes (${longest}) is in the package and reads back whole`);
    assert.match(gunzipSync(files.get(`./usr/share/man/man1/${PACKAGE}.1.gz`).data).toString(), /^\.TH ASTRAS-PET-OS 1 /m);
    const icon = files.get(`./usr/share/icons/hicolor/256x256/apps/${PACKAGE}.png`).data;
    assert.equal(icon.toString('latin1', 1, 4), 'PNG');
    assert.deepEqual([icon.readUInt32BE(16), icon.readUInt32BE(20)], [256, 256]);
    assert.match(files.get(`./usr/share/doc/${PACKAGE}/copyright`).data.toString(), /^Format: https:\/\/www\.debian\.org\/doc\/packaging-manuals\/copyright-format\/1\.0\/$/m);
  } finally { rmSync(out, { recursive: true, force: true }); }
});
