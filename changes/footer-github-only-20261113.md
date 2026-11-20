# The unified footer keeps only the GitHub link (2026-11-13)

Astra, 2026-11-13: "on the unified footer, remove all of the social media links except for the GitHub one."

The footer reads By Astra, a sparkle, her photostar, a sparkle, Find Out More, then the GitHub icon
(https://github.com/findastra). Mommy's Discord, VR TikTok, Pole Dance TikTok and VRChat Instagram are gone. The
spacing and the order are unchanged.

- `scripts/pet-program-pages-20261018.mjs`: `FOOTER_LINKS`, the master list every pet program page is built from, holds only `GitHub: Astra`; the Discord, TikTok and Instagram icons are gone from the spawner. `npm run build` rewrote the 56 pet program pages and the Model Pet Program page.
- `apps/pet-programs/pet-program-page-20261018.css`: on a phone the icon row was a five-column grid, which would have pushed the one icon off to the left. `repeat(auto-fit, ...)` folds the empty columns away, so the GitHub icon stays centered under By Astra ✦ star ✦ Find Out More.
- `apps/ghost-protocol-20261008.html`: its own copy of the footer, the same change.
- `PET-PROGRAM-FRAMEWORK.md` section 3, item 9 says Find Out More holds only her GitHub. `test/farm-owner-upstream-test-20261020.mjs` no longer needs its VR TikTok exception.
- Not changed: Portfolio Puffer's social-row panel (the styles of the social links on her GitHub profile README). That is the profile, not the footer.

The same change went to every repo with the footer: astras-pet-os (the master), findastra.github.io, lunas-log,
vscode-angel, api-fairy, platform-platypus, ghost-protocol, unity-unicorn, ai-discord-presence and
ableton-live-discord-presence, one pull request each; Spoonfed's copy is in findastra/spoonfed#12.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-13.
