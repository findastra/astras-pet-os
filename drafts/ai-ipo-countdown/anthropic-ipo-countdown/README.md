# Anthropic IPO Countdown

*By Astra.*

A free Windows companion that counts down to Anthropic's IPO on Discord, with the gold galaxy, the ticker and date,
pricing day, a live timer on the last day and the time since the opening bell.

**[Download for Windows](https://github.com/findastra/ai-ipo-countdown/raw/main/downloads/anthropic-ipo-countdown.zip)**

## Start it

The card shows the official gold five-arm galaxy from Anthropic Discord Presence, approved by Astra on October 30,
2026. The app's page draws it live, star by star, with the countdown to the opening bell under its white core. The
device's reduced-motion preference is respected.

1. Install [Node.js 24 or later](https://nodejs.org/en/download) if needed. No npm install is required.
2. Extract the download and double-click **Start Anthropic IPO Countdown.cmd**.
3. Keep Discord desktop open with activity sharing enabled, and click **Start**.
4. Optional: double-click **Enable Automatic Startup.cmd** to start it with Windows. Keep the extracted folder in place.

The page's buttons: **Start**, **Stop**, **Hide Date** and **Quit** (click twice). See
[the main README](https://github.com/findastra/ai-ipo-countdown#buttons--instructions).

**Until the built-in Discord application is registered**, add an Application ID once: create an application in the
[Discord Developer Portal](https://discord.com/developers/applications), click **Quit**, put its Application ID in
`clientId` in `.local/config.json` in the app folder, then start the app again. It is public, not a secret; no token
is needed. The card's line under the timer says so until it is set.

## What Discord shows

| When | The card |
| --- | --- |
| Days before | **Anthropic IPO** · Nasdaq: ANT · Thu, Nov 19 · 4 days to go |
| Pricing day | Pricing today, then Priced · trading tomorrow |
| The last 24 hours | Discord's own live timer, such as 5:12:33 left; Opening bell today on the day |
| After the opening bell | Now trading on Nasdaq: ANT · It's here!, with Discord counting up from the bell |

A day after the bell the card turns itself off. **Hide Date** takes the date off the card. Days are counted in your
PC's time zone; the bell is 9:30am in New York.

**Start** stays active until **Stop** or **Quit**, and the app starts sharing again when it starts (turn that off with
`"automaticOnStart": false`). Closing the browser tab leaves the companion running.

## The dates

As reported on November 15, 2026: pricing on or about Wednesday, November 18, and the first trade on Nasdaq as ANT on
Thursday, November 19. **They are not final.** If they move: click **Quit**, set `targetAt` (the first trade) and
`pricingAt` in `.local/config.json` as seconds since 1970 (`null` for no pricing day), then start the app again.
`ticker`, `exchange` and `title` are there too.

## Updating and startup

Before starting an updated or relocated copy, click **Quit** (twice) on the old copy's page. The launcher checks the
running installation and source build; it reports a conflict instead of silently opening an older copy. If the folder
moved, enable startup from the new copy again. To disable startup, run `node scripts/startup-20261115.js --remove`.

## Privacy

The app reads nothing on your PC. The control server binds only to `127.0.0.1`, checks Host and Origin for changes,
and sends no telemetry. Discord receives the card's text, a timestamp and the galaxy's image address. Settings remain
in the Git-ignored `.local/config.json`.

## Development

```sh
node --test
node src/server-20261115.js
```
