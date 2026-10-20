---
name: find-things
description: How to find a file, folder, program or install on Astra's PC when the first look comes up empty, the File Master way (Everything, its everything-search tool, then the disk and the places files hide). Use before telling Astra something is missing or not installed, before downloading or making something again, and whenever she says she already has a thing you could not find.
---

# Find things (Astra, 2026-10-19)

Astra: "when you cant find things, use the Index Mole or File Master to find them. or everything-search tool."

One empty folder is not an answer. Search the way File Master does, then tell Astra where you looked, with what,
and how fresh it was.

## Who finds things

| Who | What it is today |
|---|---|
| **File Master** (#12, `file-master`) | Owns finding and indexing files on the PC. Its shared tool `everything-search` (`pet-program-12-v1.0-everything-search-v1.0`) is **planned, not built**: until it is, do its job by hand with the steps below. Other pets get read grants through it, never their own copy (`skills/new-pet-or-tool`). |
| **Everything** (voidtools, third party) | Installed in `C:\Program Files (x86)\Everything`. Settings in `%APPDATA%\Everything`, index in `%LOCALAPPDATA%\Everything\Everything.db`. It runs as administrator with no service, so starting it brings up a Windows prompt for Astra. No `es.exe` command line yet (File Master's pet.json lists it as optional). When Everything is not running, its index is only as new as the date on `Everything.db`. |
| **Index Mole** | Astra's name (2026-10-12), not in `pet-programs.json` yet (`docs/naming-audit-20261016.md`, A06), so it has no program or tools to run. Say so, and do the search File Master's way. Never invent tools for it. |

## Steps

1. **Everything, when it is running** (a process named `Everything`). Search there first. Its own web search
   answers on this PC only; the setting is in `Everything.ini`, and that address never goes into a public repo
   (`docs/local-services-20261014.md`). When it is not running, ask before starting it, and note the index date.
2. **The disk itself.** `cmd /c 'dir /s /b /ad "%USERPROFILE%\*name*"'` lists folders (drop `/ad` for files);
   then the other drives. It is much faster than PowerShell's `Get-ChildItem -Recurse`. From Git Bash, run it
   through `cmd` or PowerShell: `/c/` paths with an apostrophe reach native programs unconverted.
3. **The places things hide on this PC:**
   - Assistants' private copies. AppData written by Claude or Codex lands in
     `%LOCALAPPDATA%\Packages\Claude_*\LocalCache\` or `OpenAI.Codex_*\LocalCache\`, not in the real AppData.
   - Codex task folders: `%USERPROFILE%\Documents\Codex\<date>\<task>\outputs` (downloads, installers, tools).
   - Claude scratchpads: `%LOCALAPPDATA%\Temp\claude\<project>\<session>\scratchpad`.
   - A stray `C:\c\` folder, made by Git Bash paths that were never converted.
   - Pet folders in `%USERPROFILE%\Documents\Astra's PetOS\<repo>`, other branches and other repos on GitHub
     (`git ls-remote --heads`, `gh search code`).
   - A pet's own state files: a pet that watches something often already knows (Discord Damsel's recovery
     state says whether BetterDiscord is installed).
   - Chat history: Claude's `%USERPROFILE%\.claude\projects\*\*.jsonl`, Codex's `%USERPROFILE%\.codex\sessions`.
4. **Found is not working.** An installer on disk is not the program installed, and a folder is not a running
   program. Check the part that makes it work (the loader, the process, the version) before saying "you have it".
5. **Report.** List what you searched and how fresh each source was ("Everything's index is from 10/12"). Never
   just "it isn't installed".

## Example: BetterDiscord (2026-10-19)

Astra: "i already have betterdiscord". There was no `%APPDATA%\BetterDiscord`. Everything was not running, and its
index was a week old. The disk search found the Codex task folder from 10/15 with four copies of the official v2.0.0
installer (checksum matched GitHub), plus the installer's own browser cache in AppData. It found no BetterDiscord
anywhere, including both assistants' private copies. Discord's loader file was the plain one, because Discord had
updated itself on 10/15, and Damsel's recovery state said "Repair needed" that evening. The answer was: she has the
installer, but BetterDiscord isn't installed, and running Install from that installer fixes it.
