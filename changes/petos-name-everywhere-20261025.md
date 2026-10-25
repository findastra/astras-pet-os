# Astra's PetOS everywhere, the old name nowhere (2026-10-25)

Astra, 2026-10-25: her PC folder "needs to be Astra's PetOS", and "I dont want patches, I want the entire system fixed
and to get rid of every reference" of the old name. She approved
all 9 rows of File Master's plan `reports/rename-astras-petos-20261025/plan-20261025.csv` (on her desktop PC).

- Every mention of the PC folder's old name and of the hub's old repo name in this repo now says Astra's PetOS /
  `astras-pet-os` (1,422 lines in 168 files), old dated records too. Records that talk about the old name (audit
  findings, rename history) say "the retired folder name" or "the old hub names" instead of spelling it.
- The Farmer's desk page is now `apps/astras-pet-os-20261008.html`, and its notes key is `astras-pet-os:<repo>:interface:v1`.
  Notes saved under the earlier key move over once, the first time the desk opens (that one line still names the
  earlier key; it can go once Astra has opened the desk).
- Startup Star keeps its status file in `%LOCALAPPDATA%\astras-pet-os`, next to the crash watchers' data. The uninstaller's
  `-RemoveSettings` now removes that one folder.
- The Idle Flash Audit no longer looks for the old hub names (there are none left to find); it still looks for
  `findastra-pet-apps` and `Documents\Projects`.
- The PC folder rename itself and the startup entries are File Master's job on the PC, after the pet repos' PRs.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-25.
