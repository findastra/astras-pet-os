# Protection Rings

How Astra's PetOS keeps the farm safe: where each thing lives, who may read, write and run what, which parts are
connected, and what stops a mistake or an attack. Companion to [INTELLIGENCE-LEVELS.md](INTELLIGENCE-LEVELS.md) and the
[security model](docs/security-model-20261018.md); to report a problem, see [SECURITY.md](SECURITY.md). Short rule list
for agents: [skills/farm-security](skills/farm-security/SKILL.md). Started by Claude Opus 5.5, 2026-10-13.

**Rings and grants (Astra, 2026-10-17).** A ring says **where a thing lives**. It grants nothing. **R W X lives on
grants**: who may read, write or run one thing. Every grant says whether it is **enforced**, **written only** or
**planned**, so nobody mistakes a rule for a lock. This replaces the R W X tags each ring carried from 2026-10-13 to
2026-10-17.

**Should be, then in code (Astra, 2026-10-19, option C).** The R W X on a grant is what it **should be**, by design. Its status says
whether that is **in code**: on every System Map card and in every pet program's R W X panel the three read **✓ In
code** (enforced), **⚠︎ Rule only** (written only) and **○ Not built** (planned). Every In code grant names its
**proof**, a test or script in this repo or a setting, and `npm run build` refuses an In code with no proof or a proof
file that is not in the repo.

> **🐾 Everything inside the harness is an animal. Agents can only control animals.
> Nobody becomes an animal by saying so: only Astra lets a new animal in.**

## What engineers call this

