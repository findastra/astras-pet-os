// click-check: the Friendly Farmer's tool that clicks every button and link on the pet program pages and says which
// ones are broken (the-farm-v1.0-click-check-v1.0, a native tool of The Farm). By Astra.
// Astra, 2026-10-19: "a tool that tests the clickness of the buttons ... whether they don't go anywhere, whether they go
// to the wrong place"; the same day she made it The Farm's, not Browser Bat's: the Farm makes these pages.
//
// It opens each page in the Edge or Chrome already on the computer, headless, with a throwaway profile and one private
// browser context per page, driven through its DevTools pipe the way Mirror Pool's fit-check does. Nothing is
// installed, and nothing saved in Astra's own browser is read or changed. Node's built-in modules only (AGENTS.md).
//
// What it never does: send anything. A click that would post a form, call a program on this PC (127.0.0.1) or use
// any method but GET is stopped and reported, never sent. Buttons whose label says they act for real (delete, send,
// publish, ...) are not clicked at all unless --click-all. Outside links are only looked at (a GET, like opening them).
//
//   node scripts/click-check-20261019.mjs                   every pet program page and today's app in apps/
//   node scripts/click-check-20261019.mjs <page.html> ...   just these pages
//   --out <folder>  where the report goes (default: a dated folder in the computer's temp folder, never this repo)
//   --tabs <n>      pages checked at once (default 5)        --browser <path>  the Edge or Chrome to use
//   --offline       do not look at outside links (they show as not checked)
//   --click-all     also click buttons whose label says they act; sending stays blocked
//   --json          print the whole result as JSON
// Exit code 0: nothing broken. 1: something is broken (the report says what, where and which file to fix). 2: it
// could not run. GITHUB_TOKEN, when set, tells a private repo from a missing one. CLICK_CHECK_DEBUG=1 prints every
// click as it happens.
//
// Hidden buttons get a second pass: the tester clicks what opens them first (the chat button, a folded section's
// header). It goes one level deep; a button folded inside something folded is listed as not clicked.
//
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-19.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import net from 'node:net';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { readSpawnerSources, spawnerPages, DIR as SPAWN_DIR } from './pet-program-pages-20261018.mjs';
import { ownerOf, sameAccount, upstream } from './farm-owner-20261020.mjs';

export const LABEL = 'the-farm-v1.0-click-check-v1.0';
export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// ---------- Verdicts ----------

/** What a click can come to. `problem` ones make the run fail; the others are notes. */
export const VERDICTS = {
  nowhere: { mark: '💀', name: 'Goes nowhere', problem: true, means: 'Clicking it does nothing: no new page, no change, no file.' },
  'dead-end': { mark: '🚫', name: 'Dead end', problem: true, means: 'It goes somewhere that is not there: a missing page, file, tag or section.' },
  'wrong-place': { mark: '🔀', name: 'Wrong place', problem: true, means: 'It works, but not where its label or the registry says it should go.' },
  throws: { mark: '💥', name: 'Throws an error', problem: true, means: 'Clicking it (or opening the page) makes the page throw an error.' },
  forgets: { mark: '↩️', name: 'Forgets', problem: true, means: 'It changes and saves, but after a reload it is back to how it was.' },
  covered: { mark: '🙈', name: 'Covered', problem: true, means: 'Something else sits on top of it, so a person cannot click it.' },
  moves: { mark: '↕️', name: 'Moves when pressed', problem: true, means: 'The first press anywhere makes the page shift, so a first click can land beside a button and do nothing.' },
  'service-off': { mark: '🔌', name: 'Service off', problem: false, means: 'The page is fine, but the program on this PC it calls is not running.' },
  'sign-in': { mark: '🔒', name: 'Needs sign-in', problem: false, means: 'It opens only for someone signed in (a private repo, a sign-in page).' },
  unsure: { mark: '❓', name: 'Could not tell', problem: false, means: 'The tester could not check it (a site refused it, it sends something, or --offline).' },
  skipped: { mark: '⏭️', name: 'Not clicked', problem: false, means: 'Hidden until something else is clicked, switched off, or its label says it acts for real.' },
  ok: { mark: '✅', name: 'Works', problem: false, means: 'It did what a click should.' },
};
export const ORDER = Object.keys(VERDICTS);
export const isProblem = (v) => !!VERDICTS[v]?.problem;

// ---------- Small pure helpers (tested in test/click-check-test-20261019.mjs) ----------

/** A web address on this computer: never opened by the tester, only checked for whether something answers. */
export function isLocalUrl(u) {
  try {
    const { protocol, hostname } = new URL(u);
    if (!/^(https?|wss?):$/.test(protocol)) return false;
    const h = hostname.replace(/^\[|\]$/g, '');
    return h === 'localhost' || h.endsWith('.localhost') || h === '::1' || h === '0.0.0.0' || /^127\./.test(h);
  } catch { return false; }
}

