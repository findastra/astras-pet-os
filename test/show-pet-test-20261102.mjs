// Show Pet, the model pet program (Astra, 2026-11-02: "a template pet program ... it'll just say tool one, tool two,
// tool three ... cover a whole bunch of different types of like structures ... every rule really strictly kind of like
// chiseled out"). Claude Opus 5.5 (claude-opus-5-5), 2026-11-02.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { readSpawnerSources, spawnerPages, spawnerFiles, showPetAssets, showPetData, buildPetProgramPage, SHOW_PET, PANELS, INDEX } from '../scripts/pet-program-pages-20261018.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const src = readSpawnerSources(root);
const real = spawnerPages(src);
const model = showPetData(src);
const html = buildPetProgramPage(model);

test('Show Pet has every field a real page has, and every item every field a real item has', () => {
  for (const d of real) assert.deepEqual(Object.keys(model).sort(), Object.keys(d).sort(), `${d.repo}: a page field Show Pet does not have`);
  const keysOf = (list) => new Set(list.flatMap((i) => Object.keys(i)));
  for (const kind of ['thirdParty', 'programs', 'shared', 'devices', 'tools', 'tricks', 'related', 'connections']) {
    const have = keysOf(model[kind]);
    assert.ok(model[kind].length, `Show Pet has no ${kind}`);
    for (const k of keysOf(real.flatMap((d) => d[kind]))) assert.ok(have.has(k), `${kind}: real pages use "${k}", Show Pet does not`);
  }
});

test('Show Pet has every tool panel, with Pet Name\'s labels', () => {
  for (const p of PANELS) assert.ok(html.includes(`pet-name-${p}`) || html.includes(`pet-program-name-${p}`), p);
});

test('Show Pet shows every light and every kind of item once', () => {
  for (const result of ['works', 'issues', 'update', 'missing']) assert.ok(html.includes(`data-check="${result}"`), `a ${result} check`);
  for (const cls of ['is-unset', 'is-update', 'is-fix', 'data-planned="1"', 'data-unseen="1"', 'tag cadence', 'pill-tool', 'tool-embed',
    'item-serial', 'device-group', 'mark enforced', 'mark written', 'mark planned']) assert.ok(html.includes(cls), cls);
  for (const h of ['3rd party programs · 2', 'Native programs · 2', 'Shared programs · 1', 'Native tools · 7', 'Devices it looks after · 3',
    'Native tricks · 3', 'L3 asks you · 1']) assert.ok(html.includes(h), h);
  assert.match(html, /three clicks/, 'a click count bound to a tool');
  assert.match(html, /L3 to you, the seated agent/, 'an editorial note');
});

test('Show Pet uses placeholder names only, never a real pet\'s things', () => {
  const names = [...html.matchAll(/<span class="item-name">([^<]+)<\/span>/g)].map((m) => m[1]);
  const placeholder = /^(?:(?:Tool|Trick|3rd party program|Native program|Shared program|Headset|Device) (?:one|two|three|four|five|six|seven)|Approve the update of Tool three to v1\.1\?|self-audit|weekly-suggestions|seat|(?:one|two|three) clicks?)$/;
  assert.ok(names.length > 20);
  for (const n of names) assert.match(n, placeholder);
  for (const p of [...src.registry.pets, ...src.registry.pipeline].filter((x) => x.role !== 'host')) assert.ok(!html.includes(`>${p.pet}<`), `${p.pet} is a real pet`);
});

test('the spawner writes Show Pet, its example tool and its nine drawings, and lists it; it is never an animal', () => {
  const files = spawnerFiles(src);
  const all = { ...files, ...showPetAssets() };
  for (const f of [SHOW_PET.page, SHOW_PET.tool, SHOW_PET.toolJs, ...Object.keys(showPetAssets())]) assert.equal(readFileSync(`${root}/${f}`, 'utf8'), all[f], `${f} is out of date: run npm run build`);
  assert.equal(Object.keys(showPetAssets()).filter((f) => f.startsWith(`${SHOW_PET.art}/`)).length, 9);
  assert.ok(files[INDEX].includes(SHOW_PET.page.split('/').pop()), 'the list links Show Pet');
  assert.ok(![...src.registry.pets, ...src.registry.pipeline].some((p) => p.repo === model.repo), 'Show Pet is not in pets.json');
  assert.ok(!real.some((d) => d.repo === model.repo), 'Show Pet is not one of the spawned pets');
});
