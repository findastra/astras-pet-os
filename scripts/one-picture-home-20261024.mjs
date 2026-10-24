// One home for every pet picture, at addresses that never change (Astra, 2026-10-24: "All of these pet icons should
// have their own hosted spot online somewhere, where anything can update them. So that I dont have to keep doing them
// individually, and getting caught versions behind." Her answers: all recommended, docs/one-art-source-20261017.md).
//
// The hub stays the one home (Flash Audit A58). Every picture is served from GitHub raw at a STABLE path:
//
//   https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/latest/icons/<repo>.png
//   .../art/latest/app-icons/<repo>/<name>.<ext>     .../art/latest/drafts/<pet>/<mood>.png
//   .../art/latest/desktop-art/<pet>/<name>.png      .../art/frames/<pet>/<mood>.png     .../art/moods/<folder>/<mood>.png
//
// art/latest/ is made by `npm run build` from the dated drawings (art/icons, art/app-icons, art/drafts, desktop-art):
// each name loses its -YYYYMMDD, and the newest date wins. A new drawing is added here with a new date as always; the
// build moves art/latest to it, and every page, repo and program that links art/latest shows it within 5 minutes.
// art/latest/ holds the same bytes as its sources, so git stores each picture once. Only the build writes it; nobody
// names those files by hand (Astra's OK, 2026-10-24, the one exception to the date in every file name).
//
//   node scripts/one-picture-home-20261024.mjs --fix <file>...   point a file's dated hub picture links at art/latest
//   node scripts/one-picture-home-20261024.mjs --check <file>... list them; exit 1 when one is found
//
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-24.
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const LATEST = 'art/latest';
export const HUB_RAW = 'https://raw.githubusercontent.com/findastra/astras-pet-os/main/';
/** The dated drawings art/latest is made from. */
export const SOURCES = ['art/icons', 'art/app-icons', 'art/drafts', 'desktop-art'];
const IMG = /\.(png|webp|gif|jpe?g|svg|ico)$/i;
const DATED = /^(.*?)-(\d{8})(\.[A-Za-z0-9]+)$/;

/** The stable path of one hub picture under art/latest, or null when it is not one of the dated sources. */
export function latestPath(path) {
  if (!IMG.test(path) || !SOURCES.some((s) => path.startsWith(s + '/'))) return null;
  const rel = path.startsWith('art/') ? path.slice(4) : path;
  const dir = rel.includes('/') ? rel.slice(0, rel.lastIndexOf('/') + 1) : '';
  const name = rel.slice(dir.length);
  const m = name.match(DATED);
  return `${LATEST}/${dir}${m ? m[1] + m[3] : name}`;
}

/** { stable path: source path } for a list of hub file paths; the newest date wins, a dated drawing beats an undated one. */
export function latestPlan(paths) {
  const best = new Map();
  const dateOf = (p) => p.split('/').pop().match(DATED)?.[2] || '';
  for (const p of paths) {
    const stable = latestPath(p);
    if (!stable) continue;
    const now = best.get(stable);
    if (!now || dateOf(p) > dateOf(now)) best.set(stable, p);
  }
  return Object.fromEntries([...best].sort(([a], [b]) => a.localeCompare(b)));
}

function walk(root, dir, out = []) {
  const abs = join(root, dir);
  if (!existsSync(abs)) return out;
  for (const n of readdirSync(abs).sort()) {
    const rel = `${dir}/${n}`;
    if (statSync(join(root, rel)).isDirectory()) walk(root, rel, out); else out.push(rel);
  }
  return out;
}

/** Private drawings (Claude Bot's, marked in the draft list) never get a stable public address. */
function hiddenPets(root) {
  const file = join(root, 'desktop-art', 'desktop-drafts-20261018.json');
  const drafts = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : { pets: [] };
  return new Set((drafts.pets || []).filter((d) => d.private).map((d) => d.id));
}

/** The plan for this hub folder, from the files on disk. */
export function planFor(root = '.') {
  const hidden = hiddenPets(root);
  const files = SOURCES.flatMap((s) => walk(root, s)).filter((p) => !hidden.has(p.split('/')[p.startsWith('art/') ? 2 : 1]));
  return latestPlan(files);
}

/** Write art/latest and its index. Unchanged files are left alone; files no source names any more are removed. */
export function buildLatestArt(root = '.') {
  const plan = planFor(root);
  const keep = new Set([...Object.keys(plan), `${LATEST}/index.json`]);
  for (const old of walk(root, LATEST)) if (!keep.has(old)) rmSync(join(root, old));
  let written = 0;
  for (const [stable, source] of Object.entries(plan)) {
    const to = join(root, stable), from = join(root, source);
    if (existsSync(to) && readFileSync(to).equals(readFileSync(from))) continue;
    mkdirSync(dirname(to), { recursive: true });
    copyFileSync(from, to);
    written++;
  }
  const index = { about: 'Made by npm run build (scripts/one-picture-home-20261024.mjs): every stable picture path and the dated drawing it shows now. Link the stable path, never the dated one.', base: HUB_RAW, pictures: plan };
  mkdirSync(join(root, LATEST), { recursive: true });
  writeFileSync(join(root, LATEST, 'index.json'), JSON.stringify(index, null, 1) + '\n');
  return { pictures: Object.keys(plan).length, written };
}

// A link to a hub picture: the raw address, the hub's site, jsDelivr, or the offline fallback next to a pet repo.
const LINK = /(https:\/\/raw\.githubusercontent\.com\/findastra\/astras-pet-os\/main\/|https:\/\/findastra\.github\.io\/astras-pet-os\/|https:\/\/cdn\.jsdelivr\.net\/gh\/findastra\/astras-pet-os@main\/|(?:\.\.\/)+astras-pet-os\/)((?:art\/(?:icons|app-icons|drafts)|desktop-art)\/[A-Za-z0-9._\/-]+\.(?:png|webp|gif|jpe?g|svg|ico))/g;

/** Every link in `text` to a dated hub picture that has a stable path: [{ from, to }]. */
export function datedLinks(text, plan) {
  const found = [];
  for (const m of text.matchAll(LINK)) {
    // A link to an older drawing moves to the stable path too: that path always shows the newest one.
    const stable = latestPath(m[2]);
    if (stable && stable in plan) found.push({ from: m[1] + m[2], to: m[1] + stable });
  }
  return found;
}

/** `text` with every dated hub picture link pointed at art/latest. */
export function fixLinks(text, plan) {
  let out = text;
  for (const { from, to } of datedLinks(text, plan)) out = out.split(from).join(to);
  return out;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const hub = fileURLToPath(new URL('..', import.meta.url));
  const mode = process.argv[2], files = process.argv.slice(3);
  if (!['--fix', '--check'].includes(mode) || !files.length) {
    console.log('Usage: node scripts/one-picture-home-20261024.mjs --fix|--check <file>...');
    process.exit(2);
  }
  const plan = planFor(hub);
  let total = 0;
  for (const f of files) {
    const text = readFileSync(f, 'utf8'), links = datedLinks(text, plan);
    if (!links.length) continue;
    total += links.length;
    if (mode === '--fix') writeFileSync(f, fixLinks(text, plan));
    console.log(`${f}: ${links.length} dated picture link(s)${mode === '--fix' ? ' now point at art/latest' : ''}`);
  }
  if (mode === '--check' && total) process.exitCode = 1;
}
