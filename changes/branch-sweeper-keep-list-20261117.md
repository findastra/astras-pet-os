# The branch-sweeper's keep list (2026-11-17)

On 2026-11-14 GitHub Aquarium's branch-sweeper deleted three branches in one of Astra's private repos that she had
decided, earlier that day, to keep: nothing told the tool so, and a merged branch with nothing added after is "safe to
delete". Astra, 2026-11-16: "Yes, restore them", and they were put back at the same commits. Without a keep list the
next plan would have offered them for deleting again.

- **Astra's keep list:** `branch-sweeper-keep-20261117.json` in `Documents\Astra's PetOS Data\github-aquarium\` on her
  PC, next to the plans and undo logs. It names private repos, so it never goes in a repo. Each entry has the owner,
  repo and branch, her reason in her words, the date she decided and, when known, the repo's number on GitHub
  (`repo_id`, which a rename does not change) and the commit she saw (a record only: a kept branch stays kept when it
  moves). Schema `github-aquarium-branch-sweeper-keep-v1`.
- `verdict()` checks the list first, before any rule that would delete: a listed branch is "keep", shown with her
  reason ("On Astra's keep list: ..."), and her branches come first in the Keep group, so the page shows them. An entry
  matches its repo by name (any case) or by its number, so a renamed repo keeps its kept branches.
- `--apply` refuses a listed branch like any other "keep" row, even in a plan made before she listed it: in the plan's
  check, and again in the fresh check on GitHub, which now reads each repo under the name GitHub gives it today (a plan
  made before a rename still says the old one) and deletes under that name. A keep list that cannot be read stops the
  sweeper before it asks GitHub anything, and `--apply` does not run without the file. A check with no file has an
  empty list (a new farm) and says so.
- A listed branch that GitHub no longer has (deleted, or its repo renamed and the entry has no number) is reported on
  the console and under "Not covered" in the `--md` list, so it is noticed instead of keeping nothing; so is an entry
  whose repo has a new name.
- The first three entries are the three restored branches, with her reason from 2026-11-14 and their repo's number.
- GitHub Aquarium's tool box text, the tool's System Map node and its grant `goldfish-branch-sweeper-delete` say so;
  `npm run build` carried the grant's new words into PROTECTION-RINGS.md and every pet program page's R W X panel.
- Tests: seven new ones in `test/branch-sweeper-test-20261114.mjs`, with made-up names: the verdict, reading the list,
  a renamed repo, a plan made before a rename, the list, page and plan, `--apply` refusing a kept branch, and kept
  branches that are gone. Taking the list out of `verdict()`, of the plan's check or of the fresh check on GitHub each
  makes them fail.
- Checked by a separate read-only reviewer (Claude Sonnet 5.5, maker-checker rule): it found the rename gap and the
  missing-file gap above, both fixed here.
- First read-only check with the list (2026-11-17): 118 repos, 480 branches. The three kept branches are "keep" with her
  reason, first in the Keep group, and `"delete": false` in the plan. An `--apply` dry run on a plan that ticks them for
  deleting refuses all three with her reason.

Card 364. By Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-17.
