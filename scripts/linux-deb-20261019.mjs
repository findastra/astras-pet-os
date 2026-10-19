// The Linux package (Astra, 2026-10-19): astras-pet-os_<version>_all.deb, one file for Debian, Ubuntu, Raspberry Pi
// OS and Kali on any processor (nothing in it is compiled). A tool of The Farm; Linux Penguin is its checker on Linux.
//
//   node scripts/linux-deb-20261019.mjs [tree-ish] [out-dir]     build it (tree-ish defaults to HEAD, out-dir to .)
//   node scripts/linux-deb-20261019.mjs --no-bundled [...]        without the bundled pets (no network needed)
//   node scripts/linux-deb-20261019.mjs --list <file.deb>         show what is inside a package, without installing it
//
// Built with Node's own modules, so no dpkg-deb is needed and it builds on Windows too. A .deb is an ar archive of
// debian-binary, control.tar.gz and data.tar.gz. It installs:
//   /usr/share/astras-pet-os/                  the release: this repo at tree-ish, without the Windows installer, read only
//   /usr/share/astras-pet-os/pets/<repo>/      pet programs bundled at a pinned commit (linux/bundled-pets-20261019.json)
//   /usr/bin/astras-pet-os                     the command (scripts/linux-cli-20261019.mjs)
//   /usr/lib/systemd/user/astras-pet-os-pet@.service   pet services: the package never turns one on
//   /usr/share/applications/                   System Map, the Farmer's desk and Stop (the big red button)
//   /usr/share/icons/hicolor/256x256/apps/astras-pet-os.png   the Friendly Farmer
//   /usr/share/doc/astras-pet-os/              copyright and changelog
// It has no maintainer scripts: installing it runs nothing, and each person's farm stays in their own home.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-19.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gunzipSync, gzipSync } from 'node:zlib';

