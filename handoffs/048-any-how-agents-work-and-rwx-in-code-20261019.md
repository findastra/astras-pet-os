status: open (waiting on Astra: merge this pull request; which "in code" mark the System Map shows, A, B or C)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-19
needs: AGENTS.md ("How the agents work"), skills/dev-mindset, skills/new-pet-or-tool, PROTECTION-RINGS.md, system-map.json (`access`), scripts/system-map-template-20261012.html, PR #104, PR #106, PR #111
---
## What I did
Astra, 2026-10-19, after weighing OpenClaw (a third-party agent harness a friend uses for his Discord bot): "its
supposed to be so that any agent can sit in the program and it becomes L3 ... please note how all of these agents
work and update the AGENTS sheet." The hub's words had mixed the two kinds of harness up: the glossary called Claude
Code and Codex "the agentic harness", while L3 is each pet program's own harness.

- Branch `claude/how-agents-work-20261019` from `origin/main` at `81a41df`, in a worktree in Claude's scratch folder;
  Astra's hub folder on the PC was not touched.
- `AGENTS.md`: new section **How the agents work: farmhands, harnesses and seats (Astra, 2026-10-19)**: farmhand,
  provider harness (Claude Code, Codex, OpenClaw: made by others, a ring around its farmhand), pet harness (L3: each
  pet program's own, any farmhand can sit in it; not built yet) and the seat; then every agent Astra uses (Claude
  Code, Claude Code Channels, Codex, ChatGPT, local farmhands, OpenClaw, Role Fairy's Discord bots) with who it takes
  orders from, where it runs, what actually stops it and who pays; three rules (ask who it takes orders from; the Max
  plan only for Astra's own use in Anthropic's apps; limits hold only where code enforces them). Credit line.
- `skills/dev-mindset`: the "Agentic harness / the seat" row now means the pet's own L3 harness; new rows Provider
  harness, Bot (a Discord bot) and Bot panel.
- `skills/new-pet-or-tool`: decision row, help bots and bot panels belong to Role Fairy (Fairy Ring).
- `findastra/role-fairy` PR #4 (branch `claude/help-bots-and-panels-20261019`): README "Bots and bot panels"
  (Mommy's Helper Bot, `mommys-help-bot-panel`; Press Plai's help bot), pet.json job and `cage.submit`, its card 001.
- This card, its row and the next free number (049) in `handoffs/README.md`; card 047's row copied from PR #111 so the
  number table is complete on this branch.
- Tests: `npm test` in the worktree (result in the pull request).
- Nothing on the System Map changed: PR #104 (L1 to L4 with R W X on every card) is open with conflicts, and PR #106
  (tools on the map) is open too, so map work waits for them.

## Task
1. **After PR #111 merges:** its new `PET-WORDS.md` rows "agentic harness" ("the program that gives a model tools ...
   (Claude Code, Codex)") and "the seat" ("through Claude Code or Codex") follow AGENTS.md: pet harness vs provider
   harness, any farmhand in the seat.
2. **After PR #104 merges, and Astra picks one:** the System Map's mark for whether each level's R W X is reflected in
   the code. Astra, 2026-10-19: "I think we need a W R X what it should be, then some kind of easy indicator of
   whether that is reflected in the current code." The data already holds both: each grant's R W X is the design and
   its status says whether code enforces it. Options shown to her in chat:
   - **A** as PR #104 has it: R W X boxes and a status chip (Enforced, Written only, Planned).
   - **B** the letters show it: a solid letter is enforced in code, an outlined one is a rule only, a dashed one is not
     built.
   - **C** (recommended) two parts on every level row: **Should be: R W X** and **In code: ✓ yes / rule only / not
     built**. An enforced grant also names its **evidence** (the test, setting or script that enforces it, a new
     `evidence` field in `system-map.json`), and `npm test` fails when that file is missing, so "in code" is never
     claimed without proof.
   Change the map's look only as she picks (her System Map design decisions are in card 034).
3. **After PR #106 merges:** Role Fairy's bots as tools of Fairy Ring on the map, each with planned grants: read the
   channels Astra authorizes, post replies, change only the roles it created.

## Done when
This pull request is merged, PET-WORDS.md agrees with AGENTS.md, and the map shows the mark Astra picked.

## Return
Update `## What I did`, set `status: done`, commit on a branch.
