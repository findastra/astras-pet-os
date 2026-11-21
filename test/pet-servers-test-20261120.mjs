// Every pet's own server (Astra, 2026-11-20): "every pet gets its own server ... named after their pet program, and
// then dash server dash the date"; one server per pet, and its name written once, as `server` in its pets.json entry
// ("I want the one server per pet ... all recommended everything else"). Flash Audit check A72.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => readFileSync(join(root, file), 'utf8');
const pets = JSON.parse(read('pets.json'));
const programs = JSON.parse(read('pet-programs.json')).programs;
const star = read('scripts/desktop-pets-20261011.cs');
const slug = (name) => String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const withServer = [...(pets.pets || []), ...(pets.pipeline || [])].filter((p) => p.server !== undefined);

test('each server is named after its pet program, then -server- and the date, inside its pet\'s folder', () => {
  assert.ok(withServer.length > 0, 'at least one pet names its server');
  for (const pet of withServer) {
    const program = programs.find((p) => p.repo === pet.repo);
    assert.ok(program, `${pet.repo}: a pet program in pet-programs.json`);
    const file = pet.server.split('/').pop();
    assert.match(pet.server, /^([a-z0-9][a-z0-9-]*\/)*[a-z0-9][a-z0-9-]*-server-20[0-9]{6}\.(exe|mjs|js|ps1)$/, `${pet.repo}: a plain path`);
    assert.ok(file.startsWith(`${slug(program.program)}-server-`), `${pet.repo}: ${file} starts with ${slug(program.program)}-server-`);
  }
});

test('one server per pet, each written once: the star reads it from pets.json and never names the file itself', () => {
  const repos = withServer.map((p) => p.repo);
  assert.equal(new Set(repos).size, repos.length, 'one server per pet');
  for (const pet of withServer) {
    const file = pet.server.split('/').pop();
    assert.ok(!star.includes(file), `the star does not name ${file}`);
    assert.ok(star.includes(`ServerIn("${pet.repo}"`), `the star starts ${pet.repo}'s server from pets.json`);
  }
  assert.ok(star.includes('PetFiles.Text(pet,"server")'), 'the star reads `server` from pets.json');
});

test('the renames so far, easiest first: Benchmark Rock (#408), then Kernel Grove', () => {
  const server = (repo) => pets.pipeline.find((p) => p.repo === repo).server;
  assert.equal(server('benchmark-rock'), 'bin/benchmark-rock-server-20261120.exe');
  assert.equal(server('kernel-grove'), 'bin/kernel-grove-server-20261120.exe');
});
