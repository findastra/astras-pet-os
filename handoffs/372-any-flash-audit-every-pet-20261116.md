---
status: open. Rounds 1, 14, 3 and 8 done (easiest first since 2026-11-19, one at a time); A72 (own server) added 2026-11-20 and answered (one server per pet, named once in pets.json); renames under way: Benchmark Rock done (benchmark-rock#15 + hub #408 merged, rebuilt on her PC); Kernel Grove done (kernel-grove#11 + hub #411 merged, rebuilt on her PC); White Hat Lab next; then rounds 9, 13, 15, 17; #372 waits for Astra's merge OK
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
  are set aside. Round 14 (Portfolio Puffer), round 3 (Data Dealer, data-dealer#18) and round 8 (The Nectar Nest,
  health-hummy#10) are done. The next ones are 9 Nest Egg, 13 Discord Tower, 15 Bass & Biscuits and 17 Am I a
  Ghost?. A10 trap (round 8): a desk whose copy is on the hub's public site (`apps/<repo>-*.html`) still counts as
  Missing when `pets.json` has no `interface_live_url` (only 4 of 23 do). Check the copy before writing "no hosted
  address". Run the auditor again for
  the one item first (`node scripts/idle-flash-audit-20261017.mjs <out> <number>`, a few seconds). Set
  `FLASH_PREFLIGHT` to Goldfish's `scripts/flash-audit-local-20261015.mjs` in her PC folder: that file is only on
  Codex's `codex/l3-activity-20261016`, not on Goldfish's `main`. Without it, the Goldfish checks come out Not
  verified. Reuse fixes already waiting in that repo's open pull requests (round 14: portfolio-puffer#9 had the credit
  fix; round 3: data-dealer#10 and #12).
- **A72, Its own server (Astra, 2026-11-20: "every pet gets its own server ... so we can end separate ones of them at
  a time on demand ... named after their pet program, and then dash server dash the date"; "I want that to be the
  next thing you check for").** The row is in the matrix after A21, and the owner note is at the end of
  `docs/flash-audit-20261014.md`. The first pass covers every item at once: `a72-own-servers-20261120.md`, a dry run
  of 18 servers in 12 pet programs, with no ports written (the hub is public). Her answers, the same day: "I want the
  one server per pet, I dont care if [it] stops stuff together. cant have that many [running]. all recommended
  everything else". So a pet with several background jobs joins them into one server (The Farm's four, Discord Tower's
  three; 10 servers in all), and each name is written once, as `server` in its `pets.json` entry, which the star reads
  (`BackgroundPets.Servers`). The renames go easiest first, each a repo PR plus a hub PR, then a rebuild on her PC:
  Benchmark Rock (benchmark-rock#15 and hub #408, merged 2026-11-20 with her OK and rebuilt on her PC: the star runs `benchmark-rock-server-20261120.exe`; the old star is `bin/desktop-pets-before-own-servers-20261120.exe`), then Kernel Grove (kernel-grove#11 and hub #411, merged 2026-11-20 with her OK ("Yes, merge both") and rebuilt on her PC: same pattern, a third build copy `bin/kernel-grove-server-20261120.exe`, which Kernel Koala's Start item runs when she asks; the old star is `bin/desktop-pets-before-kernel-grove-server-20261120.exe`), White Hat Lab, Wonderland Launchpad (the
  Weasel must read `server` from pets.json first: its marker `rift-rabbit` would miss the new name), Log Den's three
  together, Audio Rescue, Discord Tower's join, The Farm's join (pet chat is C#, so it is written again in Node). Keep
  off Light Hive's (another chat's uncommitted work in rgbee) and Chat Stack's (her folder is on Codex's branch) until
  those land.
- Fixed on `main` by 2026-11-20: the public-safety failure from #385 (the port-watch test's made-up home folder). It
  passes again on this branch after merging `main`.
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
  2026-11-20, after merging `main` (5db73a02) and adding round 3: 494 tests, 488 pass, 0 fail, 6 skipped. After
  merging `main` again (The Farm's page taken from `main` and rebuilt) and adding round 8: 497 tests, 491 pass, 0 fail,
  6 skipped. After merging `main` again (466a641f) and adding A72 (the dots test now expects A01 to A72, with A72
  after A21): 499 tests, 493 pass, 0 fail, 6 skipped.
- The template check on The Farm's page found no differences. The page fits at 390, 768 and 1024 px in the browser pane.
- The ledger passed `assertPublic` after `redactData`. No private details are in any file of this PR.
- No maker-checker review yet: the round card is one assistant's reading.
