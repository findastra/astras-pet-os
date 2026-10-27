// The retired word stays retired (Astra, 2026-10-26: "not supposed to ever be pet app, been trying to get rid of
// that. Astra's PetOS or Pet (Agent) or Pet Program (Agent's Living Space)"). Fails when "pet app" or "pet apps"
// (any case, as whole words, with any spaces or line breaks between them) comes back in a tracked text file, and when
// anything links or reads the old skill folder, skills/pet-app (now skills/build-a-pet).
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-26.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const RETIRED = /(?<![\p{L}\p{N}])pet\s+apps?(?![\p{L}\p{N}])/giu;

// Records keep their words as written: they say what was true, or what someone said, on their date.
//   changes/                        one file per change, a dated record (AGENTS.md)
//   docs/flash-audit-rounds-*/      the Flash Audit's dated round reports and ledgers, written by its scripts
//   a handoff card whose status is done (its first lines say `status: done...`)
const RECORD_FOLDERS = [/^changes\//, /^docs\/flash-audit-rounds-\d{8}\//];
// This test names the word on purpose, to find it.
const SELF = 'test/no-retired-pet-word-20261026.mjs';
// Two literal strings stay, because they name something that is not the word in use:
//   "A pet app by Astra"   the retired credit line, which the checks must still recognise to report it
//   "Findastra Pet Apps"   the name of a real folder on Astra's PC, where an old record lives
const ALLOWED = [/a pet app by astra/giu, /findastra pet apps/giu];

const tracked = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);
const read = (f) => readFileSync(root + f);
const isText = (buf) => !buf.subarray(0, 8000).includes(0);
const isDoneCard = (f, text) => /^handoffs\/\d{3}-/.test(f) && /^status:\s*done/im.test(text.split('\n').slice(0, 6).join('\n'));
const blank = (s) => s.replace(/[^\n]/g, ' ');

// PET-WORDS.md lists the retired word in the "Not" column of its tables on purpose: that is how the Goldfish learns it.
export function withoutNotColumn(md) {
  let notAt = -1;
  return md.split('\n').map((line) => {
    if (!line.startsWith('|')) { notAt = -1; return line; }
    const cells = line.split('|');
    const head = cells.map((c) => c.trim()).indexOf('Not');
    if (head > 0) { notAt = head; return line; }
    if (notAt > 0 && cells.length > notAt) cells[notAt] = blank(cells[notAt]);
    return cells.join('|');
  }).join('\n');
}

// pets.json `words` is PET-WORDS.md's machine-readable copy: its `retired` lists are the Not column. They are blanked
// in place, so a line number still points at the right line.
function withoutRetiredLists(json) {
  assert.equal(JSON.parse(json).words?.parts?.every((p) => Array.isArray(p.retired)), true, 'pets.json words.parts[].retired');
  return json.replace(/"retired":\s*\[[^\]]*\]/g, (m) => m.replace(/"[^"]*"(?=\s*[,\]])/g, blank));
}

export function findings(file, text) {
  let t = text;
  if (file === 'PET-WORDS.md') t = withoutNotColumn(t);
  if (file === 'pets.json') t = withoutRetiredLists(t);
  for (const re of ALLOWED) t = t.replace(re, blank);
  return [...t.matchAll(RETIRED)].map((m) => `${file}:${t.slice(0, m.index).split('\n').length}: "${m[0].replace(/\s+/g, ' ')}"`);
}

test('the retired word is not used anywhere in this repo, outside the records', () => {
  const found = [];
  for (const f of tracked) {
    if (f === SELF || RECORD_FOLDERS.some((re) => re.test(f)) || !existsSync(root + f)) continue;
    const buf = read(f);
    if (!isText(buf)) continue;
    const text = buf.toString('utf8');
    if (isDoneCard(f, text)) continue;
    found.push(...findings(f, text));
  }
  assert.deepEqual(found, [], `Say Pet, Pet Program or Astra's PetOS instead (PET-WORDS.md):\n${found.slice(0, 40).join('\n')}`);
});

test('the check itself: it finds the word in any case and across a line break, and skips only what it should', () => {
  assert.equal(findings('README.md', 'Rift Rabbit is a pet app.').length, 1);
  assert.equal(findings('README.md', 'Every Pet App, all PET\nAPPS.').length, 2);
  assert.equal(findings('README.md', 'the pet-app topic, apps/pet-programs, a pet application, carpet apps').length, 0);
  assert.equal(findings('README.md', 'README still has "*A pet app by Astra.*"').length, 0, 'the retired credit line, which checks recognise');
  const md = '| Part | Call it | Not |\n|---|---|---|\n| The whole set | **a Pet and its Pet Program** | pet app |\n\nNot a pet app.';
  assert.deepEqual(findings('PET-WORDS.md', md).map((f) => f.split(':')[1]), ['5'], 'the Not column is skipped, the prose is not');
  const json = JSON.stringify({ words: { about: 'x', parts: [{ say: 'Pet (Agent)', retired: ['pet app', 'pet apps'] }] }, job: 'a pet app' }, null, 2);
  assert.deepEqual(findings('pets.json', json).map((f) => f.split(':')[1]), ['14'], 'the retired lists are skipped, the rest of pets.json is not');
});

test('the skill is build-a-pet: skills/pet-app is gone and nothing links or reads it', () => {
  assert.ok(!existsSync(root + 'skills/pet-app'), 'skills/pet-app was renamed to skills/build-a-pet (Astra, 2026-10-26)');
  const skill = readFileSync(root + 'skills/build-a-pet/SKILL.md', 'utf8');
  assert.match(skill, /^---\nname: build-a-pet\ndescription: [^\n]+\n---\n/);
  const OLD_PATH = /\]\((?:\.\.\/)*skills\/pet-app\b|['"`]skills\/pet-app\//;
  const found = tracked.filter((f) => !RECORD_FOLDERS.some((re) => re.test(f)) && existsSync(root + f) && /\.(md|mjs|js|json|ps1|cmd|html)$/.test(f))
    .filter((f) => { const t = read(f).toString('utf8'); return OLD_PATH.test(t) && !isDoneCard(f, t); });
  assert.deepEqual(found, [], 'link or read skills/build-a-pet/SKILL.md instead');
});
