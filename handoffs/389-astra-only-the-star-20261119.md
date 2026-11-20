# 389 · Only Startup Star in Task Manager (for Astra)

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-19. Status: two PRs open, waiting for Astra's OK.

## What I did

Astra's answer to the deck "Only the Star: 4 questions" was "All recommended":
1. An unplugged output counts as off.
2. She sees the Bug as his own row in Task Manager.
3. The star restarts leftover helpers as its own.
4. Voicemeeter stays its own app, and Chat Rat's server starts with the star.

| # | PR | What |
|---|---|---|
| 1 | findastra/voicemeeter-bug#15 | An unplugged output is off; one status line a minute |
| 2 | findastra/astras-pet-os#389 | The star adopts helpers an older star left behind; Chat Rat starts with it |

Details are in `changes/only-the-star-in-task-manager-20261119.md`.

## What is left
- Astra's OK for each PR.
- After the merges, rebuild on the PC:
  1. The Bug, by the swap route.
  2. The star, then restart it.
- Then check that Task Manager shows one Startup Star row.
