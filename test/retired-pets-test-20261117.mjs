// A retired pet stays retired (skills/retire-a-pet; Astra, 2026-11-17: "make sure to delete it everywhere"): the hub's
// registry, map, pages, Markdown pets, words and art forget it, its number is never reused, and records keep its name.
// Claude Opus 5.5 (claude-opus-5-5), 2026-11-17.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { retiredPets, hubLeftovers, isRecord, HISTORY, nearName } from '../scripts/retire-check-20261117.mjs';
import { findPets } from '../scripts/pet-finder-20261016.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const registry = JSON.parse(readFileSync(join(root, 'pets.json'), 'utf8'));
const retired = retiredPets(registry);

test('every retired pet says what happened: repo, pet, program, number, date, how, why', () => {
  assert.ok(retired.length >= 1);
  for (const p of retired) {
    for (const k of ['repo', 'pet', 'program', 'number', 'retired', 'how', 'why']) assert.ok(p[k] != null && p[k] !== '', `${p.repo || '?'}: no ${k}`);
    assert.match(p.retired, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(['folded', 'retired'].includes(p.how), `${p.repo}: how is folded or retired`);
    if (p.how === 'folded') assert.ok(p.into, `${p.repo}: a folded pet says which pet took its job`);
  }
});

test('the hub forgets a retired pet: registry, map, pages, Markdown pets, words, art; its number stays unused', () => {
  for (const p of retired) assert.deepEqual(hubLeftovers(root, p), [], `${p.pet} is still treated as a pet`);
});

test('a folded pet\'s job has a home: its new pet is registered and its tool is on the map', () => {
  const map = JSON.parse(readFileSync(join(root, 'system-map.json'), 'utf8'));
  const all = ['pets', 'pipeline'].flatMap((k) => registry[k] || []);
  for (const p of retired.filter((x) => x.how === 'folded')) {
    assert.ok(all.some((x) => x.repo === p.into), `${p.into} is not registered`);
    if (p.tool) assert.ok(map.nodes.some((n) => n.id === p.tool), `${p.tool} is not on the map`);
  }
});

test('records keep the old name; live files do not, unless the words near it say it is gone', () => {
  assert.ok(isRecord('changes/x-20261117.md') && isRecord('handoffs/001-x.md') && isRecord('scans/a.md') && isRecord('docs/flash-audit-rounds-20261017/x.md'));
  assert.ok(!isRecord('pets.json') && !isRecord('README.md') && !isRecord('apps/pet-programs/x-20261018.html'));
  assert.ok(HISTORY.test(nearName('Port checks (Port Spider folded in, 2026-11-17)', ['Port Spider'])));
  assert.ok(!HISTORY.test(nearName('It never scans ports (that is Port Spider\'s job)', ['Port Spider'])));
  // a long generated line: words far from the name do not hide it
  assert.ok(!HISTORY.test(nearName(`${'x'.repeat(400)} retired ${'y'.repeat(400)} ["Port Spider","Port Exposure Agent"]`, ['Port Spider'])));
});

test('pet-finder calls a retired pet\'s repo or folder a leftover, never a missing pet', () => {
  const p = retired[0];
  const found = findPets({ programs: [], registry, repos: [{ name: p.repo, private: true, description: '', petJson: { pet: p.pet, number: p.number } }], local: [{ folder: p.repo, onGitHub: true, pet: p.pet, file: 'pet.json' }] });
  assert.ok(found.length >= 2 && found.every((f) => f.kind === 'retired-leftover'), JSON.stringify(found));
});
