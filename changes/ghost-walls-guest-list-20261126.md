# The guest list on White Hat Lab's page (2026-11-26)

Astra, 2026-11-26: "Yes, add it" (the Ghost In The Walls guest list on White Hat Lab's page).

- **`apps/white-hat-lab-ghost-walls-20261126.html` + `.js`:** the ghost-in-the-walls-tool box now shows who got onto
  the guest network: how many are on now, in the last day and in all, then every device (name, private address, band,
  visits, first and last seen), newest first. It reads only the page data the watch writes on her PC
  (`ghost-walls-page-data-20261126.js`); anywhere else it says the list is private. textContent only; it sends nothing.
  Black with white borders, like the page.
- **`system-map.json`:** the tool's `embed`, `frame` and `cadence`.
- **Tool boxes too tall (fix):** White Hat Lab's three tool pages (port check, port watch, guest list) told their box
  the frame's own height, so a box could grow but never shrink (port check was 4606px for 1228px of content). They now
  tell the content's height, like the Model Pet Program's example tool.
- Tests: two more in `test/ghost-walls-test-20261126.mjs`.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-26.
