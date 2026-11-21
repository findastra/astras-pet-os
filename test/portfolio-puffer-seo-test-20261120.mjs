// Portfolio Puffer's seo-toolkit (Iced Out Iceberg): the checks, the suggested head tags, the sitemap and the page
// list, with no network and no AI. Astra, 2026-11-20: "I want you to be able to just search them up by their title,
// especially just using their dashes"; "I think this just needs to be a portfolio [puffer] job".
// Claude Opus 5.5 (claude-opus-5-5), 2026-11-20.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const seo = require('../apps/portfolio-puffer-seo-check-20261120.js');
const root = new URL('../', import.meta.url);
const read = (p) => readFileSync(new URL(p, root), 'utf8');

const page = { url: 'https://findastra.github.io/liminal-doors/', slug: 'liminal-doors', name: 'Liminal Doors' };

const good = `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Liminal Doors (liminal-doors) · by Astra</title>
<meta name="description" content="Liminal Doors is a small web world of doors that open onto quiet, empty places, made by Astra.">
<link rel="canonical" href="https://findastra.github.io/liminal-doors/">
<meta property="og:title" content="Liminal Doors (liminal-doors)">
<meta property="og:description" content="A small web world of doors.">
<meta property="og:url" content="https://findastra.github.io/liminal-doors/">
<meta property="og:image" content="https://findastra.github.io/liminal-doors/preview.png">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"Liminal Doors"}</script>
</head><body><h1>Liminal Doors</h1></body></html>`;

const bare = `<html><head><title>index</title></head><body><h1>A</h1><h1>B</h1></body></html>`;

test('a page with every tag is green, and finds both the words and the dashed name in the title', () => {
  const r = seo.checkPage(good, page);
  assert.equal(r.light, 'green', JSON.stringify(r.checks.filter((c) => !c.ok)));
  assert.equal(r.checks.find((c) => c.id === 'title-words').ok, true);
  assert.equal(r.checks.find((c) => c.id === 'title-slug').ok, true);
});

test('a bare page is red, and says what is missing', () => {
  const r = seo.checkPage(bare, page);
  assert.equal(r.light, 'red');
  const failed = r.checks.filter((c) => !c.ok).map((c) => c.id);
  for (const id of ['title-words', 'title-slug', 'description', 'one-h1', 'canonical', 'lang', 'viewport', 'og', 'json-ld']) {
    assert.ok(failed.includes(id), `${id} should fail on a bare page`);
  }
});

test('noindex is always red, even with every other tag', () => {
  const r = seo.checkPage(good.replace('<head>', '<head><meta name="robots" content="noindex, nofollow">'), page);
  assert.equal(r.light, 'red');
  assert.equal(r.checks.find((c) => c.id === 'indexable').ok, false);
});

test('a page that is only missing "should" tags is yellow', () => {
  const r = seo.checkPage(good.replace(/<script type="application\/ld\+json">.*?<\/script>/, ''), page);
  assert.equal(r.light, 'yellow');
});

test('a page that could not be fetched is red with the reason', () => {
  const r = seo.checkPage(null, page, { status: 404 });
  assert.equal(r.light, 'red');
  assert.match(r.checks[0].found, /404/);
});

test('the dashed name counts only as a whole name, and dashes in the title count as spaces for the words', () => {
  assert.equal(seo.hasSlug('Liminal Doors (liminal-doors)', 'liminal-doors'), true);
  assert.equal(seo.hasSlug('Liminal Doorsteps (liminal-doorsteps)', 'liminal-doors'), false);
  assert.equal(seo.hasWords('liminal-doors', 'Liminal Doors'), true);
  assert.equal(seo.hasWords("Astra's GIF Maker", "Astra's GIF Maker"), true);
});

test('a title is read as plain text, and stays escaped in the tags it suggests', () => {
  const t = seo.title('<title>A &lt;script&gt;alert(1)&lt;/script&gt; page</title>');
  assert.equal(t, 'A <script>alert(1)</script> page', 'decoded to text, shown only with textContent');
  const r = seo.checkPage('<html><head><title>&lt;script&gt;</title></head></html>', { ...page, name: '<script>x' });
  assert.doesNotMatch(seo.suggestHead({ ...page, name: '<script>x' }, r), /<script>x/);
});

test('suggested head tags use both forms of the name, escape quotes, and never make up a description', () => {
  const html = seo.suggestHead({ ...page, name: 'Liminal "Doors"' }, seo.checkPage(bare, page));
  assert.match(html, /<title>Liminal &quot;Doors&quot; \(liminal-doors\)<\/title>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/findastra\.github\.io\/liminal-doors\/">/);
  assert.match(html, /\[ONE SENTENCE BY ASTRA/);
  assert.equal(seo.suggestHead(page, seo.checkPage(good, page)), '', 'nothing to add on a green page');
});

test('the sitemap lists every page once, and robots.txt points to it', () => {
  const xml = seo.sitemapXml([page.url, page.url, 'https://findastra.github.io/'], '2026-11-20');
  assert.equal((xml.match(/<url>/g) || []).length, 2);
  assert.match(xml, /<loc>https:\/\/findastra\.github\.io\/liminal-doors\/<\/loc>/);
  assert.match(seo.robotsTxt('https://findastra.github.io/sitemap.xml'), /^User-agent: \*\nAllow: \/\nSitemap: https:\/\/findastra\.github\.io\/sitemap\.xml\n$/);
});

test('the page list has a schema, one pill per address, and only findastra.github.io addresses', () => {
  const list = JSON.parse(read('apps/portfolio-puffer-seo-pages-20261120.json'));
  assert.equal(list.schema, 'portfolio-puffer-seo-pages-v1');
  const urls = list.pages.map((p) => p.url);
  assert.equal(new Set(urls).size, urls.length);
  for (const p of list.pages) {
    assert.match(p.url, /^https:\/\/findastra\.github\.io\/([a-z0-9-]+\/)*$/, p.url);
    assert.match(p.slug, /^[a-z0-9.-]+$/);
    assert.ok(p.name);
  }
});

test('the toolkit page is a Portfolio Puffer tool on the System Map, held in its own tool box', () => {
  const map = JSON.parse(read('system-map.json'));
  const node = map.nodes.find((n) => n.id === 'seo-toolkit');
  assert.ok(node, 'seo-toolkit node');
  assert.equal(node.type, 'tool');
  assert.equal(node.of, 'program-14');
  assert.equal(node.label, 'iced-out-iceberg-v1.0-seo-toolkit-v1.0');
  assert.equal(node.in_pill, true);
  const html = read('apps/portfolio-puffer-seo-toolkit-20261120.html');
  assert.match(html, /portfolio-puffer-seo-check-20261120\.js/);
  assert.match(html, /drum-dog-in-tool-20261102\.js/, 'tells its tool box how tall it is');
  assert.doesNotMatch(html, /\.innerHTML\s*=/, 'fetched text goes in with textContent');
});

test('a long description in Astra\'s own words passes: search results cut it off, it is never trimmed', () => {
  const long = 'x'.repeat(190);
  const r = seo.checkPage(good.replace(/content="Liminal Doors is[^"]*"/, `content="${long}"`), page);
  assert.equal(r.checks.find((c) => c.id === 'description').ok, true);
});
