# Audio Rescue's red page and its missing tool (2026-11-11)

Astra, 2026-11-11: "pick out like a red color for this page, the background of the page, and do an audit of it to see
if anything is missing here that we've done that's work related to voice meter, and make sure that everything else is
right on the page. Get rid of the more details on the unified footer."

- **Audio Rescue's own colours** (`apps/pet-programs/pet-program-page-20261018.css`): a deep oxblood page from
  Voicemeeter Bug's signal-red shell, silver-grey panel lines like his body, his pink cheeks for links and the
  working-copy box, signal red for marks.
- **Listen for robotic sound** was missing from the page: merged in voicemeeter-bug PR #13 (2026-11-08) and in the
  Bug's pet.json, but not copied into the hub (the repo is private, so the Farmer's round can't read it). Added to the
  Bug's `tools` in pets.json and as a System Map tool node of Audio Rescue, with its two links.
- **Quick summary** (pet-programs.json mini descriptor) now says what the Bug does today: restarts the audio engine,
  opens Voicemeeter again if it closes, and listens for robotic sound.
- **The unified footer's More details** is removed by hub #332 (Spoonfed's page, the same request the same day); this
  pull request is stacked on it and does not change the footer again.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-11.