const SIGN_IN = [/^https:\/\/github\.com\/(login|session)/, /accounts\.google\.com/, /login\.microsoftonline\.com/, /login\.live\.com/,
  /^https:\/\/claude\.ai\/login/, /^https:\/\/discord\.com\/login/, /\/(login|signin|sign-in|sign_in)([/?#]|$)/i];
/** The page a sign-in wall lands on. */
export const isSignInUrl = (u) => SIGN_IN.some((r) => r.test(String(u || '')));

/** Labels that say a button acts for real; such buttons are not clicked without --click-all. */
const ACTS = /\b(delete|remove|erase|wipe|uninstall|send|publish|post|merge|push|pay|buy|purchase|sign ?out|log ?out|quit|shut ?down|reset all|clear all)\b/i;
export const actsForReal = (label) => ACTS.test(String(label || ''));

/** What an outside page's answer means. */
export function classifyHttp({ status = 0, finalUrl = '', error = '' } = {}) {
  if (error) {
    if (/ENOTFOUND|NAME_NOT_RESOLVED/i.test(error)) return { verdict: 'dead-end', why: 'the site does not exist (no such address)' };
    return { verdict: 'unsure', why: `could not reach it (${error})` };
  }
  if (status >= 200 && status < 300) return isSignInUrl(finalUrl) ? { verdict: 'sign-in', why: 'it lands on a sign-in page' } : { verdict: 'ok', why: '' };
  if (status === 401) return { verdict: 'sign-in', why: 'the site asks for a sign-in (401)' };
  if (status === 403) return { verdict: 'unsure', why: 'the site refused the tester (403); a person in a browser may get in' };
  if (status === 404 || status === 410) return { verdict: 'dead-end', why: `the page is not there (${status})` };
  if (status === 429) return { verdict: 'unsure', why: 'the site said "too many requests" (429); try again later' };
  if (status >= 500) return { verdict: 'unsure', why: `the site had an error (${status}); try again later` };
  return { verdict: 'unsure', why: `the site answered ${status}` };
}

/** owner, repo and the branch, tag or path of a github.com address. */
export function githubParts(href) {
  const m = /^https:\/\/github\.com\/([^/?#]+)\/([^/?#]+)(?:\/(tree|blob|releases\/tag|commit)\/([^?#]+))?/.exec(String(href || ''));
  if (!m || ['orgs', 'settings', 'login', 'apps', 'marketplace', 'features'].includes(m[1])) return null;
  return { owner: m[1], repo: m[2].replace(/\.git$/, ''), kind: m[3] || null, ref: m[4] ? decodeURIComponent(m[4]).split('/')[0] : null };
}

/** A target as a report shows it: repo-relative for files here, never an absolute path from this computer. */
export function shown(target, root = ROOT) {
  if (!target) return '';
  if (!String(target).startsWith('file:')) return String(target);
  try {
    const i = target.indexOf('#');
    const file = fileURLToPath(i < 0 ? target : target.slice(0, i));
    const rel = path.relative(root, file);
    const name = rel.startsWith('..') || path.isAbsolute(rel) ? `…/${path.basename(file)}` : rel.split(path.sep).join('/');
    return name + (i < 0 ? '' : target.slice(i));
  } catch { return '(a file)'; }
}

/** The repo-relative path of a page, or …/name for a page outside this repo. */
export const pageName = (abs, root = ROOT) => shown(pathToFileURL(abs).href, root);

/**
 * One spelling for a file address: the browser and Node write the same file differently (Astra's folder name has an
 * apostrophe, which one encodes as %27), and Windows paths ignore case.
 */
export function fileKey(u) {
  try {
    const p = path.resolve(fileURLToPath(String(u).split('#')[0]));
    return process.platform === 'win32' ? p.toLowerCase() : p;
  } catch { return String(u).split('#')[0]; }
}
const sameAddress = (a, b) => (String(a).startsWith('file:') && String(b).startsWith('file:') ? fileKey(a) === fileKey(b) : String(a).split('#')[0] === String(b).split('#')[0]);

/**
 * Which file to change to fix a page. The spawned pages and the Farmer's desk are written by scripts (never edit the
 * page); the other pages in apps/ are copies of a pet's own app.
 */
export function sourceFor(rel) {
  if (rel.startsWith(`${SPAWN_DIR}/`)) {
    return 'scripts/pet-program-pages-20261018.mjs or its data (pets.json, pet-programs.json, system-map.json); its script and style are apps/pet-programs/pet-program-page-20261018.js and .css; then npm run build';
  }
  if (rel === 'apps/astras-pet-apps-20261008.html') return 'scripts/build-interfaces-20261008.mjs (the Farmer\'s desk), then npm run build';
  if (rel.startsWith('system-map-')) return 'scripts/system-map-template-20261012.html or system-map.json, then npm run build';
  const m = /^apps\/(.+)-\d{8}\.html$/.exec(rel);
  if (m && !/^beginner-guide$/.test(m[1])) return `the app in the pet's own repo (this page is a copy of it), then copy it here again; for the six desks scripts/build-interfaces-20261008.mjs builds, --refresh-existing <repo>`;
  return rel;
}

/**
 * Files the repo keeps on this PC only (its .gitignore): a page may load one when it runs on the farm (local service
 * addresses, docs/local-services-20261014.md) and do without it elsewhere, so a missing one is not a broken page.
 */
export function gitIgnored(root = ROOT) {
  let lines = [];
  try { lines = fs.readFileSync(path.join(root, '.gitignore'), 'utf8').split(/\r?\n/); } catch { return () => false; }
  const rules = lines.map((l) => l.trim()).filter((l) => l && !l.startsWith('#') && !l.startsWith('!')).map((g) => {
    const dir = g.endsWith('/'), anchored = g.replace(/\/$/, '').includes('/');
    const body = g.replace(/^\//, '').replace(/\/$/, '').replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*\*/g, '\u0000').replace(/\*/g, '[^/]*').replace(/\?/g, '[^/]').replace(/\u0000/g, '.*');
    return new RegExp(`${anchored ? '^' : '(^|/)'}${body}${dir ? '/' : '(/|$)'}`);
  });
  return (rel) => rules.some((r) => r.test(rel));
}

/** The git repo a file is in (the folder holding .git), or null. */
export function repoRootOf(file) {
  for (let d = path.dirname(path.resolve(file)); ; d = path.dirname(d)) {
    if (fs.existsSync(path.join(d, '.git'))) return d;
    if (path.dirname(d) === d) return null;
  }
}

/** Buttons that do nothing on one click on purpose, each checked by hand: matched by page and the button's path. */
export const KNOWN = [
  { page: 'apps/ghost-protocol-20261008.html', path: '#logo-btn', why: 'an easter egg: five clicks in a row show the credits (checked 2026-10-19)' },
];

/** Replace the page's own pet, program and number with placeholders, so 40 pages with one bug make one row. */
export function generalize(text, own = {}) {
  let s = String(text ?? '');
  const subs = [[own.mapNode, '<node>'], [own.repo, '<repo>'], [own.homeSlug, '<home>'], [own.petSlug, '<pet>'], [own.home, '<Home>'], [own.pet, '<Pet>']]
    .filter(([v]) => v && String(v).length > 2).sort((a, b) => String(b[0]).length - String(a[0]).length);
  for (const [v, p] of subs) s = s.split(String(v)).join(p);
  if (own.number) s = s.replace(new RegExp(`program-${own.number}\\b`, 'g'), 'program-<N>').replace(new RegExp(`#${own.number}\\b`, 'g'), '#<N>');
  return s;
}

/** Findings of the wanted verdicts, grouped by cause: one row per verdict, label, target and reason, with its pages. */
export function groupFindings(pages, wanted = isProblem) {
  const groups = new Map();
  for (const p of pages) {
    for (const f of p.findings) {
      if (!wanted(f.verdict)) continue;
      const label = generalize(f.label, p.own), target = generalize(f.target, p.own), why = generalize(f.why, p.own);
      const key = [f.verdict, label, target, why, p.fix].join('\u0000');
      if (!groups.has(key)) groups.set(key, { verdict: f.verdict, label, target, why, fix: p.fix, where: [] });
      groups.get(key).where.push({ page: p.page, label: f.label, target: f.target, shot: f.shot || null, detail: f.detail || null });
    }
  }
  return [...groups.values()].sort((a, b) => ORDER.indexOf(a.verdict) - ORDER.indexOf(b.verdict) || b.where.length - a.where.length || a.label.localeCompare(b.label));
}

// ---------- Where each link should go: the registry's own answers ----------

/**
 * For the spawned pages, the spawner's own page data (its System Map node, repo and today's app), so the rules and the
 * pages never disagree; plus every pet's and pet program's name, to catch a link that says one pet and opens another.
 */
export function readExpectations(root = ROOT) {
  const byPage = new Map(), names = [], owners = new Set([upstream().owner.toLowerCase()]);
  try {
    const src = readSpawnerSources(root);
    for (const d of spawnerPages(src)) byPage.set(`${SPAWN_DIR}/${d.repo}-20261018.html`, d);
    for (const p of src.programs) {
      if (!p.repo) continue;
      owners.add(ownerOf(src.registry, p.repo).toLowerCase()); // the accounts this farm's pets live on (card 058, Part 3)
      for (const n of [p.icon, p.assigned ? p.program : null]) if (n && n.length > 2) names.push({ name: n, repo: p.repo });
    }
  } catch { /* not the hub, or its data does not build: only the general rules apply */ }
  names.sort((a, b) => b.name.length - a.name.length);
  return { byPage, names, owners };
}

/** The pet a link opens: its pet program page in this hub or its repo on GitHub, on an account this farm's pets live on. */
export function petOf(dest, owners = new Set([upstream().owner.toLowerCase()])) {
  const page = new RegExp(`(?:^|/)${SPAWN_DIR.replace('/', '\\/')}\\/([a-z0-9-]+)-20261018\\.html$`).exec(dest.rel || '');
  if (page && page[1] !== 'pet-program-spawner') return page[1];
  const gh = githubParts(dest.url);
  return gh && owners.has(gh.owner.toLowerCase()) ? gh.repo : null;
}

/**
 * Why a link goes to the wrong place, or null. `dest` is { url, kind: 'file'|'web'|..., rel (repo-relative file),
 * hash, same (true when it is the page itself) }.
 */
export function wrongPlace({ pageRel, label, dest }, exp) {
  const text = String(label || '').replace(/\s+/g, ' ').trim();
  if (dest.kind === 'file' && dest.same && !dest.hash) return 'it opens this same page again';
  const d = exp.byPage.get(pageRel);
  if (d) {
    if (dest.kind === 'file' && /(^|\/)system-map-\d{8}\.html$/.test(dest.rel) && /^#node=/.test(dest.hash)) {
      const node = decodeURIComponent(dest.hash.slice(6));
      if (/system map|on the map/i.test(text) && node !== d.mapNode) return `it opens the System Map on ${node}, but this pet's own node is ${d.mapNode}`;
    }
    if (/today.?s app/i.test(text) && d.appHref) {
      const want = /^https?:/.test(d.appHref) ? d.appHref : new URL(d.appHref, pathToFileURL(path.join(ROOT, pageRel))).href;
      if (!sameAddress(dest.url, want)) return `it opens ${shown(dest.url)}, but today's app in pets.json is ${shown(want)}`;
    }
    const gh = githubParts(dest.url);
    // The pet's repo is on its own account (d.owner: an example pet stays Astra's on another farm).
    if (gh && sameAccount(gh.owner, d.owner) && !gh.kind && (/^(repo|github|source|source code|code)$/i.test(text) || text === `${d.owner}/${d.repo}`) && gh.repo !== d.repo) {
      return `it opens ${d.owner}/${gh.repo}, but this pet's repo is ${d.owner}/${d.repo}`;
    }
  }
  const lower = text.toLowerCase();
  const named = exp.names.find((n) => lower === n.name.toLowerCase() || lower.startsWith(`${n.name.toLowerCase()} `));
  if (named) {
    const other = petOf(dest, exp.owners);
    if (other && other !== named.repo) return `it says ${named.name} but opens ${other}'s ${dest.kind === 'file' ? 'pet program page' : 'repo'}`;
  }
  return null;
}

// ---------- The browser: a headless Edge or Chrome through its DevTools pipe ----------

/** A Chromium-based browser on this computer: Edge or Chrome on Windows and macOS, Chromium or Chrome on Linux. */
export function findBrowser(explicit = process.env.CLICK_CHECK_BROWSER) {
  const tries = [];
  if (explicit) tries.push(explicit);
  if (process.platform === 'win32') {
    for (const base of [process.env['ProgramFiles(x86)'], process.env.ProgramFiles, process.env.LOCALAPPDATA].filter(Boolean)) {
      tries.push(path.join(base, 'Microsoft', 'Edge', 'Application', 'msedge.exe'), path.join(base, 'Google', 'Chrome', 'Application', 'chrome.exe'));
    }
  } else if (process.platform === 'darwin') {
    tries.push('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge', '/Applications/Chromium.app/Contents/MacOS/Chromium');
  } else {
    for (const dir of (process.env.PATH || '').split(path.delimiter)) {
      for (const exe of ['chromium', 'chromium-browser', 'google-chrome', 'google-chrome-stable', 'microsoft-edge']) tries.push(path.join(dir, exe));
    }
  }
  return tries.find((p) => { try { return fs.statSync(p).isFile(); } catch { return false; } }) || null;
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const BROWSER_ARGS = ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--disable-extensions',
  '--mute-audio', '--disable-sync', '--disable-component-update', '--no-pings', '--hide-scrollbars', '--disable-background-timer-throttling',
  '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows'];

/**
 * Start the browser and connect to it: through its DevTools pipe where it keeps the pipe (Linux, macOS), otherwise
 * through a DevTools port on this computer's own address (127.0.0.1) for this run only. Edge on Windows restarts
 * itself as a new process at once and the pipe is lost (seen on Astra's PC with Edge 155, 2026-10-19).
 */
async function connect(exe, profile, mode) {
  const listeners = new Set(), closers = new Set();
  const message = (text) => { for (const fn of listeners) fn(text); };
  const closed = (why) => { for (const fn of closers) fn(why); closers.clear(); };
  if (mode === 'pipe') {
    const child = spawn(exe, [...BROWSER_ARGS, '--remote-debugging-pipe', `--user-data-dir=${profile}`, 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe', 'pipe', 'pipe'], windowsHide: true });
    let stderr = '', buf = Buffer.alloc(0);
    child.on('error', (e) => closed(e.message));
    child.stderr.on('data', (d) => { stderr = (stderr + d).slice(-4000); });
    child.stdio[4].on('data', (chunk) => {
      buf = Buffer.concat([buf, chunk]);
      let i;
      while ((i = buf.indexOf(0)) >= 0) { message(buf.subarray(0, i).toString('utf8')); buf = buf.subarray(i + 1); }
    });
    child.on('exit', () => closed(stderr.slice(-600)));
    // A browser that drops the pipe (Edge on Windows) makes a write fail with EPIPE: that is a close, not a crash.
    for (const stream of [child.stdio[3], child.stdio[4]]) stream.on('error', (e) => closed(e.message));
    return { write: (s) => { try { child.stdio[3].write(s + '\0'); } catch (e) { closed(e.message); } },
      onMessage: (fn) => listeners.add(fn), onClose: (fn) => closers.add(fn), kill: () => child.kill() };
  }
  const child = spawn(exe, [...BROWSER_ARGS, '--remote-debugging-port=0', '--remote-debugging-address=127.0.0.1', `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore', windowsHide: true });
  child.on('error', () => {});
  const file = path.join(profile, 'DevToolsActivePort');
  for (let i = 0; i < 150 && !fs.existsSync(file); i++) await sleep(100);
  if (!fs.existsSync(file)) throw new Error('The browser did not open its DevTools port.');
  const [port, where] = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  const ws = new WebSocket(`ws://127.0.0.1:${Number(port)}${where}`);
  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = () => reject(new Error('Could not reach the browser\'s DevTools port.')); });
  ws.onmessage = (m) => message(String(m.data));
  ws.onclose = () => closed('');
  return { write: (s) => ws.send(s), onMessage: (fn) => listeners.add(fn), onClose: (fn) => closers.add(fn), kill: () => { try { ws.close(); } catch { /* closed */ } } };
}

/** Open the browser. Every page gets its own private context, so pages never share what they save. */
export async function openBrowser(exe, { timeoutMs = 30000 } = {}) {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'click-check-'));
  let nextId = 0, dead = null, link = null;
  const pending = new Map(), handlers = new Map();
  const receive = (text) => {
    const msg = JSON.parse(text);
    if (msg.id && pending.has(msg.id)) {
      const p = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) p.reject(new Error(`${p.method}: ${msg.error.message}`)); else p.resolve(msg.result);
    } else if (msg.method) {
      for (const fn of [...(handlers.get(`${msg.sessionId || ''} ${msg.method}`) || [])]) { try { fn(msg.params); } catch { /* a listener's own trouble */ } }
    }
  };
  const send = (method, params = {}, sessionId, ms = timeoutMs) => {
    if (dead) return Promise.reject(dead);
    const id = ++nextId;
    link.write(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject, method });
      setTimeout(() => { if (pending.delete(id)) reject(new Error(`${method}: no answer in ${ms / 1000} s`)); }, ms);
    });
  };
  const on = (sessionId, method, fn) => {
    const key = `${sessionId || ''} ${method}`;
    if (!handlers.has(key)) handlers.set(key, new Set());
    handlers.get(key).add(fn);
    return () => handlers.get(key)?.delete(fn);
  };
  let version = null;
  for (const mode of ['pipe', 'port']) {
    dead = null;
    try {
      link = await connect(exe, profile, mode);
      link.onMessage(receive);
      link.onClose((why) => {
        dead = new Error(`The browser closed.${why ? `\n${why}` : ''}`);
        for (const p of pending.values()) p.reject(dead);
        pending.clear();
      });
      version = await send('Browser.getVersion', {}, undefined, 8000);
      break;
    } catch (e) {
      if (link) link.kill();
      if (mode === 'port') throw e;
      await sleep(300);
    }
  }
  const downloads = new Map();
  on('', 'Browser.downloadWillBegin', (p) => downloads.get(p.frameId)?.(p));

  async function newPage() {
    const { browserContextId } = await send('Target.createBrowserContext', { disposeOnDetach: true });
    await send('Browser.setDownloadBehavior', { behavior: 'deny', browserContextId, eventsEnabled: true }).catch(() => {});
    const { targetId } = await send('Target.createTarget', { url: 'about:blank', browserContextId });
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
    const s = (method, params, ms) => send(method, params, sessionId, ms);
    const next = (event, ms = timeoutMs) => new Promise((resolve) => {
      const off = on(sessionId, event, (p) => { off(); resolve(p || {}); });
      setTimeout(() => { off(); resolve(null); }, ms);
    });
    return {
      targetId, send: s, next,
      on: (event, fn) => on(sessionId, event, fn),
      onDownload: (fn) => downloads.set(targetId, fn),
      /** Run code in the page and get its value back. */
      async evaluate(expression, ms = 15000) {
        const r = await s('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }, ms);
        if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
        return r.result.value;
      },
      async close() {
        downloads.delete(targetId);
        await send('Target.closeTarget', { targetId }).catch(() => {});
        await send('Target.disposeBrowserContext', { browserContextId }).catch(() => {});
      },
    };
  }

  async function close() {
    try { await send('Browser.close', {}, undefined, 5000); } catch { /* already closing */ }
    for (let i = 0; i < 30 && !dead; i++) await sleep(100);
    link.kill();
    // The profile is this run's own temporary folder; the browser may still hold a file for a moment.
    for (let i = 0; i < 10; i++) {
      try { fs.rmSync(profile, { recursive: true, force: true }); return; } catch { await sleep(300); }
    }
    // Still held: on Windows the browser the launcher handed off to never closed. Stop only the processes started
    // with this run's own throwaway profile, then try once more.
    if (process.platform === 'win32') {
      const name = path.basename(profile).replace(/[^A-Za-z0-9-]/g, '');
      spawnSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command',
        `Get-CimInstance Win32_Process -Filter "Name='msedge.exe' OR Name='chrome.exe'" | Where-Object { $_.CommandLine -like '*\\${name}*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }`],
      { windowsHide: true, timeout: 20000 });
      await sleep(500);
      try { fs.rmSync(profile, { recursive: true, force: true }); } catch { /* left for the OS to clear */ }
    }
  }
  return { newPage, close, version };
}

// ---------- In the page: what the tester adds before the page's own scripts run ----------

// It notes which elements get click listeners, keeps window.open and target="_blank" in the same tab (so the tester
// sees where they go), stands in for the clipboard, and holds the small helpers the tester calls. It sends nothing.
const IN_PAGE = String.raw`(() => {
  if (window.__cc) return;
  const cc = window.__cc = { opened: [], clipboard: [], own: new WeakSet(), muts: null };
  const add = EventTarget.prototype.addEventListener;
  const CLICKY = /^(click|dblclick|pointerdown|pointerup|mousedown|mouseup|touchstart|touchend)$/;
  EventTarget.prototype.addEventListener = function (type, fn, opts) {
    if (this instanceof Element && CLICKY.test(type)) cc.own.add(this);
    return add.call(this, type, fn, opts);
  };
  const d = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'onclick');
  if (d && d.set) Object.defineProperty(HTMLElement.prototype, 'onclick', { configurable: true, enumerable: d.enumerable, get: d.get,
    set(v) { if (v) cc.own.add(this); return d.set.call(this, v); } });
  window.open = function (u) {
    try { cc.opened.push(new URL(String(u == null ? '' : u), location.href).href); } catch (e) { cc.opened.push(String(u)); }
    return { closed: false, focus() {}, blur() {}, close() {}, postMessage() {}, document: { write() {}, close() {} }, location: {} };
  };
  add.call(document, 'click', (e) => {
    const t = e.target && e.target.closest ? e.target : null;
    const a = t && t.closest('a[target],area[target]'); if (a) a.removeAttribute('target');
    const f = t && t.closest('form[target]'); if (f) f.removeAttribute('target');
  }, true);
  try { if (navigator.clipboard) navigator.clipboard.writeText = (s) => { cc.clipboard.push(String(s).slice(0, 120)); return Promise.resolve(); }; } catch (e) {}
  const exec = document.execCommand;
  document.execCommand = function (c) { if (/^copy$/i.test(c)) cc.clipboard.push('(copied)'); return exec.apply(this, arguments); };

  const pathOf = (n) => {
    if (n && n.nodeType !== 1) n = n.parentElement;
    const parts = [];
    while (n && n.nodeType === 1 && parts.length < 9) {
      if (n.id) { parts.unshift('#' + n.id); break; }
      const tag = n.tagName.toLowerCase();
      if (n === document.body || n === document.documentElement) { parts.unshift(tag); break; }
      let i = 1, s = n; while ((s = s.previousElementSibling)) i++;
      parts.unshift(tag + ':' + i);
      n = n.parentElement;
    }
    return parts.join('>');
  };
  cc.pathOf = pathOf;
  cc.SELECT = 'a[href],area[href],button,summary,input[type=button],input[type=submit],input[type=reset],input[type=image],input[type=file],[role=button],[role=link],[role=tab],[role=menuitem],[role=switch],[onclick]';
  cc.items = () => {
    const set = new Set(document.querySelectorAll(cc.SELECT));
    for (const e of document.querySelectorAll('body *')) {
      if (!cc.own.has(e) || set.has(e)) continue;
      const up = e.parentElement && e.parentElement.closest(cc.SELECT);
      if (!up && !e.querySelector(cc.SELECT)) set.add(e);
    }
    return [...set].sort((a, b) => (a.compareDocumentPosition(b) & 4 ? -1 : 1));
  };
  const text = (e) => (e.getAttribute('aria-label') || (e.innerText || e.textContent || '').trim() || e.getAttribute('title') || e.getAttribute('alt')
    || (e.querySelector && e.querySelector('img[alt]') || {}).alt || e.value || e.getAttribute('name') || '').replace(/\s+/g, ' ').trim().slice(0, 100);
  cc.info = (e, i) => {
    const form = e.form || (e.closest && e.closest('form'));
    const submit = !!form && e.tagName !== 'A' && (e.type === 'submit' || e.type === 'image' || (e.tagName === 'BUTTON' && !e.getAttribute('type')));
    return { i, tag: e.tagName.toLowerCase(), type: e.getAttribute('type') || '', label: text(e), href: e.getAttribute('href'), url: e.href || null,
      path: pathOf(e), own: cc.own.has(e), download: e.hasAttribute('download'), submit,
      formAction: submit ? (form.getAttribute('action') ? form.action : '') : '', formMethod: submit ? (form.getAttribute('method') || 'get').toLowerCase() : '' };
  };
  cc.list = () => cc.items().map(cc.info);
  cc.find = (i, sig) => {
    const all = cc.items();
    if (!sig) return all[i] || null;
    if (all[i] && cc.pathOf(all[i]) === sig.path) return all[i];
    return all.find((x) => cc.pathOf(x) === sig.path) || all.find((x) => x.tagName.toLowerCase() === sig.tag && text(x) === sig.label && x.getAttribute('href') === sig.href) || null;
  };
  cc.describe = (t) => {
    if (!t) return '(nothing)';
    const id = t.id ? '#' + t.id : '', cls = (t.getAttribute('class') || '').trim().split(/\s+/)[0];
    return t.tagName.toLowerCase() + id + (cls ? '.' + cls : '') + (text(t) ? ' "' + text(t).slice(0, 40) + '"' : '');
  };
  cc.stateOf = (e) => e ? [e.getAttribute('aria-label'), e.getAttribute('aria-pressed'), e.getAttribute('aria-checked'), e.getAttribute('aria-expanded'),
    e.getAttribute('class'), e.tagName === 'SUMMARY' && e.parentElement ? String(e.parentElement.open) : '', e.value || '', (e.textContent || '').trim().slice(0, 80)].join('|') : null;
  cc.prepare = (i, sig) => {
    const e = cc.find(i, sig);
    if (!e) return { state: 'missing' };
    for (let p = e.tagName === 'SUMMARY' ? e.parentElement && e.parentElement.parentElement : e.parentElement; p; p = p.parentElement) {
      if (p.tagName === 'DETAILS' && !p.open) p.open = true;
    }
    if (e.disabled || e.getAttribute('aria-disabled') === 'true') return { state: 'disabled' };
    cc.reveal(e);
    const cs = getComputedStyle(e), r = cc.box(e);
    // A checkbox drawn by its label (the box itself made invisible) is clicked where a person clicks: on the label.
    const own = e.labels && e.labels.length && (r.width <= 2 || r.height <= 2 || Number(cs.opacity) === 0 || cs.clip !== 'auto' || cs.clipPath !== 'none') ? e.labels[0] : null;
    if (own) return cc.aim(e, own);
    if (e.closest('[hidden]') || cs.display === 'none' || cs.visibility === 'hidden' || r.width < 1 || r.height < 1) return { state: 'hidden' };
    return cc.aim(e, e);
  };
  // A link drawn with display: contents (a friends-list bubble, 2026-10-23) has no box of its own: its box is what it
  // holds, and scrolling to it means scrolling to that.
  cc.box = (el) => {
    if (getComputedStyle(el).display !== 'contents') return el.getBoundingClientRect();
    const kids = [...el.children].map(cc.box).filter((q) => q.width || q.height);
    if (!kids.length) return el.getBoundingClientRect();
    const left = Math.min(...kids.map((q) => q.left)), top = Math.min(...kids.map((q) => q.top));
    const right = Math.max(...kids.map((q) => q.right)), bottom = Math.max(...kids.map((q) => q.bottom));
    return { left, top, right, bottom, width: right - left, height: bottom - top, x: left, y: top };
  };
  cc.reveal = (el) => {
    const first = getComputedStyle(el).display === 'contents' && el.firstElementChild ? el.firstElementChild : el;
    first.scrollIntoView({ block: 'center', inline: 'center' });
  };
  cc.aim = (e, at) => {
    cc.reveal(at);
    const r = cc.box(at);
    if (r.width < 1 || r.height < 1) return { state: 'hidden' };
    for (let p = at; p && p !== document.body; p = p.parentElement) if (Number(getComputedStyle(p).opacity) === 0) return { state: 'hidden', folded: true };
    const box = { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height };
    const cls = (e.getAttribute('class') || '').split(/\s+/);
    // ... or the choice already made in a set of toggle buttons (aria-pressed, like the words switch's Farm words).
    const current = (e.hasAttribute('aria-current') && e.getAttribute('aria-current') !== 'false') || e.getAttribute('aria-selected') === 'true'
      || e.getAttribute('aria-pressed') === 'true'
      || cls.some((c) => /^(on|active|current|selected|is-active|is-current|is-selected)$/.test(c));
    // Outside the box of a parent that cuts off what overflows it: folded away (a section closed by its height).
    const clipped = (x, y) => {
      for (let p = at.parentElement; p && p !== document.documentElement; p = p.parentElement) {
        const s = getComputedStyle(p);
        if (!/hidden|clip|auto|scroll/.test(s.overflowX + ' ' + s.overflowY)) continue;
        const q = p.getBoundingClientRect();
        // At least a pixel inside: a box folded to no height still has an edge a point can land on.
        if (x < q.left + 1 || x > q.right - 1 || y < q.top + 1 || y > q.bottom - 1) return true;
      }
      return false;
    };
    // A link that wraps onto two lines has a box per line: aim at the lines, not the gap between them.
    const pts = [];
    // A link drawn with display: contents (a friends-list bubble) has no box of its own: aim at what it holds.
    const rects = (el) => { const own = [...el.getClientRects()]; return own.length || getComputedStyle(el).display !== 'contents' ? own : [...el.children].flatMap(rects); };
    for (const q of rects(at).filter((q) => q.width >= 1 && q.height >= 1)) {
      pts.push([q.left + q.width / 2, q.top + q.height / 2], [q.left + Math.min(4, q.width / 2), q.top + Math.min(4, q.height / 2)], [q.right - Math.min(4, q.width / 2), q.bottom - Math.min(4, q.height / 2)]);
    }
    let seen = null, inView = 0, folded = 0;
    for (const [x, y] of pts) {
      if (x < 0 || y < 0 || x >= innerWidth || y >= innerHeight) continue;
      inView++;
      if (clipped(x, y)) { folded++; continue; }
      const t = document.elementFromPoint(x, y);
      if (t && (t === at || at.contains(t) || t === e || e.contains(t))) return { state: 'ok', x, y, box, before: cc.stateOf(e), current };
      // A pill opens when it is clicked anywhere (Astra, 2026-10-23: "just clicking the bubble opens it"), so its own
      // hidden summary is reached through the pill, not covered by it.
      const pill = t && t.closest && t.closest('li.pill');
      if (pill && pill.contains(at)) return { state: 'ok', x, y, box, before: cc.stateOf(e), current };
      seen = seen || t;
    }
    if (inView && folded === inView) return { state: 'hidden', folded: true };
    // A section that is closed but still laid out may switch clicks off or fade out: the click passes through to
    // the section around it. That is folded away too, not covered.
    if (seen && seen.contains(at)) {
      for (let p = at; p && p !== seen; p = p.parentElement) {
        const s = getComputedStyle(p);
        if (s.pointerEvents === 'none' || Number(s.opacity) === 0) return { state: 'hidden', folded: true };
      }
    }
    return seen ? { state: 'covered', by: cc.describe(seen), box } : { state: 'offscreen', box };
  };
  // What opens a hidden button: the control naming its box (aria-controls), else a closed header beside it
  // (aria-expanded="false"). Its place in the list, or -1.
  cc.opener = (i, sig) => {
    const e = cc.find(i, sig);
    if (!e) return -1;
    const all = cc.items();
    const usable = (o) => !!o && o !== e && !o.contains(e) && all.includes(o) && cc.prepare(all.indexOf(o), null).state === 'ok';
    for (let a = e.parentElement; a && a !== document.body; a = a.parentElement) {
      if (a.id) {
        const o = all.find((x) => (x.getAttribute('aria-controls') || '').split(/\s+/).includes(a.id));
        if (usable(o)) return all.indexOf(o);
      }
      if (a.parentElement) {
        for (const c of a.parentElement.children) {
          if (c === a) continue;
          for (const o of c.matches('[aria-expanded="false"]') ? [c] : c.querySelectorAll('[aria-expanded="false"]')) if (usable(o)) return all.indexOf(o);
        }
      }
    }
    return -1;
  };
  cc.fillForm = (i, sig) => {
    const e = cc.find(i, sig), form = e && (e.form || e.closest('form'));
    let n = 0;
    if (form) for (const f of form.querySelectorAll('input,textarea')) {
      if (f.readOnly || f.disabled || f.value) continue;
      const t = (f.getAttribute('type') || 'text').toLowerCase();
      const v = t === 'email' ? 'test@example.com' : t === 'url' ? 'https://example.com' : t === 'number' ? '1' : /^(text|search|tel)$/.test(t) || f.tagName === 'TEXTAREA' ? 'click-check test' : null;
      if (v === null) continue;
      f.value = v; f.dispatchEvent(new Event('input', { bubbles: true })); n++;
    }
    return n;
  };
  cc.controlPoint = () => {
    scrollTo(0, 0);
    for (const e of document.querySelectorAll('h1,h2,h3,p,li,dt,dd,span,div')) {
      if (e.closest(cc.SELECT) || e.closest('label,input,textarea,select,summary') || e.querySelector(cc.SELECT)) continue;
      let mine = false;
      for (let p = e; p && p !== document.body; p = p.parentElement) if (cc.own.has(p)) { mine = true; break; }
      if (mine) continue;
      const r = e.getBoundingClientRect();
      if (r.width < 20 || r.height < 8 || r.top < 0 || r.bottom > innerHeight) continue;
      const x = r.left + Math.min(10, r.width / 2), y = r.top + r.height / 2, t = document.elementFromPoint(x, y);
      if (t && (t === e || e.contains(t))) return { x, y };
    }
    return null;
  };
  const snap = () => {
    const o = {};
    try { for (let k = 0; k < localStorage.length; k++) { const key = localStorage.key(k); o['local:' + key] = localStorage.getItem(key); } } catch (e) {}
    try { for (let k = 0; k < sessionStorage.length; k++) { const key = sessionStorage.key(k); o['session:' + key] = sessionStorage.getItem(key); } } catch (e) {}
    return o;
  };
  cc.watch = () => {
    if (cc.ob) cc.ob.disconnect();
    cc.muts = new Map();
    cc.ob = new MutationObserver((list) => { for (const m of list) cc.muts.set(pathOf(m.target) + (m.type === 'attributes' ? '@' + m.attributeName : m.type === 'childList' ? '#children' : '#text'), m); });
    cc.ob.observe(document.documentElement, { subtree: true, childList: true, attributes: true, characterData: true });
    cc.store0 = snap(); cc.href0 = location.href; cc.sy0 = scrollY; cc.opened.length = 0; cc.clipboard.length = 0;
    return true;
  };
  const valueOf = (m) => {
    if (m.type === 'attributes') return m.target.getAttribute ? String(m.target.getAttribute(m.attributeName)) : '';
    const t = m.target.nodeType === 1 ? m.target : m.target.parentElement;
    return t ? (t.textContent || '').trim().slice(0, 160) : '';
  };
  cc.collect = (i, sig) => {
    if (!cc.muts) return { gone: true };
    cc.ob.disconnect();
    const muts = {};
    for (const [k, m] of cc.muts) muts[k] = valueOf(m);
    cc.muts = null;
    const now = snap(), store0 = cc.store0 || {};
    const storage = Object.keys(Object.assign({}, store0, now)).filter((k) => store0[k] !== now[k]);
    let e = null; try { e = cc.find(i, sig); } catch (x) {}
    const h = location.hash ? decodeURIComponent(location.hash.slice(1)) : '';
    return { muts, storage, href0: cc.href0, href: location.href, scrolled: Math.abs(scrollY - cc.sy0), opened: cc.opened.slice(), clipboard: cc.clipboard.slice(),
      after: cc.stateOf(e), hash: h, hashFound: h ? !!(document.getElementById(h) || document.getElementsByName(h)[0]) : null };
  };
  // Wait for what is still moving (a section sliding open) before aiming; endless animations are not waited for.
  cc.calm = (max) => Promise.race([
    Promise.all(document.getAnimations().filter((a) => { const t = a.effect && a.effect.getTiming(); return a.playState === 'running' && t && t.iterations !== Infinity; }).map((a) => a.finished.catch(() => {}))),
    new Promise((r) => setTimeout(r, max)),
  ]).then(() => true);
  cc.reset = () => { try { localStorage.clear(); sessionStorage.clear(); } catch (e) {} return true; };
  // Where each button and link sits on the page, to see whether a press moves them.
  cc.tops = () => cc.items().map((e) => { const r = e.getBoundingClientRect(); return r.width || r.height ? Math.round(r.top + scrollY) : null; });
  // What a person's first touch does to the page (it notices it is being used), without pressing on anything.
  cc.wake = () => {
    for (const type of ['pointerdown', 'mousedown', 'pointerup', 'mouseup']) {
      const Ev = type.startsWith('pointer') && window.PointerEvent ? PointerEvent : MouseEvent;
      document.body.dispatchEvent(new Ev(type, { bubbles: true, cancelable: true }));
    }
    return true;
  };
  cc.settle = (quiet, max) => new Promise((res) => {
    const start = Date.now(); let t;
    const done = () => { ob.disconnect(); res(Date.now() - start); };
    const ob = new MutationObserver(() => { clearTimeout(t); t = setTimeout(done, quiet); });
    ob.observe(document.documentElement, { subtree: true, childList: true, attributes: true, characterData: true });
    t = setTimeout(done, quiet); setTimeout(done, max);
  });
  cc.noise = (ms) => new Promise((res) => {
    const seen = new Set();
    const ob = new MutationObserver((list) => { for (const m of list) seen.add(pathOf(m.target) + (m.type === 'attributes' ? '@' + m.attributeName : m.type === 'childList' ? '#children' : '#text')); });
    ob.observe(document.documentElement, { subtree: true, childList: true, attributes: true, characterData: true });
    setTimeout(() => { ob.disconnect(); res([...seen]); }, ms);
  });
})();`;

// ---------- Where a click went: is it there? ----------

/** One checker per run: outside links are looked at once each, however many pages have them. */
export function destinationChecker({ browser, userAgent, offline = false, root = ROOT }) {
  const cache = new Map();
  const ignored = gitIgnored(root);
  let lookerTab = null, looker = Promise.resolve();
  const withLooker = (fn) => (looker = looker.then(async () => {
    if (!lookerTab) lookerTab = await browser.newPage();
    return fn(lookerTab);
  }, () => null));

  async function inBrowser(url) {
    return withLooker(async (tab) => {
      let status = 0, finalUrl = url;
      const off = tab.on('Network.responseReceived', (p) => { if (p.type === 'Document' && p.frameId === tab.targetId) { status = p.response.status; finalUrl = p.response.url; } });
      try {
        await tab.send('Network.enable').catch(() => {});
        await tab.send('Page.enable').catch(() => {});
        const loaded = tab.next('Page.loadEventFired', 20000);
        await tab.send('Page.navigate', { url });
        await loaded;
      } finally { off(); }
      return { status, finalUrl };
    });
  }

  async function anchorOnPage(url, id) {
    return withLooker(async (tab) => {
      await tab.send('Page.enable').catch(() => {});
      const loaded = tab.next('Page.loadEventFired', 20000);
      await tab.send('Page.navigate', { url });
      await loaded;
      await sleep(400);
      return tab.evaluate(`!!(document.getElementById(${JSON.stringify(id)}) || document.getElementsByName(${JSON.stringify(id)})[0])`).catch(() => null);
    });
  }

  async function github(href) {
    const parts = githubParts(href);
    if (!parts) return null;
    const headers = { 'user-agent': 'astras-pet-os-click-check', accept: 'application/vnd.github+json' };
    if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    try {
      const r = await fetch(`https://api.github.com/repos/${parts.owner}/${parts.repo}`, { headers, signal: AbortSignal.timeout(15000) });
      if (r.status === 200) {
        const j = await r.json();
        if (j.private) return { verdict: 'sign-in', why: 'a private repo: it opens only for someone signed in who may see it' };
        return { verdict: 'dead-end', why: parts.ref ? `the repo is there, but not "${parts.ref}" (no such branch, tag or file)` : 'the repo is there, but not this page of it' };
      }
      if (r.status === 404) return { verdict: 'dead-end', why: process.env.GITHUB_TOKEN ? 'no such repo' : 'no such repo (or a private one: set GITHUB_TOKEN to tell)' };
    } catch { /* fall back to the plain answer */ }
    return null;
  }

  async function web(url) {
    if (offline) return { verdict: 'unsure', why: 'not checked (--offline)' };
    let res;
    try {
      const r = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(20000),
        headers: { 'user-agent': userAgent, accept: 'text/html,application/xhtml+xml,*/*;q=0.8', 'accept-language': 'en-US,en;q=0.9' } });
      try { await r.body?.cancel(); } catch { /* nothing to read */ }
      res = { ...classifyHttp({ status: r.status, finalUrl: r.url }), status: r.status };
    } catch (e) {
      res = classifyHttp({ error: e.cause?.code || e.name || String(e) });
    }
    if (res.status === 403 || res.status === 429 || res.status >= 500 || (res.verdict === 'unsure' && !res.status)) {
      const b = await inBrowser(url).catch(() => null);
      if (b && b.status) res = { ...classifyHttp(b), status: b.status, via: 'browser' };
    }
    if (res.verdict === 'dead-end' && res.status === 404) res = (await github(url)) || res;
    return res;
  }

  function local(u) {
    const port = Number(u.port || (u.protocol === 'https:' ? 443 : 80));
    const host = u.hostname.replace(/^\[|\]$/g, '');
    return new Promise((resolve) => {
      const s = net.connect({ host: host === 'localhost' || host.endsWith('.localhost') ? '127.0.0.1' : host, port });
      const end = (open) => { s.destroy(); resolve(open
        ? { verdict: 'unsure', why: `a program on this PC answers on port ${port}; the tester never sends it anything` }
        : { verdict: 'service-off', why: `nothing answers on this PC's port ${port}: the program behind it is not running` }); };
      s.setTimeout(1500);
      s.once('connect', () => end(true));
      s.once('timeout', () => end(false));
      s.once('error', () => end(false));
    });
  }

  async function file(u) {
    const i = u.href.indexOf('#');
    const p = fileURLToPath(i < 0 ? u.href : u.href.slice(0, i));
    if (!fs.existsSync(p)) {
      const rel = shown(pathToFileURL(p).href, root);
      if (!rel.startsWith('…') && ignored(rel)) return { verdict: 'skipped', why: `${rel} is kept on this PC only (.gitignore lists it), and this copy has none` };
      return { verdict: 'dead-end', why: `the file is not there (${rel})` };
    }
    const hash = decodeURIComponent(u.hash.slice(1));
    if (!hash) return { verdict: 'ok', why: '' };
    if (/^node=/.test(hash) && /^system-map-\d{8}\.html$/.test(path.basename(p))) {
      const id = hash.slice(5).split('&')[0];
      return fs.readFileSync(p, 'utf8').includes(`"id":${JSON.stringify(id)}`) ? { verdict: 'ok', why: '' } : { verdict: 'dead-end', why: `the System Map has no node ${id}` };
    }
    if (!/\.html?$/i.test(p)) return { verdict: 'ok', why: '' };
    const found = await anchorOnPage(u.href, hash);
    return found === false ? { verdict: 'dead-end', why: `that page has no #${hash}` } : { verdict: 'ok', why: '' };
  }

  async function check(raw) {
    let u;
    try { u = new URL(raw); } catch { return { verdict: 'dead-end', why: 'not a working address' }; }
    if (u.protocol === 'file:') return file(u);
    if (isLocalUrl(u.href)) return local(u);
    if (u.protocol === 'http:' || u.protocol === 'https:') return web(u.href);
    if (u.protocol === 'mailto:') return { verdict: 'ok', why: 'opens a new email' };
    if (u.protocol === 'blob:' || u.protocol === 'data:') return { verdict: 'ok', why: 'saves or shows something the page made' };
    return { verdict: 'unsure', why: `opens another program (${u.protocol.replace(':', '')}); the tester does not open other programs` };
  }

  return {
    check: (raw) => {
      const key = String(raw);
      if (!cache.has(key)) cache.set(key, check(key).catch((e) => ({ verdict: 'unsure', why: `could not check it (${e.message})` })));
      return cache.get(key);
    },
    close: async () => { await looker.catch(() => {}); if (lookerTab) await lookerTab.close(); },
  };
}

