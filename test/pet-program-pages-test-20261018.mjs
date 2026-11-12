// The Friendly Farmer's pet program spawner (Astra, 2026-10-18): every registered and pipeline pet has a pet program
// page with at least every panel of her sketch, built only from the hub's sources. Claude Opus 5.5, 2026-10-18.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { readSpawnerSources, spawnerPages, spawnerFiles, buildPetProgramPage, pagePath, esc, brief, PANELS, SYSTEM_MAP_LABEL, DIR, INDEX, ASSETS, LAUNCHER_JS, PET_CHAT_JS, LIVE_CHECK, privateTarget, movedFiles, modelProgramAssets, modelProgramData, MODEL_PROGRAM, desktopId } from '../scripts/pet-program-pages-20261018.mjs';
import { drawnBox, unionBox, desktopHeight, NORMAL_HEIGHT, MAX_PET_WIDTH, SIZE, FULL_HEIGHT, SAME_SIZE, SAME_SIZE_CROP, FARMER_SIZE } from '../scripts/pet-size-20261023.mjs';
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
  // A moved pet's old page sends you on to its new one (Astra, 2026-10-28).
  for (const [path, html] of Object.entries(movedFiles())) {
    assert.equal(readFileSync(`${root}/${path}`, 'utf8').replace(/\r\n/g, '\n'), html, `${path} differs from the spawner: run npm run build`);
    assert.ok(!(path in files), `${path} is a moved page, not a pet's page`);
  }
  const expected = new Set([...Object.keys(files), ...Object.keys(movedFiles()), ...Object.keys(modelProgramAssets())].map((p) => p.split('/').pop()).concat([ASSETS.css, ASSETS.js, LAUNCHER_JS, PET_CHAT_JS]));
  for (const f of readdirSync(`${root}/${DIR}`)) assert.ok(expected.has(f), `${DIR}/${f} belongs to no pet any more`);
});

