status: taken by Codex pet-art-review-round-2-20261030
for: codex
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-17
needs: docs/pet-art-redesign-20261017.md, desktop-art/*/prompt-20261011.md (the prompt format), PET-FILES.md ("Making or redoing a pet's art"), handoffs/018-any-curious-faces-and-hummy-beak-20261017.md
---
## What I did

### Revision round 2, 2026-10-30

State: IN_PROGRESS. Astra reviewed the neutral sheet and requested a second pass: one consistent head/body template for cats including the lynx; a shared girls' proportion template; Farmer at least as tall as the girls; slim, completely redrawn Paper Patty; smaller Puffer, Deck Duck, Data Chip and Finch; corrected orange monarch body; yellow or pink/yellow Finch; broader bee wings; bright pink Axolotl; shorter Stoat; redrawn Port Spider, Passport Pelican, Photo Dodo, Piranesi Nessie and OSC Sealion; a friendlier Unicorn; and small omega-shaped mouths across the animals, especially mammals. Preserve the approved Giraffe, API Fairy, VSCode Angel and Mesh Moth designs. Preserve Dubstep Gunsmith's concept while matching the girls' ratios.

Root owns this card, public reports, revised normalization, contact sheets and export records. art_inventory owns only round-2 source images/prompts for Skill Scout (local only), Role Fairy, Gatekeeper Goddess, Dubstep Gunsmith, Discord Damsel and Friendly Farmer. art_pipeline owns only round-2 source images/prompts for Photo Dodo, Piranesi Nessie, OSC Sealion, Proxy Axolotl, Port Spider, Passport Pelican, Finance Finch and RGBee. Root owns round-2 source images/prompts for Python Panther, Closet Cat, Log Lynx, Meme Fiend if needed, Paper Patty, Unity Unicorn and WiFi Butterfly, plus any other explicitly assigned mouth corrections after review. New public candidates are saved separately under `art/drafts/art-review-round-2-20261030/`; private Scout under the existing local review workspace's `round-2/`. Earlier drawings remain available. rules_review is the read-only proportions and final-art reviewer. Acceptance: visually coherent family comparisons, measured head/body proportions rather than only bounding-box equality, all 85 in updated square sheets, precise prompt/provenance, unchanged live pets and truthful neutral-only scope. Owner visual approval and nine expressions remain pending.

### Current artwork review, 2026-10-30

Astra requested a proposal for every pet, missing artwork, and repairs using her favorite existing pets as references. This explicitly resumes and expands the redraw task. State: READY_FOR_REVIEW. Implementer: Codex, branch `codex/pet-art-review-20261030`. Write scope: this card, `art/drafts/art-review-20261030/`, dated review scripts and docs, and `changes/pet-art-review-20261030.md`, plus the required generated aliases for these drafts. Existing production art, runtime, registry, and pre-existing `art/latest/` aliases remain outside the proposal scope. Reviewer: Codex independent rules/art review subagent, read-only.

The current main list contains 84 pets; the Reactor Raccoon proposal is separately pending. The live checkout is clean at `e7bdc5b02d345a94ea2d183922fd5314273f364b`. Earlier art and open branches are being checked before replacements. The owner named Deck Duck, Drum Dog, Spoonfed Sugarcube, Mommy's Mommies, GitHub Goldfish, Rift Rabbit, Mail Snail, Raspberry Pi Berry, Friendly Farmer, Gone Ghost, Mine Mole, Patch Cat, Backup Beaver and Chat Rat as favorites. Preserve these as references and recommend keeping good art. Data Chip's original renderer and Claude Bot's private exception remain intact.

Acceptance: one explicit keep/repair/new-art recommendation for every listed pet; proposed art visibly reviewed at desktop size; nine moods checked where a replacement sheet is delivered; unclipped alpha bounds and consistent registration; prompts and provenance saved; draft status truthful. Final adoption requires Astra's visual approval. The original notes below are historical: superseded distributed-copy instructions do not apply to the current single art source.

Owner clarification in this review: start with one neutral pose per character and approve the designs before making the nine-expression sheets. Show all 84 current pets in large, zoomable contact sheets, each in an outlined square; #85 Reactor Raccoon is separate and pending. Nine-mood production is a subsequent stage after design decisions.

Disjoint subagent write assignments under `art/drafts/art-review-20261030/`: art_pipeline owns pet numbers 46,47,49,50,51,52,54,55,56,57,58,59,60,61,62,63,64; art_inventory owns 37,65,66,67,68,69,71,72,73,74,75,76,77,78,79,80,81,85. Each writes only its own pet folder with a dated neutral PNG and prompt. Root owns requested repairs and shared gallery/report records. rules_review owns only a local contact-sheet layout builder; it reviews artwork read-only. Local review outputs may show the private Claude Bot; the private artwork must never enter this public branch. All generated images remain proposals.

Further owner feedback: align sizes by animal family, reduce Python's head, reduce the oversized broad characters, keep bugs smaller, and give the monarch a matching face/body color. Python and Butterfly source proposals were revised. art_pipeline completed/released its generation scope, then accepted sole ownership of technical size exports under `art/drafts/art-review-20261030/normalized/`; private exports stay local. art_inventory completed/released its generation scope, then accepted the local gallery template/builder. rules_review measures and visually reviews the exports and owns local contact-sheet layouts. Root owns all report and card edits. Skill Scout's latest owner-requested character-reference draft remains local and is not included in this public asset branch.

Delivery and receipt, 2026-10-30: [draft PR #267](https://github.com/findastra/astras-pet-os/pull/267), source commit `52df6adb4ddf4dac268811b0589d9d3f185f63db`. All 85 neutral designs are ready: 35 first drawings, 17 repairs/refinements and 33 retained designs. Both generation agents delivered their assigned files; the independent reviewer inspected all 52 generated drawings, 170 size exports and 13 final sheets. Root received and accepted the review evidence. The gallery agent verified all 85 tiles, review controls, notes and submission at narrow and desktop sizes, then confirmed 86/86 sampled CDN images load. Root inspected representative final pages. See [the complete review and validation record](../docs/pet-art-review-20261030.md).

The picture build adds 217 draft-only stable aliases; existing stable art remains byte-identical. Its nine targeted tests pass. The earlier full suite had 332 pass / 13 fail / 3 skip: one fixed alias failure, eight newline-sensitive assertions, and four browser/Windows integration failures. The read-only baseline review verified unchanged implementation and recorded the remaining limits. Every agent's write assignment is released. The proposal stage is ready for Astra's choices; this card stays open for those choices, nine-expression production, final runtime sizing and approval. Nothing is merged or adopted by live pets.

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
