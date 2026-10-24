# Only Startup Star in Windows' Startup apps list (2026-10-23)

Astra, 2026-10-23, marking up Windows Settings > Apps > Startup: `desktop-pets-20261008` "should be 'Startup Star' with
native star logo", and `evidence-locker-20261018`, `log-den-20261018`, `packet-river-20261018` and `pythonw` "should not
be here at all".

- **The name and the logo.** Windows names a sign-in program by its file description, so the star's program now says
  `Startup Star` (company `Astra`, product `Astra's PetOS`) and carries the star it draws in the tray as its own icon,
  `art/app-icons/startup-star/startup-star-icon-20261023.ico` (written by `--write-star-icon`, built in by
  `build-desktop-pets-20261011.ps1`). The file name, `bin/desktop-pets-20261008.exe`, and its `Run` entry stay, so
  nothing that starts or quits it changes. The tray tip says "Startup Star" too.
- **The crash watchers.** Log Lynx, Packet Piranha and Forensic Ferret are now started by the star when it starts
  (`BackgroundPets.AtSignIn`, with `--startup`, only when installed and not already running, no pop-up), so their three
  Startup-folder shortcuts (card 045) can go. Kernel Koala's watch still starts only when Astra asks; the Bug as before.
  The self-test checks the three and only the three.
- **pythonw** is Discord Damsel's BetterDiscord watcher (a Codex script with a `DiscordDamsel` `Run` entry); its loop
  runs only while that entry exists. Removing the entry is Astra's step from her own PowerShell, because a Claude
  session's registry writes land in the app's private copy.
- AGENTS.md: a pet program never adds its own Startup-folder shortcut or `Run` entry.

By Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-23.
