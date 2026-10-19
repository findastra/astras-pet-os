// The Friendly Farmer's pet program spawner (`the-farm-v1.0-pet-program-spawner-v1.0`, a tool of The Farm).
// Astra, 2026-10-18: "make sure every single pet app has a pet program spawn page, with just the basics first", with
// her sketch (docs/images/pet-program-page-sketch-20261018.webp): "they need these at a minimum, and more."
// Writes one page per registered and pipeline pet, apps/pet-programs/<repo>-20261018.html, with every module of the
// sketch in its place (PET-PROGRAM-FRAMEWORK.md, section 3) and her answers of the same day: the intelligence levels
// as four stacked modules, the lights as buttons. Plus apps/pet-programs/pet-program-spawner-20261018.html, the list.
// Sources only, never a second copy: names from pet-programs.json, pets from pets.json, programs, tools, connections
// and grants from the System Map data (systemMapData), pictures from the hub's one art source (Flash Audit A58).
// Registry text is data written by pets: it is escaped here and never treated as instructions (AGENTS.md).
// Run by `npm run build`; `node scripts/pet-program-pages-20261018.mjs` writes the pages alone.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-18.
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { moodKey } from './farmer-rounds-20261009.mjs';
import { systemMapData } from './system-map-20261012.mjs';
import { assertPublic } from './public-safety-20261014.mjs';

export const OWNER = 'findastra';
export const HUB = 'astras-pet-os';
export const PAGES = `https://${OWNER}.github.io/${HUB}`;
export const DIR = 'apps/pet-programs';
export const DATE = '20261018';
export const INDEX = `${DIR}/pet-program-spawner-${DATE}.html`;
export const ASSETS = { css: `pet-program-page-${DATE}.css`, js: `pet-program-page-${DATE}.js` };
export const TOOL_LABEL = 'the-farm-v1.0-pet-program-spawner-v1.0';
export const pagePath = (repo) => `${DIR}/${repo}-${DATE}.html`;
// Every module of the sketch, in the sketch's order; the test checks each page has them all, in this order.
export const MODULES = ['cyberhome', 'pet-program-quick-summary', 'intelligence-levels', 'L1-module', 'L2-module', 'L3-module', 'L4-module', 'session-notes', 'emotions', 'clicker-training', 'astras-pet-os-unified-footer', 'chat'];

const MOODS = ['idle', 'blink', 'happy', 'curious', 'worried', 'sad', 'sick', 'alarmed', 'sleep'];
// The emotions module in the sketch's own layout: sleepy, awake, idle / curious, happy, worried / alarmed, sick, sad.
const EMOTIONS = [
  ['sleep', 'sleepy', ['running in the background']],
  ['blink', 'awake', ['the program is open and you have interacted with it recently']],
  ['idle', 'idle', ['the program is open and you haven’t interacted with it recently']],
  ['curious', 'curious', ['an L3 agent requires L4 authorization or input']],
  ['happy', 'happy', ['just pushed new information', 'has an L3 suggestion for a workflow', 'ideas or work ready']],
  ['worried', 'worried', ['missed runtimes', 'missed checks', 'failed audits', 'token overusage']],
  ['alarmed', 'alarmed', ['a connected source reports an active alarm', 'a potential or active security breach']],
  ['sick', 'sick', ['too many broken tools', 'broken pet programs']],
  ['sad', 'sad', ['hasn’t been opened in more than 2 weeks']],
];
const RWX = { yes: 'yes', pr: '🔒 PR', ask: 'asks', grant: '🔑 grant', no: '–' };
const STATE = { now: 'works today', planned: 'planned', idea: 'idea, not agreed yet', suggested: 'suggested', architecture: 'in the architecture' };
const PET_TYPES = new Set(['host', 'pet', 'pipeline']);

