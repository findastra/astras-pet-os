# CLAUDE.md

**Before any work, read every file in AGENTS.md's "Before any work" list in full, including every
SKILL.md on every branch, and say in your first reply which ones you read. Never skim or skip them.**

Read [AGENTS.md](AGENTS.md) first. It applies to every assistant. Its first section points to
the canonical Astra's PetOS architecture (`ASTRAS_PET_OS` in files) and the migration plan; read both before larger work.

For Claude:

- Pet names are decided in `pet-programs.json` only (AGENTS.md, "One list of names"). Pet art is generated: prompts in `scripts/generate-pets.mjs`, then `npm run build` and `npm test`. Never edit generated files. `scripts/pets-art.mjs` is the retired hand-drawn system, kept as a record.
- After new art, look at `art/roster.png` before saying it is done. Redo approved art only with `--match` (PET-FILES.md).
- Do not push to `main` or create GitHub repos without Astra's OK. Her OK comes in chat; then merge it yourself
  (approval, not clicks; Astra, 2026-10-18).
- No new Cage or browser-roaming features: the Cage is retired as a product concept (see AGENTS.md).
- Record your model name and version in AGENTS.md when you change something substantial (currently: Claude Opus 5.5, 2026-10-11).

## Complete top-level Markdown reading (Astra, 2026-10-18)

Before work, OpenAI Codex and Anthropic Claude read every top-level `.md` file in this repo and the target pet repo in full, in addition to the existing skill and handoff requirements. Enumerate files and finish truncated reads. The shared provider skill is [pet-app](skills/pet-app/SKILL.md). OpenAI Codex (GPT-6), 2026-10-18.
