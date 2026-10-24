# One art source: the plan, 2026-10-17

By Claude Opus 5.5 (`claude-opus-5-5`) for Astra. **Approved by Astra on 2026-10-18**, all four decisions as
recommended, and built the same day: see [What was done](#what-was-done-2026-10-18) at the end. All 36 pull requests
merged on 2026-10-18. **2026-10-24:** copies came back and links still named dated files, so every picture now also has
an address that never changes: see [Addresses that never change](#addresses-that-never-change-2026-10-24).

## What Astra asked

"There should be a place we change these that doesn't affect the rest of the code, like it pulls from that one spot
where the image is hosted every time. Where is this?" (2026-10-17, [pet-art-redesign-20261017.md](pet-art-redesign-20261017.md)).

Today there is no such place: Flash Audit **A58 One art source** (on PR #53) names this hub as the one home, but every
program still keeps its own copy. This plan moves every program onto the hub, so a picture is changed once, here, and
nothing else is edited. The standard term is a **single source of truth for assets**.

## The one place

| What | Where it lives | How programs reach it |
| --- | --- | --- |
| Web frames of registered pets | `art/frames/<pet>/` (built from `art/sheets/` by `npm run build`) | `https://raw.githubusercontent.com/findastra/astras-pet-os/main/<path>` |
| Web frames and sheets of draft pets | **new** `art/drafts/<pet>/` (the build never touches it) | same URL |
| Icons | `art/icons/<repo>-20261012.png` | same URL |
| App icons compiled into Windows programs (`.ico`) | **new** `art/app-icons/<repo>/` | the hub folder next to the repo on Astra's PC, at build time |
| Desktop pets, registered and draft | `desktop-art/<pet>/` (draft pets **move in**) | the desktop pets app reads the hub folder it already runs from |

**Offline fallback.** On Astra's PC every repo sits next to the hub in `Astra's PetOS\`, so a page opened by
double-click tries the web address first and falls back to `../astras-pet-os/<path>` when there is no internet:

```html
<img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/frames/drum-dog/idle.png"
     onerror="this.onerror=null;this.src='../astras-pet-os/art/frames/drum-dog/idle.png'">
```

The address answers with `image/png` and `Access-Control-Allow-Origin: *` (checked 2026-10-17), so pictures also work
in a `<canvas>`. GitHub caches it for 5 minutes: a new picture shows everywhere within 5 minutes of the merge.
The desktop pets show it within 30 seconds: Startup Star's live sync pulls the hub and restarts the star when
`desktop-art/` changes.

## What is copied today (2026-10-17, every findastra repo)

Byte compare by git blob hash of every picture on each repo's default branch against this hub on `main` and on
PR #53. Full list, one row per file (1,252 pictures): `one-art-source-inventory-20261017.csv` in the session notes
folder; the A58 tool below makes the same list on demand.

**Registered pets: the hub already has the picture, the pet repo keeps an identical copy (18 repos, 311 files).**

| Repo | Copies in the repo | Read by |
| --- | --- | --- |
| ghost-protocol | `pet-art/` 9 | `pet-sprite-20261008.json` |
| api-fairy | `art/` 9 | `sprite-20261008.json`, `build.cmd` + `src/Art.cs` (built into the Windows app), page (pictures inlined) |
| findastra-discord-presence | `pet-art/` 9, `desktop-art/discord-damsel/` 10 | `pet-sprite-20261008.json`, `desktop-pet-20261011.json`, page |
| voicemeeter-bug | `bug-*-20261008.png` 9, `desktop-art/` 10 | `pet.json` "sprite", `build-voicemeeter-bug-20261008.ps1`, `voicemeeter-bug-20261008.cs` |
| project-parrot, vscode-angel, drum-dog, portfolio-puffer, finance-finch, health-hummy | `art/` 9, `desktop-art/` 10 each | `sprite-20261008.json`, `desktop-pet-20261011.json`, page (pictures inlined) |
| mommys-mommies | `art/` 9, `desktop-art/mommys-mommies/` 10, `desktop-art/mommys-mommies-interactions/` 10 | same |
| file-master, paper-girl, the-astral-plane, learn-python | `pet-art/` 9, `desktop-art/` 10 each | `pet-sprite-20261008.json`, `desktop-pet-20261011.json` |
| data-dealer (Chip) | `pet-art/` 9, `desktop-art/chip/` 9 | `pet-sprite-20261008.json`, `desktop-pet-20261011.json` |
| unity-unicorn | `art/` 9 | `sprite-20261008.json`, page (pictures inlined) |
| github-goldfish | `art/` 9 | `sprite-20261008.json` |

**Draft pets: the picture is only in the pet repo (15 repos).** The hub reads them from there today
(`make-icons-20261012.mjs` downloads from the pet repos; the desktop reads the pet folders on the PC).

| Repo (pet) | Pictures | Read by |
| --- | --- | --- |
| chat-rat | `desktop-art/` 10, `art/` 10, `icon-20261009.png` + `.ico` | `sprite-20261009.json`, `desktop-pet-20261011.json`, README, `pet.json` "icon", desktop draft list |
| wifi-butterfly | `desktop-art/` 10, `art/` 10, `icon-20261009.png` + `.ico` | `wifi-butterfly-20261009.html`, `sprite-20261009.json`, README, desktop draft list |
| mesh-moth | `desktop-art/` 10, `art/sheets/` 1 | `sprite.json` (pixel rows), README, desktop draft list |
| meme-fiend | `desktop-art/` 10, `art/meme-fiend-20261009.png` | README, desktop draft list |
| rgbee, rift-rabbit, patch-cat, mail-snail, backup-beaver, spoonfed (Sugarcube) | `desktop-art/` 10 and `draft-art/` 10 (the first drafts, older than `desktop-art/`) each | `desktop-pet-20261011.json`, `draft-art/*/manifest-20261011.json`, README, desktop draft list |
| mine-mole | `draft-art/` 10 | manifest, README, desktop draft list |
| deck-duck | `desktop-art/` 10, `art/frames/` 9, `art/sheets/` 1 | `sprite.json`, `scripts/draw-deck-duck-20261009.ps1`, desktop draft list |
| raspberry-berry | `desktop-art/` 10, `art/frames/` 9, roster, sheet | `scripts/draw-berry.mjs` (draws them), `sprite.js`, README, desktop draft list |
| fuzzboi-friend | `art/` 10 | `fuzzboi-friend-20261009.html`, `sprite-20261009.json`; the desktop builds it from the 32 original layers in `findastra/fuzzbois` `site/layers/` |
| astras-gif-maker (Gif Giraffe) | `desktop-art/` 10, `art/frames/gif-giraffe/` 9, sheet, `icon.png` | `sprite.json`, `pet.json` "icon", README, desktop draft list |

**The portfolio** (`findastra.github.io`): `art/icons/` 44 and `art/pets/` 17, all identical to the hub
(`art/pets/<pet>.png` is the hub's `art/frames/<pet>/idle.png`). Read by `cyber.js`, `site-parchment.js`,
`pets-data.js`, and the favicon in `index.html` and `parchment.html`.

**Astra's PC.** The desktop pets app (`astras-pet-os\bin\desktop-pets-20261008.exe`, started with the hub folder)
reads `art/frames/` and `desktop-art/` for 15 registered pets from a list compiled into the program, and
`%LOCALAPPDATA%\astras-pet-apps\desktop-drafts-20261011.json` for 16 draft pets. That list points into 14 pet working
copies (which sit on Codex branches, so the desktop shows whatever is checked out there) and into
`%LOCALAPPDATA%\astras-pet-apps\drafts-20261011\` (clones of astras-gif-maker, fuzzboi-friend and fuzzbois).

**Not pet pictures (they stay where they are):** program-page screenshots (`docs/images/*-program-page-*.png`,
Flash Audit A55), Discord presence images (`galaxy*`, tray icons), Unity Unicorn's avatar photos, world textures
(astras-infinite-pole, piranesi-house), program logos (`ai_astra_logo.png`, Data Dealer's `logo.svg`), Paper Girl's
site art, the profile's `socials/`, the portfolio's `art/projects/`, `art/worlds/` and `avatar.jpg`, and the Fuzzbois
art project itself (`findastra/fuzzbois`, apart from the 32 layers in decision 3).

## What changes

**This hub** (one PR, `claude/one-art-source-20261017`, stacked on PR #53 so it carries the redesigned art):
1. Draft pets' desktop frames and sheets move into `desktop-art/<pet>/` (15 pets), with their
   `desktop-pet-20261011.json` and prompts; their web frames and sheets into `art/drafts/<pet>/`; app icons into
   `art/app-icons/<repo>/`. The redesign's newer art (PRs meme-fiend#3, rgbee#3, mesh-moth#3, wifi-butterfly#3,
   chat-rat#6) is what moves in.
2. Desktop pets app (`scripts/desktop-pets-20261011.cs`): every pet with `desktop-art/<pet>/idle-20261011.png` uses
   it (no compiled list of 15); draft entries take paths **relative to the hub folder**, checked by the existing
   `PetFiles.SafePath` (nothing outside the hub). Only an entry marked `"private": true` may name a file outside the
   hub: Claude Bot. Fuzzboi Friend's layer recipes become relative too.
3. `scripts/prepare-desktop-drafts-20261011.mjs` writes the draft list from `desktop-art/` (it still reads the old
   `Documents\Projects` folder today). `make-icons-20261012.mjs` reads `desktop-art/` and `art/drafts/` here instead
   of downloading from pet repos.
4. **A58 tool** `scripts/one-art-source-20261017.mjs` (read-only, Node built-ins): asks GitHub for every findastra
   repo's tree, lists every picture that is also in this hub (same bytes) or that looks like pet art outside it, and
   checks the desktop draft list; it reports Correct only when the copies left are the documented exceptions.
   A test with fixture trees guards it. A58's text in `docs/flash-audit-20261014.md` points to it.
5. `docs/flash-audit-20261014.md` A58, `PET-FILES.md` and AGENTS.md: "pictures live only here; repos link to them".

**Each pet repo** (one PR each, `claude/one-art-source-20261017`; where a redesign PR is open, stacked on it):
- Delete the copied pictures (`art/`, `pet-art/`, `desktop-art/`, `draft-art/`, icon files).
- `sprite*.json` and `pet-sprite-*.json` keep their place (the Goldfish checks that `pet.json` "sprite" exists) and
  list hub addresses instead of local paths. Voicemeeter Bug gets a `sprite-20261008.json` the same way.
- `desktop-pet-20261011.json` moves into the hub next to the pictures it describes; the repo's README links to it.
- Pages show the pet from the hub address with the sibling-folder fallback, including the pages that today carry the
  pictures inlined as base64 (decision 4). README pictures use the hub address.
- Windows programs (API Fairy's `build.cmd`, Voicemeeter Bug's build script) read the frames and `.ico` from
  `..\astras-pet-os\` at build time and stop with a clear message when the hub folder is missing.
- Pets drawn by code (Raspberry Pi Berry, Deck Duck, Mesh Moth, GitHub Goldfish's pixel sprite, Chip) keep their
  drawing code: code is not a picture. Their drawing scripts write the PNGs into `../astras-pet-os/art/drafts/<pet>/`
  instead of their own repo.

**The portfolio**: `art/icons/` and `art/pets/` are deleted; the pages use hub addresses. It is a hosted site, so no
offline fallback. Merge after the hub.

**Astra's PC** (after the hub PR is merged and live sync has pulled it): run the new
`prepare-desktop-drafts-20261011.mjs` (writes the draft list with hub paths; Claude Bot keeps his private path),
rebuild the star with `build-desktop-pets-20261011.ps1` (the program changed) and restart it. The old
`drafts-20261011\` clones are then unused; they are left in place for Astra to delete (agents never delete).
Folder icons in `%LOCALAPPDATA%\astras-pet-apps\folder-icons\` are a build output made from `art/icons/`
(Windows needs a local `.ico`), like `art/frames/` is made from `art/sheets/`; `set-folder-icons-20261017.ps1`
reads only the hub.

## Exceptions, written down

- **Claude Bot** (Astra, 2026-10-17): his exact copy of ChatGPT's BSOD stays only in the private `claude-bot` repo.
  The hub keeps the earlier orange-screen twin icon (`art/icons/claude-bot-20261012.png`) and says so. The desktop
  draft list's Claude Bot entry is the one path outside the hub, marked `"private": true`.
- **Build outputs inside the hub** (`cage-data.js`, `system-map-20261012.html`, `apps/*.html`, `art/roster.png`,
  `art/frames/`) carry pictures made from the one source by `npm run build`. They are rebuilt, never edited: not copies.

## Decisions for Astra

| # | Question | Recommended | Other choice |
| --- | --- | --- | --- |
| 1 | Approve the design above (hub only, web address, sibling-folder fallback, PR per repo) | Yes | Change something first |
| 2 | The first drafts in `draft-art/` (older than `desktop-art/`, 6 pets; Mine Mole has only these, so they move in) | Not moved: they stay in each repo's git history, and the README links to that commit | Keep them in the hub as `desktop-art/<pet>/first-draft/` |
| 3 | Fuzzboi Friend's 32 original layers (in `findastra/fuzzbois`) | Move into `desktop-art/fuzzboi-friend/layers/`; the Fuzzbois site loads them from the hub too (one copy) | Leave them in `fuzzbois` as a second written exception; the desktop reads that folder |
| 4 | Pet pages that carry their pictures inlined (base64, 14 pages) | Load from the hub address, with the fallback | Keep them inlined, rebuilt from the hub (a copy that a rebuild refreshes) |

## Order

1. This hub PR (after PR #53, which it is stacked on).
2. The pet repo PRs, each after its own redesign PR where one is open. They can merge in any order after step 1.
3. The portfolio PR (after `findastra.github.io#3`).
4. On the PC: draft list, rebuild, restart (an assistant does it once Astra has merged step 1).
5. A58 run: no copies left except Claude Bot.

## What was done (2026-10-18)

Astra: "Approved: the one-art-source plan in PR #58, with all four decisions as recommended. Go ahead and build it."
By Claude Opus 5.5 (`claude-opus-5-5`). Work in scratchpad clones only; nothing merged.

**This hub** (PR #58, branch `claude/one-art-source-20261017`, built on PR #60's branch `claude/girls-same-size-20261017`,
which holds main with #53 and the group 3 sizes; merge #60 first):
- `desktop-art/<pet>/` for the 15 draft pets, `art/drafts/<pet>/` (draft web frames and sheets), `art/app-icons/<repo>/`
  (5 repos), `desktop-art/fuzzboi-friend/layers/` (32 layers) and its 858 recipes, and every pet's
  `desktop-pet-20261011.json`. Copied from each repo's base branch and checked byte for byte.
- Desktop pets app: draft pictures resolve inside the hub folder (`PetFiles.DraftPath`); only `"private": true` may
  name a file outside it (Claude Bot). A draft that cannot load is skipped and named in the status file
  (`draft_errors`) instead of stopping every pet. `ASTRAS_PET_DRAFTS` points at another list for tests. Self-test
  PASS with the new list and with today's old list; preview shows all 16 draft pets; a public path outside the hub is
  refused.
- `prepare-desktop-drafts-20261011.mjs` writes hub-relative paths and names from `pet-programs.json`;
  `make-icons-20261012.mjs` reads hub files only.
- **The draft list moved into the hub** (`desktop-art/desktop-drafts-20261018.json`, committed, guarded by
  `test/desktop-drafts-test-20261018.mjs`). The Startup Star session showed on 2026-10-18 that a program started
  inside the Claude or Codex app reads and writes that app's private copy of `%LOCALAPPDATA%`
  (`%LOCALAPPDATA%\Packages\Claude_…\LocalCache\Local\…`). So the old list, the temporary pointer and the folder icons
  were never seen by the star Windows starts at sign-in, and no Claude session can write the real one. The hub
  folder is in Documents, which is not redirected, so every star now reads the same list.
  - Claude Bot's entry names only his repo (`"repo": "claude-bot"`). The app looks for his pictures in that folder next
    to the hub, or one level down in `claude-bot-draft-art-20261011` (where they are on Astra's PC), and never outside it.
  - The old `%LOCALAPPDATA%` list is read only while the hub has no list.
  - Self-test PASS. The preview shows all 16 draft pets, Claude Bot included, read through his repo folder.
- `scripts/one-art-source-20261017.mjs` (A58 check) and `test/one-art-source-test-20261017.mjs`. `npm test`: all pass.
- PET-FILES.md "Where the pictures live", AGENTS.md rule, A58 text, a note on card 030, card 032 for the PC steps.

**Not as planned:**
- The desktop app still has its compiled list of 15 registered pets that use `desktop-art/`: Ghost Protocol has desktop
  art in the hub that is deliberately unused ("Ghost uses original body", docs/pet-release-20261011.md), so making it
  automatic would change what the desktop shows.
- `make-icons` was not run for real: from the same pictures it would change 6 committed icons (the redesign made those
  by hand), so `art/icons/` is untouched.

**Pet repos, one PR each** (branch `claude/one-art-source-20261017`; merge after #58):

| Repo | PR | Built on | Files removed |
| --- | --- | --- | --- |
| drum-dog | [#3](https://github.com/findastra/drum-dog/pull/3) | main | 20 |
| ghost-protocol | [#5](https://github.com/findastra/ghost-protocol/pull/5) | main | 10 |
| api-fairy | [#4](https://github.com/findastra/api-fairy/pull/4) | its #3 (group 3 sizes) | 11 |
| findastra-discord-presence | [#6](https://github.com/findastra/findastra-discord-presence/pull/6) | its #5 | 20 |
| voicemeeter-bug | [#2](https://github.com/findastra/voicemeeter-bug/pull/2) | master | 21 |
| project-parrot | [#3](https://github.com/findastra/project-parrot/pull/3) | main | 20 |
| vscode-angel | [#4](https://github.com/findastra/vscode-angel/pull/4) | its #3 | 20 |
| portfolio-puffer | [#3](https://github.com/findastra/portfolio-puffer/pull/3) | main | 20 |
| finance-finch | [#3](https://github.com/findastra/finance-finch/pull/3) | main | 20 |
| health-hummy | [#3](https://github.com/findastra/health-hummy/pull/3) | main | 20 |
| mommys-mommies | [#4](https://github.com/findastra/mommys-mommies/pull/4) | its #3 | 30 |
| file-master | [#6](https://github.com/findastra/file-master/pull/6) | main | 21 |
| paper-girl | [#2](https://github.com/findastra/paper-girl/pull/2) | main | 21 |
| the-astral-plane | [#5](https://github.com/findastra/the-astral-plane/pull/5) | its #4 | 20 |
| learn-python | [#4](https://github.com/findastra/learn-python/pull/4) | main | 20 |
| data-dealer | [#3](https://github.com/findastra/data-dealer/pull/3) | main | 19 |
| unity-unicorn | [#5](https://github.com/findastra/unity-unicorn/pull/5) | main | 9 |
| github-goldfish | [#16](https://github.com/findastra/github-goldfish/pull/16) | main | 10 |
| chat-rat | [#7](https://github.com/findastra/chat-rat/pull/7) | main | 23 |
| wifi-butterfly | [#4](https://github.com/findastra/wifi-butterfly/pull/4) | main | 23 |
| mesh-moth | [#4](https://github.com/findastra/mesh-moth/pull/4) | main | 12 |
| meme-fiend | [#4](https://github.com/findastra/meme-fiend/pull/4) | main | 12 |
| rgbee | [#4](https://github.com/findastra/rgbee/pull/4) | main | 23 |
| rift-rabbit | [#3](https://github.com/findastra/rift-rabbit/pull/3) | main | 23 |
| patch-cat | [#3](https://github.com/findastra/patch-cat/pull/3) | main | 23 |
| mail-snail | [#3](https://github.com/findastra/mail-snail/pull/3) | main | 23 |
| backup-beaver | [#3](https://github.com/findastra/backup-beaver/pull/3) | main | 23 |
| spoonfed | [#2](https://github.com/findastra/spoonfed/pull/2) | main | 23 |
| mine-mole | [#3](https://github.com/findastra/mine-mole/pull/3) | main | 12 |
| deck-duck | [#3](https://github.com/findastra/deck-duck/pull/3) | main | 21 |
| raspberry-berry | [#4](https://github.com/findastra/raspberry-berry/pull/4) | main | 22 |
| fuzzboi-friend | [#3](https://github.com/findastra/fuzzboi-friend/pull/3) | main | 11 |
| astras-gif-maker | [#2](https://github.com/findastra/astras-gif-maker/pull/2) | main | 22 |
| fuzzbois (the 32 layers) | [#1](https://github.com/findastra/fuzzbois/pull/1) | main | 33 |
| findastra.github.io (portfolio) | [#6](https://github.com/findastra/findastra.github.io/pull/6) | its #4 | 61 |

Each pet repo PR: copies deleted; sprite JSON, README pictures, `pet.json` and pages use the hub address; 14 pages
that carried their pictures inlined (base64) now load them from the hub (an older inlined copy was matched to the
hub's frame for the same mood); every page got the offline fallback to `../astras-pet-os/`; AGENTS.md says where the
pictures live. First drafts in `draft-art/` (6 pets) are only in each repo's history; README links point there.

**Tested:**
- API Fairy's `build.cmd` and Voicemeeter Bug's build read from the hub folder next to them, in a path with spaces
  and an apostrophe; both executables carry all nine frames.
- `draw-berry.mjs`, the Deck Duck drawing script and the Fuzzbois recipe export write byte-identical files into the
  hub.
- In the browser pane, with the hub as a sibling folder:
  - Drum Dog's page loads its frames from the hub address.
  - Wifi Butterfly's and Fuzzboi Friend's pages fall back to the hub folder (their hub addresses exist only after #58).
  - The Fuzzboi Forge loads all 32 layers from the hub.
  - The portfolio's main page shows 109 hub pictures and its parchment page 17, none broken.
- Goldfish (59) and Discord presence (68) tests pass.

**A58 run** (`node scripts/one-art-source-20261017.mjs --branch claude/one-art-source-20261017`, all 96 findastra
repos with a token, draft list as `prepare-desktop-drafts` writes it): **Correct**. The only pictures outside the hub
are Claude Bot's 20, the written exception. The same check on today's `main` reports 674 pictures in 35 repos, and 16
draft pets read from outside the hub.

## Not done

- **Nothing is merged.** Merge order:
  1. #60.
  2. This PR (#58).
  3. The pet repo PRs, each after the PR it is built on.
  4. The portfolio (#6, after its #4).
  5. Fuzzbois.
- **Astra's PC** waits on card 032. After #58 is on main and live sync has pulled it:
  1. An assistant rebuilds the desktop pets app (together with card 031). The exe is in Documents, so that works
     from any session.
  2. Astra restarts the star herself, or signs out and in, so it runs outside the Claude and Codex apps.
  3. Claude Bot's repo folder is brought up to `claude-bot` main, with Astra's OK.

  No `%LOCALAPPDATA%` write is needed any more. The old lists, the `drafts-20261011\` clones and the temporary
  `desktop-art-main-20261018\` folder, all in the apps' private copies, become unused; they are left for Astra to delete.
- Unity Unicorn, Gif Giraffe and group 1 still wait on card 030. When Codex redraws them, the new pictures go into this
  hub only.
- Platform Platypus's `index.html` names `icon-180.png` and `art/icons/astras-pet-os-20261012.png`, which its repo does
  not have. That is a broken link, not a copy, so it is left for that pet's chat.

## Addresses that never change (2026-10-24)

Astra, 2026-10-24: "All of these pet icons should have their own hosted spot online somewhere, where anything can
update them. So that I dont have to keep doing them individually, and getting caught versions behind." Her answers to
the six questions (deck "One home for pet pictures"): **all recommended**.

**What was wrong (checked 2026-10-24).** All 36 pull requests above merged, but the checker found 102 pictures back in
six repos (findastra.github.io 61, the-astral-plane 19, vscode-angel 19, lunas-log, spoonfed and fuzzboi-factory one
each), from a picture round on 2026-10-18 that changed them while those pull requests were open. Nothing ran the
checker, so nobody saw. Every one of the 419 links to hub pictures in 34 repos named the newest drawing, but by its
dated name (`idle-20261009.png`): each new drawing meant editing every link, repo by repo. And while the hub was
private (2026-10-20 to 2026-10-21) no hosted picture loaded at all.

**The six answers.**

| # | Question | Answer |
| --- | --- | --- |
| 1 | Where the pictures live | This hub, which stays public while it holds them; the checker fails when it is private |
| 2 | Which web address | GitHub raw, `https://raw.githubusercontent.com/findastra/astras-pet-os/main/`, which every repo already uses |
| 3 | Names that never change | `art/latest/`, made by `npm run build`; the one exception to the date in every file name, for files only the build writes |
| 4 | The copies in six repos | Removed, one pull request per repo |
| 5 | Where the checker runs | The hub's tests for the hub, and a daily check of every repo on Astra's PC, shown in GitHub Aquarium's outstanding items |
| 6 | The desktop pets' copy on the PC | A pictures-only copy that Startup Star's live sync keeps exactly like GitHub, read while the hub folder is held back |

**The address scheme.** `https://raw.githubusercontent.com/findastra/astras-pet-os/main/` plus:

| Pictures | Address | Made from |
| --- | --- | --- |
| Web frames of registered pets | `art/latest/frames/<pet>/<mood>.png` | `art/frames/<pet>/` (nine pets' frames are dated, like `idle-20261008.png`) |
| Moods of desktop-art pets, with stickers | `art/latest/moods/<folder>/<mood>.png` | `art/moods/<folder>/` |
| Icons | `art/latest/icons/<repo>.png` | `art/icons/<repo>-YYYYMMDD.png` |
| App icons | `art/latest/app-icons/<repo>/<name>` | `art/app-icons/<repo>/<name>-YYYYMMDD.<ext>` |
| Draft pets' frames and sheets | `art/latest/drafts/<pet>/<name>.png` | `art/drafts/<pet>/<name>-YYYYMMDD.png` |
| Desktop art | `art/latest/desktop-art/<pet>/<name>.png` | `desktop-art/<pet>/<name>-YYYYMMDD.png` |

One rule: `art/latest/` + the picture's folder and name without its date; the newest date wins. `art/latest/index.json`
lists every stable path and the drawing it shows now (981 pictures on 2026-10-24). Links to undated pictures in
`art/frames/` and `art/moods/` keep working and are never flagged. git stores each picture once, so the copies cost the
repo nothing (about 90 MB on disk in a checkout). Offline, a page falls back to `../astras-pet-os/<the same address>`. To change a picture: add the new
drawing with a new date, run `npm run build`, merge. Every link shows it within 5 minutes; nothing else is edited.

**Tools.**
- `scripts/one-picture-home-20261024.mjs`: makes `art/latest/` (called by `npm run build`), and
  `--fix <file>...` / `--check <file>...` rewrite or list a file's dated picture links.
- `scripts/one-art-source-20261017.mjs` now also fails on a private hub and, with `--links`, on any repo's link to a
  dated picture (the hub's records in `changes/`, `handoffs/` and `docs/` keep theirs). `--save` writes the result to
  `Documents\Astra's PetOS Data\one-art-source\one-art-source-check.json` on Astra's PC only, since it names private
  repos; `npm run outstanding-items` shows it (a private hub as broken; copies and dated links as waiting on a chat; a
  check older than two days as a reminder).
- `test/one-picture-home-test-20261024.mjs`: `art/latest/` matches its drawings byte for byte, and no hub page or
  note outside the records links a dated picture.
