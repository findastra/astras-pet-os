status: merged and the star rebuilt; waiting for her first launch in the headset
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-11-01
needs: card 239, findastra/rift-rabbit#14
---
## Task

Astra, 2026-11-01: "Rift Rabbit is still fucked up. Your launch options are fucked up. Nothing is launching right. Fix
it." and "I'm not describing it for you. Do it yourself."

## What I did

Found three causes, each enough to stop her launches:

1. **The launcher was off.** The PC restarted on 2026-10-31 at 8:06 PM, and nothing started the launcher again (card
   239's step 4 was never done). This PR adds it to Startup Star's sign-in list.
2. **The installed launcher was the Oct 25 build.** It refused what the page sends now (`air-link`, `double: "auto"`,
   `face`, `fov`, `pole`). The current build is installed in `Documents\Astra's PetOS Data\rift-rabbit\program`, and
   the old exes are in `program\before-20261101`.
3. **The headset was never seen through Virtual Desktop, Steam Link or Air Link.** SteamVR adds it through the
   streamer's own driver with another serial, so the launch waited at the SteamVR step forever. That is fixed in
   rift-rabbit#14 (`VrDevices.HeadsetOn`), and that build is the one installed.

Checked live with the installed build, sent exactly as the page sends it: 1.0 Native over Virtual Desktop and 1.3 Space
Sync over Air Link each reached Put on the Quest Pro, with the right ignore list in VRChat's Steam launch options and
the right add-on on. Then I stopped them and set everything back to Native. Self-tests: Rift Rabbit 62 pass; Startup
Star PASS. Hub `npm test`: 348 pass, 2 fail, and the same two fail on unchanged `main`.

## Done when

1. After Astra's OK: rift-rabbit#14 merges, then this PR (#269).
2. The live Startup Star is rebuilt from `main` and restarted, and after the next sign-in Rift Rabbit's launcher is
   running.
3. Her first launch in the headset reaches VRChat (not checked yet: everything after the headset step needs her in it).

## Return

Record the merges, the star rebuild and her first in-headset launch below.

- 2026-11-01, Astra: "Merge both". findastra/rift-rabbit#14 merged (e16af93), then this PR.
- 2026-11-01 10:51: her PC hub copy fast-forwarded to 77bdeb4 and the live Startup Star rebuilt from it and restarted
  (the old exe kept as `bin\desktop-pets-before-20261101.exe`). `--self-test` PASS; `--check` shows the star and tray
  icon visible. Rift Rabbit's launcher kept running (one copy, same process), so the star's start at sign-in shows only
  at her next sign-in.
- Still open: the launcher running after her next sign-in (Done when 2), and her first launch in the headset reaching
  VRChat (Done when 3).

## Receipt and review

Done when 1, and the star rebuild in 2: Claude Opus 5.5, 2026-11-01. The rest waits on her next sign-in and on Astra in
the headset.
