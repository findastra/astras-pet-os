// White Hat Weasel's port watch (White Hat Lab's `white-hat-lab-v1.0-port-watch-tool-v1.0`).
//
// Astra, 2026-11-19: "The White Hat Weasel should be monitoring ports and asking me intermittently if I can close some
// ... I want to be able to click on a port, labeled, and I can read info about the latest traffic." Her answers the
// same day ("All recommended", deck "Weasel port watch questions"):
//   1. Latest traffic = who is connected to each port and from where (this PC, the home network, Tailscale or the
//      internet), since when, and the last peers seen. No admin program, so no byte counts.
//   2. He asks once a day: his mood turns curious (the light on his page and desktop pet) and his menu in Startup Star
//      starts with a line naming the ports that look left over.
//   3. Only our own servers can be closed (PetOS helpers and chat preview servers), and only by Astra's click, from his
//      menu in Startup Star. Other apps and Windows get an explanation only.
//   4. A short look every 10 minutes, started by Startup Star at sign-in. It opens no port of its own.
//
// It writes, on this PC only:
//   Documents\Astra's PetOS Data\white-hat-lab\port-watch-page-data-20261119.js   for the port-watch tool box
//                                                       (window.whiteHatLabPortWatch; works from file:// too)
//   Documents\Astra's PetOS Data\white-hat-lab\port-watch-state-20261119.json     peers seen and the day's ask
//   %LOCALAPPDATA%\astras-pet-os\white-hat-lab\menu-20261021.json and mood-20261021.json   for Startup Star and pet-moods
// Never a repo: the port list says which programs run on her PC. User folders are written as %USERPROFILE%.
//
//   node scripts/port-watch-20261119.mjs                 look once, write the files
//   node scripts/port-watch-20261119.mjs --print         look once, print, write nothing
//   node scripts/port-watch-20261119.mjs --background    look every 10 minutes (Startup Star starts it at sign-in)
//   node scripts/port-watch-20261119.mjs --close <port>  stop the program behind one of our own servers (his menu)
//
// Developer terms: a listening port is a numbered door a program opens to accept connections; a connection's remote
// address is the other end. Read with Windows' Get-NetTCPConnection, which needs no administrator.
// Node's built-in modules only (AGENTS.md). Claude Opus 5.5 (claude-opus-5-5), 2026-11-19.
import { execFileSync } from 'node:child_process';
import { appendFileSync, existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const LABEL = 'white-hat-lab-v1.0-port-watch-tool-v1.0';
export const SCHEMA = 'white-hat-lab-port-watch-v1';
export const PAGE_VAR = 'whiteHatLabPortWatch';
export const PAGE_DATA = 'port-watch-page-data-20261119.js';
export const STATE = 'port-watch-state-20261119.json';
export const EVERY_MS = 10 * 60000;
/** A chat's preview server older than this, still open, looks left over. */
export const LEFTOVER_MS = 2 * 3600000;
/** How many peers each port remembers. */
export const PEERS_KEPT = 12;
export const REPO = 'white-hat-lab';
const MENU_SCHEMA = 'astras-pet-os-menu-v1', MOOD_SCHEMA = 'astras-pet-os-mood-v1';
export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/** Where it writes; the test passes its own folders. */
export function places({ docs = join(homedir(), 'Documents'), local = process.env.LOCALAPPDATA || join(homedir(), 'AppData', 'Local') } = {}) {
  return { out: join(docs, "Astra's PetOS Data", REPO), menu: join(local, 'astras-pet-os', REPO) };
}

// ---- what each port is ----
// Kinds: petos (our own helpers), preview (a chat's page server), app (a program made by others), windows (Windows).
// Only petos and preview can be closed, and only by Astra's click.
export const CLOSABLE = new Set(['petos', 'preview']);
const WINDOWS = new Set(['system', 'svchost.exe', 'lsass.exe', 'wininit.exe', 'services.exe', 'spoolsv.exe', 'smss.exe', 'csrss.exe', 'winlogon.exe']);
// PetOS servers by a piece of their command line (most specific first), with the name Astra knows them by.
const PETOS = [
  ['openai-discord-presence', 'OpenAI Discord Presence', 'Discord Damsel'],
  ['anthropic-discord-presence', 'Anthropic Discord Presence', 'Discord Damsel'],
  ['ableton-live-discord-presence', 'Ableton Live Discord Presence', 'Discord Damsel'],
  ['ipo-countdown', 'IPO Countdown', 'Discord Damsel'],
  ['flash-audit-helper', 'Flash Audit helper', 'The Farm'],
  ['pet-chat-helper', 'Pet chat helper (the chat window in pet pages)', 'The Farm'],
  ['light-hive-helper', 'Light Hive helper', 'RGBee'],
  ['rift-rabbit', 'Rift Rabbit launcher', 'Rift Rabbit'],
  ['benchmark-rock', 'Benchmark Rock GPU watch', 'Inference Iguana'],
  ['papermon-server', 'Papermon server', 'Paper Girl'],
  ['chat-rat', 'Chat Rat', 'Chat Rat'],
];
// Programs made by others, by process name.
const APPS = {
  'everything.exe': 'Everything search', 'discord.exe': 'Discord (how the presence cards talk to it)', 'discordcanary.exe': 'Discord Canary',
  'spotify.exe': 'Spotify', 'steam.exe': 'Steam', 'streamdeck.exe': 'Stream Deck', 'elgatoaudiocontrolserver.exe': 'Elgato Volume Controller',
  'deskflow-core.exe': 'Deskflow (mouse sharing between PCs)', 'rzsdkserver.exe': 'Razer Chroma', 'rzdiagnosticservice.exe': 'Razer diagnostics',
  'icue.exe': 'Corsair iCUE', 'lghub_updater.exe': 'Logitech G HUB updater', 'ovrserver_x64.exe': 'Meta Quest Link', 'tailscaled.exe': 'Tailscale',
  'mbamservice.exe': 'Malwarebytes', 'onedrive.sync.service.exe': 'OneDrive', 'hapticservice.exe': 'Haptic service', 'rgsupdater.exe': 'RGS updater',
  'vssrv.exe': 'VSSrv', 'gamemanagerservice3.exe': 'MSI game manager', 'msi.centralserver.exe': 'MSI Center', 'msi.terminalserver.exe': 'MSI Center',
  'msi_lan_manager_tool.exe': 'MSI LAN Manager', 'virtualdesktop.streamer.exe': 'Virtual Desktop Streamer', 'voicemeeter8x64.exe': 'Voicemeeter',
};

// Windows' own ports, by number, in plain words.
const WINDOWS_PORTS = {
  135: 'Windows: remote procedure calls (how Windows programs talk to each other)', 139: 'Windows: file and printer sharing (old style)',
  445: 'Windows: file and printer sharing', 1462: 'Windows service', 2869: 'Windows: network device discovery (UPnP)',
  5040: 'Windows: device connection service', 5357: 'Windows: network device discovery', 7680: 'Windows: Delivery Optimization (shares updates)',
};

/** A command line with the user's own folder written as %USERPROFILE% (the page never shows her user name). */
export function privacy(text, home = homedir()) {
  if (!text) return '';
  const esc = home.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\\/g, '[\\\\/]');
  return String(text).replace(new RegExp(esc, 'gi'), '%USERPROFILE%').replace(/\s+/g, ' ').trim().slice(0, 400);
}

