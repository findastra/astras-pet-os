status: open (waiting on Astra: merge #364; then which branches to delete)
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
State: IN REVIEW
Implementer: Claude Code session; writable files: the files below; ownership: released once #364 merges
Reviewer: Astra; next action: her OK in chat to merge #364

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

## Not done
- Nothing is deleted. After the merge, Astra decides: the 947 safe ones (a chat runs `--apply` on the plan after her OK
  in chat), and each of the 34 "ask" rows.
- The skill row reaches `~/.claude/skills` only after Luna's Log's skill-install-tool installs it again.
- #327 also appends a row to `skills/new-pet-or-tool/SKILL.md`; whichever merges second keeps both rows.
- Notices to File Master and the Pet Police Officer for each delete (as mass-delete sends) are not built; the undo log
  is the record for now.
- GitHub's per-repo setting "Automatically delete head branches" is untouched; turning it on is a settings change for
  Astra to name.

## Done when
#364 is merged and GitHub Aquarium's page on her PC shows the real counts in the branch-sweeper tool box.
