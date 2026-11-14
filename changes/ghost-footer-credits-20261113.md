# Ghost Protocol's footer: one line inside the unified footer (2026-11-13)

Astra, 2026-11-13: "in the ghost protocol footer, the Built for Astra by Claude · open-sourced on GitHub, Reset my
progress, v1.0 · put that in the unified footer below the other stuff", then, after seeing it: "i only want 1 line below
the astra stuff, it should be the Open-sourced on GitHub [dot] v0.1.0 // 20261013".

- `apps/ghost-protocol-20261008.html` (the hub's copy of the page; findastra/ghost-protocol#16 makes the same change): the page's own footer above the unified footer box is gone. Inside the box, under
  By Astra ✦ photostar ✦ Find Out More, one line reads "Open-sourced on GitHub · v0.1.0 // 20261013"; GitHub links to
  the repo as before (`footer-gh-link`).
- Gone with the old footer: "Built for Astra by Claude", the Reset my progress button and "v1.0". The Reset button was
  the only way to open the "Wipe local progress?" box; that box and its script stay, unused, and the script line that
  looked for the button now checks first, so the page's script never stops there.
- The hidden bug pixel (the Bug Bounty easter egg) stays, just after the date, out of the text flow so it never wraps
  the line.
- Checked in the browser pane on the working copy: one line at desktop width and on a 375 px phone, no sideways scroll,
  no console errors.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-13.