// ---------- One page ----------

const exceptionText = (d) => (d?.exception?.description || d?.text || 'an error').split('\n')[0].slice(0, 200);

function freshEvents() {
  return { navs: [], stopped: new Set(), blocked: [], dialogs: [], downloads: [], chooser: 0, exceptions: [], failed: [], inflight: 0, navPending: false, docChanged: false };
}

/**
 * What a click did, from what the browser saw and what the page recorded, leaving out what any click anywhere on the
 * page does (the page's own reaction to being used, its timers): `noise` is { paths: Set, values: Map }.
 */
export function judge(raw, noise) {
  const { item, after, ev } = raw;
  const effects = [];
  const dom = after && !after.gone ? Object.entries(after.muts).filter(([k, v]) => !noise.paths.has(k) && !(noise.values.has(k) && noise.values.get(k) === v)) : [];
  if (ev.exceptions.length) return { verdict: 'throws', why: ev.exceptions[0], effects };
  if (ev.downloads.length) effects.push(`saves a file (${ev.downloads.join(', ')})`);
  if (ev.chooser) effects.push('opens a file picker');
  if (ev.dialogs.length) effects.push(`asks: ${ev.dialogs[0].slice(0, 80)}`);
  if (after?.clipboard?.length) effects.push('copies text');
  if (after?.storage?.length) effects.push('saves in this browser');
  if (dom.length) effects.push(dom.some(([k]) => k.endsWith('@open')) ? 'opens or closes a panel' : 'changes the page');
  let jump = null;
  if (after && !after.gone && after.href !== after.href0 && after.href.split('#')[0] === after.href0.split('#')[0]) jump = after.hash;
  if (jump) effects.push(`jumps to #${jump}`);
  if (after && after.scrolled > 60 && !jump) effects.push('scrolls the page');
  // A page that shows its views by the address's #name needs no section of that name: only a jump that changes
  // nothing else is a dead end.
  if (jump && after.hashFound === false && !dom.length && !after.storage.length) return { verdict: 'dead-end', why: `it jumps to #${jump}, which is not on the page`, effects };
  // What the click asked for and did not get: missing (404) is a dead end; refused or limited (403, 429, 5xx) is
  // not proof, the same as for a link.
  const failed = ev.failed.filter((f) => f.during);
  if (failed.length) {
    const status = /^\d+$/.test(failed[0].text) ? Number(failed[0].text) : 0;
    const c = status ? classifyHttp({ status }) : { verdict: 'dead-end' };
    const asked = `it asks for ${failed[0].url} and gets ${failed[0].text}`;
    if (c.verdict !== 'dead-end') return { verdict: 'unsure', why: `${asked}: ${c.why}`, effects };
    return { verdict: 'dead-end', why: asked, effects };
  }
  if (effects.length) return { verdict: 'ok', why: '', effects };
  if (raw.prep?.current) return { verdict: 'ok', why: '', effects: ['it is the one already open'] };
  const sends = ev.blocked.filter((b) => b.kind === 'send');
  if (sends.length) return { verdict: 'unsure', why: `it sends ${sends[0].method} to ${new URL(sends[0].url).host}; the tester never sends anything`, effects };
  if (item.href === '#') return { verdict: 'nowhere', why: 'its link is just "#"', effects };
  return { verdict: 'nowhere', why: item.tag === 'a' ? 'clicking it does nothing' : 'clicking it does nothing: no new page, no change, no file', effects };
}

