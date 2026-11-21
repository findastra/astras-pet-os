# The Flash Audit's Run: how long it takes, and the top line's date

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-09, for Astra (#318, card 318).

Astra: "Yes, fix them". The first real Run from The Farm, served on her PC, took 19 minutes while the check said
"This takes a few minutes", and after it the tool box's top line still named the older run's date.

- **How long**: `RUN_MINUTES` (20) in `scripts/flash-audit-checks-20261108.mjs`. The tool box's top line says Run
  takes about 20 minutes, and the Run message says so too and that the page can be closed while the run goes on. The
  page gets the number as `data-flash-run-minutes` (`scripts/pet-program-pages-20261018.mjs`).
- **The date**: the top line's date sits in a `data-flash-run-shown` span, and `apps/flash-audit-control-20261108.js`
  changes it together with the checks when a newer run on this PC comes in.
- `test/flash-audit-test-20261108.mjs` checks both.
