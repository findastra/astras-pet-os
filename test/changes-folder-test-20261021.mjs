// Changes are recorded in changes/ (Astra, 2026-10-21, card 069: one small file per change, so two pull requests
// never write on the same line). AGENTS.md keeps its rules and its "Built with" line; a credit line dated after
// 2026-10-21 belongs in its own file in changes/. The lines written before moved word for word to the history file.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = (p) => readFileSync(`${root}/${p}`, 'utf8');
const MODEL = /Claude (Opus|Sonnet|Haiku|Fable)|claude-(opus|sonnet|haiku|fable)-|OpenAI Codex|Codex \(GPT|GPT-\d/;
const SWITCHED = '2026-10-21';
const HISTORY = 'history-20261007-20261021.md';

test('AGENTS.md gets no new credit line: a change after 2026-10-21 has its own file in changes/', () => {
  const late = read('AGENTS.md').split(/\r?\n/).map((l, i) => [i + 1, l])
    .filter(([, l]) => MODEL.test(l) && (l.match(/\b20\d\d-\d\d-\d\d\b/g) || []).some((d) => d > SWITCHED));
  assert.deepEqual(late.map(([i]) => `AGENTS.md:${i}`), [], 'write it in changes/<topic>-YYYYMMDD.md instead');
});

test('AGENTS.md and CLAUDE.md point to changes/, never to a new line in AGENTS.md', () => {
  const agents = read('AGENTS.md');
  assert.match(agents, /^Built with Claude Sonnet 5\.5 .*never as a new line here\.$/m);
  assert.match(agents, /^- \*\*Changes are recorded in `changes\/`\*\* \(Astra, 2026-10-21, card 069/m);
  assert.ok(agents.includes(`(changes/${HISTORY})`), 'AGENTS.md links the history file');
  const claude = read('CLAUDE.md');
  assert.doesNotMatch(claude, /Record your model name and version in AGENTS\.md/);
  assert.match(claude, /in its own new file in `changes\/`/);
});

test('every file in changes/ is named the house way and says who made the change, and when', () => {
  const files = readdirSync(`${root}/changes`);
  assert.ok(files.includes(HISTORY));
  for (const f of files) {
    assert.match(f, /^[a-z0-9]+(-[a-z0-9]+)*-\d{8}\.md$/, `${f}: lowercase words and hyphens, then -YYYYMMDD.md`);
    const text = read(`changes/${f}`);
    assert.match(text, MODEL, `${f} names the model and version`);
    assert.match(text, /\b20\d\d-\d\d-\d\d\b/, `${f} has the date`);
  }
});

test('the older lines moved word for word, and nothing else about them changed', () => {
  const history = read(`changes/${HISTORY}`);
  const moved = history.split(/\r?\n/).filter((l) => MODEL.test(l) && /\b20\d\d-\d\d-\d\d\b/.test(l));
  assert.ok(moved.length >= 70, `the history file holds the ${moved.length} older credit lines`);
  for (const words of [
    'Ghost Protocol and dated asset support added with OpenAI Codex (GPT-6), 2026-10-08.',
    'Spoonfed Sugarcube hatching metadata and its single-pet recipe prepared with OpenAI Codex (GPT-6), 2026-10-11.',
    'Questions as slides (Astra, 2026-10-19): `skills/questions-as-slides`, installed for Claude and Codex, by Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-19.',
  ]) assert.ok(history.includes(words), `moved: ${words.slice(0, 60)}`);
  const agents = read('AGENTS.md');
  for (const l of moved) assert.ok(!agents.includes(l), `not in AGENTS.md twice: ${l.slice(0, 60)}`);
});

test('new pet repos are told the same (the Idle Flash Audit writes their AGENTS.md and CLAUDE.md)', () => {
  for (const s of ['scripts/idle-flash-fix-20261017.mjs', 'scripts/idle-flash-refresh-20261018.mjs', 'scripts/idle-flash-new-repos-20261017.mjs']) {
    const t = read(s);
    assert.doesNotMatch(t, /Record the model and version (when an assistant changes it|for changes)\./, `${s} still says the old rule`);
    assert.match(t, /in its own new file in \\`changes\/\\`/, `${s} points to changes/`);
  }
});
