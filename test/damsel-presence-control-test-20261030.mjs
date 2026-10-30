// By Astra. OpenAI Codex, 2026-10-30. Browser actions use a fake local adapter, never Discord.
import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { readSpawnerSources, spawnerFiles } from '../scripts/pet-program-pages-20261018.mjs';

const source = readFileSync('apps/discord-damsel-presence-control-20261030.js', 'utf8');
const flush = async () => { for (let i = 0; i < 6; i++) await new Promise(resolve => setImmediate(resolve)); };
function node() {
  return { textContent: '', disabled: false, listeners: {}, attrs: {}, classes: new Set(),
    addEventListener(name, fn) { this.listeners[name] = fn; },
    setAttribute(name, value) { this.attrs[name] = value; },
    removeAttribute(name) { delete this.attrs[name]; },
    classList: { toggle() {} } };
}
function browser(protocol = 'file:', holdStart = false) {
  const note = node(), cards = {}, lights = [], posts = [], scripts = [], tabs = [];
  let failure = false, finishStart;
  const status = { openai: { installed: true, running: false, mode: null, connected: false, published: false },
    anthropic: { installed: true, running: true, mode: 'off', connected: false, published: false } };
  for (const key of ['openai', 'anthropic']) {
    const parts = { '[data-presence-status]': node(), '[data-presence-start]': node(), '[data-presence-stop]': node(), '[data-presence-controls]': node() };
    cards[key] = { querySelector: selector => parts[selector], parts };
    const light = node(); light.dataset = { item: 'program:' + key + '-discord-presence', name: key };
    light.classList.toggle = (name, on) => on ? light.classes.add(name) : light.classes.delete(name);
    lights.push(light);
  }
  const box = { closest: () => ({}), scrollIntoView() {}, querySelector(selector) {
    const key = selector.includes('openai') ? 'openai' : 'anthropic';
    if (selector.includes('card')) return cards[key];
    return cards[key].parts[selector.includes('start') ? '[data-presence-start]' : selector.includes('controls') ? '[data-presence-controls]' : '[data-presence-stop]'];
  } };
  const win = { open(url) { const tab = { url, opener: 'original', closed: false, location: { replace(next) { tab.url = next; } }, close() { this.closed = true; } }; tabs.push(tab); return tab; } };
  const document = { getElementById: id => id === 'discord-damsel-presence-control' ? box : note,
    querySelectorAll: () => lights, createElement: () => ({}), head: { appendChild: script => scripts.push(script) } };
  const context = { window: win, document, location: { protocol }, AbortSignal, Date, setTimeout: () => 1, clearTimeout() {},
    localStorage: { getItem() { throw new Error('The companion must not touch saved reports.'); }, setItem() { throw new Error('The companion must not write saved reports.'); } },
    fetch: async (url, options) => {
      if (failure) throw new Error('offline');
      const input = JSON.parse(options.body); posts.push({ url, input });
      if (url.endsWith('/api/status')) return { ok: true, json: async () => ({ ok: true, apps: structuredClone(status) }) };
      if (holdStart && url.endsWith('/api/start')) return new Promise(resolve => { finishStart = () => resolve({ ok: true, json: async () => ({ ok: true, app: input.app, status: { installed: true, running: true, mode: 'auto', connected: true, published: true } }) }); });
      status[input.app] = { installed: true, running: true, mode: url.endsWith('/start') ? 'auto' : 'off',
        connected: url.endsWith('/start'), published: url.endsWith('/start') };
      return { ok: true, json: async () => ({ ok: true, app: input.app, status: structuredClone(status[input.app]) }) };
    } };
  vm.runInNewContext(source, context);
  return { cards, lights, note, posts, scripts, tabs, status, offline() { failure = true; }, finishStart() { finishStart(); },
    connect(value = { url: 'http://127.0.0.1:38764', code: 'a'.repeat(64) }) { win.DiscordDamselPresenceData = value; scripts[0].onload(); } };
}

