# Live program lights, and the pages' new look (2026-10-23)

Astra, 2026-10-23: "most of my vrchat programs are launched right now and I am not seeing the green lights lighting up
on the pet program. lets fix all of those right now on rift rabbit." Then: "Build Inference Iguana's program in
benchmark-rock and move program-watch there with the VR changes."

- A 3rd party program's ON/OFF light on every pet program page is green while Inference Iguana's program-watch
  (findastra/benchmark-rock#3) sees it open, and red when it doesn't. This holds even when the pet's own link to it is
  only planned. A page opened on this PC reads `Documents\Astra's PetOS Data\benchmark-rock\programs-page-data.js`
  every five seconds. A list older than a minute counts as nothing open.
- The System Map gives program-watch to Benchmark Rock (program-72) and links it to the 16 VR programs it watches too.
  Kernel Grove's needs no longer list those programs (findastra/kernel-grove#7 takes program-watch out).
- "panels cant have lights. only tools can": no panel label has lights. Each panel label has a small arrow that shows
  it folds, like Halo List's.
- The box inside the cyberhome is the tool `<pet>-cyberhome-render`, with its lights left of its name in its border.
  The pet stands as tall as on the desktop (`scripts/pet-size-20261023.mjs`, from Startup Star's sizes).
- The two squares are `<pet>-cyberhome-panel` and `<pet>-system-map-panel`, and they start level with the title.
- Pills follow Halo List's format: small raised lights inside on the left, then the name and tags, as wide as that.
  Clicking a pill opens it, showing what it does.
- Colors are dark raspberry pink with raspberry-purple pink lines.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-23.
