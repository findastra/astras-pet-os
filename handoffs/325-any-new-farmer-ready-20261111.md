status: open (waiting on Astra: the merge OK, then the v0.4.0-beta release)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-11-11
needs: changes/new-farmer-ready-20261111.md, MAKE-IT-YOURS.md section 5, INSTALL.md, scripts/installer-zip-20261018.mjs
---
## Task

Astra, 2026-11-11: her friend Dev (GitHub XxdevilishxX) wants to download Astra's PetOS and spawn her own first pet.
Make everything on GitHub make sense to a brand-new user and her AI, walking it through as one.

## Ownership and state

State: READY_FOR_REVIEW
Implementer: Claude Opus 5.5 desktop session; writable files: the files of pull request #325; ownership: released
Reviewer: unassigned; next action: Astra reviews and OKs the merge

## What I did

- Walked a new user's path on Astra's PC in throwaway folders (never her real install): downloaded
  `releases/latest` (v0.3.0-beta, b17419f, 103,838,380 bytes), unzipped it, ran `-ListPets`, `-ListPets -Developer`
  (fails: no such parameter) and a from-scratch install into a scratch `-InstallDir` and `-ShortcutDir` with
  `-NoLaunch` (works, 4 s, 1 pet). Today's `main` (git archive) installs the same way, and in Developer mode; its
  farm-pets `check` and `plan add evidence-locker` work.
- Checked every newcomer link: the installer, the beginner guide, the System Map and the Farmer's desk answer 200; the
  vet-clinic, the Shed and the Kennel answer 404 (private, about 5 KB each).
- In an LF clone of `main`: 417 of 423 pass (6 skipped). After `make-it-yours XxdevilishxX`: 11 fail. Adding a made-up
  pet by hand: 5 more, until its developer name, page address, code list and picture were in.
- Branch `claude/new-farmer-ready-20261111`: version 0.4.0-beta; MAKE-IT-YOURS.md (what you need, step 1.4, "On your
  farm, you are L4", section 5 "Make your first pet"); INSTALL.md steps 5 and 6; README.md; the beginner guide; the
  tests' `test/fixtures/astras-farm-20261111.mjs`; `changes/new-farmer-ready-20261111.md`.
- Tests on fresh LF clones of the branch: Astra's farm 423 tests, 417 pass, 0 fail, 6 skipped; after make-it-yours 417 pass, 0 fail (11 failed before); with the made-up pet
  added by section 5's steps 417 pass, 0 fail.
- Merged main (after #299 and #315) into the branch; `npm run build` changed nothing; the three runs above are on that
  merge. Open pull requests #290, #256, #143 and #61 already conflict with main on their own files; #325 adds no new
  conflict with them.
- The release notes are drafted for v0.4.0-beta (on the PC, in the chat that made this card), to paste when the release
  is cut.
- Not changed: PET-WORDS.md and TOOLS-AND-TRICKS.md still link the three community repos.

## Done when

1. Astra answers the deck (the community places; the release's name).
2. Merged with her OK.
3. Release v0.4.0-beta cut from the merge commit with `node scripts/installer-zip-20261018.mjs v0.4.0-beta`, marked
   Latest, carrying `astras-pet-os-installer.zip`, with her OK; then the download checked again from a clean folder.
4. Dev's first try: whatever she or her AI trips over becomes the next card.

## Return

Record answers, the merge and the release here, under "Receipt and review".

## Receipt and review

- 2026-11-12, deck answered: Astra, "All recommended". The vet-clinic, the Shed and the Kennel stay private and
  the docs say "not open yet" (already on the branch); the release is v0.4.0-beta (already on the branch).
- 2026-11-12: main (after #328, #332, #333 and #335) merged into the branch with no conflicts; `npm run build`
  changed nothing; on fresh LF clones Astra's farm, Dev's after make-it-yours and Dev's with a first pet each pass
  417 of 423 (0 fail, 6 skipped). Of the 19 open pull requests that share files with #325, none goes from merging
  cleanly with main to conflicting after #325 (`git merge-tree`).
- Merge: pending Astra's OK. Release: pending her OK after the merge.
