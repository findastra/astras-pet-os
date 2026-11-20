---
status: open. Rounds 1 and 14 done (easiest first since 2026-11-19, one at a time); next 3, 8, 9, 13, 15, 17; #372 waits for Astra's merge OK
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-11-16
needs: round 1's decisions from Astra (listed on its card); one assistant at a time on the rounds
---
## Task

Astra, 2026-11-16: "I want you to get a flash when going into your apps. I want every item to be done through a flash
audit. Let's start with item one. All 85 items. Go. Also, show me the whole list of items on the flash audit."

The items are the pet programs in `pet-programs.json` by number: 86 of them, numbered 1 to 87, because 85 is free
(Reactor Raccoon's seed is #245, still open). Each gets all 71 checks of the matrix.

## What I did

- Ran the Flash Audit Run over every pet program, through the helper on her PC (`POST /run`, 08:30 to 08:50 UTC, exit
  0). It is saved, cleaned with `redactData`, at `docs/flash-audit-rounds-20261116/ledger-main.json`, and The Farm's
  page shows it after `npm run build`.
- `docs/flash-audit-rounds-20261116/README.md` holds the whole list: the 71 checks in order, and every item with what
  the Run and the template check found. It is built by a scratch script, not a repo script; rebuild it by hand from
  the ledger after each round.
- Round 1, The Farm: all 71 checks, `round-01-astras-pet-os-20261116.md`. The no-decision fixes are in this PR: the
  `pet.json` audit block (A16), the README credit (A15) and the A57 rule wording (A57).
- What the Run found, by number of items: A18 84, A16 79, A10 76, A55 74, A01 46, A59 42, A09 40, A15 28, A54 22,
  A17 16, A31 11, A56 8, A14 6, A26 6, A07 4, A13 2. A26 is personal `C:\Users` paths in six private repos: lunas-log,
  kernel-grove, white-hat-lab (its scans), ai-doghouse, pc-master-race and the-pilot-plant.

## Not done / next

- **2026-11-19: easiest first, one item at a time** (Astra: "ChatGPT is doing another art redraw right now. So we are
  going to be waiting for that. But in the meantime, let's roll through the easiest ones first and get going. I want
  to do one item at a time."). Easiest = the fewest Run and page findings once the art checks and the `pet-app` topic
  are set aside. Round 14 (Portfolio Puffer) is done; the next ones are 3 Data Dealer, 8 The Nectar Nest, 9 Nest Egg,
  13 Discord Tower, 15 Bass & Biscuits and 17 Am I a Ghost?. Run the auditor again for the one item first
  (`node scripts/idle-flash-audit-20261017.mjs <out> <number>`, a few seconds). Reuse fixes already waiting in that
  repo's open pull requests (round 14: portfolio-puffer#9 already had the credit fix).
- `main`'s `npm test` fails one test since #385 (2026-11-19). `test/port-watch-test-20261119.mjs` gives its made-up
  home folder the user name `someone`, and the public-safety test only lets `example`, `Public` or `Default` through. It is not
  a leak. The fix belongs to the port-watch chat.
- **Rounds in number order (the plan before 2026-11-19), one item at a time.** For each one: read the pet's repo rules, open its page
  (show-pet-panel), and take the Run's rows from the ledger. Then do the by-hand checks the way round 1 did (art, folder
  icon, topics, data folder, lists, tutorials, the live checks marked Not verified). Write
  `round-NN-<repo>-20261116.md` (or the day's date), fix the grey ones on a branch per repo, and put the blue ones on
  the card.
- Program 2 (GitHub Goldfish) is not in the Run: the auditor starts at 3. Its round needs the auditor's checks by hand.
- Round 1's decisions wait on Astra: the retired word "pet app", still the GitHub topic every pet repo carries (#256,
  question 1), the folder icons under the old-name folder, `data_folder`, `FARMER_TOKEN`, the v0.4.0-beta release,
  and the older open pull requests. Never suggest adding the `pet-app` topic: Astra, 2026-11-16, "we are not supposed
  to call it this".
- **Art waits on OpenAI's redraw.** Astra, 2026-11-16: "OpenAI just redrew all 85 pets so that update is coming"
  (Codex's #371, a draft with no drawings yet). Every round marks A02, A03, A04, A05 and A61 as Not verified until it
  lands, then checks them on the new drawings. Do not ask for new art before then.
- Held: A54's lists for The Farm (`system-map.json`, `TOOLS-AND-TRICKS.md`, `INTELLIGENCE-LEVELS.md`). Eleven open PRs
  change them.

## Receipt and review

- `npm test` in an LF clone of the branch (Git Bash): 469 tests, 463 pass, 0 fail, 6 skipped. `main` gave the same.
- The template check on The Farm's page found no differences. The page fits at 390, 768 and 1024 px in the browser pane.
- The ledger passed `assertPublic` after `redactData`. No private details are in any file of this PR.
- No maker-checker review yet: the round card is one assistant's reading.
