# No special panels: a pet's own tools are tool boxes in L1

2026-11-02, Claude Opus 5.5 (`claude-opus-5-5`), branch `claude/no-special-panels-20261102` (the "Friendly Farmer"
chat), on top of `claude/show-pet-20261102` (#278).

Astra, 2026-11-02, answering the deck "The model page, redone", question 2 ("Special panels: at the top, or tool boxes
in L1?"): "All recommended", then "No special panels."

- Nothing sits between a page's header and its four levels any more. The five panels that did move into L1, under
  Native tools, as rounded tool boxes:
  - API Fairy: `key-requests` (its System Map tool, so it is listed once, not also as a pill).
  - Discord Damsel: `discord-damsel-presence-control` and `discord-damsel-dm-archive`.
  - Portfolio Puffer: `portfolio-puffer-social-row`, and Astra's Window Star, which works inside its own tool box like
    every tool with an `embed` (no `in_pill` needed on the map any more).
- `PET_BOXES` in the spawner replaces `PET_PANELS`; the code that drew an embedded tool as a panel is gone.
- PET-PROGRAM-FRAMEWORK.md section 3: "No special panels", replacing the 2026-10-24 rule that put them at the top.
- Tests: the key requests, DM archive, presence controls, Window Star and tool-sides tests check the new places;
  `test/model-pet-program-test-20261102.mjs` fails when any page has a panel above the levels.
- API Fairy's key request columns shrink on a small phone (360 px wide), so they still fit inside the tool box.
- Platform Platypus's fit-check: 19 of 19 screens for API Fairy, Discord Tower and Portfolio Puffer.
