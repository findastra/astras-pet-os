status: open (waiting on Astra: build and try it on her PC, then her OK to merge benchmark-rock#11, then this #313)
for: any
from: Claude Opus 5.5, 2026-11-07 (chat closed at Astra's word, 2026-11-08: "push this and close chat")
needs: AGENTS.md, findastra/benchmark-rock AGENTS.md and README.md, changes/program-buttons-20261107.md in both repos
---

## Pick up here

Astra, 2026-11-07: "I think some of the buttons to turn the 3rd party apps on/off aren't working. I should be able to
press the red button, then it launches that program and the button turns green if its on and detected. Fix all of the
buttons in 3rd party programs." Model page: Rift Rabbit's. Her answers: "all recommended" (a green light asks, then
closes like the X button, never forced; command-line tools and drivers show installed or not; websites open in a tab).

### Ownership and state
State: built, reviewed, pushed; not merged; never run on Windows. Implementer: released. Reviewer: the next session,
on Astra's PC.

### Next, in order (on Astra's PC)
1. In `Documents\Astra's PetOS\benchmark-rock`: check out `claude/program-buttons-20261107`, run
   `build-benchmark-rock-20261023.ps1` (log-den beside it), then `bin\benchmark-rock-check-20261023.exe --self-test`
   (expected: every check passes on Windows; under mono 102 passed and 2 Windows-only ones failed).
2. Start the watch (`bin\benchmark-rock-20261023.exe --watch`, or Startup Star's menu), open Rift Rabbit's pet program
   page from this hub's branch, press a red light (VRChat, OSCGoesBrrr...), see it open and turn green; press green, say
   yes, see it close. Write what happened here.
3. With her OK: merge benchmark-rock#11 first, then #313.

### Open items
- Security: the link code sits in `programs-page-data.js` in `Documents\Astra's PetOS Data`. If the local web server she
  uses (the one at port 8791) serves that folder to any site, a web page she visits could read the code and open or
  close programs in the table (never forced). Same pattern as the pet chat helper and Rift Rabbit's launcher. Fix in
  that server (do not serve `Astra's PetOS Data` to other origins) or move the code out of a JS global. Not decided.
- Process names and Start menu shortcut names for the 44 new programs come from general knowledge, not her PC: any
  that do not light up need their row fixed in `Knowledge`/program-watch's table.
- latencymon, object-track-vr, stream-deck (planned, not installed), macattack (another computer) and web-browser are
  left out of program-watch on purpose.

## What I did
- findastra/benchmark-rock#11, branch `claude/program-buttons-20261107`: the listener, 44 more programs, self-test
  checks, AGENTS.md, README.md, pet.json, `changes/program-buttons-20261107.md`.
- findastra/astras-pet-os#313, branch `ccr-3e9a4204-291t5t`: `apps/pet-programs/pet-program-page-20261018.js`,
  `scripts/pet-program-pages-20261018.mjs`, `system-map.json`, `pets.json`, PROTECTION-RINGS.md (grant
  `inference-iguana-open-close`), INTELLIGENCE-LEVELS.md, rebuilt pages, `test/program-buttons-test-20261107.mjs`,
  `test/public-safety-test-20261014.mjs` (the new test is a loopback fixture on made-up 400xx ports), this card.
- Fixed on the way: the page script's two `say` functions clashed, so no light's bubble showed since the chat window.
- Tests: hub `npm test` 402 tests, 6 fail (76-79, 86, 87, failing on main too); benchmark-rock under mono 102 passed,
  2 failed (Windows only). Reviewed by two separate reviewers; their findings fixed.

## Receipt and review
Pending: the next session records the revision it read and what it picked up.
