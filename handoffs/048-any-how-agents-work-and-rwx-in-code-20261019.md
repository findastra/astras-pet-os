status: open (waiting on Astra: merge this pull request; the R W X panel waits on #104, whose chat fixes its conflict first)
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
- 2026-10-19, later: merged `main` into this branch twice (after #105, then after #109, #110, #111 and #114), keeping
  both sides of every appended line; aligned `PET-WORDS.md` with AGENTS.md (task 1); bots are native programs of
  Fairy Ring (#114's words). `npm test`: 171 tests, 170 pass, 1 skipped.
- Nothing on the System Map changed: PR #104 (L1 to L4 with R W X on every card) is open with conflicts, and PR #106
  (tools on the map) is open too, so map work waits for them.

## Task
1. **Done 2026-10-19** (#111 merged): `PET-WORDS.md` rows "L3 Agentic harness", "the seat" and "agentic harness"
   follow AGENTS.md (pet harness and provider harness, any farmhand in the seat); new rows "provider harness", "bot"
   and "bot panel"; "harness skill" belongs to the provider harness in the seat.
2. **The R W X panel, option C (Astra, 2026-10-19).** Astra: "I think we need a W R X what it should be, then some
   kind of easy indicator of whether that is reflected in the current code." She chose option C, then: "I think this
   actually needs to be its own panel in each pet program." Build it **after #104 merges**: #104 gives every grant
   its levels (#110 and #111, which rewrote the spawner, merged 2026-10-19).
   - **Data** (`system-map.json`): each status gets its mark: enforced **In code**, written **Rule only**, planned
     **Not built**. Every enforced grant gets `evidence`, a test or script file or a setting: `owner`, a setting (her
     own accounts); `seat-asks`, a setting (Claude Code's permission modes, Codex's approvals and sandbox);
     `farmer-round`, `test/farmer-rounds-pr-test-20261017.mjs`. The generator refuses an enforced grant without
     evidence, an evidence file that is missing, or evidence on a grant that is not enforced; a test checks the same.
   - **Its own panel on every pet program page** (the spawner), working name `<pet>-rwx-panel` until Astra names it:
     four rows, L1 to L4, each with **Should be: R W X** and **In code: In code / Rule only / Not built**. A row
     opens to the grants behind it and each In code's proof; a row is only as sure as its weakest grant. The grant
     tables move out of the L4 panel into it (the L4 panel keeps approvals, keys, maintenance and the passport).
     PET-PROGRAM-FRAMEWORK.md section 3 and its checklist list the panel.
   - **The System Map card's level rows** (from #104) use the same words and marks, so the page and the map agree.
   - **PROTECTION-RINGS.md** names each proof in the grants table; its intro, `skills/farm-security` section 1 and the
     dev-mindset row "Enforced, written only, planned" say In code, Rule only and Not built.
3. **Role Fairy's bots on the map**, as **native programs** of Fairy Ring (each runs on its own; since #114 the map
   draws only programs, and tools are listed on cards), with planned grants: read the channels Astra authorizes, post
   replies, change only the roles it created. After role-fairy#4 merges.

## Decisions
- **Option C** (Astra, 2026-10-19): what each level should be (R W X), then whether that is in code (In code, Rule
  only, Not built), with evidence for every In code.
- **Its own panel in each pet program** (Astra, 2026-10-19), not only the map card.

## Done when
This pull request is merged, PET-WORDS.md agrees with AGENTS.md, and every pet program page has the R W X panel, with
the same marks on the System Map cards.

## Return
Update `## What I did`, set `status: done`, commit on a branch.
