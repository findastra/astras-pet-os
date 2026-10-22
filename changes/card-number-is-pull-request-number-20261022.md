# A card's number is its pull request's number (2026-10-22)

Astra, 2026-10-21, card 069, question 3 answered "A", then 2026-10-22: "carry Codex's hub #178 forward on a claude/
branch with main merged in (like #195 did for #177), then build question 3 (card number = pull request number) on it."

- **Codex's #178** (`codex/handoff-workflow-20261020`: the shared handoff skill with ownership, receipt and review,
  its routing in AGENTS.md and CLAUDE.md, card 064) is carried unchanged on `claude/handoff-workflow-merged-20261022`,
  with `main` merged in. The hub's `skills/handoff/SKILL.md` now matches the copy already installed for Claude and
  Codex, line endings aside.
- **Question 3:** a new card's number is the number of the pull request that adds it. The chat opens the pull
  request, then names the card; GitHub hands out the number, so nothing is reserved and `handoffs/README.md` gets no
  row. Its two tables keep the cards numbered before 2026-10-22, as they stood that day; the old counter's last card
  is 071 (#204's), and its last line is kept as #204 wrote it, so #204 merges without a conflict. Written in skills/handoff/SKILL.md, handoffs/README.md ("Card numbers") and the Handoffs line in AGENTS.md.
- `test/handoff-numbers-test-20261017.mjs` still fails on two cards with one number, and on an older card missing from
  the table. It now also fails on a new card that takes the old counter's next numbers, and needs no row for a card
  numbered by its pull request.
- Two cards already share 064: #178's (reaching `main` here) keeps it, and #179's merge-pass card becomes 179 when it
  merges.

By Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-22.
