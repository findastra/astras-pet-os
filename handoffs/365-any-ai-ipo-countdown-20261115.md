status: open (waiting on Astra: OK to create the ai-ipo-countdown repo, and a Discord application ID)
for: any
from: Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-15
needs: drafts/ai-ipo-countdown/handoffs/001-any-first-version-20261115.md
---
## Task
Anthropic IPO Countdown, the first app of AI IPO Countdown (OpenAI's comes later), "fantastic like the other 3 Discord
Presence apps" (Astra, 2026-11-15).

## Ownership and state
State: READY_FOR_REVIEW
Implementer: Claude cloud session; writable files: drafts/ai-ipo-countdown/, this card,
changes/ai-ipo-countdown-20261115.md; ownership: released
Reviewer: unassigned; next action: review #365, then a Windows test on Astra's PC

## What I did
- Version 0.1.0 in `drafts/ai-ipo-countdown/anthropic-ipo-countdown/` (pull request #365): the Ableton app's Discord
  pipe and launcher, the Anthropic app's gold galaxy and page layout, IPO card logic (days, pricing day, the bell).
- `node --test` in the app: 7 of 7 passed. The page was tested in Chromium (desktop and phone) against the running server.
- Not verified here: Discord itself (Windows only). Hub `npm test`: the same 6 farm-pets tests fail without this draft.

## Done when
- Astra OKs the repo, and the draft moves there as its first commit (then it is removed from `drafts/`).
- "Countdown Presence" is registered and its ID is built in; the card shows on Astra's profile.
- Discord Damsel's presence card and the System Map node are added, as for the Ableton app.
- The card is up before the first trade (expected Thu 2026-11-19); the dates still match the latest reports.

## Return
Record review and receipt here.

## Receipt and review
Pending.
