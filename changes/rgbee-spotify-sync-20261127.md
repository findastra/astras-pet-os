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
  strobes (its preview updates about four times a second), nothing moves under reduced motion, and light and device text goes in with
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

## Six a second, and Pulse (later 2026-11-27)

- **Light safety:** Astra lifted RGBee's limit from three to six flashes a second: "Lift it to 6 a second".
  light-hive-server 1.7.0 enforces it, and rgbee's AGENTS.md says "no effect flashes more than six times a second".
  The Light Hive pages and the System Map now say six a second, and the shortest gap is 170 ms. Pages still stop all
  animation under reduced motion.
- **spotify-sync's page, for light-hive-server 1.8.0.** Astra: "want it to be dim lighting, but flashing colors are
  bright to emphasize beats", "need more unified color sequencing ... larger sections", "a setting to start that is
  just unlit/maximally lit white, just to get the patterns down".
  - Pulse, the new default: every light sits at Base and flashes on its own part's hits, then drops back after Hold.
  - New controls: Flash, Base, Hold, Colour every N beats, colours by room or by part.
  - What a beat is can be either, the bass or all of the sound, and palettes can have one colour.
  - Each part's bar lights up on its hits (`live.hits`).
  - Presets start with White patterns, Bass wall and Dim + bright beats.

## Song components (light-hive-server 1.10.0, later 2026-11-27)

Astra: "break the components down for each song", "I want the mouse pad to be the tempo almost, go back to color
segments", "i want to see color scaling and waves now too", "go back to colors, too bright white! only use a white flash
like that".

- **The parts are named as song components:** Kick and bass, Bass line, Vocals and melody, Snares and claps, Hi-hats and
  cymbals, Every beat, Tempo.
- **"Which light follows which part of the song" is the main control,** a table right under the live view. It has a row
  for each light: Light Strip (the wall line), Mirror, Squiggle, Keyboard, Razer mic and headset, and Mouse pad (Razer
  Goliathus Chroma, on the tempo). The wall line's segments, left to right, sit under it.
- **New controls:**
  - the wall line (waves, waves from the middle, segments), colour scaling, colours by song component, room or part,
    when colours move on, and white flashes (drops, accents, both, never);
  - heat, wave speed, wave tail, and the white flash's length.
- **Live view:** the dot shows the song's BPM, with its sections, drops and accents under it.
- **Presets:** Black + hit segments comes first. Astra: "it needs to be mostly black and any "hit" activates a line
  segment", then "too bright". It is Pulse with the wall line in five segments (one per component), base 0, flash 35,
  hold 200 ms, no heat, white accents on. Song components (default) comes next; it leaves brightness, flash, base and
  hold as they are.
- **The wall line on the page:** in Pulse with segments, the stage shows the strip's stretches labelled with their
  components. Each is black until its component hits, then lit in its colour at Flash for Hold.

## Song structure (light-hive-server 1.14.0, later 2026-11-27)

Astra: "the mouse pad needs to be like the metronome like its beating evenly", then "get rid of the fading thing
again, bring back blocks. i like the speed but its lacking structure. can you divide up by device for what makes sense,
also dont be afraid to use color gradient ripple etc on the keyboard. also colors are the same, can we do color
groupings".

- **First preset, Song structure:** each device has a job. The wall line takes only the hard hits (snares and claps,
  kick, snares and claps). Squiggle and the mic and headset take the vocals, the keyboard the hats in ripples, the mouse
  pad the tempo, and the Mirror the song's sections. This follows 1.14.1. Astra: "i can tell you have the vocals on the
  light strip, make that the squiggle and put the all the hard hitting music on the light strip". Each part has its own colour family, and the scaling is blocks. Black + hit segments
  comes second.
- **New on the page:**
  - the part Song sections;
  - Colour groups, with a row of 1 to 6 colour swatches for each part's family;
  - the keyboard's picture (ripple, spectrum, gradient, solid);
  - a metronome dot that ticks evenly at the mouse pad's tempo, timed on the page from the server's gap, with its BPM.

## Synesthesia (light-hive-server 1.17.0, later 2026-11-27)

Astra: "still feels too random ... can you do a setting where it matches to synthestesia", "still too bright".

- **Colours come from Synesthesia:** each part takes the colour of the notes it hears. The low end takes the bass note,
  the vocals the strongest melody note, the snares the next note and the hats the third. Colours run in rainbow order
  through the scale (C red, D orange, E yellow, F green, G cyan, A blue, B violet, with the sharps between) and get
  paler as the melody sits higher. This follows Itoh et al. 2017 and Ward, Huckstep and Tsakanikos 2006, the studies
  Paper Girl's chromesthesia quiz cites.
- **On the page:**
  - a 12-note colour key, worked out the same way the server does;
  - the notes it hears (bass, melody, chord), as coloured chips;
  - Flash from 5;
  - a Synesthesia preset (flash 12), first.

## Song colours and the keyboard (light-hive-server 1.15.0, later 2026-11-27)

Astra: "keyboard looks fire, dont be afraid to switch up the patterns and colors on it between chrous", "we need some
kind of color converter for songs, like something so that the colors dont seem the same per song".

- **The keyboard's picture** adds Changes with the song (auto, the new default: a new pattern and colour family at every
  song section), Sparkle and Sweep.
- **The song colour converter** is a switch. Each song gets its own colour families from a base colour and a harmony.
  While it's on, the colour-group rows are greyed and show the song's colours. The page works them out the same way the
  server does: each part's place on the colour wheel for that harmony, plus a second colour 18 degrees on. Turning it
  off makes the rows yours to edit again.
- **Now playing:** the song's title, from Spotify's window through the server, and its harmony. It is only shown on the
  page and never kept.
- **Song structure** adds the keyboard on auto and the converter on.
- **Newer settings:** the server's newer `strobe_count`, `strobe_div` and `accent` appear under More from the server
  until the page has words for them.

## The flash limit is off (light-hive-server 1.11.0, later 2026-11-27)

Astra: "i think we need it to be faster, like ignore epilepsy". The six-a-second limit above is gone for her own room;
rgbee's AGENTS.md records her choice. The only floor left is the show's own 40 ms step per light.

- **spotify-sync's page:**
  - Shortest gap 40 to 2000 ms (starting at 60), Hold 40 to 1000 ms, White flash 40 to 600 ms.
  - Beats 1 to 12, starting at 11. Astra: "Catch more hits" (light-hive-server 1.12.0).
  - Black + hit segments now uses sensitivity 11, gap 60 ms, hold 100 ms and flash 35.
- **Wording:** the Light Hive pages and the System Map drop the "three / six a second" wording. More details say
  plainly that fast strobing is on by her choice.
- **The page's own preview** still doesn't strobe. It changes when it asks the server (about four times a second), a
  lit bar or stretch stays on at least 170 ms, and nothing moves under reduced motion.
- **More from the server:** settings the page has no words for yet show there as a list or a number box, so a newer
  server is usable before the page catches up.

Goes with hub #403 (Light Hive's themes, rgbee-color-corrector, light-hive-helper → light-hive-server), which is still
open: both add a tool to RGBee, so whichever merges second takes main's generated files, rebuilds and tests.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-27.
