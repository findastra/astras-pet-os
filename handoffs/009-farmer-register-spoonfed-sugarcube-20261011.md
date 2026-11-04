status: open (Spoonfed Sugarcube's pet well and Astra's one-screen redesign on findastra/spoonfed#9, draft; reviews source and her OK to merge pending)
for: farmer
from: OpenAI Codex (GPT-6), 2026-10-11
needs: PET-FILES.md, PET-WORDS.md, pets.json, Spoonfed pet.json
---

## What I did

- In `%USERPROFILE%/Documents/ChatGPT/Spoonfed`, added `pet.json`, `pet-sprite-20261011.json`, `AGENTS.md`, `CLAUDE.md`, `LICENSE`, and `docs/sugarcube-hatching-20261011.md`; edited `README.md` with pet credit, running instructions, and limits. The app is the existing Expo restaurant-discovery draft; its pet is Sugarcube.
- In `%USERPROFILE%/Documents/Projects/findastra-pet-apps`, edited `pets.json` to add an unpublished hatching pipeline entry, `AGENTS.md` to record authorship, and `handoffs/README.md`; added this card. The recipe is staged at `%USERPROFILE%/Documents/ChatGPT/Spoonfed/docs/sugarcube-art-recipe-20261011.json`; the active generator was restored after its contract test correctly rejected a recipe without a registered resident.
- No commits, pushes, new repositories, topic changes, paid image calls, or pet installations. Existing dirty desktop/tray work in the Cage was preserved. These changes are local working-tree changes, not a merged or published release.
- The sprite manifest has no frames. Sugarcube is not yet a drawn Cage resident or visible in Spoonfed. Do not claim otherwise.
- Ran `node scripts/build.mjs --metadata-only` to regenerate existing Cage registry/docs without generating artwork; `node scripts/check-cage.mjs` passed. Ran all 62 Cage tests, corrected the staged-recipe placement, and reran the suite. Validated Spoonfed pet metadata and real entry/manifest/home paths with Node. An independent Spoonfed typecheck still hits the previously unresolved TypeScript compiler stack overflow; this preparation does not claim to repair or finish the original app QA.

## Task

After Astra approves the single paid generation, register Sugarcube with art ID `spoonfed-sugarcube` and `asset_date: 20261011`, moving it from pipeline to pets. Use the shared generator style unchanged. Generate only this pet, convert and inspect all nine frames, and use the shared mood stickers. Use the local Spoonfed app as the destination; establish a valid Cage app link without claiming a nonexistent live service.

Copy approved frames into Spoonfed’s dated `pet-art/` assets and fill `pet-sprite-20261011.json`. Add a square pet well and wire the moods to real discovery state per the local character brief. All food information is still demo data.

## Done when

One approved character has nine usable transparent 256px moods; Spoonfed visibly uses it; Cage build/check/tests pass; and publication status is accurate. Obtain Astra’s OK before creating any GitHub repo or pushing to main.

## Return

Record exact changed paths, validation, commits, and live/local state here. Set done only when the integration is actually complete.

2026-10-11 publication update: Sugarcube art is now published in private findastra/spoonfed (see docs/pet-release-20261011.md). Paid-generation approval wait above is obsolete. Desktop local draft loader now previews Sugarcube; permanent shared registry registration remains separate.

## 2026-11-03: Astra's answers and the redesign (Claude Opus 5.5, `claude-opus-5-5`)

**Answers** (deck [Spoonfed: what first](https://claude.ai/artifact/GAWpZia2fU6EkS9HoS3y5W), private; Astra: "All recommended"):

| # | Question | Answer |
|---|---|---|
| 1 | What do we build first? | Spoonfed Sugarcube moves into the app |
| 2 | Which town do real restaurants start in? | Not yet: keep the made-up Sample Town |
| 3 | Which restaurant source? | Google Places, when we get there (she then asked about Yelp: see open items) |
| 4 | Which phone do you test on? | Not now |

**Her notes in chat, the same day:** distance instead of area (5, 10, 20, 25, up to 50 miles); the bottom row
scrolls sideways forever with the mouse wheel and loads by the miles; reviews "from like Yelp, right? Or figure out
where they need to come from"; far fewer words (no headline, demo, sample, Discover, Explore or Saved); no bright
colors, "cool and hip, but a little sexier"; spoonfed at the top center, the two big panels, the row, and her unified
footer; the pick panel scrolls through all the restaurant's food pictures, each tastefully labeled.

**Built** on [findastra/spoonfed#9](https://github.com/findastra/spoonfed/pull/9) (draft, branch
`claude/sugarcube-pet-well-20261103`, commit 2601c56), not merged:

- `App.tsx`: one screen; distance reel; Spoonfed Sugarcube's pet well and bubble in the reels panel; pick gallery with
  dish labels; sideways row that pages and takes the mouse wheel, with Go farther; dark palette; unified footer.
- `src/lib/sugarcube-mood-20261103.ts` (+ test): her mood from app state by this hub's mood key (PET-FILES.md, most
  urgent first). Eight of nine moods are reachable; `alarmed` waits for a live restaurant source.
- `src/lib/discovery.ts` (+ tests): `maxMiles`, `nearbyPage`, `galleryFor`, `datasetProblems`.
- `src/data/restaurants.ts`: sample distances spread from 0.8 to 47.5 miles.
- `pet-sprite-20261011.json`: frames are the hub's `art/latest/moods/spoonfed-sugarcube/` addresses (one art source,
  A58); no pictures were copied into the repo, which replaces the "copy approved frames" step above.
- README, AGENTS.md, pet.json `built_with`, app.json colors.

**Checked:** 21 tests pass; typecheck passes with `node --stack-size=16000` (plain `pnpm typecheck` still overflows);
web build checked in the browser pane at desktop and phone widths. Not on a real phone.

**Open:**

- Reviews source: Yelp's data plans are paid only and give three 160-character snippets per place; Google Places gives
  up to five reviews, ratings, prices, hours and photos, with a free monthly allowance. Her pick is needed, then a key
  request for API Fairy (not filed). Real photos come without dish names, so the gallery's labels would need a
  picture-reading model.
- Saving favorites went with the Saved tab; bring it back only if she asks.
- Registration in `pets.json` (pipeline to pets) is still the Farmer's step; the drafts are not marked approved.
