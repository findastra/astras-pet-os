# 389 · Only Startup Star in Task Manager (for Astra)

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-19. Status: #389 merged, then rolled back on the PC; the fix waits for Astra's OK.

## What I did

Astra's answer to the deck "Only the Star: 4 questions" was "All recommended":
1. An unplugged output counts as off.
2. She sees the Bug as his own row in Task Manager.
3. The star restarts leftover helpers as its own.
4. Voicemeeter stays its own app, and Chat Rat's server starts with the star.

| # | PR | What | State |
|---|---|---|---|
| 1 | findastra/voicemeeter-bug#15 | An unplugged output is off; one status line a minute | Merged (fd5c5b0), rebuilt and running on the PC |
| 2 | findastra/astras-pet-os#389 | The star adopts helpers an older star left behind; Chat Rat starts with it | Merged (33010c29), rolled back on the PC |
| 3 | `claude/only-orphans-20261119` | Take over only helpers whose parent is gone; never Desktop Commander or the presences | Open, waits for her OK |

Details are in `changes/only-the-star-in-task-manager-20261119.md`.

## What went wrong (2026-11-19, about 23:20)

The rebuilt star's first pass took over its helpers as planned. But the Desktop Commander leftover search matched every
`node.exe` whose command line says `desktop-commander`, which includes the Desktop Commander servers that Claude and
Codex chats run. The star stopped them all and started its own Remote copy instead. Those chats lost their Desktop
Commander tools until they reconnect.

I quit that star at 23:21 and put back the star from before #389 (`bin\desktop-pets-20261008.exe`, rebuilt from main
at 21:23). Its helpers are all running. The Bug runs from the new #15 build. The broken build is kept in my scratchpad
only.

## What is left
- Astra's OK for PR 3.
- After that merge: rebuild the star (quit with `"<hub>" --quit`, the hub folder first), start it with the
  "Astras PetOS Startup Star" task, and check that the helpers' parent is the star and every chat's Desktop Commander
  servers still run.
