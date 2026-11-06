status: waiting for Astra's merge OK (#276 here)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-11-02, the "Friendly Farmer" chat
needs: nothing
---
## Task

Astra, 2026-11-02: explain the pet stages in a chart with how many pets are in each, put it in README.md (written by
`npm run build`, checked by `npm test`); make it a rule that a hatch or an audit that finds a wrong stage updates
pet-programs.json and rebuilds; ask which pets move to the pipeline, and give them pages with their tools read from
their own pet.json; recommend how the stages and the Farmer's job should work. Then: "I don't like the raspberry color
of the farm."

## What I did

- README.md **Pet stages** chart (`scripts/pet-stages-20261102.mjs`, `test/pet-stages-test-20261102.mjs`).
- The stage rule in AGENTS.md, PET-FILES.md and `skills/pet-finder`; pet-finder's `wrong-stage` check.
- `adoptTools` (the Farmer's round) and the spawner read each pet's pet.json tools (`test/pet-json-tools-test-20261102.mjs`).
- Astra's answers to the deck "Friendly Farmer: pets to the pipeline" (https://claude.ai/artifact/9N34PMWGf5X4xQy8dsak2g):
  "All recommended". Nine pets moved to the pipeline (the table is in
  `changes/pet-stages-and-pet-json-tools-20261102.md`); the 30 October branch's 40 pages stay out.
- The Farm's page in a night-pasture green.

`npm test`: 356 pass, 2 fail, the same two as on `main`.

## Still open

1. The nine pets' own pet.json files still say `status: "seed"` or `"roadmap"`; each repo changes it to `hatching` in
   its own pull request (several have other chats' branches open today: ai-doghouse, iron-gates, cipher-hollow,
   roam-map, the-police-station, white-hat-lab).
2. `design/yubikey-spend-approval-20261102` must use `iron-gates` and `cipher-hollow` for the old map ids after this
   merges.
3. Bring the pet-page-audit trick and Flash Audit A62 over from `claude/seed-roadmap-pages-20261030` (without its 40
   pages), Astra's answer 2A.

## Done when

1. After Astra's OK, #276 merges and her PC hub copy is fast-forwarded.
2. The nine pages are on the hub's Pages site and the README chart shows 15 + 25 less nine.

## Receipt and review

Pending.
