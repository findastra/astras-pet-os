# MCP servers for Astra's PetOS: which ones are worth it

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-09, for Astra. By Astra.

Astra, 2026-11-09: "look through all the pets that we have right now and see if there's MCPs out there that are worth
getting for us and do a critical assessment on if I actually would use it with what I have or what I intend to use it
on in the future. And then get a list ready of ones that we think that all of them could use." Then: "So MCPs are a L3
trick? Or something else? If the seated agent uses it, etc."

Checked: all 87 pets (the 85 in `pet-programs.json` on `main`, #85 Reactor Raccoon on #245 and #87 Flowsheet Flamingo
on #299), the 93 programs on the System Map, Anthropic's connector directory, and each server's own repo or page.
GitHub stars and release dates are from the GitHub API on 2026-11-09. Nothing here is installed: each server waits
for Astra's yes (the decision deck named on this document's card).

**Where each server stands now is the [MCP Roadmap](mcp-roadmap-20261109.md)**, which is kept up to date. This page is
the research as it was on 2026-11-09. Astra answered "All recommended" the same day.

## The short answer

- **One rule decides most of it.** Claude Code and Codex already have a shell. A server that only wraps a
  command-line program (`gh`, `es.exe`, ffmpeg, ssh, nvidia-smi, tshark) adds almost nothing. A server earns its place
  when it reaches **inside an app with no command line** (Unity, Blender, Ableton) or **a web account** (OneNote,
  Yelp, research libraries).
- **It helps the chats that work on the pets, not the pets.** The pet chat helper seats Claude Code with
  `--restricted` and Codex with `--ignore-user-config`: no MCP servers (changes/pet-chat-helper-20261103.md). A pet
  gets one only through its own L3 harness and a grant, once that is built.
- **44 of the 87 pets need no MCP server.** About six bring real benefit now, and most of that value is already in
  place (MCP for Unity) or built and waiting for a merge (#254).
- **Every server is a door.** Text it reads (messages, email, issues, web pages) can carry instructions an agent might
  follow; write tools can break real things; several of these servers had published security holes in 2026. They come
  in the way the Shed says: quarantine, a checker review, then L4's OK (TOOLS-AND-TRICKS.md, "the Shed").

## Where an MCP server sits in the levels

Who does the work decides the kind (ASTRAS_PET_OS.md, amendment of 2026-10-24). An MCP server is code that runs with
no AI deciding, so it is a **tool at L1**, never a trick. It is what `skills/dev-mindset` calls a pet connector.

| Part | Level | Example |
|---|---|---|
| Someone else's MCP server | L1, 3rd party program | MCP for Unity (`unity-mcp`; Unity Stable `manages` it) |
| An MCP server the farm made | L1, native tool | The Farm's own read-only server (#254, `the-farm-v1.0-astras-pet-os-mcp-v1.0`) |
| The written steps for using it | L2, trick | "After a script change, read the Unity console" |
| The agent that calls it | L3, the seat | Claude Code, Codex (System Map links `directs`) |
| The OK to connect it, and its R W X | L4, through a Gatekeeper Goddess grant | "Spoonfed: Yelp, read only" |

The grant sits on the server, never on the trick: "a trick's text holds nothing; only the grants on the tools it uses
do" (ASTRAS_PET_OS.md, amendment of 2026-10-18).

## Which seats can use them

**MCP belongs to the harness, not the model.** The MCP host, "an AI application", creates one MCP client for each MCP
server, and MCP "does not dictate how AI applications use LLMs" (modelcontextprotocol.io, architecture). Any
farmhand can use these servers when the program it sits in is an MCP client. Checked in each app's own docs on
2026-11-09:

| Seat (harness) | Servers on this PC | Servers on the internet | On this farm |
|---|---|---|---|
| Claude Code | Yes | Yes, plus the owner's Claude connectors | Everything in the chart |
| Codex | Yes | Yes; Claude connectors do not reach it | Same servers, in its own config |
| ChatGPT (website and app) | Only through OpenAI's Secure MCP Tunnel; localhost does not work | Yes; write tools on Business, Enterprise and Edu, read only on Pro | An adviser with no access (AGENTS.md, "How the agents work"): it gets none unless L4 changes that rule. OpenAI's seat on the farm is Codex. |
| GitHub Copilot (VS Code agent mode, Copilot CLI) | Yes | Yes | Same servers, in its own config |
| Gemini CLI | Yes | Yes | Same servers; the pet chat helper already names it |
| Qwen Code | Yes | Yes | Same servers, in its own config |
| Kimi Code CLI | Yes | Yes | Same servers (the Kimi chat app: not confirmed) |
| Local farmhands | Through an MCP client app (LM Studio, Goose, Open WebUI with mcpo); Ollama alone has none | The same apps | No harness of their own yet (the Astra Pet SDK, migration Phase 5); read-only servers only |
| The pet chat helper's seat | None | None | By design today: Claude Code `--restricted`, Codex `--ignore-user-config` |

- **A grant names the seat, not the brand:** harness, farmhand and pet together, issued by Gatekeeper Goddess.
- **Prefer servers every seat can use.** The Farm's own server, Microsoft Learn and MCP Inspector work for all of
  them. Claude connectors (Yelp, alphaXiv, PubMed, Canva, Hugging Face) are tied to the owner's Claude account; another
  seat uses the maker's own server instead (for example Yelp's `yelp-mcp`, or an arXiv server).
