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

## Patterns, one colour, rainbows and the APC64 (light-hive-server 1.19.0 and 1.20.0, later 2026-11-27)

Astra: "need more patterns, longer strings, make some times its only one color", "the colors need to slow down sometimes
in certain segments, colors are still not coherent, the bars on the keyboard get rid of those and jsut do those on the
APC", "I want to see some snaking and rainbow features, stark changes into gradual rolls, things can be slow and fast",
"like can the mouse pad just be the tempo", "need to see more on the squiggle than just one flashing color". The server
side is in findastra/rgbee#17 (3750735); this is the page catching up.

- **The wall line:** Changes with the song (the new default) picks a pattern by the music's pace: calm stretches roll,
  steady ones flash on the hits, loud ones and drops snake, comet and chase. The page names every pattern: segments,
  waves, waves from the middle, chase, fill, halves, stack, comet, snake, roll. In Pulse, the wall's stretches show
  whenever the strip is on segments, also while it changes with the song.
- **The keyboard:** no bars any more (spectrum and stack are gone); chase, fill, halves, comet, snake and roll are new.
- **A new card, Patterns and moments:**
  - choices for one-colour moments (now and then, always, never), colours slowing down when calm, rainbows (at drops,
    each new section, never) and the APC64's pads (bars, snake, off);
  - sliders for Run, Sparkle keys, Room colours (0 to 5), Calm hold, One colour every, One colour for and Rainbow for.
- **Feel:** Strobes, Strobe speed and Accent pickiness get words, so More from the server is empty again. White flash
  starts at 60 ms, the server's own.
- **Beat lengths in bars** (Astra: "these beat lendths need to make more sense like with 4 8 12 etc not random"): Colour
  every, Calm hold, One colour for and Rainbow for move 4 beats at a time and say their bars ("16 beats · 4 bars"). A
  value set before (27) shows as it is until it is moved. The server's own timing (patterns changing every 32 hits, not
  on bars) is light-hive-server's to change; her words went to the session that writes it.
- **Presets:** Patterns with the song comes second (patterns, keyboard, one colour, slowing and rainbows all on auto or
  at drops, three room colours).
- **The live view:** a "Now" line (the pace, the strip's and the keyboard's patterns, a one-colour or rainbow moment, the
  room's colours as swatches), and a line saying how the Squiggle and the APC64 are. The wall's preview snaps each
  stretch to the nearest room colour by hue, as the server does, and the metronome dot takes the tempo family's first
  colour, like the mouse pad.
- **Lights:** the Squiggle's row says it takes 15 sections over Bluetooth (the whole light on the home network until
  Bluetooth connects), and the mouse pad's that on Tempo it is only the metronome.
- **Following the metronome** (Astra: "i should be able to set something to follow the metronome"): the part Tempo is
  now called Tempo (the metronome), and a line under the table says any light set to it ticks with the metronome, as
  evenly as the mouse pad from light-hive-server 1.21.0 on; the keyboard only when its picture is Solid, and the Light
  Strip follows its segments instead.
- **System Map:** spotify-sync's job lists the new settings; the Squiggle says how the show reaches its 15 sections;
  RGBee now links to the Akai APC64 (manages, now): the show lights its pads through its DAW port and hands it back to
  Ableton whenever the show stops.
- **More details:** how the patterns follow the pace, the APC64's DAW port (protocol from
  github.com/esazhin/apc64-control, not Akai's), and Astra's new rules.

## What's in use, Reset, Random, and Synesthesia that shows (later 2026-11-27)

Astra: "i can tell this isnt working bevcause when i try to set every light to tempo they are still doing different
things, so needs to be clear on here which things can be selected with other things, like there should be some
highlight areound the pill if its active", "i wanna see the synethesia colors work, also need a reset to default button
at the top, and a random configuration selection next to that".

- **In use now:** every setting the show uses right now has a cyan ring; the ones it doesn't are dimmed with the reason
  ("Not used now: …"). The rules follow light-hive-server 1.20's code:
  - only Pulse uses the table, the wall line, colours from, the keyboard's picture, the moments, Flash, Base and Hold;
    in Every beat, Scatter and Ping-pong every light takes the palette colours on the beat, so setting every light to
    Tempo changes nothing there (she was on Every beat);
  - in Pulse the Light Strip never follows its row in the table: it follows the wall line's segments, and not even
    those while it snakes or rolls; the keyboard's part isn't used in Snake and Roll; the Squiggle's only in steady
    stretches (it rolls when calm and snakes when loud);
  - Brightness isn't used in Pulse (Flash and Base are); Dim blocks only in Bands, meter, bounce or wavelength line;
  - the note key says when room colours, one-colour moments or rainbows can cover the note colours.
- **Pressed presets** glow with a cyan ring.
- **Reset to default** and **Random mix** sit next to Start the show. Reset puts every setting back to the server's own
  starting settings but keeps her Brightness, Flash and Base. Random mix picks patterns, colour ways, moments, room
  colours, segments and which light follows what (beat lengths in whole bars, the mouse pad on Tempo), keeps her
  Brightness, Flash, Base, Hold and Beats, starts the show and says what it picked. The old "Back to the starting
  settings" button at the bottom is gone.
- **Synesthesia** now turns off what covers the note colours (room colours 0, slowing, one-colour moments and rainbows
  off) and puts the five parts side by side on the wall line, so each light shows its note's colour.
