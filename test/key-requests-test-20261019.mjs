// Key requests for API Fairy (Astra, 2026-10-19: "anytime a chat asks for an API key, I need the API fairy to know ...
// show me who is requesting a key, who has a key and who doesn't"). Her pet program page has the panel, the rule and the
// skill say how a chat asks, and no real request ever lands in this public repo. Claude Opus 5.5, 2026-10-19.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { readSpawnerSources, spawnerFiles, spawnerPages, pagePath, DIR, ASSETS, KEY_REQUEST_GROUPS, KEY_REQUEST_EXAMPLES, PET_PANELS } from '../scripts/pet-program-pages-20261018.mjs';

const root = fileURLToPath(new URL('..', import.meta.url)).replace(/[\\/]$/, '');
const files = spawnerFiles(readSpawnerSources(root));
const pages = spawnerPages(readSpawnerSources(root));
const page = files[pagePath('api-fairy')];
const js = readFileSync(`${root}/${DIR}/${ASSETS.js}`, 'utf8');

test('API Fairy Ring\'s page has api-fairy-key-requests-tool-panel after the four levels and the R W X panel, labelled in its border, and it folds', () => {
  const at = page.indexOf('>api-fairy-key-requests-tool-panel<');
  for (const before of ['api-fairy-L4-tool-panel', 'api-fairy-rwx-panel']) {
    assert.ok(page.indexOf(`>${before}<`) > -1, `${before} is on the page`);
    assert.ok(at > page.indexOf(`>${before}<`), `after ${before}`);
  }
  // The R W X panel and the session notes sit side by side (Astra, 2026-10-22); a pet's own panels come after both.
  assert.ok(at > page.indexOf('>api-fairy-session-notes<') && at < page.indexOf('>api-fairy-emotions<'), 'after the session notes, before the emotions');
  assert.match(page, /<details class="panel key-requests" open><summary[^>]*><span class="legend">api-fairy-key-requests-tool-panel<\/span><\/summary>/);
  assert.deepEqual(KEY_REQUEST_GROUPS.map(([, label]) => label), ['waiting-on-you', 'has-a-key', 'declined-or-not-needed']);
  for (const [id, label] of KEY_REQUEST_GROUPS) {
    assert.ok(page.includes(`<fieldset class="request-group ${id}"><legend>${label}</legend>`), `${label} has its name in its border`);
    assert.ok(page.includes(`<ul class="requests" data-group="${id}">`), `${label} has its list`);
  }
  assert.ok(page.includes('skills/key-request/SKILL.md'), 'the panel says how a chat asks');
});

test('only API Fairy\'s page has the panel', () => {
  assert.equal(typeof PET_PANELS['api-fairy'], 'function');
  for (const d of pages) if (d.repo !== 'api-fairy') assert.ok(!files[pagePath(d.repo)].includes('key-request'), `${d.repo} has no key-requests panel`);
});

test('the examples on the public page are made up and marked as examples', () => {
  const m = page.match(/<script type="application\/json" id="key-request-examples">([^<]*)<\/script>/);
  assert.ok(m, 'the examples are in the page as data');
  const examples = JSON.parse(m[1]);
  assert.deepEqual(examples, KEY_REQUEST_EXAMPLES);
  assert.deepEqual([...new Set(examples.map((e) => e.group))].sort(), ['declined', 'has-key', 'waiting'], 'one example in each group');
  for (const e of examples) {
    assert.equal(e.example, true, `${e.id} is marked as an example`);
    assert.match(e.requester.name, /^Example: /);
    assert.match(e.for, /^Example only: /);
    assert.ok(e.key_name === '' || /^EXAMPLE_/.test(e.key_name), `${e.id}: a made-up key name`);
    assert.match(e.link, /^https:\/\//);
  }
});

test('the page reads the real list only from one fixed file on Astra\'s PC, and only when it is opened there', () => {
  assert.match(js, /var LOCAL_REQUESTS = "\.\.\/\.\.\/\.\.\/\.\.\/Astra's PetOS Data\/api-fairy-ring\/key-requests-page-data\.js";/);
  // Three script elements in the page script: this list, GitHub Aquarium's outstanding items and Inference Iguana's
  // open programs (2026-10-23, read again every five seconds, so its address carries the time), each from its own
  // fixed constant and only on this PC.
  assert.equal((js.match(/createElement\('script'\)/g) || []).length, 3, 'one script element per local list');
  assert.deepEqual([...js.matchAll(/script\.setAttribute\('src', (\w+)(?: \+ '\?t=' \+ Date\.now\(\))?\)/g)].map((m) => m[1]), ['LOCAL_PROGRAMS', 'LOCAL_REQUESTS', 'LOCAL_ITEMS'], 'each address is a fixed constant, never from data');
  assert.match(js, /var LOCAL_PROGRAMS = "\.\.\/\.\.\/\.\.\/\.\.\/Astra's PetOS Data\/benchmark-rock\/programs-page-data\.js";/);
  assert.match(js, /var onThisPC = location\.protocol === 'file:' \|\| \/\^\(localhost\|127\\\.0\\\.0\\\.1\|\\\[::1\\\]\)\$\/\.test\(location\.hostname\);/);
  assert.match(js, /if \(onThisPC\) \{\s*var script = document\.createElement\('script'\);/, 'loaded only on this PC');
  assert.match(js, /d\.schema !== 'api-fairy-key-requests-page-v1'/, 'the list is checked before it is shown');
  assert.match(js, /new URL\(u\)\.protocol === 'https:'/, 'only https links become links');
  assert.doesNotMatch(js, /innerHTML|outerHTML|insertAdjacentHTML|document\.write|fetch\(|XMLHttpRequest/);
});

test('the rule and the skill say how a chat asks for a key, never the value', () => {
  const agents = readFileSync(`${root}/AGENTS.md`, 'utf8');
  assert.match(agents, /\*\*Need a key\? Ask API Fairy, not the chat \(Astra, 2026-10-19\)\.\*\*.*skills\/key-request\/SKILL\.md/);
  const skill = readFileSync(`${root}/skills/key-request/SKILL.md`, 'utf8');
  assert.match(skill, /^---\nname: key-request\ndescription: .+\n---\n/);
  for (const must of ['api-fairy-key-request-v1', "Documents\\Astra's PetOS Data\\api-fairy-ring\\key-requests\\", 'Never ask Astra to paste a key', 'ANTHROPIC_API_KEY', 'Max login', '✨'])
    assert.ok(skill.includes(must), `the skill says: ${must}`);
  const map = JSON.parse(readFileSync(`${root}/system-map.json`, 'utf8'));
  const tool = map.nodes.find((n) => n.id === 'key-requests');
  assert.equal(tool?.of, 'key-ring', 'key-requests is a tool of API Fairy Ring on the map');
  assert.equal(tool.label, 'api-fairy-ring-v1.0-key-requests-v1.0');
});

test('no real key request is kept in this public repo', () => {
  const found = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      if (name === '.git' || name === 'node_modules') continue;
      const p = `${dir}/${name}`;
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.(json|js)$/.test(name) && /api-fairy-key-request(s-page)?-v1/.test(readFileSync(p, 'utf8'))) found.push(p.slice(root.length + 1));
    }
  };
  walk(root);
  assert.deepEqual(found.filter((p) => !['scripts/pet-program-pages-20261018.mjs', `${DIR}/${ASSETS.js}`, 'test/key-requests-test-20261019.mjs'].includes(p)), [],
    'request files and API Fairy\'s page data stay in Astra\'s Documents folder, never in the hub');
  assert.ok(!existsSync(`${root}/Astra's PetOS Data`));
});