test('Damsel generated page has visible start/open/stop controls and verified-live power hooks', () => {
  const files = spawnerFiles(readSpawnerSources('.'));
  const html = files['apps/pet-programs/discord-tower-20261018.html'];
  for (const [key, port] of [['openai', 38761], ['anthropic', 38762]]) {
    assert.match(html, new RegExp(`data-presence-start="${key}" disabled`));
    assert.match(html, new RegExp(`data-presence-controls="${key}" aria-disabled="true"`));
    assert.match(html, new RegExp(`data-presence-stop="${key}" disabled`));
    assert.match(html, new RegExp(`class="light onoff is-off" data-item="program:${key}-discord-presence"[^>]*data-presence-managed="1"`));
  }
  assert.ok(html.indexOf('id="discord-damsel-presence-control"') < html.indexOf('discord-damsel-L1-control-panel'));
  assert.match(html, /src="\.\.\/discord-damsel-presence-control-20261030.js"/);
  for (const [path, page] of Object.entries(files)) if (!path.includes('discord-tower-')) assert.doesNotMatch(page, /src="\.\.\/discord-damsel-presence-control/);
});
test('hosted pages make no local requests and keep honest disconnected lights', () => {
  const b = browser('https:');
  assert.equal(b.scripts.length, 0); assert.equal(b.posts.length, 0);
  assert.equal(b.cards.openai.parts['[data-presence-start]'].disabled, true);
  assert.equal(b.lights[0].attrs['aria-pressed'], 'false');
  assert.match(b.note.textContent, /installed Discord Damsel/);
});
test('local controls show actual stopped/off/published states and never touch saved reports', async () => {
  const b = browser(); b.connect(); await flush();
  assert.equal(b.cards.openai.parts['[data-presence-controls]'].href, 'http://127.0.0.1:38761/');
  assert.match(b.cards.openai.parts['[data-presence-status]'].textContent, /App stopped/);
  assert.match(b.cards.anthropic.parts['[data-presence-status]'].textContent, /sharing is off/);
  b.cards.openai.parts['[data-presence-start]'].listeners.click(); await flush();
  assert.equal(b.tabs[0].url, 'http://127.0.0.1:38761/'); assert.equal(b.tabs[0].opener, null);
  assert.equal(b.lights[0].attrs['aria-pressed'], 'true');
  assert.match(b.cards.openai.parts['[data-presence-status]'].textContent, /Card published/);
  assert.equal(b.posts.find(p => p.url.endsWith('/api/start')).input.app, 'openai');
  b.cards.openai.parts['[data-presence-stop]'].listeners.click(); await flush();
  assert.equal(b.lights[0].attrs['aria-pressed'], 'false');
  assert.match(b.cards.openai.parts['[data-presence-status]'].textContent, /sharing is off/);
});
test('invalid bootstrap makes no request; connection loss clears stale publishing', async () => {
  const invalid = browser(); invalid.connect({ url: 'https://example.com', code: 'a'.repeat(64) }); await flush();
  assert.equal(invalid.posts.length, 0);
  const b = browser(); b.connect(); await flush();
  b.offline(); b.cards.openai.parts['[data-presence-start]'].listeners.click(); await flush();
  assert.equal(b.tabs[0].closed, true);
  assert.equal(b.cards.openai.parts['[data-presence-start]'].disabled, true);
  assert.equal(b.lights[0].attrs['aria-pressed'], 'false');
  assert.match(b.note.textContent, /not answering/);
});
test('a late start reply after losing the connection cannot restore publishing or navigate its tab', async () => {
  const b = browser('file:', true); b.connect(); await flush();
  b.cards.openai.parts['[data-presence-start]'].listeners.click(); await flush();
  b.connect({ url: 'https://example.com', code: 'a'.repeat(64) });
  b.finishStart(); await flush();
  assert.equal(b.tabs[0].closed, true);
  assert.equal(b.tabs[0].url, 'about:blank');
  assert.equal(b.lights[0].attrs['aria-pressed'], 'false');
  assert.equal(b.cards.openai.parts['[data-presence-start]'].disabled, true);
});
