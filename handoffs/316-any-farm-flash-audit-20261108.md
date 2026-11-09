status: waiting for Astra's merge OK (#316, after #309)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-11-08, a side chat of the "PC Master Race" chat
needs: card 309 (#316 is stacked on #309)
---
## Task

Astra, 2026-11-08: "I think the flash audit needs to be a panel on the farm so that each of those shows up as a tool
and I can click it and it will go through all of whatever we have right now and all the other pet programs and check
to see if those components of those other programs are up to standard." Deck "The Farm: art and lights": "All
recommended": a tool box in The Farm's L1; the last results at once and Run through a helper on her PC; The Farm owns
it, GitHub Goldfish keeps the checks about words on GitHub.

## What I did

- The Farm's L1 has the `flash-audit` tool box: 61 checks as tools, matrix order, grey or blue dot, each with the last
  run over every pet program (today's run in `docs/flash-audit-rounds-20261108/`), and Run on the 37 the auditor checks.
- The Flash Audit helper (`scripts/flash-audit-helper-20261108.mjs`, 127.0.0.1:38778) runs the auditor when asked
  from a page this PC serves; Startup Star starts it at sign-in. The full list: `changes/farm-flash-audit-20261108.md`.
- The Flash Audit is The Farm's on the System Map and in both docs; Goldfish keeps A15, A31, A57.
- `npm test`: 398 pass, 1 fail (installed farm from scratch, Windows), the same as on `main`. The star's candidate build
  passes its self-test.

## Done when

1. After Astra's OK: #309 merges, #316 is retargeted to `main` (`gh pr edit 316 --base main`), `main` merged in and
   rebuilt if needed, then #316 merges and her PC hub copy is fast-forwarded.
2. On her PC: Startup Star rebuilt (`build-desktop-pets-20261011.ps1`) and restarted, so the Flash Audit helper runs.
3. On The Farm's page served on this PC, Run on a check runs the audit and the check updates.

## Receipt and review

Pending.
