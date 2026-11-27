# The desktop pets shrink evenly, so their eyes match · 2026-11-27

By Claude Opus 5.5 (`claude-opus-5-5`) for Astra.

Astra, 2026-11-27, looking at the star's preview of every pet: "the drum dog's eyes look kind of weird". Then, of the fix
offered: "Yes, fix the shrink".

Every desktop pet is a 256-pixel drawing (the 11/14 round, drawn by GPT-6-Astra in Codex) that Startup Star shows about
88 pixels tall on a 4K screen at 150%, roughly 2.2 times smaller. The star drew it with nearest-neighbour scaling: each
screen pixel took one source pixel and the rest were dropped. At a ratio that is not a whole number, the same mark keeps
three columns in one place and two in another, so Drum Dog's two eyes came out different shapes. The drawings themselves
were fine.

- **Now** (`scripts/desktop-pets-20261011.cs`, `PetSprite.Draw`, `DrawShrunk`, `Shrink`): each picture is shrunk once to
  its exact size on the screen, every screen pixel the average of the source pixels it covers (area averaging, a box
  filter; colour weighted by alpha, so the clear background never tints an edge), kept until the size or picture
  changes, and drawn pixel for pixel. Mood pictures go the same way. Deck Duck's and RGBee's body and rainbow bands are
  two pictures that fill opposite pixels, so they are shrunk together and share each screen pixel; shrunk apart, each
  left the edge where they meet half clear (found by the read-only review).
- **Edges stay crisp.** Most pet windows are colour-keyed and cannot show half-clear pixels (`CrispTransparency`), so
  there a shrunk pixel is solid from half covered up, as before. The see-through pets (layered windows) keep the
  averaged alpha.
- Sizes, positions, clicks and the pets' outlines on the hit test are unchanged. A pet drawn at or above its drawing's
  own size, and the old hand-drawn sprites with added ink, are drawn as before.
- **Check:** the star's `--self-test` draws two equal 5 by 6 marks at different places at 150% (190 pixels to 88) and
  fails unless both keep the same ink within 2%, and unless every pixel is clear or solid. Before the change it failed
  (2295 against 1530: three columns against two); now it passes. A second check draws a rainbow pet whose body and
  bands fill a block together and fails on any pixel less than solid (it failed at 208 of 255 before the joint shrink).

**Not verified here:** the real star on Astra's screen. The star picks this up when it is rebuilt from main
(`build-desktop-pets-20261011.ps1`, which has to close it first) and started again.
