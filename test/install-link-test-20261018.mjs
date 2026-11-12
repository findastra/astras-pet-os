// Astra, 2026-10-18: a friend's AI downloaded the repo instead of the installer, and ran the old pets page. So that page
// stays gone, the installer download is the first thing the README shows, every agent is sent to INSTALL.md, and the
// release's installer zip has one obvious thing to double-click. Claude Opus 5.5 (claude-opus-5-5), 2026-10-18.
// Astra, 2026-11-02: "the [old pets page] is not supposed to be a thing anymore, get rid of everywhere it is referenced." The old
// page's name is now gone from every file too, data keys included (they are `hub`, `hub.submit` and `pet_life`). The
// word is spelled in two parts here so this file passes its own check. Claude Opus 5.5 (claude-opus-5-5), 2026-11-02.
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
const OLD = 'ca' + 'ge';
const GONE = new RegExp(`${OLD}\\.html|${OLD}-data\\.js|start-farmer-dock|farmer-dock-20261008\\.(cs|manifest)`);
// The old name as a word (not inside base64 picture data), in any case.
const WORD = new RegExp(`(?<![A-Za-z0-9+/])${OLD}`, 'i');
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

test('the old pets page and the old desktop Farmer are gone, and no program points at them', () => {
  for (const f of [`${OLD}.html`, `${OLD}-data.js`, 'start-farmer-dock-20261008.cmd', 'scripts/farmer-dock-20261008.cs'])
    assert.ok(!existsSync(join(root, f)), `${f} is back`);
  const code = tracked.filter((f) => /\.(html|js|mjs|cs|ps1|cmd|json)$/.test(f) && !/^\.github\//.test(f)
    && f !== 'test/install-link-test-20261018.mjs');
  const pointing = code.filter((f) => GONE.test(read(f)));
  assert.deepEqual(pointing, []);
});

test('the old pets page\'s name is gone from every file, records and data keys included', () => {
  // Data Dealer's own casino-era name for its payments step is a different thing and stays in its pages.
  const text = tracked.filter((f) => !/\.(png|jpe?g|gif|ico|zip|wav|mp3|ogg|woff2?)$/i.test(f));
  const found = text.filter((f) => { const s = read(f); return WORD.test(f) || (f !== 'apps/data-dealer-20261008.html' && WORD.test(s)); });
  assert.deepEqual(found, []);
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
    assert.ok(!names.some((n) => GONE.test(n)), 'no old pets page in the installer');
  } finally { rmSync(out, { recursive: true, force: true }); }
});
