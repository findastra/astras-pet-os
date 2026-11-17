status: open (waiting on Astra: her OK to merge #373, after #337)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-11-16
needs: AGENTS.md, PET-FILES.md ("Rounds, self-audits and submissions"), changes/weekly-audits-every-pet-20261116.md
---
## Task

Astra, 2026-11-16: "all 85 pets should have audits that they do on a weekly basis. tell me what each of the 85 pets is
auditing for in list form." Then, to writing the proposed audits into the registry on a branch: "Yes, on a branch".

## Ownership and state

State: READY_FOR_REVIEW (Astra's merge OK)
Implementer: Claude Opus 5.5, this chat; writable files: the ones listed below; ownership: released
Reviewer: a separate read-only checker session reviewed the first revision; its findings are fixed in 22e79ff5

## What I did

- Branch `claude/weekly-audits-every-pet-20261116`, pull request #373, commit 22e79ff5 (and this card's commit).
- `pets.json`: the audit subject (and two needs) of Mail Snail, Backup Beaver, Deck Duck, Patch Cat, Wifi Butterfly,
  Gif Giraffe and API Fairy; an `audit` block on each of the 11 seeds in `seeds.pets`.
- `system-map.json`: an `audit` block on the 18 roadmap nodes and on `dubstep-gunsmith` (program 37).
- `scripts/pet-program-pages-20261018.mjs`: the self-audit pill says what the round really checks today.
- `test/weekly-audits-test-20261116.mjs` (new), `changes/weekly-audits-every-pet-20261116.md` (new).
- Rebuilt by `npm run build`: 57 pages in `apps/pet-programs/`, `MOOD-KEY.md`, `system-map-20261012.html`.
- Tests: the new test failed first (Dubstep Gunsmith had no audit; Mail Snail said "my plan"), then passed. In the
  worktree, `npm test` gave 471 tests, 464 pass, 1 fail, 6 skipped: the farm-install test that fails in any git
  worktree. The full run in a plain LF clone is in the pull request.
- Looked at Backup Dam's page from the branch in the browser pane (EDITORIAL bar on): the new self-audit line and the
  mood key show.

## Not done / next

- **Each pet's own repo:** Mail Snail's, Backup Beaver's and Deck Duck's `pet.json` still say "my plan", and API
  Fairy's `hub.submit` still sends her old subject. One small pull request per repo; nothing flags the difference yet
  (the Flash Audit's A16 only checks an audit block exists).
- **Mail Snail's job** is written two ways (bills in `pets.json`, sorting mail in `pet-programs.json`); Astra picks one.
- **#245** (Reactor Raccoon, a seed) needs an audit block once this is merged, or the new test fails.
- **Dubstep Gunsmith** is a seed with a repo but no `seeds.pets` entry (`skills/pet-finder`, wrong stage or missing).
- **The checks themselves:** the round checks every animal's repo files the same way. A subject is what the pet
  audits once its own checks are built; most are not.

## Done when

Astra has said OK in chat, #337 is merged first and this branch is brought up to date with it (take #337's side of
Flowsheet Flamingo's seed entry, take main's generated files, `npm run build`, `npm test`), and #373 is merged.

## Receipt and review

Checker review of the first revision: done (page wording, four "my plan" pets with confirmed roles, two wrong claims in
the changes file; all fixed in 22e79ff5). No review yet of this card's revision.
