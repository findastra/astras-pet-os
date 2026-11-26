# Flowsheet Flamingo's draft art (2026-11-09, redone 2026-11-11)

**By:** Claude Opus 5.5 (`claude-opus-5-5`)

Since 2026-11-08 every pet on the Farmer's page needs a picture, and Flowsheet Flamingo had none, so #299 failed that
test. Asked whether to make the draft art now (one paid image on her OpenAI account), Astra said "Yes, make the art".

The first try, on 2026-11-09, was a tall lime-green flamingo on one leg holding a lab flask. Astra, 2026-11-11:
"That flamingo's terrible. Make it pink and like small and cute. It needs to be like kawaii." So it was redone with
one more paid image, and the lime files were taken out. They stay only in this branch's history.

- `scripts/generate-pets.mjs`: `DRAFT_FLOWSHEET_FLAMINGO`, the prompt. It is now a tiny round pink chibi baby flamingo
  with rosy cheeks, a white beak with a black tip, stubby legs and a tiny yellow hard hat (the only engineering touch
  left). Its round shape keeps it apart from Portfolio Puffer, the magenta penguin.
- `art/drafts/flowsheet-flamingo/`: the sheet (gpt-image-2, 1024x1024, high, 2026-11-11) and the nine 256px mood
  frames cut from it, with the shared mood stickers.
- `art/icons/the-pilot-plant-20261111.png`: The Pilot Plant's program icon, which is the idle frame.
- `scripts/build-flowsheet-flamingo-draft-20261111.mjs`: it cuts the frames and icon from the sheet again and never
  generates.
- Rebuilt: `art/latest/` and the pages that show the flamingo (the Farmer's, Python Jungle, AI Doghouse).

It is a draft until Astra approves it. When the Farmer registers the pet, the prompt moves into `PETS` and the sheet
is copied to `art/sheets/flowsheet-flamingo.png`. From then on it is redone only with `--match`.
