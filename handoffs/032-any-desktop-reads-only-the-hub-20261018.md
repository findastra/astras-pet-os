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
  her hub folder are unchanged.
- **The redesign chat's temporary pointer, 2026-10-18.** That chat made it at Astra's request, to show the new bee,
  moth, butterfly, fox and Claude Bot before this move lands. It is on the PC only:
  - The art is copied into `%LOCALAPPDATA%\astras-pet-apps\desktop-art-main-20261018\<pet>\` for rgbee, mesh-moth,
    wifi-butterfly, meme-fiend and claude-bot.
  - Those five draft-list entries point there. Their backup is `desktop-drafts-20261011.before-art-pointer-20261018.json`.
  - The other 11 entries still point into pet working copies and `drafts-20261011\`.

  I checked it read-only:
  - The four public pets' copies are byte-identical to this hub's `desktop-art/`.
  - Claude Bot's copy is not the same as the art in his repo folder on the PC: `claude-bot\claude-bot-draft-art-20261011` is on `main`
    with an older **untracked** `desktop-art/`.
  - So `prepare-desktop-drafts` now uses his folder only when both pictures match `claude-bot` `origin/main`;
    otherwise he keeps his current entry. I dry-ran it against Astra's real folders with `--print`: 16 pets, and Claude Bot
    kept the `desktop-art-main-20261018\claude-bot\` pointer.

## Task

Once #60 and #58 are on `main` and Startup Star's live sync has pulled them into
`%USERPROFILE%\Documents\Astra's PetOS\astras-pet-os`, do these steps in Astra's hub folder.
Check `git log -1` there first.

1. **Do card 031's rebuild at the same time, not twice.**
   - Quit the star: `bin\desktop-pets-20261008.exe "<hub>" --quit`.
   - Run `build-desktop-pets-20261011.ps1`.
2. **Write the draft list.** Run `node scripts/prepare-desktop-drafts-20261011.mjs`.
   - It should list 16 pets. This replaces the temporary pointer for rgbee, mesh-moth, wifi-butterfly and meme-fiend
     with hub paths.
   - Claude Bot is the only `"private": true` entry. If the script warns that he kept his current entry, his repo
     folder on the PC is out of date. Bring it up to date with `claude-bot` `main`, then run the script again.
     - The folder's untracked `desktop-art/` blocks a fast-forward.
     - Ask Astra before moving or replacing those files. Never delete them yourself.
3. **Check the build:** `bin\desktop-pets-check-20261011.exe "<hub>" --self-test` must say PASS.
4. **Start the star again.** Then check `%LOCALAPPDATA%\astras-pet-apps\desktop-pets-status-20261008.json`:
   - `draft_errors` is empty;
   - `pet_count` is the same as before.
5. **Run A58:** `node scripts/one-art-source-20261017.mjs` with `GITHUB_TOKEN` set.
   - While pet PRs are still open, it lists their copies.
   - Once all are merged, it must say Correct, with only Claude Bot's exception.
6. **Tell Astra** which old folders are no longer used, so she may delete them. Agents never delete.
   - `%LOCALAPPDATA%\astras-pet-apps\drafts-20261011\`.
   - The temporary `desktop-art-main-20261018\` (a copy, against A58), but only once no draft-list entry points
     into it. Claude Bot's entry points there until his repo folder is up to date.

## Done when

The desktop shows every pet, the draft pets read from the hub folder, the self-test passes, and the status file has
no `draft_errors`. Record the A58 result here.

## Return

Update `## What I did` with what you ran and its output, set `status: done`, and commit on a branch for Astra to merge.
