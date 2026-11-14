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
import { socialRowBody } from './social-row-preview-20261022.mjs';
import { roadmapBody, waitingBody, researchBody } from './astral-plane-boxes-20261112.mjs';
import { drawnBox, desktopScale, unionBox, fitVars } from './pet-size-20261023.mjs';
import { vrchatLaunchBody, TOOL as VRCHAT_LAUNCH_TOOL } from './vrchat-launch-panel-20261023.mjs';
import { STICKERS } from './art-kit.mjs';
import { INDICATORS } from './indicators.mjs';
import { readMatrix } from './flash-matrix-20261018.mjs';
import { AUTOMATED as FLASH_AUTOMATED, GOLDFISH_WORDS, STATUSES as FLASH_STATUSES, RUN_MINUTES, latestLedger, checkResults } from './flash-audit-checks-20261108.mjs';
import { TEMPLATE_CHECKS, templateAudit } from './flash-template-20261112.mjs';

// Astra's PetOS itself (upstream): its site, docs and vet-clinic, which every farm's pages link to. A pet's own repo
// (Source, Pedigree, the Repo button) is on its own account instead: ownerOf (card 058, Part 3).
export const OWNER = upstream().owner;
export const HUB = upstream().hub;
export const PAGES = upstream().pages;
export const DIR = 'apps/pet-programs';
export const DATE = '20261018';
export const INDEX = `${DIR}/pet-program-spawner-${DATE}.html`;
export const ASSETS = { css: `pet-program-page-${DATE}.css`, js: `pet-program-page-${DATE}.js` };
// Rift Rabbit's Launch buttons (2026-10-24): the only page script that sends anything, and only to Rift Rabbit's own
// launcher on this PC, so it is its own file and only Rift Rabbit's page loads it (wherever its VRChat setups are drawn).
export const LAUNCHER_JS = 'vrchat-launcher-20261024.js';
// The chat window's link to the pet chat helper on this PC (card 283), on every page, before the page script.
export const PET_CHAT_JS = 'pet-chat-link-20261103.js';
// Drawn cyberhomes (Astra, 2026-11-11, on the GitHub Aquarium app: "this aquarium ... is gonna be the template for the
// cyber home, but much smaller. And every pet program will have one", then "make a little mini version of the cyber home
// in that top left square that fits in that panel"). A pet listed here gets its drawing in the den, behind the pet, and
// its page loads the drawing's own stylesheet; the `<pet>-cyberhome` tool is then built, so its ON/OFF light is on.
// The tool is the cyberhome itself (Astra, the same night: "the tool that is the GitHub Goldfish Cyberhome with the
// buttons on it, that one is going to be the Cyberhome ... essentially just where the pink border is", "give it like a
// cute little antenna"): its frame is the case, its lights in the top edge on the left and an antenna on the right like
// a walkie-talkie's (2026-11-12), and `frame` holds the parts drawn outside the room.
// Every other pet keeps the plain den until its cyberhome is drawn.
export const CYBERHOMES = {
  'github-goldfish': { kind: 'aquarium', css: 'cyberhome-aquarium-20261111.css',
    frame: '<span class="ch-antenna" aria-hidden="true"></span>',
    decor: '<span class="aq-tank" aria-hidden="true"></span><span class="aq-weed w1" aria-hidden="true"></span><span class="aq-weed w2" aria-hidden="true"></span><span class="aq-weed w3" aria-hidden="true"></span><span class="aq-bubble b1" aria-hidden="true"></span><span class="aq-bubble b2" aria-hidden="true"></span><span class="aq-bubble b3" aria-hidden="true"></span>' },
};
export const PRESENCE_JS = '../discord-damsel-presence-control-20261030.js';
// The Flash Audit's Run buttons and newest results on The Farm's page (2026-11-08); the page script itself sends nothing.
export const FLASH_AUDIT_JS = '../flash-audit-control-20261108.js';
// Developer mode (Astra, 2026-10-19): the installer's choice of words, then the word swap, both in <head> so the page
// knows its words before it is drawn (scripts/developer-words-20261019.mjs).
export const WORDS = ['../words-mode-20261019.js', '../developer-words-20261019.js'];
const wordScripts = WORDS.map((src) => `<script src="${src}"></script>`).join('\n');
export const TOOL_LABEL = 'the-farm-v1.0-pet-program-spawner-v1.0';
export const pagePath = (repo) => `${DIR}/${repo}-${DATE}.html`;
// Every tool panel of the sketch, in the sketch's order; the test checks each page has them all, in this order.
// related-pets (Astra, 2026-10-19: a "related pets" category at the bottom of every pet app) sits above the footer;
// since 2026-10-23 it is `<pet>-plays-with`, most used first.
// The quick summary is `<home>-quick-summary-panel` (Astra, 2026-10-23: "wonderland-launchpad-quick-summary-panel"). The two squares beside the title are `<pet>-cyberhome-panel` and
// `<pet>-system-map-panel` (Astra, 2026-10-23: "should be rift-rabbit-system-map-panel and rift-rabbit-cyberhome-panel";
// before, the map box was `astras-pet-os-system-map`). SYSTEM_MAP_LABEL is the part after the pet's name.
export const SYSTEM_MAP_LABEL = 'system-map-panel';
// The live site is the published GitHub Pages copy (any <owner>.github.io): apps/live-site-20261102.js marks it, first
// in <head> before anything is drawn, so the editorial status panel never flashes there: it shows only on a working
// copy (Astra, 2026-11-02).
export const LIVE_CHECK = '<script src="../live-site-20261102.js"></script>';
export const PANELS = ['editorial-status-panel', 'cyberhome-panel', 'quick-summary-panel', 'system-map-panel', 'intelligence-levels-panel', 'L1-control-panel', 'L2-control-panel', 'L3-control-panel', 'L4-control-panel', 'rwx-panel', 'session-notes-panel', 'emotions-panel', 'clicker-training-panel', 'friends-list-panel', 'unified-footer-panel', 'chat-panel'];

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
// Plays-with also shows the pets not hatched yet (Astra, 2026-10-23: "those need to show OSC Sealion", a seed).
const PLAY_TYPES = new Set([...PET_TYPES, 'seed', 'roadmap']);

