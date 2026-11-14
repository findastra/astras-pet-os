# The unified footer's star is never a link (2026-11-13)

Astra, 2026-11-13 (in the Spoonfed chat): "also the star shouldnt be a link. ever."

The photostar between the footer's two sparkles stays as a picture: no link, no pointer cursor, no hover. The picture
says what it is ("Astra's photostar") for screen readers.

- `scripts/pet-program-pages-20261018.mjs`: the spawner draws the star as `<span class="footer-star"><img alt="Astra's photostar"></span>`, with no link, and `PHOTOSTAR` no longer holds an address. `npm run build` rewrote the 56 pet program pages and the Model Pet Program page.
- `PET-PROGRAM-FRAMEWORK.md` (section 3, item 9) says the photostar is a picture only, never a link.
- The hub's copy of Ghost Protocol (`apps/ghost-protocol-20261008.html`) gets the same change in its footer pull request, #360, so the two never edit the same lines.

The same change went to every page with the unified footer; Spoonfed's own footer is changed in findastra/spoonfed.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-13.
