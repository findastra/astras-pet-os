# The pet-finder / pet-organizer loop is broken, and the skills name Codex's new folder

2026-11-12. Astra answered Luna's Log's skill-files deck "all recommended" (lunas-log card 011): the safe fixes are made
on branches she merges, Codex's skills are installed in `~/.agents/skills` (Codex's current folder; `~/.codex/skills`
is kept by Codex only for now), and every skill is installed from its master by Luna's Log's `skill-install-tool`.

- `skills/pet-finder/SKILL.md` and `skills/pet-organizer/SKILL.md`: each one ran the other as a step, so a chat
  following them could go round. pet-finder now runs pet-organizer once and skips that when pet-organizer started it;
  pet-organizer tells pet-finder it started it.
- `skills/handoff`, `skills/pet-app`, `skills/show-pet-panel` and `TOOLS-AND-TRICKS.md`: Codex's copies are at
  `%USERPROFILE%/.agents/skills/<name>/`, installed by the skill-install-tool, never by hand.

On 2026-11-12 the skill-install-tool installed the 13 hub skills for Claude and Codex from main (8 had never been
installed). After this merges it reinstalls the 5 changed ones; its `check` shows any copy that drifted.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-12.
