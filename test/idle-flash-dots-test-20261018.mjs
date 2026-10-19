// Idle Flash Audit tools follow the Flash Audit's grey and blue dots (Astra, 2026-10-18), and check A59: every pet
// linked to its one pet program. Claude Opus 5.5 (claude-opus-5-5), 2026-10-18.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parseMatrix, readMatrix, rowDot, decisionDot, GREY, BLUE } from '../scripts/flash-matrix-20261018.mjs';
import { a59ForPet, a59ForCatalog, parseProfileHomes, expectedProfileHome, programHome, applyA59Repo, applyA59Hub, setRegistryField, addReadmeLink, PAGES, pagesOf } from '../scripts/pet-program-link-20261018.mjs';
import { syncProfile } from '../scripts/farmer-profile-20261009.mjs';

const HUB_DIR = fileURLToPath(new URL('..', import.meta.url));
const read = (f) => readFileSync(join(HUB_DIR, f), 'utf8');
const scratch = () => mkdtempSync(join(tmpdir(), 'idle-flash-dots-'));

test('the matrix gives every check once, in priority order, each with a grey or blue dot', () => {
  const m = readMatrix();
  const ids = Array.from({ length: 59 }, (_, i) => `A${String(i + 1).padStart(2, '0')}`);
  assert.deepEqual([...m.order].sort(), ids, 'A01 to A59, each once');
  for (const id of ids) assert.ok([GREY, BLUE].includes(m.dot[id]), `${id} has a dot`);
  assert.equal(m.order[0], 'A59', 'A59 is first in tier 1');
  assert.deepEqual(m.order.slice(m.order.indexOf('A03'), m.order.indexOf('A03') + 2), ['A03', 'A58'], 'A58 sits after A03');
  assert.deepEqual(m.order.slice(m.order.indexOf('A05'), m.order.indexOf('A05') + 2), ['A05', 'A49'], 'A49 sits after A05');
  assert.equal(m.dot.A59, GREY);
  assert.equal(m.dot.A06, GREY);
  assert.equal(m.dot.A07, BLUE);
  assert.equal(m.dot.A19, GREY);
  assert.equal(m.title.A59, 'Pet program and its link');
});

test('a row with no dot, or a check listed twice, stops the tools instead of guessing', () => {
  const md = (rows) => `# x\n\n## 3. Complete audit matrix\n\n| ID | Check | Evidence |\n|---|---|---|\n${rows.join('\n')}\n\n## 4. Next\n| ⚪ A99 | not in section 3 | x |\n`;
  assert.deepEqual(parseMatrix(md(['| ⚪ A06 | Pet name | x |', '| 🔵 A07 | Program name | x |'])).map((r) => `${r.dot} ${r.id}`), ['⚪ A06', '🔵 A07']);
  assert.throws(() => parseMatrix(md(['| A06 | Pet name | x |'])), /A06 has no grey/);
  assert.throws(() => parseMatrix(md(['| ⚪ A06 | Pet name | x |', '| 🔵 A06 | Pet name | x |'])), /listed twice/);
});

test('a finding takes its row\'s dot unless it is that row\'s sentence of the other dot; decisions are blue', () => {
  const m = readMatrix();
  assert.equal(rowDot({ check: 'A06' }, m), GREY);
  assert.equal(rowDot({ check: 'A06', dot: BLUE }, m), BLUE, 'A06: a placeholder name is Astra\'s');
  assert.equal(rowDot({ check: 'A99' }, m), BLUE, 'an unknown check waits for Astra');
  for (const kind of ['Pet name', 'Program name', 'Job', 'Branches', 'Visibility', 'Art', 'Route', 'Pet program']) assert.equal(decisionDot(kind, m), BLUE, kind);
});

