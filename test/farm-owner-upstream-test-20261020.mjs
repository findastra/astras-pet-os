// Upstream and farm owner (Astra, 2026-10-20: "All recommended", Part 3 of docs/farm-owner-and-single-pets-20261019.md,
// card 058). upstream() is Astra's PetOS itself, farmOwner() whose pets these are, and every farm-facing script asks
// them instead of writing findastra. On Astra's farm every generated file is exactly what it was; on a fixture farm for
// Dev (XxdevilishxX), made with make-it-yours, her own pets link to her account and Astra's examples keep hers.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-20; the pet program page script and its chat's message, 2026-10-21.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GITHUB_OWNER } from '../scripts/animal-guard-20261013.mjs';
import { farmOwner, ownerOf, repoOf, repoUrl, upstream } from '../scripts/farm-owner-20261020.mjs';
import { makeItYours, report } from '../scripts/make-it-yours-20261020.mjs';
import { applyTable, buildTable, INSTALLER_URL } from '../scripts/lib.mjs';
import { buildRoster } from '../scripts/roster.mjs';
import { MOODS } from '../scripts/sheet-to-sprites.mjs';
import { buildPetProgramsPage } from '../scripts/pet-programs-20261014.mjs';
import { readSpawnerSources, spawnerFiles, spawnerPages, pagePath } from '../scripts/pet-program-pages-20261018.mjs';
import { markdownPetFiles, petPath } from '../scripts/markdown-pets-20261019.mjs';
import { draftList, LIST } from '../scripts/prepare-desktop-drafts-20261011.mjs';
import { buildBoard } from '../scripts/pets-board-20261018.mjs';
import { findPets } from '../scripts/pet-finder-20261016.mjs';
import { runRound } from '../scripts/farmer-rounds-20261009.mjs';
import { farmPets } from '../scripts/farm-setup-20261019.mjs';
import { petOf, wrongPlace } from '../scripts/click-check-20261019.mjs';

const root = fileURLToPath(new URL('..', import.meta.url)).replace(/[\\/]$/, '');
const read = (p) => readFileSync(join(root, p), 'utf8').replace(/\r\n/g, '\n');
const json = (p) => JSON.parse(read(p));
const astra = json('pets.json');
const catalog = json('pet-programs.json');
const DEV = 'XxdevilishxX';

// Dev's farm as make-it-yours leaves it, plus one pet of her own and one repo the round found on her account.
function devFarm() {
  const { registry } = makeItYours(astra, DEV);
  // Dev's copy of the hub and two of Astra's examples are public in the fixture, so their links show: this checks
  // accounts, not visibility (most of Astra's repos, the hub too, went private on 2026-10-20).
  // New entries, never changed in place: they are shared with Astra's own registry, which later tests read.
  const open = (p) => (['astras-pet-os', 'meme-fiend', 'file-master'].includes(p.repo) ? { ...p, visibility: 'public' } : p);
  registry.pets = registry.pets.map(open);
  registry.pipeline = registry.pipeline.map(open);
  registry.pets.push({ repo: 'dev-diary', pet: 'Fixture Ferret', role: 'pet', art: 'dev-diary', kind: 'ferret', status: 'hatching',
    published: true, visibility: 'public', job: 'A fixture pet on Dev\'s own account.', added: '2026-10-20',
    interface_url: 'apps/pet-programs/dev-diary-20261018.html', audit: { cadence: 'weekly', subject: 'my repo', needs: 'your OK' } });
  registry.candidates.push({ name: 'Fixture Newt', repo: 'fixture-newt', why: 'Found on Dev\'s account by the round.' });
  const programs = [...catalog.programs, { number: 999, icon: 'Fixture Ferret', program: 'Fixture Den', repo: 'dev-diary', stage: 'registered',
    assigned: true, mini_descriptor: { text: 'A fixture pet on Dev\'s own account.' } }];
  return { registry, programs };
}

