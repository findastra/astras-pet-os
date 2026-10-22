status: open (questions 1, 2 and 4 merged: #199, github-goldfish#26; question 3 waits on Codex's #178)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-21
needs: AGENTS.md and CLAUDE.md (the record line), handoffs/README.md, skills/handoff/SKILL.md, test/handoff-numbers-test-20261017.mjs, findastra/github-goldfish AGENTS.md
---
## Task
Astra asked on 2026-10-21 why pushing to GitHub keeps going wrong. The answer: many assistants write in parallel,
one person approves, pull requests wait, and almost every pull request edits the same few shared lines. Propose a
change to that convention, as a slide deck with one question per slide. Her OK on every merge stays; the goal is
fewer collisions per OK. **No rule and no repo's AGENTS.md changes until she answers.**

Deck (private): ✨ https://claude.ai/artifact/9259EozZsryoa1sBNzU6gq

## Ownership and state
State: waiting on Astra's answers.
Implementer: the Claude session that wrote this card; writable files: this card and its rows in handoffs/README.md;
ownership: released when this pull request merges.
Reviewer: unassigned. Next action: Astra answers the four questions; then one build pull request in the hub and one
in findastra/github-goldfish, each with its own OK.

## The problem: three shared spots
1. **The credit lines at the end of AGENTS.md.** AGENTS.md line 131 and CLAUDE.md line 19 say to record the model
   and version in AGENTS.md; every pet repo's AGENTS.md says the same. So every pull request appends a dated
   paragraph to the end of the same file, and any two open pull requests in one repo collide on those last lines.
   The hub's AGENTS.md has 74 dated credit lines (line 6, lines 131 to 138, 197 to 225 and 230 to 274 on `7906b9c`):
   about 60% of its text, in the file every assistant must read in full before any work.
2. **The handoff card counter.** Every new card takes the "Next free number" in handoffs/README.md and adds a row to
   both of its tables, so every card pull request edits the same three spots.
3. **Generated files** (the System Map page, the pet program pages): rebuilt by `npm run build` in every pull request
   that touches pets.json, system-map.json or the spawner. Counted below; not part of these questions.

The same thing was fixed once already: the merge-order list left a file on 2026-10-18 because "a shared list here
made every pull request conflict with the others" (handoffs/README.md, "Merge order").

## Evidence, 2026-10-15 to 2026-10-21
Method: every commit on every branch whose message says it merges `main` into a branch, replayed with
`git merge-tree --write-tree` to list the files that conflicted; each AGENTS.md conflict checked for whether it sits in
the dated credit lines. Open pull requests: each head replayed against `main` at `7906b9c` the same way. Counting
scripts kept locally, not in a repo; the method above reproduces them. All the conflicts fell on 2026-10-17 to
2026-10-21.

**Hub (findastra/astras-pet-os):** 153 pull requests merged, 174 opened.

| What | Count |
|---|---|
| Times an assistant merged `main` into a branch | 182 |
| ... and it had conflicts | 153 |
| Conflicts in AGENTS.md's credit lines (63 of the 64 AGENTS.md conflicts) | 63 |
| Conflicts in handoffs/README.md (31 of them on the "Next free number" line) | 53 |
| Conflicts in generated files (System Map page 77, pet program pages 24) | 88 |
| Conflicts **only** in the credit lines or the card list, nothing about the work | 45 |
| Conflicts only in the credit lines, the card list or generated files | 98 |

**Open now (hub `main` `7906b9c`):** 14 of 16 open pull requests conflict. 8 of the 14 conflict only in
handoffs/README.md or AGENTS.md's credit lines: #103, #143, #169, #172, #173, #176, #178, #179. Open pull requests
reuse card numbers already taken: 031 (#61), 061 (#172), 063 (#173; 063 also reached `main` with #195 tonight) and
064 (#178 and #179).

**GitHub Goldfish (findastra/github-goldfish):** 3 merges of `main` into a branch, 1 with a conflict: `c1d7c58`, for
#22. Its only conflict was the last lines of AGENTS.md: #22's "Private repos in project-image-generator" paragraph
against #10's "Social row tool" and #24's "The hub's rules, caught up". Its AGENTS.md has 14 dated credit lines in 65
lines, its "Built with" line included.

## The four questions (deck above)
| # | Question | Recommended |
|---|---|---|
| 1 | Where does each change's credit go from now on? A: one small new file per change, `changes/<topic>-YYYYMMDD.md` (changelog fragments). B: only in the commit message and the pull request. C: keep appending; the assistant merges `main` into the branch right before every merge | **A** |
| 2 | What happens to the credit lines already there (73 in the hub's AGENTS.md, 13 in GitHub Goldfish's, besides each "Built with" line)? A: moved word for word into one history file in `changes/`. B: left where they are; nothing new is added | **A** |
| 3 | Should the hub's handoff cards stop sharing one counter? A: a new card's number is its pull request's number, and the README stops listing each card. B: keep the counter, `npm run build` writes the list. C: as now | **A** |
| 4 | Which repos, and when? A: the hub and GitHub Goldfish now; every other repo with its next pull request. B: every repo now, one pull request each. C: the hub only | **A** |

## What a yes changes (not done; for the build pull requests)
- **Q1 A:** AGENTS.md line 131 and CLAUDE.md line 19 point to `changes/`; a short `changes/README.md` says what one
  file holds (what changed, Astra's words and date, the model and version, the card); the "Built with" line at the top
  stays (the Goldfish's model check, `index.html` line 750, looks for a model name in AGENTS.md, CLAUDE.md, README.md
  or pet.json). The text that new repos get (`scripts/idle-flash-new-repos-20261017.mjs`,
  `scripts/idle-flash-fix-20261017.mjs`, `scripts/idle-flash-refresh-20261018.mjs`: "Record the model and version
  when an assistant changes it.") says where. A test fails when a dated credit line is added to AGENTS.md.
- **Q2 A:** one small pull request, merged between others, moves 70 of the lines into
  `changes/history-20261007-20261021.md` unchanged, and leaves the "Built with" line and the last three credit lines
  where they are. Open pull requests that appended a line (#61, #143, #190) keep it, so they get no new
  conflict. After they merge, one small follow-up moves those last lines too.
- **Q3 A:** handoffs/README.md keeps cards 001 to 068 as they are and stops growing; skills/handoff/SKILL.md ("Read
  handoffs/README.md ... reserve the next free number") and test/handoff-numbers-test-20261017.mjs change to match.
- **Q4 A:** the hub's rule tells the next assistant in each pet repo to switch that repo's line when it changes it.

## Collision check (2026-10-21, hub `main` `7906b9c`)
Both changes were tried on a throwaway local commit, and each of the 17 open hub pull requests was replayed against it
with `git merge-tree`. Nothing was pushed.
- **Question 1's rule edit** (AGENTS.md line 131 and CLAUDE.md line 19 point to `changes/`): no open pull request
  gets a new conflict. #178 changes CLAUDE.md line 14 and AGENTS.md lines 27 and 184, which do not touch these lines.
- **Question 2's move** (70 lines out, the last three left at the end): no open pull request gets a new conflict.
  #190's line at the end still merges cleanly. #61, #143 and #178 conflict exactly as they do against `main` today.
- **Branches pushed in the last hours** that touch AGENTS.md, CLAUDE.md, handoffs/README.md or skills/handoff:
  #190 (end of AGENTS.md), #194 (card 052's row; merges cleanly with this card's pull request) and this card.
  Astra, 2026-10-21: no ChatGPT or Codex agent is working on GitHub any more.

## What comes first
- Hub #178 (`codex/handoff-workflow-20261020`, Codex) changes skills/handoff/SKILL.md, which question 3 changes too.
  It merges first, or its chat folds question 3's answer in.
- Merging this card's own pull request collides with the other card pull requests on handoffs/README.md, the very
  thing question 3 is about.

## What I did
- Read on hub `main` (`7741c97`, then `7906b9c`): AGENTS.md, CLAUDE.md, handoffs/README.md and its open-card table,
  skills/handoff, skills/merge-order, skills/questions-as-slides, skills/dev-mindset, skills/pet-app,
  docs/migration/PLAN.md ("Who edits what": AGENTS.md and handoffs/ are shared, "never rewrite another assistant's
  lines"). In findastra/github-goldfish (`b8d24e7`): AGENTS.md, handoffs/README.md, the engine's model check.
- **Not read in full:** ASTRAS_PET_OS.md, PET-FILES.md (only its "Model and version" row), PET-WORDS.md,
  INTELLIGENCE-LEVELS.md, PROTECTION-RINGS.md, TOOLS-AND-TRICKS.md, PET-PROGRAM-FRAMEWORK.md, MAKE-IT-YOURS.md, the
  other skills and the individual open cards. This card changes no rule, so nothing in them was changed.
- Counted the evidence above, read-only, in fresh scratchpad clones with `core.autocrlf=false`. Astra's PC folders
  were not touched.
- Made the deck: 10 slides, four questions, private.
- This card and its rows in handoffs/README.md (next free number 070), on `claude/shared-lines-proposal-20261021`.
- Second commit: Astra's answer to question 1, the collision check above, and question 2's move made collision-free
  (the deck shows question 1 as answered).
- **Seen, not changed:** the hub's skills/handoff/SKILL.md on `main` is older than the copy installed in both seats
  (Codex's version on #178's branch). Merge commits also collide on `skills/new-pet-or-tool/SKILL.md` (14 times,
  the decision rows) and INTELLIGENCE-LEVELS.md (12): the same append-at-the-end pattern, smaller.

## Done when
Astra has answered the four questions; her answers are under "Answers" below; the build pull requests (hub and
GitHub Goldfish) are open with her answers in their text.

## Return
Write Astra's answers, with her words and the date, under "Answers", in a pull request that changes only this card.

## Answers
- **Question 1: A**, one small new file per change. Astra, 2026-10-21, in the chat that asked for this card:
  "I am okay with it. Keep in mind the other chats that are working right now. ChatGPT conversations are already
  closed down and I left a note on everything so there should be no more working agents on the GItHub besides what
  is open here." She said this right after the recommendation to move the model and version log out of AGENTS.md
  into one small file per change, so it counts as her answer to question 1 only. That chat passed her words on.
- **Questions 2 to 4: A, A, A.** Astra, 2026-10-21, in this card's chat: "All recommended for shared-lines questions
  2 to 4 (card 069, hub #196): A, A, A."
  - 2 A: the old credit lines move word for word into one history file in `changes/`.
  - 3 A: a new card's number is its pull request's number, and handoffs/README.md stops listing each card.
  - 4 A: the hub and GitHub Goldfish change now; every other repo changes with its next pull request.
- **Build, questions 1, 2 and 4: merged** with Astra's OK in chat (2026-10-21: "OK, merge hub #199, github-goldfish
  #26 and hub #196.").
  - Hub #199 is on `main` as `3d549fe`. `main` was merged in twice before that (#167, #190, #191, #194, #195, then
    #197, #201). Tested tree `aa8c65a`: `npm run build` changes nothing, and 304 of 305 tests pass, 1 skipped. The
    tree on `main` is the tested tree. #190's line reached the end of AGENTS.md without a conflict, as planned.
  - findastra/github-goldfish#26 is on `main` as `5185034`, after `main` (#23) was merged in. Tested tree `5af13ee`:
    80 of 80 tests pass. The tree on `main` is the tested tree.
  - Both branches are kept.
  - Hub #199 (`claude/changes-folder-20261021`, `1e67bab` and `2dab307`): the rule in AGENTS.md, CLAUDE.md,
    PET-FILES.md and the Idle Flash templates for new pet repos.
    - 70 credit lines and the chat-order note moved to `changes/history-20261007-20261021.md`.
    - `changes/one-file-per-change-20261021.md` records the change.
    - The guard is `test/changes-folder-test-20261021.mjs`.
    - Tests: 292 of 293 pass, 1 skipped. No open hub pull request gets a new conflict.
  - findastra/github-goldfish#26 (`claude/changes-folder-20261021`, `0c6b5c5`): the same rule. 11 lines moved to
    `changes/history-20261008-20261021.md`, guard `test/changes-folder-20261021.test.mjs`. Tests: 80 of 80 pass. No
    open pull request there gets a new conflict.
  - Left for a follow-up after the open pull requests merge: the credit lines still at the end of each AGENTS.md
    (hub: the three kept plus #190's; GitHub Goldfish: three) move into the history files.
- **Question 3 is not built.** It changes skills/handoff/SKILL.md, and Codex's #178 rewrites that file. Apart from
  line endings, #178's version is the copy already installed for both Claude and Codex, so the hub's own copy is
  behind until #178 lands. #178 conflicts with `main` in handoffs/README.md (card 064, also used by #179), and its
  chat is closed. It needs Astra's decision first: carry it forward with `main` merged in, on a `claude/` branch
  (as #195 did for #177), then build question 3 on top.

## Receipt and review
Pending.
