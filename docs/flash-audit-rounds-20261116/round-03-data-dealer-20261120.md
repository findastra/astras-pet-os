# Round 3: Data Dealer — Data Chip

[All rounds](README.md) · Stage: **registered** · Repo: [findastra/data-dealer](https://github.com/findastra/data-dealer)
(private) · audited `main` at `72aba06` · Flash Audit, 2026-11-20

Astra, 2026-11-19: "let's roll through the easiest ones first and get going. I want to do one item at a time." Item 3
was next once the art and the `pet-app` topic were set aside. All 71 checks were run in the matrix's order. Only what
is not a pass is listed.

## How it was checked

- **The Run's checks:** the auditor run again for item 3 alone today, with Goldfish's preflight from her PC (it is
  only on Codex's `codex/l3-activity-20261016` there). It found 5 things: A16, A18, A15 twice and A55.
- **The page checks:** Data Chip's pet program page compared with the Model Pet Program. Nothing differs. A49 still
  waits on the redraw.
- **By hand:** the repo's `AGENTS.md`, `CLAUDE.md`, README and `pet.json`, its eight open pull requests and five open
  handoff cards, the Codex branches, the tool lists in the hub, the retired names, and the PC folder (read only). The
  pet program page was checked in the browser pane at 390 and 768 px wide: no sideways scroll. In a scratch copy,
  `python dashboard/build.py` gave the committed `dashboard/index.html` byte for byte (A34).

## Missing, Incorrect and Not verified

| Check | Result | What was found | Fix |
|---|---|---|---|
| ⚪ A15 README and credit (Goldfish's) | Incorrect + Missing | The Data Chip section's first line is the retired credit line. Its Limits line was not a heading, so the README had no Limits section. | Credit: already fixed in [data-dealer#10](https://github.com/findastra/data-dealer/pull/10) (2026-10-20, one line, mergeable). Limits: [data-dealer#18](https://github.com/findastra/data-dealer/pull/18) makes it a `### Limits` heading inside the Data Chip section only. The README above it is the product's own (the Idle Flash Audit's `PRODUCT_README`), so it is unchanged. |
| ⚪ A16 Metadata and self-audit | Missing | `pet.json` had no `framework`. | [data-dealer#18](https://github.com/findastra/data-dealer/pull/18): `framework` says the hub's page is built to the framework and the desk is not yet. `framework_limitations` points at Codex's #6, which has the desk's parts. `source` and its tag `v0.1.0-20261008-pets` exist, and so does the release. |
| ⚪ A57 Current names only | Incorrect | The README's Limits line said "the old pets page opens that app", as if that page still ran. `pet-app` is in `pet.json` (`kind`, `hub.topic`). The folder's icon comes from the old-name icon folder. | The sentence is gone in [data-dealer#18](https://github.com/findastra/data-dealer/pull/18). `pet-app` waits on #256 and the folder icon on round 1's decision. |
| 🔵 A18 Official tool and trick inventory | Missing | There are no tools anywhere: none in `pet.json`, 0 native tools on the page and none in `TOOLS-AND-TRICKS.md`. The lists agree. The page shows three planned tricks (self-audit, play-with, care-for). The repo's own skills (weekly-brief, provenance-manifest, handoff) and its nine Claude Code agents are counted at L3 in `INTELLIGENCE-LEVELS.md`. | 🔵 Which tools Data Chip gets is yours. `INTELLIGENCE-LEVELS.md` suggests one: a daily Data Dealer health report. |
| ⚪ A55 Pictures | Missing | The README shows one picture (the v2 process flow). The others would be the pet, its pet program page and the program working, and all three show Data Chip. | Waits on the redraw, then on card 026 (pictures you take). |
| ⚪ A17 Git and deployment | Incorrect | The PC folder is a real clone of `findastra/data-dealer`, but it is checked out on Codex's `codex/l3-activity-20261016`: 25 commits behind `main` and 4 ahead (all pushed, as #6). One untracked picture sits at its root, `data-dealer-process-flow-diagram-1.png`, dated 2026-10-05. It isn't mine, so I didn't touch it. `INTELLIGENCE-LEVELS.md` marks the folder 🔌 not connected, which is wrong. | Left as it is, because the checkout is Codex's (card 035). The 🔌 mark is held with the lists: 11 open hub pull requests change `INTELLIGENCE-LEVELS.md`. |
| ⚪ A35 Handoff and unresolved work | Incorrect | 8 open pull requests. #10 (credit) and #12 (sprite frames at `art/latest`, from your 2026-10-24 "all recommended", hub #242, now merged) are ready and mergeable. #9 (`homepage`, 2026-10-19) is mergeable and its link works, but A59 passes without it. #17 (skill files, Luna's Log card 011) and #14 (Cung List, conflicts) belong to their own chats. #5, #7 and #6 are one Codex stack: #6 holds all three. It conflicts with `main` in 5 files, and its `pet.json` still has the old hub key and old hub name. Handoff cards 001 to 005 (2026-10-06) are open; they are Data Dealer's own work. | 🔵 Merge #18, #10 and #12, and close #9? The stack is Codex's under card 035 (you answered "Merge them" on 2026-10-18), so it isn't asked again. |
| Art: A01, A02, A03, A04, A05, A61, A49 | Waits on the redraw | | Checked on the new drawings when they land. #12 points the sprite at `art/latest`, so the redraw reaches Data Chip by itself. |
| A08, A11, A12, A19, A20, A21, A22 (live), A23, A24, A25, A27, A28, A29, A30, A32, A37, A38, A40, A42, A43, A50, A58 | Not verified | These need you there (a click, a sign-in, a live seat), a live tool run, or a pass of their own. | 🔵 Next Active Flash Session. |

Everything else passed. That is the 19 page checks that match the template (A49 waits on the art and A22's live part
is not verified), plus A59, A06, A07, A09, A10, A13, A14, A26, A31, A33, A34, A45, A54 and A56, with A53 (the folder
opens no programs, and its icon is set) and A36 (the tutorial is The Farm's) not applying. Out of 71: 35 pass, 7
Missing or Incorrect, 7 waiting on the art and 22 Not verified.

**For Data Dealer's own chat (product text, not the pet's):** `site/index.html` (2026-10-06) still names the parts
with the v1 casino names that `docs/naming.md` replaced the same day (its "Was" column), and
`.claude/agents/engineer.md` names one of those as a folder. These are Data Dealer's own words, not the hub's, so
this round leaves them alone.

## Decisions waiting on you

1. Merge [data-dealer#18](https://github.com/findastra/data-dealer/pull/18) (this round),
   [#10](https://github.com/findastra/data-dealer/pull/10) (credit) and
   [#12](https://github.com/findastra/data-dealer/pull/12) (sprite at `art/latest`)? All three merge cleanly with one
   another.
2. Close [data-dealer#9](https://github.com/findastra/data-dealer/pull/9) (`homepage`: it works, but nothing needs
   it, the same as Puffer's #6)?

<sub>Flash Audit, 2026-11-20, Claude Opus 5.5 (`claude-opus-5-5`). Checks were read-only. Nothing was clicked for you,
launched or signed in to.</sub>
