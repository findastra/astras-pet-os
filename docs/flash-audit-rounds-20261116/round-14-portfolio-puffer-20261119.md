# Round 14: Portfolio Puffer — Iced Out Iceberg

[All rounds](README.md) · Stage: **registered** · Repo: [findastra/portfolio-puffer](https://github.com/findastra/portfolio-puffer)
(private) · audited `main` at `ba168c8` · Flash Audit, 2026-11-19

Astra, 2026-11-19: "ChatGPT is doing another art redraw right now ... let's roll through the easiest ones first and get
going. I want to do one item at a time." Item 14 had the fewest findings left once the art and the `pet-app` topic were
set aside. All 71 checks were run in the matrix's order. Only what is not a pass is listed.

## How it was checked

- **The Run's checks:** the auditor run again for item 14 alone today (`idle-flash-audit-20261017.mjs <out> 14`). It
  found 4 things: A10, A16, A18 and A15.
- **The page checks:** Iced Out Iceberg's pet program page compared with the Model Pet Program. Only A49 differs, and
  it waits on the redraw.
- **By hand:** the repo's `AGENTS.md`, `CLAUDE.md` and `pet.json`, its four open pull requests, its branches, the tool
  lists in the hub, and the retired names. The pet program page was checked in the browser pane at 390 and 768 px wide:
  no sideways scroll. Puffer has no folder on this PC.

## Missing, Incorrect and Not verified

| Check | Result | What was found | Fix |
|---|---|---|---|
| ⚪ A10 Website route | Missing | The desk has no hosted address. The repo is private and opens from the file only. The pet program page in the hub is the program (A59 passes). | 🔵 Putting the desk on a public site is yours. |
| ⚪ A15 README and credit (Goldfish's) | Incorrect | The README's first line is the retired credit line ("An Intelligent App, or Pet, by Astra."). | Already fixed in [portfolio-puffer#9](https://github.com/findastra/portfolio-puffer/pull/9) (2026-10-20, one line, still mergeable). It only needs merging. |
| ⚪ A16 Metadata and self-audit | Missing + Incorrect | `pet.json` had no `framework`. `source` opened `tree/v0.1.1-20261009`, a tag that was never made (404). `release_tag` still names that tag. | [portfolio-puffer#13](https://github.com/findastra/portfolio-puffer/pull/13): `framework` says the hub's page is built to the framework and the desk is not yet, and `source` opens commit `72da88b`, as the README does. 🔵 Make the `v0.1.1-20261009` tag, or drop `release_tag`. A tag is a release, so it's yours. |
| 🔵 A18 Official tool and trick inventory | Incorrect | The tool lists disagree. The page shows 3 native tools (Astra's Window Star, Handwritten Message Manager, and `portfolio-puffer-social-row`, preview only). `pet.json` lists the first two. `TOOLS-AND-TRICKS.md` lists only Astra's Window Star. | Held, like The Farm's A54: `system-map.json` (which `TOOLS-AND-TRICKS.md` is built from) is changed by 11 open hub pull requests. |
| ⚪ A57 Current names only | Incorrect (held) | `pet-app` is in `AGENTS.md` ("Repository topic") and in `pet.json` (`kind`, `hub.topic`). | Waits on #256, as in round 1. |
| ⚪ A35 Handoff and unresolved work | Incorrect | 4 pull requests are open. #9 (credit, mergeable). #6 (`homepage`, 2026-10-20) has conflicts and isn't needed, since A59 passes without it. #10 (GitHub Stats tool, 2026-10-29) shares the `updated` line with #13: whichever merges second keeps the newer date. #12 (AGENTS.md rules only, 2026-11-12) is mergeable. | 🔵 Merge #9 and #13; close #6? #10 and #12 are their own chats'. |
| Art: A01, A02, A03, A04, A05, A61, A49 | Waits on the redraw | | Checked on the new drawings when they land. |
| A08, A11, A12, A19, A20, A21, A22 (live), A23, A24, A25, A27, A28, A29, A30, A32, A37, A38, A40, A42, A43, A50, A58 | Not verified | These need you there (a click, a sign-in, a live seat), a live tool run, or a pass of their own. | 🔵 Next Active Flash Session. |

Everything else passed. That is the 19 page checks that match the template (A49 waits on the art and A22's live part
is not verified), plus A59, A06, A07, A09, A54, A13, A14, A56, A17, A55, A26, A31, A33, A34 and A45, with A53 and A36
not applying (no folder on this PC; the tutorial is The Farm's). Out of 71: 36 pass, 6 Missing or Incorrect, 7 waiting
on the art and 22 Not verified.

## Decisions waiting on you

1. ~~Merge #9 and #13?~~ Done. Astra, 2026-11-19: "Yes, merge both". Merged as `9218377` (#9) and `0c96f2a` (#13),
   and `main`'s README and `pet.json` were checked afterwards. A15 and A16's `framework` and `source` now pass. #10
   shares the `updated` line with #13, so its chat takes the newer date when it updates #10.
2. Close [portfolio-puffer#6](https://github.com/findastra/portfolio-puffer/pull/6) (stale, conflicting, not needed)?
3. The `v0.1.1-20261009` tag: make it, or drop `release_tag` from `pet.json`?

<sub>Flash Audit, 2026-11-19, Claude Opus 5.5 (`claude-opus-5-5`). Checks were read-only. Nothing was clicked for you,
launched or signed in to.</sub>