/** Click everything on one page. Returns { page, fix, own, counts, findings }. */
export async function checkPage(browser, pageAbs, ctx) {
  const root = ctx.root || ROOT;
  const rel = pageName(pageAbs, root);
  const own = ctx.exp.byPage.get(rel) || { repo: path.basename(pageAbs).replace(/-\d{8}\.html?$/i, '').replace(/\.html?$/i, '') };
  const result = { page: rel, fix: sourceFor(rel), own: { repo: own.repo, pet: own.pet, home: own.home, petSlug: own.petSlug, homeSlug: own.homeSlug, number: own.number, mapNode: own.mapNode }, findings: [], clicked: 0 };
  const url = pathToFileURL(pageAbs).href;
  const tab = await browser.newPage();
  let phase = 'load', ev = freshEvents();
  const requests = new Map();
  const local = new Set();

  tab.on('Fetch.requestPaused', (p) => {
    const { requestId, request, resourceType, frameId } = p;
    const u = request.url, m = request.method;
    const stop = (errorReason) => tab.send('Fetch.failRequest', { requestId, errorReason }).catch(() => {});
    if (isLocalUrl(u) && !ctx.liveLocal) { ev.blocked.push({ kind: 'local', method: m, url: u }); local.add(u); return stop('BlockedByClient'); }
    if (!['GET', 'HEAD', 'OPTIONS'].includes(m)) { ev.blocked.push({ kind: 'send', method: m, url: u }); return stop('BlockedByClient'); }
    // Where a click goes is noted and the page stays put (files too): the destination is checked on its own.
    if (phase === 'click' && resourceType === 'Document' && frameId === tab.targetId) { ev.navs.push(u); ev.stopped.add(u); ev.navPending = false; return stop('Aborted'); }
    return tab.send('Fetch.continueRequest', { requestId }).catch(() => {});
  });
  tab.on('Page.javascriptDialogOpening', (p) => {
    ev.dialogs.push(`${p.type}: ${p.message}`);
    tab.send('Page.handleJavaScriptDialog', { accept: false }).catch(() => {});
  });
  tab.on('Page.frameRequestedNavigation', (p) => {
    if (phase !== 'click' || p.frameId !== tab.targetId) return;
    ev.navs.push(p.url);
    if (p.url.startsWith('file:') && !ev.stopped.has(p.url)) ev.navPending = true;
  });
  tab.on('Page.frameNavigated', (p) => {
    if (p.frame.parentId || phase !== 'click') return;
    ev.docChanged = true; ev.navPending = false;
    if (p.frame.url && !ev.navs.includes(p.frame.url) && !p.frame.url.startsWith('chrome-error:')) ev.navs.push(p.frame.url);
  });
  tab.on('Page.fileChooserOpened', () => { ev.chooser++; });
  tab.on('Runtime.exceptionThrown', (p) => ev.exceptions.push(exceptionText(p.exceptionDetails)));
  tab.onDownload((p) => ev.downloads.push(p.suggestedFilename || 'a file'));
  tab.on('Network.requestWillBeSent', (p) => {
    if (p.type === 'Document' && p.frameId === tab.targetId) return;
    requests.set(p.requestId, { url: p.request.url, during: phase === 'click' });
    if (phase === 'click') ev.inflight++;
  });
  const done = (id) => { const r = requests.get(id); if (r?.during && ev.inflight > 0) ev.inflight--; return r; };
  tab.on('Network.loadingFinished', (p) => { done(p.requestId); requests.delete(p.requestId); });
  tab.on('Network.responseReceived', (p) => {
    const r = requests.get(p.requestId);
    if (r && p.response.status >= 400) ev.failed.push({ url: p.response.url, text: String(p.response.status), during: r.during });
  });
  tab.on('Network.loadingFailed', (p) => {
    const r = done(p.requestId);
    requests.delete(p.requestId);
    if (!r || /BLOCKED_BY_CLIENT|BlockedByClient|ERR_ABORTED/i.test(`${p.blockedReason || ''} ${p.errorText || ''}`)) return;
    if (/FILE_NOT_FOUND/.test(p.errorText) || r.url.startsWith('file:')) ev.failed.push({ url: r.url, text: /FILE_NOT_FOUND/.test(p.errorText) ? 'not found' : String(p.errorText || 'failed').replace(/^net::/, ''), during: r.during });
  });

  await tab.send('Page.enable');
  await tab.send('Runtime.enable');
  await tab.send('Network.enable');
  await tab.send('Fetch.enable', { patterns: [{ urlPattern: '*', requestStage: 'Request' }] });
  await tab.send('Page.setInterceptFileChooserDialog', { enabled: true }).catch(() => {});
  await tab.send('Page.addScriptToEvaluateOnNewDocument', { source: IN_PAGE });
  await tab.send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
  await tab.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] }).catch(() => {});

  const load = async () => {
    phase = 'load'; ev = freshEvents(); requests.clear();
    const loaded = tab.next('Page.loadEventFired', 20000);
    await tab.send('Page.navigate', { url });
    const ok = await loaded;
    await tab.evaluate('__cc.settle(150, 2000)').catch(() => {});
    const seen = ev; ev = freshEvents(); phase = 'idle';
    return { ok: !!ok, seen };
  };
  const reset = async () => { await tab.evaluate('__cc.reset()').catch(() => {}); return load(); };
  const finding = (f) => result.findings.push(f);
  const sig = (it) => JSON.stringify({ path: it.path, tag: it.tag, label: it.label, href: it.href });
  const shot = async (box, name) => {
    if (!ctx.shots || !box) return null;
    try {
      const pad = 24, x = Math.max(0, box.x - pad), y = Math.max(0, box.y - pad);
      const clip = { x, y, width: Math.min(640, box.w + pad * 2), height: Math.min(260, box.h + pad * 2), scale: 1 };
      const { data } = await tab.send('Page.captureScreenshot', { format: 'png', clip, captureBeyondViewport: false });
      return { name, data };
    } catch { return null; }
  };

  try {
    // Open the page once: what breaks when it opens.
    await tab.evaluate('1').catch(() => {});
    const first = await load();
    if (!first.ok) finding({ verdict: 'throws', label: '(the page itself)', target: '', why: 'the page never finished opening', effects: [] });
    for (const x of [...new Set(first.seen.exceptions)]) finding({ verdict: 'throws', label: '(the page itself)', target: '', why: `when it opens: ${x}`, effects: [] });
    // A file the page loads is judged against the page's own repo: what .gitignore keeps on the PC, and anything
    // outside the repo, is never on GitHub, so its page must do without it.
    const pageRoot = repoRootOf(pageAbs) || root, ignored = gitIgnored(pageRoot);
    const inRepo = (u) => { try { const r = path.relative(pageRoot, fileURLToPath(u.split('#')[0].split('?')[0])); return r && !r.startsWith('..') && !path.isAbsolute(r) ? r.split(path.sep).join('/') : null; } catch { return null; } };
    for (const f of first.seen.failed) {
      const target = shown(f.url, root), own = f.url.startsWith('file:') ? inRepo(f.url) : null;
      if (own && ignored(own)) {
        finding({ verdict: 'skipped', label: '(a file the page loads when it runs on the farm)', target, why: 'kept on this PC only (.gitignore lists it); the page does without it elsewhere', effects: [] });
      } else if (f.url.startsWith('file:') && !own) {
        // Outside the repo, so never on GitHub: data a page reads on Astra's PC only (API Fairy's key requests).
        finding({ verdict: 'skipped', label: '(a file the page loads when it runs on the farm)', target, why: 'outside this repo (data kept on this PC), and not on this PC now', effects: [] });
      } else finding({ verdict: 'dead-end', label: '(a picture or file the page loads)', target, why: `it is not there (${f.text})`, effects: [] });
    }
    const loadLocal = [...new Set(first.seen.blocked.filter((b) => b.kind === 'local').map((b) => b.url))];
    for (const u of loadLocal) {
      const r = await ctx.dests.check(u);
      finding({ verdict: r.verdict === 'service-off' ? 'service-off' : 'unsure', label: '(the page itself, when it opens)', target: u, why: r.verdict === 'service-off' ? r.why : `it asks a program on this PC; ${r.why}`, effects: [] });
    }

    // What the page does by itself, and what any click anywhere does: never counted for a button.
    const noise = { paths: new Set(await tab.evaluate('__cc.noise(3800)', 10000).catch(() => [])), values: new Map() };
    const spot = await tab.evaluate('__cc.controlPoint()').catch(() => null);
    if (spot) {
      const before = await tab.evaluate('__cc.tops()').catch(() => []);
      await tab.evaluate('__cc.watch()');
      await clickAt(tab, spot.x, spot.y);
      await sleep(ctx.wait);
      const c = await tab.evaluate('__cc.collect(-1, null)').catch(() => null);
      if (c && !c.gone) for (const [k, v] of Object.entries(c.muts)) noise.values.set(k, v);
      // A first press that moves the page makes a quick first click land beside its button (Astra's pages change
      // the pet's bubble when they notice you).
      const after = await tab.evaluate('__cc.tops()').catch(() => []);
      const moved = before.map((t, i) => (t === null || after[i] == null ? 0 : Math.abs(after[i] - t))).filter((d) => d > 2);
      if (moved.length) {
        const cause = c && !c.gone ? Object.entries(c.muts).find(([k]) => /#(children|text)$/.test(k)) : null;
        const what = cause ? cause[0].replace(/#(children|text)$/, '') : null;
        finding({ verdict: 'moves', label: '(the page itself, at the first press)', target: '',
          why: what ? `${what} changes when you first press anywhere, and the buttons and links below it move` : 'the page changes when you first press anywhere, and its buttons and links move',
          detail: `${moved.length} of ${before.length} move by up to ${Math.max(...moved)} px${cause ? `; it now says "${String(cause[1]).slice(0, 70)}"` : ''}`, effects: [] });
      }
    }
    await reset();
    let dirty = false;

    const items = await tab.evaluate('__cc.list()');
    // Start looking up where the plain links go now, all at once; the clicks below find the answers waiting.
    for (const it of items) if (it.url && /^(https?|file):/.test(it.url) && !it.url.startsWith(`${url}#`)) ctx.dests.check(it.url);
    const raws = [];
    const persistChecked = new Map();
    let sinceReset = 0, opener = null;
    // The page, ready for the next click: opened fresh after a click that left it (and every 15 clicks), and with
    // `opener` clicked first when the button sits behind it (the second pass, below).
    const ready = async (force = false) => {
      if (!(force || dirty || sinceReset >= 15)) return true;
      await reset(); dirty = false; sinceReset = 0;
      return openIt();
    };
    const openIt = async () => {
      if (!opener) return true;
      await tab.evaluate('__cc.calm(1500)').catch(() => {});
      await tab.evaluate('__cc.wake()').catch(() => {});
      const o = await tab.evaluate(`__cc.prepare(${opener.i}, ${sig(opener)})`).catch(() => ({ state: 'missing' }));
      if (o.state !== 'ok') return false;
      await clickAt(tab, o.x, o.y).catch(() => {});
      await sleep(ctx.wait);
      await tab.evaluate('__cc.calm(1500)').catch(() => {});
      return true;
    };
    const hidden = [];
    const tryItem = async (item, pass) => {
      const t0 = Date.now();
      const s = sig(item);
      await tab.evaluate('__cc.calm(1500)').catch(() => {});
      let prep = await tab.evaluate(`__cc.prepare(${item.i}, ${s})`).catch(() => ({ state: 'missing' }));
      // Something an earlier click opened may be in the way: look again on a freshly opened page before saying so.
      if (prep.state !== 'ok' && sinceReset > 0) {
        await ready(true);
        prep = await tab.evaluate(`__cc.prepare(${item.i}, ${s})`).catch(() => ({ state: 'missing' }));
      }
      const base = { i: item.i, tag: item.tag, label: item.label || `(${item.tag} with no label)`, href: item.href, path: item.path, ...(pass === 2 ? { opener: opener.label } : {}) };
      if (prep.state === 'hidden' || prep.state === 'missing' || prep.state === 'offscreen') {
        dirty = true;
        if (pass === 1 && prep.state !== 'missing') { hidden.push(item); return; }
        const why = prep.state === 'missing' ? 'it was gone after a reload'
          : pass === 2 ? `still hidden after clicking "${String(opener.label).slice(0, 40)}"` : prep.folded ? 'folded away until its section is opened' : 'hidden until something else is clicked';
        finding({ ...base, verdict: 'skipped', target: '', why, effects: [] });
        return;
      }
      if (prep.state === 'disabled') { finding({ ...base, verdict: 'skipped', target: '', why: 'switched off (disabled)', effects: [] }); dirty = true; return; }
      const picture = await shot(prep.box, `${rel.replace(/[^a-z0-9]+/gi, '-')}-${item.i}`);
      if (prep.state === 'covered') { finding({ ...base, verdict: 'covered', target: '', why: `${prep.by} sits on top of it`, effects: [], picture }); dirty = true; return; }
      // As a person who has already used the page (the first press can move things; that is reported once, above),
      // and measured again right before the click: the picture and the wake-up can both lay the page out again.
      await tab.evaluate('__cc.wake()').catch(() => {});
      await sleep(60);
      const spot2 = await tab.evaluate(`__cc.prepare(${item.i}, ${s})`).catch(() => prep);
      if (spot2.state === 'ok') { prep.x = spot2.x; prep.y = spot2.y; prep.before = spot2.before; prep.current = spot2.current; }
      else if (spot2.state === 'covered') { finding({ ...base, verdict: 'covered', target: '', why: `${spot2.by} sits on top of it`, effects: [], picture }); dirty = true; return; }
      if (!ctx.clickAll && actsForReal(item.label)) {
        finding({ ...base, verdict: 'skipped', target: item.url && !item.url.startsWith('javascript:') ? item.url : '', why: 'its label says it acts for real; not clicked (--click-all clicks it, still sending nothing)', effects: [] });
        dirty = true;
        return;
      }
      if (item.submit) await tab.evaluate(`__cc.fillForm(${item.i}, ${s})`).catch(() => 0);

      await tab.evaluate('__cc.watch()');
      phase = 'click'; ev = freshEvents();
      await clickAt(tab, prep.x, prep.y).catch(() => {});
      await sleep(ctx.wait);
      for (let t = 0; t < 40 && (ev.navPending || ev.inflight > 0); t++) await sleep(100);
      phase = 'idle';
      const after = ev.docChanged ? { gone: true } : await tab.evaluate(`__cc.collect(${item.i}, ${s})`, 8000).catch(() => ({ gone: true }));
      const raw = { item, prep, after, ev, base, picture };
      result.clicked++;
      if (process.env.CLICK_CHECK_DEBUG) {
        process.stderr.write(`${rel} [${item.i}${pass === 2 ? ` behind ${opener.i}` : ''}] ${item.label.slice(0, 40)} | at ${Math.round(prep.x)},${Math.round(prep.y)} | gone ${!!after?.gone} | changes ${after && !after.gone ? Object.keys(after.muts).length : '-'} | storage ${after?.storage?.length ?? '-'} | navs ${ev.navs.length} | errors ${ev.exceptions.length} | ${Date.now() - t0} ms\n`);
      }

      // Does what it saved come back after a reload? (a few per page: each check reloads the page)
      if (after && !after.gone && after.storage.length && after.after && after.after !== prep.before) {
        const key = after.storage.slice().sort().join(',');
        if ((persistChecked.get(key) || 0) < 3) {
          persistChecked.set(key, (persistChecked.get(key) || 0) + 1);
          await load();
          await openIt();
          const again = await tab.evaluate(`__cc.stateOf(__cc.find(${item.i}, ${s}))`).catch(() => null);
          raw.persist = again === null ? null : again === after.after ? 'kept' : again === prep.before ? 'forgot' : 'changed';
        }
      }
      // Reload before the next click only when this one left the page (another page opened, or it broke); a
      // panel opened or a light switched does not change how the next button works, and is cleared every 15 clicks.
      dirty = !after || !!after.gone || ev.docChanged || ev.exceptions.length > 0;
      sinceReset++;
      raws.push(raw);
    };
    for (const item of items) { await ready(); await tryItem(item, 1); }

    // Second pass: what was hidden, behind whatever opens it (the chat button, a folded section's header), which is
    // clicked first, as a person would.
    if (hidden.length) {
      const skip = (item, why) => finding({ i: item.i, tag: item.tag, label: item.label || `(${item.tag} with no label)`, href: item.href, path: item.path, verdict: 'skipped', target: '', why, effects: [] });
      await ready(true);
      const groups = new Map();
      for (const item of hidden) {
        const o = await tab.evaluate(`__cc.opener(${item.i}, ${sig(item)})`).catch(() => -1);
        if (!groups.has(o)) groups.set(o, []);
        groups.get(o).push(item);
      }
      for (const [o, group] of groups) {
        opener = o >= 0 ? items[o] : null;
        const open = opener ? await ready(true) : false;
        for (const item of group) {
          if (!open) { skip(item, opener ? `hidden, and "${String(opener.label).slice(0, 40)}" did not open` : 'hidden until something else is clicked (the tester found nothing that opens it)'); continue; }
          if (!(await ready())) { skip(item, `"${String(opener.label).slice(0, 40)}" did not open again`); continue; }
          await tryItem(item, 2);
        }
      }
      opener = null;
      dirty = true;
    }

    // A change that nearly every click makes is the page's own, not the button's (a timer, a mood, a clock).
    if (raws.length >= 6) {
      const count = new Map();
      for (const r of raws) if (r.after && !r.after.gone) for (const [k, v] of Object.entries(r.after.muts)) count.set(`${k}\u0000${v}`, (count.get(`${k}\u0000${v}`) || 0) + 1);
      for (const [kv, n] of count) if (n >= raws.length * 0.6) { const [k, v] = kv.split('\u0000'); if (!noise.values.has(k)) noise.values.set(k, v); }
    }

    for (const r of raws) {
      const j = judge(r, noise);
      const f = { ...r.base, verdict: j.verdict, why: j.why, effects: j.effects, target: '', picture: r.picture };
      const sent = new Set(r.ev.blocked.filter((b) => b.kind === 'send').map((b) => b.url));
      const goes = [...new Set([...r.ev.navs, ...(r.after?.opened || [])])].filter((u) => u && u !== 'about:blank' && !u.startsWith('chrome-error:') && !sent.has(u));
      // A jump within this page (#section) is not going somewhere; this page itself without a # is.
      const away = goes.filter((u) => !(sameAddress(u, url) && u.includes('#')));
      if (j.verdict !== 'throws' && away.length) {
        const to = away[0];
        const d = await ctx.dests.check(to);
        f.target = shown(to, root);
        f.verdict = d.verdict; f.why = d.why;
        f.effects = [`goes to ${shown(to, root)}`];
        if (d.verdict === 'ok' || d.verdict === 'sign-in' || d.verdict === 'unsure') {
          const hashAt = to.indexOf('#');
          const dest = { url: to, kind: to.startsWith('file:') ? 'file' : 'web', rel: shown(to.split('#')[0], root), hash: hashAt < 0 ? '' : to.slice(hashAt), same: sameAddress(to, url) };
          // A switch that saves a setting and then reloads its own page to show it works (developer mode's words
          // switch in every footer, 2026-10-20); a link back to the page itself, saving nothing, is still wrong.
          const reloads = dest.kind === 'file' && dest.same && !dest.hash && r.after?.storage?.length > 0;
          const wrong = reloads ? null : wrongPlace({ pageRel: rel, label: r.base.label, dest }, ctx.exp);
          if (reloads) f.effects = ['saves in this browser', 'reloads this page to show it'];
          if (wrong) { f.verdict = 'wrong-place'; f.why = wrong; }
        }
      } else if (j.verdict !== 'throws') {
        const loc = r.ev.blocked.find((b) => b.kind === 'local');
        if (loc && !j.effects.length) {
          const d = await ctx.dests.check(loc.url);
          f.target = loc.url; f.verdict = d.verdict; f.why = d.verdict === 'service-off' ? d.why : `it calls a program on this PC (${loc.method}); ${d.why}`;
        }
        if (j.verdict === 'ok' && r.persist === 'forgot') { f.verdict = 'forgets'; f.why = 'what it saved is not shown again after a reload'; }
        if (!f.target && r.item.href && r.item.href !== '#' && r.item.tag === 'a' && j.verdict === 'nowhere' && r.item.url) f.target = shown(r.item.url, root);
      }
      const known = KNOWN.find((k) => k.page === rel && k.path === r.base.path);
      if (known && f.verdict === 'nowhere') { f.verdict = 'ok'; f.why = ''; f.effects = [`known: ${known.why}`]; }
      finding(f);
    }
  } catch (e) {
    finding({ verdict: 'unsure', label: '(the page itself)', target: '', why: `the check stopped: ${String(e.message || e).split('\n')[0]}`, effects: [] });
  } finally {
    await tab.close();
  }

  // Pictures of the broken ones only.
  for (const f of result.findings) {
    if (f.picture && isProblem(f.verdict) && ctx.out) {
      const dir = path.join(ctx.out, 'shots');
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, `${f.picture.name}.png`), Buffer.from(f.picture.data, 'base64'));
      f.shot = `shots/${f.picture.name}.png`;
    }
    delete f.picture;
  }
  result.findings.sort((a, b) => (a.i ?? -1) - (b.i ?? -1));
  result.counts = Object.fromEntries(ORDER.map((v) => [v, result.findings.filter((f) => f.verdict === v).length]).filter(([, n]) => n));
  return result;
}

