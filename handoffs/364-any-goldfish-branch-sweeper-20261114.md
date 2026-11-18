status: taken by Claude Opus 5.5 (claude-opus-5-5), 2026-11-17, for the keep list (branch claude/branch-sweeper-keep-list-20261117)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-11-14
needs: pull request #364
---
## Task
Astra, 2026-11-14: "I'm kind of worried that there's a bunch of branches out there on GitHub that are not deleted that I
should have been deleting ... we need to make a new tool on the GitHub Aquarium that is a branch deleter, assessor and
deleter". Then "Plan is fine, build it" and "make this tool the way that any other GitHub Goldfish tool is made ... Find
out where the other tools are and put them where that" (her message cut off there).

## Ownership and state
State: MERGED (#364, Astra's OK in chat, 2026-11-14)
Implementer: Claude Code session; ownership of the tool's files: released
Reviewer: Astra; next action: none waiting on her; the follow-ups under "Not done" are for any chat

2026-11-17: taken by a Claude Code session (Claude Opus 5.5) to add a keep list, on `claude/branch-sweeper-keep-list-20261117`.
Writable files: `scripts/branch-sweeper-20261114.mjs`, `test/branch-sweeper-test-20261114.mjs`, this card, the
`branch-sweeper` node and the grant `goldfish-branch-sweeper-delete` in `system-map.json`, the branch-sweeper tool box
text in `scripts/pet-program-pages-20261018.mjs`, a new note in `changes/`, and what `npm run build` writes from them.

## The sweep (2026-11-14, each step after Astra's OK in chat)
- Astra: "Yes, delete the 947". The tool ran in five plans of at most 200: 944 deleted, 3 already gone (moodglass).
  Undo log: `Documents\Astra's PetOS Data\github-aquarium\branch-sweeper-undo-20261114.jsonl` (944 lines).
- Astra then saw the 34 "ask" branches and 13 newly safe ones as a five-question deck ("Branches To Decide") and
  answered "All recommended":
  1. 17 branches whose pull request was closed unmerged, at the same commit as the pull request (GitHub keeps them
     there, with "Restore branch"): deleted.
  2. 4 branches merged and then given one commit whose added lines are (nearly) all on main (github-goldfish
     `claude/home-once-20261016`, unity-unicorn `claude/menu-map-20261019` and `claude/matcap-palette-20261019`,
     astras-pet-os `claude/home-line-20261016`): deleted.
  3. 3 branches with real work after their merge, kept for a look by each project's chat: astras-infinite-pole
     `claude/cloud-rounds-36-38-20261017` (16 commits, 279 files not on `codex/fine-magic`), findastra.github.io
     `claude/polaroid-scatter-20261029` (5 commits of page code) and `codex/portfolio-galaxy-cards-20261030` (Codex's,
     a change note and a card).
  4. 10 branches with no pull request: each saved first as the tag `archive/<branch>` at the same commit (checked),
     then deleted. Two were Codex's: `codex/identity-bound-access-20261014` (astras-pet-os) and
     `codex/flash-audit-20261014` (github-goldfish).
  5. 13 branches merged after the morning check with nothing added: deleted.
  44 deleted in all; undo log `branch-sweeper-undo-20261115.jsonl` (see the date note under "Not done").
- Three of the 13 in step 5 were branches in one of Astra's private repos that she had decided to keep that same day
  (the morning list had them under the repo's old name, so the evening list showed them as new). Nothing told the
  tool. Astra, 2026-11-16: "Yes, restore them": they were put back at the same commits (lines 1 to 3 of that undo
  log). The keep list below (2026-11-17) is so that no plan offers them again.
- How the "ask" rows were judged: each added line of the branch looked up in main's copy of the file, new files looked
  up on main, and the pull request's head compared with the branch tip.

## What I did
- Branch `claude/branch-sweeper-20261114`, pull request #364, worked in its own worktree. The live hub folder was not
  touched.
- `scripts/branch-sweeper-20261114.mjs` (`npm run branch-sweeper`): check (read only), `--plan`, `--apply <plan> --yes`,
  `--undo <log> --yes`. It reuses outstanding-items' read-only `graphql`, `listRepos`, `PUBLISH_BRANCHES` and `whoOf`.
- `test/branch-sweeper-test-20261114.mjs`: 9 tests (the rules, the plan, a pretend GitHub for delete and undo, the page
  and the map). `test/key-requests-test-20261019.mjs` now counts the fourth local list the page loads.
- `scripts/pet-program-pages-20261018.mjs` and `apps/pet-programs/pet-program-page-20261018.js`: the branch-sweeper
  tool box in GitHub Aquarium's L1 control panel, after the five outstanding-items tools.
- `system-map.json`: the `branch-sweeper` node (`of: program-2`) and the grant `goldfish-branch-sweeper-delete`
  (written only). `npm run build` rebuilt the pages, TOOLS-AND-TRICKS.md, PROTECTION-RINGS.md and the Markdown pets.
  The grant reaches every pet's repo, so every pet page's R W X panel lists it.
- `skills/new-pet-or-tool/SKILL.md`: the decision row. `changes/branch-sweeper-20261114.md`: the change note.
- First read-only run on findastra: 114 repos, 1,351 branches, 947 safe to delete, 34 to ask, 370 to keep. The list and
  a plan are on her PC: `Documents\Astra's PetOS Data\github-aquarium\branch-sweeper-page-data.js` and
  `branch-sweeper-plan-20261114.json`.
- `npm test`: 451 pass, 1 fail, 6 skipped. The failure is the Windows "from scratch" farm test, which also fails on clean
  main on this PC (card 347).
- Looked at in the browser pane from 127.0.0.1: the tool box draws with its three groups and made-up examples.

### 2026-11-17: Astra's keep list (Claude Opus 5.5)
- Branch `claude/branch-sweeper-keep-list-20261117`, in its own worktree (an LF checkout). The live hub folder was not
  touched.
- `scripts/branch-sweeper-20261114.mjs`: the keep list, `KEEP_FILE` = `branch-sweeper-keep-20261117.json` (schema
  `github-aquarium-branch-sweeper-keep-v1`), read from her PC's `Documents\Astra's PetOS Data\github-aquarium\`, never
  from a repo. Each entry: owner, repo, branch, `why` (her reason), `date` (the day she decided) and, when known,
  `repo_id` (the repo's number on GitHub, so a rename does not lose it) and `sha`. `verdict()` checks it before any
  other rule: a listed branch is "keep" with "On Astra's keep list: <her reason>", and her branches come first in the
  Keep group. `checkPlan()` and `--apply` refuse a listed branch even in a plan made before she listed it; the fresh
  check on GitHub reads the list too, under the repo's name as GitHub gives it now (`collect()` keeps that name and the
  number), and deletes under that name. A list that cannot be read stops the sweeper before it asks GitHub anything,
  and `--apply` does not run without the file; a check with no file has an empty list and says so. Kept branches GitHub
  no longer has, and entries whose repo was renamed, are reported (console, "Not covered" in `--md`).
- The keep list on her PC holds the three restored branches, each with her reason from 2026-11-14 (her words and where
  she said them), the repo's number and the commit. Only that file names them.
- `test/branch-sweeper-test-20261114.mjs`: 7 new tests, 16 in all, with made-up names: the verdict, reading the list
  (no file, a missing file for `--apply`, a byte-order mark, every bad field), a renamed repo, a plan made before a
  rename, the list, page and plan, `--apply` refusing a kept branch (also from an older plan, with a pretend GitHub: no
  delete, no undo line), and kept branches that are gone. Taking the list out of `verdict()`, `checkPlan()` or the
  fresh check in `apply()` each makes them fail (checked on a scratch copy).
- Maker-checker: a separate read-only reviewer (Claude Sonnet 5.5) read the diff. It found two gaps, both fixed: a plan
  made before a repo rename could slip past an entry written under the new name, and a missing file left `--apply`
  without the list.
- `system-map.json`: the `branch-sweeper` node's job and the grant `goldfish-branch-sweeper-delete` (`on`, `how`) name
  the keep list. `scripts/pet-program-pages-20261018.mjs`: the tool box text. `npm run build` rebuilt PROTECTION-RINGS.md,
  the System Map page, the two Markdown pets and 56 pet program pages (only the grant's words in their R W X panels).
- `changes/branch-sweeper-keep-list-20261117.md`: the change note.
- Read-only check from this branch on 2026-11-17: 118 repos, 480 branches (95 safe to delete, 10 to ask, 375 to keep).
  The three kept branches are "keep" with her reason, first in the Keep group, and `"delete": false` in the plan; "keep
  list: 3 branches Astra keeps, 3 found on GitHub". It also rewrote the page's list on her PC (it was from 2026-11-14);
  the plan and the full list went to a scratch folder, not into her data folder.
- `--apply` dry run (no `--yes`) on a scratch plan that ticks the three for deleting, as an older plan would, plus one
  row under the repo's old name: the three are refused with her reason, the old-name row is "gone already", 0 deleted,
  no undo log written; the three branches are still on GitHub at the same commits.
- Looked at in the browser pane from 127.0.0.1 (this branch): the Keep group starts with the three, with her reason, and
  the tool box text names the keep list.

## Not done
- The three kept branches in step 3 above: each project's chat decides whether to finish or drop the work.
- The undo log is named by the UTC date (`...-20261115.jsonl` for a run on the evening of 2026-11-14 in Denver);
  the naming rule wants the America/Denver date. A small fix in `scripts/branch-sweeper-20261114.mjs`.
- The tool has no "archive, then delete" step of its own; the 10 tags were made by hand with `gh api`.
- The skill row reaches `~/.claude/skills` only after Luna's Log's skill-install-tool installs it again.
- #327 also appends a row to `skills/new-pet-or-tool/SKILL.md`; whichever merges second keeps both rows.
- Notices to File Master and the Pet Police Officer for each delete (as mass-delete sends) are not built; the undo log
  is the record for now.
- GitHub's per-repo setting "Automatically delete head branches" is untouched; turning it on is a settings change for
  Astra to name.
- Keep-list entries are added by hand, on Astra's word; the tool has no command that adds one. An entry without the
  repo's number matches by name only, so after a rename it needs changing (the check reports it as not found).
- A keep-list branch name must fit the tool's own branch-name rule (letters, digits, `.`, `_`, `-` and `/`); a name
  outside it stops the sweeper with an error, as it could never be deleted anyway.
- INTELLIGENCE-LEVELS.md's GitHub Goldfish row lists outstanding-items but not branch-sweeper (since #364).

## Done when
#364 is merged and GitHub Aquarium's page on her PC shows the real counts in the branch-sweeper tool box (done
2026-11-14), and the three kept branches have an owner's decision.
