# The Flash Audit's page checks follow the Model Pet Program (2026-11-12)

Astra, 2026-11-12: "We need to focus on the Flash audit and how it works, and its connection to the template pet
program, because those two things kind of need to go hand in hand, so that when we do audits and we're looking at user
interface, that we're auditing it based off of what's on the template, and then those are items on the Flash audit. So
I need you to redo the Flash audit, the list of it or whatever, to line up with our new template, our template pet
program."

By Claude Opus 5.5 (`claude-opus-5-5`), in Claude Code, 2026-11-12.

- **The list:** section 3 of `docs/flash-audit-20261014.md` now has "6. The page: the Model Pet Program, part by part":
  one check per part of the template, top to bottom (editorial status panel, cyberhome, title and version, quick
  summary, System Map box, intelligence levels, L1 to L4, R W X, session notes, emotions, clicker training, friends
  list, unified footer, chat), then the whole page (Data Chip's phone, pills, paired lights, width, colours). No ID
  changed: A47, A52, A49, A39, A22 and A48 were reworded or moved to their part, and A62 to A71 are new for the parts
  that had no check. 71 checks in all. The doc's "The page checks follow the Model Pet Program" table maps old to new.
- **The check:** `scripts/flash-template-20261112.mjs` compares every pet program page with the template, part by part,
  reading what to match from the template itself (how a part folds, its fold arrow, its More details lines, headings,
  moods, clicks, tool boxes, pills and lights). `npm run build` runs it, and The Farm's flash-audit checks show the
  result with a link to the template, so it is never older than the pages. On 2026-11-12, 54 pages: 18 of the 21 page
  checks pass everywhere; A63 finds 9 versions written `v0.1` instead of `v0.1.0`, A49 finds 13 pets with no pictures
  for seven moods, and A70 finds The Farm's R W X panel has no L1 row.
- **The auditor:** it no longer takes Goldfish's preflight rows that looked in each pet's own app for markers the pages
  stopped using (A41, A44, A45, A52: 83 findings each on 2026-11-08), and no longer counts as its own the checks the
  preflight only marks Not verified, which The Farm showed as "all pass" (`PREFLIGHT_LEFT_OUT`). It now runs 18 checks.
- **Tied together:** `test/flash-template-test-20261112.mjs` fails when a part of the template has no check, when the
  checks are out of the template's order, or when the template fails its own checks.
- PET-PROGRAM-FRAMEWORK.md section 3 says the Flash Audit checks pages against the Model Pet Program; the System Map's
  flash-audit job says so too.
