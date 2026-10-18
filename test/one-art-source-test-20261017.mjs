// Flash Audit A58, One art source: the read-only checker finds copies of hub pictures, pet art kept outside the hub,
// and draft-list paths outside the hub; Claude Bot's private art is the written exception. Claude Opus 5.5, 2026-10-17.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { audit, checkDrafts, classify } from '../scripts/one-art-source-20261017.mjs';

const hub = { files: [{ path: 'art/frames/drum-dog/idle.png', sha: 'a1' }, { path: 'desktop-art/rgbee/idle-20261011.png', sha: 'b2' }, { path: 'desktop-art/fuzzboi-friend/layers/eyes.png', sha: 'c3' }] };

test('a picture with the same bytes as a hub picture is a copy, wherever it sits', () => {
  const found = classify('drum-dog', [{ path: 'art/idle-20261008.png', sha: 'a1' }, { path: 'docs/old.png', sha: 'a1' }], new Map([['a1', ['art/frames/drum-dog/idle.png']]]));
  assert.deepEqual(found.map((f) => [f.path, f.kind, f.hub]), [['art/idle-20261008.png', 'copy', 'art/frames/drum-dog/idle.png'], ['docs/old.png', 'copy', 'art/frames/drum-dog/idle.png']]);
});

test('pet art outside the hub is found; screenshots, worlds and the Fuzzbois project art are not pet pictures', () => {
  const files = [
    { path: 'desktop-art/chat-rat/idle-20261011.png', sha: 'x1' }, { path: 'art/mood-sheet-20261009.png', sha: 'x2' },
    { path: 'icon-20261009.ico', sha: 'x3' }, { path: 'draft-art/rgbee/sheet-20261011.png', sha: 'x4' },
    { path: 'docs/images/chat-rat-program-page-20261017.png', sha: 'x5' }, { path: 'Assets/Textures/Wall_Albedo.png', sha: 'x6' },
    { path: 'art/projects/page-1.png', sha: 'x7' }, { path: 'public/galaxy.png', sha: 'x8' },
  ];
  assert.deepEqual(classify('chat-rat', files, new Map()).map((f) => f.path), ['desktop-art/chat-rat/idle-20261011.png', 'art/mood-sheet-20261009.png', 'icon-20261009.ico', 'draft-art/rgbee/sheet-20261011.png']);
  const fuzz = [{ path: 'art/fuzzboi-456900-original.png', sha: 'y1' }, { path: 'site/layers/rare9.png', sha: 'y2' }, { path: 'site/layers/eyes.png', sha: 'c3' }];
  assert.deepEqual(classify('fuzzbois', fuzz, new Map([['c3', ['desktop-art/fuzzboi-friend/layers/eyes.png']]])).map((f) => [f.path, f.kind]), [['site/layers/rare9.png', 'pet-art-outside-hub'], ['site/layers/eyes.png', 'copy']]);
});

test('the draft list may only name hub files; Claude Bot marked private is the one exception', () => {
  const ok = { pets: [{ id: 'rgbee', idle: 'desktop-art/rgbee/idle-20261011.png', blink: 'desktop-art/rgbee/blink-20261011.png' },
    { id: 'claude-bot', private: true, idle: 'C:\\PetOS\\claude-bot\\desktop-art\\claude-bot\\idle-20261011.png' },
    { id: 'fuzzboi-friend', idle: 'art/drafts/fuzzboi-friend/idle-20261009.png', variants: [{ layers: ['desktop-art/fuzzboi-friend/layers/eyes.png'] }] }] };
  assert.deepEqual(checkDrafts(ok), []);
  const bad = { pets: [{ id: 'rgbee', idle: 'C:\\PetOS\\rgbee\\desktop-art\\rgbee\\idle-20261011.png' }, { id: 'chat-rat', private: true, idle: 'D:/x.png' },
    { id: 'claude-bot', idle: 'C:\\x.png' }, { id: 'meme-fiend', idle: '../meme-fiend/desktop-art/meme-fiend/idle-20261011.png' }] };
  assert.deepEqual(checkDrafts(bad).map((d) => d.id), ['rgbee', 'chat-rat', 'claude-bot', 'meme-fiend']);
});

test('Correct only when the copies left are the written exceptions', () => {
  const clean = { 'astras-pet-os': hub, 'drum-dog': { files: [{ path: 'sprite-20261008.json', sha: 'j' }, { path: 'docs/images/page.png', sha: 'p' }] },
    'claude-bot': { private: true, files: [{ path: 'desktop-art/claude-bot/idle-20261011.png', sha: 'bsod' }] } };
  const r = audit(clean, { pets: [{ id: 'rgbee', idle: 'desktop-art/rgbee/idle-20261011.png' }] });
  assert.equal(r.verdict, 'Correct');
  assert.deepEqual(r.exceptions, [{ repo: 'claude-bot', count: 1 }]);
  const dirty = { ...clean, rgbee: { files: [{ path: 'desktop-art/rgbee/idle-20261011.png', sha: 'b2' }] } };
  assert.equal(audit(dirty, null).verdict, 'Incorrect');
  assert.equal(audit(clean, { pets: [{ id: 'rgbee', idle: 'C:\\x\\idle.png' }] }).verdict, 'Incorrect');
});