export const PACKAGE = 'astras-pet-os';
export const SHARE = `./usr/share/${PACKAGE}/`;
export const MAINTAINER = 'Astra <88600745+findastra@users.noreply.github.com>';
export const BUNDLED = 'linux/bundled-pets-20261019.json';
/** The Windows installer's own files, which mean nothing on Linux. Everything else in the release is kept. */
export const WINDOWS_ONLY = [/^installer\//, /^install-astras-pet-os-[\w.-]+\.cmd$/, /^build-desktop-pets-[\w.-]+\.ps1$/];
/** Files from linux/ that are installed in fixed places, with their mode. */
export const PLACED = [
  ['linux/astras-pet-os-20261019.sh', `./usr/bin/${PACKAGE}`, 0o755],
  ['linux/astras-pet-os-pet-20261019.service', `./usr/lib/systemd/user/${PACKAGE}-pet@.service`, 0o644],
  ['linux/astras-pet-os-map-20261019.desktop', `./usr/share/applications/${PACKAGE}.desktop`, 0o644],
  ['linux/astras-pet-os-desk-20261019.desktop', `./usr/share/applications/${PACKAGE}-desk.desktop`, 0o644],
  ['linux/astras-pet-os-stop-20261019.desktop', `./usr/share/applications/${PACKAGE}-stop.desktop`, 0o644],
  ['desktop-art/farmer/happy-20261011.png', `./usr/share/icons/hicolor/256x256/apps/${PACKAGE}.png`, 0o644],
];

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const git = (cwd, args, input) => execFileSync('git', args, { cwd, input, maxBuffer: 1 << 30, stdio: ['pipe', 'pipe', 'pipe'] });

/** Debian's form of a version: 0.3.0-beta becomes 0.3.0~beta, which sorts before 0.3.0 as a beta should. */
export const debVersion = (version) => version.replace(/-/g, '~');

/** Every file in `tree` of the repo at `cwd`, as { path, mode, data }, read from git (never from the working folder). */
export function treeFiles(cwd, tree, keep = () => true) {
  const entries = git(cwd, ['ls-tree', '-r', '-z', '--full-tree', tree]).toString('utf8').split('\0').filter(Boolean)
    .map((line) => { const [meta, path] = line.split('\t'); const [mode, type, sha] = meta.split(' '); return { mode, type, sha, path }; })
    .filter((e) => e.type === 'blob' && keep(e.path));
  if (!entries.length) return [];
  const out = git(cwd, ['cat-file', '--batch'], `${entries.map((e) => e.sha).join('\n')}\n`);
  let at = 0;
  return entries.map((e) => {
    const eol = out.indexOf(0x0a, at);
    const size = Number(out.toString('ascii', at, eol).split(' ')[2]);
    const data = out.subarray(eol + 1, eol + 1 + size);
    at = eol + 1 + size + 1;
    return { path: e.path, mode: e.mode, data };
  });
}

// --- tar (ustar, with pax headers for long names) ------------------------------------------------------------------
function octal(n, width) { return `${n.toString(8).padStart(width - 1, '0')}\0`; }

function header(name, { size = 0, mode = 0o644, mtime, type = '0', linkname = '' }) {
  const h = Buffer.alloc(512);
  h.write(name, 0, 100, 'utf8');
  h.write(octal(mode, 8), 100, 'ascii'); h.write(octal(0, 8), 108, 'ascii'); h.write(octal(0, 8), 116, 'ascii');
  h.write(octal(size, 12), 124, 'ascii'); h.write(octal(mtime, 12), 136, 'ascii');
  h.fill(0x20, 148, 156); h.write(type, 156, 'ascii'); h.write(linkname, 157, 100, 'utf8');
  h.write('ustar\0', 257, 'ascii'); h.write('00', 263, 'ascii'); h.write('root', 265, 'ascii'); h.write('root', 297, 'ascii');
  let sum = 0; for (const byte of h) sum += byte;
  h.write(`${sum.toString(8).padStart(6, '0')}\0 `, 148, 'ascii');
  return h;
}

function paxRecord(key, value) {
  const body = ` ${key}=${value}\n`;
  let length = Buffer.byteLength(body) + 1;
  while (String(length).length + Buffer.byteLength(body) !== length) length = String(length).length + Buffer.byteLength(body);
  return `${length}${body}`;
}

const pad = (data) => (data.length % 512 ? Buffer.concat([data, Buffer.alloc(512 - (data.length % 512))]) : data);

/** A tar archive of entries { path, data?, mode, dir? }, every parent folder listed first, owned by root. */
export function tar(entries, mtime) {
  const all = new Map();
  for (const e of entries) {
    const parts = e.path.replace(/^\.\//, '').split('/');
    for (let i = 1; i < parts.length; i++) {
      const dir = `./${parts.slice(0, i).join('/')}/`;
      if (!all.has(dir)) all.set(dir, { path: dir, mode: 0o755, dir: true });
    }
    all.set(e.path, e);
  }
  all.set('./', { path: './', mode: 0o755, dir: true });
  const blocks = [];
  for (const e of [...all.values()].sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0))) {
    const size = e.dir ? 0 : e.data.length;
    let name = e.path;
    if (Buffer.byteLength(name) > 100 || /[^\x20-\x7e]/.test(name)) {
      const pax = Buffer.from(paxRecord('path', name), 'utf8');
      blocks.push(header('./PaxHeaders/entry', { size: pax.length, mtime, type: 'x' }), pad(pax));
      name = Buffer.from(name).subarray(0, 99).toString('latin1');
    }
    blocks.push(header(name, { size, mode: e.mode, mtime, type: e.dir ? '5' : '0' }));
    if (size) blocks.push(pad(e.data));
  }
  blocks.push(Buffer.alloc(1024));
  return Buffer.concat(blocks);
}

/** Reads a tar archive back: [{ path, type, mode, size, data }] (for tests and --list). */
export function readTar(buffer) {
  const entries = [];
  let at = 0;
  let longName = null;
  while (at + 512 <= buffer.length) {
    const h = buffer.subarray(at, at + 512);
    if (h.every((b) => b === 0)) break;
    const field = (start, length) => h.toString('utf8', start, start + length).replace(/\0.*$/s, '');
    const size = parseInt(field(124, 12), 8) || 0;
    const type = field(156, 1) || '0';
    const data = buffer.subarray(at + 512, at + 512 + size);
    at += 512 + Math.ceil(size / 512) * 512;
    if (type === 'x') { longName = /(?:^|\n)\d+ path=([^\n]*)\n/.exec(data.toString('utf8'))?.[1] ?? null; continue; }
    const prefix = field(345, 155);
    entries.push({ path: longName ?? (prefix ? `${prefix}/${field(0, 100)}` : field(0, 100)), type, mode: parseInt(field(100, 8), 8), size, data });
    longName = null;
  }
  return entries;
}

