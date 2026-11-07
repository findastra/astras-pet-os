status: waiting for Astra's merge OK (#278 here, after #276)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-11-02, the "Friendly Farmer" chat
needs: card 276
---
## Task

Astra, 2026-11-02: a template pet program page, with placeholder names (tool one, tool two, tool three), covering
every structure a pet program shows, with every rule followed and right on every screen; name it; show it in the
browser pane.

## What I did

- The Model Pet Program (`apps/pet-programs/model-pet-program-20261102.html`), drawn by the spawner from `modelProgramData`; its example tool
  and nine placeholder drawings; `test/model-pet-program-test-20261102.mjs`; PET-PROGRAM-FRAMEWORK.md section 3 and checklist.
- Platform Platypus's fit-check: 19 of 19 screens fit. Shown to Astra in the browser pane.
- The full list: `changes/model-pet-program-20261102.md`.

## Redone (Astra, 2026-11-02: "do a deep analysis ... try to redo this page before we do anything")

Read against her dated instructions in the spawner, stylesheet, script, framework and earlier chats, and the pages she
shaped most. Fixed: working tools in their own tool boxes in L1 (never a panel above the levels), the box fits the tool,
tool-one/trick-one names, the shared mood stickers, the friends' pictures, L1's light words on every page, and the
framework's stale lines (`changes/model-pet-program-20261102.md`). Fit-check: 19 of 19 screens.

## Answered (2026-11-02)

All recommended, with two changes: the name is **the Model Pet Program** (not Show Pet), and new pages are **sky blue
with darker boxes** (not raspberry). No special panels (their own pull request); toolsets from data (toolset-one).
The light question was withdrawn: decided 2026-10-24. Recorded in `changes/model-pet-program-20261102.md`.

## Still open

1. The special panels (API Fairy's key requests, Discord Damsel's presence controls and DM archive, Portfolio
   Puffer's social row) move into tool boxes in L1: their own pull request.
2. Retarget #278 to `main` before #276 merges (stacked).

## Receipt and review

Pending.
