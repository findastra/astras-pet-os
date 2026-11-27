# White Hat Lab: the hub's fixes from Flash Audit round 67 (2026-11-27)

Astra, 2026-11-27, after round 67: "Yes, fix them". The mechanical findings in the hub; the repo's own (README,
pet.json, SECURITY.md) are in a white-hat-lab pull request, and the ones that need her decision wait on a deck.

- **A57:** White Hat Weasel's Startup Star menu says "Quit White Hat Lab's server" (was "Quit the port watch"): it
  stops both watches. `scripts/white-hat-lab-server-20261120.mjs`, its test.
- **A54:** two third-party programs White Hat Lab runs are on the lists: REA (MCP server, its reverse-engineer-anything
  skill) and tplinkrouterc6u (the Python library the guest reader signs in with). System Map nodes and links,
  `needs.programs` in pets.json, and White Hat Weasel's row in INTELLIGENCE-LEVELS.md, which it never had.
- **A28:** two grants written for what White Hat Lab's server already does with her OK: `white-hat-weasel-look` (R:
  ports and the router's guest list) and `white-hat-weasel-stop` (X: our own servers, on her click). Status
  `written`: nothing enforces them. Merging is her L4 OK for the record.
- **A20:** the colour comment in the page script now matches the key: orange report issues, yellow update. Whether a
  planned 3rd party program or device should be grey instead of orange is on her deck: greying them all would also
  grey devices she owns that a pet only plans to look after (Rift Rabbit's Quest Pro).
- **A41:** a pet with no desktop pet (no registered frames and no desktop draft; checked against Startup Star's own
  list) shows its clicks as planned: "once <pet> is on the desktop". 14 pets, White Hat Weasel among them.
- **A48:** a device's light names SteamVR only for the System Map's VR devices; the others say "green while it is
  plugged in".
- Rebuilt with `npm run build`.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-27.
