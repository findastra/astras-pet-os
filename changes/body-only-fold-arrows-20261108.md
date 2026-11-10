# Fold arrows only on the main body panels

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-08, for Astra.

Astra: "there's some drop down arrows in every panel that it needs to be on only like the main body panels, not the top
ones or the bottom ones, and definitely not the unified footer." Her deck answers ("All recommended"): every pet
program page and the Model Pet Program; the bottom ones are the friends list and the unified footer; More details stays.

- `scripts/pet-program-pages-20261018.mjs`: `panel()` takes `fold: false`. L3's note (the editorial status panel), the
  cyberhome, the quick summary, the System Map box, the friends list and the unified footer are made with it: always
  open, marked `data-stays-open`, no "Click the label to fold" tip, the label no tab stop. They stay `<details>` boxes,
  so they look exactly as before.
- `apps/pet-programs/pet-program-page-20261018.css`: no arrow after their labels, and a plain pointer over them.
- `apps/pet-programs/pet-program-page-20261018.js`: a click on their label does nothing, and anything that closes one
  opens it again.
- Every page rebuilt (`npm run build`); the intelligence levels (L1 to L4 inside), R W X, session notes, emotions and
  clicker training panels keep their fold arrows.
- `test/pet-program-pages-test-20261018.mjs`: a test that exactly those six stay open on every page and the body
  panels fold. `PET-PROGRAM-FRAMEWORK.md`, section 3: the rule.

Checks: in the browser pane, on the Farmer's page and the Model Pet Program (served from this branch on 127.0.0.1),
the six have no arrow and stay open when their label is clicked; every body panel shows its arrow and folds.

#298 merged first (More details out of the three top boxes, their arrows hidden with CSS): main merged in, main's
generated pages taken, the spawner's three top boxes kept as #298 left them with `fold: false` added, rebuilt and
tested again.
