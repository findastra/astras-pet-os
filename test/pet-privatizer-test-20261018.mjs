// The Friendly Farmer's pet-privatizer (Astra, 2026-10-18): it says what making a repo private would lose, only acts on
// animals and only with the owner's OK, and a farm's new repos start private. Claude Opus 5.5 (claude-opus-5-5).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { assess, farmRepos, markPrivate } from '../scripts/pet-privatizer-20261018.mjs';

const read = (f) => readFileSync(new URL('../' + f, import.meta.url), 'utf8');
const TOOL = fileURLToPath(new URL('../scripts/pet-privatizer-20261018.mjs', import.meta.url));
const repo = (over = {}) => ({ name: 'meme-fiend', private: false, fork: false, stargazers_count: 0, subscribers_count: 1, forks_count: 0, ...over });

test('plan says what making a repo private would lose', () => {
  assert.equal(assess(repo({ private: true })).action, 'none', 'already private');
  const clean = assess(repo());
  assert.equal(clean.action, 'privatize');
  assert.deepEqual(clean.losses, [], 'the owner watching their own repo is not a loss');
  const lossy = assess(repo({ stargazers_count: 3, subscribers_count: 2, forks_count: 1 }), true);
  assert.deepEqual(lossy.losses, ['3 star(s) are erased', '1 other watcher(s) are erased', '1 fork(s) stay public and are cut loose', 'its GitHub Pages site stops (a free account has no Pages for private repos)']);
});

test('a fork of a public repo cannot be made private: it gets a private copy instead', () => {
  const f = assess(repo({ name: 'jordans-pet-os', fork: true, parent: { full_name: 'findastra/astras-pet-os' } }));
  assert.equal(f.action, 'copy');
  assert.match(f.why, /fork of findastra\/astras-pet-os/);
});

test('the whole farm is every animal: registered and pipeline pets and the hub, never seeds or candidates', () => {
  const registry = JSON.parse(read('pets.json'));
  const all = farmRepos(registry);
  assert.ok(all.includes('astras-pet-os') && all.includes('data-dealer') && all.includes('meme-fiend'));
  for (const c of registry.candidates || []) assert.ok(!all.includes(c.repo), `${c.repo} is a candidate`);
  assert.equal(all.length, new Set([...registry.pets, ...registry.pipeline].map((p) => p.repo).concat(registry.cage)).size);
});

test('pets.json follows with one changed line, and only for a pet that is not private yet', () => {
  const raw = read('pets.json');
  const out = markPrivate(raw, 'meme-fiend');
  const changed = out.split('\n').filter((l, i) => l !== raw.split('\n')[i]);
  assert.deepEqual(changed.map((l) => l.trim()), ['"visibility": "private",']);
  assert.equal(markPrivate(out, 'meme-fiend'), out, 'a second run changes nothing');
  assert.equal(markPrivate(raw, 'data-dealer'), raw, 'Data Dealer is private already');
  assert.equal(JSON.parse(markPrivate(raw, 'astras-pet-os')).pets.find((p) => p.role === 'host').visibility, 'private', 'the hub is the Friendly Farmer entry');
});

test('it refuses a repo that is not an animal, and changes GitHub only with --yes', () => {
  const run = (...a) => { try { execFileSync(process.execPath, [TOOL, ...a], { encoding: 'utf8', stdio: 'pipe' }); return { code: 0 }; } catch (e) { return { code: e.status, err: String(e.stderr) }; } };
  const seed = run('plan', 'lunas-log');
  assert.equal(seed.code, 1);
  assert.match(seed.err, /Animal guard: refusing/);
  assert.match(run('apply', 'meme-fiend').err, /add --yes when the farm owner says so/);
  assert.match(run('apply', '--yes').err, /Name the repos/);
  assert.match(run('copy', 'findastra/astras-pet-os', 'my-farm').err, /add --yes/);
});

test('a farm\'s new repos start private; public is asked for', () => {
  assert.match(read('scripts/idle-flash-new-repos-20261017.mjs'), /const VIS = process\.argv\.includes\('--public'\) \? '--public' : '--private';/);
  assert.match(read('MAKE-IT-YOURS.md'), /pet-privatizer-20261018\.mjs copy findastra\/astras-pet-os <name> --yes/);
});
