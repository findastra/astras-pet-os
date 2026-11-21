# Raspberry Berry's name and its two Pi display tools (2026-11-20)

Astra, 2026-11-20: "take these tools ... and put them on the Raspberry Berry Pet Program. Also, the official names
should be Raspberry Berry, and Raspberry Pi Maker, everything else is wrong"; "put the features from the PDF on to the
other program and dump the PDF".

The PDF was a two-page build guide made in chat while she assembled a Raspberry Pi 4 on the back of the official 7"
Touch Display (v1), with heatsinks and a 2-wire fan under the clear case lid.

- **Names.** Pet #34 is **Raspberry Berry** and its program **Raspberry Pi Maker**. `pet-programs.json` (the name
  authority) and `pets.json` changed first, then RELATIONS.md, MOOD-KEY.md, INTELLIGENCE-LEVELS.md, PET-PROGRAMS.md,
  the desktop-art drafts and prompts, and every page `npm run build` writes. The page's panel labels follow the name
  (`raspberry-berry-...`). Dated records are history and keep the old name: docs/flash-audit-rounds, handoffs, dated
  docs, the 2026-10-13 amendment in ASTRAS_PET_OS.md. `status/pets-status.json` (and the farm page that embeds it) is
  the Farmer's last round and picks up the name on the next round.
- **`pi-display-guide-tool`** (`raspberry-pi-maker-v1.0-pi-display-guide-tool-v1.0`):
  `apps/raspberry-berry-pi-display-guide-20261120.html`. The build in five parts (fins, flat ribbon, wires, fan and lid,
  SD card and power), 14 steps with tick boxes kept in this browser, the troubleshooting table (solid green light = no
  working SD card) and the parts and official-doc links. Embedded wide on Raspberry Pi Maker's page, open.
- **`pi-pin-map-tool`** (`raspberry-pi-maker-v1.0-pi-pin-map-tool-v1.0`):
  `apps/raspberry-berry-pi-pin-map-20261120.html`. All 40 GPIO pins drawn, every pin with its own key line (Astra:
  "every pin should have a key"), the four used pins ringed: fan red 2, display red 4, display black 6, fan black 14.
  Embedded wide, starts closed.
- `apps/raspberry-berry-in-tool-20261120.js`: the same fit-the-box script Bass & Biscuits' tools use.
- Astra's photos of her build are not in the repo: the hub is public and they show her window view.
- They are tools, not tricks: pages with no AI deciding (TOOLS-AND-TRICKS.md).

Not here: the pet repo's own `pet.json` still says `"pet": "Raspberry Pi"` and its index.html "Raspberry Pi Berry".
Draft findastra/raspberry-berry#10 (the Pi stats screen) changes the same `pet.json`, so that rename waits for it
(card in handoffs/).

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-20.
