status: open (Parts 1 to 4 merged; Part 5a, the farm lock, built and waiting on Astra's OK to merge; then 5b; waiting on Astra: the hub's old history, task 6)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-19 to 2026-10-21
needs: docs/farm-owner-and-single-pets-20261019.md, docs/farm-lock-20261021.md, scripts/animal-guard-20261013.mjs, scripts/pet-privatizer-20261018.mjs, test/pet-privatizer-test-20261018.mjs, skills/farm-security/SKILL.md, MAKE-IT-YOURS.md, apps/beginner-guide-20261019.html, handoffs/051-any-beginner-guide-20261019.md (finding 3)
---
## What I did

Started from the beginner-guide chat (card 051, finding 3): make the Friendly Farmer's pet-privatizer work on any farm's
own GitHub account, not only Astra's, first for Dev (`XxdevilishxX`). Astra then widened it in this chat (2026-10-19):
*"People are going to be wanting to privatize and unprivatize their pets. And people are going to want to be able to
download as an individual pet and not have to download the whole system."* She asked for the ramifications and a
proposal before any rewrite, and for everything to be read first.

- **Read in full:** every top-level Markdown file in the hub, every hub skill, `handoffs/README.md`, cards 025 and 051,
  `docs/migration/PLAN.md`. Checked all 131 branches for changes to the guard, the privatizer, the skills and
  `pets.json` (only old, unmerged Codex branches touch the guard: a repo-name format check, used in the proposal).
- **Looked at:** every hub script that names an account (24 scripts, the installer, two Linux package files, 12 tests;
  59 lines of registry data), the installer's farm writing, the Farmer's round and the Pets Board; all 104 `findastra`
  repos on GitHub (101 public, 3 private, no forks, one star, five Pages sites); the `pet.json` of meme-fiend, log-den
  and paper-girl; and on Astra's PC: `gh` signed in as `findastra` only, the programs running from pet folders, and how
  each local pet repo reaches the hub (pictures, pages, build icons). Nothing on her PC was changed.
- **Found:** run through the `Documents\Astra's PetOS` junction, the privatizer prints nothing and does nothing
  (checked: through `Astra's Pet Apps` it prints its usage). Meme Fiend's own `pet.json` says private; `pets.json` and
  GitHub say public.
- **Wrote:** the proposal, `docs/farm-owner-and-single-pets-20261019.md` (what is true today, Parts 1 to 4, what it would
  take, risks), and a private slide deck of nine questions for Astra:
  https://claude.ai/artifact/5seMXo5epfcuSdRn7teyUY (she can open it; others only if she shares it).
- **Branch:** `claude/farm-owner-privatizer-20261019` of astras-pet-os, from `main` at `8741adb`, made in a clone in
  Claude's scratchpad with `core.autocrlf=false`. The live hub folder was only read and fetched. No code changed yet;
  no pull request yet.
- The Farm's pet program page was opened in the browser pane from the scratch clone (a server on 127.0.0.1 only).

**2026-10-20, Astra: "All recommended. Build Parts 1 and 2."** Every answer is recorded in the proposal's table.