- **Smaller farmhands choose tools less reliably** and are easier to steer with planted text, so a local model gets
  read-only servers and the smallest grants ("Ask who an agent takes orders from", AGENTS.md).
- **One list of approved servers**, copied into each seat's config, never a different list per seat.

## A. Shared by many pets (keeper first; the others use it by grant)

| # | MCP server | Keeper → users | Made by | Verdict and why |
|---|---|---|---|---|
| 1 | The Farm's own read-only server (#254) | Friendly Farmer → every pet's chats | the farm (native tool) | **Get.** Any chat can ask what a pet is, which cards are open, what a rule says. Rebase it, fix its install paths, merge. |
| 2 | MCP for Unity | Unity Unicorn → Astra Wisp, Dubstep Gunsmith, Pole Puff, Piranesi Nessi, Door Dormouse, Reactor Raccoon | Coplay | **Have.** Used on every world and avatar. Card 306's first check with Unity open is still owed. |
| 3 | Context7 (current library docs) | AI Dashund → every coding chat | Upstash | **Have.** Already connected; #255 does not need to add it again. |
| 4 | Microsoft Learn (Windows, PowerShell, C#, .NET docs) | PC Master → every chat writing Windows code | Microsoft | **Get.** Startup Star, the chat helper and the background pets are Windows code. Free, read-only, no key. |
| 5 | MCP Inspector (a checker that is run, not connected) | White Hat Weasel (Agent Ant once it hatches) → every new server | the MCP project | **Get.** The Shed's checker review: it lists every tool a server offers before any chat gets it. Localhost only. |

## B. Worth getting for one pet

| # | MCP server | Pet | Made by | Verdict and why |
|---|---|---|---|---|
| 6 | alphaXiv (arXiv) and PubMed connectors | Paper Patty → Flowsheet Flamingo, AI Dashund | alphaXiv; Anthropic-hosted | **Get.** Paper Girl is a research desk. One click, public data, read-only. |
| 7 | Yelp connector | Spoonfed Sugarcube | Yelp (official) | **Get.** Real restaurants while the app is built; search only. The app itself still needs its own provider. |
| 8 | The Blender add-on for MCP for Unity's Blender bridge | Unity Unicorn | ahujasid (blender-mcp, 33.8k stars) | **Later.** MCP for Unity 10.3.0 already has the bridge, so no second server. Add the add-on the next time a model moves from Blender to Unity; telemetry off, safe mode on. |
| 9 | Microsoft 365 server, OneNote preset, read-only | Project Parrot | Softeria (community, 1.1k stars) | **Later.** Reading OneNote is Project Parrot's whole job; get it when Project Parrot is built. |
| 10 | DWSIM headless (process simulator) and PubChem | Flowsheet Flamingo | DWSIM (official); cyanheads (community) | **Later.** The Pilot Plant could run real flowsheets. Test after #299, on localhost with a token; DWSIM listens on every interface with no token by default. |

## C. Later, when that pet's work starts

| # | MCP server | Pet(s) | Why later |
|---|---|---|---|
| 11 | ableton-mcp | Drum Dog | Not proven on Live Lite; it needs a second control-surface slot next to the APC64, and Lite stops at 8 tracks. |
| 12 | ElevenLabs (official, hosted) | Astra Wisp | The Astral Plane is paused, and every voice line costs credits. |
| 13 | ssh-mcp (approval rules, audit log) | Raspberry Pi Berry, Linux Penguin | Plain ssh works today; its approval rules fit the Police Station later. |
| 14 | Playwright MCP (adds Safari's WebKit engine) | Platform Platypus → Browser Bat, Test Tortoise | Fit-check covers Chromium; add it for iPhone and iPad Safari checks. |
| 15 | Docker MCP Toolkit (each server in a container, one off switch) | Docker Dragon → Pet Police Officer | Only once three or more local third-party servers run; Docker Desktop is heavy. |
| 16 | Hugging Face (official) | Llama Librarian | Model search and details; the pet is still on the roadmap. |
| 17 | Google Calendar (official) | Calendar Crow, Mommy's Mommies | Only if the farm owner's calendar is Google's. |
| 18 | Stripe (official) | Data Chip | Data Dealer is still a plan; sandbox only, because it has a send-money tool. |
| 19 | Canva (official) | Mommy's Mommies, Gif Giraffe | The free plan works with limits; only if flyers are made in Canva. |

## D. Skip, and why

| # | MCP server | Pet it would serve | Why not |
|---|---|---|---|
| 20 | GitHub's official server | GitHub Goldfish, Portfolio Puffer | `gh` already does it. Maybe later for a pet seat that has no shell. |
| 21 | Everything search servers | File Master | `es.exe` does the same; File Master's own connector is planned. |
| 22 | Windows-MCP | Kernel Koala | Goes around the seat's approvals (PowerShell, Registry) and had a remote-shell hole (fixed in 0.7.5). |
| 23 | Discord servers | Discord Damsel, Role Fairy, Meme Fiend | No official one and no read-only mode; a bot token plus any message is a risk. |
| 24 | Mail servers (IMAP, iCloud) | Mail Snail | Small community repos that hold mail passwords; none runs well on Windows. |
| 25 | Finance (Monarch, Plaid) and health | Finance Finch, Health Hummy | Both pets promise their data stays on the PC; a chat would send it out. |
| 26 | VRChat API and OSC servers | Astra Wisp, OSC Sealion | Unmaintained or brand new; a long-lived login token; the OSC ones only send, and OSC Sealion needs to listen. |
| 27 | LinkedIn servers | Portfolio Puffer | All drive a logged-in browser; LinkedIn's terms ban automated access. |
| 28 | OBS, Spotify, Stream Deck, Meshtastic, RGB, ffmpeg | Deck Duck, Mesh Moth, RGBee, Gif Giraffe | No pet needs it, it cannot read what the pet needs (Elgato's server only presses chosen buttons), or the shell does it. |
| 29 | Kali, Wireshark, Tailscale, Sentry, memory, Serena | White Hat Weasel, Packet Piranha, Roaming Raven, Log Lynx | Open shells, stale, or the command line covers it. Serena (Oraios AI's open-source coding tool, from #255; not a pet) lets an agent find and rewrite one function by name and asks agents to prefer it over their own edit tools; #255 keeps it off until L4 says yes. |

## E. No MCP server needed (44 pets)

API Fairy (no server ever gets the keys), Python Panther, Gone Ghost, VSCode Angel, Voicemeeter Bug, Claude Bot, Mine
Mole, Patch Cat, Backup Beaver, Rift Rabbit (no SteamVR server exists), Fuzzboi Friend, Wifi Butterfly, Chat Rat,
Procreate Panda (Procreate has no API), Skill Scout, Photo Dodo, Video Vulture, Closet Cat, Gatekeeper Goddess (she
issues the grants), Queue Quokka, Server Salamander, Token Toucan, Data Dragonfly, Update Urchin, Stock Fox (never
trades), Passport Pelican (identity data stays private), Journal Jellyfish (private), Shell Squid, Proxy Axolotl,
Cluster Crab, Storage Stoat, Port Spider, Cipher Owl, Forensic Ferret, Inference Iguana, Cache Coyote, Sync Mink,
Triage Tapir, Rescue Retriever, Intel Owl, Workflow Whale, Kernel Koala, Log Lynx and Packet Piranha (the last three:
their candidates are in D).

## How a yes gets in

One server at a time, only after L4's yes:

1. Look at it with MCP Inspector first: every tool it offers, and which of them write.
2. Install it in its read-only mode where it has one, after a backup of each config it changes
   (`*.before-<name>-YYYYMMDD`). A one-click connector is connected by Astra herself, on the exact connect screen.
3. Register it like `unity-mcp`: a `program` node in `system-map.json` (a native `tool` node for the farm's own),
   `manages` from the keeper's pet program, `directs` from `claude-code` and `codex`, and a grant in `access` with its
   R W X and status; `npm run build`, `npm test`; one pull request per repo, merged on Astra's OK.
4. Check it from a new chat: it shows as connected, and one read-only call answers. Then its map node goes from
   `planned` to `now`.

Connectors from Anthropic's directory reach Claude Code and the Claude apps, not Codex; Codex gets its own lines in
its `config.toml`.

## Sources

Each server's own repo or page, read on 2026-11-09: github/github-mcp-server, CursorTouch/Windows-MCP,
ChromeDevTools/chrome-devtools-mcp, microsoft/playwright-mcp, docker/mcp-gateway and Docker's MCP Toolkit docs,
snyk/agent-scan, modelcontextprotocol/inspector, kali.org's mcp-kali-server, tufantunc/ssh-mcp, MicrosoftDocs/mcp,
mamertofabian/mcp-everything-search, ahujasid/blender-mcp, ahujasid/ableton-mcp, elgatosf/elgato-mcp-server, Home
Assistant's MCP Server integration, Softeria/ms-365-mcp-server, Yelp/yelp-mcp, SaseQ/discord-mcp,
robcerda/monarch-mcp-server, stickerdaniel/linkedin-mcp-server, stripe/ai, awslabs/mcp, dwsim.org,
cyanheads/pubchem-mcp-server, and Anthropic's connector directory (Yelp, alphaXiv, PubMed, Canva, Spotify, Google
Calendar, Hugging Face, Stripe).

Not confirmed first-hand: a remote read-only header for GitHub's server (its README documents only `--read-only`),
whether Live Lite loads third-party control-surface scripts from the User Library, and Snyk Agent Scan on Windows.
