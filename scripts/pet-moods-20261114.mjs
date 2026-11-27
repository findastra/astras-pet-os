// The pets' one mood, the same everywhere (Astra, 2026-11-14: "I want all of the pets everywhere to have the same
// status. Like if they're questioning or if they're alert ... the icons on the stream deck, the icons on every single
// pet program page, where they are on the top of the page and all their friends at the bottom, and on my desktop").
//
// The Farm's tool `the-farm-v1.0-pet-moods-v1.0`. It is the only place that works out a pet's mood. Every place that
// shows a pet reads what it wrote and shows that mood's picture with its sticker:
//   - the desktop pets (Startup Star, scripts/desktop-pets-20261011.cs, PetMoods),
//   - every pet program page: the pet in its cyberhome at the top, the emotions panel and every friend at the bottom
//     (apps/pet-programs/pet-program-page-20261018.js),
//   - the Stream Deck keys: Deck Duck's plugin (findastra/deck-duck, stream-deck/mood-keys-20261125.js), since 2026-11-26.
// Developer term: a single source of truth, one writer and many readers (a shared status file).
//
// Where a mood comes from, checked every five seconds (the meanings are MOOD-KEY.md's, most urgent first: when several
// apply, the first one shows):
//   program  a pet whose program runs in the background says its own mood in mood-20261021.json in its data folder
//            (Log Lynx, Packet Piranha, Forensic Ferret, Kernel Koala, Inference Iguana, Rift Rabbit, Voicemeeter Bug),
//            counted while it is less than 15 minutes old (they write it every minute).
//   key      a key request waiting on Astra in API Fairy's notebook makes the pet that asked curious ("I need your OK
//            or your input").
//   round    the Friendly Farmer's last merged round (status/pets-status.json), counted only for a week: an older check
//            says nothing about now.
// The six moods that tell Astra something (alarmed, sick, curious, worried, happy, sad) are `show`n everywhere. The calm
// ones (idle, awake, sleepy) are not: each place keeps its own resting look (a pet program page is awake while it is
// used), and `show` is null.
//
// It writes, on this PC only, in Documents\Astra's PetOS Data\astras-pet-os\pet-moods:
//   pet-moods-20261114.json            for programs (the desktop pets; Deck Duck's plugin next)
//   pet-moods-page-data-20261114.js    the same, for the pages (`window.astrasPetMoods`; works from file:// too)
// rewritten when a mood changes and at least every 30 seconds, so a reader treats one older than two minutes as gone.
// It holds key names and pets' own lines, never a key. Read only everywhere else; it changes nothing in any repo.
//
//   node scripts/pet-moods-20261114.mjs            print the moods once and write the files
//   node scripts/pet-moods-20261114.mjs --print    print them, write nothing
//   node scripts/pet-moods-20261114.mjs --background   keep the files up to date (Startup Star starts it at sign-in)
//
// Node's built-in modules only (AGENTS.md). Claude Opus 5.5 (claude-opus-5-5), 2026-11-14.
import { existsSync, mkdirSync, readdirSync, readFileSync, realpathSync, renameSync, rmSync, statSync, writeFileSync, appendFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ORDER } from './farmer-rounds-20261009.mjs';
import { desktopId } from './pet-program-pages-20261018.mjs';

export const LABEL = 'the-farm-v1.0-pet-moods-v1.0';
export const SCHEMA = 'astras-pet-os-pet-moods-v1';
export const PAGE_VAR = 'astrasPetMoods';
export const FOLDER = ["Astra's PetOS Data", 'astras-pet-os', 'pet-moods'];
export const BOARD = 'pet-moods-20261114.json';
export const PAGE_DATA = 'pet-moods-page-data-20261114.js';
/** The moods that tell Astra something, shown on every pet everywhere. */
export const SHOWN = ['alarmed', 'sick', 'curious', 'worried', 'happy', 'sad'];
export const PROGRAM_FRESH_MS = 15 * 60000;
export const ROUND_FRESH_MS = 8 * 86400000;
export const EVERY_MS = 5000;
export const HEARTBEAT_MS = 30000;
/** A reader treats a board older than this as gone (its writer stopped). */
export const STALE_MS = 120000;
const MOOD_SCHEMA = 'astras-pet-os-mood-v1', KEY_SCHEMA = 'api-fairy-key-request-v1';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const documents = () => join(homedir(), 'Documents');

