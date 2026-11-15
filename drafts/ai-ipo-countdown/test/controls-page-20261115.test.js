// Each app's controls page as Astra laid out AI Discord Presence's (2026-10-28): the heading on its own row, a card
// like Discord's ("Playing", three dots) with nothing under it, no settings section, short button names, and only
// the chosen mode lit. Added here: the countdown to the opening bell under the galaxy.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = (app, file) => readFileSync(join(root, app, file), 'utf8').replace(/\r\n/g, '\n');

for (const app of ['anthropic-ipo-countdown']) {
  test(`${app}: the controls page's layout`, () => {
    const html = read(app, 'public/index-20261115.html');
    assert.doesNotMatch(html, /<nav>|<form|<input|<details/);
    assert.doesNotMatch(html, /id="(setup|settings|update|status|status-line|badge|save-status|dates-note)"/);
    assert.match(html, /<h2 class="headline">[^<]*<br>[^<]*<\/h2>\n<div class="session"><p id="intro">/);
    assert.match(html, /<div class="preview-top"><span>Playing<\/span><span class="dots" aria-hidden="true">•••<\/span><\/div>/);
    assert.match(html, /<\/p><\/div><\/div><\/div>\n<\/aside>/);
    const buttons = html.match(/<div class="buttons">([\s\S]*?)<\/div>/)[1];
    assert.deepEqual([...buttons.matchAll(/>([^<]+)<\/button>/g)].map((m) => m[1]), ['Start', 'Stop', 'Hide Date', 'Quit']);
    assert.doesNotMatch(buttons, /class="primary"/);
    // One link, to the instructions on GitHub.
    assert.match(html, /See <a href="https:\/\/github\.com\/findastra\/ai-ipo-countdown\/blob\/main\/ADDING-A-COMPANY\.md"[^>]*>AI IPO Countdown on GitHub ↗<\/a>\./);
    assert.match(html, /<div class="bell" role="timer"[^>]*><span id="big-count">/);
    assert.match(html, /<canvas data-official-galaxy="(anthropic|openai)"/);
    const js = read(app, 'public/app-20261115.js');
    assert.match(js, /for \(const mode of \['manual', 'off'\]\) \$\(mode\)\.setAttribute\('aria-pressed', String\(state\.mode === mode\)\)/);
    assert.match(js, /\$\('date'\)\.textContent = state\.config\.showDate \? 'Hide Date' : 'Show Date'/);
  });

  test(`${app}: the same base stylesheet as AI Discord Presence, plus only the countdown`, () => {
    const css = read(app, 'public/style-20261115.css');
    const extra = css.slice(css.indexOf('/* IPO countdown (2026-11-15)'));
    assert.ok(extra.length > 0 && extra.length < 1500, 'the IPO additions stay one short block at the end');
    assert.match(css, /\.buttons\{display:flex;flex-wrap:nowrap/);
  });

  test(`${app}: the page learns its state from the app, and loads only the footer star from outside this PC`, () => {
    const server = read(app, 'src/server-20261115.js');
    assert.match(server, /version: VERSION,/);
    const csp = server.match(/'Content-Security-Policy': "([^"]+)"/)[1];
    assert.match(csp, /img-src 'self' https:\/\/findastra\.github\.io;/);
    assert.match(csp, /script-src 'self';/);
  });
}
