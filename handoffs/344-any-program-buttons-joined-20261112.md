status: done (benchmark-rock#11 and #344 merged with Astra's OK, "Merge both")
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-11-12
needs: benchmark-rock#11, this pull request (#344), changes/program-buttons-joined-20261112.md
---
## Task
Astra, 2026-11-12, on Bass & Biscuits' page: "audit this page for the buttons that are working and not working and fix
them. You know, they should open programs or close them." Then: "Finish #11 + #313".

## Ownership and state
State: DONE
Implementer: Claude desktop session (2026-11-12); writable files: this branch and `claude/program-buttons-20261107` in
benchmark-rock; ownership: released.
Reviewer: Astra (merge OK in chat, "Merge both"); next action: none.
#313's own branch was started over from main by its chat on 2026-11-12 and now holds The Astral Plane's page, so the
program buttons are here, on `claude/program-buttons-joined-20261112`, not on #313.

## What I did
- benchmark-rock `claude/program-buttons-20261107` (#11), up to `31f567d`: main (#10) merged in, keeping #11's link
  with its code. From #10, OVR Pager's path and the web browser. `Native.Shows`: only a window she can see counts, which
  fixes Razer Synapse's 0x0 tool window. `UsbDevices`: the APC64 and the desk mic. `--self-test` on Windows: 112 passed,
  0 failed.
- astras-pet-os `claude/program-buttons-joined-20261112` (#344), `8b43f7ac` plus this card: #313 joined with main
  (`apps/program-lights-control-20261106.js` removed), `data-usb` device lights, the web browser's program-watch link,
  pages rebuilt. `npm test`: 431 pass, 1 fail (the from-scratch farm install, which fails on main too).
- Tested on her PC: the worktree's watch ran in place of hers (`--quit`, `--watch`), and the working copy was served on
  127.0.0.1. On Bass & Biscuits' page, Spotify opened and closed from its light, Synapse in the tray answered that it
  stays in the tray, and the APC64 and mic lights were green. Her own watch (`--startup`, main's build) was started
  again afterwards.

- Before merging, main had moved: benchmark-rock#12 (Unity's light opens a project) was joined into #11 (the Unity
  open now lives in `Launch`; #12's reasons answer a page asking for a program the watch does not list), self-test 114
  passed, 0 failed; #11 merged as `b345c50`. Benchmark Rock rebuilt on the PC and its watch restarted (`--startup`); it
  writes `link` and the APC64 shows on.
- main merged into #344 again (#341's `chatSay` rename kept; the seated helper's answer still called the old `say`, now
  `chatSay`). `npm test`: 448 pass, 1 fail (the Windows from-scratch farm install, which fails on main too).

## Done when
Both merged; Benchmark Rock rebuilt on the PC (`build-benchmark-rock-20261023.ps1`, `bin` is not in git) and its watch
restarted; a red and a green light tried on a pet program page from the live checkout.

## Return
Record the merges and the PC rebuild here.

## Receipt and review
Merged with Astra's per-PR OK in chat ("Merge both", 2026-11-12).
