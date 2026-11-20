status: open (waiting on Astra: merge #387; then the Luna's Log follow-ups below, after #18 and #14)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-11-19
needs: AGENTS.md, test/old-pets-page-guard-test-20261119.mjs, findastra/lunas-log global-rules/ and rules/
---
## Task

Astra, 2026-11-19, about the old pets page's name: "ive been trying to permanently get rid of" it "everywhere". She
answered the six-question
clean-up deck with **all recommended**. The page itself went in #96 (2026-10-18) and every name for it, data keys
included, in #353 (2026-11-12). This card covers what was still around it.

## Ownership and state

State: READY_FOR_REVIEW (this pull request); the Luna's Log items are open for any assistant.
Implementer: Claude Opus 5.5, this chat; writable files: `test/old-pets-page-guard-test-20261119.mjs` and this card;
ownership: released.
Reviewer: unassigned.

## What I did

Answers, as recorded (1 to 6 = the deck's questions):

1. **Assistant rules and memory.** Added one standing correction (the old pets page is gone for good) to both installed rule
   files (Claude's and Codex's global rules) on this PC. Removed the old page's task group and its stray mentions from
   Codex's memory summary (Codex's raw session logs are left as history). Claude's own memory already said it is gone.
2. **Luna's Log** (not done, blocked on ownership): its Skill Scout check still suggests keeping the old page and its
   data key, and its public catalog (`data/catalog-public-20261017.*`) is a snapshot that quotes the old
   rules. The check lives in `rules/skill-scout-rules-20261017.json` and `skill-scout-20261017.mjs`, which open
   lunas-log #14 edits; the rule masters in `global-rules/` are edited by open lunas-log #18.
3. **Release notes:** reworded the notes of v0.1.0-beta, v0.1.1-beta, v0.2.0-beta and v0.3.0-beta on GitHub; tags,
   downloads and dates unchanged. The downloads of v0.1.0 to v0.2.0 still contain the old page's files; only the
   notes changed, as answered.
4. **Guard:** this pull request adds `test/old-pets-page-guard-test-20261119.mjs`. It passes on `main` at `5179d856`
   and fails when a probe file with the word is added. The Goldfish's private naming-rule file on Astra's PC now flags
   the old page's name in every findastra repo except Data Dealer and Iris's story (CLI: `--naming-rules`). The four open pull
   requests that mention the word (#61, #103, #173, #256) are left to their owners; the guard blocks them until cleaned.
5. **Left on purpose:** Data Dealer's own casino vocabulary (its payments desk) and one ordinary line of prose in
   Iris's origin story mean something else.
6. **History kept; leftovers recycled:** commit messages and merged titles stay. On Astra's PC the old temporary clones,
   two old Voicemeeter Bug logs and two retired memory notes went to the Recycle Bin (restorable).

Full test run on this branch: 496 tests, 488 pass, 2 fail, both already failing on `main` and not touched here:
`public-safety-test-20261014.mjs` flags a personal folder path in `test/port-watch-test-20261119.mjs` (from #385), and
the 92-second Windows from-scratch install test.

## Not done / next

- **After lunas-log #18 merges:** add the same standing-correction line to `global-rules/claude-global-rules-*.md`
  and `global-rules/codex-global-rules-*.md`, so the next install keeps it.
- **After lunas-log #14 merges:** change the Skill Scout check's fix to "the old pets page is deleted; remove the
  reference", then rebuild the public catalog (`node skill-scout-20261017.mjs census` then `public`) and point
  `skill-catalog-20261111.html` at the new dated file.
- **Branch sweeper:** offer `claude/roam-free-wip-20261009` and the 2026-11-02 branch that began this clean-up for deleting; both
  are merged in other ways (#96, #353). Nothing is deleted without Astra's yes.

## Done when

#387 is merged with Astra's OK, the guard passes on `main`, and the two Luna's Log follow-ups are merged.

## Return

Record receipt, review and the Luna's Log follow-ups in this card.

## Receipt and review

Pending.
