# Program buttons: #313 joined with #298, USB device lights, the web browser (2026-11-12)

Astra, 2026-11-12, on Bass & Biscuits' page: "audit this page for the buttons that are working and not working and fix
them. You know, they should open programs or close them." Then, of this pull request and benchmark-rock#11: "Finish
#11 + #313".

- **Joined with main.** #298 (merged 2026-11-08) and this pull request built the same buttons twice. This one is kept:
  the page asks program-watch itself with the watch's code (`link` in `programs-page-data.js`), and the old sender
  `apps/program-lights-control-20261106.js` with its `pet-program-switch` event is removed. main's other changes to
  `pet-program-page-20261018.js` (the panels that stay open, #301) and the generator are kept; the pages are rebuilt.
- **Desk USB devices** (`USB_DEVICES` in `scripts/pet-program-pages-20261018.mjs`, `data-usb` on the light): the Akai
  APC64 and the Razer Seiren V3 Chroma are green while Windows has them plugged in, and their bubble says so. They were
  always red, because only SteamVR's devices were looked at. Benchmark Rock's `UsbDevices` reports them.
- **The web browser** is program-watch's again (a `system-map.json` link and Benchmark Rock's `needs`): red opens
  Brave, green closes the browser like its X.
- A native light's tip is main's wording (Astra, 2026-11-08, answer 2: A), not "kill switch".
- Tests: `test/pet-program-pages-test-20261018.mjs` checks the program, website and USB device tips; `npm test` 431 of
  438 pass on Windows. The one failure (the from-scratch farm install, Windows) fails on main too.

Goes with findastra/benchmark-rock#11. Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-12.
