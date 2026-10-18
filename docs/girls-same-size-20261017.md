# Group 3: the same head and body size, 2026-10-17

By Claude Opus 5.5 (`claude-opus-5-5`) for Astra, 2026-10-17 and 2026-10-18. Every picture here is a **draft until
Astra approves it**. Follows [pet-art-redesign-20261017.md](pet-art-redesign-20261017.md), which gave group 3
Mommy's Mommies' body-to-head ratio but not the same pixel size.

## What Astra asked

From a screenshot of her desktop pets (2026-10-17): "these girls need the same body size exactly and head size".
The girls are group 3: Discord Damsel, API Fairy, Astra Wisp, Mommy's Mommies (Astra and Devilish, one sprite) and
VSCode Angel. Six girls in five sprites. Mommy's Mommies are the reference.

On the first version (head measured from the hair top) she answered (2026-10-18): "head is just the body part, hair
is not part of head when measuring. dont change Mommys mommies at all, make every other girl match their head and body
dimensions." This record describes the version that follows that answer.

![Before and after, as the desktop draws them](images/girls-same-size-before-after-20261017.png)

## How a girl is measured

On the 256 px frames, counting pixels with alpha 128 or more (the ones the desktop shows). The head is the face, not
the hair:

- **Face**: the patch of the girl's own skin and blush joined to her cheek, above her chin, with the eyes and mouth it
  encloses. Hair, ears, halos, horns, the star and the headset are not face.
- **Face width**: cheek to cheek, the widest row of the face (where its sides run straight down).
- **Face height**: the top of the eyes to the chin. The forehead is under the hair, so the eyes are the face's top
  that no hairstyle covers.
- **Chin**: the first row under the face. For the Damsel and the Fairy the skin goes on into the neck, so it is the row
  where the face narrows to the neck.
- **Body**: chin to soles (the lowest opaque row: shoe soles, or the hem of a gown).

**Mommy's Mommies, idle: Astra's face 49 wide, Devilish's 50; both eye top 93, chin 119, soles 228, so face height 26
and body 109.** They are not changed.

## What changed

| Girl | Before (idle): face width / face height / body | Edit | After |
| --- | --- | --- | --- |
| Mommy's Mommies (Astra, Devilish) | 49 and 50 / 26 / 109 | none | the same |
| Discord Damsel | 79 / 34 / 136 | across x0.620, down x0.765; body 137 rows to 110 | 49 / 26 / 109 |
| API Fairy | 51 / 28 / 110 | across x0.961, down x0.929; body 111 rows to 110 | 49 / 26 / 109 |
| Astra Wisp | 52 / 27 / 101 | across x0.942, down x0.963 (hair and star above the eyes x0.88); body 102 rows to 110 | 49 / 26 / 109 |
| VSCode Angel | 49 / 27 / 103 | across x1, down x0.963; body 104 rows to 110 | 49 / 26 / 109 |

The Damsel changes most: her face was much wider than the others', so she is narrower now, gown and headset too.

**How**, so it can be redone (Python 3.13 and Pillow in a scratch folder, not committed: this repo uses Node built-ins
only). Each output pixel copies one source pixel, so no colour is new (checked on every frame):

1. Columns: the face's span becomes exactly 49 columns, centred on column 128 (columns 104 to 152); every other
   column uses the same factor, `49 / face width`, so hair, wings and the body keep their place beside the face.
2. Rows from the top of the eyes to the chin become exactly 26 rows. Rows above the eyes (hair, halo, star, headset)
   use the same factor, `26 / face height`.
3. Rows from the chin to the soles become exactly 110 rows (body 109). The soles land on row 236.
4. Astra Wisp only: her star would have stood 6 rows above Mommy's Mommies' 202-row desktop crop (below), so the
   rows above her eyes, hair and star, go into 66 rows instead of 72. Her face, chin and body are as in step 2 and 3.
5. Every mood uses idle's rows and columns moved with that mood's own offset (found by laying the mood's body over
   idle's), so each keeps its pose. Blink is cut at its own soles (VSCode Angel's blink hem is one row lower).
6. API Fairy's source frames are her current web frames with the build's mood stickers removed (every island but the
   fairy herself), so her new sheet has none.

**Idle measures exactly 49 / 26 / 109 for every girl**, which is Mommy's Mommies' Astra (Devilish is 50 wide). In
blink the closed eyes sit lower, so eye top to chin reads 18 or 19 (Mommy's Mommies' blink reads 21); the rows are
idle's. The other moods keep their poses, so they read a few pixels off, as Mommy's Mommies' own moods do.

### The web frames: native sheets

`npm run build` fits every sheet so its drawing is about 200 px, which would give each girl her own scale again.
`scripts/build-frames.mjs` now has `NATIVE` for sheets drawn at frame size (API Fairy and Discord Damsel), and
`scripts/sheet-to-sprites.mjs` cuts those without fitting:

- the window is exactly one frame, the middle of each cell (where the frame was laid), so the frame comes back as it
  was, feet on the same row in every mood;
