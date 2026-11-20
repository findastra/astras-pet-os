# Ghost Protocol's footer line: after the GitHub icon, below it when narrow (2026-11-13)

Astra, 2026-11-13: "in the ghost protocol footer, the Built for Astra by Claude · open-sourced on GitHub, Reset my
progress, v1.0 · put that in the unified footer below the other stuff", then, after seeing it: "i only want 1 line below
the astra stuff, it should be the Open-sourced on GitHub [dot] v0.1.0 // 20261013", and then: "by default I actually
want it to be after the github cat icon link (separate with dot) but when you shrink it, the whole line goes below", and: "make the footer have all sparkle separators (2 need changed)".

- `apps/ghost-protocol-20261008.html` (the hub's copy of the page; findastra/ghost-protocol#16 makes the same change): the page's own footer above the unified footer box is gone. In the box, "Open-sourced on GitHub ·
  v0.1.0 // 20261013" sits right after the GitHub icon, in the same row as By Astra ✦ photostar ✦ Find Out More, with a
  sparkle between, and a second sparkle between GitHub and v0.1.0: every separator in the footer is now the same green ✦.
  When the box is too narrow for it, the whole line moves below, centered and without its leading sparkle; it never
  breaks in the middle. A small script after the footer decides that (`.wrapped`); on a phone the page's own phone
  layout puts it under the icon. GitHub links to the repo as before (`footer-gh-link`).
- Gone with the old footer: "Built for Astra by Claude", the Reset my progress button and "v1.0". The Reset button was
  the only way to open the "Wipe local progress?" box; that box and its script stay, unused, and the script line that
  looked for the button now checks first, so the page's script never stops there.
- The hidden bug pixel (the Bug Bounty easter egg) stays, just after the date, out of the text flow so it never wraps
  the line.
- Checked in the browser pane on the working copy: one row at 1124, 880 and 780 px; with the box squeezed to 560 px the
  line moves below without its leading sparkle and comes back when it is wide again; under the icon on a 375 px phone; no sideways
  scroll, no console errors.
- The star between the footer's sparkles is a picture, never a link (Astra, 2026-11-13, in the Spoonfed chat: "also the
  star shouldnt be a link. ever."); its focus outline rule is gone. The hub's other pages get this in their own pull request.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-13.
