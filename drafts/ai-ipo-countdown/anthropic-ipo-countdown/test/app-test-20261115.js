import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, existsSync, readdirSync } from 'node:fs';
import * as fs from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { activity, validateConfig, Presence, countdownLine, shortDate, daysLeft, phase, EDITION, GALAXY_URL, BUILT_IN_CLIENT_ID } from '../src/card-20261115.js';
import { setStartup, startupEnabled, LAUNCHER_NAME } from '../src/windows-startup-20261115.js';

const at = (...parts) => Date.UTC(...parts) / 1000;
// The tests read times in New York (UTC−5 in November) so they pass in any time zone.
const NY = 5 * 60;
const config = validateConfig({});
const BELL = at(2026, 10, 19, 14, 30);

test('the edition is Anthropic on Nasdaq as ANT, first trade Thursday 19 November 2026 at the opening bell', () => {
  assert.deepEqual([EDITION.company, EDITION.ticker, EDITION.exchange], ['Anthropic', 'ANT', 'Nasdaq']);
  assert.equal(EDITION.targetAt, BELL);
  assert.equal(EDITION.pricingAt, at(2026, 10, 18, 22));
  assert.equal(shortDate(BELL, NY), 'Thu, Nov 19');
  assert.equal(config.title, 'Anthropic IPO');
});

test('the card counts days, names pricing day, then shows Discord\'s live timer on the last day', () => {
  const sunday = activity(config, at(2026, 10, 15, 17), NY);
  assert.equal(sunday.name, 'Anthropic IPO');
  assert.equal(sunday.details, 'Nasdaq: ANT · Thu, Nov 19');
  assert.equal(sunday.state, '4 days to go');
  assert.equal(sunday.timestamps, undefined);
  assert.equal(sunday.assets.large_image, GALAXY_URL);
  assert.equal(sunday.assets.large_text, 'Anthropic IPO · Thu, Nov 19');
  // Wednesday: pricing day, before and after the price is set.
  assert.equal(countdownLine(config, at(2026, 10, 18, 15), NY), 'Pricing today');
  assert.equal(countdownLine(config, at(2026, 10, 18, 23), NY), 'Priced · trading tomorrow');
  // Within 24 hours of the bell Discord counts down itself.
  assert.deepEqual(activity(config, at(2026, 10, 18, 23), NY).timestamps, { end: BELL });
  assert.equal(activity(config, at(2026, 10, 19, 12), NY).state, 'Opening bell today');
  // Without a pricing date the night before is just tomorrow; far away it counts weeks.
  assert.equal(countdownLine({ ...config, pricingAt: null }, at(2026, 10, 18, 23), NY), 'Trading tomorrow');
  assert.equal(countdownLine(config, at(2026, 6, 1), NY), '20 weeks to go');
  const quiet = activity({ ...config, showDate: false }, at(2026, 10, 15), NY);
  assert.deepEqual([quiet.details, quiet.assets.large_text], ['Nasdaq: ANT', 'Anthropic IPO']);
});

test('after the bell it says it is trading and counts up from the bell for a day, then the card goes away', () => {
  const live = activity(config, BELL + 90, NY);
  assert.equal(live.details, 'Now trading on Nasdaq: ANT');
  assert.equal(live.state, "It's here!");
  assert.deepEqual(live.timestamps, { start: BELL });
  assert.equal(phase(config, BELL + 23 * 3600), 'trading');
  assert.equal(activity(config, BELL + 24 * 3600, NY), null);
  assert.equal(activity({ ...config, celebrateHours: 0 }, BELL, NY), null);
  assert.equal(activity({ ...config, targetAt: null }, BELL, NY), null);
});

