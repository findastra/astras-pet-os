---
status: done 2026-10-18 (all 29 pull requests merged)
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

**Done, checked overnight 2026-10-18 by Claude Opus 5.5 (`claude-opus-5-5`):** all 29 pull requests in the table below are merged (2026-10-18, 10:21 to 10:27 UTC).

## Task

Change the credit line from `*A pet app by Astra.*` to `*An Intelligent App, or Pet, by Astra.*` near the top of
the README (and any visible page credit) in each repo below, one branch and pull request per repo:

vscode-angel, mommys-mommies, the-astral-plane, api-fairy, astras-gif-maker, fuzzboi-friend, raspberry-berry,
deck-duck, mine-mole, backup-beaver, mail-snail, patch-cat, rift-rabbit, rgbee, meme-fiend, mesh-moth,
wifi-butterfly, chat-rat, github-goldfish, unity-unicorn, health-hummy, finance-finch, portfolio-puffer,
project-parrot, voicemeeter-bug, drum-dog, claude-bot, the-threshold, pet-program-81.

In **github-goldfish**, also change its own README check to ask for the new line and accept both, as
astras-pet-os did.

## Taken by Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-18

In the Idle Flash Audit chat. 26 of the 29 repos already had an Idle Flash Audit fix PR (branch
`claude/flash-audit-fixes-20261017`), so the new line went into that PR instead of a second one: README, AGENTS.md
and visible page credits, plus "<pet> is a pet app by Astra" sentences. Art prompts and provenance notes keep their
wording (history). github-goldfish, the-threshold and pet-program-81 have their own PRs on
`claude/intelligent-app-credit-20261018`; github-goldfish's README check asks for the new line and still accepts the
old one, with a test for both (60 of 60 pass). Checked after the push: no fix branch's README says "A pet app by Astra".

| Repo | Pull request |
| --- | --- |
| vscode-angel | [vscode-angel#2](https://github.com/findastra/vscode-angel/pull/2) |
| mommys-mommies | [mommys-mommies#2](https://github.com/findastra/mommys-mommies/pull/2) |
| the-astral-plane | [the-astral-plane#3](https://github.com/findastra/the-astral-plane/pull/3) |
| api-fairy | [api-fairy#1](https://github.com/findastra/api-fairy/pull/1) |
| astras-gif-maker | [astras-gif-maker#1](https://github.com/findastra/astras-gif-maker/pull/1) |
| fuzzboi-friend | [fuzzboi-friend#2](https://github.com/findastra/fuzzboi-friend/pull/2) |
| raspberry-berry | [raspberry-berry#3](https://github.com/findastra/raspberry-berry/pull/3) |
| deck-duck | [deck-duck#2](https://github.com/findastra/deck-duck/pull/2) |
| mine-mole | [mine-mole#2](https://github.com/findastra/mine-mole/pull/2) |
| backup-beaver | [backup-beaver#2](https://github.com/findastra/backup-beaver/pull/2) |
| mail-snail | [mail-snail#2](https://github.com/findastra/mail-snail/pull/2) |
| patch-cat | [patch-cat#2](https://github.com/findastra/patch-cat/pull/2) |
| rift-rabbit | [rift-rabbit#2](https://github.com/findastra/rift-rabbit/pull/2) |
| rgbee | [rgbee#2](https://github.com/findastra/rgbee/pull/2) |
| meme-fiend | [meme-fiend#2](https://github.com/findastra/meme-fiend/pull/2) |
| mesh-moth | [mesh-moth#2](https://github.com/findastra/mesh-moth/pull/2) |
| wifi-butterfly | [wifi-butterfly#2](https://github.com/findastra/wifi-butterfly/pull/2) |
| chat-rat | [chat-rat#5](https://github.com/findastra/chat-rat/pull/5) |
| github-goldfish | [github-goldfish#17](https://github.com/findastra/github-goldfish/pull/17) |
| unity-unicorn | [unity-unicorn#4](https://github.com/findastra/unity-unicorn/pull/4) |
| health-hummy | [health-hummy#2](https://github.com/findastra/health-hummy/pull/2) |
| finance-finch | [finance-finch#2](https://github.com/findastra/finance-finch/pull/2) |
| portfolio-puffer | [portfolio-puffer#2](https://github.com/findastra/portfolio-puffer/pull/2) |
| project-parrot | [project-parrot#2](https://github.com/findastra/project-parrot/pull/2) |
| voicemeeter-bug | [voicemeeter-bug#1](https://github.com/findastra/voicemeeter-bug/pull/1) |
| drum-dog | [drum-dog#2](https://github.com/findastra/drum-dog/pull/2) |
| claude-bot | [claude-bot#1](https://github.com/findastra/claude-bot/pull/1) |
| the-threshold | [the-threshold#1](https://github.com/findastra/the-threshold/pull/1) |
| pet-program-81 | [pet-program-81#1](https://github.com/findastra/pet-program-81/pull/1) |

Still to do when they are merged: remove the old-line fallback from both checkers, then set this card to done.

## Done when

No public findastra README opens with "A pet app by Astra". Then remove the old-line fallback from both checkers.

## Return

List each repo's pull request here, set `status: done`, and commit.
