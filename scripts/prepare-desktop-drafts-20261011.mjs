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
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const hub = fileURLToPath(new URL('..', import.meta.url));
export const LIST = 'desktop-art/desktop-drafts-20261018.json';
// %USERPROFILE%\Documents\Astra's PetOS, where the other repos sit next to this one (ASTRAS_PETOS for a check elsewhere).
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

export function draftList() {
  const pets = [];
  const need = (rel) => { if (!existsSync(join(hub, rel))) throw new Error(`Missing ${rel} in the hub`); return rel; };
  // Claude Bot first, as before. His pictures stay in his private repo; the desktop finds that repo's folder next to the hub.
  pets.push({ id: 'claude-bot', name: names['claude-bot'], private: true, repo: 'claude-bot',
    idle: 'desktop-art/claude-bot/idle-20261011.png', blink: 'desktop-art/claude-bot/blink-20261011.png', interface: 'https://github.com/findastra/claude-bot' });
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
  console.warn(claudeBotCheck());
}