/** What a listening program is: { kind, label, pet }. */
export function classify(name, cmd) {
  const n = String(name || '').toLowerCase(), c = String(cmd || '').toLowerCase();
  if (c.includes('editorial-preview-tool')) return { kind: 'preview', label: 'A chat’s working-copy preview (editorial preview tool)', pet: 'Luna’s Log' };
  if (/http\.server|\\temp\\claude\\|scratchpad|audit-server/.test(c)) return { kind: 'preview', label: 'A chat’s temporary page server', pet: null };
  for (const [marker, label, pet] of PETOS) if (c.includes(marker) || n.includes(marker)) return { kind: 'petos', label, pet };
  if (c.includes("astra's petos") && (n === 'node.exe' || n.endsWith('.exe'))) return { kind: 'petos', label: 'A PetOS program', pet: null };
  if (WINDOWS.has(n)) return { kind: 'windows', label: 'Windows itself', pet: null };
  if (APPS[n]) return { kind: 'app', label: APPS[n], pet: null };
  return { kind: 'app', label: name ? `${name} (not in the Weasel’s list yet)` : 'Unknown program', pet: null };
}

/** Who can reach a listening address. */
export function reach(address) {
  const a = String(address || '');
  if (a === '127.0.0.1' || a === '::1') return { reach: 'this-pc', words: 'This PC only' };
  if (a === '0.0.0.0' || a === '::') return { reach: 'network', words: 'This PC and your home network' };
  if (a.startsWith('100.') || a.toLowerCase().startsWith('fd7a:115c:a1e0')) return { reach: 'tailscale', words: 'Your Tailscale devices' };
  return { reach: 'network', words: `Your home network (on ${a})` };
}

