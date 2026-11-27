# A72: Its own server, every item

[All rounds](README.md) · [The check](../flash-audit-20261014.md) (section 3, "4. Tools and safety") · Flash Audit,
2026-11-20 · **Dry run: nothing is renamed yet.** · Astra's answers, the same day: one server per pet, and each
name written once in `pets.json` ("I want the one server per pet, I dont care if [it] stops stuff together. cant have
that many [running]. all recommended everything else").

Astra, 2026-11-20: "every pet gets its own server ... so we can end separate ones of them at a time on demand ...
They should all be named after their pet program, and then dash server dash the date it was updated, which would be
today."

A72 is new, so its first pass covers every item at once instead of one round at a time. It is the next check after
round 8.

## How it was checked

- **What runs:** Startup Star's list of the programs it starts and adopts (`BackgroundPets.All` in
  `scripts/desktop-pets-20261011.cs`, `main` at `466a641f`), the programs running on Astra's PC on 2026-11-20 with
  their parent programs, and the menus they write for the star.
- **Whose it is:** the `of` field of its node in `system-map.json`, and the program's name in `pet-programs.json`.
  The name follows the pet program, as Astra said, not the repo: Light Hive (repo `rgbee`), Wonderland Launchpad
  (`rift-rabbit`), Chat Stack (`chat-rat`), Audio Rescue (`voicemeeter-bug`), The Farm (`astras-pet-os`).
- **Where its name is written:** every text file that names it, in the hub and in the owner's folder on her PC.
- Ports are not listed here: the hub is public, and local addresses stay in its gitignored files.

## What was found

- **12 pet programs run 18 servers.** None is named `<program>-server-YYYYMMDD` yet. The only file in that pattern is
  `papermon-server-20261114.mjs`, the server of the Papermon site that Paper Girl looks after. It is the site's, not
  the pet program's, so it keeps its name.
- **Own process:** all 18, except the two watches inside Log Den. Astra chose that host on 2026-11-08, and each of
  them quits alone, so A72 allows it.
- **Stop on its own:** 7 have a Quit of their own in the star's menu. 6 have a port and can be closed only from the
  White Hat Weasel's port list. 3 have no Stop at all: pet moods, Live Sync and the port watch itself. The MCP
  connector stops with the chat that started it. Audio Rescue's menu was not read (Not verified).
- **No server yet:** the other 73 items, Paper Girl among them (only its site has one). That is not a failure under
  A72.

## The renames, as a dry run

"Named in" counts the text files that name the server today: in the hub, then in the owner's folder. Many of the hub's
files are built pages that `npm run build` rewrites. Q1 and Q2 are the two questions in the chat's deck.

| # | Pet program | Server today | Port | Started by | Rename to | Named in | Waits on |
|--:|---|---|:-:|---|---|---|---|
| 1 | Benchmark Rock | `bin/benchmark-rock-20261023.exe` (its four watches) | yes | the star | `benchmark-rock-server-20261120.exe` | hub 7, benchmark-rock 8 | **done 2026-11-20**: benchmark-rock#15 and #408, rebuilt on her PC |
| 2 | Kernel Grove | `bin/kernel-grove-20261021.exe` (leftover watch) | no | the star, only when asked | `kernel-grove-server-20261120.exe` | hub 9, kernel-grove 5 | **done 2026-11-20**: kernel-grove#11 and #411, rebuilt on her PC |
| 3 | White Hat Lab | `scripts/port-watch-20261119.mjs`, in the hub | no | the star | `white-hat-lab-server-20261120.mjs` | hub 8 | **done 2026-11-21**: #425, rebuilt on her PC, with a Quit of its own; it stays in the hub (the hub carries White Hat Lab's tools), so its `server` path is inside the hub |
| 4 | Wonderland Launchpad | `rift-rabbit-20261024.exe` (the VR launcher) | yes | the star | `wonderland-launchpad-server-20261121.exe` (the day it was updated) | hub 6, rift-rabbit 6 | **done 2026-11-25**: rift-rabbit#17 (merged 2026-11-21) and #431, rebuilt on her PC; the old copies are in its program folder's `before-20261121`. The uncommitted folder in rift-rabbit's PC folder (old desktop art) is left alone |
| 5 | Log Den | `bin/log-den-20261018.exe` (hosts 6 and 7) | no | the star | `log-den-server-20261126.exe` (the day it was updated) | hub 73, log-den 7 | 5 to 7 build together. **Merged 2026-11-27**: findastra/log-den#17, packet-river#18, evidence-locker#17 and #443, with her OK ("go ahead"); Log Den's server still runs 6 and 7; switched on her PC the same day |
| 6 | Packet River | inside Log Den (`packet-river-20261018.exe --alone`) | no | Log Den | `packet-river-server-20261126.exe` | hub 20, packet-river 7 | with 5: **merged 2026-11-27** |
| 7 | Evidence Locker | inside Log Den (`evidence-locker-20261018.exe --alone`) | no | Log Den | `evidence-locker-server-20261126.exe` | hub 69, evidence-locker 7 | with 5: **merged 2026-11-27** |
| 8 | Audio Rescue | `voicemeeter-bug-20261008.exe --hosted` | no | the star | `audio-rescue-server-20261127.exe` (the day it was updated) | hub 22 | its build wants the hub beside its folder (known trap). Open 2026-11-27: findastra/voicemeeter-bug#16 and the hub's pull request; one program, no second copy (his status window comes from the running copy) |
| 9 | The Farm | `bin/pet-chat-helper-20261103.exe` | yes | the star | joins `the-farm-server-20261120.mjs` | hub 15 | written again in Node: it is C# today |
| 10 | The Farm | `scripts/flash-audit-helper-20261108.mjs` | yes | the star | joins `the-farm-server-20261120.mjs` | hub 14 | |
| 11 | The Farm | `scripts/pet-moods-20261114.mjs` | no | the star | joins `the-farm-server-20261120.mjs` | hub 14 | |
| 12 | The Farm | `mcp/server-20261026.mjs` (the read-only PetOS connector) | no | each chat, its own copy | stays out: not a background program | hub 13, and every chat's MCP settings | it starts and stops with its chat, so A72 does not count it |
| 13 | The Farm (Startup Star) | `startup-star/scripts/live-sync-20261017.ps1` | no | the star | joins `the-farm-server-20261120.mjs` | hub 4, startup-star 4 | one uncommitted file in startup-star's folder |
| 14 | Discord Tower | `openai-discord-presence/src/server.js` | yes | the star, then it lets go | joins `discord-tower-server-20261120.js` | hub 17, ai-discord-presence 9 | two uncommitted files in that folder |
| 15 | Discord Tower | `anthropic-discord-presence/src/server.js` | yes | the star, then it lets go | joins `discord-tower-server-20261120.js` | hub 14, ai-discord-presence 9 | as 14 |
| 16 | Discord Tower | `ableton-live-discord-presence/src/server-20261102.js` | yes | the star, then it lets go | joins `discord-tower-server-20261120.js` | ableton-live-discord-presence 3 | |
| 17 | Chat Stack | `chat-rat-20261016.mjs serve` | yes | the star | `chat-stack-server-20261120.mjs`: only the `serve` part moves; Chat Rat's other commands stay | hub 13, chat-rat 12 | her folder is on Codex's `codex/chat-rat-save-20261016` with 3 uncommitted files |
| 18 | Light Hive | `rgbee/helper` (light-hive-helper) | yes | not the star yet: a test copy started by another chat | `light-hive-server-20261120.exe` | hub 13, rgbee 6 | another chat's Light Hive work, uncommitted on two branches. Wait for it to land |

