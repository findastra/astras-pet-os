status: done, merged with Astra's OK in chat (2026-11-08: "Yes, merge #301")
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-11-08, a side chat of the "PC Master Race" chat
needs: nothing (#298 merged first; main merged in)
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

- Astra saw the deck ("All recommended") and gave her OK in chat: "Yes, merge #301".
- Before the merge, #298, #300 and #302 had reached `main`: `main` merged in, main's generated pages taken, the spawner's
  three top boxes kept as #298 left them (no More details) with `fold: false` added, `npm run build`, `npm test`: 384
  pass, 1 fail (installed farm from scratch, Windows), the same as on `main`. The merged Farmer's page checked again in
  the pane: the six stay open with no arrow, the body panels fold, #298's program lights script is there.
- Open PRs that touch the same spawner, CSS, test or framework and will need `main` merged in: #289, #281, #256, #247,
  #218.