async function clickAt(tab, x, y) {
  await tab.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
  await tab.send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', buttons: 1, clickCount: 1 });
  await tab.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', buttons: 0, clickCount: 1 });
}

// ---------- The run ----------

/** Today's date as YYYYMMDD in Astra's time zone (America/Denver). */
export function today(now = new Date()) {
  const p = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Denver', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const get = (t) => p.find((x) => x.type === t).value;
  return `${get('year')}${get('month')}${get('day')}`;
}

/** Every pet program page and today's app in apps/ (the spawner's list too). */
export function defaultPages(root = ROOT) {
  const list = (dir) => fs.existsSync(path.join(root, dir)) ? fs.readdirSync(path.join(root, dir)).filter((f) => /\.html$/.test(f)).sort().map((f) => path.join(root, dir, f)) : [];
  return [...list(SPAWN_DIR), ...list('apps')];
}

export class CantRun extends Error {}

/** Check these pages. Returns the report: { date, label, browser, seconds, pages: [...] }. */
export async function run(pages, { browser: exe = null, tabs = 5, offline = false, clickAll = false, out = null, shots = true, wait = 300, root = ROOT, quiet = false } = {}) {
  const found = exe || findBrowser();
  if (!found) throw new CantRun('No Edge or Chrome found on this computer. Install one, or pass --browser <path>.');
  const started = Date.now();
  // One browser for looking at outside pages, and one per page checked at once: tabs of one headless browser take
  // turns (seen 2026-10-19: five tabs ran five times slower each), separate browsers do not.
  const looker = await openBrowser(found);
  const userAgent = String(looker.version.userAgent || '').replace('HeadlessEdg', 'Edg').replace('HeadlessChrome', 'Chrome');
  const dests = destinationChecker({ browser: looker, userAgent, offline, root });
  const exp = readExpectations(root);
  const queue = pages.map((p) => path.resolve(p));
  const done = [];
  try {
    await Promise.all(Array.from({ length: Math.max(1, Math.min(tabs, queue.length)) }, async () => {
      const browser = await openBrowser(found);
      try {
        while (queue.length) {
          const p = queue.shift();
          const r = await checkPage(browser, p, { exp, dests, clickAll, out, shots, wait, root });
          done.push(r);
          if (!quiet) {
            const bad = r.findings.filter((f) => isProblem(f.verdict)).length;
            process.stderr.write(`${bad ? '✗' : '✓'} ${r.page}: ${r.clicked} clicked${bad ? `, ${bad} broken` : ''}\n`);
          }
        }
      } finally {
        await browser.close();
      }
    }));
  } finally {
    await dests.close().catch(() => {});
    await looker.close();
  }
  done.sort((a, b) => a.page.localeCompare(b.page));
  return { date: today(), label: LABEL, browser: String(looker.version.product || ''), seconds: Math.round((Date.now() - started) / 1000), offline, pages: done };
}

