// Fuzzboi Friend's faces as layers that go over whichever Fuzzboi he rolled (Astra, 2026-11-20: "figure out what we
// should do with the Fuzzboi since we randomize it and it still needs the emotions. Can we save separate emotion files,
// and then add those layers over the new roll once we get it").
//
// Every recipe of Astra's Fuzzbois layers (desktop-art/fuzzboi-friend/desktop-recipes-20261011.json) draws the same
// eyes layer, layers/eyes.png, at the same place. Each face here is a layer on the same 2048 x 2048 canvas, lined up with
// those eyes, that is drawn in place of eyes.png:
//
//   desktop-art/fuzzboi-friend/layers/moods/<mood>-20261120.png    blink, sleep and the six moods
//
// The faces are cut from GPT-6-Astra's nine-face drawing of Fuzzboi Friend (sheet-20261114.png, the drawing Astra chose
// for his moods on 2026-11-20, "All recommended": 2C): eyes, brows and mouth; the pink blush is left out, because a
// blush is one of her rare traits (rare4.png, her design notes: "blush = 4"); the green cheeks stay, they are the sick
// face. Startup Star draws them over his current roll with the shared sticker (desktop-pets-20261011.cs, RecipeMood).
//
// His pages show one Fuzzboi, the one his 2026-10-09 drawing was made from: fillA4 + outlineA + eyes + acc3 (the
// birthday hat). This script also writes that Fuzzboi's nine faces, from her layers and these face layers, as
//
//   desktop-art/fuzzboi-friend/<mood>-20261120.png    256 x 256, the same way the star composes a recipe
//
// and the build stamps the shared stickers on them (build-mood-stickers-20261024.mjs).
//
//   node scripts/fuzzboi-mood-layers-20261120.mjs        rewrite both from the sheet and her layers
//
// Claude Opus 5.5 (claude-opus-5-5), 2026-11-20.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { decodePng, MOODS } from './sheet-to-sprites.mjs';
import { png } from './art-kit.mjs';

export const DIR = 'desktop-art/fuzzboi-friend';
export const LAYERS = `${DIR}/layers`;
export const FACE_DIR = `${LAYERS}/moods`;
export const DATE = '20261120';
export const SHEET = `${DIR}/sheet-20261114.png`;
export const FACES = MOODS.filter((m) => m !== 'idle'); // idle is her own eyes.png
export const PAGE_RECIPE = ['fillA4.png', 'outlineA.png', 'eyes.png', 'acc3.png'];
export const SIZE = 256;

const FILL = [16, 42, 144]; // GPT-6-Astra's dark blue body
const BLACK = [0, 0, 0], WHITE = [255, 255, 255];

function components(mask, W, H, x0, y0, x1, y1) {
  const seen = new Uint8Array(W * H), out = [];
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
    const i = y * W + x;
    if (!mask[i] || seen[i]) continue;
    const pix = [], stack = [i]; seen[i] = 1;
    while (stack.length) {
      const j = stack.pop(); pix.push(j);
      const jx = j % W, jy = (j / W) | 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = jx + dx, ny = jy + dy;
        if (nx < x0 || ny < y0 || nx >= x1 || ny >= y1) continue;
        const k = ny * W + nx;
        if (mask[k] && !seen[k]) { seen[k] = 1; stack.push(k); }
      }
    }
    let bx0 = 1e9, by0 = 1e9, bx1 = -1, by1 = -1;
    for (const j of pix) { const jx = j % W, jy = (j / W) | 0; bx0 = Math.min(bx0, jx); by0 = Math.min(by0, jy); bx1 = Math.max(bx1, jx); by1 = Math.max(by1, jy); }
    out.push({ pix, x0: bx0, y0: by0, x1: bx1, y1: by1, cx: (bx0 + bx1 + 1) / 2, cy: (by0 + by1 + 1) / 2 });
  }
  return out.sort((a, b) => b.pix.length - a.pix.length);
}

const dist2 = (r, g, b, c) => (r - c[0]) ** 2 + (g - c[1]) ** 2 + (b - c[2]) ** 2;

/** Her eyes layer: the two eyes' centres, left first. */
export function herEyes(eyes) {
  const { width: W, height: H, rgba } = eyes;
  const mask = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) mask[i] = rgba[i * 4 + 3] >= 128 ? 1 : 0;
  const [a, b] = components(mask, W, H, 0, 0, W, H);
  return [a, b].sort((p, q) => p.cx - q.cx);
}

