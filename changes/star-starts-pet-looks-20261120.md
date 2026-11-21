# Startup Star starts PC Master's server and Flowsheet Flamingo's look (2026-11-20)

Astra, 2026-11-20, asked why The Pilot Plant and PC Master Race looked every 10 minutes. Her answers: The Pilot Plant
looks once at sign-in and in the weekly audit ("its an engineer pet it doesnt maintain anything"); PC Master Race gets
its own server, weekly plus every 10 minutes only while its page is open ("Yes, change it"). Those programs merged as
the-pilot-plant#2 and pc-master-race#3 (hub #409 and #417); both were still started by hand. Now the star starts them.

- **PC Master's server:** `"server": "pc-master-race-server-20261120.mjs"` in its pets.json entry (the one-server-per-pet
  rule, Flash Audit A72). Startup Star (`scripts/desktop-pets-20261011.cs`) runs it with node from
  `Astra's PetOS\pc-master-race` at sign-in, finds it by its file name (read from pets.json, never written in the star),
  and takes it over after a hub update like the other helpers. Without the `server` line it is not started.
- **Flowsheet Flamingo's look:** a run-once job, not a server, so it has no `server` line. It is on the star's
  `AlsoAtSignIn` list like the other helpers, started with `the-pilot-plant-20261112.mjs --look` from
  `Astra's PetOS\the-pilot-plant` (a clone that stays; Temp copies are emptied by Windows), and is on a new `RunOnce`
  list: never taken over, and its menu says "Flowsheet Flamingo looks once at sign-in" with **Look again**.
- **Tests:** the star's self-test checks both entries (path from pets.json, node, `--look`, takeover or not, the menu);
  `test/pet-servers-test-20261120.mjs` checks the `server` line and that The Pilot Plant has none.
- **After the merge:** rebuild the star on the PC (`build-desktop-pets-20261011.ps1`, bin is gitignored).

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-20.
