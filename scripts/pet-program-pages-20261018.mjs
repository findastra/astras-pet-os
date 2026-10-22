// The Friendly Farmer's pet program spawner (`the-farm-v1.0-pet-program-spawner-v1.0`, a tool of The Farm).
// Astra, 2026-10-18: "make sure every single pet app has a pet program spawn page, with just the basics first", with
// her sketch (docs/images/pet-program-page-sketch-20261018.webp): "they need these at a minimum, and more."
// Writes one page per registered and pipeline pet, apps/pet-programs/<repo>-20261018.html, with every tool panel of the
// sketch in its place (PET-PROGRAM-FRAMEWORK.md, section 3) and her answers of the same day: the intelligence levels
// as four stacked tool panels, the lights as buttons. Plus apps/pet-programs/pet-program-spawner-20261018.html, the list.
// Panels, not modules (Astra, 2026-10-19): to a developer a module is a file of code, like this one; a bordered box on
// a page is a panel, and a tool panel since the same day (Astra, 2026-10-19: "I do want all of it to say tool panel instead of just panel"). The R W X panel (Astra, 2026-10-19, option C, "its own panel in each pet program"): what each level
// should be (R W X), then whether that is in code, with the proof of every In code.
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
import { ownerOf, upstream } from './farm-owner-20261020.mjs';

// Astra's PetOS itself (upstream): its site, docs and vet-clinic, which every farm's pages link to. A pet's own repo
// (Source, Pedigree, the Repo button) is on its own account instead: ownerOf (card 058, Part 3).
export const OWNER = upstream().owner;
export const HUB = upstream().hub;
export const PAGES = upstream().pages;
export const DIR = 'apps/pet-programs';
export const DATE = '20261018';
export const INDEX = `${DIR}/pet-program-spawner-${DATE}.html`;
export const ASSETS = { css: `pet-program-page-${DATE}.css`, js: `pet-program-page-${DATE}.js` };
// Developer mode (Astra, 2026-10-19): the installer's choice of words, then the word swap, both in <head> so the page
// knows its words before it is drawn (scripts/developer-words-20261019.mjs).
export const WORDS = ['../words-mode-20261019.js', '../developer-words-20261019.js'];
const wordScripts = WORDS.map((src) => `<script src="${src}"></script>`).join('\n');
export const TOOL_LABEL = 'the-farm-v1.0-pet-program-spawner-v1.0';
export const pagePath = (repo) => `${DIR}/${repo}-${DATE}.html`;
// Every tool panel of the sketch, in the sketch's order; the test checks each page has them all, in this order.
// related-pets (Astra, 2026-10-19: a "related pets" category at the bottom of every pet app) sits above the footer.
// The quick summary is `<home>-quick-summary` and the map box `astras-pet-os-system-map`, the map being the hub's
// (Astra, 2026-10-21, crossing out "pet-program" and writing "astras-pet-os" over "unity-unicorn" on her screenshot).
export const SYSTEM_MAP_LABEL = 'astras-pet-os-system-map';
export const PANELS = ['cyberhome', 'quick-summary', 'system-map', 'intelligence-levels', 'L1-tool-panel', 'L2-tool-panel', 'L3-tool-panel', 'L4-tool-panel', 'rwx-panel', 'session-notes', 'emotions', 'clicker-training', 'related-pets', 'astras-pet-os-unified-footer', 'chat'];

const MOODS = ['idle', 'blink', 'happy', 'curious', 'worried', 'sad', 'sick', 'alarmed', 'sleep'];
// The emotions tool panel in the sketch's own layout: sleepy, awake, idle / curious, happy, worried / alarmed, sick, sad.
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
// The R W X panel: the levels, how sure each status is (a row is only as sure as its weakest grant), and its marks.
const LEVELS = [['L1', 'a program or tool'], ['L2', 'a pet program'], ['L3', 'an AI agent in a seat'], ['L4', 'you, the verified human']];
const RANK = { no: 0, ask: 1, grant: 2, pr: 3, yes: 4 };
const SURE = { planned: 0, written: 1, enforced: 2 };
const MARK = { enforced: '✓', written: '⚠︎', planned: '○' };
const STATE = { now: 'works today', planned: 'planned', idea: 'idea, not agreed yet', suggested: 'suggested', architecture: 'in the architecture' };
const PET_TYPES = new Set(['host', 'pet', 'pipeline']);

