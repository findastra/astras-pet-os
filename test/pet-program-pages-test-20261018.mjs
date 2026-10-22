// The Friendly Farmer's pet program spawner (Astra, 2026-10-18): every registered and pipeline pet has a pet program
// page with at least every panel of her sketch, built only from the hub's sources. Claude Opus 5.5, 2026-10-18.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { readSpawnerSources, spawnerPages, spawnerFiles, buildPetProgramPage, pagePath, esc, brief, PANELS, SYSTEM_MAP_LABEL, DIR, INDEX, ASSETS, privateTarget } from '../scripts/pet-program-pages-20261018.mjs';
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
    const labels = PANELS.map((m) => (['cyberhome', 'intelligence-levels', 'L1-tool-panel', 'L2-tool-panel', 'L3-tool-panel', 'L4-tool-panel', 'rwx-panel', 'session-notes', 'emotions', 'clicker-training', 'related-pets', 'chat'].includes(m)
      ? `${d.petSlug}-${m}` : m === 'quick-summary' ? `${d.homeSlug}-${m}` : m === 'system-map' ? SYSTEM_MAP_LABEL : m));
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
    // Each number of clicks is a pill with its lights, like a tool (Astra, 2026-10-22).
    const pill = (name) => new RegExp(`<li class="pill"><span class="lights">.*?data-item="click:${d.petSlug}:[^"]+" data-name="${name}".*?class="item-name"[^>]*>${name}</(?:a|span)>.*?<span class="item-desc">([^<]*)</span>`);
    assert.match(box, pill('one click'), `${d.repo}: one click`);
    assert.match(box.match(pill('one click'))[1], /^Show the current reminder in a dialog box/);
    assert.equal(box.match(pill('two clicks'))[1], esc(`Open or close ${d.home}, this page.`), `${d.repo}: two clicks`);
    const three = d.clicks['3'];
    if (three) assert.equal(box.match(pill('three clicks'))[1], esc(three.what || three.tool), `${d.repo}: three clicks run ${three.tool}`);
    else assert.match(box.match(pill('three clicks'))[1], /^A tool you assign/, `${d.repo}: three clicks`);
    assert.doesNotMatch(box, /refresh tools/, `${d.repo}: three clicks no longer refresh the tools`);
  }
  // Astra, 2026-10-19: "yes move voicemeeter bug to 3 clicks is the fix".
  const bug = pages.find((d) => d.repo === 'voicemeeter-bug');
  assert.equal(bug.clicks['3']?.tool, 'repair', 'Voicemeeter Bug repairs on three clicks');
  assert.equal(bug.clicks['1'], undefined, 'one click is the reminder for every pet');
});

