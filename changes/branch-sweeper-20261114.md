# GitHub Aquarium's branch-sweeper (2026-11-14)

Astra, 2026-11-14: "I'm kind of worried that there's a bunch of branches out there on GitHub that are not deleted that
I should have been deleting ... a branch deleter, assessor and deleter", then "Plan is fine, build it" and "make this
tool the way that any other GitHub Goldfish tool is made".

- New tool `github-aquarium-v1.0-branch-sweeper-v1.0` (`scripts/branch-sweeper-20261114.mjs`, `npm run branch-sweeper`),
  beside outstanding-items, whose read-only GitHub code it reuses. It sorts every branch into three groups:
  - **Safe to delete:** all its work is already on the main branch, or its pull request was merged and nothing was
    added after.
  - **Ask Astra:** closed without merging, more added after a merge, or old work (30+ days) with no pull request.
  - **Keep:** the main branch, `gh-pages` and `board`, release and protected branches, open pull requests, branches
    an open handoff card names, and work from the last 7 days.
- Deleting runs only from a plan file (`--plan`), only on the rows marked `"delete": true`, at most 200 at once, only
  with `--yes`, and only while signed in as the farm owner. Each branch is checked again first (same commit, still not
  "keep"). Its name and commit go into an undo log on her PC before the delete, and `--undo <log> --yes` puts it back.
- Its round tool box sits in GitHub Aquarium's L1 control panel after the five outstanding-items tools. It shows how
  many branches are in each group and the first three of each. It reads the list from
  `Documents\Astra's PetOS Data\github-aquarium\branch-sweeper-page-data.js` on her PC only; anywhere else it shows
  made-up examples. The page never deletes anything.
- On the System Map as a tool of GitHub Aquarium. Its write grant `goldfish-branch-sweeper-delete` is written only and
  waits on Iron Gates for a branch-only token.
- First check on 2026-11-14 (read only): 114 repos, 1,351 branches: 947 safe to delete, 34 to ask, 370 to keep. Six
  "safe" hub branches were checked with git: every commit of each is on main.

By Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-14.
