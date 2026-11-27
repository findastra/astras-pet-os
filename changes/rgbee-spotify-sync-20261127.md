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
- **Its own page** (`apps/rgbee-spotify-sync-20261127.html`), added later that day. Astra: "need more beat cueing and
  different colors to represent different parts of the wave form ... it would be cool if the line was the wave length.
  get a bunch of setting options ready lets experiment". It is the spotify-sync show's settings page, through
  light-hive-server's `GET` and `POST /sync` (1.5.0 and later):
  - a start/stop switch;
  - a live view, asked about four times a second while it is on screen: five parts of the sound, the 15-section line
    from the lowest to the highest notes, and a beat dot that changes colour on each beat, at most once per gap;
  - presets (Colour blocks, D&B blocks, Wavelength line, Ping-pong room, Bands room, Meter rise, Slow and dim);
  - every setting: mode, strip, what a beat is, colour order, the palette (2 to 8), a colour for each part of the sound,
    brightness, beats, shortest gap, dim blocks, steps, contrast, and each light's part and side.

  The page finds the server through `light-hive-helper-data.js` like the other Light Hive tools, so only the PC's copy
  reaches the lights. Its mode and strip lists come from the server, so a new one shows up by itself. Nothing on it
  flashes more than three times a second, nothing moves under reduced motion, and light and device text goes in with
  `textContent`. The System Map node now links and embeds the page, like rainforest-storm-tool's.
- **Its check light** (`pets.json`, RGBee's `checks`): blue, works. Checked live on her PC on 2026-11-27: Spotify on the
  PC gave 12 bolts in about 90 seconds, and the server still reported it listening to Voicemeeter later that day.
- Rebuilt: Light Hive's pet program page, TOOLS-AND-TRICKS.md, the markdown pets and the System Map page.

## Every Light Hive tool as the server is today (later 2026-11-27)

Astra: "need more rapid flashing and color blocking but looking good, do this and make sure the tools are represented
accurately and usable on the hive".

- **Hub #403 merged into this branch**, unchanged: theme buttons, rgbee-color-corrector, light-hive-helper →
  light-hive-server. Its generated files were rebuilt.
- **spotify-sync's page:** its modes, strips, parts and lights all come from the server's `options`. A "Colour blocks"
  preset (scatter + blocks, light-hive-server 1.6.0) is added, and the starting settings follow 1.6.0's.
- **sync-my-lights:**
  - a button for every theme the server plays: spotify-sync, storm, night-storm, purple-storm, dnb,
    rainforest-storm, rainforest, party, chill, fire;
  - Corsair K65 reached through iCUE's SDK;
  - each Govee light by how it is reached (home network, Bluetooth or Govee's cloud);
  - MSI not reached (OpenRGB finds the chip, the board ignores it);
  - its More details name light-hive-server.
- **rainforest-storm:** its lights check counts Corsair and every Govee light however it is reached, and its More
  details name light-hive-server.
- **System Map and `pets.json`:** light-hive-server's job; Mirror, Squiggle, Light Strip and the K65 with their models
  and how Light Hive reaches them; RGBee's links to them, to the Razer lights, iCUE and Synapse are "now". MSI stays
  planned, with why. RGBee's needs say the same.

Goes with hub #403 (Light Hive's themes, rgbee-color-corrector, light-hive-helper → light-hive-server), which is still
open: both add a tool to RGBee, so whichever merges second takes main's generated files, rebuilds and tests.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-27.
