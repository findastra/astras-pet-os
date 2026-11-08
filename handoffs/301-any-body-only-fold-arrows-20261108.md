status: waiting for Astra's merge OK (#301)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-11-08, a side chat of the "PC Master Race" chat
needs: nothing; overlaps #298 (same spawner, CSS, test and pages)
---
## Task

Astra, 2026-11-08: "there's some drop down arrows in every panel that it needs to be on only like the main body
panels, not the top ones or the bottom ones, and definitely not the unified footer." On the deck "Fold arrows: which
panels": "All recommended" (every page and the Model Pet Program; the bottom ones are the friends list and the unified
footer; More details stays). She also asked to see the blueprint page (the Model Pet Program) with the fix.

## What I did

- L3's note, the cyberhome, the quick summary, the System Map box, the friends list and the unified footer always stay
  open with no fold arrow, on every pet program page and the Model Pet Program (spawner `panel(..., { fold: false })`,
  CSS, page script). The body panels keep their arrows. The full list: `changes/body-only-fold-arrows-20261108.md`.
- PET-PROGRAM-FRAMEWORK.md section 3 has the rule; a new test checks exactly those six stay open on every page.
- Checked in the browser pane on the Farmer's page and the Model Pet Program from this branch (127.0.0.1). `npm test`:
  384 pass, 1 fail (installed farm from scratch, Windows), the same failure as on unchanged `main`.

## Done when

1. After Astra's OK, #301 merges (if #298 merges first: merge `main` in, take main's generated pages, `npm run build`,
   `npm test`), and her PC hub copy is fast-forwarded.
2. The live Farmer's page shows no fold arrow on the top and bottom panels.

## Receipt and review

Pending.
