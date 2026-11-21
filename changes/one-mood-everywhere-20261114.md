# One mood, the same everywhere (2026-11-14)

Astra, 2026-11-14: "I want all of the pets everywhere to have the same status. Like if they're questioning or if
they're alert, like the pets, the icons, right? The icons on the stream deck, the icons on every single pet program
page, where they are on the top of the page and all their friends at the bottom, and on my desktop. Can you figure out
how to make that work, please?"

## What changed

- **One writer: The Farm's pet-moods** (`the-farm-v1.0-pet-moods-v1.0`, `scripts/pet-moods-20261114.mjs`, on the
  System Map as a tool of The Farm). Every five seconds it works out each pet's mood, most urgent first (MOOD-KEY.md),
  from what a background pet's own program says (`mood-20261021.json`, fresh for 15 minutes), a key request waiting on
  Astra in API Fairy's notebook (the pet that asked is curious) and the Friendly Farmer's round from the past week. It
  writes `Documents\Astra's PetOS Data\astras-pet-os\pet-moods\pet-moods-20261114.json` and
  `pet-moods-page-data-20261114.js` on her PC only. `show` is the mood every place shows: alarmed, sick, curious,
  worried, happy or sad. Idle, awake and sleepy are calm, so each place keeps its own resting look.
- **Startup Star** starts it at sign-in (`--background`, one copy at a time) and reads the same file: a desktop pet with
  a mood to show is drawn in that mood's own picture with the shared sticker (the picture its pages use), at its usual
  size; its window grows by the sticker's room and moves so the pet stays put, and gives the room back after. While
  pet-moods is not running, the old rule still holds: a background pet whose program says alarmed shows alarmed. The
  crash pets' alarmed picture no longer joins their size crop, so they are their page size again. `--preview <png>
  <board>` draws every pet in a board's moods.
- **Every pet program page** reads the page copy every five seconds when opened on her PC: the pet at the top and the
  emotions panel show its shared mood, and so does every picture of another pet on the page (its friends at the
  bottom, the System Map box, the pets it talks to). Each picture carries the faces for it. A click on the pet says why,
  in its own words. Nothing changes on the live site.
- Tests: `test/pet-moods-test-20261114.mjs` (10), the star's `--self-test` (the shared mood, its room and the board),
  and seven older tests updated for the new markup.

## Not done

- **The Stream Deck keys.** Deck Duck's plugin (findastra/deck-duck, branch `claude/stream-deck-pets-20261114`, not
  merged) belongs to the Deck Duck chat; the card for this pull request says what it needs to read.
- Startup Star is not rebuilt or restarted on Astra's PC: that happens after the merge.
- Workflow Whale, Fuzzboi Friend and Claude Bot have no mood pictures in the hub (`art/moods`), so they stay plain on
  the desktop.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-14.
