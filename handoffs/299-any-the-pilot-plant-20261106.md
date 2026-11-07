status: open (waiting on Astra: her OK to merge #299; then the build, below)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-11-06
needs: nothing
---
## Task

Astra, 2026-11-03, on the PC Master Race deck (card 282): "We need an engineering pet, it seems like. Question 3,
maybe think of that." A side chat of card 282's chat thought it through and put nine questions to her as a deck,
"Engineering pet questions". On 2026-11-06 she answered "A" on question 4, then "All recommended". She said "come up
with ideas", picked "Flamingo + Pilot Plant" from them, and said "just push it all".

Her answers, recorded here as the deck said:

1. **A new pet.** No pet she has fits: Python Panther fits only Jupyter, Paper Patty is a public science news site,
   and AI Dashund is AI research only.
2. **All seven programs:** DWSIM, Qalculate!, Jupyter with NumPy and SymPy, GeoGebra (not Desmos, which needs its own
   API key), the Natural Number Game (Lean), Zotero and WebPlotDigitizer.
3. **Shared pills:** Jupyter's pill also shows on Python Jungle, and Zotero's also on AI Doghouse.
4. **The PC Master Race way.** Every program is third party, in its own pill with a live preview. The only native piece
   is a look tool that reads each program for its pill. No lesson tool unless she asks.
   Also **Rift Rabbit's page parts** (her answer on the PC Master Race chat's deck, 2026-11-06):
   - L3's note at the top (pets.json `editorial`).
   - The devices it looks after, if any (models only, no serial numbers).
   - Its own tools working on the page (an `embed` on the tool node).
   - Open/Launch buttons later, through a launcher on the PC.
5. **Home and learning only,** never work files.
6. **A private repo.**
7. **Flowsheet Flamingo · The Pilot Plant:** pet program #87, repo `the-pilot-plant`.
8. **A seed now, then built.** #282 merged on 2026-11-03, so the build waits on nothing but #299. Art: one paid image,
   a draft until she approves it.
9. **The downloads, at build time,** each checked first (winget's SHA-256 or the maker's signature). Versions as
   winget listed them on 2026-11-03:
   - DanWBR.DWSIM 9.0.5.
   - Qalculate.Qalculate 5.13.2.
   - Python.Python.3.13 3.13.17, in its own folder, then JupyterLab, NumPy, SymPy and Matplotlib. Her Store Python
     stays as it is.
   - DigitalScholar.Zotero 10.0.7.

   GeoGebra, the Natural Number Game and WebPlotDigitizer run in the page, so nothing is installed for them.

## Ownership and state

Implementer: this chat, for this PR's branch (`claude/the-pilot-plant-seed-20261106`). The build below is open for
any chat. Card 282's chat owns PC Master Race and the Rift Rabbit model. This card answers card 282's Not done 5
and 6.

Overlaps: #245 (adds #85), #61 and #36 also touch `pets.json` or `pet-programs.json`; this PR only appends entries.
Whichever merges second takes `main`'s generated files and rebuilds.

## What I did

- **This PR (#299):** `pet-programs.json` #87 (seed, `repo_exists: false`, draft mini-descriptor), a `pets.json` seed
  entry with her answers and two `works_with` links, the agent name "Engineering Agent",
  `changes/the-pilot-plant-seed-20261106.md`, and generated files rebuilt.
- **Checked on 2026-11-06:** #87 was free on `main` and in every open PR that touches `pet-programs.json`, and no file
  used either name.
- **Tests:** `npm test` in an LF worktree passed 379 of 387, with 3 skipped. The 5 failures are 4 pet chat helper tests
  and `farm-setup-test` ("hub copy (git)"); they fail the same way on unchanged `main` (368ffed0) in a worktree.

## Not done (the build)

1. Make the private `findastra/the-pilot-plant` repo (topic `pet-app`) and move the seed to the pipeline.
2. Build its page with the seven pills. What each pill can really show:
   - **Live:** Jupyter (JupyterLab is a local web page), GeoGebra (it embeds without a key under its non-commercial
     licence) and Zotero. Zotero needs its read-only local API on port 23119, which works after her tick on "Allow
     other applications on this computer to communicate with Zotero".
   - **Saved state only:** DWSIM and Qalculate!, until a launcher exists.
   - **Not checked yet:** whether the Natural Number Game's and WebPlotDigitizer's sites allow being shown inside a
     page. The game keeps its progress in browser storage and can export a file. WebPlotDigitizer v5 is closed
     source; v4 is AGPL 3.
3. Build the look tool, the only native tool, and make it work on the page.
4. Add the shared pills on Python Jungle (Jupyter) and AI Doghouse (Zotero).
5. Add Rift Rabbit's parts: L3's note, devices if any.
6. Make the art: one paid image, a draft until she approves it.
7. Do the four downloads, each checked first.
8. Add Open buttons. They need the launcher from card 282's Not done 3.

## Done when

1. Astra OKs #299 in chat and it merges.
2. The build above is done and shown to her as a working copy.

## Return

Record the merge below.

## Receipt and review
