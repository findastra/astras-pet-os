# Flowsheet Flamingo's draft art (2026-11-09)

**By:** Claude Opus 5.5 (`claude-opus-5-5`)

Since 2026-11-08 every pet on the Farmer's page needs a picture, and Flowsheet Flamingo had none, so #299 failed that
test. Asked whether to make the draft art now (one paid image on her OpenAI account), Astra said "Yes, make the art".

- `scripts/generate-pets.mjs`: `DRAFT_FLOWSHEET_FLAMINGO`, the prompt. It is a chubby lime-green flamingo on one leg,
  in an orange site hard hat, holding a small glass flask of cyan liquid. Lime, not pink, so it never reads as
  Portfolio Puffer's magenta. The pink stays only on the beak and leg.
- `art/drafts/flowsheet-flamingo/`: the one generated sheet (gpt-image-2, 1024x1024, high) and the nine 256px mood
  frames cut from it, with the shared mood stickers.
- `art/icons/the-pilot-plant-20261109.png`: The Pilot Plant's program icon, which is the idle frame.
- `scripts/build-flowsheet-flamingo-draft-20261109.mjs`: it cuts the frames and icon from the sheet again and never
  generates.
- Rebuilt: `art/latest/` and the pages that show the flamingo (the Farmer's, Python Jungle, AI Doghouse).

It is a draft until Astra approves it. When the Farmer registers the pet, the prompt moves into `PETS` and the sheet
is copied to `art/sheets/flowsheet-flamingo.png`. From then on it is redone only with `--match`.
