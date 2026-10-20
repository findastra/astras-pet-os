// The credit is "By Astra." (Astra, 2026-10-20, card 059: take "An Intelligent App, or Pet, by Astra." out of every
// pet repo's README and write "By Astra." where a credit is needed). Before that, 2026-10-19, the longer line was
// allowed only in a pet repo's own README; now it is retired everywhere, READMEs too. What may still name it: history
// (cards, the dated Flash Audit rounds), tests, and the checkers that look for it to report it.
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const LINE = 'Intelligent App, or Pet, by Astra';
const allowedFile = (p) => /^(handoffs|test)\//.test(p) || /^docs\/flash-audit-rounds-\d{8}\//.test(p)
  // The scripts that look for a retired credit line in a README, to report it or change it to "By Astra."
  || /^scripts\/(farmer-rounds-20261009|idle-flash-audit-20261017|idle-flash-fix-20261017|idle-flash-refresh-20261018|pet-program-link-20261018)\.mjs$/.test(p);
// The Goldfish's page copy carries its README checker: only its checking line may name the line.
const allowedLine = (p, l) => p === 'apps/github-goldfish-20261008.html' && /\.test\(/.test(l);

test('the retired credit line is nowhere, not even in a README (Astra, 2026-10-20)', () => {
  const files = execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' }).split('\n')
    .filter((p) => /\.(md|html?|m?js|json|txt|css|cs|ps1|cmd|py)$/i.test(p));
  const found = [];
  for (const p of files) {
    if (allowedFile(p)) continue;
    let text; try { text = readFileSync(`${root}/${p}`, 'utf8'); } catch { continue; }
    if (!text.includes(LINE)) continue;
    text.split(/\r?\n/).forEach((l, i) => { if (l.includes(LINE) && !allowedLine(p, l)) found.push(`${p}:${i + 1}`); });
  }
  assert.deepEqual(found, [], `a retired credit line; write "By Astra." instead:\n${found.join('\n')}`);
});

test('the hub README and the draft pets\' READMEs open with "By Astra."', () => {
  const readmes = execFileSync('git', ['ls-files', 'README.md', 'drafts/*/README.md'], { cwd: root, encoding: 'utf8' }).split('\n').filter(Boolean);
  assert.ok(readmes.includes('README.md'));
  for (const p of readmes) {
    const head = readFileSync(`${root}/${p}`, 'utf8').split(/\r?\n/).slice(0, 80).join('\n');
    assert.match(head, /^\*By Astra\.\*$/m, `${p} has the credit "*By Astra.*"`);
    assert.doesNotMatch(head, /A pet app by Astra/i, `${p} has no retired credit line`);
  }
});
