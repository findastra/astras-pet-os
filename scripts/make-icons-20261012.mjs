// Every pet's icon, art/icons/<id>-YYYYMMDD.png (96px). The System Map, the intelligence-levels chart, the Pets Board,
// the roster and the Flash Audit cards use them. Astra, 2026-10-12.
//
// `npm run build` makes them (scripts/build.mjs), so an icon is never older than its pet's drawing (Astra, 2026-11-20:
// icons for all pets are the Friendly Farmer's job; 24 had gone stale after #370 and #371 because this ran by hand).
// An icon is made from the calm picture the pet's own program page shows as idle, without its mood sticker (petFrames,
// pet-program-pages-20261018.mjs), so the icon and the page are one picture. The Icon Status Sync chat (card 369) owns
// what each pet shows; this file only follows it.
//
//   node scripts/make-icons-20261012.mjs        the same, on its own
//
// Every source is in this hub (Flash Audit A58, one art source, 2026-10-17). SOURCES below is only for a pet with no
// calm picture of its own: a seed's sheet from art/seeds/ (generate-seeds-20261012.mjs), whose calm top-left cell
// becomes the icon. art/icons/icon-sources-20261120.json records the picture each icon was made from, and that
// picture's git blob, for Flash Audit A01 ("Current icon").
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { decodePng, keyBackground } from './sheet-to-sprites.mjs';
import { png } from './art-kit.mjs';
import { petFrames, slug } from './pet-program-pages-20261018.mjs';

const SIZE = 96;
export const ICON_DATE = '20261012';
export const MANIFEST = 'art/icons/icon-sources-20261120.json';
// The page sources that are a pet's own calm picture. 'icon' (the page showing this icon back) and 'none' are not.
const CALM = new Set(['desktop', 'registered', 'draft', 'review']);
// Claude Bot and Skill Scout keep their pictures as they are (Astra, 2026-11-20: "drop all that"). Claude Bot's repo is
// private since 2026-10-17 (its art is an exact copy of ChatGPT's BSOD, at Astra's request) and its draft is private,
// so its page shows this icon back and it is never made again: the public hub keeps the orange-screen twin icon.
// Skill Scout (lunas-log) has no calm picture either, so its icon stays the calm cell of its seed sheet below.
export const SOURCES = {
  // seeds: Pole Puff's approved draft, and the draft sheets made on 2026-10-12
  'pole-puff': 'drafts/pole-puff/art/frames/neutral-20261011.png',
  'osc-sealion': 'art/seeds/osc-sealion-sheet-20261012.png',
  'piranesi-nessi': 'art/seeds/piranesi-nessi-sheet-20261012.png',
  'procreate-panda': 'art/seeds/procreate-panda-sheet-20261012.png',
  'platform-platypus': 'art/seeds/platform-platypus-sheet-20261012.png',
  'skill-scout': 'art/seeds/skill-scout-sheet-20261012.png',
  'photo-dodo': 'art/seeds/photo-dodo-sheet-20261012.png',
  'video-vulture': 'art/seeds/video-vulture-sheet-20261012.png',
  'closet-cat': 'art/seeds/closet-cat-sheet-20261012.png',
};

/** The git blob id of a file's bytes, the same one GitHub's tree gives (Flash Audit A01 compares the two). */
export const blobSha = (bytes) => createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');

/** What petFrames needs, read from a hub folder on disk. */
export function localContext(root = '.') {
  const json = (p, fallback) => (existsSync(join(root, p)) ? JSON.parse(readFileSync(join(root, p), 'utf8')) : fallback);
  return {
    frameIndex: json('art/frames/index.json', { pets: {} }), drafts: json('desktop-art/desktop-drafts-20261018.json', { pets: [] }),
    exists: (p) => existsSync(join(root, p)), list: (p) => (existsSync(join(root, p)) ? readdirSync(join(root, p)) : []),
  };
}

/** Every pet that gets an icon, as [icon id, pet]: registered and pipeline pets by repo, every other pet program by its
 *  pet's name (the System Map's node ids, and the names the pet program pages look an icon up by). */
export function iconPets(registry, programs) {
  const regs = [...(registry.pets || []), ...(registry.pipeline || [])];
  const others = programs.filter((p) => p.icon && !regs.some((r) => r.repo === p.repo)).map((p) => [slug(p.icon), { repo: p.repo, pet: p.icon }]);
  return [...regs.map((r) => [r.repo, r]), ...others];
}

/** The picture one pet's icon is made from: its page's calm idle picture (petFrames) without the mood sticker, else
 *  its sheet in SOURCES, else null (it keeps the icon it has, like Claude Bot). */
export function iconSource(pet, ctx, id) {
  const its = petFrames(pet, ctx);
  return (CALM.has(its.source) && (its.plain?.idle || its.frames.idle)) || SOURCES[id] || null;
}

/** { icon id: picture } for every pet with a picture. */
export function iconPlan(ctx, registry, programs) {
  const plan = {};
  for (const [id, pet] of iconPets(registry, programs)) { const src = iconSource(pet, ctx, id); if (src) plan[id] ??= src; }
  for (const [id, src] of Object.entries(SOURCES)) plan[id] ??= src;
  return plan;
}

