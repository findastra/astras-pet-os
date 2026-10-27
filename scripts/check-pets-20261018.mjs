// Usage: node scripts/check-pets-20261018.mjs [--online] (npm run check). Was check-cage.mjs until the Cage was removed, 2026-10-18.
// Checks pets.json and the README table. --online also asks GitHub whether each pet's repo
// exists, carries the pet-app topic, and has a pet.json.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { validate } from './lib.mjs';
import { ownerOf } from './farm-owner-20261020.mjs';

const p = (f) => fileURLToPath(new URL(`../${f}`, import.meta.url));
const registry = JSON.parse(readFileSync(p('pets.json'), 'utf8'));
const art = JSON.parse(readFileSync(p('art/frames/index.json'), 'utf8'));
const problems = validate(registry, readFileSync(p('README.md'), 'utf8'), art);

if (process.argv.includes('--online')) {
  for (const pet of registry.pets) {
    if (pet.visibility === 'private') { console.log(`${pet.repo}: private repository; anonymous online checks skipped.`); continue; }
    const owner = ownerOf(registry, pet.repo); // the pet's own account (card 058, Part 3)
    const r = await fetch(`https://api.github.com/repos/${owner}/${pet.repo}`, { headers: { Accept: 'application/vnd.github+json' } });
    if (r.status === 404) { problems.push(`${pet.repo}: not on GitHub yet (or private)`); continue; }
    if (!r.ok) { problems.push(`${pet.repo}: GitHub answered ${r.status}`); continue; }
    const repo = await r.json();
    if (!(repo.topics || []).includes('pet-app')) problems.push(`${pet.repo}: add the GitHub topic pet-app`);
    const pj = await fetch(`https://raw.githubusercontent.com/${owner}/${pet.repo}/${repo.default_branch}/pet.json`);
    if (!pj.ok) problems.push(`${pet.repo}: no pet.json on ${repo.default_branch}`);
  }
}
if (problems.length) { console.error(problems.map((s) => '- ' + s).join('\n')); process.exit(1); }
const stand = Object.entries(art.pets).filter(([, a]) => a.placeholder).map(([id]) => id);
console.log(`Pets OK: ${registry.pets.length} Pets, ${(registry.mascots || []).length} mascot(s), ${Object.keys(art.pets).length} characters drawn at ${art.size}px.`);
// A placeholder is not an error (the desktop pets still work), but it is not finished art either.
if (stand.length) console.log(`Placeholder art, needs regenerating: ${stand.join(", ")}`);
