// Developer mode (Astra, 2026-10-19: "another installation option that's for developers ... instead of the Unity
// unicorn and the unicorn stable, you would have the agent and the agent control hub"): the installer's switch, the
// words every page swaps, and nothing on the desktop. Runs the generated page code against a small pretend page.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-19.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { copyFileSync, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { OUTPUT, MODE_FILE, SOURCE, developerWordsFile, readDeveloperWordsSources } from '../scripts/developer-words-20261019.mjs';
import { readSpawnerSources, spawnerFiles, INDEX } from '../scripts/pet-program-pages-20261018.mjs';

const root = fileURLToPath(new URL('..', import.meta.url)).replace(/[\\/]$/, '');
const read = (rel) => readFileSync(join(root, rel), 'utf8').replace(/^﻿/, '');
const code = read(OUTPUT);
const words = JSON.parse(read(SOURCE));
const programs = JSON.parse(read('pet-programs.json')).programs;
const installer = read('installer/install-astras-pet-os-20261014.ps1');
const pages = spawnerFiles(readSpawnerSources(root));

/** The page code in a pretend page: the installer's words, an address, and what this browser remembered. */
function load({ installed = 'farm', search = '', stored = null } = {}) {
  const saved = new Map(stored ? [['astras-pet-os:words', JSON.stringify(stored)]] : []);
  const attrs = {};
  const g = {
    ASTRAS_PET_OS_WORDS: installed,
    document: { documentElement: { setAttribute: (k, v) => { attrs[k] = v; } }, readyState: 'loading', addEventListener() {} },
    localStorage: { getItem: (k) => saved.get(k) ?? null, setItem: (k, v) => saved.set(k, v) },
    location: { search },
  };
  g.window = g;
  vm.createContext(g);
  vm.runInContext(code, g);
  return { W: g.PetOSWords, attrs, saved };
}
const { W } = load({ installed: 'developer' });
const swap = W._swap;
const data = (() => { const g = {}; g.window = g; vm.createContext(g); vm.runInContext(code.split('\n').find((l) => l.startsWith('window.PetOSWordsData = ')), g); return g.PetOSWordsData; })();

// Text people read on a page: everything between tags outside scripts and styles, and the read attributes.
const decode = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
function texts(html) {
  const body = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '');
  const out = body.split(/<[^>]+>/).map((t) => decode(t).trim()).filter(Boolean);
  for (const m of body.matchAll(/\s(?:title|alt|placeholder|aria-label)="([^"]*)"/g)) out.push(decode(m[1]));
  return out;
}
function strings(value, out = []) {
  if (typeof value === 'string') out.push(value);
  else if (value && typeof value === 'object') for (const v of Object.values(value)) strings(v, out);
  return out;
}

test('the words file the pages load is the one the build writes now', () => {
  assert.equal(developerWordsFile(readDeveloperWordsSources(root)).script, code, `run npm run build: ${OUTPUT} is out of date`);
  assert.match(read(MODE_FILE), /^window\.ASTRAS_PET_OS_WORDS = 'farm';$/m, 'the hub ships in farm words; only the installer writes developer');
});

test('every pet program has an agent name, and no two agents share one', () => {
  const missing = programs.filter((p) => !words.names[p.repo]?.agent).map((p) => p.repo);
  assert.deepEqual(missing, [], 'give each new pet program an agent name in developer-words-20261019.json');
  const agents = Object.values(data.names).map((n) => n.agent);
  assert.equal(new Set(agents).size, agents.length);
  for (const repo of Object.keys(words.names)) assert.ok(programs.some((p) => p.repo === repo), `${repo} is not a pet program`);
  assert.equal(words.reviewed, false, 'the developer names are drafts until Astra reviews them');
});

test('Astra\'s own example: the Unity Unicorn is the Unity Agent, Unity Stable the Unity Agent Control Hub', () => {
  assert.deepEqual({ ...W.name('unity-unicorn') }, { agent: 'Unity Agent', hub: 'Unity Agent Control Hub' });
  assert.equal(swap("Unity Unicorn's pet program"), "Unity Agent's control hub");
  assert.equal(swap('Unity Stable'), 'Unity Agent Control Hub');
  assert.equal(swap('The Farm'), 'Agent Control Hub');
  assert.equal(swap('the Friendly Farmer'), 'the Orchestrator Agent');
  assert.equal(swap("The Farmer’s desk"), 'The main dashboard');
  assert.equal(swap("Set up Your Farm with Astra's Example Pets"), "Set up Your Workspace with Astra's Example Agents");
  assert.equal(swap('A pet is curious when it needs your OK.'), 'An agent is curious when it needs your OK.');
  assert.equal(swap('PETS'), 'AGENTS');
  assert.equal(swap('Seat: empty. No farmhand is seated in Unity Stable.'), 'Session: empty. No AI model is running in Unity Agent Control Hub.');
  assert.equal(swap('Reports the health of Data Dealer, Astra’s data project.'), 'Reports the health of Data Dealer, Astra’s data project.', 'keep_home: Data Dealer is the project\'s own name');
});

