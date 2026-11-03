// The pet stages chart in README.md, a tool of The Farm (Friendly Farmer). Astra, 2026-11-02: "Explain the pet stages
// (candidate, seed, roadmap, pipeline, registered) in a chart with how many pets are in each, and put that chart in
// README.md. Have npm run build write it from pet-programs.json between markers, like the pet table, and make npm test
// fail if it's out of date."
// The numbered stages and their counts come from pet-programs.json; the candidates, which have no number yet, from
// pets.json `candidates`. What each stage means is written once, here (PET-WORDS.md points at the chart).
// Run by `npm run build`; test/pet-stages-test-20261102.mjs fails when README.md is out of date.
// Claude Opus 5.5 (claude-opus-5-5), 2026-11-02.

export const STAGES_START = '<!-- stages:start (generated from pet-programs.json and pets.json by scripts/pet-stages-20261102.mjs; do not edit by hand) -->';
export const STAGES_END = '<!-- stages:end -->';

// In the order a pet moves through them. `page`: the pet program spawner gives it a page (only animals have one).
export const STAGES = [
  { stage: 'candidate', name: 'Candidate', kept: 'pets.json `candidates`', page: false,
    means: 'Found, waiting at the gate. A repo or PC folder that might be a pet; Astra has not said yes, so it has no number.' },
  { stage: 'seed', name: 'Seed', kept: 'pet-programs.json', page: false,
    means: 'Approved pet idea, nothing built. It has a number, a name and a job, and it may have a starter repo (a README and a pet.json), but no working tool yet.' },
  { stage: 'roadmap', name: 'Roadmap', kept: 'pet-programs.json', page: false,
    means: 'Approved for later. A pet the PetOS plan needs (servers, security, sync and the like); it may have a starter repo, but its work has not started.' },
  { stage: 'pipeline', name: 'Pipeline', kept: 'pet-programs.json and pets.json `pipeline`', page: true,
    means: 'Being built. Its repo has real work (a tool or a page), or Astra has said it is being built; it is an animal in pets.json and has its pet program page. Its art is not registered yet.' },
  { stage: 'registered', name: 'Registered', kept: 'pet-programs.json and pets.json `pets`', page: true,
    means: 'Released. In pets.json `pets` with its registered art, in the pet table below and on the desktop.' },
];
export const NUMBERED = STAGES.filter((s) => s.stage !== 'candidate').map((s) => s.stage);

/** { stage: { pets, repos } } for every stage. repos: how many have a GitHub repo (`repo_exists`); null for candidates. */
export function stageCounts(programs, registry) {
  const counts = Object.fromEntries(STAGES.map((s) => [s.stage, { pets: 0, repos: s.stage === 'candidate' ? null : 0 }]));
  counts.candidate.pets = (registry.candidates || []).length;
  for (const p of programs) {
    if (!NUMBERED.includes(p.stage)) throw new Error(`Pet program #${p.number} (${p.program}): unknown stage "${p.stage}". The stages are ${NUMBERED.join(', ')} (scripts/pet-stages-20261102.mjs).`);
    counts[p.stage].pets += 1;
    if (p.repo_exists) counts[p.stage].repos += 1;
  }
  return counts;
}

export function buildStagesChart(programs, registry) {
  const c = stageCounts(programs, registry);
  const rows = STAGES.map((s) => `| **${s.name}** | ${s.means} | ${s.kept} | ${s.page ? 'yes' : 'no'} | ${c[s.stage].pets} | ${c[s.stage].repos ?? 'not counted'} |`);
  const pages = STAGES.filter((s) => s.page).reduce((n, s) => n + c[s.stage].pets, 0);
  const box = (s) => `${s}["${STAGES.find((x) => x.stage === s).name} · ${c[s].pets}"]`;
  return [
    '```mermaid',
    'flowchart LR',
    `  ${box('candidate')} -->|Astra lets it in| ${box('seed')}`,
    `  candidate -->|Astra lets it in| ${box('roadmap')}`,
    `  seed -->|real work in its repo| ${box('pipeline')}`,
    '  roadmap -->|real work in its repo| pipeline',
    `  pipeline -->|art registered| ${box('registered')}`,
    '```',
    '',
    '| Stage | What it means | Kept in | Pet program page | Pets | With a GitHub repo |',
    '|---|---|---|---|---|---|',
    ...rows,
    '',
    `${programs.length} numbered pet programs and ${c.candidate.pets} candidates at the gate. ${pages} have a pet program page (registered and pipeline).`,
  ].join('\n');
}

export function applyStages(readme, programs, registry) {
  const a = readme.indexOf(STAGES_START), b = readme.indexOf(STAGES_END);
  if (a < 0 || b < a) throw new Error('README.md is missing the stages:start / stages:end markers');
  return readme.slice(0, a) + STAGES_START + '\n' + buildStagesChart(programs, registry) + '\n' + readme.slice(b);
}
