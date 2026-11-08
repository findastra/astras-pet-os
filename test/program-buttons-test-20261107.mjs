// The 3rd party program buttons on every pet program page (Astra, 2026-11-07: "I should be able to press the red
// button, then it launches that program and the button turns green if its on and detected. Fix all of the buttons in
// 3rd party programs", then "all recommended"). A window opens on a red press and closes on a green one after she says
// yes; a tool or a driver says whether it is installed; a website opens in a new tab; with no link to Inference
// Iguana's program-watch nothing is sent. Runs the page script itself against a small pretend page, built from the
// spawner's own pages. Node's built-in modules only. Claude Opus 5.5, 2026-11-07.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { readSpawnerSources, spawnerFiles, spawnerPages, pagePath, DIR, ASSETS, PROGRAM_WATCH, WATCH_KINDS } from '../scripts/pet-program-pages-20261018.mjs';

const root = fileURLToPath(new URL('..', import.meta.url)).replace(/[\\/]$/, '');
const src = readSpawnerSources(root);
const files = spawnerFiles(src);
const pages = spawnerPages(src);
const js = readFileSync(`${root}/${DIR}/${ASSETS.js}`, 'utf8');
const map = JSON.parse(readFileSync(`${root}/system-map.json`, 'utf8'));

const between = (text, open, close) => {
  const start = text.indexOf(open);
  const end = start < 0 ? -1 : text.indexOf(close, start + open.length);
  return end < 0 ? '' : text.slice(start + open.length, end);
};
// One light's own attributes, as the spawner wrote them on that page (plain string search over generated HTML).
function lightOf(repo, id) {
  const html = files[pagePath(repo)];
  const at = html.indexOf(`class="light onoff`, html.indexOf(`data-item="third-party:${id}"`) - 200);
  const tag = html.slice(at, html.indexOf('>', at));
  assert.ok(tag.includes(`data-item="third-party:${id}"`), `${repo} has ${id}'s light`);
  const attrs = {};
  for (const m of tag.matchAll(/([a-z-]+)="([^"]*)"/g)) attrs[m[1]] = m[2].replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');
  return attrs;
}

// ---- A small pretend page. ----
class El {
  constructor(tag = 'div') {
    this.tagName = tag.toUpperCase(); this.attrs = {}; this.dataset = {}; this.children = []; this.listeners = {}; this.cls = new Set();
    this.hidden = false; this.textContent = ''; this.style = {}; this.up = {}; this.q = {};
  }
  get className() { return [...this.cls].join(' '); }
  set className(v) { this.cls = new Set(String(v).split(' ').filter(Boolean)); }
  get classList() {
    const c = this.cls;
    return { contains: (x) => c.has(x), add: (x) => c.add(x), remove: (x) => c.delete(x), toggle: (x, on) => { const want = on === undefined ? !c.has(x) : !!on; if (want) c.add(x); else c.delete(x); return want; } };
  }
  setAttribute(k, v) { this.attrs[k] = String(v); }
  getAttribute(k) { return k in this.attrs ? this.attrs[k] : null; }
  removeAttribute(k) { delete this.attrs[k]; }
  addEventListener(type, f) { (this.listeners[type] ||= []).push(f); }
  appendChild(c) { this.children.push(c); return c; }
  querySelector(sel) { return this.q[sel] || null; }
  querySelectorAll() { return []; }
  closest(sel) { return this.up[sel] || null; }
  getBoundingClientRect() { return { left: 10, bottom: 20 }; }
  get offsetWidth() { return 100; }
  remove() {}
  set innerHTML(_) { throw new Error('Page text must never be rendered as HTML.'); }
}

