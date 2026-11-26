status: open, waiting on Astra's OK for #311 here and findastra/unity-unicorn#40
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-11-08
needs: Astra's per-PR OK
---
## Task

Astra, 2026-11-08, looking at Unity Unicorn's page: "Do an audit of this page and look for errors and fix them."

## What I did

- Here: pets.json says Unity Unicorn is public (GitHub does; unity-unicorn handoff 008 asked for it). Pages rebuilt;
  390 tests pass.
- findastra/unity-unicorn#40: Pet ID link, MCP for Unity in the notes list, program lights find the watch from a pet
  repo's page, and 11 out-of-date tests read the hub frame (77 pass).

## What is left

1. The three links to `unity-assets-library` (now private `unity-unicorn-private`): rename after unity-unicorn #33 and
   #32 merge (handoff 008 there).
2. About 20 element ids in the page's main script belong to panels the hub frame replaced: cleanup.
3. Unity Unicorn's `job` says "26 dated tools"; the page lists 85. Astra's words to change.
