// Pet packs and what each pet needs (Astra, 2026-10-20, Part 4 of docs/farm-owner-and-single-pets-20261019.md, card 058):
// `needs` in pets.json for every registered and pipeline pet, and the Friendly Farmer's pet-packs tool, one zip per pet
// that works without the hub, with its pictures copied in and never committed to a repo.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-20.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readSpawnerSources } from '../scripts/pet-program-pages-20261018.mjs';
import { systemMapData } from '../scripts/system-map-20261012.mjs';
import { buildPack, needsProblems, packRefusal, planPack, repoAt, resolveNeeds, unzip, zip, crc32,
  HUB_DIR, MANIFEST, OPENER, TOOL_LABEL, packName } from '../scripts/pet-packs-20261020.mjs';

const root = fileURLToPath(new URL('..', import.meta.url)).replace(/[\\/]$/, '');
const TOOL = join(root, 'scripts', 'pet-packs-20261020.mjs');
const read = (p) => readFileSync(`${root}/${p}`, 'utf8');
const src = readSpawnerSources(root);
const registry = src.registry;
const extra = src.extra;
const all = [...registry.pets, ...registry.pipeline];
const copy = (x) => JSON.parse(JSON.stringify(x));

// A throwaway git repo standing in for a pet's repo, so the tests never need GitHub.
function fakeRepo(files) {
  const dir = mkdtempSync(join(tmpdir(), 'pet-packs-test-'));
  const git = (...a) => execFileSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', '-c', 'core.autocrlf=false', ...a], { cwd: dir, encoding: 'utf8', stdio: 'pipe' });
  git('init', '-q', '-b', 'main');
  for (const [p, body] of Object.entries(files)) { execFileSync(process.execPath, ['-e', 'require("fs").mkdirSync(require("path").dirname(process.argv[1]),{recursive:true})', join(dir, p)]); writeFileSync(join(dir, p), body); }
  git('add', '-A'); git('commit', '-q', '-m', 'A pet at one version'); git('tag', 'v0.1.0');
  return { dir, gitDir: join(dir, '.git'), done: () => rmSync(dir, { recursive: true, force: true }) };
}
const PET_FILES = {
  'README.md': '# Evidence Locker\n\n*By Astra.*\n\nHow to run it: build it on Windows.\n',
  'pet.json': JSON.stringify({ pet: 'Forensic Ferret', version: '0.1.2-20261019', entry: 'evidence-locker-20261018.html' }),
  'LICENSE': 'MIT License\n',
  'src/main.cs': 'class A { }\r\n', // CRLF kept exactly as committed
  'art/raw.bin': Buffer.from([0, 1, 2, 3, 255]),
};

// ---------- needs ----------

test('every registered and pipeline pet says what it needs, in kinds pets.json knows (needs_key)', () => {
  assert.deepEqual(needsProblems(registry, extra), []);
  for (const p of all) assert.ok(p.needs, `${p.repo} has no needs`);
  assert.deepEqual(Object.keys(registry.needs_key.how).sort(), ['optional', 'required']);
});

test('the needs check finds every kind of mistake', () => {
  const r = copy(registry);
  const pet = r.pets.find((p) => p.repo === 'evidence-locker');
  pet.needs.os.push('beos');
  pet.needs.pets.push({ repo: 'no-such-pet', how: 'required', why: 'x' }, { repo: 'evidence-locker', how: 'optional', why: 'itself' }, { repo: 'log-den', how: 'required', why: 'twice' });
  pet.needs.core.push({ part: 'the-cage', how: 'required', why: 'gone' });
  pet.needs.programs.push({ node: 'github-goldfish', how: 'sometimes', why: '' });
  pet.needs.feelings = [];
  const problems = needsProblems(r, extra).join('\n');
  for (const want of ['unknown os "beos"', '"no-such-pet", which is not a registered or pipeline pet', 'evidence-locker: needs itself', 'needs.pets names one twice',
    '"the-cage", which is not a part of the core', '"github-goldfish", which is not a third-party program', 'unknown how "sometimes"', 'say why', 'unknown kind of need "feelings"']) {
    assert.ok(problems.includes(want), `missing: ${want}\n${problems}`);
  }
  delete r.pipeline[0].needs;
  assert.ok(needsProblems(r, extra).some((x) => x.startsWith(`${r.pipeline[0].repo}: no needs`)));
});