/** Flash Audit A01 "Current icon": null when `icon` was made from the pet's calm picture `want` as it is now, else why
 *  not. `made` is its row in the record (MANIFEST); `blobOf` gives a hub file's git blob. No picture: nothing to check. */
export function staleIcon(icon, want, made, blobOf) {
  if (!want) return null;
  if (!made) return `${icon} has no record of what it was made from; the pet's calm picture is ${want}`;
  if (made.from !== want) return `${icon} was made from ${made.from}, but the pet's calm picture is now ${want}`;
  if (made.blob !== blobOf(want)) return `${icon} was made from an older copy of ${want}`;
  return null;
}

function crop(img, x0, y0, w, h) {
  const out = new Uint8Array(w * h * 4);
  for (let y = 0; y < h; y++) out.set(img.rgba.subarray(((y0 + y) * img.width + x0) * 4, ((y0 + y) * img.width + x0 + w) * 4), y * w * 4);
  return { width: w, height: h, rgba: out };
}
/** Make the background transparent unless the image already has transparency. */
function clearBackground(img) {
  let hasAlpha = false;
  for (let i = 3; i < img.rgba.length; i += 4) if (img.rgba[i] < 250) { hasAlpha = true; break; }
  if (hasAlpha) return img;
  const bg = keyBackground(img, 30);
  const rgba = new Uint8Array(img.rgba);
  for (let i = 0; i < bg.length; i++) if (bg[i]) rgba[i * 4 + 3] = 0;
  return { ...img, rgba };
}
function trim(img) {
  let x0 = img.width, y0 = img.height, x1 = -1, y1 = -1;
  for (let y = 0; y < img.height; y++) for (let x = 0; x < img.width; x++) if (img.rgba[(y * img.width + x) * 4 + 3] > 40) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
  if (x1 < 0) throw new Error('empty image');
  return crop(img, x0, y0, x1 - x0 + 1, y1 - y0 + 1);
}
/** Nearest-neighbour fit into a SIZE x SIZE transparent square: keeps pixel art crisp. */
function fit(img) {
  const s = Math.min(SIZE / img.width, SIZE / img.height), w = Math.max(1, Math.round(img.width * s)), h = Math.max(1, Math.round(img.height * s));
  const ox = Math.floor((SIZE - w) / 2), oy = SIZE - h; // stand on the bottom edge, like the desktop pets
  const out = Buffer.alloc(SIZE * SIZE * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const sx = Math.min(img.width - 1, Math.floor(x / s)), sy = Math.min(img.height - 1, Math.floor(y / s));
    const si = (sy * img.width + sx) * 4, di = ((oy + y) * SIZE + ox + x) * 4;
    for (let k = 0; k < 4; k++) out[di + k] = img.rgba[si + k];
  }
  return png(SIZE, SIZE, out);
}

/** One icon's bytes from its picture's bytes. A sheet's calm top-left cell becomes the icon. */
export function makeIcon(bytes, src) {
  let img = decodePng(bytes);
  if (/-sheet-\d{8}\.png$/.test(src)) img = crop(img, 0, 0, Math.floor(img.width / 3), Math.floor(img.height / 3)); // calm neutral cell
  return Buffer.from(fit(trim(clearBackground(img))));
}

/** The icon file a pet keeps: its newest dated icon, or a new one with this script's date. */
export const iconFile = (names, id) => names.filter((n) => new RegExp(`^${id}-\\d{8}\\.png$`).test(n)).sort().pop() || `${id}-${ICON_DATE}.png`;

/** Make every icon in a hub folder, and the record of what each was made from. Unchanged icons are left alone. */
export function buildIcons(root = '.', log = console.log) {
  const json = (p) => JSON.parse(readFileSync(join(root, p), 'utf8'));
  const plan = iconPlan(localContext(root), json('pets.json'), json('pet-programs.json').programs);
  mkdirSync(join(root, 'art/icons'), { recursive: true });
  const names = readdirSync(join(root, 'art/icons'));
  const record = {};
  let changed = 0;
  for (const [id, src] of Object.entries(plan).sort(([a], [b]) => a.localeCompare(b))) {
    try {
      if (!existsSync(join(root, src))) throw new Error(`missing ${src}`);
      const bytes = readFileSync(join(root, src)), icon = makeIcon(bytes, src), file = `art/icons/${iconFile(names, id)}`;
      if (!existsSync(join(root, file)) || !readFileSync(join(root, file)).equals(icon)) { writeFileSync(join(root, file), icon); changed++; }
      record[file] = { from: src, blob: blobSha(bytes) };
    } catch (e) { log(`${id}: skipped (${e.message})`); }
  }
  const text = JSON.stringify(record, null, 1) + '\n', out = join(root, MANIFEST);
  if (!existsSync(out) || readFileSync(out, 'utf8') !== text) writeFileSync(out, text);
  return { made: Object.keys(record).length, changed };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.chdir(fileURLToPath(new URL('..', import.meta.url)));
  const { made, changed } = buildIcons('.');
  console.log(`${made} icons in art/icons/ (${changed} made again from a newer picture).`);
}
