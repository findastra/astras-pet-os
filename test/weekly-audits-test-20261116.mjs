// Every pet program has an audit that runs at least once a week (Astra, 2026-11-16: "all 85 pets should have audits
// that they do on a weekly basis"). Claude Opus 5.5 (claude-opus-5-5), 2026-11-16.
//
// Where a pet program's audit lives follows its stage: its pets.json entry once it is an animal (registered or
// pipeline), its entry in pets.json `seeds` while it is a seed, and its System Map node while it is a roadmap pet (or a
// seed with no seed entry yet). Only animals are audited by the Friendly Farmer's round today; a seed's or roadmap pet's
// audit is its plan, and it moves into pets.json with the pet when the pet hatches.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (f) => JSON.parse(readFileSync(new URL(`../${f}`, import.meta.url), 'utf8'));
const registry = read('pets.json');
const programs = read('pet-programs.json').programs;
const map = read('system-map.json');

const slug = (s) => s.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const undecided = (text) => /placeholder|not decided/i.test(text || '');

function auditHome(prog) {
  if (['registered', 'pipeline'].includes(prog.stage)) {
    const r = [...registry.pets, ...registry.pipeline].find((p) => p.repo === prog.repo);
    return r && { where: `pets.json entry ${r.repo}`, audit: r.audit, job: r.job };
  }
  const seed = (registry.seeds.pets || []).find((s) => s.pet === prog.icon);
  if (seed) return { where: `pets.json seed ${seed.pet}`, audit: seed.audit, job: seed.job };
  const node = map.nodes.find((n) => n.id === slug(prog.icon)) || map.nodes.find((n) => n.program === prog.number);
  return node && { where: `system-map.json node ${node.id}`, audit: node.audit, job: node.job };
}

test('every pet program has an audit block that runs weekly (the host daily)', () => {
  assert.ok(programs.length > 80, 'pet-programs.json lists every pet program');
  for (const prog of programs) {
    const home = auditHome(prog);
    const who = `#${prog.number} ${prog.icon} (${prog.program})`;
    assert.ok(home, `${who} has no record to hold its audit (pets.json or a System Map node)`);
    const a = home.audit;
    assert.ok(a && typeof a === 'object', `${who} has no audit block in ${home.where}`);
    assert.ok(['weekly', 'daily'].includes(a.cadence), `${who}: audit cadence is ${a.cadence}, not weekly (or daily)`);
    for (const k of ['subject', 'needs']) {
      assert.ok(typeof a[k] === 'string' && a[k].trim(), `${who}: its audit in ${home.where} has no ${k}`);
    }
  }
});

test('an audit says what it checks: "my plan" only while the pet\'s job is not decided', () => {
  // The mini-descriptor in pet-programs.json is read first: it holds a confirmed part of a job (a security role) even
  // when the pets.json job still says "Placeholder".
  for (const prog of programs) {
    const home = auditHome(prog);
    if (!home?.audit || home.audit.subject !== 'my plan') continue;
    const job = prog.mini_descriptor?.text || home.job;
    assert.ok(undecided(job), `#${prog.number} ${prog.icon} has a job ("${job}"), so its audit should say what it checks, not "my plan"`);
  }
});
