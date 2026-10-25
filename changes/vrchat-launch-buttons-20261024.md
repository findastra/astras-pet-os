# Rift Rabbit's Launch buttons work on Astra's PC (2026-10-24)

Astra, 2026-10-24: "Maybe i need to turn off all of the launch dependencies so this can be the main control hub.
depending on what your tracker orientation and assignments and amount are, the vrchat properties manager may need to
ignore certain trackers, and within the double hip double chest, there may be additional settings needed." The six
launcher questions went to her as slides, and she answered "All recommended". Then: "[H] is head tracker, correct",
"Launching is done by Rift Rabbit", and "Install both space sync and space override now". DoubleHip DoubleChest
Tracker's pairs are still to come.

- The Launch buttons on Rift Rabbit's VRChat setups ask Rift Rabbit's own launcher on this PC
  (findastra/rift-rabbit#8, `rift-rabbit-20261024.exe`, `wonderland-launchpad-v1.0-vr-launch-v1.0`). It first switches
  SteamVR's Space Override and Space Sync add-ons for the mode. Then it starts each program of the mode in her order
  and waits while she puts the headset on. It lights what Start VRChat waits for, then starts VRChat with her ignored
  trackers ([H] too, in the modes with a head tracker). Each step shows in the mode's card while it runs, with Next,
  Start VRChat and Stop.
- The buttons work only on the page opened from her PC while the launcher runs. The page reads where to ask, and a
  code, from `Documents\Astra's PetOS Data\rift-rabbit\vr-launch-page-data.js`. The launcher listens on 127.0.0.1
  only. Anywhere else the buttons stay off and nothing is sent.
- The code that talks to the launcher is its own file, `apps/pet-programs/vrchat-launcher-20261024.js`, and only Rift
  Rabbit's page loads it. The shared page script still sends nothing (its test is unchanged).
- All four modes per headset can launch: Space Override (v10) and Space Sync (2.5.0) were installed from their GitHub
  releases. Each one's add-on is off in SteamVR until its own mode. A Launch button that is off looks off.
- On her PC: SteamVR auto-starts VRCFaceTracking, OVR Advanced Settings, OVR Dynamic Resolution and Space Calibrator
  again, as before (Astra, later the same day: "lets make sure we fix the steam auto launch settings (fix for me)"),
  restored from `Documents\Astra's PetOS Data\rift-rabbit\steamvr-autolaunch-backup-20261024`. A launch finds them
  already open, and closes Space Calibrator the way its X does in the modes without it. The new Space Override and
  Space Sync overlays do not auto-start.
- The System Map gives Rift Rabbit (program-29) the tool `vr-launch`, which opens the programs a launch can start, and
  adds Space Override and Space Sync as programs Rift Rabbit looks after. Rift Rabbit's needs list them all.
- No "Mode" (Astra: "Get rid of the "Mode" so go back to numbering with . ("2.0 Native VRChat Tracking" and "Launch
  2.0""). The cards read "1.0 Native VRChat Tracking", and the buttons "Launch 1.0".
- A Woojer vest switch next to OSCGoesBrrr (Astra: "We also need an option for Woojer vest (similar to
  OSCGoesBrrr)"). The vest has no program of its own on her PC. Windows pairs it as "Woojer Vest S3", a Bluetooth audio
  device, and Voicemeeter plays to it. While the switch is on, "Woojer vest (Voicemeeter)" is in each mode's Then open
  list, and the launch makes sure Voicemeeter is open and reminds her to turn the vest on. Whether the vest is
  connected is not checked. The System Map has Rift Rabbit look after the vest.
- "DoubleHip DoubleChest Tracker" is the program's name everywhere in the setups and the launcher (Astra: "the one
  softrware to be named DoubleHip DoubleChest Tracker and make sure the pet program refelcts that").
- An Object Track VR menu next to it: Off, Small Hoop, Large Hoop, Dance Pole (Astra: "Also will eventually have
  Object Track VR, for tracking the Small Hoop, Large Hoop, and Dance Pole ... its also a choice between the 4 objects
  being tracked, like the DoubleHip DoubleChest Tracker drop down"). She counts four objects, and the fourth is hers to
  name. The program is not out yet, so the launch step says it is not installed and opens nothing. Object Track VR is on
  the System Map as a planned program that Rift Rabbit looks after.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-24.