/** Where the other end of a connection is. */
export function where(address) {
  const a = String(address || '').toLowerCase().replace(/^::ffff:/, '');
  if (a === '127.0.0.1' || a === '::1' || a === '0.0.0.0' || a === '::') return 'this PC';
  if (/^10\.|^192\.168\.|^172\.(1[6-9]|2\d|3[01])\.|^169\.254\.|^fe80:|^fc|^fd(?!7a:115c:a1e0)/.test(a)) return 'home network';
  const m = /^100\.(\d+)\./.exec(a);
  if ((m && +m[1] >= 64 && +m[1] <= 127) || a.startsWith('fd7a:115c:a1e0')) return 'Tailscale';
  return 'internet';
}

// ---- looking ----
const PS = String.raw`$ErrorActionPreference='SilentlyContinue'
$l=@(Get-NetTCPConnection -State Listen | Select-Object LocalAddress,LocalPort,OwningProcess)
$c=@(Get-NetTCPConnection | Where-Object { $_.State -ne 'Listen' } | Select-Object LocalAddress,LocalPort,RemoteAddress,RemotePort,@{n='State';e={[string]$_.State}},OwningProcess)
$ids=@($l | ForEach-Object { $_.OwningProcess }) + @($c | ForEach-Object { $_.OwningProcess }) | Sort-Object -Unique
$p=@(Get-CimInstance Win32_Process | Where-Object { $ids -contains [int]$_.ProcessId } | ForEach-Object { [pscustomobject]@{id=[int]$_.ProcessId;name=$_.Name;cmd=$_.CommandLine;started=$(if($_.CreationDate){$_.CreationDate.ToUniversalTime().ToString('o')}else{$null})} })
[pscustomobject]@{listen=$l;conn=$c;procs=$p} | ConvertTo-Json -Depth 4 -Compress`;

/** The raw look: { listen, conn, procs } from Windows (no administrator). */
export function look() {
  const out = execFileSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-Command', PS], { encoding: 'utf8', windowsHide: true, maxBuffer: 32 * 1024 * 1024, timeout: 120000 });
  const raw = JSON.parse(out || '{}');
  const arr = (v) => (Array.isArray(v) ? v : v ? [v] : []);
  return { listen: arr(raw.listen), conn: arr(raw.conn), procs: arr(raw.procs) };
}

