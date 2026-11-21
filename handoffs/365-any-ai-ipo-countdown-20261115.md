status: open (waiting on Astra: a Discord application ID)
for: any
from: Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-15
needs: findastra/ai-ipo-countdown handoffs/001-any-first-version-20261115.md
---
## Task
Anthropic IPO Countdown, the first app of AI IPO Countdown (OpenAI's comes later), "fantastic like the other 3 Discord
Presence apps" (Astra, 2026-11-15).

## Ownership and state
State: READY_FOR_REVIEW
Implementer: Claude cloud session; writable files: findastra/ai-ipo-countdown, this card,
changes/ai-ipo-countdown-20261115.md; ownership: released
Reviewer: unassigned; next action: review #365, then a Windows test on Astra's PC

## What I did
- Version 0.1.0 in `drafts/ai-ipo-countdown/anthropic-ipo-countdown/` (pull request #365): the Ableton app's Discord
  pipe and launcher, the Anthropic app's gold galaxy and page layout, IPO card logic (days, pricing day, the bell).
- Matched to AI Discord Presence at Astra's request: the same page with no settings on it, and the same repo layout
  (start files, READMEs, SECURITY.md, ADDING-A-COMPANY.md, the download zip, README pictures, repo-level tests).
- `node --test` at the draft's root: 12 of 12 passed. The page was drawn in Chromium (desktop and phone), and the
  download unzipped and ran.
- Not verified here: Discord itself (Windows only). Hub `npm test`: the same 6 farm-pets tests fail without this draft.

## Done when
- Done 2026-11-15: Astra OK'd the repo; created public from her PC, the app is its first commit (`07bc914`), and the
  draft is removed from `drafts/` here.
- "Countdown Presence" is registered and its ID is built in; the card shows on Astra's profile.
- Discord Damsel's presence card and the System Map node are added, as for the Ableton app.
- The card is up before the first trade (expected Thu 2026-11-19); the dates still match the latest reports.

## Return
Record review and receipt here.

## Receipt and review
Pending.