- **Card number:** this card was 057, but other branches took 057 first (the Aquarium error-checkers card, PR #136, and
  click-check, merged with #158), so it is 058; next free 059. The developer-mode branch (#155) also used 058; this card
  reached `main` first, so #155 renumbers.
- **Merged `main`** (#126, #140, #148 to #151) into the branch: `e8316f9`.
- **Parts 1 and 2, commit `8133789`, [pull request #157](https://github.com/findastra/astras-pet-os/pull/157)**, merged
  to `main` with Astra's OK in chat (2026-10-20: "OK, merge #157"), after `main`'s three README edits were merged in
  and `npm test` passed on the merged tree:
  - `pets.json`: `"github_owner": "findastra"`; Claude Bot's entry `stays_private` (its art is a copy of BSOD, which
    may not be public; without it the scan would have let it go public).
  - `scripts/animal-guard-20261013.mjs`: `farmOwner`, `petOwner`, `sameAccount`, `assertOwnPet`,
    `assertSignedInAsOwner`; per-pet accounts; malformed names refused. Existing guard tests unchanged and passing.
  - `scripts/pet-privatizer-20261018.mjs`: `plan|apply private|public` (private by default); own pets only, signed in as
    the owner; never the one art source private; never a `stays_private` pet public; `scanHistory` over every commit of
    every branch before public; pets.json follows both ways; the junction fix (real paths).
  - Tests: `test/farm-owner-test-20261020.mjs` (new, 5) and 8 more in `test/pet-privatizer-test-20261018.mjs`; the
    junction test fails with the old check (tried).
  - Docs: MAKE-IT-YOURS.md, the guide (`apps/beginner-guide-20261019.html`: "Tell your farm it's yours" and private or
    public both ways, each with a message to copy), `skills/farm-security` section 2, the decision row in
    `skills/new-pet-or-tool`, the tool's job and grant 3 in `system-map.json` (all pet pages and markdown pets rebuilt),
    AGENTS.md credit line, the proposal's answers.
  - `npm run build`; `npm run check` (23 pet apps); `npm test` 227 tests, 226 pass, 0 fail, 1 skipped.
  - Live, read-only, signed in as findastra: `plan private meme-fiend paper-girl astras-pet-os` (Paper Girl's Pages
    site listed as a loss; the hub refused) and `plan public claude-bot workflow-whirlpool meme-fiend` (Workflow
    Whirlpool stopped on local service addresses; Claude Bot stays private). Nothing changed on GitHub.
  - The guide at 375 px in the browser pane: no sideways scroll, both new copy buttons 44 px, no console errors
    (screenshots timed out because the app window was hidden; checked by measurement).
- **Found, not changed:** the public hub's own history has personal folder paths in old commits (old versions of
  `handoffs/009-…` and `scripts/idle-flash-audit-…`, among others); the files on `main` are clean. Rewriting public
  history is Astra's call.

**Part 3, 2026-10-20, by Claude Opus 5.5 (`claude-opus-5-5`), a session started from the farm-owner chat:
[pull request #164](https://github.com/findastra/astras-pet-os/pull/164)**, branch `claude/farm-owner-upstream-20261020`
(commits `505a09b` the split, `fc27a66` make-it-yours and docs, `314f9ef` merge of `main` with #152, #155, #161), made in
a clone in Claude's scratchpad with `core.autocrlf=false`. Started after #157 was merged. The live hub folder on Astra's
PC was not touched. **Merged to `main` as `dcd5d81` with Astra's OK in chat (2026-10-20: "OK, merge #164").**
`main` had moved while she answered, so #163 and #165 were merged into the branch first (`4c61a44`, `92a09e3`). #163's
new footer kept its look, with its source link on each pet's own account; its "By Astra" links (her GitHub and
TikToks) stay hers on every farm. `npm run build` and `npm run check` passed, and `npm test` on that exact commit gave
264 tests, 263 passing, 0 failing, 1 skipped.

- `scripts/farm-owner-20261020.mjs` (new): `upstream()` (Astra's PetOS itself: releases, installer link, pictures, guide,
  pages, docs, `findastra/astras-pet-os`), `farmOwner()` (from the guard), `ownerOf()`, `repoOf()`, `repoUrl()`. A repo's
  account is its own `github_owner`, else the farm owner's. A candidate is the farm owner's. A repo pets.json does not
  list is upstream's. The guard now exports `assertAccount`.
- Farm-facing scripts ask it: `lib.mjs` (README table, `INSTALLER_URL`), `roster.mjs`, `pet-programs-20261014.mjs`
  (+ `build.mjs`), the spawner (Source, Pedigree, Repo button; its `OWNER`/`HUB`/`PAGES` are upstream's),
  `markdown-pets`, the Farmer's round (farm owner's repos for discovery; other accounts read only for their examples),
  `pet-finder`, the Pets Board, the Farmer's desk (`build-interfaces`), `prepare-desktop-drafts`, `farm-setup` and the
  installer's farm list (a draft's repo on any account), `check-pets`, `publish-pet-tags` (only the farm owner's own pets,
  tagged as the farm owner) and `click-check`.
- Astra-only on purpose, with a comment: `farmer-profile`, `idle-flash-audit`, `-cards`, `-fix`, `-new-repos`,
  `-refresh`, `one-art-source`, `pet-program-link` (A59) and the profile line in `relations`.
- The Friendly Farmer's **make-it-yours** (`scripts/make-it-yours-20261020.mjs`, `the-farm-v1.0-make-it-yours-v1.0`, a
  tool node in `system-map.json`). It sets `github_owner`, marks every pet that came with Astra's PetOS
  `"github_owner": "findastra"` (pets, pipeline, candidates; not the host) and rebuilds; `--dry-run` shows the change.
  Run again, it moves the farm and the owner's own pets. MAKE-IT-YOURS.md and the guide's "Tell your farm it's yours"
  step use it; the decision row is in `skills/new-pet-or-tool`, a line in `skills/farm-security`, the AGENTS.md
  credit line.
