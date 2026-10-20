// How to Take Care of Your Farm!, the guide for beginners (Astra, 2026-10-19): one public page, a native program of The
// Farm, that a brand-new person can read before installing anything. It works by double-click and on GitHub Pages, has no dependencies, sets text
// only with textContent, takes its pictures only from the hub's art/, and every link reaches a real file or https.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-19.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import { findSensitive } from '../scripts/public-safety-20261014.mjs';

const root = fileURLToPath(new URL('..', import.meta.url)).replace(/[\\/]$/, '');
const PAGE = 'apps/beginner-guide-20261019.html';
const read = (p) => readFileSync(`${root}/${p}`, 'utf8');
const html = read(PAGE);
const REPO_FILES = 'https://github.com/findastra/astras-pet-os/blob/main/';
const NAME = 'How to Take Care of Your Farm!'; // Astra, 2026-10-19: the framework's tutorial title
const INSTALLER = 'https://github.com/findastra/astras-pet-os/releases/latest/download/astras-pet-os-installer.zip';

const attrs = (name) => [...html.matchAll(new RegExp(`\\s${name}="([^"]*)"`, 'g'))].map((m) => m[1].replace(/&amp;/g, '&'));
const ids = new Set(attrs('id'));
const local = (href) => posix.normalize(posix.join('apps', href.split('#')[0].split('?')[0]));

test('it carries the name Astra gave it, and keeps its plain file name', () => {
  assert.ok(html.includes(`<title>${NAME} · Astra's PetOS</title>`), 'the page title');
  assert.match(html, /<h1>How to Take Care of Your <span>Farm<\/span>!<\/h1>/, 'the heading');
  assert.ok(read('README.md').includes(`**[${NAME}](https://findastra.github.io/astras-pet-os/${PAGE})**`), 'the README links it by name');
  const words = read('PET-WORDS.md').split('\n').find((l) => l.startsWith(`| **${NAME}** |`));
  assert.ok(words && words.includes(PAGE), 'PET-WORDS.md points the word at the page');
});

test('the page is in apps/ with a dated lowercase name, and opens on a phone', () => {
  assert.match(PAGE, /^apps\/[a-z0-9-]+-\d{8}\.html$/);
  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1">/);
  assert.match(html, /<html lang="en">/);
});

