# The pet stages chart, the stage rule, tools from each pet's pet.json, and the Farm's green page

2026-11-02, Claude Opus 5.5 (`claude-opus-5-5`), branch `claude/pet-stages-chart-20261102` (the "Friendly Farmer" chat;
it took over from a cloud session that changed nothing).

## The pet stages chart

Astra, 2026-11-02: "Explain the pet stages (candidate, seed, roadmap, pipeline, registered) in a chart with how many
pets are in each, and put that chart in README.md. Have npm run build write it from pet-programs.json between markers,
like the pet table, and make npm test fail if it's out of date."

- `scripts/pet-stages-20261102.mjs`: what each stage means (written once, there), the counts from pet-programs.json
  and pets.json `candidates`, and the chart (a flow diagram and a table) between `stages:start` / `stages:end` in
  README.md's new **Pet stages** section. `npm run build` writes it; `test/pet-stages-test-20261102.mjs` fails when it
  is out of date, when a pet program has a stage the chart does not know, or when the registered and pipeline counts
  disagree with pets.json.
- On 2026-11-02: 4 candidates, 15 seeds, 25 roadmap pets, 21 pipeline, 23 registered. All 84 numbered pets have a
  GitHub repo, so PET-WORDS.md no longer says a seed has "no repo yet": a seed or roadmap pet may have a starter repo;
  real work (a tool or a page) is what makes it a pipeline pet.
- README.md no longer hard-codes "38 registered and pipeline pets" (there are 44).

## The stage rule

Astra, same message: "Make it a rule (AGENTS.md, the Farmer's round and pet-finder) that when the Farmer hatches a pet
or an audit finds a repo at the wrong stage, he updates pet-programs.json and rebuilds."

- AGENTS.md (beside the gate), PET-FILES.md (the daily round), skills/pet-finder/SKILL.md and README.md say it: update
  `stage` in pet-programs.json (and pets.json when it becomes an animal), `npm run build`, a pull request Astra merges.
- The pet-finder tool reports `wrong-stage`: a seed or roadmap pet whose pet.json lists tools or an `entry` page, or a
  pet whose own pet.json names another stage. On main today it finds Skill Scout, Journal Jellyfish and AI Dashund.

## Tools from each pet's own pet.json

Astra, same message: "fix the spawner so those pets get their pages, with their tools read from their own pet.json."

- `adoptTools` in the Farmer's round copies a pet's pet.json `tools` into its pets.json entry, like `adoptVersion`:
  short plain fields only (name, label, use, entry, visibility, version, planned), an `entry` only as a path inside the
  pet's repo. A tool whose code is still in an open pull request (`merged: false`) is planned.
- The pet program spawner adds those tools after the System Map's, unless the map already has the tool (matched by
  id, label or name: `toolKey`). Copied once now for the 13 animals that list tools; two pages gain one:
  Portfolio Puffer's Handwritten Message Manager and Benchmark Rock's device-watch (planned).
- Test: `test/pet-json-tools-test-20261102.mjs`.

## The Farm's own colours

Astra, 2026-11-02: "I don't like the raspberry color of the farm. Let's change it to like dark green, something else,
something interesting that we haven't already used for a pet program."

- `apps/pet-programs/pet-program-page-20261018.css`: a night pasture for The Farm's page (`data-pet="friendly-farmer"`):
  deep pine green, neon chartreuse lines, wheat-gold links, mint connections. Every other page keeps its colours
  (raspberry, Wonderland Launchpad's storm, Bass & Biscuits' midnight studio).
