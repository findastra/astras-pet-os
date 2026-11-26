# Log Den's three servers, named once in pets.json (2026-11-26)

Astra, 2026-11-26, the fifth rename under the Flash Audit's check A72, "Its own server" (one server per pet, named
after its pet program, then `-server-` and the date it was updated, and written once in `pets.json`): "Log Den
renames".

- **`pets.json`:** Log Den's entry gets `"server": "bin/log-den-server-20261126.exe"`, Packet River's
  `"server": "bin/packet-river-server-20261126.exe"` and Evidence Locker's
  `"server": "bin/evidence-locker-server-20261126.exe"`, built by findastra/log-den#17, findastra/packet-river#18 and
  findastra/evidence-locker#17. They were `<repo>-20261018.exe`.
- **Startup Star** (`scripts/desktop-pets-20261011.cs`): the three crash-watch entries start and run each pet's server
  from its repo's `bin` folder through `BackgroundPets.ServerIn`. Log Den's server still runs Packet Piranha's and
  Forensic Ferret's watches (Astra, 2026-11-08), so their Start runs Log Den's server with `--startup`. A farm whose
  `pets.json` has no line for them starts the old names. The self-test checks the three names and folders.
- **Tests:** `test/pet-servers-test-20261120.mjs` (the three names, the one loop that starts them, the two watches
  still inside Log Den's server).
- The A72 sheet and card 372: rows 5 to 7 open.

Next: Audio Rescue; then Discord Tower's and The Farm's joins.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-26.
