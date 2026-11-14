status: DONE, merged with Astra's OK in chat ("Yes, merge all 12", 2026-11-13: #357 and the 11 pet PRs; her L4 OK for farm-own-tools)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-11-13, the Flash Audit template chat
needs: the farm on her PC fast-forwarded and rebuilt; A49's art and the grants for the reaches outside farm-own-tools wait on Astra
---
## Task

Astra, 2026-11-13: "ok fix them": the findings of the Flash Audit's template check (#338): A63 (versions written
`v0.1`), A49 (no pictures for seven moods), A70 (The Farm's R W X with no L1 row).

## What I did

- A63, 11 pages: `pets.json` `version` `v0.1` → `v0.1.0` for Linux Iceberg, Luna's Log, AI Doghouse, The Threshold,
  White Hat Lab, Iron Gates, Cipher Hollow, Roam Map, The Police Station, Port Web and Server Hearth; the same one line in
  each pet's own `pet.json`, branch `claude/version-0-1-0-20261113` in each repo: linux-iceberg#8, lunas-log#15,
  ai-doghouse#8, the-threshold#9, white-hat-lab#7, iron-gates#5, cipher-hollow#4, roam-map#4, the-police-station#5,
  port-web#5, server-hearth#5. They merge together: the Farmer's round copies a pet's `pet.json` version into
  `pets.json` (`adoptVersion`).
- A70: new grant `farm-own-tools` in `system-map.json` (The Farm's own tools, L1, R W X on its own folder and its data
  folders, written only); it names what reaches further today, outside it. `PROTECTION-RINGS.md` rebuilt.
- The A70 check (`scripts/flash-template-20261112.mjs`) says "says nothing here: no grant reaches it" for a level whose
  row has no grant, instead of "no row"; `test/flash-template-test-20261112.mjs` checks it.
- Credits: `changes/flash-audit-findings-20261113.md`.

## Not done / next

- A49, 15 pages (AI Doghouse, Benchmark Rock, Cipher Hollow, Claude Dock, Iron Gates, Journal Lagoon, Kernel Grove,
  Linux Iceberg, Luna's Log, Port Web, Roam Map, Fairy Ring, Server Hearth, The Police Station, White Hat Lab): each pet
  has one drawing and no pictures for sleepy, curious, happy, worried, alarmed, sick and sad. New art is Astra's (A02);
  #267's art review has neutral drawings only.
- The reaches `farm-own-tools` names as outside it (click-check's temp folder and outside links; the auditor's GitHub
  reads and Goldfish's preflight; Startup Star's HKCU and %LOCALAPPDATA% settings and the programs it starts) need their
  own grants, with Astra's OK.

## Receipt and review

- `npm test` in an LF clone of this branch (Git Bash): 434 tests, 428 pass, 0 fail, 6 skipped.
- The build's template check, 56 pages: A63 and A70 pass on every page; A49 left on 15.
- The Farm's page served from this branch in the pane with the EDITORIAL bar: R W X L1 shows the grant, Rule only.
- Each pet branch changes one line of `pet.json` (GitHub compare).
- Maker-checker: a separate read-only checker agent reviewed the grant. Verdict "needs change": the first wording said
  click-check only reads and named one data folder; corrected to the wording above. It found type:host matches only
  astras-pet-os, no conflict with seat-core or farmer-round, and no widening.
- Astra's merge OK in chat: "Yes, merge all 12" (2026-11-13). Right before the merge: main had not moved, CodeQL
  passed, all 12 mergeable, no other open PR in the 11 pet repos touches `pet.json`. The 11 pet PRs merged first, so
  no round could copy `v0.1` back between them.
