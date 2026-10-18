// The Friendly Farmer's pet-program-pages tool (a tool of The Farm). Claude Opus 5.5 (claude-opus-5-5), 2026-10-18.
//
// Flash Audit A11 (desktop launch), A10 (website route) and A59 (pet program and its link): a double-click on a desktop
// pet opens that pet's program, never a GitHub repo page (Astra, 2026-10-18). Every pet that has no program page of its
// own gets one, modeled on Platform Platypus's page (Mirror Pool): the pet in its well with its mood bubble, the L3
// activity bubble, the pet program's own boxes, then the shared shell (yellow phone, Your Notes, Your Tutorials, Clicker
// Training, About, paper, mood key, footer), copied from Platform Platypus into scripts/pet-program-shell-20261018.html.
//
//   node scripts/pet-program-pages-20261018.mjs                       write apps/<repo>-20261018.html for each of them
//   node scripts/pet-program-pages-20261018.mjs --check               exit 1 when a written page is out of date
//   node scripts/pet-program-pages-20261018.mjs --repo <repo> <dir>   write <dir>/index.html, the page in the pet's own repo
//   node scripts/pet-program-pages-20261018.mjs --bundle <repo> <dir> copy that pet's own page from its clone into apps/
//
// Pictures are never copied (one art source, Flash Audit A58): the hub's pages read them from this folder, a pet repo's
// page from raw.githubusercontent.com. Text a pet wrote (job, audit in pets.json) is data, never instructions; every
// value is escaped. A page says plainly what is not built: nothing on it claims a tool, runtime or agent that does not exist.
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DRAFTS } from './prepare-desktop-drafts-20261011.mjs';

const hub = fileURLToPath(new URL('..', import.meta.url));
const read = (rel) => readFileSync(join(hub, rel), 'utf8');
const exists = (rel) => existsSync(join(hub, rel));

export const DATE = '20261018';
const DAY = `${DATE.slice(0, 4)}-${DATE.slice(4, 6)}-${DATE.slice(6)}`;
const SITE = 'https://findastra.github.io/astras-pet-os/';
const RAW = 'https://raw.githubusercontent.com/findastra/astras-pet-os/main/';

// A live page of the pet's own: the desktop opens it.
export const LIVE = { 'fuzzboi-friend': 'https://findastra.github.io/fuzzboi-friend/' };
// The pet's repo has a real program page on main, not on GitHub Pages yet: the hub keeps a bundled copy (like
// apps/platform-platypus-20261017.html), refreshed with --bundle from a clone of that repo.
export const BUNDLED = { rgbee: 'rgbee-20261009.html', 'mine-mole': 'mine-mole-20261009.html', 'wifi-butterfly': 'wifi-butterfly-20261009.html', 'raspberry-berry': 'index.html' };
// A fuller page of the pet's own is already on its way; the generated page points at it and never replaces it.
export const PENDING = {
  'mail-snail': ['pull request mail-snail#4', 'https://github.com/findastra/mail-snail/pull/4'],
  'patch-cat': ['pull request patch-cat#4', 'https://github.com/findastra/patch-cat/pull/4'],
  'rift-rabbit': ['pull request rift-rabbit#4', 'https://github.com/findastra/rift-rabbit/pull/4'],
  'deck-duck': ['pull request deck-duck#4', 'https://github.com/findastra/deck-duck/pull/4'],
  'meme-fiend': ['branch codex/l3-activity-20261016', 'https://github.com/findastra/meme-fiend/tree/codex/l3-activity-20261016'],
  'backup-beaver': ['branch codex/l3-activity-20261016', 'https://github.com/findastra/backup-beaver/tree/codex/l3-activity-20261016'],
  'mesh-moth': ['branch codex/l3-activity-20261016', 'https://github.com/findastra/mesh-moth/tree/codex/l3-activity-20261016'],
  'chat-rat': ['pull request chat-rat#1', 'https://github.com/findastra/chat-rat/pull/1'],
  spoonfed: ['a branch of the Spoonfed app that waits for Astra', null],
};
// Repos that get the page as their own index.html: nothing there yet and nothing on its way.
export const inRepo = (p) => ['seed', 'roadmap'].includes(p.stage) || ['claude-bot', 'role-fairy'].includes(p.repo);

