// The pets' one mood, the same everywhere (Astra, 2026-11-14: "I want all of the pets everywhere to have the same
// status. Like if they're questioning or if they're alert ... the icons on the stream deck, the icons on every single
// pet program page, where they are on the top of the page and all their friends at the bottom, and on my desktop").
// The Farm's pet-moods is the only writer; the pages, the desktop pets and the Stream Deck read its file.
// Claude Opus 5.5 (claude-opus-5-5), 2026-11-14.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { ORDER } from '../scripts/farmer-rounds-20261009.mjs';
import { BOARD, PAGE_DATA, PAGE_VAR, SCHEMA, SHOWN, STALE_MS, keepWriting, keyMoods, pageFile, petList, programMoods, readBoard, resolveMoods, roundMoods, writeBoard } from '../scripts/pet-moods-20261114.mjs';
import { PAGE_FACES, readSpawnerSources, spawnerFiles, DIR } from '../scripts/pet-program-pages-20261018.mjs';

const root = fileURLToPath(new URL('..', import.meta.url)).replace(/[\\/]$/, '');
const read = (f) => readFileSync(join(root, f), 'utf8');
const NOW = Date.parse('2026-11-14T22:00:00-07:00');
const minutes = (n) => new Date(NOW - n * 60000).toISOString();

/** A farm of folders like Astra's PC: the hub (real pets.json), Documents' data folder and AppData's program folders. */
function farm() {
  const dir = mkdtempSync(join(tmpdir(), 'pet-moods-'));
  const where = { root, out: join(dir, 'out'), keys: join(dir, 'keys'), programs: [join(dir, 'local', 'astras-pet-os'), join(dir, 'local', 'findastra')], status: join(dir, 'pets-status.json') };
  const mood = (program, m, updated, line = `${program} says ${m}`) => {
    mkdirSync(join(where.programs[0], program), { recursive: true });
    writeFileSync(join(where.programs[0], program, 'mood-20261021.json'), JSON.stringify({ schema: 'astras-pet-os-mood-v1', program, mood: m, line, updated }));
  };
  const key = (id, pet, status = 'requested', key_name = 'SOME_KEY') => {
    mkdirSync(where.keys, { recursive: true });
    writeFileSync(join(where.keys, `${id}.json`), JSON.stringify({ schema: 'api-fairy-key-request-v1', id, asked: '2026-11-01', requester: { kind: 'pet', pet }, provider: 'GitHub', key_name, status }));
  };
  const round = (pets) => writeFileSync(where.status, JSON.stringify({ pets }));
  return { dir, where, mood, key, round, done: () => rmSync(dir, { recursive: true, force: true }) };
}

test('the moods it shows everywhere are the six that tell Astra something, in the mood key\'s order', () => {
  assert.deepEqual(SHOWN, ORDER.filter((m) => !['idle', 'blink', 'sleep'].includes(m)));
  for (const m of SHOWN) assert.ok(PAGE_FACES.includes(m), `every page picture of a pet carries ${m}`);
  assert.equal(PAGE_FACES[0], 'idle', 'idle is the face a picture starts with');
});

test('a background pet\'s own mood counts while its file is fresh, and the most urgent mood wins', () => {
  const f = farm();
  try {
    f.mood('log-den', 'alarmed', minutes(1), 'I caught 45 crashes');
    f.mood('packet-river', 'sleep', minutes(2));
    f.mood('kernel-grove', 'worried', minutes(60)); // stopped an hour ago
    f.mood('pet-chat', 'happy', minutes(1)); // the pet chat helper is no pet
    f.key('k1', 'log-den');
    const board = readBoard(f.where, NOW);
    assert.equal(board.schema, SCHEMA);
    assert.equal(board.stale_after_ms, STALE_MS);
    assert.deepEqual(Object.keys(board.pets).sort(), ['log-den', 'packet-river']);
    const lynx = board.pets['log-den'];
    assert.equal(lynx.pet, 'Log Lynx');
    assert.equal(lynx.art, 'log-lynx', 'the desktop id, as Startup Star names him');
    assert.equal(lynx.mood, 'alarmed', 'alarmed beats curious');
    assert.equal(lynx.show, 'alarmed');
    assert.equal(lynx.says, 'I caught 45 crashes');
    assert.deepEqual(lynx.why.map((w) => w.mood), ['alarmed', 'curious']);
    assert.equal(board.pets['packet-river'].mood, 'sleep');
    assert.equal(board.pets['packet-river'].show, null, 'a calm mood is not shown: each place keeps its own resting look');
  } finally { f.done(); }
});

test('a key request waiting on Astra makes the pet that asked curious, under its current repo', () => {
  const f = farm();
  try {
    f.key('a', 'findastra-discord-presence', 'requested', 'ASK_ASTRA_ANTHROPIC_API_KEY'); // Discord Damsel's old app name
    f.key('b', 'portfolio-puffer', 'given');
    f.key('c', 'role-fairy', 'declined');
    f.key('d', 'not-a-pet');
    const moods = keyMoods(f.where.keys);
    assert.equal(moods.length, 2);
    const board = readBoard(f.where, NOW);
    assert.deepEqual(Object.keys(board.pets), ['discord-tower']);
    assert.equal(board.pets['discord-tower'].show, 'curious');
    assert.match(board.pets['discord-tower'].says, /ASK_ASTRA_ANTHROPIC_API_KEY \(GitHub\)/);
  } finally { f.done(); }
});