test('names on GitHub and in files keep their spelling: repos, file names, paths, labels', () => {
  for (const t of ["Astra's PetOS", 'astras-pet-os', 'findastra/unity-unicorn', 'apps/pet-programs/unity-unicorn-20261018.html', 'farm.lock', 'pet.json', 'pets.json', 'PET-WORDS.md', 'unity-unicorn-20261018.html', 'skills/farm-security', 'the-kennel'])
    assert.equal(swap(t), t, t);
  assert.equal(swap('unity-stable-backlog in this browser'), 'unity-agent-control-hub-backlog in this browser');
});

test('panel labels: unity-unicorn-L1-tool-panel becomes unity-agent-L1-panel, and the activity lights still find it', () => {
  const pairs = [['unity-unicorn-L1-tool-panel', 'unity-agent-L1-panel'], ['unity-unicorn-cyberhome', 'unity-agent-avatar-panel'],
    ['unity-stable-quick-summary', 'unity-agent-control-hub-summary'], ['friendly-farmer-plays-with', 'orchestrator-agent-plays-with'],
    ['astras-pet-os-unified-footer', 'astras-pet-os-unified-footer']];
  for (const [farm, dev] of pairs) assert.equal(W._legend(farm), dev);
  for (const lv of ['L1', 'L2', 'L3', 'L4']) assert.match(W._legend(`unity-unicorn-${lv}-tool-panel`), /-(L[1-4])-[a-z-]*panel$/);
});

test('a developer word never brings a farm word back: the swap gives the same text twice', () => {
  const outputs = [...data.exact, ...data.words].map((p) => p[1]).concat(Object.values(data.names).flatMap((n) => [n.agent, n.hub]));
  for (const t of outputs) assert.equal(swap(t), t, `"${t}" would be swapped again`);
  const seen = [];
  for (const html of [...Object.values(pages), read('apps/astras-pet-apps-20261008.html'), read('system-map-20261012.html')]) seen.push(...texts(html));
  const map = read('system-map-20261012.html');
  seen.push(...strings(JSON.parse(map.slice(map.indexOf('const DATA = ') + 13, map.indexOf(';\n', map.indexOf('const DATA = '))))));
  seen.push(...programs.map((p) => p.mini_descriptor?.text || ''));
  const unstable = [...new Set(seen)].filter((t) => swap(swap(t)) !== swap(t));
  assert.deepEqual(unstable.slice(0, 5), []);
});

test('which words a page shows: the address, then this browser\'s switch over the same install, then the installer', () => {
  assert.equal(load({ installed: 'farm' }).W.mode, 'farm');
  const dev = load({ installed: 'developer' });
  assert.equal(dev.W.mode, 'developer');
  assert.equal(dev.attrs['data-words'], 'developer', '<html data-words> is set before the page is drawn');
  assert.equal(load({ installed: 'developer', search: '?words=farm' }).W.mode, 'farm');
  const asked = load({ installed: 'farm', search: '?x=1&words=developer' });
  assert.equal(asked.W.mode, 'developer');
  assert.deepEqual(JSON.parse(asked.saved.get('astras-pet-os:words')), { mode: 'developer', over: 'farm' }, 'the address is remembered');
  assert.equal(load({ installed: 'developer', stored: { mode: 'farm', over: 'developer' } }).W.mode, 'farm');
  assert.equal(load({ installed: 'developer', stored: { mode: 'farm', over: 'farm' } }).W.mode, 'developer', 'a click made before installing developer mode does not hide it');
  assert.equal(load({ installed: 'farm' }).W.swap('pets'), 'pets', 'farm words change nothing');
});

