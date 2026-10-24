status: open (waiting on Astra: OK to merge #242 first; the repo PRs follow)
for: claude
from: Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-24
needs: docs/one-art-source-20261017.md ("Addresses that never change"), scripts/one-picture-home-20261024.mjs, scripts/one-art-source-20261017.mjs, findastra/startup-star scripts/live-sync-20261017.ps1
---
## What I did

Astra, 2026-10-24: every pet picture should have one hosted spot that anything can update, so she never updates them
one by one or falls versions behind. She answered the six questions all recommended (the "One home for pet pictures"
deck). The answers and the address scheme are in docs/one-art-source-20261017.md.

**Hub, #242** (`claude/one-picture-home-20261024`): `art/latest/` made by the build, the `--fix` / `--check` link
tool, the checker's private-hub and dated-link findings with `--save`, the outstanding-items rows, the hub's own
links, the docs and tests. 338 of 339 tests pass, 0 fail.

**Still to do, in this order:**
1. The six repos with copies (findastra.github.io, the-astral-plane, vscode-angel, lunas-log, spoonfed,
   fuzzboi-factory): remove each copy and link `art/latest`, one PR each. A picture that isn't in the hub yet moves
   here first.
2. The other repos' dated links (419 links in 34 repos on 2026-10-24) move to `art/latest` with
   `node scripts/one-picture-home-20261024.mjs --fix`, one PR per repo. They only work after #242 merges.
3. Desktop pets: Startup Star's live sync keeps a pictures-only copy of the hub, which the star reads while the hub
   folder is held back, and runs the daily check (`--links --save`). Startup Star's repo has no other open work; the
   desktop source is the hub's `scripts/desktop-pets-20261011.cs`.
4. A merge chart for Astra. Every merge waits on her OK for that PR.