// --- ar -------------------------------------------------------------------------------------------------------------
function arMember(name, data, mtime) {
  const head = `${name.padEnd(16)}${String(mtime).padEnd(12)}${'0'.padEnd(6)}${'0'.padEnd(6)}${'100644'.padEnd(8)}${String(data.length).padEnd(10)}\`\n`;
  return Buffer.concat([Buffer.from(head, 'ascii'), data, data.length % 2 ? Buffer.from('\n') : Buffer.alloc(0)]);
}

/** Reads a .deb: its members by name, its control fields and its files. */
export function readDeb(buffer) {
  if (buffer.toString('ascii', 0, 8) !== '!<arch>\n') throw new Error('Not a .deb (no ar header).');
  const members = [];
  for (let at = 8; at + 60 <= buffer.length;) {
    const name = buffer.toString('ascii', at, at + 16).trim().replace(/\/$/, '');
    const size = Number(buffer.toString('ascii', at + 48, at + 58).trim());
    members.push({ name, data: buffer.subarray(at + 60, at + 60 + size) });
    at += 60 + size + (size % 2);
  }
  const member = (name) => members.find((m) => m.name === name)?.data;
  const control = readTar(gunzipSync(member('control.tar.gz')));
  const fields = {};
  let last = null;
  for (const line of control.find((e) => e.path === './control').data.toString('utf8').split('\n')) {
    if (/^\s/.test(line) && last) fields[last] += `\n${line}`;
    else { const m = /^([\w-]+):\s?(.*)$/.exec(line); if (m) { last = m[1]; fields[last] = m[2]; } }
  }
  return { members: members.map((m) => m.name), control, fields, files: readTar(gunzipSync(member('data.tar.gz'))) };
}

// --- the package ------------------------------------------------------------------------------------------------------
function copyrightFile(license, bundled) {
  const text = license.toString('utf8').trim().split('\n').map((l) => (l.trim() ? ` ${l}` : ' .')).join('\n');
  return [
    'Format: https://www.debian.org/doc/packaging-manuals/copyright-format/1.0/',
    `Upstream-Name: ${PACKAGE}`,
    `Upstream-Contact: ${MAINTAINER}`,
    'Source: https://github.com/findastra/astras-pet-os',
    '',
    'Files: *',
    'Copyright: 2026 Astra (findastra)',
    'License: Expat',
    `Comment: Astra's PetOS, an Intelligent App, or Pet, by Astra. Bundled pets: ${bundled.map((p) => `${p.repo} at ${p.commit}`).join(', ') || 'none'}, same author and license.`,
    '',
    'License: Expat',
    text,
    '',
  ].join('\n');
}

function changelog(version, commit, when) {
  return [
    `${PACKAGE} (${version}) unstable; urgency=medium`,
    '',
    `  * Astra's PetOS ${version.replace(/~/g, '-')} for Linux, built from commit ${commit}.`,
    '',
    ` -- ${MAINTAINER}  ${when.toUTCString().replace('GMT', '+0000')}`,
    '',
  ].join('\n');
}

/** Fetches each bundled pet's repo at its pinned commit (git checks the commit id) and returns its files. */
function bundledFiles(list) {
  const files = [];
  for (const pet of list) {
    if (!/^[0-9a-f]{40}$/.test(pet.commit)) throw new Error(`${pet.repo}: the pinned commit must be a full 40-character commit id.`);
    const dir = mkdtempSync(join(tmpdir(), `${PACKAGE}-${pet.repo}-`));
    try {
      git(dir, ['init', '-q']);
      git(dir, ['fetch', '-q', '--depth', '1', `https://github.com/findastra/${pet.repo}.git`, pet.commit]);
      const got = git(dir, ['rev-parse', 'FETCH_HEAD']).toString().trim();
      if (got !== pet.commit) throw new Error(`${pet.repo}: fetched ${got}, not the pinned ${pet.commit}.`);
      const keep = (p) => pet.include.some((inc) => (inc.endsWith('/') ? p.startsWith(inc) : p === inc));
      for (const f of treeFiles(dir, pet.commit, keep)) files.push({ path: `${SHARE}pets/${pet.repo}/${f.path}`, mode: f.mode === '100755' ? 0o755 : 0o644, data: f.data });
    } finally { rmSync(dir, { recursive: true, force: true }); }
  }
  return files;
}

