import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { install, updateDrafts, websiteUrl } from '../scripts/install-door-dormouse-20261018.mjs';

const website = 'https://example.com/the-threshold';
test('only explicit HTTPS website links without embedded credentials are accepted', () => {
  assert.equal(websiteUrl(website), website);
  for (const value of ['file:///C:/private', 'javascript:alert(1)', 'http://example.com', 'https://user:pass@example.com', 'https://example.com?token=secret', 'https://example.com#secret']) assert.throws(() => websiteUrl(value));
});
test('upsert preserves other pets and roster metadata and does not duplicate the mouse', () => {
  const other = { id: 'chat-rat', note: 'keep me' };
  const current = { schema: 1, pets: [other, { id: 'door-dormouse', custom: 42 }] };
  const next = updateDrafts(current, { id: 'door-dormouse', interface: website });
  assert.equal(next.pets[0], other);
  assert.equal(next.pets.length, 2);
  assert.equal(next.schema, 1);
  assert.equal(next.pets[1].custom, 42);
  assert.equal(current.pets[1].interface, undefined);
  assert.throws(() => updateDrafts({ pets: [null] }, {}));
  assert.throws(() => updateDrafts({ pets: [{ id: 'door-dormouse' }, { id: 'door-dormouse' }] }, {}));
});
test('preview has no writes; install backs up bytes, survives a second run and preserves artwork', () => {
  const localAppData = mkdtempSync(join(tmpdir(), 'door-dormouse-test-20261018-'));
  const folder = join(localAppData, 'astras-pet-apps');
  mkdirSync(folder);
  const roster = join(folder, 'desktop-drafts-20261011.json');
  const original = '{"pets":[{"id":"chat-rat","note":"keep me"}],"custom":true}\n';
  writeFileSync(roster, original);
  const preview = install({ website, localAppData });
  assert.equal(preview.applied, false);
  assert.equal(readFileSync(roster, 'utf8'), original);
  assert.equal(existsSync(join(folder, 'door-dormouse')), false);
  const result = install({ website, localAppData, apply: true });
  assert.equal(readFileSync(result.backup, 'utf8'), original);
  const next = JSON.parse(readFileSync(roster));
  assert.equal(next.custom, true);
  assert.deepEqual(next.pets[0], { id: 'chat-rat', note: 'keep me' });
  assert.equal(next.pets[1].interface, website);
  assert.equal(existsSync(next.pets[1].idle), true);
  const before = readFileSync(roster);
  assert.equal(install({ website, localAppData, apply: true }).changed, false);
  assert.deepEqual(readFileSync(roster), before);
});
test('corrupt roster stays untouched and no assets are installed', () => {
  const localAppData = mkdtempSync(join(tmpdir(), 'door-dormouse-corrupt-20261018-'));
  const folder = join(localAppData, 'astras-pet-apps');
  mkdirSync(folder);
  const roster = join(folder, 'desktop-drafts-20261011.json');
  writeFileSync(roster, '{broken');
  assert.throws(() => install({ website, localAppData, apply: true }));
  assert.equal(readFileSync(roster, 'utf8'), '{broken');
  assert.equal(existsSync(join(folder, 'door-dormouse')), false);
});
