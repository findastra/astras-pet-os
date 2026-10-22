# Portfolio Puffer: the social row styles (2026-10-22)

Astra, 2026-10-22: "can we see all these on the portfolio puffer pet program?" (the six styles of the "Profile Social
Row" canvas for the links at the top of her GitHub profile).

- Portfolio Puffer's pet program page has a **social-row tool panel** showing all six styles as live previews on
  GitHub's dark column, every color a gradient: 1 Sunset sweep, 2 Handles only, 3 Sparkle line, 4 Neon pills,
  5 Icon stack, 6 Full spectrum. Style 5 is marked **on your profile**; the others say **preview only**.
- Styles, links and the live style: `scripts/social-row-preview-20261022.mjs` (`LIVE_STYLE`, `BUILT`). The panel is
  wired through `PET_PANELS` in `scripts/pet-program-pages-20261018.mjs`; the page is rebuilt by `npm run build`.
- The README itself is still changed by GitHub Goldfish's tool (`github-goldfish/scripts/social-row-20261017.mjs
  --style N`), which draws only style 5 so far. Not done: drawing styles 1-4 and 6 as README pictures, and an on/off
  switch on this panel that runs the tool.
- Checked: rendered at 1280 px and 390 px (no sideways scroll on a phone; each preview scrolls inside its own box).

Claude Opus 5.5 (`claude-opus-5-5`).
