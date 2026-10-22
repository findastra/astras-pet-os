// The installer's "Set up your farm" window (Astra, 2026-10-18): Astra's example pets, or from scratch with the core
// pets and any example pets ticked. A farm may leave any pet out, so the desktop pets must run with the Farmer alone.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-18.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = (rel) => readFileSync(join(root, rel), 'utf8').replace(/^﻿/, '');
const installer = read('installer/install-astras-pet-os-20261014.ps1');
const desktop = read('scripts/desktop-pets-20261011.cs');

test("the window offers Astra's two farms in her words, and the core pets cannot be unticked", () => {
  assert.ok(installer.includes("Set up Your Farm with Astra's Example Pets"));
  assert.ok(installer.includes('Set up Your Farm From Scratch'));
  assert.ok(installer.includes('you can delete, modify, or clone any of them'));
  assert.ok(installer.includes('Core pets: on every farm, they cannot be taken away'));
  assert.match(installer, /Add_ItemCheck\(\{[^}]*Tag\.Core\) \{ \$e\.NewValue = 'Checked' \}/);
  assert.match(installer, /\[ValidateSet\('Example', 'Scratch'\)\]\[string\]\$Farm/, '-Farm chooses without the window, for AI agents');
});

test('the core pets are the host, and there is exactly one', () => {
  const hosts = JSON.parse(read('pets.json')).pets.filter((p) => p.role === 'host');
  assert.deepEqual(hosts.map((p) => p.art), ['farmer']);
  assert.match(installer, /Core = \(\[string\]\(Get-Field \$p 'role'\) -eq 'host'\)/);
});

test('the installer is plain ASCII, so Windows PowerShell 5.1 reads it the same on every PC', () => {
  assert.ok(![...installer].some((c) => c.charCodeAt(0) > 127));
});

test('the desktop pets run with the Farmer alone and never look up a pet that may not be there', () => {
  assert.ok(!desktop.includes('pets.Count==0)throw'), 'a farm from scratch can be the Farmer alone');
  const unguarded = [...desktop.matchAll(/(.{0,40})pets\.Find\(p=>p\.Id=="([\w-]+)"\)\.\w+/g)].filter((m) => !/==null\?[^:]*:$/.test(m[1]));
  assert.deepEqual(unguarded.map((m) => m[2]), [], 'look up a named pet with a null check (PetHit), never pets.Find(...).Hit');
});

test('from scratch, the installed farm holds only the core pets, the ticked pets and the pets they need (Windows)', { skip: process.platform !== 'win32' && 'needs Windows PowerShell and its C# compiler' }, () => {
  const out = mkdtempSync(join(tmpdir(), 'farm-'));
  const dir = join(out, 'astras-pet-os');
  try {
    const said = execFileSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', join(root, 'installer', 'install-astras-pet-os-20261014.ps1'),
      '-InstallDir', dir, '-ShortcutDir', join(out, 'shortcuts'), '-NoLaunch', '-Farm', 'Scratch', '-Pets', 'goldfish,rgbee,evidence-locker'], { encoding: 'utf8', stdio: 'pipe', timeout: 240000 });
    assert.match(said, /Log Lynx comes along: Forensic Ferret needs it\./, "Astra's answer 6 (2026-10-21): a picked pet brings the pets it needs");
    const installed = (rel) => JSON.parse(readFileSync(join(dir, rel), 'utf8').replace(/^﻿/, ''));
    assert.deepEqual(installed('pets.json').pets.map((p) => p.art), ['farmer', 'goldfish', 'log-lynx', 'forensic-ferret']);
    assert.deepEqual(installed('desktop-art/desktop-drafts-20261018.json').pets.map((p) => p.id), ['rgbee']);
    const { pets, ...rest } = installed('pets.json');
    const { pets: all, ...release } = JSON.parse(read('pets.json'));
    assert.deepEqual(rest, release, 'everything but the pet list stays as released');
    const receipt = installed('install-receipt.json');
    assert.equal(receipt.farm, 'scratch');
    assert.deepEqual(receipt.pets, ['farmer', 'goldfish', 'log-lynx', 'forensic-ferret', 'rgbee']);
    // The farm keeps its release's list of pets and writes its farm lock (Part 5a of card 058).
    assert.deepEqual(installed('farm-catalog/pets.json'), JSON.parse(read('pets.json')));
    const lock = installed('farm-lock-20261021.json');
    assert.deepEqual(lock.pets.map((p) => [p.id, p.chosen]), [['farmer', true], ['goldfish', true], ['log-lynx', false], ['forensic-ferret', true], ['rgbee', true]]);
    assert.deepEqual(lock.pets.find((p) => p.id === 'log-lynx').needed_by, ['evidence-locker']);
    // The Friendly Farmer works on that farm: he adds Packet Piranha, refuses to take Log Lynx away, and the lock follows.
    const farmer = (...args) => spawnSync(process.execPath, [join(root, 'scripts', 'farm-pets-20261021.mjs'), ...args, '--farm', dir],
      { encoding: 'utf8', env: { ...process.env, ASTRAS_PET_OS_NO_STAR_RESTART: '1' } });
    assert.equal(farmer('check').status, 0, farmer('check').stdout);
    const add = farmer('add', 'packet-river', '--yes');
    assert.equal(add.status, 0, add.stdout + add.stderr);
    assert.deepEqual(installed('pets.json').pets.map((p) => p.art), ['farmer', 'goldfish', 'log-lynx', 'packet-piranha', 'forensic-ferret']);
    assert.match(farmer('remove', 'log-lynx', '--yes').stdout, /STOP: Packet Piranha needs Log Lynx/);
    assert.equal(farmer('check').stdout.trim(), 'The farm is what its farm lock says.');
    assert.deepEqual(installed('farm-lock-20261021.json').history.map((h) => h.did), ['set up', 'add']);
  } finally { rmSync(out, { recursive: true, force: true }); }
});
