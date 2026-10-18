status: open (finish after PR #23 is merged)
for: codex
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-17
needs: this card; docs/tray-star-handoff-20261011.md; PR #23 and PR #26; findastra/startup-star `scripts/live-sync-20261017.ps1`
---
## What I did

Astra asked (2026-10-17, 20:45) whether Startup Star was opening her current pets or an old version. Every launcher
(the folder shortcut, the Start menu shortcut, the `findastra-desktop-pets` Run key) opens the right program,
`astras-pet-os\bin\desktop-pets-20261008.exe` (your 2026-10-15 19:17 build). The pets it shows were the problem:

- The hub's PC working copy (`%USERPROFILE%\Documents\Astra's Pet Apps\astras-pet-os`) was still checked out on
  `codex/world-caretakers-20261016` (`4c949e8`). PR #26 merged that branch into `codex/findastra-readme-auditor-20261015`
  (PR #23, still open), not into `main`. So the folder was 24 commits ahead of `main` and 44 behind it.
- The star reads `pets.json`, `art/frames/` and `desktop-art/` from that folder. Live sync only fast-forwards a folder
  along the branch it is on, and your branch had nothing new, so the hub never caught up and the log said nothing.
  Platform Platypus, registered on `main` on 2026-10-17, was missing from the desktop.

With Astra's OK, on her PC, 2026-10-17 about 21:00:
- **Checked first:** no uncommitted changes, the branch was level with `origin/codex/world-caretakers-20261016` (nothing
  unpushed), no `index.lock`, and the last action in that checkout was your commit on 2026-10-16 at 16:08. Your branch
  and every commit on it are on GitHub, and the local branch ref is still there.
- **Switched the hub folder to `main`:** `git switch main`, then `git merge --ff-only origin/main`. It is on `main` at
  `4a86d0e`, level with `origin/main`, so live sync now follows `main` every 30 s.
- **Restarted the star:** `bin\desktop-pets-20261008.exe "<hub>" --quit`, then started it again with the hub path.
  `%LOCALAPPDATA%\astras-pet-apps\desktop-pets-status-20261008.json` reports it running with the tray star visible and
  36 desktop pets: 19 registered (Platform Platypus is new), 16 local drafts and the Farmer.
- **Not changed:** `bin\` (git-ignored, so the switch left the exe alone; nothing was rebuilt), `scripts/desktop-pets-20261011.cs`
  or any other desktop file, the local draft list, startup settings, and the other worktrees of this repo.
- This card and its rows in `handoffs/README.md`, on branch `claude/star-hub-on-main-20261017`, written in a worktree
  outside the hub folder.

## Watch out
1. **The running exe has a feature `main` does not.** Your build includes the Goldfish triple-click that opens the README
   auditor (`d8352ae`, PR #23). On `main`, `scripts/desktop-pets-20261011.cs` does not have it, so **rebuilding from `main`
   before PR #23 merges takes it off Astra's desktop.** Build from your branch until then.
2. **One untracked file in the hub folder:** `apps/liminal-doors-assets/liminal-doors-imagebook-20261015.pdf` (33 MB,
   2026-10-15). Your branch's `.gitignore` ignores it; `main`'s does not, so on `main` it shows as untracked. I left it
   where it is. Do not `git add -A` in that checkout. It is ignored again once PR #23 brings your `.gitignore` to `main`.
3. **Live sync cannot see this happen.** A folder parked on a finished branch is skipped without a log line. A warning
   for it belongs in `findastra/startup-star`; not done.

## Task
1. When you work on the hub, use a branch from `main` (a worktree outside the folder is safest), and leave the hub folder on
   `main` when you stop, so the star and live sync follow `main`.
2. After PR #23 (with #26 inside it) is merged: confirm the hub folder is on `main` and fast-forwarded, rebuild the desktop
   exe from `main` with `build-desktop-pets-20261011.ps1` (candidate, self-test, then install, as in
   docs/tray-star-handoff-20261011.md), and restart the star.

## Done when
PR #23 is merged, the hub folder is on `main`, and the installed exe is built from `main` with the Goldfish triple-click.

## Return
Update `## What I did`, set `status: done`, commit on a `codex/` branch.