function light(attrs, desc) {
  const b = new El('button');
  b.cls = new Set(attrs.class.split(' '));
  for (const [k, v] of Object.entries(attrs)) if (k.startsWith('data-')) b.dataset[k.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = v;
  const pill = new El('li');
  pill.q['.item-desc'] = Object.assign(new El('span'), { textContent: desc || '' });
  b.up = { 'button.light[data-item]': b, 'li.pill': pill, 'button, a, input, select, textarea, label, summary': b };
  return b;
}

// `programs`: what program-watch's file says; `link`: its listener, or none. `here`: opened from this PC.
function boot(repo, ids, { programs = [], link = null, here = true, answer = () => ({ status: 200, body: { ok: true, said: 'Done.' } }), yes = true } = {}) {
  const html = files[pagePath(repo)];
  const config = between(html, '<script type="application/json" id="pet-program-data">', '</script>');
  const BASE = Date.parse('2026-11-07T18:00:00Z');
  let now = 0;
  const timers = [];
  const later = (fn, ms) => { timers.push({ fn, at: now + (ms || 0) }); return timers.length; };
  const advance = (ms) => {
    const until = now + ms;
    for (;;) {
      const due = timers.filter((t) => !t.done && t.at <= until).sort((a, b) => a.at - b.at)[0];
      if (!due) break;
      due.done = true; now = due.at; due.fn();
    }
    now = until;
  };
  const buttons = Object.fromEntries(ids.map((id) => [id, light(lightOf(repo, id), `About ${id}.`)]));
  const ids2 = new Map([['pet-program-data', Object.assign(new El('script'), { textContent: config })]]);
  const byId = (id) => ids2.get(id) || ids2.set(id, new El()).get(id);
  const loads = [], sent = [], opened = [], asked = [];
  const document = {
    hidden: false, listeners: {}, body: new El('body'), documentElement: { clientWidth: 1200 },
    getElementById: byId,
    createElement: (tag) => new El(tag),
    createTextNode: (t) => t,
    querySelector: (sel) => (sel === 'button.light[data-unseen]' ? Object.values(buttons)[0] : null),
    querySelectorAll: (sel) => (sel === 'button.light[data-item]' ? Object.values(buttons) : []),
    addEventListener(type, f) { (this.listeners[type] ||= []).push(f); },
    head: {
      appendChild(s) {
        loads.push(s.getAttribute('src'));
        sandbox.benchmarkRockPrograms = { schema: 'benchmark-rock-programs-v1', time: new Date(BASE + now - (state.age || 0)).toISOString(), programs: state.programs, devices: [], ...(state.link ? { link: state.link } : {}) };
        s.onload();
      },
    },
  };
  const state = { programs, link };
  const sandbox = {
    document, localStorage: { getItem: () => null, setItem: () => {} },
    setTimeout: later, clearTimeout: (n) => { if (timers[n - 1]) timers[n - 1].done = true; }, setInterval: () => 0, clearInterval: () => {},
    matchMedia: () => ({ matches: false }), alert: () => {},
    confirm: (q) => { asked.push(q); return state.yes; },
    open: (url, target, features) => { opened.push({ url, target, features }); return null; },
    fetch: (url, opts) => {
      sent.push({ url, opts, body: JSON.parse(opts.body) });
      const a = answer(url, JSON.parse(opts.body));
      return Promise.resolve({ status: a.status, json: () => Promise.resolve(a.body) });
    },
    location: here === true ? { protocol: 'file:', hostname: '', origin: 'null' } : here ? here : { protocol: 'https:', hostname: 'findastra.github.io', origin: 'https://findastra.github.io' },
    scrollX: 0, scrollY: 0, addEventListener() {}, URL, Blob,
  };
  state.yes = yes;
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext('Date.now = function () { return __now(); };', Object.assign(sandbox, { __now: () => BASE + now }));
  vm.runInContext(js, sandbox);
  const click = (id) => { for (const f of document.listeners.click || []) f({ target: buttons[id], preventDefault() {} }); };
  const settle = async () => { for (let i = 0; i < 10; i++) await new Promise((r) => setImmediate(r)); };
  const bubble = () => document.body.children.find((c) => c.cls.has('light-bubble')).textContent;
  return { buttons, click, settle, bubble, advance, loads, sent, opened, asked, state, green: (id) => !buttons[id].cls.has('is-off') };
}

const CODE = 'a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4';
// A made-up port, so no real local service address is written in this public file.
const PORT = 40000 + Math.floor(Math.random() * 1000);
const LINK = { url: `http://127.0.0.1:${PORT}/`, code: CODE };
const pcMaster = 'pc-master-race';

test('the build marks what program-watch knows: every link from it is a window, a tool or a driver on the pages', () => {
  const nodes = new Map(map.nodes.map((n) => [n.id, n]));
  const watched = map.links.filter((l) => l.from === PROGRAM_WATCH && l.carries === 'manages').map((l) => l.to);
  assert.equal(new Set(watched).size, watched.length, 'each program once');
  for (const id of watched) {
    const n = nodes.get(id);
    assert.equal(n?.type, 'program', `${id} is a 3rd party program on the map`);
    assert.ok(n.watch === undefined || WATCH_KINDS.includes(n.watch), `${id}: watch is window, tool or driver`);
  }
  for (const n of map.nodes) if (n.watch !== undefined) assert.ok(watched.includes(n.id), `${n.id} has a watch kind, so program-watch links to it`);
  const seen = new Set();
  for (const d of pages) {
    const html = files[pagePath(d.repo)];
    for (const m of html.matchAll(/<button type="button" class="light onoff[^>]*data-item="third-party:([^"]+)"[^>]*>/g)) {
      seen.add(m[1]);
      const kind = (m[0].match(/data-watch="([a-z]+)"/) || [])[1];
      if (watched.includes(m[1])) assert.equal(kind, nodes.get(m[1]).watch || 'window', `${d.repo}: ${m[1]}`);
      else assert.equal(kind, undefined, `${d.repo}: ${m[1]} is not program-watch's`);
      const site = (m[0].match(/data-site="([^"]+)"/) || [])[1];
      assert.equal(site, nodes.get(m[1])?.site, `${d.repo}: ${m[1]}'s website comes only from the map`);
      if (site) assert.match(site, /^https:\/\//);
    }
  }
  for (const id of ['vrchat', 'discord', 'obs-studio', 'winget', 'nodejs', 'ableton-usb-audio-driver']) assert.ok(seen.has(id) && watched.includes(id), id);
  assert.equal(nodes.get('github').site, 'https://github.com/');
});

// Placeholders and programs not installed yet keep "not built yet" (Astra, 2026-11-07, "all recommended"), and
// Benchmark Rock's table leaves them out, so the two repos list the same programs (review fix, 2026-11-07).
test('only built programs are program-watch\'s: the map, Benchmark Rock\'s needs and the pages list the same ones', () => {
  const nodes = new Map(map.nodes.map((n) => [n.id, n]));
  const watched = new Set(map.links.filter((l) => l.from === PROGRAM_WATCH && l.carries === 'manages').map((l) => l.to));
  for (const id of watched) assert.equal(nodes.get(id).state || 'now', 'now', `${id} is installed, so program-watch may open it`);
  const registry = JSON.parse(readFileSync(`${root}/pets.json`, 'utf8'));
  const rock = [...registry.pets, ...(registry.pipeline || [])].find((p) => p.repo === 'benchmark-rock');
  const needs = new Set([...JSON.stringify(rock.needs).matchAll(/"node":"([^"]+)"/g)].map((m) => m[1]).filter((id) => nodes.get(id)?.type === 'program'));
  assert.deepEqual([...needs].sort(), [...watched].sort(), 'Benchmark Rock needs exactly the programs program-watch links to');
  const marked = new Set();
  for (const d of pages) {
    for (const m of files[pagePath(d.repo)].matchAll(/<button type="button" class="light onoff[^>]*data-item="third-party:([^"]+)"[^>]*>/g)) {
      // data-planned is the pet's own use (its link), not whether the program is installed, so the node decides.
      if (/data-watch="/.test(m[0])) { marked.add(m[1]); assert.equal(nodes.get(m[1])?.state || 'now', 'now', `${d.repo}: ${m[1]} is not installed yet, so it has no data-watch`); }
    }
  }
  for (const id of marked) assert.ok(watched.has(id), `${id} is marked watched only because program-watch links to it`);
  for (const id of ['latencymon', 'object-track-vr', 'stream-deck']) assert.ok(!watched.has(id), `${id} is not installed yet`);
});

test('a program not installed yet sends nothing and says not built yet, even with a link', async () => {
  const p = boot(pcMaster, ['latencymon'], { link: LINK, programs: [] });
  assert.equal(p.buttons.latencymon.dataset.watch, undefined);
  p.click('latencymon');
  await p.settle();
  assert.equal(p.sent.length, 0);
  assert.match(p.bubble(), /not built yet/);
});

test('a page served from [::1] reads the list but never sends: program-watch lets in only file pages, 127.0.0.1 and localhost', async () => {
  const p = boot(pcMaster, ['everything-search'], { link: LINK, here: { protocol: 'http:', hostname: '[::1]', origin: 'http://[::1]:8080' }, programs: [{ id: 'everything-search', kind: 'window', running: false, installed: true }] });
  assert.equal(p.loads.length, 1, 'it reads the list');
  p.click('everything-search');
  await p.settle();
  assert.equal(p.sent.length, 0);
  assert.match(p.bubble(), /only on a page opened on this PC/);
  const local = boot(pcMaster, ['everything-search'], { link: LINK, here: { protocol: 'http:', hostname: '127.0.0.1', origin: 'http://127.0.0.1:8080' }, programs: [{ id: 'everything-search', kind: 'window', running: false, installed: true }] });
  local.click('everything-search');
  await local.settle();
  assert.equal(local.sent.length, 1, '127.0.0.1 still sends');
});

test('with no link, a red press sends nothing and says how to start the watch', async () => {
  const p = boot(pcMaster, ['everything-search'], { programs: [{ id: 'everything-search', kind: 'window', running: false, installed: true }] });
  assert.equal(p.loads.length, 1, 'the page read the watch file');
  assert.equal(p.green('everything-search'), false);
  p.click('everything-search');
  await p.settle();
  assert.equal(p.sent.length, 0);
  assert.match(p.bubble(), /nothing was sent.*Startup Star’s menu: Inference Iguana, Keep watch in the background/);
});

test('a red press sends open, with the code, to the link address only; the light turns green as soon as it is seen', async () => {
  const p = boot(pcMaster, ['everything-search'], { programs: [{ id: 'everything-search', kind: 'window', running: false, installed: true }], link: LINK,
    answer: () => ({ status: 200, body: { ok: true, id: 'everything-search', said: 'Opening Everything.' } }) });
  p.click('everything-search');
  assert.match(p.bubble(), /^Opening Everything…$/);
  await p.settle();
  assert.equal(p.sent.length, 1);
  const [s] = p.sent;
  assert.equal(s.url, `${LINK.url}open`);
  assert.equal(s.opts.method, 'POST');
  assert.equal(s.opts.headers['Content-Type'], 'text/plain');
  assert.deepEqual(s.body, { code: CODE, id: 'everything-search' }, 'only the code and the id: never a path or a command');
  assert.equal(p.bubble(), 'Opening Everything.', 'the answer says what happened');
  assert.equal(p.asked.length, 0, 'opening asks nothing first');
  // Every second for 30 seconds after a press, then every five again.
  const before = p.loads.length;
  p.state.programs = [{ id: 'everything-search', kind: 'window', running: true, installed: true }];
  p.advance(1000);
  assert.equal(p.loads.length, before + 1);
  assert.equal(p.green('everything-search'), true, 'green once program-watch sees it');
  p.advance(29000);
  assert.ok(p.loads.length >= before + 29);
  const fast = p.loads.length;
  p.advance(10000);
  assert.ok(p.loads.length - fast <= 3, 'back to every five seconds');
});

test('a green press asks first, and sends close only after yes', async () => {
  const programs = [{ id: 'everything-search', kind: 'window', running: true, installed: true }];
  const no = boot(pcMaster, ['everything-search'], { programs, link: LINK, yes: false });
  assert.equal(no.green('everything-search'), true);
  no.click('everything-search');
  await no.settle();
  assert.deepEqual(no.asked, ['Close Everything? It closes like its X button; if it asks to save, answer it there.']);
  assert.equal(no.sent.length, 0, 'no means nothing is sent');
  const yes = boot(pcMaster, ['everything-search'], { programs, link: LINK, answer: () => ({ status: 200, body: { ok: true, id: 'everything-search', said: 'Asked Everything to close.' } }) });
  yes.click('everything-search');
  await yes.settle();
  assert.equal(yes.asked.length, 1);
  assert.equal(yes.sent.length, 1);
  assert.equal(yes.sent[0].url, `${LINK.url}close`);
  assert.deepEqual(yes.sent[0].body, { code: CODE, id: 'everything-search' });
  assert.equal(yes.bubble(), 'Asked Everything to close.');
});

test('a refused request shows what program-watch said', async () => {
  const p = boot(pcMaster, ['everything-search'], { programs: [{ id: 'everything-search', kind: 'window', running: false }], link: LINK,
    answer: () => ({ status: 403, body: { ok: false, id: 'everything-search', said: 'That code is not this watch’s.' } }) });
  p.click('everything-search');
  await p.settle();
  assert.equal(p.bubble(), 'That code is not this watch’s.');
});

test('tool and driver lights follow installed, and a press sends nothing and says what it is', async () => {
  const p = boot(pcMaster, ['winget', 'sigcheck'], { link: LINK, programs: [{ id: 'winget', kind: 'tool', installed: true, running: false }, { id: 'sigcheck', kind: 'tool', installed: false, running: false }] });
  assert.equal(p.buttons.winget.dataset.watch, 'tool');
  assert.equal(p.green('winget'), true, 'installed: green');
  assert.equal(p.green('sigcheck'), false, 'not found: red');
  assert.match(p.buttons.winget.getAttribute('aria-label'), /installed$/);
  p.click('winget');
  await p.settle();
  assert.equal(p.sent.length, 0);
  assert.match(p.bubble(), /^winget: a command-line tool .*does not open as a window.* Installed on this PC\. About winget\.$/);
  p.click('sigcheck');
  assert.match(p.bubble(), /Not found on this PC\./);
  const dog = boot('drum-dog', ['ableton-usb-audio-driver'], { link: LINK, programs: [{ id: 'ableton-usb-audio-driver', kind: 'driver', installed: true }] });
  assert.equal(dog.buttons['ableton-usb-audio-driver'].dataset.watch, 'driver');
  assert.equal(dog.green('ableton-usb-audio-driver'), true);
  dog.click('ableton-usb-audio-driver');
  await dog.settle();
  assert.equal(dog.sent.length, 0);
  assert.match(dog.bubble(), /a driver: it does not open as a window/);
});

test('the file may make a window a tool, never a tool a window', async () => {
  const p = boot(pcMaster, ['winget'], { link: LINK, programs: [{ id: 'winget', kind: 'window', installed: true, running: false }] });
  p.click('winget');
  await p.settle();
  assert.equal(p.sent.length, 0, 'the page\'s own mark decides');
});

test('a link that is not this PC, or a code that does not look like one, is ignored: nothing is sent', async () => {
  const bad = [{ url: 'http://192.168.1.5:8080/', code: CODE }, { url: 'http://localhost:8080/', code: CODE }, { url: 'https://127.0.0.1:8080/', code: CODE },
    { url: 'http://127.0.0.1.evil.example:80/', code: CODE }, { url: `http://127.0.0.1:${PORT}/x`, code: CODE }, { url: 'http://127.0.0.1:99999/', code: CODE },
    { url: LINK.url, code: 'short' }, { url: LINK.url, code: 'not hex not hex not hex not hex!!' }, { url: LINK.url }];
  for (const link of bad) {
    const p = boot(pcMaster, ['everything-search'], { link, programs: [{ id: 'everything-search', kind: 'window', running: false }] });
    p.click('everything-search');
    await p.settle();
    assert.equal(p.sent.length, 0, JSON.stringify(link));
    assert.match(p.bubble(), /nothing was sent/);
  }
});

test('a stale list means no link; a page not opened on this PC reads nothing and sends nothing', async () => {
  const p = boot(pcMaster, ['everything-search'], { link: LINK, programs: [{ id: 'everything-search', kind: 'window', running: true }] });
  assert.equal(p.green('everything-search'), true);
  // The watch stopped: its file stays as it was, more than a minute old.
  p.state.age = 61000;
  p.advance(5000);
  assert.equal(p.green('everything-search'), false, 'nothing counts as open');
  p.click('everything-search');
  await p.settle();
  assert.equal(p.sent.length, 0, 'nobody to ask');
  assert.match(p.bubble(), /nothing was sent/);
  const away = boot(pcMaster, ['everything-search'], { link: LINK, here: false, programs: [{ id: 'everything-search', kind: 'window', running: false }] });
  assert.equal(away.loads.length, 0, 'not on this PC: the file is never read');
  away.click('everything-search');
  await away.settle();
  assert.equal(away.sent.length, 0);
  assert.match(away.bubble(), /only on a page opened on this PC/);
});

test('a website opens its own address from the page in a new tab, never one from the file', async () => {
  const p = boot('astras-pet-os', ['github'], { link: LINK, programs: [{ id: 'github', kind: 'window', running: false, url: 'https://evil.example/' }] });
  assert.equal(p.buttons.github.dataset.site, 'https://github.com/');
  p.click('github');
  await p.settle();
  assert.deepEqual(p.opened, [{ url: 'https://github.com/', target: '_blank', features: 'noopener,noreferrer' }]);
  assert.equal(p.sent.length, 0);
  assert.match(p.bubble(), /opened in a new tab/);
});

test('programs program-watch does not look after only show, and placeholders are not built yet', async () => {
  const p = boot('linux-iceberg', ['macattack'], { link: LINK });
  p.click('macattack');
  await p.settle();
  assert.equal(p.sent.length, 0);
  assert.match(p.bubble(), /not built yet|does not look after it/);
});

test('the page script has one way out, to the listener address it read, and puts text in with textContent only', () => {
  assert.equal((js.match(/fetch\(/g) || []).length, 1, 'one request');
  assert.match(js, /fetch\(to\.url \+ path, \{ method: 'POST', headers: \{ 'Content-Type': 'text\/plain' \}, body: JSON\.stringify\(\{ code: to\.code, id: id \}\)/);
  assert.ok(js.includes("var LINK_URL = /^http:\\/\\/127\\.0\\.0\\.1:(\\d{1,5})\\/$/"), 'only 127.0.0.1');
  assert.doesNotMatch(js, /innerHTML|outerHTML|insertAdjacentHTML|document\.write|eval\(|new Function|XMLHttpRequest|sendBeacon|WebSocket/);
});
