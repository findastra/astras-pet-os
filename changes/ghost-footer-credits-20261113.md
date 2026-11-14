# Ghost Protocol's own footer moves inside the unified footer (2026-11-13)

Astra, 2026-11-13: "in the ghost protocol footer, the Built for Astra by Claude · open-sourced on GitHub, Reset my
progress, v1.0 · put that in the unified footer below the other stuff."

- `apps/ghost-protocol-20261008.html` (the hub's copy of the page; findastra/ghost-protocol gets the same change): the page's own footer (the credit line with its GitHub link, the Reset my progress button, and
  v1.0 with the hidden bug) now sits inside the unified footer box, under By Astra ✦ photostar ✦ Find Out More, centered
  like the rest of the box. The separate footer above the box is gone.
- The ids stay (`footer-gh-link`, `reset-btn`, `hidden-bug`), so the Reset confirm box and the hidden bug work as before.
- Checked in the browser pane on the working copy, at desktop width and on a 375 px phone (no sideways scroll); Reset
  opens its confirm box.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-13.
