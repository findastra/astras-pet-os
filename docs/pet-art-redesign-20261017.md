# Pet art redesign, 2026-10-17

By Claude Opus 5.5 (`claude-opus-5-5`) for Astra. Every picture here is a **draft until Astra approves it**.

## What Astra asked

From a screenshot of the desktop pets in four groups (2026-10-17):

- **Group 1** (Finance Finch, Health Hummy, File Master, Paper Girl): least favourite, redesign.
- **Group 4** (Deck Duck, Raspberry Pi Berry, Sugarcube, Rift Rabbit, Drum Dog, GitHub Goldfish, Patch Cat, Mine Mole,
  Fuzzboi Friend, Project Parrot, Gone Ghost, Mail Snail, Portfolio Puffer, Chip, Backup Beaver): favourite, do not edit.
- **Group 2:** rat a little too big; unicorn should look more like group 4; bee too dark, brighter and less round;
  butterfly's face cannot be seen; moth the same as bee and butterfly; Voicemeeter Bug is fine; fox needs a cute face
  like group 4; giraffe should sit on its bottom facing forward like the other mammals.
- **Group 3** (Friendly Farmer, Discord Damsel, API Fairy, VSCode Angel, Astra Wisp): bodies set to Mommy's Mommies'
  ratio; their designs are fine.
- **Claude Bot** must look exactly like ChatGPT's BSOD pet: "other rules dont apply to him, we need an exact replica".
- Push the changes to every repo, say where the one place is that every program takes its picture from, and put that
  into the Flash Audit.

Her answers to the follow-up questions: "like group 1" for the unicorn and fox meant **group 4**; group 1 is redrawn
**in group 4's style**; Claude Bot's exact copy lives in **`findastra/claude-bot`, made private**, and this public hub
keeps the earlier orange twin; the art is **split**: pixel edits by Claude now, full redraws by Codex's image
generator (card 030).

## What changed

All edits are on the existing 256px frames, so each pet keeps its approved body and expressions except where noted.
Made with Python 3.13 and Pillow in a scratch folder (not committed: this repo uses Node built-ins only); each step
is described here so it can be redone.

