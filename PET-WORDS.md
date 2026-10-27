# Pet words: one name for each part of a Pet and its Pet Program

*Part of Astra's PetOS ([README](README.md)). The Friendly Farmer keeps this list. The GitHub Goldfish flags the old names across the account, and the File Master uses the file names at the bottom when it organizes pet projects.*

**Astra's words (2026-10-26).** The whole system is **Astra's PetOS**. Its characters are **Pets (Agents)**, and each
Pet lives in its **Pet Program (Agent's Living Space)**: Rift Rabbit is the Pet, and Wonderland Launchpad is its Pet
Program. A Pet and its Pet Program are one repo. Astra retired the old word for that pair on 2026-10-26 ("not supposed
to ever be" that word, "been trying to get rid of that"), so it is in the **Not** column below and the GitHub Goldfish
flags it; `test/no-retired-pet-word-20261026.mjs` fails if it comes back anywhere in this repo. Where a word is defined,
write the full forms **Pet (Agent)** and **Pet Program (Agent's Living Space)**; in running text, just Pet and Pet
Program.

Every Pet and its Pet Program are a set of parts. Each part has **one** name, used everywhere: READMEs, `pet.json`, card titles, code comments, and when talking to Astra. The machine-readable copy is `words` in [pets.json](pets.json); a test keeps the two in step.

**Programmer words (Astra, 2026-10-19).** Every table also says what a programmer calls the same thing. The farm words are the way in for beginners; the programmer words let a developer read the system without a guide, and let a beginner learn the standard words over time. Same things, two vocabularies. Why each programmer word was chosen, and the words Astra changed because they meant something else to developers, are in the glossary of [skills/dev-mindset](skills/dev-mindset/SKILL.md). The programmer column and the sections from "The pet program page" to "Process words" were added by Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-19, from every Markdown file and registry in this repo.

**Developer mode (Astra, 2026-10-19).** The installer's Developer mode switch (or `?words=developer` on any page) shows
the pages in programming words instead of farm words, so programmers who install Astra's PetOS are not put off: every
pet is an **agent**, every pet program a **control hub**, The Farm the **Agent Control Hub**, and no desktop pets
run. That swap uses one short word for each farm word, the ones in
[developer-words-20261019.json](developer-words-20261019.json), with a draft developer name for every pet program (Unity
Unicorn is the Unity Agent, Unity Stable the Unity Agent Control Hub); [INSTALL.md](INSTALL.md#developer-mode) says what
else changes. This page stays the place where each word is chosen: change a word here, then in that file.

## The parts you see

| Part | Call it | Programmer word | Not | What it is |
|---|---|---|---|---|
| The whole set | **a Pet and its Pet Program** | project: one repo holding an agent and its control hub | pet app, pet apps | One repo: one Pet and the Pet Program it lives in. "Rift Rabbit is a Pet; Wonderland Launchpad is its Pet Program." When you mean only the character, say Pet; only its home, Pet Program. |
| The character | **Pet (Agent)** | agent (its pictures are the mascot) | pixel twin | The creature itself, by name: "the Goldfish", "Data Chip", "Rift Rabbit". It lives on the Windows desktop and in its Pet Program's pet well. Short form: Pet. |
| Its home | **Pet Program (Agent's Living Space)** | control hub: the program the agent runs and its dashboard | | The one main program a Pet stands for and lives in, named in `pet-programs.json`: Wonderland Launchpad, The Farm, Unity Stable. Its page is the pet program page. Short form: Pet Program. |
| The full window | **app** | application (its user interface) | pet app's app, application interface, pet interface, local interface, browser companion | What opens when you double-click the pet. Either a **web app** (an HTML page) or a **Windows app** (a program). The Farmer's app is called his **desk**. |
| The pet on your desktop | **desktop pet** | desktop overlay: an always-on-top animated sprite window | pet app icon, desktop companion | The small pet that sits on the Windows desktop above other windows. Optional: the Farmer and Claude Bot have one. |
| The pet talking | **bubble** | toast notification (one way) | speech bubble, chat bubble | A short line that pops up over the pet for a few seconds. One way: the pet talks to you. The lines live in `says` in pets.json. |
| You talking to the pet | **quick chat** | chat input box (two way) | pet app icon chat | A small box that opens from the desktop pet so you can type to it. Two way. |
| The program's picture | **app icon** | app icon | | The small still picture on the taskbar, a shortcut or a browser tab. It is drawn from the pet but it is not the pet, and it does not move. |
| The pet's square in its app | **pet well** | avatar container (an image slot in the layout) | pet frame | Where the pet sits inside its app. |
| The pet as one file | **Markdown pet** | agent definition file: a portable system prompt in Markdown | | What the pet does, where it opens in a browser and the rules an AI follows to act as it. For computers that cannot install, such as a locked-down work computer: give it to an AI the computer allows. Generated into `markdown-pets/` (Astra, 2026-10-19). |
| The pet as one download | **pet pack** | release bundle: one app as a self-contained archive with its assets and a manifest | | One pet in one zip, without the whole system: its repo at one version, its pictures (copied in, never committed), its pet program page that works on its own, its Markdown pet, and a README on what works alone and what needs a farm. Made by the Friendly Farmer's pet-packs tool (Astra, 2026-10-20). |

So: the pet floating on the desktop is the **desktop pet** (an *icon* is the still taskbar picture), its pop-up lines are **bubbles**, the box you type into is **quick chat**, and the window it opens is just its **app**.

## The pet's art

| Part | Call it | Programmer word | What it is |
|---|---|---|---|
| The faces | **moods** | status states (a status indicator) | Nine: `idle`, `blink`, `happy`, `curious`, `worried`, `sad`, `sick`, `alarmed`, `sleep`. Meanings are in [PET-FILES.md](PET-FILES.md). |
| One picture | **mood frame** | sprite frame | One 256×256 transparent image of the pet in one mood. |
| The generated image | **mood sheet** | sprite sheet (a 3×3 atlas) | One 3×3 image holding all nine moods, sliced into mood frames. |
| The marks | **mood stickers** | status badges (overlay icons) | `?`, `!`, `Z`, the tear, the sweat drop and the bandage, composited from one set. |
| Frames plus their list | **sprite** | sprite with its JSON manifest | The pet's nine mood frames and the JSON file that lists them. |

## Who lives in the Cage

| Call it | Programmer word | Meaning |
|---|---|---|
| **host** | host: the coordinator app (`role: "host"`) | The Friendly Farmer. Exactly one. |
| **companion** | secondary character (a second sprite in the same app) | A second character drawn with a Pet (registry `companions`). Only this meaning: what used to be called a desktop companion is a desktop pet, and a browser companion is a web app. |
| **mascot** | mascot with no app | A character with no app of its own (registry `mascots`). |
| **guest** | third-party character (someone else's, never copied) | A visitor from outside the Cage, such as BSOD. |

## The Cage

*Simpler since 2026-10-14 (Astra): the Friendly Farmer is the pet program icon and The Farm is his pet program. The
Cage is a retired name for the old pets page, and "the Farmer's desk" is now The Farm's page. AI models are called
farmhands; they are not pets.*

| Call it | Programmer word | Meaning |
|---|---|---|
| **the Cage** | removed web page (deprecated, then deleted) | Gone: the old browser page where the pets lived (`cage.html`), removed 2026-10-18 (Astra). The word survives only in data keys (`cage`, `cage.submit`, `cage_life`). |
| **the Farmer's desk** | main dashboard: a launcher plus a to-do list | The Farmer's app: every app plus a follow-up list. |
| **registry** | registry (the app catalog, a JSON manifest) | `pets.json`. |
| **roster** | generated catalog page | `ROSTER.md`. |
| **job** | one-line description (purpose statement) | The one sentence that says what a Pet does. |
| **status** | maturity: prototype, beta, stable | `hatching`, `growing` or `grown`. |
| **card** | ticket: a task file kept in the repo | A task in a `handoffs/` folder, for whichever assistant picks it up. |

## The pet program page

Every pet program page is built to [PET-PROGRAM-FRAMEWORK.md](PET-PROGRAM-FRAMEWORK.md), section 3. Labels use the
pet's name: `<pet>` is `unity-unicorn`, `<home>` is `unity-stable`.

| Call it | Programmer word | What it is |
|---|---|---|
| **pet program page** | dashboard page (the app's control panel) | One page per pet program, made of tool panels. The spawner writes the basic one. It is a control panel: anything too big for a tool panel becomes its own website that the pet program manages and opens from one tool panel (Astra, 2026-10-19). |
| **tool panel** | panel: a collapsible section (HTML `details`); developers read "tool panel" as a panel that holds tools | A bordered group with its label set into the top border. Called a **module**, then a **panel**, until 2026-10-19 (Astra, 2026-10-19: "I do want all of it to say tool panel instead of just panel"). |
| **`<pet>-cyberhome`** | avatar panel (status widget) | Top left: where the pet sits while the page is open, with its paired lights. |
| **`<home>-quick-summary`** | summary panel (description) | One to three sentences on what the pet program is and does ("pet-program" left the label on 2026-10-21). |
| **`<pet>-L1-tool-panel`** | tools panel: dependencies and owned code | **3rd party programs** (external dependencies), **native programs** (applications the pet manages) and **native tools** (its own scripts and utilities), including tools not merged yet. |
| **`<pet>-L2-tool-panel`** | runtime panel: skills, schedule, status, integrations | The pet's tricks, its schedule, the status line and its connection boxes. |
| **`<pet>-L3-tool-panel`** | agent panel: the active AI session | The seat, the L3 activity bubble, tricks running now, harness skills, suggestions and token use. |
| **`<pet>-L4-tool-panel`** | admin panel: approvals (human in the loop) | Approvals waiting on you, agent keys, items needing maintenance and the Pet ID. Its grants have their own panel. |
| **`<pet>-rwx-panel`** | permissions panel: designed access vs enforced access (access review) | What each level should be (R W X), then whether that is in code: ✓ In code, ⚠︎ Rule only, ○ Not built, each In code with its proof (Astra, 2026-10-19, option C). |
| **tool box** | card with a title (HTML `fieldset` with a `legend`) | How one tool shows on a page, with its versioned label on the top border. |
| **trick box** | skill card | How one trick shows: where it came from, which programs, tools and tricks it uses, ON/OFF. |
| **connection box** | integration card: what flows between two services | A box titled with the other pet's name: what each side sends and receives, with its own ON/OFF. |
| **paired lights** | two toggle buttons per item | ON/OFF on the left, maintenance on the right. |
| **ON/OFF light** | kill switch (a feature flag) | Green on, red off. Turning it back on after a security OFF needs L4. |
| **maintenance light** | user-reported defect flag | Blue working correctly, yellow requires maintenance. Only you clear it. |
| **activity glow** | activity indicator | A level tool panel glows while that level is working; L4 glows while you are on the page. |
| **status line** | status bar | Whose data, last entry, last update, who is in the seat, and the map link. |
| **`<pet>-session-notes`** | feedback form | A text box with **submit** and **add file**; every note goes to the backlog first. |
| **backlog** | backlog (an issue queue) | The never-lost list of notes and change requests, `<pet-program>-backlog`. |
| **backlog health** | backlog metrics | Healthy, needs attention or unhealthy, with what is stale or duplicated. |
| **`<pet>-emotions`** | status legend | The nine moods and when each one shows. |
| **`<pet>-clicker-training`** | click bindings (gesture to action) | What one, two and three or more clicks on the desktop pet do. |
| **`<pet>-related-pets`** | related services ("see also") | Every pet it talks to, linked to that pet's page. |
| **unified footer** | shared footer component | `astras-pet-os-unified-footer`: one footer every page uses. |
| **`<pet>-chat`** | chat widget (chatbot launcher) | The button bottom right that opens the pet's chat bot. |
| **Pet ID** | provenance record | **Microchip** = signature, **pedigree** = lineage (repo and forks), **stamps** = install and update history, **vaccination card** = security patch history, **vet records** = vet-clinic tickets ([PROVENANCE.md](PROVENANCE.md)). Never "pet passport": passport is Passport Pelican's word (Astra, 2026-10-21). |

## System words

| Call it | Programmer word | What it is |
|---|---|---|
| **Astra's PetOS** | platform (it runs on Windows; it is not an operating system) | The whole system. "PetOS" is a brand name. In code: `ASTRAS_PET_OS`. |
| **a farm** | one user's install (a tenant) | Everything one person runs. Farms never connect to each other. |
| **farmer** | user (the farm's owner and admin) | The person who runs a farm. On Astra's farm, Astra. |
| **The Farm** | core platform and control plane | The Friendly Farmer's pet program (#1). Its native programs include the System Map and Startup Star. |
| **Friendly Farmer** | orchestrator and package manager | The pet that organizes the pets, hatches new ones and keeps the farm lock. |
| **the pets** | the apps (modular apps, each with an optional AI agent) | Every intelligent app together. Never "the herd". |
| **intelligent app** | app with an optional AI agent | What a pet is. "An Intelligent App, or Pet." |
| **Pet Program (Agent's Living Space)** | control hub: the one main program a Pet stands for | An app, site, world, service or script the Pet lives in, like The Farm, Unity Stable or Wonderland Launchpad. Defined with the parts at the top. |
| **pet program icon** | mascot (the character); the icon files are its pictures | The pet's character, like the Friendly Farmer. |
| **home** | product name of the pet program | The name in `pet-programs.json`, like **Unity Stable**. |
| **L1 Programs** | application layer: dependencies plus owned code | The third-party programs it runs, and the programs and tools it makes. |
| **L2 Pet program** | runtime: a background service (scheduler, inbox, saved state) | What the pet does by itself, and its dashboard. |
| **L3 Agentic harness** | agent layer: the pet program's own agent harness | The pet's own harness: a seat any farmhand can fill, straight through its API or inside a provider harness, doing the pet's work with its tools and tricks (Astra, 2026-10-19). Not built yet: today a pet borrows Claude Code or Codex. |
| **L4 Verified human** | human in the loop: the owner who approves (admin) | Approves every security change, permission and exception. |
| **farmhand** | AI model (LLM) | Claude, OpenAI or a local model. Not a pet. |
| **the seat** | active agent session | Which AI is working in a pet's harness now, and on what. Any farmhand can sit there. "Seat: empty" when none. |
| **agentic harness** | agent harness | Two kinds, so say which: the **pet harness** (L3, each pet program's own) or a **provider harness** (made by others). [AGENTS.md](AGENTS.md), "How the agents work". |
| **provider harness** | agent harness (agent runtime) made by others | Claude Code, Codex, OpenClaw: a program that wraps a farmhand in tools, memory, skills and permissions. Drawn as a ring around its farmhand. |
| **native** | first-party (Astra made it), as opposed to third-party | Everything a pet program owns is a native program, a native tool or a native trick ([TOOLS-AND-TRICKS.md](TOOLS-AND-TRICKS.md)). |
| **native program** | first-party application | Opened or run on its own (Startup Star, the System Map, Ghost Protocol). The only kind the System Map draws. |
| **tool** (native tool) | first-party module or script (deterministic code) | Code the pet program runs with no AI, for one job. ON/OFF, maintenance light, version. Listed on its card, never drawn. |
| **trick** (native trick) | first-party agent skill (`SKILL.md`), prompt or workflow | A way of using the pet's 3rd party programs, native programs, native tools and native tricks (Astra, 2026-10-21): written steps the pet's AI follows. Kept by Skill Scout. Listed on its card, never drawn. |
| **which kind** | classification rule | Who does the work decides it (Astra, 2026-10-24): a person opens it, a native program; code runs it with no AI deciding, a native tool; an AI reads written steps and makes choices, a native trick. A script with written steps is both, a tool (L1) and a trick (L2). |
| **harness skill** | development skill installed in Claude Code or Codex | Belongs to the provider harness in the seat, not the pet; helps an AI work on the pet. |
| **bot** | Discord bot application | Not a harness: a native program of Fairy Ring, which runs every Discord bot. Its commands are tools; its answers come from the farmhand in Fairy Ring's seat. |
| **bot panel** | admin panel for one bot | On Fairy Ring's page: one bot's commands, servers, permissions and health (`mommys-help-bot-panel`). |
| **your programs** | managed applications (the L1 tool panel's name for native programs) | Programs Astra made that a pet looks after (worlds, websites). Not its tools. |
| **3rd party programs** | third-party software (external dependencies) | Programs, libraries and services made by others. |
| **shared tool** | shared library or service with one owner | One copy, owned by one pet; other pets use it by grant. |
| **seed** | planned (an approved idea, no repo yet) | A pet with an approved name and no repo yet. |
| **pipeline** | in development (on GitHub, not released) | A pet with a repo but no registered art yet. |
| **registered** | released (in the registry) | A pet in `pets` in pets.json, with its art. |
| **roadmap pet** | roadmap item (not started) | Approved for later in the architecture. |
| **the gate** | approval queue (an allowlist) | Where a new repo waits in `candidates` until Astra lets it in. Nobody becomes an animal by saying so. |
| **core pets** | required base packages (cannot be deselected) | The pets every farm needs. Today: the Friendly Farmer. |
| **farm lock** (`farm-lock-20261021.json`) | lockfile | Exactly which pets and versions a farm runs, and where each came from. It stays on the computer, in the farm's own folder (Astra, 2026-10-21). |
| **needs** | dependencies (a package manifest's dependency list) | What a pet needs to work, in its own `pets.json` entry: the computer it runs on, other pets (required or optional), parts of the core only a farm has, and third-party programs (Astra, 2026-10-20: one place). |
| **hatching a pet** | scaffolding a new app | Making a new pet from the template. Also the first `status`. |
| **daily round** | scheduled job (cron) that opens a pull request | The Farmer's morning check of every pet: status, moods, roster. |
| **profile round** | scheduled job that regenerates the profile README | Rewrites the pet list on Astra's GitHub profile from `pet-programs.json`. |
| **self-audit** | scheduled check (a lint run) | The Farmer's round checks each pet's own files on that pet's day of the week. |
| **submission** (`cage.submit`) | change request picked up by the next round | A pet asks the Farmer to update its job, lines or audit in pets.json. |
| **mood key** | status legend | What each mood means for each pet ([MOOD-KEY.md](MOOD-KEY.md)). |
| **sick** | failing health check (degraded) | A broken pet program, or too many broken tools. |
| **not on this PC** | feature detection (graceful degradation) | A program a pet looks after is not installed: no error, the pet sleeps. |
| **System Map** (3D PFD) | architecture diagram and dependency graph (interactive) | Every pet, program, model and device on its ring, with the grants on every card. Tools and tricks are listed on their pet program's card, not drawn. |
| **Pets Board** | status dashboard (a review queue) | GitHub Aquarium's page of everything that waits on you on GitHub, in the order to act, then every pet in one chart. Rebuilt when outstanding-items runs; it shows the real list only on your PC. |
| **outstanding items** | review queue (pull-request triage) | What waits on you on GitHub: pull requests ready for your OK, jobs failing on a main branch, cards that wait on you, and what each chat has to fix first. GitHub Aquarium's outstanding-items tool lists them (Astra, 2026-10-21). |
| **Startup Star** | launcher and process supervisor (a system tray app) | A native program of The Farm that starts the desktop pets. Not a pet: it has no face. |
| **pet program spawner** | scaffolding and page generator | The Farmer's native tool that writes every basic pet program page. |
| **click-check** | link checker and UI smoke test (an automated click-through test) | The Farmer’s native tool that clicks every button and link on the pet program pages and says which go nowhere, go to a dead end or the wrong place (`npm run click-check`). |
| **seed-suggester** | recommendation tool | Suggests pets for the programs installed on a PC, read only. |
| **How to Take Care of Your Farm!** | onboarding tutorial (a getting-started guide) | The guide for beginners, `apps/beginner-guide-20261019.html`: a public page of The Farm on installing Astra's PetOS and making your own farm. The first-run walk on the System Map opens it (Astra, 2026-10-19). |

## Security words

| Call it | Programmer word | What it is |
|---|---|---|
| **animal** | allowlisted component inside the trust boundary | Everything inside the harness is an animal. Agents can only control animals. |
| **protection rings** | trust zones (from CPU protection rings) | Where a thing lives, ring 0 the most protected. A ring grants nothing. |
| **the glass harness** | trust boundary | The line where the rules change. It is drawn, not a sandbox. |
| **grant** | scoped permission (a capability) | Who may read, write or run which things, with limits ([PROTECTION-RINGS.md](PROTECTION-RINGS.md)). |
| **R W X** | rwx permissions (read, write, execute) | On grants, never on rings. |
| **enforced / written only / planned** | technical control / policy / roadmap | Whether a program stops a break, or only a rule asks everyone not to. |
| **walls** | security controls | What actually enforces security ([security model](docs/security-model-20261018.md)). |
| **the security team** | security functions (the NIST CSF's govern, identify, protect, detect, respond and recover, plus test) | The pets with a security job, each under one function. |
| **Iron Gates** (Gatekeeper Goddess) | identity and access management (a policy engine) | Issues grants and agent keys; never approves her own. |
| **key** (agent key) | short-lived session token with an audit trail | One per agent session: which agent, model, person, device, place and pets. |
| **the mushroom circle** and **the chest** | active and expired token lists (a credential inventory) | API Fairy shows who holds which key, never the key itself. |
| **The Police Station** (Pet Police Officer) | security monitoring (intrusion detection) | Watches every write and key use; switches things OFF, never ON. |
| **the alarm** | security incident alert | On every page, the map and a phone alert. A past breach is "found, not active". |
| **shutdown** | incident containment | Keys revoked and agents stopped on purpose. Not a crash. |
| **The Recovery Room** (Rescue Retriever) | incident recovery (ordered restart) | Rebuilds the farm from a verified release and clean backups. |
| **maker agent / checker agent** | maker-checker rule (four-eyes review) | One agent proposes, a separate read-only agent verifies, L4 approves. |
| **quarantine** | sandbox (staging before trust) | Where code from strangers waits, read only, until it is checked. |
| **the sick cow** | untrusted dependency (supply-chain risk) | A pet, tool or cure from another farm. Never runs without a signature and L4. |
| **ear tag** | signature (signed commits and releases) | Removing it is detected, not prevented. |
| **Pet Collar** | release trust check (provenance) | Flash Audit A32: signature, install history and recovery evidence. |
| **short leash** | least privilege for a new model (graduated trust) | A local farmhand earns more grants as it passes Astra's tests. |
| **one farm per person** | tenant isolation | Each user's data and pets are walled off from everyone else's. |

## Community words

| Call it | Programmer word | What it is |
|---|---|---|
| **the Kennel** | community app catalog (a package registry) | Where other people's pets are submitted, checked and adopted ([the-kennel](https://github.com/findastra/the-kennel)). |
| **the Shed** | plugin and extension registry | The same for third-party tools and tricks ([the-shed](https://github.com/findastra/the-shed)). |
| **vet-clinic** | public issue tracker (GitHub Issues) | Where a farmer whose pet is sick asks the community ([vet-clinic](https://github.com/findastra/vet-clinic)). |
| **ticket** | issue | One problem at the vet-clinic, `vet-clinic-ticket-<NNNN>`. |
| **cure** | patch (a pull request) | A fix another farmer offers for a ticket. Never runs by itself. |
| **adopt** | install, after review | Bringing a pet from the Kennel onto your farm. |
| **official / Kennel-verified / community** | signed / reviewed / unverified | The trust tiers. Community answers always carry a warning. |
| **commons** | shared registries | The Kennel, the Shed and the vet-clinic together: other people's submissions, not our code. |
| **flexing** | one-way publishing (GitHub Pages) | Showing your farm online: never private pets, never personal data. |

## Process words

| Call it | Programmer word | What it is |
|---|---|---|
| **Flash Audit** | audit checklist (numbered checks, A01 and up) | The review every pet program passes ([docs/flash-audit-20261014.md](docs/flash-audit-20261014.md)). |
| **Idle Flash Audit** | unattended audit run (overnight) | The audit an agent runs alone, fixing only what needs no decision from Astra. |
| **Active Flash Session** | interactive review with the owner | The checks that wait for Astra to decide. |
| **grey dot / blue dot** | auto-fixable / needs the owner's decision (triage labels) | ⚪ fixed by the Idle Flash Audit; 🔵 waits for Astra. |
| **round cards** | audit reports, one per pet | What a Flash Audit found, with evidence. |
| **answer sheet** | decision form | The blue-dot questions for Astra, in one place. |
| **weekly backlog run** | scheduled batch job (weekly triage) | The L3 agent bundles new session notes into one task. |
| **head chat** | lead agent session (the coordinator) | The chat that keeps the other chats and repos in line. |
| **merge order** | merge queue (ordered) | Which pull requests Astra merges first, worked out fresh each time. |

## File names (for the File Master)

New files use these names. `<date>` is Astra's America/Denver date as `YYYYMMDD`. **Existing files keep their names**: links, scripts and tags depend on them, so never rename a tracked file only to match this list.

| Part | File |
|---|---|
| pet metadata | `pet.json` |
| web app | `<repo>-<date>.html` (in this hub: `apps/<repo>-<date>.html`) |
| sprite | `sprite-<date>.json`, art in `art/`. Repos where the pet joined an older project may use `pet-sprite-<date>.json` and `pet-art/`. Keep one pattern per repo. |
| desktop pet | `desktop-pet-<date>.<ext>`, started by `start-desktop-pet-<date>.cmd` |
| app icon | `icon-<date>.png`, plus `icon-<date>.ico` for Windows |
| mood sheet (hub) | `art/sheets/<art>-<date>.png` |
| mood frame (hub) | `art/frames/<art>/<mood>-<date>.png` |
| card | `handoffs/NNN-<for>-<short-name>.md` |

## Keys that keep their old names

Some keys are older than these words and stay as they are, because code reads them: `interface_url`, `interface_local_url` and `interface_live_url` in pets.json (the app's addresses), and `entry` and `sprite` in pet.json. Use the words above in prose and leave the keys alone.

**One click always points to the pet program page** (Astra, 2026-10-19: "one click always points to program page (Pet
Program)"). So `interface_url` and `interface_local_url` hold the pet's program page, `apps/pet-programs/<repo>-20261018.html`,
which the README, the profile, the Farmer's desk, the Pets Board and the desktop pet all open. **`app_url`** holds today's
app (the older page or site), linked from the program page's Pet ID (L4) and footer (the button left on 2026-10-21). `interface_live_url` stays the
pet's own live site. A link to the program page is labelled **Pet Program**. `clicks` lists the tools bound to three clicks
or more (PET-PROGRAM-FRAMEWORK.md, section 3, item 8).

Set on 2026-10-09 at Astra's request, with Claude Opus 5.5 (`claude-opus-5-5`).
