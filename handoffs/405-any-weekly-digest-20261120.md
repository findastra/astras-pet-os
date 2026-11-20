status: open (waiting on Astra: merge #405 and portfolio-puffer#15; the site goes live with findastra.github.io#210)
for: any (Portfolio Puffer's chat)
from: Claude Opus 5.5 (claude-opus-5-5), 2026-11-20
needs: changes/weekly-digest-20261120.md, findastra/portfolio-puffer#15, findastra/findastra.github.io#210, card 019
---
## Task

Astra, 2026-11-20: "I think this can be called the weekly digest, and its part of portfolio puffer. it showcases the
things I worked on this week and really it shows the new things mostly, but also the most ingenuitive things, or the
things I request, make it a feature of the portfolio puffer as a tool".

Record the Weekly Digest as part of Portfolio Puffer (pet #14, Iced Out Iceberg), in the hub and in Puffer's own repo,
as pull requests only. The site itself is built in another chat (findastra/findastra.github.io#210, branch
`claude/weekly-digest-20261120`).

## Ownership and state

State: READY_FOR_REVIEW
Implementer: Claude Opus 5.5, a registration chat; writable files: the ones listed below; ownership: released
Reviewer: unassigned; next action: review #405 and portfolio-puffer#15, then Astra's OK in chat

## What I did

- **Hub:** branch `claude/weekly-digest-20261120`, pull request #405, commit b16be955 (and this card's commit).
  - `system-map.json`, both `"of": "program-14"` and both `planned`:
    - `weekly-digest`: the native program **Weekly Digest**, `iced-out-iceberg-v1.0-weekly-digest-v1.0`, a Website,
      https://findastra.github.io/weekly-digest/.
    - `weekly-digest-edition`: a weekly native trick, `iced-out-iceberg-v1.0-weekly-digest-edition-trick-v1.0`, whose
      job text holds its seven steps.
    - The link `portfolio-puffer` opens `weekly-digest` (planned), so the page lists it under Native programs.
  - `pets.json`: Puffer's job names the Weekly Digest.
  - `skills/new-pet-or-tool/SKILL.md`: the decision's row. `changes/weekly-digest-20261120.md` (new).
  - Rebuilt by `npm run build`: `apps/pet-programs/portfolio-puffer-20261018.html` (Native programs 4, Native tricks
    6), `TOOLS-AND-TRICKS.md` (442 rows), `system-map-20261012.html`, `markdown-pets/portfolio-puffer-20261019.md`,
    `markdown-pets/all-pets-20261019.md`, and the job in `README.md` and `ROSTER.md`.
  - Tests, from Git Bash in a fresh LF clone: `npm test` 499 tests, 493 pass, 0 fail, 6 skipped (untouched main
    ad7293de: the same); `npm run check`: Pets OK.
- **Puffer:** branch `claude/weekly-digest-20261120`, findastra/portfolio-puffer#15, commit 660076e:
  - `README.md`: a Weekly Digest section under Tools, with the trick's seven steps.
  - `pet.json`: the Weekly Digest in `tools` (`status: planned`), the job in the same words as the hub's, `updated`.
  - `changes/weekly-digest-20261120.md` (new).
- **Kinds:** Astra said "tool". By who does the work, a person opens the site, so it is a native program, and an AI
  picks and writes each edition, so making one is a native trick. Nothing runs by itself, so there is no native tool.
- **Not checked here:** the page in a browser (this chat did not use the browser pane), and the site's address, which
  answers nothing until findastra.github.io#210 merges.
- **Not rebuilt:** the Farmer's desk (`apps/astras-pet-os-20261008.html`, from `scripts/build-interfaces-20261008.mjs`,
  which `npm run build` does not run) still holds Puffer's old job, like other recent pets.json changes it is behind on.

## Not done / next

1. When findastra.github.io#210 merges and https://findastra.github.io/weekly-digest/ opens signed out: set `state`
   to `now` on both nodes and on the link in `system-map.json`, drop `status: planned` from Puffer's pet.json entry,
   then `npm run build`, `npm test` and a pull request.
2. Astra: OK the trick's name `weekly-digest-edition`, or give hers. "Weekly Digest" is her name.
3. Write the trick as a skill in Puffer's repo (`skills/weekly-digest-edition/SKILL.md`; SKILL.md is a reserved file
   name, an exception to the dated lowercase rule that has to be named first). Then Skill Scout tracks it.
4. After #405 merges, install the changed `skills/new-pet-or-tool` with Luna's Log's skill-install-tool, never by
   hand.
5. Privacy: the portfolio may name her (skills/farm-security, section 5), but an edition never does (the trick's step
   5).

## Done when

#405 and portfolio-puffer#15 are merged with Astra's OK, the site is live, and its states say `now`.

## Return

The chat that does step 1 updates `## What I did` and the status here, on its branch, in a pull request for Astra.

## Receipt and review

Pending: no checker has reviewed this revision yet.
