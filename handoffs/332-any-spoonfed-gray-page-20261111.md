status: open (waiting on Astra: merge #332)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-11-11
needs: PET-PROGRAM-FRAMEWORK.md section 3; card 009 (Spoonfed Sugarcube); pull request #332
---
## Task
Astra, 2026-11-11, on Spoonfed Sugarcube's pet program page: "Give him like a background. Maybe we can make this one
like blackish or grayish, or like pretty gray for the pet program, and then do an audit of the page to make sure that
things look good and get rid of the more details on the unified footer."

## Ownership and state
State: READY_FOR_REVIEW
Implementer: Claude Code session (Spoonfed chat); writable files: the files below; ownership: released
Reviewer: unassigned; next action: Astra looks at the working copy, then merges #332

## What I did
- Branch `claude/spoonfed-gray-page-20261111`, pull request #332, commit `f80f6ba0` (this card in the next commit).
- `apps/pet-programs/pet-program-page-20261018.css`: Spoonfed's own colours, `:root[data-pet="spoonfed-sugarcube"]`
  (soft charcoal #2b2a30, sugar white #f6f3ea, spoon silver lines #c8c4cc, neon lilac #cfa8ff, blush pink #f4b8c8).
- `scripts/pet-program-pages-20261018.mjs`: the unified footer has no More details on any page.
- `PET-PROGRAM-FRAMEWORK.md` section 3 and `test/pet-program-pages-test-20261018.mjs`: say so; Spoonfed's pretty gray
  joins the pages with their own colours.
- `npm run build`: 57 pet pages and `apps/pet-programs/model-pet-program-20261102.html` lose the footer's More details.
- `changes/spoonfed-gray-page-and-footer-20261111.md`.
- Tests: `npm test` in a git worktree, 416 pass, 6 skipped, 1 fail (the known worktree trap in
  `test/farm-setup-test-20261018.mjs`); that file in a clean LF clone of the branch, 5 of 5 pass.
- Looked at in the browser pane, served from the worktree on 127.0.0.1: 1280 px and 375 px, no sideways scroll.
  Platform Platypus's fit-check was not run.

## Found by the audit, not done
1. No link to the live app (findastra.github.io/spoonfed): no `app_url`/`interface_live_url`, and `privateTarget` reads
   `<owner>.github.io/<private repo>` as that private repo's own site.
2. System Map's Spoonfed node still says "on a rescue branch until merged".
3. Mood lines: "...and sample-data labels needs nothing from you" (`audit.subject` is a list).
4. Long panel labels wrap to two lines (shared layout, every pet with a long name).

## Done when
Astra merges #332 and the merged page shows the gray colours with no More details in the footer.

## Return
Record receipt and review in this card; the four findings above go to the next Spoonfed page change.

## Receipt and review
Pending.