// The farm sits in Documents\Astra's PetOS\<hub>, two folders under Documents; a test copy elsewhere uses Documents.
const docsOf = (root) => (existsSync(resolve(root, '..', '..', "Astra's PetOS Data")) ? resolve(root, '..', '..') : documents());

/** Where it reads from and writes to; the test passes its own folders. */
export function places({ root = ROOT, docs = docsOf(root), local = process.env.LOCALAPPDATA || join(homedir(), 'AppData', 'Local') } = {}) {
  return {
    root,
    out: join(docs, ...FOLDER),
    keys: join(docs, "Astra's PetOS Data", 'api-fairy-ring', 'key-requests'),
    programs: [join(local, 'astras-pet-os'), join(local, 'findastra')],
    status: join(root, 'status', 'pets-status.json'),
  };
}

const readJson = (file) => { try { return JSON.parse(readFileSync(file, 'utf8')); } catch { return null; } };
const text = (v, max = 300) => (typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, max) : '');

/** Every pet the farm knows, by repo, with the names its older records use for it (an app page's old name). */
export function petList(root = ROOT) {
  const registry = readJson(join(root, 'pets.json')) || {};
  const programs = readJson(join(root, 'pet-programs.json')) || {};
  const drafts = readJson(join(root, 'desktop-art', 'desktop-drafts-20261018.json')) || { pets: [] };
  const pets = new Map(), alias = new Map();
  for (const reg of [...(registry.pets || []), ...(registry.pipeline || [])]) {
    if (!reg?.repo) continue;
    pets.set(reg.repo, { repo: reg.repo, pet: reg.pet || reg.repo, art: desktopId(reg, drafts) });
    const old = String(reg.app_url || '').split('/').pop().replace(/-\d{8}\.html$/, '');
    if (old && old !== reg.repo) alias.set(old, reg.repo);
  }
  for (const p of programs.programs || []) {
    if (p?.repo && !pets.has(p.repo)) pets.set(p.repo, { repo: p.repo, pet: p.icon || p.repo, art: desktopId({ repo: p.repo, pet: p.icon }, drafts) });
  }
  return { pets, find: (id) => (pets.has(id) ? id : alias.get(id) || null) };
}

/** What background pets say about themselves: [{ repo, mood, from, says, at }]. */
export function programMoods(folders, now = Date.now()) {
  const out = [];
  for (const base of folders) {
    let names = [];
    try { names = readdirSync(base); } catch { continue; }
    for (const name of names) {
      const file = join(base, name, 'mood-20261021.json');
      if (!existsSync(file)) continue;
      const m = readJson(file);
      if (!m || m.schema !== MOOD_SCHEMA || !ORDER.includes(m.mood)) continue;
      const at = Date.parse(m.updated);
      if (!(now - at <= PROGRAM_FRESH_MS && at - now < 60000)) continue;
      out.push({ repo: text(m.program, 80) || name, mood: m.mood, from: 'program', says: text(m.line), at: new Date(at).toISOString() });
    }
  }
  return out;
}

