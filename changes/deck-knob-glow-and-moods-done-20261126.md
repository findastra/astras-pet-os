# The Stream Deck knob's tool lights up on its pet's page; card 369's Stream Deck part done · 2026-11-26

By Claude Opus 5.5 (`claude-opus-5-5`) for Astra, in the Deck Duck chat.

Astra, 2026-11-26: "when I scroll through the tool selections, I want to be able to see which ones are highlighted on
the pet program. I also dont want it to ever open duplicates"; then "programs do open twice, I just checked again, build
both". She first asked for this on 2026-11-14: "when I scroll through it, it highlights those tools as if I was
selecting it with my mouse". Deck Duck's plugin has written what the knob is on since then
(`Documents\Astra's PetOS Data\deck-duck\deck-pick-page-data.js`), but no page read it.

## The knob's tool on the page

`apps/pet-programs/pet-program-page-20261018.js` and its CSS:
- **Reading the pick.** A pet program page opened on this PC reads the pick file twice a second while it is in front,
  from one fixed address (`LOCAL_PICK`, the sixth local list), the same way it reads the program lights and the moods.
- **The glow.** When the pick names this page's pet, that tool's pill gets the look the mouse gives it (`.deck-pick`:
  the hover border, background and underline) and scrolls into view. A script cannot hover, so the page sets a class.
  A pill inside a folded panel or tool box lights that panel's name or that box instead.
- **A press on an open page.** When the deck brought this tab to the front instead of opening the page again
  (deck-duck#14, "never the same page twice"), the pick carries `go`, and the page unfolds around the tool and goes to
  it once.
- **Limits on what it trusts.** A pick older than a minute lights nothing, the same rule as the program lights. Only the
  pick's pet and tool are read, and they are only compared with the page's own `data-item`s, never put into the page.
  Reduced motion scrolls without the slide.

`test/key-requests-test-20261019.mjs` now expects six local lists, the sixth `LOCAL_PICK`.

## Card 369: the Stream Deck part is done

deck-duck#12 (0.12.0) was merged on 2026-11-26 with Astra's OK and installed on her PC. The card has its receipt and is
done. The texts that said the Stream Deck comes "next" now say it is there:
- the emotions panel's "how" on every pet program page (`scripts/pet-program-pages-20261018.mjs`, pages rebuilt);
- MOOD-KEY.md (from `scripts/relations-20261009.mjs`);
- pet-moods' header and its page file's comment (`scripts/pet-moods-20261114.mjs`);
- the page script's comment.

The comment in `scripts/desktop-pets-20261011.cs` is Codex's file (PLAN.md, "Who edits what") and is left as it is.

`system-map.json`: the `stream-deck` and `art-link-tool` jobs no longer say deck-duck#9 to #11 are unmerged; 0.12.0
runs on her PC.

Card 369, deck-duck#12 and deck-duck#14.
