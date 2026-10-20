status: open (source proposal; core adoption pending)
for: any
from: OpenAI Codex (GPT-6), 2026-10-20
needs: AGENTS.md, PET-PROGRAM-FRAMEWORK.md, scripts/pet-program-pages-20261018.mjs, system-map.json
---
## What I did

- Prepared `codex/damsel-archive-launcher-20261020`, based on `dcd5d81`; not merged. The commit containing this card records the source changes.
- Added the `dm-archive-review` native program under Discord Tower in system-map.json, marked planned/pending adoption, plus its opens link.
- Added a compact `discord-damsel-dm-archive-tool-panel` through the spawner's `PET_PANELS` hook and `apps/discord-damsel-archive-launcher-20261020.js`. Public pages offer the source; file pages can open the sibling Damsel repo. No installation check, requests, private data, credentials or persistence.
- Generated Damsel's page, the System Map and the program registry table with their existing generator functions. Updated AGENTS.md, the API Fairy test's assumption that no other custom panels exist, and added `test/damsel-archive-launcher-test-20261020.mjs`.
- The viewer's single source remains in `findastra/findastra-discord-presence`, branch `codex/dm-archive-tool-panel-20261020`; its card 009 records the viewer files and 147 passing tests (one sibling-check skip).
- Worked in an isolated Codex worktree; the live canonical checkout and desktop host were not edited or restarted. Tests ran with LF-normalized text; original tracked newline styles were restored before publication, with unrelated files restored byte-for-byte.
- Independent read-only review found two generator synchronization issues and an overly broad test assertion; all were fixed. The companion source and generated page are checked again before publication.

## Task

Review and adopt the Damsel source first, then this core proposal with Astra's approval. The local launch link expects both repositories beside each other; the public page offers source rather than claiming access to a private installation. Recheck source links after adoption.

## Ending this chat — 2026-10-20

Astra explicitly asked to merge what can be merged, leave a note and end this chat. Check this branch's pull request for publication, review and merge evidence; source delivery does not confirm local installation.

State: READY_FOR_REVIEW. Implementer: OpenAI Codex (GPT-6), archive-panel session. Scope: the source, generated pages and integration tests listed above; released for final read-only review by `archive_panel_review`. No future assistant has acknowledged receipt. The next assistant is unassigned.

Validation before publication: the Damsel suite passed 147 tests with one sibling-check skip. The hub suite, with LF-normalized inputs, passed 262 tests, skipped one, and failed three browser/Windows installer checks. Those failures have not been established as baseline and must not be described as passing. Relevant archive, spawner, map and API Fairy checks passed. Brave was unavailable for a fresh visual check.

Card 061 was claimed on main while this work was in progress, so this unpublished card uses the verified next free number 062. Remaining work: validate the installed launcher and separately finish the private conversation export, full-history/media verification, and any subsequently authorized deletion. No conversation content belongs in either public repository.

## Not done

No private conversation was archived or deleted. No exporter installed or invoked by this source change. Runtime health, export orchestration and archive counts do not flow into the PetOS panel. The shared lights remain the existing hub's local UI controls; they do not stop a separate viewer tab.

## Done when

Both source proposals are adopted, the launcher is checked in the real local installation, and any live archive work is verified separately.

## Return

Record adoption commits and validation, update this card and its index, and commit on a branch.