// ---------- The report ----------

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function summarize(report) {
  const all = report.pages.flatMap((p) => p.findings);
  const counts = Object.fromEntries(ORDER.map((v) => [v, all.filter((f) => f.verdict === v).length]));
  return { pages: report.pages.length, clicked: report.pages.reduce((n, p) => n + p.clicked, 0), counts, broken: ORDER.filter(isProblem).reduce((n, v) => n + counts[v], 0),
    groups: groupFindings(report.pages), notes: groupFindings(report.pages, (v) => !isProblem(v) && v !== 'ok') };
}

export function renderText(report) {
  const s = summarize(report);
  const lines = [`click-check (${LABEL}), ${report.date}: ${s.pages} pages, ${s.clicked} buttons and links clicked in ${Math.round(report.seconds / 60) || '<1'} min.`];
  lines.push(s.broken ? `Broken: ${s.broken} (${s.groups.length} cause${s.groups.length === 1 ? '' : 's'})` : 'Nothing broken.');
  for (const g of s.groups) {
    lines.push(`  ${VERDICTS[g.verdict].mark} ${VERDICTS[g.verdict].name} ×${g.where.length}: "${g.label}"${g.target ? ` → ${g.target}` : ''}`);
    lines.push(`     ${g.why}${g.where[0].detail ? ` (${g.where[0].detail})` : ''}`);
    lines.push(`     on ${g.where.slice(0, 4).map((w) => w.page).join(', ')}${g.where.length > 4 ? ` and ${g.where.length - 4} more` : ''}`);
    lines.push(`     fix in: ${g.fix}`);
  }
  const notes = ORDER.filter((v) => !isProblem(v) && v !== 'ok' && s.counts[v]).map((v) => `${VERDICTS[v].mark} ${VERDICTS[v].name} ${s.counts[v]}`);
  if (notes.length) lines.push(`Notes: ${notes.join(' · ')} (in the report)`);
  lines.push(`Works: ${s.counts.ok}`);
  return lines.join('\n');
}

