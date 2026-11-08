status: open (Astra's one-window Spoonfed, with Spoonfed Sugarcube as its logo, on findastra/spoonfed#9, draft; colors and real data (keys filed with API Fairy) pending; her OK to merge pending)
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

## 2026-11-03, later: more notes and answers (Claude Opus 5.5, `claude-opus-5-5`)

**Built** on spoonfed#9 (commit fd78a0a): distances 1, 2, 3, 4, 5, 10, 15, 20, 25 and 30 miles from you (the four
sample spots past 30 moved inside it); a mouse wheel over the distance, cuisine or price reel turns it one value per
click; more room under spoonfed and above the row; her unified footer pinned to the bottom of the window (it had sat
just below the fold). 21 tests pass.

**Her answers in chat**, replacing the reviews, photo-label and texting questions of the deck
[Spoonfed: real restaurants](https://claude.ai/artifact/6oWLtcxcmUTXAzdKwecQPb) (private):

- Reviews from both Google and Yelp.
- Pictures of the food matter most, with the dish name when we can get it; reviews too, but less.
- A shake loads the pick's menu to scroll through, saved so people nearby don't wait for it; a link straight to the
  menu.
- Directions and the menu reach the phone for free: a QR code on a computer, a tap on a phone. No texting service.
- She also asked for an account that keeps favorites.

**What that needs** (checked 2026-11-03, partly from third-party summaries): Google and Yelp give no menus, and tools
that copy menus out of Google Maps break Google's rules. Google's rules let an app keep only a place's ID; Yelp's limit
is reported as 24 hours; so their photos and reviews are fetched fresh for each person. A menu read from the
restaurant's own page is Spoonfed's own record and can be shared. Yelp photos: 3 on the middle plan, up to 12 on the
top plan; about $229 a month.

**Answered** (Astra: "pretty much all recommended"): distance is how far from you (as built); the menu comes from the
restaurant's own page, read by an AI and saved for everyone nearby; food pictures from the restaurant's own first,
then fresh Google and Yelp ones, with an AI keeping only the food; sign-in for favorites by email link.

**Then, the same day:** the bottom row became her rolls, newest first, kept on the device (spoonfed#9, commit 2e260e2):
"it should just be stuff you roll", with no add-five-more button. The key requests for real data are filed with API
Fairy on Astra's PC (names stay there). Next: once the keys exist, a small server-side adapter for places, reviews and
photos; menu reading; the sign-in and shared-menu service (which service is still to pick); then QR codes and links for
directions and the menu.

## 2026-11-04: one window, Sugarcube as the logo (Claude Opus 5.5, `claude-opus-5-5`)

Built on spoonfed#9 (commit b0bd9e0), from Astra's notes in chat:

- On a computer the page fits the window with no scrolling; spoonfed sits higher.
- The pick is on the left and the reels on the right; each roll drops into the left end of the row.
- No "Any" on the reels: unlocked reels roll, every reel has a lock (miles too), and reels turn by scrolling only
  (wheel, drag or swipe), no picker menu.
- Distances add ¼, ½ and ¾ mile for walking; cuisines are Google Places' restaurant types (32).
- Google and Yelp stars side by side (stars, not percents; they never decide a roll), on one line with distance,
  price and cuisine.
- Save (on this device) and Send to phone: one QR code that opens the spot in Spoonfed on a phone, with Directions and
  Menu buttons.
- Spoonfed Sugarcube is the logo, no bubble; his face follows the page (thinking while it spins, asleep when left
  alone) and a poke makes him hop. This replaces the card's pet-well task: Astra said he is not for the page itself.
- Footer: four equal gaps around the sparkles and the star, each outlined in black.

**Answered:** colors are Espresso (deck [Spoonfed: colors](https://claude.ai/artifact/26PbGsAwYbdvSTQygngAY2),
private; Astra: "Espresso looks really good. Let's do a lot of different shades of brown"). Built on spoonfed#9
(commit 8490cdc) with the middle panels at about two-thirds size and more room around them.

**Open:** a dish score for real menus (review mentions weighted by stars, plus photos), noted in the README.

## 2026-11-04, later: no repeats, rating weight, drum reels, a spoon logo (Claude Opus 5.5, `claude-opus-5-5`)

Built on spoonfed#9 (commit 38ff265), from Astra's notes in chat:

- No repeats: nothing rolled today comes back today, nor the pick on screen; the row never repeats the pick, and the
  old pick drops into the row as soon as the reels start.
- Better-rated spots for their price roll more often (a half star above the same-$ average doubles the chance, a
  quarter to four times); bad ones still can. This replaces "ratings never decide a roll".
- Each $ shows its per-person amount (under $10, $11–30, $31–60, $61+). New types: Bar, Coffee, Dessert, Ice cream.
- The row has a Saved tab; faster wheel scrolling; slower, softer drop-in.
- Facts line spread out in four colors (Google gold, Yelp copper, miles blue, $ light green).
- The two big boxes are the same size, 16 px apart like the row's cards. Reels turn as drums.
- Sugarcube sits in a long silver spoon seen from the side (drawn after the side views in US design patents D351,091
  and D285,889), with a shine along it; a poke rolls; happy while the QR code is up.
- The footer line spans only the footer and fades at its ends.

**Asked:** deck [Spoonfed: on your phone](https://claude.ai/artifact/KVVegsVrjctxAp2VTHUBp7) (private), six questions:
which phone version first (recommended: web app), where it lives (Cloudflare), who can open it (anyone with the link,
capped), Yelp now or later (later), how it's paid for (free with daily caps), and more types (16 foods, one Bar).
Restaurants are still made up until the Google key exists.

## 2026-11-04, evening: Spoonfed on a phone

Astra: "get me the live link so i can see if it works on my phone. i want others to see the same thing but on their
phone." Claude can't create her Cloudflare account, so the phone copy went on her GitHub site instead (her "ok publish
it", then "merge"): **https://findastra.github.io/spoonfed/**, the built `dist/` in the `spoonfed/` folder of
findastra.github.io (#39, merged as a5e1cd4). Spoonfed's repo is private and Pages needs a public one. The app builds
for that address through `experiments.baseUrl` `/spoonfed` (findastra/spoonfed 095a58f on #9). The six deck questions
stay open: this answers "web app first" and "anyone with the link" for now, with the same 26 made-up spots for everyone.
It's live and checked: signed out, the page, script and fonts answer 200; at phone size a roll works
and the pick's name, stars and buttons show. Not yet seen on a real phone.

## 2026-11-05 to 06: long names, her own spoon, phone copy updated (Claude Opus 5.5, `claude-opus-5-5`)

From Astra's notes in chat, on spoonfed#9:
- "Yes, fix names": on a phone a long name takes a second line instead of "…" (689a120).
- "use the exact spoon I gave you": the logo spoon is the exact spoon from her picture, never a drawn or substitute one.
  "it looks weird and pixely": her picture is small, so the spoon's outline is now traced at 8x and smoothed, filled
  with the picture's own shading (cbae471, `assets/spoon-photo-20261106.png`). She OK'd the picture for her public
  site ("Yes, it's OK").

The phone copy has both: findastra.github.io#40, squash-merged as 263454d on her "Yes, merge #40" (an earlier commit
there held a spoon photo she didn't want). GitHub Pages' deploy stuck on "updating pages" twice; a third publish
request worked. Live and checked: the page serves the new script and spoon picture, and the old photo answers 404.

## 2026-11-06: an even spoon, dark chocolate, a clean footer star (Claude Opus 5.5, `claude-opus-5-5`)

From Astra's notes in chat, on spoonfed#9:
- "spoon still looks bad", "I want it to be smooth, and your curvature consistent": the spoon's outline is refitted
  with smooth curves that bend evenly, within about one pixel of her picture's edge, with a rounded tip and a round
  handle end (8545703, `assets/spoon-photo-smooth-20261106.png`).
- "make it lower, the sugar cube doesnt need to be in the spoon exactly", then "move the spoon a little to the left and
  up so that the same amount sticks off each side from the sugar cube and the end of the D": the spoon hangs under him
  and the word, 34 px past his cube and 34 px past the d (b98f67d).
- "more of a chocolate, so I can see the black outline of the sugar cube", then "make the brown deeper more like dark
  chocolate": the page is `#341F14`; the panels keep their colors.
- "the unified footer star looks weird": its black outline was four shifted shadows that smeared the star's glow on the
  brown page; it now follows the star's own edge.

On her "Yes, make the PR", findastra.github.io#41 replaced the phone copy with this build; squash-merged as f2a2028 on
her "Yes, merge #41". The deploy step hung again, but the live page serves the new script, the new spoon picture
answers 200 and the old one 404.

## 2026-11-06 to 08: the spot's card with Google's map, pink food types, Bar (Claude Opus 5.5, `claude-opus-5-5`)

From Astra's notes in chat, on spoonfed#9 (36bdc3b):
- "when you click on the picture of the restaurant it opens a card that shows it right on the map", "this card needs to
  look like the others on the main page but with a map instead of pic", "put them side by side instead of stacked but i
  like the squares", "use google maps please": tapping the pick's picture (or its name) opens a card like the pick card,
  with the picture and Google's embedded map (no key) side by side as two squares. The old detail view is gone.
  Made-up spots stand their own miles from the visitor, so the browser asks for a location (kept in memory only);
  Google sees the made-up spot's place near them.
- "I want the food type to have its own color too": food types are pink; the reels match (distance blue, food type
  pink, money green).
- "there needs to be "bar" as an option next to Veggie": a Bar choice; 12 sample spots have a bar.
- "theres a weird white border": the page had no background of its own; it is chocolate now.

On her "Yes, make the PR" (2026-11-08), findastra.github.io#42 put this build on the phone link; squash-merged as
fe2c15a on her "Yes, merge #42". Live and checked: Pages built fe2c15a, the page serves the new script and the old one
answers 404; the reels show their colors and the Bar choice.

**Still open:** the six questions in
[Spoonfed: on your phone](https://claude.ai/artifact/KVVegsVrjctxAp2VTHUBp7) (private); the Google Places key
(restaurants are still made up, so Feed me can't roll real places near her); her merge OK for spoonfed#9; the cuisine
reel still cuts long types ("Indonesi…") on phones.
