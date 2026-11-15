status: open (waiting on Astra: OK to create the countdown-discord-presence repo, and the Discord application)
for: any
from: Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-15
needs: drafts/countdown-discord-presence/handoffs/001-any-first-version-20261115.md
---
## Task
Countdown Discord Presence: a new presence app that counts down to a day Astra chooses (Astra, 2026-11-15).

## Ownership and state
State: READY_FOR_REVIEW
Implementer: Claude cloud session; writable files: drafts/countdown-discord-presence/, this card,
changes/countdown-discord-presence-20261115.md; ownership: released
Reviewer: unassigned; next action: review #365, then a Windows test on Astra's PC

## What I did
- Version 0.1.0 in `drafts/countdown-discord-presence/` (pull request #365), built from Ableton Live Discord Presence v0.2.0.
- `node --test` in the draft: 8 of 8 passed. The page was tested in Chromium against the running server.
- Not verified here: Discord itself (Windows only). Hub `npm test`: the same 6 farm-pets tests fail without this draft.

## Done when
- Astra OKs the public repo, and the draft moves there as its first commit (then it is removed from `drafts/`).
- "Countdown Presence" is registered and its ID is built in; the card shows on Astra's profile.
- Discord Damsel's presence card and the System Map node are added, as for the Ableton app.

## Return
Record review and receipt here.

## Receipt and review
Pending.
