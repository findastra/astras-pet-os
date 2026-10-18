# Flash Audit A11: does clicking each pet open its program? (2026-10-18)

*Flash Audit [A11 Desktop launch](flash-audit-20261014.md), with the two checks it rests on, [A10 Website route] and [A59
Pet program and its link]. Asked for by Astra on 2026-10-18 ("whether clicking on each pet opens its program or the website
it manages, and fix it automatically"), with a second request: "create pet programs for all of the rest that don't have
pages and model them after the Platform Platypus". Run by Claude Opus 5.5 (`claude-opus-5-5`). Owner: GitHub Goldfish
(GitHub Aquarium); the page tool belongs to The Farm.*

[A10 Website route]: flash-audit-20261014.md
[A59 Pet program and its link]: flash-audit-20261014.md

## How it was checked

- Hub `main` at `9d0622d`, merged into this branch. What a double-click opens comes from `scripts/desktop-pets-20261011.cs`
  (`OpenPet`): `interface_url` in `pets.json` for a registered pet, `interface` in
  `desktop-art/desktop-drafts-20261018.json` for a draft pet, and Voicemeeter Bug's own exe.
- Every pet's repo through `git ls-remote` and a shallow clone of `main` (read only), and every route and
  `https://findastra.github.io/<repo>/` fetched as a visitor. No token, nothing signed in, nothing launched.
- **Not verified:** the double-click itself on Astra's desktop (A11 is 🔵: it needs her there), and pages behind a sign-in.

## What a double-click opened, before and after

| Desktop pets | Before | After (this branch) |
|---|---|---|
| Paper Girl Patty, Gone Ghost, Platform Platypus | their own live site | unchanged |
| The 16 other registered pets | their app's copy in the hub's `apps/` | unchanged: a working page (the 📦 drift between the copy and the pet's repo remains, INTELLIGENCE-LEVELS.md) |
| Voicemeeter Bug | his exe in `Documents\ChatGPT\Voicemeeter Bug\`; nothing at all when it is not there (it is not on this PC) | his exe in his own repo folder next to the hub first, then the old folder; with neither, his page `apps/voicemeeter-bug-20261008.html` |
| **16 draft pets** (Claude Bot, RGBee, Mine Mole, Mail Snail, Patch Cat, Backup Beaver, Rift Rabbit, Wifi Butterfly, Chat Rat, Deck Duck, Raspberry Pi Berry, Meme Fiend, Fuzzboi Friend, Gif Giraffe, Mesh Moth, Sugarcube) | **a GitHub repo page, not a program (A10 Incorrect)** | Fuzzboi Friend: his live site. RGBee, Mine Mole, Wifi Butterfly, Raspberry Pi Berry: a bundled copy of their own page. The other 11: their new pet program page. All in `pets.json` (`interface_url`), and the draft list takes them from there |

The cause was one line: `scripts/prepare-desktop-drafts-20261011.mjs` wrote `https://github.com/findastra/<repo>` as every
draft's `interface`. It now takes the pet's `interface_url`, else its page from the new tool.

## Pets with no program page, and the pages made for them

`scripts/pet-program-pages-20261018.mjs` (the Friendly Farmer's pet-program-pages tool) writes a page for every numbered pet
that has none of its own, modeled on Platform Platypus's page (Mirror Pool): the pet in its well with its mood bubble, the L3
activity bubble, a quick summary and status line, its four intelligence levels, the pets it works with, links by kind, then
the shared shell copied from Platform Platypus (`scripts/pet-program-shell-20261018.html`: yellow phone, Your Notes, Your
Tutorials, Clicker Training, About, paper, mood key, footer). The facts come from `pet-programs.json`, `pets.json` and
`system-map.json`; pictures come from the hub (A58). Each page says plainly that nothing else is built.

| Pets | Their page | In their own repo |
|---|---|---|
| 46 seeds and roadmap pets (#37 to #82), Claude Bot (#21), Role Fairy (#83) | `apps/<repo>-20261018.html` | `index.html` written, **not pushed**: waiting for Astra (below) |
| Mail Snail, Patch Cat, Rift Rabbit, Deck Duck, Meme Fiend, Backup Beaver, Mesh Moth (placeholder on `main`; Codex's framework page waits in a pull request or branch), Chat Rat (page in chat-rat#1), Sugarcube (app on a held-back branch), Gif Giraffe (placeholder) | `apps/<repo>-20261018.html`, pointing at the fuller page on its way | not touched, so their pull requests do not get new conflicts |
| RGBee, Mine Mole, Wifi Butterfly, Raspberry Pi Berry (a real page on `main`, not on GitHub Pages) | bundled copy, `apps/<repo>-20261018.html`, with the source commit in its first line | already there |

`node scripts/pet-program-pages-20261018.mjs --check` and `test/pet-click-targets-test-20261018.mjs` keep the pages up to
date, and fail when any pet's click goes to a GitHub repo page or a missing file.

## Exceptions (Flash Audit format: only Missing, Incorrect and Not verified)

| Check | Pets | Status | Finding | Next |
|---|---|---|---|---|
| A11 | all 36 desktop pets | Not verified | Fixed in data and code; the star on Astra's PC still runs the old exe and the old draft list until it is rebuilt | Rebuild with card 032's steps, then Astra starts the star and double-clicks a few pets (🔵) |
| A10 | the four bundled pets now, and the 48 above once their pages are pushed | Missing | `https://findastra.github.io/<repo>/` answers 404: GitHub Pages is not on for those repos | Astra switches Pages on (Settings, Pages, Deploy from a branch, `main`, `/`), or says which ones |
| A59 | 46 seeds and roadmap pets | Missing | Their program page is in the hub, not yet in their own repo; the profile line still links home to the repo | Push the pages (needs Astra: these repos are not animals yet) |
| A59 | the 16 registered pets with hub copies | Incorrect (known 📦) | The desktop opens the hub's copy, not the program in its own repo | Point each at its own live page once Pages is on |
| A56 | Voicemeeter Bug | Incorrect | His exe was looked for only in `Documents\ChatGPT\` | Fixed in the desktop source; his working copy belongs in `Documents\Astra's PetOS\voicemeeter-bug` |

## What waits on Astra

1. **Push the 48 repo pages?** Written and checked in temporary clones; the hub tool makes them again exactly
   (`--repo <repo> <dir>`). 46 of those repos are seeds and roadmap pets, which the animal guard does not count as animals,
   so an agent writes there only with her OK. The safety check in this session also stopped the push as a new public page.
2. **GitHub Pages** for those repos, so each pet's page is live at its own address.
3. **Rebuild and restart the star**, then the double-click check (A11).