test('every page has every panel of the sketch, in its order, and every panel collapses', () => {
  for (const d of pages) {
    const html = files[pagePath(d.repo)];
    const labels = PANELS.map((m) => (['cyberhome-panel', 'system-map-panel', 'intelligence-levels-panel', 'L1-control-panel', 'L2-control-panel', 'L3-control-panel', 'L4-control-panel', 'rwx-panel', 'session-notes-panel', 'emotions-panel', 'clicker-training-panel', 'friends-list-panel', 'unified-footer-panel', 'chat-panel'].includes(m)
      ? `${d.petSlug}-${m}` : ['quick-summary-panel', 'editorial-status-panel'].includes(m) ? `${d.homeSlug}-${m}` : m));
    let at = -1;
    for (const label of labels) {
      const i = html.indexOf(`>${label}<`) > -1 ? html.indexOf(`>${label}<`) : html.indexOf(`"${label}"`);
      assert.ok(i > at, `${d.repo}: ${label} is missing or out of the sketch's order`);
      at = i;
    }
    assert.ok(html.indexOf('<h1>') > html.indexOf(`>${d.petSlug}-cyberhome-panel<`), `${d.repo}: the title sits beside the cyberhome`);
    const panels = (html.match(/<details class="panel/g) || []).length;
    assert.ok(panels >= PANELS.length - 1, `${d.repo}: every panel is a <details> that collapses (${panels})`);
    assert.doesNotMatch(html, /-module<|class="module/, `${d.repo}: panels, not modules (Astra, 2026-10-19)`);
  }
});

// Astra, 2026-11-08: "there's some drop down arrows in every panel that it needs to be on only like the main body
// panels, not the top ones or the bottom ones, and definitely not the unified footer" (deck: all recommended).
test('only the main body panels fold; the top and bottom panels always stay open with no arrow', () => {
  const css = readFileSync(`${root}/${DIR}/${ASSETS.css}`, 'utf8');
  assert.match(css, /details\.panel\[data-stays-open\] > summary \.legend::after \{ content: none; \}/, 'no arrow after a label that does not fold');
  assert.match(readFileSync(`${root}/${DIR}/${ASSETS.js}`, 'utf8'), /details\.panel\[data-stays-open\]/, 'the page script keeps them open');
  const stays = ['cyberhome', 'editorial', 'footer', 'related-pets', 'summary', 'system-map'];
  for (const d of pages) {
    const html = files[pagePath(d.repo)];
    const boxes = [...html.matchAll(/<details class="panel ([^"]*)"([^>]*)><summary([^>]*)>/g)];
    assert.deepEqual(boxes.filter((b) => b[2].includes(' data-stays-open')).map((b) => b[1].trim()).sort(), stays, `${d.repo}: the top and bottom panels stay open`);
    for (const [, cls, attrs, summary] of boxes) {
      if (attrs.includes(' data-stays-open')) {
        assert.match(attrs, / open$/, `${d.repo}: ${cls} is open`);
        assert.equal(summary, ' tabindex="-1"', `${d.repo}: ${cls}'s label does not fold it`);
      } else assert.equal(summary, ' title="Click the label to fold or unfold this tool panel"', `${d.repo}: ${cls} folds`);
    }
    for (const body of ['levels', 'rwx-panel', 'session-notes', 'emotions', 'clicker'])
      assert.ok(boxes.some((b) => b[1].trim() === body && !b[2].includes('data-stays-open')), `${d.repo}: the ${body} panel folds`);
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
    const box = html.slice(html.indexOf(`>${d.petSlug}-clicker-training-panel<`), html.indexOf(`>${d.petSlug}-unified-footer-panel<`));
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

test('one click always points to the pet program page: every pet\'s link is its page; the app it had is in the Pet ID (Astra, 2026-10-19, 2026-10-21)', () => {
  const regs = [...src.registry.pets, ...src.registry.pipeline];
  for (const r of regs) {
    assert.equal(r.interface_url, pagePath(r.repo), `${r.repo}: interface_url`);
    assert.equal(r.interface_local_url, pagePath(r.repo), `${r.repo}: interface_local_url`);
    const html = files[pagePath(r.repo)];
    const today = r.interface_live_url || r.app_url;
    // No button since 2026-10-21 (Astra put an X over "Open today's app"): the Pet ID links it, or says it is private.
    if (today) assert.match(html, /<dt>App<\/dt><dd>(<a href="[^"]+">the app it had before<\/a>|its app \(private: [^)]+\))<\/dd>/, `${r.repo}: the Pet ID links the app it had`);
    assert.ok(!html.includes(`href="${r.repo}-20261018.html">the app it had before`), `${r.repo}: the link never opens the page itself`);
  }
});

test('every page links back to the System Map, top right, on its own node (Astra, 2026-10-19; Flash Audit A60)', () => {
  for (const d of pages) {
    const html = files[pagePath(d.repo)];
    const header = html.slice(html.indexOf('<header class="top">'), html.indexOf('</header>'));
    const at = (label) => header.indexOf(`>${label}<`);
    assert.ok(at(`${d.petSlug}-${SYSTEM_MAP_LABEL}`) > at(`${d.petSlug}-cyberhome-panel`), `${d.repo}: the map panel is in the header, after the cyberhome`);
    assert.ok(at(`${d.petSlug}-${SYSTEM_MAP_LABEL}`) > header.indexOf('<h1>'), `${d.repo}: the map panel comes after the title, on the right`);
    const link = `../../system-map-20261012.html#node=${encodeURIComponent(d.mapNode)}`;
    assert.ok(header.slice(at(`${d.petSlug}-${SYSTEM_MAP_LABEL}`)).includes(`<a class="map-link" href="${link}" title="Open ${esc(d.home)} on the System Map"`), `${d.repo}: it opens the map on ${d.mapNode}`);
    assert.ok(!header.includes('its node:'), `${d.repo}: the node's id is not printed under the link (Astra, 2026-10-21)`);
  }
});

// Astra's marked-up screenshot of Unity Stable, 2026-10-21, for every pet program.
test('the header: no bubble in the cyberhome, the hub\'s map label, the quick summary label, and no buttons under it (Astra, 2026-10-21)', () => {
  for (const d of pages) {
    const html = files[pagePath(d.repo)];
    const header = html.slice(html.indexOf('<header class="top">'), html.indexOf('</header>'));
    assert.ok(!/class="bubble"|id="bubble"/.test(header), `${d.repo}: "get rid of this entirely"`);
    assert.ok(header.includes(`<span class="legend">${d.petSlug}-${SYSTEM_MAP_LABEL}</span>`), `${d.repo}: the map box is <pet>-system-map-panel`);
    assert.ok(header.includes(`<span class="legend">${d.homeSlug}-quick-summary-panel</span>`) && !header.includes('-pet-program-quick-summary'), `${d.repo}: <home>-quick-summary-panel`);
    assert.ok(!/class="actions"|class="button/.test(header), `${d.repo}: an X over "Open today's app" and over "Repo"`);
    assert.ok(html.includes(`${esc(d.owner)}/${esc(d.repo)}`), `${d.repo}: the repo is still named in the footer and the Pet ID`);
  }
  const css = readFileSync(`${root}/${DIR}/${ASSETS.css}`, 'utf8');
  // Snug around their tool and picture since 2026-10-23 ("too much space still"), no longer forced squares.
  assert.match(css, /\.top > \.cyberhome\[open\], \.top > \.system-map\[open\] \{ display: flex; flex-direction: column; \}/, 'the cyberhome and the System Map box fit their tool and picture');
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

test('lights: the ON/OFF light is never grey, and only tools have lights, never a panel (Astra, 2026-10-23)', () => {
  for (const d of pages) {
    const html = files[pagePath(d.repo)];
    assert.ok(!/class="light onoff[^"]*is-unset/.test(html), `${d.repo}: "those are either on or off"`);
    // "panels cant have lights. only tools can"
    assert.ok(!html.includes('data-item="panel:'), `${d.repo}: no panel has lights`);
    assert.ok(!/<summary[^>]*><span class="lights">/.test(html), `${d.repo}: no lights in a panel's label`);
    // The cyberhome's box is the tool <pet>-cyberhome, a pill with its lights; not built yet, so off, never green.
    const render = `${d.petSlug}-cyberhome`;
    assert.match(html, new RegExp(`<span class="render-label"><span class="lights"><button type="button" class="light onoff is-off" data-item="tool:${render}" data-name="${render}" data-planned="1"[^]*?</span><span class="render-name">${render}</span></span>`), `${d.repo}: ${render} has its lights, off until it is built`);
    // The map panel's tool, <pet>-system-map: its lights live (the link exists).
    const mapTool = `${d.petSlug}-system-map`;
    assert.match(html, new RegExp(`<span class="render-label"><span class="lights"><button type="button" class="light onoff" data-item="tool:${mapTool}"[^]*?</span><span class="render-name">${mapTool}</span></span>`), `${d.repo}: ${mapTool} has its lights`);
  }
  const js = readFileSync(`${root}/${DIR}/${ASSETS.js}`, 'utf8');
  assert.match(js, /function power\(k, planned\) \{ if \(planned\) return 'off';/, 'something not built yet is off, never grey');
});

// Astra, 2026-11-08: "the pets are not the sizes they would appear on the screen in the corner, so make sure they're
// the right size".
test('the page sizes pets by the star\'s own rules (LayoutPets in desktop-pets-20261011.cs)', () => {
  const cs = readFileSync(`${root}/scripts/desktop-pets-20261011.cs`, 'utf8');
  const layout = cs.slice(cs.indexOf('void LayoutPets()'), cs.indexOf('void CreatePetWindows('));
  assert.match(cs, new RegExp(`NormalHeight=${NORMAL_HEIGHT}f,BugHeight=${NORMAL_HEIGHT}f,MaxPetWidth=${MAX_PET_WIDTH};`), 'NormalHeight and MaxPetWidth');
  assert.match(cs, new RegExp(`SameSize=\\{${SAME_SIZE.map((id) => `"${id}"`).join(',')}\\};`), 'the pets that share one crop height');
  assert.match(cs, new RegExp(`SameSizeCrop=${SAME_SIZE_CROP};`), 'their crop height');
  assert.match(layout, new RegExp(`float fh=NormalHeight\\*${FARMER_SIZE}f,fw=fh\\*farmer\\.Crop\\.Width/farmer\\.Crop\\.Height;`), 'the Friendly Farmer\'s height');
  const star = {};
  for (const [, cases, size] of layout.matchAll(/((?:case "[a-z-]+":)+)(?:h=NormalHeight;w=h\*pet\.Crop\.Width\/pet\.Crop\.Height;)?size=([\d.]+)f;break;/g))
    for (const [, id] of cases.matchAll(/case "([a-z-]+)":/g)) star[id] = Number(size);
  assert.deepEqual(Object.keys(star).sort(), Object.keys(SIZE).sort(), 'the same pets have a size of their own');
  for (const id of Object.keys(star)) assert.equal(SIZE[id], star[id], `${id}'s size`);
  const full = [...layout.matchAll(/case "([a-z-]+)":h=NormalHeight;/g)].map((m) => m[1]).sort();
  assert.deepEqual(full, [...FULL_HEIGHT].sort(), 'the pets that keep NormalHeight when wide');
});

test('every pet picture is as big as on the desktop, its empty margin cut off, never squeezed into 60px', () => {
  // Rift Rabbit: 0.9 of NormalHeight on the desktop, measured from his drawings the way the star crops them.
  const rabbit = pages.find((x) => x.repo === 'rift-rabbit');
  const crop = unionBox([rabbit.art.plain.idle, rabbit.art.plain.blink].map((p) => drawnBox(`${root}/${p}`, 127)));
  assert.equal(desktopHeight('rift-rabbit', crop), Math.round(NORMAL_HEIGHT * 0.9 * 10) / 10, 'Rift Rabbit stands 52.9px tall');
  // The Friendly Farmer is "farmer" on the desktop, 0.9 of NormalHeight; Spoonfed's Sugarcube is a draft, 0.7.
  const farmer = pages.find((x) => x.repo === 'astras-pet-os');
  const fc = unionBox([farmer.art.plain.idle, farmer.art.plain.blink].filter(Boolean).map((p) => drawnBox(`${root}/${p}`, 127)));
  assert.equal(desktopHeight('farmer', fc), Math.round(NORMAL_HEIGHT * FARMER_SIZE * 10) / 10, 'the Farmer at his desktop height');
  const spoonfed = [...src.registry.pets, ...(src.registry.pipeline || [])].find((r) => r.repo === 'spoonfed');
  assert.equal(desktopId(spoonfed, src.drafts), 'spoonfed-sugarcube', 'a draft pet goes by its desktop id, so its own size (0.7) counts');
  for (const [name, html] of [...pages.map((d) => [d.repo, files[pagePath(d.repo)]]), ['the Model Pet Program', files[MODEL_PROGRAM.page]]]) {
    const den = (html.match(/<div class="den"[^]*?<\/div>/) || [''])[0];
    const places = [den, ...(html.match(/<figure class="mood"[^]*?<\/figure>/g) || []), ...(html.match(/<li class="mood related-pet">[^]*?<\/li>/g) || [])];
    for (const place of places) for (const pic of place.match(/<img[^>]*>/g) || [])
      assert.match(pic, /class="[^"]*\bfit\b[^"]*" style="--fit-w: [\d.]+px; --fit-h: [\d.]+px; --fit-t: [\d.]+px; --fit-r: [\d.]+px; --fit-b: [\d.]+px; --fit-l: [\d.]+px"/, `${name}: ${pic.slice(0, 120)} is drawn at its desktop size`);
  }
  const css = readFileSync(`${root}/${DIR}/${ASSETS.css}`, 'utf8');
  assert.doesNotMatch(css, /--pet-height|\.den \{[^}]*[{;] ?height: 60px/, 'no 60px slot shrinks the pet');
  assert.doesNotMatch(css, /discord-damsel"\] \.den img\.pet \{ scale/, 'Damsel needs no size of her own');
  assert.match(css, /img\.fit, \.den img\.pet\.fit, \.mood img\.fit \{ width: var\(--fit-w\); height: var\(--fit-h\); max-width: none; max-height: none;/);
});

// Astra, 2026-11-08: "I think a lot of these buttons aren't really working on the farm. We should know how they're
// supposed to work"; deck "The Farm: art and lights", answer 2: A ("All recommended").
test('a native ON/OFF light says it only keeps the choice in this browser; a program\'s says it opens and closes it', () => {
  const farm = files[pagePath('astras-pet-os')];
  assert.doesNotMatch(farm, /kill switch\): click to switch/, 'no light promises a kill switch that nothing reads');
  assert.match(farm, /data-item="tool:click-check"[^>]*title="ON\/OFF: your choice, saved in this browser\. Nothing on the PC switches yet\."/, 'a native tool');
  assert.match(farm, /data-item="third-party:github"[^>]*title="ON\/OFF: green while it is open on this PC\. Click to open or close it"/, 'a 3rd party program');
  const js = readFileSync(`${root}/${DIR}/${ASSETS.js}`, 'utf8');
  assert.match(js, /on: 'on: your choice, saved in this browser\. Nothing on the PC switches yet\./, 'its words when clicked');
});

// Astra, 2026-11-08, on the Farmer's page: "a lot of these pets and their descriptions are wrong and the images just
// aren't there. So you need to go in and get the new stuff."
test('every friend says what it does and has a picture: no line shared by three friends, review drawings when no other', () => {
  for (const d of pages) {
    const seen = new Map();
    for (const r of d.related) if (r.why) seen.set(r.why, (seen.get(r.why) || 0) + 1);
    assert.deepEqual([...seen].filter(([, n]) => n >= 3), [], `${d.repo}: no line shared by three friends`);
  }
  const farmer = pages.find((x) => x.repo === 'astras-pet-os');
  assert.deepEqual(farmer.related.filter((r) => !r.idle).map((r) => r.id), [], 'every one of the Farmer\'s friends has a picture');
  const goddess = farmer.related.find((r) => r.pet === 'Gatekeeper Goddess');
  assert.match(goddess.idle, /^art\/drafts\/body-and-center-review-20261031\/normalized\/gatekeeper-goddess-sprite-20261031\.png$/, 'a pet with no drawing takes its newest review drawing');
  assert.match(goddess.why, /^Security and approvals/, 'and says what it does');
  assert.match(farmer.related.find((r) => r.pet === 'Rift Rabbit').idle, /^art\/moods\/rift-rabbit\//, 'a pet with a drawing keeps it');
  assert.match(farmer.related.find((r) => r.pet === 'Skill Scout').idle, /^art\/icons\/skill-scout-\d{8}\.png$/, 'an icon is found by the pet\'s name');
});

// Astra, 2026-11-08, on Discord Tower's page: "I don't see Discord Canary on here. Can you make sure that that's on
// there? And then everything else that we've built?"
test('a 3rd party program one of its tricks runs on is listed; Discord Tower shows everything built for it', () => {
  const html = files[pagePath('discord-tower')];
  const names = (h3) => { const m = new RegExp(`<h3>${h3} · \\d+</h3><ul class="items">([^]*?)</ul>`).exec(html); return m ? [...m[1].matchAll(/class="item-name">([^<]*)</g)].map((x) => x[1]) : []; };
  assert.deepEqual(names('3rd party programs').sort(), ['BetterDiscord', 'CLI Proxy API', 'Discord', 'Discord Canary'], 'Discord Canary, through the typing-indicator trick');
  for (const n of ['OpenAI Discord Presence', 'Anthropic Discord Presence', 'Ableton Live Discord Presence']) assert.ok(names('Native programs').includes(n), `${n} is one of Discord Damsel's programs`);
  assert.match(html, /Opens the installed OpenAI, Anthropic and Ableton Live Discord presence controls/, 'the quick summary names all three');
});

test('headings count what they hold, and the pet\'s own things are native (Astra, 2026-10-21)', () => {
  const unicorn = files[pagePath('unity-unicorn')];
  const d = pages.find((x) => x.repo === 'unity-unicorn');
  assert.ok(unicorn.includes(`<h3>3rd party programs · ${d.thirdParty.length}</h3>`), '3rd party programs · #');
  assert.ok(unicorn.includes(`<h3>Native programs · ${d.programs.length}</h3>`), 'Native programs · #');
  // The self-audit is a trick pill since the Schedule list went (Astra, 2026-10-22), and play-with and care-for are
  // two more on every page (2026-11-03).
  assert.ok(unicorn.includes(`<h3>Native tricks · ${d.tricks.length + (d.audit.cadence ? 1 : 0) + 2}</h3>`), 'Native tricks · #');
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
      assert.match(b, /aria-label="[^"]+: (on|off, not built yet|not seen running|checked, works|report issues|update waiting for your approval|not created)"/);
      assert.doesNotMatch(b, /\sdisabled/, `${d.repo}: every light can be clicked (Astra, 2026-10-19)`);
    }
  }
  // A 3rd party program is never a guessed green (Astra, 2026-10-21: "I dont have Blender open, so I dont know why it
  // shows green"): red, not seen running, until something on the PC reports it.
  const unicorn = files[pagePath('unity-unicorn')];
  for (const id of ['blender', 'unity-editor', 'vrchat-creator-companion']) {
    assert.match(unicorn, new RegExp(`<button type="button" class="light onoff is-off" data-item="third-party:${id}"[^>]* data-unseen="1" aria-label="[^"]+: not seen running"`), `${id}: red, not seen running`);
  }
  // Even when the pet's own link to it is only planned, a 3rd party program's light says whether it is open (Astra,
  // 2026-10-23: "most of my vrchat programs are launched right now and I am not seeing the green lights").
  const rabbit = files[pagePath('rift-rabbit')];
  for (const id of ['steamvr', 'virtual-desktop', 'space-calibrator']) {
    assert.match(rabbit, new RegExp(`<button type="button" class="light onoff is-off" data-item="third-party:${id}"[^>]* data-unseen="1" aria-label="[^"]+: not seen running"`), `${id}: watched, not "not built yet"`);
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
      // Clicking the pill opens it, name included; no dropdown arrow (Astra, 2026-10-23: "just clicking the bubble opens it").
      assert.match(p, /^<span class="lights">.*?<\/span><span class="item-name">/, `${d.repo}: the name, after the lights`);
      assert.match(p, /<details class="pill-more"( open)?><summary aria-label="More about [^"]+"><\/summary>/, `${d.repo}: the pill opens`);
      assert.match(p, /<span class="item-desc( empty)?">/, `${d.repo}: one line on what it does, on the pill`);
      assert.match(p, /<div class="pill-body">/, `${d.repo}: something to open`);
      // only an item with a live picture starts open, so the page shows it (Astra's Star Window, 2026-10-19), or one that
      // works inside its own tool box (Astra, 2026-11-02, use-my-apc64-tool: "that board needs to be within a tool")
      // A tool in its own tool box may start closed (start_closed) so a page with several stays short (2026-11-02).
      const open = p.includes('<details class="pill-more" open>');
      if (p.includes('class="pill-picture"')) assert.ok(open, `${d.repo}: a live picture starts open`);
      if (open) assert.ok(p.includes('class="pill-picture"') || p.includes('class="pill-tool"'), `${d.repo}: open only to show a picture or a working tool`);
    }
  }
  const puffer = files[pagePath('portfolio-puffer')];
  // Astra, 2026-10-20: "I want everything to be on the same page": the Window Star works right on the page. Since
  // 2026-11-02 it works inside its own tool box in L1, like every tool that works on the page ("No special panels").
  const levelsStart = puffer.indexOf(">portfolio-puffer-intelligence-levels-panel<");
  const levelsEnd = puffer.indexOf(">portfolio-puffer-rwx-panel<");
  const at = puffer.indexOf('<div class="pill-tool" id="astras-star-window">');
  assert.ok(at > levelsStart && at < levelsEnd, "in its own tool box in L1");
  assert.ok(!puffer.includes('astras-star-window-tool-panel'), "no panel of its own");
  assert.match(puffer.slice(at), /^<div class="pill-tool" id="astras-star-window"><iframe class="tool-frame" src="https:\/\/findastra\.github\.io\/astras-star-window\/\?embed"/);
  assert.ok(puffer.slice(puffer.indexOf(">portfolio-puffer-L1-control-panel<"), levelsEnd).includes('<span class="item-name">Astra&#39;s Window Star</span>'), "the tool is still listed in L1");
  assert.match(puffer, /<a class="button" href="https:\/\/findastra\.github\.io\/astras-star-window\/" target="_blank" rel="noopener">Open it full screen<\/a>/, 'its own page opens full screen');
  const damsel = pages.find((d) => d.repo === 'discord-tower');
  const html = files[pagePath(damsel.repo)];
  for (const name of ['Sticker Manager', 'CLI Proxy API manager']) assert.match(html, new RegExp(`<span class="item-name">${name}</span>[\\s\\S]*?<a class="button" href="https://github\\.com/findastra/discord-tower/tree/main/tools/[a-z-]+">Open it</a>`), `${name}: its pill links its folder`);
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
  assert.match(dog.art.plain.idle, /^desktop-art\/drum-dog\/idle-\d{8}\.png$/);
  // The page shows that drawing with its mood sticker stamped on (2026-10-24).
  assert.equal(dog.art.frames.idle, 'art/moods/drum-dog/idle.png');
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
    if (d.appPrivate) assert.match(actions, /its app \(private: /, `${d.repo}: the Pet ID says why`);
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
    assert.ok(html.indexOf(`>${d.petSlug}-friends-list-panel<`) < html.indexOf(`>${d.petSlug}-unified-footer-panel<`), `${d.repo}: plays-with comes just above the footer`);
    // Plays-with (Astra, 2026-10-23) holds every pet of its connection boxes, and the seeds and roadmap pets it links to.
    const ids = new Set(d.related.map((r) => r.id));
    for (const c of d.connections) assert.ok(ids.has(c.id), `${d.repo}: ${c.name} from its connection boxes plays with it`);
    for (const r of d.related.filter((x) => x.page)) {
      assert.ok(names.has(r.page), `${d.repo}: ${r.pet} links to a page that exists (${r.page})`);
      assert.ok(html.includes(`href="${r.page}"`), `${d.repo}: ${r.pet} is a link`);
    }
  }
  const damsel = pages.find((d) => d.repo === 'discord-tower');
  for (const id of ['role-fairy', 'mommys-mommies', 'claude-bot']) assert.ok(damsel.related.some((r) => r.id === id), `Discord Damsel is related to ${id}`);
  assert.equal(damsel.related.find((r) => r.id === 'role-fairy').home, 'Fairy Ring');
  // Astra, 2026-10-23: "rift-rabbit-plays-with ... need to show OSC Sealion, etc. and in order of most used to least used".
  const rabbit = pages.find((d) => d.repo === 'rift-rabbit');
  assert.ok(rabbit.related.some((r) => r.id === 'osc-sealion'), 'Rift Rabbit plays with OSC Sealion, a seed');
  assert.ok(!rabbit.related.some((r) => r.id === 'gatekeeper-goddess'), 'not with the every-pet links that are only architecture');
  const rank = { now: 0, planned: 1, idea: 2, suggested: 3, architecture: 4 };
  for (const d of pages) for (let i = 1; i < d.related.length; i++) if (!(d.plays_with || []).length) assert.ok(rank[d.related[i - 1].state] <= rank[d.related[i].state], `${d.repo}: most used first`);
});

test('third-party programs include those a tool or a trick of the pet runs or looks after (Flash Audit A54; 2026-11-08)', () => {
  const damsel = pages.find((d) => d.repo === 'discord-tower');
  assert.deepEqual(damsel.thirdParty.map((p) => p.name).sort(), ['BetterDiscord', 'CLI Proxy API', 'Discord', 'Discord Canary']);
});

test('the R W X panel: each level says what it should be, then whether that is in code, with proof (Astra, 2026-10-19)', () => {
  for (const d of pages) {
    const html = files[pagePath(d.repo)];
    const L4 = html.indexOf(`>${d.petSlug}-L4-control-panel<`), start = html.indexOf(`>${d.petSlug}-rwx-panel<`), end = html.indexOf(`>${d.petSlug}-session-notes-panel<`);
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
    // Its own tool, pet-id, since 2026-10-22 (Astra drew "oo pet-id"); a round tool box since 2026-10-24.
    assert.ok(html.includes('<button type="button" class="toolbox-fold toolbox-name" aria-expanded="false">pet-id</button>'), `${d.repo}: L4 has a Pet ID`);
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

// Astra, 2026-10-22, "All recommended for the redlines 2 slides" (Unity Stable redlines 2: 6 questions).
test('redlines 2 answers: pets it talks to as bubbles, L3 pills, two R W X rows, shared programs, the title lined up', () => {
  const unicorn = files[pagePath('unity-unicorn')];
  // 2: "pets it talks to needs to go away. if anything that information lives in rift-rabbit-friends-list-panel" (2026-10-23).
  assert.ok(!unicorn.includes('<h3 class="talks">'), '2: no "Pets it talks to" in L2; the friends list has them');
  const l3 = unicorn.slice(unicorn.indexOf('>unity-unicorn-L3-control-panel<'), unicorn.indexOf('>unity-unicorn-L4-control-panel<'));
  // Since 2026-10-24 L3 is only L3 talking with L4 about the pet program ("L3 control panel should be about L3 to L4
  // discussions, regarding the pet program only"): what L3 asks, its suggestions, the seat.
  for (const h of ['L3 asks you · 0', 'Suggestions for you · 1', 'Seat · 0']) assert.ok(l3.includes(`<h3>${h}</h3>`), `3: ${h}`);
  for (const h of ['Tricks running now', 'Harness skills', 'Token use']) assert.ok(!l3.includes(`<h3>${h}`), `3: no ${h} in L3`);
  assert.ok(l3.includes('<span class="tag cadence" title="How often it runs">weekly</span>'), '3: the suggestions are a weekly trick');
  assert.match(unicorn, /<h3>Shared programs · 1<\/h3>[\s\S]*?>My Avatar Closet</, '4: the closet under Shared programs');
  assert.ok(!/<h3>3rd party programs[^<]*<\/h3>(?:(?!<h3>)[\s\S])*My Avatar Closet/.test(unicorn), '4: not also a 3rd party program');
  for (const row of ['a program or tool · its own folder', 'a program or tool · everything else']) assert.ok(unicorn.includes(`<span class="gwho">${row}</span>`), `5: ${row}`);
  assert.ok(unicorn.includes('<span class="gwho">you, the verified human</span>'), '5: one row for L4');
  const css = readFileSync(`${root}/${DIR}/${ASSETS.css}`, 'utf8');
  assert.match(css, /\.top \{ --square: 180px; display: grid;[^}]*align-items: start; \}/, '6: the squares start at the same height as the title (Astra, 2026-10-23)');
});

// Astra, 2026-11-02: "the editorial status panel on the one we're working on, but we don't have it on the live one...
// That way I know if I'm looking at the most recent push or if I'm looking at the one I'm working on."
test('the editorial status panel marks the working copy and is hidden on the live site', () => {
  const css = readFileSync(new URL(`../apps/pet-programs/${ASSETS.css}`, import.meta.url), 'utf8');
  assert.match(css, /html\.live-site \.panel\.editorial \{ display: none; \}/, 'the stylesheet hides it on the live site');
  const check = readFileSync(new URL('../apps/live-site-20261102.js', import.meta.url), 'utf8');
  assert.ok(check.includes('/\\.github\\.io$/i.test(location.hostname)'), 'the live site is any <owner>.github.io address');
  assert.ok(LIVE_CHECK.includes('live-site-20261102.js'), 'every page loads the live check');
  for (const d of pages) {
    const html = files[pagePath(d.repo)];
    const head = html.slice(0, html.indexOf('</head>'));
    assert.ok(head.includes(LIVE_CHECK), `${d.repo}: the live check is in <head>`);
    assert.ok(head.indexOf(LIVE_CHECK) < head.indexOf('<link rel="stylesheet"'), `${d.repo}: the live check runs before anything is drawn`);
    const ed = html.indexOf('-editorial-status-panel<');
    assert.ok(ed > 0 && ed < html.indexOf('<header class="top">'), `${d.repo}: the editorial status panel comes first`);
    assert.ok(html.slice(ed, ed + 600).includes('<p class="working-copy">Working copy: not the live site.</p>'), `${d.repo}: it says it is the working copy`);
  }
});

// Astra's answers to the Flash Audit deck, 2026-11-03 ("i like the phone on data dealer, its program needs its own chat,
// all other reccd").
// Astra, 2026-11-06: no dropdown arrows in the cyberhome, the quick summary or the System Map box.
test('every panel but the three top boxes and the footer ends with More details, the same four lines in order; the chat shows only the arrow', () => {
  const lines = /<dl class="small about-lines"><dt>How it works<\/dt><dd>[^]+?<\/dd><dt>Where it comes from<\/dt><dd>[^]+?<\/dd><dt>Your rules<\/dt><dd>[^]+?PET-PROGRAM-FRAMEWORK\.md<\/a>[^]+?<\/dd><dt>Not built yet<\/dt><dd>[^]+?<\/dd><\/dl>/g;
  for (const d of pages) {
    const html = files[pagePath(d.repo)];
    assert.equal((html.match(lines) || []).length, PANELS.length - 4, `${d.repo}: one More details with four lines per panel, none in the three top boxes or the footer`);
    assert.equal((html.match(/<details class="about arrow-only">/g) || []).length, 1, `${d.repo}: only the chat shows the arrow only`);
    // The unified footer has none either (Astra, 2026-11-11: "get rid of the more details in the unified footer").
    for (const box of ['cyberhome', 'summary', 'system-map', 'footer']) {
      const start = html.indexOf(`<details class="panel ${box}"`);
      assert.ok(start > 0 && !html.slice(start, html.indexOf('</details>', start)).includes('class="about'), `${d.repo}: no More details in the ${box} box`);
    }
  }
});

test('Data Dealer\'s chat is Data Chip\'s yellow phone; every other pet keeps the arrow', () => {
  const dd = files[pagePath('data-dealer')];
  assert.match(dd, /<aside class="chat chat-phone" aria-label="data-chip-chat-panel" style="--phone-name: 'DATA CHIP'">/);
  assert.match(dd, /<button type="button" class="chat-open" id="chat-open"[^>]*><span class="phone-mini" aria-hidden="true"><span class="phone-screen"><svg class="chip-face"/, 'the little phone is the open button');
  assert.match(dd, /<div class="chat-head"><span class="phone-screen"><svg class="chip-face"/, 'his face on the phone\'s screen');
  for (const id of ['chat-panel', 'chat-log', 'chat-text', 'chat-send', 'chat-push', 'chat-new', 'chat-seat']) assert.ok(dd.includes(`id="${id}"`), `the phone is the same chat: #${id}`);
  for (const d of pages.filter((p) => p.repo !== 'data-dealer')) assert.ok(!files[pagePath(d.repo)].includes('chat-phone'), `${d.repo} has no phone`);
  const css = readFileSync(`${root}/${DIR}/${ASSETS.css}`, 'utf8');
  assert.match(css, /\.chat-phone \{ --neon: #d9e25a;/, 'Data Dealer\'s own neon');
  assert.match(css, /\.chat-phone \.chat-log li\.pet::before \{ content: var\(--phone-name\) "> "/, 'DATA CHIP> before his lines');
});

test('awake shows its own drawing with the twinkles; L2 has play-with and care-for, off until L3 runs them', () => {
  for (const d of pages) {
    const html = files[pagePath(d.repo)];
    const awake = html.slice(html.indexOf('<figure class="mood" data-mood="blink">'));
    const pic = awake.slice(0, awake.indexOf('</figure>'));
    const own = d.art.frames.blink || d.art.frames.idle;
    if (own) assert.ok(pic.includes(`src="../../${own}"`), `${d.repo}: awake shows ${own}`);
    assert.ok(!html.includes('awake-faces'), `${d.repo}: awake is no longer the idle face`);
    const l2 = html.slice(html.indexOf(`${d.petSlug}-L2-control-panel`), html.indexOf(`${d.petSlug}-L3-control-panel`));
    for (const t of ['play-with', 'care-for']) assert.match(l2, new RegExp(`data-planned="1"[^]*?<span class="item-name">${t}</span>`), `${d.repo}: ${t} is a planned trick in L2`);
  }
  const js = readFileSync(`${root}/${DIR}/${ASSETS.js}`, 'utf8');
  assert.match(js, /face\(den, mood === 'sad' \? 'sad' : mood === 'awake' && has\(den, 'blink'\) \? 'blink' : 'idle'\)/, 'the cyberhome shows the awake drawing too');
});

// Astra, 2026-11-08, "Yes, add them" (PC Master Race's waiting OKs, where the Model Pet Program has them): a pet's own
// approvals in pets.json `waiting_on_you` show in L4's approvals-waiting-on-you, say which hub card they come from, and
// count in the chat's Needs you, even when the Farmer's round can't see the pet's private repo.
test('a pet\'s own waiting_on_you shows in approvals-waiting-on-you with its hub card', () => {
  const entry = [...src.registry.pets, ...src.registry.pipeline].find((p) => p.repo === 'pc-master-race');
  assert.ok(entry.waiting_on_you?.length >= 2, 'PC Master Race has his licenses and LatencyMon waiting');
  const d = pages.find((x) => x.repo === 'pc-master-race');
  for (const n of entry.waiting_on_you) assert.ok(d.needs.includes(n.need), `L4 lists: ${n.need.slice(0, 40)}`);
  assert.deepEqual(d.needsFrom, ['card 282']);
  const html = files[pagePath('pc-master-race')];
  const l4 = html.slice(html.indexOf(`${d.petSlug}-approvals-waiting-on-you`));
  assert.match(l4.slice(0, 2000), /From card 282 in the hub\. Approve and decline buttons come with Iron Gates\./);
  assert.ok(!l4.slice(0, 2000).includes('Nothing from the Friendly Farmer'), 'not the empty line');
  // The Model Pet Program's example still comes from the round.
  const model = buildPetProgramPage(modelProgramData(src));
  assert.match(model, /From the Friendly Farmer(?:'|&#39;)s last merged round \(2026-11-02\)\./);
});