/** One cell of the sheet: its body box and the face pixels inside the body, by colour class. */
function cutCell(sheet, cell) {
  const { width: W, rgba } = sheet;
  const cw = Math.floor(W / 3);
  const cx0 = (cell % 3) * cw, cy0 = Math.floor(cell / 3) * cw, cx1 = cx0 + cw, cy1 = cy0 + cw;
  const H = sheet.height;
  const cls = new Uint8Array(W * H); // 0 clear, 1 fill, 2 black, 3 white, 4 pink, 5 green
  let bx0 = 1e9, by0 = 1e9;
  for (let y = cy0; y < cy1; y++) for (let x = cx0; x < cx1; x++) {
    const i = (y * W + x) * 4;
    if (rgba[i + 3] < 128) continue;
    bx0 = Math.min(bx0, x); by0 = Math.min(by0, y);
    const r = rgba[i], g = rgba[i + 1], b = rgba[i + 2];
    const pink = r > 170 && r > g + 30 && r > b; // blush, tongue
    const green = g > 150 && g > r + 20 && g > b; // sick cheeks
    const k = pink ? 4 : green ? 5 : [[1, FILL], [2, BLACK], [3, WHITE]].sort((p, q) => dist2(r, g, b, p[1]) - dist2(r, g, b, q[1]))[0][0];
    cls[y * W + x] = k;
  }
  // Outside the body: everything not fill that the cell's border reaches (the clear background and the outline).
  const notFill = new Uint8Array(W * H);
  for (let y = cy0; y < cy1; y++) for (let x = cx0; x < cx1; x++) notFill[y * W + x] = cls[y * W + x] === 1 ? 0 : 1;
  // The outline and the clear background are one part that touches the cell's border; the face is the islands inside
  // the fill (a few stray pixels are not a feature).
  const islands = components(notFill, W, H, cx0, cy0, cx1, cy1)
    .filter((p) => p.x0 > cx0 && p.y0 > cy0 && p.x1 < cx1 - 1 && p.y1 < cy1 - 1 && p.pix.length >= 6);
  return { cls, islands, body: [bx0 - cx0, by0 - cy0], origin: [cx0, cy0], W };
}

/** The face layers, keyed by mood, as 2048 x 2048 RGBA. */
export function cutFaces(sheet, eyes) {
  const her = herEyes(eyes);
  const idle = cutCell(sheet, MOODS.indexOf('idle'));
  const gpt = idle.islands.slice(0, 2).sort((p, q) => p.cx - q.cx);
  const local = (p, c) => [p.cx - c.origin[0] - c.body[0], p.cy - c.origin[1] - c.body[1]];
  const [gl, gr] = gpt.map((p) => local(p, idle));
  const hm = [(her[0].cx + her[1].cx) / 2, (her[0].cy + her[1].cy) / 2];
  const gm = [(gl[0] + gr[0]) / 2, (gl[1] + gr[1]) / 2];
  const s = Math.hypot(her[1].cx - her[0].cx, her[1].cy - her[0].cy) / Math.hypot(gr[0] - gl[0], gr[1] - gl[1]);
  const eyeGap = Math.hypot(gr[0] - gl[0], gr[1] - gl[1]);
  const out = {};
  const LW = eyes.width, LH = eyes.height;
  const colour = { 2: BLACK, 3: WHITE, 4: [248, 166, 190], 5: [168, 226, 184] };
  for (const mood of FACES) {
    const c = cutCell(sheet, MOODS.indexOf(mood));
    const W = c.W;
    // Measured colours of this cell's pink and green, so the mouth keeps GPT-6-Astra's own colour.
    for (const k of [4, 5]) {
      let r = 0, g = 0, b = 0, n = 0;
      for (const p of c.islands) for (const j of p.pix) if (c.cls[j] === k) { r += sheet.rgba[j * 4]; g += sheet.rgba[j * 4 + 1]; b += sheet.rgba[j * 4 + 2]; n++; }
      if (n) colour[k] = [r / n, g / n, b / n].map(Math.round);
    }
    // Source face in the cell's own pixels, premultiplied: every island except the pink blush beside the eyes.
    const keep = new Uint8Array(W * sheet.height);
    let fx0 = 1e9, fy0 = 1e9, fx1 = -1, fy1 = -1;
    for (const p of c.islands) {
      const counts = [0, 0, 0, 0, 0, 0];
      for (const j of p.pix) counts[c.cls[j]]++;
      const [lx] = local(p, c);
      const blush = counts[4] > p.pix.length / 2 && Math.abs(lx - gm[0]) > eyeGap * 0.3;
      if (blush) continue;
      for (const j of p.pix) keep[j] = 1;
      fx0 = Math.min(fx0, p.x0); fy0 = Math.min(fy0, p.y0); fx1 = Math.max(fx1, p.x1); fy1 = Math.max(fy1, p.y1);
    }
    // The colour of the cut face at a source pixel, or null where it is clear.
    const sample = (x, y) => {
      if (x < 0 || y < 0 || x >= W || y >= sheet.height) return null;
      const j = y * W + x;
      return keep[j] ? colour[c.cls[j]] || BLACK : null;
    };
    // Map: layer = hm + s * (cell-local - gm); for each layer pixel, go back to the cell and sample bilinearly (alpha
    // from how many of the four neighbours are face, colour their weighted average).
    const toLayer = (x, y) => [hm[0] + s * (x - c.origin[0] - c.body[0] - gm[0]), hm[1] + s * (y - c.origin[1] - c.body[1] - gm[1])];
    const [lx0, ly0] = toLayer(fx0 - 2, fy0 - 2), [lx1, ly1] = toLayer(fx1 + 3, fy1 + 3);
    const rgba = Buffer.alloc(LW * LH * 4);
    for (let Y = Math.max(0, Math.floor(ly0)); Y < Math.min(LH, Math.ceil(ly1)); Y++) for (let X = Math.max(0, Math.floor(lx0)); X < Math.min(LW, Math.ceil(lx1)); X++) {
      const sx = (X + 0.5 - hm[0]) / s + gm[0] + c.origin[0] + c.body[0] - 0.5;
      const sy = (Y + 0.5 - hm[1]) / s + gm[1] + c.origin[1] + c.body[1] - 0.5;
      const ix = Math.floor(sx), iy = Math.floor(sy), tx = sx - ix, ty = sy - iy;
      const near = [[ix, iy, (1 - tx) * (1 - ty)], [ix + 1, iy, tx * (1 - ty)], [ix, iy + 1, (1 - tx) * ty], [ix + 1, iy + 1, tx * ty]];
      let al = 0; const sum = [0, 0, 0];
      for (const [x, y, w] of near) { const col = sample(x, y); if (!col) continue; al += w; for (let k = 0; k < 3; k++) sum[k] += col[k] * w; }
      if (al * 255 < 1) continue;
      const i = (Y * LW + X) * 4;
      for (let k = 0; k < 3; k++) rgba[i + k] = Math.round(sum[k] / al);
      rgba[i + 3] = Math.round(al * 255);
    }
    out[mood] = rgba;
  }
  return { faces: out, width: LW, height: LH, scale: s, her, gpt: [gl, gr] };
}

