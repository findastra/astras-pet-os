# CLAUDE.md

> **Installing Astra's PetOS for someone? Stop here and follow [INSTALL.md](INSTALL.md).** The reading rules below are
> for changing Astra's PetOS itself, not for installing it.

**Before any work, read every file in AGENTS.md's "Before any work" list in full, including every
SKILL.md on every branch, and say in your first reply which ones you read. Never skim or skip them.**

Read [AGENTS.md](AGENTS.md) first. It applies to every assistant. Its first section points to
the canonical Astra's PetOS architecture (`ASTRAS_PET_OS` in files) and the migration plan; read both before larger work.

For Claude:

- For handoffs, resumed work and parallel edits, use [skills/handoff/SKILL.md](skills/handoff/SKILL.md) and the shared ownership/review rule in AGENTS.md. Preserve current assignments, use one writer per file and review the delivered revision before marking it done.
- Pet names are decided in `pet-programs.json` only (AGENTS.md, "One list of names"). Pet art is generated: prompts in `scripts/generate-pets.mjs`, then `npm run build` and `npm test`. Never edit generated files. `scripts/pets-art.mjs` is the retired hand-drawn system, kept as a record.
- After new art, look at `art/roster.png` before saying it is done. Redo approved art only with `--match` (PET-FILES.md).
- Do not push to `main` or create GitHub repos without Astra's OK. Her OK comes in chat; then merge it yourself
  (approval, not clicks; Astra, 2026-10-18).
- The Cage is gone (Astra, 2026-10-18): never bring back `cage.html`, `cage-data.js`, the Farmer dock or browser roaming (see AGENTS.md).
- Record each substantial change, with your model name and version, in its own new file in `changes/` (AGENTS.md, "Changes are recorded in `changes/`"), never as a new line in AGENTS.md.

## Complete top-level Markdown reading (Astra, 2026-10-18)

Before work, OpenAI Codex and Anthropic Claude read every top-level `.md` file in this repo and the target pet repo in full, in addition to the existing skill and handoff requirements. Enumerate files and finish truncated reads. The shared provider skill is [pet-app](skills/pet-app/SKILL.md). OpenAI Codex (GPT-6), 2026-10-18.
