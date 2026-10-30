status: taken by Codex pet-art-review-20261030
for: codex
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-17
needs: docs/pet-art-redesign-20261017.md, desktop-art/*/prompt-20261011.md (the prompt format), PET-FILES.md ("Making or redoing a pet's art"), handoffs/018-any-curious-faces-and-hummy-beak-20261017.md
---
## What I did

### Current artwork review, 2026-10-30

Astra requested a proposal for every pet, missing artwork, and repairs using her favorite existing pets as references. This explicitly resumes and expands the redraw task. State: IN_PROGRESS. Implementer: Codex, branch `codex/pet-art-review-20261030`. Write scope: this card, `art/drafts/art-review-20261030/`, dated review scripts and docs, and `changes/pet-art-review-20261030.md`. Existing production art, runtime, registry, and `art/latest/` remain outside the proposal scope. Reviewer: Codex independent rules/art review subagent, read-only.

The current main list contains 84 pets; the Reactor Raccoon proposal is separately pending. The live checkout is clean at `e7bdc5b02d345a94ea2d183922fd5314273f364b`. Earlier art and open branches are being checked before replacements. The owner named Deck Duck, Drum Dog, Spoonfed Sugarcube, Mommy's Mommies, GitHub Goldfish, Rift Rabbit, Mail Snail, Raspberry Pi Berry, Friendly Farmer, Gone Ghost, Mine Mole, Patch Cat, Backup Beaver and Chat Rat as favorites. Preserve these as references and recommend keeping good art. Data Chip's original renderer and Claude Bot's private exception remain intact.

Acceptance: one explicit keep/repair/new-art recommendation for every listed pet; proposed art visibly reviewed at desktop size; nine moods checked where a replacement sheet is delivered; unclipped alpha bounds and consistent registration; prompts and provenance saved; draft status truthful. Final adoption requires Astra's visual approval. The original notes below are historical: superseded distributed-copy instructions do not apply to the current single art source.

Astra's 2026-10-17 art round (full request in [docs/pet-art-redesign-20261017.md](../docs/pet-art-redesign-20261017.md)).
I made the pixel edits on branch `claude/pet-art-redesign-20261017` of this repo and of eight pet repos (PRs listed in
that record, none merged): rat smaller, RGBee and Mesh Moth brighter and less round, WiFi Butterfly's face orange,
Meme Fiend's idle face cute, Farmer, Discord Damsel and API Fairy at Mommy's Mommies' body ratio, Claude Bot an exact
BSOD copy in the now-private `claude-bot` repo. Astra chose to split the work: **the full redraws below need an image
generator**, which Claude does not have. Nothing on this card has been started.

## Task

Redraw six pets with your built-in image generation (the tool that made the 2026-10-11 desktop art; `generate-pets.mjs`
needs OpenAI API credits, card 018). Astra's words: group 1 "is my least favorite", "unicorn needs to look more like
group 4", "giraffe needs to sit on butt facing like other mammals". Her favourite style, **group 4**, is the reference
for all six.

**Style references (attach as images 2 to 5):** idle frames on `main` of
`findastra/rift-rabbit` `desktop-art/rift-rabbit/idle-20261011.png`, `findastra/patch-cat` `desktop-art/patch-cat/idle-20261011.png`,
`findastra/backup-beaver` `desktop-art/backup-beaver/idle-20261011.png`, `findastra/raspberry-berry` `desktop-art/raspberry-berry/idle-20261011.png`.

Shared prompt text (use with each pet's line below; image 1 is that pet's current sheet, the edit target):

> Use case: precise-object-edit. Asset type: production transparent pixel-art desktop-pet 3-by-3 nine-mood sprite
> sheet. Image 1 is the current sheet of this pet, the edit target. Images 2 to 5 are style references: Astra's
> favourite pets. Redraw this pet in exactly their style: chunky crisp pixel art, one consistent black outline,
> flat bright colours with one soft shade, a round compact body sitting or standing front-facing, small dark rounded
> eyes each with one white highlight, small pink oval blush, a tiny smile or "w" mouth. Keep the pet's identity and
> props as listed. Layout: EXACTLY nine same-size bodies in an exact 3x3 grid with wide transparent gutters, same scale
> and registration in every cell, whole body visible. Left to right, top to bottom: idle; blink (eyes closed); happy;
> curious (both eyes identical and forward, a raised brow and a small open mouth only); worried; sad; sick; alarmed;
> asleep. Facial changes only, same body in all nine. Genuine transparent alpha outside the characters, no backdrop,
> glow or shadow. No text, labels, mood symbols, punctuation, question or exclamation marks, Z letters, tears, sweat or
> bandages (the build stamps those on).

| Pet (repo) | Edit target (image 1) | Pet line |
| --- | --- | --- |
| Gif Giraffe (`astras-gif-maker`) | `desktop-art/gif-giraffe/sheet-20261011.png` | Neon yellow giraffe with orange spots, ossicones and the corrected muzzle. **Sitting on its bottom facing the viewer like Rift Rabbit and Patch Cat**: front view, back legs folded with both soles toward the viewer, front legs straight down in front, short neck so the head stays near the body. |
| Unity Unicorn (`unity-unicorn`) | this repo's `art/sheets/unity-unicorn.png` | White unicorn with a rainbow mane and tail and a gold spiral horn, sitting front-facing like Rift Rabbit. Simplify: no fluffy fur strands or large glossy anime eyes; group-4 face. |
| Finance Finch (`finance-finch`) | `desktop-art/finance-finch/sheet-20261011.png` | Round yellow chick holding one gold coin, orange beak, forward-facing orange soles, yellow wings. Round dot eyes (not rectangles). |
| Health Hummy (`health-hummy`) | `desktop-art/health-hummy/sheet-20261011.png` | Lime-green hummingbird, teal wings, pink heart on the chest. Beak drawn side-on as a long straight thin needle (card 018). |
| File Master (`file-master`) | `desktop-art/file-master/sheet-20261011.png` | Golden manila folder with its left tab, white papers along the top edge and the dark-gold three-point crown. Cute group-4 face with a small confident brow, not stern. |
| Paper Girl / Patty (`paper-girl`) | `desktop-art/paper-girl/sheet-20261011.png` | Pink folded newspaper with a folded corner and column lines, no lettering. Group-4 face. Same height as File Master (they travel together). |

After each sheet (one pet at a time; regenerate a pet, never the set):
**Once astras-pet-os PR #58 (one art source) is merged, every picture lives only in this hub:** the giraffe's desktop
art is `desktop-art/gif-giraffe/` and its web frames `art/drafts/gif-giraffe/` here, and step 4 has no copies left to
update (the pet repos and the portfolio load from the hub). Until then, follow the steps as written.

1. Desktop art: save it as that pet's `desktop-art/<pet>/sheet-20261011.png` (hub for Finch, Hummy, File Master,
   Paper Girl; `astras-gif-maker` for the giraffe) and cut it with `node scripts/build-desktop-art-20261011.mjs <pet>`
   (or `--directory <folder>`). Save the prompt next to it as `prompt-20261017.md`. Unity Unicorn has no desktop art:
   the desktop app shows its web frames, so step 2 is all it needs.
2. Web art: put the nine frames on a 1024x1024 solid #808080 sheet (RGB, no alpha: `build-frames.mjs` keys the
   background by colour) as `art/sheets/<pet>.png`, then `npm run build`, look at `art/roster.png`, `npm test`.
   Finance Finch also has `art/sheets/.approved/finance-finch.png` (the `--match` reference): replace it too.
3. Icons: `art/icons/<repo>-20261012.png` (trim at alpha > 40, nearest fit into 96px, on the bottom edge; that is
   `scripts/make-icons-20261012.mjs`).
4. Every copy (Flash Audit A58 lists them): the pet repo's `art/` or `pet-art/` and `desktop-art/`, the giraffe's
   `art/frames/gif-giraffe/`, `art/sheets/gif-giraffe.png` and `icon.png`, the portfolio's `art/icons/` and `art/pets/`.
   One branch and PR per repo, as in [docs/pet-art-redesign-20261017.md](../docs/pet-art-redesign-20261017.md).

## Done when

Six new sheets are on branches with PRs in every repo that holds a copy, `art/roster.png` shows them, `npm test`
passes, and Astra has looked at them (draft until she approves).

## Return

Update `## What I did` with sheets, prompts, commits and PRs; set `status: done`; commit.
