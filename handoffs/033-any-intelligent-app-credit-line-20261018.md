---
status: open
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-18
needs: PET-FILES.md, AGENTS.md, skills/handoff/SKILL.md
---

## What I did

- Astra, 2026-10-18: the public credit line is now `*An Intelligent App, or Pet, by Astra.*`. Never say "pet app".
- On branch `claude/intelligent-app-credit-20261018` in astras-pet-os, changed the rule in `PET-FILES.md`,
  `AGENTS.md`, `README.md` and Flash Audit check A15 (`docs/flash-audit-20261014.md`), the visible credit in
  `cage.html`, `apps/github-goldfish-20261008.html`, `apps/platform-platypus-20261017.html` and
  `drafts/pole-puff/`, and the test fixture in `test/rounds-test-20261009.mjs`.
- The two checkers, the Farmer's round (`scripts/farmer-rounds-20261009.mjs`) and the Goldfish page copy in
  `apps/github-goldfish-20261008.html`, now ask for the new line but **still accept the old one**, so no pet is
  flagged while its repo switches over.
- Changed platform-platypus's README and `index.html` on its branch `claude/intelligent-app-credit-20261018`.
- `npm run check` passed (20 pet apps), and `npm test` passed (101 tests).
- Not touched: `status/pets-status.json` and the findings embedded in `apps/astras-pet-apps-20261008.html`
  (the Farmer's next round rewrites both), and the history in older handoff cards.

## Task

Change the credit line from `*A pet app by Astra.*` to `*An Intelligent App, or Pet, by Astra.*` near the top of
the README (and any visible page credit) in each repo below, one branch and pull request per repo:

vscode-angel, mommys-mommies, the-astral-plane, api-fairy, astras-gif-maker, fuzzboi-friend, raspberry-berry,
deck-duck, mine-mole, backup-beaver, mail-snail, patch-cat, rift-rabbit, rgbee, meme-fiend, mesh-moth,
wifi-butterfly, chat-rat, github-goldfish, unity-unicorn, health-hummy, finance-finch, portfolio-puffer,
project-parrot, voicemeeter-bug, drum-dog, claude-bot, the-threshold, pet-program-81.

In **github-goldfish**, also change its own README check to ask for the new line and accept both, as
astras-pet-os did.

## Done when

No public findastra README opens with "A pet app by Astra". Then remove the old-line fallback from both checkers.

## Return

List each repo's pull request here, set `status: done`, and commit.
