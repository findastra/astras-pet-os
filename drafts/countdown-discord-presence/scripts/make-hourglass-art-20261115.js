// Draws the hourglass, the one picture behind the card art and the app icon, and writes both PNGs
// (`npm run art`). Original art drawn in code: neon on graphite, black outlines. Node's built-in modules only.
import { deflateSync, crc32 } from 'node:zlib';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const CARD_SIZE = 512;
export const ICON_SIZE = 1024;

const GRAPHITE = [27, 29, 34];
const GLOW = [48, 34, 66];
const CYAN = [63, 243, 255];
const CYAN_DIM = [30, 150, 170];
const PINK = [255, 79, 216];
const GLASS = [70, 74, 92];
const EDGE = [214, 236, 255];
const BLACK = [0, 0, 0];
const YELLOW = [255, 236, 92];

// Half-width of the glass at height y: narrow at the neck (y = 0.5), round bulbs above and below.
function glassHalf(y) {
  const t = Math.min(1, Math.abs(y - 0.5) / 0.3);
  return 0.035 + 0.22 * (1 - (1 - t) ** 2.4);
}
const inGlass = (x, y, m) => y > 0.2 - m && y < 0.8 + m && Math.abs(x - 0.5) < glassHalf(Math.min(0.8, Math.max(0.2, y))) + m;
function roundRect(x, y, m, x0, y0, x1, y1, r) {
  const dx = Math.max(x0 + r - x, 0, x - (x1 - r)), dy = Math.max(y0 + r - y, 0, y - (y1 - r));
  return Math.hypot(dx, dy) < r + m && x > x0 - m && x < x1 + m && y > y0 - m && y < y1 + m;
}
// The four-pointed sparkle beside the glass.
function sparkle(x, y, m, cx, cy, s) {
  const dx = Math.abs(x - cx) / s, dy = Math.abs(y - cy) / s;
  return Math.sqrt(dx) + Math.sqrt(dy) < 1 + m / s * 2;
}

// Each shape is drawn twice, painter's order: first grown by the outline width in black, then its colour.
const OUTLINE = 0.012;
const SHAPES = [
  { colour: CYAN_DIM, inside: (x, y, m) => roundRect(x, y, m, 0.225, 0.17, 0.255, 0.83, 0.012) },
  { colour: CYAN_DIM, inside: (x, y, m) => roundRect(x, y, m, 0.745, 0.17, 0.775, 0.83, 0.012) },
  { colour: EDGE, inside: (x, y, m) => inGlass(x, y, m) },
  { colour: GLASS, inside: (x, y, m) => m === 0 && inGlass(x, y, -0.014), noOutline: true },
  // Sand left in the top bulb, its surface dipping toward the neck.
  { colour: PINK, inside: (x, y, m) => m === 0 && inGlass(x, y, -0.014) && y < 0.5 && y > 0.36 + 0.5 * (x - 0.5) ** 2, noOutline: true },
  // The falling stream, then the heap in the bottom bulb.
  { colour: PINK, inside: (x, y, m) => m === 0 && Math.abs(x - 0.5) < 0.008 && y > 0.48 && y < 0.7, noOutline: true },
  { colour: PINK, inside: (x, y, m) => m === 0 && inGlass(x, y, -0.014) && y > 0.64 + 1.4 * (x - 0.5) ** 2, noOutline: true },
  { colour: CYAN, inside: (x, y, m) => roundRect(x, y, m, 0.17, 0.13, 0.83, 0.2, 0.02) },
  { colour: CYAN, inside: (x, y, m) => roundRect(x, y, m, 0.17, 0.8, 0.83, 0.87, 0.02) },
  { colour: YELLOW, inside: (x, y, m) => sparkle(x, y, m, 0.84, 0.32, 0.06) },
];

function sample(x, y) {
  // Graphite with a soft violet glow behind the glass.
  const glow = Math.max(0, 1 - Math.hypot(x - 0.5, y - 0.5) / 0.55);
  let colour = GRAPHITE.map((c, i) => c + (GLOW[i] - c) * glow * glow);
  for (const shape of SHAPES) {
    if (!shape.noOutline && shape.inside(x, y, OUTLINE)) colour = BLACK;
    if (shape.inside(x, y, 0)) colour = shape.colour;
  }
  return colour;
}

// RGB pixels at any size, 4×4 samples a pixel for smooth edges.
export function drawHourglass(size) {
  const pixels = Buffer.alloc(size * size * 3);
  const n = 4;
  for (let py = 0; py < size; py++) for (let px = 0; px < size; px++) {
    const sum = [0, 0, 0];
    for (let sy = 0; sy < n; sy++) for (let sx = 0; sx < n; sx++) {
      const c = sample((px + (sx + 0.5) / n) / size, (py + (sy + 0.5) / n) / size);
      sum[0] += c[0]; sum[1] += c[1]; sum[2] += c[2];
    }
    const o = (py * size + px) * 3;
    for (let i = 0; i < 3; i++) pixels[o + i] = Math.round(sum[i] / (n * n));
  }
  return pixels;
}

function chunk(type, data) {
  const head = Buffer.alloc(8);
  head.writeUInt32BE(data.length, 0);
  head.write(type, 4, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), data])) >>> 0, 0);
  return Buffer.concat([head, data, crc]);
}

export function encodePng(size, rgb) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // truecolour RGB
  const rows = Buffer.alloc(size * (size * 3 + 1));
  for (let y = 0; y < size; y++) rgb.copy(rows, y * (size * 3 + 1) + 1, y * size * 3, (y + 1) * size * 3);
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(rows, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}

export const makeCardPng = () => encodePng(CARD_SIZE, drawHourglass(CARD_SIZE));
export const makeIconPng = () => encodePng(ICON_SIZE, drawHourglass(ICON_SIZE));

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  writeFileSync(new URL('../public/hourglass-card-20261115.png', import.meta.url), makeCardPng());
  writeFileSync(new URL('../public/hourglass-icon-20261115.png', import.meta.url), makeIconPng());
  console.log('Wrote public/hourglass-card-20261115.png and public/hourglass-icon-20261115.png.');
}
