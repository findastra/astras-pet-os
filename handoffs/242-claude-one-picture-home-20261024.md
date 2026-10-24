status: open (#242 merged with Astra's OK, 2026-10-24, as 239a307; waiting on Astra: OK to merge #244 next, then the 24 PRs after it)
for: claude
from: Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-24
needs: docs/one-art-source-20261017.md ("Addresses that never change"), scripts/one-picture-home-20261024.mjs, scripts/one-art-source-20261017.mjs, findastra/startup-star scripts/live-sync-20261017.ps1
---
## What I did

Astra, 2026-10-24: every pet picture should have one hosted spot that anything can update, so she never updates them
one by one or falls versions behind. She answered the six questions all recommended (the "One home for pet pictures"
deck). The answers and the address scheme are in docs/one-art-source-20261017.md.

**The scheme:** `https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/latest/<folder>/<name without its
date>`, made by `npm run build` (981 pictures). The checker reads Correct on all 106 repos with the PR branches below.

## Merge order (each needs Astra's OK)

1. **astras-pet-os #242** (merged 2026-10-24, 239a307): `art/latest`, the link tool, the checker (private hub, dated links, `--save`, the text
   cache), the outstanding-items rows, the hub's own links, docs and tests (340 pass, 0 fail).
2. **astras-pet-os #244** (retargeted to `main` and rebuilt on it, 2026-10-24): the desktop pets read the
   pictures-only copy while the hub folder is held back. After merging, the star is rebuilt and Astra restarts it.
3. **startup-star #7**: live sync keeps the pictures-only copy and starts the daily picture check.
4. **The copies**: findastra.github.io #12 (61 pictures), the-astral-plane #13 (19), vscode-angel #11 (19),
   lunas-log #6 (1). spoonfed's spoon logo and fuzzboi-factory's project art are not pet pictures: the checker now
   says so (#242).
5. **The dated links (114 in 19 repos)**: wifi-butterfly #7, project-parrot #8, chat-rat #11, ghost-protocol #8,
   fuzzboi-friend #6, data-dealer #12, voicemeeter-bug #11, mail-snail #8, mesh-moth #7, raspberry-berry #7, rgbee #8,
   backup-beaver #6, meme-fiend #7, patch-cat #8, mine-mole #8, evidence-locker #12, packet-river #12, log-den #12,
   spoonfed #8. The other 15 repos with hub links only link undated frames, which already never change.

Every PR in 2 to 5 needed `art/latest` on main: it is there since #242 (2026-10-24).
