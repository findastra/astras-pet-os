# One file per change (2026-10-21)

Astra, 2026-10-21, card 069, all four questions answered "A" ("I am okay with it", then "All recommended for
shared-lines questions 2 to 4"): every pull request was adding a dated paragraph to the end of AGENTS.md, so any two
open at once collided there (63 of last week's 153 fix-up merges in the hub).

- Each change now has its own file in this folder, `changes/<topic>-YYYYMMDD.md`. AGENTS.md's "Built with" line, its
  "Changes are recorded in `changes/`" rule, CLAUDE.md and PET-FILES.md say so.
- The older lines moved word for word into [history-20261007-20261021.md](history-20261007-20261021.md): 70 credit
  lines and the chat-order note. The newest three stay at the end of AGENTS.md until the pull requests still open
  that add a line there have merged; a follow-up moves them here.
- `test/changes-folder-test-20261021.mjs` fails on a credit line in AGENTS.md dated after 2026-10-21 and on a file
  here that is not named the house way or does not say who made the change and when.
- New pet repos get the same rule from the Idle Flash Audit's AGENTS.md and CLAUDE.md
  (`scripts/idle-flash-fix-20261017.mjs`, `scripts/idle-flash-refresh-20261018.mjs`,
  `scripts/idle-flash-new-repos-20261017.mjs`). Other pet repos switch with their next pull request.
- Not in this change: question 3 (a card's number is its pull request's number) waits on Codex's #178, which rewrites
  the same handoff skill.

By Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-21.
