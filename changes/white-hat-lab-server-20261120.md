# White Hat Lab's server: the port watch, with a Quit of its own (2026-11-20)

Astra, 2026-11-20, the third rename under the Flash Audit's check A72, "Its own server" (one server per pet, named
after its pet program, then `-server-` and the date, and written once in `pets.json`): "Yes, White Hat Lab".

- **`scripts/white-hat-lab-server-20261120.mjs`:** White Hat Weasel's port watch, renamed from
  `scripts/port-watch-20261119.mjs`. It is one of the hub's own scripts: the hub carries White Hat Lab's tools (it is
  public and every farm gets it; the `white-hat-lab` repo is private), so its path in `pets.json` is inside the hub.
  Its lock is named after it.
- **Its own Quit:** while it looks every 10 minutes, his menu in Startup Star ends with **Quit the port watch**
  (`--quit`). Quit stops only the process in its lock that runs this server, never a program that got the same process
  number later, and writes his menu again without Quit, so the star shows **Start White Hat Weasel** first.
- **`pets.json`:** White Hat Lab's entry gets `"server": "scripts/white-hat-lab-server-20261120.mjs"`.
- **Startup Star** (`scripts/desktop-pets-20261011.cs`): White Hat Weasel's entry takes that path from `pets.json`
  through `BackgroundPets.ServerIn`, and tells its command line apart by that file name. The self-test checks it.
- **Tests:** `test/port-watch-test-20261119.mjs` checks the Quit; `test/pet-servers-test-20261120.mjs` checks the
  renames so far.

On her PC, after merging: stop the old port watch (it has no Quit of its own), then quit, rebuild and restart the star.

Next: Wonderland Launchpad (the White Hat Weasel reads `server` from `pets.json` first), Log Den's three together and
Audio Rescue; then Discord Tower's and The Farm's joins.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-20.
