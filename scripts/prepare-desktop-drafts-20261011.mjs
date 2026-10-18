// Writes the desktop pets' local draft list, %LOCALAPPDATA%\astras-pet-apps\desktop-drafts-20261011.json.
// OpenAI Codex (GPT-6), 2026-10-11. Rewritten for one art source (Flash Audit A58) by Claude Opus 5.5, 2026-10-17:
// every draft pet's picture lives in this hub (desktop-art/<pet>/, art/drafts/<pet>/), so the list holds paths
// relative to this folder and the desktop pets app refuses anything outside it. The one exception is Claude Bot:
// his exact copy of ChatGPT's BSOD may not be public, so his entry points into his private repo's folder on this PC
// and is marked "private" (Astra, 2026-10-17).
//
//   node scripts/prepare-desktop-drafts-20261011.mjs            write the list
//   node scripts/prepare-desktop-drafts-20261011.mjs --print    print it instead
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const hub = fileURLToPath(new URL('..', import.meta.url));
// %USERPROFILE%\Documents\Astra's PetOS, where the other repos sit next to this one (ASTRAS_PETOS for a dry run elsewhere).
const petos = process.env.ASTRAS_PETOS || dirname(hub.replace(/[\\/]$/, ''));
const names = Object.fromEntries(JSON.parse(readFileSync(join(hub, 'pet-programs.json'), 'utf8')).programs.map((p) => [p.repo, p.icon]));

// [desktop-art id, repo]. Names come from pet-programs.json (the one list of names).
export const DRAFTS = [
  ['rgbee', 'rgbee'], ['mine-mole', 'mine-mole'], ['mail-snail', 'mail-snail'], ['patch-cat', 'patch-cat'],
  ['backup-beaver', 'backup-beaver'], ['rift-rabbit', 'rift-rabbit'], ['wifi-butterfly', 'wifi-butterfly'],
  ['chat-rat', 'chat-rat'], ['deck-duck', 'deck-duck'], ['raspberry-berry', 'raspberry-berry'],
  ['meme-fiend', 'meme-fiend'], ['fuzzboi-friend', 'fuzzboi-friend'], ['gif-giraffe', 'astras-gif-maker'],
  ['mesh-moth', 'mesh-moth'], ['spoonfed-sugarcube', 'spoonfed'],
];

const listFile = () => join(process.env.LOCALAPPDATA || '', 'astras-pet-apps', 'desktop-drafts-20261011.json');
function currentList() {
  try { return JSON.parse(readFileSync(listFile(), 'utf8').replace(/^﻿/, '')); } catch { return null; }
}
/** True when both of the folder's pictures are the ones on claude-bot's main (read-only git; live sync keeps it fetched). */
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

export function draftList() {
  const pets = [];
  const need = (rel) => { if (!existsSync(join(hub, rel))) throw new Error(`Missing ${rel} in the hub`); return rel; };
  // Claude Bot first, as before: the one entry outside the hub. His folder is used only when its pictures match his
  // repo's main (an older, untracked copy sat in that working copy on 2026-10-18); otherwise his current entry stays.
  const bot = [join(petos, 'claude-bot', 'desktop-art', 'claude-bot'), join(petos, 'claude-bot', 'claude-bot-draft-art-20261011', 'desktop-art', 'claude-bot')]
    .find((d) => existsSync(join(d, 'idle-20261011.png')) && matchesMain(d));
  if (bot) pets.push({ id: 'claude-bot', name: names['claude-bot'], private: true, idle: join(bot, 'idle-20261011.png'), blink: join(bot, 'blink-20261011.png'), interface: 'https://github.com/findastra/claude-bot' });
  else {
    const kept = currentList()?.pets?.find((p) => p.id === 'claude-bot');
    if (kept) { pets.push({ ...kept, private: true }); console.warn(`Claude Bot keeps his current entry (${kept.idle}): his repo folder on this PC is missing or does not match claude-bot main. Update that working copy, then run this again.`); }
    else console.warn('Claude Bot left out: his private repo is not on this PC.');
  }
  for (const [id, repo] of DRAFTS) {
    const entry = { id, name: names[repo], interface: `https://github.com/findastra/${repo}` };
    if (id === 'fuzzboi-friend') {
      // Built from Astra's 32 original Fuzzbois layers at launch; idle and blink are the fallback.
      entry.idle = need('art/drafts/fuzzboi-friend/idle-20261009.png');
      entry.blink = need('art/drafts/fuzzboi-friend/blink-20261009.png');
      const recipes = JSON.parse(readFileSync(join(hub, need('desktop-art/fuzzboi-friend/desktop-recipes-20261011.json')), 'utf8'));
      entry.variants = recipes.variants.map((v) => ({ code: v.code, style: v.style, layers: v.layers.map(need) }));
    } else {
      entry.idle = need(`desktop-art/${id}/idle-20261011.png`);
      entry.blink = need(`desktop-art/${id}/blink-20261011.png`);
    }
    pets.push(entry);
  }
  return { pets };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const list = draftList();
  if (process.argv.includes('--print')) console.log(JSON.stringify(list, null, 2));
  else {
    const local = join(process.env.LOCALAPPDATA, 'astras-pet-apps');
    mkdirSync(local, { recursive: true });
    writeFileSync(join(local, 'desktop-drafts-20261011.json'), JSON.stringify(list, null, 2));
    console.log(`${list.pets.length} draft pets listed; every picture but Claude Bot's is in this hub.`);
  }
}
