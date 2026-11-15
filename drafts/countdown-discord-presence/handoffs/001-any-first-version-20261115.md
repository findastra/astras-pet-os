status: open (waiting on Astra: the questions below, the repo and the Discord application)
for: any
from: Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-15
needs: README.md, AGENTS.md
---
## Task
First version of Countdown Discord Presence: a Discord card that counts down to a day Astra chooses.

## Choices made for version 0.1.0 (Astra asked "make me a new Discord Presence app. this one is a countdown")
Made without a question deck so there was something to look at; each one is a setting or a one-line change.
1. One countdown, set on the page: what it is, the date and time, and the card title ("Countdown").
2. The card: the event, then "12 days to go · Fri, Dec 25"; weeks past 8 weeks; "Tomorrow", "Today", and Discord's live
   timer in the last 24 hours. "It's here!" for 24 hours, then the card goes away.
3. Card picture: a neon hourglass on graphite, drawn in code (free), the same drawing as the icon.
4. Discord Damsel manages it, like the Ableton app. Port 38767.

## What I did
- Built version 0.1.0 from Ableton Live Discord Presence v0.2.0: the Discord pipe, launcher, Startup file and source
  identity carried over with new names; new card logic, server, page, setup form and hourglass art.
- `node --test`: 8 of 8 passed. Ran the server on Linux and used the page in Chromium: Save, the card preview, the
  last-day timer, Hide Date and Quit work, with no sideways scroll at phone width. Discord itself was not reached
  (Windows only): **not verified here**. On Astra's PC, double-click `start-countdown-discord-presence-20261115.cmd`.
- Staged in the hub at `drafts/countdown-discord-presence/` because the repo does not exist yet.

## Open
- Astra: OK to create the public repo `findastra/countdown-discord-presence` (public, so Discord can load the picture).
- Astra: make the Discord application "Countdown Presence" in the Developer Portal; its ID becomes
  `BUILT_IN_CLIENT_ID` and version 0.2.0. Until then the page asks for an Application ID.
- Discord Damsel's presence card and her `pet.json` (discord-tower) and the hub's System Map node: after the repo exists.
