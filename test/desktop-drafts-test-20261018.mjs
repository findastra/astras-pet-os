// The desktop pets' draft list lives in this hub (one art source, Flash Audit A58): every picture it names is here,
// Claude Bot's private entry names only his repo, and the committed list is what the writer makes. Claude Opus 5.5, 2026-10-18.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { LIST, draftList } from '../scripts/prepare-desktop-drafts-20261011.mjs';
import { checkDrafts } from '../scripts/one-art-source-20261017.mjs';

const hub = (rel) => fileURLToPath(new URL('../' + rel, import.meta.url));
const list = JSON.parse(readFileSync(hub(LIST), 'utf8'));

test('every public draft picture is a hub file, named by a path inside the hub', () => {
  for (const p of list.pets.filter((x) => !x.private)) {
    for (const rel of [p.idle, p.blink, ...(p.variants || []).flatMap((v) => v.layers)]) {
      assert.match(rel, /^(art|desktop-art)\/[\w./-]+\.png$/, `${p.id}: ${rel}`);
      assert.ok(!rel.includes('..') && existsSync(hub(rel)), `${p.id}: ${rel} is not in the hub`);
    }
  }
  assert.deepEqual(checkDrafts(list), []);
});

test('Claude Bot is the one private entry, and it names his repo, never a path on a PC', () => {
  const own = list.pets.filter((x) => x.private);
  assert.deepEqual(own.map((x) => x.id), ['claude-bot']);
  assert.equal(own[0].repo, 'claude-bot');
  for (const rel of [own[0].idle, own[0].blink]) assert.match(rel, /^desktop-art\/claude-bot\/[\w.-]+\.png$/);
  assert.ok(!existsSync(hub('desktop-art/claude-bot')), "Claude Bot's exact BSOD copy must not be in this public hub");
});

test('the committed list is what scripts/prepare-desktop-drafts-20261011.mjs writes', () => {
  assert.deepEqual(list, draftList());
});
