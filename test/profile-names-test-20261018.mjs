// The profile shows every pet's name and pet program name from pet-programs.json, and keeps Astra's own edits
// (Astra, 2026-10-17/18). Claude Opus 5.5 (claude-opus-5-5), 2026-10-18.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { syncProfile } from '../scripts/farmer-profile-20261009.mjs';

const read = (f) => JSON.parse(readFileSync(new URL('../' + f, import.meta.url), 'utf8'));
const programs = read('pet-programs.json').programs;
const registry = read('pets.json');
// The same slug the round uses for a home's name: "Mommy’s HQ" is `mommys-hq`.
const slug = (s) => s.toLowerCase().replace(/['’]/g, '').replace(/&/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const readme = `<h2 align="center">Hi</h2>

### Web & More
- [\`fuzzboi-factory\`](https://github.com/findastra/fuzzbois) -- NFT generator for hand-drawn characters

### Astra's PetOS

Astra's PetOS home repo: [\`astras-pet-os\`](https://github.com/findastra/astras-pet-os)

1. **[Friendly Farmer](https://github.com/findastra/astras-pet-os)** -- organizes the pets
`;

test('every pet on GitHub shows its icon name and its pet program name from pet-programs.json', () => {
  const repos = [...new Set(programs.map((p) => p.repo))].map((name) => ({ name, private: false, description: '' }));
  const lines = syncProfile(readme, registry, repos, programs).text.split('\n');
  for (const p of programs) {
    const i = lines.findIndex((l) => l.startsWith(`${p.number}. `));
    assert.ok(i >= 0, `#${p.number} ${p.icon} is listed`);
    assert.ok(lines[i].startsWith(`${p.number}. **[${p.icon}](https://github.com/findastra/${p.repo})** -- `), `#${p.number}: ${lines[i]}`);
    const home = p.assigned ? slug(p.program) : `pet-program-${p.number}`;
    assert.match(lines[i + 1], new RegExp(`^ +- \\[?\`${home}\`(?:\\]\\([^)]+\\))? -- `), `#${p.number} ${p.icon}'s home is ${p.program}: ${lines[i + 1]}`);
  }
  assert.ok(programs.every((p) => p.assigned), 'naming audit round 4: every pet program is named');
});

test('a pet whose repo is private is listed without a repo link; its home opens its pet program page on The Farm', () => {
  const repos = programs.filter((p) => p.repo !== 'claude-bot').map((p) => ({ name: p.repo, private: false, description: '' }));
  const text = syncProfile(readme, registry, repos, programs).text;
  // Astra, 2026-10-19: "one click always points to program page (Pet Program)". The page is in the public hub.
  assert.match(text, /^21\. \*\*Claude Bot\*\* -- [^\n]+\n {4}- \[`claude-dock`\]\(https:\/\/findastra\.github\.io\/astras-pet-os\/apps\/pet-programs\/claude-bot-20261018\.html\) -- the pet program$/m);
});

test('a line Astra labelled with another name stays, and its repo is not added again (fuzzboi-factory, 2026-10-17)', () => {
  const repos = [{ name: 'astras-pet-os', private: false, description: '' }, { name: 'fuzzbois', private: false, description: 'Make your Fuzzboi' }];
  const { text } = syncProfile(readme, registry, repos, programs);
  assert.match(text, /^- \[`fuzzboi-factory`\]\(https:\/\/github\.com\/findastra\/fuzzbois\) -- NFT generator for hand-drawn characters$/m);
  assert.doesNotMatch(text, /\[`fuzzbois`\]/, 'fuzzbois is not listed a second time');
  const gone = syncProfile(readme, registry, [repos[0]], programs).text;
  // Her line, exactly: Fuzzboi Friend's own pet program is also called fuzzboi-factory, and a private pet stays listed
  // (his repo went private on 2026-10-20).
  assert.doesNotMatch(gone, /\[`fuzzboi-factory`\]\(https:\/\/github\.com\/findastra\/fuzzbois\)/, 'a line whose repo is gone from GitHub is still dropped');
});

test('a line Astra writes with a dash instead of " -- " is kept as written and its repo is not added again (2026-10-18)', () => {
  const mine = "- [`findastra.github.io`](https://github.com/findastra/findastra.github.io) -— Astra's  portfolio: worlds, projects, pets";
  const text = readme.replace('### Astra\'s PetOS', `${mine}\n\n### Astra's PetOS`);
  const repos = [{ name: 'astras-pet-os', private: false, description: '' }, { name: 'findastra.github.io', private: false, description: 'The one place that connects two names' }];
  const out = syncProfile(text, registry, repos, programs).text;
  assert.ok(out.split('\n').includes(mine), 'her line stays word for word');
  assert.equal(out.match(/\[`findastra\.github\.io`\]/g).length, 1, 'the repo is not added a second time');
  assert.doesNotMatch(out, /connects two names/, 'the GitHub description does not come back');
});

test('a repo Astra links above the list is not repeated under its pet; without her line it is (2026-10-17)', () => {
  const repos = ['astras-pet-os', 'startup-star'].map((name) => ({ name, private: false, description: '' }));
  const above = syncProfile(readme, registry, repos, programs).text;
  assert.equal(above.match(/\[`astras-pet-os`\]/g).length, 1, 'said once, on her own line');
  assert.match(above, /^Astra's PetOS home repo: \[`astras-pet-os`\]/m);
  assert.match(above, /^1\. [^\n]+\n {3}- \[`the-farm`\]\([^)]+\) -- the pet program\n {3}- \[`startup-star`\]/m, 'the home, then the tools');
  const without = syncProfile(readme.replace(/^Astra's PetOS home repo: .*\n\n/m, ''), registry, repos, programs).text;
  assert.match(without, /^ {3}- \[`astras-pet-os`\]\([^)]+\) -- Astra's PetOS home repo$/m);
  assert.deepEqual(syncProfile(above, registry, repos, programs).changes, [], 'a second run changes nothing');
});
