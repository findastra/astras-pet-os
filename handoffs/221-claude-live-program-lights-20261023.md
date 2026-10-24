status: taken by Claude (Rift Rabbit chat), waiting on the Inference Iguana tool move to merge
for: claude
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-23
needs: findastra/kernel-grove#6, this card's pull request #221, the Inference Iguana chat's tool move
---
## Task

Astra, 2026-10-23: "most of my vrchat programs are launched right now and I am not seeing the green lights lighting up
on the pet program. lets fix all of those right now on rift rabbit." A 3rd party program's ON/OFF light is green while
the program is open on her PC.

Then, the same day: "kernel grove is being updates, the Inference Iguana is taking some tools that were incorrectly
assigned to it", and "program-watch moves to Inference Iguana. Carry the VR program changes over once that move
merges."

## Ownership and state

State: BLOCKED on the move. Implementer: the Rift Rabbit chat. Writable files: this PR's page script, spawner and
tests. In whichever repo program-watch lands, only `ProgramWatch`'s program table and the pages' file it writes.
Ownership of Kernel Grove and Benchmark Rock (Inference Iguana) stays with the Inference Iguana chat until its move is
merged. The Rift Rabbit chat writes none of their files before then.

## What I did

- **kernel-grove#6** (`claude/vr-program-lights-20261023`, `5343bd9`, open, on hold). program-watch now also watches
  Steam, SteamVR, Meta Horizon Link, Virtual Desktop, Space Calibrator, the OVR tools, Double Hip Tracker, Base Station
  FOV Viewer, OSCGoesBrrr, Magic Chatbox, VR Pole Overlay and BS Manager. With its own data folder it also writes
  `programs-page-data.js` (`window.kernelGrovePrograms`, schema `kernel-grove-programs-v1`) into the `kernel-grove`
  folder of `Astra's PetOS Data` in Documents. Self-test: 80 of 80.
- **This PR, #221.** Pet program pages read that file every five seconds when they are opened on her PC. A 3rd party
  program is green while it is open, also when the pet's own link to it is only planned. A list older than a minute
  counts as nothing open. `npm test`: 331 pass. Record: `changes/live-program-lights-20261023.md`.
- **Checked live on Rift Rabbit:** SteamVR, Virtual Desktop, OVR Advanced Settings, OVR Dynamic Resolution, OVR Smooth
  Tracking and Space Calibrator were green, and the six programs that were closed were red.
- **Running on her PC:** Kernel Koala's watch, from kernel-grove#6's build in the PC copy's `bin`, started with
  `--startup`. It locks that program file, so a rebuild needs `--quit` first. The PC copy of kernel-grove is back on
  `main` and clean.

## Done when

1. The Inference Iguana move is merged and program-watch lives in its new home.
2. kernel-grove#6's changes are there: the VR program rows, `OpensSafely`, the pages' file and their self-test checks.
   The pages' file and its schema name change to the new owner's names. kernel-grove#6 is closed in favour of that
   pull request.
3. This PR's `LOCAL_PROGRAMS` path, `window.kernelGrovePrograms` and the schema check follow those names. Its tests
   pass, and Rift Rabbit's lights are checked live again with the new owner's watch running.
4. Astra OKs both pull requests in chat. The new owner's merges first, then #221.

## Return

Record receipt and review in this card's `## Receipt and review`, on this PR's branch.

## Receipt and review

Pending.
