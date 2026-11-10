// PC Master's draft mood frames and program icon, from the one sheet generated 2026-11-03 with Astra's OK ("He's
// going to need art, too"; prompt: DRAFT_PC_MASTER in generate-pets.mjs). Reuses the sheet, never generates.
// Run from the hub: node scripts/build-pc-master-draft-20261103.mjs. Claude Opus 5.5 (claude-opus-5-5), 2026-11-03.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { sheetToSprite } from './sheet-to-sprites.mjs';
import { addIndicators } from './indicators.mjs';
import { png } from './art-kit.mjs';

const dir = 'art/drafts/pc-master-race';
const sprite = addIndicators(sheetToSprite(readFileSync(`${dir}/pc-master-mood-sheet-20261103.png`), { size: 256, colours: 24 }));
for (const [mood, f] of Object.entries(sprite.frames)) {
  const rgba = Buffer.alloc(256 * 256 * 4);
  f.rows.forEach((r, y) => [...r].forEach((c, x) => {
    const h = f.pal[c]; if (!h) return;
    const i = (y * 256 + x) * 4;
    for (let k = 0; k < 3; k++) rgba[i + k] = parseInt(h.slice(1 + 2 * k, 3 + 2 * k), 16);
    rgba[i + 3] = 255;
  }));
  const bytes = png(256, 256, rgba);
  writeFileSync(`${dir}/${mood}-20261103.png`, bytes);
  if (mood === 'idle') { mkdirSync('art/icons', { recursive: true }); writeFileSync('art/icons/pc-master-race-20261103.png', bytes); }
}
console.log('PC Master: nine draft mood frames and the program icon, from the existing sheet.');
