// npm run build. Everything that is generated from pets.json and the pets' sheets:
//
//   art/frames/<id>/<mood>.png   each pet's nine moods, 256px, transparent  (build-frames.mjs)
//   art/frames/index.json        what was built, and which pets are still placeholders
//   ROSTER.md                    the running list of who lives here
//   README.md                    the pet table between the pets:start / pets:end markers
//   art/roster.png               every pet in every mood on one labelled sheet
//   RELATIONS.md, MOOD-KEY.md   how the pets relate, and what each mood means for each pet (relations-20261009.mjs)
//   system-map-20261012.html       the 3D map of Astra's PetOS, from pets.json, pet-programs.json and system-map.json (system-map-20261012.mjs)
//   PROTECTION-RINGS.md          the rings and grants tables, from system-map.json (system-map-20261012.mjs)
//   apps/pet-programs/           a pet program page for every registered and pipeline pet (pet-program-pages-20261018.mjs)
//
// This replaces build-art.mjs, which drew the original 32x32 pets by hand.
// Generating new art is separate and costs money: see generate-pets.mjs.
import { readFileSync, writeFileSync } from 'node:fs';
import { buildPetProgramsPage } from './pet-programs-20261014.mjs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { buildFrames } from './build-frames.mjs';
import { buildRoster } from './roster.mjs';
import { applyTable } from './lib.mjs';
import { MOODS } from './sheet-to-sprites.mjs';
import { buildRelations, buildMoodKey } from './relations-20261009.mjs';
import { buildSystemMap, readSystemMapSources, applyAccessDoc, SYSTEM_MAP } from './system-map-20261012.mjs';
import { redactData, assertPublic } from './public-safety-20261014.mjs';
import { writePetProgramPages } from './pet-program-pages-20261018.mjs';

process.chdir(fileURLToPath(new URL('..', import.meta.url)));

const metadataOnly = process.argv.includes('--metadata-only');
const { index, missing } = metadataOnly
  ? { index: JSON.parse(readFileSync('art/frames/index.json', 'utf8')), missing: [] }
  : buildFrames({ log: () => {} });
const registry = JSON.parse(readFileSync('pets.json', 'utf8'));

const data = {
  frames: Object.fromEntries(Object.entries(index.pets).map(([id, p]) => [id, p.frames])),
  placeholders: Object.entries(index.pets).filter(([, p]) => p.placeholder).map(([id]) => id),
};
// Public pages never show operational details (scripts/public-safety-20261014.mjs): addresses, ports and personal
// paths in the data become plain descriptions, and a secret stops the build. (The old Cage page's data file was removed
// with the Cage, Astra 2026-10-18.)
const redacted = [];
const names = Object.fromEntries([
  ...(registry.pets || []).map((p) => [p.art, p.pet]),
  ...(registry.mascots || []).map((m) => [m.art, m.name]),
]);
writeFileSync('ROSTER.md', buildRoster(registry, MOODS, names, data.frames));
writeFileSync('RELATIONS.md', buildRelations(registry));
writeFileSync('MOOD-KEY.md', buildMoodKey(registry));
writeFileSync('PET-PROGRAMS.md', buildPetProgramsPage(JSON.parse(readFileSync('pet-programs.json', 'utf8')))); // every pet program and its mini-descriptor (2026-10-14)
{ const { extra, template, icons, programs } = readSystemMapSources();
  const map = buildSystemMap(redactData(registry, 'pets.json', redacted), redactData(extra, 'system-map.json', redacted), template, icons, programs);
  writeFileSync(SYSTEM_MAP.output, assertPublic(map, SYSTEM_MAP.output));
  // The rings and grants in PROTECTION-RINGS.md come from the same data as the map (Astra, 2026-10-17).
  const doc = readFileSync(SYSTEM_MAP.doc, 'utf8'), nextDoc = applyAccessDoc(doc, extra);
  if (nextDoc !== doc) writeFileSync(SYSTEM_MAP.doc, nextDoc); }
// Every pet's pet program page, from the same sources as the map (the Friendly Farmer's pet program spawner, 2026-10-18).
writePetProgramPages('.');
for (const { path, kind } of redacted) console.log(`Public safety: left out a ${kind} at ${path}; keep it on this PC (docs/local-services-20261014.md).`);

const readme = readFileSync('README.md', 'utf8');
const nextReadme = applyTable(readme, registry);
if (nextReadme !== readme) writeFileSync('README.md', nextReadme);

if (!metadataOnly) execFileSync(process.execPath, ['scripts/frames-sheet.mjs', '--thumb', '96'], { stdio: 'ignore' });

const placeholders = data.placeholders;
console.log(metadataOnly
  ? `Updated registry and docs for ${registry.pets.length} pets using existing ${index.size}px frames.`
  : `Built ${Object.keys(index.pets).length} pets x ${MOODS.length} moods at ${index.size}px: frames, ROSTER.md, README table, art/roster.png.`);
if (placeholders.length) console.log(`Placeholder art (regenerate when you can): ${placeholders.join(', ')}`);
if (missing.length) { console.error(`No art at all for: ${missing.join(', ')}`); process.exit(1); }
