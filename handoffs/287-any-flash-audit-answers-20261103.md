status: waiting for Astra's merge OK (#287, after #276, #278, #279, #283, #285)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-11-03, the "Friendly Farmer" chat
needs: cards 283 and 285 (the chat window and its helper), the Model Pet Program (#278)
---
## Task

Astra, 2026-11-03, on the deck "Friendly Farmer: Flash Audit vs the pages" (eight questions where the Flash Audit
rows and the pages disagreed): "i like the phone on data dealer, its program needs its own chat, all other reccd".

## What I did

- Data Dealer's pet program page: its chat is Data Chip's own yellow phone (the little phone opens it; the window is
  the phone with LCD screens). Every other page keeps the arrow.
- Every page: awake shows its own drawing (the Model Pet Program's has open eyes); `play-with` and `care-for` are two
  planned tricks in L2; More details on all 16 panels, four lines each (how it works, where it comes from, your rules,
  not built yet), the arrow only in the two top squares and the chat.
- `docs/flash-audit-20261014.md` and `PET-PROGRAM-FRAMEWORK.md` follow her answers; the list of changes is
  `changes/flash-audit-answers-20261103.md`.
- #285 fix on its own branch, merged in here: the helper's self-test and test no longer write out a local address.
- `npm test` in an LF checkout: 380 of 385 pass, 3 skipped; the 2 failures are the same as on `main`. Checked in the
  browser pane from the branch at 1280×900 and 375×812.

## Next

1. After Astra's OK, merge in order, each retargeted to `main` first: #276, #278, #279, #283, #285, #287. `main`
   (#282, #284) was merged into #276 on 2026-11-03 and carried up the stack: `pets.json` keeps both new relations,
   Damsel's L1 tool box has the Ableton Live card, generated files rebuilt, every branch tested. If `main` moves
   again, do the same.
2. Real pets' awake drawings with open eyes are new art, hers to OK (Flash Audit A02, A03).
3. Play with and Care for need their numbered steps and L3 running them in the chat (A37).

## Done when

The stack is on `main`, Data Dealer's live page shows Data Chip's phone, and every page's panels end with the four
lines.

## Receipt and review

Pending.
