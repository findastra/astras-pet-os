status: open (art draft for Astra; native visual installed; L3 and Unity bridge pending)
for: codex
from: OpenAI Codex (GPT-6), 2026-10-18
needs: AGENTS.md; docs/pet-art-redesign-20261017.md; scripts/install-door-dormouse-20261018.mjs
---

## What I did

Continued Astra's selected Door Dormouse / The Threshold pairing after her "GO".

- Worktree: `%USERPROFILE%\Documents\Codex\2026-10-15\we-re-going-to-create-a\work\door-dormouse-20261018`,
  branch `codex/door-dormouse-20261018`. The live hub stays on `main` in `Documents\Astra's PetOS\astras-pet-os`.
- Implementation commit `33a31fb06e0bc42ccb83c382999d016991609d27` is pushed in
  [PR #61](https://github.com/findastra/astras-pet-os/pull/61), not merged to main.
- New original art: `desktop-art/door-dormouse/sheet-20261018.png`, `prompt-20261018.md` and nine 256px mood frames.
  Built-in image generation; no third-party reference art. Draft pending visual approval.
- Updated `scripts/build-desktop-art-20261011.mjs` to accept `--date YYYYMMDD`, retaining its old default.
- Added `scripts/install-door-dormouse-20261018.mjs`: preview by default, then explicit `--apply`; preserves all
  other pets, backs up original roster bytes, fails on corrupt/duplicate data and conflicting cached artwork.
  The HTTPS destination is a local option and is deliberately absent from the public source.
- Updated `pet-programs.json`, `INTELLIGENCE-LEVELS.md`, `AGENTS.md` and this handoff index with the actual status.
- Tests: all 105 Node tests passed, including four new installer tests. Independent read-only checker approved.
  Installed desktop host's `--self-test` passed without rebuilding or replacing its executable.
- Local install: `%LOCALAPPDATA%\astras-pet-apps\desktop-drafts-20261011.json` now includes Door Dormouse. Backup:
  `desktop-drafts-before-door-dormouse-20261018-005356.json` in the same directory. Frames are cached at
  `door-dormouse\bcd51002686d\`. Other draft entries were retained.
- Gracefully quit and restarted the existing desktop executable, then used its lineup action. Fresh diagnostics at
  2026-10-18T06:55:27Z report 37 visible pets, including Door Dormouse. The native UI inspector could not target the
  tiny pet window; no claim of a visually verified physical double-click.
- The Threshold's existing Sites source, `work/liminal-doors-site-20261016`, now has the static draft portrait and
  accurate click instructions. Source commit `edbeceb40ded03d7583ecef78e9fc682d2eae99d`; publication succeeded.
  Its audience was preserved. No browser roaming pet or fake native docking was added. Website storage untouched.

## Usage

From this branch: `node scripts/install-door-dormouse-20261018.mjs --website <the-threshold-https-url>` previews;
add `--apply` to install. Restart the existing Startup Star. Double-click the desktop mouse to open the program.
The host animates idle/blink; all nine moods are supplied. The installer does not add sign-in startup.

## Task

Have Astra review the draft art. L3 activity, native cyberhome docking, one-click reminders, a distinct three-click
random-door action and live Unity control remain separate work. Do not show them as connected. The mouse is still
a seed/draft, with no new farm permissions or repository.

## Done when

The review branch is merged by Astra and she has accepted the draft's look and native interaction.

## Return

Keep the live hub on main. On merge, the cache can be refreshed from the canonical hub using the same installer;
no duplicate pet is created. Do not overwrite unrelated roster entries or rebuild Startup Star from an older branch.
