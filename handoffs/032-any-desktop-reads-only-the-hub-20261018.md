status: open, after Astra merges #60 and #58
for: any (step 2 is Astra's own)
from: Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-18
needs: docs/one-art-source-20261017.md, PET-FILES.md ("Where the pictures live"), handoffs/031-codex-rebuild-desktop-girls-same-size-20261017.md, docs/tray-star-handoff-20261011.md
---
## What I did

- **Built the one-art-source move**, which Astra approved on 2026-10-18.
  - Every pet picture now lives only in this hub (`art/`, `desktop-art/`).
  - PR #58 is on branch `claude/one-art-source-20261017`, which is built on #60.
  - There are 35 pet-repo PRs, listed in docs/one-art-source-20261017.md. None are merged.
- **The desktop pets' draft list now lives in this hub:** `desktop-art/desktop-drafts-20261018.json`, written by
  `scripts/prepare-desktop-drafts-20261011.mjs` and guarded by `test/desktop-drafts-test-20261018.mjs`.
  - Why: the Startup Star session showed on 2026-10-18 that a program started inside the Claude or Codex app reads and
    writes that app's private copy of `%LOCALAPPDATA%` (`%LOCALAPPDATA%\Packages\Claude_…\LocalCache\Local\…`; Codex
    has its own). The real `%LOCALAPPDATA%\astras-pet-os` has no draft list, so the star Windows starts at sign-in
    shows only the 21 hub pets. Agents cannot write the real one.
  - The hub folder is in Documents, which is not redirected, so every star now reads the same list.
- **Changed `scripts/desktop-pets-20261011.cs`:**
  - It reads the hub's list. The old `%LOCALAPPDATA%` list is read only while the hub has none.
  - Public draft pictures must be inside the hub.
  - Claude Bot's entry is `"private": true` and names only his repo. The app reads his pictures from
    `..\claude-bot\` or `..\claude-bot\claude-bot-draft-art-20261011\` next to the hub, and never outside that folder.
  - A draft that cannot load is skipped and named in the status file (`draft_errors`).
- **Tested in a scratch copy:**
  - The exe builds, and `--self-test` passes.
  - `--preview` shows all 16 draft pets, with Claude Bot read through his repo folder.
  - `npm test`: 109 pass.
- **The temporary pointer the redesign chat made on 2026-10-18** (`desktop-art-main-20261018\` and five changed entries
  in the old list) lives only in the Claude app's private copy of `%LOCALAPPDATA%`. The new list does not use it.
  - The four public pets' copies there are byte-identical to the hub's.
- **Astra copied the old list herself, 2026-10-18 02:24** (Startup Star session's script, run from her own PowerShell).
  The real `%LOCALAPPDATA%\astras-pet-os\` now holds Claude's copy of the old draft list (temporary pointer
  included), `drafts-20261011\` and `folder-icons\`. The scheduled task "Astras PetOS Startup Star" (sign-in and
  unlock) starts the real star, which shows 36 pets including the 16 drafts. Until the rebuild, the current exe keeps
  using that copy. After the rebuild, the hub's list wins.
- **Did not touch Astra's PC.**

## Task

Once #60 and #58 are on `main` and Startup Star's live sync has pulled them into the hub folder (check `git log -1`
there):

1. **Rebuild, together with card 031.** The exe lives in Documents, so any session can do this step.
   - Quit the star: `bin\desktop-pets-20261008.exe "<hub>" --quit`.
   - Run `build-desktop-pets-20261011.ps1`.
   - `bin\desktop-pets-check-20261011.exe "<hub>" --self-test` must say PASS.
2. **Astra starts the star herself**: from the Start menu or Explorer, or by locking and unlocking the PC, or by signing
   out and in (the scheduled task "Astras PetOS Startup Star" starts it then). A star started from a Claude or Codex
   session runs inside that app and uses its private `%LOCALAPPDATA%`.
   - Then she looks: all 16 draft pets should be there, and nothing should show double.
3. **Claude Bot's pictures.** `node scripts/prepare-desktop-drafts-20261011.mjs --print` ends with a line about Claude
   Bot.
   - If it says his folder does NOT match `claude-bot` main, the desktop shows his older pictures.
   - On 2026-10-18 his working copy, `claude-bot\claude-bot-draft-art-20261011`, held older **untracked** `desktop-art/`,
     which blocks a fast-forward.
   - Ask Astra before moving or replacing those files. Never delete them.
4. **Run A58:** `node scripts/one-art-source-20261017.mjs` with `GITHUB_TOKEN` set.
   - While pet PRs are open, it lists their copies.
   - Once they are all merged, it must say Correct, with only Claude Bot's exception.
5. **Tell Astra** which folders are no longer used, so she may delete them. Agents never delete.
   - The real `%LOCALAPPDATA%\astras-pet-os\`: the old `desktop-drafts-*.json`, `drafts-20261011\` and
     `desktop-art-main-20261018\`. Keep `folder-icons\` (desktop.ini uses it) and the status and log files.
   - `%LOCALAPPDATA%\Packages\Claude_pzs8sxrjxfjjc\LocalCache\Local\astras-pet-os\` holds the same old files.
   - Any of the same names under Codex's `Packages\OpenAI.Codex_…\LocalCache\Local\astras-pet-os\`.

## Done when

The desktop shows every pet from a star Astra started herself, the draft pets read from the hub folder, the self-test
passes, and the status file has no `draft_errors`. Record the A58 result here.

## Return

Update `## What I did` with what you ran and its output, set `status: done`, and commit on a branch for Astra to merge.
