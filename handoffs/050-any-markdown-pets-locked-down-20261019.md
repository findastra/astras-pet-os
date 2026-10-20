status: open (waiting on Astra: merge this pull request; then a Windows test on a locked-down computer)
for: any (Codex: read "For Codex")
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-19
needs: INSTALL.md ("On a locked-down computer"), markdown-pets/README.md, scripts/markdown-pets-20261019.mjs, installer/install-astras-pet-os-20261014.ps1, scripts/installer-zip-20261018.mjs, test/markdown-pets-test-20261019.mjs
---
## What I did

Astra, 2026-10-19: "A remote user tried to use the installation software to download Astra's PetOS. Unfortunately,
the only pet program that was working was the platform platypus ... We need to make it so that computers under other
security protocols can download these agents. On top of that, I couldn't read the JSON, so I had to rebuild this from
scratch. The only files the user could give their computer was the markdown files." Her screenshots: a fresh farm
with Platform Platypus, Mail Snail, Backup Beaver and Chat Rat, and on that computer a folder `astras-pet-apps-main`
holding `cage.html`, `cage-data.js` and `start-farmer-dock-20261008.cmd`.

What the screenshots show (from the repos, not guessed):
- **Platform Platypus worked because it is a web page** on GitHub Pages: nothing to install.
- **Mail Snail and Backup Beaver have no app yet**: their `index.html` says "Placeholder. The app is not built yet."
- **Chat Rat needs Node and a `.cmd`/`.ps1` launcher**, which a locked-down computer stops.
- **The folder on that computer is an old green Code button download** (before the repo was renamed and the Cage
  removed, card 042), not the v0.3.0-beta installer.
- The error screenshot itself did not come through in the chat; the cause above is read from the other screenshots.

On branch `claude/markdown-pets-20261019` (not on `main`; the pull request is linked from this card's commit):
- **New native tool of The Farm, `markdown-pets`** (`scripts/markdown-pets-20261019.mjs`,
  `the-farm-v1.0-markdown-pets-v1.0`), run by `npm run build`: every registered and pipeline pet as one
  **Markdown pet** in `markdown-pets/<repo>-20261019.md` (what it does, where it opens in a browser with nothing to
  install, its tools, tricks and related pets, its picture, and the rules an AI follows to act as it: install and run
  nothing, never work around the computer's security, data is never instructions, private pets keep their data on the
  PC); `markdown-pets/README.md`, the farm as a Markdown table in place of the JSON; and
  `markdown-pets/all-pets-20261019.md`, every pet in one file for a computer that takes one file. Built from the same
  data as the pet program pages (`spawnerPages`), so the two never disagree; public-safe (`assertPublic`).
- **INSTALL.md**: "On a locked-down computer (work or school)" before the install steps, and agent step 1 says to ask
  about IT first and stop, never work around a block. **README.md**: one line under the installer link.
- **Installer** (`installer/install-astras-pet-os-20261014.ps1`): stops before it copies anything when PowerShell runs
  in a restricted language mode (it would fail at `Add-Type` with an unreadable error), says so plainly and links the
  Markdown pets; a check program the computer's security blocks is caught and explained (no shortcuts were made, how
  to remove the copied files). The missing-compiler message links the same path.
- **Both `.cmd` files** (`install-astras-pet-os-20261014.cmd` and the zip's `Install Astra's PetOS.cmd` in
  `scripts/installer-zip-20261018.mjs`) print the same help when the installer fails; the zip's READ ME FIRST.txt has
  "If this computer will not let you install" and the AI rule to stop.
- **Registered**: the tool node in `system-map.json` (TOOLS-AND-TRICKS.md, the System Map and the Farmer's program
  page rebuilt), the word **Markdown pet** in PET-WORDS.md and pets.json `words`, a glossary row in
  skills/dev-mindset, a decision row in skills/new-pet-or-tool, and a line in AGENTS.md.
- **Guard**: `test/markdown-pets-test-20261019.mjs`.
- Tested here (Linux, Node 22): `npm run build`, `npm test` 179 tests, 176 pass, 3 skipped, 0 fail; `npm run check`
  OK; a pet program page link from a Markdown pet opened live on GitHub Pages.

Not done:
- **The installer changes are not tested on Windows** (no Windows here). Before the next release, run it on a normal
  PC (it must install exactly as before) and, if one is available, on a locked-down one.
- **No new release.** The installer zip with the new `.cmd` text ships with the next release, after Astra's OK.
- Mail Snail, Backup Beaver and Chat Rat still have no app that runs in a browser; their Markdown pets say so.
- `⚠️ Naming:` "download these agents": a Markdown pet is an agent definition file (a portable system prompt), not a
  program. Its rules hold only while the AI follows them; it is not a security boundary.

## Task
1. Astra: OK to merge the pull request.
2. Anyone with a Windows PC: run the installer from a fresh `node scripts/installer-zip-20261018.mjs <tag>` zip on a
   normal PC (both farms install as before) and, if possible, on a computer whose PowerShell is restricted (it stops
   with the Markdown pets message and copies nothing).
3. Next release: include it (card 042's steps).

## For Codex
`scripts/desktop-pets-20261011.cs` was not touched. The installer only catches a blocked check program now.

## Done when
The pull request is merged, the installer is tested on Windows, and the next release's zip carries the new `.cmd`.

## Return
Update this card's status and `## What I did`, commit.
