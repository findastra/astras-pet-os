status: taken by Claude Opus 5.5, 2026-10-19 (decisions 1 to 4 answered; step (a) in a pull request, waiting on Astra's OK and the first install on the Kali MacBook)
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
- **Brought up to date, 2026-10-18 evening:** merged `main` at `4a10e4c` into the branch (after #85 Workflow Whale,
  #96 the Cage removed, #97 card 042). The one conflict was `handoffs/README.md`: every card row kept (042, 041, 040),
  one row per number in the number table (040 now on `main`), next free number 043 from `main`. The doc now counts 37
  pet repos (Workflow Whale added as small changes: its Windows bridge), drops the Cage and Farmer dock rows, adds the
  installer zip, cites INSTALL.md, and notes AGENTS.md's "Pets roam on the Windows desktop only" as a line step (b)
  needs Astra to change. `npm test` after the merge: 141 tests, 140 pass, 0 fail, 1 skipped (#96 removed the Cage
  tests). The installer-zip test zips `HEAD`, so it fails until the merge is committed.
- **On Astra's PC:** nothing changed. The live hub folder was only read (`git status`); the work was in a clone in
  Claude's scratchpad. AGENTS.md has no new credit line, to keep clear of the three open pull requests that add lines
  there; the credit is at the top of the doc.

### 2026-10-19, step (a): Claude Opus 5.5 (`claude-opus-5-5`)
- **Astra's answers** (in chat, recorded in the readiness doc's new "Astra's answers" table): add-on first; The Farm
  owns the package and Linux Penguin checks it; Node 20 or newer distributions only; Role Fairy and Chat Rat first, then
  revised the same day: pet services are an option, off by default; and her idea, Linux Penguin as the Linux guide with
  one trick per distribution family, picked from `/etc/os-release`.
- **This repo, branch `claude/linux-package-20261019`** (from `main` at `b61397e`; not on `main` until Astra's OK):
  `scripts/farm-setup-20261019.mjs` (the installer's farm logic in Node), `scripts/linux-cli-20261019.mjs` (the
  `astras-pet-os` command), `scripts/linux-deb-20261019.mjs` (builds and reads the `.deb` with Node's own modules),
  `linux/` (the `/usr/bin` wrapper, the pet service template, three menu entries, the bundled-pets pin),
  `test/linux-package-test-20261019.mjs` (10 tests), `docs/linux-package-20261019.md`, the readiness doc's answers,
  two rows in `skills/new-pet-or-tool`, this card and its row.
- **`findastra/linux-iceberg`**: branch `claude/linux-guide-20261019`, commit `c2b945f`, PR #3 (built on PR #2, the Mac
  checker): `tools/linux-check-20261019.sh`, `skills/debian-family/SKILL.md`, `tests/linux-check-test-20261019.sh`
  (38 of 38). The hub's package pins that commit.
- **Tested on Windows:** `npm test` 164 tests, 163 pass, 0 fail, 1 skipped; the farm list agrees with the installer's
  `Get-FarmPets` exactly; a package built with the penguin bundled (99 MB, 1,215 files) was read by Windows' `tar`
  (libarchive) and GNU tar, and `md5sum -c` matched every file. **Not tested:** `dpkg-deb`, `lintian` or `apt install` on
  Linux (no WSL or Docker on this PC), the systemd unit, `xdg-open`, the menu entries.
- **Checker review** (a separate read-only Claude session, 2026-10-19): one blocker, pax tar headers that dpkg refuses
  (`lib/dpkg/tarfn.c`), fixed by plain ustar prefix names and a test that no header is pax; and the smaller findings
  (no git or license files or `linux/` shipped, a man page, a systemd stop is not a failure, `--pets` ignores case,
  the penguin's update count in any language). The penguin's fixes are commit `bb39854` on linux-iceberg#3, and the
  package pins it.
- **On Astra's PC:** nothing changed. The work was in clones in Claude's scratchpad.
- **Left:** the first install on the Kali MacBook (RED USB holds Kali 2026.2), with `lintian`; publishing on a release
  (decision 7); the penguin's pin moved to his `main` after linux-iceberg#3; Chat Rat's "open folder" on Linux; Role
  Fairy's Node 24.17 requirement against Debian 13's Node 20; step (b) with Codex.

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
