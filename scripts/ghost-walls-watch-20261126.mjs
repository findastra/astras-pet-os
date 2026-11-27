// White Hat Lab's Ghost In The Walls watch (white-hat-lab-v1.0-ghost-in-the-walls-tool-v1.0): a record of every device
// that joins the guest network, Ghost In The Walls.
//
// Astra, 2026-11-20: "I want the ghost in the walls tool to be a white hat tool. And I want you to track attempted
// password logins to it somehow." The home TP-Link router keeps no record of wrong guest passwords, so the
// closest is who got in: each look reads the guest device list with ghost-walls-guest-reader-20261126.py and keeps,
// per device, when it was first and last seen, how many separate visits, its name, address and band.
//
// White Hat Lab's server (white-hat-lab-server-20261120.mjs) runs a look every 30 minutes, only once the router login is
// set (WHITE_HAT_LAB_ROUTER_PASSWORD, API Fairy's key request; Astra adds it herself). Not more often: the router allows
// one admin sign-in at a time, and a look signs in for a few seconds.
//
// It writes, on this PC only (guest devices and their addresses are private, never a repo):
//   Documents\Astra's PetOS Data\white-hat-lab\ghost-walls-guests-20261126.json     every device seen, its visits
//   Documents\Astra's PetOS Data\white-hat-lab\ghost-walls-page-data-20261126.js     for the tool box (window.whiteHatLabGhostWalls)
//   Documents\Astra's PetOS Data\white-hat-lab\ghost-walls-log-20261126.txt          one line per join, leave or failed look
//
//   node scripts/ghost-walls-watch-20261126.mjs           look once, write the files
//   node scripts/ghost-walls-watch-20261126.mjs --print   look once, print, write nothing
//
// Node's built-in modules only (AGENTS.md). Claude Opus 5.5 (claude-opus-5-5), 2026-11-26.
import { execFileSync } from 'node:child_process';
import { appendFileSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const LABEL = 'white-hat-lab-v1.0-ghost-in-the-walls-tool-v1.0';
export const SCHEMA = 'white-hat-lab-ghost-walls-v1';
export const KEY = 'WHITE_HAT_LAB_ROUTER_PASSWORD';
export const EVERY_MS = 30 * 60 * 1000;
export const GUESTS = 'ghost-walls-guests-20261126.json';
export const PAGE_DATA = 'ghost-walls-page-data-20261126.js';
export const LOG = 'ghost-walls-log-20261126.txt';
export const PAGE_VAR = 'whiteHatLabGhostWalls';
const READER = join(dirname(fileURLToPath(import.meta.url)), 'ghost-walls-guest-reader-20261126.py');

export const outDir = (docs = join(homedir(), 'Documents')) => join(docs, "Astra's PetOS Data", 'white-hat-lab');

/** The router login is set for this user: the server only looks once it is. Reads Windows' user variable too, so a
 *  login Astra adds after sign-in counts without restarting the server. Never returns or logs the value. */
export function ready({ env = process.env, userEnv = readUserEnv } = {}) { return !!(env[KEY] || userEnv(KEY)); }
function readUserEnv(name) {
  if (process.platform !== 'win32') return '';
  try {
    return execFileSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', `[Environment]::GetEnvironmentVariable('${name}','User')`],
      { encoding: 'utf8', windowsHide: true, timeout: 30000 }).trim();
  } catch { return ''; }
}

/** One read of the router, through the Python reader. Returns its JSON ({ok, guests, ...}). */
export function read({ python = 'python', reader = READER, env = process.env, userEnv = readUserEnv } = {}) {
  const pass = env[KEY] || userEnv(KEY);
  let out = '';
  try {
    out = execFileSync(python, [reader], { encoding: 'utf8', windowsHide: true, timeout: 120000, env: { ...env, [KEY]: pass || '' } });
  } catch (e) { out = String(e.stdout || ''); }
  try { return JSON.parse(out.trim().split('\n').pop()); } catch { return { ok: false, why: 'The reader gave no answer.', code: 1 }; }
}

/** Folds one reading into the record. A device seen in the last reading continues its visit; one that was not starts a
 *  new visit. Returns the new record and the lines for the log (joined, left). */