test('one click always points to the pet program page: every pet\'s link is its page; the app it had is in the passport (Astra, 2026-10-19, 2026-10-21)', () => {
  const regs = [...src.registry.pets, ...src.registry.pipeline];
  for (const r of regs) {
    assert.equal(r.interface_url, pagePath(r.repo), `${r.repo}: interface_url`);
    assert.equal(r.interface_local_url, pagePath(r.repo), `${r.repo}: interface_local_url`);
    const html = files[pagePath(r.repo)];
    const today = r.interface_live_url || r.app_url;
    // No button since 2026-10-21 (Astra put an X over "Open today's app"): the passport links it, or says it is private.
    if (today) assert.match(html, /<dt>App<\/dt><dd>(<a href="[^"]+">the app it had before<\/a>|its app \(private: [^)]+\))<\/dd>/, `${r.repo}: the passport links the app it had`);
    assert.ok(!html.includes(`href="${r.repo}-20261018.html">the app it had before`), `${r.repo}: the link never opens the page itself`);
  }
});

test('every page links back to the System Map, top right, on its own node (Astra, 2026-10-19; Flash Audit A60)', () => {
  for (const d of pages) {
    const html = files[pagePath(d.repo)];
    const header = html.slice(html.indexOf('<header class="top">'), html.indexOf('</header>'));
    const at = (label) => header.indexOf(`>${label}<`);
    assert.ok(at(SYSTEM_MAP_LABEL) > at(`${d.petSlug}-cyberhome`), `${d.repo}: the map panel is in the header, after the cyberhome`);
    assert.ok(at(SYSTEM_MAP_LABEL) > header.indexOf('<h1>'), `${d.repo}: the map panel comes after the title, on the right`);
    const link = `../../system-map-20261012.html#node=${encodeURIComponent(d.mapNode)}`;
    assert.ok(header.slice(at(SYSTEM_MAP_LABEL)).includes(`<a class="map-link" href="${link}">`), `${d.repo}: it opens the map on ${d.mapNode}`);
    assert.ok(!header.includes('its node:'), `${d.repo}: the node's id is not printed under the link (Astra, 2026-10-21)`);
  }
});

// Astra's marked-up screenshot of Unity Stable, 2026-10-21, for every pet program.
test('the header: no bubble in the cyberhome, the hub\'s map label, the quick summary label, and no buttons under it (Astra, 2026-10-21)', () => {
  for (const d of pages) {
    const html = files[pagePath(d.repo)];
    const header = html.slice(html.indexOf('<header class="top">'), html.indexOf('</header>'));
    assert.ok(!/class="bubble"|id="bubble"/.test(header), `${d.repo}: "get rid of this entirely"`);
    assert.ok(header.includes(`<span class="legend">${SYSTEM_MAP_LABEL}</span>`), `${d.repo}: the map box is astras-pet-os-system-map`);
    assert.ok(header.includes(`<span class="legend">${d.homeSlug}-quick-summary</span>`) && !header.includes('-pet-program-quick-summary'), `${d.repo}: <home>-quick-summary`);
    assert.ok(!/class="actions"|class="button/.test(header), `${d.repo}: an X over "Open today's app" and over "Repo"`);
    assert.ok(html.includes(`${esc(d.owner)}/${esc(d.repo)}`), `${d.repo}: the repo is still named in the footer and the Pet ID`);
  }
  const css = readFileSync(`${root}/${DIR}/${ASSETS.css}`, 'utf8');
  assert.match(css, /\.top > \.cyberhome\[open\], \.top > \.system-map\[open\] \{ aspect-ratio: 1 \/ 1;/, 'the cyberhome and the System Map box are always squares');
  const js = readFileSync(`${root}/${DIR}/${ASSETS.js}`, 'utf8');
  assert.match(js, /classList\.add\('stacked'\)/, 'too narrow, the version goes on its own line below the name');
});

test('the version beside the title is the pet\'s own, or the starting 0.1.0 the hub assigned (Astra, 2026-10-21: "remember to assign version #s")', () => {
  const regs = [...src.registry.pets, ...src.registry.pipeline];
  for (const d of pages) {
    const r = regs.find((x) => x.repo === d.repo);
    assert.match(r.version || '', /^v?\d+\.\d+/, `${d.repo}: pets.json has a version`);
    const core = /^v?(\d+\.\d+(?:\.\d+)?)/.exec(r.version)[1];
    assert.ok(files[pagePath(d.repo)].includes(`<span class="version" title="`) && files[pagePath(d.repo)].includes(`>v${core} // `), `${d.repo}: the title shows v${core}`);
    if (r.version_assigned) assert.equal(r.version, '0.1.0', `${d.repo}: an assigned version is the starting one`);
  }
});

test('lights: the ON/OFF light is never grey, and every level tool panel has its pair left of its label (Astra, 2026-10-21)', () => {
  for (const d of pages) {
    const html = files[pagePath(d.repo)];
    assert.ok(!/class="light onoff[^"]*is-unset/.test(html), `${d.repo}: "those are either on or off"`);
    for (const lv of ['L1', 'L2', 'L3', 'L4']) {
      const label = `${d.petSlug}-${lv}-tool-panel`;
      assert.ok(html.includes(`<span class="lights"><button type="button" class="light onoff" data-item="panel:${label}"`), `${d.repo}: ${label} has its ON/OFF light`);
      assert.match(html, new RegExp(`data-item="panel:${label}"[^>]*></button></span><span class="legend">${label}</span>`), `${d.repo}: the lights come before ${label}`);
    }
  }
  const js = readFileSync(`${root}/${DIR}/${ASSETS.js}`, 'utf8');
  assert.match(js, /function power\(k, planned\) \{ if \(planned\) return 'off';/, 'something not built yet is off, never grey');
});

test('headings count what they hold, and the pet\'s own things are native (Astra, 2026-10-21)', () => {
  const unicorn = files[pagePath('unity-unicorn')];
  const d = pages.find((x) => x.repo === 'unity-unicorn');
  assert.ok(unicorn.includes(`<h3>3rd party programs · ${d.thirdParty.length}</h3>`), '3rd party programs · #');
  assert.ok(unicorn.includes(`<h3>Native programs · ${d.programs.length}</h3>`), 'Native programs · #');
  // The self-audit is a trick pill since the Schedule list went (Astra, 2026-10-22).
  assert.ok(unicorn.includes(`<h3>Native tricks · ${d.tricks.length + (d.audit.cadence ? 1 : 0)}</h3>`), 'Native tricks · #');
  assert.ok(!unicorn.includes('<h3>Schedule</h3>') && unicorn.includes('>self-audit</span> <span class="tag cadence"'), 'no Schedule list: the self-audit is a trick with its cadence');
  for (const p of pages) assert.ok(!/<h3>Your (programs|tools|tricks|other tools)/.test(files[pagePath(p.repo)]), `${p.repo}: native, not "your"`);
});

test('every pill says what it does; every program on the map has a plain does line (Astra, 2026-10-21)', () => {
  assert.equal(brief('A tool of Unity Stable (Preview): Render a compact visual inventory of meshes (unity-unicorn tools/x.json).'), 'Render a compact visual inventory of meshes.');
  for (const n of src.extra.nodes.filter((x) => ['program', 'own-program'].includes(x.type))) {
    assert.ok(typeof n.does === 'string' && n.does.length > 5 && n.does.length <= 200, `${n.id}: what it does, in one line`);
  }
  const d = pages.find((x) => x.repo === 'unity-unicorn');
  const vrchat = d.thirdParty.find((i) => i.id === 'vrchat');
  assert.equal(vrchat.desc, 'A social virtual reality platform.', "Astra's words for VRChat");
  // Her words for the others on the same screenshot, and the names she corrected.
  const named = Object.fromEntries(d.thirdParty.map((i) => [i.id, i]));
  assert.equal(named.vrcft.name, 'VRCFaceTracking', '"VRCFT" crossed out');
  assert.equal(named.vrcft.desc, "Controls your avatar's face tracking.");
  // Unity Hub and the Unity editor are two programs (Astra, 2026-10-21, slides answer 1: A).
  assert.equal(named['unity-hub'].name, 'Unity Hub 3.21.1');
  assert.equal(named['unity-hub'].desc, 'Organizes your Unity projects.');
  assert.equal(named['unity-editor'].name, 'Unity 2022.3.22f1');
  assert.equal(named.blender.state, 'now', '"idea, not agreed yet" struck');
  assert.ok(files[pagePath('unity-unicorn')].includes(`<span class="item-desc">${esc(vrchat.desc)}</span>`), 'it shows on the pill');
});

test('the mood the pet is in lights up in the emotions tool panel (Astra, 2026-10-21)', () => {
  for (const d of pages) {
    const html = files[pagePath(d.repo)];
    for (const m of ['sleep', 'blink', 'idle', 'curious', 'happy', 'worried', 'alarmed', 'sick', 'sad']) assert.ok(html.includes(`<figure class="mood" data-mood="${m}">`), `${d.repo}: ${m}`);
  }
  const js = readFileSync(`${root}/${DIR}/${ASSETS.js}`, 'utf8');
  assert.match(js, /lightUp\(mood === 'awake' \? 'blink' : mood\)/);
});

test('the title is the pet program name from pet-programs.json', () => {
  for (const d of pages) {
    const prog = animals.find((p) => p.repo === d.repo);
    assert.equal(d.home, prog.assigned ? prog.program : `pet-program-${prog.number}`);
    // name and version in one heading, the version after the name (Astra, 2026-10-20: always to its right)
    assert.match(files[pagePath(d.repo)], /<h1><span class="title-name">[^<]+<\/span> <span class="version"/);
    assert.ok(!files[pagePath(d.repo)].includes('class="who"') && !files[pagePath(d.repo)].includes('pet program · #'), `${d.repo}: nothing listed under the title`);
  }
});

test('the paired lights are two buttons side by side, each with a name a screen reader reads', () => {
  for (const d of pages) {
    const html = files[pagePath(d.repo)];
    const pairs = html.match(/<span class="lights"[^>]*><button[^>]*><\/button><button[^>]*><\/button><\/span>/g) || [];
    assert.ok(pairs.length >= 2, `${d.repo}: the cyberhome and the chat have their lights`);
    for (const p of pairs) for (const b of p.match(/<button[^>]*>/g)) {
      assert.match(b, /aria-label="[^"]+: (on|off, not built yet|not seen running|working correctly|not checked yet)"/);
      assert.doesNotMatch(b, /\sdisabled/, `${d.repo}: every light can be clicked (Astra, 2026-10-19)`);
    }
  }
  // A 3rd party program is never a guessed green (Astra, 2026-10-21: "I dont have Blender open, so I dont know why it
  // shows green"): red, not seen running, until something on the PC reports it.
  const unicorn = files[pagePath('unity-unicorn')];
  for (const id of ['blender', 'unity-editor', 'vrchat-creator-companion']) {
    assert.match(unicorn, new RegExp(`<button type="button" class="light onoff is-off" data-item="third-party:${id}"[^>]* data-unseen="1" aria-label="[^"]+: not seen running"`), `${id}: red, not seen running`);
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
      // The name opens the item itself; a dropdown arrow shows the rest (Astra, 2026-10-22: "dropdown arrow and tool name to open tool").
      assert.match(p, /^<span class="lights">.*?<\/span>(<a class="item-name" href="[^"]+"|<span class="item-name")/, `${d.repo}: the name, after the lights`);
      assert.match(p, /<details class="pill-more"( open)?><summary title="Show or hide more about [^"]+" aria-label="More about [^"]+"><\/summary>/, `${d.repo}: the dropdown arrow`);
      assert.match(p, /<span class="item-desc( empty)?">/, `${d.repo}: one line on what it does, on the pill`);
      assert.match(p, /<div class="pill-body">/, `${d.repo}: something to open`);
      // only an item with a live picture starts open, so the page shows it (Astra's Star Window, 2026-10-19)
      assert.equal(p.includes('<details class="pill-more" open>'), p.includes('class="pill-picture"'), `${d.repo}: open only to show a picture`);
    }
  }
  const puffer = files[pagePath('portfolio-puffer')];
  // Astra, 2026-10-20: "I want everything to be on the same page": the Window Star works right on the page. Since
  // 2026-10-22 its panel is its own, after the four levels ("astras-photostar-panel is its own and the tool is listed too
  // just separately"), and its pill in L1 points there.
  const levelsEnd = puffer.indexOf(">portfolio-puffer-rwx-panel<");
  const at = puffer.indexOf("<details class=\"panel tool-embed\" id=\"astras-star-window-tool-panel\" open>");
  assert.ok(at > levelsEnd, "its own panel, after the four levels");
  assert.match(puffer.slice(at), /^<details class="panel tool-embed" id="astras-star-window-tool-panel" open><summary[^>]*><span class="lights">.*?<\/span><span class="legend">astras-photostar-panel<\/span><\/summary><iframe class="tool-frame" src="https:\/\/findastra\.github\.io\/astras-star-window\/\?embed"/);
  assert.ok(puffer.slice(puffer.indexOf(">portfolio-puffer-L1-tool-panel<"), levelsEnd).includes(">Astra&#39;s Window Star</a>"), "the tool is still listed in L1");
  assert.match(puffer, /<a class="item-name" href="#astras-star-window-tool-panel" title="Use Astra&#39;s Window Star below">/, 'its name opens its panel');
  const damsel = pages.find((d) => d.repo === 'findastra-discord-presence');
  const html = files[pagePath(damsel.repo)];
  for (const name of ['Sticker Manager', 'CLI Proxy API manager']) assert.match(html, new RegExp(`<a class="item-name" href="https://github\\.com/findastra/findastra-discord-presence/tree/main/discord-tower/[a-z-]+" title="Open ${name}">${name}</a>`), `${name}: its name links its folder`);
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

// Astra, 2026-10-20: she crossed out Drum Dog's older drawing on his page while his desktop pet sat beside it. A pet
// with a desktop drawing shows that drawing on its page, so the page and the desktop pet are one pet; a drawing the
// draft list marks private (Claude Bot's) is never used.
test('a pet with a desktop drawing shows it on its page; a private drawing never shows', () => {
  const dog = pages.find((d) => d.repo === 'drum-dog');
  assert.equal(dog.art.source, 'desktop');
  assert.match(dog.art.frames.idle, /^desktop-art\/drum-dog\/idle-\d{8}\.png$/);
  const regs = [...(src.registry.pets || []), ...(src.registry.pipeline || [])];
  const privateIds = src.drafts.pets.filter((p) => p.private).map((p) => p.id);
  for (const d of pages) {
    const art = regs.find((r) => r.repo === d.repo)?.art || d.repo;
    const drawn = src.list(`desktop-art/${art}`).some((n) => /^idle(-\d{8})?\.png$/.test(n));
    if (drawn && !privateIds.includes(art)) assert.equal(d.art.source, 'desktop', `${d.repo} has a desktop drawing in desktop-art/${art}`);
  }
  for (const d of pages) for (const p of Object.values(d.art.frames)) {
    for (const id of privateIds) assert.ok(!p.startsWith(`desktop-art/${id}/`), `${d.repo} uses ${id}'s private drawing`);
  }
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

test('the app link never leads into a private repo or its switched-off Pages site (Astra, 2026-10-20: "i privated most repos")', () => {
  const regs = [...src.registry.pets, ...src.registry.pipeline];
  const privateRepos = regs.filter((p) => p.visibility === 'private').map((p) => p.repo);
  for (const d of pages) {
    const actions = files[pagePath(d.repo)].match(/<dt>App<\/dt><dd>[\s\S]*?<\/dd>/)[0];
    for (const r of privateRepos) {
      assert.ok(!new RegExp(`href="https://(github\\.com/findastra|findastra\\.github\\.io)/${r}[/"#?]`, 'i').test(actions), `${d.repo}: today's app leads into private ${r}`);
    }
    if (d.appPrivate) assert.match(actions, /its app \(private: /, `${d.repo}: the passport says why`);
  }
  // The rule itself: a private pet's repo and Pages site; never a public repo, the hub's own copy or another account.
  const reg = { github_owner: 'findastra', pets: [{ repo: 'shut', visibility: 'private' }, { repo: 'open', visibility: 'public' }], pipeline: [] };
  assert.equal(privateTarget(reg, 'https://findastra.github.io/shut/'), 'shut');
  assert.equal(privateTarget(reg, 'https://github.com/findastra/shut#run-it'), 'shut');
  assert.equal(privateTarget(reg, 'https://findastra.github.io/open/'), null);
  assert.equal(privateTarget(reg, 'https://someone-else.github.io/shut/'), null);
  assert.equal(privateTarget(reg, 'apps/shut-20261008.html'), null);
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

// Astra, 2026-10-21: "We are not doing passports. We are doing pet IDs ... Passport Pelican is the reason we are not
// reusing passport." And the vet-clinic is a private repo, so its tickets are not a link nobody else can open.
test('L4 has a Pet ID, never a pet passport, and its vet records link the vet-clinic only while that repo is public', () => {
  const vet = src.extra.nodes.find((n) => n.id === 'vet-clinic');
  assert.ok(vet, 'system-map.json has the vet-clinic node');
  const vetLink = '/vet-clinic/issues?q=';
  for (const d of pages) {
    const html = files[pagePath(d.repo)];
    // Its own tool panel, pet-id, since 2026-10-22 (Astra drew "oo pet-id").
    assert.ok(html.includes('<span class="legend">pet-id</span>'), `${d.repo}: L4 has a Pet ID`);
    assert.ok(!/pet passport/i.test(html), `${d.repo}: no "pet passport" (the word is Passport Pelican's)`);
    if (vet.visibility === 'private') {
      assert.ok(html.includes('<dt>Vet records</dt><dd>vet-clinic tickets (private repo)</dd>'), `${d.repo}: the private vet-clinic is plain text`);
      assert.ok(!html.includes(vetLink), `${d.repo}: no link into the private vet-clinic`);
    } else assert.ok(html.includes(vetLink), `${d.repo}: the public vet-clinic's tickets are linked`);
  }
  // The same pages with the vet-clinic made public: the link comes back, decided by the record, not by a name.
  const flipped = { ...src, extra: { ...src.extra, nodes: src.extra.nodes.map((n) => (n.id === 'vet-clinic' ? { ...n, visibility: vet.visibility === 'private' ? 'public' : 'private' } : n)) } };
  const other = spawnerFiles(flipped);
  for (const d of pages) assert.equal(other[pagePath(d.repo)].includes(vetLink), vet.visibility === 'private', `${d.repo}: the link follows the vet-clinic's visibility`);
});
