# Pet (Agent) and Pet Program (Agent's Living Space), never "pet app" (2026-10-26)

Astra, 2026-10-26: "not supposed to ever be pet app, been trying to get rid of that. Astra's PetOS or Pet (Agent) or Pet
Program (Agent's Living Space) for example Rift Rabbit and Wonderland Launchpad." She approved one hub-wide pull
request.

- **PET-WORDS.md** now opens with her words. The first rows are **a Pet and its Pet Program** (the whole set, one repo),
  **Pet (Agent)** and **Pet Program (Agent's Living Space)**, with Rift Rabbit and Wonderland Launchpad as the example.
  "pet app" and "pet apps" are in the **Not** column, and `words` in pets.json lists them as retired, so the GitHub
  Goldfish flags them across the account and `test/pet-words-test-20261009.mjs` keeps them out of README.md,
  PET-FILES.md, AGENTS.md, CLAUDE.md and ROSTER.md.
- **The skill `skills/pet-app` is `skills/build-a-pet`** (frontmatter `name: build-a-pet`). AGENTS.md, CLAUDE.md, the
  handoff skill and the open cards point at it. Its "Both providers" section says to install it under that name and
  remove the old `pet-app` folders from `%USERPROFILE%\.claude\skills` and `%USERPROFILE%\.codex\skills`.
- **Every other use** in the hub is rewritten to read naturally: Pet, Pet Program or Astra's PetOS. Astra's own quotes
  that used the word are paraphrased around her remaining words. Generated files (ROSTER.md, the Markdown pets, the
  System Map, the pet program pages, the developer words page) were rebuilt with `npm run build` from their sources
  (`scripts/roster.mjs`, `system-map.json`, `pets.json`, `developer-words-20261019.json`).
- **Developer mode** no longer maps the retired word; it maps "Pet (Agent)" to "agent" and "Pet Program (Agent's
  Living Space)" to "control hub".
- **The profile round** finds the pet list in a profile section named for Astra's PetOS, Pets or Pet Programs
  (`PET_SECTION` in `scripts/farmer-profile-20261009.mjs`, and the same in `scripts/pet-program-link-20261018.mjs`).
- **New test:** `test/no-retired-pet-word-20261026.mjs` fails if "pet app" or "pet apps" (any case, whole words, across a
  line break too) appears in any tracked text file, or if anything links or reads `skills/pet-app`. It skips the
  records (`changes/`, the Flash Audit's dated rounds, handoff cards marked done), the Not column of PET-WORDS.md and its
  copy in pets.json, and two literal strings: the retired credit line the checks still recognise, and a real folder
  name on Astra's PC.
- **Kept as they are, for Astra to decide:** the GitHub topic `pet-app`, the `pet.json` value `"kind": "pet-app"` and
  `cage.topic`, the retired repo name `findastra-pet-apps`, the old browser-storage key prefix, and the Windows
  assembly name `AstraPetApps.DesktopPets` in `scripts/desktop-pets-20261011.manifest`. Renaming any of them changes
  what the Farmer's round, the Goldfish and the pets read.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-26, on `claude/no-more-pet-app-20261026`.
