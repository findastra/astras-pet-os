# Audio Rescue's server, named once in pets.json (2026-11-27)

Astra, 2026-11-27, the sixth rename under the Flash Audit's check A72, "Its own server" (one server per pet, named after
its pet program, then `-server-` and the date it was updated, and written once in `pets.json`): "Yes, Audio Rescue".

- **`pets.json`:** Voicemeeter Bug's entry gets `"server": "audio-rescue-server-20261127.exe"`, the Bug's program, built
  by findastra/voicemeeter-bug#16 (it was `voicemeeter-bug-20261008.exe`). It is a plain
  file name: the Bug runs from his folder, `Documents\ChatGPT\Voicemeeter Bug`.
- **Startup Star** (`scripts/desktop-pets-20261011.cs`): `PetFiles.BugExe` takes the program from `pets.json` through
  `BackgroundPets.ServerIn`, so his start at sign-in (`--hosted`), his menu and his three-click repair all run the
  server. A farm whose `pets.json` has no line for it starts the old name. The self-test checks it, and its leftover
  test uses the server's name.
- **His page** (`apps/voicemeeter-bug-20261008.html`): the program's place names the server.
- **Tests:** `test/pet-servers-test-20261120.mjs`.
- The A72 sheet and card 372: row 8 open, and rows 5 to 7 switched on her PC.

Next: Discord Tower's join (its three presences in one server), then The Farm's.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-27.