export function renderMarkdown(report) {
  const s = summarize(report);
  const out = [`# Click check, ${report.date}`, '',
    `The Friendly Farmer's click-check (\`${LABEL}\`) clicked **${s.clicked}** buttons and links on **${s.pages}** pages` +
    ` (${report.browser}, headless, a throwaway profile${report.offline ? ', outside links not checked' : ''}). Nothing was sent anywhere.`, '',
    `**${s.broken ? `${s.broken} broken, from ${s.groups.length} cause${s.groups.length === 1 ? '' : 's'}` : 'Nothing broken'}** · ` +
    ORDER.filter((v) => s.counts[v]).map((v) => `${VERDICTS[v].mark} ${VERDICTS[v].name} ${s.counts[v]}`).join(' · '), ''];
  const table = (groups) => {
    out.push('| # | What | Button or link | Goes to | Why | Pages | Fix in |', '|---|---|---|---|---|---|---|');
    groups.forEach((g, n) => out.push(`| ${n + 1} | ${VERDICTS[g.verdict].mark} ${VERDICTS[g.verdict].name} | ${md(g.label)} | ${md(g.target) || '·'} | ${md(g.why)} | ${g.where.length}: ${g.where.slice(0, 6).map((w) => `\`${w.page}\``).join(', ')}${g.where.length > 6 ? ` and ${g.where.length - 6} more` : ''} | ${md(g.fix)} |`));
    out.push('');
  };
  if (s.groups.length) { out.push('## Broken, by cause', ''); table(s.groups); }
  if (s.notes.length) { out.push('## Notes (not the page\'s fault, or not checked)', ''); table(s.notes); }
  out.push('## What each verdict means', '', '| Verdict | Means |', '|---|---|', ...ORDER.map((v) => `| ${VERDICTS[v].mark} ${VERDICTS[v].name} | ${VERDICTS[v].means} |`), '');
  out.push('## Every page', '', '| Page | Clicked | Broken | Notes |', '|---|---|---|---|');
  for (const p of report.pages) {
    const bad = p.findings.filter((f) => isProblem(f.verdict)).length, notes = p.findings.filter((f) => !isProblem(f.verdict) && f.verdict !== 'ok').length;
    out.push(`| \`${p.page}\` | ${p.clicked} | ${bad || '·'} | ${notes || '·'} |`);
  }
  return out.join('\n') + '\n';
}
const md = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');

