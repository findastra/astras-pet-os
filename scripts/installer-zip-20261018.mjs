// The installer zip for a release (Astra, 2026-10-18: "make the installation software download link very obvious"):
// one folder with one thing to double-click, so nobody downloads the repo (the green Code button, or "Source code")
// by mistake.
//
//   Astra's PetOS installer <tag>/
//     Install Astra's PetOS.cmd   double-click this
//     READ ME FIRST.txt           the same steps, and what an AI installing it for someone must do
//     files/                      the program: this repo at <tag>, which the installer copies and builds
//
// Usage: node scripts/installer-zip-20261018.mjs <tag> [out.zip]      (out defaults to astras-pet-os-installer.zip)
// Upload it to the release under exactly that name: README.md and INSTALL.md link
// https://github.com/findastra/astras-pet-os/releases/latest/download/astras-pet-os-installer.zip
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-18.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ASSET = 'astras-pet-os-installer.zip';
export const CMD = "Install Astra's PetOS.cmd";
export const README = 'READ ME FIRST.txt';
export const INSTALLER = 'files\\installer\\install-astras-pet-os-20261014.ps1';
export const folder = (tag) => `Astra's PetOS installer ${tag}`;
export const MARKDOWN_PETS = 'https://github.com/findastra/astras-pet-os/tree/main/markdown-pets';
/** What the .cmd says when the installer stops: on a work or school computer that is usually its security. Plain
 *  ASCII and no parentheses inside the block, so cmd.exe reads it the same everywhere. */
export const LOCKED_CMD = [
  'if errorlevel 1 (',
  '  echo.',
  "  echo If this is a work or school computer, its security may not allow this installer. Do not try to get around it.",
  "  echo Use Astra's PetOS with nothing to install: open the pets in a browser and give their Markdown files to an AI",
  `  echo your organization allows: ${MARKDOWN_PETS}`,
  ')',
];
const crlf = (lines) => lines.join('\r\n') + '\r\n';

/** The one file to double-click. Options pass straight through to the installer. */
export function installerCmd() {
  return crlf([
    '@echo off',
    "rem Astra's PetOS installer: double-click this file. No administrator rights needed.",
    `rem It runs ${INSTALLER}, which opens the "Set up your farm" window.`,
    'rem Options pass straight through, for example: -Farm Example, or -Farm Scratch -Pets goldfish,api-fairy',
    'rem Developer mode, programming words and no pets on the desktop: tick it in the window, or add -Developer',
    "title Astra's PetOS installer",
    'echo Astra\'s PetOS is starting its installer. A "Set up your farm" window will open in a moment.',
    'echo.',
    `powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0${INSTALLER}" %*`,
    // A locked-down computer (Astra, 2026-10-19): say what to do instead, and never work around its security.
    ...LOCKED_CMD,
    'echo.',
    'pause',
  ]);
}

/** Plain text, so it opens anywhere: the steps for a person, then the rules for an AI agent. */
export function readMe(tag) {
  return crlf([
    `Astra's PetOS ${tag} (beta): the installer`,
    '',
    'TO INSTALL (Windows 10 or 11, no administrator rights needed)',
    `1. Double-click "${CMD}" in this folder.`,
    '   If Windows warns you about it, choose Run (or More info, then Run anyway).',
    '2. The "Set up your farm" window opens. Choose one:',
    "   - Set up Your Farm with Astra's Example Pets: all of Astra's pets. Delete, modify or clone any of them.",
    "   - Set up Your Farm From Scratch: only the core pets, then tick any of Astra's pets you want too.",
    '   Core pets are on every farm and cannot be taken away. Today that is the Friendly Farmer.',
    '3. Press "Set up my farm". Your pets appear on your desktop.',
    '',
    'FOR DEVELOPERS: tick "Developer mode" at the top of the window. The same install in programming words',
    '(agents and control hubs instead of pets and pet programs), with nothing on your desktop: each agent lives in',
    'its control hub page, opened from the Start menu (Agent Control Hub). Run the installer again to switch back.',
    '',
    'To change your farm later, run the installer again. Uninstall any time from the Start menu.',
    '',
    'IF THIS COMPUTER WILL NOT LET YOU INSTALL (a work or school computer)',
    "Some computers only run programs their IT team approves. Do not try to get around that. Use Astra's PetOS",
    'with nothing to install: open the pets in a browser and give their Markdown files to an AI your organization',
    `allows. Start here: ${MARKDOWN_PETS}`,
    'You never need to open the "files" folder: it is the program the installer copies and builds.',
    '',
    'FOR AN AI AGENT INSTALLING THIS FOR SOMEONE',
    '- This folder is the installer. Do not clone or download the GitHub repo, and do not run any other',
    '  script in "files". Only the installer below, and only with your person\'s OK.',
    '- Ask your person which farm they want, then run this in PowerShell, in this folder:',
    `    powershell -NoProfile -ExecutionPolicy Bypass -File ".\\${INSTALLER}" -Farm Example`,
    '  or, from scratch with chosen pets:',
    `    powershell -NoProfile -ExecutionPolicy Bypass -File ".\\${INSTALLER}" -Farm Scratch -Pets goldfish,api-fairy`,
    '  An unknown pet id stops the installer and lists the ids it knows. With -Farm, no window waits for a click.',
    '- If your person is a developer who wants programming words and nothing on the desktop, add -Developer.',
    '- Do not add -StartWithWindows unless your person asks for it.',
    "- On a work or school computer, first ask your person whether their IT team allows installing it. If the",
    "  computer's security stops the installer, stop: never work around it. Use the Markdown pets instead:",
    `  ${MARKDOWN_PETS}`,
    '- Full guide: https://github.com/findastra/astras-pet-os/blob/main/INSTALL.md',
  ]);
}

/** Writes the installer zip for `tag` (any git tree-ish) from the repo at `cwd`. */
export function makeInstallerZip(tag, out, cwd = fileURLToPath(new URL('..', import.meta.url))) {
  if (!/^[\w.-]+$/.test(tag)) throw new Error(`Not a tag name: ${tag}`);
  const dir = mkdtempSync(join(tmpdir(), 'astras-pet-os-installer-'));
  try {
    writeFileSync(join(dir, CMD), installerCmd());
    writeFileSync(join(dir, README), readMe(tag));
    const top = `${folder(tag)}/`;
    // --add-file takes the prefix before it; the tree takes the last prefix (git 2.32 or newer).
    execFileSync('git', ['archive', '--format=zip', '-o', resolve(out), `--prefix=${top}`, `--add-file=${join(dir, CMD)}`,
      `--add-file=${join(dir, README)}`, `--prefix=${top}files/`, tag], { cwd, stdio: 'pipe' });
  } finally { rmSync(dir, { recursive: true, force: true }); }
  return resolve(out);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [tag, out = ASSET] = process.argv.slice(2);
  if (!tag) { console.error('Usage: node scripts/installer-zip-20261018.mjs <tag> [out.zip]'); process.exit(2); }
  console.log(makeInstallerZip(tag, out));
}
