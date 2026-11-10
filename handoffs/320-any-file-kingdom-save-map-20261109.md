status: open (waiting on Astra: merge file-master pull request 13, then this one)
for: any
from: Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-09
needs: changes/file-kingdom-save-map-20261109.md, pull request 320, findastra/file-master pull request 13 and its card 013
---
## Task

Astra, 2026-11-09: "I need the File Kingdom (Pet Program) to have this information in panels, like we have for the
standard" (the save map: where everything is saved and where to save things), and "a major tool here is Everything
Search, I want you to be using that to create these organizational assessments ... Whatever you use, make sure it
shows up as a tool (in a pill) on the pet program (File Kingdom)".

## Ownership and state

State: READY_FOR_REVIEW
Implementer: Claude Opus 5.5 session of 2026-11-09; writable files: system-map.json (File Kingdom's nodes and links),
pets.json (File Master's entry), apps/file-master-tools-20261109.html and .js, changes/file-kingdom-save-map-20261109.md,
this card; ownership: released
Reviewer: unassigned; next action: review pull request 320, then Astra's merge OK (file-master 13 first)

## What I did

- File Kingdom's page had 2 planned 3rd party programs and 4 tools. It now has the `save-map` toolset (where-to-save,
  where-things-live, out-of-place, save-map-look, all working on the page), six tools that had no node, and five 3rd
  party programs: Everything, ES, Git for Windows, Windows PowerShell, SpaceSniffer (planned). All from data; the
  spawner is unchanged.
- The tool page reads only the look File Master wrote on this PC, as PC Master Race's does, and shows a made-up
  example anywhere else.
- pets.json: File Master's needs and 15 checks dated 2026-11-09, each from a run or a look that day.
- Evidence: `npm run build` clean, `npm run check` OK, `npm test` 394 of 400 (the 5 failures are the same on `main`
  on this PC that day), the page seen in the browser pane from the branch with the PC's look of 20:57.

## Still open

1. **Everything does not start by itself.** It is set to run as administrator with no service, so Windows blocks it
   at sign-in and asks each time it is started. In Everything: Tools > Options > General, tick "Everything Service"
   and untick "Run as administrator" (one Windows prompt). Only Astra can do this; it is a Windows setting.
2. **D: is not in Everything's index** (exFAT). File Kingdom walks D: slowly and cannot search it. In Everything:
   Tools > Options > Indexes > Folders > Add > D:\. The first scan of an archive drive takes a while.
3. **Three tool names picked without Astra:** file-scan, cleanup-plan, undo-plan (the scanner, the plan runner and
   undo, which card 044 left off the map "for want of names"). Change them in system-map.json if she prefers others.
4. **Old labels:** `pet-program-12-v1.0-repo-catcher-v1.0`, `-new-programs-watch-`, `-everything-search-` and
   `file-master-v1.0-mass-delete-v1.0` do not follow the named pattern (`file-kingdom-v1.0-...`). Renaming touches
   skills/find-things, skills/new-pet-or-tool, skills/farm-security, the mass-delete guard and its test.
5. fit-check and click-check were not run on the new tool page.
6. The script tools' pills have no page of their own: file-master is private, so a link to the script would be dead
   for anyone else.

## Done when

- file-master pull request 13 and this pull request are merged with Astra's OK, and the PC's hub copy is fast-forwarded.
- File Kingdom's live page shows the example on the public site and the PC's own look when opened from the PC.

## Return

Record receipt, review findings and anything changed under the next heading.

## Receipt and review

Pending.
