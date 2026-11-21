status: taken by Codex pet-art-unified-20261115
for: any
from: Codex, 2026-11-15
needs: changes/pet-art-unified-20261115.md, handoffs/370-any-newest-pet-art-20261114.md
---
## Task
Redo the registered pets and nine moods under Astra's 2026-11-15 art direction recorded in the change note.
## Ownership and state
State: IN_PROGRESS
Implementer: Codex pet-art-unified-20261115. Writable scope: desktop-art/, art-kit/, scripts/build-desktop-art-20261011.mjs, scripts/pet-size-20261023.mjs, scripts/desktop-pets-20261011.cs, generated art and pet pages via the build, relevant art sizing tests, dated review gallery, this card and change note. Ownership: claimed. Reviewer: unassigned. Next action: generate and inspect revised sheets and correct sizing. Earlier #370 is merged and released. Preserve other branches.
## What I did
Fetched origin and started a clean worktree from a6537a7c. Opened its editorial page. Studied the four style references, Storage Stoat and Mommy's Mommies, current sheets and render sizing. Generated one unadopted whale draft. No completed art delivery, no tests of new art yet, no merge or installation.
## Done when
All 86 pets accounted for, all nine expressions visually reviewed, original simple spiky Fuzzboi selected, per-pet corrections checked at actual displayed size, square centered frames validated, private originals kept private, complete gallery delivered and independent review recorded. Merge requires Astra's specific approval.
## Return
Record progress and review here.

## Owner correction, 2026-11-19
Astra wants a face-selection review before any final redraw: show every active pet's existing face and new draft, including upright alternatives already generated. Preserve the exact original Storage Stoat with the charming crooked head. Do not straighten all pets by default. No separate animation layer or animation asset rollout. Preserve other art details. Exclude retired Port Spider (already removed on main). Show all nine expressions plain and with shared matching mood symbols, including the exclamation mark.

The 21 newly staged draft sets were copied into the private local review collection, hash-verified, and removed from desktop-art so the original default drawings remain in place. No original artwork was deleted. All 84 first-round sheets were preserved locally as review history; their earlier animation-reference label is superseded. No animation runtime was implemented. The new review is a local-only slideshow, face-review-20261119.html, with individual selections and a summary. Private artwork remains outside the public repo. Final redraws now wait for Astra's choices. The original Stoat and native Data Chip are already decided and must not be asked again.

Current acceptance supersedes the earlier bulk-redraw plan: deliver the complete comparison with symbols; collect choices; then do one final pass preserving selected faces and other details. Layout remains one common square. No merge or installation.

### Face review delivered, 2026-11-19
Local face-review-20261119.html contains all 85 current pets and 172 comparison variants. Port Spider is absent. Existing Fuzzboi uses the authentic simple spiky recipe; Skill Scout uses the earlier private proposal. Those two existing references have only an idle expression and are labeled accordingly; their new drafts contain all nine. The original Stoat's nine plain frames are pixel-identical to the source. Data Chip is rendered by the existing native code with its approved screen face. Proposed shared symbols have matching black outlines; every available expression is shown plain and marked, with the old symbols available for comparison.

Verified every referenced image exists, all pet IDs are unique, no private absolute paths appear in review data, and the actual browser shows square previews, nine paired mood views, original Stoat selected, and no Port Spider. A separate read-only reviewer checked source identity and coverage; its missing-reference and Chip-face findings were corrected. The slideshow is open in the one in-chat pane; choices persist locally and have a summary/export. No final redraw, adoption, merge or desktop installation is claimed. Next action belongs to Astra: choose preferred faces, then implementation resumes from those choices.
## Receipt and review
Pending.

2026-11-16 scope addition: shared apps/pet-programs/pet-program-page-20261018.css and page sizing regression checks, authorized by Astra's fixed-square clarification.

## Symbols-only approval and delivery, 2026-11-20
Astra answered: "Update symbols; keep existing faces." This supersedes the pending face selection and final redraw. All existing faces, including the exact original Storage Stoat, stay. Publish the nine reviewed shared mood symbols; the Z is purple and now slimmer, and the music note is neon pink. No separate animation layer. Port Spider stays retired. No private draft artwork is published.

Scope extends to scripts/mood-symbols-20261120.mjs, scripts/indicators.mjs, scripts/art-kit.mjs, scripts/build-frames.mjs, the Model Pet SVG in scripts/pet-program-pages-20261018.mjs, art/mood-symbols/, generated output and the related tests. One shared PNG set feeds registered frames, desktop mood pictures and the model page. Existing plain frames and desktop-art sources have no changes.

Validation: build and pet registry check pass. Final focused symbol/page/change-note suite: 47 pass. Registry suite: 25 pass. Full suite: 496 tests, 485 pass, 5 fail, 6 skipped; the two failures caused by this change were fixed and passed on rerun. The remaining three are Windows installer tests: developer install and uninstall report Get-FileHash unavailable in the test environment; farm setup has the existing worktree .git-copy issue addressed by open #395. Installer files are unchanged here.

Independent read-only review by review_face_choices: no remaining blocker in reviewed code. Confirmed unchanged plain/source art, immutable alpha composition, all three shared consumers, and visual checks of Stoat, Whale, Rabbit and Moth. The final slimmer purple Z and pink note were also checked in the local review pane. Running desktop pets cache pictures until reload.

Open-PR scan: #280 is an older sick-waves change superseded by these approved symbols; do not merge it over this set. Other overlaps are generated pages or separate page features (including #377 CSS theme and #345 click fixes). No other branch was edited. Publication to the working branch is ready; live merge and desktop reload remain pending specific approval for #371 under the owner's merge rule.

### Publication authorized, 2026-11-20
In reply to the specific request to merge #371 and refresh desktop pets, Astra said: "when you are done, push everything to guthub and make sure the main pets hosting file is updated". Proceeding with #371 only. Fetched latest main (8b6fd60e), retained the merged Pilot Plant and installer fixes, and regenerated the conflicted output pages from the combined sources. The hosting source remains main at the repository root; the main pet program page, art/latest and desktop mood paths are included. Existing pet faces remain unchanged by this work.

Main advanced again to 67d4ad07 (approved Role Fairy update, #327) immediately before publication. Preserved that update, including her registered faces and page theme, and rebuilt the combined outputs so her moods use the same approved symbols. #401's separate Fuzzboi work remains untouched. The earlier integration passed all 67 focused checks; the final page/symbol checks are repeated for this merge.
