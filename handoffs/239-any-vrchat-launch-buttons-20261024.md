status: open (waiting on Astra: her tracker answers, a launch in the headset, then OK to merge benchmark-rock#8, then #239)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-24
needs: findastra/benchmark-rock#8, this card's pull request #239
---
## Task

Astra, 2026-10-24, on Rift Rabbit's VRChat launch panel: the Launch buttons don't work yet. "Maybe i need to turn off
all of the launch dependencies so this can be the main control hub. depending on what your tracker orientation and
assignments and amount are, the vrchat properties manager may need to ignore certain trackers, and within the double
hip double chest, there may be additional settings needed."

## Her answers

Six questions went to her as slides (https://claude.ai/artifact/RAU6UFwvy4UDttcAKf8Leq). Her reply: "All recommended.
I'll send the head tracker sticker and the Double Hip / Double Chest pairs next."

1. The launcher owns VRCFaceTracking, OVR Advanced Settings, OVR Dynamic Resolution and Space Calibrator. Their
   auto-start in SteamVR is switched off.
2. The launcher checks, and she says go: Start VRChat turns on when everything is on.
3. VRChat ignores the trackers her notes list for the Double Hip / Double Chest choice. In modes x.1 to x.3 it also
   ignores the head tracker. **Open:** which sticker the head tracker is (H?), and whether "Double Hip only" means
   W + M or M + [ ] (her notes say both).
4. The launcher sets Double Hip Tracker's Enable Hip / Enable Chest for her choice, and its pairs. **Open:** the right
   pairs. Today Double Hip Tracker has Chest = [ ] + M and Hip = W + C, but her notes say Hip = W + M, Chest = C + [ ].
5. It lives in Benchmark Rock (Inference Iguana), on 127.0.0.1 only, with a secret code, and knows only the fixed modes.
6. Space Override and Space Sync later. Their modes say "not installed".

## Ownership and state

Implementer: this chat (the Rift Rabbit launcher side session). Writable files: benchmark-rock#8's
`vr-launch-20261024.cs` and its records, and this PR's `vrchat-launcher-20261024.js`, the launch panel spawner, its CSS
lines and tests. Program-watch's and device-watch's code stays as it is, apart from Double Hip Tracker's path.

## What I did

- **findastra/benchmark-rock#8** (`claude/vr-launch-20261024`): the tool `benchmark-rock-v1.0-vr-launch-v1.0`.
  Self-test: 103 of 103.
- **This PR, #239** (`claude/vr-launcher-20261024`): the Launch buttons, the live step list, the System Map's
  `vr-launch` node, and `changes/vrchat-launch-buttons-20261024.md`. `npm test`: 334 pass. One fails,
  "from scratch, the installed farm ...", and it fails the same way on clean main.
- **On her PC:**
  - SteamVR's auto-start is off for the four programs (`Steam\config\vrappconfig`). The originals are in
    `Documents\Astra's PetOS Data\benchmark-rock\steamvr-autolaunch-backup-20261024`.
  - The launcher's settings were made with her notes' values. Head tracker and pairs are empty:
    `Documents\Astra's PetOS Data\benchmark-rock\vr-launch-settings-20261024.json`.
  - Inference Iguana's watch is running from benchmark-rock#8's build in this chat's scratchpad (`--startup`, started
    through a shortcut and explorer.exe), not from the PC copy's `bin`.
- **Checked live:** Rift Rabbit's page, served from 127.0.0.1, enabled modes x.0 and x.1 and marked x.2 and x.3 "not
  installed". Launch mode 1.0 and 1.1 opened Virtual Desktop and waited at the headset step. Stop (real click) stopped
  it.
- **Not checked yet:** SteamVR onward, Double Hip Tracker's settings on the real file, and Start VRChat with
  `--ignore-trackers`. These need her in the headset.

## Done when

1. Her tracker answers are in the launcher's settings file (`head_tracker`, `hip_pair`, `chest_pair`,
   `ignore_trackers.hip`). Read with the file's code hidden; never paste the code.
2. One launch in the headset per headset reaches VRChat, with the right trackers ignored.
3. After her OK: benchmark-rock#8 merges first, then #239. The PC copy of benchmark-rock is rebuilt (`--quit` first),
   and the watch is started from the PC copy again, so Startup Star's sign-in start runs the launcher.

## Return

Record receipt and review in this card's `## Receipt and review`, on this PR's branch.

## Receipt and review

Pending.
