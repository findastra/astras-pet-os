// Fuzzboi Friend's faces as layers over whichever Fuzzboi he rolled (Astra, 2026-11-20: "Can we save separate emotion
// files, and then add those layers over the new roll once we get it"). Startup Star's self-test checks the desktop side
// (each mood changes only his face and its symbol, also after a reroll); this checks the layers and his page's faces.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { decodePng, MOODS } from '../scripts/sheet-to-sprites.mjs';
import { cutFaces, composeRecipe, herEyes, FACES, FACE_DIR, LAYERS, DIR, DATE, SHEET, PAGE_RECIPE, SIZE } from '../scripts/fuzzboi-mood-layers-20261120.mjs';
import { NOT_ADOPTED } from '../scripts/adopt-mood-sheets-20261114.mjs';

const root = new URL('..', import.meta.url);
const read = (rel) => decodePng(readFileSync(new URL(rel, root)));
const eyes = read(`${LAYERS}/eyes.png`);
const box = (im) => {
  let x0 = im.width, y0 = im.height, x1 = -1, y1 = -1;
  for (let y = 0; y < im.height; y++) for (let x = 0; x < im.width; x++) if (im.rgba[(y * im.width + x) * 4 + 3] >= 128) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
  return { x0, y0, x1, y1 };
};

test('every recipe has one eyes layer, so every roll has a place for a face', () => {
  const { variants } = JSON.parse(readFileSync(new URL(`${DIR}/desktop-recipes-20261011.json`, root), 'utf8'));
  assert.ok(variants.length > 800);
  for (const v of variants) assert.equal(v.layers.filter((l) => l.endsWith('/eyes.png')).length, 1, `${v.code} has one eyes.png`);
});

test('a face layer for blink, sleep and each mood, on her eyes\' canvas and around her eyes', () => {
  const [l, r] = herEyes(eyes);
  const gap = r.cx - l.cx;
  for (const mood of FACES) {
    const face = read(`${FACE_DIR}/${mood}-${DATE}.png`);
    assert.equal(face.width, eyes.width); assert.equal(face.height, eyes.height);
    const b = box(face);
    assert.ok(b.x1 > b.x0, `${mood} has a face`);
    assert.ok(b.x0 > l.cx - gap && b.x1 < r.cx + gap && b.y0 > l.cy - gap && b.y1 < l.cy + gap, `${mood}: the face sits where her eyes are`);
  }
});

test('the pink blush is left out (her rare trait), the sick face keeps its green cheeks', () => {
  const [l, r] = herEyes(eyes);
  const mid = (l.cx + r.cx) / 2, gap = r.cx - l.cx;
  for (const mood of FACES) {
    const { width: W, rgba } = read(`${FACE_DIR}/${mood}-${DATE}.png`);
    let lateralPink = 0, green = 0;
    for (let i = 0; i < rgba.length; i += 4) {
      if (rgba[i + 3] < 200) continue;
      const x = (i / 4) % W, [R, G, B] = [rgba[i], rgba[i + 1], rgba[i + 2]];
      if (R > 200 && R > G + 40 && R > B && Math.abs(x - mid) > gap * 0.3) lateralPink++;
      if (G > 180 && G > R + 20 && G > B) green++;
    }
    assert.equal(lateralPink, 0, `${mood}: no pink blush beside the eyes`);
    assert.equal(green > 0, mood === 'sick', `${mood}: green cheeks only when sick`);
  }
});

test('the layers and his page faces are exactly what the script makes from GPT-6-Astra\'s sheet and her layers', () => {
  const { faces } = cutFaces(read(SHEET), eyes);
  for (const mood of FACES) assert.ok(Buffer.compare(faces[mood], read(`${FACE_DIR}/${mood}-${DATE}.png`).rgba) === 0, `${mood} layer`);
  const page = PAGE_RECIPE.map((name) => ({ name, ...read(`${LAYERS}/${name}`) }));
  for (const mood of ['idle', 'curious']) {
    const layers = page.map((p) => (p.name === 'eyes.png' && mood !== 'idle' ? { name: mood, width: eyes.width, height: eyes.height, rgba: faces[mood] } : p));
    const made = composeRecipe(layers, eyes.width), saved = read(`${DIR}/${mood}-${DATE}.png`);
    assert.equal(saved.width, SIZE);
    assert.ok(Buffer.compare(made, saved.rgba) === 0, `${mood} page face`);
  }
  assert.deepEqual(MOODS.filter((m) => !existsSync(new URL(`${DIR}/${m}-${DATE}.png`, root))), [], 'all nine page faces');
});

test('the adopt script never cuts his sheet into whole frames again', () => {
  assert.match(NOT_ADOPTED['fuzzboi-friend'], /layers/);
});
