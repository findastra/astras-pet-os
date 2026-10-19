// The Friendly Farmer's pet program spawner (Astra, 2026-10-18): every registered and pipeline pet has a pet program
// page with at least every module of her sketch, built only from the hub's sources. Claude Opus 5.5, 2026-10-18.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { readSpawnerSources, spawnerPages, spawnerFiles, buildPetProgramPage, pagePath, MODULES, DIR, INDEX, ASSETS } from '../scripts/pet-program-pages-20261018.mjs';
import { findSensitive } from '../scripts/public-safety-20261014.mjs';

const root = fileURLToPath(new URL('..', import.meta.url)).replace(/[\\/]$/, '');
const src = readSpawnerSources(root);
const files = spawnerFiles(src);
const pages = spawnerPages(src);
const animals = src.programs.filter((p) => ['registered', 'pipeline'].includes(p.stage));

test('every registered and pipeline pet program has a page', () => {
  assert.equal(pages.length, animals.length);
  for (const p of animals) assert.ok(files[pagePath(p.repo)], `${p.icon} (#${p.number}) has no page`);
  assert.ok(files[INDEX], 'the spawner list is written');
});

test('the pages on disk are exactly what the spawner writes (run npm run build, never edit them by hand)', () => {
  for (const [path, html] of Object.entries(files)) {
    assert.ok(existsSync(`${root}/${path}`), `${path} is missing: run npm run build`);
    assert.equal(readFileSync(`${root}/${path}`, 'utf8').replace(/\r\n/g, '\n'), html, `${path} differs from the spawner: run npm run build`);
  }
  const expected = new Set([...Object.keys(files).map((p) => p.split('/').pop()), ASSETS.css, ASSETS.js]);
  for (const f of readdirSync(`${root}/${DIR}`)) assert.ok(expected.has(f), `${DIR}/${f} belongs to no pet any more`);
});