- `test/farm-owner-upstream-test-20261020.mjs` (10 tests):
  - Astra's farm byte for byte.
  - A fixture farm for `XxdevilishxX`: her links are hers, Astra's examples keep Astra's, pictures and docs stay
    upstream. The round, pet-finder, the farm list and click-check follow each pet's account.
  - make-it-yours, as a function and from the command line.
- Checked:
  - `npm run build` after the split leaves the tree clean. Against `main`, only The Farm's page, its two Markdown
    pets, TOOLS-AND-TRICKS.md and the map change (the new tool's row).
  - The desk's data was compared with a baseline build: the same, plus owner fields, all `findastra`.
  - `npm run check` (23 pet apps). `npm test` on the merged tree: 263 tests, 262 pass, 0 fail, 1 skipped.
  - make-it-yours run for real in a throwaway clone.
  - The guide at 375 px (no sideways scroll, 44 px copy button, no console errors), served on 127.0.0.1 from the clone
    through a temporary entry in the session folder's `.claude/launch.json`, removed afterwards.
- **Left for Astra:** the round workflow's comment still says "a token for the findastra account". The workflow
  passes no account, so nothing breaks; the GitHub token here cannot push workflow files.
- **Not built (later):**
  - The hub's own name inside pets.json stays `astras-pet-os`, so a farm whose copy has another name links the
    Friendly Farmer's repo as `<owner>/astras-pet-os`. GitHub forwards a renamed fork, but not a private copy made
    under a new name.
  - Pet program pages and Markdown pets point at upstream's public site, so a farm's own pets have no public page
    yet (Part 4).
  - The System Map's per-node repo links and the Linux package stay upstream.

**Part 4, 2026-10-20, by Claude Opus 5.5 (`claude-opus-5-5`), a session started from the farm-owner chat:**

[Pull request #183](https://github.com/findastra/astras-pet-os/pull/183), commit `5c00536`, branch `claude/pet-packs-20261020`, cut from `main` at `fcaf44d` in a clone in Claude's scratchpad with
`core.autocrlf=false`. The live hub folder on Astra's PC was not touched. Built from Astra's answers of 2026-10-20
(all recommended): a pet pack zip first; pictures copied into the zip only; what each pet needs written in pets.json.

- **Read first:** every top-level Markdown file in the hub, every skill, `handoffs/README.md`, this card, the proposal
  and the migration plan. Every branch was checked for skill or pet-pack work. None has pet-pack work. #136 also adds a
  row to `skills/new-pet-or-tool`.
- **Read too:** the private-repos notes. 90 of 104 repos went private on 2026-10-20, the hub too, and #167 (open) syncs
  pets.json. A pack copies its pictures, so it needs no public hub. Its links to the System Map and other pets' pages
  answer only once the hub is public again. The pack's README says so whenever pets.json says the hub is private.
- `pets.json`:
  - `needs` on all 42 registered and pipeline pets: `os`, `pets`, `core`, `programs`, each item with `how` (required
    or optional) and `why`.
  - `needs_key`, which says how to write them.
  - `pet pack` in `words`.
  - Written from the relations, system-map.json and each pet's own pet.json (`runs_on`, which is how Packet Piranha and
    Forensic Ferret were found to need Log Lynx).
  - Startup Star is on every pet with a desktop pet: all registered pets but the host, and the pipeline pets on the
    desktop draft list. It is required only for Claude Bot, which is a desktop pet.
- `scripts/pet-packs-20261020.mjs` (new): the Friendly Farmer's pet-packs tool, `plan` and `build`, Node built-ins
  only (the zip writer and reader too). It asks `ownerOf()`/`repoUrl()` for every repo and never names an account.
- `system-map.json`: the tool node `pet-packs` (of The Farm) and its links to Node.js and GitHub. Rebuilt: The Farm's
  page, its two Markdown pets, TOOLS-AND-TRICKS.md and the map.
- `.gitignore`: `pet-packs/`, so a pack (and its copied pictures) is never committed.
- `test/pet-packs-test-20261020.mjs` (new, 10 tests):
  - the needs, and two that fail when the needs drift from the map or the desktop pets (tried by breaking pets.json);
  - the zip round trip and its CRC;
  - which pets may be packed;
  - a whole pack built from a throwaway git repo: every link it writes lands in the zip, every SHA-256 matches;
  - the scan stop;
  - a fixture farm for `XxdevilishxX`: her copy links her account, Astra's example keeps Astra's.
- Docs: MAKE-IT-YOURS.md section 6 (sections 6 and 7 renumbered), the guide's "Take one of Astra's pets" step (a message
  to copy) and its words, PET-FILES.md ("A pet pack carries a copy, in the zip only"), PET-WORDS.md (`pet pack`,
  `needs`), `skills/dev-mindset` (two rows), the decision row in `skills/new-pet-or-tool`, the Farmer's row in
  INTELLIGENCE-LEVELS.md, the AGENTS.md line, and the proposal's "As built".
