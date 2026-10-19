// Astra, 2026-10-18: a friend's AI downloaded the repo instead of the installer, and ran the old Cage. So the Cage stays
// gone, the installer download is the first thing the README shows, every agent is sent to INSTALL.md, and the
// release's installer zip has one obvious thing to double-click. Claude Opus 5.5 (claude-opus-5-5), 2026-10-18.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { INSTALLER_URL } from '../scripts/lib.mjs';
import { ASSET, CMD, README, folder, makeInstallerZip } from '../scripts/installer-zip-20261018.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = (rel) => readFileSync(join(root, rel), 'utf8');
// The files that are gone. docs/farmer-dock-20261008.md stays as the record of what the Farmer dock was.
const GONE = /cage\.html|cage-data\.js|start-farmer-dock|farmer-dock-20261008\.(cs|manifest)/;
const tracked = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);

/** The file names inside a zip, read from its central directory (no unzip program needed). */
export function zipNames(buffer) {
  const names = [];
  for (let i = buffer.indexOf('PK\x01\x02'); i >= 0; i = buffer.indexOf('PK\x01\x02', i + 4)) {
    const length = buffer.readUInt16LE(i + 28);
    names.push(buffer.toString('utf8', i + 46, i + 46 + length));
  }
  return names;
}

test('the Cage and the old desktop Farmer are gone, and no program points at them', () => {
  for (const f of ['cage.html', 'cage-data.js', 'start-farmer-dock-20261008.cmd', 'scripts/farmer-dock-20261008.cs'])
    assert.ok(!existsSync(join(root, f)), `${f} is back`);
  // Records (docs/, handoffs/) may tell the history. The round's workflow is edited by Astra on GitHub, not here.
  const code = tracked.filter((f) => /\.(html|js|mjs|cs|ps1|cmd|json)$/.test(f) && !/^(docs|handoffs|\.github)\//.test(f)
    && f !== 'test/install-link-no-cage-test-20261018.mjs');
  const pointing = code.filter((f) => GONE.test(read(f)));
  assert.deepEqual(pointing, []);
});

test('the README shows the installer download before anything else, and sends agents to INSTALL.md', () => {
  const readme = read('README.md'), first = readme.indexOf(INSTALLER_URL);
  assert.ok(first > 0 && first < readme.indexOf('!['), 'the installer link comes before the first picture');
  assert.match(readme.slice(0, first + 600), /INSTALL\.md/);
  assert.match(INSTALLER_URL, new RegExp(`/releases/latest/download/${ASSET.replace('.', '\\.')}$`));
  const install = read('INSTALL.md');
  assert.ok(install.includes(INSTALLER_URL) && install.includes('-ListPets') && install.includes('-Farm Scratch -Pets'));
});

test('AGENTS.md and CLAUDE.md tell an installing agent to stop and follow INSTALL.md, at the very top', () => {
  for (const f of ['AGENTS.md', 'CLAUDE.md']) {
    const top = read(f).split('\n').slice(0, 5).join('\n');
    assert.match(top, /Installing Astra's PetOS for someone\? Stop here and follow \[INSTALL\.md\]\(INSTALL\.md\)/, f);
  }
});

test('the installer zip holds one folder: the one .cmd to double-click, READ ME FIRST, and the program in files/', () => {
  const out = mkdtempSync(join(tmpdir(), 'installer-zip-'));
  try {
    const names = zipNames(readFileSync(makeInstallerZip('HEAD', join(out, ASSET), root)));
    const top = `${folder('HEAD')}/`;
    assert.ok(names.every((n) => n.startsWith(top)), 'everything sits in one folder');
    const atTop = names.filter((n) => n !== top && !n.slice(top.length).includes('/'));
    assert.deepEqual(atTop.sort(), [top + CMD, top + README].sort(), 'only the .cmd and READ ME FIRST at the top');
    assert.ok(names.includes(`${top}files/installer/install-astras-pet-os-20261014.ps1`));
    assert.ok(names.includes(`${top}files/pets.json`));
    assert.ok(!names.some((n) => GONE.test(n)), 'no Cage in the installer');
  } finally { rmSync(out, { recursive: true, force: true }); }
});
