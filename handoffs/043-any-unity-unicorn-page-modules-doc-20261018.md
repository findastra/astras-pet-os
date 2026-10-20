status: open (waiting on Astra: questions 1, 2 and 4 at the end of the doc)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-18
needs: docs/unity-unicorn-page-modules-20261018.md, PET-PROGRAM-FRAMEWORK.md (section 3), findastra/unity-unicorn pet.json (`intelligence_levels`)
---
## What I did

Astra asked (2026-10-18) that every Unity Unicorn tool sit in its correct pet program module. The hub doc that
PET-PROGRAM-FRAMEWORK.md links as the example was written before unity-unicorn PRs #6 to #9 were merged, so it no
longer matched the pet.

Read first: findastra/unity-unicorn `main` at `69453f7` (after PR #9 was merged), its `pet.json`, the page's
uu-modules lists, all 33 catalog files in `tools/`, every branch (all are already in `main` except Codex's two drafts),
draft PRs #1 and #3, and its card 002 for Codex.

On branch `claude/unity-unicorn-modules-doc-20261018` (not on `main`; the pull request is linked from this card's
commit), one file changed besides this card and its README row:
- **`docs/unity-unicorn-page-modules-20261018.md`**, rewritten to follow `pet.json` `intelligence_levels`:
  - L1: 34 tools on `main` (33 catalog files plus the run-unity-tool runner, kind Utility, no catalog file), sorted by
    the kind each catalog file gives. face-transfer is no longer "branch, no pull request": it was merged in PR #6.
    prop-decomposer (Audit) and realistic-prop-restyle (Generator) came in with PR #7. world-spawn-tool (Generator)
    moved in from liminal-doors in PR #9, which is merged, so it is not marked "not merged".
  - L1 not merged: 21 (PR #1: 8 with a catalog file and 10 menu only; PR #3: 2; asset-ledger: design only).
  - L1 programs: Poppy, Piranesi House, Liminal Doors, Dubstep Gunsmith, as in `pet.json`. Dubstep Gunsmith has a
    catalog file in PR #1 but is a program, not a tool. Unity Unicorn Icon stays a question for Astra.
  - L2: make-a-prop-look-real is the one trick. vcc-package-manager and vrchat-avatar-upload are in L1 only; "tool
    or trick?" still waits on Astra.
  - L3: harness skills face-transfer and vrchat-unity-world, with a line on why face-transfer is in L1 and L3 by name.
  - L4 and "Waiting on Astra": merging PR #1 and PR #3 after Codex's card 002; the three questions.
  - No tool of another pet was added.
- **Checked:** a script compared every list in the doc with `pet.json` `intelligence_levels` (tools on `main`, not
  merged, programs, 3rd party, tricks, tricks to write, L3 skills, the counts, and that no tool is in both lists or in
  L2). It passes, and it fails when one tool is removed from the doc. `npm test` in the worktree: 141 tests, 140 pass,
  1 skipped, 0 fail.
- `handoffs/README.md`: card 043's row in both tables, and the next free number is now 044. After merging `main`
  (card 042's new status), `npm test`: 141 tests, 140 pass, 1 skipped, 0 fail.
- Nothing in findastra/unity-unicorn was changed. The hub's live checkout stayed on `main`; the work is in a worktree
  in Claude's scratchpad.

**2026-10-19, Claude Opus 5.5 (`claude-opus-5-5`):** this card's pull request, #98, was merged as `105ea64`.
Question 3 is answered by PR #114 (merged as `5de6f23`): vcc-package-manager and vrchat-avatar-upload are native
tricks of Unity Stable, not tools. On branch `claude/unity-unicorn-tricks-20261019` (not on `main`; its pull request
is linked from the commit):
- `docs/unity-unicorn-page-modules-20261018.md`: a dated note at the top; L1 has 34 tools on `main` (kind Workflow:
  face-transfer only; matcap-palette and menu-map came in with unity-unicorn PRs #13 and #14); the two are tricks to
  write in L2, 4 in all; question 3 is marked answered.
- `INTELLIGENCE-LEVELS.md`: Unity Unicorn's row now follows unity-unicorn's `pet.json` `intelligence_levels`:
  34 tools on `main` (face-transfer was merged in PR #6, so it is no longer "on a branch"), 21 not merged, the four
  tricks to write; its error reads "20 tools stuck in two unmerged draft PRs".
- findastra/unity-unicorn PR #15 (branch `claude/vcc-and-upload-tricks-20261019`, merged as `7b1fdce` on Astra's OK)
  made the same move in `pet.json` and on the page (0.4.5). The two catalog files stay in `tools/`, with kind `Trick to write`.
- This card's status and its row in `handoffs/README.md`. Tests are in the pull request.

## Task

1. Astra: say if this pull request can be merged.
2. Whoever is in Unity Unicorn's seat next: `pet.json`'s `job` line in findastra/unity-unicorn still says
   "26 dated tools"; it has 34 on `main`. Change it there, in its own pull request.
3. When Codex merges tools from unity-unicorn PR #1 or #3 (their card 002), update this doc's tables and counts in
   the same way, from `pet.json` `intelligence_levels`.

## Done when

This pull request is merged, and the doc still agrees with unity-unicorn's `pet.json` `intelligence_levels`.

## Return

Write the merge commit here, set `status: done`, commit.
