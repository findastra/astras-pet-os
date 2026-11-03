# learn-apc64-tool on Bass & Biscuits · 2026-11-02

Astra, 2026-11-02: "Can you design a lesson plan to teach me how to use these drums, and put the instructions on Bass &
Biscuits? Tool can be called learn-apc64-tool". The drums are her Akai APC64, played in Ableton Live.

- `system-map.json`: new native tool `learn-apc64-tool` of Drum Dog (Bass & Biscuits), label
  `bass-biscuits-v1.0-learn-apc64-tool-v1.0`, opening `learn-apc64-tool-20261102.html` in findastra/drum-dog. It is a
  tool because the page is code with no AI deciding (TOOLS-AND-TRICKS.md), like Unity Stable's `learn-add-ons`.
- Rebuilt with `npm run build`: Bass & Biscuits' page gets its first L1 tool box, and the registry table in
  TOOLS-AND-TRICKS.md gets the row.
- The lesson page itself is in findastra/drum-dog#9; merge that first so the link works.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-02.

## Second tool, same day: apc64-deck-guide

Astra, 2026-11-02: "an exact copy of the surface of it as a tool on the drum dog so that we can, like, label stuff on
there for me to look at so it's easier for me to find... deck guide, APC64-deck-something". `system-map.json` gets a
second native tool of Drum Dog, `apc64-deck-guide` (label `bass-biscuits-v1.0-apc64-deck-guide-v1.0`). It opens
`apc64-deck-guide-20261102.html` in findastra/drum-dog#9: the APC64's top surface drawn to scale. You can click any
control to see what it does and add your own label. Claude Opus 5.5 (`claude-opus-5-5`).

## The deck on the page, with sound; programs and colours (same day)

Astra: "build that right on the base and biscuit... get rid of anything extraneous... I don't want to see a lot of
words... let's try to get me making sound at least"; "make sure to get all these 3rd party softwares in the Bass &
Biscuits. Need a different color theme for bass & biscuits too."

- `apps/drum-dog-apc64-deck-20261102.html`: the APC64 deck at its measured geometry, with few words.
  - Tapping a pad plays a drum, made in the browser with Web Audio. Every 4×4 corner of the grid plays the kit.
  - Tapping a control gives one short line about it, and you can add your own label.
  - "Use my APC64" hears the real pads through Web MIDI, with no Ableton needed.
- The page builder can embed a wide tool (`frame: "wide"`, `.tool-frame.wide`), and every embed may ask for MIDI
  (`allow="midi; autoplay"`). `apc64-deck-guide` is embedded on Bass & Biscuits' page.
- The map lists Bass & Biscuits' programs and device:
  - Ableton Live, now installed (Live 12 Trial).
  - New: the Ableton USB Audio Driver and the Akai APC64 (device).
  - Links to Voicemeeter (where its sound goes) and to the web browser.
- Bass & Biscuits' own colours: a midnight studio (deep indigo, electric-blue lines, neon cyan links). Every other page
  keeps its own.