test('the tools read the order and the dots from the matrix, never from a list of their own', () => {
  for (const f of ['scripts/idle-flash-cards-20261017.mjs', 'scripts/idle-flash-answers-page-20261017.mjs']) {
    const src = read(f);
    assert.match(src, /readMatrix\(\)/, `${f} reads the matrix`);
    assert.doesNotMatch(src, /\bORDER\s*=\s*\[/, `${f} keeps no order of its own`);
    for (const list of src.match(/\[[^\]]*\]/g) || []) assert.ok((list.match(/'A\d\d'/g) || []).length < 20, `${f} keeps no list of every check: ${list.slice(0, 60)}`);
  }
});

// ---- A59

const prog = (over = {}) => ({ number: 22, icon: 'RGBee', program: 'Light Hive', assigned: true, stage: 'pipeline', repo: 'rgbee', ...over });
const repo = { exists: true, private: false, name: 'rgbee' };

test('A59: a pet whose links all agree has no finding', () => {
  const reg = { repo: 'paper-girl', pet: 'Paper Patty', interface_local_url: 'apps/paper-girl-20261008.html', interface_url: 'https://findastra.github.io/paper-girl/', interface_live_url: 'https://findastra.github.io/paper-girl/' };
  const p = prog({ number: 11, icon: 'Paper Patty', program: 'Paper Girl', stage: 'registered', repo: 'paper-girl' });
  const rows = a59ForPet({ prog: p, reg, repo: { exists: true, private: false, name: 'paper-girl' }, pet: { entry: 'paper-girl-20261008.html' },
    tree: ['paper-girl-20261008.html', 'README.md'], hubTree: ['apps/paper-girl-20261008.html'], readme: 'See [Paper Girl](https://findastra.github.io/paper-girl/).',
    profile: new Map([[11, { href: 'https://findastra.github.io/paper-girl/', name: 'paper-girl' }]]),
    map: { node: 'paper-girl', home: { number: 11 }, programNodes: ['paper-girl-site'], linked: true, private: false }, entryLive: true });
  assert.deepEqual(rows, []);
});

test('A59: a missing or broken entry is pointed at the program page in the repo (an idle fix)', () => {
  const rows = a59ForPet({ prog: prog(), repo, pet: { pet: 'RGBee' }, tree: ['rgbee-20261009.html', 'README.md'] });
  assert.equal(rows.length, 1);
  assert.equal(rows[0].status, 'Missing');
  assert.deepEqual(rows[0].fix, { type: 'a59-entry', where: 'repo', id: 'entry', to: 'rgbee-20261009.html' });
  const broken = a59ForPet({ prog: prog(), repo, pet: { entry: 'gone.html' }, tree: ['rgbee-20261009.html'] });
  assert.equal(broken[0].status, 'Incorrect');
  assert.equal(broken[0].fix.to, 'rgbee-20261009.html');
  assert.deepEqual(a59ForPet({ prog: prog(), repo, pet: { entry: 'gone.html' }, tree: ['a.html', 'b.html'] }), [], 'two pages: no guess (A09 reports the page)');
});

test('A59: an entry that opens another page than the hub shows is reported, and changed only when the right page is there', () => {
  const p = prog({ number: 19, icon: 'Voicemeeter Bug', program: 'Audio Rescue', stage: 'registered', repo: 'voicemeeter-bug' });
  const reg = { repo: 'voicemeeter-bug', interface_url: 'apps/voicemeeter-bug-20261008.html', interface_local_url: 'apps/voicemeeter-bug-20261008.html' };
  const args = { prog: p, reg, repo: { exists: true, private: false, name: 'voicemeeter-bug' }, pet: { entry: 'build-voicemeeter-bug-20261008.ps1' }, hubTree: ['apps/voicemeeter-bug-20261008.html'] };
  const kept = a59ForPet({ ...args, tree: ['build-voicemeeter-bug-20261008.ps1'] }).filter((r) => /entry/.test(r.detail));
  assert.equal(kept.length, 1);
  assert.equal(kept[0].fix, undefined, 'the hub page is not in the repo: not changed');
  const fixed = a59ForPet({ ...args, tree: ['build-voicemeeter-bug-20261008.ps1', 'voicemeeter-bug-20261008.html'] }).find((r) => /entry/.test(r.detail));
  assert.equal(fixed.fix.to, 'voicemeeter-bug-20261008.html');
});

