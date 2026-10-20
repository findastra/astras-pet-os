# Tools and tricks

What a pet **has** and what a pet **knows**. Companion to [PET-PROGRAM-FRAMEWORK.md](PET-PROGRAM-FRAMEWORK.md) and
[PROTECTION-RINGS.md](PROTECTION-RINGS.md). Astra, 2026-10-14; the three kinds and the runtime and security chart below
added 2026-10-18 (Astra: "we need to anticipate how tricks and tools will be regarded by security").

## Tools, tricks and harness skills: one line each

- A **tool** is code. A computer runs it the same way every time, with no AI. It lives on **L1**.
- A **trick** is instructions. **It is owned at L2 and followed at L3**: the pet keeps it (in its repo, on its page's
  L2 panel, tracked by Skill Scout), and only an AI in the seat can carry it out. With nobody in the seat it is text
  that does nothing. That is why a pet without an agent has tools but no tricks it can use.
- A **harness skill** is instructions too, but it belongs to **the seat** (Claude Code or Codex, installed on this PC),
  not to any pet. It helps an AI work *on* a pet. It is shown on the pet's L3 panel.

When an AI has to follow it, it is a trick or a harness skill, never a tool. A trick does the pet's own job; a harness
skill helps whoever builds or repairs the pet ([ASTRAS_PET_OS.md](ASTRAS_PET_OS.md), section 8.6: runtime and
development `SKILL.md`). Today no pet has a harness of its own, so every trick is followed by Claude Code or Codex in
the seat.

## Native programs, native tools, native tricks: what the map draws (Astra, 2026-10-19)