export function fold(reading, record = {}, now = Date.now()) {
  const at = new Date(now).toISOString();
  const devices = { ...(record.devices || {}) };
  const before = new Set(record.present || []);
  const present = [];
  const lines = [];
  for (const g of reading.guests || []) {
    const id = g.mac || `${g.name}|${g.ip}`;
    if (!id || present.includes(id)) continue;
    present.push(id);
    const d = devices[id] || { mac: g.mac, first_seen: at, visits: 0 };
    const back = !before.has(id);
    devices[id] = { ...d, name: g.name || d.name || '', ip: g.ip || d.ip || '', band: g.band || d.band || '', last_seen: at,
      visits: d.visits + (back ? 1 : 0), ...(back ? { visit_started: at } : {}) };
    if (back) lines.push(`joined: ${describe(devices[id])}${d.visits ? ` (visit ${d.visits + 1})` : ' (first time)'}`);
  }
  for (const id of before) if (!present.includes(id) && devices[id]) lines.push(`left: ${describe(devices[id])}`);
  return { record: { schema: SCHEMA, checked: at, present, devices }, lines };
}

const describe = (d) => `${d.name || 'a device with no name'} ${d.mac || ''} ${d.ip || ''} ${d.band || ''}`.replace(/\s+/g, ' ').trim();

/** What the tool box shows: guests on now, every device ever seen (newest first), the last look. */
export function page(record, last) {
  const list = Object.values(record.devices || {}).sort((a, b) => String(b.last_seen).localeCompare(String(a.last_seen)));
  return { schema: SCHEMA, label: LABEL, checked: record.checked || null, every_minutes: EVERY_MS / 60000,
    last: last.ok ? 'ok' : last.why, guests_now: (record.present || []).length, seen: list.length,
    devices: list.map((d) => ({ ...d, on_now: (record.present || []).includes(d.mac || '') })),
    how: 'The router does not record wrong passwords; this is everyone who got onto Ghost In The Walls. Read only, on this PC only.' };
}

const readJson = (f) => { try { return JSON.parse(readFileSync(f, 'utf8')); } catch { return null; } };
function writeAtomic(file, text) { mkdirSync(dirname(file), { recursive: true }); const tmp = `${file}.tmp`; writeFileSync(tmp, text); renameSync(tmp, file); }

/** One look: read the router, fold, write the record, the page data and the log. Returns the page data. A failed read
 *  keeps the record as it was (nobody is marked as left) and logs why. */
export function once({ out = outDir(), reading = read(), now = Date.now(), write = true } = {}) {
  const prev = readJson(join(out, GUESTS)) || {};
  const { record, lines } = reading.ok ? fold(reading, prev, now) : { record: prev, lines: [`look failed: ${reading.why}`] };
  const data = page(record, reading);
  if (write) {
    writeAtomic(join(out, GUESTS), JSON.stringify(record, null, 2));
    writeAtomic(join(out, PAGE_DATA), `// Written by White Hat Weasel's Ghost In The Walls watch (${LABEL}) on this PC only: devices on the guest\n// network. Never in a repo. Rewritten whole every look; do not edit by hand.\nwindow.${PAGE_VAR} = ${JSON.stringify(data)};\n`);
    if (lines.length) { mkdirSync(out, { recursive: true }); appendFileSync(join(out, LOG), lines.map((l) => `${new Date(now).toISOString()} ${l}\n`).join('')); }
  }
  return data;
}

if (process.argv[1] && resolve(process.argv[1]).toLowerCase() === resolve(fileURLToPath(import.meta.url)).toLowerCase()) {
  const print = process.argv.includes('--print');
  const d = once({ write: !print });
  if (d.last !== 'ok') { console.log(`Look failed: ${d.last}`); process.exit(1); }
  console.log(`${d.guests_now} on Ghost In The Walls now; ${d.seen} devices seen in all.`);
  for (const x of d.devices) console.log(`${x.on_now ? 'ON ' : '   '} ${x.name || '(no name)'}  ${x.mac}  ${x.band}  visits ${x.visits}  last ${x.last_seen}`);
}
