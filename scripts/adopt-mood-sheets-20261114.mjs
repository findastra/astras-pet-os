// Brings GPT-6-Astra's nine-mood sheets into the hub as each pet's newest drawing (Astra, 2026-11-14: "Yes, all of them",
// then "Have ChatGPT generate the moods for each one ... Make sure it's GPT-6 Astra Max that does the art").
// For each pet with a sheet in the review folder, it copies the sheet to desktop-art/<folder>/sheet-20261114.png, saves
// the prompt and where the drawing came from next to it, and cuts the nine 256px frames (<mood>-20261114.png) with
// scripts/build-desktop-art-20261011.mjs. The build then stamps the one shared sticker set on every mood
// (art/moods/<folder>/), and the desktop pets, the pet program pages and the Stream Deck all use the newest drawing.
//
//   node scripts/adopt-mood-sheets-20261114.mjs "<review folder>" [--only folder,folder]
//
// <folder> is the pet's desktop id: its `art` in pets.json, else its desktop draft's id, else its pet's name as a slug.
// Pets whose art may not be public (Claude Bot, Skill Scout) are never adopted; Papermon waits for its own pull request
// (#366). Fuzzboi Friend's nine faces are adopted for his moods only: while he is calm he stays a recipe of Astra's
// own Fuzzbois layers on the desktop and her Fuzzbois drawing on his pages (Astra, 2026-11-20, "All recommended": 2C).
// Node's built-in modules only. Claude Opus 5.5 (claude-opus-5-5), 2026-11-14.
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const DATE = '20261114';
// Data Chip keeps the original Data Dealer drawing code (AGENTS.md: "Do not replace Data Chip with generated art").
export const NOT_ADOPTED = { 'data-chip': 'keeps the original Data Dealer drawing (AGENTS.md)', 'claude-bot': 'private art', 'skill-scout': 'private art', papermon: 'waits for #366', 'reactor-raccoon': 'a seed, not a pet program yet (#245)' };
const hub = fileURLToPath(new URL('..', import.meta.url)).replace(/[\\/]$/, '');
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** The hub folder for a pet, by its name. */
export function folderFor(pet, registry, drafts) {
  const reg = (registry.pets || []).find((r) => r.pet === pet);
  if (reg?.art) return reg.art;
  const draft = (drafts.pets || []).find((d) => d.name === pet && !d.private);
  return draft?.id || slug(pet);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const review = process.argv[2];
  if (!review || !existsSync(review)) throw new Error('Pass the review folder (the one with <pet>/sheet-20261114.png).');
  const at = process.argv.indexOf('--only');
  const only = at > 0 ? new Set(process.argv[at + 1].split(',')) : null;
  const registry = JSON.parse(readFileSync(join(hub, 'pets.json'), 'utf8'));
  const drafts = JSON.parse(readFileSync(join(hub, 'desktop-art', 'desktop-drafts-20261018.json'), 'utf8'));
  const rows = JSON.parse(readFileSync(join(review, '..', 'pet-art-rows-20261114.json'), 'utf8'));
  const done = [], skipped = [];
  for (const row of rows) {
    const id = row.folder || slug(row.pet);
    const sheet = join(review, id, `sheet-${DATE}.png`);
    if (NOT_ADOPTED[id]) { skipped.push(`${row.pet}: ${NOT_ADOPTED[id]}`); continue; }
    if (!existsSync(sheet)) { skipped.push(`${row.pet}: no sheet yet`); continue; }
    const folder = folderFor(row.pet, registry, drafts);
    if (only && !only.has(folder)) continue;
    const dir = join(hub, 'desktop-art', folder);
    mkdirSync(dir, { recursive: true });
    copyFileSync(sheet, join(dir, `sheet-${DATE}.png`));
    copyFileSync(join(review, id, 'prompt.txt'), join(dir, `prompt-${DATE}.txt`));
    // Where the drawing came from, without any path on Astra's PC.
    const from = String(row.who || '').replace(/[A-Z]:\\[^\s]*/g, '');
    writeFileSync(join(dir, `source-${DATE}.txt`), `${row.pet}'s nine moods, drawn ${DATE} by GPT-6-Astra (model gpt-6-astra, reasoning effort max) in Codex with its built-in image tool, from ${row.pet}'s newest drawing (${from}). No mood symbols are drawn: the hub's build stamps the one shared sticker set. Draft until Astra approves it.\n`);
    execFileSync(process.execPath, [join(hub, 'scripts', 'build-desktop-art-20261011.mjs'), '--date', DATE, folder], { cwd: hub, stdio: 'inherit' });
    done.push(folder);
  }
  console.log(`\nAdopted ${done.length}: ${done.join(', ')}`);
  if (skipped.length) console.log(`Not adopted ${skipped.length}:\n  ${skipped.join('\n  ')}`);
}
