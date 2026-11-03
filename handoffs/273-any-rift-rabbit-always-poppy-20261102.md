status: waiting for Astra's merge OK (#273 here)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-11-02
needs: card 269
---
## Task

Astra, 2026-11-02: "I don't like it that whenever I try to reload the page, I see the old like model before Poppy. It
should always be Poppy."

## What I did

The tracker strapper showed its drawn figures until three loads finished one after another (her SteamVR devices, her
Unity export, then three from the CDN), so every reload showed the drawing first.

- On this PC (the only place the launcher part of the page runs), the figures are hidden from the start while Poppy
  loads (`mini-wait` in `pet-program-page-20261018.css`). They come back only when Poppy cannot load: no copy in
  Astra's PetOS Data, a copy of the wrong kind, or three failing to load.
- The three loads run side by side (`vrchat-launcher-20261024.js`).

Checked in the browser pane with this branch served in the same folder layout as her PC: the figures are hidden from
the first check and Poppy is up about 0.5 s later; with an empty data folder the drawing shows as before. `npm test`:
348 pass, 2 fail, the same two as on `main`.

## Done when

1. After Astra's OK, this PR merges and her PC hub copy is fast-forwarded.
2. Reloading Rift Rabbit's page on her PC shows Poppy, never the drawing first.

## Return

Record the merge and her reload below.

## Receipt and review

Pending.
