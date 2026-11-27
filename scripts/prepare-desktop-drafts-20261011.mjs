// Writes the desktop pets' draft list, desktop-art/desktop-drafts-20261018.json in this hub.
// OpenAI Codex (GPT-6), 2026-10-11 (then a local-only list in %LOCALAPPDATA%). Rewritten for one art source (Flash Audit
// A58) by Claude Opus 5.5, 2026-10-17/18: every draft pet's picture lives in this hub (desktop-art/<pet>/,
// art/drafts/<pet>/), so the list holds paths relative to this folder and is committed next to the pictures. A list in
// %LOCALAPPDATA% did not work: a program started inside the Claude or Codex app writes and reads that app's private
// copy of it, so the real desktop never saw it (2026-10-18).
// The one exception is Claude Bot: his exact copy of ChatGPT's BSOD may not be public, so his entry is marked
// "private" and names only his repo; the desktop pets read his pictures from that repo's folder next to the hub.
//
//   node scripts/prepare-desktop-drafts-20261011.mjs            write the list
//   node scripts/prepare-desktop-drafts-20261011.mjs --print    print it instead
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { repoUrl } from './farm-owner-20261020.mjs';
import { slug } from './developer-words-20261019.mjs';

const hub = fileURLToPath(new URL('..', import.meta.url));
export const LIST = 'desktop-art/desktop-drafts-20261018.json';
// %USERPROFILE%\Documents\Astra's PetOS, where the other repos sit next to this one (ASTRAS_PETOS for a check elsewhere).
const petos = process.env.ASTRAS_PETOS || dirname(hub.replace(/[\\/]$/, ''));
const programs = JSON.parse(readFileSync(join(hub, 'pet-programs.json'), 'utf8')).programs;
const names = Object.fromEntries(programs.map((p) => [p.repo, p.icon]));
const registry = JSON.parse(readFileSync(join(hub, 'pets.json'), 'utf8'));

// [desktop-art id, repo, picture date]. Names come from pet-programs.json (the one list of names). The date is the one in
// the picture files' names; it defaults to 20261011, when most drafts were drawn.
// Door Dormouse (The Threshold, Liminal Doors' caretaker; art by Astra, prepared with OpenAI Codex on 2026-10-18,
// hub PR #61) joined on 2026-10-18 so Astra can see it on her desktop; its pictures are still a draft for her review.
export const DRAFTS = [
  ['rgbee', 'rgbee'], ['mine-mole', 'mine-mole'], ['mail-snail', 'mail-snail'], ['patch-cat', 'patch-cat'],
  ['backup-beaver', 'backup-beaver'], ['rift-rabbit', 'rift-rabbit'], ['wifi-butterfly', 'wifi-butterfly'],
  ['chat-rat', 'chat-rat'], ['deck-duck', 'deck-duck'], ['raspberry-berry', 'raspberry-berry'],
  ['meme-fiend', 'meme-fiend'], ['fuzzboi-friend', 'fuzzboi-friend'], ['gif-giraffe', 'astras-gif-maker'],
  ['workflow-whale', 'workflow-whirlpool'], ['mesh-moth', 'mesh-moth'], ['spoonfed-sugarcube', 'spoonfed'], ['door-dormouse', 'the-threshold', '20261018'],
];