test('settings default to the reported dates and reject bad values', () => {
  assert.equal(BUILT_IN_CLIENT_ID, '');
  assert.deepEqual(validateConfig({}), { clientId: '', image: GALAXY_URL, title: 'Anthropic IPO', ticker: 'ANT', exchange: 'Nasdaq',
    targetAt: BELL, pricingAt: at(2026, 10, 18, 22), showDate: true, celebrateHours: 24, automaticOnStart: true });
  // A moved date is kept; pricing can be cleared.
  assert.equal(validateConfig({ targetAt: BELL + 86400 }).targetAt, BELL + 86400);
  assert.equal(validateConfig({ pricingAt: null }).pricingAt, null);
  assert.equal(validateConfig({ ticker: 'ant' }).ticker, 'ANT');
  assert.throws(() => validateConfig({ clientId: '123' }), /Application ID/);
  assert.equal(validateConfig({ clientId: '1555096326734094356' }).clientId, '1555096326734094356');
  assert.throws(() => validateConfig({ targetAt: 'Thursday' }), /first trade/);
  assert.throws(() => validateConfig({ targetAt: null }), /first trade/);
  assert.throws(() => validateConfig({ ticker: '$$' }), /ticker/);
  assert.throws(() => validateConfig({ exchange: 'x' }), /exchange/);
  assert.throws(() => validateConfig({ celebrateHours: 999 }), /Celebrate/);
  // Control characters never reach Discord.
  assert.equal(validateConfig({ exchange: 'Nas\ndaq' }).exchange, 'Nas daq');
  assert.equal(validateConfig({ image: 'https://raw.githubusercontent.com/findastra/ai-discord-presence/main/anthropic-discord-presence/public/galaxy-card.gif?v=3' }).image, GALAXY_URL);
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
  const dir = mkdtempSync(join(tmpdir(), 'anthropic-ipo-'));
  const opts = { io: fs, appRoot: join(dir, 'app'), platform: 'win32', appdata: join(dir, 'appdata'), execPath: 'C:\\node\\node.exe' };
  assert.equal(setStartup(true, opts).automaticOnStart, true);
  const vbs = join(dir, 'appdata', 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup', LAUNCHER_NAME);
  assert.equal(LAUNCHER_NAME, 'anthropic-ipo-countdown-20261115.vbs');
  assert.match(readFileSync(vbs, 'utf8'), /launch-20261115\.js"" --background/);
  assert.equal(startupEnabled(opts), true);
  setStartup(false, opts);
  assert.equal(existsSync(vbs), false);
  assert.equal(JSON.parse(readFileSync(join(dir, 'app', '.local', 'config.json'), 'utf8')).automaticOnStart, false);
});

test('the gold galaxy is the Anthropic presence app\'s approved art, and every file the page asks for is served', () => {
  const root = new URL('../', import.meta.url);
  const gif = readFileSync(new URL('public/galaxy-card.gif', root));
  assert.equal(gif.subarray(0, 6).toString(), 'GIF89a');
  // Discord shows no picture for a GIF of 10 MB or more.
  assert.ok(gif.length < 10 * 1024 * 1024);
  assert.match(readFileSync(new URL('public/official-galaxy-data-20261030.js', root), 'utf8'), /officialGalaxyData\.anthropic=/);
  const html = readFileSync(new URL('public/index-20261115.html', root), 'utf8');
  assert.match(html, /data-official-galaxy="anthropic"/);
  const server = readFileSync(new URL('src/server-20261115.js', root), 'utf8');
  for (const [, file] of html.matchAll(/(?:src|href)="\.\/([^"]+)"/g)) assert.ok(server.includes(`'/${file}'`), file);
  for (const dir of ['src', 'public', 'scripts']) for (const name of readdirSync(new URL(dir + '/', root))) {
    if (!/\.(?:js|html|css)$/.test(name) || name.startsWith('official-galaxy')) continue;
    assert.doesNotMatch(readFileSync(new URL(`${dir}/${name}`, root), 'utf8'), /ableton|apc64|38765|hourglass/i, `${dir}/${name}`);
  }
});