/** Straight-alpha "over" of one 2048 layer onto a premultiplied float canvas. */
function over(canvas, layer, { black = false } = {}) {
  const { rgba } = layer;
  for (let i = 0, n = rgba.length; i < n; i += 4) {
    const a = rgba[i + 3] / 255;
    if (a === 0) continue;
    const r = black ? 0 : rgba[i], g = black ? 0 : rgba[i + 1], b = black ? 0 : rgba[i + 2];
    const k = 1 - a;
    canvas[i] = r * a + canvas[i] * k; canvas[i + 1] = g * a + canvas[i + 1] * k; canvas[i + 2] = b * a + canvas[i + 2] * k; canvas[i + 3] = 255 * a + canvas[i + 3] * k;
  }
}

/** A recipe's picture at 256 x 256: her layers in order, outlineB drawn black as on the desktop, crisp edges. */
export function composeRecipe(layers, W = 2048, size = SIZE) {
  const canvas = new Float32Array(W * W * 4);
  for (const l of layers) over(canvas, l, { black: l.name === 'outlineB.png' });
  const f = W / size, out = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    let r = 0, g = 0, b = 0, a = 0;
    for (let dy = 0; dy < f; dy++) for (let dx = 0; dx < f; dx++) {
      const i = ((y * f + dy) * W + x * f + dx) * 4;
      r += canvas[i]; g += canvas[i + 1]; b += canvas[i + 2]; a += canvas[i + 3];
    }
    const o = (y * size + x) * 4;
    if (a / (f * f) < 128) continue; // crisp, as the star's CrispTransparency
    out[o] = Math.round(r / a * 255); out[o + 1] = Math.round(g / a * 255); out[o + 2] = Math.round(b / a * 255); out[o + 3] = 255;
  }
  return out;
}

export function buildFuzzboiMoodLayers(root = '.') {
  const read = (rel) => decodePng(readFileSync(join(root, rel)));
  const eyes = read(`${LAYERS}/eyes.png`);
  const { faces, width, height } = cutFaces(read(SHEET), eyes);
  mkdirSync(join(root, FACE_DIR), { recursive: true });
  for (const [mood, rgba] of Object.entries(faces)) writeFileSync(join(root, FACE_DIR, `${mood}-${DATE}.png`), png(width, height, rgba));
  const layer = (name) => ({ name, ...read(`${LAYERS}/${name}`) });
  const page = PAGE_RECIPE.map(layer);
  for (const mood of MOODS) {
    const layers = page.map((l) => (l.name === 'eyes.png' && mood !== 'idle' ? { name: `moods/${mood}`, width, height, rgba: faces[mood] } : l));
    writeFileSync(join(root, DIR, `${mood}-${DATE}.png`), png(SIZE, SIZE, composeRecipe(layers, width)));
  }
  return Object.keys(faces);
}

if (process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('fuzzboi-mood-layers-20261120.mjs')) {
  console.log(`Fuzzboi Friend: ${buildFuzzboiMoodLayers('.').length} face layers and his page's nine faces.`);
}
