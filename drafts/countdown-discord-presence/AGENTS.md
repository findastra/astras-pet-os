# Countdown Discord Presence

*By Astra.* Rules for AI assistants. Claude also reads [CLAUDE.md](CLAUDE.md); Codex reads this file and CLAUDE.md.

**Before any work, read in full:** this `AGENTS.md`, `CLAUDE.md`, `README.md` and `handoffs/`, then everything in the
"Before any work" list in [findastra/astras-pet-os AGENTS.md](https://github.com/findastra/astras-pet-os/blob/main/AGENTS.md).

This repo holds one Windows app that counts down to a day Astra chooses on her Discord profile. It is managed by
Discord Damsel (her files live in private `findastra/discord-tower`; never add them here). It follows the same build
as Ableton Live Discord Presence (`findastra/ableton-live-discord-presence`) and the AI presence apps
(`findastra/ai-discord-presence`).

- The app reads nothing on the PC. It sends Discord only the card: the title, the event and its date.
- The Discord card title is the card title setting ("Countdown" by default), sent in the activity `name` field.
- Discord draws the live timer from `timestamps.end`, sent only in the last 24 hours (further out it would read as
  hundreds of hours). The words count calendar days in the PC's time zone.
- Card art is original, drawn by `scripts/make-hourglass-art-20261115.js`. When the art changes, run `npm run art` and
  bump `?v=` in `HOURGLASS_URL` (`src/card-20261115.js`). Generating AI images costs Astra money: ask first.
- Add tests with every behaviour change (`node --test`). Never commit `.local/`, credentials, caches or logs.
- New filenames use lowercase words and a date immediately before the extension. Required names (`README.md`,
  `AGENTS.md`, `CLAUDE.md`, `LICENSE`, `package.json`, `.gitignore`, `.gitattributes`) keep their exact names.

Built with:
- Version 0.1.0 (the app, its page and the hourglass art): Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-15, at
  Astra's request. Choices recorded in [handoffs/001](handoffs/001-any-first-version-20261115.md).