export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
export const slug = (s) => String(s).toLowerCase().replace(/['’]/g, '').replace(/&/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const isUrl = (u) => /^https?:\/\//.test(u || '');
// A tool page published in this hub is embedded by its path, not its live address, so a working copy shows its own
// working tool and the live site its live one (Astra, 2026-11-02: "I want to look at the page that we're working on
// actively"). Pages sit in apps/pet-programs/, two folders below the hub root.
const hubRelative = (u) => { const live = `https://${OWNER}.github.io/astras-pet-os/`; return u.startsWith(live) ? `../../${u.slice(live.length)}` : u; };

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
/** A tool's short id from its name, id or label: `journal-lagoon-v0.2.0-mood-check-in-v1.0` and `Mood check-in` are
 *  both `mood-check-in`, so a tool on the System Map and the same tool in the pet's pet.json are one tool. */
export function toolKey(s) {
  const k = slug(s || '');
  return (/^.+?-v\d+(?:-\d+)*-([a-z].*?)(?:-v\d+(?:-\d+)*)?$/.exec(k)?.[1] || k.replace(/-v\d+(?:-\d+)*$/, '')) || null;
}

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

/** The pet's id on the desktop, as Startup Star names it: its `art` in pets.json, else its draft's id, else its repo. */
export function desktopId(reg, drafts) {
  if (reg.art) return reg.art;
  return (drafts?.pets || []).find((d) => !d.private && (d.repo === reg.repo || d.id === reg.repo || d.name === reg.pet))?.id || reg.repo;
}

/** The pet at the size the star draws it (Astra, 2026-11-08: "the pets are not the sizes they would appear on the
 *  screen in the corner, so make sure they're the right size"; scripts/pet-size-20261023.mjs): the star crops its idle
 *  and awake drawings together, crisp drawings at alpha 128; the picture is cut to what is drawn in `shown`, the
 *  pictures shown in that place, so they all line up. The CSS variables for img.fit, or null. */
export function fitOf(reg, art, { drafts, measure = () => null }, shown) {
  const plain = art.plain || art.frames;
  if (!plain?.idle) return null;
  const crisp = art.source === 'desktop' || art.source === 'draft' ? 127 : 0;
  const k = desktopScale(desktopId(reg, drafts), unionBox([plain.idle, plain.blink].filter(Boolean).map((p) => measure(p, crisp))));
  return fitVars(k, unionBox(shown.filter(Boolean).map((p) => measure(p, 0))));
}

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
    // The same drawing with its mood sticker stamped on, when the build has made it (build-mood-stickers-20261024.mjs;
    // Astra, 2026-10-24: the nine mood symbols "stay the same across all pets").
    // `plain` keeps the drawing itself, which the pet's height is measured from.
    const plain = { ...frames };
    const stamped = list(`art/moods/${folder}`);
    for (const mood of Object.keys(frames)) if (stamped.includes(`${mood}.png`)) frames[mood] = `art/moods/${folder}/${mood}.png`;
    if (frames.idle) return { frames, plain, source: 'desktop' };
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
  // A pet with no drawing of its own yet takes its newest one from the art review (Astra, 2026-11-08: "a lot of these
  // pets ... the images just aren't there. So you need to go in and get the new stuff"): that round's 256px neutral
  // picture, art/drafts/<review round>/normalized/<pet>-sprite-YYYYMMDD.png (hub #267, round 6 of 2026-10-31). It is a
  // draft until she approves it there, and a pet that has a drawing keeps it.
  const ids = [...new Set([reg.art, draft?.id, reg.pet && slug(reg.pet), reg.repo].filter(Boolean))];
  const reviewed = list('art/drafts').flatMap((round) => list(`art/drafts/${round}/normalized`).map((n) => ({ round, n, m: /^(.+)-sprite-(\d{8})\.png$/.exec(n) })))
    .filter((x) => x.m && ids.includes(x.m[1])).sort((a, b) => a.m[2].localeCompare(b.m[2]) || a.round.localeCompare(b.round)).pop();
  if (reviewed) return { frames: { idle: `art/drafts/${reviewed.round}/normalized/${reviewed.n}` }, source: 'review' };
  // Its icon, by its repo or its pet's name (Skill Scout's icon is skill-scout-*, its repo lunas-log).
  const icon = list('art/icons').filter((n) => [reg.repo, reg.pet && slug(reg.pet)].filter(Boolean).some((id) => new RegExp(`^${id}-\\d{8}\\.png$`).test(n))).sort().pop();
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
export function pageData({ reg, prog, registry, map, frameIndex, drafts, status, exists, list, measure = () => null }) {
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
  // What Inference Iguana's program-watch knows (Astra, 2026-11-07: "Fix all of the buttons in 3rd party programs"):
  // every program its System Map links reach, as a window it opens and closes, or a tool or a driver it only finds
  // (the node's `watch`). A website it does not watch has its own address, `site`, which its light opens in a new tab.
  // A program not installed yet (its node is not `now`) is never watched, even if a link says so: it keeps its "not
  // built yet" (Astra, 2026-11-07, "all recommended"), and Benchmark Rock's table leaves it out too.
  const watched = new Map(map.links.filter((l) => l.from === PROGRAM_WATCH && l.carries === 'manages' && built(nodes.get(l.to)?.state))
    .map((l) => [l.to, WATCH_KINDS.includes(nodes.get(l.to)?.watch) ? nodes.get(l.to).watch : 'window']));
  const item = (n, l) => ({ id: n.id, name: n.name, watch: watched.get(n.id) || null, site: isSite(n.site) ? n.site : null, state: l?.state || n.state || 'now', why: l?.why || n.job || '', desc: n.does || brief(n.job), url: isUrl(n.url) ? n.url : null, picture: isUrl(n.picture) ? n.picture : null, embed: isUrl(n.embed) ? hubRelative(n.embed) : null, frame: n.frame === 'wide' ? 'wide' : null, inL1: n.in_l1 === true, inPill: n.in_pill === true || isUrl(n.embed), pillOpen: (n.in_pill === true || isUrl(n.embed)) && n.start_closed !== true, startClosed: n.start_closed === true, panel: n.panel || null, sharedWith: n.shared_with || null, cadence: n.cadence || null, serial: n.serial || null, group: n.in || null, groupName: (n.in && nodes.get(n.in)?.name) || null });
  const uniq = (arr) => [...new Map(arr.map((x) => [x.id, x])).values()];
  const ofType = (types, links = from) => uniq(links.filter((l) => types.includes(nodes.get(l.to)?.type)).map((l) => item(nodes.get(l.to), l)));
  // A tool node may say which side it is on, avatar or world (Astra, 2026-10-19, for Unity Stable: "separate the page by
  // avatar tools vs world tools"); the L1 tool panel then shows the two sides instead of one list.
  const tools = map.nodes.filter((n) => n.type === 'tool' && mine.has(n.of)).map((n) => ({ ...item(n), label: n.label || `${homeSlug}-v1.0-${n.id}-v1.0`, side: SIDES[n.side] ? n.side : null }));
  // The tools the pet lists in its own pet.json (pets.json `tools`, copied by the Farmer's round: adoptTools; Astra,
  // 2026-11-02: "with their tools read from their own pet.json"), after the map's, unless the map already has them.
  const known = new Set(map.nodes.flatMap((n) => [n.id, n.label, n.name]).map(toolKey).filter(Boolean));
  for (const t of reg.tools || []) {
    const id = toolKey(t.name) || toolKey(t.label);
    if (!id || known.has(id) || known.has(toolKey(t.label))) continue;
    known.add(id);
    const url = t.entry ? `https://github.com/${owner}/${reg.repo}/blob/HEAD/${t.entry.split('/').map(encodeURIComponent).join('/')}` : null;
    const name = t.name && !/-v\d+(?:\.\d+)*-/.test(t.name) ? t.name : id;
    tools.push({ ...item({ id, name, job: t.use || '', does: t.use || '', url, state: t.planned ? 'planned' : 'now' }), label: t.label || `${homeSlug}-v1.0-${id}-v1.0`, side: null });
  }
  // Third-party programs also count when one of the pet's tools runs or looks after them (Flash Audit A54), as
  // BetterDiscord does for Discord Damsel's Sticker Manager.
  const toolIds = new Set(tools.map((t) => t.id));
  const viaTools = map.links.filter((l) => toolIds.has(l.from) && !mine.has(l.to) && !toolIds.has(l.to) && l.state !== 'architecture');
  // And when one of its tricks runs on them (Astra, 2026-11-08, on Discord Tower's page: "I don't see Discord Canary on
  // here"): Discord Damsel's typing-indicator trick runs on Discord Canary.
  const trickIds = new Set(map.nodes.filter((n) => n.type === 'trick' && mine.has(n.of)).map((n) => n.id));
  const viaTricks = map.links.filter((l) => trickIds.has(l.from) && !mine.has(l.to) && !trickIds.has(l.to) && l.state !== 'architecture');

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

  // <pet>-plays-with, at the bottom (Astra, 2026-10-23: "related pets needs to be rift-rabbit-plays-with and those need
  // to show OSC Sealion, etc. and in order of most used to least used. All pet programs need this panel format"): every
  // pet linked to this one on the System Map, seeds and roadmap pets too, but not the every-pet links that are only
  // architecture so far (everyApp; the Friendly Farmer's and the Goldfish's work today, so they stay).
  // How much they are used is not measured yet, so the most used come first by the map: links that work today, then
  // planned, then ideas and suggestions; within each, the pet it shares the most links with. A pet's `plays_with` in
  // pets.json (repo or map ids, most used first) puts those first, in Astra's order.
  const regs = [...(registry.pets || []), ...(registry.pipeline || [])];
  const rank = { now: 0, planned: 1, idea: 2, suggested: 3, architecture: 4 };
  const plays = new Map();
  for (const l of map.links) {
    if (l.everyApp && l.state === 'architecture') continue;
    const out = mine.has(l.from), other = out ? l.to : l.from;
    if (!(out || mine.has(l.to)) || mine.has(other)) continue;
    const o = nodes.get(other);
    if (!o || !PLAY_TYPES.has(o.type)) continue;
    const p = plays.get(other) || { id: other, o, links: 0, state: null, why: '' };
    p.links += 1;
    const state = l.state || 'now';
    if (p.state === null || (rank[state] ?? 9) < (rank[p.state] ?? 9)) p.state = state;
    if (!p.why && l.why) p.why = l.why;
    plays.set(other, p);
  }
  const chosen = (reg.plays_with || []).filter((id) => plays.has(id));
  const order = (id) => { const i = chosen.indexOf(id); return i < 0 ? chosen.length : i; };
  const related = [...plays.values()].map(({ id, o, links, state, why }) => {
    const r = regs.find((x) => x.repo === id);
    const home = o.home?.assigned ? o.home.name : (o.home ? `pet-program-${o.home.number}` : null);
    const who = r || { repo: id, pet: o.name }, its = petFrames(who, { frameIndex, drafts, exists, list });
    return { id, pet: o.name, home, state, why, links,
      page: r ? `${id}-${DATE}.html` : null, idle: its.frames.idle || null, fit: fitOf(who, its, { drafts, measure }, [its.frames.idle]) };
  }).sort((a, b) => order(a.id) - order(b.id) || (rank[a.state] ?? 9) - (rank[b.state] ?? 9) || b.links - a.links || a.pet.localeCompare(b.pet));
  // A line every friend shares says nothing about each one (Astra, 2026-11-08, on the Farmer's page: "a lot of these pets
  // and their descriptions are wrong"): the Friendly Farmer's links to every pet, every roadmap pet and every seed each
  // carry one why. When three or more friends would show the same line, each says what it does instead, the first
  // sentence of its own job: in pets.json, as a seed there, or on the System Map.
  const sameWhy = new Map();
  for (const r of related) if (r.why) sameWhy.set(r.why, (sameWhy.get(r.why) || 0) + 1);
  for (const r of related) {
    if (!r.why || sameWhy.get(r.why) < 3) continue;
    const own = regs.find((x) => x.repo === r.id)?.job || (registry.seeds?.pets || []).find((s) => slug(s.pet) === r.id)?.job || nodes.get(r.id)?.job || '';
    const first = own.split(/(?<=[.!?])\s+/)[0].trim();
    if (first) r.why = first;
  }

  // The R W X panel: grants from system-map.json, as the map shows them on this pet's card. "on" are the grants that
  // reach the pet or its program, "by" the grants it holds; each keeps its levels, R W X, status and evidence.
  const grants = new Map(map.access.grants.map((g) => [g.id, g]));
  const grantRows = (ids) => [...new Set(ids)].map((id) => grants.get(id)).filter(Boolean).map((g) => ({ id: g.id, who: g.who, on: g.on,
    self: g.resources.includes('self'), level: g.level || [], r: g.r, w: g.w, x: g.x, status: g.status, how: g.how, next: g.next || null, evidence: g.evidence || [] }));

  const round = lastRound(status, reg);
  const roundNeeds = [...(round?.needs || []).map((n) => (typeof n === 'string' ? n : n.need || n.label || '')),
    ...(status?.needs_astra || []).filter((n) => n.repo === reg.repo || n.repo === round?.key).map((n) => n.need)].filter(Boolean);
  // A pet's own approvals, from pets.json `waiting_on_you` (Astra, 2026-11-08: "Yes, add them", PC Master Race's
  // licenses and LatencyMon): decisions only you can make that the Farmer's round can't see yet, because the pet's repo
  // is private. Each names the hub card that records it.
  const ownNeeds = (reg.waiting_on_you || []).filter((n) => n && n.need);
  const needs = [...new Set([...roundNeeds, ...ownNeeds.map((n) => n.need)])];
  const needsFrom = [...new Set(ownNeeds.map((n) => (n.card ? `card ${n.card}` : null)).filter(Boolean))];
  // What L3 asks you (L3 control panel): an update the update audit found waits for L4's yes (Astra, 2026-10-24: "have L3
  // ask me if L4 wants to approve update"); nothing is installed until then.
  const asks = Object.entries(reg.checks || {}).filter(([, c]) => c.result === 'update').map(([k, c]) =>
    `Approve the update of ${nodes.get(k.replace(/^[a-z-]+:/, ''))?.name || k}${c.latest ? ` to ${c.latest}` : ''}? ${c.note || ''}`.trim());

  // Today's app (app_url, 2026-10-19): interface_url now opens this page itself, so the button never uses it. An app on
  // the hub's site opens from the hub's own copy, beside this page. An app inside a private repo, or on its Pages site,
  // opens for nobody else, so the button says so instead of leading to "not found" (click-check, 2026-10-20).
  const app = reg.interface_live_url || reg.app_url || null;
  const appPrivate = app && isUrl(app) && !app.startsWith(`${PAGES}/apps/`) ? privateTarget(registry, app) : null;
  const appHref = !app || appPrivate ? null : app.startsWith(`${PAGES}/apps/`) ? `../${app.slice(`${PAGES}/apps/`.length)}` : isUrl(app) ? app : `../${app.replace(/^apps\//, '')}`;
  const art = petFrames(reg, { frameIndex, drafts, exists, list });
  // As big as on the desktop (Astra, 2026-10-23: "needs to be small like the desktop. same size"; 2026-11-08: "make sure
  // they're the right size"): the cyberhome's faces and the nine emotions share one cut, so they all line up.
  const petFit = fitOf(reg, art, { drafts, measure }, Object.values(art.frames));
  const lines = moodKey(registry, reg);
  const code = map.nodes.find((n) => n.id === reg.repo)?.code;
  // The Pet ID's vet records link the vet-clinic's tickets only while its repo is public: a private repo opens for
  // nobody else, so the row says so instead of leading to "not found" (click-check, 2026-10-21). system-map.json's
  // vet-clinic node carries the visibility.
  const vetClinicPrivate = nodes.get('vet-clinic')?.visibility === 'private';

  return {
    repo: reg.repo, pet: reg.pet, petSlug, home, homeSlug, number: prog.number, assigned: !!prog.assigned, stage: prog.stage,
    summary: prog.mini_descriptor?.text || reg.job || '', job: reg.job || '', status: reg.status || null, added: reg.added || null, version: versionOf(reg),
    visibility: reg.visibility || null, isPrivate, publicRepo, host: reg.role === 'host',
    owner, repoUrl: `https://github.com/${owner}/${reg.repo}`, appHref, appPrivate, vetClinicPrivate, mapNode: homeNode && !homeNode.private ? homeNode.id : reg.repo,
    ring: (homeNode && !homeNode.private ? homeNode : petNode)?.ring || null,
    // A colour behind the pet's own pictures, for a pet that is hard to see on the blueprint (Astra, 2026-11-12, Gone
    // Ghost: "give like a background color for the ghosts. Maybe it's like spooky green"). `backdrop` in pets.json, a
    // #rrggbb colour only.
    backdrop: /^#[0-9a-f]{6}$/i.test(reg.backdrop || '') ? reg.backdrop : null,
    art, petFit, lines, audit: reg.audit || {}, round, needs, needsFrom, needsFromRound: roundNeeds.length > 0, asks, statusUpdated: status?.updated || null,
    // A program made with someone else is "Shared" (Astra, 2026-10-22, answer 4: A: My Avatar Closet is "technically both").
    thirdParty: ofType(['program'], [...from, ...viaTools, ...viaTricks]).filter((i) => !i.sharedWith), programs: ofType(['own-program']).filter((i) => !i.sharedWith),
    shared: [...ofType(['program'], [...from, ...viaTools, ...viaTricks]), ...ofType(['own-program'])].filter((i) => i.sharedWith),
    skills: (reg.harness_skills || []).map((s) => ({ id: s.name, name: s.name, state: 'now', desc: s.does, why: `${s.harness}, matched in Skill Scout’s catalog`, url: null })),
    devices: ofType(['host-machine']), tools, tricks,
    connections: [...talks.values()], related, plays_with: chosen,
    access: { on: grantRows([...(petNode?.access?.on || []), ...(homeNode?.access?.on || [])]), by: grantRows(petNode?.access?.by || []),
      statuses: map.access.statuses, values: map.access.values },
    languages: code?.languages || [], languageNote: code?.note || null, clicks: reg.clicks || {}, editorial: reg.editorial || null, checks: reg.checks || {},
  };
}

// ---------- HTML ----------

// The paired lights are always buttons you can click (Astra, 2026-10-19: "I'd like them to be interactive so I can
// tell you which tools are working and which ones aren't"). Each click moves a light to its next state and the page
// script shows a bubble saying what that state means. The ON/OFF light is only ever on or off, never grey (Astra,
// 2026-10-21: "the on/off button should never show as gray because those are either on or off"): something not built
// yet is off, and only its maintenance light is grey, not checked yet. A 3rd party program's ON/OFF says whether it
// is running (Astra, 2026-10-21: "I dont have Blender open, so I dont know why it shows green. It needs to detect that
// its on"): it is drawn red, "not seen running", never a guessed green (`unseen`), and the page turns it green when
// Inference Iguana's program-watch says it is open (Astra, 2026-10-23: "most of my vrchat programs are launched right now
// and I am not seeing the green lights"), even while the pet's own link to it is only planned.
// The second light shows what a check found (Astra, 2026-10-24: "they need to all be checked if they work or not by
// you"): the pet's `checks` in pets.json, keyed like the lights (`third-party:steamvr`, `device:vive-tracker-09`,
// `tool:rift-rabbit-system-map`), each { result: works | issues | update | missing, note, on }. buildPetProgramPage sets
// CHECKS for the page it is drawing; the page script turns them into blue, yellow, orange or grey.
let CHECKS = {};
const checkAttrs = (key) => {
  const c = CHECKS[key];
  if (!c || !c.result) return '';
  const note = [c.note, c.on ? `(checked ${c.on})` : ''].filter(Boolean).join(' ');
  return ` data-check="${esc(c.result)}"${note ? ` data-check-note="${esc(note)}"` : ''}`;
};
const careOf = (key, planned, unseen) => {
  const r = CHECKS[key]?.result;
  return r === 'missing' || (planned && !unseen && !r) ? ['is-unset', 'not created'] : r === 'works' ? ['', 'checked, works']
    : r === 'update' ? ['is-update', 'update waiting for your approval'] : ['is-fix', 'report issues'];
};
// What the ON/OFF light does today, said on the light itself (Astra, 2026-11-08, deck "The Farm: art and lights", answer
// 2: A, "say so on the light now, real switches tool by tool"): a 3rd party program's opens and closes it through
// Inference Iguana's watch, a device's shows what SteamVR sees, and any other only keeps her choice in this browser,
// because nothing on the PC reads it yet.
export const ONOFF_SAYS = 'ON/OFF: your choice, saved in this browser. Nothing on the PC switches yet.';
// A 3rd party program's ON/OFF light is also its button (Astra, 2026-11-07): `data-watch` says what program-watch does
// with it (window: opens and closes it; tool or driver: says whether it is installed), `data-site` the website a press
// opens in a new tab. The page script never takes either from anywhere but here.
export const PROGRAM_WATCH = 'program-watch';
export const WATCH_KINDS = ['window', 'tool', 'driver'];
const isSite = (u) => typeof u === 'string' && /^https:\/\/[^\s"'<>\\]+$/.test(u);
// A device's light (Astra, 2026-11-12): a VR device is green while SteamVR has it on; the desk's USB devices (the
// same list as Benchmark Rock's UsbDevices) are green while Windows has them plugged in.
export const USB_DEVICES = ['akai-apc64', 'razer-seiren-v3-chroma'];
const deviceTip = (key) => (USB_DEVICES.includes(key.replace(/^device:/, '')) ? 'ON/OFF: green while it is plugged in' : 'ON/OFF: green while SteamVR has it on');
const lights = (key, name, { planned = false, unseen = false, presence = false, watch = null, site = null } = {}) => {
  const p = (planned ? ' data-planned="1"' : '') + (unseen ? ' data-unseen="1"' : '');
  const button = (watch ? ` data-watch="${esc(watch)}"` : '') + (site ? ` data-site="${esc(site)}"` : '') +
    (/^device:/.test(key) && USB_DEVICES.includes(key.replace(/^device:/, '')) ? ' data-usb="1"' : '');
  const [careClass, careSays] = careOf(key, planned, unseen);
  return `<span class="lights"><button type="button" class="light onoff${planned || unseen || presence ? ' is-off' : ''}" data-item="${esc(key)}" data-name="${esc(name)}"${p}${presence ? ' data-presence-managed="1"' : ''} aria-label="${esc(name)}: ${watch === 'tool' || watch === 'driver' ? 'not found' : presence || unseen ? 'not seen running' : planned ? 'off, not built yet' : 'on'}" title="${presence ? 'Live Discord sharing: use the presence controls above' : watch === 'window' ? 'Red: press to open it. Green: press to close it, after you say yes' : watch ? 'Green while it is installed: press to see what it is' : site ? 'A website: press to open it in a new tab' : /^device:/.test(key) ? deviceTip(key) : ONOFF_SAYS}"${button}></button><button type="button" class="light care${careClass ? ` ${careClass}` : ''}" data-item="${esc(key)}" data-name="${esc(name)}"${p}${checkAttrs(key)} aria-label="${esc(name)}: ${careSays}" title="Checked and works, report issues, update waiting, or not created: click to report an issue"></button></span>`;
};

export const SIDES = { avatar: 'Avatar tools', world: 'World tools' };
// Every heading says how many it holds, and the pet's own things are native (Astra, 2026-10-21: "3rd party programs
// · #", and "3rd Party Programs = L1, Native Programs = L1, Native Tools = L1, Native Tricks = L2").
const heading = (title, items) => `<h3>${esc(title)} · ${items.length}</h3>`;
// Native tools, or Avatar tools and World tools when the pet's tools say which side they are on (tools with no side last).
// The devices in groups, each its own list, so a group never breaks across another's columns (Astra, 2026-10-24: "can
// you group the trackers, base stations, headsets, etc. so they dont break across columns?"): headsets first, then each
// group by its System Map parent (Valve Index controllers, the Vive Trackers, the base stations), in the map's order.
function deviceGroups(devices) {
  const groups = new Map(), names = {};
  for (const dv of devices) {
    const key = dv.group || (/quest|headset|hmd/i.test(`${dv.id} ${dv.name}`) ? 'headsets' : 'other');
    if (!groups.has(key)) groups.set(key, []);
    if (dv.groupName) names[key] = dv.groupName;
    groups.get(key).push(dv);
  }
  const order = [...groups.keys()].sort((a, b) => (a === 'headsets' ? -1 : b === 'headsets' ? 1 : a === 'other' ? 1 : b === 'other' ? -1 : 0));
  return order.map((key) => `<h4 class="device-group">${esc(key === 'headsets' ? 'Headsets' : key === 'other' ? 'Other devices' : names[key] || key)} · ${groups.get(key).length}</h4>${itemList(groups.get(key), 'device', '')}`).join('');
}

// A toolset from the System Map (Astra, 2026-10-24: "control panels have tools and toolsets in side them"; 2026-11-02,
// all recommended: the spawner draws one from data, for any pet): a tool whose own tools name it with `in`, the way a
// device names its group. It is a rounded tool box with its lights and its name, its one line and its label, and its
// tools as pills inside; it takes the whole row after the other tools, and folds closed with `start_closed`.
function toolList(tools, empty) {
  const ids = new Set(tools.map((t) => t.id));
  const sets = tools.filter((s) => tools.some((t) => t.group === s.id));
  const plain = tools.filter((t) => !sets.includes(t) && !(t.group && ids.has(t.group)));
  const boxes = sets.map((s) => toolBox(s.id, s.name, `${s.desc ? `<p class="small">${esc(s.desc)}</p>` : ''}${s.label ? `<code class="label">${esc(s.label)}</code>` : ''}
${itemList(tools.filter((t) => t.group === s.id), 'tool', '')}`, { open: !s.startClosed, cls: 'toolset' }));
  return `${plain.length || !boxes.length ? itemList(plain, 'tool', empty) : ''}${boxes.length ? `<div class="toolboxes">${boxes.join('\n')}</div>` : ''}`;
}

// `first`: the extra tool boxes go above the list (GitHub Aquarium's important tools).
function toolSections(tools, extra = '', extraCount = 0, { first = false } = {}) {
  const empty = 'None recorded yet. Every tool the pet owns is listed here, on main or not merged.';
  const list = tools.length || !extra ? toolList(tools, empty) : '';
  if (!tools.some((t) => t.side)) return `<section><h3>Native tools · ${tools.length + extraCount}</h3>${first ? extra + list : list + extra}</section>`;
  const rest = tools.filter((t) => !t.side);
  const sides = Object.entries(SIDES).map(([side, title]) => {
    const mine = tools.filter((t) => t.side === side);
    return `<section class="side-${side}">${heading(title, mine)}${toolList(mine, 'None yet.')}</section>`;
  });
  if (rest.length) sides.push(`<section>${heading('Other native tools', rest)}${toolList(rest, '')}</section>`);
  return sides.join('\n');
}

// A tool with parts of its own (a toolset) inside a control panel: a round box with the tool background, its lights
// and its name inside on the first row, like the VRChat setups' headset boxes, and it folds to that row (Astra,
// 2026-10-24: "control panels have tools and toolsets in side them"; panels keep square corners, tools are round).
const toolBox = (key, name, body, { open = true, fold = true, cls = '' } = {}) => `<div class="toolbox${cls ? ` ${cls}` : ''}${open ? '' : ' is-folded'}"><div class="toolbox-head">${lights(`tool:${key}`, name)}${fold
  ? `<button type="button" class="toolbox-fold toolbox-name" aria-expanded="${open}">${esc(name)}</button>` : `<span class="toolbox-name">${esc(name)}</span>`}</div>
<div class="toolbox-body">${body}</div></div>`;

const tag = (state) => (state && state !== 'now' ? ` <span class="tag">${esc(STATE[state] || state)}</span>` : '');
const built = (state) => !state || state === 'now';

// A pill shows its live picture (and starts open) unless the tool works right on the page in its own tool panel.
const showPicture = (i) => !!i.picture && !i.embed;

// A tool that works right on the page: its own tool panel inside L1, labelled with its name on the map. A `frame: "wide"`
// tool fills the panel's width (Bass & Biscuits' APC64 deck, Astra 2026-11-02: "build that right on the base and
// biscuit"); `allow="midi"` lets it hear a controller plugged into this PC after the browser asks.
// `in_l1: true` puts it inside the L1 control panel with the other tools instead of above the levels (Astra, 2026-11-02,
// of the APC64 deck: "remember this is a tool... its not above it"; tools "under L1").
// `in_pill: true` goes further: no panel at all, the tool works inside its own rounded tool box in L1, which starts open
// (Astra, 2026-11-02, of the APC64 board: "that board needs to be within a tool... the tool should look like any other
// tool we see on here. So use that like curved border, and then put it in there"; "that shouldn't be its own panel").
// No tool that works on the page has a panel of its own (Astra, 2026-11-02: "No special panels"; the APC64 board: "that
// shouldn't be its own panel"): every tool with an `embed` is a pill that holds it, in its own tool box in L1.

// Every item is a pill, the same on every page (Astra, 2026-10-19: "those tools need to look the same on each page.
// They need to have like an oval around them ... and those two buttons needs to be on it"): its paired lights, then
// its name, which opens in place to show what it is and, when the map has one, a link to its own page or folder.
// The stylesheet sets the name into the oval's top border, like a panel's label, and keeps the lights inside, below
// that line (Astra, 2026-10-20: "I also want the tool names to be inside of the border line too. Move those indicator
// lights down"). The lights now sit in the border line too, left of the name (Astra, 2026-10-21, drawing them there
// on every tool: "etc."), and the pill says in one line what the item does, without opening it (her screenshot:
// "summarize what each program does in here", and a tool panel's "tool description"). Since 2026-10-23 there is no
// dropdown arrow: clicking the pill shows or hides the rest, and an Open it button inside goes to the item itself.
function itemList(items, prefix, empty) {
  if (!items.length) return `<p class="empty">${esc(empty)}</p>`;
  return `<ul class="items">${items.map((i) => {
    // A device's serial number is the first thing it shows when opened (Astra, 2026-10-24: "I need the first thing I
    // see to be the tracker serial #"): the System Map node's `serial`.
    const serial = i.serial ? `<span class="item-serial">Serial <code>${esc(i.serial)}</code></span>` : '';
    const desc = serial + (i.desc ? `<span class="item-desc">${esc(i.desc)}</span>` : '<span class="item-desc empty">No description on the System Map yet.</span>');
    // Clicking anywhere on the pill opens it, name included, like Halo List's (Astra, 2026-10-23: "Get rid of the arrow
    // drop down. I like how Halo List has it for the info expansion, just clicking the bubble opens it"), so its own
    // page or panel is a button inside.
    const inPanel = i.embed && !i.inPill;
    const href = inPanel ? `#${i.id}-tool-panel` : i.url;
    const open = href ? `\n<p><a class="button" href="${esc(href)}"${i.inPill ? ' target="_blank" rel="noopener"' : ''}>${esc(inPanel ? 'Use it below' : i.inPill ? 'Open it full screen' : 'Open it')}</a></p>` : '';
    const tool = i.inPill && i.embed ? `\n<div class="pill-tool" id="${esc(i.id)}"><iframe class="tool-frame${i.frame ? ` ${i.frame}` : ''}" src="${esc(i.embed)}" title="${esc(i.name)}" allow="midi; autoplay"${i.pillOpen ? "" : " loading=\"lazy\""}></iframe></div>` : '';
    const more = i.more != null ? `<p class="small">${esc(i.more)}</p>` : `${i.why && i.why !== i.desc ? `<p>${esc(i.why)}</p>` : ''}
<p class="small">${esc(STATE[i.state] || i.state || STATE.now)}${href ? '' : ' · its own page is not linked on the System Map yet'}</p>${showPicture(i) ? `
<p class="pill-picture"><img src="${esc(i.picture)}" alt="${esc(`${i.name}, as it is live now`)}" width="160" loading="lazy"></p>` : ''}${tool}${open}`;
    const name = `<span class="item-name">${esc(i.name)}</span>`;
    // Something waiting for your OK (what L3 asks you) has one light, the legend's orange "update waiting for your OK",
    // and no switch: it is a question, not a tool you turn on or off.
    const pillLights = i.waiting
      ? `<span class="lights"><span class="light care is-update" role="img" aria-label="${esc(i.name)}: waiting for your OK" title="Waiting for your OK"></span></span>`
      : lights(`${prefix}:${i.id}`, i.name, { planned: !built(i.state), unseen: prefix === 'third-party' || prefix === 'device', watch: prefix === 'third-party' ? i.watch : null, site: prefix === 'third-party' ? i.site : null, presence: prefix === 'program' && ['openai-discord-presence', 'anthropic-discord-presence'].includes(i.id) });
    // Its state ("planned" and so on) shows only once it is opened, in the line above (Astra, 2026-10-23: "the
    // "planned" should only show up upon expansion").
    return `<li class="pill">${pillLights}${name}${i.cadence ? ` <span class="tag cadence" title="How often it runs">${esc(i.cadence)}</span>` : ''}${desc}${i.label ? `<code class="label">${esc(i.label)}</code>` : ''}<details class="pill-more"${showPicture(i) || i.pillOpen ? ' open' : ''}><summary aria-label="More about ${esc(i.name)}"></summary><div class="pill-body">${more}</div></details></li>`;
  }).join('')}</ul>`;
}

// A tool panel with an activity light also has its paired lights, left of its label in the border line (Astra,
// 2026-10-21: two lights drawn before `unity-unicorn-L1-control-panel`, and "make sure this 'on' ... is working correctly
// for all tools and panels"). Nothing comes after the label: the same screenshot brackets the activity light after it
// and moves it left, to the pair. What the activity light showed, the tool panel's own glow still shows.
// `key`: where its lights are saved, when the label alone is the same on every page (`grants`, `keys`, `pet-id`).
// Since 2026-10-23 no panel has lights: only tools do (Astra: "panels cant have lights. only tools can"). A panel's
// label has a small arrow after it that shows it folds, like Halo List's ("see how these are collapsable and the dots
// are not on them"). `light` and `key` are still accepted from older callers and do nothing.
// Only the main body's panels fold (Astra, 2026-11-08: "there's some drop down arrows in every panel that it needs to
// be on only like the main body panels, not the top ones or the bottom ones, and definitely not the unified footer").
// The top ones (L3's note, the cyberhome, the quick summary, the System Map box) and the bottom ones (the friends list,
// the unified footer) are made with `fold: false`: always open, no arrow after the label, and the label is no tab stop.
// They stay <details> boxes marked `data-stays-open`, so they look exactly as before; the page script keeps them open.
const panel = (label, body, { cls = '', open = true, id = '', fold = true } = {}) =>
  `<details class="panel ${cls}"${id ? ` id="${esc(id)}"` : ''}${fold ? '' : ' data-stays-open'}${open || !fold ? ' open' : ''}><summary${fold ? ' title="Click the label to fold or unfold this tool panel"' : ' tabindex="-1"'}><span class="legend">${esc(label)}</span></summary>${body}</details>`;

// The words at the end of a panel that say how it works fold away behind an arrow, closed until you open them (Astra,
// 2026-10-22: "each of these blurbs at the end of each panel need arrows that show/hide it as a drop down").
// Every panel has one, the catch-all, with the same four lines in the same order (Astra, 2026-11-03, Flash Audit deck,
// answer 8: A): how it works, where it comes from, your rules (dated, with a link to this framework) and what is not
// built yet. In the chat box only the arrow shows until it is opened. The three boxes at the top (the cyberhome, the
// quick summary and the System Map box) have none (2026-11-06). A tool box inside a panel keeps its one paragraph.
const FRAMEWORK_URL = `https://github.com/${OWNER}/${HUB}/blob/main/PET-PROGRAM-FRAMEWORK.md#3-the-page-top-to-bottom`;
const yourRules = (item, html) => `${html} (<a href="${FRAMEWORK_URL}">PET-PROGRAM-FRAMEWORK.md</a>, section 3${item === undefined ? '' : `, item ${item}`}).`;
const ABOUT_LINES = [['how', 'How it works'], ['from', 'Where it comes from'], ['rules', 'Your rules'], ['notYet', 'Not built yet']];
const about = (html, { arrow = false } = {}) => (typeof html === 'string'
  ? `<details class="about"><summary>More details</summary><p class="small">${html}</p></details>`
  : `<details class="about${arrow ? ' arrow-only' : ''}"><summary${arrow ? ' title="More details" aria-label="More details"' : ''}>${arrow ? '' : 'More details'}</summary><dl class="small about-lines">${ABOUT_LINES.map(([k, name]) => `<dt>${name}</dt><dd>${html[k]}</dd>`).join('')}</dl></details>`);

// `fit`: the CSS variables that draw the pet at its desktop size (fitOf), or nothing for a picture that is not one.
const img = (path, alt, cls = '', fit = null) => (path ? `<img${cls || fit ? ` class="${[cls, fit ? 'fit' : ''].filter(Boolean).join(' ')}"` : ''}${fit ? ` style="${fit}"` : ''} src="${esc(up(path))}" alt="${esc(alt)}" width="256" height="256">` : `<span class="no-art${cls ? ` ${cls}` : ''}">no picture yet</span>`);

// The faces the page script switches between (idle first and shown; the others hidden until the script shows them).
const faces = (f, pet, moods, cls, fit = null) => moods.filter((m) => f[m]).map((m, i) =>
  `<img class="${cls}${fit ? ' fit' : ''}"${fit ? ` style="${fit}"` : ''} data-face="${m}" src="${esc(up(f[m]))}" alt="${esc(`${pet}, ${m === 'blink' ? 'blinking' : m}`)}" width="256" height="256"${i ? ' hidden' : ''}>`).join('');

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
<div class="rwx-rows">${LEVELS.map((l) => {
  // Two rows per level (Astra, 2026-10-22, answer 5: A): inside the pet program's own folder, and everything else.
  const mine = a.on.filter((g) => g.level.includes(l[0]));
  const own = mine.filter((g) => g.self), rest = mine.filter((g) => !g.self);
  // A level with only one kind of rule (L4, you: everywhere) gets one row.
  if (!own.length || !rest.length) return levelRow(l, mine, a);
  return levelRow([l[0], `${l[1]} · its own folder`], own, a) + levelRow([l[0], `${l[1]} · everything else`], rest, a);
}).join('')}</div>
<details class="may-use"><summary><h3>What ${esc(d.home)} may use</h3></summary>
${a.by.length ? `<div class="rwx-rows">${a.by.map((g) => grantItem(g, g.on.charAt(0).toUpperCase() + g.on.slice(1), a, { level: true })).join('')}</div>` : '<p class="empty">No grants recorded.</p>'}</details>
${about({
    how: 'Each level has two rows: what it may do inside the pet program’s own folder, and everywhere else. A row shows the most that level is allowed there by any rule; open a row to see every rule behind it and its proof. The row’s mark is the least sure of those rules: one “Rule only” makes the whole row “Rule only”.',
    from: '<code>access</code> in system-map.json, the same rules as the System Map card and PROTECTION-RINGS.md. The build refuses an “In code” mark that names no proof.',
    rules: yourRules(12, '2026-10-19: its own panel, right after the four level panels; 2026-10-22: two rows per level, its own folder and everything else'),
    notYet: 'Every grant enforced in code: a “Rule only” row is a rule the core does not check yet. The panel’s working name waits on you.',
  })}`;
}

// Each pet it talks to speaks in a bubble like the related pets, its picture beside it, no lights of its own (Astra,
// 2026-10-22, answer 2: A; her screenshot: "awkward", "these buttons look ugly"). It says what it gets from this pet
// program and what it sends back.
function connection(c, d) {
  const said = (word, list) => list.length ? list.map((f) => `<p><b>${word}</b> ${esc(f.carries)}${tag(f.state)}${f.why ? `: ${esc(f.why)}` : ''}</p>`).join('') : '';
  const pic = d.related.find((r) => r.id === c.id);
  const inner = `<fieldset class="mood-bubble said"><legend>${esc(slug(c.name))}</legend>${said('I get', c.sends)}${said('I send', c.receives)}<p class="small">${c.program ? `${esc(c.program)} · ` : ''}scope L4 granted: none recorded yet · last exchange: not recorded yet</p></fieldset>${img(pic?.idle || null, `${c.name}, idle`)}`;
  return `<li class="mood related-pet talk">${pic?.page ? `<a href="${esc(pic.page)}" title="Open ${esc(c.program || c.name)}">${inner}</a>` : `<span class="related-static">${inner}</span>`}</li>`;
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

function keyRequestsBody(d) {
  const groups = KEY_REQUEST_GROUPS.map(([id, label, empty]) => `<fieldset class="request-group ${id}"><legend>${esc(label)}</legend><p class="small request-count" data-count="${id}"></p><ul class="requests" data-group="${id}"></ul><p class="empty" data-empty="${id}">${esc(empty)}</p></fieldset>`).join('');
  return `<p class="small" id="key-requests-source" aria-live="polite">Looking for API Fairy's list on this PC.</p>
<div class="request-groups" id="key-requests">${groups}</div>
<details class="about"><summary>More details</summary><p class="small">A chat, pet or tool that needs a key files a key request for API Fairy (<a href="${esc(KEY_REQUEST_SKILL)}">skills/key-request</a>): who is asking, which provider and key name, what for, the spend limit and a link back to where it asked. Never the key itself. The list stays on Astra's PC: API Fairy reads it, looks for each key by name in Windows' environment variables and the .env files she watches, and fills this tool when this page is opened there. Anywhere else it shows made-up examples.</p></details>`;
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

// The five groups are tools of GitHub Aquarium, round tool boxes in its L1 control panel under Native tools, each with
// its lights left of its name (Astra, 2026-10-29: "Broken on main, waiting on you, waiting on a chat, close or keep,
// being checked or drafts. All of those things are tools. So turn them into what is supposed to be look like a tool
// and put them in the right spot"). outstanding-items fills them; the Pets Board, a native program, has the full list.
// They are tools on the System Map too, and come first (Astra, 2026-10-29: "make these important tools for the
// goldfish"), so the plain tool list leaves them out instead of listing them twice.
export const OUTSTANDING_TOOL_IDS = OUTSTANDING_GROUPS.map(([, label]) => label);
function outstandingTools(d) {
  // `g-<id>`: a bare `chat` class would take the chat pill's fixed place on the page.
  const boxes = OUTSTANDING_GROUPS.map(([id, label, empty]) => toolBox(label, label, `<p class="small request-count" data-count="${id}"></p><ul class="requests" data-group="${id}"></ul><p class="empty" data-empty="${id}">${esc(empty)}</p>`, { cls: `outstanding-group g-${id}` })).join('\n');
  return `<div class="outstanding-tools" id="outstanding-items"><p class="small" id="outstanding-source" aria-live="polite">Looking for the Goldfish's list on this PC.</p>
<div class="toolboxes">${boxes}</div>
<p><a class="button" href="${esc(OUTSTANDING_BOARD)}">Open the Pets Board</a> <span class="small">the full list, in the order to act (<a href="${esc(MERGE_ORDER_SKILL)}">skills/merge-order</a>), and every pet in one chart</span></p>
${about('outstanding-items (<code>github-aquarium-v1.0-outstanding-items-v1.0</code>) fills these five tools. It reads every repo the farm owner owns on GitHub, read only: pull requests ready for your OK, conflicts and failing checks, jobs failing on a main branch, handoff cards that wait on you, branches with work and no pull request, and pull requests nobody has touched for a month. It runs when asked: <code>npm run outstanding-items</code> in the hub folder, or a chat runs it before it gives you a merge chart. The list names private repos, so it stays on this PC and fills these tools only when the page is opened there. Anywhere else they show made-up examples.')}</div>`;
}


// By Astra. OpenAI Codex (GPT-6), 2026-10-20. No private archive state enters the hub.
function dmArchiveBody(d) {
  const source = d.programs.find(p => p.id === 'dm-archive-review')?.url;
  if (!source) return '';
  return `<fieldset class="tool-box"><legend>discord-tower-v1.0-dm-archive-v0.1</legend>
<h3>DM archive review</h3><p>Check and search a conversation saved with DiscordChatExporter. Messages and media stay in the review tab on your computer.</p>
<p class="small">Source prepared · adoption pending. No archive is loaded here. Export and deletion are separate.</p>
<p><a class="button" id="dm-archive-open" href="${esc(source)}">Get the local viewer</a></p>
<p class="small" id="dm-archive-open-note">Download Damsel's repository after the archive review change is merged, then open discord-damsel-archive-review-20261020.html. This public page cannot read your computer's files.</p>
</fieldset>`;
}


// Portfolio Puffer's social row (Astra, 2026-10-22: "can we see all these on the portfolio puffer pet program?"): the six
// styles of the "Profile Social Row" canvas for the links at the top of her GitHub profile, the live one marked.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-22. Styles and links: scripts/social-row-preview-20261022.mjs.

// Rift Rabbit's VRChat launch panel (Astra, 2026-10-23): two headsets, four ways of tracking the head each, and her
// notes on how each try went, to find the one that works best. Claude Opus 5.5 (claude-opus-5-5), 2026-10-23.
// Headsets and modes: scripts/vrchat-launch-panel-20261023.mjs.
// Rift Rabbit's VRChat setups, the pet program's own ways of using its L1 programs, are a native tool in its L1 control
// panel: the launcher runs them and no AI decides (Astra, 2026-10-24, "Program, Tool or Trick" deck, answer 2).
function vrchatSetups() {
  return `<div class="vrchat-setups"><div id="vrchat-launch">${vrchatLaunchBody(lights)}</div>
${about(`The VRChat setups (<code>${esc(VRCHAT_LAUNCH_TOOL)}</code>) show what each way of launching VRChat starts and turns off. The switches and your notes on each try are saved in this browser only. A web page cannot start programs, so the Launch buttons ask Rift Rabbit's launcher on this PC (<code>wonderland-launchpad-v1.0-vr-launch-v1.0</code>, 127.0.0.1 only, with a code only this PC knows); they work only on the page opened from this PC while the launcher runs, and show each step as it goes.`)}</div>`;
}

function presenceBody(d) {
  const card = (key, name) => `<fieldset class="tool-box" data-presence-card="${key}"><legend>${name} Discord Presence</legend>
<p data-presence-status role="status">Not checked. Open Discord Damsel on this PC to connect.</p>
<p><button type="button" class="button" data-presence-start="${key}" disabled>Start &amp; open ${name}</button>
<a class="button" data-presence-controls="${key}" aria-disabled="true" target="_blank" rel="noopener">Open ${name} controls</a>
<button type="button" class="button" data-presence-stop="${key}" disabled>Stop sharing</button></p></fieldset>`;
  return `<div id="discord-damsel-presence-control">
${card('openai', 'OpenAI')}${card('anthropic', 'Anthropic')}${card('ableton', 'Ableton Live')}
<p class="small" id="presence-control-note" role="status">Start and open works on this PC after you double-click Discord Damsel. The control links open apps that are already running.</p>
${about('The live status distinguishes an app running, sharing off, waiting for activity, and a card published to Discord. The green presence lights mean a card is published and Discord is connected. Your reported maintenance flag stays yours to clear. Closing a control tab does not stop a presence app.')}</div>`;
}
// A pet's own tool boxes, in L1 under Native tools (Astra, 2026-11-02, all recommended: "No special panels"; they were
// panels above the levels since 2026-10-24). `tool` names the System Map tool the box is, so its pill is not listed
// twice; a box without one is named <pet>-<name>.
// The Flash Audit on The Farm (Astra, 2026-11-08: "the flash audit needs to be a panel on the farm so that each of those
// shows up as a tool and I can click it and it will go through ... all the other pet programs and check to see if those
// components of those other programs are up to standard"; deck "The Farm: art and lights", "All recommended"): a tool
// box in L1, its checks as tools in the matrix's order, each with its grey or blue dot. A check shows the last saved
// run over every pet program at once (docs/flash-audit-rounds-<date>/ledger-main.json); Run asks the Flash Audit helper
// on this PC to run it again (apps/flash-audit-control-20261108.js, scripts/flash-audit-helper-20261108.mjs). The
// checks the auditor does not run by itself say so; GitHub Goldfish's word checks are marked as Goldfish's.
// The page checks follow the Model Pet Program (Astra, 2026-11-12: "when we do audits and we're looking at user
// interface, that we're auditing it based off of what's on the template, and then those are items on the Flash audit"):
// one check per part of the template, each comparing every pet program page with the template as built
// (scripts/flash-template-20261112.mjs). Their results come with the build (`fa.template`), so they need no Run.
const FLASH_DOC = `https://github.com/${OWNER}/${HUB}/blob/main/docs/flash-audit-20261014.md`;
const findingsList = (res, passes) => (res.findings.length
  ? `<ul class="flash-findings" data-flash-findings>${res.findings.map((f) => `<li><b>${esc(f.pet)}</b> <span class="tag">${esc(f.status)}</span> ${esc(f.detail)}</li>`).join('')}</ul>`
  : `<p class="empty" data-flash-findings>${passes}</p>`);
export function flashAuditBody(d) {
  const fa = d.flashAudit;
  if (!fa?.matrix?.length) return '';
  const run = fa.ledger ? `${fa.ledger.date.slice(0, 4)}-${fa.ledger.date.slice(4, 6)}-${fa.ledger.date.slice(6)}` : null;
  const template = `<a href="${MODEL_PROGRAM.page.split('/').pop()}">the Model Pet Program</a>`;
  const pill = (r) => {
    const how = r.dot === '🔵' ? 'blue: waits for your answer' : 'grey: fixed without you';
    const counted = (res) => FLASH_STATUSES.filter((s) => res.counts[s]).map((s) => `${res.counts[s]} ${s.toLowerCase()}`).join(' · ');
    let now, body, runIt = '';
    if (TEMPLATE_CHECKS.includes(r.id)) {
      const res = fa.template ? checkResults(fa.template, r.id) : null;
      now = !res ? 'compared with the template at every build' : res.findings.length ? `${res.audited - res.passing} of ${res.audited} pages differ from the template` : `all ${res.audited} pages match the template`;
      body = res
        ? `<p class="small">Compared with ${template} when these pages were built: ${res.passing} of ${res.audited} pet program pages match${counted(res) ? ` · ${esc(counted(res))}` : ''}.</p>${findingsList(res, 'Every pet program page matches the template here.')}`
        : `<p class="small">Compared with ${template} each time the pages are built.</p>`;
    } else {
      const auto = FLASH_AUTOMATED.includes(r.id), res = auto && fa.ledger ? checkResults(fa.ledger, r.id) : null;
      now = res ? (res.findings.length ? `${res.audited - res.passing} of ${res.audited} pet programs need work` : `all ${res.audited} pet programs pass`)
        : auto ? 'not run yet' : 'an assistant checks it';
      body = res
        ? `<p class="small" data-flash-summary>Last run ${esc(run)}: ${res.passing} of ${res.audited} pass${counted(res) ? ` · ${esc(counted(res))}` : ''}.</p>${findingsList(res, 'Every pet program passes.')}`
        : `<p class="small"${auto ? ' data-flash-summary' : ''}>${auto ? 'Not run yet.' : `The auditor does not run this one by itself: an assistant checks it during a Flash Audit (<a href="${FLASH_DOC}">the checklist</a>).`}</p>`;
      if (auto) runIt = `<p><button type="button" class="button" data-flash-run="${r.id}">Run ${esc(r.id)} again</button> <span class="small" data-flash-status="${r.id}" role="status"></span></p>`;
    }
    return `<li class="pill flash-check" data-check="${r.id}">${lights(`flash:${r.id}`, `${r.id} ${r.title}`)}<span class="item-name">${r.dot} ${esc(r.id)} ${esc(r.title)}</span><span class="item-desc" data-flash-desc>${esc(`${how}${GOLDFISH_WORDS.includes(r.id) ? ' · GitHub Goldfish’s check' : ''} · ${now}`)}</span><details class="pill-more"><summary aria-label="More about ${esc(r.id)}"></summary><div class="pill-body">${body}${runIt}</div></details></li>`;
  };
  // The date sits in its own span, so a newer run on this PC changes it with the pills (Astra, 2026-11-09: "Yes, fix
  // them"). A run took 19 minutes on 2026-11-09 (it asks GitHub about every pet's branches), so it says about 20.
  return `<p class="small">The Flash Audit’s ${fa.matrix.length} checks, most important first: ⚪ grey ones are fixed without you, 🔵 blue ones wait for your answer. The page checks follow ${template}, one check per part, top to bottom, and compare every pet program page with it each time the pages are built. ${run ? `The others show the last run over every pet program (<span data-flash-run-shown>${esc(run)}</span>); ` : ''}Run asks the Flash Audit helper on this PC to check every pet program again, which takes about ${RUN_MINUTES} minutes. <a href="${FLASH_DOC}">The checklist</a>.</p>
<ul class="items flash-checks" data-flash-run-date="${esc(run || '')}" data-flash-run-minutes="${RUN_MINUTES}">${fa.matrix.map(pill).join('')}</ul>`;
}
export const PET_BOXES = {
  // Folded to its name until clicked: the checks are long (deck "The Farm: art and lights", answer 3: A).
  'astras-pet-os': [{ tool: 'flash-audit', body: flashAuditBody, open: false }],
  'api-fairy': [{ tool: 'key-requests', body: keyRequestsBody }],
  'portfolio-puffer': [{ name: 'social-row', body: () => socialRowBody() }],
  'discord-tower': [{ name: 'presence-control', body: presenceBody }, { name: 'dm-archive', body: dmArchiveBody }],
  // AI Astra's face: her roadmap, what waits on her, the research (Astra, 2026-11-12).
  'the-astral-plane': [{ name: 'roadmap', body: () => roadmapBody() }, { name: 'waiting-on-you', body: () => waitingBody() }, { name: 'research', body: () => researchBody() }],
};
function petBoxes(d) {
  const boxes = (PET_BOXES[d.repo] || []).map((b) => ({ b, body: b.body(d), t: b.tool ? d.tools.find((x) => x.id === b.tool) : null })).filter((x) => x.body);
  const html = boxes.map(({ b, body, t }) => toolBox(t ? t.id : `${d.petSlug}-${b.name}`, t ? t.name : `${d.petSlug}-${b.name}`,
    `${t?.desc ? `<p class="small">${esc(t.desc)}</p>` : ''}${t?.label ? `<code class="label">${esc(t.label)}</code>` : ''}${body}`, { cls: `pet-box ${b.tool || b.name}`, open: b.open !== false })).join('\n');
  return { html: html ? `<div class="toolboxes">${html}</div>` : '', count: boxes.length, toolIds: boxes.map(({ t }) => t?.id).filter(Boolean) };
}

// Who answers in a pet's chat, in this order unless the farm's owner picks another (Astra, 2026-11-03): the AI seated in
// the pet's harness on this PC (Claude Code, then Codex, then another AI the pet chat helper finds), then your own
// Claude or ChatGPT in a new tab, or a note to the backlog. [key, name, where it answers].
export const CHAT_SEATS = [['claude-code', 'Claude Code', 'on this PC'], ['codex', 'Codex', 'on this PC'], ['other-ai', 'Another AI', 'on this PC'],
  ['claude', 'My Claude', 'new tab'], ['chatgpt', 'My ChatGPT', 'new tab'], ['note', 'Just leave a note', 'backlog']];

// The chat's circle-arrow button (the sketch): a drawn arrow, centred in its circle, that turns down while the chat is
// open. A typed ">" sat off centre (Astra, 2026-10-19: "the shape is a little awkward").
const CHAT_ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 5.5 15.5 12 9 18.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

// Data Chip's face on his phone's screen: the original Data Dealer drawing (apps/data-dealer-20261008.html, drawPet,
// happy with his eyes open), 32 by 24 pixels in its LCD greens, drawn here so no script draws it.
const CHIP_FACE = (() => {
  const INK = '#1f2b0e', MID = '#7d8f55', px = [];
  const p = (x, y, c = INK) => px.push(`<rect x="${x}" y="${y}" width="1" height="1" fill="${c}"/>`);
  for (let x = 9; x <= 22; x++) { if (x !== 15 && x !== 16) p(x, 4); p(x, 16); } // the package, its notch open
  for (let y = 5; y <= 15; y++) { p(9, y); p(22, y); }
  [6, 9, 12, 15].forEach((y) => { p(7, y); p(8, y); p(23, y); p(24, y); }); // side pins
  p(15, 5); p(16, 5); p(11, 6, MID); // the notch and the pin-1 dot
  [12, 19].forEach((x) => { for (let y = 17; y <= 19; y++) p(x, y); p(x - 1, 20); p(x, 20); p(x + 1, 20); }); // legs
  [[13, 9], [13, 10], [18, 9], [18, 10]].forEach(([x, y]) => p(x, y)); // eyes open
  [[13, 12], [14, 13], [15, 13], [16, 13], [17, 13], [18, 12]].forEach(([x, y]) => p(x, y)); // the smile
  p(11, 12, MID); p(20, 12, MID); // cheeks
  return `<svg class="chip-face" viewBox="0 0 32 24" shape-rendering="crispEdges" aria-hidden="true" focusable="false"><rect width="32" height="24" fill="#c3d39b"/>${px.join('')}</svg>`;
})();
// A pet whose chat is its own phone (Astra, 2026-11-03, Flash Audit deck, answer 2: "i like the phone on data dealer, its
// program needs its own chat"): Data Chip's yellow phone from Data Dealer's dashboard. The little phone is the chat
// tool's open button, and the window opens as the phone, its screens LCD green; the box, the ids and what the chat does
// are every pet's. Every other pet keeps the arrow and the plain window (answer 2, for the rest: A).
const CHAT_PHONES = { 'data-dealer': { name: 'DATA CHIP', face: CHIP_FACE } };

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
  const more = d.related.length > MAP_RELATED ? `plays with all ${d.related.length}` : 'plays with';
  return `
<ul class="map-related" aria-label="${esc(`Pets ${d.pet} talks to`)}">${d.related.slice(0, MAP_RELATED).map(link).join('')}</ul>
<p class="small map-related-all"><a href="#${esc(d.petSlug)}-friends-list-panel">${more}, below</a></p>`;
}

