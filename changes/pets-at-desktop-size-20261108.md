# Every pet on a pet program page at its desktop size

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-08, for Astra.

Astra, looking at the Model Pet Program: "One thing I noticed is that the pets are not the sizes they would appear on
the screen in the corner, so make sure they're the right size."

What was wrong:

- The cyberhome's picture sat in a 60px slot that capped it, and most pets' pictures (empty margin included) are 64 to
  105px tall at their desktop size, so most pets were drawn smaller than on the desktop (Finance Finch at 57%).
- The page looked a pet's own size up by its repo, the desktop by its art id, so the Farmer (`farmer`, 0.9), Spoonfed
  Sugarcube (0.7) and the five pets the star crops from the soles (`SameSize`) came out the wrong size.
- The emotions and the friends list drew every picture 60px square, whatever the pet.

What changed:

- `scripts/pet-size-20261023.mjs`: Startup Star's LayoutPets rules (NormalHeight, MaxPetWidth, each pet's size, the
  `SameSize` crop, the Farmer at 0.9, the crop of idle and awake together, alpha 128 for its own crisp drawings).
- `scripts/pet-program-pages-20261018.mjs`: each picture in the cyberhome, the nine emotions and the friends list gets
  `img.fit` with its desktop scale and its empty margin cut off (`desktopId`, `fitOf`); the Model Pet Program's SVG
  pets are worked out from their shapes.
- `apps/pet-programs/pet-program-page-20261018.css`: `img.fit`; the cyberhome slot grows for a tall pet (Claude Bot)
  instead of shrinking it; the emotion picture column fits the pet. Discord Damsel's own 1.375 scale (2026-11-06,
  "Make her 25% bigger") is gone: it made up for the 60px slot. At her desktop size she is about 10% smaller than that.
- Tests: the sizes are read back from the star's own code, Rift Rabbit and the Farmer stand at their desktop heights,
  and every pet picture on every page and the Model Pet Program is fitted. `PET-PROGRAM-FRAMEWORK.md`, section 3.

Not changed: the chat window's 44px face and the System Map box's small friend icons stay icons.