/** True when both of the folder's pictures are the ones on its repo's main (read-only git; live sync keeps it fetched). */
function matchesMain(dir) {
  let root = dir;
  while (!existsSync(join(root, '.git'))) { const up = dirname(root); if (up === root) return false; root = up; }
  const rel = dir.slice(root.length + 1).split(/[\\/]/).join('/');
  try {
    return ['idle-20261011.png', 'blink-20261011.png'].every((f) =>
      execFileSync('git', ['hash-object', join(dir, f)], { cwd: root, encoding: 'utf8' }).trim()
        === execFileSync('git', ['rev-parse', `origin/main:${rel}/${f}`], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim());
  } catch { return false; }
}

// Two clicks on a draft pet open its pet program page, like every pet's (Astra, 2026-10-19: "one click always points to
// program page (Pet Program)"): the hub page the spawner wrote, else its repo while it has none (a seed such as Door
// Dormouse). The desktop opens a hub-relative path from this folder. The repo is on its own account (repoUrl: a pet's own
// github_owner, else the farm owner's; a draft this farm's pets.json does not list is Astra's PetOS's own; card 058, Part 3).
const programPage = (repo) => (existsSync(join(hub, `apps/pet-programs/${repo}-20261018.html`)) ? `apps/pet-programs/${repo}-20261018.html` : repoUrl(registry, repo));

export function draftList() {
  const pets = [];
  const need = (rel) => { if (!existsSync(join(hub, rel))) throw new Error(`Missing ${rel} in the hub`); return rel; };
  // Claude Bot first, as before. His pictures stay in his private repo; the desktop finds that repo's folder next to the hub.
  pets.push({ id: 'claude-bot', name: names['claude-bot'], private: true, repo: 'claude-bot',
    idle: 'desktop-art/claude-bot/idle-20261011.png', blink: 'desktop-art/claude-bot/blink-20261011.png', interface: programPage('claude-bot') });
  // A draft pet's newest drawing in desktop-art/<id>/ wins: the latest date with both idle and blink (2026-11-14,
  // GPT-6-Astra's nine faces for every pet; the desktop's own PetFiles.NewestDrawing picks the same pair).
  const newestPair = (id) => {
    const dir = join(hub, 'desktop-art', id);
    if (!existsSync(dir)) return null;
    const dates = readdirSync(dir).map((n) => /^idle-(\d{8})\.png$/.exec(n)?.[1]).filter(Boolean).sort().reverse();
    const d = dates.find((x) => existsSync(join(dir, `blink-${x}.png`)));
    return d ? { idle: `desktop-art/${id}/idle-${d}.png`, blink: `desktop-art/${id}/blink-${d}.png` } : null;
  };
  for (const [id, repo, date = '20261011'] of DRAFTS) {
    const entry = { id, name: names[repo], interface: programPage(repo) };
    const pair = id === 'fuzzboi-friend' ? null : newestPair(id);
    if (pair) Object.assign(entry, pair);
    else if (id === 'workflow-whale') {
      entry.idle = need('art/drafts/workflow-whale/idle-20261018.png');
      entry.blink = need('art/drafts/workflow-whale/blink-20261018.png');
    } else if (id === 'fuzzboi-friend') {
      // Built from Astra's 32 original Fuzzbois layers at launch; idle and blink are the fallback.
      entry.idle = need('art/drafts/fuzzboi-friend/idle-20261009.png');
      entry.blink = need('art/drafts/fuzzboi-friend/blink-20261009.png');
      const recipes = JSON.parse(readFileSync(join(hub, need('desktop-art/fuzzboi-friend/desktop-recipes-20261011.json')), 'utf8'));
      entry.variants = recipes.variants.map((v) => ({ code: v.code, style: v.style, layers: v.layers.map(need) }));
    } else {
      entry.idle = need(`desktop-art/${id}/idle-${date}.png`);
      entry.blink = need(`desktop-art/${id}/blink-${date}.png`);
    }
    pets.push(entry);
  }
  // Every other pet on the Friendly Farmer's list comes out too (Astra, 2026-11-27: "make sure all 85 or so are showing
  // when I open it, use their host locations in friendly farmer"). Until then the desktop showed only pets.json's pets
  // and the hand-kept DRAFTS above (42 of 85), though every pet has had its own drawing in desktop-art/ since
  // 2026-11-14. Each pet on pet-programs.json not already out is added in its list order, with its picture found where
  // the Friendly Farmer's pages find it (pet-program-pages' petFrames): its newest drawing in desktop-art/ under its
  // pet's name or its repo, else its newest icon (Skill Scout, who has no drawing yet), used for both idle and awake.
  const out = new Set([...(registry.pets || []).map((p) => p.repo), ...DRAFTS.map(([, repo]) => repo), 'claude-bot']);
  const ids = new Set([...(registry.pets || []).map((p) => p.art), ...pets.map((p) => p.id)]);
  const newestIcon = (folders) => {
    const icons = existsSync(join(hub, 'art/icons')) ? readdirSync(join(hub, 'art/icons')) : [];
    const f = icons.filter((n) => folders.some((id) => new RegExp(`^${id}-\\d{8}\\.png$`).test(n))).sort().pop();
    return f ? { idle: `art/icons/${f}`, blink: `art/icons/${f}` } : null;
  };
  for (const program of programs) {
    if (out.has(program.repo)) continue;
    const folders = [...new Set([slug(program.icon), program.repo])];
    const id = folders.find((f) => newestPair(f)) || folders[0];
    const pair = newestPair(id) || newestIcon(folders);
    if (!pair || ids.has(id)) continue; // no picture anywhere yet: the check below names it
    pets.push({ id, name: program.icon, interface: programPage(program.repo), ...pair });
    out.add(program.repo); ids.add(id);
  }
  return { pets };
}

/** The pets on the Friendly Farmer's list (pet-programs.json) that the desktop leaves out: neither in pets.json nor in
 *  the draft list, by pet name. Empty when every pet comes out. */
export function missingFromDesktop(list = draftList()) {
  const shown = new Set([...(registry.pets || []).map((p) => p.pet), ...list.pets.map((p) => p.name)]);
  return programs.filter((p) => !shown.has(p.icon)).map((p) => `${p.icon} (${p.repo})`);
}

/** Where the desktop will find Claude Bot's pictures on this PC, and whether they are the ones on his repo's main. */
export function claudeBotCheck() {
  const dir = [join(petos, 'claude-bot', 'desktop-art', 'claude-bot'), join(petos, 'claude-bot', 'claude-bot-draft-art-20261011', 'desktop-art', 'claude-bot')]
    .find((d) => existsSync(join(d, 'idle-20261011.png')));
  if (!dir) return 'Claude Bot: his private repo is not next to the hub on this PC, so the desktop leaves him out.';
  return matchesMain(dir) ? `Claude Bot: ${dir} matches claude-bot main.`
    : `Claude Bot: ${dir} does NOT match claude-bot main, so the desktop would show older pictures. Bring that folder up to date with Astra's OK.`;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const list = draftList();
  if (process.argv.includes('--print')) console.log(JSON.stringify(list, null, 2));
  else {
    writeFileSync(join(hub, LIST), JSON.stringify(list, null, 1) + '\n');
    console.log(`${list.pets.length} draft pets in ${LIST}; every picture but Claude Bot's is in this hub.`);
  }
  const missing = missingFromDesktop(list);
  if (missing.length) console.warn(`Not on the desktop (no picture in this hub): ${missing.join(', ')}`);
  console.warn(claudeBotCheck());
}
