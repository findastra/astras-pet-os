// The Friendly Farmer's pet program spawner (Astra, 2026-10-18): every registered and pipeline pet has a pet program
// page with at least every panel of her sketch, built only from the hub's sources. Claude Opus 5.5, 2026-10-18.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { readSpawnerSources, spawnerPages, spawnerFiles, buildPetProgramPage, pagePath, esc, PANELS, DIR, INDEX, ASSETS } from '../scripts/pet-program-pages-20261018.mjs';
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

test('every page has every panel of the sketch, in its order, and every panel collapses', () => {
  for (const d of pages) {
    const html = files[pagePath(d.repo)];
    const labels = PANELS.map((m) => (['cyberhome', 'system-map', 'intelligence-levels', 'L1-tool-panel', 'L2-tool-panel', 'L3-tool-panel', 'L4-tool-panel', 'rwx-panel', 'session-notes', 'emotions', 'clicker-training', 'related-pets', 'chat'].includes(m)
      ? `${d.petSlug}-${m}` : m === 'pet-program-quick-summary' ? `${d.homeSlug}-${m}` : m));
    let at = -1;
    for (const label of labels) {
      const i = html.indexOf(`>${label}<`) > -1 ? html.indexOf(`>${label}<`) : html.indexOf(`"${label}"`);
      assert.ok(i > at, `${d.repo}: ${label} is missing or out of the sketch's order`);
      at = i;
    }
    assert.ok(html.indexOf('<h1>') > html.indexOf(`>${d.petSlug}-cyberhome<`), `${d.repo}: the title sits beside the cyberhome`);
    const panels = (html.match(/<details class="panel/g) || []).length;
    assert.ok(panels >= PANELS.length - 1, `${d.repo}: every panel is a <details> that collapses (${panels})`);
    assert.doesNotMatch(html, /-module<|class="module/, `${d.repo}: panels, not modules (Astra, 2026-10-19)`);
  }
});

test('labels sit in the top border with nothing after them, and every emotion bubble is labelled the same way', () => {
  const css = readFileSync(`${root}/${DIR}/${ASSETS.css}`, 'utf8');
  assert.doesNotMatch(css, /summary::(after|before)\s*\{[^}]*content:\s*'[^']/, 'no mark (a dash, a plus) after a panel label');
  for (const d of pages) {
    const html = files[pagePath(d.repo)];
    for (const name of ['sleepy', 'awake', 'idle', 'curious', 'happy', 'worried', 'alarmed', 'sick', 'sad'])
      assert.ok(html.includes(`<fieldset class="mood-bubble"><legend>${name}</legend>`), `${d.repo}: the ${name} bubble has its name in its border`);
    const order = [...html.matchAll(/<fieldset class="mood-bubble"><legend>([a-z]+)<\/legend>/g)].map((m) => m[1]);
    assert.deepEqual(order, ['sleepy', 'awake', 'idle', 'curious', 'happy', 'worried', 'alarmed', 'sick', 'sad'], `${d.repo}: the sketch's 3 by 3 order`);
  }
});

test('clicker training: one and two clicks are the same for every pet, tools from three clicks on (Astra, 2026-10-18)', () => {
  for (const d of pages) {
    const html = files[pagePath(d.repo)];
    const box = html.slice(html.indexOf(`>${d.petSlug}-clicker-training<`), html.indexOf('>astras-pet-os-unified-footer<'));
    assert.match(box, /<dt>one click<\/dt><dd>show the current reminder in a dialog box/, `${d.repo}: one click`);
    assert.ok(box.includes(`<dt>two clicks</dt><dd>open or close ${esc(d.home)}, this page</dd>`), `${d.repo}: two clicks`);
    const three = d.clicks['3'];
    if (three) assert.ok(box.includes(`<dt>three clicks</dt><dd>${esc(three.what)}`), `${d.repo}: three clicks run ${three.tool}`);
    else assert.match(box, /<dt>three clicks<\/dt><dd>a tool you assign/, `${d.repo}: three clicks`);
    assert.doesNotMatch(box, /refresh tools/, `${d.repo}: three clicks no longer refresh the tools`);
  }
  // Astra, 2026-10-19: "yes move voicemeeter bug to 3 clicks is the fix".
  const bug = pages.find((d) => d.repo === 'voicemeeter-bug');
  assert.equal(bug.clicks['3']?.tool, 'repair', 'Voicemeeter Bug repairs on three clicks');
  assert.equal(bug.clicks['1'], undefined, 'one click is the reminder for every pet');
});

test('one click always points to the pet program page: every pet\'s link is its page; today\'s app is a button on it (Astra, 2026-10-19)', () => {
  const regs = [...src.registry.pets, ...src.registry.pipeline];
  for (const r of regs) {
    assert.equal(r.interface_url, pagePath(r.repo), `${r.repo}: interface_url`);
    assert.equal(r.interface_local_url, pagePath(r.repo), `${r.repo}: interface_local_url`);
    const html = files[pagePath(r.repo)];
    const today = r.interface_live_url || r.app_url;
    if (today) assert.match(html, /<a class="button" href="[^"]+">Open today's app<\/a>/, `${r.repo}: today's app is a button on its page`);
    assert.ok(!html.includes(`href="${r.repo}-20261018.html">Open today's app`), `${r.repo}: the button never opens the page itself`);
  }
});

test('every page links back to the System Map, top right, on its own node (Astra, 2026-10-19; Flash Audit A60)', () => {
  for (const d of pages) {
    const html = files[pagePath(d.repo)];
    const header = html.slice(html.indexOf('<header class="top">'), html.indexOf('</header>'));
    const at = (label) => header.indexOf(`>${label}<`);
    assert.ok(at(`${d.petSlug}-system-map`) > at(`${d.petSlug}-cyberhome`), `${d.repo}: the map panel is in the header, after the cyberhome`);
    assert.ok(at(`${d.petSlug}-system-map`) > header.indexOf('<h1>'), `${d.repo}: the map panel comes after the title, on the right`);
    const link = `../../system-map-20261012.html#node=${encodeURIComponent(d.mapNode)}`;
    assert.ok(header.slice(at(`${d.petSlug}-system-map`)).includes(`<a class="map-link" href="${link}">`), `${d.repo}: it opens the map on ${d.mapNode}`);
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
    for (const p of pairs) for (const b of p.match(/<button[^>]*>/g)) {
      assert.match(b, /aria-label="[^"]+: (on|working correctly|not set yet|not checked yet)"/);
      assert.doesNotMatch(b, /\sdisabled/, `${d.repo}: every light can be clicked (Astra, 2026-10-19)`);
    }
  }
});

test('every program, tool and trick is a pill: its two lights on the oval, and a name that opens in place (Astra, 2026-10-19)', () => {
  for (const d of pages) {
    const html = files[pagePath(d.repo)];
    const items = [...html.matchAll(/<ul class="items">([\s\S]*?)<\/ul>/g)].map((m) => m[1]).join('');
    for (const li of items.match(/<li[^>]*>/g) || []) assert.equal(li, '<li class="pill">', `${d.repo}: every item is a pill`);
    const pills = items.split('<li class="pill">').slice(1);
    for (const p of pills) {
      assert.match(p, /^<span class="lights">/, `${d.repo}: the lights come first, on the oval`);
      assert.match(p, /<details class="pill-more"( open)?><summary[^>]*><span class="item-name">/, `${d.repo}: the name opens the item`);
      assert.match(p, /<div class="pill-body">/, `${d.repo}: something to open`);
      // only an item with a live picture starts open, so the page shows it (Astra's Star Window, 2026-10-19)
      assert.equal(p.includes('<details class="pill-more" open>'), p.includes('class="pill-picture"'), `${d.repo}: open only to show a picture`);
    }
  }
  const puffer = files[pagePath('portfolio-puffer')];
  assert.match(puffer, /<details class="pill-more" open><summary[^>]*><span class="item-name">Astra&#39;s Star Window<\/span>[\s\S]*?<p class="pill-picture"><img src="https:\/\/findastra\.github\.io\/astras-star-window\/star-window\.svg"/, "Portfolio Puffer's page shows the photo star");
  const damsel = pages.find((d) => d.repo === 'findastra-discord-presence');
  const html = files[pagePath(damsel.repo)];
  for (const name of ['Sticker Manager', 'CLI Proxy API manager']) assert.match(html, new RegExp(`<a class="button" href="https://github\\.com/findastra/findastra-discord-presence/tree/main/discord-tower/[a-z-]+">Open ${name}</a>`), `${name} links its folder`);
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
  assert.doesNotMatch(js, /\.src\s*=/, 'no picture address goes through the script: it only shows or hides faces already in the page');
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

test('related pets sit at the bottom: every pet it talks to, linked to its own pet program page (Astra, 2026-10-19)', () => {
  const names = new Set(pages.map((d) => `${d.repo}-20261018.html`));
  for (const d of pages) {
    const html = files[pagePath(d.repo)];
    assert.ok(html.indexOf(`>${d.petSlug}-related-pets<`) < html.indexOf('>astras-pet-os-unified-footer<'), `${d.repo}: related pets come just above the footer`);
    assert.deepEqual(d.related.map((r) => r.id).sort(), d.connections.map((c) => c.id).sort(), `${d.repo}: the same pets as its connection boxes`);
    for (const r of d.related) {
      assert.ok(names.has(r.page), `${d.repo}: ${r.pet} links to a page that exists (${r.page})`);
      assert.ok(html.includes(`href="${r.page}"`), `${d.repo}: ${r.pet} is a link`);
    }
  }
  const damsel = pages.find((d) => d.repo === 'findastra-discord-presence');
  for (const id of ['role-fairy', 'mommys-mommies', 'claude-bot']) assert.ok(damsel.related.some((r) => r.id === id), `Discord Damsel is related to ${id}`);
  assert.equal(damsel.related.find((r) => r.id === 'role-fairy').home, 'Fairy Ring');
});

test('third-party programs include those a tool of the pet runs or looks after (Flash Audit A54)', () => {
  const damsel = pages.find((d) => d.repo === 'findastra-discord-presence');
  assert.deepEqual(damsel.thirdParty.map((p) => p.name).sort(), ['BetterDiscord', 'CLI Proxy API', 'Discord']);
});

test('the R W X panel: each level says what it should be, then whether that is in code, with proof (Astra, 2026-10-19)', () => {
  for (const d of pages) {
    const html = files[pagePath(d.repo)];
    const L4 = html.indexOf(`>${d.petSlug}-L4-tool-panel<`), start = html.indexOf(`>${d.petSlug}-rwx-panel<`), end = html.indexOf(`>${d.petSlug}-session-notes<`);
    assert.ok(L4 > -1 && start > L4 && end > start, `${d.repo}: its own panel, after the four level panels`);
    assert.doesNotMatch(html.slice(L4, start), /<table>/, `${d.repo}: the grant tables moved out of the L4 tool panel`);
    const box = html.slice(start, end);
    for (const lv of ['L1', 'L2', 'L3', 'L4']) assert.ok(box.includes(`<span class="lv">${lv}</span><span class="should">Should be</span><span class="rwx">`), `${d.repo}: ${lv} says what it should be`);
    for (const m of ['✓ In code', '⚠︎ Rule only', '○ Not built']) assert.ok(box.includes(m), `${d.repo}: the key shows ${m}`);
    for (const g of [...d.access.on, ...d.access.by]) {
      assert.ok(box.includes(`<span class="mark ${g.status}"`), `${d.repo}: ${g.id} shows whether it is in code`);
      if (g.status === 'enforced') assert.ok(box.includes('<b>Proof:</b>'), `${d.repo}: ${g.id} is In code, so it shows its proof`);
    }
  }
  const farm = files[pagePath('astras-pet-os')];
  assert.ok(farm.includes('href="https://github.com/findastra/astras-pet-os/blob/main/test/farmer-rounds-pr-test-20261017.mjs"'), "The Farm's round links its proof");
});
