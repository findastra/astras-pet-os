# Spoonfed's usage box in its control hub

Astra, 2026-11-21: "can you please track how many users and stats on this in the Contol Hub, whatever is normal. this
is just for finances." Her deck answers: "All recommended": counted by Spoonfed's own spots server, dollars as the
server's count × Google's prices, a warning at $25 a month, shown on Spoonfed's control hub on her PC only.

- `system-map.json`: the tool `spoonfed-usage-tool` of Spoonfed (`spoonfed-app`), a wide pill in L1 that holds
  `apps/spoonfed-usage-20261121.html`.
- `apps/spoonfed-usage-20261121.html`: reads only `Documents\Astra's PetOS Data\spoonfed\spoonfed-usage-page-data.js`,
  written on her PC by Spoonfed's `corepack pnpm usage` (findastra/spoonfed#30). It shows this month's estimated Google
  cost (orange past $25), people, presses, Google searches, pieces answered free from the server, photos, and a table
  by day. Anywhere else it says the numbers are private.
- Built with `npm run build`. `npm test`: the same five failures as `main` has today (pet-app skill, developer words,
  installer, key rule, app menu), none from this change.

By Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-21.
