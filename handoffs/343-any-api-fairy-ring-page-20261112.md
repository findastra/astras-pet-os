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
Reviewer: unassigned; next action: Astra merges #343

## What I did
- Branch `claude/api-fairy-ring-page-20261112`, pull request #343.
- `system-map.json`: `key-notebook`, a tool of API Fairy Ring with `embed` (apps/api-fairy-20261008.html), `frame: wide`,
  `in_pill`: the notebook works inside its own tool box in L1 of the spawned page, beside `key-requests`.
- `apps/api-fairy-20261008.html`: in a tool box, blueprint colours, no header art or credit line, Export local notes
  kept; re-sends its height at 0.3, 1 and 2.5 s (the first load on a phone left the box at 420 px).
- `npm run build`. Shown to Astra in the browser pane from the branch, 127.0.0.1: desktop and 375 px fit.
- Tests in a worktree: 416 pass, 6 skipped, 1 fail (known worktree trap, `test/farm-setup-test-20261018.mjs`).

## Not done
- The api-fairy repo's own copy of the notebook page (its `pet.json` entry) still has the old look.
- `apps/drum-dog-in-tool-20261102.js` has the same first-load race for every tool box; fixed here only for API Fairy.

## Receipt and review
Pending.
