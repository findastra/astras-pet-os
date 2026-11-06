# Deck Pond: the Stream Deck + on its page · 2026-11-02

Astra, 2026-11-02: "i pluggef my elgato in" and "create the program then. Use Farmers guide and the model program Rift
Rabbit/Wonderland Launchpad", then "I want to see the elgato on here the same way I see the MIDI controller on Drum Dog."

## What changed

- New hub page `apps/deck-duck-stream-deck-plus-deck-20261102.html`, the tool **use-my-stream-deck-tool**
  (`deck-pond-v1.0-use-my-stream-deck-tool-v1.0`), inside its own rounded tool box on Deck Pond's page (`in_pill`), the
  way Bass & Biscuits shows use-my-apc64-tool:
  - The Stream Deck +'s face: 8 keys, the touch strip in its four dial sections, and the 4 dials. The panel geometry
    is Elgato's (800 x 480 px panel; keys 120 px at x 13 + 219n, y 12 + 160n; strip 800 x 100 at y 380), from Elgato's
    dimensioned HID drawings as transcribed in the MIT library `@elgato-stream-deck/core` 7.8.0. 1 px = 0.135 mm (the
    strip is 108 mm, Elgato's spec). The dials are where that library measured them on Elgato's simulator. The body is
    140 mm wide (Elgato's spec); its top and bottom margins are estimated, not measured.
  - Tap any control to label it and give it a colour, per profile (named like the Stream Deck app's profiles). Labels
    stay in this browser (`use-my-stream-deck-tool-labels-20261102`, schema 1).
  - **Use my Stream Deck** hears the real deck through WebHID (Edge): keys light while held, dial needles turn, pushes
    light up and strip taps, holds and swipes show where they were. It only reads input and the firmware string; it
    never writes to the deck, so the Stream Deck app keeps its pictures and actions.
- `system-map.json`: the tool; the device **Elgato Stream Deck +** (USB 0FD9:0084, plugged in 2026-11-02); the Stream
  Deck app is now installed (7.6.0.23012, winget, 2026-11-02); Deck Duck manages both; the tool runs on the browser.
- `pets.json`: Deck Duck needs the web browser; the Stream Deck app is optional and installed.
- `scripts/pet-program-pages-20261018.mjs`: embedded tool frames may be `square` as well as `wide`, and both iframes
  allow `hid` beside `midi` and `autoplay`, so a tool page can hear a USB device. CSS: `.tool-frame.square`.
- Regenerated: Deck Pond's, Bass & Biscuits' and Iced Out Iceberg's pages (the iframe `allow` line), the System Map,
  TOOLS-AND-TRICKS.md and the markdown pets.

## Not done

- Reading the Stream Deck app's own profiles from the PC (so labels fill in by themselves) is not built.
- Showing the real key pictures on the page is not built (the deck sends no pictures back).

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-02.
