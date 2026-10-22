# The farm lock, Part 5b: pet packs come onto a farm (2026-10-22)

Astra, 2026-10-22: "Start Part 5b here: pet packs come onto a farm, checked file by file against the pet's own repo on
GitHub, with --unchecked on purpose, the pet's code next to the farm, and the uninstaller removing pack folders." Card
058, Part 5b, from `docs/farm-lock-20261021.md` and her answer 3 (2026-10-21).

- **`node scripts/farm-pets-20261021.mjs add <pet pack.zip> --yes`** brings the pet with its code. It checks the pack
  in this order (`scripts/farm-pets-packs-20261022.mjs`):
  - against itself: safe paths, and every file matching its manifest;
  - against the farm: on its list, from the account the list names, for this computer, with no key in it;
  - file by file against the pet's own repo on GitHub, at the pack's commit.

  Code that differs is always refused. A pack that cannot be checked comes in only with `--unchecked`, and the farm lock
  says so.
- **The code goes into its own folder next to the farm** (on Linux, with the pet services). The farm lock lists every
  file with its SHA-256.
  - It never runs by itself.
  - A newer pack replaces it.
  - Taking the pet away removes it while it is unchanged, and `check` compares it with the farm lock.
- **The uninstaller** removes the unchanged pack folders the farm lock lists. It follows no links, and it keeps and names
  a changed folder. The installer, run again, says where a leaving pet's pack code stays.
- Not copied onto the farm: a pack's pictures and page. The release has them, so there is one art source.
- Checked on Forensic Ferret's real pack from GitHub, on a throwaway installed farm, with the real uninstaller. Tests are
  in `test/farm-lock-packs-test-20261022.mjs`.

By Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-22.
