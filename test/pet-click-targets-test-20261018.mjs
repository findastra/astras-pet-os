// Flash Audit A11 (desktop launch), A10 (website route) and A59 (pet program and its link): a double-click on any desktop
// pet opens that pet's program, never a GitHub repo page, and every pet has a program page. Claude Opus 5.5, 2026-10-18.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { BUNDLED, LIVE, hubPage, load, pagesToWrite, render } from '../scripts/pet-program-pages-20261018.mjs';
import { LIST, draftList } from '../scripts/prepare-desktop-drafts-20261011.mjs';

const hub = (rel) => fileURLToPath(new URL('../' + rel, import.meta.url));
const ctx = load();
const drafts = JSON.parse(readFileSync(hub(LIST), 'utf8')).pets;

/** Why this click target is not a program, or '' when it is one. */
function notAProgram(target) {
  if (!target) return 'no target';
  if (/^https:\/\/github\.com\//.test(target)) return 'a GitHub repo page, not a program';
  if (/^https?:\/\//.test(target)) return '';
  return /^apps\/[a-z0-9-]+\.html$/.test(target) && existsSync(hub(target)) ? '' : 'not a page in the hub';
}

test('every registered desktop pet opens a program', () => {
  for (const p of ctx.registry.pets) assert.equal(notAProgram(p.interface_url), '', `${p.repo}: ${p.interface_url}`);
});

test('every pipeline pet has a program to open, and its draft desktop pet opens the same one', () => {
  for (const p of ctx.registry.pipeline) assert.equal(notAProgram(p.interface_url), '', `${p.repo}: ${p.interface_url}`);
  for (const d of drafts) {
    assert.equal(notAProgram(d.interface), '', `draft ${d.id}: ${d.interface}`);
    const repo = d.repo || d.interface.match(/apps\/(.+)-\d{8}\.html$/)?.[1];
    const entry = ctx.registry.pipeline.find((p) => p.repo === repo || p.interface_url === d.interface);
    if (entry) assert.equal(d.interface, entry.interface_url, `draft ${d.id} opens something other than pets.json says`);
  }
  assert.deepEqual(drafts, draftList().pets);
});

test('every numbered pet has a program page: its own live page, a bundled copy, or a generated one', () => {
  const registered = new Set(ctx.registry.pets.map((p) => p.repo));
  for (const p of ctx.programs.filter((x) => !registered.has(x.repo))) {
    const page = LIVE[p.repo] || hubPage(p.repo);
    assert.equal(notAProgram(page), '', `#${p.number} ${p.icon}: ${page}`);
  }
  for (const [repo, entry] of Object.entries(BUNDLED)) {
    assert.match(readFileSync(hub(hubPage(repo)), 'utf8'), new RegExp(`Bundled copy of findastra/${repo} main ${entry.replace('.', '\\.')} at [0-9a-f]{40}`));
  }
});

test('the generated pages are up to date (run node scripts/pet-program-pages-20261018.mjs)', () => {
  for (const p of pagesToWrite(ctx)) {
    const html = render(p, ctx, 'hub');
    assert.equal(readFileSync(hub(hubPage(p.repo)), 'utf8'), html, hubPage(p.repo));
    assert.ok(!html.includes('{{'), `${p.repo}: a shell placeholder was left in`);
    assert.match(html, /An Intelligent App, or Pet, by Astra\./);
  }
});

test('a page escapes what pets wrote, and the copy for a pet repo reads pictures from the hub on GitHub', () => {
  const p = { ...ctx.programs.find((x) => x.repo === 'deck-duck'), mini_descriptor: { text: '<img src=x onerror=alert(1)>' } };
  const html = render(p, ctx, 'repo');
  assert.ok(!html.includes('<img src=x'), 'pet text reached the page as HTML');
  assert.ok(html.includes('&lt;img src=x onerror=alert(1)&gt;'));
  assert.match(html, /src="https:\/\/raw\.githubusercontent\.com\/findastra\/astras-pet-os\/main\/desktop-art\/deck-duck\/idle-20261011\.png"/);
  assert.ok(!/src="\.\.\//.test(html), 'a pet repo page must not read pictures from ../');
});
