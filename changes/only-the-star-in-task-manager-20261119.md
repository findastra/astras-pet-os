# Only Startup Star in Task Manager

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-19, for Astra.

Astra: "I dont want to see anything running on the task manager except the Startup Star. is that possible?". Her answer
on the four-question deck: "All recommended".

Windows never hides a running program. What it does is list a program's helpers inside that program's own row, but
only while the copy that started them still runs. Each time live sync restarts the star after a hub update, the
helpers the old star started fell out into rows of their own.

- **`scripts/desktop-pets-20261011.cs`:** 20 seconds after the star starts, and every 2 minutes after that, the star
  looks for helpers that an older star started. It stops each one and starts it again itself, so the helper sits
  inside the star's row.
  - Live Sync is restarted only between its passes (its pass lock is free), never while it updates a folder.
  - A helper's own sub-copies stop with it (Desktop Commander's node runs another node). Nothing else it opened is
    stopped: Voicemeeter, which the Bug opens, stays up, so the sound never cuts.
  - A copy run from a Temp folder belongs to another chat's test and is left alone.
  - The Bug is checked too. Watches hosted in Log Den's program are not; they have no process of their own.
- **Chat Rat's server** (`node chat-rat-20261016.mjs serve`) now starts with the star like the other helpers, and it
  has its own entry in the star's menu.
- **Voicemeeter** stays its own app (answer 4).
- **The self-test** checks the sign-in list (now with the port watch and Chat Rat) and the leftover search on a made-up
  process list: the top copy only, sub-copies first, never Voicemeeter, never a Temp test copy.

The Bug's half is findastra/voicemeeter-bug `claude/unplugged-is-off-20261119`:
- an unplugged output is off, not a problem;
- he writes his status once a minute instead of every 5 seconds.

**Fix, the same night:**
- The first build's leftover search also matched the Desktop Commander servers that Claude and Codex chats run. Their
  node command lines say `desktop-commander` too, so the star stopped them all.
- Now a copy counts as left behind only when its parent no longer runs. A copy someone else started (a chat, a
  terminal) has a live parent and is never touched.
- Desktop Commander and the three Discord presences are never taken over. They detach on purpose: Desktop Commander's
  script hands it to npx, and each presence's launch script starts its server and exits. A copy started again would
  fall out of the star's row anyway.
- The self-test now includes a chat's Desktop Commander chain and a chat's own Chat Rat server, and neither may be
  taken over.

Not done:
- Expanding the star's row still lists every helper. That is how Windows works.
- Apps Astra installed herself (Steam, Discord, Razer, Opera and the rest) are not PetOS and are left alone.
