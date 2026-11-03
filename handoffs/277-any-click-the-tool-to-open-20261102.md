status: waiting for Astra's merge OK (#277 here)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-11-02
needs: nothing
---
## Task

Astra, 2026-11-02: "some of the tools, like you can hover over anywhere on the tool and it opens it. That's how I want
it. And some you have to click the arrow. So please change all of them so that all you have to do is click on the tool
itself to open it."

## What I did

Pills already opened from a click anywhere. The tool boxes on every pet page (approvals, grants, keys, maintenance,
pet-id, ...) and, on Rift Rabbit's page, the tracker strapper, the dongle map, the VRChat setups and each launch mode
opened only from their name.

- `pet-program-page-20261018.js`: one `foldClick` for both kinds. A folded tool opens when clicked anywhere; an open one
  folds from its name line, so clicks inside it stay its own. Lights, links, buttons and fields keep their own clicks;
  selecting text does nothing; a box made without a fold (notes) stays open.
- `pet-program-page-20261018.css`: a folded tool gets the pill's hover look and a pointer.

Checked in the browser pane: all 19 foldable tools on Rift Rabbit's page and the 10 tool boxes on GitHub Goldfish's page.
`npm test`: 348 pass, 2 fail, the same two as on `main`.

## Done when

1. After Astra's OK, this PR merges and her PC hub copy is fast-forwarded.
2. On her pages every tool opens from a click anywhere on it.

## Return

Record the merge below.

## Receipt and review

Pending.
