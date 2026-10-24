// Every desktop-art pet's nine moods with the shared mood stickers stamped on, for the pet program pages (Astra,
// 2026-10-24: "we need 9 distinct bubble things for above the icon that stay the same across all pets ... reuse the ones
// you made for the art and make the other art match too"). Pets built from a sheet get theirs in build-frames.mjs; the
// desktop-art pets are drawn outside that pipeline, so their newest drawing of each mood is stamped here into
//
//   art/moods/<folder>/<mood>.png
//
// The drawings in desktop-art/ are never changed, so a rebuild always starts from them. A drawing the draft list marks
// private (Claude Bot's) is skipped, so it never reaches the public hub.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-24.
import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { decodePng, MOODS } from './sheet-to-sprites.mjs';
import { png } from './art-kit.mjs';
import { stampRgba } from './indicators.mjs';

export const MOOD_DIR = 'art/moods';

/** The newest drawing of each mood in a desktop-art folder, as the pet program pages pick them. */
export function newestMoods(dir) {
  const files = readdirSync(dir);
  const frames = {};
  for (const mood of MOODS) {
    const f = files.filter((n) => new RegExp(`^${mood}(-\\d{8})?\\.png$`).test(n)).sort().pop();
    if (f) frames[mood] = join(dir, f).replace(/\\/g, '/');
  }
  return frames;
}

export function buildMoodStickers(root = '.') {
  const art = join(root, 'desktop-art');
  const draftsFile = join(art, 'desktop-drafts-20261018.json');
  const drafts = existsSync(draftsFile) ? JSON.parse(readFileSync(draftsFile, 'utf8')) : { pets: [] };
  const hidden = new Set((drafts.pets || []).filter((d) => d.private).map((d) => d.id));
  const out = join(root, MOOD_DIR);
  if (existsSync(out)) rmSync(out, { recursive: true, force: true }); // never leave a stale mood behind
  const built = [];
  for (const folder of readdirSync(art).sort()) {
    const dir = join(art, folder);
    if (!statSync(dir).isDirectory() || hidden.has(folder)) continue;
    const frames = newestMoods(dir);
    if (!frames.idle) continue;
    mkdirSync(join(out, folder), { recursive: true });
    for (const [mood, file] of Object.entries(frames)) {
      const src = decodePng(readFileSync(file));
      writeFileSync(join(out, folder, `${mood}.png`), png(src.width, src.height, stampRgba(src.rgba, src.width, src.height, mood)));
    }
    built.push(folder);
  }
  return built;
}

if (process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('build-mood-stickers-20261024.mjs')) {
  console.log(`Stamped mood stickers on ${buildMoodStickers('.').length} desktop-art pets.`);
}
