status: open (waiting on Astra: merge the rebuild pull request, then add three paths to line 59 of the Farmer's round workflow)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-19
needs: scripts/farmer-rounds-20261009.mjs, test/rounds-test-20261009.mjs, test/credit-line-readme-only-test-20261019.mjs, PET-FILES.md (README row), .github/workflows/farmer-daily-rounds.yml
---
## What I did

**Why the round failed.** The Friendly Farmer's daily round, run
[39304824157](https://github.com/findastra/astras-pet-os/actions/runs/39304824157) (scheduled, 2026-10-19 18:42 UTC),
ran all 37 self-audits, then stopped at `npm test`: only `test/credit-line-readme-only-test-20261019.mjs` failed (hub
#113, Astra 2026-10-19: the credit line goes only in a pet repo's own README). It flagged `status/pets-status.json` lines
49, 122, 136 and 186 and `apps/astras-pet-apps-20261008.html:1`. The source was one line of the round's self-audit,
`auditPet` in `scripts/farmer-rounds-20261009.mjs`: when a pet's README does not open with the credit line, the finding's
message quoted the whole sentence. Findings are written into `status/pets-status.json`, and the Farmer's desk
(`scripts/build-interfaces-20261008.mjs`) embeds that whole file on its first line. Four pets got the finding, hence
four lines (in my reproduction below: Python Panther, Paper Patty, File Master and Gone Ghost). With the test failing, the "Open a pull
request" step never ran, so no `farmer/rounds-20261019` branch or pull request exists; `status/pets-status.json` on
`main` is still the 2026-10-11 round's.

**What I changed** (branch `claude/farmer-round-credit-line-20261019`, not on `main`; the pull request is linked from
this card's commit):
- `scripts/farmer-rounds-20261009.mjs`: the finding now says `README does not open with the credit line (PET-FILES.md).`
  The check itself (the regex that looks for the line in a README's first ten lines) and the bubble label `my README
  needs the credit line` are unchanged, so a pet missing the line is still worried and says so.
- `test/rounds-test-20261009.mjs`: a whole round against a pretend GitHub, with every README missing the line, checks
  that the finding still names the line and that nothing the round writes (status and registry) contains the sentence.
  It fails on the old line and passes on the new one.
- I changed the round's wording, not the guard: PET-FILES.md says the line never goes in a generated file, and
  `status/pets-status.json` and the Farmer's desk are generated. Exempting generated audit text would let the sentence
  back into the desk page, which the rule forbids.
- Not touched: `.github/workflows/farmer-daily-rounds.yml` (this login has no workflow scope; nothing in it needed
  changing: Astra's own edit of 2026-10-18, `f6bd9f7`, already took `cage-data.js` out of its `git add` line).

**Tested,** in an LF clone (`core.autocrlf=false`) in my scratchpad, never in Astra's PC folders:
- Reproduced the failure on `main` (`a0ae17c`) by running the workflow's steps in order against live GitHub with only a
  read token and no `FARMER_TOKEN`, as in Actions: the round (37 self-audits), `node scripts/build.mjs --metadata-only`,
  `node scripts/build-interfaces-20261008.mjs`, then `npm test`: 182 tests, 1 fail, the same guard on the same lines
  (185 for 186: one line moved between the two runs).
- The same steps on the fix: `npm test` 183 tests, 182 pass, 0 fail, 1 skipped (Pets Board). The sentence appears 0
  times in `status/pets-status.json`, `pets.json` and the Farmer's desk, and the workflow's `git add` line would stage six
  changed files, so the pull request step has something to open. Nothing from these runs was committed or pushed.
- `npm test` on the clean branch: 183 tests, 182 pass, 1 skipped.

**Seen, not changed:**
- Round pull request [#83](https://github.com/findastra/astras-pet-os/pull/83) (2026-10-18) is still open. Its
  `status/pets-status.json` and Farmer's desk quote the sentence (5 and 1 times) and it still adds `cage-data.js`, so
  merging it would break `npm test` on `main`. Leave it: the next round closes it as replaced.
- `status/pets-status.json` keeps entries for repos the registry no longer has (for example `vrchat-ai-astra`, now
  `the-astral-plane`, with a 2026-10-11 finding about "A pet app by Astra"). The round never removes old entries.
- Text a pet writes (its job, bubble lines, or a card's "waiting on Astra" words) is copied into `pets.json` and the
  status file. If a pet ever writes the credit sentence there, the guard stops the round again. That is a pet repo's
  text to fix, not the round's.
- The workflow's second step is still named "Rebuild the Cage and the Farmer's desk" (a workflow edit, Astra's).

**Shipped the same day.** Astra gave her OK in chat and #128 was merged as `9a0d0b1`. Then, at Astra's word in
chat ("Yes, start the Farmer's round now from main"), I started the round by hand with `gh workflow run` on `main`
(`502f75a`). Run [39368064274](https://github.com/findastra/astras-pet-os/actions/runs/39368064274) was green in
every step: 38 self-audits, `npm test` 196 pass and 0 fail. It pushed `farmer/rounds-20261019` (`6ba72a6`), opened
[#138](https://github.com/findastra/astras-pet-os/pull/138) and closed #83 as replaced. The sentence appears 0 times
in that branch's `status/pets-status.json`, `pets.json` and Farmer's desk. #138 waits on Astra like every round.
Its `pets.json` changes are jobs, audits, bubble lines and mood lines that pets submitted from their own repos, so
they are data written by a pet.

**Then `main` went red, and it was my merge.** Astra said "ok, merge #138 and #139". I merged #138 as `171dcd7` and
#139 as `893335f`. Afterwards, `npm test` on `main` failed 3 tests, all of them "generated files are up to date"
checks: the pet program pages, the Markdown pets and `system-map-20261012.html`. `main` was green just before #138
(`c4c5939`: 208 pass). The cause is in the workflow. Its `git add` line (line 59) commits `pets.json`, `status`, the
README, ROSTER, RELATIONS, MOOD-KEY and the Farmer's desk. It leaves out `apps/pet-programs/`, `markdown-pets/` and
`system-map-20261012.html`, which `build.mjs --metadata-only` also rebuilds from `pets.json`. On the runner those files
were rebuilt, so the round's own `npm test` passed. They were never committed, so a round that changes `pets.json`
leaves them stale on `main`. Before merging I should have tested the merged result, not only the round's run.
- I ran `npm run build` on `main` (`893335f`) on branch `claude/round-pages-rebuild-20261019` and committed the
  output: 41 pet program pages, 6 Markdown pets and the System Map, all generated and none edited by hand.
  `npm test`: 208 pass, 0 fail, 1 skipped. The pull request is linked from this card's commit.

## Task
1. Astra: OK to merge the rebuild pull request (`main` is red until then).
2. **Astra, the workflow line** (this PC's GitHub login cannot change workflow files):
   https://github.com/findastra/astras-pet-os/edit/main/.github/workflows/farmer-daily-rounds.yml , line 59. Add
   ` apps/pet-programs markdown-pets system-map-20261012.html` to the end of
   `git add pets.json status ROSTER.md README.md RELATIONS.md MOOD-KEY.md apps/astras-pet-apps-20261008.html`, then
   **Commit changes**. Until then, every round that changes `pets.json` leaves those pages stale, and `main`'s
   `npm test` fails after its merge.

## Done when
`main` is green after a round's pull request is merged.

## Return
Set status: done with the round's pull request number and `main`'s test count after it is merged, commit.
