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
const FULL_HEIGHT = new Set(['paper-girl', 'claude-bot', 'file-master']);

/** The drawn part of an 8-bit RGBA PNG (alpha over 20, as the star counts it), or null for any other kind. */
export function drawnBox(file) {
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
    if (px[y * row + x * 4 + 3] > 20) { if (x < left) left = x; if (x > right) right = x; if (y < top) top = y; if (y > bottom) bottom = y; }
  }
  return right < 0 ? null : { width, height, left, top, right, bottom };
}

/** How tall the whole picture is drawn on the page, in CSS pixels, for the pet to stand as tall as on the desktop. */
export function pictureHeight(id, box) {
  if (!box) return null;
  const cropW = box.right - box.left + 1, cropH = box.bottom - box.top + 1;
  let h = NORMAL_HEIGHT, w = h * cropW / cropH;
  if (w > MAX_PET_WIDTH && !FULL_HEIGHT.has(id)) h *= MAX_PET_WIDTH / w;
  const drawn = h * (SIZE[id] || 1);
  return Math.round(drawn * box.height / cropH * 10) / 10;
}
