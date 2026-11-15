# Adding another company

Each app in this repo is self-contained: one folder, one download, one Discord card. To add another company's IPO,
copy `anthropic-ipo-countdown/` and change the parts below. The example adds **OpenAI** as `openai-ipo-countdown`.

## 1. Copy the folder

```sh
cp -r anthropic-ipo-countdown openai-ipo-countdown
```

Rename the start file to `Start OpenAI IPO Countdown.cmd` (and the name inside `Enable Automatic Startup.cmd`), and
replace every "Anthropic IPO Countdown" / `anthropic-ipo-countdown` inside the new folder with the new name. Delete
`.local/` if it was copied.

## 2. The company and its dates (`src/card-20261115.js`)

Change `EDITION`: `app`, `company`, `ticker`, `exchange`, `targetAt` (the first trade, at the opening bell, in seconds
since 1970) and `pricingAt` (or `null`), and `port` (OpenAI: 38768). Write in the comment the date you read the dates
and where, and never call a reported date confirmed. Update the example in `public/app-20261115.js` (`EXAMPLE`) and the
page's text in `public/index-20261115.html`.

## 3. The galaxy

Use the company's approved galaxy from [AI Discord Presence](https://github.com/findastra/ai-discord-presence): copy its
`official-galaxy-data-20261030.js`, `official-galaxy-still-20261030.png` and `galaxy-card.gif` into `public/`, set
`data-official-galaxy="openai"` on the page's canvas, and point `GALAXY_URL` (and the pattern in `validateConfig`) at
`openai-discord-presence/public/galaxy-card.gif` with that repo's current `?v=`. The countdown's gold (`#big-count`,
`#big-label` in the stylesheet) becomes the galaxy's own colour. Never redraw a galaxy here.

## 4. The Discord application

One application serves every company: the card's title comes from the app. If none is built in yet, register one with
a non-brand name (Discord blocks some brand names) in the
[Discord Developer Portal](https://discord.com/developers/applications) and put its Application ID (public, not a
secret) in `BUILT_IN_CLIENT_ID`.

## 5. Test, package, list it

1. Update the app's tests in `test/` for the new edition, then run `node --test` in the app folder and at the repo root.
2. Add the folder to the app list in `scripts/package.mjs` and `test/naming-20261115.test.js`, then run
   `node scripts/package.mjs` to build `downloads/openai-ipo-countdown.zip`.
3. Fill in the OpenAI column of the tables in the main [README](README.md), with its card and app pictures in
   `docs/images/`.