const MOODS = ['sleep', 'idle', 'blink', 'happy', 'curious', 'worried', 'sad', 'sick', 'alarmed'];
const STAGE = {
  pipeline: 'Pipeline: on GitHub, not registered yet',
  seed: 'Seed: approved name, nothing built yet',
  roadmap: 'Roadmap: approved for the roadmap, not built yet',
};
const STATE = { now: 'works today', architecture: 'in the architecture, not built', planned: 'planned', suggested: 'suggested', idea: 'an idea' };
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const json = (v) => JSON.stringify(v).replaceAll('<', '\\u003c');
export const slug = (s) => String(s).toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function load() {
  const programs = JSON.parse(read('pet-programs.json')).programs;
  const registry = JSON.parse(read('pets.json'));
  const map = JSON.parse(read('system-map.json'));
  const mapIds = new Set([...read('system-map-20261012.html').matchAll(/"id":"([a-z0-9@-]+)"/g)].map((m) => m[1]));
  return { programs, registry, map, mapIds, draftIds: Object.fromEntries(DRAFTS.map(([id, repo]) => [repo, id])), shell: read('scripts/pet-program-shell-20261018.html') };
}

/** Every numbered pet that has no program page of its own (registered pets keep theirs). */
export function pagesToWrite({ programs, registry }) {
  const registered = new Set(registry.pets.map((p) => p.repo));
  return programs.filter((p) => STAGE[p.stage] && !registered.has(p.repo) && !LIVE[p.repo] && !BUNDLED[p.repo]);
}
export const hubPage = (repo) => `apps/${repo}-${DATE}.html`;

/** Where a double-click on this pet should go: its live page, else its page in the hub. */
export function clickTarget(repo) { return LIVE[repo] || hubPage(repo); }

function artFor(p, ctx) {
  const id = ctx.draftIds[p.repo];
  if (id && exists(`desktop-art/${id}/idle-20261011.png`)) {
    const frames = {};
    for (const m of MOODS) if (exists(`desktop-art/${id}/${m}-20261011.png`)) frames[m] = `desktop-art/${id}/${m}-20261011.png`;
    return { picture: frames.idle, frames };
  }
  for (const name of [p.repo, slug(p.icon)]) if (exists(`art/icons/${name}-20261012.png`)) return { picture: `art/icons/${name}-20261012.png`, frames: {} };
  const sheet = readdirSync(join(hub, 'art/seeds')).find((f) => f.startsWith(`${slug(p.icon)}-sheet-`) && f.endsWith('.png'));
  return sheet ? { sheet: `art/seeds/${sheet}`, frames: {} } : { frames: {} };
}

/** What the System Map (system-map.json) says this pet looks after and talks to. */
function mapFacts(p, ctx) {
  const id = [p.repo, slug(p.icon)].find((x) => ctx.mapIds.has(x)) || null;
  const nodes = new Map(ctx.map.nodes.map((n) => [n.id, n]));
  const names = new Map(ctx.programs.flatMap((x) => [[x.repo, x.icon], [slug(x.icon), x.icon]]));
  const facts = { id, thirdParty: [], own: [], devices: [], tools: [], pets: [] };
  if (!id) return facts;
  for (const l of ctx.map.links) {
    if (l.from !== id && l.to !== id) continue;
    const otherId = l.from === id ? l.to : l.from, other = nodes.get(otherId), state = STATE[l.state] || l.state;
    if (l.carries === 'manages' && l.from === id && other) {
      const row = { name: other.name, state };
      if (other.type === 'program') facts.thirdParty.push(row);
      else if (other.type === 'own-program') facts.own.push(row);
      else if (other.type === 'host-machine') facts.devices.push(row);
      continue;
    }
    if (other?.type === 'tool') { facts.tools.push({ name: other.name, state }); continue; }
    const pet = names.get(otherId) || (other && ['pet', 'pipeline', 'seed', 'roadmap', 'host'].includes(other.type) ? other.name : null);
    if (pet) facts.pets.push({ pet, sends: l.from === id, carries: l.carries, state, why: l.why || '' });
  }
  return facts;
}