/** Builds the package from `tree` of the repo at `cwd` into `outDir`. Returns { path, version, sha256, files }. */
export function buildDeb({ tree = 'HEAD', outDir = '.', cwd = ROOT, bundled = true } = {}) {
  const commit = git(cwd, ['rev-parse', `${tree}^{commit}`]).toString().trim();
  const mtime = Number(git(cwd, ['log', '-1', '--format=%ct', commit]).toString().trim());
  const show = (path) => git(cwd, ['show', `${commit}:${path}`]);
  const version = debVersion(JSON.parse(show('package.json').toString('utf8')).version);
  const pets = bundled ? JSON.parse(show(BUNDLED).toString('utf8')).pets : [];

  const files = treeFiles(cwd, commit, (p) => !WINDOWS_ONLY.some((re) => re.test(p)))
    .map((f) => ({ path: `${SHARE}${f.path}`, mode: f.mode === '100755' ? 0o755 : 0o644, data: f.data }));
  for (const [from, to, mode] of PLACED) files.push({ path: to, mode, data: show(from) });
  files.push(...bundledFiles(pets));
  files.push({ path: `./usr/share/doc/${PACKAGE}/copyright`, mode: 0o644, data: Buffer.from(copyrightFile(show('LICENSE'), pets)) });
  files.push({ path: `./usr/share/doc/${PACKAGE}/changelog.gz`, mode: 0o644, data: gzipSync(changelog(version, commit, new Date(mtime * 1000)), { level: 9 }) });
  const seen = new Set();
  for (const f of files) { if (seen.has(f.path)) throw new Error(`Two files would be installed at ${f.path}.`); seen.add(f.path); }

  const installedKiB = files.reduce((sum, f) => sum + Math.ceil(f.data.length / 1024), 0);
  const control = [
    `Package: ${PACKAGE}`,
    `Version: ${version}`,
    'Architecture: all',
    `Maintainer: ${MAINTAINER}`,
    `Installed-Size: ${installedKiB}`,
    'Depends: nodejs (>= 20)',
    'Recommends: xdg-utils, git',
    'Suggests: gh',
    'Section: misc',
    'Priority: optional',
    'Homepage: https://github.com/findastra/astras-pet-os',
    "Description: Astra's PetOS (beta): grow your own AI ecosystem of pets",
    " Astra's PetOS is a platform of small intelligent apps, called pets, organized",
    ' by the Friendly Farmer. This package installs the System Map, the Farmer\'s',
    " desk and every pet's page, the farm setup (Astra's example pets or from",
    ' scratch) and Linux Penguin, who knows which Linux this is and how to look after',
    ' it. Pet services come with it, turned off. Desktop pets on Linux come later.',
    ' .',
    ' After installing, run: astras-pet-os setup',
    '',
  ].join('\n');
  const md5sums = files.map((f) => `${createHash('md5').update(f.data).digest('hex')}  ${f.path.replace(/^\.\//, '')}`).join('\n') + '\n';
  const controlTar = gzipSync(tar([
    { path: './control', mode: 0o644, data: Buffer.from(control) },
    { path: './md5sums', mode: 0o644, data: Buffer.from(md5sums) },
  ], mtime));
  const dataTar = gzipSync(tar(files, mtime));
  const deb = Buffer.concat([Buffer.from('!<arch>\n'), arMember('debian-binary', Buffer.from('2.0\n'), mtime),
    arMember('control.tar.gz', controlTar, mtime), arMember('data.tar.gz', dataTar, mtime)]);
  mkdirSync(outDir, { recursive: true });
  const path = resolve(outDir, `${PACKAGE}_${version}_all.deb`);
  writeFileSync(path, deb);
  return { path, version, commit, sha256: createHash('sha256').update(deb).digest('hex'), files: files.length, bytes: deb.length };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args[0] === '--list') {
    const { fields, files } = readDeb(readFileSync(args[1]));
    for (const [k, v] of Object.entries(fields)) console.log(`${k}: ${v}`);
    console.log('');
    for (const f of files) console.log(`${f.mode.toString(8).padStart(4, '0')} ${String(f.size).padStart(9)} ${f.path}`);
  } else {
    const bundled = !args.includes('--no-bundled');
    const [tree = 'HEAD', outDir = '.'] = args.filter((a) => a !== '--no-bundled');
    const built = buildDeb({ tree, outDir, bundled });
    console.log(`${built.path}\n${built.version} from ${built.commit}, ${built.files} files, ${(built.bytes / 1048576).toFixed(1)} MB\nsha256 ${built.sha256}`);
  }
}
