// How big a pet is on the desktop, so its cyberhome on its pet program page shows it at the same size (Astra,
// 2026-10-23: "still not seeing the right sized rabbit either, needs to be small like the desktop. same size").
// Startup Star (scripts/desktop-pets-20261011.cs, LayoutPets) crops each drawing to the part that is drawn, stands it
// NormalHeight tall, fits it into MaxPetWidth and then applies the pet's own size. The page draws the whole picture,
// so it is scaled until its drawn part comes out that size. Claude Opus 5.5 (claude-opus-5-5), 2026-10-23.
import { readFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';

export const NORMAL_HEIGHT = 58.75;
export const MAX_PET_WIDTH = 96;
// The pet's own size in LayoutPets; the test checks this matches the star's switch.
export const SIZE = {
  'wifi-butterfly': 0.7, 'fuzzboi-friend': 0.75, 'paper-girl': 0.72, 'claude-bot': 1.5, 'rift-rabbit': 0.9, 'chat-rat': 0.8,
  'meme-fiend': 0.8, 'raspberry-berry': 0.8, rgbee: 0.7, 'mesh-moth': 0.64, 'spoonfed-sugarcube': 0.7, 'health-hummy': 0.7776,
  'voicemeeter-bug': 0.8, 'mail-snail': 0.8, 'portfolio-puffer': 0.8, 'ghost-protocol': 0.8, 'finance-finch': 0.85,
  'backup-beaver': 0.85, 'patch-cat': 0.85, 'file-master': 0.72,
};
// These keep NormalHeight even when wide (they are not fitted into MaxPetWidth first).
export const FULL_HEIGHT = new Set(['paper-girl', 'claude-bot', 'file-master']);

// Since 2026-11-08 (Astra: "the pets are not the sizes they would appear on the screen in the corner, so make sure
// they're the right size"): every pet picture on a pet program page (the cyberhome, the nine emotions, the friends list)
// is drawn at the size the star draws that pet, with the empty margin around the drawing cut off, and nothing caps it
// at the old 60px slot. The rules below follow LayoutPets exactly; the test reads them back from the star's own code.
// The five pets that share Mommy's Mommies' body use one crop height, measured up from the soles (SameSize).
export const SAME_SIZE = ['mommys-mommies', 'discord-damsel', 'api-fairy', 'astra-wisp', 'vscode-angel'];
export const SAME_SIZE_CROP = 202;
// The Friendly Farmer stands 0.9 of NormalHeight, his width from his drawing, never fitted into MaxPetWidth.
export const FARMER_SIZE = 0.9;

/** The drawn part of an 8-bit RGBA PNG (alpha over `over`), or null for any other kind. The star crops a drawing of its
 *  own (desktop art and drafts, made crisp first) at alpha 128 and up, any other at alpha over 0. */
export function drawnBox(file, over = 20) {
  const b = readFileSync(file);
  if (b.readUInt32BE(12) !== 0x49484452) return null;
  const width = b.readUInt32BE(16), height = b.readUInt32BE(20);
  if (b[24] !== 8 || b[25] !== 6 || b[28] !== 0) return null;
  const parts = [];
  for (let at = 8; at < b.length;) {
    const len = b.readUInt32BE(at), type = b.toString('latin1', at + 4, at + 8);
    if (type === 'IDAT') parts.push(b.subarray(at + 8, at + 8 + len));
    if (type === 'IEND') break;
    at += 12 + len;
  }
  const raw = inflateSync(Buffer.concat(parts)), row = width * 4, px = Buffer.alloc(row * height);
  for (let y = 0; y < height; y++) {
    const f = raw[y * (row + 1)], src = y * (row + 1) + 1, dst = y * row;
    for (let x = 0; x < row; x++) {
      const a = x >= 4 ? px[dst + x - 4] : 0, up = y ? px[dst - row + x] : 0, c = x >= 4 && y ? px[dst - row + x - 4] : 0;
      const p = a + up - c, pa = Math.abs(p - a), pb = Math.abs(p - up), pc = Math.abs(p - c);
      const pred = f === 1 ? a : f === 2 ? up : f === 3 ? (a + up) >> 1 : f === 4 ? (pa <= pb && pa <= pc ? a : pb <= pc ? up : c) : 0;
      px[dst + x] = (raw[src + x] + pred) & 255;
    }
  }
  let left = width, top = height, right = -1, bottom = -1;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    if (px[y * row + x * 4 + 3] > over) { if (x < left) left = x; if (x > right) right = x; if (y < top) top = y; if (y > bottom) bottom = y; }
  }
  return right < 0 ? null : { width, height, left, top, right, bottom };
}

/** One box around several drawn boxes of pictures the same size (the star crops idle and awake together). */
export function unionBox(boxes) {
  const b = boxes.filter(Boolean);
  if (!b.length) return null;
  return { width: b[0].width, height: b[0].height, left: Math.min(...b.map((x) => x.left)), top: Math.min(...b.map((x) => x.top)),
    right: Math.max(...b.map((x) => x.right)), bottom: Math.max(...b.map((x) => x.bottom)) };
}

/** CSS pixels per drawing pixel, so the pet comes out as big as the star draws it (LayoutPets). `id` is the desktop
 *  pet's id (its `art`, or its draft's id), `crop` the drawn box of its idle and awake drawings together. */
export function desktopScale(id, crop) {
  if (!crop) return null;
  const cropW = crop.right - crop.left + 1, cropH = crop.bottom - crop.top + 1;
  if (id === 'farmer') return NORMAL_HEIGHT * FARMER_SIZE / cropH;
  if (SAME_SIZE.includes(id)) return NORMAL_HEIGHT / SAME_SIZE_CROP;
  let h = NORMAL_HEIGHT;
  const w = h * cropW / cropH;
  if (w > MAX_PET_WIDTH && !FULL_HEIGHT.has(id)) h *= MAX_PET_WIDTH / w;
  return h * (SIZE[id] || 1) / cropH;
}

/** How tall the pet's own drawing stands on the desktop, in CSS pixels (SameSize pets: their 202-pixel crop). */
export function desktopHeight(id, crop) {
  const k = desktopScale(id, crop);
  return k === null ? null : Math.round(k * (SAME_SIZE.includes(id) ? SAME_SIZE_CROP : crop.bottom - crop.top + 1) * 10) / 10;
}

/** The picture drawn at scale `k`, cut to `show` (the drawn box of every picture shown in that place): the CSS
 *  variables img.fit reads (pet-program-page-20261018.css). */
export function fitVars(k, show) {
  if (!k || !show) return null;
  const px = (n) => `${Math.round(n * k * 100) / 100}px`;
  return `--fit-w: ${px(show.width)}; --fit-h: ${px(show.height)}; --fit-t: ${px(show.top)}; --fit-r: ${px(show.width - 1 - show.right)}; --fit-b: ${px(show.height - 1 - show.bottom)}; --fit-l: ${px(show.left)}`;
}
