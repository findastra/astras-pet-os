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

## Nine pets move to the pipeline

Astra, 2026-11-02, answering the deck "Friendly Farmer: pets to the pipeline": "All recommended". Question 1, option B:
the four seed and roadmap pets with real work on main and the five she is building today. Question 2, option A: pages
follow the pipeline, so the 40 "nothing built yet" pages of `claude/seed-roadmap-pages-20261030` stay out; its
pet-page-audit trick and Flash Audit notes come over in their own pull request next.

| Pet | Repo | Was | Why now |
|---|---|---|---|
| Skill Scout | lunas-log | seed | the skill census and its catalog page on main |
| Journal Jellyfish | journal-lagoon | roadmap | the diary, its worker and six tools on main |
| AI Dashund | ai-doghouse | seed | the research library and four tools (claude-toolset-tool merged in ai-doghouse#6 today) |
| Door Dormouse | the-threshold | seed | The Threshold's found-floors page and tools tracker |
| White Hat Weasel | white-hat-lab | roadmap | being built: the scan log in white-hat-lab#3 |
| Gatekeeper Goddess | iron-gates | roadmap | being built: YubiKey enrollment, spending approval on a design branch |
| Cipher Owl | cipher-hollow | roadmap | being built: design/yubikey-spend-approval-20261102 |
| Roaming Raven | roam-map | roadmap | being built: design/remote-access-inventory-20261102 |
| Pet Police Officer | the-police-station | seed | being built: design/yubikey-spend-approval-20261102 |

- pet-programs.json: their stage is `pipeline`. pets.json: a pipeline entry each (private, hatching, its own pet.json
  version and tools), Skill Scout, Pet Police Officer and Door Dormouse leave the seeds list (Door Dormouse's
  works_with became a relations link to Unity Unicorn, and he needs Startup Star for his desktop pet).
- system-map.json, the way Kernel Koala moved (756373b4): the roadmap nodes `journal-jellyfish`, `white-hat-weasel`,
  `gatekeeper-goddess`, `cipher-owl` and `roaming-raven` give way to the pipeline nodes, and every link and security
  hat moved to the repo's id (also `skill-scout` to `lunas-log`, `pet-police-officer` to `the-police-station`). The
  Police Station's program node is now `program-78`, so the pet itself is `the-police-station`. Measured code lists for
  the nine repos. **A branch that still names an old id** (design/yubikey-spend-approval-20261102 names
  `gatekeeper-goddess` and `cipher-owl`) stops the build with "unknown node" until it uses the new id.
- The stage chart's pipeline row says "or Astra has said it is being built", as she chose.
- `desktop-art/desktop-drafts-20261018.json` (regenerated): Door Dormouse's desktop pet opens his page.
- Tests: test/pet-privatizer-test-20261018.mjs refuses `osc-sonar` (still a seed) instead of `lunas-log`.
- Their own pet.json files still say `status: "seed"` or `"roadmap"`: pet-finder reports it (`wrong-stage`), and each
  pet's repo changes it to `hatching` in its own pull request.

## The Farm's own colours

Astra, 2026-11-02: "I don't like the raspberry color of the farm. Let's change it to like dark green, something else,
something interesting that we haven't already used for a pet program."

- `apps/pet-programs/pet-program-page-20261018.css`: a night pasture for The Farm's page (`data-pet="friendly-farmer"`):
  deep pine green, neon chartreuse lines, wheat-gold links, mint connections. Every other page keeps its colours
  (raspberry, Wonderland Launchpad's storm, Bass & Biscuits' midnight studio).
