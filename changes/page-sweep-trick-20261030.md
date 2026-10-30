# The Farm's page-sweep trick, and what it taught the Flash Audit (2026-10-30)

Astra, 2026-10-30: "do an audit of every single one of the 84 pets ... the pet name, the pet program, and then a
screenshot of what the current program looks like ... colors ... what version of the pet program they're on", then
"make sure the farmer knows about these tricks or that some kind of version of them is covered in the flash audit".

- **`skills/page-sweep`**, a native trick of The Farm (`the-farm-v1.0-page-sweep-trick-v1.0`, a trick node in
  `system-map.json`): every pet program page side by side, from `main`, with a screenshot, the version, missing tool
  panels, the colours measured from the screenshot, and the live link, in one sheet keyed to the Flash Audit. It only
  reports. Recorded in `skills/new-pet-or-tool` (decision row), TOOLS-AND-TRICKS.md and the Farmer's row in
  INTELLIGENCE-LEVELS.md.
- **The Flash Audit** (`docs/flash-audit-20261014.md`) gains what that first sweep found, in the rows it belongs to
  (no new check, so no ID moves): audit `main` from a worktree, never the hub folder on an old branch (section 1, A17);
  the Page sweep as a run mode (section 2); a version that is not `MAJOR.MINOR.PATCH`, or only assigned by the hub
  (A07); a program page with no pet, apart from the spawner's `MOVED_PAGES` redirects (A59); 404s reported with their
  address (A10); palettes measured from a screenshot's pixels and compared across every page (A50).
- **AGENTS.md, Commands:** where git is on Astra's PC when it is missing from PATH (GitHub Desktop's copy).

Mistakes in the first sweep that these rules now prevent: it audited the hub folder while it was 778 commits behind
`main`, so it reported panels missing that `main` had; it called Discord Tower's redirect page a leftover; it read
colours from CSS tokens before measuring the screenshots.

By Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-30.
