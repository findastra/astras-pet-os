status: open (after Astra merges `claude/girls-same-size-20261017`)
for: codex
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-18
needs: docs/girls-same-size-20261017.md; handoffs/029-codex-hub-folder-back-on-main-20261017.md; docs/tray-star-handoff-20261011.md; scripts/desktop-pets-20261011.cs
---
## What I did

Astra (2026-10-17): "these girls need the same body size exactly and head size"; (2026-10-18) the head is measured
without hair, and Mommy's Mommies do not change at all. Discord Damsel, API Fairy, Astra Wisp and VSCode Angel now have
Mommy's Mommies' face (49 px wide, 26 px eye top to chin) and body (109 px) on their frames, and the desktop draws all
five group 3 sprites at Mommy's Mommies' own scale. Record: [docs/girls-same-size-20261017.md](../docs/girls-same-size-20261017.md).

- **astras-pet-os, branch `claude/girls-same-size-20261017`** (not merged): new `desktop-art/` for the Damsel, Wisp and
  Angel; new `art/sheets/` and rebuilt `art/frames/` for the Fairy and the Damsel; four icons; `NATIVE` sheets in
  `scripts/build-frames.mjs` and `scripts/sheet-to-sprites.mjs`.
- **`scripts/desktop-pets-20261011.cs`**, your file: `SameSize` and `SameSizeCrop` (202, Mommy's Mommies' own height).
  In `LayoutPets` those five sprites get a crop 202 art pixels tall up from the soles, drawn `NormalHeight` high,
  instead of their own alpha bounds; Mommy's Mommies come out exactly as before. The self-test checks it. Nothing
  else in the desktop code changed.
- Built in scratch copies only (`main` and the branch), never in the hub folder on Astra's PC: `--self-test` passes on
  both; on `--preview` renders every girl's eye top, chin and soles land on the same screen rows as Mommy's Mommies'
  (face 8 px eye top to chin, body 31 px), and Mommy's Mommies are drawn pixel for pixel as on `main`.
- Not touched: Astra's running desktop pets, `bin\` in the hub folder, the local draft list, startup settings.
- Matching pull requests: findastra-discord-presence#5, api-fairy#3, the-astral-plane#4, vscode-angel#3,
  findastra.github.io#4 (mommys-mommies#3 was closed: nothing of theirs changes).

## Task

After Astra merges the hub branch:

1. Rebuild the installed desktop exe with **both** this change and the Goldfish triple-click from PR #23 (merged into
   `codex/yellow-phone-20261015`, not `main`; see card 029): building from `main` alone drops the triple-click.
   Candidate, self-test, then install, as in docs/tray-star-handoff-20261011.md.
2. Restart the star and check the five sprites on the desktop: the same face and body size, Mommy's Mommies as before.

## Done when

The installed exe has the group 3 scale and the Goldfish triple-click, and the self-test line includes "group 3
same-size scale".

## Return

Update `## What I did`, set `status: done`, commit on a `codex/` branch.
