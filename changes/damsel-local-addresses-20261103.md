# Discord Damsel's control addresses stay on the PC (2026-11-03)

`test/public-safety-test-20261014.mjs` failed on `main`: Discord Damsel's local Start and Stop controls (added
2026-10-30) had their four loopback addresses written into committed files, which GitHub Pages publishes.

- `apps/discord-damsel-presence-control-20261030.js` now reads every address from this PC's gitignored
  `apps/findastra-discord-presence-local-services-20261014.js`, the file docs/local-services-20261014.md already names
  for her page. It accepts only `http://127.0.0.1:<port>/` or `http://localhost:<port>/`; without the file, or without
  `discord-damsel-presence-control` in it, the buttons stay off and nothing is requested. The one-time code must name
  the same address as the list, as it had to match the written-in address before.
- `test/damsel-presence-control-test-20261030.mjs` uses made-up ports (40001 to 40004) and checks a missing list, a
  list that points elsewhere and a code for another address.
- `test/public-safety-test-20261014.mjs`: one narrow, documented allowance (`LOOPBACK_FIXTURES`): that test may name
  `127.0.0.1` on 400xx ports only. The secret checks are unchanged.
- The four real addresses are in the PC's local services list (two new keys: `ableton-live-discord-presence`,
  `discord-damsel-presence-control`).

Stacked on #284 (Ableton's card). Claude Opus 5.5 (`claude-opus-5-5`).