test('A59: a pipeline pet whose program answers on its own site gets interface_url in pets.json', () => {
  const rows = a59ForPet({ prog: prog(), reg: { repo: 'rgbee', pet: 'RGBee' }, repo, pet: { entry: 'index.html' }, tree: ['index.html'], entryLive: true });
  const r = rows.find((x) => x.fix?.type === 'a59-registry');
  assert.ok(r, 'a pets.json fix');
  assert.deepEqual({ where: r.fix.where, key: r.fix.key, to: r.fix.to, also: r.fix.also }, { where: 'hub', key: 'interface_url', to: pagesOf('rgbee'), also: { interface_live_url: pagesOf('rgbee') } });
  assert.ok(!a59ForPet({ prog: prog(), reg: { repo: 'rgbee', pet: 'RGBee' }, repo, pet: { entry: 'index.html' }, tree: ['index.html'], entryLive: false }).some((x) => x.fix?.type === 'a59-registry'), 'no public page: nothing to link (A10)');
});

test('A59: The Farm\'s card and the profile must open the same program', () => {
  const p = prog({ number: 36, icon: 'Platform Platypus', program: 'Platform Pond', stage: 'registered', repo: 'platform-platypus' });
  const reg = { repo: 'platform-platypus', interface_url: 'apps/platform-platypus-20261017.html', interface_local_url: 'apps/platform-platypus-20261017.html', interface_live_url: 'https://findastra.github.io/platform-platypus/' };
  const rows = a59ForPet({ prog: p, reg, repo: { exists: true, private: false, name: 'platform-platypus' }, hubTree: ['apps/platform-platypus-20261017.html'] });
  const farm = rows.find((r) => /Farm's card/.test(r.detail));
  assert.ok(farm, 'two pages for one program');
  assert.deepEqual([farm.fix.key, farm.fix.to], ['interface_url', 'https://findastra.github.io/platform-platypus/']);
  const gone = a59ForPet({ prog: p, reg: { ...reg, interface_url: 'apps/gone-20261017.html', interface_live_url: undefined }, repo: { exists: true, private: false, name: 'platform-platypus' }, hubTree: ['apps/platform-platypus-20261017.html'] });
  assert.equal(gone.find((r) => /interface_url is apps\/gone/.test(r.detail)).fix.to, 'apps/platform-platypus-20261017.html');
});

test('A59: the profile line\'s home link is checked against the hub, never edited by hand', () => {
  const reg = { repo: 'rgbee', interface_url: 'https://findastra.github.io/rgbee/', interface_live_url: 'https://findastra.github.io/rgbee/' };
  const wrong = a59ForPet({ prog: prog(), reg, repo, profile: new Map([[22, { href: 'https://example.org/', name: 'light-hive' }]]) });
  assert.equal(wrong.length, 1);
  assert.match(wrong[0].detail, /profile's home link/);
  assert.equal(wrong[0].fix, undefined, 'the profile round rewrites it from the hub');
  assert.deepEqual(a59ForPet({ prog: prog(), reg, repo, profile: new Map([[22, { href: 'https://findastra.github.io/rgbee/', name: 'light-hive' }]]) }), []);
  assert.equal(a59ForPet({ prog: prog(), reg, repo, profile: new Map() }).length, 1, 'a public pet missing from the profile');
  assert.deepEqual(a59ForPet({ prog: prog(), reg, repo: { ...repo, private: true }, profile: new Map() }), [], 'a private repo may be out of the round\'s sight');
});

test('A59 agrees with the Farmer\'s profile round on every pet\'s home link', () => {
  const registry = JSON.parse(read('pets.json'));
  const { programs } = JSON.parse(read('pet-programs.json'));
  const priv = new Set([...registry.pets, ...registry.pipeline].filter((p) => p.visibility === 'private').map((p) => p.repo));
  const repos = [...new Set(programs.map((p) => p.repo).filter(Boolean))].map((name) => ({ name, private: priv.has(name), description: '' }));
  const readme = '<h2 align="center">Hi</h2>\n\n### Astra\'s PetOS\n\n1. **Friendly Farmer** -- organizes the pets\n';
  const homes = parseProfileHomes(syncProfile(readme, registry, repos, programs).text);
  const all = [...registry.pets, ...registry.pipeline];
  let compared = 0;
  for (const p of programs) {
    if (!homes.has(p.number)) continue;
    const reg = all.find((x) => x.repo === p.repo) || null;
    const want = expectedProfileHome(p, reg, registry.profile?.tools?.[p.repo] || null, { exists: true, private: priv.has(p.repo) });
    assert.equal(homes.get(p.number).href, want, `#${p.number} ${p.icon}`);
    compared++;
  }
  assert.ok(compared > 50, `compared ${compared} pets`);
  assert.equal(programHome({ interface_url: 'apps/x-20261008.html' }, null), `${PAGES}/apps/x-20261008.html`);
});

test('A59: the System Map draws a line from the pet to its one program', () => {
  const p = prog({ stage: 'registered' });
  const missing = a59ForPet({ prog: p, repo, map: { node: 'rgbee', home: { number: 22 }, programNodes: ['light-hive'], linked: false, private: false } });
  assert.deepEqual(missing.map((r) => [r.status, r.fix?.type, r.fix?.from, r.fix?.to]), [['Missing', 'a59-map-link', 'rgbee', 'light-hive']]);
  const other = a59ForPet({ prog: p, repo, map: { node: 'rgbee', home: { number: 30, name: 'Fuzz Factory' }, programNodes: [], linked: false, private: false } });
  assert.equal(rowDot(other[0], readMatrix()), BLUE, 'two programs on one pet is Astra\'s');
  assert.deepEqual(a59ForPet({ prog: p, repo, map: { node: 'rgbee', home: { number: 22 }, programNodes: [], linked: false, private: true } }), [], 'a private pet\'s program stays off the map');
  const unregistered = a59ForPet({ prog: prog({ number: 35, icon: 'Chat Rat', repo: 'chat-rat' }), repo: { ...repo, name: 'chat-rat' }, map: { node: null, home: null, programNodes: [], linked: false, private: false } });
  assert.equal(rowDot(unregistered[0], readMatrix()), BLUE, 'a pet missing from pets.json waits for Astra to register it');
});

test('A59: the README links to the program, added under the credit line', () => {
  const reg = { repo: 'rgbee', interface_url: 'https://findastra.github.io/rgbee/', interface_live_url: 'https://findastra.github.io/rgbee/' };
  const rows = a59ForPet({ prog: prog(), reg, repo, readme: '# RGBee\n\n*An Intelligent App, or Pet, by Astra.*\n\nLights.\n' });
  assert.deepEqual(rows.map((r) => [r.fix.type, r.fix.to, r.fix.label]), [['a59-readme', 'https://findastra.github.io/rgbee/', 'Light Hive']]);
  assert.deepEqual(a59ForPet({ prog: prog(), reg, repo, readme: '# RGBee\n\nOpen [Light Hive](https://findastra.github.io/rgbee)\n' }), []);
  assert.deepEqual(a59ForPet({ prog: prog({ stage: 'seed' }), repo, readme: '# Seed\n' }), [], 'nothing to link to yet (A09, planned)');
});

test('A59: a missing repo is reported for a registered or pipeline pet, not for a seed', () => {
  assert.equal(a59ForPet({ prog: prog(), repo: { exists: false } })[0].status, 'Missing');
  assert.deepEqual(a59ForPet({ prog: prog({ stage: 'seed' }), repo: { exists: false } }), []);
});

test('A59 for the whole list: a pet with no number gets the next one; two pets on one program wait for Astra', () => {
  const catalog = [{ number: 1, repo: 'astras-pet-os', icon: 'Friendly Farmer' }, { number: 2, repo: 'twin', icon: 'A' }, { number: 3, repo: 'twin', icon: 'B' }];
  const registry = { pets: [{ repo: 'astras-pet-os', pet: 'Friendly Farmer' }, { repo: 'new-one', pet: 'New One', job: 'Does a thing.' }], pipeline: [{ repo: 'newer', pet: 'Newer' }] };
  const rows = a59ForCatalog(catalog, registry);
  const twin = rows.find((r) => /two pets on one program/.test(r.detail));
  assert.equal(twin.dot, BLUE);
  const nums = rows.filter((r) => r.fix?.type === 'a59-number').map((r) => [r.fix.entry.repo, r.fix.entry.number, r.fix.entry.program, r.fix.entry.assigned]);
  assert.deepEqual(nums, [['new-one', 4, 'pet-program-4', false], ['newer', 5, 'pet-program-5', false]]);
  assert.deepEqual(a59ForCatalog(JSON.parse(read('pet-programs.json')).programs, JSON.parse(read('pets.json'))).filter((r) => r.fix), [], 'today every registered and pipeline pet has its number');
});

test('A59 repo fixes change pet.json\'s entry and the README only', () => {
  const dir = scratch();
  try {
    writeFileSync(join(dir, 'pet.json'), '{\n  "pet": "RGBee",\n  "entry": "gone.html",\n  "audit": { "cadence": "weekly" }\n}\n');
    writeFileSync(join(dir, 'rgbee-20261009.html'), '<title>Light Hive</title>');
    writeFileSync(join(dir, 'README.md'), '# RGBee\n\n*An Intelligent App, or Pet, by Astra.*\n\nLights.\n');
    const rows = [{ check: 'A59', fix: { type: 'a59-entry', where: 'repo', id: 'entry', to: 'rgbee-20261009.html' } },
      { check: 'A59', fix: { type: 'a59-readme', where: 'repo', id: 'readme', to: 'https://findastra.github.io/rgbee/', label: 'Light Hive' } },
      { check: 'A59', fix: { type: 'a59-registry', where: 'hub', id: 'registry:rgbee:interface_url' } }];
    const { applied } = applyA59Repo(dir, rows);
    assert.deepEqual(applied, ['entry', 'readme']);
    assert.equal(JSON.parse(readFileSync(join(dir, 'pet.json'), 'utf8')).entry, 'rgbee-20261009.html');
    assert.equal(readFileSync(join(dir, 'pet.json'), 'utf8'), '{\n  "pet": "RGBee",\n  "entry": "rgbee-20261009.html",\n  "audit": { "cadence": "weekly" }\n}\n', 'the rest of pet.json keeps its layout');
    assert.equal(readFileSync(join(dir, 'README.md'), 'utf8'), '# RGBee\n\n*An Intelligent App, or Pet, by Astra.*\n\n**Pet program:** [Light Hive](https://findastra.github.io/rgbee/)\n\nLights.\n');
    assert.deepEqual(applyA59Repo(dir, rows).applied, [], 'a second run changes nothing');
  } finally { rmSync(dir, { recursive: true, force: true }); }
  assert.equal(addReadmeLink('*An Intelligent App, or Pet, by Astra.*\r\n\r\n# Voicemeeter Bug\r\n\r\nA bug.\r\n', 'Audio Rescue', 'https://x.example/'),
    '*An Intelligent App, or Pet, by Astra.*\r\n\r\n# Voicemeeter Bug\r\n\r\n**Pet program:** [Audio Rescue](https://x.example/)\r\n\r\nA bug.\r\n', 'a credit above the title: the link goes under the title, line endings kept');
});

test('A59 hub fixes keep pets.json, pet-programs.json and system-map.json in their own layout', () => {
  // Derive the next number so enrolling a pet cannot invalidate this layout test.
  const nextNumber = Math.max(...JSON.parse(read('pet-programs.json')).programs.map(p => p.number)) + 1;
  const dir = scratch();
  try {
    for (const f of ['pets.json', 'pet-programs.json', 'system-map.json']) writeFileSync(join(dir, f), read(f));
    const fixes = [
      { type: 'a59-registry', where: 'hub', id: 'registry:rgbee:interface_url', repo: 'rgbee', key: 'interface_url', to: pagesOf('rgbee'), also: { interface_live_url: pagesOf('rgbee') } },
      { type: 'a59-number', where: 'hub', id: 'number:new-one', entry: { number: nextNumber, program: `pet-program-${nextNumber}`, assigned: false, icon: 'New One', idea: null, stage: 'pipeline', repo: 'new-one', repo_exists: true, mini_descriptor: { label: `pet-program-${nextNumber}-v1.0-mini-descriptor-v1.0`, text: 'Does a thing.', reviewed: false } } },
      { type: 'a59-map-link', where: 'hub', id: 'map:22', from: 'rgbee', to: 'program-22', why: 'Light Hive is RGBee\'s own program (pet-programs.json, #22).' },
    ];
    const { applied, log } = applyA59Hub(dir, fixes);
    assert.deepEqual(applied, fixes.map((f) => f.id), log.join('\n'));
    const diff = (f) => { const a = read(f).split('\n'), b = readFileSync(join(dir, f), 'utf8').split('\n'); return b.filter((l) => !a.includes(l)); };
    assert.deepEqual(diff('pets.json').map((l) => l.trim()), [`"interface_live_url": "${pagesOf('rgbee')}",`, `"interface_url": "${pagesOf('rgbee')}",`], 'pets.json: only the two new lines');
    const reg = JSON.parse(readFileSync(join(dir, 'pets.json'), 'utf8'));
    assert.equal(reg.pipeline.find((p) => p.repo === 'rgbee').interface_url, pagesOf('rgbee'));
    const progs = JSON.parse(readFileSync(join(dir, 'pet-programs.json'), 'utf8')).programs;
    assert.deepEqual(progs.at(-1), fixes[1].entry);
    assert.ok(JSON.parse(readFileSync(join(dir, 'system-map.json'), 'utf8')).links.some((l) => l.from === 'rgbee' && l.to === 'program-22' && l.carries === 'opens'));
    assert.ok(diff('system-map.json').length <= 8, 'system-map.json: only the new link');
    assert.deepEqual(applyA59Hub(dir, fixes).applied, [], 'a second run changes nothing');
    assert.throws(() => setRegistryField(read('pets.json'), 'no-such-pet', 'interface_url', 'x'), /no pets.json entry/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

// ---- The round cards and the answer sheet

test('round cards start every exception with its dot, say which pull request fixed it, and only blue items become questions', () => {
  const dir = scratch();
  try {
    const out = join(dir, 'docs', 'rounds');
    mkdirSync(out, { recursive: true });
    const hubPr = 'https://github.com/findastra/astras-pet-os/pull/99';
    const petPr = 'https://github.com/findastra/rgbee/pull/7';
    const ledger = [
      { number: 1, icon: 'Friendly Farmer', program: 'The Farm', assigned: true, stage: 'registered', repo: 'astras-pet-os', hub: true, audited: null, decisions: [], fixes: [],
        rows: [{ check: 'A59', status: 'Incorrect', dot: BLUE, detail: 'Pet programs #2 (A) and #3 (B) all name repo twin: two pets on one program.', next: 'Yours: which pet keeps this program?' }] },
      { number: 22, icon: 'RGBee', program: 'Light Hive', assigned: true, stage: 'pipeline', repo: 'rgbee', audited: { repo: 'rgbee', ref: 'main', commit: 'abcdef0' }, repoMeta: { private: false }, decisions: [], fixes: [], branches: [], openPRs: [],
        rows: [
          { check: 'A59', status: 'Missing', detail: 'pet.json has no entry; its program page is rgbee-20261009.html.', next: 'x', fix: { type: 'a59-entry', where: 'repo', id: 'entry', to: 'rgbee-20261009.html' } },
          { check: 'A59', status: 'Missing', detail: 'pets.json has no interface_url for RGBee.', next: 'x', fix: { type: 'a59-registry', where: 'hub', id: 'registry:rgbee:interface_url' } },
          { check: 'A06', status: 'Missing', dot: BLUE, detail: 'Pet name is still the placeholder "pet-program-22-icon-22".' },
          { check: 'A55', status: 'Missing', detail: 'README shows 1 picture(s).' },
        ] },
    ];
    const fixes = { 'astras-pet-os': { pr: hubPr, a59: ['registry:rgbee:interface_url'], log: ['pets.json: rgbee interface_url (A59).'] }, rgbee: { pr: petPr, a59: ['entry'], log: ['pet.json: entry now opens rgbee-20261009.html, the program page (A59).'] } };
    writeFileSync(join(dir, 'ledger.json'), JSON.stringify(ledger));
    writeFileSync(join(dir, 'fix.json'), JSON.stringify(fixes));
    writeFileSync(join(dir, 'names.json'), '{}');
    execFileSync(process.execPath, [join(HUB_DIR, 'scripts/idle-flash-cards-20261017.mjs'), join(dir, 'ledger.json'), join(dir, 'fix.json'), join(dir, 'names.json'), out], { stdio: 'pipe', env: { ...process.env, FLASH_DATE: '20261018' } });
    assert.match(readFileSync(join(out, 'README.md'), 'utf8'), /^# Flash Audit rounds, 2026-10-18$/m, 'the cards carry the run\'s date');
    const card = readFileSync(join(out, 'round-22-rgbee.md'), 'utf8');
    const exceptions = card.split('### Exceptions')[1].split('### Fixed')[0].split('\n').filter((l) => /^\d+\. /.test(l));
    assert.ok(exceptions.length >= 2);
    for (const l of exceptions) assert.match(l, /^\d+\. (⚪|🔵) \*\*A\d\d /, l);
    assert.ok(exceptions[0].startsWith('1. 🔵 **A06'), 'A06 before A55 (matrix order), blue: a new name is Astra\'s');
    assert.ok(exceptions.some((l) => l.startsWith('2. ⚪ **A55')));
    const fixed = card.split('### Fixed')[1].split('###')[0];
    assert.match(fixed, /⚪ \*\*A59 Pet program and its link\*\* — pet\.json has no entry.* Fixed in \[rgbee#7\]\(https:\/\/github\.com\/findastra\/rgbee\/pull\/7\)\./);
    assert.match(fixed, /pets\.json has no interface_url.* Fixed in \[astras-pet-os#99\]/);
    const farm = readFileSync(join(out, 'round-01-astras-pet-os.md'), 'utf8');
    assert.match(farm, /1\. 🔵 \*\*A59 Pet program and its link\*\* — Incorrect\./);
    assert.match(farm, /🔵 \*\*Pet program:\*\* Pet programs #2/);

    const decisions = JSON.parse(readFileSync(join(out, 'decisions.json'), 'utf8'));
    for (const d of decisions) assert.ok([GREY, BLUE].includes(d.dot), `${d.kind} has a dot`);
    decisions.push({ round: 22, pet: 'RGBee', program: 'Light Hive', repo: 'rgbee', card: 'round-22-rgbee.md', kind: 'Links', check: 'A31', dot: GREY, text: 'A grey item.', options: null });
    writeFileSync(join(dir, 'decisions.json'), JSON.stringify(decisions));
    execFileSync(process.execPath, [join(HUB_DIR, 'scripts/idle-flash-answers-page-20261017.mjs'), join(dir, 'decisions.json'), join(dir, 'ledger.json'), join(dir, 'fix.json'), HUB_DIR, join(dir, 'answers.html'), 'https://example.org/cards'], { stdio: 'pipe' });
    const html = readFileSync(join(dir, 'answers.html'), 'utf8');
    const data = JSON.parse(html.match(/<script type="application\/json" id="data">([\s\S]*?)<\/script>/)[1]);
    assert.ok(data.items.length > 0);
    for (const it of data.items) assert.equal(it.dot, BLUE, `${it.id} is a blue item`);
    assert.ok(data.items.some((it) => it.kind === 'Pet program'), 'the blue A59 item is a question');
    assert.ok(!data.items.some((it) => it.kind === 'Links'), 'a grey item never becomes a question');
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
