// Astra, 2026-10-19: "An Intelligent App, or Pet, by Astra" goes only in a pet repo's own README, "this should only
// be when its at a pet repo". In this repo that is the front README.md (and a draft pet's future README); everything
// else that mentions it is a rule, a checker, a test fixture or history. Pages, AGENTS.md and generated files never.
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const LINE = 'Intelligent App, or Pet, by Astra';
const allowedFile = (p) => p === 'README.md' || /^drafts\/[^/]+\/README\.md$/.test(p)
  || /^(handoffs|test)\//.test(p) || /^docs\/flash-audit-rounds-\d{8}\//.test(p) || p === 'docs/idle-flash-audit-20261017.md'
  || p === 'PET-FILES.md' || p === 'docs/flash-audit-20261014.md'
  // The scripts that check a README for the line, or write it into a new pet repo's README.
  || /^scripts\/(farmer-rounds-20261009|idle-flash-audit-20261017|idle-flash-fix-20261017|idle-flash-new-repos-20261017|idle-flash-refresh-20261018|pet-program-link-20261018)\.mjs$/.test(p);
// The Goldfish's page copy carries its README checker: only the checking lines may name the line.
const allowedLine = (p, l) => p === 'apps/github-goldfish-20261008.html' && /\.test\(|A pet app by Astra/.test(l);

test('the credit line is only in a README (Astra, 2026-10-19)', () => {
  const files = execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' }).split('\n')
    .filter((p) => /\.(md|html?|m?js|json|txt|css|cs|ps1|cmd|py)$/i.test(p));
  const found = [];
  for (const p of files) {
    if (allowedFile(p)) continue;
    let text; try { text = readFileSync(`${root}/${p}`, 'utf8'); } catch { continue; }
    if (!text.includes(LINE)) continue;
    text.split(/\r?\n/).forEach((l, i) => { if (l.includes(LINE) && !allowedLine(p, l)) found.push(`${p}:${i + 1}`); });
  }
  assert.deepEqual(found, [], `"An Intelligent App, or Pet, by Astra" outside a README; say "By Astra" there:\n${found.join('\n')}`);
});
