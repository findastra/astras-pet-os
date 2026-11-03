# learn-apc64-tool on Bass & Biscuits · 2026-11-02

Astra, 2026-11-02: "Can you design a lesson plan to teach me how to use these drums, and put the instructions on Bass &
Biscuits? Tool can be called learn-apc64-tool". The drums are her Akai APC64, played in Ableton Live.

- `system-map.json`: new native tool `learn-apc64-tool` of Drum Dog (Bass & Biscuits), label
  `bass-biscuits-v1.0-learn-apc64-tool-v1.0`, opening `learn-apc64-tool-20261102.html` in findastra/drum-dog. It is a
  tool because the page is code with no AI deciding (TOOLS-AND-TRICKS.md), like Unity Stable's `learn-add-ons`.
- Rebuilt with `npm run build`: Bass & Biscuits' page gets its first L1 tool box, and the registry table in
  TOOLS-AND-TRICKS.md gets the row.
- The lesson page itself is in findastra/drum-dog#9; merge that first so the link works.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-02.

## Second tool, same day: apc64-deck-guide

Astra, 2026-11-02: "an exact copy of the surface of it as a tool on the drum dog so that we can, like, label stuff on
there for me to look at so it's easier for me to find... deck guide, APC64-deck-something". `system-map.json` gets a
second native tool of Drum Dog, `apc64-deck-guide` (label `bass-biscuits-v1.0-apc64-deck-guide-v1.0`). It opens
`apc64-deck-guide-20261102.html` in findastra/drum-dog#9: the APC64's top surface drawn to scale. You can click any
control to see what it does and add your own label. Claude Opus 5.5 (`claude-opus-5-5`).

## The deck on the page, with sound; programs and colours (same day)

Astra: "build that right on the base and biscuit... get rid of anything extraneous... I don't want to see a lot of
words... let's try to get me making sound at least"; "make sure to get all these 3rd party softwares in the Bass &
Biscuits. Need a different color theme for bass & biscuits too."

- `apps/drum-dog-apc64-deck-20261102.html`: the APC64 deck at its measured geometry, with few words.
  - Tapping a pad plays a drum, made in the browser with Web Audio. Every 4×4 corner of the grid plays the kit.
  - Tapping a control gives one short line about it, and you can add your own label.
  - "Use my APC64" hears the real pads through Web MIDI, with no Ableton needed.
- The page builder can embed a wide tool (`frame: "wide"`, `.tool-frame.wide`), and every embed may ask for MIDI
  (`allow="midi; autoplay"`). `apc64-deck-guide` is embedded on Bass & Biscuits' page.
- The map lists Bass & Biscuits' programs and device:
  - Ableton Live, now installed (Live 12 Trial).
  - New: the Ableton USB Audio Driver and the Akai APC64 (device).
  - Links to Voicemeeter (where its sound goes) and to the web browser.
- Bass & Biscuits' own colours: a midnight studio (deep indigo, electric-blue lines, neon cyan links). Every other page
  keeps its own.

## apc64-drum-kit-tool, the deck in L1, Deck Duck's buttons (same day)

Astra: "i want a kit tool that keeps track of all my drum kits... apc64-drum-kit-tool would be ok i think as the name
for it under L1"; "remember this is a tool... its not above it"; "coordinate with the deck duck. its program is being
made now."

- `apps/drum-dog-apc64-drum-kits-20261102.html` is apc64-drum-kit-tool, a native tool in L1 with its own page.
  - It holds seven ready-made kits (Starter, 808, House, Lo-fi, Trap, Rock, Space) and her own copies.
  - In her own kits she can change any pad's sound or tune, or drop her own sound file on a pad (kept in IndexedDB).
  - "Play this kit" sets what the deck plays, and "Surprise me" picks a kit at random.
- `apps/drum-dog-drum-sounds-20261102.js` holds the sounds and kits that the deck and the kit tool share.
- The deck plays the picked kit, has its own "Surprise me" button, and reads `?kit=surprise` for Deck Duck's Stream
  Deck button.
- The page builder takes `in_l1: true`, which puts an embedded tool inside the L1 control panel instead of above the
  levels. The APC64 deck uses it.
- Card `handoffs/271-any-deck-duck-drum-buttons-20261102.md` asks whoever builds Deck Pond for two Stream Deck
  buttons, Drums and Surprise kit. Nothing was written in findastra/deck-duck.
- Checked in headless Edge: copied the 808 kit, changed a pad to Laser, set it playing; the deck showed "My 808" with
  Laser on its bottom-left pad, and Surprise me switched kits.

## The deck matches the page (same day, after the merge)

Astra: "Bass & Biscuits is supposed to be like a dark blue color... it seems like there might be two revisions
happening at once."

There was only one revision on GitHub. The other "Drum Dog" chat only helped with the hardware and opened Ableton; it
changed no files. Two things made the page look different:
- A browser that already had the old shared style file kept the raspberry colours for up to 10 minutes
  (`max-age=600`).
- The deck inside the page used graphite gray around the APC64 instead of the page's dark blue.

The deck's background and buttons now use Bass & Biscuits' midnight indigo. The APC64 drawing itself stays black like
the real unit.

## use-my-apc64-tool: the board inside its own tool box (same day)

Astra: "that board needs to be within a tool. And that tool needs to be use my AP64 tool. And the tool should look like
any other tool we see on here. So use that like curved border, and then put it in there"; "that shouldn't be its own
panel. The AP64 deck guide. I don't think we need that panel at all."

- apc64-deck-guide is renamed use-my-apc64-tool (`bass-biscuits-v1.0-use-my-apc64-tool-v1.0`).
- The page builder takes `in_pill: true`: such a tool gets no panel. Its tool box in L1 takes the whole row, starts
  open, and holds the tool itself, with an "Open it full screen" button.
- Inside the tool box the deck has no background of its own, so the box shows through.
- Its description is one short line.
- The deck page keeps its address (`apps/drum-dog-apc64-deck-20261102.html`), so Deck Duck's buttons (card 271) still
  work. The card now links the tool box at `#use-my-apc64-tool`.

## The working copy is marked (same day)

Astra: "Stop giving me the live pages. I want to look at the page that we're working on actively"; "the editorial
status panel on the one we're working on, but we don't have it on the live one... make that a requirement. Put that in
the Friendly Farmer repo... let's start doing it like that going forward."

- Every pet program page starts its editorial status panel with "Working copy: not the live site." A check in
  `<head>` (`LIVE_CHECK`) marks the live site (any `<owner>.github.io` address), and the stylesheet hides the panel
  there. If the panel is there, it is the working copy; if it is missing, it is live.
- Written into AGENTS.md ("Show the working copy, one page at a time"), PET-PROGRAM-FRAMEWORK.md (section 3, item 0,
  and the checklist), and `skills/show-pet-panel/SKILL.md`. This is now the skill's maintained copy in the hub; the
  Claude and Codex installs match it. A test guards it.
- The same rule is in Astra's global rules for Claude (`CLAUDE.md`) and Codex (`AGENTS.md`) on this PC.
