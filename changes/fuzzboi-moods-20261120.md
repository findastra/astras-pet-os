# Fuzzboi Friend shows the shared mood, over whichever Fuzzboi he rolled (2026-11-20)

Astra, 2026-11-20, "All recommended" on her question slides, question 2, answer C: Fuzzboi Friend keeps her recipes
while he is calm and shows GPT-6-Astra's faces only while a mood shows. Then, the same day: "figure out what we should
do with the Fuzzboi since we randomize it and it still needs the emotions. Can we save separate emotion files, and then
add those layers over the new roll once we get it". So his moods are face layers, not whole pictures.

- **Face layers:** `desktop-art/fuzzboi-friend/layers/moods/<mood>-20261120.png`, eight of them (blink, sleep and the
  six moods), on the same 2048 x 2048 canvas as her `eyes.png` and lined up with her eyes. Every one of the 858 recipes
  draws `eyes.png` exactly once, so a face always has its place: it is drawn in place of the eyes, under her hats,
  glasses, crowns and lashes. Cut by `scripts/fuzzboi-mood-layers-20261120.mjs` from GPT-6-Astra's nine-face drawing
  (`sheet-20261114.png`, model `gpt-6-astra`, reasoning effort max, in Codex): eyes, brows and mouth. The pink blush is
  left out, because a blush is one of her rare traits (`rare4.png`, her design notes: "blush = 4"); the green cheeks stay
  on the sick face.
- **Desktop (Startup Star):** still a roll of her layers while calm, three clicks to reroll. While The Farm's pet-moods
  shows a mood for him, the star draws his current roll with that mood's face layer and stamps the shared mood symbol
  the way the build does (`art/mood-symbols/`, #371). A reroll during a mood puts the mood on the new roll.
- **His pages:** one Fuzzboi of her layers, the one his 2026-10-09 drawing was made from (fillA4 + outlineA + acc3, the
  birthday hat), in all nine faces (`desktop-art/fuzzboi-friend/<mood>-20261120.png`), stamped by the build like every
  pet. The 2026-10-09 pixel copy and GPT-6-Astra's whole-body frames are no longer shown; the whole-body frames are
  removed, and his sheet stays as the source of the faces.
- **Tests:** `test/fuzzboi-mood-layers-test-20261120.mjs` (one eyes layer per recipe, each face around her eyes, no pink
  blush, the files are exactly what the script makes); his page test; the star's `--self-test` checks that each mood
  changes only his face and its symbol, also after a reroll (it fails when the face layers are missing), and that the
  star's symbol is exactly the build's (Log Lynx's alarmed picture).

Credits: Fuzzbois layers by Astra. Faces by GPT-6-Astra. Mood symbols by Astra (#371). Cutting, layering and wiring by
Claude Opus 5.5 (`claude-opus-5-5`).