export function renderHtml(report) {
  const s = summarize(report);
  const row = (g, n) => `<tr><td>${n + 1}</td><td class="v ${esc(g.verdict)}">${VERDICTS[g.verdict].mark} ${esc(VERDICTS[g.verdict].name)}</td><td>${esc(g.label)}</td>
<td class="mono">${esc(g.target) || '·'}</td><td>${esc(g.why)}</td><td>${g.where.length}<details><summary>pages</summary><ul>${g.where.map((w) => `<li><code>${esc(w.page)}</code>${w.detail ? `<br><span class="small">${esc(w.detail)}</span>` : ''}${w.shot ? `<br><img src="${esc(w.shot)}" alt="${esc(w.label)} on ${esc(w.page)}" loading="lazy">` : ''}</li>`).join('')}</ul></details></td><td class="mono small">${esc(g.fix)}</td></tr>`;
  const table = (title, groups) => groups.length ? `<h2>${esc(title)}</h2><div class="scroll"><table><thead><tr><th>#</th><th>What</th><th>Button or link</th><th>Goes to</th><th>Why</th><th>Pages</th><th>Fix in</th></tr></thead><tbody>${groups.map(row).join('')}</tbody></table></div>` : '';
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Click check ${esc(report.date)}</title>
<style>
:root{--bg:#26272b;--panel:#303137;--line:#45464e;--fg:#f2f2f5;--muted:#a9aab4;--lime:#b6ff3b;--cyan:#38e8ff;--pink:#ff4fd8;--violet:#a98bff;--amber:#ffd23f}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
main{max-width:1200px;margin:0 auto;padding:20px 16px 48px}h1{margin:0 0 6px;color:var(--lime);font-size:1.6rem}h2{margin:28px 0 10px;color:var(--cyan);font-size:1.15rem}
p{margin:6px 0;color:var(--muted)}.big{color:var(--fg);font-size:1.05rem}.chips{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0}
.chip{border:1px solid var(--line);border-radius:999px;padding:2px 10px;background:var(--panel)}.scroll{overflow-x:auto}
table{border-collapse:collapse;width:100%;min-width:760px}th,td{border-bottom:1px solid var(--line);padding:8px;text-align:left;vertical-align:top}
th{color:var(--muted);font-weight:500;font-size:.85rem}.mono,code{font-family:ui-monospace,Consolas,monospace;font-size:.85rem;overflow-wrap:anywhere}.small{font-size:.8rem;color:var(--muted)}
.v{white-space:nowrap}.v.dead-end,.v.throws,.v.nowhere{color:var(--pink)}.v.wrong-place,.v.forgets,.v.covered{color:var(--amber)}
details summary{cursor:pointer;color:var(--violet)}img{max-width:320px;border:1px solid var(--line);border-radius:6px;margin:4px 0}ul{margin:4px 0;padding-left:18px}
</style></head><body><main>
<h1>Click check, ${esc(report.date)}</h1>
<p class="big">The Friendly Farmer's click-check clicked <b>${s.clicked}</b> buttons and links on <b>${s.pages}</b> pages. Nothing was sent anywhere.</p>
<p>${s.broken ? `<b>${s.broken}</b> broken, from <b>${s.groups.length}</b> cause${s.groups.length === 1 ? '' : 's'}: one row per cause, so a bug the generator copied onto 40 pages is one row.` : 'Nothing broken.'}</p>
<div class="chips">${ORDER.filter((v) => s.counts[v]).map((v) => `<span class="chip" title="${esc(VERDICTS[v].means)}">${VERDICTS[v].mark} ${esc(VERDICTS[v].name)} ${s.counts[v]}</span>`).join('')}</div>
${table('Broken, by cause', s.groups)}
${table('Notes: not the page\'s fault, or not checked', s.notes)}
<h2>What each verdict means</h2><div class="scroll"><table><tbody>${ORDER.map((v) => `<tr><td class="v ${v}">${VERDICTS[v].mark} ${esc(VERDICTS[v].name)}</td><td>${esc(VERDICTS[v].means)}</td></tr>`).join('')}</tbody></table></div>
<p class="small">${esc(LABEL)} · scripts/click-check-20261019.mjs · ${esc(report.browser)} · ${report.seconds} s · By Astra.</p>
</main></body></html>
`;
}

/** Write click-check-<date>.json, .md and .html into `out`. Returns the HTML report's path. */
export function writeReport(report, out) {
  fs.mkdirSync(out, { recursive: true });
  const base = path.join(out, `click-check-${report.date}`);
  fs.writeFileSync(`${base}.json`, JSON.stringify(report, null, 2) + '\n');
  fs.writeFileSync(`${base}.md`, renderMarkdown(report));
  fs.writeFileSync(`${base}.html`, renderHtml(report));
  return `${base}.html`;
}

// ---------- Command line ----------

export function parseArgs(argv) {
  const flags = {}, rest = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) { rest.push(a); continue; }
    const [k, v] = a.slice(2).split('=');
    if (v !== undefined) flags[k] = v;
    else if (['out', 'tabs', 'browser', 'wait'].includes(k) && argv[i + 1] !== undefined) flags[k] = argv[++i];
    else flags[k] = true;
  }
  return { flags, rest };
}

/** True when this file is the script Node was started with (real paths: Astra's folder is reached through a junction). */
export function isMain(moduleUrl, argv1 = process.argv[1]) {
  if (!argv1) return false;
  try { return fs.realpathSync(fileURLToPath(moduleUrl)) === fs.realpathSync(argv1); } catch { return false; }
}

if (isMain(import.meta.url)) {
  const { flags, rest } = parseArgs(process.argv.slice(2));
  const pages = rest.length ? rest : defaultPages();
  const missing = pages.filter((p) => !fs.existsSync(p));
  if (missing.length) { console.error(`No such page: ${missing.join(', ')}`); process.exit(2); }
  const out = path.resolve(flags.out || path.join(os.tmpdir(), 'click-check', today()));
  try {
    const report = await run(pages, { browser: flags.browser || null, tabs: Number(flags.tabs) || 5, offline: !!flags.offline, clickAll: !!flags['click-all'],
      out, wait: Number(flags.wait) || 300, quiet: !!flags.json });
    const html = writeReport(report, out);
    if (flags.json) console.log(JSON.stringify(report, null, 2));
    else console.log(`${renderText(report)}\nReport: ${html}`);
    process.exit(summarize(report).broken ? 1 : 0);
  } catch (e) {
    console.error(e instanceof CantRun ? e.message : `click-check could not run: ${e.stack || e}`);
    process.exit(2);
  }
}