test('upstream() is Astra\'s PetOS itself, the same account the guard falls back to', () => {
  const u = upstream();
  assert.deepEqual([u.owner, u.hub, u.repo], ['findastra', 'astras-pet-os', 'findastra/astras-pet-os']);
  assert.equal(u.owner, GITHUB_OWNER);
  assert.equal(INSTALLER_URL, u.installer);
  assert.equal(u.installer, 'https://github.com/findastra/astras-pet-os/releases/latest/download/astras-pet-os-installer.zip');
  assert.deepEqual([u.pages, u.raw, u.blob], ['https://findastra.github.io/astras-pet-os', 'https://raw.githubusercontent.com/findastra/astras-pet-os/main', 'https://github.com/findastra/astras-pet-os/blob/main']);
});

test('ownerOf: on Astra\'s farm everything is hers; on Dev\'s, her pets are hers and Astra\'s examples stay Astra\'s', () => {
  for (const r of [...astra.pets, ...astra.pipeline, ...astra.candidates].map((p) => p.repo)) assert.equal(ownerOf(astra, r), 'findastra', r);
  for (const p of catalog.programs.filter((x) => x.repo)) assert.equal(ownerOf(astra, p.repo), 'findastra', p.repo);
  const { registry: dev } = devFarm();
  assert.equal(farmOwner(dev), DEV);
  assert.equal(ownerOf(dev, 'dev-diary'), DEV, 'her own pet');
  assert.equal(ownerOf(dev, 'astras-pet-os'), DEV, 'the Friendly Farmer is her copy of the hub');
  assert.equal(ownerOf(dev, 'fixture-newt'), DEV, 'a candidate the round found is on the farm owner\'s account');
  assert.equal(ownerOf(dev, 'meme-fiend'), 'findastra', 'an example pet');
  assert.equal(ownerOf(dev, 'piranesi-house'), 'findastra', 'one of Astra\'s candidates');
  assert.equal(ownerOf(dev, 'pole-puff'), 'findastra', 'a repo her pets.json does not list is Astra\'s PetOS\'s own');
  assert.equal(repoOf(dev, 'meme-fiend'), 'findastra/meme-fiend');
  assert.equal(repoUrl(dev, 'dev-diary'), `https://github.com/${DEV}/dev-diary`);
  assert.throws(() => ownerOf({ ...dev, candidates: [{ repo: 'x', github_owner: 'a b' }] }, 'x'), /not a GitHub account name/);
});

// The scripts that act for a farm. Lines that are comments may explain the old word; code may not write the account.
const FARM_FACING = ['farmer-rounds-20261009', 'pet-finder-20261016', 'pets-board-20261018', 'pet-program-pages-20261018',
  'build-interfaces-20261008', 'farm-setup-20261019', 'prepare-desktop-drafts-20261011', 'publish-pet-tags-20261009', 'lib',
  'roster', 'check-pets-20261018', 'pet-programs-20261014', 'markdown-pets-20261019', 'click-check-20261019', 'make-it-yours-20261020',
  'farm-lock-20261021', 'farm-pets-20261021', 'farm-pets-packs-20261022'];
// Names of Astra's own things, not an account: Discord Damsel's repo, Paper Girl's live site (her own companions),
// PET-PROGRAMS.md's words about Astra's profile and her VR TikTok under "By Astra" on every pet program page.
const NOT_AN_ACCOUNT = ['findastra-discord-presence', 'https://findastra.github.io/paper-girl/', 'the findastra profile',
  "['VR TikTok: @findastra', 'https://www.tiktok.com/@findastra'"];
const code = (text) => text.split('\n').filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l)).map((l) => NOT_AN_ACCOUNT.reduce((s, n) => s.split(n).join(''), l));

