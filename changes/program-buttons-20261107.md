# The 3rd party program buttons (2026-11-07)

Astra, 2026-11-07: "I think some of the buttons to turn the 3rd party apps on/off aren't working. I should be able to
press the red button, then it launches that program and the button turns green if its on and detected. Fix all of the
buttons in 3rd party programs." Then, of Rift Rabbit's page: "use this as a model Pet Program". Then: "all
recommended":

1. Pressing a green light asks first ("Close <name>?"), then closes the program the way its X button does, never
   forced; if it asks to save, she answers it.
2. Programs that are not windows (command-line tools, drivers) show whether they are installed (green) or not found
   (red); pressing says what it is and how it is used. Websites open in a new tab. Placeholders, and programs not
   installed yet, keep their "not built yet".

## What changed

- **Every pet program page** (`apps/pet-programs/pet-program-page-20261018.js`). A 3rd party program that Inference
  Iguana's program-watch opens and closes (`data-watch="window"` on its light): a red press asks program-watch to open
  it ("Opening <name>…"), and the page then reads program-watch's list every second for 30 seconds, so the light turns
  green as soon as it is seen; a green press asks "Close <name>? It closes like its X button; if it asks to save,
  answer it there." and only on yes asks it to close. The bubble shows what program-watch answered. A tool or a driver
  (`data-watch="tool"` or `"driver"`) is green while it is installed and says what it is. A website (`data-site`, only
  GitHub so far) opens in a new tab. Anything else only shows, as before.
- **Where the page asks.** Program-watch writes its listener's address and a random code into the same file the pages
  already read, `Documents\Astra's PetOS Data\benchmark-rock\programs-page-data.js`, only while its background watch
  runs (`link`, schema `benchmark-rock-programs-v1`, fields only added: each program's `kind` and `installed`). The page
  takes the address only if it is `http://127.0.0.1:<port>/` and the code only if it is hex, and sends
  `POST open` or `POST close` as text/plain JSON with the code and the program's System Map id, nothing else, and only on
  a page opened on this PC. With no link, nothing is sent and the bubble says to start the watch from Startup Star's
  menu (Inference Iguana, Keep watch in the background). The listener (findastra/benchmark-rock, on a branch) answers
  on 127.0.0.1 only, refuses any other Origin or Host, and opens or closes only a window in its own table.
- **A bug the lights had since the chat window came (2026-11-03):** the chat's `say()` had the same name as the
  lights' `say()` in one scope, so every light's bubble went into the chat log instead of showing under the light. The
  lights' one is now `sayLight()`.
- **The System Map** (`system-map.json`): program-watch links to the 44 more programs it now knows, 69 in all (33 more
  windows, 9 tools: BetterDiscord, CLI Proxy API, Coreinfo, ES, Handle, Node.js, Sigcheck, winget and Windows
  Performance Recorder, which the map says is the command-line `wpr.exe`; 2 drivers: Ableton USB Audio Driver and Steam
  Streaming audio). A node's `watch` says tool or driver (window when it has none); GitHub's `site` is its address.
  MacAttack (Kali on another computer), the web browser, the placeholders and the programs not installed yet
  (LatencyMon, Object Track VR, Stream Deck) are not program-watch's, so their lights keep "not built yet"; the page
  builder never marks a program whose map node is not installed (`now`) as watched. The new grant
  `inference-iguana-open-close`: opening and closing the windows in program-watch's table on her press (X). It is
  **written only** (Rule only), like grant 17: only Benchmark Rock's own code holds it, and that code is not merged. Its
  random code is what keeps web pages out; the Origin check alone does not, because a `null` Origin can come from any
  website. Benchmark Rock's `needs` list exactly the 69 programs in its table (pets.json).
- **Pages served from `http://[::1]`** read program-watch's list but never send a press: its listener lets in only a
  file page, 127.0.0.1 and localhost, so the page no longer sends a request it would refuse.
- Tests: `test/program-buttons-test-20261107.mjs` runs the page script against a pretend page; the tests that said the
  page script fetches nothing now say it has one request, to that listener. It also checks that only built programs
  carry `data-watch`, that exactly the System Map's program-watch programs do, and that a program not installed yet sends
  nothing.

## Not verified

Nothing here ran on Windows. The page side is tested in Node against a pretend page; the listener is on a benchmark-rock
branch, not merged and not run. Tray programs (iCUE, G HUB, Synapse, PowerToys and the like) may only hide to the tray
when asked to close the way their X does; that is program-watch's to find out on her PC.

Claude Opus 5.5, 2026-11-07. Review fixes (planned programs, the grant's status, `[::1]`): Claude Opus 5.5, 2026-11-07.
