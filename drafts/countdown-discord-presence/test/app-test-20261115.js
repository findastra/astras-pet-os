import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, existsSync, readdirSync } from 'node:fs';
import * as fs from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { activity, validateConfig, Presence, remaining, shortDate, daysLeft, phase, HOURGLASS_URL, BUILT_IN_CLIENT_ID } from '../src/card-20261115.js';
import { setStartup, startupEnabled, LAUNCHER_NAME } from '../src/windows-startup-20261115.js';
import { makeCardPng, makeIconPng, CARD_SIZE } from '../scripts/make-hourglass-art-20261115.js';

const at = (...parts) => Date.UTC(...parts) / 1000;
// Friday 25 December 2026, 6pm, read in UTC (offset 0) so the tests pass in any time zone.
const PARTY = at(2026, 11, 25, 18);
const UTC = 0;
const config = validateConfig({ event: 'My birthday', targetAt: PARTY });

test('days are whole calendar days in the PC\'s time zone', () => {
  assert.equal(daysLeft(PARTY, at(2026, 11, 13, 9), UTC), 12);
  // Late the night before is "Tomorrow", never "0 days".
  assert.equal(remaining(PARTY, at(2026, 11, 24, 23), UTC), 'Tomorrow');
  assert.equal(remaining(PARTY, at(2026, 11, 25, 1), UTC), 'Today');
  assert.equal(remaining(PARTY, at(2026, 11, 13), UTC), '12 days to go');
  // Far away, weeks read better than "200 days".
  assert.equal(remaining(PARTY, at(2026, 4, 1), UTC), '34 weeks to go');
  assert.equal(remaining(PARTY, PARTY, UTC), 'here');
  // Denver is UTC−7 in December: 11pm on the 24th there is already the 25th in UTC, but still "Tomorrow" at home.
  assert.equal(remaining(at(2026, 11, 26, 1), at(2026, 11, 25, 6), 7 * 60), 'Tomorrow');
  assert.equal(shortDate(PARTY, UTC), 'Fri, Dec 25');
});

test('the card counts days, then shows Discord\'s live timer on the last day', () => {
  const far = activity(config, at(2026, 11, 13), UTC);
  assert.equal(far.name, 'Countdown');
  assert.equal(far.details, 'My birthday');
  assert.equal(far.state, '12 days to go · Fri, Dec 25');
  assert.equal(far.timestamps, undefined);
  assert.equal(far.assets.large_image, HOURGLASS_URL);
  assert.equal(far.assets.large_text, 'Fri, Dec 25');
  const lastDay = activity(config, PARTY - 5 * 3600, UTC);
  assert.equal(lastDay.state, 'Today');
  assert.deepEqual(lastDay.timestamps, { end: PARTY });
  // Within 24 hours but on the day before: the words say tomorrow, Discord's timer counts the hours.
  const eve = activity(config, PARTY - 20 * 3600, UTC);
  assert.equal(eve.state, 'Tomorrow · Fri, Dec 25');
  assert.deepEqual(eve.timestamps, { end: PARTY });
  assert.equal(activity({ ...config, showDate: false }, at(2026, 11, 13), UTC).state, '12 days to go');
  assert.equal(activity({ ...config, showDate: false }, at(2026, 11, 13), UTC).assets.large_text, 'Countdown');
});

test('when the moment comes it celebrates for a day, then the card goes away', () => {
  const party = activity(config, PARTY + 60, UTC);
  assert.equal(party.state, "It's here!");
  assert.equal(party.timestamps, undefined);
  assert.equal(phase(config, PARTY + 23 * 3600), 'celebrating');
  assert.equal(activity(config, PARTY + 24 * 3600, UTC), null);
  assert.equal(phase(config, PARTY + 24 * 3600), 'over');
  assert.equal(activity({ ...config, celebrateHours: 0 }, PARTY, UTC), null);
  assert.equal(activity(validateConfig({}), PARTY, UTC), null);
});

