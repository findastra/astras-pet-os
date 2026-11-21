// Every pet's icon is made by `npm run build` from the calm picture its page shows, and Flash Audit A01 ("Current icon")
// finds it current (Astra, 2026-11-20: icons for all pets are the Friendly Farmer's job). Claude Opus 5.5, 2026-11-20.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { blobSha, iconFile, iconPets, iconPlan, iconSource, localContext, makeIcon, MANIFEST, staleIcon } from '../scripts/make-icons-20261012.mjs';
import { slug } from '../scripts/pet-program-pages-20261018.mjs';

const root = fileURLToPath(new URL('..', import.meta.url)).replace(/[\\/]$/, '');
const json = (p) => JSON.parse(readFileSync(join(root, p), 'utf8'));
const registry = json('pets.json'), programs = json('pet-programs.json').programs, ctx = localContext(root);
const names = readdirSync(join(root, 'art/icons')).sort();
const record = json(MANIFEST);
const blobOf = (p) => blobSha(readFileSync(join(root, p)));
const fake = (files) => ({
  frameIndex: { pets: {} }, drafts: { pets: [] }, exists: (p) => files.includes(p),
  list: (d) => files.filter((p) => p.startsWith(`${d}/`) && !p.slice(d.length + 1).includes('/')).map((p) => p.slice(d.length + 1)),
});

test('an icon is the calm picture its page shows, without the mood sticker; a pet with none keeps its icon', () => {
  const x = fake(['desktop-art/x/idle-20261011.png', 'desktop-art/x/idle-20261114.png', 'art/moods/x/idle.png']);
  assert.equal(iconSource({ repo: 'x', art: 'x', pet: 'X' }, x, 'x'), 'desktop-art/x/idle-20261114.png');
  assert.equal(iconSource({ repo: 'claude-bot', pet: 'Claude Bot' }, fake(['art/icons/claude-bot-20261012.png']), 'claude-bot'), null);
  assert.equal(iconSource({ repo: 'lunas-log', pet: 'Skill Scout' }, fake([]), 'skill-scout'), 'art/seeds/skill-scout-sheet-20261012.png');
});

test('Claude Bot and Skill Scout keep the icons they have (Astra, 2026-11-20: "drop all that")', () => {
  const plan = iconPlan(ctx, registry, programs);
  assert.equal(plan['claude-bot'], undefined);
  assert.equal(plan['lunas-log'], undefined);
  assert.equal(plan['skill-scout'], 'art/seeds/skill-scout-sheet-20261012.png');
});

test('every icon in the hub is the one the build makes from its picture now', () => {
  const plan = iconPlan(ctx, registry, programs);
  for (const [id, src] of Object.entries(plan)) {
    const file = `art/icons/${iconFile(names, id)}`, bytes = readFileSync(join(root, src));
    assert.deepEqual(record[file], { from: src, blob: blobSha(bytes) }, `${file}: run npm run build`);
    assert.ok(readFileSync(join(root, file)).equals(makeIcon(bytes, src)), `${file} is not made from ${src}: run npm run build`);
  }
  assert.equal(Object.keys(record).length, Object.keys(plan).length);
});

test('A01 says why an icon is stale, and finds every pet program\'s icon current after a build', () => {
  const now = 'desktop-art/x/idle-20261114.png', blobs = { [now]: 'b2' };
  assert.equal(staleIcon('x-20261012.png', now, { from: now, blob: 'b2' }, (p) => blobs[p]), null);
  assert.match(staleIcon('x-20261012.png', now, { from: 'desktop-art/x/idle-20261011.png', blob: 'b1' }, (p) => blobs[p]), /made from desktop-art\/x\/idle-20261011\.png, but/);
  assert.match(staleIcon('x-20261012.png', now, { from: now, blob: 'b0' }, (p) => blobs[p]), /older copy/);
  assert.match(staleIcon('x-20261012.png', now, undefined, (p) => blobs[p]), /no record/);
  assert.equal(staleIcon('claude-bot-20261012.png', null, undefined, () => null), null);
  // The same lookup as scripts/idle-flash-audit-20261017.mjs A01, over this hub's files.
  const regs = [...registry.pets, ...registry.pipeline], petOf = Object.fromEntries(iconPets(registry, programs).map(([id, pet]) => [pet.repo, [id, pet]]));
  for (const prog of programs.filter((p) => p.repo)) {
    const reg = regs.find((r) => r.repo === prog.repo), art = reg?.art;
    const icon = names.map((n) => `art/icons/${n}`).find((p) => [prog.repo, art, slug(prog.icon)].some((n) => n && p.includes(`/${n}-`)));
    if (!icon) continue;
    const [id, pet] = petOf[prog.repo] || [prog.repo, reg || { repo: prog.repo, pet: prog.icon }];
    assert.equal(staleIcon(icon.split('/').pop(), iconSource(pet, ctx, id), record[icon], blobOf), null, `#${prog.number} ${prog.icon}`);
  }
});