| Astra's PetOS | Standard name | One line |
|---|---|---|
| Rings around the pets | **Protection rings** (here, trust zones) | Where a thing lives, from the most protected (ring 0) outward. A ring grants nothing by itself. |
| R W X on a grant | **rwx permissions** on a **capability** | Who may read, write or run one thing, as on every Unix file. |
| Enforced, written only, planned | **Technical control, policy, roadmap** | Whether a program stops a break, or only a rule asks everyone not to. |
| The glass harness | **Trust boundary** | The line where the rules change. It is drawn, not a sandbox. |
| "Nobody gets more than the job needs" | **Least privilege** | Every grant is as small as the job. |
| The checks below, one behind another | **Defense in depth** | When one layer fails, the next one still holds. |
| "What could go wrong, and who could do it" | **Threat model** | The list in [Known gaps](#known-gaps). |
| The sick cow from another farm | **Supply-chain risk** | Never run code you cannot trace to someone you trust. |
| One farm per person, never connected | **Tenant isolation** | Each user's data and pets are walled off from every other user's. |

## The rings: where things live

Inside out. The System Map draws each ring as a sphere (3D) or as a circle on the ground (2D), with the glass harness
around rings 0 to 3, and Claude Code and Codex as rings around their AI models (a request can go through the ring or straight to the model).

<!-- rings:start (generated from system-map.json by scripts/system-map-20261012.mjs; do not edit by hand) -->
| Ring | Name | What lives there | Animal? |
|---|---|---|---|
| 0 | Core | The Farm (the Friendly Farmer's pet program), Pet Directory, Program Manager, the rules and tests, and The Farm's tools | 🐾 yes |
| 1 | Friendly Farmer | organizes the pets | 🐾 yes |
| 2 | Pets | every intelligent app: registered and pipeline pets, then seeds and roadmap pets, which are not animals until Astra registers them | registered and pipeline pets; seeds and roadmap pets once Astra registers them |
| 3 | Pet programs | the programs, sites and worlds Astra made, and their tools | 🐾 yes, once their pet is registered |
| — | **Agent harness** | the glass sphere between the animals and everything else | the line between animals and everything else |
| 4 | Farmhands (AI models) | Claude, OpenAI and Astra's local farmhands. Claude Code and Codex are rings around their AI: a request can go through the ring (the agent app) or straight to the model | no |
| 5 | Third-party programs | programs, libraries and services made by others, and the community places (the Kennel, the Shed, the vet-clinic) | no |
| 6 | Devices | PCs, phones, headsets, trackers and other hardware | no |
| 7 | Advisers | ChatGPT | no |
| 8 | You (L4) | Astra, who owns the whole farm | no: the owner |
<!-- rings:end -->

Ring 3 sits inside the glass because Astra made those programs. Ring 5 sits outside because other people made those
programs. What an agent may do on either is in the grants below, not in the ring. The map draws the two apart (Astra,
2026-10-18): ring 3 pink, "made by you", like its cubes; ring 5 peach, "made by others". The pets have extra room around them inside the glass:
seeds and roadmap pets on their own lane, then the pet programs (Astra, 2026-10-19). Native tools and tricks are not
drawn; they belong to their pet program (Astra, 2026-10-19, #114).

## Who may do what: grants

A grant is one line: **who** may **R**ead, **W**rite or e**X**ecute (run) **which things**. Every card on the
[System Map](system-map-20261012.html) lists the grants that reach it. The grants live in `system-map.json` (`access`),
and `npm run build` writes this table from them, so the map and this page always agree.

**Level** says who holds the grant (Astra, 2026-10-18; [INTELLIGENCE-LEVELS.md](INTELLIGENCE-LEVELS.md)): **L4** you,
**L3** an AI agent in a seat, **L2** a pet program, **L1** its programs and tools, which act with their pet's grants and
never more; `—` is outside your levels. Every map card shows L1 to L4 down the left, each with the R W X it has there.

`yes` · `🔒 PR` only on a branch, merged after Astra's OK in chat (the assistant does the merge; Astra, 2026-10-18) · `asks` only after the harness asks Astra ·
`🔑 grant` only with a grant from Iron Gates that Astra approves · `–` no

**Enforced** (in code): a test, setting or script stops anything else, and the grant names that proof. **Written
only** (rule only): a rule agents agree to follow (AGENTS.md or a skill); nothing stops someone who breaks it.
**Planned** (not built): designed, not built yet.

Read it honestly: today most rules are **written only**. Agents work on Astra's own account ([known gap 1](#known-gaps)),
so these lines hold because agents follow AGENTS.md and the skills, and because Astra reviews what lands.

<!-- access:start (generated from system-map.json by scripts/system-map-20261012.mjs; do not edit by hand) -->
| # | Level | Who | On what | R | W | X | Status | How it holds |
|---|---|---|---|---|---|---|---|---|
| 1 | L4 | Astra (you, L4) | everything | yes | yes | yes | **Enforced**: in code | It is your PC and your accounts. You give and take back every other grant in this list. **Proof:** Your own Windows account on this PC, and your own GitHub, Discord and AI accounts: only you sign in to them. |
| 2 | L3 | The agent in the seat (Claude Code or Codex, with a farmhand in it) | the core and the Friendly Farmer (rings 0 and 1) | yes | 🔒 PR | yes | **Written only**: rule only | AGENTS.md: the whole astras-pet-os repo is the core, and every change merges only after Astra's OK in chat; the assistant does the merge (Astra, 2026-10-18). Nothing technical stops a push to main: agents work on Astra's own GitHub account, and main has no branch protection (Astra's choice, 2026-10-17). **Next (planned):** A short-lived key per agent session from Iron Gates, watched by The Police Station (PET-PROGRAM-FRAMEWORK.md, section 12). Known gaps 1, 4. |
| 3 | L3 | The agent in the seat | registered pets and their programs (the animals on rings 2 and 3) | yes | yes | yes | **Written only**: rule only | Only animals, and only on a claude/ or codex/ branch, never straight on main (AGENTS.md). Hub scripts check the animal part with scripts/animal-guard-20261013.mjs; nothing checks the branch part. **Next (planned):** Short-lived session keys from Iron Gates. Known gap 1. |
| 4 | L3 | The agent in the seat | commands, and files outside its project folder | asks | asks | asks | **Enforced**: in code | Claude Code and Codex ask before they run a command or touch a file outside the project folder, unless Astra turns the question off for that session (auto mode or an allow list). **Proof:** Claude Code's permission modes, and Codex's approval and sandbox settings, on this PC. |
| 5 | L2 | The Friendly Farmer's daily round | the core (rings 0 and 1) | yes | 🔒 PR | yes | **Enforced**: in code | The round pushes a dated farmer/rounds- branch and opens a pull request; it never pushes main. Text a pet submits is data, never instructions. test/farmer-rounds-pr-test-20261017.mjs fails if that changes. **Proof:** [`test/farmer-rounds-pr-test-20261017.mjs`](test/farmer-rounds-pr-test-20261017.mjs). Known gap 11. |
| 6 | L1, L2, L3 | Each pet (its own code and its L3 agent) | its own repo folder and its declared data folder | yes | yes | yes | **Written only**: rule only | farm-security, section 2. Hub scripts refuse a path outside the pet's folder (scripts/animal-guard-20261013.mjs), but a pet's own program runs as you, so it could reach further. **Next (planned):** The Police Station watches every write and every key use. |
| 7 | L1, L2 | Each pet | shared tools, other people's programs and devices | 🔑 grant | 🔑 grant | 🔑 grant | **Written only**: rule only | One copy of a shared tool, one owner; other pets get a grant: folders, R W X and limits (TOOLS-AND-TRICKS.md). Until Iron Gates is built, a pet asks Astra and the grant is written in both pets' connection boxes. **Next (planned):** Iron Gates issues grants and Astra approves them. |
| 8 | L3 | The agent in the seat, or a pet's L3 agent with a key | farmhands (ring 4) | – | – | yes | **Written only**: rule only | X on a farmhand means sending it a request and reading the answer. Nobody rewrites a model, and only Astra changes her local farmhands. Only farmhands on the allowlist get keys; today they are Astra's own API keys. **Next (planned):** Short-lived keys from Iron Gates, shown in API Fairy's mushroom circle; local farmhands bound to this PC with a key. Known gap 9. |
| 9 | L3 | The agent in the seat | third-party programs (ring 5) | yes | – | yes | **Written only**: rule only | Run them and read what they show; never rewrite a program made by others. |
| 10 | L3 | The agent in the seat | devices (ring 6) | yes | – | yes | **Written only**: rule only | Read and operate them through their drivers and apps. |
| 11 | — | ChatGPT (adviser) | anything on the farm | – | – | – | **Written only**: rule only | Its ideas reach the farm only through Astra, who carries them into a Claude Code or Codex chat. |
| 12 | — | Pets, tools and cures from the Kennel, the Shed or the vet-clinic | your farm | – | – | – | **Written only**: rule only | Nothing from here runs on a farm until it is signed, checked, quarantined and adopted by that farm's owner. **Next (planned):** The Farm checks signatures and refuses anything that does not check out. Known gap 10. |
| 13 | L2 | Token Toucan | CLI Proxy API's token use, read through Discord Damsel's tool | yes | – | – | **Planned**: not built | Astra, 2026-10-18: Token Toucan watches the tokens that go through CLI Proxy API. The proxy has one owner, Discord Damsel's tool, so Token Toucan reads only what that tool reports: which models were used and how many tokens each took. Never the proxy's settings file, keys or sign-ins; Start, Stop and settings stay Discord Damsel's. Token Toucan is not built yet. **Next (planned):** Iron Gates issues it and Astra approves it; both pets show it in their connection boxes. |
| 14 | L2 | Proxy Axolotl | CLI Proxy API's network safety check, read through Discord Damsel's tool | yes | – | – | **Planned**: not built | Astra, 2026-10-18: Proxy Axolotl watches CLI Proxy API's network side. The proxy has one owner, Discord Damsel's tool, so Proxy Axolotl reads only that tool's safety check (this PC only, remote console, discovery and plugins off) and whether the proxy answers, and flags it if it could be reached from beyond this PC. Never the proxy's settings file, keys or sign-ins; Start, Stop and settings stay Discord Damsel's. Proxy Axolotl is not built yet. **Next (planned):** Iron Gates issues it and Astra approves it; both pets show it in their connection boxes. |
| 15 | L1, L2 | Linux Penguin (Linux Iceberg: linux-check, mac-prewipe-check) | the Linux or Mac computer his check runs on: what it is, its packages, services, disk, memory and listening ports (never the contents of your files) | yes | – | – | **Written only**: rule only | His tools only read and print a report: no sudo, no writes, nothing sent (tests/linux-check-test-20261019.sh checks the report against stand-in commands). Nothing enforces this: they run as you. Asked for on 2026-10-19; Astra approves it by merging. **Next (planned):** Iron Gates issues the grant; The Police Station watches that Linux Iceberg writes nothing. |
| 16 | L1, L2 | Log Lynx (Log Den: crash-catcher, windows-log-reader, heartbeat-checker) | every window on the desktop and the process that owns it (title, text, path, command line, parent), the Windows Application log, and the farm event folders and known logs of the other pets (last-write times) | yes | – | – | **Written only**: rule only | Log Den’s own code only reads, and on a .NET crash window presses Details and nothing else (log-den-20261018.cs). It writes only its own data folder. Nothing enforces this: it runs as you. Asked for on 2026-10-18; Astra approves it by merging. **Next (planned):** Iron Gates issues the grant; The Police Station watches that Log Den writes only its own folder. |
| 17 | L1, L2 | Packet Piranha (Packet River: ping-sampler, dns-checker, reach-checker, route-tracer) | pings to this PC’s router and DNS server, DNS lookups, one TCP connection a minute to the names in its targets file (github.com:443 by default, no data sent), and traceroutes to a host Astra names | – | – | yes | **Written only**: rule only | packet-river-20261018.cs contacts only the router, the DNS server and its targets file; it never scans ports or changes the network. Nothing enforces this: it runs as you. Asked for on 2026-10-18; Astra approves it by merging. **Next (planned):** Iron Gates issues the grant with its targets as the limit. |
| 18 | L1, L2 | Forensic Ferret (Evidence Locker: evidence-collector) | the other pets’ farm events and Log Lynx’s crash pictures, screenshots saved around a case (copied in), file names and times in the Claude Code, Codex and Astra’s PetOS folders (never contents), the Windows Application log, and the id and title of each Claude Code session | yes | – | – | **Written only**: rule only | evidence-locker-20261018.cs reads and copies into its own cases folder only; it never changes or deletes what it investigates. Nothing enforces this: it runs as you. Asked for on 2026-10-18; Astra approves it by merging. **Next (planned):** Iron Gates issues the grant; Cipher Owl signs each case so a rewritten case shows. |
<!-- access:end -->

## The boundaries: what is connected to what

Everything is disconnected until it reaches **your native farm**. Solid arrows are allowed; the crossed line never exists.

```mermaid
flowchart LR
  subgraph PC["Astra's PC: the native farm"]
    subgraph H["Agent harness: the glass (animals inside)"]
      CORE["Ring 0 core: registry, rules, Farm, Startup Star"]
      FARMER["Ring 1 Friendly Farmer"]
      PETS["Ring 2 pets"]
      PP["Ring 3 pet programs"]
    end
    SEAT(("Seat: Claude Code or Codex"))
    TP["Ring 5 third-party programs"]
    DEV["Ring 6 devices"]
  end
  subgraph LAN["Astra's local network"]
    LM["Local models (self-hosted)"]
  end
  subgraph CLOUD["Model providers"]
    CM["Claude, OpenAI"]
  end
  subgraph GH["GitHub: the only shared place"]
    REPOS["Astra's repos and Pages"]
    KEN["The Kennel: other people's pets, waiting"]
  end
  OTHER["Another user's farm"]
  ASTRA(["Astra"])

  SEAT -->|"R W X on a branch, core only by pull request (written only)"| H
  SEAT -->|"R X (written only)"| TP
  SEAT -->|"R X (written only)"| DEV
  SEAT <-->|"X: prompts and answers"| CM
  ASTRA -->|"only Astra changes them"| LM
  LM <-->|"works alongside, through Astra"| ASTRA
  PC -->|"push branches, publish"| REPOS
  REPOS -->|"pull after review"| PC
  KEN -.->|"only signed, checked, adopted"| PC
  OTHER -->|"pull public code only"| REPOS
  OTHER x--x|"never connected"| PC
  ASTRA -->|"approves"| SEAT
```

## The failure layers: what stops a bad change

A mistake or an attack has to get through every layer in order. Each one is independent, so one failing does not open the farm.

```mermaid
flowchart TB
  A["A change is attempted: by an agent, a script, a pet or a hijacked prompt"] --> L1
  L1["1 Rules and skills: AGENTS.md and skills/ say what is allowed"] --> L2
  L2["2 Harness permissions: the seat asks before commands and files outside its folder"] --> L3
  L3["3 Animal guard: scripts refuse anything that is not an animal, or a path outside its folder"] --> L4
  L4["4 The gate: a new repo waits in candidates; it cannot make itself an animal"] --> L5
  L5["5 Branch and pull request: work lands on a branch, never straight on main"] --> L6
  L6["6 Tests: npm test must pass (privacy, registry, map)"] --> L7
  L7["7 Astra's review: the core merges only with her approval"] --> L8
  L8["8 Signatures (planned): the farm refuses pets whose signature does not check out"] --> L8b
  L8b["8b The Police Station (planned): watches every write and key use, switches OFF, raises the alarm"] --> L9
  L9["9 Backups and undo: Backup Beaver and File Master's undo logs"] --> OK["The change is live"]
```

What happens when one part fails (**failure domains**):

| If this fails | What still works | What it can reach |
|---|---|---|
| One pet breaks | Every other pet; the Farmer marks it sick | Its own folder only |
| The seat (an agent) misbehaves | Main stays safe: its work is on a branch, the core needs Astra | Animals on its branch |
| A third-party program is compromised | Pets cannot be rewritten by it; it has no seat | What that program already reaches on the PC |
| GitHub is down or compromised | The native farm keeps running from its local copy | Nothing new is pulled until it is checked |
| Another user's farm is compromised | Nothing: farms are never connected | Their own farm only |
| The PC is lost | Code is on GitHub; data is in backups (Backup Beaver) | Anything not backed up |

## Known gaps

What is not true yet, in order of risk. Tracked in [docs/structure-audit-20261013.md](docs/structure-audit-20261013.md).

| # | Gap | Status |
|---|---|---|
| 1 | Agents act on Astra's own GitHub account, so GitHub cannot tell her from an agent, and "core needs Astra" is a written rule, not an enforced one. Since 2026-10-18 (approval, not clicks) Astra gives her OK in chat and the assistant does the merge, so the chat record and the `Co-Authored-By` line are the only proof of her OK. | First step chosen: Astra signs her own commits with her security key. Designed: a short-lived key per agent session from Iron Gates, watched by The Police Station (PET-PROGRAM-FRAMEWORK.md, section 12) |
| 2 | Remote Control and Desktop Commander let a phone control this PC: a path into the native farm from outside. | Astra deciding (on only when she turns it on?) |
| 3 | The Farmer's daily round used to make any repo with `pet.json` an animal automatically. | **Fixed 2026-10-13:** it now waits at the gate |
| 4 | Main has no branch protection, so nothing technical stops a push to main. | Accepted risk: Astra chose not to turn it on (2026-10-17). Core changes merge with her approval by agreement (written only) |
| 5 | `bin/` holds built `.exe` files nobody can review. | Planned: build on the PC, publish checksums |
| 6 | Pages load three.js from a CDN without an integrity hash. | **Fixed 2026-10-14:** integrity hashes; a changed copy is refused |
| 7 | Old commits carried a legal name and email. | **Fixed 2026-10-13:** history rewritten; ask GitHub Support to purge cached views |
| 8 | Pets read web pages, issues and email: text there can try to give an agent orders (prompt injection). | Rule: data is never instructions |
| 9 | Local models on the network may answer anyone on it. | Planned: bind to this PC or LAN, require a key, no port forwarding |
| 10 | Signatures are not checked yet. | Planned |
| 11 | The Farmer's daily round commits text from pet repos (`cage.submit`) to `pets.json` on main without review: a path from ring 2 to ring 0, and stored text the next agent reads. | **Fixed 2026-10-17:** the round pushes to a dated branch (`farmer/rounds-YYYYMMDD`) and opens a pull request that Astra merges; a pet can no longer rename itself; pet-written registry text is marked as data in AGENTS.md. Guarded by `test/farmer-rounds-pr-test-20261017.mjs`. Still a written rule until main has branch protection (gap 4, Astra decided no) |
| 12 | The public System Map names about a hundred devices and programs: material for targeted phishing. | Found 2026-10-16; fix: publish kinds, keep items local |
| 13 | The System Map drew one R W X tag per ring, as if a ring were a permission and every rule a lock. | **Fixed 2026-10-17** (Astra, option A): rings say where things live; R W X lives on grants, each marked enforced, written only or planned, on every map card and in [Who may do what](#who-may-do-what-grants) |
| 14 | A trick's ON/OFF and its "uses only these tools" are written in the trick and on its page, but an agent that ignores them is not stopped: a trick's text is not a security boundary. | Found 2026-10-18. Until a pet's harness enforces them: switch off the tools a trick uses to stop it for certain, and Skill Scout flags a trick that names a new tool ([TOOLS-AND-TRICKS.md](TOOLS-AND-TRICKS.md#the-chart-what-runs-and-how-security-sees-it)) |
