status: open (waiting on Astra: OK to create the repo, and the Discord application)
for: any
from: Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-15
needs: README.md, AGENTS.md
---
## Task
AI IPO Countdown: an Anthropic IPO countdown on Astra's Discord profile, "fantastic like the other 3 Discord Presence
apps", with an OpenAI one later (Astra, 2026-11-15).

## Choices made for version 0.1.0
1. One repo, `ai-ipo-countdown`, one folder per company, like `ai-discord-presence`, which holds only its two apps.
2. Dates as reported on 2026-11-15: pricing on or about Wed Nov 18 (counted from 5pm New York), first trade Thu Nov 19
   at the 9:30am bell, Nasdaq, ticker ANT. All editable on the page under "Dates & setup".
3. The card: "Anthropic IPO" / "Nasdaq: ANT · Thu, Nov 19" / days to go, pricing day, Discord's live timer in the last
   24 hours; after the bell "Now trading on Nasdaq: ANT" / "It's here!" with Discord counting up from the bell for a day.
4. The picture: the approved gold galaxy, the same GIF Anthropic Discord Presence shows, from its fixed address. The
   page draws the galaxy live with a gold countdown under its core.
6. The dates and the Application ID are settings in `.local/config.json`, not on the page (Astra's layout).
5. Port 38767 (OpenAI: 38768). Discord Damsel manages it.

## What I did
- Built the app in the hub at `drafts/ai-ipo-countdown/` (hub pull request #365), from the Ableton app's Discord pipe,
  launcher and Startup file, and the Anthropic app's page, stylesheet and galaxy.
- Astra compared it with the three presence apps (2026-11-15) and asked for what they have, with AI Discord Presence as
  the model. Done: the page is the Anthropic page with no settings on it (settings in `.local/config.json`), the card
  preview with nothing under it, the four buttons beside it; the repo has `Start Anthropic IPO Countdown.cmd`,
  `Enable Automatic Startup.cmd`, a per-app README, the main README in AI Discord Presence's layout, SECURITY.md,
  ADDING-A-COMPANY.md, `scripts/package.mjs` and `downloads/anthropic-ipo-countdown.zip`, `docs/images/`, the
  repo-level naming and controls-page tests, `handoffs/README.md` and `changes/`.
- `node --test` at the root: 12 of 12 passed. The page drawn in Chromium at 1280×860 and phone width; the download
  unzipped and ran. Discord itself not reached (Windows only): **not verified here**.

## Open
- Astra: OK to create `findastra/ai-ipo-countdown`.
- Astra: register a Discord application with a non-brand name (for example "IPO Countdown"); its ID becomes
  `BUILT_IN_CLIENT_ID`. Until then the page asks for one.
- If the dates move before Nov 19: change them on the page, and in `EDITION` with the date and source.
- Then: `downloads/` zip, Discord Damsel's presence card, the System Map node; the OpenAI edition when its IPO is set.