/** Key requests waiting on Astra: the pet that asked is curious. */
export function keyMoods(folder) {
  const out = [];
  let names = [];
  try { names = readdirSync(folder).filter((n) => n.endsWith('.json')).sort(); } catch { return out; }
  for (const name of names) {
    const r = readJson(join(folder, name));
    if (!r || r.schema !== KEY_SCHEMA || r.status !== 'requested' || !r.requester?.pet) continue;
    // A request whose key is not named yet (Spoonfed's sign-in and database) says what it is for instead.
    const key = text(r.key_name, 80) || text(r.for, 80).replace(/[.]$/, '') || 'a key', provider = text(r.provider, 60);
    out.push({ repo: text(r.requester.pet, 80), mood: 'curious', from: 'key', says: `I'm waiting on a key from you: ${key}${provider ? ` (${provider})` : ''}.`, at: r.asked || null });
  }
  return out;
}

/** The Farmer's last round, for the pets it checked in the past week. */
export function roundMoods(file, now = Date.now()) {
  const status = readJson(file);
  const out = [];
  for (const [repo, s] of Object.entries(status?.pets || {})) {
    const at = Date.parse(s?.checked);
    if (!ORDER.includes(s?.mood) || !(now - at <= ROUND_FRESH_MS)) continue;
    out.push({ repo, mood: s.mood, from: 'round', says: text(s.says), at: new Date(at).toISOString() });
  }
  return out;
}

/** The most urgent of several moods (MOOD-KEY.md's order). */
export const rank = (mood) => { const i = ORDER.indexOf(mood); return i < 0 ? ORDER.length : i; };

/** Everything put together: one mood per pet. */
export function resolveMoods(reasons, list) {
  const pets = {};
  for (const r of reasons) {
    const repo = list.find(r.repo);
    if (!repo) continue; // not a pet (the pet chat helper, a helper's own folder)
    const p = list.pets.get(repo);
    const entry = pets[repo] || (pets[repo] = { pet: p.pet, art: p.art, mood: null, show: null, says: '', from: null, why: [] });
    entry.why.push({ mood: r.mood, from: r.from, says: r.says, at: r.at });
  }
  for (const entry of Object.values(pets)) {
    entry.why.sort((a, b) => rank(a.mood) - rank(b.mood));
    const top = entry.why[0];
    Object.assign(entry, { mood: top.mood, show: SHOWN.includes(top.mood) ? top.mood : null, says: top.says, from: top.from });
  }
  return Object.fromEntries(Object.entries(pets).sort(([a], [b]) => a.localeCompare(b)));
}

// The pet list changes only when the hub does: read it again when pets.json or pet-programs.json changes.
let listCache = null;
function currentList(root) {
  const stamp = ['pets.json', 'pet-programs.json'].map((f) => { try { return statSync(join(root, f)).mtimeMs; } catch { return 0; } }).join();
  if (!listCache || listCache.root !== root || listCache.stamp !== stamp) listCache = { root, stamp, list: petList(root) };
  return listCache.list;
}

/** One look at every source. */
export function readBoard(where = places(), now = Date.now()) {
  const list = currentList(where.root);
  const reasons = [...programMoods(where.programs, now), ...keyMoods(where.keys), ...roundMoods(where.status, now)];
  return { schema: SCHEMA, tool: LABEL, updated: new Date(now).toISOString(), order: ORDER, shown: SHOWN, stale_after_ms: STALE_MS, pets: resolveMoods(reasons, list) };
}

/** The page copy of the board. */
export const pageFile = (board) => `// Written by The Farm's pet-moods (${LABEL}) on this PC only: every pet's mood, the same on the desktop, the\n// pages and the Stream Deck keys. Key names and pets' own lines, never a key. Rewritten whole; do not edit by hand.\nwindow.${PAGE_VAR} = ${JSON.stringify(board)};\n`;

// Written next to the file, then moved over it, so a reader never sees half a file. Windows refuses the move while a
// reader has the file open (the desktop pets, a page's server): try again a few times, then write it in place.
const pause = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
function writeWhole(file, body) {
  const temp = `${file}.${process.pid}.tmp`;
  writeFileSync(temp, body);
  for (let i = 0; ; i++) {
    try { renameSync(temp, file); return; } catch (e) {
      if (!['EPERM', 'EBUSY', 'EACCES'].includes(e.code)) { rmSync(temp, { force: true }); throw e; }
      if (i >= 4) { rmSync(temp, { force: true }); writeFileSync(file, body); return; }
      pause(40);
    }
  }
}

