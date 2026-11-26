# Workflow Whale's two watches on the farm, and his server at sign-in · 2026-11-20

Astra, 2026-11-20, "Do this task here" for "Hub records + sign-in start for Workflow Whale's watches". Workflow
Whale got two native tools in workflow-whirlpool: **screen-watch** (#5, 2026-11-12: who is watching or controlling the
screen, the yellow capture border) and **deskflow-watch** (#6, 2026-11-20: which computers Deskflow links to the PC's
mouse and keyboard, and what to fix when the cursor fights at an edge). Both were merged that night with her OK and
started by hand, from a Claude chat, so they stopped when the chat restarted.

- **pets.json:** Workflow Whale is at 0.3.0, his own version now (workflow-whirlpool `pet.json`, #7), so it is no
  longer the starting 0.1.0 the hub assigned (`version_assigned` removed). His tools list has `screen-watch` and `deskflow-watch` (before
  `ipad-workflow-caster`), and `"server": "workflow-whirlpool-server-20261120.mjs"`: one server per pet, named after
  his pet program (A72), from workflow-whirlpool #7.
- **System Map:** two tool nodes of `workflow-whirlpool` (state now), and ipad-workflow-caster's label follows the
  program to `workflow-whirlpool-v0.3.0-...`. The build carries them to the pages and TOOLS-AND-TRICKS.md.
- **Startup Star:** starts Workflow Whirlpool's server at sign-in with node from `Astra's PetOS\workflow-whirlpool`,
  finds it by that file name (read from pets.json, never written in the star), takes it over after a hub update like
  the other helpers, and shows his menu (`%LOCALAPPDATA%\astras-pet-os\workflow-whirlpool\menu-20261021.json`, written
  by the server: what runs, and Quit). Without the `server` line he is not started. Self-test: twelve helpers found by
  their command line.
- **New pet or tool:** a decision row for both tools and the server (`skills/new-pet-or-tool/SKILL.md`).
- **Tests:** `test/pet-servers-test-20261120.mjs` checks his `server` line, his tools and the star's entry.

After merge, on the PC: pull workflow-whirlpool (#7 merged first), rebuild the star (`build-desktop-pets-20261011.ps1`;
bin is gitignored) and restart it. The server then stops the two hand-started watches by itself (it stops only a watch
whose command line is that watch's own) and runs both.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-20.