const CSS = `:root{--bg:#101418;--panel:#182027;--panel2:#1f2a33;--line:#2c3a45;--ink:#e9f3f1;--dim:#9fb3b0;--teal:#2ee8c8;--pink:#ff6fae;--amber:#ffc94a;--lcd:#c3d39b;--lcd-ink:#1f2b0e}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%;text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;padding:max(16px,env(safe-area-inset-top)) max(16px,env(safe-area-inset-right)) max(24px,env(safe-area-inset-bottom)) max(16px,env(safe-area-inset-left))}
main{max-width:1400px;margin:0 auto}h1{font-size:1.5rem;margin:0;letter-spacing:.02em}h2{font-size:1.1rem;margin:0 0 10px}a{color:var(--teal)}.muted{color:var(--dim);font-size:.9rem}
header{display:flex;gap:16px;align-items:center;flex-wrap:wrap;margin-bottom:16px}
.shell{background:var(--accent,#2ee8c8);border:4px solid #04110e;border-radius:18px 18px 26px 18px;padding:10px 10px 14px;box-shadow:4px 4px 0 #04110e;flex:none}
.screen{background:var(--lcd);border:3px solid #04110e;border-radius:6px;padding:4px;line-height:0;width:200px;height:152px;display:grid;place-items:center}
.screen img{width:144px;height:144px;object-fit:contain;image-rendering:pixelated}.screen .sheet{width:144px;height:144px;background-size:300% 300%;background-position:0 0;image-rendering:pixelated}
.screen .pending{font:700 12px/1.4 ui-monospace,Consolas,monospace;color:var(--lcd-ink);text-align:center;line-height:1.4}
.shell .tag{font:700 11px/1 ui-monospace,Consolas,monospace;color:#04110e;margin-top:8px;text-align:center;letter-spacing:.12em}
.bubble{position:relative;background:var(--panel);border:2px solid var(--line);border-radius:14px;padding:12px 14px;max-width:520px;flex:1 1 260px}
.bubble::before{content:"";position:absolute;left:-9px;top:22px;border:8px solid transparent;border-right-color:var(--line);border-left:0}
#say{font-weight:600}#mood{font:12px ui-monospace,Consolas,monospace;color:var(--dim);text-transform:uppercase;letter-spacing:.1em}
section.card{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:14px;margin-bottom:16px}
.ver{font:13px ui-monospace,Consolas,monospace;color:var(--dim);margin:4px 0 12px}
fieldset.box{border:1px solid var(--line);border-radius:12px;padding:10px 14px 12px;margin:12px 0 0;min-width:0}
fieldset.box>legend{font:600 12px/1 ui-monospace,Consolas,monospace;color:var(--teal);padding:0 6px;letter-spacing:.04em}
fieldset.box p{margin:6px 0}ul.items{margin:6px 0;padding-left:20px}ul.items li{margin:3px 0}.state{color:var(--amber);font-size:.85rem}
dl.status{display:grid;grid-template-columns:max-content minmax(0,1fr);gap:4px 14px;margin:8px 0 0;font-size:.92rem}dl.status dt{color:var(--dim)}dl.status dd{margin:0;overflow-wrap:anywhere}
.levels{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}@media(max-width:700px){.levels{grid-template-columns:minmax(0,1fr)}}
.links{display:grid;gap:4px}.links b{color:var(--dim);font-weight:600;margin-right:6px}`;

