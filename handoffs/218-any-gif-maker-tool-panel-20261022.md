status: open (waiting on Astra: merge #218 and astras-gif-maker#4, then a job for Gif Giraffe)
for: any
from: Claude Opus 5 (claude-opus-5), 2026-10-22
needs: PET-PROGRAM-FRAMEWORK.md (section 3), TOOLS-AND-TRICKS.md, PET-FILES.md, PET-WORDS.md, skills/new-pet-or-tool
---
## Task

Astra, 2026-10-22: "Make sure the gif maker can be its own panel on the Giff Giraffe".

## Ownership and state

State: READY_FOR_REVIEW
Implementer: Claude Opus 5 (`claude-opus-5`), this session; writable files: the two branches below; ownership: released
Reviewer: unassigned; next action: review the delivered revisions, then Astra's OK to merge

## What I did

**The decision.** A GIF maker needs a screen of its own (a frame list to reorder, a live preview, a palette, export),
so by PET-PROGRAM-FRAMEWORK.md section 3 it is **too big for a tool panel**: it becomes its own website, a **native
program** the pet program manages, and the page keeps one tool panel that says how it is doing and opens it.
Gif Giraffe (#27) had no native programs before this; its registry row listed only CapCut and ShareX as ideas.

**findastra/astras-gif-maker**, branch `claude/gif-maker-tool-panel-20261022`, commit `5d9b61d`,
[#4](https://github.com/findastra/astras-gif-maker/pull/4):

| File | What changed |
|---|---|
| `astras-gif-maker-20261022.html` | New: the native program, a working GIF maker. Frames (add, reorder, remove), seamless blend across the loop, a pastel-rainbow sparkle overlay (12 swatches, six to a row) inset from the edges so no star is clipped, randomize, download or a Discord webhook. Runs entirely in the browser. |
| `index.html` | Stays a real file (the hub checks `entry`); opens the native program instead of saying nothing works |
| `pet.json` | `job`, `status: growing`, `version: 0.1.0`, `framework`, `intelligence_levels` with the native program at L1, and `hub.submit` for the Farmer's next round |
| `README.md` | What it does, how to run it, Limits (including that it has never been run in a browser) |
| `AGENTS.md` | Points at the repo's own `changes/` folder (hub card 069) |
| `changes/gif-maker-tool-panel-20261022.md` | New |

**findastra/astras-pet-os**, branch `claude/gif-maker-tool-panel-20261022`,
[#218](https://github.com/findastra/astras-pet-os/pull/218):

| File | What changed |
|---|---|
| `scripts/pet-program-pages-20261018.mjs` | `gifMakerPanel` and `PET_PANELS['astras-gif-maker']`: the page now carries `gif-giraffe-gif-maker-tool-panel`, paired lights, the versioned label `astras-gif-maker-v0.1.0-astras-gif-maker-v1.0`, one line on what it does and how it is doing |
| `system-map.json` | The `gif-maker` node (pet program 27) says what its page really does, with its label and version |
| `INTELLIGENCE-LEVELS.md` | Gif Giraffe's L1 row, with the date and what is not done |
| `apps/pet-programs/astras-gif-maker-20261018.html`, `system-map-20261012.html`, ROSTER, README table, registry table | Rewritten by `npm run build`, never by hand |
| `changes/gif-maker-tool-panel-20261022.md` | New |

**No Open button.** `astras-gif-maker` is a private repo, and a private repo is never linked
(`test/pet-program-pages-test-20261018.mjs`); a relative path out of the hub folder is not a hub file either
(A-235). Both were tried and both failed their test, so the panel **names the file** instead. It gets a real Open
button the moment the repo is public.

**Tests.** `npm test` in the hub: 332 tests, 317 pass, 6 fail, 9 skipped. The 6 failures are the same ones `main`
has today (pet packs and the farm lock: 64 to 67, 74, 75), confirmed by stashing this change and re-running, where
`main` passes 316 of the same run. `npm run build` and `node --check` on the spawner and both pages are clean.
No key, `.env`, legal name or `C:\Users\<name>` path is committed.

**Not verified.** The GIF maker has **never been run in a browser end to end**: the frame-sequencing arithmetic was
run on its own and the page's script passed `node --check`, nothing more. Nobody has built a GIF with it.

**On Astra's PC:** nothing changed. Both repos were cloned fresh in this cloud session.

## Done when

Both pull requests are merged with Astra's OK, someone has built a GIF with the page in a real browser, and Gif
Giraffe has a job.

## Return

Record the review and what a browser run showed here, then set `status: done`.

## Receipt and review

Pending.
