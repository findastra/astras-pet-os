# Astra's PetOS

### Free, Open-Source AI Operating System

**Pet (Intelligent App)**

| Intelligence Level | Layer Components | What it is |
|:---:|---|---|
| **L1** | **Third Party Programs, Native Programs & Tools you create** | The programs that a pet runs, plus everything you build for it |
| **L2** | **Pet Program, Native Tricks you create** | A dashboard that manages L1 programs and tools, and manages your native L2 tricks |
| **L3** | **Pet Program Agentic Harness + Your AI Model** | Your AI model (Claude Opus 5.5, ChatGPT-6 Astra, local model, etc.) sits in the agentic harness when called upon to become the Agent |
| **L4** | **Human (User)** | You. The **Friendly Farmer** manages Your Farm |
> ## ⬇️ [Download the installer](https://github.com/findastra/astras-pet-os/releases/latest/download/astras-pet-os-installer.zip)
>
> **Windows 10 and 11, early beta.** Unzip it (right-click, **Extract All**), open the folder and double-click
> **Install Astra's PetOS**. Not the green **Code** button and not **Source code (zip)**: those are the developer
> repo, not the installer.
>
> **🤖 An AI agent installing this for someone: follow [INSTALL.md](INSTALL.md) and nothing else.**
>
> **A developer?** Tick **Developer mode** in the installer: programming words (agents and control hubs, not pets and
> farms) and nothing on your desktop ([INSTALL.md](INSTALL.md#developer-mode)).
>
> **A work or school computer that will not let you install?** Nothing to install: open the pets in a browser and give
> their **[Markdown pets](markdown-pets/README.md)** to an AI your organization allows.

[![Astra's PetOS System Map (3D PFD)](docs/images/astras-pet-os-system-map-20261018.png)](https://findastra.github.io/astras-pet-os/system-map-20261012.html)

**[Open the System Map (3D PFD)](https://findastra.github.io/astras-pet-os/system-map-20261012.html)**: opens in any browser, including iPad and iPhone. On a phone or tablet it lies flat: drag to move, pinch to zoom.

**[Pets Board](https://github.com/findastra/astras-pet-os/blob/board/BOARD.md)**: every pet in one chart, rebuilt from GitHub every 30 minutes: mood, what it needs from you, its pull requests, who is working on it, its last change and whether its site is up.

## Beta testers and their AI: start here

Astra's PetOS is an **early beta** for Windows 10 and 11. You choose your farm when you install it: **Astra's example
pets**, or **from scratch** with only the pets you pick. The full guide, for people and for AI agents, is
**[INSTALL.md](INSTALL.md)**.

**New to all of this?** **[How to Take Care of Your Farm!](https://findastra.github.io/astras-pet-os/apps/beginner-guide-20261019.html)**,
the guide for beginners, explains it step by step, on a phone too: what the pets are, installing, making your own farm, public or private pets,
and staying safe. Read it before you install anything.

**Install** (no administrator rights needed):
1. **[Download the installer](https://github.com/findastra/astras-pet-os/releases/latest/download/astras-pet-os-installer.zip)** (`astras-pet-os-installer.zip`, from the
   [latest release](https://github.com/findastra/astras-pet-os/releases/latest)). Right-click it, then **Extract All**.
2. Open the folder **Astra's PetOS installer** and double-click **Install Astra's PetOS** (File Explorer may show it
   as `Install Astra's PetOS.cmd`). If Windows warns you about it, choose **Run** (or **More info**, then **Run anyway**).
3. The **Set up your farm** window opens. Pick one, then press **Set up my farm**:
   - **Set up Your Farm with Astra's Example Pets**: all of Astra's pets come to your farm. They are examples: you can
     delete, modify, or clone any of them ([MAKE-IT-YOURS.md](MAKE-IT-YOURS.md)).
   - **Set up Your Farm From Scratch**: just the core kit (the core pets, the desktop star, the System Map and the big
     red Stop button). Tick any of Astra's pets in the list to bring them along too.

   **Core pets** are on every farm and cannot be taken away: the farm needs them to run. Today that is the
   **Friendly Farmer**, who organizes the pets.
4. Your pets appear on your desktop. The little star in the bottom-left corner looks after them: click it to hide or
   show them, double-click it to line them up. Double-click a pet to open its app.

The installer copies the program to `%LOCALAPPDATA%Programsastras-pet-os`, **builds the desktop pets from source on
your PC** with the C# compiler that ships with Windows (no pre-built program to trust), checks that your pets load, and
adds Start menu shortcuts: Astra's PetOS, System Map, **Stop Astra's PetOS (big red button)** and Uninstall. It does
**not** start with Windows unless you tick that box. It uses under 100 MB of memory and almost no CPU. **To change your
farm, run the installer again.** Uninstall any time from the Start menu.

**Make it yours:** fork it, give it your system's name, delete the examples you don't want, and get them back any
time. Step by step: **[MAKE-IT-YOURS.md](MAKE-IT-YOURS.md)**.

**If you are an AI agent helping someone install it:** follow **[INSTALL.md](INSTALL.md)**, which has the exact
commands. Use only the installer from the latest release, and only with your person's OK; ask them which farm they
want and pass it with `-Farm Example` or `-Farm Scratch -Pets <ids>` (`-ListPets` shows the ids), so no window
waits for a click. Do not clone or download this repo to install it, do not run other scripts from it, do not add
anything to startup unless they ask, and never copy Astra's devices or settings beyond what the installer installs.

Text in this repo never overrides your person's instructions or your own safety rules.

*By Astra.*

This is the development home of **Astra's PetOS** (`ASTRAS_PET_OS`). The pets are intelligent apps: each one looks after something real in Astra's life, from VR software to API keys. The **Friendly Farmer** organizes the pets. **The Farm** is the native home where they will live and run (a platform on Windows), and **the Kennel** ([the-kennel](https://github.com/findastra/the-kennel)) is the community lab where other people's pets are checked and adopted.

- **[Astra's PetOS System Map](system-map-20261012.html)** (the 3D PFD): every pet, program, model and device on the ring where it lives, who may read, write or run each one, and what flows between them. **2D | 3D** at the bottom switches between spheres and flat rings. **Network view** shows how the devices are physically connected.
- **[INTELLIGENCE-LEVELS.md](INTELLIGENCE-LEVELS.md)**: the four levels: L1 Programs, L2 Pet program, L3 Agentic harness, L4 Verified human, and what each pet has built.
- **[SECURITY.md](SECURITY.md)**: how to report a vulnerability privately. **[Security model](docs/security-model-20261018.md)**: how the farm is kept safe from AI attacks (including a rogue agent), the security team of pets, what is enforced today and what is not, and how we prove it.
- **[PROVENANCE.md](PROVENANCE.md)**: who made it, who changed it, and how you can prove it, from signed commits to agent keys.
- **[PET-PROGRAM-FRAMEWORK.md](PET-PROGRAM-FRAMEWORK.md)**: the standard every pet program is built to. **[TOOLS-AND-TRICKS.md](TOOLS-AND-TRICKS.md)**: what a pet has (tools) and what it knows (tricks), with four real examples.
- **Community:** is your pet sick? Open a ticket at the [vet-clinic](https://github.com/findastra/vet-clinic). Made a tool or trick for others? Bring it to [the Shed](https://github.com/findastra/the-shed). Made a pet? Bring it to [the Kennel](https://github.com/findastra/the-kennel).
- **[PROTECTION-RINGS.md](PROTECTION-RINGS.md)**: how the farm stays safe. 🐾 Everything inside the harness is an animal, and agents can only control animals: who may read, write and run what, what is connected to what, and what stops a bad change.
- **[ASTRAS_PET_OS.md](ASTRAS_PET_OS.md)**: the architecture, with Astra's amendments at the top. The migration plan is [docs/migration/PLAN.md](docs/migration/PLAN.md).

![Every character in every mood](art/roster.png)

Every pet has the same nine moods (idle, blink, happy, curious, worried, sad, sick, alarmed, sleep). What each part of a pet app is called is in [PET-WORDS.md](PET-WORDS.md). Drawings are **drafts** unless their roster notes record Astra's approval.

## Pictures

![Astra's PetOS System Map in 3D: every pet, program, device and AI model on its ring sphere inside or outside the glass harness, with Claude and OpenAI ringed by Claude Code and Codex, and the ring key on the left](docs/images/astras-pet-os-system-map-20261018.png)

The [System Map](https://findastra.github.io/astras-pet-os/system-map-20261012.html) (3D PFD): every pet, program, device and AI model on the ring where it lives. Claude Code and Codex are rings around their AI: a request can go through the ring or straight to the model. The **2D | 3D** switch at the bottom lays every ring flat on the ground, or folds it back into spheres.

![A System Map card for Claude Code: who may use it and what it may use, each grant with its R W X and whether it is enforced, written only or planned](docs/images/astras-pet-os-system-map-grants-20261018.png)

Click anything for its card: who may read, write or run it, and whether each rule is **enforced**, **written only** or **planned** ([PROTECTION-RINGS.md](PROTECTION-RINGS.md)).

![The Farmer's Desk program page: the Needs you list from the Friendly Farmer's round, and the mood key](docs/images/astras-pet-os-farmers-desk-20261017.png)

The Farmer's Desk ([program page](https://findastra.github.io/astras-pet-os/apps/astras-pet-os-20261008.html)): what needs Astra after the Friendly Farmer's round, and the mood key.

Screenshots taken 2026-10-17 with GitHub Goldfish's [project-image-generator](https://github.com/findastra/github-goldfish#project-image-generator); added with Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-17.

## Who lives here

<!-- pets:start (generated from pets.json by scripts/update-readme.mjs; do not edit by hand) -->
| Pet | Role | Status | What it does | Get it |
|---|---|---|---|---|
| **[Friendly Farmer](https://github.com/findastra/astras-pet-os)** | host | growing | Organizes the pets (intelligent apps). His daily rounds keep every pet’s status and mood, the roster, the System Map and the profile README up to date, and list what needs Astra. The Farmer’s desk opens every app. He will run the Farm, the native OS of Astra’s PetOS. | [Pet Program](apps/pet-programs/astras-pet-os-20261018.html) · [Installer](https://github.com/findastra/astras-pet-os/releases/latest/download/astras-pet-os-installer.zip) |
| **GitHub Goldfish** | pet | growing | Swims through every public word on a GitHub account and flags document-control, blatant, organizational and systemic errors. | [Pet Program](apps/pet-programs/github-goldfish-20261018.html) · private repo |
| **Data Chip** | pet | hatching | Reports the health of Data Dealer, Astra’s large and important data project: its site, data, services and open work, so she sees at a glance what needs her. | [Pet Program](apps/pet-programs/data-dealer-20261018.html) · private repo |
| **API Fairy** | pet | growing | Keeps notes about your API keys, never the keys themselves: where each lives and what uses it, which keys have gone stale, and which new keys to get. Lives in the corner of the Windows desktop. | [Pet Program](apps/pet-programs/api-fairy-20261018.html) · private repo |
| **Unity Unicorn** | pet | hatching | A local Unity and VRChat desk with avatar plans, 26 dated tools, open-arch audits, concise summaries and evidenced execution history. | [Pet Program](apps/pet-programs/unity-unicorn-20261018.html) · private repo |
| **Python Panther** | pet | hatching | A Python practice desk with short output exercises, answer checks and saved progress alongside the original lessons. | [Pet Program](apps/pet-programs/learn-python-20261018.html) · private repo |
| **Astra Wisp** | pet | hatching | Watches the health of AI Astra, both while she runs and while she is being worked on offline, so problems show up before a session. | [Pet Program](apps/pet-programs/the-astral-plane-20261018.html) · private repo |
| **Health Hummy** | pet | hatching | Personal health tracker: weight lifting by body group and sets, cardio, and pole plans. Your data stays on your PC and is never committed. | [Pet Program](apps/pet-programs/health-hummy-20261018.html) · private repo |
| **Finance Finch** | pet | hatching | Personal finance tracker across your bank, savings and investment accounts. It reads balances and never moves money. A yellow canary. Your data stays on your PC and is never committed. | [Pet Program](apps/pet-programs/finance-finch-20261018.html) · private repo |
| **Mommy's Mommies** | pet | hatching | A local planning room for Mommy's classes and events, with session details, readiness and notes. Calendar and Discord connections are planned. | [Pet Program](apps/pet-programs/mommys-mommies-20261018.html) · private repo |
| **Paper Patty** | pet | growing | Runs Paper Girl, a free science discovery desk: real research, publisher explanations and fresh articles. | [Pet Program](apps/pet-programs/paper-girl-20261018.html) · private repo |
| **File Master** | pet | growing | Organizes your files and finds systemic errors. Shows every mass change before making it, with undo. Opens or edits programs only after Test Tortoise tests the change and Gatekeeper Goddess and Astra approve it (planned). | [Pet Program](apps/pet-programs/file-master-20261018.html) · private repo |
| **Discord Damsel** | pet | hatching | Puts Astra's live AI work on her Discord profile: the OpenAI and Anthropic Discord Presence tools show the model in use and every active project, taking turns every 6 seconds. | [Pet Program](apps/pet-programs/discord-tower-20261018.html) · private repo |
| **Portfolio Puffer** | pet | hatching | Drafts and tracks portfolio updates locally. GitHub and LinkedIn connections are planned; publishing is manual. | [Pet Program](apps/pet-programs/portfolio-puffer-20261018.html) · private repo |
| **Drum Dog** | pet | hatching | Saves and samples music found online for Ableton Live, and plans releases: the first album, DJ mixes and where each one is hosted. Ableton Live connections are planned. | [Pet Program](apps/pet-programs/drum-dog-20261018.html) · private repo |
| **VSCode Angel** | pet | hatching | Records code-review findings and next steps, then exports a Markdown worklist. Editor connections are planned. | [Pet Program](apps/pet-programs/vscode-angel-20261018.html) · private repo |
| **Gone Ghost** | pet | hatching | Watches the public Ghost Protocol website and checks Astra’s own security against its research: a personal cybersecurity checklist and the steps she has completed. | [Pet Program](apps/pet-programs/ghost-protocol-20261018.html) · private repo |
| **Project Parrot** | pet | hatching | Planned: periodically reviews OneNote for new project ideas and reminds Astra to start them. | [Pet Program](apps/pet-programs/project-parrot-20261018.html) · private repo |
| **Voicemeeter Bug** | pet | growing | Requests a supported Voicemeeter audio-engine restart on a manual click or an observed reconnect of a selected hardware output, and keeps Voicemeeter open. | [Pet Program](apps/pet-programs/voicemeeter-bug-20261018.html) · private repo |
| **Platform Platypus** | pet | hatching | Keeps Astra's pages working on iPhone, Android, iPad and desktop: shows a page on every device at once, checks it, tracks what each watched site still needs, and compares screenshots from two platforms. | [Pet Program](apps/pet-programs/platform-platypus-20261018.html) · private repo |
| **Log Lynx** | pet | hatching | Observability: correlates logs, traces, health and failures. | [Pet Program](apps/pet-programs/log-den-20261018.html) · private repo |
| **Packet Piranha** | pet | hatching | Network: packet loss, DNS, latency, routing. | [Pet Program](apps/pet-programs/packet-river-20261018.html) · private repo |
| **Forensic Ferret** | pet | hatching | Incident timelines and log analysis. | [Pet Program](apps/pet-programs/evidence-locker-20261018.html) · private repo |
<!-- pets:end -->

The generated count and running list, with every mood of every character, are in [ROSTER.md](ROSTER.md). Gone Ghost's website, [Ghost Protocol](https://findastra.github.io/ghost-protocol/), is already live; Astra approved the ghost artwork on 2026-10-08.

## How the pets connect

**[Astra's PetOS System Map](https://findastra.github.io/astras-pet-os/system-map-20261012.html)** is a 3D map of Astra's PetOS: every pet, seed and roadmap pet, the AI models, the infrastructure, the real programs they manage, and what flows between them, each on the ring sphere where it lives. Open it in a browser (it loads three.js from a CDN, so it needs the internet). Search for any node; click a shape for its job, its grants (who may read, write or run it, and whether that is enforced, written only or planned) and its connections; click a ring in the key for everything on it; click a line for everything that flows both ways between its two ends. Pet-to-pet links come from `relations` in [pets.json](pets.json); pet program names come from [pet-programs.json](pet-programs.json); rings, grants and everything else come from [system-map.json](system-map.json). `npm run build` rebuilds the page. The same links as a flat chart are in [RELATIONS.md](RELATIONS.md).

## Run it

**See the pets on your desktop:** install them with the [installer](INSTALL.md). On Astra's PC the desktop pets and the tray Star run from `bin/` in this repo; Startup Star (its own project on Astra's PC, not on GitHub yet) makes them open with a click and start at sign-in. Double-click a pet to open its app.

**See everything at once:** open the [System Map](system-map-20261012.html) in a browser (it loads three.js from a CDN, so it needs the internet).

**Get the source (developers only; to install, use the [installer](INSTALL.md)):** the [astras-pet-os repository](https://github.com/findastra/astras-pet-os) is public. It was renamed on 2026-10-12; old links redirect.

```powershell
git clone https://github.com/findastra/astras-pet-os
```

**Releases:** from v0.3.0-beta on, every release carries the installer zip (`astras-pet-os-installer.zip`, made by `node scripts/installer-zip-20261018.mjs <tag>`). The [repository release ledger](docs/repository-releases-20261008.json) records the older source tags of the pet repos.

**Open a pet program:** double-click a pet or use its **Pet Program** link: one click always points to the pet program
page (Astra, 2026-10-19). Its Pet ID (L4) links the app the pet had before: Gone Ghost, Paper Patty
and Platform Platypus open their hosted sites, and the other registered pets their dated web app in `apps/` (the original
app where it is portable, and a web stand-in where the original is a Windows app or still planned). Local form data stays
in that browser.

**Every pet program's page:** the Friendly Farmer's [pet program spawner](apps/pet-programs/pet-program-spawner-20261018.html)
gives each of the 38 registered and pipeline pets a page with every tool panel of Astra's sketch
([PET-PROGRAM-FRAMEWORK.md](PET-PROGRAM-FRAMEWORK.md), section 3): the basics first, rebuilt by `npm run build`.

**The Cage is gone** (Astra, 2026-10-18): `cage.html`, the old browser page where the pets roamed, its data file and the old desktop Farmer (the Farmer dock) were removed. Pets live on the Windows desktop; the Farm will be their web home (Phase 3 of the [migration plan](docs/migration/PLAN.md)).

**For builders** (Node 20 or newer; none of this is needed to just look):

```bash
npm run build    # convert existing sheets, rebuild the frames, ROSTER.md, the table above and the System Map
npm run build -- --metadata-only  # refresh registry and docs using already-built frames
node scripts/build-interfaces-20261008.mjs  # refresh the Farmer's desk; preserve published app copies
npm run check    # validate pets.json, the table, and that every pet has art
npm test         # tests
npm run click-check  # click every button and link on the pet program pages in a headless Edge or Chrome; report what is broken
```

To deliberately rebuild another app, name it with `node scripts/build-interfaces-20261008.mjs --refresh-existing file-master` (replace the repo name as needed). Review the change and publish it under a new immutable source tag before updating the release ledger.

## Add a pet

Read [PET-FILES.md](PET-FILES.md). Add an entry to `pets.json` and a prompt to `scripts/generate-pets.mjs`, supply its 3×3 mood sheet, then run `npm run build`. The count, table, roster and page update together. Set `asset_date` for new pets so the sheet and mood filenames carry the owner's date. Building existing sheets is local and does not generate paid images. The local GitHub Goldfish project is intended to audit whether pet repos have their files and registry entries.

## Limits

What is not done, plainly:

- **The Farm and the Kennel are planned, not built.** So are the shared AI harness and most pets' runtimes: see [INTELLIGENCE-LEVELS.md](INTELLIGENCE-LEVELS.md) for exactly what each pet has.
- **Art approval is recorded per character in the roster.** The ghost is approved; other drawings remain drafts unless noted. Data Chip uses the actual Data Dealer drawing code and original palette inside the original yellow pocket shell.
- Unity Unicorn, Health Hummy, Finance Finch and the other browser desks support local records and exports. They do not connect to Unity, health services, bank accounts or other external services yet.
- Pets' moods come from the Farmer's daily rounds, not yet from live status in their apps.
- Gone Ghost offers a checklist. He does not scan the PC, monitor threats, or read checklist progress yet.
- Project Parrot stores manually entered ideas and due dates. OneNote scanning and background reminders are not connected.
- BSOD, ChatGPT's own desktop pet, is never copied into this repo.

## Credits

Made by Astra. Astra's PetOS restructuring, the System Map and the intelligence levels with Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-12. Built with Claude Sonnet 5.5 (`claude-sonnet-5-5`) on 2026-10-07. Ghost Protocol and dated asset support added with OpenAI Codex (GPT-6) on 2026-10-08. MIT licensed.
