status: waiting for Astra's merge OK (#303)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-11-08, a side chat of the "PC Master Race" chat
needs: nothing
---
## Task

Astra, 2026-11-08, looking at the Model Pet Program: "the pets are not the sizes they would appear on the screen in
the corner, so make sure they're the right size."

## What I did

- Every pet picture in the cyberhome, the nine emotions and the friends list follows Startup Star's LayoutPets rules,
  with the empty margin cut off. That covers every pet program page and the Model Pet Program. The full list:
  `changes/pets-at-desktop-size-20261108.md`.
- Fixed on the way: the 60px slot that shrank most pets; the Farmer, Spoonfed Sugarcube and the five SameSize pets
  sized by repo instead of their desktop id; Discord Damsel's own 1.375 scale removed (about 10% smaller than her
  2026-11-06 size, now her desktop size).
- A test reads the sizes back from the star's own code. `npm test`: 386 pass, 1 fail (installed farm from scratch,
  Windows), the same as on `main`. Checked in the pane from this branch.

## Done when

1. After Astra's OK, #303 merges and her PC hub copy is fast-forwarded.
2. The live pages show each pet at its desktop size.

## Receipt and review

Pending.
