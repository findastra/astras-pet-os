// Avatar tools and world tools (Astra, 2026-10-19, for Unity Stable: "separate the page by avatar tools vs world tools").
// A tool node in system-map.json may carry `side`; the pet program page then splits its tools in two.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-19.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { readSpawnerSources, spawnerPages, buildPetProgramPage, SIDES } from '../scripts/pet-program-pages-20261018.mjs';

const root = fileURLToPath(new URL('..', import.meta.url)).replace(/[\\/]$/, '');
const map = JSON.parse(readFileSync(`${root}/system-map.json`, 'utf8'));
const pages = spawnerPages(readSpawnerSources(root));
const stableTools = map.nodes.filter((n) => n.type === 'tool' && n.of === 'unity-stable');

test('every Unity Stable tool is on one side, avatar or world, and only known sides are used', () => {
  for (const n of stableTools) assert.ok(n.side === 'avatar' || n.side === 'world', n.id);
  for (const n of map.nodes.filter((x) => 'side' in x)) assert.ok(n.type === 'tool' && SIDES[n.side], n.id);
  assert.ok(stableTools.some((n) => n.id === 'vine-spawn-with-trumpet-flowers' && n.side === 'world' && n.state === 'now'));
  for (const id of ['face-transfer', 'neck-blender', 'matcap-palette', 'menu-map', 'sparkle-strapper']) assert.equal(stableTools.find((n) => n.id === id).side, 'avatar', id);
  for (const id of ['world-spawn-tool', 'vine-bloomer', 'cloud-survey', 'shaders-shop', 'glass-animal-tool']) assert.equal(stableTools.find((n) => n.id === id).side, 'world', id);
});

test('Unity Unicorn\'s page shows Avatar tools and World tools, and every tool once', () => {
  const d = pages.find((p) => p.repo === 'unity-unicorn');
  const html = buildPetProgramPage(d);
  const avatar = stableTools.filter((n) => n.side === 'avatar').length, world = stableTools.filter((n) => n.side === 'world').length;
  assert.ok(html.includes(`<h3>Avatar tools · ${avatar}</h3>`), 'avatar heading');
  assert.ok(html.includes(`<h3>World tools · ${world}</h3>`), 'world heading');
  assert.ok(!html.includes('<h3>Native tools'));
  const avatarAt = html.indexOf('class="side-avatar"'), worldAt = html.indexOf('class="side-world"');
  const l1 = html.slice(0, html.indexOf('-L2-control-panel'));   // tricks (L2) may share a tool's name, like unity-asset-creator
  for (const n of stableTools) {
    // planned tools have grey lights with no data-item, so look for the name the list shows
    const hits = [...l1.matchAll(new RegExp(`class="item-name"[^>]*>${n.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</span>`, 'g'))];
    assert.equal(hits.length, 1, n.id + ' is listed once');
    const at = hits[0].index;
    assert.ok(n.side === 'avatar' ? at > avatarAt && at < worldAt : at > worldAt, n.id + ' on its side');
  }
});

test('a pet whose tools have no side keeps one Native tools list', () => {
  const d = pages.find((p) => p.repo === 'findastra-discord-presence');
  assert.ok(d.tools.length > 0 && d.tools.every((t) => !t.side));
  const html = buildPetProgramPage(d);
  assert.ok(html.includes(`<h3>Native tools · ${d.tools.length}</h3>`));
  assert.ok(!html.includes('Avatar tools ·'));
});
