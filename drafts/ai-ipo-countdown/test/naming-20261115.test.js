// Guards the naming rules across all user-facing text, as AI Discord Presence's naming test does.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
// Every app in the repo: [folder, company as written on the card].
const apps = [['anthropic-ipo-countdown', 'Anthropic']];
const files = ['README.md', 'CLAUDE.md', 'AGENTS.md', 'ADDING-A-COMPANY.md', ...apps.flatMap(([app]) =>
  ['README.md', 'public/index-20261115.html', 'public/app-20261115.js', 'src/server-20261115.js', 'src/launch-20261115.js',
    'scripts/startup-20261115.js', 'src/windows-startup-20261115.js', 'package.json'].map(f => `${app}/${f}`))];
const forbidden = [
  [/\b(Anthropic|OpenAI) (IPO )?Presence\b/, 'app titles are "<Company> IPO Countdown"'],
  [/Countdown Discord Presence/, 'the repo is AI IPO Countdown; the apps are "<Company> IPO Countdown"'],
  [/\bconfirmed\b/i, 'the dates are reported, never "confirmed"'],
  [/\b(buy|sell) (now|shares|the stock)\b/i, 'not financial advice: never tell anyone to buy or sell'],
];

test('user-facing text follows the naming rules', () => {
  const problems = [];
  for (const file of files) {
    readFileSync(join(root, file), 'utf8').split('\n').forEach((line, i) => {
      // Allowed on purpose: the rule itself, quoted in AGENTS.md and the adding guide.
      if (line.includes('never call a reported date confirmed')) return;
      for (const [pattern, why] of forbidden) if (pattern.test(line)) problems.push(`${file}:${i + 1}: ${why}\n    ${line.trim().slice(0, 120)}`);
    });
  }
  assert.deepEqual(problems, [], '\n' + problems.join('\n'));
});

test('each app uses its folder name for its title, start file, card title and download', () => {
  for (const [app, company] of apps) {
    const title = `${company} IPO Countdown`;
    assert.match(readFileSync(join(root, app, 'README.md'), 'utf8'), new RegExp(`^# ${title}\\r?\\n`));
    assert.match(readFileSync(join(root, app, 'src/card-20261115.js'), 'utf8'), new RegExp(`company: '${company}'`));
    assert.match(readFileSync(join(root, app, 'public/index-20261115.html'), 'utf8'), new RegExp(`<title>${title}</title>`));
    readFileSync(join(root, app, `Start ${title}.cmd`)); // throws if the start file is missing
    assert.match(readFileSync(join(root, app, 'Enable Automatic Startup.cmd'), 'utf8'), new RegExp(`Start ${title}\\.cmd`));
    assert.match(readFileSync(join(root, 'scripts/package.mjs'), 'utf8'), new RegExp(`'${app}'`));
    assert.match(readFileSync(join(root, 'README.md'), 'utf8'), new RegExp(`downloads/${app}\\.zip`));
  }
});