- **Checked:**
  - `npm run build`, `npm run check` (23 pet apps), `npm test`: 274 tests, 273 pass, 0 fail, 1 skipped.
  - Real packs from GitHub for Forensic Ferret, Voicemeeter Bug and Mine Mole, in the scratchpad only. Windows'
    Expand-Archive and Info-ZIP both open them, and every SHA-256 matches.
  - The unzipped packs, served on 127.0.0.1 through a temporary entry in the session folder's `.claude/launch.json`
    (removed afterwards): the opener goes to the page, every file loads from the pack (all 200, no console errors),
    and Voicemeeter Bug's "Open today's app" opens the app inside the pack.
- **Found, not changed:**
  - API Fairy cannot be packed. Her `tests/Tests.cs` holds fake keys and tokens. Her `src/Snapshot.cs` holds example
    folder paths for a made-up user: every one names the user `you`, checked with the names masked. Her web page in her repo names two
    local ports. Question 2 of the slides.
  - The page script (`apps/pet-programs/pet-program-page-20261018.js`, the chat's message) still writes
    `https://github.com/findastra/<repo>`, which Part 3 missed. On another farm, a pet's chat message names Astra's
    account. Astra started its own session for the fix on 2026-10-21 (its own pull request).
    - Fixed in [#184](https://github.com/findastra/astras-pet-os/pull/184), merged as `f2eb3bb` with Astra's OK. Each
      page's config carries the pet's own repo (`repoUrl`, from `ownerOf`; none when the repo is private), and the page
      script names no account, its tool-frame height check included. Guarded by
      `test/farm-owner-upstream-test-20261020.mjs` and `test/cyberhome-chat-test-20261019.mjs`.
- **Not built:** publishing packs anywhere (question 1), signing them, and the Friendly Farmer adding a pack to a
  farm (`farm.lock`).
- **Merged to `main` with Astra's OK in chat (2026-10-21: "OK, merge #183").**
  - `main` had moved while she answered: #180 and #181 (two cards) were merged into the branch first.
  - On that merged tree: `npm run build` left nothing to commit, `npm run check` passed (23 pet apps), and `npm test`
    gave 274 tests, 273 pass, 0 fail, 1 skipped.
- **Astra's answers to the three pet-pack questions (2026-10-21: "all recommended")**, recorded in the proposal's
  table (rows 10 to 12) and MAKE-IT-YOURS.md section 6:
  1. Where people download a pack: on each pet's own repo, as a release file, only for pets whose repo is public, one
     pet at a time with her OK. Nothing is published yet.
  2. API Fairy's scan hits: her own chat fixes her files. The fake keys are put together while the tests run, the
     example paths use `%USERPROFILE%`, and the two local ports leave her page. The scanner stays strict, with no
     exception in the core. Her card: `docs/handoff-any-pet-pack-scan-20261021.md`,
     [findastra/api-fairy#10](https://github.com/findastra/api-fairy/pull/10).
  3. Packs from private repos: keep `--private`, as built.

**Part 5 proposal, 2026-10-21, by Claude Opus 5.5 (`claude-opus-5-5`), a session started from the pet-packs session:**
the farm lock. The Friendly Farmer adds one pet to a farm, or takes one away, and records exactly what the farm runs.
This is the second half of Astra's answer 6. It is a proposal only: no code changed.

- **Branch:** `claude/farm-lock-proposal-20261021`, cut from `main` at `7906b9c` in a fresh clone in Claude's scratchpad
  with `core.autocrlf=false`. The live hub folder on Astra's PC was not touched.
- **[Pull request #197](https://github.com/findastra/astras-pet-os/pull/197)**, commits `1cb5004` (the proposal) and
  `db470b1` (Astra's answers). **Merged to `main` as `db2fd41` with Astra's OK in chat (2026-10-21: "OK, merge
  #197").**
  - Main (#194, then #190) was merged into the branch first.
  - On that tree, `npm run build` changed nothing and `npm run check` passed (23 pet apps).
  - `npm test` gave 300 tests: 299 pass, 0 fail, 1 skipped.
- **Read first:**
  - this card, the proposal (Parts 1 to 4 as built, answers 1 to 12), the pet-packs tool and its manifest;
  - `needs` and `needs_key` on all 42 pets;
  - the installer, its uninstaller, `farm-setup` and the Linux command;
  - INSTALL.md, MAKE-IT-YOURS.md, PROVENANCE.md, `skills/dev-mindset`, `farm-security`, `new-pet-or-tool` and
    `handoff`;
  - the shared session notes of Parts 1 to 4 and #184.

  None of the 187 branches has farm lock work.
- **Wrote:**
  - `docs/farm-lock-20261021.md` (new), the proposal: what is true today; the catalog and the farm; what the farm lock
    holds (an example of Dev's farm); where it lives; how a pet comes in, from the installer's own pets or a pet pack;
    how its needs are checked (required pets first, then this computer and the core, then programs); how a pet leaves
    without breaking another; `check` and `lock`; the installer; what it would take (5a, then 5b); risks.
  - A "Part 5" section in `docs/farm-owner-and-single-pets-20261019.md`, and its header line.
  - This card, and its row in `handoffs/README.md`.
- **Found, not changed:**
  - The installer does not read `needs`. Checked with `choosePets` in `scripts/farm-setup-20261019.mjs`, which the
    installer's logic is tested to match: a farm from scratch with `evidence-locker` gives the Friendly Farmer and
    Forensic Ferret, without Log Lynx (required).
  - On Windows, an install keeps no full list of pets after `Set-FarmPets`, so a pet can be added later only by
    running the installer again from the unzipped release.
  - `farm.lock` breaks Astra's file-name rule (no date). The name is in three docs, three skills, pets.json and the
    pet-packs tool. That is question 2, not changed.
- **Questions for Astra:** a private slide deck of six questions, https://claude.ai/artifact/KguKpbZJCeKfL5xx5DtETo
  (recommended: A on each):
  1. where the farm lock lives;
  2. its file name;
  3. which pet packs may come in before packs are signed;
  4. a program or core part the Farmer cannot add;
  5. taking away a pet others need;
  6. whether the installer ticks the pets a picked pet needs.

  Her answers go into rows 13 to 18 of the proposal's answers table, and here.
- **Astra's answers to the six farm lock questions (2026-10-21: "All recommended on the six farm lock questions")**,
  recorded in the proposal's table (rows 13 to 18) and in `docs/farm-lock-20261021.md`:
  1. The farm lock lives on the computer, in the farm's own folder next to the install receipt. It is never committed:
     a hub copy's `.gitignore` lists it.
  2. Its file name is `farm-lock-20261021.json`, by her file-name rule. In 5a, the docs' `farm.lock` becomes "the farm
     lock" (three docs, three skills, pets.json and the pet-packs tool).
  3. Before packs are signed, each file of a pack is checked against the pet's own repo on GitHub at that commit. A pack
     that cannot be checked comes in only with `--unchecked`, marked in the farm lock.
  4. A pet that needs a program or core part the Farmer cannot add still comes in, with a plain warning. The plan names
     what is missing and what to do, and the farm lock marks it.
  5. A pet that other pets on the farm require is not taken away. The Farmer stops and names them, and
     `--with-dependents` takes them all away together, on purpose, after the plan lists every one.
  6. The installer ticks the pets a picked pet needs, with the same check as the Farmer: ticked and locked, "needed by"
     that pet.

**Part 5a, 2026-10-21, by Claude Opus 5.5 (`claude-opus-5-5`), same session.** Astra: *"Build Part 5a here: the farm
lock with the installer's own pets and the installer's part, as the proposal and my answers say. One pull request,
merged only with my OK."*

- **Branch:** `claude/farm-lock-20261021`, cut from `main` at `3d549fe` (with #197 and #199) in the same scratchpad clone
  (`core.autocrlf=false`). Pull request: see "Return" below. The live hub folder on Astra's PC was not touched.
- **New:**
  - `scripts/farm-lock-20261021.mjs`: the farm lock and the needs check.
  - `scripts/farm-pets-20261021.mjs`: the Friendly Farmer's farm-pets tool, `the-farm-v1.0-farm-pets-v1.0`, with
    `plan add`, `add --yes`, `plan remove`, `remove --yes`, `check` and `lock`.
  - `test/farm-lock-test-20261021.mjs`: 13 tests.
  - `changes/farm-lock-20261021.md`.
- **Changed:**
  - `scripts/farm-setup-20261019.mjs`: `farmPets` carries `needs`; `choosePets` brings needed pets; there is a new
    `writeFarmFiles`; `writeFarm` writes the farm lock.
  - `scripts/linux-cli-20261019.mjs`: `setup` says which pets came along, and `astras-pet-os pets ...` runs farm-pets.
  - The installer:
    - the catalog in `farm-catalog\` (robocopy never copies one, or a farm lock, from the release);
    - needed pets for `-Pets`, and in the window ticked, greyed and locked with "Needed by ...";
    - the first farm lock, and on a rerun the window opens with the farm's pets;
    - a PowerShell twin of the lock's functions.
  - `system-map.json`: the farm-pets tool node and its Node.js link. Rebuilt: The Farm's page, its two Markdown pets,
    TOOLS-AND-TRICKS.md and the map.
  - `.gitignore`: the farm lock and `farm-catalog/`.
  - Words: `farm.lock` became "the farm lock" (`farm-lock-20261021.json`) in PET-WORDS.md, PROVENANCE.md (the "Your farm"
    row is built), MAKE-IT-YOURS.md (section 2's new part, section 6), INSTALL.md, INTELLIGENCE-LEVELS.md (The Farm's row;
    pet-packs marked merged), the guide (a step with a message to copy, and the word), `skills/dev-mindset`,
    `farm-security`, `new-pet-or-tool` (a decision row), pets.json's `needs_key`, and the pet-packs tool's README and
    comments.
  - `docs/farm-lock-20261021.md` and the proposal: "As built".
  - Tests: the installer run in `test/farm-setup-test-20261018.mjs` and `FARM_FACING` in
    `test/farm-owner-upstream-test-20261020.mjs`.
- **One change from the proposal:** a pet whose own program runs on another computer comes in with a warning, because
  no code comes onto the farm in 5a. The uninstaller's part (pack folders) moved to 5b.
- **Checked:**
  - The installer's PowerShell twin gives what Node gives, all on Windows: every entry's SHA-256, the needed pets of each
    of the 40 installer pets, every account, and the whole farm lock in farm and developer mode.
  - A real install from scratch with `goldfish,rgbee,evidence-locker` into a temp folder brought Log Lynx and wrote
    the farm catalog and the farm lock. Then the Farmer added Packet Piranha on it, refused to take Log Lynx away, and
    `check` passed.
  - The window was drawn with `-SetupWindowPicture -Farm Scratch -Pets evidence-locker,goldfish`, in farm and
    developer words: Log Lynx is ticked, greyed, "Needed by Forensic Ferret", and the count is 4.
  - `npm run build`, `npm run check` and `npm test`: see "Return".
- **Not built:** pet packs coming in (5b: checked against GitHub, `--unchecked`, the pet's code next to the farm, the
  uninstaller removing pack folders).

## Task

1. ~~Astra: answer the nine questions~~ Answered 2026-10-20: all recommended (proposal, "Astra's answers").
2. ~~Parts 1 and 2~~ Merged with #157 (Astra's OK in chat, 2026-10-20).
3. ~~**Part 3**~~ Merged with #164 as `dcd5d81` (upstream vs farm owner, make-it-yours; Astra's OK in chat, 2026-10-20).
4. ~~**Part 4**~~ Merged with [#183](https://github.com/findastra/astras-pet-os/pull/183) (pet packs, `needs` in
   pets.json; Astra's OK in chat, 2026-10-21). ~~Three questions in slides~~ Answered 2026-10-21: all recommended
   (above, and the proposal's rows 10 to 12).
   - Publishing a pet's first pack waits on her OK for that pet.
   - API Fairy's files are her own chat's card (api-fairy#10).
5. **Part 5, the farm lock:** proposed in `docs/farm-lock-20261021.md` (2026-10-21).
   - ~~**Astra:** answer the six questions in the slides~~ Answered 2026-10-21: all recommended (above, and the
     proposal's rows 13 to 18).
   - ~~Proposal~~ Merged with #197 as `db2fd41` (Astra's OK in chat, 2026-10-21).
   - **5a** (the farm lock with the installer's own pets, and the installer's part): built, its pull request waits on
     Astra's OK to merge.
   - Next: 5b (pet packs come in), its own pull request, merged only with her OK.
6. **Astra:** whether to rewrite the hub's public history to remove the old personal folder paths (found above).

## Done when

Astra has answered, Parts 1 and 2 are merged with her OK, and Parts 3 and 4 have cards or pull requests of their own.

## Return

Update `## What I did` with each answer, pull request and merge commit; set `status: done` when Part 2 is merged and the
rest has its own cards.
