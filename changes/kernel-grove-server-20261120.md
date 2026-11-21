# Kernel Grove's server, named once in pets.json (2026-11-20)

Astra, 2026-11-20, the second rename under the Flash Audit's check A72, "Its own server" (one server per pet, named
after its pet program, then `-server-` and the date, and written once in `pets.json`): "Yes, Kernel Grove".

- **`pets.json`:** Kernel Grove's entry gets `"server": "bin/kernel-grove-server-20261120.exe"`, built by
  findastra/kernel-grove's pull request for the same change (the same program as its window, built a second time under
  its server's name).
- **Startup Star** (`scripts/desktop-pets-20261011.cs`): Kernel Koala's entry starts that program through
  `BackgroundPets.ServerIn`, the way Inference Iguana's does since #408. It still starts only when Astra asks. A farm
  whose `pets.json` has no line for it starts the window program, which keeps watch the same way. The self-test checks
  both servers the same way now.
- **`test/pet-servers-test-20261120.mjs`:** checks the renames so far.

Next: White Hat Lab's port watch, then Wonderland Launchpad (the White Hat Weasel reads `server` from `pets.json`
first), Log Den's three together and Audio Rescue; then Discord Tower's and The Farm's joins.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-20.