// The unified footer, as it looked before it turned into a list (Astra, 2026-10-20: "It looked really good ... It was
// listed like an actual aesthetic footer"): Codex's footer-template of 2026-10-14 (Flash Audit A51), drawn by the
// spawner as plain page markup. Centered groups between thin rules, each after a ✦: By Astra and the date (it said
// "Made by Astra"; the credit is "By Astra" since 2026-10-20), Find Out More with her GitHub and TikToks, Take Me Home!
// with the Farmer's icon. The license, languages and the page's links sit above and below them.
const footerIcon = (path) => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${path}"/></svg>`;
const GITHUB_ICON = footerIcon('M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.77-.24.77-.54v-2.09c-3.14.68-3.8-1.33-3.8-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.68.08-.68 1.13.08 1.73 1.16 1.73 1.16 1 1.73 2.63 1.23 3.27.94.1-.73.4-1.23.71-1.51-2.51-.29-5.15-1.26-5.15-5.58 0-1.23.44-2.24 1.16-3.03-.12-.29-.5-1.43.11-2.98 0 0 .95-.3 3.08 1.16A10.7 10.7 0 0 1 12 6.12c.95 0 1.9.13 2.8.38 2.14-1.46 3.08-1.16 3.08-1.16.61 1.55.23 2.69.11 2.98.72.79 1.16 1.8 1.16 3.03 0 4.33-2.65 5.29-5.17 5.57.41.35.77 1.03.77 2.08v3.09c0 .3.2.65.78.54A11.2 11.2 0 0 0 12 .8Z');
const TIKTOK_ICON = footerIcon('M16 2c.4 2.7 1.9 4.3 4.5 4.5v3.4a9 9 0 0 1-4.5-1.4v7.4a6.3 6.3 0 1 1-5.5-6.3v3.5a2.9 2.9 0 1 0 2 2.8V2Z');
const DISCORD_ICON = footerIcon('M20.3 4.4A19.6 19.6 0 0 0 15.4 3l-.6 1.3a18.2 18.2 0 0 0-5.6 0L8.6 3a19.6 19.6 0 0 0-4.9 1.5C.6 9.1-.3 13.6.1 18a19.8 19.8 0 0 0 6 3l1.3-2.1c-.7-.3-1.4-.6-2-1l.5-.4a14.1 14.1 0 0 0 12.2 0l.5.4c-.6.4-1.3.7-2 1L18 21a19.8 19.8 0 0 0 6-3c.5-5.1-.8-9.6-3.7-13.6ZM8 15.3c-1.2 0-2.2-1.1-2.2-2.4S6.8 10.5 8 10.5s2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Zm8 0c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Z');
const INSTAGRAM_ICON = footerIcon('M12 2.2c3.2 0 3.6 0 4.8.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 3.9 3.9 2.4 7.2 2.3c1.2-.1 1.6-.1 4.8-.1ZM12 6.9a5.1 5.1 0 1 0 0 10.2 5.1 5.1 0 0 0 0-10.2Zm0 8.4a3.3 3.3 0 1 1 0-6.6 3.3 3.3 0 0 1 0 6.6Zm5.3-9.8a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z');
// The maker's links under "By Astra", the same on every farm (upstream, card 058, Part 3): her GitHub, then the same
// socials as her GitHub profile README, in its order (Astra, 2026-10-22: "use same social media links as the GitHub
// findastra README.md").
// Astra's photostar (Iced Out Iceberg's astras-star-window), in the footer border's right corner on every page.
export const PHOTOSTAR = { url: `https://${OWNER}.github.io/astras-star-window/`, picture: `https://${OWNER}.github.io/astras-star-window/star-window.svg` };
export const FOOTER_LINKS = [
  ['GitHub: Astra', `https://github.com/${OWNER}`, GITHUB_ICON],
  ['Mommy’s Discord: Join MMY', 'https://discord.gg/YJUHtGGrJe', DISCORD_ICON],
  ['VR TikTok: @findastra', 'https://www.tiktok.com/@findastra', TIKTOK_ICON],
  ['Pole Dance TikTok: @astra_on_fire', 'https://www.tiktok.com/@astra_on_fire', TIKTOK_ICON],
  ['VRChat Instagram: @astra_on_fire', 'https://www.instagram.com/astra_on_fire', INSTAGRAM_ICON],
];

