status: open (waiting on Astra: the one-line workflow edit, OK to merge, OK to release v0.3.0-beta and delete the two 2026-10-08 releases)
for: any (the workflow line is Astra's; Codex: read "For Codex")
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-18
needs: INSTALL.md, README.md (top), scripts/installer-zip-20261018.mjs, test/install-link-no-cage-test-20261018.mjs, .github/workflows/farmer-daily-rounds.yml
---
## What I did

Astra (2026-10-18), after her friend Devilish's AI tried to install the beta: "the AI ... downloaded the repo, and not
the installation software. they also somehow downloaded something with the cage on it ... Make the installation
software download link very obvious on github and make sure the agent starts here. why is there old cage software? Get
rid of it." This replaces AGENTS.md's 2026-10-11 rule "keep `cage.html` working".

What went wrong, found on GitHub: every release was a pre-release, so `releases/latest` answered 404; the two
2026-10-08 releases (`v0.2.0-20261008` "18 apps and a draggable Cage", `v0.2.1-20261008` "Desktop Farmer") look newer
than `v0.2.0-beta` by their numbers; the README's install step pointed at "Source code (zip)", which is the repo; the
README table offered the hub's "Download ZIP" (the repo again); and the repo's top folder had two `.cmd` files, one of
them `start-farmer-dock-20261008.cmd`, the old desktop Farmer, which opens `cage.html`.

On branch `claude/no-cage-installer-20261018` (not on `main`; the pull request is linked from this card's commit):
- **Removed:** `cage.html`, `cage-data.js` (and its writer in `scripts/build.mjs`), `test/cage-controls-test-20261008.mjs`,
  `start-farmer-dock-20261008.cmd`, `scripts/farmer-dock-20261008.cs` and `.manifest`. Nothing on Astra's PC ran the
  Farmer dock (checked: processes, startup entries, other repos). `docs/farmer-dock-20261008.md` stays as the record.
- **Renamed:** `test/cage.test.mjs` to `test/pets-registry-test-20261018.mjs` (it tests the registry and art) and
  `scripts/check-cage.mjs` to `scripts/check-pets-20261018.mjs` (`npm run check` is unchanged).
- **Changed:** the desktop pets' tray menu item "Open the pets page in a browser" (it opened `cage.html`) is now "Open
  the Farmer's desk"; the hub's `pet.json` entry is the Farmer's desk, its job is the registry's, version `0.3.0-beta`;
  the Farmer's round says "the Farmer" or "pets.json" instead of "the Cage"; the Farmer's desk, File Master's and
  Voicemeeter Bug's app pages say to install with the installer instead of running the Farmer dock; generated
  ROSTER.md, RELATIONS.md and MOOD-KEY.md no longer mention the Cage. Data keys keep their names (`cage`,
  `cage.submit`, `cage_life`): pets and scripts read them.
- **The installer download:** `scripts/installer-zip-20261018.mjs <tag>` makes `astras-pet-os-installer.zip`: one folder
  `Astra's PetOS installer <tag>` holding `Install Astra's PetOS.cmd`, `READ ME FIRST.txt` (steps for a person, rules
  for an AI) and `files/` (the repo at the tag). The installer has `-ListPets` for agents and is `v0.3.0-beta`.
- **Start here:** `INSTALL.md` (people and agents: the one download, the steps, exact PowerShell for an agent). The
  README opens with "⬇️ Download the installer" and the agent line, before any picture; its table offers the installer
  for the Friendly Farmer; AGENTS.md and CLAUDE.md start with "Installing Astra's PetOS for someone? Stop here and follow
  INSTALL.md" (Claude Code reads CLAUDE.md as soon as it opens the repo). SECURITY.md, ASTRAS_PET_OS.md (amendment),
  PET-FILES.md, PET-WORDS.md and docs/migration/PLAN.md say the Cage is gone.
- **Guard:** `test/install-link-no-cage-test-20261018.mjs`: the Cage files stay gone and no program points at them, the
  README shows the installer before anything else, AGENTS.md and CLAUDE.md send installers to INSTALL.md, and a real
  installer zip has only the `.cmd` and READ ME FIRST at its top.

Tested on Astra's desktop PC, in `%TEMP%` folders only: `npm test` 139 pass, 1 skipped (Pets Board); `npm run check`
OK. A real installer zip (99 MB), unzipped into a folder whose name has a space and an apostrophe: double-clicking
`Install Astra's PetOS.cmd` (driven from outside) opened the window and installed both farms, showed "Your farm is
ready" and exited 0; neither install has a Cage file; each farm ran 8 s in the desktop pets with no UI exception. The
INSTALL.md agent commands (`-ListPets`, then `-Farm Scratch -Pets goldfish,api-fairy`) installed exactly those pets.
The longest path a real user's Downloads folder gets is about 198 characters, under Windows' 260.

## Task (Astra's, in this order)
1. **Edit one line of the Farmer's round on GitHub** (this PC's GitHub login cannot change workflow files):
   https://github.com/findastra/astras-pet-os/edit/main/.github/workflows/farmer-daily-rounds.yml , line 59: delete
   ` cage-data.js` from `git add pets.json status cage-data.js ROSTER.md ...`, then **Commit changes**. Without it the
   round stops at `git add` once the file is gone. It is safe before the merge too.
2. OK to merge the pull request.
3. OK to publish **v0.3.0-beta** as the **Latest** release (not a pre-release, so `releases/latest` works) with
   `astras-pet-os-installer.zip` attached:
   `node scripts/installer-zip-20261018.mjs v0.3.0-beta` after tagging, then
   `gh release upload v0.3.0-beta astras-pet-os-installer.zip`.
4. OK to delete the release pages `v0.2.0-20261008` and `v0.2.1-20261008` (their notes are saved in
   `docs/retired-releases-20261018.md`; the git tags stay, so nothing is lost).
5. Optional: set the repo's About **Website** to the installer link (repo settings).

## For Codex
`scripts/desktop-pets-20261011.cs` is yours: I changed only the tray menu item that opened `cage.html` (it opens the
Farmer's desk now).

## Done when
`releases/latest/download/astras-pet-os-installer.zip` downloads the v0.3.0-beta installer, the Cage releases are gone,
and the Farmer's round runs green the next morning.

## Return
Update this card's status and `## What I did`, commit.
