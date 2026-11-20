# The old pets page's name is gone everywhere · 2026-11-02

Astra, 2026-11-02: "the [old pets page] is not supposed to be a thing anymore, get rid of everywhere it is
referenced." Asked how far to go, she chose everything: rename the data keys too, and scrub the old records.

## What changed

- **Data keys renamed.** In `pets.json` the hub's repo is `hub` (was the old name) and the movement rules are
  `pet_life`. In every pet's `pet.json` the registration block is `hub` (`topic`, `home`, `repository`) and a pet
  submits changes through `hub.submit`. Every script, test, page and the installer reads the new keys only:
  `scripts/farmer-rounds-20261009.mjs` (`HUB_REPO`, `registry.hub`, `pj.hub.submit`), `scripts/lib.mjs`,
  `scripts/animal-guard-20261013.mjs`, `scripts/make-it-yours-20261020.mjs`, the idle-flash scripts,
  `apps/github-goldfish-20261008.html` and `installer/install-astras-pet-os-20261014.ps1`.
- **Words.** Where the old name meant the registry it now says "the hub"; where it meant the removed browser page it
  says "the old pets page". Records (handoffs, audits, ledgers, change history, retired releases) were rewritten the
  same way. Astra's own quotes say "[old pets page]" in brackets.
- **Files renamed:** `test/install-link-test-20261018.mjs` and `handoffs/042-any-installer-zip-20261018.md`.
  fuzzboi-friend's registration folder is referred to as `hub-registration/` (renamed in that repo's own pull request).
- **Guard:** `test/install-link-test-20261018.mjs` now also fails if the old name is in any tracked file or file name.
- **Left alone on purpose:** Data Dealer's casino-era name for its payments step (now "Settlement"), in
  `apps/data-dealer-20261008.html`. It is a different thing; the guard skips that one page.
- The Farmer's round workflow step is renamed "Rebuild the hub and the Farmer's desk".

## Pet repos

Each pet repo gets its own pull request renaming its old registration key to `hub` in its `pet.json` and the words in its files. Until a
pet's pull request is merged, the Farmer's round does not see that pet's submissions (it reads `hub.submit` only).

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-02.