One server per pet (Astra's answer to Q1): The Farm's four background jobs (9, 10, 11, 13) join one
`the-farm-server-20261120.mjs`, and Discord Tower's three presences (14 to 16) join one `discord-tower-server-20261120.js`.
They stop together, which Astra accepted. Packet River's and Evidence Locker's watches stay in Log Den's server (her
2026-11-08 answer). That is 10 servers instead of 16 programs running. The connector (12) is not one of them: each
chat starts its own copy and it stops with that chat.

Each server's name is written once, as `server` in its pet's entry in `pets.json` (Astra's answer to Q2), with its
path inside the pet's folder (`bin/benchmark-rock-server-20261120.exe`). Startup Star, the Weasel and the pages read it
there, so a later rename is the pet's own repo and that one line.

## Servers made since the dry run (checked 2026-11-26)

These were built by other chats with the right name from the start, so they need no rename. They are in `pets.json`,
and Startup Star runs them:

- **Workflow Whirlpool:** `workflow-whirlpool-server-20261120.mjs` runs the screen watch and the Deskflow watch in one
  process (findastra/workflow-whirlpool#7 and #427, merged 2026-11-21).
- **PC Master Race:** `pc-master-race-server-20261120.mjs` does a weekly look, and quick looks only while its page is
  open (findastra/pc-master-race#3, then #417 and #426, merged 2026-11-21). A restart gives it a new port, so its page
  data is stale until its first look ends, a few minutes later.

Still open in another chat: Light Hive's server (row 18), `light-hive-server-20261120`, in findastra/rgbee#16 and #403.
#403 still edits the port watch by its old name, `scripts/port-watch-20261119.mjs`, which #425 renamed; since #431 the
Weasel knows any server named in `pets.json`. Rows 5 to 7 are merged and switched on her PC (2026-11-27), row 8 is
open; the rest of the table is still to do: rows 9 to 11, 13 to 17.

## How each rename goes

1. A branch in the owner's repo: the file, its build or launch script, its README and `pet.json`.
2. A hub branch: the `server` line in `pets.json`, the star's entry if it still names the file, the Weasel's list of
   our own servers, `system-map.json` and the docs, then `npm run build` and `npm test`.
3. Her OK to merge, then on her PC: quit the old one, build the new one, restart the star (`--quit`, then its scheduled
   task), and check that each server runs under its new name. Never while another chat is using it.

The easiest come first: 1 Benchmark Rock, 2 Kernel Grove, 3 White Hat Lab, 4 Wonderland Launchpad, then Log Den's three
together, then Audio Rescue. The two that join several programs into one come after: Discord Tower's three presences,
then The Farm's four jobs (pet chat is C# today, so it is written again in Node). 17 and 18 wait on the other chats'
work.

<sub>Flash Audit, 2026-11-20, Claude Opus 5.5 (`claude-opus-5-5`). Read-only: nothing was renamed, stopped, started or
signed in to.</sub>
