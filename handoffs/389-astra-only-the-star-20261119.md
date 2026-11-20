# 389 · Only Startup Star in Task Manager (for Astra)

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-19. Status: done 2026-11-20. Fix #394 merged (5db73a02) with Astra's OK, and the star rebuilt and restarted at 00:39.

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
| 3 | findastra/astras-pet-os#394 | Take over only helpers whose parent is gone; never Desktop Commander or the presences | Merged (5db73a02), rebuilt and running on the PC |

Details are in `changes/only-the-star-in-task-manager-20261119.md`.

## What went wrong (2026-11-19, about 23:20)

The rebuilt star's first pass took over its helpers as planned. But the Desktop Commander leftover search matched every
`node.exe` whose command line says `desktop-commander`, which includes the Desktop Commander servers that Claude and
Codex chats run. The star stopped them all and started its own Remote copy instead. Those chats lost their Desktop
Commander tools until they reconnect.

I quit that star at 23:21 and put back the star from before #389 (`bin\desktop-pets-20261008.exe`, rebuilt from main
at 21:23). Its helpers are all running. The Bug runs from the new #15 build. The broken build is kept in my scratchpad
only.

## Checked after #394 (2026-11-20, about 00:42)

- These now run with the star as their parent: Log Den, Benchmark Rock, Live Sync, Flash Audit, pet moods, the port
  watch, Chat Rat, pet chat, Rift Rabbit and the Bug.
- The chats' Desktop Commander processes are the same three before and after.
- Voicemeeter kept running the whole time.
- The three Discord presences keep their own rows, as planned. They detach on purpose.

## What is left
- Nothing on this card. Expanding the star's row in Task Manager still lists its helpers; that is how Windows works.
