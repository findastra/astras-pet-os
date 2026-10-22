// A pet pack comes onto a farm (Astra, 2026-10-22: "Start Part 5b here: pet packs come onto a farm, checked file by
// file against the pet's own repo on GitHub, with --unchecked on purpose, the pet's code next to the farm, and the
// uninstaller removing pack folders"; Part 5b of card 058, docs/farm-lock-20261021.md). The Friendly Farmer's farm-pets
// tool (scripts/farm-pets-20261021.mjs) uses these to read a pack, check it, and put the pet's code next to the farm.
//   - A pack is checked against itself first: one folder at the top, safe paths only, every file listed in its
//     manifest with the SHA-256 written there, nothing else in the zip.
//   - Then against the farm: a pet on the farm's own list, from the account that list names (never a lookalike), whose
//     code runs on this computer, with no key, token, personal folder path or local service address in it.
//   - Then against the pet's own repo on GitHub, file by file at the pack's commit (Astra's answer 3, 2026-10-21). A
//     pack whose code differs is always refused. One that cannot be checked (a private repo this computer cannot read,
//     no internet) comes in only with --unchecked, chosen on purpose, and the farm lock says so.
//   - The code goes into its own folder next to the farm, where its programs look for ..\astras-pet-os\ (on Linux,
//     with the pet services: ~/.local/share/astras-pet-os/pets/<repo>). It never runs by itself, and it never replaces
//     a folder the farm lock does not list or one whose files changed since it came in.
// The pack's pictures, page and Markdown pet are not copied onto the farm: the farm's own release has every pet on its
// list, so the hub stays the one art source. Node built-ins only. Claude Opus 5.5 (claude-opus-5-5), 2026-10-22.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, lstatSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { MANIFEST, SCHEMA as PACK_SCHEMA, repoAt, scanFiles, unzip } from './pet-packs-20261020.mjs';
import { repoOf, repoUrl, sameAccount } from './farm-owner-20261020.mjs';

const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');
// A path inside a pack: relative, forward slashes, no empty, "." or ".." parts, no drive letter, backslash or NUL.
const SAFE = (p) => typeof p === 'string' && p !== '' && !p.startsWith('/') && !/[\\:\0]/.test(p) && p.split('/').every((x) => x !== '' && x !== '.' && x !== '..');
const REPO = /^[a-z0-9][a-z0-9-]*$/;

/**
 * A pet pack zip, read and checked against itself: { name, top, manifest, repo, code: { path: Buffer }, packSha256,
 * manifestSha256, stops }. `code` is the pet's repo part, by its path inside the repo.
 */
export function readPack(buf, name) {
  const out = { name, stops: [] };
  let files;
  try { files = unzip(buf); } catch (e) { out.stops.push(`${name} is not a pet pack zip (${e.message})`); return out; }
  const names = Object.keys(files);
  const unsafe = names.filter((n) => !SAFE(n));
  if (unsafe.length) { out.stops.push(`${name} holds a path that could write outside its folder (${unsafe[0]}): it is refused`); return out; }
  const tops = [...new Set(names.map((n) => n.split('/')[0]))];
  if (tops.length !== 1) { out.stops.push(`${name} has ${tops.length} folders at its top; a pet pack has one`); return out; }
  const top = tops[0];
  const mPath = `${top}/${MANIFEST}`;
  if (!files[mPath]) { out.stops.push(`${name} has no ${MANIFEST}, so it is not a pet pack`); return out; }
  let manifest;
  try { manifest = JSON.parse(files[mPath].toString('utf8')); } catch { out.stops.push(`${name}'s ${MANIFEST} is not JSON`); return out; }
  if (manifest?.schema !== PACK_SCHEMA) { out.stops.push(`${name} is a ${manifest?.schema || 'pack of no known kind'}, not ${PACK_SCHEMA}`); return out; }
  if (!REPO.test(String(manifest.repo || ''))) { out.stops.push(`${name} names no pet repo the Farmer can use (${manifest.repo})`); return out; }
  if (!/^[0-9a-f]{40}$/.test(String(manifest.source?.commit || ''))) { out.stops.push(`${name} names no full commit of its pet's repo`); return out; }
  const listed = new Map((manifest.files || []).map((f) => [`${top}/${f.path}`, f]));
  for (const [path, f] of listed) {
    if (!files[path]) out.stops.push(`${f.path} is in the manifest but not in the zip`);
    else if (sha256(files[path]) !== f.sha256) out.stops.push(`${f.path} is not the file the manifest names (its SHA-256 differs)`);
  }
  for (const n of names) if (n !== mPath && !listed.has(n)) out.stops.push(`${n.slice(top.length + 1)} is in the zip but not in its manifest`);
  const prefix = `${top}/${manifest.repo}/`;
  const code = Object.fromEntries(names.filter((n) => n.startsWith(prefix)).map((n) => [n.slice(prefix.length), files[n]]));
  return Object.assign(out, { top, manifest, repo: manifest.repo, code, packSha256: sha256(buf), manifestSha256: sha256(files[mPath]) });
}

