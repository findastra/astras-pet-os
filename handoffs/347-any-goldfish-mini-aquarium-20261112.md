status: done (merged with Astra's OK in chat, 2026-11-12)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-11-12
needs: pull request #347; GitHub Goldfish branch `claude/achievements-20261017` (its PR waits on Astra's review)
---
## Task
Astra, 2026-11-11, on the GitHub Aquarium: its look is the template for the cyberhome, much smaller, and every pet
program will have one. For now: "make a little mini version of the cyber home in that top left square that fits in
that panel." Later: "the tool that is the GitHub Goldfish Cyberhome with the buttons on it, that one is going to be the
Cyberhome ... give it like a cute little antenna" (her drawing: `docs/images/pet-program-page-sketch-20261018.webp`).
2026-11-12: "get rid of all the weird details on it ... an antenna on a walkie-talkie almost ... buttons on the left
side and then the antenna on the right because it would match the other tools."

## Ownership and state
State: DONE
Implementer: Claude Code session (GitHub Goldfish chat); writable files: the files below; ownership: released
Reviewer: unassigned; next action: none; Astra said "Yes, merge #347" on 2026-11-12

## What I did
- Branch `claude/goldfish-mini-aquarium-20261111`, pull request #347. Main merged in at `e3652851`; this card is in
  the next commit.
- `scripts/pet-program-pages-20261018.mjs`: a `CYBERHOMES` table (only `github-goldfish` so far).
  - A pet listed there gets a drawn cyberhome. Its cyberhome tool's ON/OFF light is on.
  - The page loads that pet's own stylesheet.
- `apps/pet-programs/cyberhome-aquarium-20261111.css`:
  - A plain pink case, with the lights inside the top edge on the left and a walkie-talkie antenna on the right.
  - The Aquarium tank inside, with the Goldfish at its desktop size.
- `system-map.json`: five GitHub Aquarium tools.
  - Three are built (on Goldfish main).
  - Two are planned: achievement-tracker and findastra-readme-auditor, still on unmerged Goldfish branches.
- Tests:
  - New `test/cyberhome-aquarium-test-20261111.mjs`.
  - Updated the pet-program-pages and cyberhome-chat tests.
- `npm test` in a worktree: 416 pass, 6 fail, 6 skipped. All 6 fail on clean `origin/main` the same way on this PC
  (Windows farm-setup "from scratch" and pet-chat-helper).
- Looked at in the browser pane from 127.0.0.1: desktop 180×167, and 375 px 159×141 with no sideways scroll.

## Not done
- Other pets' drawn cyberhomes: each new pet gets its own entry in `CYBERHOMES` plus its own CSS file.
- When Goldfish's achievement tracker (and the README auditor) merge, set their `system-map.json` nodes to `now`.
- Many open PRs also edit the spawner and `system-map.json` (listed in #347). Merge main in and rebuild after them.

## Done when
Astra merges #347, and the merged Goldfish page shows the pink case with its antenna in the top-left square.

## Return
Merged by Claude Opus 5.5 with Astra's OK in chat ("Yes, merge #347"), 2026-11-12, after main was merged in and rebuilt.