- **The note colours themselves** are light-hive-server's: Itoh et al. 2017 (Results, Fig. 3) has hue = pitch class
  with the white keys evenly round the circle (C 0°, D 51°, E 103°, F 154°, G 206°, A 257°, B 309°, "re with yellow",
  "sol with cyan"), saturation falling from do to si, and sharps coloured by their name ("do-sharp had a reddish color
  whereas re-flat was yellowish"). The hues up to 1.20 (D orange, E yellow) were squashed toward red and yellow.
  light-hive-server 1.21.0 uses the paper's hues (sharps a third of the way on, saturation down to 70% at B) and sends
  them as `options.note_colors`; the page's key and note chips use those whenever the server sends them, and its own
  older table before that.

## Devices and colours as tool boxes (later 2026-11-27)

Astra: "colors need to have the 4 distinct sections as tools like the other sections", "call it Device, not Light for
the first section, also make those devices look like tools like the other sections".

- **Which device follows which part of the song** (was "light"): the table is now a box for each device (Light Strip,
  Mirror, Squiggle, Keyboard, Razer mic and headset, Mouse pad, APC64), each with what it follows, its brightness and
  its Ping-pong side; the APC64's box holds its look. A device's box has the ring while the show uses what it follows.
- **Colours:** four boxes, two by two: Synesthesia (the note key), Colour groups (the song colour converter and each
  part's family), Palette (each part together, or one room colour) and Part colours. Each has a Use button that makes
  colours come from it (and puts the show in Pulse); the box in use has the ring.
- **More compact** (Astra: "reduce some of the blank spaces on this page so things are more compact"): smaller gaps
  and padding on the cards, boxes, controls and live view; in the device boxes each label sits beside its list.
  The Colours card is about half as tall: Colour groups in its own column with the other three stacked beside it,
  smaller swatches with the remove mark on the corner, a shorter note key, shorter words; hints are smaller page-wide.
- **The live view asks eight times a second** (was four). Astra: "i feel like this thing needs to respond faster". The
  lights' own delay (hearing, beat finding, each light's path) is light-hive-server's; her words went to its session.
- **Easier to understand** (Astra: "this thing is still really hard to understand"):
  - right under the live view, **What your lights are doing now**: one plain line per device (the wall line's stretches
    and what each lights on, what each device flashes on, the mouse pad's metronome, the APC64's look), then the colours
    and the brightness; it says so when the show is off or out of Pulse;
  - then the presets, the devices and the colours; How the lights move, Patterns and moments and Feel fold away under
    **More settings** (it stays open or shut in this browser).
- **Black spots**, a new first preset (Astra, 22:08: "i need more black spots and less overall light"): Base 0 and
  Between hits 0 (black between hits), Flash 40% (25% was "NOW NOT BRIGHT ENOUGH HAHA"), Hold 100 ms, 10 sparkle keys, no rainbows, white strobes on drops only
  (2). Applied to her show at her ask; her settings before (Flash 51, Base 8, Between hits 66, Hold 200, 32 sparkle keys,
  rainbows at drops, white on drops and kicks) are kept on the PC to put back.
- **How fast it answers:** with light-hive-server 1.21.1 (a show step every 20 ms) the Now line says how long a heard hit
  takes to be drawn (`live.now.heard_to_drawn_ms`), e.g. "drawn 23 ms after it's heard".
- **Stop** stays `{"on": false}`. Astra: "when i stop the show the lights are still moving....". 1.21.1 rests every light on
  one steady colour and darkens the APC64 before letting it go (it isn't installed yet).

## light-hive-server 1.21.0 (later 2026-11-27)

1.21.0 is pushed to findastra/rgbee#17 (194c7df) and installed. The page shows each of its settings only once the
running server has it, so an older server sees no change:

- **How bright each light flashes** (Astra: "keyboard needs to be brigher, need a vague brightness section for each
  device"): under the table, a rough step for each light and the APC64: Like Flash, Very dim, Dim, Medium, Bright,
  Full (`light_brightness`; a value set another way shows as its own %).
- **The APC64's looks** (Astra: "give more APC options, include teh ones on the ableton live preview, those were so
  good"): Changes with the song, Bars, Drum rack, Step sequencer, Session clips, Snake, Off; the live line names the look
  showing. 1.21.0 also leaves the APC64 out of the white strobe ("the APC keeps doing all white ... dont let it do that").
- **On the bar:** Pattern for (1 to 16 bars) in Patterns and moments, and Strobe at most (once every 1 to 16 bars) in
  Feel. The server rounds the beat lengths to whole bars too.
- **The note colours** from `options.note_colors` (above).
- **Between hits** (`bed`, 0 to 100%): how bright the moving looks (rolls, snakes, rainbows, the APC64's looks, the
  Squiggle's roll and snake) sit between hits, as a share of that light's flash; each hit flashes them full.
- **Reset to default** keeps every brightness as she set it (Brightness, Flash, Base, each light's, Between hits).
  Astra, after 1.21.0: "make dimmer, put back on old settings you had".
- **Presets that leave Pulse** (Colour blocks, Wavelength line, D&B blocks, Ping-pong room, Bands room, Meter rise) sit
  in their own fold, "Older shows, not Pulse", which says they light every light at Brightness instead of Flash
  (brighter) and skip the table, patterns, moments and each light's brightness. Between 19:44 and 20:55 her show had
  been on Every beat (at Brightness 60%), so none of 1.20 or 1.21 ran; the server's session put it back on Pulse.
  Slow and dim now also sets Flash 6%, so it dims in Pulse too.
- Checked against the installed 1.21.0 (reading only): More from the server is empty, each light reads Like Flash,
  Between hits 10%, the APC64 on Changes with the song with all seven looks named, the note key from the server's own
  colours (D yellow, #ffda0c), no console errors.

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
- **Newer settings:** the server's newer `strobe_count`, `strobe_div` and `accent` appeared under More from the server
  until the page had words for them (see Patterns, one colour, rainbows and the APC64 above).

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
