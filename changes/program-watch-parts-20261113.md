# The pages learn USB devices from the watch (2026-11-13)

Astra, 2026-11-13: Inference Iguana's Benchmark Rock is separate from anything to do with Drum Dog or Unity Unicorn;
"Yes, move those"; "All recommended (A)": each pet owns its part, and Benchmark Rock's watch runs it.

- `USB_DEVICES` is gone from `scripts/pet-program-pages-20261018.mjs`: which devices are USB is Drum Dog's to say
  (drum-dog's `program-watch-parts-20261113.json`). A device light's tip is "green while SteamVR has it on, or while it
  is plugged in" until the watch's file says `"how": "usb"`; then the page marks it USB and says "plugged in"
  (`pet-program-page-20261018.js`).
- `pets.json`: Benchmark Rock no longer needs the web browser (Drum Dog already does). `system-map.json`: the
  program-watch to web-browser link says Drum Dog lists it.
- Pages rebuilt; `test/pet-program-pages-test-20261018.mjs` checks the hub keeps no USB list and the page learns it.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-13.
