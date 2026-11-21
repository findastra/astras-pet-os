status: open (waiting on Astra: merge #343)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-11-12, the API Fairy chat
needs: PET-PROGRAM-FRAMEWORK.md section 3 (no breakouts, tool boxes in L1); pull request #343
---
## Task
Astra, 2026-11-12, looking at API Fairy's key notebook page: "The context looks okay, but it needs to match it all the
other pet programs. So check out the farmer for the template and redo it. And then let's see what the new one looks
like here in the in-chat browser."

## Ownership and state
State: READY_FOR_REVIEW
Implementer: Claude Code session (API Fairy chat); writable files: the files in #343; ownership: released
Reviewer: unassigned; next action: Astra merges #343, then findastra/api-fairy#16 (2026-11-20)

## What I did
- Branch `claude/api-fairy-ring-page-20261112`, pull request #343.
- `system-map.json`: `key-notebook`, a tool of API Fairy Ring with `embed` (apps/api-fairy-20261008.html), `frame: wide`,
  `in_pill`: the notebook works inside its own tool box in L1 of the spawned page, beside `key-requests`.
- `apps/api-fairy-20261008.html`: in a tool box, blueprint colours, no header art or credit line, Export local notes
  kept; re-sends its height at 0.3, 1 and 2.5 s (the first load on a phone left the box at 420 px).
- `npm run build`. Shown to Astra in the browser pane from the branch, 127.0.0.1: desktop and 375 px fit.
- Tests in a worktree: 416 pass, 6 skipped, 1 fail (known worktree trap, `test/farm-setup-test-20261018.mjs`).

## Her colours, the buttons, what was missing (Astra, 2026-11-12)
Astra: "Give this fairy like a background color that matches her, maybe her hair. And then check that all the buttons
work and everything's on here that should be. It might be missing a lot of stuff."
- `apps/pet-programs/pet-program-page-20261018.css`: `:root[data-pet="api-fairy"]`, a deep mint page from her hair
  (#23c06a darkened to #0f3a2a), her light mint hair (#a6fbb1) for lines, her wings' lilac (#ddc8fa) for links and marks,
  her peach for connections; sampled from `art/frames/api-fairy/idle.png`. The notebook's tool box follows.
  PET-PROGRAM-FRAMEWORK.md section 3 lists it.
- Missing, now on the map (`system-map.json`): her Windows program `api-fairy-app` (Native programs was 0), and its
  tools `key-watch`, `risk-flags`, `desktop-signal` (its link to Startup Star planned, card 021); links for
  `key-notebook` too. No link to findastra/api-fairy: it is private.
- `pets.json`: her note said "pink hair, mint wings"; it is mint hair, lilac wings.
- The notebook's Source repository link is hidden inside the box (private repo; L4's Pet ID names it).
- click-check (with a GitHub token): 2 pages, 179 work, 0 broken; 2 need sign-in (the private repo), 4 not clicked
  (Send, Push for review, two files only on Astra's PC).
- Tests: 417 pass, 6 skipped, 1 fail (the known worktree trap).

## Still missing (not done here)
- Version: the page says v0.1.0 // 20261007 (pets.json `version`, release v0.1.0-20261008). Her repo has moved on
  (approved art, desktop-signal, 2026-10-17) with no new release.
- L3's seat is empty and the editorial note has no L3 note yet.
- `api-fairy-mushroom-circle` stays planned (Iron Gates does not exist).

## Not done
- ~~The api-fairy repo's own copy of the notebook page (its `pet.json` entry) still has the old look.~~ 2026-11-20:
  being removed by findastra/api-fairy#16 (see below).
- `apps/drum-dog-in-tool-20261102.js` has the same first-load race for every tool box; fixed here only for API Fairy.

## 2026-11-20: brought up to date, and the old page goes (Claude Opus 5.5, the footer chat)
Astra, 2026-11-20, on the api-fairy repo's old page: "super old and needs deleted or the new parts merged with the
correct one"; then "Yes, do both" (fix #343, remove the old page).
- Merged main (`b50a75fa`, 226 commits) into this branch: `d61662e2`. `pets.json` keeps main's "shared pet style"
  wording with this card's colour fix; `PET-PROGRAM-FRAMEWORK.md` keeps both colour lines (Halo List's sky blue and
  API Fairy's mint); generated files from main, then `npm run build`. `npm test`: 496 pass, 0 fail, 6 skipped.
- Checked in the browser pane from the branch (127.0.0.1, EDITORIAL bar): mint page, Native programs · 1, Native
  tools · 6, the notebook (Add a key reference, Key references, Export local notes, Open the Windows app) in its pill,
  no sideways scroll at 1280 or 375 px, no console errors. At 375 px the notebook is 205 px wide and long.
- findastra/api-fairy#16 (draft): removes `api-fairy-20261008.html` from her repo, `pet.json` `entry` = `src/App.cs`,
  `homepage` = this pet program page (folds in api-fairy#7). Merge it after this PR.
- #390 (key-check node) also adds a `key-ring` tool in `system-map.json`: whichever merges second takes a one-line merge.

## Receipt and review
Pending.
