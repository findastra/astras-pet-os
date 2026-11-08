status: waiting for Astra's merge OK (#309) and her answers on the open questions below
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

## Open (Astra decides)

1. Pets that already have a drawing: move them to #267's newer drawings too? Their page shows the desktop pet's
   drawing, so that also means new desktop art and a star rebuild.
2. The native tools' ON/OFF lights only switch in the browser (nothing on the PC reads them). What should each really
   do? 3rd party program lights work through Inference Iguana's watch, when it runs.
3. The Flash Audit as tools on The Farm, each check clickable, run over every pet program: its own task.

## Receipt and review

Pending.
