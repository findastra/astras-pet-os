status: open (PR #249 and the pet repos' PRs wait on Astra's OK, one by one)
for: claude
from: Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-25
needs: File Master plan reports/rename-astras-petos-20261025/plan-20261025.csv (on the desktop PC, approved), .github/workflows/farmer-daily-rounds.yml (Astra)
---
## What I did

Astra, 2026-10-25: her PC folder "needs to be Astra's PetOS", no patches, every reference of the old name gone. She
approved all 9 rows of the File Master plan (on the desktop, MSI MS-7E57).

- Row 5 and 6 for the hub: this PR (#249). Every mention of the old folder and repo name rewritten, the Farmer's desk
  page and notes key renamed (notes move over once), Startup Star's status file in `%LOCALAPPDATA%\astras-pet-os`.
- The same rewrite as one PR per pet repo (listed below as they open), branched from each repo's `main` in a
  scratchpad clone. Local working copies on Codex branches were not touched.

## Left to do, in order

1. Astra: the workflow line (see the PR), then merge #249 and the pet repos' PRs, each with her OK.
2. On the desktop: rebuild the star and the crash watchers, move `%LOCALAPPDATA%\astras-pet-apps` into
   `%LOCALAPPDATA%\astras-pet-os` (from Astra's own PowerShell), repoint the startup entries.
3. Close Claude and Codex; Astra runs the folder move script (no link left under the old name); repair every git
   worktree; move Claude's per-folder memory; update her CLAUDE.md and the memory notes.
4. Full search of C:\ and D: for the old name; fix or list every hit.
5. The laptop: the same move there (a note for its chat).
