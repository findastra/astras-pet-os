# Wonderland Launchpad's server, named once in pets.json (2026-11-21)

Astra, 2026-11-21, the fourth rename under the Flash Audit's check A72, "Its own server" (one server per pet, named
after its pet program, then `-server-` and the date it was updated, and written once in `pets.json`): "Yes, Wonderland".

- **`pets.json`:** Rift Rabbit's entry gets `"server": "wonderland-launchpad-server-20261121.exe"`, the launcher behind
  the Launch buttons, built by findastra/rift-rabbit's pull request for the same change (it was
  `rift-rabbit-20261024.exe`). It is a plain file name: the launcher is installed in, and runs from,
  `Documents\Astra's PetOS Data\rift-rabbit\program`.
- **Startup Star** (`scripts/desktop-pets-20261011.cs`): Rift Rabbit's entry starts that program from its program folder
  through `BackgroundPets.ServerIn`. A farm whose `pets.json` has no line for it starts the launcher's old name there.
  The self-test checks it.
- **The White Hat Weasel** (`scripts/white-hat-lab-server-20261120.mjs`) knows our own servers by the names in
  `pets.json` first, so a server renamed later needs no change to his list, and he may close one wherever it runs from.
- **The Launch buttons** (`apps/pet-programs/vrchat-launcher-20261024.js`): when the launcher does not answer, they say
  to start it from Startup Star's menu instead of naming its file.
- **Tests:** `test/pet-servers-test-20261120.mjs` and `test/port-watch-test-20261119.mjs`.

Next: Log Den's three together and Audio Rescue; then Discord Tower's and The Farm's joins.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-21.
