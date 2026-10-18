status: open, after Astra merges #60 and #58
for: any
from: Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-18
needs: docs/one-art-source-20261017.md, PET-FILES.md ("Where the pictures live"), handoffs/031-codex-rebuild-desktop-girls-same-size-20261017.md, docs/tray-star-handoff-20261011.md
---
## What I did

- Built the one-art-source move that Astra approved on 2026-10-18. Every pet picture now lives only in this hub
  (`art/`, `desktop-art/`). The pet repos, the portfolio and Fuzzbois load the pictures from
  `https://raw.githubusercontent.com/findastra/astras-pet-os/main/<path>`. PR #58 is on branch
  `claude/one-art-source-20261017`, which is built on #60. There are 35 pet-repo PRs, listed in
  docs/one-art-source-20261017.md. None are merged.
- Changed `scripts/desktop-pets-20261011.cs`:
  - Draft pictures must sit inside the hub folder. An entry marked `"private": true` (Claude Bot) is the only one
    allowed outside it.
  - A draft that cannot load is skipped and named in the status file (`draft_errors`).
- Rewrote `scripts/prepare-desktop-drafts-20261011.mjs` to write hub-relative paths.
- Tested in a scratch copy, never in Astra's hub folder:
  - Built the exe and ran `--self-test`: PASS with the new list, and PASS with today's old list (the drafts are
    skipped).
  - `--preview` showed all 16 draft pets.
- **Did not touch Astra's PC.** Her desktop pets app, `%LOCALAPPDATA%\astras-pet-apps\desktop-drafts-20261011.json` and
  her hub folder are unchanged. Her draft list still points into 14 pet working copies.

## Task

Once #60 and #58 are on `main` and Startup Star's live sync has pulled them into
`%USERPROFILE%\Documents\Astra's PetOS\astras-pet-os`, do these steps in Astra's hub folder.
Check `git log -1` there first.

1. **Do card 031's rebuild at the same time, not twice.**
   - Quit the star: `bin\desktop-pets-20261008.exe "<hub>" --quit`.
   - Run `build-desktop-pets-20261011.ps1`.
2. **Write the draft list.** Run `node scripts/prepare-desktop-drafts-20261011.mjs`.
   - It should list 16 pets.
   - Claude Bot is the only `"private": true` entry, pointing into his private repo's folder. Check that the folder
     holds his BSOD art from claude-bot `main`; it may need a pull, and that working copy has had untracked art.
3. **Check the build:** `bin\desktop-pets-check-20261011.exe "<hub>" --self-test` must say PASS.
4. **Start the star again.** Then check `%LOCALAPPDATA%\astras-pet-apps\desktop-pets-status-20261008.json`:
   - `draft_errors` is empty;
   - `pet_count` is the same as before.
5. **Run A58:** `node scripts/one-art-source-20261017.mjs` with `GITHUB_TOKEN` set.
   - While pet PRs are still open, it lists their copies.
   - Once all are merged, it must say Correct, with only Claude Bot's exception.
6. **Tell Astra** that `%LOCALAPPDATA%\astras-pet-apps\drafts-20261011\` is no longer used, so she may delete it.
   Agents never delete.

## Done when

The desktop shows every pet, the draft pets read from the hub folder, the self-test passes, and the status file has
no `draft_errors`. Record the A58 result here.

## Return

Update `## What I did` with what you ran and its output, set `status: done`, and commit on a branch for Astra to merge.
