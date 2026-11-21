# Flash Audit sheet: wrong and repeated parts taken out

2026-11-20. Astra asked for a fresh read of `docs/flash-audit-20261014.md` and then: "Yes, fix the page". No check
was added, removed or renumbered, and no row's dot or title changed, so The Farm's tool box and the build are the same.

Fixed:
- The security link pointed to `security-boundaries-20261014.md`, which was never in the hub. It now points to
  `docs/security-model-20261018.md`.
- The preflight script's path now says it is in the `github-goldfish` repo.
- The stale source snapshot (`04cb641`) and the old Codex branch note are replaced by "record the commit you audit".
- The old pets page: "preserve compatibility files" is replaced by "gone for good (#96, #353)".
- A36 and section 6 said the maintenance light is on the left. Per A20 and A48, it is the right light of the pair.
- A43 tested a "cosmetic blink", but A03 says nothing blinks.
- Section 5 listed Play with and Care for as "tutorial tools". They are L2 tricks (A37, A67).
- Section 6 now says what is built (The Farm's tool box with Run), not just Goldfish's preflight.
- Answer 8 in the 2026-11-03 table now points to A47 for the current list.

Removed as repeated or replaced:
- Two of the three copies of Astra's 2026-11-12 quote. It stays once, at the top of "6. The page".
- Two empty sections ("Rows moved into the matrix").
- The separate Clicker Training section. What it said that A41 did not (no generic bubble, desktop and 390px, after
  every rebuild) is now in A41.
- The tutorial paragraph inside "Name suggestions" (already in A36, A37, A39).
- The 2026-10-15 notes at the end, which later decisions had replaced. They are in git history.

Left for #372, which fixes it on its own branch: A57, where a rename sweep on 2026-10-25 turned the banned old names
into today's names.

Claude Opus 5.5 (`claude-opus-5-5`).
