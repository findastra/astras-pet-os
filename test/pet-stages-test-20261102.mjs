// The pet stages chart in README.md (scripts/pet-stages-20261102.mjs; Astra, 2026-11-02: "make npm test fail if it's
// out of date"). Claude Opus 5.5 (claude-opus-5-5), 2026-11-02.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { STAGES, NUMBERED, stageCounts, buildStagesChart, applyStages } from '../scripts/pet-stages-20261102.mjs';
import { findPets } from '../scripts/pet-finder-20261016.mjs';

const read = (f) => readFileSync(fileURLToPath(new URL(`../${f}`, import.meta.url)), 'utf8');
const registry = JSON.parse(read('pets.json'));
const programs = JSON.parse(read('pet-programs.json')).programs;

test('the README stages chart is up to date with pet-programs.json and the gate (run npm run build)', () => {
  const readme = read('README.md');
  assert.equal(applyStages(readme, programs, registry), readme, 'README.md pet stages chart is out of date: run npm run build');
});

test('every pet program is counted at exactly one stage, and every candidate at the gate', () => {
  const c = stageCounts(programs, registry);
  assert.deepEqual(STAGES.map((s) => s.stage), ['candidate', 'seed', 'roadmap', 'pipeline', 'registered']);
  assert.equal(NUMBERED.reduce((n, s) => n + c[s].pets, 0), programs.length);
  assert.equal(c.candidate.pets, (registry.candidates || []).length);
  // The animals are the registered and pipeline pets, and only they have a pet program page.
  assert.equal(c.registered.pets, registry.pets.length, 'registered pet programs = pets.json pets');
  assert.equal(c.pipeline.pets, registry.pipeline.length, 'pipeline pet programs = pets.json pipeline');
});

test('the chart shows each stage with its count', () => {
  const c = stageCounts(programs, registry);
  const chart = buildStagesChart(programs, registry);
  for (const s of STAGES) assert.ok(chart.includes(`| **${s.name}** |`) && chart.includes(`${s.name} · ${c[s.stage].pets}`), s.stage);
});

test('pet-finder reports a pet at the wrong stage: real work in a seed, or a pet.json that names another stage', () => {
  const prog = (number, stage, repo) => ({ number, program: repo, icon: repo, assigned: true, stage, repo, repo_exists: true });
  const fixture = [prog(1, 'seed', 'tool-seed'), prog(2, 'roadmap', 'page-roadmap'), prog(3, 'seed', 'bare-seed'), prog(4, 'seed', 'says-pipeline')];
  const repos = [
    { name: 'tool-seed', petJson: { pet: 'tool-seed', status: 'seed', tools: [{ name: 'a' }] } },
    { name: 'page-roadmap', petJson: { pet: 'page-roadmap', status: 'roadmap', entry: 'index.html' } },
    { name: 'bare-seed', petJson: { pet: 'bare-seed', status: 'seed', tools: [] } },
    { name: 'says-pipeline', petJson: { pet: 'says-pipeline', status: 'hatching', stage: 'pipeline' } },
  ];
  const found = findPets({ programs: fixture, registry: { ...registry, pets: [], pipeline: [] }, repos }).filter((f) => f.kind === 'wrong-stage');
  assert.deepEqual(found.map((f) => f.repo), ['tool-seed', 'page-roadmap', 'says-pipeline']);
  assert.match(found[0].detail, /lists 1 tool: real work/);
  assert.match(found[2].detail, /pet\.json says pipeline, pet-programs\.json says seed/);
});

test('a stage the chart does not know stops the build', () => {
  const bad = [...programs, { number: 999, program: 'Fixture', stage: 'hatchery', repo: 'fixture', repo_exists: false }];
  assert.throws(() => stageCounts(bad, registry), /unknown stage "hatchery"/);
  assert.throws(() => applyStages('# no markers', programs, registry), /stages:start/);
});
