# Deck Pond's hourly picture check, on its page with its cadence (2026-11-21)

Astra, 2026-11-20: every recurring job is on its own pet program page with its cadence (hub #415 and #418). Deck Duck's
Stream Deck plugin got one that day. Astra said "the update should just fix every single place they are since its a
link", then "Yes, build it".

## What changed (`system-map.json`; pages, TOOLS-AND-TRICKS.md and Markdown pets rebuilt)

- **`art-link-tool`** (`deck-pond-v1.0-art-link-tool-v1.0`) is a tool of Deck Pond (pet program 32), with cadence
  "hourly (while Stream Deck runs)". A minute after Stream Deck connects, then once an hour, the plugin asks GitHub for
  the list of the hub's `art/latest/` pictures, sending an ETag so GitHub answers "not changed" for free. When a pet's
  link shows a new drawing, it downloads only that picture. It then redraws that pet's key, the sign on the bar, its
  tool strips and its page strip in a low-priority background PowerShell, with no rebuild. New pets, new tools,
  Fuzzboi's reroll layers and the icons in Stream Deck's action list still need a deck rebuild.
- **Why the state is `now`:** `now` means "Works today" (the map's `states`). The code is pushed to GitHub on
  deck-duck#11, stacked on #10 and #9. Version 0.11.0.0 runs on Astra's PC, and its log shows the real check on
  2026-11-20. An unmerged pull request is an error flag, not a "not built" state: INTELLIGENCE-LEVELS.md lists "🚧 stuck
  in an unmerged pull request or on a branch" among its errors, and it says "Not built yet is not an error". The job
  text says plainly that the code is not merged.
- **Two links:** the tool runs on Elgato Stream Deck (`runs-on`), and it reads GitHub's API (`opens`). Because of
  these, Deck Pond's page shows Stream Deck as working today.
- **`stream-deck`** is now `now`, and its job no longer says "Not installed on the Desktop PC in the 2026-10-12 scan".
  StreamDeck.exe 7.6.1.23033 is installed, and it was running when checked on 2026-11-21. The page builder says "A
  program not installed yet (its node is not `now`) is never watched" (Astra, 2026-11-07), so a third-party program
  that is installed gets `now`.

## Not changed here

- Deck Duck's row in INTELLIGENCE-LEVELS.md: #377 is rewriting it (the plugin, and the "not installed" error).
- The `deck-duck → stream-deck` link (still `planned`) and Deck Duck's `needs` in pets.json: #289 changes both, and
  it changes the same `stream-deck` lines as this file. Whichever merges second keeps both sides' facts.
- The code itself: deck-duck#9 → #10 → #11.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-21.