export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
export const slug = (s) => String(s).toLowerCase().replace(/['’]/g, '').replace(/&/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const isUrl = (u) => /^https?:\/\//.test(u || '');

/** The pet whose private repo a link goes into, or whose GitHub Pages site it is: a free account has no Pages site for a
 *  private repo, and a private repo opens only for its owner (Astra, 2026-10-20: "i privated most repos"). Null for
 *  anything else. Only what pets.json records; the build asks GitHub nothing. */
export function privateTarget(registry, url) {
  const u = String(url || '');
  const m = u.match(/^https:\/\/github\.com\/([^/]+)\/([^/#?]+)/i) || u.match(/^https:\/\/([^./]+)\.github\.io\/([^/#?]+)/i);
  if (!m) return null;
  const pet = [...(registry.pets || []), ...(registry.pipeline || [])].find((p) => p.repo.toLowerCase() === m[2].toLowerCase());
  return pet && pet.visibility === 'private' && ownerOf(registry, pet.repo).toLowerCase() === m[1].toLowerCase() ? pet.repo : null;
}

/** One line on what an item does, for its pill (Astra, 2026-10-21: "summarize what each program does in here", and a
 *  tool's description on its tool). A program's `does` in system-map.json says it plainly; a tool's or trick's job is
 *  written "A tool of <program> (<kind>): <what it does> (<where it lives>)", so this keeps the middle part. */
export function brief(job) {
  const s = String(job || '').trim();
  const m = /^An? (?:native )?(?:tool|trick|program) of [^:]{1,80}?: (.+)$/.exec(s);
  return (m ? m[1] : s).replace(/\s*\([^()]*\)\.?$/, '.').replace(/\.\.$/, '.');
}

/** The version a page shows (Astra, 2026-10-21: "remember to assign version #s"): the pet's own pet.json `version`,
 *  copied into pets.json by the Farmer's round; a pet whose pet.json has none starts at 0.1.0, assigned by the hub. */
export function versionOf(reg) {
  const full = typeof reg.version === 'string' ? reg.version.trim() : '';
  const core = /^v?(\d+\.\d+(?:\.\d+)?)/.exec(full)?.[1] || null;
  return { core, full, assigned: !!reg.version_assigned };
}
const ymd = (iso) => (iso ? String(iso).slice(0, 10).replace(/-/g, '') : null);
const day = (iso) => (iso ? String(iso).slice(0, 10) : null);
const up = (p) => `../../${p}`; // from apps/pet-programs/ back to the hub's root

/** Every picture of the pet, from the hub only: its desktop drawing, then registered frames, then the desktop draft
 *  list, then art/drafts, then its icon. Returns { frames: { mood: hub path }, source } with only the moods that exist. */
export function petFrames(reg, { frameIndex, drafts, exists, list = () => [] }) {
  const pick = (paths, source) => {
    const frames = Object.fromEntries(Object.entries(paths).filter(([, p]) => p && exists(p)));
    return frames.idle ? { frames, source } : null;
  };
  const newest = (dir) => {
    const files = list(dir);
    const frames = {};
    for (const mood of MOODS) { const f = files.filter((n) => new RegExp(`^${mood}(-\\d{8})?\\.png$`).test(n)).sort().pop(); if (f) frames[mood] = `${dir}/${f}`; }
    return frames;
  };
  // The pet as it looks on the desktop comes first (Astra, 2026-10-20, crossing out the older drawing of Drum Dog on
  // his page while his desktop pet sat beside it): its drawing in desktop-art/<art>/, the newest file of each mood, so
  // the page and the desktop pet are one pet. A drawing the draft list marks private (Claude Bot's) is never used.
  const privateArt = new Set((drafts?.pets || []).filter((d) => d.private).map((d) => d.id));
  for (const folder of [reg.art, reg.repo].filter((x) => x && !privateArt.has(x))) {
    const frames = newest(`desktop-art/${folder}`);
    if (frames.idle) return { frames, source: 'desktop' };
  }
  const registered = reg.art && frameIndex?.pets?.[reg.art];
  if (registered && !registered.placeholder) { const r = pick(registered.frames, 'registered'); if (r) return r; }
  const draft = (drafts?.pets || []).find((d) => !d.private && (d.repo === reg.repo || d.id === reg.repo || d.name === reg.pet));
  if (draft?.idle) {
    const m = /^(.*)\/idle(-\d{8})?\.png$/.exec(draft.idle);
    if (m) { const r = pick(Object.fromEntries(MOODS.map((mood) => [mood, `${m[1]}/${mood}${m[2] || ''}.png`])), 'draft'); if (r) return r; }
  }
  for (const folder of [reg.art, draft?.id, reg.repo, slug(reg.pet)].filter(Boolean)) {
    const frames = newest(`art/drafts/${folder}`);
    if (frames.idle) return { frames, source: 'draft' };
  }
  const icon = list('art/icons').filter((n) => new RegExp(`^${reg.repo}-\\d{8}\\.png$`).test(n)).sort().pop();
  if (icon) return { frames: { idle: `art/icons/${icon}` }, source: 'icon' };
  return { frames: {}, source: 'none' };
}

/** The Farmer's last merged round for this pet (status/pets-status.json). Older keys (vrchat-ai-astra, mommys) are
 *  found through the pet's hub app name. */
function lastRound(status, reg) {
  const keys = [reg.repo, String(reg.app_url || '').split('/').pop().replace(/-\d{8}\.html$/, '')];
  for (const k of keys) if (k && status?.pets?.[k]) return { key: k, ...status.pets[k] };
  return null;
}

/** Everything one page needs, worked out from the sources. */
export function pageData({ reg, prog, registry, map, frameIndex, drafts, status, exists, list }) {
  const nodes = new Map(map.nodes.map((n) => [n.id, n]));
  const petNode = nodes.get(reg.repo);
  const homeNode = petNode?.home?.node ? nodes.get(petNode.home.node) : null;
  const mine = new Set([reg.repo, homeNode?.id].filter(Boolean));
  const home = prog.assigned ? prog.program : `pet-program-${prog.number}`;
  const homeSlug = prog.assigned ? slug(prog.program) : `pet-program-${prog.number}`;
  const petSlug = slug(reg.pet);
  const isPrivate = (registry.relations?.private || []).includes(reg.repo);
  const publicRepo = reg.visibility !== 'private';
  const owner = ownerOf(registry, reg.repo); // its own account: an example pet stays Astra's on another farm

  // L1: what the pet runs and looks after (links that leave the pet or its program), and its tools.
  const from = map.links.filter((l) => mine.has(l.from) && !mine.has(l.to) && l.state !== 'architecture');
  // `picture`: a live picture of what the item makes. Its pill starts open, so the page shows it (Astra's Star Window,
  // 2026-10-19: "I want to see the pet program too with the photostar on it").
  // `embed`: a small tool page that works right on the pet program page, in its own tool panel inside L1 (Astra's Window
  // Star, 2026-10-20: "I want everything to be on the same page").
  // `desc`: what it does, on the pill itself; `why`: what this pet does with it, when it opens.
  const item = (n, l) => ({ id: n.id, name: n.name, state: l?.state || n.state || 'now', why: l?.why || n.job || '', desc: n.does || brief(n.job), url: isUrl(n.url) ? n.url : null, picture: isUrl(n.picture) ? n.picture : null, embed: isUrl(n.embed) ? n.embed : null });
  const uniq = (arr) => [...new Map(arr.map((x) => [x.id, x])).values()];
  const ofType = (types, links = from) => uniq(links.filter((l) => types.includes(nodes.get(l.to)?.type)).map((l) => item(nodes.get(l.to), l)));
  // A tool node may say which side it is on, avatar or world (Astra, 2026-10-19, for Unity Stable: "separate the page by
  // avatar tools vs world tools"); the L1 tool panel then shows the two sides instead of one list.
  const tools = map.nodes.filter((n) => n.type === 'tool' && mine.has(n.of)).map((n) => ({ ...item(n), label: n.label || `${homeSlug}-v1.0-${n.id}-v1.0`, side: SIDES[n.side] ? n.side : null }));
  // Third-party programs also count when one of the pet's tools runs or looks after them (Flash Audit A54), as
  // BetterDiscord does for Discord Damsel's Sticker Manager.
  const toolIds = new Set(tools.map((t) => t.id));
  const viaTools = map.links.filter((l) => toolIds.has(l.from) && !mine.has(l.to) && !toolIds.has(l.to) && l.state !== 'architecture');

  // L2: its native tricks, from the map data (Astra, 2026-10-19: native programs, tools and tricks; never drawn on the map).
  const tricks = map.nodes.filter((n) => n.type === 'trick' && mine.has(n.of)).map((n) => ({ ...item(n), label: n.label || `${homeSlug}-v1.0-${n.id}-trick-v1.0` }));

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

  // Related pets, at the bottom: the same pets as the connection boxes, each with its picture and a link to its own
  // pet program page (Astra, 2026-10-19). Every one of them is a registered or pipeline pet, so its page exists.
  const regs = [...(registry.pets || []), ...(registry.pipeline || [])];
  const rank = { now: 0, planned: 1, idea: 2, suggested: 3 };
  const related = [...talks.values()].map((t) => {
    const r = regs.find((x) => x.repo === t.id);
    const flows = [...t.sends, ...t.receives];
    const state = flows.map((f) => f.state || 'now').sort((a, b) => (rank[a] ?? 9) - (rank[b] ?? 9))[0] || 'now';
    return { id: t.id, pet: t.name, home: t.program, state, why: flows.find((f) => f.why)?.why || '',
      page: r ? `${t.id}-${DATE}.html` : null, idle: r ? petFrames(r, { frameIndex, drafts, exists, list }).frames.idle || null : null };
  }).sort((a, b) => (rank[a.state] ?? 9) - (rank[b.state] ?? 9) || a.pet.localeCompare(b.pet));

  // The R W X panel: grants from system-map.json, as the map shows them on this pet's card. "on" are the grants that
  // reach the pet or its program, "by" the grants it holds; each keeps its levels, R W X, status and evidence.
  const grants = new Map(map.access.grants.map((g) => [g.id, g]));
  const grantRows = (ids) => [...new Set(ids)].map((id) => grants.get(id)).filter(Boolean).map((g) => ({ id: g.id, who: g.who, on: g.on,
    self: g.resources.includes('self'), level: g.level || [], r: g.r, w: g.w, x: g.x, status: g.status, how: g.how, next: g.next || null, evidence: g.evidence || [] }));

  const round = lastRound(status, reg);
  const needs = [...new Set([...(round?.needs || []).map((n) => (typeof n === 'string' ? n : n.need || n.label || '')),
    ...(status?.needs_astra || []).filter((n) => n.repo === reg.repo || n.repo === round?.key).map((n) => n.need)].filter(Boolean))];

  // Today's app (app_url, 2026-10-19): interface_url now opens this page itself, so the button never uses it. An app on
  // the hub's site opens from the hub's own copy, beside this page. An app inside a private repo, or on its Pages site,
  // opens for nobody else, so the button says so instead of leading to "not found" (click-check, 2026-10-20).
  const app = reg.interface_live_url || reg.app_url || null;
  const appPrivate = app && isUrl(app) && !app.startsWith(`${PAGES}/apps/`) ? privateTarget(registry, app) : null;
  const appHref = !app || appPrivate ? null : app.startsWith(`${PAGES}/apps/`) ? `../${app.slice(`${PAGES}/apps/`.length)}` : isUrl(app) ? app : `../${app.replace(/^apps\//, '')}`;
  const art = petFrames(reg, { frameIndex, drafts, exists, list });
  const lines = moodKey(registry, reg);
  const code = map.nodes.find((n) => n.id === reg.repo)?.code;

  return {
    repo: reg.repo, pet: reg.pet, petSlug, home, homeSlug, number: prog.number, assigned: !!prog.assigned, stage: prog.stage,
    summary: prog.mini_descriptor?.text || reg.job || '', job: reg.job || '', status: reg.status || null, added: reg.added || null, version: versionOf(reg),
    visibility: reg.visibility || null, isPrivate, publicRepo, host: reg.role === 'host',
    owner, repoUrl: `https://github.com/${owner}/${reg.repo}`, appHref, appPrivate, mapNode: homeNode && !homeNode.private ? homeNode.id : reg.repo,
    ring: (homeNode && !homeNode.private ? homeNode : petNode)?.ring || null,
    art, lines, audit: reg.audit || {}, round, needs, statusUpdated: status?.updated || null,
    thirdParty: ofType(['program'], [...from, ...viaTools]), programs: ofType(['own-program']), devices: ofType(['host-machine']), tools, tricks,
    connections: [...talks.values()], related,
    access: { on: grantRows([...(petNode?.access?.on || []), ...(homeNode?.access?.on || [])]), by: grantRows(petNode?.access?.by || []),
      statuses: map.access.statuses, values: map.access.values },
    languages: code?.languages || [], languageNote: code?.note || null, clicks: reg.clicks || {},
  };
}

// ---------- HTML ----------

// The paired lights are always buttons you can click (Astra, 2026-10-19: "I'd like them to be interactive so I can
// tell you which tools are working and which ones aren't"). Each click moves a light to its next state and the page
// script shows a bubble saying what that state means. The ON/OFF light is only ever on or off, never grey (Astra,
// 2026-10-21: "the on/off button should never show as gray because those are either on or off"): something not built
// yet is off, and only its maintenance light is grey, not checked yet. A 3rd party program's ON/OFF says whether it
// is running (Astra, 2026-10-21: "I dont have Blender open, so I dont know why it shows green. It needs to detect that
// its on"): nothing watches it yet, so it is red, "not seen running", never a guessed green (`unseen`).
const lights = (key, name, { planned = false, unseen = false } = {}) => {
  const p = (planned ? ' data-planned="1"' : '') + (unseen ? ' data-unseen="1"' : '');
  return `<span class="lights"><button type="button" class="light onoff${planned || unseen ? ' is-off' : ''}" data-item="${esc(key)}" data-name="${esc(name)}"${p} aria-label="${esc(name)}: ${planned ? 'off, not built yet' : unseen ? 'not seen running' : 'on'}" title="ON/OFF (kill switch): click to switch"></button><button type="button" class="light care${planned ? ' is-unset' : ''}" data-item="${esc(key)}" data-name="${esc(name)}"${p} aria-label="${esc(name)}: ${planned ? 'not checked yet' : 'working correctly'}" title="Working correctly or requires maintenance: click to mark"></button></span>`;
};

export const SIDES = { avatar: 'Avatar tools', world: 'World tools' };
// Every heading says how many it holds, and the pet's own things are native (Astra, 2026-10-21: "3rd party programs
// · #", and "3rd Party Programs = L1, Native Programs = L1, Native Tools = L1, Native Tricks = L2").
const heading = (title, items) => `<h3>${esc(title)} · ${items.length}</h3>`;
// Native tools, or Avatar tools and World tools when the pet's tools say which side they are on (tools with no side last).
function toolSections(tools) {
  const empty = 'None recorded yet. Every tool the pet owns is listed here, on main or not merged.';
  if (!tools.some((t) => t.side)) return `<section>${heading('Native tools', tools)}${itemList(tools, 'tool', empty)}</section>`;
  const rest = tools.filter((t) => !t.side);
  const sides = Object.entries(SIDES).map(([side, title]) => {
    const mine = tools.filter((t) => t.side === side);
    return `<section class="side-${side}">${heading(title, mine)}${itemList(mine, 'tool', 'None yet.')}</section>`;
  });
  if (rest.length) sides.push(`<section>${heading('Other native tools', rest)}${itemList(rest, 'tool', '')}</section>`);
  return sides.join('\n');
}

const tag = (state) => (state && state !== 'now' ? ` <span class="tag">${esc(STATE[state] || state)}</span>` : '');
const built = (state) => !state || state === 'now';

// A pill shows its live picture (and starts open) unless the tool works right on the page in its own tool panel.
const showPicture = (i) => !!i.picture && !i.embed;

// A tool that works right on the page: its own tool panel inside L1, labelled with its name on the map.
const embeddedTools = (d) => d.tools.filter((t) => t.embed).map((t) => panel(t.id, `<iframe class="tool-frame" src="${esc(t.embed)}" title="${esc(t.name)}" loading="lazy"></iframe>
<p class="small">${esc(t.name)}: ${esc(d.pet)}'s tool, right here.${t.url ? ` <a href="${esc(t.url)}">Open it on its own page</a>.` : ''}</p>`, { cls: 'tool-embed', id: `${t.id}-tool-panel` })).join('\n');

// Every item is a pill, the same on every page (Astra, 2026-10-19: "those tools need to look the same on each page.
// They need to have like an oval around them ... and those two buttons needs to be on it"): its paired lights, then
// its name, which opens in place to show what it is and, when the map has one, a link to its own page or folder.
// The stylesheet sets the name into the oval's top border, like a panel's label, and keeps the lights inside, below
// that line (Astra, 2026-10-20: "I also want the tool names to be inside of the border line too. Move those indicator
// lights down"). The lights now sit in the border line too, left of the name (Astra, 2026-10-21, drawing them there
// on every tool: "etc."), and the pill says in one line what the item does, without opening it (her screenshot:
// "summarize what each program does in here", and a tool panel's "tool description").
function itemList(items, prefix, empty) {
  if (!items.length) return `<p class="empty">${esc(empty)}</p>`;
  return `<ul class="items">${items.map((i) => {
    const desc = i.desc ? `<span class="item-desc">${esc(i.desc)}</span>` : '<span class="item-desc empty">No description on the System Map yet.</span>';
    const more = `${i.why && i.why !== i.desc ? `<p>${esc(i.why)}</p>` : ''}
<p class="small">${esc(STATE[i.state] || STATE.now)}${i.url ? '' : ' · its own page is not linked on the System Map yet'}</p>${showPicture(i) ? `
<p class="pill-picture"><img src="${esc(i.picture)}" alt="${esc(`${i.name}, as it is live now`)}" width="160" loading="lazy"></p>` : ''}${i.embed ? `
<p><a class="button" href="#${esc(i.id)}-tool-panel">Use it below</a></p>` : i.url ? `
<p><a class="button" href="${esc(i.url)}">Open ${esc(i.name)}</a></p>` : ''}`;
    return `<li class="pill">${lights(`${prefix}:${i.id}`, i.name, { planned: !built(i.state), unseen: prefix === 'third-party' && built(i.state) })}<details class="pill-more"${showPicture(i) ? ' open' : ''}><summary title="Click to open ${esc(i.name)}"><span class="item-name">${esc(i.name)}</span>${tag(i.state)}${desc}${i.label ? `<code class="label">${esc(i.label)}</code>` : ''}</summary><div class="pill-body">${more}</div></details></li>`;
  }).join('')}</ul>`;
}

// A tool panel with an activity light also has its paired lights, left of its label in the border line (Astra,
// 2026-10-21: two lights drawn before `unity-unicorn-L1-tool-panel`, and "make sure this 'on' ... is working correctly
// for all tools and panels"). Nothing comes after the label: the same screenshot brackets the activity light after it
// and moves it left, to the pair. What the activity light showed, the tool panel's own glow still shows.
const panel = (label, body, { cls = '', light = false, open = true, id = '' } = {}) =>
  `<details class="panel ${cls}"${id ? ` id="${esc(id)}"` : ''}${open ? ' open' : ''}><summary title="Click the label to fold or unfold this tool panel">${light ? lights(`panel:${label}`, label) : ''}<span class="legend">${esc(label)}</span></summary>${body}</details>`;

const img = (path, alt, cls = '') => (path ? `<img${cls ? ` class="${cls}"` : ''} src="${esc(up(path))}" alt="${esc(alt)}" width="256" height="256">` : `<span class="no-art${cls ? ` ${cls}` : ''}">no picture yet</span>`);

// The faces the page script switches between (idle first and shown; the others hidden until the script shows them).
const faces = (f, pet, moods, cls) => moods.filter((m) => f[m]).map((m, i) =>
  `<img class="${cls}" data-face="${m}" src="${esc(up(f[m]))}" alt="${esc(`${pet}, ${m === 'blink' ? 'blinking' : m}`)}" width="256" height="256"${i ? ' hidden' : ''}>`).join('');

// ---------- The R W X panel (Astra, 2026-10-19, option C) ----------
// "I think we need a W R X what it should be, then some kind of easy indicator of whether that is reflected in the
// current code", then: "this actually needs to be its own panel in each pet program". Each level shows what it should
// be (R W X), then In code, Rule only or Not built; every In code names its proof.
const rwxBoxes = (g, values) => `<span class="rwx">${['r', 'w', 'x'].map((k) => `<b class="${k} ${esc(g[k])}" title="${esc(`${{ r: 'Read', w: 'Write', x: 'Run (execute)' }[k]}: ${values[g[k]] || g[k]}`)}">${k.toUpperCase()}</b>`).join('')}</span>`;
const mark = (status, statuses) => `<span class="mark ${esc(status)}" title="${esc(`${statuses[status].name}: ${statuses[status].what}`)}">${MARK[status]} ${esc(statuses[status].mark)}</span>`;
const proofOf = (e) => (e.setting ? esc(e.setting) : `<a href="https://github.com/${OWNER}/${HUB}/blob/main/${esc(e.test || e.script)}"><code>${esc(e.test || e.script)}</code></a> (${e.test ? 'test' : 'script'})`);

function grantItem(g, title, a, { level = false } = {}) {
  const st = a.statuses[g.status];
  const lv = level ? `<span class="lv${g.level.length ? '' : ' out'}" title="${esc(g.level.length ? `Held by ${g.level.join(' and ')}` : 'Outside your levels')}">${esc(g.level.join('+') || '—')}</span>` : '';
  return `<details class="grant"><summary>${lv}${rwxBoxes(g, a.values)}<span class="gwho">${esc(title)}</span>${mark(g.status, a.statuses)}</summary>
<p><b>${esc(st.name)}:</b> ${esc(g.how)}</p>${g.evidence.length ? `<p><b>Proof:</b> ${g.evidence.map(proofOf).join('; ')}</p>` : ''}${g.next ? `<p><b>Next (planned):</b> ${esc(g.next)}</p>` : ''}</details>`;
}

function levelRow([lv, word], gs, a) {
  const sum = { r: 'no', w: 'no', x: 'no' };
  gs.forEach((g) => ['r', 'w', 'x'].forEach((k) => { if (RANK[g[k]] > RANK[sum[k]]) sum[k] = g[k]; }));
  const head = `<span class="lv">${lv}</span><span class="should">Should be</span>${rwxBoxes(sum, a.values)}`;
  if (!gs.length) return `<div class="rwx-row none">${head}<span class="gwho">${esc(word)} · nothing here</span></div>`;
  const weakest = gs.map((g) => g.status).sort((x, y) => SURE[x] - SURE[y])[0];
  return `<details class="rwx-row"><summary>${head}<span class="gwho">${esc(word)}</span>${mark(weakest, a.statuses)}</summary>
<div class="rwx-body">${gs.map((g) => grantItem(g, g.self ? `Itself: ${g.on}` : g.who, a)).join('')}</div></details>`;
}

export function rwxPanelBody(d) {
  const a = d.access;
  const key = ['enforced', 'written', 'planned'].map((k) => `<span>${mark(k, a.statuses)} ${esc(a.statuses[k].what)}</span>`).join('');
  return `<p class="small">Should be: what each level may read (R), write (W) and run (X) on ${esc(d.home)}. Then whether that is in code:</p>
<p class="rwx-key">${key}</p>
<h3>Who may use ${esc(d.home)}</h3>
<div class="rwx-rows">${LEVELS.map((l) => levelRow(l, a.on.filter((g) => g.level.includes(l[0])), a)).join('')}</div>
<h3>What ${esc(d.home)} may use</h3>
${a.by.length ? `<div class="rwx-rows">${a.by.map((g) => grantItem(g, g.on.charAt(0).toUpperCase() + g.on.slice(1), a, { level: true })).join('')}</div>` : '<p class="empty">No grants recorded.</p>'}
<p class="small">From system-map.json: the same grants as the map card and PROTECTION-RINGS.md. A row is only as sure as its weakest grant; open it to see each one. <code>npm run build</code> refuses an In code that names no proof, or a proof file that is not in the repo.</p>`;
}

function connection(c, homeSlug) {
  const flow = (list) => list.length ? `<ul>${list.map((f) => `<li><b>${esc(f.carries)}</b>${tag(f.state)}${f.why ? `: ${esc(f.why)}` : ''}</li>`).join('')}</ul>` : '<p class="empty">nothing</p>';
  return `<fieldset class="connection"><legend>${lights(`connection:${c.id}`, `${c.name} connection`)} ${esc(c.name)}</legend>
<div class="flows"><div><h4>Sends</h4>${flow(c.sends)}</div><div><h4>Receives</h4>${flow(c.receives)}</div></div>
<p class="small">${c.program ? `${esc(c.program)} · <code>${esc(slug(c.program))}-v1.0</code> · ` : ''}scope L4 granted: none recorded yet · last exchange: not recorded yet</p></fieldset>`;
}

// ---------- A pet's own panels, beyond the sketch's minimum ----------

// API Fairy's key requests (Astra, 2026-10-19: "show me who is requesting a key, who has a key and who doesn't have a
// key ... if there's a request and it's not being met and I haven't given the key, then I need a link to wherever that
// is that's requesting the key"). The real list never comes from the hub: it stays on Astra's PC, where API Fairy
// (api-fairy-ring-v1.0-key-requests-v1.0) checks each key by name and writes it for this page. Opened anywhere else,
// the panel shows the made-up examples below, marked as examples.
export const KEY_REQUEST_GROUPS = [
  ['waiting', 'waiting-on-you', 'Nothing is waiting on you.'],
  ['has-key', 'has-a-key', 'No key handed over yet.'],
  ['declined', 'declined-or-not-needed', 'Nothing declined.'],
];
export const KEY_REQUEST_SKILL = `https://github.com/${OWNER}/${HUB}/blob/main/skills/key-request/SKILL.md`;
// Made up, so a page on GitHub shows how the panel works without naming any real service Astra uses.
export const KEY_REQUEST_EXAMPLES = [
  { id: 'example-1', group: 'waiting', status: 'requested', asked: '2026-10-19', example: true,
    requester: { kind: 'chat', name: 'Example: a chat working on a pet', pet: null }, provider: 'Example Weather', key_name: 'EXAMPLE_WEATHER_API_KEY',
    where: 'user-env', where_words: 'your user environment variables', for: 'Example only: today\'s weather on a pet program page.', spend_limit: 'the free plan',
    link: KEY_REQUEST_SKILL, found: 'no', found_in: null, note: null },
  { id: 'example-2', group: 'has-key', status: 'given', status_date: '2026-10-18', asked: '2026-10-16', example: true,
    requester: { kind: 'tool', name: 'Example: a pet\'s tool', pet: null }, provider: 'Example Maps', key_name: 'EXAMPLE_MAPS_API_KEY',
    where: 'user-env', where_words: 'your user environment variables', for: 'Example only: maps for a pet.', spend_limit: 'a monthly limit you set',
    link: KEY_REQUEST_SKILL, found: 'yes', found_in: 'your user environment variables', note: null },
  { id: 'example-3', group: 'declined', status: 'declined', status_date: '2026-10-17', asked: '2026-10-17', example: true,
    requester: { kind: 'bot', name: 'Example: a bot other people use', pet: null }, provider: 'Example AI', key_name: '',
    where: 'app', where_words: 'another program\'s own settings', for: 'Example only: wanted your own AI sign-in.', spend_limit: null,
    link: KEY_REQUEST_SKILL, found: 'cannot-see', found_in: 'It goes inside another program\'s own settings, where I can\'t look.', note: 'Declined: a bot other people use runs on its own API key with a spend limit, never your own sign-in.' },
];

function keyRequestsPanel(d) {
  const groups = KEY_REQUEST_GROUPS.map(([id, label, empty]) => `<fieldset class="request-group ${id}"><legend>${esc(label)}</legend><p class="small request-count" data-count="${id}"></p><ul class="requests" data-group="${id}"></ul><p class="empty" data-empty="${id}">${esc(empty)}</p></fieldset>`).join('');
  return panel(`${d.petSlug}-key-requests-tool-panel`, `<p class="small" id="key-requests-source" aria-live="polite">Looking for API Fairy's list on this PC.</p>
<div class="request-groups" id="key-requests">${groups}</div>
<p class="small">A chat, pet or tool that needs a key files a key request for API Fairy (<a href="${esc(KEY_REQUEST_SKILL)}">skills/key-request</a>): who is asking, which provider and key name, what for, the spend limit and a link back to where it asked. Never the key itself. The list stays on Astra's PC: API Fairy reads it, looks for each key by name in Windows' environment variables and the .env files she watches, and fills this panel when this page is opened there. Anywhere else it shows made-up examples.</p>`, { cls: 'key-requests', light: true });
}

// GitHub Aquarium's outstanding items (Astra, 2026-10-21, all recommended: findastra/github-goldfish card 006): what
// waits on Astra on GitHub, counted by group, the first few of each, and the Open button to the Pets Board, the full
// list (too big for a tool panel). The list names private repos, so like API Fairy's it stays on Astra's PC: the tool
// (scripts/outstanding-items-20261021.mjs) writes it there and this panel reads it only when the page is opened there.
export const OUTSTANDING_GROUPS = [
  ['broken', 'broken-on-main', 'Nothing is failing on a main branch.'],
  ['you', 'waiting-on-you', 'Nothing is waiting on you.'],
  ['chat', 'waiting-on-a-chat', 'No chat has anything to fix.'],
  ['close', 'close-or-keep', 'Nothing has gone stale.'],
  ['info', 'being-checked-or-drafts', 'Nothing is being checked.'],
];
export const OUTSTANDING_BOARD = '../pets-board-20261021.html';
const MERGE_ORDER_SKILL = `https://github.com/${OWNER}/${HUB}/blob/main/skills/merge-order/SKILL.md`;
// Made up, so a page on GitHub shows how the panel works without naming any of Astra's repos.
export const OUTSTANDING_EXAMPLES = [
  { group: 'broken', kind: 'job', repo: 'example-pet', title: 'Example: a daily job failed on main', url: MERGE_ORDER_SKILL, does: 'Fix: a chat repairs it; merge its fix first', example: true },
  { group: 'you', kind: 'pull request', repo: 'example-pet', number: 7, title: 'Example: a change that is ready', url: MERGE_ORDER_SKILL, does: 'Merge: say OK in a chat', example: true },
  { group: 'chat', kind: 'pull request', repo: 'example-site', number: 3, title: 'Example: a change with a conflict', url: MERGE_ORDER_SKILL, does: 'Wait: its chat fixes the conflict first', example: true },
  { group: 'info', kind: 'pull request', repo: 'example-site', number: 4, title: 'Example: a draft', url: MERGE_ORDER_SKILL, does: 'Nothing yet: it is a draft', example: true },
];

function outstandingPanel(d) {
  // `g-<id>`: a bare `chat` class would take the chat pill's fixed place on the page.
  const groups = OUTSTANDING_GROUPS.map(([id, label, empty]) => `<fieldset class="request-group outstanding-group g-${id}"><legend>${esc(label)}</legend><p class="small request-count" data-count="${id}"></p><ul class="requests" data-group="${id}"></ul><p class="empty" data-empty="${id}">${esc(empty)}</p></fieldset>`).join('');
  return panel(`${d.petSlug}-outstanding-items-tool-panel`, `<p class="small" id="outstanding-source" aria-live="polite">Looking for the Goldfish's list on this PC.</p>
<div class="request-groups outstanding" id="outstanding-items">${groups}</div>
<p><a class="button" href="${esc(OUTSTANDING_BOARD)}">Open the Pets Board</a> <span class="small">the full list, in the order to act (<a href="${esc(MERGE_ORDER_SKILL)}">skills/merge-order</a>), and every pet in one chart</span></p>
<p class="small">outstanding-items (<code>github-aquarium-v1.0-outstanding-items-v1.0</code>) reads every repo the farm owner owns on GitHub, read only: pull requests ready for your OK, conflicts and failing checks, jobs failing on a main branch, handoff cards that wait on you, branches with work and no pull request, and pull requests nobody has touched for a month. It runs when asked: <code>npm run outstanding-items</code> in the hub folder, or a chat runs it before it gives you a merge chart. The list names private repos, so it stays on this PC and fills this panel only when the page is opened there. Anywhere else it shows made-up examples.</p>`, { cls: 'outstanding-items', light: true });
}


// By Astra. OpenAI Codex (GPT-6), 2026-10-20. No private archive state enters the hub.
function dmArchivePanel(d) {
  const source = d.programs.find(p => p.id === 'dm-archive-review')?.url;
  if (!source) return '';
  return panel(`${d.petSlug}-dm-archive-tool-panel`, `<fieldset class="tool-box"><legend>discord-tower-v1.0-dm-archive-v0.1</legend>
<h3>DM archive review</h3><p>Check and search a conversation saved with DiscordChatExporter. Messages and media stay in the review tab on your computer.</p>
<p class="small">Source prepared · adoption pending. No archive is loaded here. Export and deletion are separate.</p>
<p><a class="button" id="dm-archive-open" href="${esc(source)}">Get the local viewer</a></p>
<p class="small" id="dm-archive-open-note">Download Damsel's repository after the archive review change is merged, then open discord-damsel-archive-review-20261020.html. This public page cannot read your computer's files.</p>
</fieldset>`, { cls: 'dm-archive' });
}


export const PET_PANELS = { 'api-fairy': keyRequestsPanel, 'findastra-discord-presence': dmArchivePanel, 'github-goldfish': outstandingPanel };

// The chat's circle-arrow button (the sketch): a drawn arrow, centred in its circle, that turns down while the chat is
// open. A typed ">" sat off centre (Astra, 2026-10-19: "the shape is a little awkward").
const CHAT_ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 5.5 15.5 12 9 18.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

// The first related pets in the System Map box, under its node (Astra, 2026-10-20: "reserved for other agent links,
// relative, full list below"): up to three, each its picture and name linking to its pet program, then a link down to
// the related pets panel with all of them.
export const MAP_RELATED = 3;
function mapRelated(d) {
  if (!d.related.length) return '';
  const link = (r) => {
    const inner = `${img(r.idle, `${r.pet}, idle`, 'mini')}<span>${esc(r.pet)}</span>`;
    return `<li>${r.page ? `<a href="${esc(r.page)}" title="${esc(r.home || r.pet)}">${inner}</a>` : `<span class="map-related-static">${inner}</span>`}</li>`;
  };
  const more = d.related.length > MAP_RELATED ? `all ${d.related.length} related pets` : 'related pets';
  return `
<ul class="map-related" aria-label="${esc(`Pets ${d.pet} talks to`)}">${d.related.slice(0, MAP_RELATED).map(link).join('')}</ul>
<p class="small map-related-all"><a href="#${esc(d.petSlug)}-related-pets">${more}, below</a></p>`;
}

// The unified footer, as it looked before it turned into a list (Astra, 2026-10-20: "It looked really good ... It was
// listed like an actual aesthetic footer"): Codex's footer-template of 2026-10-14 (Flash Audit A51), drawn by the
// spawner as plain page markup. Centered groups between thin rules, each after a ✦: By Astra and the date (it said
// "Made by Astra"; the credit is "By Astra" since 2026-10-20), Find Out More with her GitHub and TikToks, Take Me Home!
// with the Farmer's icon. The license, languages and the page's links sit above and below them.
const footerIcon = (path) => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${path}"/></svg>`;
const GITHUB_ICON = footerIcon('M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.77-.24.77-.54v-2.09c-3.14.68-3.8-1.33-3.8-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.68.08-.68 1.13.08 1.73 1.16 1.73 1.16 1 1.73 2.63 1.23 3.27.94.1-.73.4-1.23.71-1.51-2.51-.29-5.15-1.26-5.15-5.58 0-1.23.44-2.24 1.16-3.03-.12-.29-.5-1.43.11-2.98 0 0 .95-.3 3.08 1.16A10.7 10.7 0 0 1 12 6.12c.95 0 1.9.13 2.8.38 2.14-1.46 3.08-1.16 3.08-1.16.61 1.55.23 2.69.11 2.98.72.79 1.16 1.8 1.16 3.03 0 4.33-2.65 5.29-5.17 5.57.41.35.77 1.03.77 2.08v3.09c0 .3.2.65.78.54A11.2 11.2 0 0 0 12 .8Z');
const TIKTOK_ICON = footerIcon('M16 2c.4 2.7 1.9 4.3 4.5 4.5v3.4a9 9 0 0 1-4.5-1.4v7.4a6.3 6.3 0 1 1-5.5-6.3v3.5a2.9 2.9 0 1 0 2 2.8V2Z');
// The maker's links under "By Astra": Astra's own GitHub and TikToks, the same on every farm (upstream, card 058, Part 3).
export const FOOTER_LINKS = [
  ['GitHub: Astra', `https://github.com/${OWNER}`, GITHUB_ICON],
  ['Pole TikTok: @astra_on_fire', 'https://www.tiktok.com/@astra_on_fire', TIKTOK_ICON],
  ['VR TikTok: @findastra', 'https://www.tiktok.com/@findastra', TIKTOK_ICON],
];

export function buildPetProgramPage(d) {
  const f = d.art.frames;
  const idleAlt = `${d.pet}, idle`;
  const map = `../../system-map-20261012.html#node=${encodeURIComponent(d.mapNode)}`;
  const reminder = d.needs[0] ? `Waiting on you: ${d.needs[0]}` : 'Nothing is waiting on you.';
  // No picture address goes through the page script: every face it shows is already in the page, and the script only
  // shows or hides them (CodeQL js/xss-through-dom, PR #100). `repoUrl` is the pet's repo on its own account (ownerOf,
  // card 058), for the chat's message, and only when the repo is public: the script never writes an account itself.
  const config = {
    repo: d.repo, pet: d.pet, home: d.home, homeSlug: d.homeSlug, petSlug: d.petSlug, reminder, summary: d.summary,
    lines: { idle: d.lines.idle, blink: d.lines.blink, sad: d.lines.sad },
    repoUrl: d.publicRepo ? d.repoUrl : null,
  };
  const json = JSON.stringify(config).replaceAll('<', '\\u003c');
  const roundLine = d.round
    ? `${esc(day(d.round.checked) || day(d.statusUpdated) || 'date not recorded')}: “${esc(d.round.says || 'no line')}”`
    : 'not checked by a merged round yet';
  const aboutOptions = [`<option value="">the whole program</option>`, ...[...d.tools, ...d.programs, ...d.thirdParty].map((i) => `<option value="${esc(i.label || i.id)}">${esc(i.name)}</option>`)].join('');

  // The cyberhome (Astra, 2026-10-19): empty until the page opens, then the pet moves in from the top corner. The page
  // plays the arrival itself; flying in from the desktop needs Startup Star's link (not built). No star door in it
  // since 2026-10-20 (Astra crossed it out). No bubble in it since 2026-10-21 (Astra: "get rid of this entirely; select
  // from 9 emotions at bottom what to 'light up'"): the mood it showed lights up in the emotions tool panel instead.
  // The cyberhome is always a square, and so is the System Map box.
  const cyberhome = panel(`${d.petSlug}-cyberhome`, `<div class="habitat" title="${esc(d.pet)} moves in when this page opens. Coming straight from the desktop needs Startup Star's link, which is not built yet.">
${lights(`program:${d.homeSlug}`, d.home)}
<div class="den" data-arrival="waiting">${f.idle ? faces(f, d.pet, ['idle', 'blink', 'sad'], 'pet') : img(null, idleAlt, 'pet')}</div></div>`, { cls: 'cyberhome' });

  // The title is one line between the cyberhome and the System Map box, the version always to its right; the page
  // script makes the name smaller until it fits (Astra, 2026-10-20: "that version number and that date need to always
  // stay to the right of the title, no matter how big it is"), and smaller than before (her marked-up screenshot, the
  // same day). Nothing is listed under it: the "<pet>'s pet program · #N · stage · status" line is crossed out there. A private
  // pet still says its data never leaves the PC, in L2's status line and the footer.
  // Name and version stay on one line until the window is too narrow; then the version goes on its own line below
  // (Astra, 2026-10-21: "these always stay together on one line until too collapsed, version line then goes below").
  // The version is the pet's own (versionOf): "remember to assign version #s" (the same screenshot).
  const v = d.version;
  const versionTip = v.core ? (v.assigned ? `Version ${v.core}: the starting version, assigned by the hub. ${d.repo}'s pet.json has no version yet.` : `Version ${v.full}, from ${d.repo}'s pet.json`) : 'No version recorded in the hub yet';
  const title = `<div class="title">
<h1><span class="title-name">${esc(d.home)}</span> <span class="version" title="${esc(versionTip)}">${v.core ? `v${esc(v.core)}` : 'v?'} // ${esc(ymd(d.added) || DATE)}</span></h1>
${panel(`${d.homeSlug}-quick-summary`, `<p>${esc(d.summary)}</p>`, { cls: 'summary' })}</div>`;
  // No buttons under the title (Astra, 2026-10-21: an X over "Open today's app" and one over "Repo" on her screenshot,
  // then "1. A" in her slides): the app and the repo are linked in the footer and in L4's pet passport.
  const appLink = d.appHref ? `<a href="${esc(d.appHref)}">the app it had before</a>` : d.appPrivate ? `its app (private: ${esc(d.appPrivate)})` : 'no app wired up yet';

  // The way back to the System Map, top right, opposite the cyberhome (Astra, 2026-10-19: "There's always going to be
  // a system map link back"; Flash Audit A60). It opens the map on this pet program's own node.
  // A small drawing of rings 0 to 3 with a dot on the ring the program lives on (rings: PROTECTION-RINGS.md).
  const ringR = { 0: 0, 1: 24, 2: 40, 3: 56 }[d.ring] ?? 56;
  // Its label is the hub's (the map is Astra's PetOS's), and its node's id is no longer printed under the link (Astra,
  // 2026-10-21, crossing out "its node: unity-stable"; the link still opens that node).
  const systemMap = panel(SYSTEM_MAP_LABEL, `<a class="map-link" href="${esc(map)}">
<svg class="rings" viewBox="-6 -6 132 132" role="img" aria-label="The System Map's rings, with ${esc(d.home)} on ring ${esc(d.ring ?? '3')}"><circle cx="60" cy="60" r="56"/><circle cx="60" cy="60" r="40"/><circle cx="60" cy="60" r="24"/><circle class="core" cx="60" cy="60" r="8"/><circle class="node" cx="${60 + ringR}" cy="60" r="7"/></svg>
<span>Open ${esc(d.home)} on the System Map</span></a>${mapRelated(d)}`, { cls: 'system-map' });

  const L1 = panel(`${d.petSlug}-L1-tool-panel`, `<div class="columns">
<section>${heading('3rd party programs', d.thirdParty)}${itemList(d.thirdParty, 'third-party', 'None on the map yet.')}</section>
<section>${heading('Native programs', d.programs)}${itemList(d.programs, 'program', 'None on the map yet.')}</section>
${toolSections(d.tools)}
${d.devices.length ? `<section>${heading('Devices it looks after', d.devices)}${itemList(d.devices, 'device', '')}</section>` : ''}</div>
<p class="small">From the System Map. Click a name to open it. Click a light to change it: a bubble says what it means. Something not built yet is off, and a grey maintenance light is not checked yet. ON/OFF and maintenance are saved in this browser only: the core does not enforce them yet (PET-PROGRAM-FRAMEWORK.md, section 4).</p>${embeddedTools(d) ? `\n${embeddedTools(d)}` : ''}`, { cls: 'level', light: true });

  const cadence = d.audit.cadence ? `${d.audit.cadence}, by the Friendly Farmer's round` : 'not set';
  const L2 = panel(`${d.petSlug}-L2-tool-panel`, `<div class="columns">
<section>${heading('Native tricks', d.tricks)}${itemList(d.tricks, 'trick', 'None recorded in the hub yet. Skill Scout will keep them.')}</section>
<section><h3>Schedule</h3><ul class="plain"><li>Self-audit: ${esc(cadence)}${d.audit.subject ? ` (${esc(d.audit.subject)})` : ''}</li><li>Weekly backlog run: not set up yet (needs an L3 seat)</li></ul></section>
<section class="wide"><h3>Status line</h3><dl class="status">
<dt>Data</dt><dd>yours, in this browser only${d.isPrivate ? '. Private: its data never leaves the PC' : ''}</dd>
<dt>Last entry</dt><dd id="last-entry">none yet</dd>
<dt>Updated</dt><dd>page spawned ${esc(DATE)}; ${d.version.core ? `version ${esc(d.version.full)}${d.version.assigned ? ' (the starting version, assigned by the hub)' : ` (from ${esc(d.repo)}'s pet.json)`}` : 'the program\'s own version is not recorded in the hub yet'}</dd>
<dt>Seat</dt><dd>empty</dd>
<dt>Last check</dt><dd>${roundLine}</dd>
<dt>On the map</dt><dd><a href="${esc(map)}">${esc(d.mapNode)}</a></dd></dl></section></div>
<h3>Pets it talks to</h3>${d.connections.length ? `<div class="connections">${d.connections.map((c) => connection(c, d.homeSlug)).join('')}</div>` : '<p class="empty">No links to other pets yet.</p>'}`, { cls: 'level', light: true });

  const L3 = panel(`${d.petSlug}-L3-tool-panel`, `<ul class="plain">
<li><b>Seat:</b> empty. No farmhand is seated in ${esc(d.home)} (L3 is not connected).</li>
<li><b>L3 activity:</b> <span class="bubble small-bubble">Nobody is working on ${esc(d.pet)} right now.</span></li>
<li><b>Tricks running now:</b> none</li>
<li><b>Harness skills:</b> none recorded in the hub yet (they belong to the seat, not to the pet)</li>
<li><b>Suggestions for you:</b> none yet</li>
<li><b>Token use:</b> not measured yet (Token Toucan is planned)</li></ul>`, { cls: 'level', light: true });

  const L4 = panel(`${d.petSlug}-L4-tool-panel`, `<section><h3>Approvals waiting on you</h3>${d.needs.length ? `<ul class="plain">${d.needs.map((n) => `<li>${esc(n)}</li>`).join('')}</ul><p class="small">From the Friendly Farmer's last merged round${d.statusUpdated ? ` (${esc(day(d.statusUpdated))})` : ''}. Approve and decline buttons come with Iron Gates.</p>` : '<p class="empty">Nothing from the Friendly Farmer\'s last merged round.</p>'}</section>
<section><h3>Grants</h3><p class="small">In <a href="#${esc(d.petSlug)}-rwx-panel">${esc(d.petSlug)}-rwx-panel</a>, below: what each level should be (R W X), and whether that is in code.</p></section>
<section><h3>Keys</h3><p class="empty">No agent keys yet: Iron Gates will issue them and API Fairy will show them (planned).</p></section>
<section><h3>Requires maintenance</h3><ul class="plain" id="maintenance"><li class="empty">Nothing marked yellow in this browser.</li></ul><ul class="plain" id="switched-off"></ul></section>
<section><h3>Pet passport</h3><dl class="status">
<dt>Microchip</dt><dd>not signed yet</dd>
<dt>Pedigree</dt><dd>${d.publicRepo ? `<a href="${esc(d.repoUrl)}">${esc(d.owner)}/${esc(d.repo)}</a>` : `${esc(d.owner)}/${esc(d.repo)} (private)`}${d.added ? `, added ${esc(d.added)}` : ''}</dd>
<dt>App</dt><dd>${appLink}</dd>
<dt>Stamps</dt><dd>installs and updates not recorded yet</dd>
<dt>Vaccination card</dt><dd>no security patches recorded</dd>
<dt>Vet records</dt><dd><a href="https://github.com/${OWNER}/vet-clinic/issues?q=${encodeURIComponent(d.homeSlug)}">vet-clinic tickets</a></dd></dl></section>`, { cls: 'level', light: true });

  // A pet's own panels come after the four levels and the R W X panel, so the sketch's order stays as it is.
  const own = PET_PANELS[d.repo] ? `${PET_PANELS[d.repo](d)}\n` : '';

  const levels = panel(`${d.petSlug}-intelligence-levels`, `<p class="legend-key"><span class="key on"></span>on <span class="key off"></span>off <span class="key care"></span>working correctly <span class="key fix"></span>requires maintenance <span class="key planned"></span>not checked yet (click it)</p>${L1}${L2}${L3}${L4}`, { cls: 'levels' });

  const rwx = panel(`${d.petSlug}-rwx-panel`, rwxPanelBody(d), { cls: 'rwx-panel', id: `${d.petSlug}-rwx-panel` });

  const notes = panel(`${d.petSlug}-session-notes`, `<form id="notes" class="notes">
<label for="note-text">notes</label>
<textarea id="note-text" rows="3" placeholder="A note, a bug or a change you want. It goes to the backlog straight away."></textarea>
<div class="note-row"><label>about <select id="note-about">${aboutOptions}</select></label>
<label class="button file">add file<input type="file" id="note-file" multiple></label>
<button type="submit" class="button">submit</button></div>
<p class="small" id="note-files" data-words-keep></p></form>
<details class="backlog"><summary>${esc(d.homeSlug)}-backlog in this browser (<span id="backlog-count">0</span>)</summary><ol id="backlog" reversed data-words-keep></ol>
<p><button type="button" class="button" id="export">export the backlog (JSON)</button></p>
<p class="small">The backlog is saved in this browser, before anything else happens. This browser keeps each file's name and size, not the file itself yet. Export moves it to another device.</p></details>`, { cls: 'session-notes' });

  const emotions = panel(`${d.petSlug}-emotions`, `<div class="moods">${EMOTIONS.map(([mood, name, bullets]) => {
    const picture = mood === 'blink'
      ? (f.idle ? `<span class="awake-faces">${faces(f, d.pet, ['idle', 'blink'], 'awake')}</span>` : img(null, `${d.pet}, ${name}`))
      : img(f[mood], `${d.pet}, ${name}`);
    return `<figure class="mood" data-mood="${esc(mood)}"><fieldset class="mood-bubble"><legend>${esc(name)}</legend><ul>${bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul><q>${esc(d.lines[mood] || '')}</q></fieldset>${picture}</figure>`;
  }).join('')}</div><p class="small">The mood ${esc(d.pet)} is in now lights up (the page knows idle, awake and sad so far). Awake shows the idle face blinking until a picture with open eyes is drawn. Drawings are drafts unless Astra approved them.</p>`, { cls: 'emotions' });

  // Astra, 2026-10-18: one and two clicks are the same for every pet; from three clicks on, each can run a tool. The
  // tools bound so far come from `clicks` in pets.json (2026-10-19: Voicemeeter Bug's repair moved to three clicks).
  const counts = ['three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const bound = Object.entries(d.clicks).filter(([n]) => Number(n) >= 3).sort(([a], [b]) => a - b);
  const assigned = bound.length
    ? bound.map(([n, c]) => `<dt>${esc(counts[n - 3] || n)} clicks</dt><dd>${esc(c.what || c.tool)}${c.label ? ` <code>${esc(c.label)}</code>` : ''}</dd>`).join('\n')
    : '<dt>three clicks</dt><dd>a tool you assign <span class="tag">none assigned yet</span></dd>';
  const clicker = panel(`${d.petSlug}-clicker-training`, `<dl class="clicks"><dt>one click</dt><dd>show the current reminder in a dialog box, like BSOD's blurb <span class="tag">not built yet</span></dd>
<dt>two clicks</dt><dd>open or close ${esc(d.home)}, this page</dd>
${assigned}</dl>
<p class="small">One and two clicks are the same for every pet. From three clicks on, each number of clicks can run one of ${esc(d.home)}'s tools (code, no AI).</p>`, { cls: 'clicker' });

  const relatedCard = (r) => {
    const inner = `${img(r.idle, `${r.pet}, idle`, 'thumb')}<span class="card-text"><b>${esc(r.pet)}</b><span>${esc(r.home || 'pet program not named yet')}${tag(r.state)}</span>${r.why ? `<span>${esc(r.why)}</span>` : ''}</span>`;
    return `<li class="card">${r.page ? `<a href="${esc(r.page)}">${inner}</a>` : `<span class="card-static">${inner}</span>`}</li>`;
  };
  const related = panel(`${d.petSlug}-related-pets`, d.related.length
    ? `<ul class="cards related">${d.related.map(relatedCard).join('')}</ul>
<p class="small">Every pet ${esc(d.pet)} talks to or is planned to, from the relations in pets.json and the System Map (the same pets as the connection boxes in L2). Click one to open its pet program.</p>`
    : `<p class="empty">No related pets yet: ${esc(d.pet)} has no links to other pets on the System Map.</p>`, { cls: 'related-pets', id: `${d.petSlug}-related-pets` });

  const langs = d.languages.length ? d.languages.map((l) => `${l.language} ${l.percent}%`).join(', ') : (d.languageNote || 'not measured yet');
  const made = day(d.added) || `${DATE.slice(0, 4)}-${DATE.slice(4, 6)}-${DATE.slice(6)}`;
  const footer = panel('astras-pet-os-unified-footer', `<footer class="astra-footer" aria-label="By Astra: signature and links">
<p class="footer-status">MIT license · signature: not signed yet${d.isPrivate ? ' · private: its data never leaves the PC' : ''} · ${esc(langs)}</p>
<div class="footer-line">
<div class="footer-group"><span class="footer-title">By Astra</span><time datetime="${esc(made)}">${esc(made)}</time></div>
<div class="footer-group"><span class="footer-title">Find Out More</span><span class="footer-icons">${FOOTER_LINKS.map(([label, href, icon]) => `<a href="${esc(href)}" title="${esc(label)}" aria-label="${esc(label)}">${icon}</a>`).join('')}</span></div>
<div class="footer-group"><span class="footer-title">Take Me Home!</span><a class="footer-home" href="../astras-pet-apps-20261008.html" title="The Farm: the Friendly Farmer" aria-label="The Farm: the Friendly Farmer"><img src="${esc(up('art/icons/astras-pet-os-20261012.png'))}" alt="" width="28" height="28"></a></div>
</div>
<p class="footer-links"><a href="${esc(map)}">System Map</a> · <a href="pet-program-spawner-${DATE}.html">every pet program</a>${d.appHref ? ` · <a href="${esc(d.appHref)}">its app</a>` : ''} · ${d.publicRepo ? `<a href="${esc(d.repoUrl)}">${esc(d.owner)}/${esc(d.repo)}</a>` : `${esc(d.owner)}/${esc(d.repo)} (private)`} · <a href="https://github.com/${OWNER}/${HUB}/blob/main/PET-PROGRAM-FRAMEWORK.md">PET-PROGRAM-FRAMEWORK.md</a> · <a href="https://github.com/${OWNER}/${HUB}/blob/main/PROTECTION-RINGS.md">PROTECTION-RINGS.md</a></p>
<p class="words-switch" data-words-switch></p>
<p class="small footer-spawned">Spawned by the Friendly Farmer's pet program spawner (<code>${TOOL_LABEL}</code>) from pets.json, pet-programs.json and the System Map, ${esc(DATE)}. <code>npm run build</code> rewrites this page; do not edit it by hand.</p></footer>`, { cls: 'footer' });

  // The chat window (Astra, 2026-10-19: "when I open up the chat, it needs to automatically open up the window"): it
  // opens at once and asks who should answer. Your own Claude or ChatGPT open in a new tab with the message typed in;
  // Claude Code or Codex on this PC need Startup Star's link (not built yet). The page keeps no keys.
  const who = [['claude', 'My Claude'], ['chatgpt', 'My ChatGPT'], ['this-pc', 'Claude Code or Codex on this PC'], ['note', 'Just leave a note']];
  const chat = `<aside class="chat" aria-label="${esc(d.petSlug)}-chat"><span class="chat-label">${esc(d.petSlug)}-chat</span>${lights(`chat:${d.petSlug}`, `${d.pet}'s chat`)}
<button type="button" class="chat-open" id="chat-open" aria-expanded="false" aria-controls="chat-panel" aria-label="Open ${esc(d.pet)}'s chat">${CHAT_ARROW}</button>
<div class="chat-panel" id="chat-panel" role="dialog" aria-label="Talk to ${esc(d.pet)}" hidden>
<p class="chat-ask">Who should answer?</p>
<div class="chat-who" role="group" aria-label="Who should answer">${who.map(([k, label]) => `<button type="button" class="button" data-who="${k}" aria-pressed="false">${esc(label)}</button>`).join('')}</div>
<p class="small" id="chat-who-says">Choose who answers. This page remembers it on this device.</p>
<ol class="chat-log" id="chat-log" data-words-keep></ol>
<label class="small" for="chat-text">message</label>
<textarea id="chat-text" rows="3" placeholder="Ask about ${esc(d.home)}"></textarea>
<p class="chat-row"><button type="button" class="button" id="chat-send">Send</button><span class="small" id="chat-status" role="status"></span></p>
${d.isPrivate ? `<p class="small">${esc(d.pet)} is private: a message you send to Claude or ChatGPT leaves this PC. A note stays here.</p>` : ''}</div></aside>`;

  return assertPublic(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(d.home)} · ${esc(d.pet)}</title>
<link rel="stylesheet" href="${ASSETS.css}">
${wordScripts}
</head>
<body>
<main class="page">
<header class="top">${cyberhome}${title}${systemMap}</header>
${levels}
${rwx}
${own}${notes}
<div class="pair">${emotions}${clicker}</div>
${related}
${footer}
</main>
${chat}
<script type="application/json" id="pet-program-data">${json}</script>
${PET_PANELS[d.repo] === keyRequestsPanel ? `<script type="application/json" id="key-request-examples">${JSON.stringify(KEY_REQUEST_EXAMPLES).replaceAll('<', '\\u003c')}</script>\n` : ''}${PET_PANELS[d.repo] === outstandingPanel ? `<script type="application/json" id="outstanding-examples">${JSON.stringify(OUTSTANDING_EXAMPLES).replaceAll('<', '\\u003c')}</script>\n` : ''}<script src="${ASSETS.js}"></script>
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
${wordScripts}
</head>
<body>
<main class="page">
<details class="panel" open><summary><span class="legend">${TOOL_LABEL}</span></summary>
<h1>Every pet program</h1>
<p>One page for every registered and pipeline pet, spawned by the Friendly Farmer with the minimum every pet program contains: Astra's sketch of 2026-10-18 (<a href="https://github.com/${OWNER}/${HUB}/blob/main/PET-PROGRAM-FRAMEWORK.md">PET-PROGRAM-FRAMEWORK.md</a>, section 3). These are the basics; each pet's page grows from here.</p>
${group('registered', 'Registered')}
${group('pipeline', 'Pipeline')}
<p class="small">By Astra. Generated by <code>npm run build</code> from pets.json and pet-programs.json; do not edit by hand.</p>
<p class="words-switch" data-words-switch></p>
</details>
</main>
</body>
</html>
`, INDEX);
}

// ---------- Sources and writing ----------

export function readSpawnerSources(root = '.') {
  const j = (p) => JSON.parse(readFileSync(`${root}/${p}`, 'utf8'));
  const opt = (p, fallback) => (existsSync(`${root}/${p}`) ? j(p) : fallback);
  return {
    registry: j('pets.json'), programs: j('pet-programs.json').programs, extra: j('system-map.json'),
    frameIndex: opt('art/frames/index.json', { pets: {} }), drafts: opt('desktop-art/desktop-drafts-20261018.json', { pets: [] }),
    status: opt('status/pets-status.json', null),
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
