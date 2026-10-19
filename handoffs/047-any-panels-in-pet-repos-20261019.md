status: open
for: any (each pet's own chat for its repo; the hub items after the pull requests named below)
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-19
needs: PET-PROGRAM-FRAMEWORK.md (sections 1 and 3), PET-WORDS.md ("The pet program page"), skills/dev-mindset/SKILL.md
---
## What I did

Astra, 2026-10-19, asked whether a program page normally shows "panels or modules", and: "if it needs to be panel,
lets go ahead and make that change". It does: to developers a module is a file of code (every `.mjs` script in the hub
is one), and a bordered, collapsible box on a dashboard page is a panel. She also asked for a programmer word beside
every pet word, and a scan of the Markdown files and registries for system and concept words that had none.

On branch `claude/programmer-words-20261019` of astras-pet-os (not on `main`; the pull request is linked from this
card's commit), made in a worktree in Claude's scratchpad so the live hub folder stayed on `main`:
- **Panels, not modules:** PET-PROGRAM-FRAMEWORK.md (a **Panel** row in section 1, section 3, the checklist), the
  spawner (`scripts/pet-program-pages-20261018.mjs`: `PANELS`, `<pet>-L1-panel` to `<pet>-L4-panel`,
  `<details class="panel">`), its stylesheet and script, the 38 pages and the list it writes (rebuilt with the spawner
  itself), `test/pet-program-pages-test-20261018.mjs` (now fails if a page says `-module` again), README.md ("Run it"),
  docs/unity-unicorn-page-modules-20261018.md (contents only; the file keeps its name because links point at it),
  Flash Audit A18, and a decision row in `skills/dev-mindset`.
- **Programmer words:** PET-WORDS.md has a programmer-word column on every table, and new sections for the pet program
  page, system, security, community and process words, found by reading every top-level Markdown file, the skills, the
  framework and security docs, and counting farm and pet words across all 288 Markdown and JSON files.
- **Left as records, on purpose:** dated credit lines in AGENTS.md, decision rows in `skills/new-pet-or-tool`, and
  handoff cards say "module" because they record what was said that day.
- **Tests:** `npm test` 156 tests, 155 pass, 0 fail, 1 skipped (the Pets Board); `npm run check` OK.
- On Astra's PC: nothing changed. The live hub folder was only read and fetched.

## Task

1. **Unity Unicorn** (findastra/unity-unicorn, its own pull request): `unity-unicorn-20261008.html` labels its level
   boxes `unity-unicorn-L1-module` to `-L4-module` (found by GitHub code search). Rename them to `-L1-panel` to
   `-L4-panel`, with any class names, ids and docs that say module for a page box, then update the note at the top of
   the hub's docs/unity-unicorn-page-modules-20261018.md.
2. **Discord Damsel** (findastra/findastra-discord-presence): the Sticker Manager sits in her `discord-damsel-servers-module`.
   Rename it to `discord-damsel-servers-panel` there, then the hub's `system-map.json` job text for `sticker-manager`.
3. **Hub, after #106 and #104 merge** (both rebuild the System Map page, so changing it now would collide):
   `system-map.json` job texts for `pet-program-spawner` and `sticker-manager` still say "module"; change them and run
   `npm run build`.
4. **Any other pet page built to the framework:** search for `-module` and rename it the same way.
5. **Waiting on Astra:** `skills/dev-mindset` says "Home (cyberhome)" is the pet program (2026-10-16), while
   PET-PROGRAM-FRAMEWORK.md (2026-10-18) makes `<pet>-cyberhome` the box at the top left where the pet sits. PET-WORDS.md
   follows the framework. Astra says which; then fix the other.
6. Optional: give each part in pets.json `words` a `programmer` field, so the GitHub Goldfish can read the programmer
   words too, and extend `test/pet-words-test-20261009.mjs` to keep it in step with PET-WORDS.md.

## Done when

No pet page, hub doc or map card calls a page box a module, and the cyberhome question is answered.

## Return

Update `## What I did` with each repo, pull request and commit; set `status: done`; commit on a branch.
