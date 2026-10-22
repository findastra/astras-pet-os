// Card numbers never repeat (skills/handoff), across main and every branch.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-17. Since 2026-10-22 (Astra, 2026-10-21, card 069) a new card's number is
// its pull request's number: GitHub hands it out, so nothing is reserved in handoffs/README.md. The cards numbered
// before that keep the numbers the README's table gives them.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const dir = new URL('../handoffs/', import.meta.url);
const readme = readFileSync(new URL('README.md', dir), 'utf8');
const cards = readdirSync(dir).filter((f) => /^\d{3,}-.+\.md$/.test(f));
/** The old counter's next free number when it stopped, and the first pull request after the switch. */
const OLD_NEXT = 71;
const FIRST_PR_CARD = 196;
const num = (f) => +/^\d+/.exec(f)[0];

/** Numbers the README's "Card numbers" table gives to a named card file. */
export function reservedNumbers(text) {
  const out = new Map();
  for (const m of text.matchAll(/^\| (\d{3}) \| `(\d{3}-[^`]+\.md)` \|/gm)) out.set(m[1], m[2]);
  return out;
}

/** One line per broken rule; empty when the cards and the table agree. */
export function numberProblems(files, text) {
  const problems = [];
  const seen = new Map();
  for (const f of files) {
    const n = num(f);
    if (seen.has(n)) problems.push(`card ${n} is used twice: ${seen.get(n)} and ${f}`);
    seen.set(n, f);
  }
  const reserved = reservedNumbers(text);
  for (const f of files) {
    const n = num(f);
    if (n >= FIRST_PR_CARD) continue; // numbered by its pull request: no row in the README
    if (n >= OLD_NEXT) { problems.push(`${f}: a new card's number is its pull request's number, not the old counter's`); continue; }
    const want = reserved.get(String(n).padStart(3, '0'));
    if (want && want !== f) problems.push(`card ${n} belongs to ${want}, not ${f}: take your pull request's number`);
    if (!text.includes(f)) problems.push(`${f} is not listed in handoffs/README.md`);
  }
  if (!new RegExp(`The old counter stopped at 0?${OLD_NEXT}\\b`).test(text)) problems.push('handoffs/README.md does not say where the old counter stopped');
  return problems;
}

test('every card number is used once; cards from before 2026-10-22 match the table in handoffs/README.md', () => {
  assert.deepEqual(numberProblems(cards, readme), []);
});

test('the check catches a repeated number, a number given to another card and the old counter used again', () => {
  const text = '| 017 | `017-security.md` | x |\nThe old counter stopped at 071.\n012-a.md 012-b.md 017-other.md';
  const p = numberProblems(['012-a.md', '012-b.md', '017-other.md'], text);
  assert.ok(p.some((x) => /card 12 is used twice/.test(x)));
  assert.ok(p.some((x) => /card 17 belongs to 017-security\.md/.test(x)));
  assert.ok(numberProblems(['071-x.md'], text).some((x) => /pull request's number, not the old counter's/.test(x)));
  assert.deepEqual(numberProblems(['207-any-new-card-20261022.md', '1204-any-later-card-20270101.md'], text), [], 'a pull request number needs no row');
  assert.ok(numberProblems(['207-a.md', '207-b.md'], text).some((x) => /card 207 is used twice/.test(x)));
});

test('the handoff skill and AGENTS.md give a new card its pull request\'s number', () => {
  const skill = readFileSync(new URL('../skills/handoff/SKILL.md', import.meta.url), 'utf8');
  assert.match(skill, /A new card's number is the number of the pull request that adds it/);
  assert.doesNotMatch(skill, /reserve the next free number/);
  const agents = readFileSync(new URL('../AGENTS.md', import.meta.url), 'utf8');
  assert.match(agents, /A new card's number is its pull request's number \(Astra, 2026-10-21, card 069\)/);
});