test('every page loads the installer\'s words, then the swap, in its <head>', () => {
  const heads = Object.entries(pages).map(([path, html]) => [path, html, '../']);
  heads.push(['apps/astras-pet-apps-20261008.html', read('apps/astras-pet-apps-20261008.html'), '']);
  heads.push(['system-map-20261012.html', read('system-map-20261012.html'), 'apps/']);
  for (const [path, html, up] of heads) {
    const head = html.slice(0, html.indexOf('</head>'));
    const mode = head.indexOf(`<script src="${up}words-mode-20261019.js"></script>`), swapAt = head.indexOf(`<script src="${up}developer-words-20261019.js"></script>`);
    assert.ok(mode > 0 && swapAt > mode, `${path}: words-mode, then developer-words, in <head>`);
  }
  // A pet program page has no words switch in its footer since 2026-10-22 (Astra crossed it out); the installer's
  // setting still chooses its words, and the spawner's list page keeps the switch.
  for (const [path, html] of Object.entries(pages)) if (path !== INDEX) assert.ok(!html.includes('data-words-switch'), `${path}: no words switch in a pet program's footer`);
  assert.ok(pages[INDEX].includes('data-words-switch'));
  assert.match(read('system-map-20261012.html'), /const DATA = [\s\S]{0,2000000}?\nif \(window\.PetOSWords\) window\.PetOSWords\.data\(DATA\);/, 'the map gets its new names before it is drawn');
});

