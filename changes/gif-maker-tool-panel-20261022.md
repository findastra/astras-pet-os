# Gif Giraffe's GIF maker becomes a native program, with its own tool panel

Astra, 2026-10-22: "Make sure the gif maker can be its own panel on the Giff Giraffe".

A GIF maker needs a screen of its own (a frame list to reorder, a live preview, a palette, export), so by
[PET-PROGRAM-FRAMEWORK.md](../PET-PROGRAM-FRAMEWORK.md) section 3 it is **too big for a tool panel**: it becomes its own
website, a native program the pet program manages, and the page keeps one tool panel that says how it is doing and
opens it.

## In the hub

- `scripts/pet-program-pages-20261018.mjs`: `gifMakerPanel` and `PET_PANELS['astras-gif-maker']`, so Gif Giraffe's
  pet program page carries `gif-giraffe-gif-maker-tool-panel` with its paired lights, the native program's versioned
  label, one line on what it does and how it is doing.
- `system-map.json`: the `gif-maker` node (pet program 27) says what its page really does now, with its label and
  version. `npm run build` rewrote the pages, ROSTER, the registry table and the map.
- `INTELLIGENCE-LEVELS.md`: Gif Giraffe's L1 row.

## No Open button yet

`astras-gif-maker` is a **private** repo, and a private repo is never linked
(`test/pet-program-pages-test-20261018.mjs`); a relative path out of the hub folder is not a hub file either
(Flash Audit A-235). So the panel names the file instead of linking it. It gets a real Open button the moment Astra
makes the repo public, or when a local address for a pet's own folder exists.

## Tests

`npm test`: 332 tests, 317 pass, 6 fail, 9 skipped. The 6 failures are the same ones `main` has today (pet packs and
the farm lock, tests 64 to 67, 74 and 75) and are not from this change; `main` passes 316 of the same run.

## Not done

- The GIF maker has never been run in a browser end to end.
- Gif Giraffe has no L2 runtime and no L3 seat.
- Gif Giraffe still needs a job from Astra: what kind of GIFs should it make?

Claude Opus 5 (`claude-opus-5`), 2026-10-22.