test('the needs never drift from the System Map: every program a pet runs today or plans to is in its needs', () => {
  const map = systemMapData(registry, extra, JSON.parse(read('pet-programs.json')).programs);
  const nodes = new Map(map.nodes.map((n) => [n.id, n]));
  for (const p of all) {
    const mine = new Set([p.repo, nodes.get(p.repo)?.home?.node].filter(Boolean));
    const parts = new Set(map.nodes.filter((n) => ['tool', 'trick'].includes(n.type) && mine.has(n.of)).map((n) => n.id));
    const want = new Set(map.links.filter((l) => ['now', 'planned'].includes(l.state) && (mine.has(l.from) || parts.has(l.from)) && nodes.get(l.to)?.type === 'program').map((l) => l.to));
    const have = new Set(p.needs.programs.map((i) => i.node));
    for (const id of want) assert.ok(have.has(id), `${p.repo} runs ${id} on the System Map, but its needs leave it out`);
  }
});

test('a pet with a desktop pet needs Startup Star, and only those; the host is the core and needs none of it', () => {
  const drafts = src.drafts.pets;
  for (const p of all) {
    const desktop = p.role !== 'host' && (registry.pets.includes(p) || drafts.some((d) => d.repo === p.repo || d.id === p.repo || d.id === p.art || d.name === p.pet));
    assert.equal(p.needs.core.some((c) => c.part === 'startup-star'), desktop, `${p.repo}: Startup Star ${desktop ? 'missing' : 'listed without a desktop pet'}`);
  }
  assert.deepEqual(all.find((p) => p.role === 'host').needs.core, []);
  assert.ok(registry.pets.find((p) => p.repo === 'github-goldfish').needs.core.some((c) => c.part === 'daily-round' && c.how === 'required'));
  const ferret = resolveNeeds(registry, extra, 'evidence-locker');
  assert.deepEqual(ferret.required.map((i) => i.id), ['log-den']);
  assert.equal(ferret.pets[0].name, 'Log Lynx');
});

// ---------- the zip ----------

test('the zip round-trips byte for byte, is the same every time, and a broken file is caught', () => {
  const files = { 'a/one.txt': 'hello pets\n'.repeat(50), 'b/two.bin': Buffer.from([0, 255, 7, 0]), 'c/ünï.md': '# names in UTF-8\n' };
  const z = zip(files, '20261020');
  assert.ok(z.equals(zip(files, '20261020')), 'the same files give the same zip');
  const back = unzip(z);
  assert.deepEqual(Object.keys(back), Object.keys(files));
  for (const [k, v] of Object.entries(files)) assert.ok(back[k].equals(Buffer.isBuffer(v) ? v : Buffer.from(v)), k);
  assert.equal(crc32(Buffer.from('123456789')), 0xcbf43926); // the standard check value
  const bad = Buffer.from(z); bad[40] ^= 0xff;
  assert.throws(() => unzip(bad));
});

// ---------- which pets ----------

