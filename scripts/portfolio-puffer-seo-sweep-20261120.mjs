#!/usr/bin/env node
// seo-toolkit's sweep (Iced Out Iceberg, Portfolio Puffer): fetches every page in
// apps/portfolio-puffer-seo-pages-20261120.json, runs the checks, and writes the results the toolkit page shows
// (apps/portfolio-puffer-seo-results-20261120.js, a data file with a schema). With --out <folder> it also writes the
// sitemap.xml and robots.txt that belong at the root of the findastra.github.io repo (a pull request there; never
// pushed live by this script). Reads public pages only; writes nothing outside this repo unless --out says where.
// Usage: node scripts/portfolio-puffer-seo-sweep-20261120.mjs [--out <folder>]
// Astra, 2026-11-20. Claude Opus 5.5 (claude-opus-5-5).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
const seo = require('../apps/portfolio-puffer-seo-check-20261120.js');
const root = new URL('../', import.meta.url);
const list = JSON.parse(readFileSync(new URL('apps/portfolio-puffer-seo-pages-20261120.json', root), 'utf8'));
if (list.schema !== 'portfolio-puffer-seo-pages-v1') throw new Error(`unknown page list schema ${list.schema}`);

const get = async (url) => {
  try {
    const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(15000), headers: { 'user-agent': 'seo-toolkit/1.0' } });
    return { status: res.status, text: res.ok ? await res.text() : null };
  } catch (e) {
    return { status: `no answer (${e.cause?.code || e.name})`, text: null };
  }
};

const sitemap = await get(list.sitemap);
const robots = await get(new URL('/robots.txt', list.site).href);
const inSitemap = new Set(sitemap.text ? [...sitemap.text.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]) : []);

const pages = [];
for (const page of list.pages) {
  const got = await get(page.url);
  const result = seo.checkPage(got.text, page, { status: got.status });
  if (got.text) {
    const listed = inSitemap.has(page.url);
    result.checks.push({ id: 'in-sitemap', level: 'should', label: 'It is in the sitemap', ok: listed,
      found: sitemap.text ? (listed ? 'listed' : 'not listed') : 'there is no sitemap.xml yet', fix: listed ? '' : 'Add it to sitemap.xml at the root of findastra.github.io.' });
    const bad = result.checks.filter((c) => !c.ok);
    result.light = bad.some((c) => c.level === 'must') ? 'red' : bad.length ? 'yellow' : 'green';
    result.passed = result.checks.length - bad.length; result.total = result.checks.length;
  }
  pages.push({ ...page, ...result, head: seo.suggestHead(page, result) });
  console.log(`${result.light.padEnd(6)} ${result.passed}/${result.total}  ${page.url}`);
}

const checked = new Date().toISOString();
const data = {
  schema: 'portfolio-puffer-seo-results-v1', checked, tool: 'iced-out-iceberg-v1.0-seo-toolkit-v1.0',
  site: { url: list.site, sitemap: { url: list.sitemap, status: sitemap.status, pages: inSitemap.size },
    robots: { status: robots.status, names_sitemap: !!robots.text && /sitemap:/i.test(robots.text) } },
  pages,
};
writeFileSync(new URL('apps/portfolio-puffer-seo-results-20261120.js', root),
  `// Written by scripts/portfolio-puffer-seo-sweep-20261120.mjs; do not edit by hand. Data, not code.\nwindow.SEO_RESULTS = ${JSON.stringify(data, null, 1).replace(/</g, '\\u003c')};\n`);

const outAt = process.argv.indexOf('--out');
if (outAt !== -1 && process.argv[outAt + 1]) {
  const dir = process.argv[outAt + 1]; mkdirSync(dir, { recursive: true });
  const live = pages.filter((p) => p.checks[0].ok && !p.checks.some((c) => c.id === 'indexable' && !c.ok)).map((p) => p.url);
  writeFileSync(join(dir, 'sitemap.xml'), seo.sitemapXml(live, checked.slice(0, 10)));
  writeFileSync(join(dir, 'robots.txt'), seo.robotsTxt(list.sitemap));
  console.log(`wrote sitemap.xml (${live.length} pages) and robots.txt to ${dir}`);
}
const count = (l) => pages.filter((p) => p.light === l).length;
console.log(`${pages.length} pages: ${count('green')} green, ${count('yellow')} yellow, ${count('red')} red. sitemap ${sitemap.status}, robots.txt ${robots.status}`);
