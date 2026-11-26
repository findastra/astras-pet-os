// A pet's tools come from its own pet.json (Astra, 2026-11-02: "with their tools read from their own pet.json"): the
// Farmer's round copies them into pets.json (adoptTools) and the pet program spawner shows them beside the System Map's.
// Claude Opus 5.5 (claude-opus-5-5), 2026-11-02.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { adoptTools } from '../scripts/farmer-rounds-20261009.mjs';
import { readSpawnerSources, spawnerPages, toolKey } from '../scripts/pet-program-pages-20261018.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));

test('adoptTools copies only short plain fields from a pet\'s pet.json', () => {
  const entry = { repo: 'fixture' };
  const petJson = { tools: [
    { name: 'mood-check-in', label: 'fixture-v0.2.0-mood-check-in-v1.0', intended_use: 'A daily check-in.', entry: 'app/index.html', visibility: 'private', version: '1.0.0', runs: 'node x', secret: 'never copied' },
    'plain-tool',
    { label: 'fixture-v0.1-only-a-label-v0.1', entry: 'https://example.com/evil', merged: false },
    { entry: '../outside.md' },
    null,
  ] };
  assert.equal(adoptTools(entry, petJson), true);
  assert.deepEqual(entry.tools, [
    { name: 'mood-check-in', label: 'fixture-v0.2.0-mood-check-in-v1.0', use: 'A daily check-in.', entry: 'app/index.html', visibility: 'private', version: '1.0.0' },
    { name: 'plain-tool' },
    { label: 'fixture-v0.1-only-a-label-v0.1', planned: true },
  ], 'an address or a path outside the repo is never an entry; a tool with no name or label is left out; unmerged is planned');
  assert.equal(adoptTools(entry, petJson), false, 'nothing changed the second time');
  assert.equal(adoptTools(entry, { version: 'v1' }), false, 'a pet.json with no tools list leaves pets.json alone');
  assert.equal(adoptTools(entry, { tools: [] }), true);
  assert.equal(entry.tools, undefined);
});

test('a tool\'s id is the same from its name, its label or the map\'s id', () => {
  assert.equal(toolKey('journal-lagoon-v0.2.0-mood-check-in-v1.0'), 'mood-check-in');
  assert.equal(toolKey('chat-rat-v0.1.0-save-missing-v0.1.0'), 'save-missing');
  assert.equal(toolKey('Research library'), 'research-library');
  assert.equal(toolKey('benchmark-rock-v0.1'), 'benchmark-rock');
  assert.equal(toolKey(''), null);
});

test('the spawner shows a pet\'s pet.json tools after the System Map\'s, never twice', () => {
  const src = readSpawnerSources(root);
  const reg = src.registry.pipeline.find((p) => !p.tools) || src.registry.pipeline[0];
  const before = spawnerPages(src).find((d) => d.repo === reg.repo).tools;
  const mapTool = before[0];
  reg.tools = [
    { name: 'fixture-new-tool', label: `${reg.repo}-v0.1-fixture-new-tool-v0.1`, use: 'A tool only its pet.json lists.', entry: 'tools/new tool.md' },
    ...(mapTool ? [{ name: mapTool.name, label: mapTool.label }] : []),
  ];
  const after = spawnerPages(src).find((d) => d.repo === reg.repo).tools;
  assert.equal(after.length, before.length + 1, 'only the new tool is added');
  const added = after.at(-1);
  assert.equal(added.id, 'fixture-new-tool');
  assert.equal(added.label, `${reg.repo}-v0.1-fixture-new-tool-v0.1`);
  assert.equal(added.desc, 'A tool only its pet.json lists.');
  assert.equal(added.why, 'A tool only its pet.json lists.', 'the Markdown pets show it too');
  assert.equal(added.state, 'now');
  assert.match(added.url, new RegExp(`^https://github\\.com/[^/]+/${reg.repo}/blob/HEAD/tools/new%20tool\\.md$`));
});
