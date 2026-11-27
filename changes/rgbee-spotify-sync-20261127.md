# Light Hive: spotify-sync, its new tool (2026-11-27)

Astra, 2026-11-27, asked for an RGB Hive tool called spotify-sync that measures the music from Voicemeeter. It is built
in findastra/rgbee (light-hive-server 1.3.0, findastra/rgbee#17, not merged yet); rgbee is private, so its `pet.json`
tool list does not reach the hub on its own and this copies the new tool by hand.

- **System Map** (`system-map.json`): RGBee's tool `spotify-sync-tool`, shown as spotify-sync
  (`light-hive-v1.0-spotify-sync-tool-v1.0`). The storm and other Light Hive themes react to whatever Voicemeeter plays
  (its A-bus meters), so Spotify on the PC drives the lightning. It has no page of its own: it runs inside the server.
- **Link** `spotify-sync-tool` → `voicemeeter` (status): it reads Voicemeeter's A1 to A5 output levels through the
  Remote API, the same kind of link as Audio Rescue's listen-for-robotic-sound; it records no sound. So Voicemeeter is
  now one of Light Hive's third-party programs, and RGBee's `needs` in `pets.json` name it (optional: without it the
  server reads Windows' default-speaker meter).
- **Its check light** (`pets.json`, RGBee's `checks`): blue, works. Checked live on her PC on 2026-11-27: Spotify on the
  PC gave 12 bolts in about 90 seconds, and the server still reported it listening to Voicemeeter later that day.
- Rebuilt: Light Hive's pet program page, TOOLS-AND-TRICKS.md, the markdown pets and the System Map page.

Goes with hub #403 (Light Hive's themes, rgbee-color-corrector, light-hive-helper → light-hive-server), which is still
open: both add a tool to RGBee, so whichever merges second takes main's generated files, rebuilds and tests.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-27.
