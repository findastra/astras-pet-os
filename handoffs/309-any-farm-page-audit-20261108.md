status: waiting for Astra's merge OK (#309)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-11-08, a side chat of the "PC Master Race" chat
needs: nothing to merge; #267 (Codex's art review) stays the place to approve the drawings
---
## Task

Astra, 2026-11-08, on the Friendly Farmer's page: "Do an audit of the page and find errors and fix them"; "a lot of
these pets and their descriptions are wrong and the images just aren't there. So you need to go in and get the new
stuff"; "I think a lot of these buttons aren't really working on the farm. We should know how they're supposed to
work. Make sure they're all working"; "I think the flash audit needs to be a panel on the farm so that each of those
shows up as a tool and I can click it".

## What I did

- Friends list: each friend quotes its own job when the Farmer's every-pet line would repeat; 41 pets without a
  drawing (or with only an icon) show their newest art review drawing from #267 round 6, as drafts. The full list:
  `changes/farm-page-audit-20261108.md`.
- click-check no longer clicks the labels of the panels that always stay open (#301). On the Farmer's page: 257
  clicked, 256 work; the one dead end is the chat helper's file, only in Astra's farm folder.
- `npm test`: 388 pass, 1 fail (installed farm from scratch, Windows), the same as on `main`.

## Her answers (deck "The Farm: art and lights", 2026-11-08: "All recommended")

1. Pets that already have a drawing switch to #267's newer drawings one at a time, after she approves each there; then
   that pet's page and desktop pet switch together. Nothing to do here until then.
2. A native tool's ON/OFF says on the light that it only keeps her choice in this browser; real switches come tool by
   tool. Done in this PR (the light's tooltip, its words and PET-PROGRAM-FRAMEWORK.md section 3).
3. The Flash Audit's 61 checks go in a `flash-audit` tool box in The Farm's L1, in priority order.
4. A check shows the last run's results at once; Run asks a small helper on her PC (started by Startup Star) to check
   every pet program again.
5. The Farm owns the Flash Audit; GitHub Goldfish keeps the checks about words on GitHub.

Answers 3 to 5 are built in the next pull request, stacked on this one.

## Receipt and review

Pending.
