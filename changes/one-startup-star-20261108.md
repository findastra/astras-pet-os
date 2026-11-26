# Startup Star starts every PetOS helper; one PetOS entry in Windows' Startup list

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-08, for Astra.

Astra: "I don't know why there's a bunch of startup apps now ... can we simplify this at all", then "Yes, simplify it".

- `scripts/desktop-pets-20261011.cs`: at sign-in the star also starts the following, each only if its file is on this PC
  and it is not already running:
  - Inference Iguana's watch (the 3rd party lights need it, benchmark-rock#10)
  - Live Sync
  - the OpenAI, Anthropic and Ableton Live Discord presences
  - Desktop Commander Remote

  Helpers run by node, PowerShell or wscript are found by their command line (WMI), not their program's name. They
  start with no console window. Each shows in the star's menu with Start when it is not running.
- `build-desktop-pets-20261011.ps1`: references System.Management for that look.
- startup-star `claude/star-starts-live-sync-20261108`: its installer no longer writes the Live Sync startup file and
  removes the old one. Merge it after this.

After both are merged and the star is rebuilt, these Windows startup entries are removed:
- from the Startup folder: `Astras PetOS Live Sync.vbs`, `OpenAI Discord Presence.vbs`,
  `Anthropic Discord Presence.vbs` and `ableton-live-discord-presence-20261102.vbs`
- the "Desktop Commander Remote" scheduled task

The star keeps its own sign-in entry and its scheduled task. The task brings the star back within 10 minutes if it
closes; `--startup` stops a second copy.

Checks: the star's self-test passes, including the new sign-in list and each helper starting its own script. Hub tests:
383 pass. The one failure (installed farm from scratch) fails on main too.

Not done:
- The presence apps' own "start with Windows" switch would write their Startup file again if ticked.
- The three crash watchers were still three programs; `changes/one-crash-watch-20261108.md` makes them one.
