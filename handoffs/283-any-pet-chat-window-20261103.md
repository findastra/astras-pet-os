status: the window is #283; the helper is #285 (card 285); both wait for Astra's merge OK, after #276, #278 and #279
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-11-03, the "Friendly Farmer" chat
needs: cards 279 and 061 (the pet chat in the page, on `claude/pet-chat-in-page-20261020`, #172), card 054 (task 4)
---
## Task

Astra, 2026-11-02: the `<pet>-chat` window "is not right"; it should be Data Chip on Data Dealer, "this concept
combined with that". 2026-11-03, on card 061's four questions: "I guess recommended", with Claude Code answering first,
then Codex, "unless dictated otherwise"; other people's farms find their own agents or let them choose; "the agents
are supposed to be able to change stuff, read the plan."

## What I did

- The chat window on every pet program page and the Model Pet Program: the pet's face, name and seat; a Needs you tab
  from the page's own data, each item linking to its panel; an Ask tab with bubbles and quick answers; Who answers
  folded below, Claude Code first. Until the helper exists, a seat message waits in the backlog and the pet says so.
- Her answers are recorded in card 061 (on #172) and card 054. The list of changes: `changes/pet-chat-window-20261103.md`.
- `npm test` in an LF checkout: 364 pass, 2 fail, the same two as on `main`. The 14 chat tests pass. Headless Edge
  screenshots at 1280×900 and 390×844.

## Next: the pet chat helper (Astra, 2026-11-03: "Yes, build it"; built in #285, card 285)

It lets an agent change files from a page, so L4 approves it first.

1. A small program on this PC, 127.0.0.1 only, started at Windows sign-in through `explorer.exe`, with a Stop pet chat
   entry in Startup Star's menu. It accepts only the farm's own pages (the per-PC secret in `Astra's PetOS Data`,
   card 061's notes) and only chat messages; it never runs anything a page sends.
2. It finds which agents are installed: Claude Code first, then Codex, then any other the farm lists; the page shows
   what it found, and the person can choose. Another farm sets its own order.
3. It seats the chosen agent in the pet's own folder, with the plan (`AGENTS.md`, `ASTRAS_PET_OS.md`) and the pet's
   `pet.json`, and streams the reply into the window. Supervised (ASTRAS_PET_OS 8.3): changes on a branch, a question in
   the chat before anything bigger, nothing on `main`; private pets (Health Hummy, Finance Finch) read nothing.
4. Claude Code outside the Claude app needs Astra's own sign-in once; have the sign-in window ready (global rule).
   Her Max plan is for her own use only, never behind a shared bot or proxy.
5. The port stays out of the hub's public files (`docs/local-services-20261014.md`, the privacy test).

## Done when

1. After Astra's OK, #276, #278, #279 and #283 merge in that order (each retargeted to `main` first).
2. With her separate OK, the helper is built, checked on her PC, and a seat message gets a real answer.

## Receipt and review

Pending.
