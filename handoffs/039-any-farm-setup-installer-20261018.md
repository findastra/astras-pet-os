status: open (waiting on Astra: OK to merge the pull request, OK to publish release v0.2.0-beta, and "core pets" or another name)
for: any (the release step is Astra's OK, then any assistant; Codex: read "For Codex" below)
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-18
needs: installer/install-astras-pet-os-20261014.ps1, README.md ("Beta testers and their AI: start here"), test/farm-setup-test-20261018.mjs, skills/dev-mindset/SKILL.md
---
## What I did

Astra asked (2026-10-18), before teaching her friend Devilish to install the beta tonight: make the install click clear
and working, with two choices, **Set up Your Farm with Astra's Example Pets** (delete, modify or clone any of them) and
**Set up Your Farm From Scratch** (the core kit, with check boxes next to the pets), and a name for the pets that cannot
be taken away ("root pets?").

On branch `claude/farm-setup-choice-20261018` (not on `main`; pull request linked from this card's commit):
- `installer/install-astras-pet-os-20261014.ps1` (version `v0.2.0-beta`): a **Set up your farm** window (Windows Forms,
  built into Windows) with the two choices; a pet list with check boxes, core pets on top, ticked, greyed and impossible
  to untick; Example ticks and locks every pet; From Scratch starts with only the core pets and remembers picks; a
  live "N pets will live on your farm" count; a "Start my pets when Windows starts" box. `-Farm Example` or
  `-Farm Scratch -Pets <ids>` chooses without the window (for AI agents); an unknown id stops with the list of ids. From
  Scratch rewrites only the INSTALLED copy of `pets.json` (`pets` only) and `desktop-art/desktop-drafts-20261018.json`.
  It now stops pets running from the install folder before rebuilding (so running it again changes the farm), checks
  that the pets load before saying done, shows a "Your farm is ready" message, writes `farm` and `pets` into the
  receipt, and turns start-with-Windows off again when the box is not ticked.
- `install-astras-pet-os-20261014.cmd`: says the window is coming; the file name is unchanged (README, AGENTS.md and
  MAKE-IT-YOURS.md link it).
- `scripts/desktop-pets-20261011.cs`: two fixes the From Scratch farm needs. `LoadPets` no longer requires a pet besides
  the Farmer, and `WriteStatus` looked up Voicemeeter Bug, Paper Girl and File Master by name with no null check, so a
  farm without any one of them showed an "Unhandled exception" dialog as soon as it opened (also true for anyone who
  deleted one of them from pets.json). A new `PetHit` reports 0 for a pet that is not there.
- `test/farm-setup-test-20261018.mjs`: Astra's wording, core pets locked, the host is the one core pet, the installer is
  plain ASCII (Windows PowerShell 5.1 reads a file without a byte-order mark as ANSI), no unguarded pet lookups in the
  desktop pets, and on Windows a real From Scratch install into a temp folder.
- `README.md` (install steps 1 to 4, typing and agent notes), `MAKE-IT-YOURS.md` (choose when you install), `AGENTS.md`
  (agents pass `-Farm`; core pets; credit line), this card and its row in `handoffs/README.md`.

Tested on Astra's desktop PC, in `%TEMP%` test folders only (nothing installed to `%LOCALAPPDATA%`, no Start menu
shortcuts made, no startup entry):
- Today's installer on `main` and the v0.1.1-beta release both install and load (36 pets on the desktop preview).
- New installer, no window: Example (pets.json identical to the release), From Scratch with Goldfish and RGBee, the
  Farmer alone, names and repo names as `-Pets`, an unknown pet (stops with the list). Everything but the pet list is
  unchanged in the installed pets.json.
- Each farm run in the real desktop program (test mode) for 8 seconds with UI exceptions recorded: none. Before the
  `WriteStatus` fix the Farmer-alone farm threw a NullReferenceException; before the `LoadPets` fix the old program
  refused it ("The desktop pets need their Farmer and pets."). The full farm still passes `--self-test`.
- The window: clicked through in-process (Example 36 ticked and locked; From Scratch 1; the Farmer cannot be unticked;
  picks kept across switching) and through the `.cmd` the way a double-click starts it, driven from outside with window
  messages: Cancel installs nothing; Example and From Scratch install, show "Your farm is ready", and exit 0.
- Running the installer again while pets run from that folder stops them, rebuilds and changes the farm.
- `npm test`: see the pull request.

Not done: the release (Devilish's download is still v0.1.1-beta, which has no window), and nothing was tested on a PC
other than Astra's. Windows SmartScreen and the downloaded-file warning were not reproduced (README says what to click).
`⚠️ Naming:` "root" means the superuser (administrator) to developers, and this repo already retired "root program" for
that reason (skills/dev-mindset). I used **core pets**, which matches "core kit" and ring 0, the Core. One word changes
it if Astra prefers another. Card 038 is used twice on other branches (`farmer-register-workflow-whirlpool` and
`skill-scout-record-chat-order`); I took 039 and left that clash to those chats.

## Task
1. Astra: OK to merge the pull request. Then merge it (squash not needed) after `npm test` passes.
2. Astra: OK to publish the release. Then:
   `gh release create v0.2.0-beta --repo findastra/astras-pet-os --target main --prerelease --title "Astra's PetOS v0.2.0-beta" --notes-file <notes>`
   with notes that say: download Source code (zip), Extract All, double-click `install-astras-pet-os-20261014.cmd`,
   choose your farm.
3. Astra: keep "core pets", or name them. If she names them, change the window text, README, MAKE-IT-YOURS and AGENTS,
   then add the word to the glossary in skills/dev-mindset.
4. Later: when Gatekeeper Goddess, the Pet Police Officer or another security pet is built, decide with Astra whether
   it becomes a core pet (the installer reads core pets from `role: "host"` today).

### For Codex
`scripts/desktop-pets-20261011.cs` is yours (docs/migration/PLAN.md, "Who edits what"). I changed only `LoadPets`'s
check and the five pet lookups in `WriteStatus` (`PetHit`). Keep a farm with any pet left out running.

## Done when
The pull request is merged, v0.2.0-beta is the latest release, and a fresh download installs with the window.

## Return
Update this card's status and `## What I did`, commit.