test('only animals are packed: never the host, never a pet that stays private, a private repo only with --private', () => {
  assert.match(packRefusal(registry, 'astras-pet-os'), /core of Astra's PetOS: install it with the installer/);
  assert.match(packRefusal(registry, 'claude-bot', { allowPrivate: true }), /stays private, so it is never packed/);
  assert.match(packRefusal(registry, 'no-such-pet'), /not a registered or pipeline pet/);
  const r = copy(registry);
  r.pets.find((p) => p.repo === 'evidence-locker').visibility = 'private';
  assert.match(packRefusal(r, 'evidence-locker'), /repo is private.*--private/);
  assert.equal(packRefusal(r, 'evidence-locker', { allowPrivate: true }), '');
  assert.equal(packRefusal(registry, 'evidence-locker'), '');
  assert.equal(planPack(src, 'claude-bot').ok, false);
});

// ---------- a whole pack ----------

test('a pet pack: the repo at its version, its pictures, a page that works on its own, its Markdown pet and a plain README', () => {
  const repo = fakeRepo(PET_FILES);
  try {
    const repoFiles = repoAt(repo.gitDir, 'HEAD');
    assert.equal(repoFiles.tag, 'v0.1.0');
    const pack = buildPack(src, 'evidence-locker', { repoFiles, ref: 'main', date: '20261020', root, hubCommit: 'abc1234def' });
    const top = packName('evidence-locker', '20261020');
    assert.equal(pack.name, `${top}.zip`);
    const files = unzip(pack.zip);
    const names = Object.keys(files);
    assert.ok(names.every((n) => n.startsWith(`${top}/`)), 'one folder at the top');
    const at = (p) => files[`${top}/${p}`];
    for (const p of ['README.md', OPENER, MANIFEST, 'evidence-locker/README.md', 'evidence-locker/pet.json', `${HUB_DIR}/apps/pet-programs/evidence-locker-20261018.html`,
      `${HUB_DIR}/apps/pet-programs/pet-program-page-20261018.css`, `${HUB_DIR}/apps/pet-programs/pet-program-page-20261018.js`, `${HUB_DIR}/markdown-pets/evidence-locker-20261019.md`]) {
      assert.ok(at(p), `${p} is missing from the pack`);
    }
    // The repo exactly as committed: line endings and binary files untouched.
    assert.ok(at('evidence-locker/src/main.cs').equals(Buffer.from(PET_FILES['src/main.cs'])));
    assert.ok(at('evidence-locker/art/raw.bin').equals(PET_FILES['art/raw.bin']));
    // Its pictures, copied in from the one art source: every mood of its registered frames, its icon and app icon.
    for (const mood of ['idle', 'blink', 'happy', 'curious', 'worried', 'sad', 'sick', 'alarmed', 'sleep']) assert.ok(at(`${HUB_DIR}/art/frames/forensic-ferret/${mood}-20261019.png`), mood);
    assert.ok(at(`${HUB_DIR}/art/icons/evidence-locker-20261012.png`));
    assert.ok(at(`${HUB_DIR}/art/app-icons/evidence-locker/evidence-locker-icon-20261019.ico`));
    for (const n of names.filter((x) => x.startsWith(`${top}/${HUB_DIR}/`))) {
      const p = n.slice(`${top}/${HUB_DIR}/`.length);
      assert.ok(/^(art|desktop-art|apps|markdown-pets)\//.test(p), `${p}: only pictures, the page and the Markdown pet come from the hub`);
      assert.ok(at(`${HUB_DIR}/${p}`).equals(p.endsWith('.html') || p.endsWith('.md') ? at(`${HUB_DIR}/${p}`) : readFileSync(join(root, p))), `${p} is the hub's own picture`);
    }
    // Every relative link in a page the pack writes lands on a file in the pack; the rest go to the public site.
    for (const html of names.filter((n) => n.endsWith('.html') && !n.startsWith(`${top}/evidence-locker/`))) {
      const text = files[html].toString('utf8');
      for (const [, url] of text.matchAll(/\b(?:src|href)="([^"]*)"/g)) {
        if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(url) || !url) continue;
        const target = posix.normalize(posix.join(posix.dirname(html), decodeURI(url.split(/[?#]/)[0]).replace(/&amp;/g, '&')));
        assert.ok(files[target], `${html} links ${url}, which is not in the pack`);
      }
    }
    const page = at(`${HUB_DIR}/apps/pet-programs/evidence-locker-20261018.html`).toString('utf8');
    assert.ok(page.includes(`href="https://findastra.github.io/astras-pet-os/system-map-20261012.html#node=`), 'the System Map link goes to the public site');
    assert.ok(page.includes('href="https://findastra.github.io/astras-pet-os/apps/pet-programs/log-den-20261018.html"'), "another pet's page goes to the public site");
    assert.match(at(OPENER).toString('utf8'), new RegExp(`url=${HUB_DIR}/apps/pet-programs/evidence-locker-20261018\\.html`));
    // The Markdown pet shows the picture in the pack.
    assert.match(at(`${HUB_DIR}/markdown-pets/evidence-locker-20261019.md`).toString('utf8'), /!\[Forensic Ferret\]\(\.\.\/art\/frames\/forensic-ferret\/idle-20261019\.png\)/);
    // The README says plainly what works alone and what needs a farm.
    const readme = at('README.md').toString('utf8');
    for (const want of ['## What works on its own', '## What needs a farm', '**Log Lynx** (`log-den`, required)', '**Its desktop pet** (optional)', 'Windows 10 or 11',
      'never committed to Forensic Ferret\'s repo', `tag \`v0.1.0\`, commit \`${repoFiles.commit.slice(0, 7)}\``, '*By Astra.']) assert.ok(readme.includes(want), `README: ${want}`);
    // The manifest: every file with its SHA-256, the version and commit, and the needs as pets.json writes them.
    const m = JSON.parse(at(MANIFEST).toString('utf8'));
    assert.equal(m.tool, TOOL_LABEL);
    assert.equal(m.source.commit, repoFiles.commit);
    assert.equal(m.source.version, '0.1.2-20261019');
    assert.equal(m.source.url, 'https://github.com/findastra/evidence-locker');
    assert.equal(m.pictures_from.commit, 'abc1234def');
    assert.deepEqual(m.needs.pets.map((i) => [i.repo, i.how]), [['log-den', 'required'], ['packet-river', 'optional']]);
    assert.equal(m.files.length, names.length - 1);
    for (const f of m.files) assert.equal(createHash('sha256').update(at(f.path)).digest('hex'), f.sha256, f.path);
  } finally { repo.done(); }
});

test('a pack stops on a key or a personal folder path in the pet\'s files, and only notes a local network address', () => {
  const key = ['sk', 'ant', 'a'.repeat(30)].join('-');
  const leaky = fakeRepo({ ...PET_FILES, 'notes.md': `token ${key}\n` });
  try {
    assert.throws(() => buildPack(src, 'evidence-locker', { repoFiles: repoAt(leaky.gitDir), root }), /Not packed: .*OpenAI or Anthropic API key in notes\.md/);
  } finally { leaky.done(); }
  const lan = fakeRepo({ ...PET_FILES, 'setup.md': 'The router is at 192.168.1.1.\n' });
  try {
    const pack = buildPack(src, 'evidence-locker', { repoFiles: repoAt(lan.gitDir), root });
    assert.deepEqual(pack.manifest.scan_notes.map((n) => [n.kind, n.file]), [['local network address', 'setup.md']]);
  } finally { lan.done(); }
});

test('on another farm a pack links each pet on its own account (ownerOf), and the tool never writes an account', () => {
  const repo = fakeRepo(PET_FILES);
  try {
    const repoFiles = repoAt(repo.gitDir);
    const devs = copy(registry);
    devs.github_owner = 'XxdevilishxX';
    const mine = buildPack({ ...src, registry: devs }, 'evidence-locker', { repoFiles, root });
    assert.equal(mine.manifest.source.url, 'https://github.com/XxdevilishxX/evidence-locker');
    devs.pets.find((p) => p.repo === 'evidence-locker').github_owner = 'findastra';
    const astras = buildPack({ ...src, registry: devs }, 'evidence-locker', { repoFiles, root });
    assert.equal(astras.manifest.source.url, 'https://github.com/findastra/evidence-locker');
  } finally { repo.done(); }
  assert.ok(!/findastra/i.test(read('scripts/pet-packs-20261020.mjs')), 'pet-packs asks scripts/farm-owner-20261020.mjs; it never names an account');
});

test('packs are never committed, the tool is on the map, and plan runs from the command line', () => {
  assert.ok(read('.gitignore').split(/\r?\n/).includes('pet-packs/'), '.gitignore keeps pet-packs/ out of the repo');
  const node = extra.nodes.find((n) => n.id === 'pet-packs');
  assert.equal(node?.type, 'tool');
  assert.equal(node.of, 'farm');
  assert.equal(node.label, TOOL_LABEL);
  const out = execFileSync(process.execPath, [TOOL, 'plan', 'evidence-locker', 'claude-bot'], { encoding: 'utf8' });
  assert.match(out, /evidence-locker: can be packed\. Needs: Log Lynx \(log-den\)/);
  assert.match(out, /claude-bot: not packed: Claude Bot stays private/);
});
