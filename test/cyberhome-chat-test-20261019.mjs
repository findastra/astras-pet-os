// The cyberhome, the activity lights and the chat window on every spawned pet program page (Astra, 2026-10-19):
// the cyberhome is empty until the page opens, then the pet moves in through Startup Star's door; L4 is on while you
// are here; the chat button opens a window that asks who answers and hands your message to your own Claude or
// ChatGPT. Runs the page script itself against a small pretend page. Claude Opus 5.5 (claude-opus-5-5), 2026-10-19.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { readSpawnerSources, spawnerPages, spawnerFiles, pagePath, esc, DIR, ASSETS } from '../scripts/pet-program-pages-20261018.mjs';

const root = fileURLToPath(new URL('..', import.meta.url)).replace(/[\\/]$/, '');
const src = readSpawnerSources(root);
const files = spawnerFiles(src);
const pages = spawnerPages(src);
const js = readFileSync(`${root}/${DIR}/${ASSETS.js}`, 'utf8');
const WHO = ['claude', 'chatgpt', 'this-pc', 'note'];

// Cut by plain string search: this reads the spawner's own pages, it does not filter HTML.
const between = (text, open, close) => {
  const start = text.indexOf(open);
  const end = start < 0 ? -1 : text.indexOf(close, start + open.length);
  return end < 0 ? '' : text.slice(start + open.length, end);
};