**Native** means Astra (the farm's owner) made it; **third-party** means someone else did. Everything a pet program
owns is one of three kinds, and only programs are drawn on the [System Map](system-map-20261012.html):

| Kind | What it is | The test | On the System Map |
|---|---|---|---|
| **Native program** | A program, site, world or app that is opened or run on its own, and that a pet looks after | Would a person open or run it by itself? (Startup Star, the System Map, Ghost Protocol, Piranesi House) | **Drawn**, as a pink cube (Startup Star as its star) |
| **Native tool** | Code the pet program owns and runs with no AI, for one job: a script, an editor tool, a plugin | Does code run it, with no AI deciding? (repo-catcher, world-validator, sticker-manager) | **Not drawn**: listed on its pet program's card, in a section that folds |
| **Native trick** | Written steps the pet's seated AI follows with that pet's tools: a `SKILL.md` | Does an AI have to read it and make choices? (pet-finder, make-a-prop-look-real, dm-cleanup) | **Not drawn**: listed on its pet program's card, in a section that folds |

A line that starts or ends at a tool or trick is drawn from its pet program, marked "via" it. Third-party programs are
drawn as satellites on ring 5, as before. Every native program, tool and trick is a node in `system-map.json`
(`own-program`, `tool` or `trick`; `of` names its pet program), so the map, the pet program pages and
[the registry table](#the-registry-every-program-tool-and-trick) always agree. Applied to what existed on 2026-10-19:
Startup Star and the System Map are native programs of The Farm (each is opened on its own); vcc-package-manager and
vrchat-avatar-upload are native tricks of Unity Stable (no code, only written steps; planned until written as skill
files).

## The chart: what runs, and how security sees it

| | **Tool** (L1) | **Trick** (owned at L2, followed at L3) | **Harness skill** (the seat, L3) |
|---|---|---|---|
| What it is | Code a pet program owns: a script, page, program or section. The pet's hands. | Written steps for doing the pet's job with its tools. The pet's training. | Written steps that help an AI work on a pet (build it, test it, hand it off) |
| Developer word | Program, module, utility | **Skill** (a `SKILL.md` file), prompt, workflow (runtime skill) | **Skill**, agent instructions (development skill) |
| Owner | One pet program | One pet program (its repo) | The seat: Claude Code or Codex on this PC (`%USERPROFILE%\.claude\skills`, `%USERPROFILE%\.codex\skills`) |
| Who runs it | The computer | The AI in the pet's seat (L3) | The AI in the seat, on every pet it works on |
| Needs AI to run | No | Yes; without an agent it does nothing | Yes |
| Same result every time | Yes | No: a model reads it and decides | No |
| Permissions | Its own ring and grants (R W X), never more | **None of its own.** It uses only tools the pet already has, under the pet's grants. It never brings new code or permissions. | **None of its own.** It uses the seat's permissions, which reach every pet the seat works on |
| Main risk | Bad or changed code, a stranger's code (supply chain), a grant that is too wide | Prompt injection, steps that drift, steps that steer an agent into misusing a tool | The same as a trick, across every pet the seat touches |
| What actually holds | The grant, the ON/OFF switch in the core, tests; the sandbox (planned) | **Only the grants on the tools it uses.** The text holds nothing: skill instructions are not security boundaries (ASTRAS_PET_OS.md, section 8.6) | The harness's own permission questions (grant 4 in PROTECTION-RINGS.md) and the rules in AGENTS.md |
| How security checks it | Tests, the file's hash, a code diff, its ring and grants | Skill Scout's diff (what changed, who, why), a checker agent, and a read for asks to download, reveal secrets or break a rule; the list of tools it names | The same as a trick, plus which pets it can reach |
| On the page | A tool box: `<pet-program>-v<version>-<tool>-v<tool version>` (L1 panel) | A trick box: `<pet-program>-v<version>-<trick>-trick-v<trick version>`, with where it came from and which tools it uses (L2 panel; "running now" on the L3 panel) | Listed on the pet's L3 panel as what the seat brings |
| Turning it off | ON/OFF on its tool box; the state lives in the core, so the tool cannot turn itself back on | ON/OFF on its trick box. This holds only while the agent obeys it ([known gap 14](PROTECTION-RINGS.md#known-gaps)); to stop a trick for certain, also switch off the tools it uses | Remove it from the seat |
| Who keeps track | Its pet program | **Skill Scout** tracks every trick: what changed, who changed it and why | Skill Scout (it watches every `SKILL.md`, the seat's too) |
| From a stranger (the Shed) | Quarantine, a checker agent, L4, then it runs in the sandbox (planned) | Quarantine; read as data first; never adds a tool; L4 | The same as a trick |
| When it fails | A crash or a wrong answer you can repeat | An agent does something that sounds right but is wrong; hard to repeat | The same as a trick, on any pet |

**For security, in short: lock the tools, review the tricks.** A trick can do no more than the tools it can reach,
so its review lists every tool it names, and Skill Scout flags a trick that starts naming a new tool.

## Real examples

| Pet | Tool (what it has) | Trick (what it knows) |
|---|---|---|
| File Master | `repo-catcher`: a PowerShell script that lists repos on the PC that were never pushed | **Weekly stale-repo sweep:** run repo-catcher, read its report, pick the repos that matter, and write a handoff card asking Astra which to push or archive |
| Friendly Farmer (The Farm) | `astras-pet-os-system-map`: the 3D map page (a native program since 2026-10-19, because it is opened on its own) | **How to Take Care of Your Farm!:** the first-run tutorial, walking a new farmer around the map one ring at a time |
| Gone Ghost (Am I a Ghost?) | `name-eraser`: replaces a name with `USER` in files | **Scrub before posting:** before a vet-clinic ticket goes out, run name-eraser as a dry run, run the secret scan, show L4 the exact text, then post |
| Unity Unicorn | `harness-strapper`: a Unity editor tool that rigs avatars | **Rig a new avatar:** import it, run harness-strapper, check the bones, then record which avatar it is rigged on in the tool box |
| Unity Unicorn | `prop-decomposer`: a Blender script that takes a real model apart into its parts | **Make a prop look real** (`unity-stable-v0.3.0-make-a-prop-look-real-trick-v1.0`, 2026-10-18, in unity-unicorn's `skills/make-a-prop-look-real`): start from a real CC0 model, run prop-decomposer, restyle by mask, paint brands out of every map, mount at true size |

Tricks that already exist: `skills/handoff`, `skills/pet-finder` and `skills/pet-organizer` in this repo are The Farm's
tricks. They are instructions, and they only use tools the agents already have (git, files, the pet-finder tool).
Every trick a pet's repo holds is in the registry below.
A harness skill that exists: `vrchat-unity-world` in Claude Code on Astra's PC, which helps any AI work on Astra's
VRChat worlds; no pet owns it.

## Shared tools and grants

One tool can be used by several pets. There is only **one copy**, owned by one pet program; other pets get a **grant**.

- A grant says exactly which **folders**, which of **R W X**, and what **limits** (how many results, how often).
- Gatekeeper Goddess (Iron Gates) issues grants; L4 approves them. Both pets show the grant in their connection box.
- Example: `pet-program-12-v1.0-everything-search-v1.0` is File Master's connector to Everything (a third-party
  search program). File Master's grant: the whole PC, read only. Wifi Butterfly's grant: its own folder only,
  read only, 50 results per search.

Never make a separate copy for each pet (`friendly-farmer-everything-search`, `wifi-butterfly-everything-search`):
copies drift apart, and a security patch has to be applied to every copy.

## Third-party tools and tricks: the Shed

Other creators make tools and tricks too. They are welcome, and they are treated like a pet from another farm.

- **The Shed** is the public place for third-party tools and tricks, as the Kennel is for pets
  ([findastra/the-shed](https://github.com/findastra/the-shed)). Creators submit them; the community and the
  maintainers review them.
- A **third-party trick** is only text, but text can steer an agent (prompt injection). A **third-party tool** is code
  from a stranger. Both go into quarantine, a checker agent reviews them, and the farm's L4 approves before they run.
- Trust tiers, highest first: **official** (signed by the maintainers), **Shed-verified** (reviewed and adopted
  through the Shed), **community** (anything else, always shown with a warning).
- Developer words: third-party tricks are **skills** or **prompts**; third-party tools that connect an agent to a
  program are **plugins** or **MCP servers**.

## The registry: every program, tool and trick

Every native program, native tool and native trick of every pet program, and every third-party program a pet program
runs, by pet program number. Generated from `system-map.json` and `pet-programs.json` by `npm run build`; change the
data, never this table. Private pets (Health Hummy, Finance Finch) and private repos are left out.

<!-- registry:start (generated from system-map.json by scripts/system-map-20261012.mjs; do not edit by hand) -->
178 rows: 10 native programs, 95 native tools, 14 native tricks, 59 third-party programs. A pet program itself is listed in [PET-PROGRAMS.md](PET-PROGRAMS.md); a third-party program is listed once for each pet program that runs it.

| # | Pet | Pet program | Kind | Name | Label | State |
|---|---|---|---|---|---|---|
| 1 | Friendly Farmer | The Farm | native program | Astra’s PetOS System Map | `the-farm-v1.0-astras-pet-os-system-map-v1.0` | Works today |
| 1 | Friendly Farmer | The Farm | native program | GitHub profile |  | Works today |
| 1 | Friendly Farmer | The Farm | native program | How to Take Care of Your Farm! | `the-farm-v1.0-beginner-guide-v1.0` | Works today |
| 1 | Friendly Farmer | The Farm | native program | Startup Star | `the-farm-v1.0-startup-star-v1.0` | Works today |
| 1 | Friendly Farmer | The Farm | native tool | markdown-pets | `the-farm-v1.0-markdown-pets-v1.0` | Works today |
| 1 | Friendly Farmer | The Farm | native tool | pet-finder | `the-farm-v1.0-pet-finder-v1.0` | Works today |
| 1 | Friendly Farmer | The Farm | native tool | pet-privatizer | `the-farm-v1.0-pet-privatizer-v1.0` | Works today |
| 1 | Friendly Farmer | The Farm | native tool | pet-program-spawner | `the-farm-v1.0-pet-program-spawner-v1.0` | Works today |
| 1 | Friendly Farmer | The Farm | native tool | broken-tools-on-the-farm | `the-farm-v1.0-broken-tools-on-the-farm-v1.0` | Planned |
| 1 | Friendly Farmer | The Farm | native tool | seed-suggester | `the-farm-v1.0-seed-suggester-v1.0` | Planned |
| 1 | Friendly Farmer | The Farm | native trick | handoff | `the-farm-v1.0-handoff-trick-v1.0` | Works today |
| 1 | Friendly Farmer | The Farm | native trick | pet-finder | `the-farm-v1.0-pet-finder-trick-v1.0` | Works today |
| 1 | Friendly Farmer | The Farm | native trick | pet-organizer | `the-farm-v1.0-pet-organizer-trick-v1.0` | Works today |
| 1 | Friendly Farmer | The Farm | third-party program | GitHub |  | Works today |
| 1 | Friendly Farmer | The Farm | third-party program | Google Fonts |  | Works today |
| 1 | Friendly Farmer | The Farm | third-party program | Node.js |  | Works today |
| 1 | Friendly Farmer | The Farm | third-party program | three.js r128 |  | Works today |
| 1 | Friendly Farmer | The Farm | third-party program | Web browser (WebGL) |  | Works today |
| 1 | Friendly Farmer | The Farm | third-party program | Canva |  | Missing: needs planning |
| 1 | Friendly Farmer | The Farm | third-party program | Epic Games Launcher |  | Missing: needs planning |
| 1 | Friendly Farmer | The Farm | third-party program | OBS Studio |  | Missing: needs planning |
| 1 | Friendly Farmer | The Farm | third-party program | Overwolf |  | Missing: needs planning |
| 1 | Friendly Farmer | The Farm | third-party program | Steam |  | Missing: needs planning |
| 1 | Friendly Farmer | The Farm | third-party program | TikFinity |  | Missing: needs planning |
| 1 | Friendly Farmer | The Farm | third-party program | TikTok LIVE Studio |  | Missing: needs planning |
| 1 | Friendly Farmer | The Farm | third-party program | Wallpaper Engine |  | Missing: needs planning |
| 2 | GitHub Goldfish | GitHub Aquarium | native tool | flash-audit | `github-aquarium-v1.0-flash-audit-v1.0` | Works today |
| 2 | GitHub Goldfish | GitHub Aquarium | native tool | project-image-generator | `github-aquarium-v1.0-project-image-generator-v1.0` | Works today |
| 2 | GitHub Goldfish | GitHub Aquarium | third-party program | GitHub |  | Works today |
| 4 | API Fairy | API Fairy Ring | native tool | api-fairy-mushroom-circle | `api-fairy-ring-v1.0-api-fairy-mushroom-circle-v1.0` | Planned |
| 5 | Unity Unicorn | Unity Stable | native tool | asset-contact-sheet | `unity-stable-v1.0-asset-contact-sheet-v1.0` | Works today |
| 5 | Unity Unicorn | Unity Stable | native tool | button-check | `unity-stable-v1.0-button-check-v1.0` | Works today |
| 5 | Unity Unicorn | Unity Stable | native tool | cloud-collider-audit | `unity-stable-v1.0-cloud-collider-audit-v1.0` | Works today |
| 5 | Unity Unicorn | Unity Stable | native tool | cloud-collider-validation | `unity-stable-v1.0-cloud-collider-validation-v1.0` | Works today |
| 5 | Unity Unicorn | Unity Stable | native tool | cloud-lounge-smoothing | `unity-stable-v1.0-cloud-lounge-smoothing-v1.0` | Works today |
| 5 | Unity Unicorn | Unity Stable | native tool | cloud-mesh-generator | `unity-stable-v1.0-cloud-mesh-generator-v1.0` | Works today |
| 5 | Unity Unicorn | Unity Stable | native tool | cloud-physics-check | `unity-stable-v1.0-cloud-physics-check-v1.0` | Works today |
| 5 | Unity Unicorn | Unity Stable | native tool | cloud-sea-fusion | `unity-stable-v1.0-cloud-sea-fusion-v1.0` | Works today |
| 5 | Unity Unicorn | Unity Stable | native tool | cloud-survey | `unity-stable-v1.0-cloud-survey-v1.0` | Works today |
| 5 | Unity Unicorn | Unity Stable | native tool | desktop-world-test | `unity-stable-v1.0-desktop-world-test-v1.0` | Works today |
| 5 | Unity Unicorn | Unity Stable | native tool | face-transfer | `unity-stable-v1.0-face-transfer-v1.0` | Works today |
| 5 | Unity Unicorn | Unity Stable | native tool | foreground-tool-recorder | `unity-stable-v1.0-foreground-tool-recorder-v1.0` | Works today |
| 5 | Unity Unicorn | Unity Stable | native tool | house-scene-builder | `unity-stable-v1.0-house-scene-builder-v1.0` | Works today |
| 5 | Unity Unicorn | Unity Stable | native tool | marble-carver | `unity-stable-v1.0-marble-carver-v1.0` | Works today |
| 5 | Unity Unicorn | Unity Stable | native tool | masonry-regeneration | `unity-stable-v1.0-masonry-regeneration-v1.0` | Works today |
| 5 | Unity Unicorn | Unity Stable | native tool | masonry-structural-audit | `unity-stable-v1.0-masonry-structural-audit-v1.0` | Works today |
| 5 | Unity Unicorn | Unity Stable | native tool | masonry-unity-refresh | `unity-stable-v1.0-masonry-unity-refresh-v1.0` | Works today |
| 5 | Unity Unicorn | Unity Stable | native tool | matcap-palette | `unity-stable-v1.0-matcap-palette-v1.0` | Works today |
| 5 | Unity Unicorn | Unity Stable | native tool | menu-map | `unity-stable-v1.0-menu-map-v1.0` | Works today |
| 5 | Unity Unicorn | Unity Stable | native tool | neck-blender | `unity-stable-v1.0-neck-blender-v1.0` | Works today |
| 5 | Unity Unicorn | Unity Stable | native tool | no-windows-audit-tool | `unity-stable-v1.0-no-windows-audit-tool-v1.0` | Works today |
| 5 | Unity Unicorn | Unity Stable | native tool | no-windows-scene-refresh | `unity-stable-v1.0-no-windows-scene-refresh-v1.0` | Works today |
| 5 | Unity Unicorn | Unity Stable | native tool | occlusion-bake | `unity-stable-v1.0-occlusion-bake-v1.0` | Works today |
| 5 | Unity Unicorn | Unity Stable | native tool | prop-decomposer | `unity-stable-v1.0-prop-decomposer-v1.0` | Works today |
| 5 | Unity Unicorn | Unity Stable | native tool | realistic-prop-restyle | `unity-stable-v1.0-realistic-prop-restyle-v1.0` | Works today |
| 5 | Unity Unicorn | Unity Stable | native tool | reflection-probe-bake | `unity-stable-v1.0-reflection-probe-bake-v1.0` | Works today |
| 5 | Unity Unicorn | Unity Stable | native tool | run-unity-tool | `unity-stable-v1.0-run-unity-tool-v1.0` | Works today |
| 5 | Unity Unicorn | Unity Stable | native tool | scene-preview-render | `unity-stable-v1.0-scene-preview-render-v1.0` | Works today |
| 5 | Unity Unicorn | Unity Stable | native tool | scene-yaml-inspection | `unity-stable-v1.0-scene-yaml-inspection-v1.0` | Works today |
| 5 | Unity Unicorn | Unity Stable | native tool | shaders-shop | `unity-stable-v1.0-shaders-shop-v1.0` | Works today |
| 5 | Unity Unicorn | Unity Stable | native tool | time-season-tide-preview | `unity-stable-v1.0-time-season-tide-preview-v1.0` | Works today |
| 5 | Unity Unicorn | Unity Stable | native tool | unity-asset-creator | `unity-stable-v1.0-unity-asset-creator-v1.0` | Works today |
| 5 | Unity Unicorn | Unity Stable | native tool | unity-assets-library | `unity-stable-v1.0-unity-assets-library-v1.0` | Works today |
| 5 | Unity Unicorn | Unity Stable | native tool | vine-bloomer | `unity-stable-v1.0-vine-bloomer-v1.0` | Works today |
| 5 | Unity Unicorn | Unity Stable | native tool | vine-spawn-with-trumpet-flowers | `unity-stable-v1.0-vine-spawn-with-trumpet-flowers-v1.0` | Works today |
| 5 | Unity Unicorn | Unity Stable | native tool | wall-texture-rebuild | `unity-stable-v1.0-wall-texture-rebuild-v1.0` | Works today |
| 5 | Unity Unicorn | Unity Stable | native tool | world-spawn-tool | `unity-stable-v1.0-world-spawn-tool-v1.0` | Works today |
| 5 | Unity Unicorn | Unity Stable | native tool | world-validator | `unity-stable-v1.0-world-validator-v1.0` | Works today |
| 5 | Unity Unicorn | Unity Stable | native tool | asset-ledger | `unity-stable-v1.0-asset-ledger-v1.0` | Planned |
| 5 | Unity Unicorn | Unity Stable | native tool | bending-adder | `unity-stable-v1.0-bending-adder-v1.0` | Planned |
| 5 | Unity Unicorn | Unity Stable | native tool | blood-bender-strapper | `unity-stable-v1.0-blood-bender-strapper-v1.0` | Planned |
| 5 | Unity Unicorn | Unity Stable | native tool | bubble-chair-blower | `unity-stable-v1.0-bubble-chair-blower-v1.0` | Planned |
| 5 | Unity Unicorn | Unity Stable | native tool | chain-dangle-weights | `unity-stable-v1.0-chain-dangle-weights-v1.0` | Planned |
| 5 | Unity Unicorn | Unity Stable | native tool | copyright-catcher | `unity-stable-v1.0-copyright-catcher-v1.0` | Planned |
| 5 | Unity Unicorn | Unity Stable | native tool | copyright-logger | `unity-stable-v1.0-copyright-logger-v1.0` | Planned |
| 5 | Unity Unicorn | Unity Stable | native tool | fan-fitter | `unity-stable-v1.0-fan-fitter-v1.0` | Planned |
| 5 | Unity Unicorn | Unity Stable | native tool | glass-animal-tool | `unity-stable-v1.0-glass-animal-tool-v1.0` | Planned |
| 5 | Unity Unicorn | Unity Stable | native tool | golden-painter | `unity-stable-v1.0-golden-painter-v1.0` | Planned |
| 5 | Unity Unicorn | Unity Stable | native tool | gunsmith-loadout | `unity-stable-v1.0-gunsmith-loadout-v1.0` | Planned |
| 5 | Unity Unicorn | Unity Stable | native tool | hair-weighter | `unity-stable-v1.0-hair-weighter-v1.0` | Planned |
| 5 | Unity Unicorn | Unity Stable | native tool | learn-add-ons | `unity-stable-v1.0-learn-add-ons-v1.0` | Planned |
| 5 | Unity Unicorn | Unity Stable | native tool | neck-bow-strapper | `unity-stable-v1.0-neck-bow-strapper-v1.0` | Planned |
| 5 | Unity Unicorn | Unity Stable | native tool | rgb-painter | `unity-stable-v1.0-rgb-painter-v1.0` | Planned |
| 5 | Unity Unicorn | Unity Stable | native tool | sparkle-bender-strapper | `unity-stable-v1.0-sparkle-bender-strapper-v1.0` | Planned |
| 5 | Unity Unicorn | Unity Stable | native tool | sparkle-strapper | `unity-stable-v1.0-sparkle-strapper-v1.0` | Planned |
| 5 | Unity Unicorn | Unity Stable | native tool | spring-joint-strapper | `unity-stable-v1.0-spring-joint-strapper-v1.0` | Planned |
| 5 | Unity Unicorn | Unity Stable | native tool | star-effects-diagnostic | `unity-stable-v1.0-star-effects-diagnostic-v1.0` | Planned |
| 5 | Unity Unicorn | Unity Stable | native tool | water-bender-strapper | `unity-stable-v1.0-water-bender-strapper-v1.0` | Planned |
| 5 | Unity Unicorn | Unity Stable | native tool | wing-strapper | `unity-stable-v1.0-wing-strapper-v1.0` | Planned |
| 5 | Unity Unicorn | Unity Stable | native trick | make-a-prop-look-real | `unity-stable-v0.3.0-make-a-prop-look-real-trick-v1.0` | Works today |
| 5 | Unity Unicorn | Unity Stable | native trick | unity-asset-creator | `unity-stable-v1.0-unity-asset-creator-trick-v1.0` | Works today |
| 5 | Unity Unicorn | Unity Stable | native trick | vcc-package-manager | `unity-stable-v1.0-vcc-package-manager-trick-v1.0` | Planned |
| 5 | Unity Unicorn | Unity Stable | native trick | vrchat-avatar-upload | `unity-stable-v1.0-vrchat-avatar-upload-trick-v1.0` | Planned |
| 5 | Unity Unicorn | Unity Stable | native trick | weekly-copyright-auditor | `unity-stable-v1.0-weekly-copyright-auditor-trick-v1.0` | Planned |
| 5 | Unity Unicorn | Unity Stable | native trick | weekly-update-from-friendly-farmer | `unity-stable-v1.0-weekly-update-from-friendly-farmer-trick-v1.0` | Planned |
| 5 | Unity Unicorn | Unity Stable | third-party program | Unity 2022.3.22f1 and Unity Hub |  | Works today |
| 5 | Unity Unicorn | Unity Stable | third-party program | VRChat Creator Companion |  | Works today |
| 5 | Unity Unicorn | Unity Stable | third-party program | Blender |  | Idea |
| 5 | Unity Unicorn | Unity Stable | third-party program | VRCFT (VRCFaceTracking) |  | Planned |
| 5 | Unity Unicorn | Unity Stable | third-party program | VRChat |  | Planned |
| 7 | Astra Wisp | The Astral Plane | third-party program | Magic Chatbox |  | Idea |
| 11 | Paper Patty | Paper Girl | third-party program | GitHub |  | Works today |
| 12 | File Master | File Kingdom | native tool | New-programs watch | `pet-program-12-v1.0-new-programs-watch-v1.0` | Works today |
| 12 | File Master | File Kingdom | native tool | repo-catcher | `pet-program-12-v1.0-repo-catcher-v1.0` | Works today |
| 12 | File Master | File Kingdom | native tool | everything-search | `pet-program-12-v1.0-everything-search-v1.0` | Planned |
| 12 | File Master | File Kingdom | native tool | mass-delete | `file-master-v1.0-mass-delete-v1.0` | Planned |
| 12 | File Master | File Kingdom | third-party program | Everything |  | Planned |
| 12 | File Master | File Kingdom | third-party program | SpaceSniffer |  | Planned |
| 13 | Discord Damsel | Discord Tower | native program | Anthropic Discord Presence |  | Works today |
| 13 | Discord Damsel | Discord Tower | native program | OpenAI Discord Presence |  | Works today |
| 13 | Discord Damsel | Discord Tower | native tool | CLI Proxy API manager | `discord-tower-v1.0-cli-proxy-api-v1.0` | Works today |
| 13 | Discord Damsel | Discord Tower | native tool | Sticker Manager | `discord-tower-v1.0-sticker-manager-v1.0` | Planned |
| 13 | Discord Damsel | Discord Tower | native trick | dm-cleanup | `discord-tower-v1.0-dm-cleanup-trick-v1.0` | Works today |
| 13 | Discord Damsel | Discord Tower | third-party program | CLI Proxy API |  | Works today |
| 13 | Discord Damsel | Discord Tower | third-party program | Discord |  | Works today |
| 13 | Discord Damsel | Discord Tower | third-party program | BetterDiscord |  | Planned |
| 15 | Drum Dog | Bass & Biscuits | third-party program | Ableton Live |  | Planned |
| 15 | Drum Dog | Bass & Biscuits | third-party program | Spotify |  | Idea |
| 16 | VSCode Angel | Halo List | third-party program | Visual Studio Community 2022 |  | Idea |
| 17 | Gone Ghost | Am I a Ghost? | native program | Ghost Protocol |  | Works today |
| 17 | Gone Ghost | Am I a Ghost? | native tool | Internet scrub | `am-i-a-ghost-v1.0-internet-scrub-v1.0` | Planned |
| 17 | Gone Ghost | Am I a Ghost? | native tool | name-eraser | `am-i-a-ghost-v1.0-name-eraser-v1.0` | Planned |
| 17 | Gone Ghost | Am I a Ghost? | third-party program | GitHub |  | Works today |
| 17 | Gone Ghost | Am I a Ghost? | third-party program | Malwarebytes |  | Idea |
| 19 | Voicemeeter Bug | Audio Rescue | native tool | Keep Voicemeeter open | `audio-rescue-v1.0-keep-voicemeeter-open-v1.0` | Works today |
| 19 | Voicemeeter Bug | Audio Rescue | third-party program | Steam Streaming audio |  | Works today |
| 19 | Voicemeeter Bug | Audio Rescue | third-party program | Voicemeeter |  | Works today |
| 22 | RGBee | Light Hive | third-party program | Corsair iCUE |  | Planned |
| 22 | RGBee | Light Hive | third-party program | Logitech G HUB |  | Planned |
| 22 | RGBee | Light Hive | third-party program | MSI Center |  | Planned |
| 22 | RGBee | Light Hive | third-party program | Razer Synapse |  | Planned |
| 27 | Gif Giraffe | Astra's GIF Maker | third-party program | CapCut |  | Idea |
| 27 | Gif Giraffe | Astra's GIF Maker | third-party program | ShareX |  | Idea |
| 29 | Rift Rabbit | Wonderland Launchpad | third-party program | Base Station FOV Viewer |  | Planned |
| 29 | Rift Rabbit | Wonderland Launchpad | third-party program | BS Manager |  | Planned |
| 29 | Rift Rabbit | Wonderland Launchpad | third-party program | Double Hip Tracker |  | Planned |
| 29 | Rift Rabbit | Wonderland Launchpad | third-party program | Meta Horizon Link |  | Planned |
| 29 | Rift Rabbit | Wonderland Launchpad | third-party program | OVR Advanced Settings |  | Planned |
| 29 | Rift Rabbit | Wonderland Launchpad | third-party program | OVR Dynamic Resolution |  | Planned |
| 29 | Rift Rabbit | Wonderland Launchpad | third-party program | OVR Pager |  | Planned |
| 29 | Rift Rabbit | Wonderland Launchpad | third-party program | OVR Smooth Tracking |  | Planned |
| 29 | Rift Rabbit | Wonderland Launchpad | third-party program | OVR Toolkit |  | Planned |
| 29 | Rift Rabbit | Wonderland Launchpad | third-party program | Space Calibrator |  | Planned |
| 29 | Rift Rabbit | Wonderland Launchpad | third-party program | SteamVR |  | Planned |
| 29 | Rift Rabbit | Wonderland Launchpad | third-party program | Virtual Desktop |  | Planned |
| 30 | Fuzzboi Friend | Fuzzboi Factory | native program | Fuzzbois |  | Works today |
| 30 | Fuzzboi Friend | Fuzzboi Factory | third-party program | GitHub |  | Works today |
| 32 | Deck Duck | Deck Pond | third-party program | Elgato Stream Deck |  | Planned |
| 35 | Chat Rat | Chat Stack | native tool | save-missing | `chat-stack-v0.1.0-save-missing-v0.1.0` | Works today |
| 35 | Chat Rat | Chat Stack | native trick | ask-chat-rat | `chat-stack-v0.1.0-ask-chat-rat-trick-v1.0` | Works today |
| 35 | Chat Rat | Chat Stack | native trick | save-chats | `chat-stack-v0.1.0-save-chats-trick-v1.0` | Works today |
| 38 | Pole Puff | Infinite Studio | native program | Astra's Infinite Pole (world) |  | Works today |
| 38 | Pole Puff | Infinite Studio | third-party program | VRChat |  | Works today |
| 38 | Pole Puff | Infinite Studio | third-party program | VR Pole Overlay |  | Idea |
| 41 | OSC Sealion | OSC Sonar | third-party program | OSCGoesBrrr |  | Planned |
| 41 | OSC Sealion | OSC Sonar | third-party program | VRCFT (VRCFaceTracking) |  | Planned |
| 42 | Piranesi Nessi | Nessi's Ocean | native program | Piranesi House (world) |  | Works today |
| 42 | Piranesi Nessi | Nessi's Ocean | third-party program | VRChat |  | Planned |
| 48 | Log Lynx | Log Den | native tool | Crash catcher | `log-den-v1.0-crash-catcher-v1.0` | Works today |
| 48 | Log Lynx | Log Den | native tool | Farm event log | `log-den-v1.0-farm-event-log-v1.0` | Works today |
| 48 | Log Lynx | Log Den | native tool | Heartbeat checker | `log-den-v1.0-heartbeat-checker-v1.0` | Works today |
| 48 | Log Lynx | Log Den | native tool | Windows log reader | `log-den-v1.0-windows-log-reader-v1.0` | Works today |
| 52 | Token Toucan | Token Canopy | native tool | footprint-meter | `pet-program-52-v1.0-footprint-meter-v1.0` | Planned |
| 53 | Packet Piranha | Packet River | native tool | Dns checker | `packet-river-v1.0-dns-checker-v1.0` | Works today |
| 53 | Packet Piranha | Packet River | native tool | Link watcher | `packet-river-v1.0-link-watcher-v1.0` | Works today |
| 53 | Packet Piranha | Packet River | native tool | Ping sampler | `packet-river-v1.0-ping-sampler-v1.0` | Works today |
| 53 | Packet Piranha | Packet River | native tool | Reach checker | `packet-river-v1.0-reach-checker-v1.0` | Works today |
| 53 | Packet Piranha | Packet River | native tool | Route tracer | `packet-river-v1.0-route-tracer-v1.0` | Works today |
| 58 | Linux Penguin | Linux Iceberg | native tool | Linux check | `linux-iceberg-v0.1-linux-check-v1.0` | Works today |
| 58 | Linux Penguin | Linux Iceberg | native tool | Mac pre-wipe check | `linux-iceberg-v0.1-mac-prewipe-check-v1.0` | Works today |
| 58 | Linux Penguin | Linux Iceberg | native trick | debian-family | `linux-iceberg-v0.1-debian-family-trick-v1.0` | Works today |
| 58 | Linux Penguin | Linux Iceberg | native trick | kali-on-a-mac | `linux-iceberg-v0.1-kali-on-a-mac-trick-v1.0` | Works today |
| 58 | Linux Penguin | Linux Iceberg | third-party program | MacAttack |  | Planned |
| 70 | Forensic Ferret | Evidence Locker | native tool | Case opener | `evidence-locker-v1.0-case-opener-v1.0` | Works today |
| 70 | Forensic Ferret | Evidence Locker | native tool | Custody log | `evidence-locker-v1.0-custody-log-v1.0` | Works today |
| 70 | Forensic Ferret | Evidence Locker | native tool | Evidence collector | `evidence-locker-v1.0-evidence-collector-v1.0` | Works today |
| 70 | Forensic Ferret | Evidence Locker | native tool | Timeline builder | `evidence-locker-v1.0-timeline-builder-v1.0` | Works today |
| 84 | Workflow Whale | Workflow Whirlpool | native tool | ipad-workflow-caster | `workflow-whirlpool-v0.1.0-ipad-workflow-caster-v0.1.0` | Planned |
<!-- registry:end -->