/** Turns a raw look into the port list, keeping each port's last peers in state.peers. Pure: the test calls it. */
export function build(raw, state = {}, now = Date.now(), home = homedir()) {
  const procs = new Map(raw.procs.map((p) => [Number(p.id), p]));
  const peers = state.peers || {};
  const ports = new Map();
  for (const l of raw.listen) {
    const port = Number(l.LocalPort), pid = Number(l.OwningProcess);
    if (!Number.isFinite(port)) continue;
    const p = procs.get(pid) || {};
    const key = String(port);
    const entry = ports.get(key) || { port, addresses: [], pid, program: p.name || (pid === 4 ? 'System' : 'unknown'), command: privacy(p.cmd, home), started: p.started || null };
    if (!entry.addresses.includes(l.LocalAddress)) entry.addresses.push(l.LocalAddress);
    ports.set(key, entry);
  }
  const list = [];
  for (const e of ports.values()) {
    const c = classify(e.program, e.command);
    if (c.kind === 'windows') c.label = WINDOWS_PORTS[e.port] || (e.port >= 49152 ? 'Windows: a service’s own port (picked by Windows)' : 'Windows service');
    const widest = e.addresses.map(reach).sort((a, b) => (a.reach === 'this-pc') - (b.reach === 'this-pc'))[0] || reach('');
    const inbound = raw.conn.filter((x) => Number(x.LocalPort) === e.port && Number(x.OwningProcess) === e.pid);
    const now_ = inbound.map((x) => ({ from: x.RemoteAddress, where: where(x.RemoteAddress), state: x.State }));
    const outbound = raw.conn.filter((x) => Number(x.OwningProcess) === e.pid && Number(x.LocalPort) !== e.port && x.State === 'Established');
    const out = {};
    for (const x of outbound) { const w = where(x.RemoteAddress); out[w] = (out[w] || 0) + 1; }
    // Peers seen: one row per remote address, first and last seen, kept between looks.
    const seen = (peers[e.port] || []).filter((s) => s && s.from);
    for (const n of now_) {
      if (n.where === 'this PC' && n.from === '0.0.0.0') continue;
      const s = seen.find((x) => x.from === n.from);
      if (s) { s.last = new Date(now).toISOString(); s.where = n.where; } else seen.push({ from: n.from, where: n.where, first: new Date(now).toISOString(), last: new Date(now).toISOString() });
    }
    seen.sort((a, b) => Date.parse(b.last) - Date.parse(a.last));
    peers[e.port] = seen.slice(0, PEERS_KEPT);
    const age = e.started ? now - Date.parse(e.started) : null;
    const leftover = c.kind === 'preview' && age != null && age > LEFTOVER_MS;
    list.push({
      port: e.port, pid: e.pid, program: e.program, command: e.command, started: e.started,
      kind: c.kind, label: c.label, pet: c.pet, addresses: e.addresses, reach: widest.reach, reach_words: widest.words,
      connections: now_, talks_out: out, peers: peers[e.port], closable: CLOSABLE.has(c.kind), leftover,
    });
  }
  list.sort((a, b) => a.port - b.port);
  // Forget ports that closed more than a day ago.
  for (const k of Object.keys(peers)) if (!ports.has(k) && !(peers[k] || []).some((s) => now - Date.parse(s.last) < 86400000)) delete peers[k];
  return { ports: list, peers };
}

/** Today's ask (once a day): the left-over ports, kept for the rest of the day while they stay open. */
export function ask(list, state = {}, now = Date.now()) {
  const day = new Date(now).toLocaleDateString('en-CA');
  const open = new Set(list.filter((p) => p.leftover).map((p) => p.port));
  let a = state.ask && state.ask.day === day ? state.ask : null;
  if (!a && open.size) a = { day, asked: new Date(now).toISOString(), ports: [...open] };
  if (a) a = { ...a, ports: a.ports.filter((p) => open.has(p)) };
  return a;
}

export function menu(list, todays) {
  const items = [];
  const name = (p) => `${p.port} · ${p.label}`;
  if (todays && todays.ports.length) items.push({ text: `${todays.ports.length} port${todays.ports.length === 1 ? '' : 's'} look left over today: close any you don’t need` });
  else items.push({ text: 'Nothing looks left over' });
  const left = list.filter((p) => p.leftover), own = list.filter((p) => p.closable && !p.leftover);
  for (const p of left) items.push({ text: `Close ${name(p)}`, args: ['--close', String(p.port)] });
  if (own.length) { items.push({ separator: true }); items.push({ text: 'Our own servers (close only if you mean to)' }); }
  for (const p of own) items.push({ text: `Close ${name(p)}`, args: ['--close', String(p.port)] });
  items.push({ separator: true }, { text: 'Look at the ports now', args: ['--once'] });
  return { schema: MENU_SCHEMA, program: REPO, updated: new Date().toISOString(), items };
}

export function mood(todays, now = Date.now()) {
  const n = todays ? todays.ports.length : 0;
  return { schema: MOOD_SCHEMA, program: REPO, mood: n ? 'curious' : 'idle', updated: new Date(now).toISOString(),
    line: n ? `${n} port${n === 1 ? ' looks' : 's look'} left over. Can I close ${n === 1 ? 'it' : 'some'}? (Startup Star → White Hat Weasel)` : 'Watching your ports. Nothing looks left over.' };
}

export const pageFile = (data) => `// Written by White Hat Weasel's port watch (${LABEL}) on this PC only: the ports open on this PC, who is\n// connected, and today's ask. Never in a repo. Rewritten whole every 10 minutes; do not edit by hand.\nwindow.${PAGE_VAR} = ${JSON.stringify(data)};\n`;

const readJson = (f) => { try { return JSON.parse(readFileSync(f, 'utf8')); } catch { return null; } };
function writeAtomic(file, text) { mkdirSync(dirname(file), { recursive: true }); const tmp = `${file}.tmp`; writeFileSync(tmp, text); renameSync(tmp, file); }

