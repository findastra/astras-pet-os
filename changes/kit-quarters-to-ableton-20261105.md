# Four kits at once, dragged onto the board, loaded on the real APC64 through Ableton

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-05, for Astra.

Astra, on Bass & Biscuits: "I want to be able to do 4 at a time, so make a feature of the Drum Dog for me to drag it to
the main board, then it loads it immediately on the irl one", and, asked which way: "Through Ableton".

- `apps/drum-dog-apc64-deck-20261102.html` (preview-my-apc64-tool): every 4x4 quarter of the 8x8 plays its own kit,
  each in its own colours, with every pad named. Dragging a kit over the board outlines the quarter under it; dropping
  puts the kit there and sends it to Ableton. "Use my APC64" (Web MIDI, which the Claude browser pane refuses) is now
  **Load on my APC64**, which sends all four kits again, for when Ableton has been closed.
- `apps/drum-dog-apc64-drum-kits-20261102.html` (apc64-drum-kit-tool): a kit's name (with a ⠿ grip) is the handle to
  drag it.
- `apps/drum-dog-drum-sounds-20261102.js`: `quarters()` / `setQuarter()` keep which kit is on which quarter (a quarter
  nothing was dropped on plays the current kit). `renderPad()` makes a pad's sound offline as a WAV (16-bit mono,
  44.1 kHz, full strength), from the same voices the page plays, with a fixed "random" so the same kit always makes the
  same files.
- `apps/drum-dog-ableton-20261105/drum_dog/__init__.py`: the Drum Dog add-on, a control surface script for Ableton Live
  (`drum_dog` and `__init__.py` are the names Ableton needs). It listens on this PC only (port 38771) and takes
  kits only from Bass & Biscuits' page (this PC, or findastra.github.io). It keeps each kit's sounds once in the User
  Library (`Samples/Drum Dog/<kit>-<hash>`), makes a "Drum Dog" track with Astra's Velocity settings (Drive 0.65,
  Out Low 50) and a Drum Rack the first time, and loads the 16 sounds into the quarter's pads, each pad named after its
  sound and coloured like the kit. It runs next to Akai's APC64 script (Input and Output None), so the pads stay Akai's.
- `apps/drum-dog-ableton-20261105/install-drum-dog-in-ableton-20261105.ps1`: copies the add-on into Ableton's User
  Library (`Remote Scripts/drum_dog`).

Checks: with a stand-in for Ableton (fake Live objects, the add-on unchanged), dropping Hyperpop on the top-right quarter
in the pane outlined that quarter, lit it in party colours and loaded 16 WAVs into pads 84-99 named and coloured; Load
on my APC64 sent all four; sending the same kits twice made no second copy. Not checked yet, on her PC: which notes
the APC64's four quarters send in Drum mode (the add-on assumes Live's 64-pad layout: bottom-left 36, bottom-right 52,
top-left 68, top-right 84), whether Live's browser loads a sample onto the selected pad, and whether the APC64 lights
its pads in the pads' colours. A real mouse drag between the two tool boxes could not be done from the pane.
