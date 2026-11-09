status: merged with Astra's OK in chat (2026-11-08: "Yes, merge both"); steps 2 and 3 below wait on her PC
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-11-08, a side chat of the "PC Master Race" chat
needs: nothing to merge; Startup Star rebuilt and restarted on Astra's PC
---
## Task

Astra, 2026-11-08: "I think the flash audit needs to be a panel on the farm so that each of those shows up as a tool
and I can click it and it will go through all of whatever we have right now and all the other pet programs and check
to see if those components of those other programs are up to standard." Deck "The Farm: art and lights": "All
recommended": a tool box in The Farm's L1; the last results at once and Run through a helper on her PC; The Farm owns
it, GitHub Goldfish keeps the checks about words on GitHub.

## What I did

- The Farm's L1 has the `flash-audit` tool box: 61 checks as tools, matrix order, grey or blue dot, each with the last
  run over every pet program (today's run in `docs/flash-audit-rounds-20261108/`, local addresses cleaned out by the
  hub's public-safety cleaner), and Run on the 37 the auditor checks.
- The Flash Audit helper (`scripts/flash-audit-helper-20261108.mjs`, port 38778 on this PC only) runs the auditor when
  asked from a page this PC serves, and writes where it answers into its data folder for the page to read; Startup Star
  starts it at sign-in. The full list: `changes/farm-flash-audit-20261108.md`.
- The Flash Audit is The Farm's on the System Map and in both docs; Goldfish keeps A15, A31, A57.

## Done when

1. Done: #309 merged, #316 retargeted to `main`, `main` merged in and rebuilt, #316 merged, her PC hub copy
   fast-forwarded.
2. On her PC: Startup Star rebuilt (`build-desktop-pets-20261011.ps1`) and restarted, so the Flash Audit helper runs.
3. On The Farm's page served on this PC, Run on a check runs the audit and the check updates.

## Receipt and review

- Astra gave her OK in chat: "Yes, merge both" (#309, then #316).
- After #309 merged: #316 retargeted to `main`, `main` merged in (no conflicts), `npm run build` (nothing changed).
  `npm test` caught local addresses in the new files (the public-safety rule): the helper now writes its own address
  on the PC, the test uses made-up 400xx ports, and the saved run was cleaned. Then `npm test`: every test passes but
  the installed farm from scratch (Windows), the same as on `main`.
- The star's candidate build passes its self-test with the helper in the sign-in list.
