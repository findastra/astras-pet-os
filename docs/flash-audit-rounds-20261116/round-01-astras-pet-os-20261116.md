# Round 1: Friendly Farmer — The Farm

[All rounds](README.md) · Stage: **registered** · Repo: [findastra/astras-pet-os](https://github.com/findastra/astras-pet-os)
· audited `main` at `a6537a7c` (the same as GitHub and the live site) · Flash Audit, 2026-11-16

Astra, 2026-11-16: "I want every item to be done through a flash audit. Let's start with item one. All 85 items. Go."
Item one is pet program 1 in `pet-programs.json`, The Farm. All 71 checks of the matrix
([flash-audit-20261014.md](../flash-audit-20261014.md), section 3) were run in its order. Only what is not a pass is
listed below, in that order.

## How it was checked

- **The page checks** (A47, A52, A62 to A71, A60, A49, A41, A39, A51, A22's template part, A44, A46, A48): The Farm's
  page compared with the Model Pet Program by `scripts/flash-template-20261112.mjs`: no differences.
- **A59 for the whole list:** `a59ForCatalog` on `main`: every numbered pet program is in `pets.json` and linked to one
  program; no two pets on one program.
- **A34:** `npm test` in an LF clone of `main`: 469 tests, 463 pass, 0 fail, 6 skipped.
- **A45:** The Farm's page in the browser pane at 390, 768 and 1024 px wide: no sideways scroll at any of them.
- **A10, A17:** the pet program page, the Farmer's desk and the System Map answer 200 on the live site; the live site
  was built from `a6537a7c`, the same as `main`; the PC copy is clean and level with GitHub.
- **A26:** no private details in any tracked file (her email, her user folder path or her surname).
- Art, the folder icon, the repo's settings and the tool lists were looked at by hand (below).

## Missing, Incorrect and Not verified

| Check | Result | What was found | Fix |
|---|---|---|---|
| ⚪ A53 Program icon matches its folder | Incorrect | The hub folder's `desktop.ini` takes its icon from `%LOCALAPPDATA%\astras-pet-apps\folder-icons\`, a folder under the retired hub name. The docs say `%LOCALAPPDATA%\astras-pet-os\folder-icons\`, which does not exist on the PC. 32 pet folders point at the old folder. The icon still shows, because the old folder is still there. | 🔵 A File Master plan for you to OK: make the icons in `astras-pet-os\folder-icons\` with `set-folder-icons-20261017.ps1` (dry run first), then retire the old folder. |
| ⚪ A54 Third-party programs | Incorrect | The lists disagree. The page and the System Map list 11 (GitHub, OBS Studio, TikTok LIVE Studio, TikFinity, Steam, Epic Games Launcher, Overwolf, Wallpaper Engine, Canva, Node.js, Web browser). `TOOLS-AND-TRICKS.md` has 13: it also has Google Fonts and three.js r128, which the System Map page loads. `pets.json` `needs.programs` has 3 and The Farm's row in `INTELLIGENCE-LEVELS.md` has none. The page also lists "GitHub profile" as a native program, which `TOOLS-AND-TRICKS.md` does not. | Held. 11 open pull requests change `system-map.json`, `TOOLS-AND-TRICKS.md` or `INTELLIGENCE-LEVELS.md` (#366, #343, #337, #327, #289, #281, #256, #218, #61, #36). A fix now would collide with them. It gets done once they are merged or closed. |
| ⚪ A14 Required repo files | Missing | The repo has no GitHub topics. `pet-app` is missing, and the hub finds pets by that topic (PET-FILES.md). | 🔵 Add the `pet-app` topic in the repo's About box. It changes the public repo page, so it waits for your OK. |
| ⚪ A15 README and credit (Goldfish's) | Incorrect | The README's Credits said "1. Made by Astra." The credit is "By Astra." | Fixed on this branch. |
| 🔵 A56 Work saved in its native folder | Not verified | `pet.json` has no `data_folder`, and no pet repo declares one yet. The Farm writes to two places: `%LOCALAPPDATA%\astras-pet-os` (Startup Star's status, the crash watchers) and `Documents\Astra's PetOS Data\astras-pet-os` (the Flash Audit helper, pet-moods and the other helpers). | 🔵 Which one `pet.json` declares (or both) is your call. |
| ⚪ A57 Current names only (Goldfish's) | Incorrect | The Flash Audit's own A57 rule and the Idle Flash Audit how-to named today's names (`Astra's PetOS`, `astras-pet-os`) as the ones never to use. The 2026-10-25 rename had swapped the retired names in those lines for the new ones. | Fixed on this branch. Both lines say "the retired folder name" and "the old hub names", as the rename asked for. |
| ⚪ A16 Metadata and self-audit | Missing + Incorrect | `pet.json` had no `audit` block (PET-FILES.md asks for one; `pets.json` has it). `source` links to the tag `v0.4.0-beta`, which does not exist yet. The newest release is v0.3.0-beta, from 2026-10-19. | The `audit` block was copied from `pets.json` on this branch. 🔵 The link works once you cut the v0.4.0-beta release. |
| ⚪ A55 Pictures | Missing | The README has three pictures from 2026-10-17 and 18 (the System Map, a grant card and the old Farmer's Desk). There is none of The Farm's pet program page as it is now (its levels and the flash-audit tool box) and none of the Farmer's newest drawing. | Next: new screenshots with `project-image-generator`. Not done in this round. |
| ⚪ A03 Emotion behavior | Incorrect | The Farmer's awake picture (`art/moods/farmer/blink.png`, from the 2026-11-14 drawing) has his eyes shut, the same as sleepy. Awake must have open eyes. | 🔵 A new awake drawing with open eyes. New art is yours (A02). |
| 🔵 A04 Art publication | Incorrect | The `note` in `pets.json` still says "DRAFT" and describes the 2026-10-08 drawing: lime overalls, coral shirt, a different fruit in each mood. The newest drawing (#370, merged 2026-11-15) has a green shirt and jeans, with an apple in every mood. | 🔵 Is the 11-14 drawing approved? Then the note says so. |
| 🔵 A25 Integrations/accounts | Missing | The repo has no `FARMER_TOKEN` secret (no Actions secrets at all). The Farmer's round can't see the private pet repos, so their `pet.json` stays stale in the hub. API Fairy's key request has been open since 2026-10-09 (`20261009-friendly-farmer-farmer-token`). | 🔵 Yours: the key. |
| 🔵 A36 First-visit tutorial | Missing | The Farm's page has no tutorial tool box (`tutorial-tools` with `first-time-here-tutorial`, its lights and its ON/OFF). The tutorial is the native program "How to Take Care of Your Farm!", which does not start the L3 chat. | 🔵 Building the tool box is idle; starting the tour needs a live seat and you there. |
| ⚪ A32 Pet Collar and release trust | Incorrect | The page and `pet.json` say 0.4.0-beta, but no 0.4.0-beta release exists (see A16). Signing is planned, not done. | 🔵 The release is yours (card 325). |
| ⚪ A35 Handoff and unresolved work | Incorrect | 28 pull requests are open on the hub. 15 of them were opened before 2026-11-02, and the oldest is #22 (2026-10-16). Some, like #143 (2026-10-20), still use the old names and would collide with today's files. | 🔵 A merge-or-close pass, as one numbered chart, is yours to go through. |
| A08, A05, A11, A12, A18, A20, A21, A22 (live), A23, A24, A27, A28, A29, A30, A31, A37, A38, A40, A42, A43, A58 (other repos) | Not verified | These need you there (a double-click, a live seat, a sign-in), a live tool run or a pass of their own. A18's lists are under A54. They are not passes. | 🔵 Next Active Flash Session. |

Everything else passed. That is the 20 other page checks compared with the template (A22's template part passes too,
but its live part is not verified), plus A59, A06, A07, A01, A09, A10, A13, A17, A02, A61, A19 (with test data), A26,
A33, A34, A45 and A50. Out of 71: 36 pass, 13 Missing or Incorrect, and 22 Not verified (A56 and the 21 above).

## Decisions waiting on you

1. Add the `pet-app` topic to the hub repo (A14)?
2. Move the folder icons off the old-name folder, through a File Master plan (A53)?
3. Which data folder `pet.json` declares (A56)?
4. Is the Farmer's 11-14 drawing approved, and should his awake picture be redrawn with open eyes (A03, A04)?
5. The `FARMER_TOKEN` key (A25) and the v0.4.0-beta release (A16, A32): both are already waiting on you.
6. A merge-or-close pass over the hub's 15 older open pull requests (A35)?

<sub>Flash Audit, 2026-11-16, Claude Opus 5.5 (`claude-opus-5-5`). Checks were read-only. Nothing was clicked for you,
launched, signed in to or changed on the PC.</sub>