export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
export const slug = (s) => String(s).toLowerCase().replace(/['’]/g, '').replace(/&/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const isUrl = (u) => /^https?:\/\//.test(u || '');
const ymd = (iso) => (iso ? String(iso).slice(0, 10).replace(/-/g, '') : null);
const day = (iso) => (iso ? String(iso).slice(0, 10) : null);
const up = (p) => `../../${p}`; // from apps/pet-programs/ back to the hub's root

/** Every picture of the pet, from the hub only: registered frames, then the desktop draft list, then art/drafts, then
 *  its icon. Returns { frames: { mood: hub path }, source } with only the moods that exist. */
export function petFrames(reg, { frameIndex, drafts, exists, list = () => [] }) {
  const pick = (paths, source) => {
    const frames = Object.fromEntries(Object.entries(paths).filter(([, p]) => p && exists(p)));
    return frames.idle ? { frames, source } : null;
  };
  const registered = reg.art && frameIndex?.pets?.[reg.art];
  if (registered && !registered.placeholder) { const r = pick(registered.frames, 'registered'); if (r) return r; }
  const draft = (drafts?.pets || []).find((d) => !d.private && (d.repo === reg.repo || d.id === reg.repo || d.name === reg.pet));
  if (draft?.idle) {
    const m = /^(.*)\/idle(-\d{8})?\.png$/.exec(draft.idle);
    if (m) { const r = pick(Object.fromEntries(MOODS.map((mood) => [mood, `${m[1]}/${mood}${m[2] || ''}.png`])), 'draft'); if (r) return r; }
  }
  for (const folder of [reg.art, draft?.id, reg.repo, slug(reg.pet)].filter(Boolean)) {
    const files = list(`art/drafts/${folder}`);
    const frames = {};
    for (const mood of MOODS) { const f = files.filter((n) => new RegExp(`^${mood}(-\\d{8})?\\.png$`).test(n)).sort().pop(); if (f) frames[mood] = `art/drafts/${folder}/${f}`; }
    if (frames.idle) return { frames, source: 'draft' };
  }
  const icon = list('art/icons').filter((n) => new RegExp(`^${reg.repo}-\\d{8}\\.png$`).test(n)).sort().pop();
  if (icon) return { frames: { idle: `art/icons/${icon}` }, source: 'icon' };
  return { frames: {}, source: 'none' };
}

/** The Farmer's last merged round for this pet (status/pets-status.json). Older keys (vrchat-ai-astra, mommys) are
 *  found through the pet's hub app name. */
function lastRound(status, reg) {
  const keys = [reg.repo, String(reg.interface_local_url || reg.interface_url || '').split('/').pop().replace(/-\d{8}\.html$/, '')];
  for (const k of keys) if (k && status?.pets?.[k]) return { key: k, ...status.pets[k] };
  return null;
}

/** Everything one page needs, worked out from the sources. */
export function pageData({ reg, prog, registry, map, frameIndex, drafts, status, exists, list, skills = [] }) {
  const nodes = new Map(map.nodes.map((n) => [n.id, n]));
  const petNode = nodes.get(reg.repo);
  const homeNode = petNode?.home?.node ? nodes.get(petNode.home.node) : null;
  const mine = new Set([reg.repo, homeNode?.id].filter(Boolean));
  const home = prog.assigned ? prog.program : `pet-program-${prog.number}`;
  const homeSlug = prog.assigned ? slug(prog.program) : `pet-program-${prog.number}`;
  const petSlug = slug(reg.pet);
  const isPrivate = (registry.relations?.private || []).includes(reg.repo);
  const publicRepo = reg.visibility !== 'private';

  // L1: what the pet runs and looks after (links that leave the pet or its program), and its tools.
  const from = map.links.filter((l) => mine.has(l.from) && !mine.has(l.to) && l.state !== 'architecture');
  const item = (n, l) => ({ id: n.id, name: n.name, state: l?.state || n.state || 'now', why: l?.why || n.job || '' });
  const uniq = (arr) => [...new Map(arr.map((x) => [x.id, x])).values()];
  const ofType = (types) => uniq(from.filter((l) => types.includes(nodes.get(l.to)?.type)).map((l) => item(nodes.get(l.to), l)));
  const tools = map.nodes.filter((n) => n.type === 'tool' && mine.has(n.of)).map((n) => ({ ...item(n), label: n.label || `${homeSlug}-v1.0-${n.id}-v1.0` }));

  // L2: tricks the hub knows of (the Farmer's own skills say "The Friendly Farmer's trick").
  const tricks = reg.role === 'host' ? skills.filter((s) => /Friendly Farmer's trick/i.test(s.description)).map((s) => ({ id: s.name, name: s.name, label: `${homeSlug}-v1.0-${s.name}-trick-v1.0`, why: s.description })) : [];

  // L2: connection boxes, one per pet it talks to (pets only; seeds and roadmap pets are not animals yet).
  const talks = new Map();
  for (const l of map.links) {
    if (l.state === 'architecture') continue;
    const out = mine.has(l.from), other = out ? l.to : l.from;
    if (!(out || mine.has(l.to)) || mine.has(other)) continue;
    const o = nodes.get(other);
    if (!o || !PET_TYPES.has(o.type)) continue;
    if (!talks.has(other)) talks.set(other, { id: other, name: o.name, program: o.home?.assigned ? o.home.name : (o.home ? `pet-program-${o.home.number}` : null), number: o.home?.number || null, sends: [], receives: [] });
    talks.get(other)[out ? 'sends' : 'receives'].push({ carries: l.carries, state: l.state, why: l.why || '' });
  }

  // L4: grants from system-map.json, as the map shows them on this pet's card.
  const grants = new Map(map.access.grants.map((g) => [g.id, g]));
  const grantRows = (ids) => ids.map((id) => grants.get(id)).filter(Boolean).map((g) => ({ who: g.who, on: g.on, r: RWX[g.r], w: RWX[g.w], x: RWX[g.x], status: map.access.statuses[g.status]?.name || g.status }));

  const round = lastRound(status, reg);
  const needs = [...new Set([...(round?.needs || []).map((n) => (typeof n === 'string' ? n : n.need || n.label || '')),
    ...(status?.needs_astra || []).filter((n) => n.repo === reg.repo || n.repo === round?.key).map((n) => n.need)].filter(Boolean))];

  const app = reg.interface_live_url || reg.interface_url || null;
  const appHref = !app ? null : app.startsWith(`${PAGES}/apps/`) ? `../${app.slice(`${PAGES}/apps/`.length)}` : isUrl(app) ? app : `../${app.replace(/^apps\//, '')}`;
  const art = petFrames(reg, { frameIndex, drafts, exists, list });
  const lines = moodKey(registry, reg);
  const code = map.nodes.find((n) => n.id === reg.repo)?.code;

  return {
    repo: reg.repo, pet: reg.pet, petSlug, home, homeSlug, number: prog.number, assigned: !!prog.assigned, stage: prog.stage,
    summary: prog.mini_descriptor?.text || reg.job || '', job: reg.job || '', status: reg.status || null, added: reg.added || null,
    visibility: reg.visibility || null, isPrivate, publicRepo, host: reg.role === 'host',
    repoUrl: `https://github.com/${OWNER}/${reg.repo}`, appHref, mapNode: homeNode && !homeNode.private ? homeNode.id : reg.repo,
    art, lines, audit: reg.audit || {}, round, needs, statusUpdated: status?.updated || null,
    thirdParty: ofType(['program']), programs: ofType(['own-program']), devices: ofType(['host-machine']), tools, tricks,
    connections: [...talks.values()], grantsBy: grantRows(petNode?.access?.by || []), grantsOn: grantRows([...new Set([...(petNode?.access?.on || []), ...(homeNode?.access?.on || [])])]),
    languages: code?.languages || [], languageNote: code?.note || null,
  };
}

// ---------- HTML ----------

const lights = (key, name, { planned = false } = {}) => planned
  ? `<span class="lights" title="Not built yet: nothing to switch on or off"><button type="button" class="light planned" disabled aria-label="${esc(name)}: not built yet"></button><button type="button" class="light planned" disabled aria-label="${esc(name)}: not built yet"></button></span>`
  : `<span class="lights"><button type="button" class="light onoff" data-item="${esc(key)}" data-name="${esc(name)}" aria-label="${esc(name)}: on" title="ON/OFF (kill switch): green on, red off"></button><button type="button" class="light care" data-item="${esc(key)}" data-name="${esc(name)}" aria-label="${esc(name)}: working correctly" title="Maintenance: blue working correctly, yellow requires maintenance"></button></span>`;

const tag = (state) => (state && state !== 'now' ? ` <span class="tag">${esc(STATE[state] || state)}</span>` : '');
const built = (state) => !state || state === 'now';

function itemList(items, prefix, empty) {
  if (!items.length) return `<p class="empty">${esc(empty)}</p>`;
  return `<ul class="items">${items.map((i) => `<li>${lights(`${prefix}:${i.id}`, i.name, { planned: !built(i.state) })}<span class="item-name"${i.why ? ` title="${esc(i.why)}"` : ''}>${esc(i.name)}</span>${tag(i.state)}${i.label ? `<code class="label">${esc(i.label)}</code>` : ''}</li>`).join('')}</ul>`;
}

const module = (label, body, { cls = '', light = false, open = true } = {}) =>
  `<details class="module ${cls}"${open ? ' open' : ''}><summary><span class="legend">${esc(label)}</span>${light ? '<span class="activity" title="Activity light. What it means is waiting on Astra (PET-PROGRAM-FRAMEWORK.md, section 3)" aria-label="activity: not decided yet"></span>' : ''}</summary>${body}</details>`;

const img = (path, alt, cls = '') => (path ? `<img${cls ? ` class="${cls}"` : ''} src="${esc(up(path))}" alt="${esc(alt)}" width="256" height="256">` : `<span class="no-art${cls ? ` ${cls}` : ''}">no picture yet</span>`);

function grantTable(rows, empty) {
  if (!rows.length) return `<p class="empty">${esc(empty)}</p>`;
  return `<div class="scroll"><table><thead><tr><th>Who</th><th>On what</th><th>R</th><th>W</th><th>X</th><th>Status</th></tr></thead><tbody>${rows.map((g) => `<tr><td>${esc(g.who)}</td><td>${esc(g.on)}</td><td>${esc(g.r)}</td><td>${esc(g.w)}</td><td>${esc(g.x)}</td><td>${esc(g.status)}</td></tr>`).join('')}</tbody></table></div>`;
}

function connection(c, homeSlug) {
  const flow = (list) => list.length ? `<ul>${list.map((f) => `<li><b>${esc(f.carries)}</b>${tag(f.state)}${f.why ? `: ${esc(f.why)}` : ''}</li>`).join('')}</ul>` : '<p class="empty">nothing</p>';
  return `<fieldset class="connection"><legend>${lights(`connection:${c.id}`, `${c.name} connection`)} ${esc(c.name)}</legend>
<div class="flows"><div><h4>Sends</h4>${flow(c.sends)}</div><div><h4>Receives</h4>${flow(c.receives)}</div></div>
<p class="small">${c.program ? `${esc(c.program)} · <code>${esc(slug(c.program))}-v1.0</code> · ` : ''}scope L4 granted: none recorded yet · last exchange: not recorded yet</p></fieldset>`;
}

export function buildPetProgramPage(d) {
  const f = d.art.frames;
  const idleAlt = `${d.pet}, idle`;
  const map = `../../system-map-20261012.html#node=${encodeURIComponent(d.mapNode)}`;
  const reminder = d.needs[0] ? `Waiting on you: ${d.needs[0]}` : 'Nothing is waiting on you.';
  const config = {
    repo: d.repo, pet: d.pet, home: d.home, homeSlug: d.homeSlug, petSlug: d.petSlug, reminder,
    frames: Object.fromEntries(Object.entries(f).map(([m, p]) => [m, up(p)])),
    lines: { idle: d.lines.idle, blink: d.lines.blink, sad: d.lines.sad },
  };
  const json = JSON.stringify(config).replaceAll('<', '\\u003c');
  const roundLine = d.round
    ? `${esc(day(d.round.checked) || day(d.statusUpdated) || 'date not recorded')}: “${esc(d.round.says || 'no line')}”`
    : 'not checked by a merged round yet';
  const aboutOptions = [`<option value="">the whole program</option>`, ...[...d.tools, ...d.programs, ...d.thirdParty].map((i) => `<option value="${esc(i.label || i.id)}">${esc(i.name)}</option>`)].join('');

  const cyberhome = module(`${d.petSlug}-cyberhome`, `<div class="habitat" title="The desktop pet coming to live here while this page is open is not built yet">
${lights(`program:${d.homeSlug}`, d.home)}
<div class="den">${img(f.idle, idleAlt, 'pet')}</div>
<p class="bubble" id="bubble" aria-live="polite">${esc(d.lines.idle)}</p></div>`, { cls: 'cyberhome' });

  const title = `<div class="title">
<h1>${esc(d.home)} <span class="version" title="The pet program's version comes from its own pet.json; the hub has not recorded it yet">V? // ${esc(ymd(d.added) || DATE)}</span></h1>
<p class="who">${esc(d.pet)}'s pet program · #${esc(d.number)} · ${esc(d.stage)}${d.status ? ` · ${esc(d.status)}` : ''}${d.isPrivate ? ' · private: its data never leaves the PC' : ''}</p>
${module(`${d.homeSlug}-pet-program-quick-summary`, `<p>${esc(d.summary)}</p>`, { cls: 'summary' })}
<p class="actions">${d.appHref ? `<a class="button" href="${esc(d.appHref)}">Open today's app</a>` : '<span class="button off" title="No app is wired up in the hub yet">No app wired up yet</span>'}
<a class="button" href="${esc(map)}">On the System Map</a>${d.publicRepo ? ` <a class="button" href="${esc(d.repoUrl)}">Repo</a>` : ` <span class="button off">${esc(d.repo)} (private repo)</span>`}</p></div>`;

  const L1 = module(`${d.petSlug}-L1-module`, `<div class="columns">
<section><h3>3rd party programs</h3>${itemList(d.thirdParty, 'third-party', 'None on the map yet.')}</section>
<section><h3>Your programs</h3>${itemList(d.programs, 'program', 'None on the map yet.')}</section>
<section><h3>Your tools</h3>${itemList(d.tools, 'tool', 'None on the map yet. Every tool the pet owns is listed here, on main or not merged.')}</section>
${d.devices.length ? `<section><h3>Devices it looks after</h3>${itemList(d.devices, 'device', '')}</section>` : ''}</div>
<p class="small">From the System Map. A grey pair of lights means not built yet. ON/OFF and maintenance are saved in this browser only: the core does not enforce them yet (PET-PROGRAM-FRAMEWORK.md, section 4).</p>`, { cls: 'level', light: true });

  const cadence = d.audit.cadence ? `${d.audit.cadence}, by the Friendly Farmer's round` : 'not set';
  const L2 = module(`${d.petSlug}-L2-module`, `<div class="columns">
<section><h3>Your tricks</h3>${itemList(d.tricks, 'trick', 'None recorded in the hub yet. Skill Scout will keep them.')}</section>
<section><h3>Schedule</h3><ul class="plain"><li>Self-audit: ${esc(cadence)}${d.audit.subject ? ` (${esc(d.audit.subject)})` : ''}</li><li>Weekly backlog run: not set up yet (needs an L3 seat)</li></ul></section>
<section class="wide"><h3>Status line</h3><dl class="status">
<dt>Data</dt><dd>yours, in this browser only</dd>
<dt>Last entry</dt><dd id="last-entry">none yet</dd>
<dt>Updated</dt><dd>page spawned ${esc(DATE)}; the program's own version is not recorded in the hub yet</dd>
<dt>Seat</dt><dd>empty</dd>
<dt>Last check</dt><dd>${roundLine}</dd>
<dt>On the map</dt><dd><a href="${esc(map)}">${esc(d.mapNode)}</a></dd></dl></section></div>
<h3>Pets it talks to</h3>${d.connections.length ? `<div class="connections">${d.connections.map((c) => connection(c, d.homeSlug)).join('')}</div>` : '<p class="empty">No links to other pets yet.</p>'}`, { cls: 'level', light: true });

  const L3 = module(`${d.petSlug}-L3-module`, `<ul class="plain">
<li><b>Seat:</b> empty. No farmhand is seated in ${esc(d.home)} (L3 is not connected).</li>
<li><b>L3 activity:</b> <span class="bubble small-bubble">Nobody is working on ${esc(d.pet)} right now.</span></li>
<li><b>Tricks running now:</b> none</li>
<li><b>Harness skills:</b> none recorded in the hub yet (they belong to the seat, not to the pet)</li>
<li><b>Suggestions for you:</b> none yet</li>
<li><b>Token use:</b> not measured yet (Token Toucan is planned)</li></ul>`, { cls: 'level', light: true });

  const L4 = module(`${d.petSlug}-L4-module`, `<section><h3>Approvals waiting on you</h3>${d.needs.length ? `<ul class="plain">${d.needs.map((n) => `<li>${esc(n)}</li>`).join('')}</ul><p class="small">From the Friendly Farmer's last merged round${d.statusUpdated ? ` (${esc(day(d.statusUpdated))})` : ''}. Approve and decline buttons come with Iron Gates.</p>` : '<p class="empty">Nothing from the Friendly Farmer\'s last merged round.</p>'}</section>
<section><h3>Grants</h3><h4>This pet may</h4>${grantTable(d.grantsBy, 'No grants recorded.')}<h4>Who may reach it</h4>${grantTable(d.grantsOn, 'No grants recorded.')}<p class="small">From system-map.json, the same grants as the map card and PROTECTION-RINGS.md.</p></section>
<section><h3>Keys</h3><p class="empty">No agent keys yet: Iron Gates will issue them and API Fairy will show them (planned).</p></section>
<section><h3>Requires maintenance</h3><ul class="plain" id="maintenance"><li class="empty">Nothing marked yellow in this browser.</li></ul><ul class="plain" id="switched-off"></ul></section>
<section><h3>Pet passport</h3><dl class="status">
<dt>Microchip</dt><dd>not signed yet</dd>
<dt>Pedigree</dt><dd>${d.publicRepo ? `<a href="${esc(d.repoUrl)}">findastra/${esc(d.repo)}</a>` : `findastra/${esc(d.repo)} (private)`}${d.added ? `, added ${esc(d.added)}` : ''}</dd>
<dt>Stamps</dt><dd>installs and updates not recorded yet</dd>
<dt>Vaccination card</dt><dd>no security patches recorded</dd>
<dt>Vet records</dt><dd><a href="https://github.com/${OWNER}/vet-clinic/issues?q=${encodeURIComponent(d.homeSlug)}">vet-clinic tickets</a></dd></dl></section>`, { cls: 'level', light: true });

  const levels = module(`${d.petSlug}-intelligence-levels`, `<p class="legend-key"><span class="key on"></span>on <span class="key off"></span>off <span class="key care"></span>working correctly <span class="key fix"></span>requires maintenance <span class="key planned"></span>not built yet</p>${L1}${L2}${L3}${L4}`, { cls: 'levels' });

  const notes = module(`${d.petSlug}-session-notes`, `<form id="notes" class="notes">
<label for="note-text">notes</label>
<textarea id="note-text" rows="3" placeholder="A note, a bug or a change you want. It goes to the backlog straight away."></textarea>
<div class="note-row"><label>about <select id="note-about">${aboutOptions}</select></label>
<label class="button file">add file<input type="file" id="note-file" multiple></label>
<button type="submit" class="button">submit</button></div>
<p class="small" id="note-files"></p></form>
<details class="backlog"><summary>${esc(d.homeSlug)}-backlog in this browser (<span id="backlog-count">0</span>)</summary><ol id="backlog" reversed></ol>
<p><button type="button" class="button" id="export">export the backlog (JSON)</button></p>
<p class="small">The backlog is saved in this browser, before anything else happens. This browser keeps each file's name and size, not the file itself yet. Export moves it to another device.</p></details>`, { cls: 'session-notes' });

  const emotions = module(`${d.petSlug}-emotions`, `<div class="moods">${EMOTIONS.map(([mood, name, bullets]) => {
    const frame = mood === 'blink' ? f.idle : f[mood];
    return `<figure class="mood"><figcaption><span class="mood-name">${esc(name)}</span><ul>${bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul><q>${esc(d.lines[mood] || '')}</q></figcaption>${img(frame, `${d.pet}, ${name}`, mood === 'blink' ? 'awake' : '')}</figure>`;
  }).join('')}</div><p class="small">Awake shows the idle face blinking until a picture with open eyes is drawn. Drawings are drafts unless Astra approved them.</p>`, { cls: 'emotions' });

  const clicker = module(`${d.petSlug}-clicker-training`, `<dl class="clicks"><dt>one click</dt><dd>show the current reminder</dd><dt>two clicks</dt><dd>open ${esc(d.home)}</dd><dt>three clicks</dt><dd>refresh tools and the tool list</dd></dl>
<p class="small">Clicking the desktop pet runs a tool. More clicks can be bound to more tools.</p>`, { cls: 'clicker' });

  const langs = d.languages.length ? d.languages.map((l) => `${l.language} ${l.percent}%`).join(', ') : (d.languageNote || 'not measured yet');
  const footer = module('astras-pet-os-unified-footer', `<div class="footer-grid">
<p><em>An Intelligent App, or Pet, by Astra.</em> MIT license. Signature: not signed yet.</p>
<p><b>Languages:</b> ${esc(langs)}</p>
<p><b>Home:</b> <a href="${esc(map)}">System Map</a> · <a href="../astras-pet-apps-20261008.html">The Farm</a> · <a href="pet-program-spawner-${DATE}.html">every pet program</a></p>
<p><b>Source:</b> ${d.publicRepo ? `<a href="${esc(d.repoUrl)}">findastra/${esc(d.repo)}</a>` : `findastra/${esc(d.repo)} (private)`}</p>
<p><b>Docs:</b> <a href="https://github.com/${OWNER}/${HUB}/blob/main/PET-PROGRAM-FRAMEWORK.md">PET-PROGRAM-FRAMEWORK.md</a> · <a href="https://github.com/${OWNER}/${HUB}/blob/main/PROTECTION-RINGS.md">PROTECTION-RINGS.md</a></p>
<p class="small">Spawned by the Friendly Farmer's pet program spawner (<code>${TOOL_LABEL}</code>) from pets.json, pet-programs.json and the System Map, ${esc(DATE)}. <code>npm run build</code> rewrites this page; do not edit it by hand.</p></div>`, { cls: 'footer' });

  const chat = `<aside class="chat" aria-label="${esc(d.petSlug)}-chat"><span class="chat-label">${esc(d.petSlug)}-chat</span>${lights(`chat:${d.petSlug}`, `${d.pet}'s chat`)}
<button type="button" class="chat-open" id="chat-open" aria-expanded="false" aria-controls="chat-panel" aria-label="Open ${esc(d.pet)}'s chat bot">&gt;</button>
<div class="chat-panel" id="chat-panel" hidden><p>${esc(d.pet)}'s chat bot is not connected yet: no AI is seated in ${esc(d.home)}. When it is, it asks before it uses your own AI subscriptions.</p><p><a href="#note-text">Leave a session note instead</a></p></div></aside>`;

  return assertPublic(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(d.home)} · ${esc(d.pet)}</title>
<link rel="stylesheet" href="${ASSETS.css}">
</head>
<body>
<main class="page">
<header class="top">${cyberhome}${title}</header>
${levels}
${notes}
<div class="pair">${emotions}${clicker}</div>
${footer}
</main>
${chat}
<script type="application/json" id="pet-program-data">${json}</script>
<script src="${ASSETS.js}"></script>
</body>
</html>
`, pagePath(d.repo));
}

export function buildSpawnerIndex(list) {
  const card = (d) => `<li class="card"><a href="${esc(`${d.repo}-${DATE}.html`)}">${img(d.art.frames.idle, `${d.pet}, idle`, 'thumb')}<span class="card-text"><b>${esc(d.home)}</b><span>${esc(d.pet)} · #${esc(d.number)} · ${esc(d.stage)}</span></span></a></li>`;
  const group = (stage, title) => { const items = list.filter((d) => d.stage === stage); return items.length ? `<h2>${esc(title)} (${items.length})</h2><ul class="cards">${items.map(card).join('')}</ul>` : ''; };
  return assertPublic(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Pet program spawner</title>
<link rel="stylesheet" href="${ASSETS.css}">
</head>
<body>
<main class="page">
<details class="module" open><summary><span class="legend">${TOOL_LABEL}</span></summary>
<h1>Every pet program</h1>
<p>One page for every registered and pipeline pet, spawned by the Friendly Farmer with the minimum every pet program contains: Astra's sketch of 2026-10-18 (<a href="https://github.com/${OWNER}/${HUB}/blob/main/PET-PROGRAM-FRAMEWORK.md">PET-PROGRAM-FRAMEWORK.md</a>, section 3). These are the basics; each pet's page grows from here.</p>
${group('registered', 'Registered')}
${group('pipeline', 'Pipeline')}
<p class="small"><em>An Intelligent App, or Pet, by Astra.</em> Generated by <code>npm run build</code> from pets.json and pet-programs.json; do not edit by hand.</p>
</details>
</main>
</body>
</html>
`, INDEX);
}

// ---------- Sources and writing ----------

function readSkills(root) {
  const dir = `${root}/skills`;
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((n) => existsSync(`${dir}/${n}/SKILL.md`)).sort().map((n) => {
    const text = readFileSync(`${dir}/${n}/SKILL.md`, 'utf8');
    return { name: (/^name:\s*(.+)$/m.exec(text) || [])[1]?.trim() || n, description: (/^description:\s*(.+)$/m.exec(text) || [])[1]?.trim() || '' };
  });
}

export function readSpawnerSources(root = '.') {
  const j = (p) => JSON.parse(readFileSync(`${root}/${p}`, 'utf8'));
  const opt = (p, fallback) => (existsSync(`${root}/${p}`) ? j(p) : fallback);
  return {
    registry: j('pets.json'), programs: j('pet-programs.json').programs, extra: j('system-map.json'),
    frameIndex: opt('art/frames/index.json', { pets: {} }), drafts: opt('desktop-art/desktop-drafts-20261018.json', { pets: [] }),
    status: opt('status/pets-status.json', null), skills: readSkills(root),
    exists: (p) => existsSync(`${root}/${p}`), list: (p) => (existsSync(`${root}/${p}`) ? readdirSync(`${root}/${p}`) : []),
  };
}

/** Every page's data: one per registered and pipeline pet program, matched to its pets.json entry by repo. */
export function spawnerPages(src) {
  const map = systemMapData(src.registry, src.extra, src.programs);
  const regs = [...(src.registry.pets || []), ...(src.registry.pipeline || [])];
  const animals = src.programs.filter((p) => ['registered', 'pipeline'].includes(p.stage));
  const out = [];
  for (const prog of animals) {
    const reg = regs.find((r) => r.repo === prog.repo);
    if (!reg) throw new Error(`Pet program #${prog.number} (${prog.program}) is ${prog.stage} but ${prog.repo} is not in pets.json (Flash Audit A59).`);
    out.push(pageData({ reg, prog, registry: src.registry, map, ...src }));
  }
  for (const r of regs) if (!animals.some((p) => p.repo === r.repo)) throw new Error(`${r.repo} is in pets.json but has no registered or pipeline pet program in pet-programs.json.`);
  return out;
}

/** Every file the spawner writes: { path: html }. */
export function spawnerFiles(src) {
  const pages = spawnerPages(src);
  return { ...Object.fromEntries(pages.map((d) => [pagePath(d.repo), buildPetProgramPage(d)])), [INDEX]: buildSpawnerIndex(pages) };
}

export function writePetProgramPages(root = '.') {
  const files = spawnerFiles(readSpawnerSources(root));
  mkdirSync(`${root}/${DIR}`, { recursive: true });
  for (const [path, html] of Object.entries(files)) writeFileSync(`${root}/${path}`, html);
  return Object.keys(files);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.chdir(fileURLToPath(new URL('..', import.meta.url)));
  const written = writePetProgramPages('.');
  console.log(`Spawned ${written.length - 1} pet program pages and the list (${INDEX}).`);
}
