# AI IPO Countdown

*By Astra.* Rules for AI assistants. Claude also reads [CLAUDE.md](CLAUDE.md); Codex reads this file and CLAUDE.md.

**Before any work, read in full:** this repo's `AGENTS.md`, `CLAUDE.md`, `ADDING-A-COMPANY.md`, `README.md` and
`handoffs/`, then everything in the "Before any work" list in
[findastra/astras-pet-os AGENTS.md](https://github.com/findastra/astras-pet-os/blob/main/AGENTS.md). No skimming or
partial reads. Say in your first reply which files you read.

This repo holds only the IPO countdown apps, one folder per company (`anthropic-ipo-countdown/` now,
`openai-ipo-countdown/` next), and the guide to add another. It follows AI Discord Presence
(`findastra/ai-discord-presence`), the model for these apps (Astra, 2026-11-15: "the AI ones are the better ones"):
the same page, stylesheet, card preview, file layout and README. The pet that manages it, Discord Damsel, keeps her own
files and tools in `findastra/discord-tower`; never add them, or notes about them, here.

- The apps read nothing on the PC and send Discord only the card. Never commit credentials, local settings, caches or
  logs.
- The controls page follows Astra's layout for AI Discord Presence (2026-10-28): no settings on the page (they live in
  `.local/config.json`), nothing under the card, short button names, only the chosen mode lit
  (`test/controls-page-20261115.test.js`). The one addition is the countdown under the galaxy.
- The dates are reported, not final. Write the date you read them and your source in the `EDITION` comment, and
  never call a reported date confirmed. Not financial advice: the card counts down; it never says to buy.
- The galaxies are Astra's approved art (2026-10-30), copied from `findastra/ai-discord-presence`, never redrawn here.
  The card loads its GIF from that repo's fixed address (`GALAXY_URL`). Never company logos.
- Add tests with every behavior change (`node --test` at the root runs every app's tests and the naming rules).
  Rebuild the downloads with `node scripts/package.mjs` before pushing any app change. No dependencies.
- New filenames use lowercase words and a date immediately before the extension. Required names, the start files
  (`Start <App>.cmd`, `Enable Automatic Startup.cmd`, as in AI Discord Presence) and the galaxy files copied with their
  own names keep them.

Built with:
- Anthropic IPO Countdown, version 0.1.0, the repo and the adding guide: Claude Opus 5.5 (`claude-opus-5-5`),
  2026-11-15, at Astra's request ([card 001](handoffs/001-any-first-version-20261115.md)).