/** The pet's own repo at `commit`, read from GitHub with this computer's own git sign-in; throws why it cannot be read. */
export function repoFromGitHub(registry, repo, commit) {
  const dir = mkdtempSync(join(tmpdir(), 'farm-pets-'));
  const env = { ...process.env, GIT_TERMINAL_PROMPT: '0', GCM_INTERACTIVE: 'never' }; // never a sign-in window
  try {
    const gitDir = join(dir, 'pet.git');
    execFileSync('git', ['init', '-q', '--bare', gitDir], { stdio: 'pipe' });
    execFileSync('git', ['--git-dir', gitDir, 'fetch', '-q', '--depth', '1', `${repoUrl(registry, repo)}.git`, commit], { stdio: 'pipe', timeout: 180000, env });
    return repoAt(gitDir, commit);
  } catch (e) {
    const said = String(e.stderr || e.message || '').trim().split(/\r?\n/).filter(Boolean).pop() || 'no answer';
    throw new Error(`${repoOf(registry, repo)} at ${commit.slice(0, 7)} could not be read from GitHub (${said})`);
  } finally { rmSync(dir, { recursive: true, force: true }); }
}

/** Where the pet's code goes: { rel, abs }. Next to the farm's folder; on Linux, with the pet services. */
export function codeFolder(farm, repo) {
  const rel = farm.layout === 'linux' ? `../pets/${repo}` : `../${repo}`;
  return { rel, abs: resolve(farm.dir, rel) };
}

/** Every file in a folder, with its SHA-256: { files: { path: sha256 }, odd: [paths that are links or not plain files] }. */
export function folderFiles(dir) {
  const files = {}, odd = [];
  const walk = (at, rel) => {
    for (const n of readdirSync(at)) {
      const p = join(at, n), r = rel ? `${rel}/${n}` : n, s = lstatSync(p);
      if (s.isSymbolicLink()) odd.push(r);
      else if (s.isDirectory()) walk(p, r);
      else if (s.isFile()) files[r] = sha256(readFileSync(p));
      else odd.push(r);
    }
  };
  if (existsSync(dir)) walk(dir, '');
  return { files, odd };
}

/** How a folder differs from the files the farm lock says it holds, in plain words. [] when it is the same. */
export function folderChanges(dir, want) {
  if (!existsSync(dir)) return ['the folder is gone'];
  const { files, odd } = folderFiles(dir);
  const out = odd.map((p) => `${p} is a link or not a plain file`);
  for (const [p, h] of Object.entries(files)) if (!(p in want)) out.push(`${p} was added`); else if (want[p] !== h) out.push(`${p} was changed`);
  for (const p of Object.keys(want)) if (!(p in files)) out.push(`${p} is missing`);
  return out;
}

/** How the pack's code differs from the pet's repo at its commit. [] when every file is the same, byte for byte. */
export function codeDifferences(code, theirs) {
  const out = [];
  for (const [p, b] of Object.entries(theirs.files)) if (!(p in code)) out.push(`${p} is in the repo but not in the pack`); else if (sha256(b) !== sha256(code[p])) out.push(`${p} differs from the repo`);
  for (const p of Object.keys(code)) if (!(p in theirs.files)) out.push(`${p} is in the pack but not in the repo`);
  return out;
}

/**
 * Every check of a pack against this farm, in order: { stops, notes, pet, checked, uncheckedWhy, folder, replaces }.
 * `getRepo(registry, repo, commit)` reads the pet's repo (GitHub; a test gives its own).
 */
