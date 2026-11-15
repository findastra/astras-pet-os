import http from 'node:http';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { Presence, activity, validateConfig, phase, EDITION } from './card-20261115.js';
import { DiscordRPC } from './rpc-20261115.js';
import { startupEnabled, setStartup } from './windows-startup-20261115.js';
import { SOURCE_IDENTITY } from './source-identity-20261115.js';

export const PORT = EDITION.port;
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const VERSION = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version;
const configPath = join(root, '.local', 'config.json');
const port = Number(process.env.ANTHROPIC_IPO_PORT || PORT);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Invalid ANTHROPIC_IPO_PORT.');
const origin = `http://127.0.0.1:${port}`;
let config = validateConfig();
try { config = validateConfig(JSON.parse(readFileSync(configPath, 'utf8'))); } catch { /* Setup stays available. */ }
const presence = new Presence();
presence.setMode(config.automaticOnStart ? 'manual' : 'off');
const rpc = new DiscordRPC();
let message = 'Ready.';
let published = false;
let lastSent;
let revision = 0;
let running = false;
let rerun = false;
let closing = false;
// The card is worked out every second, and Discord only hears about real changes (a new day, pricing, the bell).
const TICK_MS = 1000;
// After a failed connection (Discord closed), wait before trying the pipes again.
let retryAt = 0;
// Discord takes about five activity updates per 20 seconds from one app.
const MIN_SEND_MS = 4500;
let sentAt = 0;
rpc.on('disconnected', () => { published = false; lastSent = undefined; });

function idleMessage(now) {
  if (presence.mode === 'off') return 'Sharing is off.';
  const where = phase(config, now);
  if (where === 'unset') return 'Choose the date and time of the first trade.';
  if (where === 'over') return 'The first day of trading is over. The card is off.';
  return 'Ready.';
}

async function sync() {
  if (closing) return;
  if (running) { rerun = true; return; }
  running = true;
  const current = revision;
  try {
    const now = Math.floor(Date.now() / 1000);
    const payload = presence.mode === 'off' ? null : activity(config, now);
    if (!config.clientId) { message = 'One-time setup: add your Discord Application ID.'; return; }
    if (payload === null) {
      if (rpc.ready && lastSent !== null) await rpc.setActivity(null);
      published = false;
      lastSent = null;
      rpc.disconnect();
      message = idleMessage(now);
      return;
    }
    if (Date.now() < retryAt) return;
    await rpc.connect(config.clientId);
    retryAt = 0;
    if (current !== revision || closing) { rerun = true; return; }
    const signature = JSON.stringify(payload);
    if (lastSent !== signature && Date.now() - sentAt >= MIN_SEND_MS) {
      sentAt = Date.now();
      await rpc.setActivity(payload);
      lastSent = signature;
    }
    published = true;
    message = 'Activity accepted by Discord. Your Discord settings control who sees it.';
  } catch (error) {
    published = false;
    message = error.message;
    // Closed Discord or a rejected card: wait 5 seconds before trying again.
    retryAt = Date.now() + 5000;
  } finally {
    running = false;
    if (rerun && !closing) { rerun = false; setImmediate(sync); }
  }
}

function send(res, status, body, type = 'application/json') {
  res.writeHead(status, {
    'Content-Type': type,
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' https://findastra.github.io; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
  });
  res.end(type === 'application/json' ? JSON.stringify(body) : body);
}

async function jsonBody(req) {
  if (req.headers['content-type'] !== 'application/json') throw new Error('Expected JSON.');
  let body = '';
  for await (const chunk of req) {
    body += chunk;
    if (Buffer.byteLength(body) > 4096) throw new Error('Request too large.');
  }
  return JSON.parse(body);
}

const assets = {
  '/': ['index-20261115.html', 'text/html; charset=utf-8'],
  '/index-20261115.html': ['index-20261115.html', 'text/html; charset=utf-8'],
  '/app-20261115.js': ['app-20261115.js', 'text/javascript; charset=utf-8'],
  '/style-20261115.css': ['style-20261115.css', 'text/css; charset=utf-8'],
  '/galaxy-card.gif': ['galaxy-card.gif', 'image/gif'],
  '/official-galaxy-still-20261030.png': ['official-galaxy-still-20261030.png', 'image/png'],
  '/official-galaxy-data-20261030.js': ['official-galaxy-data-20261030.js', 'text/javascript; charset=utf-8'],
  '/official-galaxy-renderer-20261030.js': ['official-galaxy-renderer-20261030.js', 'text/javascript; charset=utf-8'],
};

const server = http.createServer(async (req, res) => {
  // Exact Host and Origin checks prevent DNS rebinding and cross-site control.
  if (req.headers.host !== `127.0.0.1:${port}`) return send(res, 403, { error: 'Local requests only.' });
  try {
    if (req.method === 'GET' && req.url === '/api/status') {
      const now = Math.floor(Date.now() / 1000);
      return send(res, 200, { app: EDITION.app, version: VERSION, identity: SOURCE_IDENTITY, config, mode: presence.mode,
        published, connected: rpc.ready, message, startupEnabled: startupEnabled(), now, phase: phase(config, now),
        card: activity(config, now) });
    }
    if (req.method === 'POST') {
      if (req.headers.origin !== origin) return send(res, 403, { error: 'Open the local control panel to make changes.' });
      const input = await jsonBody(req);
      if (req.url === '/api/startup') {
        if (typeof input.enabled !== 'boolean') throw new Error('Choose whether to run on startup.');
        config = setStartup(input.enabled);
        return send(res, 200, { ok: true });
      }
      if (req.url === '/api/config') {
        const nextConfig = validateConfig({ ...config, ...input });
        mkdirSync(join(root, '.local'), { recursive: true });
        writeFileSync(configPath, JSON.stringify(nextConfig, null, 2) + '\n', { mode: 0o600 });
        const newApp = nextConfig.clientId !== config.clientId;
        config = nextConfig;
        revision++;
        retryAt = 0;
        if (newApp) rpc.disconnect();
        void sync();
        return send(res, 200, { ok: true });
      }
      if (req.url === '/api/mode') {
        presence.setMode(input.mode);
        revision++;
        retryAt = 0;
        if (input.mode === 'off') rpc.disconnect();
        void sync();
        return send(res, 200, { ok: true });
      }
      if (req.url === '/api/quit') {
        send(res, 200, { ok: true });
        void shutdown();
        return;
      }
    }
    if (req.method === 'GET' && assets[req.url]) {
      const [file, type] = assets[req.url];
      return send(res, 200, readFileSync(join(root, 'public', file)), type);
    }
    send(res, 404, { error: 'Not found.' });
  } catch (error) { send(res, 400, { error: error instanceof SyntaxError ? 'Invalid JSON.' : error.message }); }
});
server.requestTimeout = 10000;
server.headersTimeout = 10000;
server.on('error', error => {
  console.error(error.code === 'EADDRINUSE' ? `Anthropic IPO Countdown may already be running. Open ${origin}` : error.message);
  clearInterval(interval);
  rpc.disconnect();
  process.exitCode = 1;
});
const interval = setInterval(sync, TICK_MS);
async function shutdown() {
  if (closing) return;
  closing = true;
  clearInterval(interval);
  presence.setMode('off');
  try { if (rpc.ready) await rpc.setActivity(null); } catch { /* Closing IPC also removes presence. */ }
  rpc.disconnect();
  server.close();
  server.closeAllConnections();
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
server.listen(port, '127.0.0.1', () => {
  console.log(`Anthropic IPO Countdown: ${origin}\nClose with Quit app or Ctrl+C.`);
  void sync();
});