// The Farmer's round rebuilds the desk every morning with its generator, so a hand edit to the desk is gone the next
// day (run 39462765053, card 052). Build the desk in a copy and check what the generator itself writes.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-20.
test('the Farmer\'s desk generator writes the words, then the swap, in <head>, and the words switch in the footer', () => {
  const dir = mkdtempSync(join(tmpdir(), 'desk-'));
  try {
    const registry = JSON.parse(read('pets.json')), art = JSON.parse(read('art/frames/index.json'));
    cpSync(join(root, 'scripts'), join(dir, 'scripts'), { recursive: true });
    for (const rel of ['pets.json', 'art/frames/index.json', art.pets[registry.pets.find((p) => p.role === 'host').art].frames.idle]) {
      mkdirSync(dirname(join(dir, rel)), { recursive: true });
      copyFileSync(join(root, rel), join(dir, rel));
    }
    execFileSync(process.execPath, [join(dir, 'scripts', 'build-interfaces-20261008.mjs'), 'astras-pet-apps'], { stdio: 'pipe' });
    const html = readFileSync(join(dir, 'apps', 'astras-pet-apps-20261008.html'), 'utf8');
    const head = html.slice(0, html.indexOf('</head>')), footer = html.slice(html.indexOf('<footer>'), html.indexOf('</footer>'));
    const mode = head.indexOf('<script src="words-mode-20261019.js"></script>'), swapAt = head.indexOf('<script src="developer-words-20261019.js"></script>');
    assert.ok(mode > 0 && swapAt > mode, 'the generated desk: words-mode, then developer-words, in <head>');
    assert.ok(footer.includes('data-words-switch'), 'the generated desk: the words switch in its footer');
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('in developer mode the agent is already home and one click says what it does', () => {
  const js = read('apps/pet-programs/pet-program-page-20261018.js');
  assert.match(js, /den\.dataset\.arrival === 'waiting' && dev\) \{[\s\S]{0,200}den\.dataset\.arrival = 'home';/);
  assert.match(js, /sayAt\(den, dev \? T\(config\.pet \+ ': ' \+ \(config\.summary/);
  const css = read('apps/pet-programs/pet-program-page-20261018.css');
  assert.ok(css.includes('[data-words="developer"] .den .star-door, [data-words="developer"] .clicker { display: none; }'));
});

test('the installer has the switch, writes the words for the pages, and builds nothing in developer mode', () => {
  assert.match(installer, /\[switch\]\$Developer,/);
  assert.ok(installer.includes("Developer mode: programming words (agents, control hubs) and no pets on the desktop"));
  assert.ok(installer.includes("1.  Install with Astra's Example Agents") && installer.includes("'2.  Minimal Install'"));
  assert.match(installer, /\$modeLine = "window\.ASTRAS_PET_OS_WORDS = '\$\(if \(\$dev\) \{ 'developer' \} else \{ 'farm' \}\)';"/);
  const devStep = installer.indexOf('if ($dev) {\n        # 5. Developer mode'), build = installer.indexOf("'build-desktop-pets-20261011.ps1'");
  assert.ok(devStep > 0 && build > devStep && installer.slice(devStep, build).includes('} else {'), 'the desktop pets are built only outside developer mode');
  assert.ok(![...installer].some((c) => c.charCodeAt(0) > 127), 'plain ASCII for Windows PowerShell 5.1');
});

const windows = { skip: process.platform !== 'win32' && 'needs Windows PowerShell' };

test("the installer's word swap gives what the pages give (Windows)", windows, () => {
  const dir = mkdtempSync(join(tmpdir(), 'devwords-'));
  try {
    const jobs = [...new Set([...JSON.parse(read('pets.json')).pets, ...JSON.parse(read('pets.json')).pipeline].map((p) => p.job).filter(Boolean)
      .concat(programs.map((p) => p.mini_descriptor?.text).filter(Boolean), ["Set up Your Farm with Astra's Example Pets", 'PETS on the farm.lock']))];
    writeFileSync(join(dir, 'in.json'), JSON.stringify(jobs));
    const q = (s) => `'${s.replace(/'/g, "''")}'`;
    const script = [
      '[Console]::OutputEncoding = [Text.Encoding]::UTF8',
      `$ast = [System.Management.Automation.Language.Parser]::ParseFile(${q(join(root, 'installer', 'install-astras-pet-os-20261014.ps1'))}, [ref]$null, [ref]$null)`,
      "$defs = $ast.FindAll({ param($n) $n -is [System.Management.Automation.Language.FunctionDefinitionAst] -and @('Get-DevWords','Format-DevCase','Convert-DevWords') -contains $n.Name }, $true)",
      'Add-Type -AssemblyName System.Web.Extensions',
      '$json = New-Object System.Web.Script.Serialization.JavaScriptSerializer; $json.MaxJsonLength = 16777216',
      'foreach ($d in $defs) { . ([scriptblock]::Create($d.Extent.Text)) }',
      `$w = Get-DevWords ${q(root)}`,
      `$in = $json.DeserializeObject([IO.File]::ReadAllText(${q(join(dir, 'in.json'))}, [Text.Encoding]::UTF8))`,
      `[IO.File]::WriteAllText(${q(join(dir, 'out.json'))}, $json.Serialize(@($in | ForEach-Object { Convert-DevWords $_ $w })), (New-Object Text.UTF8Encoding $false))`,
    ].join('; ');
    execFileSync('powershell', ['-NoProfile', '-Command', script], { stdio: 'pipe' });
    assert.deepEqual(JSON.parse(readFileSync(join(dir, 'out.json'), 'utf8')), jobs.map(swap));
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('a developer install: no desktop pets, the Agent Control Hub in the Start menu, the pages in developer words (Windows)', windows, () => {
  const out = mkdtempSync(join(tmpdir(), 'devmode-'));
  const dir = join(out, 'astras-pet-os'), menu = join(out, 'shortcuts');
  try {
    // What an earlier farm install leaves: its desktop pets program and its two shortcuts. Developer mode takes them away.
    mkdirSync(join(dir, 'bin'), { recursive: true }); writeFileSync(join(dir, 'bin', 'old.txt'), 'old build');
    mkdirSync(menu, { recursive: true });
    for (const n of ["Astra's PetOS.lnk", "Stop Astra's PetOS (big red button).lnk"]) writeFileSync(join(menu, n), '');
    execFileSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', join(root, 'installer', 'install-astras-pet-os-20261014.ps1'),
      '-InstallDir', dir, '-ShortcutDir', menu, '-NoLaunch', '-Developer', '-Farm', 'Scratch', '-Pets', 'goldfish'], { stdio: 'pipe', timeout: 240000 });
    const receipt = JSON.parse(readFileSync(join(dir, 'install-receipt.json'), 'utf8').replace(/^﻿/, ''));
    assert.equal(receipt.mode, 'developer');
    assert.equal(receipt.built_from_source, false);
    assert.equal(receipt.program_sha256, null);
    assert.equal(receipt.starts_with_windows, false);
    assert.deepEqual(receipt.pets, ['farmer', 'goldfish']);
    assert.ok(!existsSync(join(dir, 'bin')), 'no desktop pets program');
    assert.match(readFileSync(join(dir, MODE_FILE), 'utf8'), /^window\.ASTRAS_PET_OS_WORDS = 'developer';$/m);
    assert.deepEqual(readdirSync(menu).sort(), ['Agent Control Hub.lnk', "System Map.lnk", "Uninstall Astra's PetOS.lnk"].sort());
  } finally { rmSync(out, { recursive: true, force: true }); }
});
