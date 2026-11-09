// The Flash Audit helper (Astra, 2026-11-08, deck "The Farm: art and lights", "All recommended", answer 4: A): Run on a
// check in The Farm's flash-audit tool box asks it to run the Flash Audit again over every pet program. It runs the
// read-only auditor (scripts/idle-flash-audit-20261017.mjs), one run at a time, and writes the newest run to
// Documents\Astra's PetOS Data\astras-pet-os\flash-audit, where The Farm's page reads it
// (apps/flash-audit-control-20261108.js). It answers only on this PC (127.0.0.1), takes a run only from a page this PC
// serves, and changes nothing in any repo. Startup Star starts it at sign-in (--background).
//   node scripts/flash-audit-helper-20261108.mjs [--background]
// Node's built-in modules only (AGENTS.md). Claude Opus 5.5 (claude-opus-5-5), 2026-11-08.
import http from 'node:http';
import { spawn } from 'node:child_process';
import { appendFileSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { AUDITOR, DATA_FOLDER, HELPER_PORT, PAGE_DATA } from './flash-audit-checks-20261108.mjs';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
// Two folders above the farm, as the other helpers keep their files.
export const DATA = resolve(ROOT, '..', '..', "Astra's PetOS Data", ...DATA_FOLDER);
// Only pages this PC serves may ask for a run: another site in the browser cannot.
export const LOCAL = /^http:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/;
const today = () => { const d = new Date(); return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`; };

/** The helper's server and state; the test starts it with a stand-in auditor and its own folders. */
export function createHelper({ root = ROOT, data = DATA, node = process.execPath, auditor = AUDITOR, log = () => {} } = {}) {
  const state = { running: false, check: null, started: null, finished: null, exit: null, error: null, date: null };
  function run(check) {
    if (state.running) return false;
    mkdirSync(data, { recursive: true });
    const out = join(data, `run-${today()}`);
    Object.assign(state, { running: true, check, started: new Date().toISOString(), finished: null, exit: null, error: null });
    log(`run started${check ? ` (asked from ${check})` : ''}`);
    let err = '';
    const child = spawn(node, [join(root, auditor), out], { cwd: root, windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] });
    child.stderr.on('data', (b) => { err = (err + b).slice(-4000); });
    child.on('error', (e) => { Object.assign(state, { running: false, finished: new Date().toISOString(), exit: -1, error: e.message }); log(`run could not start: ${e.message}`); });
    child.on('exit', (code) => {
      state.exit = code;
      try {
        if (code !== 0) throw new Error(err.trim().split(/\r?\n/).pop() || `the auditor stopped (${code})`);
        const pets = JSON.parse(readFileSync(join(out, 'ledger.json'), 'utf8'));
        const date = today();
        writeFileSync(join(data, 'ledger-latest.json'), JSON.stringify({ date, pets }));
        writeFileSync(join(data, PAGE_DATA), `window.flashAuditLedger = ${JSON.stringify({ date, pets }).replace(/</g, '\\u003c')};\n`);
        state.date = date;
      } catch (e) { state.error = e.message; if (!state.exit) state.exit = 1; }
      Object.assign(state, { running: false, finished: new Date().toISOString() });
      log(`run finished: exit ${state.exit}${state.error ? `, ${state.error}` : ''}`);
    });
    return true;
  }
  const server = http.createServer((req, res) => {
    const origin = req.headers.origin || '';
    const allowed = LOCAL.test(origin);
    const cors = allowed ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' } : {};
    const send = (code, body) => { res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...cors }); res.end(JSON.stringify(body)); };
    if (req.method === 'OPTIONS') {
      if (!allowed) return send(403, { ok: false });
      res.writeHead(204, { ...cors, 'Access-Control-Allow-Methods': 'GET, POST', 'Access-Control-Allow-Headers': 'Content-Type' });
      return res.end();
    }
    if (req.method === 'GET' && req.url === '/status') return send(200, { ok: true, ...state });
    if (req.method === 'POST' && req.url === '/run') {
      if (!allowed) return send(403, { ok: false, error: 'Only a page this PC serves may ask for a run.' });
      let body = '';
      req.on('data', (c) => { body += c; if (body.length > 1000) req.destroy(); });
      req.on('end', () => {
        let check = null;
        try { check = JSON.parse(body || '{}').check ?? null; } catch { return send(400, { ok: false, error: 'Not JSON.' }); }
        if (check !== null && !/^A\d{2}$/.test(String(check))) return send(400, { ok: false, error: 'Not a Flash Audit check.' });
        const started = run(check);
        send(started ? 202 : 409, started ? { ok: true, running: true } : { ok: false, running: true, error: 'A run is already going: every check updates when it is done.' });
      });
      return;
    }
    send(404, { ok: false });
  });
  return { server, state, run };
}

// Started by Startup Star (--background) or by hand. The PetOS folder can be a junction, so compare real paths.
const self = fileURLToPath(import.meta.url);
const isMain = (() => { try { return !!process.argv[1] && realpathSync(process.argv[1]) === realpathSync(self); } catch { return false; } })();
if (isMain) {
  const background = process.argv.includes('--background');
  const logFile = join(DATA, 'flash-audit-helper.log');
  const log = (line) => {
    const text = `${new Date().toISOString()} ${line}\n`;
    try { mkdirSync(DATA, { recursive: true }); appendFileSync(logFile, text); } catch { /* the page still works */ }
    if (!background) process.stdout.write(text);
  };
  const { server } = createHelper({ log });
  server.on('error', (e) => { log(e.code === 'EADDRINUSE' ? `already running on 127.0.0.1:${HELPER_PORT}` : e.message); process.exit(e.code === 'EADDRINUSE' ? 0 : 1); });
  server.listen(HELPER_PORT, '127.0.0.1', () => log(`answering on http://127.0.0.1:${HELPER_PORT} (Run on The Farm's flash-audit checks)`));
}
