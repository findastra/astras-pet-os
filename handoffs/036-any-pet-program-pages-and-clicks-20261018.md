status: open (waiting on Astra: push the 48 repo pages, GitHub Pages, the double-click check)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-18
needs: docs/pet-click-audit-20261018.md, scripts/pet-program-pages-20261018.mjs, handoffs/032-any-desktop-reads-only-the-hub-20261018.md, docs/tray-star-handoff-20261011.md
---
## What I did

Astra asked (2026-10-18): "do a flash audit for the item that covers whether clicking on each pet opens its program or the
website it manages, and fix it automatically", then "create pet programs for all of the rest that don't have pages and model
them after the platform platypus". That is Flash Audit A11, with A10 and A59. Record: docs/pet-click-audit-20261018.md.

**This repo, branch `claude/press-plai-tools-20261017`** (Astra chose to keep working on it; `origin/main` at `9d0622d`
was merged in first, and one conflict in INTELLIGENCE-LEVELS.md kept both sides):
- `scripts/pet-program-pages-20261018.mjs` (new, a tool of The Farm): a pet program page for every numbered pet with none of
  its own, modeled on Platform Platypus; `--repo` writes the copy for a pet's repo, `--bundle` copies a pet's own page into
  the hub, `--check` fails on a stale page. `scripts/pet-program-shell-20261018.html` is Platform Platypus's shared shell
  (footer, yellow phone, notes, tutorials, Clicker Training, About, paper, mood key, L3 bubble), copied from
  platform-platypus `main` at `5573fc4`.
- `apps/`: 58 generated pages and 4 bundled copies (rgbee `04f054e`, mine-mole `24701f3`, wifi-butterfly `8a5c232`,
  raspberry-berry `21f2383`), all `*-20261018.html`.
- `pets.json`: every pipeline pet has `interface_url` (and `interface_local_url`, or `interface_live_url` for Fuzzboi Friend).
- `scripts/prepare-desktop-drafts-20261011.mjs`: a draft's `interface` is that `interface_url`, never its repo page;
  `desktop-art/desktop-drafts-20261018.json` rebuilt (16 drafts, all opening a page).
- `scripts/desktop-pets-20261011.cs`: Voicemeeter Bug's exe is looked for in `..\voicemeeter-bug\` next to the hub, then
  `Documents\ChatGPT\Voicemeeter Bug\`; with neither, his double-click opens his page instead of nothing. Candidate built
  (`build-desktop-pets-20261011.ps1 -CandidateOnly`) and `--self-test` says PASS. The installed exe was not replaced.
- `test/pet-click-targets-test-20261018.mjs` (new); `test/pet-frame-test-20261009.mjs` keeps a bundled copy square without
  the hub's rail-style fixer; `test/profile-names-test-20261018.mjs` expects Claude Bot's home to link to his public page on
  The Farm, never to his private repo. `node scripts/build.mjs --metadata-only` (cage-data.js), `npm run check` (20 pet apps),
  `npm test`: 130 tests, 129 pass, 1 skipped, 0 fail.
- INTELLIGENCE-LEVELS.md (the 🔌 error is fixed on this branch), AGENTS.md credit line, this card.

**48 pet repos: written, not pushed.** In temporary shallow clones (`%TEMP%\pca\<repo>`, gone when the temp folder is
cleaned), each has `index.html` (`--repo`), `pet.json` with `"entry": "index.html"` (Role Fairy keeps `src/bot.js`), and in
41 repos the seed README's Run it and Limits lines updated. The push was stopped by this session's safety check (a new
public page in 48 repos), and 46 of the repos are seeds and roadmap pets, which the animal guard does not count as animals.

Nothing on Astra's PC was changed outside this repo folder and the temp folder. Nothing was signed in to, installed or started.

## Task

1. **Astra decides** whether the pages go into the pets' own repos: straight to `main`, or a branch per repo for her merge.
   Then, for each repo in `inRepo` (the seeds and roadmap pets, `claude-bot`, `role-fairy`): clone `main`, run
   `node scripts/pet-program-pages-20261018.mjs --repo <repo> <clone>`, set `pet.json` `entry` to `index.html` where it has
   none, update the seed README's Run it and Limits, commit with a `Co-Authored-By` line, push.
2. **GitHub Pages** (Astra's, a repository setting): Settings, Pages, Deploy from a branch, `main`, `/ (root)`, for each repo
   above and the four bundled ones. When a pet's page answers at `https://findastra.github.io/<repo>/`, set its
   `interface_url` (pipeline) to that address, keep the hub copy as `interface_local_url`, and run the tool and tests.
3. **Rebuild the star** with card 032's steps (quit, `build-desktop-pets-20261011.ps1`, `--self-test`), then Astra starts it
   herself and double-clicks a few pets: a registered one, a draft one, Fuzzboi Friend and Voicemeeter Bug (A11, 🔵).
4. Seeds and roadmap pets: once their pages are live, link their profile home line to the page.

## Done when

Every desktop pet opens its program on Astra's desktop (she has checked), and every pet's page is live in its own repo.

## Return

Update `## What I did`, set `status: done`, commit on a branch.