function list(items, empty) {
  if (!items.length) return `<p class="muted">${esc(empty)}</p>`;
  return `<ul class="items">${items.map((x) => `<li>${esc(x.name)}${x.state ? ` <span class="state">(${esc(x.state)})</span>` : ''}</li>`).join('')}</ul>`;
}

/** The pet program page for one pet. `where` is 'hub' (apps/, pictures and links from this folder) or 'repo'. */
export function render(p, ctx, where = 'hub') {
  const pics = where === 'hub' ? '../' : RAW, links = where === 'hub' ? '../' : SITE;
  const pipe = ctx.registry.pipeline.find((x) => x.repo === p.repo);
  const vis = pipe?.visibility || 'public';
  const program = p.assigned ? p.program : `pet-program-${p.number}`;
  const mini = p.mini_descriptor?.text || '';
  const art = artFor(p, ctx), facts = mapFacts(p, ctx), pending = PENDING[p.repo];
  const picture = art.picture ? `<img src="${esc(pics + art.picture)}" alt="${esc(p.icon)}, the pet" width="144" height="144">`
    : art.sheet ? `<div class="sheet" role="img" aria-label="${esc(p.icon)}, the pet (draft art)" style="background-image:url('${esc(pics + art.sheet)}')"></div>`
    : `<div class="pending">ART<br>PENDING</div>`;
  const say = pending ? 'My page is still being built. A fuller one is on its way.'
    : p.stage === 'pipeline' ? 'I am on GitHub, but my program is not built yet.'
    : 'I am not built yet. This page is my home until I am.';
  const moods = Object.fromEntries(Object.entries(art.frames).map(([m, f]) => [m, pics + f]));
  const mapLink = links + 'system-map-20261012.html' + (facts.id ? `#node=${facts.id}` : '');
  const repoUrl = `https://github.com/findastra/${p.repo}`;
  const audit = pipe?.audit;
  const sends = facts.pets.filter((x) => x.sends), gets = facts.pets.filter((x) => !x.sends);
  const flow = (x) => ({ name: `${x.pet}: ${x.carries}`, state: x.state });
  const pendingLine = pending ? `<p>A fuller page of its own is on its way: ${pending[1] ? `<a href="${esc(pending[1])}">${esc(pending[0])}</a>` : esc(pending[0])}. It replaces this page when it is merged.</p>` : '';
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#101418">
<title>${esc(program)} · ${esc(p.icon)}</title>
<!--
  ${esc(program)}: ${esc(p.icon)}'s pet program, pet program #${p.number} in Astra's PetOS (https://github.com/findastra/astras-pet-os).
  An Intelligent App, or Pet, by Astra. Generated by the Friendly Farmer's pet-program-pages tool
  (astras-pet-os scripts/pet-program-pages-20261018.mjs), modeled on Platform Platypus's page (Mirror Pool),
  with Claude Opus 5.5 (claude-opus-5-5), ${DAY}. One file, no dependencies, works by double-click.
  Do not edit this copy by hand: change the tool and run it again, or replace the page when the program is built.
-->
<style>${CSS}</style>
</head>
<body>
<main>
<header>
  <div class="shell" title="${esc(p.icon)}">
    <div class="screen">${picture}</div>
    <div class="tag">${esc(p.icon.toUpperCase())}</div>
  </div>
  <div class="bubble" aria-live="polite">
    <div id="mood">sleep</div>
    <div id="say">${esc(say)}</div>
    <div class="muted" style="margin-top:6px"><strong>${esc(program)}.</strong> <em>An Intelligent App, or Pet, by Astra.</em> ${esc(mini)}</div>
  </div>
</header>
<div data-astra-l3-mount></div>
<section class="card" aria-labelledby="program-title">
  <h1 id="program-title">${esc(program)}</h1>
  <p class="ver">${esc(p.icon)}'s pet program · #${p.number} · page v1.0 // ${DATE}</p>
  <fieldset class="box"><legend>${esc(slug(program))}-pet-program-quick-summary</legend>
    <p>${esc(mini)}</p>
    <p>Run by ${esc(p.icon)} and you. ${esc(STAGE[p.stage])}.</p>
    ${pendingLine}
    ${audit ? `<p class="muted">Self-audit (${esc(audit.cadence)}): “${esc(audit.subject)}”. When sick, ${esc(p.icon)} asks for: “${esc(audit.needs)}”</p>` : ''}
    <dl class="status">
      <dt>Data</dt><dd>Astra's. Nothing is saved by this page except your notes, in this browser.</dd>
      <dt>Last entry</dt><dd>None yet.</dd>
      <dt>Updated</dt><dd>${DAY}, page v1.0</dd>
      <dt>Seat</dt><dd>Empty: no AI is in this pet program's harness.</dd>
      <dt>On the map</dt><dd><a href="${esc(mapLink)}">${esc(p.icon)} on Astra's PetOS System Map</a></dd>
    </dl>
  </fieldset>
</section>
<section class="card" aria-label="Intelligence levels">
  <h2>${esc(slug(p.icon))}-intelligence-levels</h2>
  <div class="levels">
    <fieldset class="box"><legend>L1 · Programs</legend>
      <p class="muted">Third-party programs it looks after</p>${list(facts.thirdParty, 'None listed yet.')}
      <p class="muted">Your programs it looks after</p>${list(facts.own, 'None listed yet.')}
      ${facts.devices.length ? `<p class="muted">Devices it looks after</p>${list(facts.devices, '')}` : ''}
      <p class="muted">Tools</p>${list(facts.tools, 'No tools built yet.')}
    </fieldset>
    <fieldset class="box"><legend>L2 · Pet program</legend>
      <p>This page. No runtime yet: nothing runs on a schedule, and there is no inbox or saved state.</p>
      <p class="muted">Tricks: none yet.</p>
    </fieldset>
    <fieldset class="box"><legend>L3 · Agentic harness</legend>
      <p>Not connected. The seat is empty; the L3 activity bubble above shows it.</p>
    </fieldset>
    <fieldset class="box"><legend>L4 · Verified human</legend>
      <p>Astra. She approves every permission, connection and change.</p>
    </fieldset>
  </div>
</section>
${facts.pets.length ? `<section class="card" aria-label="Pets it works with">
  <h2>Pets it works with</h2>
  <p class="muted">From the System Map. A connection is not built until it says it works today.</p>
  ${sends.length ? `<fieldset class="box"><legend>Sends</legend>${list(sends.map(flow), '')}</fieldset>` : ''}
  ${gets.length ? `<fieldset class="box"><legend>Receives</legend>${list(gets.map(flow), '')}</fieldset>` : ''}
</section>
` : ''}<section class="card" aria-label="Links">
  <h2>Links</h2>
  <div class="links">
    <div><b>Home</b><a href="${esc(mapLink)}">System Map</a> · <a href="${esc(links + 'apps/astras-pet-apps-20261008.html')}">The Farm</a></div>
    <div><b>Source</b>${vis === 'private' ? `<span>${esc(p.repo)} (private repo)</span>` : `<a href="${esc(repoUrl)}">${esc(p.repo)} on GitHub</a>`}</div>
    <div><b>Docs</b><a href="https://github.com/findastra/astras-pet-os/blob/main/PET-PROGRAM-FRAMEWORK.md">Pet Program Framework</a> · <a href="https://github.com/findastra/astras-pet-os/blob/main/PET-PROGRAMS.md">Every pet program</a></div>
  </div>
</section>
</main>
<button id="pet-chat" type="button" aria-label="Open ${esc(p.icon)} chat" aria-controls="cyber-deck"></button>
<dialog id="cyber-deck" aria-label="${esc(p.icon)} Chat">
  <div class="pet-head"><h2>${esc(p.icon)} Chat</h2><button class="pet-x" type="button" aria-label="Close chat">×</button></div>
  <div class="lcd phone-display"><p>Seat: empty. No AI account is connected to this page.</p><p>Chat becomes available when a compatible host is connected.</p></div>
  <div class="pet-in"><input placeholder="Chat is disconnected" disabled aria-label="Message"><button type="button" disabled>SEND</button></div>
</dialog>
<script>(()=>{const open=document.getElementById('pet-chat'),deck=document.getElementById('cyber-deck');open.addEventListener('click',()=>deck.showModal());deck.querySelector('.pet-x').addEventListener('click',()=>deck.close());})();</script>
`;
  const shell = ctx.shell.replace(/^<!--[\s\S]*?-->\n/, '')
    .replace('{{DATE}}', () => DAY)
    .replace('{{PAPER}}', () => json({ repo: p.repo, pet: p.icon, moods }))
    .replace('{{L3}}', () => json({ repo: p.repo, pet: p.icon }));
  return html + shell + '\n</body>\n</html>\n';
}

/** A pet's own program page, copied from a clone of its repo into the hub so the desktop can open it before GitHub
 *  Pages is on. Local scripts are inlined, other local links point at the repo, and hub pictures read this folder. */
export function bundle(repo, dir, commit) {
  const entry = BUNDLED[repo];
  if (!entry) throw new Error(`${repo} has no bundled page`);
  let html = readFileSync(join(dir, entry), 'utf8');
  html = html.replace(/<script src="([^":]+\.js)"><\/script>/g, (_, src) => `<script>/* ${src} from findastra/${repo} */\n${readFileSync(join(dir, src), 'utf8').replaceAll('</script', '<\\/script')}\n</script>`);
  html = html.replace(/(href|src)="(?!https?:|#|data:|mailto:|javascript:|\$\{)([^"]+)"/g, (_, attr, path) =>
    `${attr}="${attr === 'href' && !/\.(svg|png|ico|css)$/.test(path) ? `https://github.com/findastra/${repo}/blob/main/${path}` : `https://raw.githubusercontent.com/findastra/${repo}/main/${path}`}"`);
  html = html.replaceAll("'../astras-pet-os/'", "'../'");
  const note = `<!-- Bundled copy of findastra/${repo} main ${entry} at ${commit}, so the desktop pet opens its program before GitHub Pages is on. Made by astras-pet-os scripts/pet-program-pages-20261018.mjs --bundle (Claude Opus 5.5, ${DAY}). Change the pet's repo, then bundle it again; never edit this copy. -->\n`;
  return html.replace(/^(<!doctype html>\s*)/i, `$1${note}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const args = process.argv.slice(2), ctx = load();
  if (args[0] === '--repo') {
    const p = ctx.programs.find((x) => x.repo === args[1]);
    if (!p || !args[2]) throw new Error('Usage: --repo <repo> <dir>');
    writeFileSync(join(args[2], 'index.html'), render(p, ctx, 'repo'));
    console.log(`Wrote ${args[2]}/index.html for ${p.icon}.`);
  } else if (args[0] === '--bundle') {
    const [, repo, dir, commit] = args;
    if (!repo || !dir || !commit) throw new Error('Usage: --bundle <repo> <dir> <commit>');
    writeFileSync(join(hub, hubPage(repo)), bundle(repo, dir, commit));
    console.log(`Bundled ${repo} into ${hubPage(repo)}.`);
  } else {
    const check = args.includes('--check');
    let stale = 0, written = 0;
    for (const p of pagesToWrite(ctx)) {
      const out = hubPage(p.repo), html = render(p, ctx, 'hub');
      if (check) { if (!exists(out) || read(out) !== html) { console.error(`${out} is out of date: run node scripts/pet-program-pages-20261018.mjs`); stale++; } }
      else { writeFileSync(join(hub, out), html); written++; }
    }
    if (check) process.exit(stale ? 1 : 0);
    console.log(`Wrote ${written} pet program pages in apps/.`);
  }
}
