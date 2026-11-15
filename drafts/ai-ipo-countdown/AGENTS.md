# AI IPO Countdown

*By Astra.* Rules for AI assistants. Claude also reads [CLAUDE.md](CLAUDE.md); Codex reads this file and CLAUDE.md.

**Before any work, read in full:** this `AGENTS.md`, `CLAUDE.md`, `README.md` and `handoffs/`, then everything in the
"Before any work" list in [findastra/astras-pet-os AGENTS.md](https://github.com/findastra/astras-pet-os/blob/main/AGENTS.md).

This repo holds one Discord presence app per company, counting down to its IPO: `anthropic-ipo-countdown/` now,
`openai-ipo-countdown/` next (README, "Adding a company"). It is managed by Discord Damsel (her files live in private
`findastra/discord-tower`; never add them here). It follows the build of Ableton Live Discord Presence and AI Discord
Presence (`findastra/ai-discord-presence`), whose galaxies it uses.

- The apps read nothing on the PC and send Discord only the card.
- The dates are reported, not final: write the date you read them and your source in the `EDITION` comment, and never
  call a reported date confirmed. Not financial advice: the card counts down; it never says to buy.
- The galaxies are Astra's approved art (2026-10-30), copied from `findastra/ai-discord-presence`, never redrawn here.
  The card loads its GIF from that repo's fixed address (`GALAXY_URL`). Never company logos.
- Add tests with every behaviour change (`node --test` in the app folder). Never commit `.local/`, credentials,
  caches or logs.
- New filenames use lowercase words and a date immediately before the extension. Required names and the galaxy files
  copied with their own names keep them.

Built with:
- Anthropic IPO Countdown, version 0.1.0: Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-15, at Astra's request.
  Choices recorded in [handoffs/001](handoffs/001-any-first-version-20261115.md).