test('every page has every module of the sketch, in its order, and every module collapses', () => {
  for (const d of pages) {
    const html = files[pagePath(d.repo)];
    const labels = MODULES.map((m) => (['cyberhome', 'intelligence-levels', 'L1-module', 'L2-module', 'L3-module', 'L4-module', 'session-notes', 'emotions', 'clicker-training', 'chat'].includes(m)
      ? `${d.petSlug}-${m}` : m === 'pet-program-quick-summary' ? `${d.homeSlug}-${m}` : m));
    let at = -1;
    for (const label of labels) {
      const i = html.indexOf(`>${label}<`) > -1 ? html.indexOf(`>${label}<`) : html.indexOf(`"${label}"`);
      assert.ok(i > at, `${d.repo}: ${label} is missing or out of the sketch's order`);
      at = i;
    }
    assert.ok(html.indexOf('<h1>') > html.indexOf(`>${d.petSlug}-cyberhome<`), `${d.repo}: the title sits beside the cyberhome`);
    const modules = (html.match(/<details class="module/g) || []).length;
    assert.ok(modules >= MODULES.length - 1, `${d.repo}: every module is a <details> that collapses (${modules})`);
  }
});

test('labels sit in the top border with nothing after them, and every emotion bubble is labelled the same way', () => {
  const css = readFileSync(`${root}/${DIR}/${ASSETS.css}`, 'utf8');
  assert.doesNotMatch(css, /summary::(after|before)\s*\{[^}]*content:\s*'[^']/, 'no mark (a dash, a plus) after a module label');
  for (const d of pages) {
    const html = files[pagePath(d.repo)];
    for (const name of ['sleepy', 'awake', 'idle', 'curious', 'happy', 'worried', 'alarmed', 'sick', 'sad'])
      assert.ok(html.includes(`<fieldset class="mood-bubble"><legend>${name}</legend>`), `${d.repo}: the ${name} bubble has its name in its border`);
    const order = [...html.matchAll(/<fieldset class="mood-bubble"><legend>([a-z]+)<\/legend>/g)].map((m) => m[1]);
    assert.deepEqual(order, ['sleepy', 'awake', 'idle', 'curious', 'happy', 'worried', 'alarmed', 'sick', 'sad'], `${d.repo}: the sketch's 3 by 3 order`);
  }
});

test('the title is the pet program name from pet-programs.json', () => {
  for (const d of pages) {
    const prog = animals.find((p) => p.repo === d.repo);
    assert.equal(d.home, prog.assigned ? prog.program : `pet-program-${prog.number}`);
    assert.match(files[pagePath(d.repo)], /<h1>[^<]+<span class="version"/);
  }
});

test('the paired lights are two buttons side by side, each with a name a screen reader reads', () => {
  for (const d of pages) {
    const html = files[pagePath(d.repo)];
    const pairs = html.match(/<span class="lights"[^>]*><button[^>]*><\/button><button[^>]*><\/button><\/span>/g) || [];
    assert.ok(pairs.length >= 2, `${d.repo}: the cyberhome and the chat have their lights`);
    for (const p of pairs) for (const b of p.match(/<button[^>]*>/g)) assert.match(b, /aria-label="[^"]+: (on|working correctly|not built yet)"/);
  }
});

test('every local picture, stylesheet and script a page uses is in the hub', () => {
  for (const [path, html] of Object.entries(files)) {
    for (const [, url] of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
      if (/^(https?:|mailto:)/.test(url)) continue;
      const target = new URL(url, `file:///x/${path}`).pathname.slice(3);
      assert.ok(existsSync(`${root}/${decodeURIComponent(target)}`), `${path}: ${url} is not in the hub`);
    }
  }
});

test('pictures come only from the hub art folders (one art source, A58)', () => {
  for (const d of pages) for (const p of Object.values(d.art.frames)) assert.match(p, /^(art|desktop-art)\//, `${d.repo}: ${p}`);
});

test('text written by pets is data: it is escaped, never markup', () => {
  const d = { ...pages.find((x) => x.repo === 'unity-unicorn') };
  d.summary = '<img src=x onerror=alert(1)>';
  d.connections = [{ id: 'x', name: '"><script>alert(1)</script>', program: null, sends: [{ carries: 'status', state: 'now', why: '<b>hi</b>' }], receives: [] }];
  d.needs = ['<svg onload=alert(1)>'];
  const html = buildPetProgramPage(d);
  assert.ok(!html.includes('<img src=x'), 'summary escaped');
  assert.ok(!html.includes('<script>alert'), 'connection name escaped');
  assert.ok(!html.includes('<svg onload'), 'need escaped');
  assert.ok(!html.includes('<b>hi</b>'), 'why escaped');
  assert.ok(html.includes('&lt;img src=x onerror=alert(1)&gt;'));
});

test('the page script puts text in with textContent only, and saves nothing outside this browser', () => {
  const js = readFileSync(`${root}/${DIR}/${ASSETS.js}`, 'utf8');
  assert.doesNotMatch(js, /innerHTML|outerHTML|insertAdjacentHTML|document\.write/);
  assert.doesNotMatch(js, /fetch\(|XMLHttpRequest|sendBeacon|WebSocket/);
  for (const html of Object.values(files)) assert.doesNotMatch(html, /<script(?! type="application\/json"| src=")/, 'no inline code in a page');
});

test('no page publishes a secret, a local address or a personal path', () => {
  for (const [path, html] of Object.entries(files)) assert.deepEqual(findSensitive(html), [], path);
});

test('private pets say their data never leaves the PC, and private repos are not linked', () => {
  for (const d of pages) {
    const html = files[pagePath(d.repo)];
    if (d.isPrivate) assert.match(html, /its data never leaves the PC/, d.repo);
    if (!d.publicRepo) assert.ok(!html.includes(`href="https://github.com/findastra/${d.repo}"`), `${d.repo} is private: no repo link`);
  }
});
