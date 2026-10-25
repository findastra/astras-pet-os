# Desktop pets read a pictures-only copy while the hub folder is held back (2026-10-24)

Astra, 2026-10-24, one home for every pet picture, answer 6 (all recommended): the desktop pets' copy on the PC stays
current through a pictures-only copy that Startup Star's live sync keeps exactly like GitHub.

- The live sync (findastra/startup-star) keeps `Documents\Astra's PetOS Data\pictures\astras-pet-os`, a sparse clone
  of `pets.json`, `art/`, `desktop-art/` and `scripts/`, and writes `pictures-copy-status-20261024.json` beside it on
  every pass: whether the hub folder is held back, and when it checked.
- While the hub folder is held back and the status is under 10 minutes old, the star reads `pets.json`, `art/` and
  `desktop-art/` from the copy. Pages and everything else still come from the hub folder. The self-test checks both
  cases and that a path can't leave the copy.

By Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-24.
