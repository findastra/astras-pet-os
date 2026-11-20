# Every button on The Farm checked (2026-11-12)

Astra, 2026-11-12, on The Farm's page: "I need you to make sure all these buttons work on the page, like they open the
link or close it and etc."

What was checked, on The Farm's page from `main`:
- The Farm's click-check (`npm run click-check`) clicked 508 buttons and links: every light, fold arrow, link, More
  details, the chat's open and close, the notes tool and the backlog export all work. It could not reach 13 buttons
  inside the chat's Ask tab (two clicks deep).
- Those 13 were tried by hand on a copy served on another port (its own browser storage, so Astra's lights, notes and
  chat were not touched): the three quick questions answer, Needs you and Ask switch, every Who answers choice selects,
  a note goes to the backlog, My Claude and My ChatGPT build the right new-tab address (no tab was opened), Start over
  clears, Escape and × close. Push for review shows only after the seated AI has changed something, so it was not tried.
- The 46 Run buttons reach the Flash Audit helper on this PC (it answers, idle); Run itself was not pressed (it checks
  every pet program again for about 20 minutes).
- The 11 program lights all reach Inference Iguana's program-watch: 10 can open their program, Node.js says why it
  cannot. No program was opened.

What was fixed:
- `apps/pet-programs/pet-program-page-20261018.js`: while the pet chat helper is still looking at what is on this PC,
  Who answers says "checking…" (it said "not on this PC" for Claude Code and Codex for about a second); your Who answers
  pick stays when the chat is closed and opened again (it went back to the first ready seat); each chat tab names the
  view it shows (`aria-controls`). Every pet program page shares this script.
- `scripts/click-check-20261019.mjs`: the second pass clicks what opens a hidden button, and what opens that, up to three
  deep, so the chat's Ask buttons are clicked from now on. A file outside the repo that only a click reads (the pet
  chat helper's address, read when the chat opens) is data kept on this PC, not a dead end, the same as one read when
  the page opens.

Not here: More details on the unified footer, which Astra also asked to remove, went from every pet page in hub #332
(Spoonfed's page), merged 2026-11-12 (0fed1c36).

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-12.