test('no dependencies: no outside script, stylesheet or font', () => {
  assert.doesNotMatch(html, /<script[^>]+src=/i);
  assert.doesNotMatch(html, /<link[^>]+rel="?stylesheet/i);
  assert.doesNotMatch(html, /@import|fonts\.googleapis/i);
});

test('text is set with textContent only, never as HTML', () => {
  for (const bad of ['innerHTML', 'outerHTML', 'insertAdjacentHTML', 'document.write', 'eval(', 'new Function'])
    assert.ok(!html.includes(bad), `the page uses ${bad}`);
  assert.ok(html.includes('textContent'), 'the script sets its messages with textContent');
  assert.doesNotMatch(html, /\son[a-z]+="/i, 'no inline event handlers');
  assert.doesNotMatch(html, /fetch\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage/, 'it sends and saves nothing');
});

test('every link reaches a real file, a step on the page, or an https address', () => {
  const hrefs = attrs('href');
  assert.ok(hrefs.length > 20, 'the page links the real docs');
  for (const href of hrefs) {
    if (href.startsWith('#')) { assert.ok(ids.has(href.slice(1)), `${href} is not a step on the page`); continue; }
    if (/^https?:/.test(href)) {
      assert.match(href, /^https:\/\//, `${href} is not https`);
      if (href.startsWith(REPO_FILES)) {
        const p = href.slice(REPO_FILES.length).split('#')[0];
        assert.ok(existsSync(`${root}/${p}`), `${href}: ${p} is not in this repo`);
      }
      continue;
    }
    assert.doesNotMatch(href, /^(file|javascript|data):/i, `${href}: only relative or https links`);
    const p = local(href);
    assert.ok(!p.startsWith('..'), `${href} leaves the repo`);
    assert.ok(existsSync(`${root}/${p}`), `${href}: ${p} does not exist`);
  }
});

test('pictures come only from the hub art/ (one art source), and each exists', () => {
  const srcs = attrs('src');
  assert.ok(srcs.length >= 3, 'the Friendly Farmer and some pets are pictured');
  for (const src of srcs) {
    assert.match(src, /^\.\.\/art\/frames\/[a-z0-9-]+\/[a-z]+(-\d{8})?\.png$/, `${src}: pictures load from ../art/frames/`);
    assert.ok(existsSync(`${root}/${local(src)}`), `${src} does not exist`);
  }
  assert.doesNotMatch(html, /raw\.githubusercontent\.com|<img[^>]+src="https?:/, 'no copy or outside picture');
});

test('the pets shown carry their names from pet-programs.json and link their pet program pages', () => {
  const programs = JSON.parse(read('pet-programs.json')).programs;
  const tiles = [...html.matchAll(/<a href="pet-programs\/([a-z0-9-]+)-20261018\.html"><img[^>]*>([^<]+)<\/a>/g)];
  assert.ok(tiles.length >= 4, 'a few of Astra pets are shown');
  for (const [, repo, name] of tiles) {
    const p = programs.find((x) => x.repo === repo);
    assert.ok(p, `${repo} is not in pet-programs.json`);
    assert.equal(name, p.icon, `${repo}: the name comes from pet-programs.json`);
  }
});

test('it teaches every step of the task, with the one installer download', () => {
  for (const id of ['what', 'install', 'locked-down', 'ai', 'make-it-yours', 'public-private', 'adopt', 'safe', 'words', 'farmer'])
    assert.match(html, new RegExp(`<details class="step [^"]*" id="${id}"`), `step ${id} is missing or does not fold`);
  assert.ok(html.includes(`href="${INSTALLER}"`), 'the installer link');
  assert.ok(read('INSTALL.md').includes(INSTALLER), 'the same installer link as INSTALL.md');
  for (const words of ['core pet', 'never lets anyone', 'before they install anything', 'Example Pets', 'From Scratch', 'Markdown pet',
    'Never put keys, passwords or personal information in a public repo', 'Fork', 'pets.json', 'private copy'])
    assert.ok(html.includes(words), `the page should say "${words}"`);
  assert.ok((html.match(/class="dev"/g) || []).length >= 15, 'farm words come with the programmer word in small text');
});

test('it is safe to publish: no secret, address, personal path or credit line', () => {
  assert.deepEqual(findSensitive(html), []);
  assert.ok(!html.includes('Intelligent App, or Pet, by Astra'), 'the credit line goes only in a pet repo README');
});

test('it is a native program of The Farm on the System Map, in the registry table', () => {
  const map = JSON.parse(read('system-map.json'));
  const node = map.nodes.find((n) => n.id === 'beginner-guide');
  assert.ok(node, 'system-map.json has the beginner-guide node');
  assert.equal(node.type, 'own-program');
  assert.equal(node.of, 'farm');
  assert.equal(node.name, NAME);
  assert.equal(node.label, 'the-farm-v1.0-beginner-guide-v1.0');
  assert.ok(node.job.includes(PAGE.slice('apps/'.length)), 'its job names the page');
  assert.ok(map.links.some((l) => l.from === 'farm' && l.to === 'beginner-guide' && l.carries === 'opens'), 'The Farm opens it');
  assert.ok(html.includes(node.label), 'the page shows its label');
  assert.match(read('TOOLS-AND-TRICKS.md'), /\| 1 \| Friendly Farmer \| The Farm \| native program \| How to Take Care of Your Farm! \| `the-farm-v1\.0-beginner-guide-v1\.0` \|/,
    'run npm run build: the registry table lists it');
});
