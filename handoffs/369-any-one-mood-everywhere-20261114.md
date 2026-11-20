status: open (waiting on Astra: her OK to merge #369; then the Deck Duck chat for the Stream Deck keys)
for: any (the Stream Deck part: the Deck Duck chat, findastra/deck-duck)
from: Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-14
---
## Task
Astra, 2026-11-14: "I want all of the pets everywhere to have the same status. Like if they're questioning or if
they're alert, like the pets, the icons, right? The icons on the stream deck, the icons on every single pet program
page, where they are on the top of the page and all their friends at the bottom, and on my desktop."

## Ownership and state
State: READY_FOR_REVIEW
Implementer: Claude Opus 5.5 (this chat); writable files: the files in pull request #369, this card,
changes/one-mood-everywhere-20261114.md; ownership: released after the merge
Reviewer: unassigned; next action: Astra's OK on #369, then rebuild and restart Startup Star on her PC
Stream Deck: findastra/deck-duck belongs to the Deck Duck chat (branch `claude/stream-deck-pets-20261114`, not
merged). This chat did not touch it.

## What I did
- `scripts/pet-moods-20261114.mjs`, The Farm's pet-moods (`the-farm-v1.0-pet-moods-v1.0`, on the System Map): the one
  writer. Every five seconds, most urgent first (MOOD-KEY.md), from a background pet's own `mood-20261021.json` (fresh
  for 15 minutes), a key request with `status: requested` in API Fairy's notebook (the pet that asked is curious) and
  the Farmer's round from the past week (`status/pets-status.json`). Writes, on her PC only,
  `Documents\Astra's PetOS Data\astras-pet-os\pet-moods\pet-moods-20261114.json` and `pet-moods-page-data-20261114.js`.
- `scripts/desktop-pets-20261011.cs`: Startup Star starts pet-moods at sign-in (`--background`, one copy, a lock file)
  and reads the file every five seconds (`PetMoods`); a pet with a mood to show is drawn in that mood's stamped
  picture at its usual size, its window grows by the sticker's room and moves so the pet stays put. The old
  background-alarmed rule is the fallback while pet-moods is not running. `--preview <png> <board>` draws a board.
- `scripts/pet-program-pages-20261018.mjs` and `apps/pet-programs/pet-program-page-20261018.js`: every picture of a
  pet on a page carries its faces and `data-mood-of="<repo>"`; the page reads the page copy every five seconds on her
  PC and shows the shared mood on the pet at the top, the emotions panel and every friend.
- Tests: `test/pet-moods-test-20261114.mjs` (10), the star's `--self-test` (PASS), `npm test` 463 pass, 6 skipped, in
  an LF clone. Seen on Log Den's working-copy page (Log Lynx alarmed; the Farmer curious and Forensic Ferret happy among
  his friends) and in a `--preview` of the desktop with every pet in a mood.

## For the Deck Duck chat: the Stream Deck keys
Read the same file; do not work moods out again.
- File: `Documents\Astra's PetOS Data\astras-pet-os\pet-moods\pet-moods-20261114.json` (schema
  `astras-pet-os-pet-moods-v1`). Ignore it when `updated` is older than `stale_after_ms` (120000): pet-moods stopped.
- `pets` is keyed by repo; each has `art` (the desktop id, the hub's `petFrames` folder), `mood`, `show` and `says`.
  Show `show` when it is a string (alarmed, sick, curious, worried, happy, sad); null means calm: the key keeps its
  usual animation.
- The picture: the same stamped mood picture the pages and the desktop use (`art/moods/<art>/<mood>.png` for desktop
  drawings, else the hub's frame index `frames[<mood>]`), so the sticker is the same everywhere.
- The file is rewritten whole when a mood changes and at least every 30 seconds; a read can meet a half-moved file
  for a moment, so keep the last good board on a parse error.

## Done when
- #369 is merged with Astra's OK, Startup Star is rebuilt (`build-desktop-pets-20261011.ps1`) and restarted, and
  `pet-moods-20261114.log` in that folder says it is writing.
- The Stream Deck keys show the same mood (the Deck Duck chat, in findastra/deck-duck).

## Return
Record review and receipt here.

## Receipt and review
Pending.
