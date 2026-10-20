// The Friendly Farmer's pet-privatizer (Astra, 2026-10-18): it says what making a repo private would lose, only acts on
// animals and only with the owner's OK, and a farm's new repos start private. Claude Opus 5.5 (claude-opus-5-5).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, rmSync, symlinkSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assess, farmRepos, markPrivate, markVisibility, refusal, scanHistory, describeScan } from '../scripts/pet-privatizer-20261018.mjs';

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

// Both ways, on any farm's own account (Astra, 2026-10-20: "privatize and unprivatize"; card 058).
const dev = {
  cage: 'devs-pet-os', github_owner: 'XxdevilishxX',
  pets: [{ repo: 'devs-pet-os', role: 'host' }, { repo: 'meme-fiend', github_owner: 'findastra' }, { repo: 'dev-diary', visibility: 'private' }],
  pipeline: [],
};

test('plan public says what becomes visible; a public repo or a fork does not change', () => {
  const p = assess(repo({ private: true }), false, 'public');
  assert.equal(p.action, 'publicize');
  assert.deepEqual(p.shown, ['every commit on every branch, with its files and messages', 'its issues, pull requests and releases', 'its Actions logs']);
  assert.deepEqual(p.losses, []);
  assert.equal(assess(repo(), false, 'public').action, 'none', 'already public');
  assert.match(assess(repo({ private: true, fork: true }), false, 'public').why, /never changes a fork's visibility/);
  assert.equal(assess(repo()).action, 'privatize', 'private is still the default way');
});

test('the one art source never goes private, and another account\'s pet is copied, not changed', () => {
  const astra = JSON.parse(read('pets.json'));
  assert.match(refusal(astra, 'astras-pet-os', 'private'), /one art source \(findastra\/astras-pet-os\)/);
  assert.equal(refusal(astra, 'astras-pet-os', 'public'), '');
  assert.equal(refusal(astra, 'meme-fiend', 'private'), '');
  assert.match(refusal(astra, 'claude-bot', 'public'), /^it stays private: its art is an exact copy of ChatGPT’s BSOD/, 'pets.json says why it may never be public');
  assert.equal(refusal(astra, 'claude-bot', 'private'), '');
  assert.match(refusal(dev, 'meme-fiend', 'public'), /findastra's pet, not XxdevilishxX's, so only findastra changes it: make your own private copy instead \(copy findastra\/meme-fiend <new-name> --yes\)/);
  assert.equal(refusal(dev, 'devs-pet-os', 'private'), '', 'another farm\'s own hub copy may be private: its pictures come from Astra\'s');
  assert.equal(refusal(dev, 'dev-diary', 'public'), '');
});

test('pets.json follows both ways with one changed line', () => {
  const raw = read('pets.json');
  const priv = read('pets.json').replace(/("repo": "meme-fiend",[\s\S]*?"visibility": )"public"/, '$1"private"');
  assert.notEqual(priv, raw);
  const out = markVisibility(priv, 'meme-fiend', 'public');
  assert.deepEqual(out.split('\n').filter((l, i) => l !== priv.split('\n')[i]).map((l) => l.trim()), ['"visibility": "public",']);
  assert.equal(markVisibility(out, 'meme-fiend', 'public'), out, 'a second run changes nothing');
  assert.equal(markVisibility(raw, 'no-such-pet', 'public'), raw);
});

test('before going public, every commit of every branch is scanned; it names the file and commit, never the text', () => {
  const dir = mkdtempSync(join(tmpdir(), 'privatizer-scan-test-'));
  const fakeKey = 'sk-' + 'a'.repeat(32);
  const folder = ['C:', 'Users', 'someone', 'notes.txt'].join('\\');
  const git = (...a) => execFileSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', '-c', 'core.autocrlf=false', ...a], { cwd: dir, encoding: 'utf8', stdio: 'pipe' });
  try {
    git('init', '-q', '-b', 'main');
    writeFileSync(join(dir, 'README.md'), '# A pet\n');
    git('add', '.'); git('commit', '-q', '-m', 'Start');
    writeFileSync(join(dir, 'keys.txt'), `key=${fakeKey}\nsaved in ${folder}\n`);
    git('add', '.'); git('commit', '-q', '-m', 'Oops');
    const oops = git('rev-parse', '--short', 'HEAD').trim();
    git('rm', '-q', 'keys.txt'); git('commit', '-q', '-m', 'Remove it (still in history)');
    git('checkout', '-q', '-b', 'router-tips');
    writeFileSync(join(dir, 'tips.md'), 'Your router is often at 192.168.1.1.\n');
    writeFileSync(join(dir, 'picture.bin'), Buffer.from([0, 1, 2, 3, 115, 107, 45]));
    git('add', '.'); git('commit', '-q', '-m', 'Router tips');
    git('checkout', '-q', 'main');

    const scan = scanHistory(join(dir, '.git'));
    assert.deepEqual(scan.stop.map((h) => [h.kind, h.file, h.commit]).sort(), [['OpenAI or Anthropic API key', 'keys.txt', oops], ['personal folder path', 'keys.txt', oops]]);
    assert.deepEqual(scan.notes.map((h) => [h.kind, h.file]), [['local network address', 'tips.md']], 'a branch is scanned too; a router address is only noted');
    assert.equal(scan.skipped, 1, 'the binary file is skipped');
    assert.ok(!JSON.stringify(scan).includes(fakeKey) && !describeScan(scan).includes(fakeKey) && !describeScan(scan).includes('someone'));
    assert.match(describeScan(scan), /^the scan found 1 OpenAI or Anthropic API key in keys\.txt \(first in commit [0-9a-f]+\); 1 personal folder path in keys\.txt/);

    rmSync(join(dir, '.git'), { recursive: true, force: true });
    git('init', '-q', '-b', 'main'); git('add', 'README.md'); git('commit', '-q', '-m', 'Clean start');
    const clean = scanHistory(join(dir, '.git'));
    assert.deepEqual([clean.stop, clean.notes], [[], []]);
    assert.match(describeScan(clean), /^the scan of every commit found nothing to stop it \(1 file\)$/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('both ways from the command line: animals only, --yes, and the art source refused before GitHub is asked', () => {
  const run = (...a) => { try { return { code: 0, out: execFileSync(process.execPath, [TOOL, ...a], { encoding: 'utf8', stdio: 'pipe' }) }; } catch (e) { return { code: e.status, err: String(e.stderr) }; } };
  assert.match(run('plan', 'public', 'lunas-log').err, /Animal guard: refusing/);
  assert.match(run('apply', 'public', 'meme-fiend').err, /add --yes when the farm owner says so/);
  assert.match(run('apply', 'public', '--yes').err, /Name the repos to make public/);
  assert.match(run('copy', 'astras-pet-os', 'my-farm', '--yes').err, /Name the source as owner\/repo/);
  const hub = run('plan', 'private', 'astras-pet-os');
  assert.equal(hub.code, 0);
  assert.match(hub.out, /^astras-pet-os: no change; it is the one art source/);
});

test('it runs through a junction too (Documents\\Astra\'s PetOS), not only from the real folder', (t) => {
  const dir = mkdtempSync(join(tmpdir(), 'privatizer-junction-test-'));
  try {
    try { symlinkSync(fileURLToPath(new URL('..', import.meta.url)), join(dir, 'hub'), 'junction'); } catch { t.skip('this computer cannot make a junction or symlink here'); return; }
    const out = execFileSync(process.execPath, [join(dir, 'hub', 'scripts', 'pet-privatizer-20261018.mjs')], { encoding: 'utf8' });
    assert.match(out, /^The Friendly Farmer's pet-privatizer/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