test('no farm-facing script writes Astra\'s account: each asks upstream() or the farm owner', () => {
  for (const name of FARM_FACING) {
    const hits = code(read(`scripts/${name}.mjs`)).filter((l) => /findastra/i.test(l));
    assert.deepEqual(hits, [], `scripts/${name}.mjs still writes findastra`);
  }
  const installer = read('installer/install-astras-pet-os-20261014.ps1').split('\n').filter((l) => /Get-Field \$d 'interface'/.test(l));
  assert.equal(installer.length, 1);
  assert.doesNotMatch(installer[0], /findastra/, 'the installer\'s farm list reads a draft\'s repo on any account');
  // The round's workflow passes no account: the round reads it from pets.json (its comment still says findastra).
  assert.deepEqual(code(read('.github/workflows/farmer-daily-rounds.yml').replace(/^\s*#.*$/gm, '// $&')).filter((l) => /findastra/i.test(l)), []);
});

test('Astra-only tools keep findastra on purpose and say so', () => {
  for (const name of ['farmer-profile-20261009', 'idle-flash-audit-20261017', 'idle-flash-cards-20261017', 'idle-flash-fix-20261017',
    'idle-flash-new-repos-20261017', 'idle-flash-refresh-20261018', 'one-art-source-20261017', 'pet-program-link-20261018', 'relations-20261009']) {
    assert.match(read(`scripts/${name}.mjs`), /Astra-only on purpose \(card 058, Part 3, 2026-10-20\)/, name);
  }
});

test('on Astra\'s farm every generated file is exactly what it was (npm run build changes nothing)', () => {
  const readme = read('README.md');
  assert.equal(applyTable(readme, astra), readme, 'README pet table');
  const index = json('art/frames/index.json');
  const names = Object.fromEntries([...astra.pets.map((p) => [p.art, p.pet]), ...(astra.mascots || []).map((m) => [m.art, m.name])]);
  const frames = Object.fromEntries(Object.entries(index.pets).map(([id, p]) => [id, p.frames]));
  assert.equal(buildRoster(astra, MOODS, names, frames), read('ROSTER.md'), 'ROSTER.md');
  assert.equal(buildPetProgramsPage(catalog, { registry: astra }), read('PET-PROGRAMS.md'), 'PET-PROGRAMS.md');
  const src = readSpawnerSources(root);
  for (const [path, html] of Object.entries(spawnerFiles(src))) assert.equal(read(path), html, path);
  for (const [path, md] of Object.entries(markdownPetFiles(src))) assert.equal(read(path), md, path);
  assert.deepEqual(draftList(), json(LIST), LIST);
});

test('a fixture farm for XxdevilishxX: her pets link to her account, Astra\'s examples to hers, and the pictures and docs stay upstream', () => {
  const { registry: dev, programs } = devFarm();
  const src = { ...readSpawnerSources(root), registry: dev, programs };
  const files = spawnerFiles(src);
  const own = files[pagePath('dev-diary')], example = files[pagePath('meme-fiend')], host = files[pagePath('astras-pet-os')];
  assert.match(own, new RegExp(`<a href="https://github.com/${DEV}/dev-diary">${DEV}/dev-diary</a>`), 'Source and Pedigree');
  assert.doesNotMatch(own, />Repo<\/a>/, 'no Repo button since 2026-10-21: the footer and the Pet ID link the repo');
  assert.doesNotMatch(own, /github\.com\/findastra\/dev-diary/);
  assert.match(example, /<a href="https:\/\/github\.com\/findastra\/meme-fiend">findastra\/meme-fiend<\/a>/);
  assert.doesNotMatch(example, new RegExp(`${DEV}/meme-fiend`));
  assert.match(host, new RegExp(`<a href="https://github.com/${DEV}/astras-pet-os">${DEV}/astras-pet-os</a>`), 'her copy of the hub');
  // The footer's list of docs is gone (Astra crossed it out, 2026-10-22); no page points at docs in her copy of the hub.
  for (const page of [own, example]) assert.doesNotMatch(page, new RegExp(`${DEV}/astras-pet-os/blob`));
  const md = markdownPetFiles(src);
  assert.match(md[petPath('dev-diary')], new RegExp(`Its code:\\*\\* https://github.com/${DEV}/dev-diary`));
  assert.match(md[petPath('meme-fiend')], /Its code:\*\* https:\/\/github\.com\/findastra\/meme-fiend/);
  assert.match(md[petPath('meme-fiend')], /https:\/\/raw\.githubusercontent\.com\/findastra\/astras-pet-os\/main\/(desktop-)?art\//, 'pictures from the one art source');

  const table = buildTable(dev);
  assert.match(table, new RegExp(`\\*\\*\\[Fixture Ferret\\]\\(https://github.com/${DEV}/dev-diary\\)\\*\\*`));
  assert.match(table, /\[Download ZIP\]\(https:\/\/github\.com\/findastra\/file-master\/archive\/refs\/heads\/main\.zip\)/, 'a registered example');
  assert.match(table, new RegExp(`\\[Installer\\]\\(${INSTALLER_URL.replace(/[./]/g, '\\$&')}\\)`), 'the installer is upstream\'s');
  const roster = buildRoster(dev, MOODS, {}, {});
  assert.ok(roster.includes(`[dev-diary](https://github.com/${DEV}/dev-diary)`) && roster.includes('[file-master](https://github.com/findastra/file-master)'));
  const list = buildPetProgramsPage({ programs }, { registry: dev });
  assert.ok(list.includes(`[dev-diary](https://github.com/${DEV}/dev-diary)`) && list.includes('[meme-fiend](https://github.com/findastra/meme-fiend)'));

  const board = buildBoard({ programs, registry: dev, status: null, repos: {}, sites: {}, now: 'now', iconFor: () => null });
  assert.ok(board.includes(`[Fixture Ferret](https://github.com/${DEV}/dev-diary)`) && board.includes('(https://github.com/findastra/meme-fiend)'));
});

// The page script is the same file on every farm, so it may not write an account: the chat's message takes the pet's
// repo from the page's own config, which the spawner writes from ownerOf.
const configOf = (html) => JSON.parse(html.split('<script type="application/json" id="pet-program-data">')[1].split('</script>')[0]);

test('the pet program page script names no account; each page\'s config carries its pet\'s own repo for the chat', () => {
  const hits = code(read('apps/pet-programs/pet-program-page-20261018.js')).filter((l) => /findastra|github\.com\/|github\.io/i.test(l));
  assert.deepEqual(hits, [], 'apps/pet-programs/pet-program-page-20261018.js writes a GitHub account or site');
  const { registry: dev, programs } = devFarm();
  for (const farm of [{}, { registry: dev, programs }]) {
    const src = { ...readSpawnerSources(root), ...farm };
    const files = spawnerFiles(src), pages = spawnerPages(src);
    assert.ok(pages.some((d) => !d.publicRepo), 'a private pet is among them');
    for (const d of pages) {
      assert.equal(configOf(files[pagePath(d.repo)]).repoUrl, d.publicRepo ? repoUrl(src.registry, d.repo) : null, `${farmOwner(src.registry)}: ${d.repo}`);
    }
    if (farm.registry) {
      assert.equal(configOf(files[pagePath('dev-diary')]).repoUrl, `https://github.com/${DEV}/dev-diary`, 'her own pet');
      assert.equal(configOf(files[pagePath('astras-pet-os')]).repoUrl, `https://github.com/${DEV}/astras-pet-os`, 'her copy of the hub');
      assert.equal(configOf(files[pagePath('meme-fiend')]).repoUrl, 'https://github.com/findastra/meme-fiend', 'an example stays Astra\'s');
    }
  }
});

test('a fixture farm: the round finds new pets only on Dev\'s account and reads Astra\'s examples from Astra\'s', async () => {
  const { registry: dev } = devFarm();
  const asked = [], read = [];
  const repo = (name) => ({ name, private: false, fork: false, archived: false, topics: ['pet-app'], description: '' });
  const github = {
    listRepos: async (token, ownerToken, owner) => { asked.push(owner); return owner === DEV ? [repo('dev-diary'), repo('dev-new-pet'), repo('astras-pet-os')] : [repo('meme-fiend'), repo('astra-not-on-devs-farm')]; },
    snapshot: async (r) => { read.push(`${r.owner}/${r.name}`); return { readable: true, files: ['pet.json'], petJson: { pet: 'X', job: 'Y' } }; },
  };
  const result = await runRound({ registry: dev, status: {}, github, token: null, ownerToken: null, now: new Date('2026-10-20T13:00:00Z'), log: () => {}, only: [] });
  assert.deepEqual(asked, [DEV, 'findastra'], 'the farm owner\'s account, then Astra\'s for the examples');
  assert.deepEqual(result.discovered, ['dev-new-pet'], 'only Dev\'s own repos can be new pets for her farm');
  assert.ok(read.includes(`${DEV}/dev-diary`) && read.includes('findastra/meme-fiend'));
  assert.ok(!result.missing.includes('dev-diary') && !result.missing.includes('meme-fiend'));
  assert.ok(result.missing.includes('file-master'), 'an example Astra\'s account does not list is missing, not looked for on Dev\'s');
});

test('a fixture farm: pet-finder, the installer\'s farm list and click-check follow each pet\'s account', () => {
  const { registry: dev, programs } = devFarm();
  const found = findPets({ programs, registry: dev, repos: [
    { owner: DEV, name: 'dev-diary', petJson: { pet: 'Fixture Ferret', number: 999 } }, { owner: DEV, name: DEV },
    { owner: DEV, name: 'dev-sketchbook', petJson: { pet: 'Sketchy' } },
    { owner: 'findastra', name: 'meme-fiend', petJson: { pet: 'Meme Fiend' } }, { owner: 'findastra', name: 'astra-only-thing', petJson: { pet: 'Not Dev\'s' } },
  ] });
  const of = (kind) => found.filter((f) => f.kind === kind).map((f) => f.repo);
  assert.deepEqual(of('not-listed'), ['dev-sketchbook'], 'only Dev\'s own repos are hers to list; her profile repo is not a pet');
  assert.ok(!of('no-repo').includes('dev-diary') && !of('no-repo').includes('meme-fiend'));
  assert.ok(of('no-repo').includes('file-master'), 'looked for on Astra\'s account, where the fixture has no repo');

  const dir = mkdtempSync(join(tmpdir(), 'farm-'));
  try {
    mkdirSync(join(dir, 'desktop-art'));
    writeFileSync(join(dir, 'pets.json'), JSON.stringify({ pets: [{ repo: 'astras-pet-os', art: 'farmer', pet: 'Friendly Farmer', role: 'host' }], pipeline: [{ repo: 'dev-thing', job: 'Its job.' }] }));
    writeFileSync(join(dir, 'desktop-art/desktop-drafts-20261018.json'), JSON.stringify({ pets: [{ id: 'dev-thing', name: 'Dev Thing', interface: `https://github.com/${DEV}/dev-thing` }, { id: 'door-dormouse', name: 'Door Dormouse', interface: 'https://github.com/findastra/the-threshold' }] }));
    const pets = farmPets(dir);
    assert.deepEqual(pets.filter((p) => p.draft).map((p) => [p.repo, p.job]), [['dev-thing', 'Its job.'], ['the-threshold', '']]);
  } finally { rmSync(dir, { recursive: true, force: true }); }

  const d = { repo: 'dev-diary', owner: DEV, mapNode: 'dev-diary', appHref: null };
  const pageRel = pagePath('dev-diary');
  const exp = { byPage: new Map([[pageRel, d]]), names: [{ name: 'Fixture Ferret', repo: 'dev-diary' }], owners: new Set([DEV.toLowerCase(), 'findastra']) };
  const web = (url) => ({ url, kind: 'web', rel: null, hash: '', same: false });
  assert.equal(wrongPlace({ pageRel, label: 'Repo', dest: web(`https://github.com/${DEV}/dev-diary`) }, exp), null);
  assert.match(wrongPlace({ pageRel, label: 'Repo', dest: web(`https://github.com/${DEV}/dev-sketchbook`) }, exp), new RegExp(`opens ${DEV}/dev-sketchbook, but this pet's repo is ${DEV}/dev-diary`));
  assert.equal(petOf(web(`https://github.com/${DEV}/dev-diary`), exp.owners), 'dev-diary');
  assert.equal(petOf(web(`https://github.com/${DEV}/dev-diary`)), null, 'without the farm\'s accounts, only Astra\'s repos are pets');
});

test('make-it-yours: the farm becomes yours, Astra\'s pets stay hers, and running it again changes nothing', () => {
  const before = JSON.stringify(astra);
  const r = makeItYours(astra, DEV);
  assert.equal(JSON.stringify(astra), before, 'the registry it is given is never changed');
  assert.equal(r.registry.github_owner, DEV);
  assert.equal(r.was, 'findastra');
  const host = r.registry.pets.find((p) => p.role === 'host');
  assert.ok(!('github_owner' in host), 'the Friendly Farmer (her copy of the hub) is hers');
  for (const p of [...r.registry.pets, ...r.registry.pipeline, ...r.registry.candidates].filter((x) => x.role !== 'host')) {
    assert.equal(p.github_owner, 'findastra', p.repo);
    assert.equal(Object.keys(p)[Object.keys(p).indexOf('repo') + 1], 'github_owner', `${p.repo}: written next to its repo`);
  }
  assert.equal(r.kept.length, astra.pets.length - 1 + astra.pipeline.length + astra.candidates.length);
  assert.deepEqual(Object.keys(r.registry), Object.keys(astra), 'the file keeps its order');
  assert.equal(makeItYours(r.registry, DEV).changed, false);
  assert.equal(makeItYours(astra, 'findastra').changed, false, 'on Astra\'s own farm there is nothing to change');
  assert.equal(makeItYours(astra, '@XxdevilishxX ').owner, DEV, 'a pasted @ or space is fine');

  // A second name (a typo, a renamed account): the farm and her own pets move, Astra's examples stay Astra's.
  const own = { ...r.registry, pets: [...r.registry.pets, { repo: 'dev-diary' }] };
  const moved = makeItYours(own, 'Xxdevilish2');
  assert.equal(moved.registry.github_owner, 'Xxdevilish2');
  assert.deepEqual(moved.kept, []);
  assert.equal(ownerOf(moved.registry, 'dev-diary'), 'Xxdevilish2');
  assert.equal(ownerOf(moved.registry, 'meme-fiend'), 'findastra');

  assert.throws(() => makeItYours(r.registry, 'findastra'), /findastra is Astra's own account/);
  for (const bad of ['', 'find astra', '-dev', 'a/b', undefined]) assert.throws(() => makeItYours(astra, bad), /not a GitHub account name/, String(bad));
  const older = { ...astra }; delete older.github_owner;
  assert.equal(Object.keys(makeItYours(older, DEV).registry).indexOf('github_owner'), Object.keys(older).indexOf('owner') + 1, 'an older copy gets the field after owner');

  assert.match(report(r, { dryRun: true, host: 'astras-pet-os' }).join('\n'), /This would make the farm XxdevilishxX's[\s\S]*meme-fiend[\s\S]*Nothing was changed/);
  assert.match(report({ ...r, changed: false }).join('\n'), /already XxdevilishxX's/);
});

test('make-it-yours from the command line: --dry-run changes nothing, then it writes pets.json in the file\'s own layout', () => {
  const dir = mkdtempSync(join(tmpdir(), 'mine-'));
  try {
    const file = join(dir, 'pets.json');
    const raw = read('pets.json');
    writeFileSync(file, raw);
    const run = (...a) => execFileSync(process.execPath, [join(root, 'scripts/make-it-yours-20261020.mjs'), ...a, '--registry', file], { encoding: 'utf8' });
    assert.match(run(DEV, '--dry-run'), /would make the farm XxdevilishxX's/);
    assert.equal(readFileSync(file, 'utf8'), raw, 'a dry run writes nothing');
    assert.match(run(DEV), /This farm is now XxdevilishxX's[\s\S]*Next: save this as a commit/);
    assert.equal(readFileSync(file, 'utf8'), `${JSON.stringify(makeItYours(astra, DEV).registry, null, 2)}\n`);
    assert.match(run(DEV), /already XxdevilishxX's/);
    assert.throws(() => execFileSync(process.execPath, [join(root, 'scripts/make-it-yours-20261020.mjs')], { stdio: 'pipe' }), /Say your GitHub name/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