| Pet | Change | How |
| --- | --- | --- |
| Chat Rat | Smaller on the desktop: 0.8 (was 0.9). | `scripts/desktop-pets-20261011.cs` size table; chat-rat `desktop-pet-20261011.json`. Art unchanged. |
| RGBee | Brighter, less round. | The dark grey body fill (not the black outline, eyes or rainbow bands) mapped onto a bee-yellow ramp whose smallest channel stays above 50, so the desktop app still cycles only the bands. Then redrawn 12% narrower and 8% taller about the feet (nearest neighbour). |
| Mesh Moth | Brighter, less round. | Blue fur and antennae lifted 34% toward white (sky blue); the grey static wings raised to silver (pure black specks and outlines kept). Same 12% / 8% reshape. `sprite.json` rebuilt from the new sheet with `scripts/sheet-to-sprites.mjs --size 64`. |
| WiFi Butterfly | Face visible. | Six moods had a dark grey head; the sick, alarmed and sleep frames already had an orange one. The grey head disc is recoloured onto that orange. |
| Meme Fiend | Cute idle face. | The idle frame's half-lidded eyes, raised brow and smirk painted out with the surrounding fur and cheek colours; drawn in: two dark rounded eyes with a white highlight, pink blush, a small cat mouth under the unchanged nose. The other eight moods already had round or closed eyes. |
| Friendly Farmer | Mommy's ratio. | Mommy's Mommies: head 72px (hair top to chin), body 106px, so body = 1.47 heads. Farmer was 1.26: torso and legs lengthened by row repeats (no new colours), 15 rows. |
| Discord Damsel | Mommy's ratio. | Was 0.95: the skirt lengthened (bodice and controller unchanged) into a longer gown, then the figure scaled to fit the frame (0.958). |
| API Fairy | Mommy's ratio. | Was 0.94: torso x1.8, legs x1.75, scaled to fit (0.965). Her mood stickers were kept in place, and her source sheet has none (the build stamps them). |
| VSCode Angel, Astra Wisp | None. | Already at Mommy's ratio: 1.62 and 1.50. |
| Claude Bot | Exact copy of BSOD, orange screen. | BSOD's own v2 sprite sheet from the installed ChatGPT/Codex app (`webview/assets/bsod-spritesheet-v5-*.webp`, read in place, never committed here). Moods: idle r0c0, blink r0c2, happy r4c3, curious r6c0, worried r6c3, sad r5c0, sick r5c3, alarmed r5c2, sleep r0c2 with the screen at 78%. Each 192x208 cell placed 1:1 on a 256px frame; only pixels in BSOD's blue hue band turned to Claude Bot's orange (#FD7A01). Outline and alpha are identical to BSOD's. Only in the private `claude-bot` repo. |
| Unity Unicorn, Gif Giraffe, group 1 | Not yet. | Full redraws: card 030 (Codex's image generator). |

Stray slivers of the neighbouring sheet cell (thin upright lines at the frame edge) were removed from the fox and
butterfly frames. Nothing else was cleaned.

## Where the pictures live: the one place

Astra: "there should be a place we change these that doesn't affect the rest of the code, like it pulls from that one
spot where the image is hosted every time. where is this?"

**Today there is no single place.** Each pet's picture is copied into up to five places, and they drift apart:

1. This hub: `art/sheets/` (generated source sheets), `art/frames/` (built web frames), `art/icons/` (96px icons),
   `desktop-art/<pet>/` (desktop frames for 15 pets).
2. Each pet's own repo: `desktop-art/<pet>/`, `art/` or `pet-art/`, `draft-art/`, icon files.
3. The portfolio (`findastra.github.io`): `art/icons/`, `art/pets/`.
4. Astra's PC: the desktop pets app reads the hub's folder for registered pets, and for 16 draft pets
   `%LOCALAPPDATA%\astras-pet-apps\desktop-drafts-20261011.json`, which points into the pet repos' working copies.
5. Folder icons: `%LOCALAPPDATA%\astras-pet-apps\folder-icons\` (made from `art/icons/`).

On 2026-10-17 the copies were byte-identical mirrors of the hub's files (the web art of several pets is still an older
design than their desktop art). **The one place should be this hub's `art/` and `desktop-art/` folders**, published
at `https://raw.githubusercontent.com/findastra/astras-pet-os/main/<path>`: programs and pages load the picture from
there instead of keeping a copy, so changing it once changes it everywhere without touching code. The standard term is
a single source of truth for assets. Flash Audit check **A58 One art source** now reports every copy and every
difference. Moving each repo and the desktop app onto it is the next piece of work; this redesign still updated
every copy so nothing shows the old art in the meantime.

## Pull requests (none merged)

| Repo | PR | What |
| --- | --- | --- |
| astras-pet-os | this branch, `claude/pet-art-redesign-20261017` | Farmer, Damsel and API Fairy sheets and frames, desktop art, 7 icons, roster, rat size, A58, card 030, this record |
| meme-fiend | [#3](https://github.com/findastra/meme-fiend/pull/3) | desktop art, README picture |
| rgbee | [#3](https://github.com/findastra/rgbee/pull/3) | desktop art |
| mesh-moth | [#3](https://github.com/findastra/mesh-moth/pull/3) | desktop art, source sheet, sprite.json |
| wifi-butterfly | [#3](https://github.com/findastra/wifi-butterfly/pull/3) | desktop art, page frames, mood sheet, app icon |
| claude-bot (private) | [#2](https://github.com/findastra/claude-bot/pull/2) | BSOD copy, art notice, AGENTS rule |
| findastra-discord-presence | [#4](https://github.com/findastra/findastra-discord-presence/pull/4) | desktop art, pet-art |
| api-fairy | [#2](https://github.com/findastra/api-fairy/pull/2) | page frames, app icon |
| chat-rat | [#6](https://github.com/findastra/chat-rat/pull/6) | desktop size |
| findastra.github.io | [#3](https://github.com/findastra/findastra.github.io/pull/3) | icons and pet pictures (merge after the hub) |

## Not done

- **Unity Unicorn, Gif Giraffe and group 1** wait on card 030.
- **Astra's desktop still shows the old pets** until the hub's change reaches the hub folder on her PC (it is on a
  Codex branch), `build-desktop-pets-20261011.ps1` is run (the rat's size is compiled in), the draft pets' repo folders
  have the merged art, and the desktop pets app restarts. Then `set-folder-icons-20261017.ps1` refreshes folder icons.
- `art/icons/claude-bot-20261012.png` stays the earlier twin; `make-icons` no longer fetches Claude Bot (private repo).
- Generated files (`cage-data.js`, `system-map-20261012.html`, `art/roster.png`) will conflict with any other branch
  that rebuilt them; whoever merges second runs `npm run build` again.
- Links to `github.com/findastra/claude-bot` in this hub's docs now show 404 to visitors (private repo).
- A58 is a check, not a migration: switching each repo to the hub source is separate work.
