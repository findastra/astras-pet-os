# System Map: the DEV switch changes the words without reloading (2026-11-17)

Astra, 2026-11-17: "i want it o be that if i switch to dev then the seleced node switches, not the whole page reloading
then zoonimg back in".

- `scripts/developer-words-page-20261019.js`: the swap remembers what it replaced, so `PetOSWords.setMode('farm' |
  'developer')` switches a page's words in place, both ways, remembers the choice like the footer switch, and fires
  `petos-words` on `window`. Text the page wrote since the swap is left as the page wrote it. Other pages are unchanged:
  `PetOSWords.data()` and the footer switch still work as before.
- `scripts/system-map-template-20261012.html`:
  - The map's data stays in farm words (no `PetOSWords.data(DATA)`); the page text is swapped instead, so it can go back.
  - DEV calls `setMode` and takes `?words=` out of the address. The camera, 2D | 3D, the open card and the selection stay.
  - On `petos-words` the map redraws what is not page text: the ring key, the ring name tags and icon initials (canvases),
    the label widths, a pet program page inside the card, and the search results.
  - Search also finds a pet by the words on screen (in developer words, "unity agent" finds the Unity Unicorn).
- `test/developer-mode-test-20261019.mjs`: the map never reloads for DEV and listens for `petos-words`; a new test swaps a
  pretend page to developer words and back.

Checked in the browser on the working copy: same page after two clicks, the camera did not move, the Unity Unicorn card
read "Unity Agent" and back, opening in developer words and switching to farm works, 2D | 3D in both words, phone width,
no errors.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-17.
