// Drawn cyberhomes (Astra, 2026-11-11): GitHub Goldfish's cyberhome is the GitHub Aquarium in miniature; every other
// pet keeps the plain den until its own is drawn. Claude Opus 5.5, 2026-11-11.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { readSpawnerSources, spawnerFiles, pagePath, CYBERHOMES, DIR } from '../scripts/pet-program-pages-20261018.mjs';

const root = fileURLToPath(new URL('..', import.meta.url)).replace(/[\\/]$/, '');
const files = spawnerFiles(readSpawnerSources(root));

test('every drawn cyberhome has its stylesheet in the pet program folder', () => {
  for (const [repo, home] of Object.entries(CYBERHOMES)) {
    assert.ok(existsSync(`${root}/${DIR}/${home.css}`), `${repo}: ${home.css} is missing`);
    assert.match(home.css, /^[a-z0-9-]+-\d{8}\.css$/, `${home.css} follows the file naming rule`);
  }
});

test("the Goldfish's page draws the Aquarium behind the Goldfish, and its cyberhome tool is built", () => {
  const html = files[pagePath('github-goldfish')];
  assert.match(html, /<link rel="stylesheet" href="cyberhome-aquarium-20261111\.css">/);
  const den = /<div class="den aquarium" data-arrival="waiting">([\s\S]*?)<\/div>/.exec(html);
  assert.ok(den, 'the den carries the aquarium');
  assert.ok(den[1].indexOf('aq-tank') < den[1].indexOf('class="pet'), 'the drawing comes before the pet, so the pet swims in front');
  assert.match(den[1], /aria-hidden="true"/, 'the drawing is decoration for screen readers');
  const css = readFileSync(`${root}/${DIR}/cyberhome-aquarium-20261111.css`, 'utf8');
  assert.match(css, /prefers-reduced-motion/, 'the bubbles stop for people who turn motion off');
});

test('pets without a drawn cyberhome keep the plain den and no extra stylesheet', () => {
  const html = files[pagePath('rift-rabbit')];
  assert.ok(html, 'Rift Rabbit has a page');
  assert.match(html, /<div class="den" data-arrival="waiting">/);
  assert.doesNotMatch(html, /cyberhome-aquarium/);
});