/** Writes both files; returns the board. */
export function writeBoard(where = places(), now = Date.now()) {
  const board = readBoard(where, now);
  mkdirSync(where.out, { recursive: true });
  writeWhole(join(where.out, BOARD), `${JSON.stringify(board, null, 2)}\n`);
  writeWhole(join(where.out, PAGE_DATA), pageFile(board));
  return board;
}

/** The moods without the time, to tell whether anything changed. */
const sameMoods = (a, b) => JSON.stringify(a?.pets) === JSON.stringify(b?.pets);

/** Keeps the files up to date until the process ends. One copy at a time (a lock file with its process id). */
export function keepWriting(where = places(), { log = () => {}, every = EVERY_MS } = {}) {
  mkdirSync(where.out, { recursive: true });
  const lock = join(where.out, 'pet-moods-20261114.lock');
  const held = Number(readFileSync(lock, { encoding: 'utf8', flag: existsSync(lock) ? 'r' : 'a+' }) || 0);
  if (held && held !== process.pid) { try { process.kill(held, 0); log(`already running (process ${held})`); return null; } catch { /* that copy is gone */ } }
  writeFileSync(lock, String(process.pid));
  let last = null, written = 0;
  const tick = () => {
    try {
      const now = Date.now(), board = readBoard(where, now);
      if (sameMoods(board, last) && now - written < HEARTBEAT_MS) return;
      mkdirSync(where.out, { recursive: true });
      writeWhole(join(where.out, BOARD), `${JSON.stringify(board, null, 2)}\n`);
      writeWhole(join(where.out, PAGE_DATA), pageFile(board));
      if (!sameMoods(board, last)) log(`moods: ${Object.entries(board.pets).map(([repo, p]) => `${repo}=${p.mood}`).join(' ') || 'all calm'}`);
      last = board; written = now;
    } catch (e) { log(`could not write the moods: ${e.message}`); }
  };
  tick();
  const timer = setInterval(tick, every);
  const stop = () => { clearInterval(timer); try { if (readFileSync(lock, 'utf8') === String(process.pid)) rmSync(lock, { force: true }); } catch { /* gone */ } };
  return { stop, tick };
}

// Started by Startup Star (--background) or by hand. The PetOS folder can be a junction, so compare real paths.
const self = fileURLToPath(import.meta.url);
const isMain = (() => { try { return !!process.argv[1] && realpathSync(process.argv[1]) === realpathSync(self); } catch { return false; } })();
if (isMain) {
  const where = places();
  if (process.argv.includes('--background')) {
    const logFile = join(where.out, 'pet-moods-20261114.log');
    const log = (line) => { try { mkdirSync(where.out, { recursive: true }); appendFileSync(logFile, `${new Date().toISOString()} ${line}\n`); } catch { /* the readers still work */ } };
    try { if (statSync(logFile).size > 1e6) rmSync(logFile, { force: true }); } catch { /* no log yet */ }
    const run = keepWriting(where, { log });
    if (!run) process.exit(0);
    log(`writing ${join(where.out, BOARD)} every ${EVERY_MS / 1000} s`);
    for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => { run.stop(); process.exit(0); });
  } else {
    const board = process.argv.includes('--print') ? readBoard(where) : writeBoard(where);
    const rows = Object.entries(board.pets);
    console.log(rows.length ? rows.map(([repo, p]) => `${p.pet} (${repo}): ${p.mood}${p.show ? '' : ' (calm: not shown)'} from ${p.from}: ${p.says}`).join('\n') : 'Every pet is calm.');
    if (!process.argv.includes('--print')) console.log(`\nWrote ${join(where.out, BOARD)} and ${PAGE_DATA}.`);
  }
}
