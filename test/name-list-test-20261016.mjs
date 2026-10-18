// One list of names (Astra, 2026-10-16): every other list must agree with pet-programs.json. Claude Opus 5.5.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { nameDrift } from '../scripts/name-list-20261016.mjs';

const read = (f) => readFileSync(new URL('../' + f, import.meta.url), 'utf8');

test('pets.json, system-map.json and INTELLIGENCE-LEVELS.md use the names in pet-programs.json', () => {
  const drift = nameDrift({ programs: JSON.parse(read('pet-programs.json')).programs, registry: JSON.parse(read('pets.json')), systemMap: JSON.parse(read('system-map.json')), intelligence: read('INTELLIGENCE-LEVELS.md') });
  assert.deepEqual(drift, [], 'change the name in pet-programs.json first, then the others');
});

test('the drift check catches a renamed pet, a missing seed program and a duplicate name', () => {
  const programs = [{ number: 1, icon: 'Chat Rat', program: 'Chat Nest', assigned: true, repo: 'chat-rat' }, { number: 2, icon: 'Chat Rat', program: 'pet-program-2', assigned: false, repo: 'x' }];
  const registry = { pets: [{ repo: 'chat-rat', pet: 'Chat Mouse' }], seeds: { pets: [{ pet: 'Chat Rat' }] } };
  const d = nameDrift({ programs, registry });
  assert.ok(d.some((x) => /used by #1 and #2/.test(x)));
  assert.ok(d.some((x) => /"Chat Mouse", the list says "Chat Rat"/.test(x)));
  const seed = nameDrift({ programs: [programs[0]], registry: { seeds: { pets: [{ pet: 'Chat Rat' }] } } });
  assert.ok(seed.some((x) => /program is "\(none\)", the list says "Chat Nest"/.test(x)));
});

test('the drift check catches a wrong or unnamed program in INTELLIGENCE-LEVELS.md (2026-10-18)', () => {
  const programs = [
    { number: 1, icon: 'Chat Rat', program: 'Chat Stack', assigned: true, repo: 'chat-rat' },
    { number: 2, icon: 'Drum Dog', program: 'Bass & Biscuits', assigned: true, repo: 'drum-dog' },
    { number: 3, icon: 'Gone Ghost', program: 'Am I a Ghost?', assigned: true, repo: 'ghost-protocol' },
    { number: 4, icon: 'Pole Puff', program: 'pet-program-4', assigned: false, repo: 'pet-program-4' },
  ];
  const row = (pet, kind, program) => `| <img src="x.png" width="40" alt=""> | ${pet} | ${kind} | none | — **Made by Astra:** ${program} | — | — | — | | |`;
  const ok = [row('Chat Rat', 'unregistered', '**Chat Stack** (not built)'), row('Drum Dog', 'registered', '**Bass & Biscuits**: the web app'),
    row('Gone Ghost', 'registered', '**Am I a Ghost?**, the local session'), row('Pole Puff', 'seed', '**[A world](https://x)**, not named yet')].join('\n');
  assert.deepEqual(nameDrift({ programs, registry: {}, intelligence: ok }), [], 'list names in bold pass; an unnamed program is not checked');
  const bad = [row('Chat Rat', 'unregistered', '**Chat Nest** (not built)'), row('Drum Dog', 'registered', '*Doghouse Studio*: the web app')].join('\n');
  const d = nameDrift({ programs, registry: {}, intelligence: bad });
  assert.ok(d.includes(`INTELLIGENCE-LEVELS.md: Chat Rat's program is "Chat Nest", the list says "Chat Stack"`), d.join('\n'));
  assert.ok(d.includes(`INTELLIGENCE-LEVELS.md: Drum Dog's program is not named in bold, the list says "Bass & Biscuits"`), d.join('\n'));
});