test('the Farmer\'s round counts for a week, then says nothing about now', () => {
  const f = farm();
  try {
    f.round({ 'drum-dog': { mood: 'worried', says: 'A missed run', checked: new Date(NOW - 2 * 86400000).toISOString() },
      'learn-python': { mood: 'happy', says: 'New work', checked: new Date(NOW - 30 * 86400000).toISOString() },
      'unity-unicorn': { mood: 'grumpy', checked: minutes(5) } });
    assert.deepEqual(roundMoods(f.where.status, NOW).map((r) => r.repo), ['drum-dog']);
    assert.equal(readBoard(f.where, NOW).pets['drum-dog'].show, 'worried');
  } finally { f.done(); }
});

test('a mood file from the future or of another kind does not count', () => {
  const f = farm();
  try {
    f.mood('log-den', 'alarmed', new Date(NOW + 10 * 60000).toISOString());
    f.mood('evidence-locker', 'shouting', minutes(1));
    assert.deepEqual(programMoods(f.where.programs, NOW), []);
  } finally { f.done(); }
});

test('it writes the same board for programs and for pages, and the page copy sets one variable', () => {
  const f = farm();
  try {
    f.mood('evidence-locker', 'happy', minutes(1));
    const board = writeBoard(f.where, NOW);
    const json = JSON.parse(readFileSync(join(f.where.out, BOARD), 'utf8'));
    assert.deepEqual(json, board);
    const sandbox = { window: {} };
    vm.runInNewContext(readFileSync(join(f.where.out, PAGE_DATA), 'utf8'), sandbox);
    assert.deepEqual(JSON.parse(JSON.stringify(sandbox.window[PAGE_VAR])), board);
    assert.equal(pageFile(board).split('\n').filter((l) => !l.startsWith('//') && l).length, 1);
    assert.ok(!/[A-Za-z0-9_-]{32,}/.test(JSON.stringify(board)), 'no key value or token-like text');
  } finally { f.done(); }
});

test('only one copy keeps writing, and it rewrites the board when a mood changes', () => {
  const f = farm();
  try {
    f.mood('log-den', 'alarmed', new Date().toISOString());
    const first = keepWriting(f.where, { every: 60000 });
    assert.ok(first, 'the first copy runs');
    const lock = join(f.where.out, 'pet-moods-20261114.lock');
    writeFileSync(lock, String(process.ppid)); // another running copy holds it
    assert.equal(keepWriting(f.where, { every: 60000 }), null, 'a second copy steps back');
    writeFileSync(lock, String(process.pid));
    f.mood('log-den', 'sick', new Date().toISOString());
    first.tick();
    assert.equal(JSON.parse(readFileSync(join(f.where.out, BOARD), 'utf8')).pets['log-den'].show, 'sick');
    first.stop();
  } finally { f.done(); }
});

test('every pet the farm knows can be found by its repo, and old app names lead to it', () => {
  const list = petList(root);
  assert.equal(list.find('log-den'), 'log-den');
  assert.equal(list.find('findastra-discord-presence'), 'discord-tower');
  assert.equal(list.find('no-such-pet'), null);
  assert.equal(list.pets.get('spoonfed').art, 'spoonfed-sugarcube', 'a pipeline pet has its desktop draft\'s id');
  const programs = JSON.parse(read('pet-programs.json')).programs;
  for (const p of programs) if (p.repo) assert.ok(list.pets.has(p.repo), `${p.repo} is on the list`);
});

test('the pages carry every face and say whose picture it is: the pet at the top, its friends, the pets it talks to', () => {
  const files = spawnerFiles(readSpawnerSources(root));
  const page = files[`${DIR}/log-den-20261018.html`];
  assert.ok(page, 'Log Den has a page');
  const den = /<div class="den[^"]*" data-arrival="waiting" data-mood-of="log-den">([\s\S]*?)<\/div>/.exec(page);
  assert.ok(den, 'the pet at the top says it is log-den');
  for (const m of PAGE_FACES) assert.match(den[1], new RegExp(`data-face="${m}"`), `Log Lynx's ${m} face is in his cyberhome`);
  const friends = [...page.matchAll(/<li class="mood related-pet" data-mood-of="([^"]+)">([\s\S]*?)<\/li>/g)];
  assert.ok(friends.length > 0, 'his friends are on the page');
  for (const [, id, inner] of friends) {
    const shown = [...inner.matchAll(/<img [^>]*data-face="([a-z]+)"[^>]*>/g)];
    if (!shown.length) continue; // a friend with no picture yet
    assert.equal(shown.filter((m) => !/ hidden>?/.test(m[0])).map((m) => m[1]).join(), 'idle', `${id} starts idle`);
    if (shown.length === 1) continue; // a seed with only its icon (Queue Quokka) has no mood pictures yet
    for (const m of SHOWN) assert.ok(shown.some((s) => s[1] === m), `${id} can show ${m}`);
  }
  const js = read('apps/pet-programs/pet-program-page-20261018.js');
  assert.ok(js.includes("Astra's PetOS Data/astras-pet-os/pet-moods/" + PAGE_DATA), 'the page reads the board pet-moods writes');
  assert.ok(js.includes(`window.${PAGE_VAR}`) && js.includes(`'${SCHEMA}'`), 'and checks it is that board');
});

test('Startup Star reads the same file, starts pet-moods at sign-in and draws the mood it shows', () => {
  const cs = read('scripts/desktop-pets-20261011.cs');
  assert.ok(cs.includes(`"Astra's PetOS Data","astras-pet-os","pet-moods","${BOARD}"`), 'the star reads the board');
  assert.ok(cs.includes(`Schema="${SCHEMA}"`));
  assert.ok(cs.includes(`Shown={${SHOWN.map((m) => `"${m}"`).join(',')}}`), 'the star shows the same six moods');
  assert.match(cs, /AlsoAtSignIn=\{[^}]*"pet-moods"[,}]/, 'it starts pet-moods at sign-in');
  assert.ok(cs.includes('"scripts","pet-moods-20261114.mjs"') && cs.includes('Marker="pet-moods-20261114"'));
});
