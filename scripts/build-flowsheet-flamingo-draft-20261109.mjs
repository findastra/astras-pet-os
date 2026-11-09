// Flowsheet Flamingo's draft mood frames and The Pilot Plant's program icon, from the one sheet generated 2026-11-09
// with Astra's OK ("Yes, make the art"; prompt: DRAFT_FLOWSHEET_FLAMINGO in generate-pets.mjs). Reuses the sheet, never
// generates. Run from the hub: node scripts/build-flowsheet-flamingo-draft-20261109.mjs. Claude Opus 5.5
// (claude-opus-5-5), 2026-11-09, after build-pc-master-draft-20261103.mjs.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { sheetToSprite } from './sheet-to-sprites.mjs';
import { addIndicators } from './indicators.mjs';
import { png } from './art-kit.mjs';

const dir = 'art/drafts/flowsheet-flamingo';
const sprite = addIndicators(sheetToSprite(readFileSync(`${dir}/flowsheet-flamingo-mood-sheet-20261109.png`), { size: 256, colours: 24 }));
for (const [mood, f] of Object.entries(sprite.frames)) {
  const rgba = Buffer.alloc(256 * 256 * 4);
  f.rows.forEach((r, y) => [...r].forEach((c, x) => {
    const h = f.pal[c]; if (!h) return;
    const i = (y * 256 + x) * 4;
    for (let k = 0; k < 3; k++) rgba[i + k] = parseInt(h.slice(1 + 2 * k, 3 + 2 * k), 16);
    rgba[i + 3] = 255;
  }));
  const bytes = png(256, 256, rgba);
  writeFileSync(`${dir}/${mood}-20261109.png`, bytes);
  if (mood === 'idle') { mkdirSync('art/icons', { recursive: true }); writeFileSync('art/icons/the-pilot-plant-20261109.png', bytes); }
}
console.log('Flowsheet Flamingo: nine draft mood frames and The Pilot Plant icon, from the existing sheet.');
