status: open, waits for Astra's OK in chat to merge #318
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-11-09, a side chat of the "PC Master Race" chat
needs: Astra's OK to merge #318
---
## Task

Astra, 2026-11-09: "Yes, fix them". The first real Run from The Farm's page, served on her PC, worked but took 19
minutes while the check said "This takes a few minutes". After it, the checks showed 2026-11-09 but the tool box's top
line still said 2026-11-08.

## What I did

- `RUN_MINUTES` (20) in `scripts/flash-audit-checks-20261108.mjs`. The top line says Run takes about 20 minutes, and so
  does the Run message, which also says the page can be closed while the run goes on.
- The top line's date sits in its own `data-flash-run-shown` span; `apps/flash-audit-control-20261108.js` changes it
  with the checks when a newer run on this PC comes in.
- `test/flash-audit-test-20261108.mjs` checks both. Credits: `changes/flash-audit-run-wording-20261109.md`.

## Done when

1. Astra gives her OK in chat and #318 is merged.
2. Her PC hub copy is fast-forwarded, so The Farm served on her PC has the new words.

## Receipt and review

- Checked in the browser pane, served from this branch with today's run beside it: the top line turns to 2026-11-09 and
  says about 20 minutes. With the helper's answers faked, so no real run started, Run shows the new message.
- `npm run build`: only The Farm's page changed. `npm test`: 399 pass, 1 skipped, 1 fails: the installed farm from
  scratch (Windows), which fails only in a git worktree (`.git` is a file there, and the installer skips only a `.git`
  folder). The same test passes on `main`'s own checkout, 5 of 5.