test('every page starts with an empty cyberhome and Startup Star\'s door in its corner', () => {
  for (const d of pages) {
    const html = files[pagePath(d.repo)];
    const den = between(html, '<div class="den" data-arrival="waiting">', '</div>');
    assert.ok(den, `${d.repo}: the den starts waiting`);
    assert.ok(den.startsWith('<svg class="star-door"'), `${d.repo}: Startup Star's door is in the den`);
    assert.match(den, /class="(no-art )?pet/, `${d.repo}: the pet (or its no-picture box) is ready to move in`);
  }
  const css = readFileSync(`${root}/${DIR}/${ASSETS.css}`, 'utf8');
  assert.ok(css.includes('.den[data-arrival="waiting"] .pet'), 'the stylesheet keeps the pet out until it arrives');
  assert.ok(css.includes('prefers-reduced-motion: reduce'), 'no flying for people who turned motion off');
});

test('every page has a chat window that asks who answers', () => {
  for (const d of pages) {
    const html = files[pagePath(d.repo)];
    assert.ok(html.includes(`aria-label="Open ${esc(d.pet)}'s chat"`), `${d.repo}: the chat button`);
    const box = between(html, '<div class="chat-panel" id="chat-panel"', '</aside>');
    for (const k of WHO) assert.ok(box.includes(`data-who="${k}"`), `${d.repo}: ${k}`);
    for (const id of ['chat-text', 'chat-send', 'chat-status', 'chat-log', 'chat-who-says']) assert.ok(box.includes(`id="${id}"`), `${d.repo}: ${id}`);
    assert.equal(box.includes('leaves this PC'), d.isPrivate, `${d.repo}: private pets warn that a message to Claude or ChatGPT leaves the PC`);
  }
});

// ---- A small pretend page for the page script. ----
class El {
  constructor(tag = 'div') {
    this.tagName = tag.toUpperCase(); this.attrs = {}; this.dataset = {}; this.children = []; this.listeners = {};
    this.cls = new Set(); this.hidden = false; this.textContent = ''; this.value = ''; this.title = ''; this.files = []; this.q = {}; this.qa = {};
  }
  get className() { return [...this.cls].join(' '); }
  set className(v) { this.cls = new Set(String(v).split(' ').filter(Boolean)); }
  get classList() {
    const c = this.cls;
    return { contains: (x) => c.has(x), add: (x) => c.add(x), remove: (x) => c.delete(x), toggle: (x, on) => { const want = on === undefined ? !c.has(x) : !!on; if (want) c.add(x); else c.delete(x); return want; } };
  }
  setAttribute(k, v) { this.attrs[k] = String(v); }
  getAttribute(k) { return k in this.attrs ? this.attrs[k] : null; }
  addEventListener(type, f) { (this.listeners[type] ||= []).push(f); }
  fire(type, extra = {}) { for (const f of this.listeners[type] || []) f.call(this, { target: this, preventDefault() {}, stopPropagation() {}, ...extra }); }
  click() { this.fire('click'); }
  appendChild(c) { this.children.push(c); return c; }
  querySelector(sel) { return this.q[sel] || null; }
  querySelectorAll(sel) { return this.qa[sel] || []; }
  focus() { this.focused = true; }
  remove() {}
  set innerHTML(_) { throw new Error('Page text must never be rendered as HTML.'); }
}

function boot(d, { saved = {}, reduce = false } = {}) {
  const html = files[pagePath(d.repo)];
  const config = between(html, '<script type="application/json" id="pet-program-data">', '</script>');
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
  const ids = new Map([['pet-program-data', Object.assign(new El('script'), { textContent: config })]]);
  const byId = (id) => ids.get(id) || ids.set(id, new El()).get(id);
  const den = new El(); den.dataset.arrival = 'waiting';
  const levels = ['L1', 'L2', 'L3', 'L4'].map((l) => {
    const p = new El('details'); p.q['.legend'] = Object.assign(new El('span'), { textContent: `${d.petSlug}-${l}-panel` }); p.q['.activity'] = new El('span'); return p;
  });
  const who = WHO.map((k) => { const b = new El('button'); b.dataset.who = k; return b; });
  byId('chat-panel').hidden = true;
  byId('chat-panel').qa['button[data-who]'] = who;
  const document = {
    hidden: false, listeners: {},
    getElementById: byId,
    createElement: (tag) => new El(tag),
    createTextNode: (t) => t,
    querySelector: (sel) => (sel === '.den' ? den : null),
    querySelectorAll: (sel) => (sel === 'details.panel.level' ? levels : []),
    addEventListener(type, f) { (this.listeners[type] ||= []).push(f); },
    fire(type) { for (const f of this.listeners[type] || []) f({ target: new El() }); },
    body: new El('body'),
  };
  const store = new Map(Object.entries(saved).map(([k, v]) => [`astras-pet-os:${d.homeSlug}:${k}`, JSON.stringify(v)]));
  const opened = [], copied = [];
  const sandbox = {
    document, localStorage: { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) },
    navigator: { clipboard: { writeText: (t) => { copied.push(t); return Promise.resolve(); } } },
    setTimeout: later, clearTimeout: (n) => { if (timers[n - 1]) timers[n - 1].done = true; }, setInterval: () => 0, clearInterval: () => {},
    matchMedia: () => ({ matches: reduce }), confirm: () => true, alert: () => {},
    open: (url) => { opened.push(url); return {}; }, URL, Blob,
    location: { origin: 'https://findastra.github.io' }, // a tool panel's frame says its height
    // Window listeners are kept, so a test can fire blur, focus or a frame's message.
    windowListeners: {}, addEventListener(type, f) { (this.windowListeners[type] ||= []).push(f); },
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(js, sandbox);
  const read = (k) => JSON.parse(store.get(`astras-pet-os:${d.homeSlug}:${k}`) || 'null');
  const fireWindow = (type) => { for (const f of sandbox.windowListeners[type] || []) f({}); };
  return { den, levels, who, byId, document, advance, opened, copied, read, fireWindow, bubble: byId('bubble') };
}

const panther = pages.find((d) => d.repo === 'learn-python');

test('the pet moves in through the star: waiting, the star opens, the pet comes in, home', () => {
  const p = boot(panther);
  assert.equal(p.den.dataset.arrival, 'waiting');
  p.advance(300); assert.equal(p.den.dataset.arrival, 'opening');
  p.advance(600); assert.equal(p.den.dataset.arrival, 'arriving');
  p.advance(1100); assert.equal(p.den.dataset.arrival, 'home');
  assert.equal(p.bubble.textContent, 'Python Panther came in through the star.');
  p.advance(5000);
  assert.equal(p.bubble.textContent, panther.lines.idle, 'then the bubble says its mood again');
});

test('with motion turned off, the pet is home at once', () => {
  const p = boot(panther, { reduce: true });
  p.advance(0);
  assert.equal(p.den.dataset.arrival, 'home');
});

test('L4 is on while you are here, dims after two quiet minutes, is off while the page is hidden; L1 to L3 say not connected', () => {
  const p = boot(panther);
  const [l1, l2, l3, l4] = p.levels.map((x) => x.q['.activity']);
  for (const l of [l1, l2, l3]) { assert.equal(l.dataset.state, 'unknown'); assert.equal(l.attrs['aria-label'], 'activity: not connected yet'); assert.match(l.title, /Startup Star's link/); }
  assert.match(l3.title, /an agent is working in Python Jungle/);
  assert.equal(l4.dataset.state, 'live');
  assert.equal(p.levels[3].dataset.activity, 'live', 'the L4 panel glows');
  assert.equal(l4.attrs['aria-label'], 'activity: you are here');
  p.advance(120000); assert.equal(l4.dataset.state, 'idle');
  p.document.fire('pointerdown'); assert.equal(l4.dataset.state, 'live');
  p.document.hidden = true; p.document.fire('visibilitychange'); assert.equal(l4.dataset.state, 'off');
  p.advance(200000); assert.equal(l4.dataset.state, 'off', 'a hidden page stays off');
  p.document.hidden = false; p.document.fire('visibilitychange'); assert.equal(l4.dataset.state, 'live');
});

test('reading counts as being here: moving the pointer or scrolling keeps L4 on; another window in front dims it', () => {
  const p = boot(panther);
  const l4 = p.levels[3].q['.activity'];
  p.advance(120000); assert.equal(l4.dataset.state, 'idle', 'two quiet minutes');
  p.document.fire('pointermove'); assert.equal(l4.dataset.state, 'live', 'the pointer moved over the page');
  p.advance(120000); p.document.fire('scroll'); assert.equal(l4.dataset.state, 'live', 'scrolling');
  p.fireWindow('blur'); assert.equal(l4.dataset.state, 'idle', 'working in another window');
  assert.equal(p.levels[3].dataset.activity, 'idle', 'the panel stops glowing');
  p.fireWindow('focus'); assert.equal(l4.dataset.state, 'live', 'back on this page');
});

test('the chat button opens the window at once, ready to type', () => {
  const p = boot(panther);
  const panel = p.byId('chat-panel');
  p.byId('chat-open').click();
  assert.equal(panel.hidden, false);
  assert.equal(p.byId('chat-open').attrs['aria-expanded'], 'true');
  assert.ok(p.byId('chat-text').focused);
  panel.fire('keydown', { key: 'Escape' });
  assert.equal(panel.hidden, true, 'Escape closes it');
});

test('My Claude opens claude.ai with the message typed in, and copies it; the choice is remembered', () => {
  const p = boot(panther);
  p.who[0].click();
  assert.equal(p.who[0].attrs['aria-pressed'], 'true');
  assert.equal(p.read('chat-with'), 'claude');
  p.byId('chat-text').value = 'Why is my lesson check failing?';
  p.byId('chat-send').click();
  assert.equal(p.opened.length, 1);
  assert.ok(p.opened[0].startsWith('https://claude.ai/new?q='));
  const typed = decodeURIComponent(p.opened[0].slice('https://claude.ai/new?q='.length));
  assert.equal(typed, 'This is about Python Jungle, Python Panther\'s pet program in Astra\'s PetOS (https://github.com/findastra/learn-python).\n\nWhy is my lesson check failing?');
  assert.deepEqual(p.copied, [typed]);
  assert.match(p.byId('chat-status').textContent, /^Opened your Claude in a new tab/);
  assert.equal(p.byId('chat-text').value, '');
  assert.equal(p.read('chat').at(-1).to, 'your Claude');
  // Opened again later: the window remembers who answers.
  const again = boot(panther, { saved: { 'chat-with': 'chatgpt' } });
  assert.equal(again.who[1].attrs['aria-pressed'], 'true');
  again.byId('chat-text').value = 'hi';
  again.byId('chat-send').click();
  assert.ok(again.opened[0].startsWith('https://chatgpt.com/?q='));
});

test('Send asks for a message and a choice first, and a switched-off chat sends nothing', () => {
  const p = boot(panther);
  p.byId('chat-send').click();
  assert.equal(p.byId('chat-status').textContent, 'Type a message first.');
  p.byId('chat-text').value = 'hello';
  p.byId('chat-send').click();
  assert.equal(p.byId('chat-status').textContent, 'Choose who should answer first.');
  const off = boot(panther, { saved: { 'chat-with': 'claude', lights: { [`chat:${panther.petSlug}`]: { off: true } } } });
  off.byId('chat-text').value = 'hello';
  off.byId('chat-send').click();
  assert.match(off.byId('chat-status').textContent, /switched off/);
  assert.equal(off.opened.length, 0);
  const off2 = boot(panther, { saved: { 'chat-with': 'claude', lights: { [`chat:${panther.petSlug}`]: { power: 'off' } } } });
  off2.byId('chat-text').value = 'hello';
  off2.byId('chat-send').click();
  assert.equal(off2.opened.length, 0, 'the newer light format switches it off too');
});

test('A note, or Claude Code or Codex on this PC until the link is built, goes to the backlog', () => {
  for (const k of ['note', 'this-pc']) {
    const p = boot(panther, { saved: { 'chat-with': k } });
    p.byId('chat-text').value = 'Add a lesson on loops';
    p.byId('chat-send').click();
    assert.equal(p.opened.length, 0, `${k}: nothing opens`);
    const entry = p.read('backlog').entries.at(-1);
    assert.equal(entry.text, 'Add a lesson on loops');
    assert.equal(entry.tool, `${panther.petSlug}-chat`);
    assert.match(entry.id, /^python-jungle-v1\.0-backlog-\d{8}-001$/);
  }
});

test('a pet with a private repo never names it in the message', () => {
  const d = pages.find((x) => !x.publicRepo);
  const p = boot(d, { saved: { 'chat-with': 'claude' } });
  p.byId('chat-text').value = 'hi';
  p.byId('chat-send').click();
  const typed = decodeURIComponent(p.opened[0].slice('https://claude.ai/new?q='.length));
  assert.equal(typed, `This is about ${d.home}, ${d.pet}'s pet program in Astra's PetOS.\n\nhi`, `${d.repo}: no repo link in the message`);
});
