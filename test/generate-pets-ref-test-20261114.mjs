// generate-pets.mjs --ref <png>: a new body for one pet, drawn from a reference picture (Papermon from his card art,
// Astra 2026-11-14). Only --dry runs here, and with no bridge and no key, so a test can never spend money.
// Claude Opus 5.5 (claude-opus-5-5), 2026-11-14.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { REF_NOTE } from '../scripts/generate-pets.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const run = (...args) => spawnSync(process.execPath, ['scripts/generate-pets.mjs', ...args], {
  cwd: root, encoding: 'utf8', env: { ...process.env, OPENAI_API_KEY: '', IMAGE_BRIDGE: 'no-bridge-in-tests.mjs' },
});
const picture = 'art/frames/goldfish/idle.png'; // any PNG in the hub

test('--ref gives one pet its reference picture, and the picture is never read as a pet id', () => {
  const r = run('paper-girl', '--dry', '--ref', picture);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, new RegExp(`--- paper-girl --- \\(reference: ${picture.replace(/[./]/g, '\\$&')}\\)`));
  assert.equal((r.stdout.match(/^--- /gm) || []).length, 1, 'only the named pet is drawn');
  assert.ok(r.stdout.includes(REF_NOTE), 'the prompt says to take only the design from the picture');
  assert.ok(!run('paper-girl', '--dry').stdout.includes(REF_NOTE), 'without --ref the prompt is the plain one');
});

test('--ref refuses two pets, --match, a missing value, a missing file and a picture that is not a PNG', () => {
  for (const args of [
    ['paper-girl', 'goldfish', '--dry', '--ref', picture],
    ['paper-girl', '--match', '--dry', '--ref', picture],
    ['paper-girl', '--dry', '--ref'],
    ['paper-girl', '--dry', '--ref', 'art/not-a-picture-20261114.png'],
    ['paper-girl', '--dry', '--ref', 'pets.json'],
  ]) {
    const r = run(...args);
    assert.equal(r.status, 2, `${args.join(' ')} should stop: ${r.stdout}${r.stderr}`);
    assert.doesNotMatch(r.stdout, /^--- /m, `${args.join(' ')} drew nothing`);
  }
});
