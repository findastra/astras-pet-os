status: open (waiting on Astra: DoubleHip DoubleChest pairs, a launch in the headset, then OK to merge rift-rabbit#8, then #239)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-24
needs: findastra/rift-rabbit#8, this card's pull request #239
---
## Task

Astra, 2026-10-24, on Rift Rabbit's VRChat setups: the Launch buttons don't work yet. "Maybe i need to turn off all of
the launch dependencies so this can be the main control hub. depending on what your tracker orientation and
assignments and amount are, the vrchat properties manager may need to ignore certain trackers, and within the double
hip double chest, there may be additional settings needed."

## Her answers

Six questions went to her as slides (https://claude.ai/artifact/RAU6UFwvy4UDttcAKf8Leq). Her reply: "All recommended."
Later the same day: "[H] is head tracker, correct", "Launching is done by Rift Rabbit... not sure why you keep
bringing up benchmark rock", and "Install both space sync and space override now".

1. At first, the launcher owned VRCFaceTracking, OVR Advanced Settings, OVR Dynamic Resolution and Space Calibrator,
   with their auto-start in SteamVR off. Later: "The launch modes arent working. lets make sure we fix the steam auto
   launch settings (fix for me) and make sure that we can at least launch 1.1 since that is what I currently use". So
   their auto-start is back on, restored from the backup, and a launch finds them already open. The Space Override and
   Space Sync overlays do not auto-start.
2. The launcher checks, and she says go: Start VRChat turns on when everything is on.
3. VRChat ignores the trackers her notes list for the Double Hip / Double Chest choice. In modes x.1 to x.3 it also
   ignores [H] (LHR-6963FCE5, now in the settings file). **Open:** whether "Double Hip only" means W + M or M + [ ]
   (her notes say both).
4. The launcher sets DoubleHip DoubleChest Tracker's Enable Hip / Enable Chest for her choice, and its pairs. **Open:**
   the right pairs. Today it has Chest = [ ] + M and Hip = W + C, but her notes say Hip = W + M, Chest = C + [ ].
5. Launching is Rift Rabbit's: its own program, `rift-rabbit-20261024.exe` (findastra/rift-rabbit#8), 127.0.0.1 only,
   with a secret code, knowing only the fixed modes.
6. Space Override (v10) and Space Sync (2.5.0) are installed. Each one's SteamVR add-on is off until its own mode, and
   the launcher switches them before anything starts.

## Ownership and state

Implementer: this chat (the Rift Rabbit launcher side session). Writable files: rift-rabbit#8's program files and
records, and this PR's `vrchat-launcher-20261024.js`, the VRChat setups' spawner, their CSS lines and tests. The
program lights stay Inference Iguana's (Benchmark Rock's program-watch and device-watch).

## What I did

- **findastra/rift-rabbit#8** (`claude/vr-launcher-20261024`): Rift Rabbit's first program, the launcher
  (`wonderland-launchpad-v1.0-vr-launch-v1.0`). Self-test: 42 of 42.
- **This PR, #239** (`claude/vr-launcher-20261024`): the Launch buttons and their live step list, the Woojer vest and
  Object Track VR choices, "DoubleHip DoubleChest Tracker" by its own name, no "Mode" in the names. The System Map
  gives `vr-launch` to Rift Rabbit (program-29) and adds Space Override and Space Sync. Rift Rabbit's needs list
  what the launcher opens. Record: `changes/vrchat-launch-buttons-20261024.md`. `npm test`: 343 pass. One fails,
  "from scratch, the installed farm ...", and it fails the same way on clean main. Rebased onto main after #240,
  #241, #242 and #243: the setups stay in their control panel as #240 drew them.
- **findastra/benchmark-rock#8** no longer has the launcher. It is only program-watch's row for DoubleHip DoubleChest
  Tracker (its real place and name), for the lights.
- **On her PC:**
  - SteamVR auto-starts her four programs again, as before today. The two new overlays don't auto-start, and the two
    new add-ons are off in `steamvr.vrsettings`. The originals are in
    `Documents\Astra's PetOS Data\rift-rabbit\steamvr-autolaunch-backup-20261024`.
  - Her page doesn't launch yet because #239 isn't merged into her PC copy of the hub. Its Launch buttons are still
    main's "Not built yet" ones. From #239's page, Launch 1.1 checked the add-ons, found Virtual Desktop open and
    waited at "Put on the Quest Pro". Stop worked.
  - Space Override and Space Sync were installed from their GitHub releases, and their checksums match GitHub's. Space
    Sync's installer removes Space Override ("so there aren't two drivers"), so Space Override was installed again
    after it. Their SteamVR driver names differ (`spaceoverride`, `spacesync`).
  - The launcher's settings, with [H]: `Documents\Astra's PetOS Data\rift-rabbit\vr-launch-settings-20261024.json`.
  - Rift Rabbit's launcher runs from rift-rabbit#8's build in this chat's scratchpad (`--startup`, through a shortcut
    and explorer.exe). Inference Iguana's watch runs from the PC copy's `bin`, as before.
- **Checked live** (before the move, with the same launcher code): Launch 1.0 and 1.1 opened Virtual Desktop and
  waited at the headset step; Stop (real click) stopped it.
- **Not checked yet:** SteamVR onward, the add-on switch with SteamVR reading it, DoubleHip DoubleChest Tracker's
  settings on the real file, and Start VRChat with `--ignore-trackers`. These need her in the headset.

## Done when

1. Her DoubleHip DoubleChest pairs are in the launcher's settings file (`hip_pair`, `chest_pair`,
   `ignore_trackers.hip`). Read with the file's code hidden; never paste the code.
2. One launch in the headset per headset reaches VRChat, with the right trackers ignored, and modes x.2 and x.3 show
   their add-on working.
3. After her OK: rift-rabbit#8 merges first, then #239. The PC copy of rift-rabbit is updated (it is on a Codex
   branch with uncommitted art: ask before touching it), built, and its launcher started from there.
4. Startup Star starts `rift-rabbit-20261024.exe --startup` at sign-in (the Startup Star chat's file).

## Return

Record receipt and review in this card's `## Receipt and review`, on this PR's branch.

## Receipt and review

Pending.
