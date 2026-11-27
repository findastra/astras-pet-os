# Round 8: The Nectar Nest — Health Hummy

[All rounds](README.md) · Stage: **registered** · Repo: [findastra/health-hummy](https://github.com/findastra/health-hummy)
(private) · audited `main` at `1cf9856` · Flash Audit, 2026-11-20

Astra, 2026-11-19: "let's roll through the easiest ones first and get going. I want to do one item at a time." Item 8
was next after round 3. All 71 checks were run in the matrix's order. Only what is not a pass is listed.

## How it was checked

- **The Run's checks:** the auditor run again for item 8 alone today, with Goldfish's preflight from her PC. It found
  5 things: A10, A16, A18, A15 and A55.
- **The page checks:** Health Hummy's pet program page compared with the Model Pet Program. Nothing differs. A49 still
  waits on the redraw.
- **By hand:** the repo's `AGENTS.md`, `CLAUDE.md`, README and `pet.json`, its two open pull requests and its branches,
  its tag and release, the hub's copy of the desk, the tool lists in the hub and the retired names. Health Hummy has no
  folder on this PC. The pet program page was checked in the browser pane at 390 and 768 px wide: no sideways scroll.

## Missing, Incorrect and Not verified

| Check | Result | What was found | Fix |
|---|---|---|---|
| ⚪ A10 Website route | Missing | The desk is already on the hub's public site: `apps/health-hummy-20261008.html` opens (200), and the README links to it. But `pets.json` registers no `interface_live_url` for it, so the Run finds no program address. Only 4 of the 23 `pets.json` entries have one. Portfolio Puffer is the same (round 14's A10 is corrected). | 🔵 Register that copy as its address, as Data Dealer's was on 2026-10-18? Health Hummy is one of the two private pets kept out of the public lists, so this is yours. |
| ⚪ A15 README and credit (Goldfish's) | Incorrect | The first line is the retired credit line. The Credits section said "Made by Astra." and "The pet artwork is copied from Astra's PetOS", but since 2026-10-18 the pictures live only in the hub. The README never said that its job (lifting, cardio, pole plans) is not built yet. | First line: already fixed in [health-hummy#7](https://github.com/findastra/health-hummy/pull/7) (2026-10-20, one line, mergeable). The rest: [health-hummy#10](https://github.com/findastra/health-hummy/pull/10). |
| ⚪ A16 Metadata and self-audit | Missing + Incorrect | `pet.json` had no `framework`. `source` opened `tree/v0.1.1-20261009`, a tag that was never made (404). `release_tag` still names that tag. `updated` was 2026-10-09. | [health-hummy#10](https://github.com/findastra/health-hummy/pull/10): `framework` says the hub's page is built to the framework and the desk is not yet. `source` opens commit `352470a`, as the README does (200). `updated` is 2026-11-20. 🔵 The tag: the same question as Puffer's. |
| 🔵 A07 Program name/version | Incorrect | The README never named the program. Its second heading was the pet's name, and the text under it described only the daily check-in desk. | [health-hummy#10](https://github.com/findastra/health-hummy/pull/10): that heading is now "The Nectar Nest" (from `pet-programs.json`), with its job. The version, `0.1.1-20261009`, matches everywhere. |
| 🔵 A18 Official tool and trick inventory | Missing | There are no tools anywhere: none in `pet.json`, 0 native tools on the page, and `TOOLS-AND-TRICKS.md` leaves the private pets out. The lists agree. The page shows three planned tricks (self-audit, play-with, care-for). | 🔵 Which tools it gets is yours. |
| ⚪ A55 Pictures | Missing | The README shows one picture, the desk (2026-10-17). The pet and its pet program page would show Health Hummy. | Waits on the redraw, then on card 026 (pictures you take). |
| ⚪ A57 Current names only | Incorrect (held) | `pet-app` is in `AGENTS.md` ("Repository topic") and in `pet.json` (`kind`, `hub.topic`). | Waits on #256, as in round 1. |
| ⚪ A35 Handoff and unresolved work | Incorrect | 2 pull requests are open. #7 (credit) is mergeable. #6 (`homepage`, 2026-10-20) is mergeable, but nothing reads that field, the same as Data Dealer's #9, and it conflicts with #10 on the `updated` line. The branch `claude/agents-md-rules-only-20261112` is left over: #9 merged it today. | 🔵 Merge #10 and #7 and close #6? The leftover branch is the branch sweeper's. |
| Art: A01, A02, A03, A04, A05, A61, A49 | Waits on the redraw | | Checked on the new drawings when they land. `pets.json` still calls the art a "DRAFT as a hummingbird (a guess from the name)". |
| A08, A11, A12, A19, A20, A21, A22 (live), A23, A24, A25, A27, A28, A29, A30, A32, A37, A38, A40, A42, A43, A50, A58 | Not verified | These need you there (a click, a sign-in, a live seat), a live tool run, or a pass of their own. | 🔵 Next Active Flash Session. |

Everything else passed. That is the 19 page checks that match the template (A49 waits on the art and A22's live part
is not verified), plus A59, A06, A09, A13, A14, A17, A26, A31, A33, A34, A45, A54 and A56, with A53 (no folder on this
PC) and A36 (the tutorial is The Farm's) not applying. Out of 71: 34 pass, 8 Missing or Incorrect, 7 waiting on the
art and 22 Not verified.

## Decisions waiting on you

1. Merge [health-hummy#10](https://github.com/findastra/health-hummy/pull/10) (this round) and
   [#7](https://github.com/findastra/health-hummy/pull/7) (credit), and close
   [#6](https://github.com/findastra/health-hummy/pull/6) (`homepage`)?
2. The `v0.1.1-20261009` tag, here and in Portfolio Puffer (round 14, decision 3): make it, or drop `release_tag`
   from both `pet.json` files? Both READMEs already call it "planned, not made yet".
3. Register the hub's public copy of the desk as the program's address (`interface_live_url` in `pets.json`), for
   Health Hummy and Portfolio Puffer?

<sub>Flash Audit, 2026-11-20, Claude Opus 5.5 (`claude-opus-5-5`). Checks were read-only. Nothing was clicked for you,
launched or signed in to.</sub>