export function checkPack(farm, pack, { getRepo = repoFromGitHub, unchecked = false } = {}) {
  const out = { stops: [...pack.stops], notes: [], pet: null, checked: false, uncheckedWhy: null, folder: null, replaces: null };
  if (out.stops.length) return out;
  const { manifest, repo } = pack;
  const pet = farm.catalog.find((p) => p.repo === repo);
  if (!pet) { out.stops.push(`${manifest.pet || repo} (${repo}) is not on this farm's list of pets. A pet from another farm comes through the Kennel, once packs are signed`); return out; }
  if (pet.core) { out.stops.push(`${pet.name} is the core of Astra's PetOS: it comes with the installer, never in a pet pack`); return out; }
  out.pet = pet;
  const home = repoOf(farm.catalogRegistry, repo);
  if (!sameAccount(String(manifest.source?.repo || ''), home)) {
    out.stops.push(`This pack says its code came from ${manifest.source?.repo || 'nowhere'}, but this farm's list says ${pet.name} lives at ${home}: a lookalike is refused`);
    return out;
  }
  const os = pet.needs?.os || [];
  if (os.length && !os.includes(farm.info.os)) out.stops.push(`${pet.name}'s code runs on ${os.join(' or ')}, not on this computer (${farm.info.os}). Its pack still opens its page on any computer: double-click the opener in the zip`);
  const scan = scanFiles(pack.code);
  for (const h of scan.stop) out.stops.push(`${h.file} holds ${h.count} ${h.kind}${h.count > 1 ? 's' : ''}`);
  out.folder = codeFolder(farm, repo);
  const before = (farm.lock?.pets || []).find((p) => p.repo === repo)?.code;
  if (existsSync(out.folder.abs)) {
    if (before?.came_from === 'pet-pack' && before.folder === out.folder.rel) {
      const changed = folderChanges(out.folder.abs, before.files || {});
      if (changed.length) out.stops.push(`${out.folder.abs} changed since its pack came in (${changed.slice(0, 3).join('; ')}${changed.length > 3 ? `; and ${changed.length - 3} more` : ''}): move your changes out of it first`);
      else out.replaces = before;
    } else {
      out.stops.push(`${out.folder.abs} is there already, and the Farmer did not put it there (it may be your own clone). Move it, or keep using it instead of this pack`);
    }
  }
  if (out.stops.length) return out;
  try {
    const diffs = codeDifferences(pack.code, getRepo(farm.catalogRegistry, repo, manifest.source.commit));
    if (diffs.length) out.stops.push(`This pack's code is not ${home} at ${manifest.source.commit.slice(0, 7)}: ${diffs.slice(0, 3).join('; ')}${diffs.length > 3 ? `; and ${diffs.length - 3} more` : ''}. It was changed after it was built: never use it`);
    else out.checked = true;
  } catch (e) {
    if (!unchecked) out.stops.push(`${e.message}. If you trust whoever gave you this pack, add --unchecked: it comes in marked unchecked in the farm lock`);
    else { out.uncheckedWhy = e.message; out.notes.push(`Not checked against GitHub, on purpose (--unchecked): ${e.message}.`); }
  }
  return out;
}

/** The farm lock's record of a pack's code. */
export function packCode(pack, check) {
  const s = pack.manifest.source;
  return {
    came_from: 'pet-pack', pack: pack.name, pack_sha256: pack.packSha256, manifest_sha256: pack.manifestSha256,
    folder: check.folder.rel, version: s.version ?? null, commit: s.commit, tag: s.tag ?? null,
    checked_against_github: check.checked, ...(check.checked ? {} : { unchecked_why: check.uncheckedWhy }),
    files: Object.fromEntries(Object.entries(pack.code).map(([p, b]) => [p, sha256(b)]).sort(([a], [b]) => (a < b ? -1 : 1))),
  };
}

/** Writes the pack's code into its folder, replacing the one the farm lock lists (already checked to be unchanged). */
export function writeCode(folder, code) {
  const temp = `${folder.abs}.farm-pets-${process.pid}`;
  rmSync(temp, { recursive: true, force: true });
  for (const [p, b] of Object.entries(code)) { mkdirSync(dirname(join(temp, p)), { recursive: true }); writeFileSync(join(temp, p), b); }
  if (!Object.keys(code).length) mkdirSync(temp, { recursive: true });
  rmSync(folder.abs, { recursive: true, force: true });
  mkdirSync(dirname(folder.abs), { recursive: true });
  renameSync(temp, folder.abs);
}
