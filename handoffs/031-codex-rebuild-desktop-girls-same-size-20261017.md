status: open (after Astra merges `claude/girls-same-size-20261017`)
for: codex
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-18
needs: docs/girls-same-size-20261017.md; handoffs/029-codex-hub-folder-back-on-main-20261017.md; docs/tray-star-handoff-20261011.md; scripts/desktop-pets-20261011.cs
---
## What I did

Astra (2026-10-17): "these girls need the same body size exactly and head size". Group 3 (Discord Damsel, API Fairy,
Astra Wisp, Mommy's Mommies, VSCode Angel) now measure head 76 px and body 109 px on their frames, and the desktop draws
them at one scale. Record: [docs/girls-same-size-20261017.md](../docs/girls-same-size-20261017.md).

- **astras-pet-os, branch `claude/girls-same-size-20261017`** (not merged): new `desktop-art/` for the Damsel, Wisp and
  Angel; new `art/sheets/` and rebuilt `art/frames/` for the Fairy and the Damsel; four icons; `NATIVE` sheets in
  `scripts/build-frames.mjs` and `scripts/sheet-to-sprites.mjs`.
- **`scripts/desktop-pets-20261011.cs`**, your file: `SameSize` and `SameSizeCrop` (212). In `LayoutPets` those five
  sprites get a crop 212 art pixels tall up from the soles, drawn `NormalHeight` high, instead of their own alpha
  bounds. The self-test checks it. Nothing else in the desktop code changed.
- Built in scratch copies only (`main` and the branch), never in the hub folder on Astra's PC: `--self-test` passes on
  both; `--preview` renders measured head 21 and body 30 screen px for every girl after (20 to 26 and 29 to 33 before).
- Not touched: Astra's running desktop pets, `bin\` in the hub folder, the local draft list, startup settings.
- Matching pull requests: findastra-discord-presence#5, api-fairy#3, the-astral-plane#4, vscode-angel#3,
  mommys-mommies#3, findastra.github.io#4.

## Task

After Astra merges the hub branch:

1. Rebuild the installed desktop exe with **both** this change and the Goldfish triple-click from PR #23 (merged into
   `codex/yellow-phone-20261015`, not `main`; see card 029): building from `main` alone drops the triple-click.
   Candidate, self-test, then install, as in docs/tray-star-handoff-20261011.md.
2. Restart the star and check the five sprites on the desktop: the same head and body size.

## Done when

The installed exe has the group 3 scale and the Goldfish triple-click, and the self-test line includes "group 3
same-size scale".

## Return

Update `## What I did`, set `status: done`, commit on a `codex/` branch.
