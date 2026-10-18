# One art source: the plan, 2026-10-17

By Claude Opus 5.5 (`claude-opus-5-5`) for Astra. **A plan, waiting on Astra's OK.** Nothing below is built yet.

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

## Not done

Everything: this is the plan. Unity Unicorn, Gif Giraffe and group 1 still wait on card 030; when Codex redraws them,
the new pictures go into this hub only.
