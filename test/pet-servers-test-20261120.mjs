// Every pet's own server (Astra, 2026-11-20): "every pet gets its own server ... named after their pet program, and
// then dash server dash the date"; one server per pet, and its name written once, as `server` in its pets.json entry
// ("I want the one server per pet ... all recommended everything else"). Flash Audit check A72.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
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

test('the renames so far, easiest first: Benchmark Rock (#408), Kernel Grove (#411), White Hat Lab (#425), then Wonderland Launchpad', () => {
  const server = (repo) => pets.pipeline.find((p) => p.repo === repo).server;
  assert.equal(server('benchmark-rock'), 'bin/benchmark-rock-server-20261120.exe');
  assert.equal(server('kernel-grove'), 'bin/kernel-grove-server-20261120.exe');
  // White Hat Lab's server is one of the hub's own scripts (the hub carries its tools), so the hub has the file.
  assert.equal(server('white-hat-lab'), 'scripts/white-hat-lab-server-20261120.mjs');
  assert.ok(existsSync(join(root, server('white-hat-lab'))), 'the hub has White Hat Lab\'s server');
  assert.ok(!existsSync(join(root, 'scripts', 'port-watch-20261119.mjs')), 'and not its old name');
  // Wonderland Launchpad's server is the launcher Rift Rabbit installs in its program folder in Astra's PetOS Data, so
  // its name is a plain file name there, and the page tells Astra to start it from the star instead of naming it.
  assert.equal(server('rift-rabbit'), 'wonderland-launchpad-server-20261121.exe');
  assert.ok(star.includes('ServerIn("rift-rabbit",rabbitDir,'), 'the star starts it from that program folder');
  const page = read('apps/pet-programs/vrchat-launcher-20261024.js');
  assert.ok(!page.includes('rift-rabbit-20261024.exe') && page.includes('Start it from Startup Star'), 'the Launch buttons name no program file');
});

test("PC Master Race's server is a node script the star starts at sign-in; The Pilot Plant's look runs once and is no server", () => {
  const pet = (repo) => [...pets.pets, ...pets.pipeline].find((p) => p.repo === repo);
  assert.equal(pet('pc-master-race').server, 'pc-master-race-server-20261120.mjs');
  assert.equal(pet('the-pilot-plant').server, undefined, 'a look that runs once and exits is not a server');
  assert.match(star, /AlsoAtSignIn=\{[^}]*"pc-master-race"[^}]*"the-pilot-plant"/);
  assert.match(star, /RunOnce=\{"the-pilot-plant"\}/);
  assert.ok(star.includes('"--look"'), 'the look runs with --look');
});

test("Workflow Whirlpool's server runs Workflow Whale's two watches; the star starts it at sign-in from his folder, with his menu", () => {
  const pet = (repo) => [...pets.pets, ...pets.pipeline].find((p) => p.repo === repo);
  const whale = pet('workflow-whirlpool');
  assert.equal(whale.server, 'workflow-whirlpool-server-20261120.mjs');
  assert.deepEqual(whale.tools.map((t) => t.name), ['screen-watch', 'deskflow-watch', 'ipad-workflow-caster']);
  assert.match(star, /AlsoAtSignIn=\{[^}]*"workflow-whirlpool"/);
  assert.ok(star.includes('ServerIn("workflow-whirlpool",Path.Combine(parent,"workflow-whirlpool"),null)'), 'from the pet\'s own folder');
  assert.ok(star.includes('Folder=Path.Combine(DataRoot,"workflow-whirlpool")'), 'his menu file is read from his data folder');
});