/** One look: writes the page data, state, menu and mood. Returns the page data. */
export function once({ where: at = places(), raw = look(), now = Date.now(), home = homedir(), write = true } = {}) {
  const stateFile = join(at.out, STATE);
  const state = readJson(stateFile) || {};
  const { ports, peers } = build(raw, state, now, home);
  const todays = ask(ports, state, now);
  const data = { schema: SCHEMA, checked: new Date(now).toISOString(), every_minutes: EVERY_MS / 60000, ask: todays, ports,
    how: 'Get-NetTCPConnection and Win32_Process, no administrator. Read only; it changes nothing unless you click Close in Startup Star.' };
  if (write) {
    writeAtomic(join(at.out, PAGE_DATA), pageFile(data));
    writeAtomic(stateFile, JSON.stringify({ peers, ask: todays }, null, 2));
    writeAtomic(join(at.menu, 'menu-20261021.json'), JSON.stringify(menu(ports, todays), null, 2));
    writeAtomic(join(at.menu, 'mood-20261021.json'), JSON.stringify(mood(todays, now), null, 2));
  }
  return data;
}

/** Stops the program behind one of our own servers. Refuses anything else. Returns what it did, in words. */
export function close(port, { raw = look(), home = homedir(), kill = (pid) => process.kill(pid) } = {}) {
  const n = Number(port);
  if (!Number.isInteger(n) || n < 1 || n > 65535) return { ok: false, words: `${port} is not a port number.` };
  const { ports } = build(raw, {}, Date.now(), home);
  const p = ports.find((x) => x.port === n);
  if (!p) return { ok: false, words: `Nothing is listening on port ${n} now.` };
  if (!p.closable) return { ok: false, words: `Port ${n} belongs to ${p.label}: not one of our own servers, so the Weasel never closes it.` };
  if (!(p.pid > 4)) return { ok: false, words: `Port ${n} has no program the Weasel can stop.` };
  kill(p.pid);
  return { ok: true, words: `Closed port ${n} (${p.label}): stopped ${p.program}, process ${p.pid}.` };
}

function log(at, line) { try { mkdirSync(at.out, { recursive: true }); appendFileSync(join(at.out, 'port-watch-log-20261119.txt'), `${new Date().toISOString()} ${line}\n`); } catch { /* the page still works */ } }

if (process.argv[1] && resolve(process.argv[1]).toLowerCase() === resolve(fileURLToPath(import.meta.url)).toLowerCase()) {
  const args = process.argv.slice(2), at = places();
  if (args[0] === '--close') {
    const r = close(args[1]);
    log(at, r.words);
    console.log(r.words);
    try { once({ where: at }); } catch (e) { log(at, `look failed: ${e.message}`); }
    process.exit(r.ok ? 0 : 1);
  } else if (args.includes('--print')) {
    const d = once({ write: false });
    for (const p of d.ports) console.log(`${String(p.port).padStart(5)}  ${p.kind.padEnd(7)} ${p.reach_words.padEnd(30)} ${p.label}${p.leftover ? '  [left over]' : ''}${p.connections.length ? `  ${p.connections.length} connected` : ''}`);
    console.log(d.ask ? `Today's ask: ${d.ask.ports.join(', ')}` : 'Nothing looks left over.');
  } else if (args.includes('--background')) {
    // One copy only: a second start sees the first one's lock and leaves.
    const lock = join(at.menu, 'port-watch-20261119.lock');
    const other = Number((existsSync(lock) && readFileSync(lock, 'utf8')) || 0);
    let alive = false;
    if (other && other !== process.pid) { try { process.kill(other, 0); alive = true; } catch { alive = false; } }
    if (alive) { log(at, `already running (process ${other})`); process.exit(0); }
    mkdirSync(at.menu, { recursive: true }); writeFileSync(lock, String(process.pid));
    const tick = () => { try { const d = once({ where: at }); log(at, `looked: ${d.ports.length} ports${d.ask && d.ask.ports.length ? `, ask ${d.ask.ports.join(' ')}` : ''}`); } catch (e) { log(at, `look failed: ${e.message}`); } };
    tick(); setInterval(tick, EVERY_MS);
  } else {
    const d = once({ where: at });
    console.log(`${d.ports.length} ports written to ${join(at.out, PAGE_DATA)}${d.ask && d.ask.ports.length ? `; today's ask: ${d.ask.ports.join(', ')}` : ''}`);
  }
}
