# Every pet's newest drawing, with nine faces by GPT-6-Astra (2026-11-14)

Astra, 2026-11-14, about the Stream Deck's pictures: "A lot of these are old, so we need to figure out where's the most
recent art, because I'm pretty sure GPT-6 Astra drew it". Then, shown every pet's deck picture beside its newest
drawing: "Yes, all of them. Have ChatGPT generate the moods for each one, give it good instructions, and make sure that
those symbols are the same for each one. Make sure it's GPT-6 Astra Max that does the art."

## Where the newest art was

Codex (GPT-6) drew every pet again on 2026-10-30 and 31 (draft pull request #267, card 030), one neutral pose each. Only
41 of those reached `main` (2026-11-08, for pets with no other picture), so the desktop, the pages and the Stream Deck
still showed the drawings of 2026-10-11 and the frames of 2026-10-08 to 10-19 for most pets. Later drawings: Gone Ghost
and White Hat Weasel (11-12), PC Master (11-03), Flowsheet Flamingo (11-11), Role Fairy (11-12, #327).

## What changed

- **Nine faces for every pet, by GPT-6-Astra at max effort.** Codex (`gpt-6-astra`, reasoning effort `max`, its
  built-in image tool) got each pet's newest drawing and one set of instructions (`desktop-art/<pet>/prompt-20261114.txt`):
  the same character nine times, only the face changing, in the hub's mood order, on a transparent background, with no
  symbols at all. The build stamps the one shared sticker set (`scripts/art-kit.mjs`, `scripts/indicators.mjs`), so the
  symbols are identical on every pet. Each pet's sheet and nine frames are in `desktop-art/<pet>/` (`*-20261114.png`),
  with `source-20261114.txt` saying what it was drawn from.
- **The newest drawing wins everywhere.** The desktop pets take the newest idle and awake pair in `desktop-art/<pet>/`
  for every pet (`PetFiles.NewestDrawing`; the fixed list of fifteen 10-11 drawings is gone), the draft list does the same
  (`scripts/prepare-desktop-drafts-20261011.mjs`), and the pages' `petFrames` also looks in a folder named for the pet's
  draft or the pet itself. The Stream Deck uses `petFrames`, so its next build shows the new art too.
- **Group 3 keep one size.** The five girls' new drawings put their eyes at different rows, so each has her own crop
  measured eye top to soles (`SameSizeCrops` in the star, `SAME_SIZE_CROPS` on the pages; the record and measurements
  are in `docs/girls-same-size-20261017.md`). Mommy's Mommies are still the reference.
- **Procreate Panda was drawn twice.** His first sheet lost his black eye patches in five faces; the second (with one
  extra line in his prompt) keeps them in all nine. Every other sheet is GPT-6-Astra's first.
- Two tests that named the old pictures now expect the newest drawing (Gatekeeper Goddess on the Farmer's page,
  Forensic Ferret's Markdown pet in his pack, whose picture is in the pack).
- `scripts/build-desktop-art-20261011.mjs --date YYYYMMDD` cuts a sheet of any date.
- `scripts/adopt-mood-sheets-20261114.mjs` brings the sheets into the hub.

## Not adopted

- Data Chip: he keeps the original Data Dealer drawing code (AGENTS.md: "Do not replace Data Chip with generated art").
- Claude Bot and Skill Scout: their drawings stay private (Claude Bot's is a copy of another company's mascot; Codex's
  Skill Scout looks like a well-known anime character), so they were not redrawn and nothing of theirs is public.
- Papermon: drawn too, but it belongs to #366 (Paper Patty retires there); Paper Patty here keeps her own nine faces.
- Fuzzboi Friend: drawn, but the desktop builds him from Astra's Fuzzbois recipes; waits on her choice.
- Reactor Raccoon: drawn; he is a seed (#245), not a pet program yet.

Every drawing is a draft until Astra approves it.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-14 and 15.
