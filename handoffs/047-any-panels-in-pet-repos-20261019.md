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

**Tasks 1 and 2, the pet repos** (Claude Opus 5.5, `claude-opus-5-5`, a session started from the one above,
2026-10-19). Each in a fresh clone in Claude's scratchpad, on branch `claude/panels-20261019`, one pull request each,
not merged (Astra gives her OK per pull request in chat):

| Repo | Pull request | Commits | Tests |
|---|---|---|---|
| findastra/unity-unicorn | [#11](https://github.com/findastra/unity-unicorn/pull/11) | `87e1ba3` (rename), `b7bc25a` (test cut by string search, for CodeQL's `js/bad-tag-filter`) | `node --test test/*.mjs` 18: 17 pass, 1 skipped (local seed); Python 50 OK |
| findastra/findastra-discord-presence | [#20](https://github.com/findastra/findastra-discord-presence/pull/20) | `1d0464a` | `node --test` 120: 119 pass, 0 fail, 1 skipped (the hub cross-check, which passes with `ASTRAS_PET_OS` set) |

- **Unity Unicorn (page 0.4.2):**
  - Labels: `unity-unicorn-L1-panel` to `-L4-panel`.
  - Page names: `#uu-panels` (was `#uu-modules`), `details.uu-panel` (was `uu-mod`), and "Add to the L1 panel".
  - Saved lights: lights saved on the old `-module` labels carry over. The browser storage key keeps its name, so nothing saved is lost.
  - New test `test/panels-test-20261019.mjs`.
  - Docs: pet.json, README, an AGENTS.md credit line, and a dated note on Codex's open card 002 saying `uu-modules` is now `uu-panels`.
  - Kept as modules: face tracking modules, masonry mesh modules and Python imports are real modules.
  - Hub: the note at the top of docs/unity-unicorn-page-modules-20261018.md now points at #11 (this commit).
- **Discord Damsel:**
  - Sticker Manager plugin 1.0.1: its box is `discord-damsel-servers-panel` (`PANEL`, `fieldset.ddsm-panel`).
    `pet.json`'s `"module"` field is now `"panel"`; nothing in the hub reads it.
  - Her README and the plugin's README say panel. The README screenshot was retaken from the test page (`?demo`, headless Edge); only the label changed.
  - Her page's L2 box is `discord-damsel-L2-panel` in `<details class="panel">`. I renamed it as task 4 for this repo: it is the same kind of box on the same page.
  - Tests: a new sticker test checks the panel name in the plugin, pet.json and the page.
  - **Damsel's `main` was failing 2 tests:** since her PR #19 the page sets `style.cssText`, and the connection test's pretend element had none. #20 gives the pretend element a `style` object.
  - Codex's #10, #11 and #12 (the page rewrite) replace the page; whichever merges later keeps the panel names.
- **Left as written:** dated credit lines in both AGENTS.md files, `pet.json` `built_with`, and Damsel's cards 005 and 006.
- **Not done here:** the hub's `system-map.json` job text for `sticker-manager` (the end of task 2) waits with task 3 for #106 and #104.
- **Search for task 4:** GitHub code search for `L1-module`, `L2-module` and `servers-module` finds only Unity Unicorn's `main` page, and it missed Damsel's L2 box. The index lags, so check each framework pet's repo by hand.
- On Astra's PC: nothing changed (her pet folders are on Codex branches). Headless Edge ran from the scratchpad.

**Task 4, every other framework pet page** (Claude Opus 5.5, `claude-opus-5-5`, a session started from the one above,
2026-10-19). Every pet repo in pet-programs.json (83, plus the hub) and the three candidates with repos
(astras-infinite-pole, piranesi-house, fuzzbois) was cloned into Claude's scratchpad with `core.autocrlf=false`, and
every branch of each was searched for `-L1-module` to `-L4-module`, `servers-module`, `class="…module`, `.module{`,
"this module", "framework modules" and `-module"`, then every file for the word itself. Four repos still called a page
box a module; each has its own pull request on `claude/panels-20261019`, not merged (Astra gives her OK per pull request
in chat):

| Repo | Pull request | Commit | What it said | Tests |
|---|---|---|---|---|
| findastra/log-den | [#4](https://github.com/findastra/log-den/pull/4) | `4900ff3` | `log-lynx-L1-module` to `-L4-module`, `<details class="module">`, `.module` styles | `node --test` 6 pass; `--self-test` 38 pass |
| findastra/packet-river | [#4](https://github.com/findastra/packet-river/pull/4) | `b547751` | `packet-piranha-L1-module` to `-L4-module`, the same classes | `node --test` 6 pass; `--self-test` 20 pass |
| findastra/evidence-locker | [#4](https://github.com/findastra/evidence-locker/pull/4) | `e248fe3` | `forensic-ferret-L1-module` to `-L4-module`, the same classes | `node --test` 6 pass; `--self-test` 22 pass |
| findastra/workflow-whirlpool (private) | [#1](https://github.com/findastra/workflow-whirlpool/pull/1), into `codex/workflow-whale-20261018`, its default and only branch | `1cfb2fa` | `class="panel module"` on its nine boxes, `.module>summary` styles | `node --test test-panels-20261019.mjs` 4 pass |

- **The crash-watch pages** (Log Den, Packet River, Evidence Locker) were built on 2026-10-18 from the spawner's old
  shape: now `<details class="panel …">`, `<pet>-L1-panel` to `-L4-panel`, `live-panel`, and "fold or unfold this
  panel". Their version stays 0.1.0, because the C# program writes it into the page's data and did not change.
- **Workflow Whirlpool:** `details.panel` replaces the `module` class; its visible labels never said module. Headless
  Edge screenshots before and after are identical. Its source download zip was rebuilt with its own
  `build-downloads-20261016.py` (filename audit passed); the iPad zip did not change. `test-host-20261016.mjs` was not
  run: it needs the PC companion running and captures the real screen. The hosted Sites page changes only when it is
  published again.
- **Saved lights:** on all four pages they are saved by item or tool (`program:`, `tool:`, `connection:`,
  `ipad-workflow-caster-off`), never by a box's name, under the same storage keys, so nothing saved is lost. Each new
  test checks it; the crash-watch tests load the page's own script with lights saved before the rename.
- **Each repo:** a test that fails if a page box is called a module again (it fails on the old page), a credit line in
  AGENTS.md, and in the crash-watch repos the page test in the README and `pet.json` `updated` and `built_with`.
- **Already panels, nothing to change:** Unity Unicorn and Discord Damsel (tasks 1 and 2, merged) and The Threshold
  (`door-dormouse-L1-panel`, the-threshold#2). No other pet repo has a framework page that says module.
- **Left as modules, on purpose:** real code modules (Log Den's `module` field, the faulting program file of a Windows
  crash record; Python, TypeScript, webpack, Unity particle and face tracking modules; `"type": "module"`), and dated
  records (old credit lines, Unity Unicorn's card 002, Damsel's cards 005 and 006).
- **Not checked:** pages that are not on GitHub, such as The Threshold's hosted page in Codex's Sites source
  (`the-threshold-20261016.html`, docs/page-panels-check-20261019.md in the-threshold).
- **Seen, not changed (not this task):** the crash-watch pages still say their tools are "on main: no (branch
  `claude/build-20261018`, not merged)", though those branches merged on 2026-10-19 (each repo's #2).
- On Astra's PC: nothing changed. The programs were built and their self-tests run in the scratchpad clones; headless
  Edge ran from the scratchpad.

**Task 7, tool panels in the pet repos** (Claude Opus 5.5, `claude-opus-5-5`, a session started from the one that made
astras-pet-os#129, 2026-10-19, after #129 merged as `502f75a`). Each repo was changed in a fresh clone in Claude's
scratchpad (`core.autocrlf=false`), on branch `claude/tool-panels-20261019`. There is one pull request per repo, and none
is merged (Astra gives her OK per pull request in chat):

| Repo | Pull request | Commit | What it renames | Tests |
|---|---|---|---|---|
| findastra/unity-unicorn | [#20](https://github.com/findastra/unity-unicorn/pull/20) | `63e47fa`, `d17b45f` (main with #16 merged in) | `unity-unicorn-L1-tool-panel` to `-L4-tool-panel` and the 15 other tool panels (page 0.5.1) | `node --test test/*.mjs` 62: 61 pass, 1 skipped (local seed); Python 50 OK |
| findastra/findastra-discord-presence | [#27](https://github.com/findastra/findastra-discord-presence/pull/27) | `58e4536` | `discord-damsel-servers-tool-panel` (plugin `PANEL`, pet.json, her page) and `discord-damsel-L2-tool-panel` | `node --test` 125 pass, 0 fail, 0 skipped |
| findastra/log-den | [#7](https://github.com/findastra/log-den/pull/7) | `0d569c6` | `log-lynx-L1-tool-panel` to `-L4-tool-panel` | `node --test` 6 pass; `--self-test` 38 pass |
| findastra/packet-river | [#7](https://github.com/findastra/packet-river/pull/7) | `42d8fd2` | `packet-piranha-L1-tool-panel` to `-L4-tool-panel` | `node --test` 6 pass; `--self-test` 20 pass |
| findastra/evidence-locker | [#7](https://github.com/findastra/evidence-locker/pull/7) | `6269bb4` | `forensic-ferret-L1-tool-panel` to `-L4-tool-panel` | `node --test` 6 pass; `--self-test` 22 pass |
| findastra/workflow-whirlpool (private) | [#2](https://github.com/findastra/workflow-whirlpool/pull/2), into `codex/workflow-whale-20261018` (nothing pushed to it) | `cda1034` | nothing: its pages never call a box a panel in words | `node --test test-panels-20261019.mjs` 5 pass |

- **Every page:** the fold hint says "Click the label to fold or unfold this tool panel", and so do the page's own words ("Add to the L1 tool panel", "Click a tool panel to open it", "For now this tool panel holds only…"). Each repo's panel test fails on `main`'s page. Each repo also has a credit line in AGENTS.md.
- **Unity Unicorn:**
  - Its avatar and world side panels, and the made-by panel, were named `…-panel` too (`unity-unicorn-matcap-panel` and the rest), so they became `…-tool-panel`, the same as Damsel's servers panel, which this task names.
  - Lights saved on the old `-panel` labels, and on the older `-module` ones, move to the new labels (the page's `RENAMED` list). This was checked in Claude's browser.
  - #16 merged while #20 was open and added three more `…-panel` labels (`made-by`, `avatar-assets`, `world-assets`). `main` is merged into #20 (`d17b45f`), which renames them and adds them to `RENAMED`. The panels test fails if a new `…-panel` label appears. #19 changes the same page too.
- **Discord Damsel:**
  - The README screenshot was retaken from the plugin's test page (`?demo`, headless Edge, 760 × 860); only the label changed.
  - Her open #26 (Sticker Manager 1.0.2) changes the same lines, so #27 keeps the plugin at 1.0.1. Merge #26 first, then `main` goes into #27 and the plugin becomes 1.0.3.
- **Workflow Whirlpool:** its level boxes are titled "L1 · Program & tools" to "L4 · Approvals & connections", and `panel` is only their class. #2 adds a test that fails if a page's words (text, title, aria-label, alt) call a box just a panel, and the rule in AGENTS.md. Its source zip was rebuilt with `build-downloads-20261016.py`.
- **Kept, on purpose:**
  - code names: `.panel`, `uu-panels`, `uu-panel`, `panelBox`, `ddsm-panel`, `class Panel`, `getSettingsPanel`, `live-panel`, and pet.json's `panel` key;
  - chat panels; BetterDiscord's "settings panel"; the Damsel companion's "control panel";
  - the Unity scripts' own words ("Load it in Unity Unicorn's menu-map panel.");
  - dated records (old credit lines, old README sections, cards).
  - No pet repo has a `rwx-panel` or "bot panel"; both stay names wherever they are.
- **Saved browser data:** nothing is lost. The crash-watch pages, Damsel's page and Workflow Whirlpool save by item, connection or tool, never by a box's name, and Unity Unicorn carries its lights over.
- **Hub:** the note at the top of docs/unity-unicorn-page-modules-20261018.md now points at unity-unicorn#20 (this commit).
- On Astra's PC: nothing changed. The pages were served on 127.0.0.1 from the scratchpad for Claude's browser, and headless
  Edge ran from the scratchpad.

## Task

1. **Unity Unicorn** (findastra/unity-unicorn, its own pull request): `unity-unicorn-20261008.html` labels its level
   boxes `unity-unicorn-L1-module` to `-L4-module` (found by GitHub code search). Rename them to `-L1-panel` to
   `-L4-panel`, with any class names, ids and docs that say module for a page box, then update the note at the top of
   the hub's docs/unity-unicorn-page-modules-20261018.md. **Done:** unity-unicorn#11, merged 2026-10-19; the doc note is updated.
2. **Discord Damsel** (findastra/findastra-discord-presence): the Sticker Manager sits in her `discord-damsel-servers-module`.
   Rename it to `discord-damsel-servers-panel` there, then the hub's `system-map.json` job text for `sticker-manager`.
   **Repo part done:** findastra-discord-presence#20 (the L2 box too) and #21, merged 2026-10-19. The map text moves to task 3.
3. **Hub, after #106 and #104 merge** (both rebuild the System Map page, so changing it now would collide):
   `system-map.json` job texts for `pet-program-spawner` and `sticker-manager` still say "module"; change them and run
   `npm run build`. **Done** on branch `claude/tool-buttons-20261019` (2026-10-19): the spawner's says "every tool
   panel", Sticker Manager's says "Discord Damsel's servers panel".
4. **Any other pet page built to the framework:** search for `-module` and rename it the same way. **Done, waiting on
   Astra's OK:** log-den#4, packet-river#4, evidence-locker#4 and workflow-whirlpool#1 (above).
5. **Waiting on Astra:** `skills/dev-mindset` says "Home (cyberhome)" is the pet program (2026-10-16), while
   PET-PROGRAM-FRAMEWORK.md (2026-10-18) makes `<pet>-cyberhome` the box at the top left where the pet sits. PET-WORDS.md
   follows the framework. Astra says which; then fix the other.
6. Optional: give each part in pets.json `words` a `programmer` field, so the GitHub Goldfish can read the programmer
   words too, and extend `test/pet-words-test-20261009.mjs` to keep it in step with PET-WORDS.md.
7. **Tool panels in the pet repos** (Astra, 2026-10-19: "I do want all of it to say tool panel instead of just panel"):
   the hub's pages say `<pet>-L1-tool-panel` to `-L4-tool-panel` since branch `claude/tool-buttons-20261019`. After
   Astra merges it, rename the level panels the same way on each pet's own page (Unity Unicorn, Discord Damsel, Log
   Den, Packet River, Evidence Locker, Workflow Whirlpool), one pull request per repo. "Bot panel" on Fairy Ring's page
   is Astra's own name and stays. Claude warned that developers read "tool panel" as a panel holding tools (only L1
   does); she chose it for every panel. **Done, waiting on Astra's OK:** unity-unicorn#20,
   findastra-discord-presence#27 (after #26), log-den#7, packet-river#7, evidence-locker#7 and workflow-whirlpool#2 (above).

## Done when

No pet page, hub doc or map card calls a page box a module, and the cyberhome question is answered.

## Return

Update `## What I did` with each repo, pull request and commit; set `status: done`; commit on a branch.
