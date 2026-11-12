status: READY_FOR_REVIEW, waits for Astra's merge OK in chat
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-11-12
needs: Astra's OK to merge #338; then the farm on her PC fast-forwarded and rebuilt (npm run build)
---
## Task

Astra, 2026-11-12: "We need to focus on the Flash audit and how it works, and its connection to the template pet
program, because those two things kind of need to go hand in hand, so that when we do audits and we're looking at user
interface, that we're auditing it based off of what's on the template, and then those are items on the Flash audit. So
I need you to redo the Flash audit, the list of it or whatever, to line up with our new template, our template pet
program."

## What I did

- `docs/flash-audit-20261014.md`, section 3, "6. The page: the Model Pet Program, part by part": one check per part of
  `apps/pet-programs/model-pet-program-20261102.html`, top to bottom, then the whole page. IDs kept (A47, A52, A49,
  A39, A22, A48 reworded or moved); A62 to A71 new. 71 checks. The table "The page checks follow the Model Pet Program"
  maps old to new.
- `scripts/flash-template-20261112.mjs`: compares every pet program page with the template part by part; `npm run build`
  runs it and The Farm's flash-audit checks show the result (no Run), each linking the template.
- The auditor no longer takes Goldfish's preflight rows for retired page markers (A41, A44, A45, A52), nor counts the
  preflight's Not verified checks as its own (`PREFLIGHT_LEFT_OUT`): The Farm had shown those as "all pass".
- `test/flash-template-test-20261112.mjs`: a template part with no check, checks out of the template's order, or a
  template failing its own checks fails the test.

## Found on 2026-11-12 (54 pages)

- A63, 9 pages: the version reads `v0.1`, not `v0.1.0` (Skill Scout, Gatekeeper Goddess, Linux Penguin, White Hat
  Weasel, Cipher Owl, Roaming Raven, Pet Police Officer, AI Dashund, Door Dormouse). Fix: each pet's pet.json `version`.
- A49, 13 pages: no pictures for seven moods (Claude Bot, Skill Scout, Gatekeeper Goddess, Linux Penguin, Journal
  Jellyfish, Kernel Koala, White Hat Weasel, Cipher Owl, Inference Iguana, Roaming Raven, Pet Police Officer, AI Dashund,
  Role Fairy). The art is A02: new art is Astra's.
- A70, The Farm: its R W X panel has no L1 row (system-map.json `access` gives the farm no L1 grant).
- The other 18 page checks pass on every page.

## Not done / next

- #318 (Flash Audit Run wording) changes the same lines of `flashAuditBody` and `scripts/flash-audit-checks-20261108.mjs`:
  whichever merges second takes main, keeps both changes, rebuilds and tests.
- #247 (clicker training under the session notes) would change the template's order: the test then asks for the
  matrix's order to follow.
- A54 still looks for "Third Party Programs" in each pet's own app, not the pet program page: worth moving to the page.
- A45 (width) and A50 (colours) stay an assistant's checks: fit-check and Astra's eye.

## Receipt and review

- Branch `claude/flash-audit-template-20261112`, tested in an LF clone: `npm test` 428 tests, 422 pass, 0 fail,
  6 skipped, before and after merging main (with #332, which took More details off the footer: the footer check
  followed the template with no code change).
- The Farm's page served from the branch in the pane: 71 checks; the page checks show the build's result and link the
  template; no Run on them.
- Not yet reviewed by a second assistant. Astra has not given her merge OK.