test('settings default to the recommended answers and reject bad values', () => {
  assert.equal(BUILT_IN_CLIENT_ID, '');
  assert.deepEqual(validateConfig({}), { clientId: '', image: HOURGLASS_URL, title: 'Countdown', event: 'Something big',
    targetAt: null, showDate: true, celebrateHours: 24, automaticOnStart: true });
  assert.throws(() => validateConfig({ clientId: '123' }), /Application ID/);
  assert.equal(validateConfig({ clientId: '1555096326734094356' }).clientId, '1555096326734094356');
  assert.throws(() => validateConfig({ targetAt: 'tomorrow' }), /date and time/);
  assert.throws(() => validateConfig({ targetAt: 12 }), /date and time/);
  assert.throws(() => validateConfig({ title: 'x' }), /title/);
  assert.throws(() => validateConfig({ event: '   ' }), /counting down to/);
  assert.throws(() => validateConfig({ celebrateHours: 999 }), /Celebrate/);
  // Control characters never reach Discord.
  assert.equal(validateConfig({ event: 'Tour\n\u0000starts' }).event, 'Tour starts');
  assert.equal(validateConfig({ image: 'https://raw.githubusercontent.com/findastra/countdown-discord-presence/main/public/hourglass-card-20261115.png?v=0' }).image, HOURGLASS_URL);
  assert.throws(() => validateConfig({ image: 'javascript:alert(1)' }), /image/);
});

test('Start and Stop are the only modes', () => {
  const presence = new Presence();
  assert.equal(presence.mode, 'off');
  presence.setMode('manual');
  assert.equal(presence.mode, 'manual');
  assert.throws(() => presence.setMode('auto'), /Start or Stop/);
});

test('the Windows startup file points at this copy and can be removed', () => {
  const dir = mkdtempSync(join(tmpdir(), 'countdown-presence-'));
  const opts = { io: fs, appRoot: join(dir, 'app'), platform: 'win32', appdata: join(dir, 'appdata'), execPath: 'C:\\node\\node.exe' };
  assert.equal(setStartup(true, opts).automaticOnStart, true);
  const vbs = join(dir, 'appdata', 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup', LAUNCHER_NAME);
  assert.equal(LAUNCHER_NAME, 'countdown-discord-presence-20261115.vbs');
  assert.match(readFileSync(vbs, 'utf8'), /launch-20261115\.js"" --background/);
  assert.equal(startupEnabled(opts), true);
  setStartup(false, opts);
  assert.equal(existsSync(vbs), false);
  assert.equal(JSON.parse(readFileSync(join(dir, 'app', '.local', 'config.json'), 'utf8')).automaticOnStart, false);
});

test('the card picture and the icon are the same drawing and match the shipped files', () => {
  const card = makeCardPng();
  assert.deepEqual(card.subarray(1, 4), Buffer.from('PNG'));
  assert.equal(card.readUInt32BE(16), CARD_SIZE);
  assert.ok(card.length < 1024 * 1024);
  assert.deepEqual(readFileSync(new URL('../public/hourglass-card-20261115.png', import.meta.url)), card);
  assert.deepEqual(readFileSync(new URL('../public/hourglass-icon-20261115.png', import.meta.url)), makeIconPng());
});

test('every file the page asks for is served, and nothing from the Ableton app was left behind', () => {
  const html = readFileSync(new URL('../public/index-20261115.html', import.meta.url), 'utf8');
  const server = readFileSync(new URL('../src/server-20261115.js', import.meta.url), 'utf8');
  for (const [, file] of html.matchAll(/(?:src|href)="\.\/([^"]+)"/g)) assert.match(server, new RegExp(`'/${file.replace('.', '\\.')}'`), file);
  const root = new URL('../', import.meta.url);
  for (const dir of ['src', 'public', 'scripts']) for (const name of readdirSync(new URL(dir + '/', root))) {
    if (name.endsWith('.png')) continue;
    assert.doesNotMatch(readFileSync(new URL(`${dir}/${name}`, root), 'utf8'), /ableton|apc64|38765/i, `${dir}/${name}`);
  }
});
