# Rift Rabbit's Launch buttons work on Astra's PC (2026-10-24)

Astra, 2026-10-24: "Maybe i need to turn off all of the launch dependencies so this can be the main control hub.
depending on what your tracker orientation and assignments and amount are, the vrchat properties manager may need to
ignore certain trackers, and within the double hip double chest, there may be additional settings needed." The six
launcher questions went to her as slides, and she answered "All recommended". The head tracker's sticker and Double Hip
Tracker's pairs are still to come.

- The Launch buttons on Rift Rabbit's VRChat launch panel ask Inference Iguana's watch on this PC
  (findastra/benchmark-rock#8, `benchmark-rock-v1.0-vr-launch-v1.0`). The watch starts each program of the mode in her
  order and waits while she puts the headset on. It lights what Start VRChat waits for, then starts VRChat with her
  ignored trackers. Each step shows in the mode's card while it runs, with Next, Start VRChat and Stop.
- The buttons work only on the page opened from her PC while the watch runs. The page reads where to ask, and a code,
  from `Documents\Astra's PetOS Data\benchmark-rock\vr-launch-page-data.js`. The watch listens on 127.0.0.1 only.
  Anywhere else the buttons stay off and nothing is sent.
- The code that talks to the watch is its own file, `apps/pet-programs/vrchat-launcher-20261024.js`, and only Rift
  Rabbit's page loads it. The shared page script still sends nothing (its test is unchanged).
- Modes 1.2, 1.3, 2.2 and 2.3 say "not installed" until Space Override and Space Sync are installed (her answer:
  later). A Launch button that is off now looks off.
- On her PC: SteamVR no longer auto-starts VRCFaceTracking, OVR Advanced Settings, OVR Dynamic Resolution or Space
  Calibrator (her answer: the launcher owns them). The four files are kept in
  `Documents\Astra's PetOS Data\benchmark-rock\steamvr-autolaunch-backup-20261024`. The same switches in SteamVR's
  Settings › Startup / Shutdown › Choose Startup Overlay Apps turn them back on.
- The System Map gives Benchmark Rock (program-72) the tool `vr-launch`. Rift Rabbit (program-29) directs it, and it
  opens the 12 programs a launch can start.

Later the same day:

- No "Mode" (Astra: "Get rid of the "Mode" so go back to numbering with . ("2.0 Native VRChat Tracking" and "Launch
  2.0""). The cards read "1.0 Native VRChat Tracking", and the buttons "Launch 1.0".
- A Woojer vest switch next to OSCGoesBrrr (Astra: "We also need an option for Woojer vest (similar to
  OSCGoesBrrr)"). The vest has no program of its own on her PC. Windows pairs it as "Woojer Vest S3", a Bluetooth audio
  device, and Voicemeeter plays to it. While the switch is on, "Woojer vest (Voicemeeter)" is in each mode's Then open
  list, and the launch makes sure Voicemeeter is open and reminds her to turn the vest on. Whether the vest is
  connected is not checked. The System Map has Rift Rabbit look after the vest, and has vr-launch open Voicemeeter.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-24.
