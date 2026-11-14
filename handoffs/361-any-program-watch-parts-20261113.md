status: open (waiting on Astra: merge drum-dog#13 and unity-unicorn#47, then benchmark-rock#13, then #361)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-11-13
needs: drum-dog#13, unity-unicorn#47, benchmark-rock#13, this pull request (#361)
---
## Task
Astra, 2026-11-13, after card 344: "Inference Iguana is the pet, and it's pet program is Benchmark Rock. So all of those
things need to be formatted correctly, they are separate from anything to do with Drum Dog or Unity Unicorn." Then
"Yes, move those" (the APC64 and mic lights and the web browser: Drum Dog's; opening the newest Unity project: Unity
Unicorn's) and, for how they run, "All recommended (A)": each pet owns its part in its own repo, and Benchmark Rock's
watch runs it. Her answer deck: https://claude.ai/artifact/7sCsef2AUgFmGLyf3WgNJj

## Ownership and state
State: READY_FOR_REVIEW
Implementer: Claude desktop session (2026-11-13); writable files: branch `claude/program-watch-parts-20261113` in
drum-dog, unity-unicorn, benchmark-rock and this repo; ownership: released.
Reviewer: unassigned; next action: Astra's merge OK, in the order above.

## What I did
- drum-dog#13: `program-watch-parts-20261113.json`: the APC64 and Seiren mic (USB vendor and product ids) and the web
  browser.
- unity-unicorn#47: `scripts/unity-editor/open-newest-project-20261113.ps1` (from benchmark-rock#12; `-DryRun` names
  Poppy on this PC) and `program-watch-parts-20261113.json` (Unity's opener, why MCP for Unity is never opened). The
  repo was cloned to `Documents\Astra's PetOS\unity-unicorn` on 2026-11-13, where the watch looks for it.
- benchmark-rock#13: those parts out; `PetParts` reads each pet folder's newest parts file next to benchmark-rock's.
  `--self-test` 120 passed, 0 failed.
- #361: the pages learn "plugged in" from the watch (`"how": "usb"`), no USB list in the hub. `npm test` 442 pass, 1
  fail (the Windows from-scratch farm install, which fails on main too).
- Tried on the PC: this branch's watch beside the drum-dog and unity-unicorn branches; on Bass & Biscuits' page the
  APC64 and mic lights were green and said "plugged in". Her own watch was started again afterwards. Unity was not
  opened from its light.

## Done when
All four merged in order; the PC copies of drum-dog and unity-unicorn fast-forwarded before Benchmark Rock is rebuilt
(`build-benchmark-rock-20261023.ps1`, `bin` is not in git) and its watch restarted; the lights checked on the live page.

## Return
Record the merges and the PC rebuild here.

## Receipt and review
Pending.
