# Desktop pets draw their pictures without mood stickers again (2026-10-24)

Found after hub #238: the desktop pets' self-test failed ("Group 3 same-size scale failed: API Fairy"), and Astra asked
why API Fairy's new art fails it.

- Since hub #237 every one of the nine moods carries its mood sticker; before, idle and blink had none. Those two are
  the pictures the desktop pets draw. So every sheet-drawn pet on the desktop showed idle dots by its head, and each
  pet was drawn smaller, because the desktop pets size a pet by all its drawn pixels, sticker included. API Fairy and
  the other girls share one crop measured up from the soles, and the sticker stuck out above it, which the self-test
  caught.
- `scripts/build-frames.mjs` now also writes `plain-idle.png` and `plain-blink.png` (no sticker) next to each pet's
  frames, listed under `plain` in `art/frames/index.json`. The desktop pets use them, and fall back to the stamped
  frames when they are missing. The pet program pages keep the stickers.
- Pet packs carry the plain copies too (`scripts/pet-packs-20261020.mjs`).
- The rebuilt frames are byte-for-byte the ones #237 made; only the 46 plain copies and the index entries are new.
- Whether the desktop pets should show mood stickers is Astra's call; until she decides, they look as they did before #237.

By Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-24.
