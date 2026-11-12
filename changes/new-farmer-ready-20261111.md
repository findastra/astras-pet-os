# Ready for a new farmer: v0.4.0-beta, the first-pet steps, and tests that pass on another farm (2026-11-11)

Astra, 2026-11-11: "My friend Dev wants to try downloading Astra's PetOS and spawning her own first pet. She has an
idea. So I need to make sure everything on GitHub is good to go for her ... check the README, front page, make sure it
makes sense for another agent reading it ... walk this through the beginning, like we have a brand new user using it."

Branch `claude/new-farmer-ready-20261111`, by Claude Opus 5.5 (`claude-opus-5-5`).

## What a brand-new user ran into (walked through on 2026-11-11, on Astra's PC, in throwaway folders)

1. **The download is three weeks old.** `releases/latest` is v0.3.0-beta (2026-10-18, b17419f), 819 commits behind
   `main`. It installs (from scratch, 1 pet, 4 s), but INSTALL.md's `-Developer` stops it ("A parameter cannot be found
   that matches parameter name 'Developer'"), and the tools MAKE-IT-YOURS.md sends a new farmer to next are not in it:
   `make-it-yours`, `farm-pets`, `pet-packs`, the farm lock, the beginner guide and the pet program pages. Today's
   `main` installs cleanly, from scratch and in Developer mode, and its farm-pets `check` and `plan add` work.
2. **The community links are dead for everyone else.** The vet-clinic, the Shed and the Kennel are private (each holds
   a README, AGENTS.md, SECURITY.md and a LICENSE), so every link to them answers 404 for a new user.
3. **Two pages disagreed about the download.** README.md, INSTALL.md and the guide say never to use the green Code
   button; MAKE-IT-YOURS.md step 1.4 said to install with it.
4. **Nothing said who approves on someone else's farm.** The rules say "Astra" approves; INTELLIGENCE-LEVELS.md's L4 row
   says it is the farm's own user, but no page a new farmer's AI reads says so.
5. **No steps for a brand-new pet.** One line ("ask your AI ... once his spawning tool is built").
6. **`npm test` failed right after make-it-yours.** In an LF clone of `main`, 417 of 423 pass (6 skipped). After
   `make-it-yours XxdevilishxX`, 11 fail: they read the copy's own pets.json and expect Astra's account. Adding a
   made-up pet by hand failed 5 more until its developer name, page address, code list and picture were in.

## What changed

- **Version 0.4.0-beta**: `package.json`, `installer/install-astras-pet-os-20261014.ps1` (`$Version`), `pet.json`
  (`version`, `source` tag) and the Friendly Farmer's `version` in `pets.json`; `npm run build` carried it to his pet
  program page. The release itself waits on Astra's OK after this merges.
- **MAKE-IT-YOURS.md**: what you need (Git, Node.js 20+, the GitHub CLI); step 1.4 installs from the release and clones
  the copy; "On your farm, you are L4"; `npm test` passes before and after make-it-yours; section 5 "Make your first
  pet", seven steps tried on a fresh copy until `npm test` passed, with a copy-ready message for an AI; the community
  places are "not open yet", and problems go to this repo's issues.
- **INSTALL.md**: step 5 names the one exception (a farmer's own copy, once it has a pet of theirs); step 6 points to
  the first-pet steps and says the community places are not open yet.
- **README.md**: "Make it yours" mentions the first pet and L4; the agent paragraph points to MAKE-IT-YOURS.md after
  the install; the Kennel and Community lines say "not open yet" and link this repo's issues.
- **apps/beginner-guide-20261019.html** ("How to Take Care of Your Farm!"): a "Make a brand-new pet" part with a
  copy-ready message; the Kennel and vet-clinic lines say "not open yet".
- **Tests**: `test/fixtures/astras-farm-20261111.mjs` (`asAstrasFarm`, `isAstrasFarm`) puts a copy's pets.json back the
  way Astra's own farm has it, so the tests that describe her farm check the same thing on every farm. Used in
  farm-owner, farm-owner-upstream, pet-packs, pet-privatizer and pet-stages; farm-lock compares the lock with the farm
  owner pets.json names. On Astra's farm nothing changes.

Not changed: PET-WORDS.md and TOOLS-AND-TRICKS.md still link the three community repos (reference pages, not on a new
farmer's path); the release notes are written when the release is cut.
