// Mirror Pool's page-check v1.1: the accessibility checks it gained on Astra's "all recommended", 2026-11-12.
// The contrast numbers are WCAG 2.2's (black on white is 21:1; #777 on white is just under 4.5:1).
// Claude Opus 5.5 (claude-opus-5-5), 2026-11-12.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const html = fs.readFileSync(new URL('../apps/platform-platypus-page-check-20261111.html', import.meta.url), 'utf8');
const pick = (name) => {
  const start = html.indexOf(`function ${name}(`);
  assert.ok(start > 0, `${name} is in page-check`);
  let depth = 0, i = html.indexOf('{', start);
  for (; i < html.length; i++) { if (html[i] === '{') depth++; else if (html[i] === '}' && --depth === 0) break; }
  return html.slice(start, i + 1);
};
const ctx = {};
vm.runInNewContext(['parseColor', 'luminance', 'contrastRatio', 'over'].map(pick).join('\n') + '\nthis.f = { parseColor, contrastRatio, over };', ctx);
const { parseColor, contrastRatio, over } = ctx.f;

test('page-check contrast: WCAG numbers', () => {
  assert.equal(Math.round(contrastRatio([0, 0, 0], [255, 255, 255])), 21);
  const grey = contrastRatio([0x77, 0x77, 0x77], [255, 255, 255]);
  assert.ok(grey > 4.4 && grey < 4.5, `#777 on white is ${grey}`);
  assert.deepEqual([...parseColor('rgba(10, 20, 30, 0.5)')], [10, 20, 30, 0.5]);
  assert.deepEqual([...parseColor('rgb(1 2 3 / 50%)')], [1, 2, 3, 0.5]);
  assert.deepEqual([...over([0, 0, 0, 0.5], [255, 255, 255, 1])], [127.5, 127.5, 127.5, 1]);
});

test('page-check lists the three accessibility checks in its report', () => {
  for (const key of ['contrast', 'names', 'keyboard']) assert.match(html, new RegExp(`\\['${key}', '`));
  assert.match(html, /Object\.assign\(out, a11yChecks\(doc, win, visible\)\)/);
});
