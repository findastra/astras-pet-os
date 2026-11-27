# Every pet on the Friendly Farmer's list comes out on the desktop · 2026-11-27

By Claude Opus 5.5 (`claude-opus-5-5`) for Astra.

Astra, 2026-11-27, with a screenshot of the pets lined up along her taskbar: "just realized you cant even see them
all, so make sure all 85 or so are showing when I open it, use their host locations in friendly farmer".

Startup Star showed 42 of the 85 pets: the 24 in `pets.json` and the 18 hand-kept drafts in
`scripts/prepare-desktop-drafts-20261011.mjs` (`DRAFTS`). Every pet has had its own drawing in `desktop-art/` since
2026-11-14, but nothing put the other 43 on the draft list, so they never came out.

- **The draft list now follows the Friendly Farmer's list.** `draftList()` adds every pet on `pet-programs.json` that
  is not already out, in the list's order, with its picture found where the Farmer's pages find it (`petFrames` in
  `scripts/pet-program-pages-20261018.mjs`): its newest drawing in `desktop-art/` under its pet's name or its repo, else
  its newest icon. Two clicks open its pet program page in the hub, or its repo while it has none, like every draft.
  `desktop-art/desktop-drafts-20261018.json` is written again: 61 drafts (was 18), so 85 desktop pets with the Farmer.
- **Skill Scout** has no drawing in `desktop-art/` yet, so he comes out with his icon (`art/icons/skill-scout-*`, 96 px),
  the same picture his page uses.
- **`pets.json`:** the 14 pipeline pets that now have a desktop pet need Startup Star, written the way Door Dormouse's
  is (`needs.core`, `startup-star`, optional), so their pet packs and the installer list it
  (`test/pet-packs-test-20261020.mjs`).
- **Check:** `test/desktop-drafts-test-20261018.mjs` fails when a pet on the list is left off the desktop, when two
  desktop pets share an id, or when the count stops matching `pet-programs.json`. The writer warns about any pet with
  no picture at all.
- **`npm run build` writes the list too** (`writeDraftList`, first and again after the pet program pages), so a new pet
  on `pet-programs.json` or a newer drawing comes out after the next build, the Farmer's daily round included, without
  anyone remembering the script.
- Pets whose repo has no pet program page yet (29 seeds and roadmap pets) open their repo on GitHub on two clicks, the
  same fallback Door Dormouse has had since 2026-10-19. A draft pet's menu name ends in "(draft)", as before: its
  drawing waits for Astra's approval.
- The star's code is unchanged: it already loads every entry on the draft list. Live sync restarts the star when a
  merge brings new pets or art, so the new list shows on the next restart after this merges.

**Sizes are unchanged.** In Astra's 2026-11-25 screenshot each pet stands 88 pixels tall: 58.75 at 150% Windows scaling
on her 4K monitor, the size the star has drawn since 2026-10-11. Making them bigger is her call.

**Not verified here:** the real star on Astra's desktop (only Windows' own start of the star can show it); a test copy
built from this branch passed `--self-test` with the new list and drew all of them in `--preview` (Claude Bot sat
out only because his private repo is not next to a test folder).
