# Every pet's icon is made by the build, and A01 checks it is current

2026-11-20. Astra: icons for all pets are the Friendly Farmer's job, not one pet's chat ("I thought that the farmer was
supposed to keep track of the things regarding all pets"), and "you need to merge your work with the other chat about
Icon Status Sync". That chat (card 369) owns what each pet shows; it agreed to this split the same day. It owns the
pages, the desktop, `scripts/adopt-mood-sheets-20261114.mjs` and Fuzzboi Friend; this change owns the icons.

Why they were stale: `scripts/make-icons-20261012.mjs` ran only by hand, last on 2026-11-12. After the newest drawings
(#370) and the mood symbols (#371), 24 icons still showed older drawings. Two pets with new names (Mommy's Mommies,
The Astral Plane) and 34 pipeline, roadmap and seed pets with drawings had no icon. The System Map lets a pet's icon win
over its mood frame, so it showed the old ones. A01 "Current icon" only checked that an icon file existed.

Changed:
- `npm run build` now makes every icon (`buildIcons` in `scripts/make-icons-20261012.mjs`), before anything reads
  `art/icons`. An icon is made from the calm picture the pet's own program page shows as idle, without its mood sticker
  (`petFrames` in `scripts/pet-program-pages-20261018.mjs`), so the icon and the page are one picture. Fuzzboi Friend's
  icon follows his page, so it changes on its own when #401 lands. The dated `idle-20261011.png` list and his pinned
  drawing are gone.
- 84 icons: 44 made again from a newer picture, 37 new. Claude Bot keeps its orange-screen twin icon and Skill Scout
  its seed-sheet icon (Astra, 2026-11-20: "drop all that"). Data Chip's comes from its own drawing, as before.
- `art/icons/icon-sources-20261120.json` records the picture each icon was made from and its git blob.
- Flash Audit A01 now reports an icon as `Incorrect` when the record says it was made from another picture, or from an
  older copy of it; the next step is `npm run build`. A01 also finds an icon by its pet's name, as the pages do. Skill
  Scout's icon is `skill-scout-*` while its repo is `lunas-log`, so it was reported Missing before.
- `test/make-icons-test-20261120.mjs`: the icons in the hub are the ones the build makes, the kept icons stay, and A01
  passes for every pet program after a build.

- `INTELLIGENCE-LEVELS.md` links Astra Wisp's and Mommy's Mommies' icons by their new names (`the-astral-plane.png`,
  `mommys-mommies.png`).

Left for Astra: the two icons under old names, `art/icons/mommys-20261012.png` and
`art/icons/vrchat-ai-astra-20261012.png`, and their `art/latest/icons/` copies. Nothing links them now. Deleting them is
her call.

Icons are cut from each pet's own drawing; the drawings are credited in their own changes files. Claude Opus 5.5
(`claude-opus-5-5`).