- every pixel of exactly the background colour is background, also between an arm and the body (left in, that grey
  took one of the 24 palette colours and pushed out the Fairy's pink blush);
- a drawing bigger than a frame, or outside the cell's middle, stops the build.

The sheets are the new frames laid 1:1 in the middle of each cell of a 1024 px sheet on solid `#808080`, alpha cut at
128 like the desktop does. Checked after `npm run build`: API Fairy's nine web frames are her new frames pixel for
pixel; the Damsel's have the same pixels in place through the build's 24-colour palette.

### The desktop: Mommy's Mommies' own scale

`scripts/desktop-pets-20261011.cs` fitted each pet's alpha bounds to the standard height (58.75 logical pixels).
Halos, horns, the star, the headset and wings make those bounds different, so equal art was still drawn at five
scales. Now the five group 3 sprites (`SameSize`) use one crop `SameSizeCrop` = 202 art pixels tall, measured up from
the soles, drawn 58.75 high. 202 is Mommy's Mommies' own height, so they are drawn exactly as before (the same
picture, pixel for pixel), and every girl shares their scale. The self-test checks it ("group 3 same-size scale").

**Proof, measured on preview renders** (`build-desktop-pets-20261011.ps1` in scratch copies of `main` and this
branch, then `bin\desktop-pets-check-20261011.exe <hub> --preview <png>`): each girl was found in the render by
drawing her frame the way GDI+ does (nearest neighbour, pixel offset half) and matched pixel for pixel (GDI+ rounds
colours by up to 3 levels; wing pixels the app makes see-through are left out). Then each screen row and column is
known to show one art row and column:

| Girl | Before: face width / face height / body (screen px) | After |
| --- | --- | --- |
| Discord Damsel | 19 / 8 / 33 | 14 / 8 / 31 |
| API Fairy | 15 / 8 / 32 | 14 / 8 / 31 |
| Astra Wisp | 15 / 7 / 29 | 15 / 8 / 31 |
| Mommy's Mommies (Astra, Devilish) | 15 and 14 / 8 / 31 | the same, drawn identically |
| VSCode Angel | 15 / 9 / 30 | 14 / 8 / 31 |

After: eye top on screen row 19, chin 27 and soles 58 of every sprite. Face widths are 14 or 15: at 3.44 art pixels
per screen pixel, a 49-pixel face covers 14 or 15 screen columns depending on where it falls on the pixel grid, as
Mommy's Mommies' two faces (15 and 14) do. The preview draws at 100%; at 150% (Astra's screen) every girl still has the
same crop height and drawn height, so the rows still match.

### Icons

`art/icons/` for `api-fairy`, `findastra-discord-presence` (the Damsel), `vrchat-ai-astra` (Astra Wisp) and
`vscode-angel`, made with `scripts/make-icons-20261012.mjs`' own steps (its trim and fit, copied into a scratch
script so nothing else is fetched; checked pixel-identical on `main`'s art first). Mommy's icon is unchanged.
`system-map-20261012.html` embeds them (`npm run build`).

## Every copy

| Repo | Pull request | What |
| --- | --- | --- |
| astras-pet-os | this branch, `claude/girls-same-size-20261017` | `desktop-art/` for the Damsel, Wisp and Angel; `art/sheets/` and rebuilt `art/frames/` for the Fairy and the Damsel; 4 icons; native sheets; one desktop scale; this record; card 031 |
| findastra-discord-presence | [#5](https://github.com/findastra/findastra-discord-presence/pull/5) | `desktop-art/discord-damsel/`, `pet-art/`, desktop record |
| api-fairy | [#3](https://github.com/findastra/api-fairy/pull/3) | `art/` frames, `assets/fairy.ico`, desktop record |
| the-astral-plane | [#4](https://github.com/findastra/the-astral-plane/pull/4) | `desktop-art/astra-wisp/`, desktop record |
| vscode-angel | [#3](https://github.com/findastra/vscode-angel/pull/3) | `desktop-art/vscode-angel/`, desktop record |
| findastra.github.io | [#4](https://github.com/findastra/findastra.github.io/pull/4) | `art/pets/` for the Fairy and the Damsel, 4 icons (merge after the hub) |

None is merged. mommys-mommies#3 (a record note) was closed: Mommy's Mommies are not changed anywhere.

## Not done

- **Astra's desktop shows this only after a rebuild.** The size rule is compiled into the desktop app, and Startup
  Star's live sync restarts the app but does not rebuild it. The running exe also has the Goldfish triple-click from
  PR #23, which merged into `codex/yellow-phone-20261015`, not `main`, so rebuilding from `main` alone would drop it.
  Card [031](../handoffs/031-codex-rebuild-desktop-girls-same-size-20261017.md) asks Codex to rebuild with both.
- The web frames of Astra Wisp, Mommy's Mommies and VSCode Angel are an older design than their desktop art; they
  were left as they are. If the web should match, their sheets can be replaced with the desktop designs, sized the
  same way.
- On web pages that show frames at frame size (`art/roster.png`, the portfolio's `art/pets/`), API Fairy and the
  Damsel now look smaller than pets whose sheets are fitted to about 200 px. That is the price of one pixel size for
  the girls; the other three girls' web frames are still fitted (older designs, above).
- The API Fairy app embeds her frames: it shows them after `build.cmd`. Folder icons on Astra's PC refresh with
  `set-folder-icons-20261017.ps1`.
- Generated files (`cage-data.js`, `system-map-20261012.html`, `art/roster.png`) conflict with any other branch that
  rebuilt them: whoever merges second runs `npm run build` again.
- `npm test`: all pass on a checkout with LF line endings. On a Windows checkout with `core.autocrlf=true`, two tests
  that compare generated docs fail on `main` too (line endings, not content).
