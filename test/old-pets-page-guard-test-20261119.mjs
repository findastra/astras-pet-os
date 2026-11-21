// The old pets page stays gone (Astra, 2026-10-18 and 2026-11-19: "permanently get rid of" it everywhere). It was
// deleted in #96 and every name for it, data keys included, went in #353. This guard fails the build if the word comes
// back in any tracked file or file name, so an old branch or pull request cannot merge it back.
// The word is assembled so this guard never trips over itself. Skipped: embedded base64 (random letters) and the
// bundled original Data Dealer dashboard, whose casino-style vocabulary names that app's payments desk, not this page.
// Claude Opus 5.5 (claude-opus-5-5), 2026-11-19.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const word = new RegExp('\\bca' + 'ge', 'i');
const skip = [/^apps\/data-dealer-[^/]*\.html$/];
const text = /\.(md|json|html|js|mjs|cjs|css|cs|ps1|cmd|bat|manifest|txt|yml|yaml|svg|csv|toml)$/i;

const tracked = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);

test('no tracked file name carries the old pets page', () => {
  assert.deepEqual(tracked.filter((f) => word.test(f)), []);
});

test('no tracked text mentions the old pets page', () => {
  const found = [];
  for (const file of tracked) {
    if (!text.test(file) || skip.some((s) => s.test(file))) continue;
    let body;
    try { body = readFileSync(join(root, file), 'utf8'); } catch { continue; }
    body = body.replace(/data:[a-z/+.-]+;base64,[A-Za-z0-9+/=]+/gi, '').replace(/[A-Za-z0-9+/=]{60,}/g, '');
    body.split('\n').forEach((line, i) => { if (word.test(line)) found.push(`${file}:${i + 1}`); });
  }
  assert.deepEqual(found, [], 'the old pets page was deleted on 2026-10-18; remove these mentions');
});