export function buildPetProgramPage(d) {
  CHECKS = d.checks || {};
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
  // <home>-editorial-status-panel, first on the page, like Halo List's header alert (Astra, 2026-10-23: "you need that
  // wonderland-launchpad-editorial-status-panel"). It is L3's note to Astra (L4) on how this site is coming along
  // ("that is just for the L3 to communicate with L4 and on progress to this site"): the pet's `editorial` in pets.json,
  // { says, by, on }, written by the AI working in its seat. Nothing is made up when there is no note.
  // It is also the sign that this is the working copy (Astra, 2026-11-02: "the editorial status panel on the one we're
  // working on, but we don't have it on the live one... That way I know if I'm looking at the most recent push or if
  // I'm looking at the one I'm working on"): LIVE_CHECK hides it on the live site, and its first line says so here.
  const note = d.editorial;
  const editorial = panel(`${d.homeSlug}-editorial-status-panel`, `<p class="working-copy">Working copy: not the live site.</p>${note && note.says
    ? `<p>${esc(note.says)}</p><p class="small editorial-by">L3 to you${note.by ? `, ${esc(note.by)}` : ''}${note.on ? `, ${esc(note.on)}` : ''}</p>`
    : '<p class="empty">No note from L3 yet. The AI working on this pet program writes here how the site is coming along.</p>'}
${about({
    how: `L3’s note to you on how ${esc(d.home)}’s site is coming along. It shows only on the working copy, so you can tell it from the live site.`,
    from: '<code>editorial</code> in pets.json (what it says, who wrote it, when), written by the AI working on this pet program.',
    rules: yourRules(0, '2026-10-23: first on the page, full width, L3 talking to you about this site; 2026-11-02: only on the working copy'),
    notYet: 'The seated agent writing it by itself: today a chat writes it in pets.json on a branch.',
  })}`, { cls: 'editorial', fold: false });
  const aboutOptions = [`<option value="">the whole program</option>`, ...[...d.tools, ...d.programs, ...d.thirdParty].map((i) => `<option value="${esc(i.label || i.id)}">${esc(i.name)}</option>`)].join('');

  // The cyberhome (Astra, 2026-10-19): empty until the page opens, then the pet moves in from the top corner. The page
  // plays the arrival itself; flying in from the desktop needs Startup Star's link (not built). No star door in it
  // since 2026-10-20 (Astra crossed it out). No bubble in it since 2026-10-21 (Astra: "get rid of this entirely; select
  // from 9 emotions at bottom what to 'light up'"): the mood it showed lights up in the emotions tool panel instead.
  // The cyberhome is always a square, and so is the System Map box.
  // The box inside the cyberhome is a tool, `<pet>-cyberhome`, the little art cyberhome that will be drawn up later,
  // drawn like every tool: a pill with its lights and its name (Astra, 2026-10-23: "the tool inside the
  // rift-rabbit-cyberhome (panel) is ... similar to how other tools work in other panels", then "rift-rabbit-cyberhome is
  // the correct tool name, and we dont have one so idk why its green"). It is not built, so it is off, never a guessed
  // green. The pet stands as tall as on the desktop.
  const render = `${d.petSlug}-cyberhome`;
  const drawn = CYBERHOMES[d.repo];
  const cyberhome = panel(`${d.petSlug}-cyberhome-panel`, `<div class="habitat${drawn ? ` drawn-home ${drawn.kind}-home` : ''}" title="${esc(d.pet)} moves in when this page opens. Coming straight from the desktop needs Startup Star's link, which is not built yet.">
<span class="render-label">${lights(`tool:${render}`, render, { planned: !drawn })}<span class="render-name">${esc(render)}</span></span>
<div class="den${drawn ? ` ${drawn.kind}` : ''}" data-arrival="waiting">${drawn ? drawn.decor : ''}${f.idle ? faces(f, d.pet, ['idle', 'blink', 'sad'], 'pet', d.petFit) : img(null, idleAlt, 'pet')}</div>${drawn ? drawn.frame : ''}</div>`, { cls: 'cyberhome', fold: false });
  // No More details arrow in the cyberhome, the quick summary or the System Map box, and no fold arrow on their labels
  // (Astra, 2026-11-06: "get rid of the dropdown arrows in the cyberhome and the system map panels", "and get rid of it
  // in the summary panel too"). Every other panel keeps its More details.

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
${panel(`${d.homeSlug}-quick-summary-panel`, `<p>${esc(d.summary)}</p>`, { cls: 'summary', fold: false })}</div>`;
  // No buttons under the title (Astra, 2026-10-21: an X over "Open today's app" and one over "Repo" on her screenshot,
  // then "1. A" in her slides): the app and the repo are linked in the footer and in L4's Pet ID.
  const appLink = d.appHref ? `<a href="${esc(d.appHref)}">the app it had before</a>` : d.appPrivate ? `its app (private: ${esc(d.appPrivate)})` : 'no app wired up yet';

  // The way back to the System Map, top right, opposite the cyberhome (Astra, 2026-10-19: "There's always going to be
  // a system map link back"; Flash Audit A60). It opens the map on this pet program's own node.
  // A small drawing of rings 0 to 3 with a dot on the ring the program lives on (rings: PROTECTION-RINGS.md).
  const ringR = { 0: 0, 1: 24, 2: 40, 3: 56 }[d.ring] ?? 56;
  // Its label is the hub's (the map is Astra's PetOS's), and its node's id is no longer printed under the link (Astra,
  // 2026-10-21, crossing out "its node: unity-stable"; the link still opens that node).
  // The box inside the map panel is a tool too, `<pet>-system-map`, a pill with its lights like the cyberhome's (Astra,
  // 2026-10-23: "you are still missing the indicator light buttons on the system map panel tool"): ON/OFF says the link
  // is open, the maintenance light that the map's information on this pet is wrong or broken.
  const mapTool = `${d.petSlug}-system-map`;
  const systemMap = panel(`${d.petSlug}-${SYSTEM_MAP_LABEL}`, `<div class="habitat map-home">
<span class="render-label">${lights(`tool:${mapTool}`, mapTool)}<span class="render-name">${esc(mapTool)}</span></span>
<div class="map-box"><a class="map-link" href="${esc(map)}" title="Open ${esc(d.home)} on the System Map" aria-label="Open ${esc(d.home)} on the System Map">
<svg class="rings" viewBox="-6 -6 132 132" role="img" aria-label="The System Map's rings, with ${esc(d.home)} on ring ${esc(d.ring ?? '3')}"><circle cx="60" cy="60" r="56"/><circle cx="60" cy="60" r="40"/><circle cx="60" cy="60" r="24"/><circle class="core" cx="60" cy="60" r="8"/><circle class="node" cx="${60 + ringR}" cy="60" r="7"/></svg>
</a></div></div>`, { cls: 'system-map', fold: false });
  // No words in the two squares, only their tools and the pictures (Astra, 2026-10-23: "get rid of all text in the
  // cyberhome panel and system map pane"): the map's rings are the link, its words are its tooltip, and the pets it
  // plays with are in the friends list panel below (mapRelated is no longer drawn here).

  const boxes = petBoxes(d);
  const L1 = panel(`${d.petSlug}-L1-control-panel`, `<div class="columns">
<section>${heading('3rd party programs', d.thirdParty)}${itemList(d.thirdParty, 'third-party', 'None on the map yet.')}</section>
<section>${heading('Native programs', d.programs)}${itemList(d.programs, 'program', 'None on the map yet.')}</section>
${d.shared.length ? `<section>${heading('Shared programs', d.shared)}${itemList(d.shared, 'shared', '')}</section>` : ''}
${d.repo === 'rift-rabbit' ? toolSections(d.tools, vrchatSetups(), 2) : d.repo === 'github-goldfish' ? toolSections(d.tools.filter((t) => !OUTSTANDING_TOOL_IDS.includes(t.id)), outstandingTools(d), OUTSTANDING_GROUPS.length, { first: true }) : toolSections(d.tools.filter((t) => !boxes.toolIds.includes(t.id)), boxes.html, boxes.count)}
${d.devices.length ? `<section>${heading('Devices it looks after', d.devices)}${deviceGroups(d.devices)}</section>` : ''}</div>
${about({
    how: 'Click a name to open it. Click a light to change it: a bubble says what it means. Something not built yet is off and its second light grey (not created); the second light says report issues until someone checks the item, and blue once it was checked and works.',
    from: `The System Map’s programs and tools for ${esc(d.home)}, ${esc(d.repo)}’s pet.json tools, and the checks recorded in pets.json. ON/OFF and maintenance are saved in this browser only.`,
    rules: yourRules(4, '2026-10-21: 3rd party programs, native programs and native tools are L1, each heading with its count, pills three to a row; 2026-11-02: a pet’s own tools are tool boxes here, no special panels'),
    notYet: 'The core enforcing ON/OFF and maintenance (PET-PROGRAM-FRAMEWORK.md, section 4); an audit that compares these tools with the files in the repo.',
  })}`, { cls: 'level', light: true, id: `${d.petSlug}-L1-control-panel` });

  // No Schedule list (Astra, 2026-10-22, crossing it out: "anything to do w/ schedule is under 'tricks' ... could put a
  // cadence indicator"): the self-audit is a trick pill with how often it runs, and every trick shows its own cadence.
  const selfAudit = d.audit.cadence ? [{ id: 'self-audit', name: 'self-audit', state: 'now', cadence: d.audit.cadence,
    desc: `The Friendly Farmer's round checks ${d.home}${d.audit.subject ? `: ${d.audit.subject}` : ''}.`, why: '' }] : [];
  // Every pet has two tutorials, Play with and Care for (Flash Audit A37, A47): numbered steps the AI in the seat follows
  // with you, which is what a trick is, so they are two tricks here, off until L3 can run them in the chat (Astra,
  // 2026-11-03, Flash Audit deck, answer 4: A).
  const tutorials = [
    ['play-with', `to play with ${d.home}: what it does, tried out together`],
    ['care-for', `to look after ${d.home}: its checks, updates and fixes`],
  ].filter(([id]) => !d.tricks.some((t) => t.id === id || t.id.endsWith(`-${id}`))).map(([id, what]) => ({ id, name: id, state: 'planned', why: '',
    desc: `Numbered steps the seated agent walks you through in ${d.pet}'s chat, ${what}. Planned: off until L3 can run it in the chat.`,
    label: `${d.homeSlug}-v1.0-${id}-trick-v1.0` }));
  const tricks = [...selfAudit, ...tutorials, ...d.tricks];
  // Update history is part of the Pet ID in L4, your record of the pet program (Astra, 2026-10-24, "Program, Tool or
  // Trick" deck, answer 4); L2 holds the pet program's tricks.
  const L2 = panel(`${d.petSlug}-L2-control-panel`, `<div class="columns">
<section>${heading('Native tricks', tricks)}${itemList(tricks, 'trick', 'None recorded in the hub yet. Skill Scout will keep them.')}</section></div>
${about({
    how: `${esc(d.home)}’s own tricks: written steps its AI follows, each with how often it runs. Play with and Care for are on every pet program, off until L3 can run them in the chat.`,
    from: `The System Map’s tricks for ${esc(d.home)}, the self-audit from pets.json, and Skill Scout’s list.`,
    rules: yourRules(4, '2026-10-21: a trick is a way of using the pet’s programs, tools and tricks, owned at L2 and followed at L3; 2026-10-22: anything on a schedule is a trick with how often it runs; 2026-11-03: play-with and care-for on every page'),
    notYet: 'Play with and Care for, run by L3 in the chat; Skill Scout keeping every trick and where it came from.',
  })}`, { cls: 'level', light: true });

  // L3 (Astra, 2026-10-22): "unity stable program activity", and the bubble names the pet program, not the pet. Its
  // suggestions are a weekly trick, and the tricks and harness skills are pills like everything else (answer 3: A).
  const l3Suggest = [{ id: 'weekly-suggestions', name: 'weekly-suggestions', state: 'planned', cadence: 'weekly',
    desc: `Once a week the seated agent suggests what to do next for ${d.home}.` }];
  // L3 is L3 talking with L4 about this pet program, nothing else (Astra, 2026-10-24: "L3 control panel should be about
  // L3 to L4 discussions, regarding the pet program only"): what L3 asks you (an update the update audit found waits for
  // your yes here), its suggestions, and who is seated to talk. The seat's own activity, tokens and skills are not here.
  // Each part is a section of pills, like L1's (Astra, 2026-10-24: "L3 looks sloppy. give it sections that match"):
  // each question a pill with the orange "waiting for your OK" light, its question as the name and the rest when
  // opened, and the seat a pill that is off until a farmhand is seated.
  const asks = d.asks.map((a, i) => {
    const q = a.indexOf('?');
    return { id: `ask-${i + 1}`, name: q > 0 ? a.slice(0, q + 1) : a, desc: q > 0 ? a.slice(q + 1).trim() : 'Waiting for your OK.', state: 'now', waiting: true,
      more: 'Answer it in L4, under approvals-waiting-on-you.' };
  });
  const seat = [{ id: 'seat', name: 'seat', state: 'planned', desc: `Empty: no farmhand is seated in ${d.home} (L3 is not connected).`,
    more: 'A farmhand is an AI agent seated here to talk with you about this pet program.' }];
  const L3 = panel(`${d.petSlug}-L3-control-panel`, `<div class="columns">
<section>${heading('L3 asks you', d.asks)}${itemList(asks, `l3-ask:${d.petSlug}`, `Nothing to ask you about ${d.home} right now.`)}</section>
<section>${heading('Suggestions for you', l3Suggest)}${itemList(l3Suggest, `l3:${d.petSlug}`, '')}</section>
<section>${heading('Seat', [])}${itemList(seat, `l3:${d.petSlug}`, '')}</section>
</div>
${about({
    how: `Only L3 talking with you about ${esc(d.home)}: what L3 asks you (with the yellow light), its suggestions, and who is seated.`,
    from: 'The update audit’s questions in pets.json; the seat, from the pet chat helper on this PC, is shown in the chat.',
    rules: yourRules(4, '2026-10-24: L3’s panel is about L3 to L4 discussions on this pet program only, in sections of pills; 2026-11-03: the editorial status panel is L3’s note to you, no activity bubble (Flash Audit A52)'),
    notYet: 'Weekly suggestions; this seat pill showing who the pet chat helper seated.',
  })}`, { cls: 'level', light: true, id: `${d.petSlug}-L3-control-panel` });

  // L4's parts are tools of their own, each with its lights and a lowercase name (Astra, 2026-10-22, drawing
  // "oo approvals-waiting-on-you", "oo grants", "oo keys", "oo unity-unicorn-required-maintenance", "oo pet-id"):
  // round tool boxes that fold to their name, not square panels inside the panel (2026-10-24: "these L3 and L4 control
  // panels need work, to match the rest of the UI theming").
  const sub = (label, body) => toolBox(label.startsWith(d.petSlug) ? label : `${d.petSlug}-${label}`, label, body, { open: false });
  // The Pet ID's Stamps: the update history (Astra, 2026-10-24: update history belongs in the Pet ID, answer 4).
  const petStamps = `<dl class="status stamps">
<dt>Data</dt><dd>yours, in this browser only${d.isPrivate ? '. Private: its data never leaves the PC' : ''}</dd>
<dt>Last entry</dt><dd id="last-entry">none yet</dd>
<dt>Updated</dt><dd>page spawned ${esc(DATE)}; ${d.version.core ? `version ${esc(d.version.full)}${d.version.assigned ? ' (the starting version, assigned by the hub)' : ` (from ${esc(d.repo)}'s pet.json)`}` : 'the program\'s own version is not recorded in the hub yet'}</dd>
<dt>Seat</dt><dd>empty</dd>
<dt>Last check</dt><dd>${roundLine}</dd>
<dt>On the map</dt><dd><a href="${esc(map)}">${esc(d.mapNode)}</a></dd></dl>`;
  // Where the approvals come from: the hub cards that record a pet's own (pets.json `waiting_on_you`), and the Friendly
  // Farmer's last merged round (the model page's example is one of the round's).
  const roundSource = `the Friendly Farmer's last merged round${d.statusUpdated ? ` (${day(d.statusUpdated)})` : ''}`;
  const sources = [...(d.needsFrom || []).map((c) => `${c} in the hub`), ...(d.needsFromRound !== false || !(d.needsFrom || []).length ? [roundSource] : [])];
  const needsFrom = sources.length > 1 ? `${sources.slice(0, -1).join(', ')} and ${sources.at(-1)}` : sources[0];
  const L4 = panel(`${d.petSlug}-L4-control-panel`, `<div class="toolboxes">${sub('approvals-waiting-on-you', d.needs.length ? `<ul class="plain">${d.needs.map((n) => `<li>${esc(n)}</li>`).join('')}</ul><p class="small">From ${esc(needsFrom)}. Approve and decline buttons come with Iron Gates.</p>` : '<p class="empty">Nothing from the Friendly Farmer\'s last merged round.</p>')}
${sub('grants', `<p class="small">Grants are permissions: what each level may read (R), write (W) and run (X) on ${esc(d.home)}. They are listed in <a href="#${esc(d.petSlug)}-rwx-panel">${esc(d.petSlug)}-rwx-panel</a>, below, with whether each one is in code.</p>`)}
${sub('keys', '<p class="empty">No agent keys yet: Iron Gates will issue them and API Fairy will show them (planned).</p>')}
${sub(`${d.petSlug}-required-maintenance`, '<ul class="plain" id="maintenance"><li class="empty">Nothing yellow or orange.</li></ul><ul class="plain" id="switched-off"></ul>')}
${sub('pet-id', `<dl class="status">
<dt>Microchip</dt><dd>not signed yet</dd>
<dt>Pedigree</dt><dd>${d.publicRepo ? `<a href="${esc(d.repoUrl)}">${esc(d.owner)}/${esc(d.repo)}</a>` : `${esc(d.owner)}/${esc(d.repo)} (private)`}${d.added ? `, added ${esc(d.added)}` : ''}</dd>
<dt>App</dt><dd>${appLink}</dd>
<dt>Stamps</dt><dd>${petStamps}</dd>
<dt>Vaccination card</dt><dd>no security patches recorded</dd>
<dt>Vet records</dt><dd>${d.vetClinicPrivate ? 'vet-clinic tickets (private repo)' : `<a href="https://github.com/${OWNER}/vet-clinic/issues?q=${encodeURIComponent(d.homeSlug)}">vet-clinic tickets</a>`}</dd></dl>`)}</div>
${about({
    how: 'Your part, the verified human: approvals waiting on you, grants, keys, required maintenance and the Pet ID, each a tool box that folds to its name.',
    from: 'The Friendly Farmer’s last merged round and the pet’s own approvals in pets.json (each names its hub card), the grants on the R W X panel, the lights you marked in this browser, and the pet’s repo and versions.',
    rules: yourRules(4, '2026-10-22: five tool boxes with lowercase names; 2026-10-24: round boxes, the update history in the Pet ID’s stamps; Pet ID, not passport'),
    notYet: 'Approve and decline buttons and agent keys (Iron Gates, shown by API Fairy); the microchip signature; security patches.',
  })}`, { cls: 'level', light: true, id: `${d.petSlug}-L4-control-panel` });

  const levels = panel(`${d.petSlug}-intelligence-levels-panel`, `<p class="legend-key"><span class="key on"></span>on <span class="key off"></span>off <span class="key care"></span>checked, works <span class="key fix"></span>report issues <span class="key update"></span>update waiting for your OK <span class="key planned"></span>not created</p>${L1}${L2}${L3}${L4}
${about({
    how: 'The four levels stacked, L1 at the top: programs and tools (L1), the pet program’s own tricks (L2), the AI in the seat (L3) and you (L4). The key above says what each light means; a level’s panel glows while it is working.',
    from: 'The System Map, pets.json and each pet’s pet.json, and the Friendly Farmer’s rounds; the lights you set are saved in this browser.',
    rules: yourRules(4, '2026-10-18: four stacked panels, lights are buttons; 2026-10-23: only tools have lights; 2026-10-24 and 2026-10-26: blue checked, orange report issues or not checked, yellow update waiting, grey not created'),
    notYet: 'L1, L2 and L3 glowing while they work (Startup Star’s link); the core enforcing the lights.',
  })}`, { cls: 'levels' });

  const rwx = panel(`${d.petSlug}-rwx-panel`, rwxPanelBody(d), { cls: 'rwx-panel', id: `${d.petSlug}-rwx-panel` });

  // The notes are a tool in the panel, drawn like the others (Astra, 2026-10-24: "this one looks sloppy too, make it
  // match the other panel UI themology"): a round box with its lights and name; its menu and buttons round like a
  // tool's; the writing box keeps square corners (2026-10-24: "this also should be square corners").
  const notes = panel(`${d.petSlug}-session-notes-panel`, `${toolBox(`${d.homeSlug}-notes`, 'notes', `<form id="notes" class="notes">
<textarea id="note-text" rows="3" aria-label="notes" placeholder="A note, a bug or a change you want. It goes to the backlog straight away."></textarea>
<div class="note-row"><label>about <select id="note-about">${aboutOptions}</select></label>
<label class="button file">add file<input type="file" id="note-file" multiple></label>
<button type="submit" class="button">submit</button></div>
<p class="small" id="note-files" data-words-keep></p></form>
<details class="backlog"><summary>${esc(d.homeSlug)}-backlog in this browser (<span id="backlog-count">0</span>)</summary><ol id="backlog" reversed data-words-keep></ol>
<p><button type="button" class="button" id="export">export the backlog (JSON)</button></p>
<p class="small">The backlog is saved in this browser, before anything else happens. This browser keeps each file's name and size, not the file itself yet. Export moves it to another device.</p></details>`, { fold: false })}
${about({
    how: 'Write a note, a bug or a change you want, choose what it is about, add files, and submit: it goes to the backlog straight away. Export moves the backlog to another device.',
    from: 'This browser: the backlog is saved here first, with each file’s name and size.',
    rules: yourRules(6, '2026-10-18: every submission goes to the backlog first (section 7); 2026-10-24: drawn as a tool, the writing box with square corners'),
    notYet: 'Keeping the files themselves; the backlog reaching the Farmer’s weekly run by itself.',
  })}`, { cls: 'session-notes' });

  // Awake always shows its own drawing, the `blink` frame with the two yellow twinkles (Astra, 2026-11-03, Flash Audit
  // deck, answer 1: A); it was the idle face, wearing idle's three dots. A pet with no awake drawing shows idle's.
  const emotions = panel(`${d.petSlug}-emotions-panel`, `<div class="moods">${EMOTIONS.map(([mood, name, bullets]) => {
    const picture = img(mood === 'blink' ? f.blink || f.idle : f[mood], `${d.pet}, ${name}`, '', d.petFit);
    return `<figure class="mood" data-mood="${esc(mood)}"><fieldset class="mood-bubble"><legend>${esc(name)}</legend><ul>${bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul><q>${esc(d.lines[mood] || '')}</q></fieldset>${d.backdrop ? `<span class="pet-backdrop">${picture}</span>` : picture}</figure>`;
  }).join('')}</div>
${about({
    how: `The nine moods, three to a row. The mood ${esc(d.pet)} is in now lights up; the page knows idle, awake and sad so far. Each picture carries its mood’s sticker, the same on every pet, and awake always shows its own drawing.`,
    from: `The hub’s pictures of ${esc(d.pet)} (art/moods, or its desktop drawings), with the shared stickers stamped on by the build; the lines from the mood key in pets.json.`,
    rules: yourRules(7, '2026-10-18: these meanings only, most urgent first; 2026-10-24: nine stickers, the same on every pet, and nothing moves; 2026-11-03: awake shows its own drawing with the twinkles'),
    notYet: `The other six moods set by the rounds and the Police Station. An awake drawing with open eyes for every real pet waits for your OK on new art. Drawings are drafts unless you approved them.`,
  })}`, { cls: 'emotions' });

  // Astra, 2026-10-18: one and two clicks are the same for every pet; from three clicks on, each can run a tool. The
  // tools bound so far come from `clicks` in pets.json (2026-10-19: Voicemeeter Bug's repair moved to three clicks).
  const counts = ['three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const bound = Object.entries(d.clicks).filter(([n]) => Number(n) >= 3).sort(([a], [b]) => a - b);
  // Each number of clicks is a pill with its lights, like a tool (Astra, 2026-10-22: "those should look/function like
  // tools").
  const clickItems = [
    { id: 'one-click', name: 'one click', state: 'planned', desc: 'Show the current reminder in a dialog box, like BSOD’s blurb.' },
    { id: 'two-clicks', name: 'two clicks', state: 'now', desc: `Open or close ${d.home}, this page.` },
    ...(bound.length
      ? bound.map(([n, c]) => ({ id: `${counts[n - 3] || n}-clicks`, name: `${counts[n - 3] || n} clicks`, state: 'now', desc: c.what || c.tool, label: c.label || null }))
      : [{ id: 'three-clicks', name: 'three clicks', state: 'unassigned', desc: 'A tool you assign: none assigned yet.' }]),
  ];
  const clicker = panel(`${d.petSlug}-clicker-training-panel`, `${itemList(clickItems, `click:${d.petSlug}`, '')}
${about({
    how: `What clicking the desktop pet does. One and two clicks are the same for every pet. From three clicks on, each number of clicks can run one of ${esc(d.home)}’s tools (code, no AI).`,
    from: '<code>clicks</code> in pets.json.',
    rules: yourRules(8, '2026-10-18: one and two clicks the same for every pet; 2026-10-22: each number of clicks is a pill, like a tool; always on the page (Flash Audit A41)'),
    notYet: 'One click’s reminder box; the desktop pet’s click timing checked on this PC.',
  })}`, { cls: 'clicker' });

  // Each related pet speaks in a cloud like the emotion bubbles, its name in the border and its picture beside it
  // (Astra, 2026-10-22: "all of these should look similar to the emotional state bubbles", drawing "rift-rabbit / I
  // manage ..."). The whole bubble opens that pet's program.
  const relatedCard = (r) => {
    const inner = `<fieldset class="mood-bubble said"><legend>${esc(slug(r.pet))}</legend><p>I manage ${esc(r.home || 'a pet program not named yet')}.${tag(r.state)}</p>${r.why ? `<q>${esc(r.why)}</q>` : ''}</fieldset>${img(r.idle, `${r.pet}, idle`, '', r.fit)}`;
    return `<li class="mood related-pet">${r.page ? `<a href="${esc(r.page)}" title="Open ${esc(r.home || r.pet)}">${inner}</a>` : `<span class="related-static">${inner}</span>`}</li>`;
  };
  const related = panel(`${d.petSlug}-friends-list-panel`, `${d.related.length
    ? `<ul class="moods related">${d.related.map(relatedCard).join('')}</ul>`
    : `<p class="empty">Plays with no one yet: ${esc(d.pet)} has no links to other pets on the System Map.</p>`}
${about({
    how: `Every pet ${esc(d.pet)} plays with, hatched or not, most used first. Click one to open its pet program.`,
    from: 'The System Map’s links between pets; a <code>plays_with</code> list in pets.json sets the order instead.',
    rules: yourRules(11, '2026-10-19: every page lists the pets it plays with at the bottom; 2026-10-22: each speaks in a cloud like the emotions'),
    notYet: 'Measuring use: until then the order is the map’s (links that work today, then planned, then ideas; within each, the pet they share the most with).',
  })}`, { cls: 'related-pets', id: `${d.petSlug}-friends-list-panel`, fold: false });

  // The footer (Astra, 2026-10-22, her marked-up screenshot, then "move the languages to the right of the icons" and "put
  // the photostar in the right corner of the unified border"): a whole box like every panel; no license, signature, date
  // (it is beside the title), Take Me Home!, link list, words switch or spawner line, all crossed out; By Astra and Find
  // Out More on one line. Since 2026-10-24 (Astra: "make sure there is no sparkle before By Astra ... the codes go below
  // that in their own section"; then "By Astra, sparkle, star, sparkle, Find Out More, links"): that order on one line.
  // The languages are gone from it (Astra, 2026-10-24: "get rid of the code on the unified footer"), and so is its More
  // details (Astra, 2026-11-11: "get rid of the more details on the unified footer"): who owns the footer, the one thing
  // it said was not built, waits on her in PET-PROGRAM-FRAMEWORK.md ("Waiting on Astra").
  const footer = panel(`${d.petSlug}-unified-footer-panel`, `<footer class="astra-footer" aria-label="By Astra and her links">
<div class="footer-line">
<div class="footer-group footer-by"><span class="footer-title">By Astra</span></div>
<span class="footer-sparkle" aria-hidden="true">✦</span><a class="footer-star" href="${esc(PHOTOSTAR.url)}" title="Astra's photostar" aria-label="Astra's photostar"><img src="${esc(PHOTOSTAR.picture)}" alt="" width="48" height="48" loading="lazy"></a>
<div class="footer-group footer-more"><span class="footer-title">Find Out More</span><span class="footer-icons">${FOOTER_LINKS.map(([label, href, icon]) => `<a href="${esc(href)}" title="${esc(label)}" aria-label="${esc(label)}">${icon}</a>`).join('')}</span></div>
</div>
${d.isPrivate ? '<p class="small">Private: its data never leaves the PC.</p>' : ''}</footer>
<!-- Spawned by the Friendly Farmer's pet program spawner (${TOOL_LABEL}) from pets.json, pet-programs.json and the System Map, ${DATE}. npm run build rewrites this page; do not edit it by hand. -->`, { cls: 'footer', fold: false });

  // The chat window, like Data Chip's on Data Dealer (Astra, 2026-10-20: "he was fully interactive"; 2026-11-03: "the
  // way that it works on data dealer is the only one that works right. So this concept combined with that"): the pet's
  // face and who is in its seat, a Needs you view built from this page, and an Ask view with quick questions and the
  // conversation. Who answers is the AI seated in the pet's harness on this PC, Claude Code first, then Codex, then any
  // other AI the pet chat helper finds (Astra, 2026-11-03: "it should be Claude Code answering first and then Codex ...
  // unless dictated otherwise"; for everyone else: "auto recognize it or give you an option to choose which model");
  // then your own Claude or ChatGPT in a new tab, or a note. The seated agent works supervised (ASTRAS_PET_OS 8.3; Astra:
  // "The agents are supposed to be able to change stuff"): it reads the plan and the pet's repo, changes things on a
  // branch, and asks here before anything bigger. The box is `<pet>-chat-panel`, square like every panel; the chat in it
  // is a tool, `<pet>-chat`, drawn like one (Astra, 2026-10-23).
  const allItems = [...d.tools, ...d.programs, ...d.thirdParty, ...d.shared, ...d.devices, ...d.tricks];
  const itemName = (key) => { const id = key.replace(/^[a-z-]+:/, ''); return allItems.find((i) => i.id === id)?.name || id; };
  const needsYou = [
    ...d.needs.map((n) => ({ kind: 'your OK', text: n, where: `${d.petSlug}-L4-control-panel` })),
    ...d.asks.map((a) => ({ kind: 'L3 asks you', text: a, where: `${d.petSlug}-L3-control-panel` })),
    ...Object.entries(d.checks).filter(([, c]) => c.result === 'issues').map(([k, c]) => ({ kind: 'report issues', text: `${itemName(k)}: ${c.note || 'an issue was reported'}`, where: `${d.petSlug}-L1-control-panel` })),
  ];
  // A pet with its own phone (Data Chip) opens its chat from the little phone and talks in it; every other pet has the
  // arrow and the plain window.
  const phone = CHAT_PHONES[d.repo];
  const chatFace = phone ? `<span class="phone-screen">${phone.face}</span>` : f.idle ? `<img class="chat-face" src="${esc(up(f.idle))}" alt="" width="44" height="44">` : '';
  const chatOpen = phone ? `<span class="phone-mini" aria-hidden="true"><span class="phone-screen">${phone.face}</span><span class="phone-name">${esc(phone.name)}</span></span>` : CHAT_ARROW;
  const chat = `<aside class="chat${phone ? ' chat-phone' : ''}" aria-label="${esc(d.petSlug)}-chat-panel"${phone ? ` style="--phone-name: '${esc(phone.name)}'"` : ''}><span class="chat-label">${esc(d.petSlug)}-chat-panel</span>
<div class="chat-tool">${lights(`chat:${d.petSlug}`, `${d.pet}'s chat`)}<span class="chat-name">${esc(d.petSlug)}-chat</span>${needsYou.length ? `<span class="chat-badge" title="${needsYou.length} need${needsYou.length === 1 ? 's' : ''} you">${needsYou.length}</span>` : ''}
<button type="button" class="chat-open" id="chat-open" aria-expanded="false" aria-controls="chat-panel" aria-label="Open ${esc(d.pet)}'s chat">${chatOpen}</button></div>
<div class="chat-panel" id="chat-panel" role="dialog" aria-label="Talk to ${esc(d.pet)}" hidden>
<div class="chat-head">${chatFace}<span class="chat-title"><b>${esc(d.pet)}</b><span class="small" id="chat-seat">Seat: empty</span></span><button type="button" class="chat-close" id="chat-close" aria-label="Close ${esc(d.pet)}'s chat">×</button></div>
<div class="chat-tabs" role="group" aria-label="${esc(d.pet)}'s chat">${[['needs', `Needs you · ${needsYou.length}`], ['ask', `Ask ${d.pet}`]].map(([k, label]) => `<button type="button" class="button" data-view="${k}" aria-pressed="false">${esc(label)}</button>`).join('')}</div>
<div class="chat-view" data-view-of="needs" hidden>${needsYou.length
    ? `<ol class="chat-needs">${needsYou.map((n) => `<li><a href="#${esc(n.where)}" data-chat-goto><span class="tag">${esc(n.kind)}</span> ${esc(n.text)}</a></li>`).join('')}</ol>`
    : '<p class="empty">Nothing needs you right now.</p>'}</div>
<div class="chat-view" data-view-of="ask">
<ol class="chat-log" id="chat-log" aria-live="polite" data-words-keep></ol>
<div class="chat-quick" role="group" aria-label="Quick questions">${[['explain', 'Explain this page'], ['needs', 'What needs me?'], ['tools', 'How are my tools?']].map(([k, label]) => `<button type="button" class="button" data-quick="${k}">${esc(label)}</button>`).join('')}</div>
<label class="small" for="chat-text">message</label>
<textarea id="chat-text" rows="2" placeholder="Ask ${esc(d.pet)} anything"></textarea>
<p class="chat-row"><button type="button" class="button" id="chat-send">Send</button><button type="button" class="button" id="chat-push" hidden>Push for review</button><button type="button" class="button" id="chat-new">Start over</button><span class="small" id="chat-status" role="status"></span></p>
<details class="chat-seats"><summary>Who answers: <span id="chat-who-now">Claude Code</span></summary>
<div class="chat-who" role="group" aria-label="Who answers">${CHAT_SEATS.map(([k, label, where]) => `<button type="button" class="button" data-who="${k}" aria-pressed="false">${esc(label)} <span class="small"${where === 'on this PC' ? ` data-seat-state="${k}"` : ''}>${esc(where)}</span></button>`).join('')}</div>
<p class="small" id="chat-who-says"></p>
<p class="small">Supervised: the seated agent reads the plan and ${esc(d.pet)}'s repo and changes files only on its own branch, in a copy of the repo; the pet chat helper saves each answer's changes there. Nothing reaches GitHub until you press Push and say yes in the box on your PC, and nothing goes to main from here. For anything bigger, such as a merge, a key or an account, it asks you here first.</p>
${d.isPrivate ? `<p class="small">${esc(d.pet)} is private: its data never leaves this PC, and a message to My Claude or My ChatGPT does. A note stays here.</p>` : ''}</details>
</div>
${about({
    how: `Needs you lists what waits on you on this page, each a link to its place. Ask answers the quick questions from this page; the AI seated in ${esc(d.pet)}’s harness on this PC answers the rest, supervised, and Push asks you first.`,
    from: 'This page, for Needs you and the quick answers; the pet chat helper on this PC, for the seat; this browser’s backlog, for a note.',
    rules: yourRules(10, `2026-10-20: like Data Chip’s on Data Dealer; 2026-11-03: Claude Code first, then Codex, the agent changing things only on its own branch${phone ? `; 2026-11-03: ${esc(d.home)}’s chat is ${esc(d.pet)}’s own phone` : ''}`),
    notYet: 'Gemini CLI and GitHub Copilot CLI in the seat; the chat on the public site (it says why a message waits).',
  }, { arrow: true })}
</div></aside>`;

  return assertPublic(`<!doctype html>
<html lang="en" data-pet="${esc(d.petSlug)}"${d.backdrop ? ` class="has-backdrop" style="--pet-backdrop: ${d.backdrop}"` : ''}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(d.home)} · ${esc(d.pet)}</title>
${LIVE_CHECK}
<link rel="stylesheet" href="${ASSETS.css}">
${CYBERHOMES[d.repo] ? `<link rel="stylesheet" href="${CYBERHOMES[d.repo].css}">
` : ''}${wordScripts}
</head>
<body>
<main class="page">
${editorial}
<header class="top">${cyberhome}${title}${systemMap}</header>
${levels}
<div class="side-by-side">${rwx}${notes}</div>
<div class="pair">${emotions}${clicker}</div>
${related}
${footer}
</main>
${chat}
<script type="application/json" id="pet-program-data">${json}</script>
${(PET_BOXES[d.repo] || []).some((b) => b.body === keyRequestsBody) ? `<script type="application/json" id="key-request-examples">${JSON.stringify(KEY_REQUEST_EXAMPLES).replaceAll('<', '\\u003c')}</script>\n` : ''}${d.repo === 'github-goldfish' ? `<script type="application/json" id="outstanding-examples">${JSON.stringify(OUTSTANDING_EXAMPLES).replaceAll('<', '\\u003c')}</script>\n` : ''}<script src="${PET_CHAT_JS}"></script>
<script src="${ASSETS.js}"></script>
${d.flashAudit?.matrix?.length ? `<script src="${FLASH_AUDIT_JS}"></script>\n` : ''}${d.repo === 'discord-tower' ? `<script src="${PRESENCE_JS}"></script>\n` : ''}${d.repo === 'rift-rabbit' ? `<script src="${LAUNCHER_JS}"></script>
` : ''}</body>
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
<h2>The model pet program</h2><ul class="cards"><li class="card"><a href="${esc(MODEL_PROGRAM.page.slice(DIR.length + 1))}">${img(`${MODEL_PROGRAM.art}/idle-${MODEL_PROGRAM.date}.svg`, 'Pet Name, idle', 'thumb')}<span class="card-text"><b>Model Pet Program</b><span>Pet Name · every panel, item and light, with placeholder names</span></span></a></li></ul>
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

// ---------- The Model Pet Program ----------
// Astra, 2026-11-02: "a template pet program, like to actually see the website ... instead of it saying like actual
// tools ... it'll just say tool one, tool two, tool three. And what this does is it actually will cover a whole bunch
// of different types of like structures or like styles ... And then it also like has every rule really strictly kind of
// like chiseled out ... And then also it appears across all of the platforms correctly."
// A made-up pet, Pet Name, whose program is Pet Program Name: every kind of item and every light state once, with
// placeholder names, drawn by the same buildPetProgramPage as every real page, so it always follows today's rules. It
// is not an animal: it is in no registry, so the desktop, the Markdown pets and the pet packs leave it out.
// test/model-pet-program-test-20261102.mjs fails when a real page has something the model does not show.
export const MODEL_PROGRAM = { page: `${DIR}/model-pet-program-20261102.html`, tool: `${DIR}/model-pet-program-tool-20261102.html`, toolJs: `${DIR}/model-pet-program-tool-20261102.js`, art: 'art/model-pet-program', date: '20261102', label: 'the-farm-v1.0-model-pet-program-v1.0' };
// The nine placeholder drawings: a plain round pet, one face per mood, drawn as SVG so nobody's art stands in.
const MODEL_FACES = {
  idle: '<circle cx="104" cy="120" r="9"/><circle cx="152" cy="120" r="9"/><path d="M110 160h36" class="line"/>',
  // Awake has its own drawing, eyes open and bright (Astra, 2026-11-03, Flash Audit deck, answer 1: A); `blink` is its
  // mood file's old name.
  blink: '<circle cx="104" cy="120" r="12"/><circle cx="152" cy="120" r="12"/><circle class="shine" cx="108" cy="115" r="4"/><circle class="shine" cx="156" cy="115" r="4"/><path d="M110 156q18 14 36 0" class="line"/>',
  happy: '<path d="M94 124q10-14 20 0M142 124q10-14 20 0" class="line"/><path d="M104 152q24 22 48 0" class="line"/>',
  curious: '<circle cx="104" cy="122" r="9"/><circle cx="152" cy="120" r="12"/><path d="M140 96l26-6" class="line"/><path d="M114 162q14-8 28 0" class="line"/>',
  worried: '<circle cx="104" cy="124" r="9"/><circle cx="152" cy="124" r="9"/><path d="M92 100l22 8M164 100l-22 8" class="line"/><path d="M106 164q8-8 14 0t16 0 14 0" class="line"/>',
  sad: '<circle cx="104" cy="122" r="9"/><circle cx="152" cy="122" r="9"/><path d="M106 170q22-20 44 0" class="line"/><path d="M160 136q6 12 0 16q-6-4 0-16z" class="tear"/>',
  sick: '<path d="M96 114l16 14M112 114l-16 14M144 114l16 14M160 114l-16 14" class="line"/><path d="M106 164q10-8 22 0t22 0" class="line"/>',
  alarmed: '<circle cx="104" cy="118" r="13"/><circle cx="152" cy="118" r="13"/><ellipse cx="128" cy="166" rx="12" ry="15"/>',
  sleep: '<path d="M94 124q10 8 20 0M142 124q10 8 20 0" class="line"/><path d="M114 162h28" class="line"/>',
};
// Each drawing carries the same mood sticker as every pet (Astra, 2026-10-24: the nine mood symbols "stay the same
// across all pets"), from the one sticker set (art-kit STICKERS, indicators INDICATORS), placed the way stampRgba places
// it on a desktop drawing: top right, biting a little into the head, one sticker pixel to 8 of the drawing's.
const stickerAt = (mood) => {
  const art = STICKERS[INDICATORS[mood].sticker], px = 8, sw = art.rows[0].length * px, sh = art.rows.length * px;
  return { art, px, sw, sh, ox: Math.max(px, Math.min(256 - sw - px, 218 - Math.round(sw * 0.35))), oy: Math.max(px, Math.min(256 - sh - px, 43 - Math.round(sh * 0.55))) };
};
const stickerSvg = (mood) => {
  const { art, px, ox, oy } = stickerAt(mood);
  return art.rows.flatMap((row, y) => [...row].map((ch, x) => (art.pal[ch] ? `<rect x="${ox + x * px}" y="${oy + y * px}" width="${px}" height="${px}" fill="${art.pal[ch]}"/>` : ''))).join('');
};
const petSvg = (label, fill, mood) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" aria-label="${label}, ${mood}">`
  + `<style>.body{fill:${fill};stroke:#141218;stroke-width:6}.line{fill:none;stroke:#141218;stroke-width:7;stroke-linecap:round;stroke-linejoin:round}.thin{stroke-width:5}.tear{fill:#6cc7e8;stroke:#141218;stroke-width:3}circle,ellipse{fill:#141218}.shine{fill:#f4f8ff}</style>`
  + '<path class="body" d="M128 46c52 0 86 38 86 92 0 50-36 76-86 76s-86-26-86-76c0-54 34-92 86-92z"/>'
  + '<path class="line thin" d="M84 206l-8 18M172 206l8 18"/>'
  + `${MODEL_FACES[mood]}${stickerSvg(mood)}</svg>\n`;
// Where a placeholder drawing is drawn, in its own pixels, for its desktop size (fitOf measures real drawings from
// their pixels; these are SVG, so it is worked out from the shapes): the body with its outline and the legs' round
// ends, which is what the star would crop, and each mood's sticker, which the page shows too.
const MODEL_BODY = { width: 256, height: 256, left: 39, top: 43, right: 216, bottom: 226 };
const stickerBox = (mood) => { const { sw, sh, ox, oy } = stickerAt(mood); return { ...MODEL_BODY, left: ox, top: oy, right: ox + sw - 1, bottom: oy + sh - 1 }; };
export const modelFit = (moods) => fitVars(desktopScale('model-pet-program', MODEL_BODY), unionBox([MODEL_BODY, ...moods.map(stickerBox)]));
// Pet Name's nine moods, and an idle drawing for each of the two made-up friends.
export const MODEL_FRIENDS = { 'pet-two': ['Pet Two', '#9fd8c4'], 'pet-three': ['Pet Three', '#f2c3a0'] };
export const modelProgramArt = () => ({
  ...Object.fromEntries(MOODS.map((mood) => [`${MODEL_PROGRAM.art}/${mood}-${MODEL_PROGRAM.date}.svg`, petSvg('Pet Name', '#b8b2c6', mood)])),
  ...Object.fromEntries(Object.entries(MODEL_FRIENDS).map(([id, [name, fill]]) => [`${MODEL_PROGRAM.art}/${id}-idle-${MODEL_PROGRAM.date}.svg`, petSvg(name, fill, 'idle')])),
});

/** Pet Name's page data: the same fields as pageData's, every list with one of each kind. */
export function modelProgramData(src) {
  const map = systemMapData(src.registry, src.extra, src.programs);
  const frames = Object.fromEntries(MOODS.map((m) => [m, `${MODEL_PROGRAM.art}/${m}-${MODEL_PROGRAM.date}.svg`]));
  // Its 3rd party programs are placeholders, so program-watch knows neither (`watch`) and neither is a website (`site`).
  const item = (id, name, desc, more = {}) => ({ id: `model-${id}`, name, watch: null, site: null, state: 'now', why: '', desc, url: null, picture: null, embed: null, frame: null,
    inL1: false, inPill: false, pillOpen: false, startClosed: false, panel: null, sharedWith: null, cadence: null, serial: null, group: null, groupName: null, ...more });
  const guide = `https://github.com/${OWNER}/${HUB}/blob/main/PET-PROGRAM-FRAMEWORK.md`;
  const tool = (n, desc, more) => ({ ...item(`tool-${n}`, `tool-${n}`, desc, more), label: `pet-program-name-v1.0-tool-${n}-v1.0`, side: null });
  const toolPage = (n) => `${MODEL_PROGRAM.tool.slice(DIR.length + 1)}?tool=${n}`;
  const grant = (id, who, level, [r, w, x], status, self, how, more = {}) => ({ id: `model-${id}`, who, on: self ? 'Pet Program Name' : 'everything else', self, level, r, w, x, status, how, next: null, evidence: [], ...more });
  const proof = [{ test: 'test/model-pet-program-test-20261102.mjs' }];
  const reg = { repo: 'pet-repo-name', pet: 'Pet Name', audit: { cadence: 'weekly', subject: 'what Pet Program Name looks after', needs: 'a decision only you can make' } };
  return {
    repo: reg.repo, pet: reg.pet, petSlug: 'pet-name', home: 'Pet Program Name', homeSlug: 'pet-program-name', number: 0, assigned: true, stage: 'pipeline',
    summary: 'The model pet program: every tool panel, every kind of item and every light, with placeholder names. One or two sentences on what the pet program does go here.',
    job: 'What Pet Name does, in one sentence.', status: 'hatching', added: 'YYYY-MM-DD', version: { core: '0.0.0', full: '0.0.0', assigned: false },
    visibility: 'private', isPrivate: false, publicRepo: false, host: false, owner: OWNER, repoUrl: `https://github.com/${OWNER}/${reg.repo}`,
    appHref: null, appPrivate: null, vetClinicPrivate: true, mapNode: 'astras-pet-os', ring: '3',
    art: { frames, plain: frames, source: 'model-pet-program' }, petFit: modelFit(MOODS), flashAudit: null, lines: moodKey(src.registry, reg), audit: reg.audit,
    round: { checked: '2026-11-02T08:00:00.000Z', says: 'Example: what the Farmer\'s round found.' },
    needs: ['Example: a decision only you can make.'], needsFrom: [], needsFromRound: true,
    asks: ['Approve the update of tool-three to v1.1? Example: the update audit found a newer version; nothing is installed until you say yes.'],
    statusUpdated: '2026-11-02T08:00:00.000Z', backdrop: null,
    thirdParty: [item('third-party-one', '3rd party program one', 'A program made by someone else that Pet Name runs. Its light turns green while it is open on this PC.'),
      item('third-party-two', '3rd party program two', 'Another program made by someone else, planned.', { state: 'planned' })],
    programs: [item('native-program-one', 'Native program one', 'A program Astra made that Pet Name looks after, opened on its own.', { url: guide }),
      item('native-program-two', 'Native program two', 'Another native program, an idea not agreed yet.', { state: 'idea' })],
    shared: [item('shared-program-one', 'Shared program one', 'A program made with someone else ("Shared").', { sharedWith: 'someone else' })],
    skills: [],
    devices: [item('headset-one', 'Headset one', 'A headset Pet Name looks after: headsets come first.', { serial: 'SERIAL-0001' }),
      item('device-one', 'Device one', 'A device in a group of its own, under its group\'s name.', { group: 'model-device-group', groupName: 'Device group one', serial: 'SERIAL-0002' }),
      item('device-two', 'Device two', 'Another device in the same group.', { group: 'model-device-group', groupName: 'Device group one', serial: 'SERIAL-0003' })],
    tools: [tool('one', 'A tool that works today and was checked: its second light is blue. Open it goes to its own page.', { url: guide }),
      tool('two', 'A tool with an issue reported: its second light is orange.'),
      tool('three', 'A tool with an update waiting for your OK: its second light is yellow, and L3 asks you.'),
      tool('four', 'A tool that is not built yet: off (red), and its second light grey.', { state: 'planned' }),
      tool('five', 'A tool that runs on its own every day and has not been checked yet: report issues until someone checks it.', { cadence: 'daily' }),
      tool('six', 'A tool that works right here, inside its own tool box: its own page, with Open it full screen below.', { embed: toolPage('six'), url: toolPage('six'), inL1: true, inPill: true, pillOpen: true }),
      // A toolset: tools that name it with `in` (`group` here) sit inside its rounded box.
      { ...item('toolset-one', 'toolset-one', 'A toolset: one rounded box that holds several tools, each with its own lights; it folds to its name.'), label: 'pet-program-name-v1.0-toolset-one-v1.0', side: null },
      tool('seven', 'A tool inside toolset-one.', { group: 'model-toolset-one', groupName: 'toolset-one' }),
      tool('eight', 'Another tool inside toolset-one, planned.', { group: 'model-toolset-one', groupName: 'toolset-one', state: 'planned' })],
    tricks: [{ ...item('trick-one', 'trick-one', 'A way the pet\'s AI uses its programs and tools: written steps it follows, every week.', { cadence: 'weekly' }), label: 'pet-program-name-v1.0-trick-one-trick-v1.0' },
      { ...item('trick-two', 'trick-two', 'A trick that is planned, not written yet.', { state: 'planned' }), label: 'pet-program-name-v1.0-trick-two-trick-v1.0' }],
    connections: [{ id: 'model-pet-two', name: 'Pet Two', program: 'Pet Program Two', number: 0, sends: [{ carries: 'findings', state: 'now', why: 'What Pet Name sends Pet Two, working today.' }], receives: [{ carries: 'status', state: 'planned', why: 'What comes back, planned.' }] }],
    related: [{ id: 'model-pet-two', pet: 'Pet Two', home: 'Pet Program Two', state: 'now', why: 'Why they play together: a link that works today.', links: 2, page: 'pet-program-spawner-20261018.html', idle: `${MODEL_PROGRAM.art}/pet-two-idle-${MODEL_PROGRAM.date}.svg`, fit: modelFit(['idle']) },
      { id: 'model-pet-three', pet: 'Pet Three', home: null, state: 'planned', why: 'A pet whose program is not named yet: planned.', links: 1, page: null, idle: `${MODEL_PROGRAM.art}/pet-three-idle-${MODEL_PROGRAM.date}.svg`, fit: modelFit(['idle']) }],
    plays_with: [],
    access: { statuses: map.access.statuses, values: map.access.values,
      on: [grant('owner', 'Astra (you, L4)', ['L4'], ['yes', 'yes', 'yes'], 'enforced', false, 'Example: the verified human may do everything; in code.', { evidence: proof }),
        grant('l3-own', 'The seated agent (L3)', ['L3'], ['yes', 'pr', 'no'], 'written', true, 'Example: reads its own folder and changes it only on a branch Astra merges; a written rule.'),
        grant('l3-rest', 'The seated agent (L3)', ['L3'], ['ask', 'no', 'no'], 'planned', false, 'Example: reads anything else only after asking; planned.', { next: 'Iron Gates issues the grant.' }),
        grant('l2-own', 'Pet Program Name (L2)', ['L2'], ['yes', 'yes', 'no'], 'enforced', true, 'Example: the pet program reads and writes its own data; in code.', { evidence: proof }),
        grant('l1-own', 'Its tools (L1)', ['L1'], ['yes', 'no', 'yes'], 'written', true, 'Example: its tools read and run inside its folder; a written rule.')],
      by: [grant('by-one', 'Pet Program Name', ['L2'], ['yes', 'no', 'no'], 'written', false, 'Example: what Pet Program Name may use outside itself.', { on: 'Native program one' })] },
    languages: [], languageNote: null,
    clicks: { 3: { tool: 'model-tool-one', what: 'Runs tool-one.', label: 'pet-program-name-v1.0-tool-one-v1.0' } },
    editorial: { says: 'Example: the AI working on this pet program writes here how the site is coming along.', by: 'the seated agent', on: '2026-11-02' },
    checks: { 'tool:model-tool-one': { result: 'works', note: 'Example: checked and works.', on: '2026-11-02' },
      'tool:model-tool-two': { result: 'issues', note: 'Example: an issue was reported.', on: '2026-11-02' },
      'tool:model-tool-three': { result: 'update', latest: 'v1.1', note: 'Example: an update is waiting.', on: '2026-11-02' },
      'tool:model-tool-four': { result: 'missing', note: 'Example: not created yet.', on: '2026-11-02' },
      'device:model-headset-one': { result: 'works', note: 'Example: seen and working.', on: '2026-11-02' } },
  };
}

// Its script, a file of its own (pages hold no inline code): Run says it ran, nothing else.
const MODEL_PROGRAM_TOOL_JS = `const said = document.getElementById('said');
let runs = 0;
document.getElementById('run').addEventListener('click', () => {
  runs += 1;
  said.textContent = 'tool-six ran ' + runs + (runs === 1 ? ' time.' : ' times.');
});
let inTool = false;
try { inTool = window.self !== window.top; } catch (e) { inTool = true; }
if (inTool) {
  const tell = () => { try { window.parent.postMessage({ type: 'tool-panel-height', height: Math.ceil(document.body.getBoundingClientRect().height) }, '*'); } catch (e) { /* no page around it */ } };
  tell();
  window.addEventListener('load', tell);
  if (window.ResizeObserver) new ResizeObserver(tell).observe(document.body);
}
`;
// The Model Pet Program's files that are not pages: the example tool's script and the nine drawings.
export const modelProgramAssets = () => ({ [MODEL_PROGRAM.toolJs]: MODEL_PROGRAM_TOOL_JS, ...modelProgramArt() });

/** The small example tool that tool-six runs right on the page: one line, one button, one result. */
export function buildModelProgramTool() {
  return assertPublic(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Example tool · Pet Program Name</title>
${wordScripts}
<style>
html,body{margin:0;background:transparent;color:#f4f8ff;font:15px/1.5 system-ui,-apple-system,'Segoe UI',sans-serif}
main{padding:4px 0}
p{margin:0 0 10px;color:#c3d5ef}
ul{list-style:none;margin:0 0 12px;padding:0;max-width:420px}
li{display:flex;justify-content:space-between;gap:12px;padding:4px 0;border-bottom:1px solid rgba(232,240,255,.35)}
li span:last-child{color:#c3d5ef}
button{border-radius:999px;border:1px solid #e8f0ff;background:rgba(255,255,255,.06);color:inherit;font:inherit;padding:4px 14px;cursor:pointer}
button:hover{background:rgba(255,255,255,.1)}
button:focus-visible{outline:2px solid #ffd84d;outline-offset:2px}
output{display:inline-block;margin-left:10px;font-size:13px;color:#c3d5ef}
</style>
</head>
<body>
<main>
<p>What the tool shows goes here: the tool's own page, working inside its tool box.</p>
<ul>${['one', 'two', 'three'].map((n) => `<li><span>Result ${n}</span><span>value ${n}</span></li>`).join('')}</ul>
<button type="button" id="run">Run</button><output id="said" aria-live="polite">Not run yet.</output>
</main>
<script src="${MODEL_PROGRAM.toolJs.slice(DIR.length + 1)}"></script>
</body>
</html>
`, MODEL_PROGRAM.tool);
}

// ---------- Sources and writing ----------

export function readSpawnerSources(root = '.') {
  const j = (p) => JSON.parse(readFileSync(`${root}/${p}`, 'utf8'));
  const opt = (p, fallback) => (existsSync(`${root}/${p}`) ? j(p) : fallback);
  return {
    registry: j('pets.json'), programs: j('pet-programs.json').programs, extra: j('system-map.json'),
    frameIndex: opt('art/frames/index.json', { pets: {} }), drafts: opt('desktop-art/desktop-drafts-20261018.json', { pets: [] }),
    status: opt('status/pets-status.json', null),
    // The Flash Audit's checks and its last saved run, for The Farm's flash-audit tool box (2026-11-08).
    flashAudit: { matrix: existsSync(`${root}/docs/flash-audit-20261014.md`) ? readMatrix(`${root}/docs/flash-audit-20261014.md`).rows : [], ledger: latestLedger(root) },
    measure: (p, over) => { try { return drawnBox(`${root}/${p}`, over); } catch (e) { return null; } },
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
    const d = pageData({ reg, prog, registry: src.registry, map, ...src });
    // Only The Farm's page has the Flash Audit's checks (its flash-audit tool box); every other page has none.
    d.flashAudit = d.repo === HUB ? src.flashAudit : null;
    out.push(d);
  }
  for (const r of regs) if (!animals.some((p) => p.repo === r.repo)) throw new Error(`${r.repo} is in pets.json but has no registered or pipeline pet program in pet-programs.json.`);
  return out;
}

/** Every file the spawner writes: { path: html }. */
// A pet whose repo moved keeps its old page address as a small page that sends you on, so links to it keep working
// (Astra, 2026-10-28: Discord Damsel's repo became discord-tower; findastra.github.io links the old page).
export const MOVED_PAGES = { 'findastra-discord-presence': 'discord-tower' };
export const movedPage = (now) => '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
  + '<meta name="viewport" content="width=device-width,initial-scale=1">\n<title>This pet program page moved</title>\n'
  + `<meta http-equiv="refresh" content="0; url=${now}-${DATE}.html">\n<link rel="canonical" href="${now}-${DATE}.html">\n`
  + '<style>:root{color-scheme:dark}body{margin:0;min-height:100vh;display:grid;place-items:center;background:#17161d;color:#f3f0f7;font:16px/1.6 system-ui,sans-serif}a{color:#d8b4da}</style>\n'
  + `</head>\n<body>\n<p>This pet program page moved: <a href="${now}-${DATE}.html">open it here</a>.</p>\n</body>\n</html>\n`;
export const movedFiles = () => Object.fromEntries(Object.entries(MOVED_PAGES).map(([was, now]) => [pagePath(was), movedPage(now)]));

export function spawnerFiles(src) {
  const pages = spawnerPages(src);
  const model = buildPetProgramPage(modelProgramData(src));
  const built = Object.fromEntries(pages.map((d) => [pagePath(d.repo), buildPetProgramPage(d)]));
  // The Flash Audit's page checks (2026-11-12): every page as built, part by part, against the Model Pet Program as
  // built. The Farm's page is drawn again with the results; the checks read only the pages' parts, which the results in
  // its flash-audit tool box do not change.
  const farm = pages.find((d) => d.repo === HUB);
  if (farm?.flashAudit?.matrix?.length) {
    const template = templateAudit(model, pages.map((d) => ({ repo: d.repo, pet: d.pet, home: d.home, page: pagePath(d.repo), html: built[pagePath(d.repo)] })));
    built[pagePath(HUB)] = buildPetProgramPage({ ...farm, flashAudit: { ...farm.flashAudit, template } });
  }
  return { ...built, [INDEX]: buildSpawnerIndex(pages), [MODEL_PROGRAM.page]: model, [MODEL_PROGRAM.tool]: buildModelProgramTool() };
}

export function writePetProgramPages(root = '.') {
  const files = spawnerFiles(readSpawnerSources(root));
  mkdirSync(`${root}/${DIR}`, { recursive: true });
  mkdirSync(`${root}/${MODEL_PROGRAM.art}`, { recursive: true });
  for (const [path, html] of Object.entries({ ...files, ...movedFiles(), ...modelProgramAssets() })) writeFileSync(`${root}/${path}`, html);
  return Object.keys(files);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.chdir(fileURLToPath(new URL('..', import.meta.url)));
  const written = writePetProgramPages('.');
  console.log(`Spawned ${written.filter((p) => p.endsWith(`-${DATE}.html`) && p !== INDEX).length} pet program pages, the list (${INDEX}) and the Model Pet Program (${MODEL_PROGRAM.page}).`);
}
