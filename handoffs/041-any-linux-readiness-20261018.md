status: open (waiting on Astra: the open decisions in docs/linux-readiness-20261018.md)
for: any (the desktop-pets port is Codex's area; Linux Penguin's chat checks on Linux hosts)
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-18
needs: docs/linux-readiness-20261018.md, installer/install-astras-pet-os-20261014.ps1, scripts/desktop-pets-20261011.cs, docs/migration/PLAN.md ("Who edits what"), skills/farm-security, findastra/startup-star README
---
## What I did
Another Claude session asked for a Linux readiness check of Astra's PetOS (2026-10-18): Astra is putting Kali Linux on
her old MacBook Pro to test her farm as an outside attacker (White Hat Weasel's lab), and wants Astra's PetOS to install
on Linux without Microsoft.

- **Branch `claude/linux-readiness-20261018`** of this repo, from `main` at `ac4b5f7`. **Not on `main`**: Astra merges
  it after her OK in chat. Documents only, no code:
  - `docs/linux-readiness-20261018.md`: one table of every component (runs on Linux, small changes, Windows-only, with
    evidence), the Windows APIs of the Windows-only parts, the desktop-pet problem on Linux and a toolkit path, the
    recommended order (Debian package, desktop pets, live image), what each step needs from Astra, and ten open
    decisions, including GitHub being Microsoft's.
  - This card, and its rows in `handoffs/README.md`. Card 040 is taken on `codex/workflow-whale-20261018` (PR #85), so
    this card is 041 and the next free number is 042.
- **Read only:** every pet repo's `pet.json` on `main` and the code of Discord Damsel, Astra Wisp, Chat Rat, API Fairy,
  File Master, Role Fairy and Startup Star, through the GitHub API (nothing cloned to the PC); the log of the Farmer's
  round on Ubuntu (run 39142399506).
- **Tested:** `npm test` in a fresh clone in Claude's scratchpad, on Windows with Node 24.20: 154 tests, 153 pass,
  0 fail, 1 skipped (the pets-board workflow test). A clone made with Git's `core.autocrlf=true` fails two generated-file
  tests because of Windows line endings; the clone was checked out again with `core.autocrlf=false` first. No Linux
  machine was used.
- **On Astra's PC:** nothing changed. The live hub folder was only read (`git status`); the work was in a clone in
  Claude's scratchpad. AGENTS.md has no new credit line, to keep clear of the three open pull requests that add lines
  there; the credit is at the top of the doc.

## Task
1. Ask Astra the open decisions at the end of `docs/linux-readiness-20261018.md`, one chart, most important first
   (decision 1, then 2, 3, 4).
2. With her OK, step (a): the Debian package of the portable core, on its own branch: the farm setup as a Node script
   shared with the Windows installer, systemd user units for the pets she picks, the `xdg-open` launcher, `dpkg-deb`
   and `lintian`, and an install test on a clean Debian and on the Kali MacBook. Linux Penguin's chat is the checker.
3. Step (b), the desktop pets, only with Codex (PLAN.md, "Who edits what"): the core and window-layer split first, then
   a one-pet prototype on Xfce (X11) and KDE Plasma (Wayland).
4. Step (c), the live image, only after (a) and (b) work.

## Done when
Astra has answered decisions 1 to 4, and step (a) has its own branch and pull request, or she has said no.

## Return
Update `## What I did`, set the status, commit on a branch, pull request for Astra.
