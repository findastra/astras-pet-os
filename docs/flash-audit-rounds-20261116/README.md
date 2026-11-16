# Flash Audit rounds, 2026-11-16

Astra, 2026-11-16: "I want every item to be done through a flash audit. Let's start with item one. All 85 items. Go.
Also, show me the whole list of items on the flash audit."

The items are the pet programs in [pet-programs.json](../../pet-programs.json), in their numbers: 86 of them,
numbered 1 to 87 (number 85 is not taken: Reactor Raccoon's seed is still pull request #245).
Each gets every check below. Three kinds of check:

- **Run (auditor)**: `scripts/idle-flash-audit-20261017.mjs`, read-only through GitHub, run over every pet program on
  2026-11-16 by the Flash Audit helper on Astra's PC ([ledger-main.json](ledger-main.json)).
- **build (template)**: every pet program page compared with the Model Pet Program (`scripts/flash-template-20261112.mjs`).
- **by hand**: an assistant, one pet at a time, in its round. A check nobody has done is **Not verified**, never a pass.

## The 71 checks, most important first

The order is the matrix's ([flash-audit-20261014.md](../flash-audit-20261014.md), section 3). ⚪ grey: fixed without
Astra; 🔵 blue: waits for her answer or for her to be there. IDs never change, so they are not in number order.

| # | Dot | ID | Check | Section | Checked by |
|--:|:-:|---|---|---|---|
| 1 | ⚪ | A59 | Pet program and its link | 1. Is it a pet, and is it named | Run (auditor) |
| 2 | ⚪ | A06 | Pet name | 1. Is it a pet, and is it named | Run (auditor) |
| 3 | 🔵 | A07 | Program name/version | 1. Is it a pet, and is it named | Run (auditor) |
| 4 | 🔵 | A01 | Current icon | 1. Is it a pet, and is it named | Run (auditor) |
| 5 | ⚪ | A53 | Program icon matches its folder | 1. Is it a pet, and is it named | by hand |
| 6 | ⚪ | A09 | Program interface | 1. Is it a pet, and is it named | Run (auditor) |
| 7 | 🔵 | A11 | Desktop launch | 1. Is it a pet, and is it named | by hand |
| 8 | ⚪ | A10 | Website route | 1. Is it a pet, and is it named | Run (auditor) |
| 9 | ⚪ | A54 | Third-party programs | 1. Is it a pet, and is it named | Run (auditor) |
| 10 | 🔵 | A08 | Purpose and scope | 1. Is it a pet, and is it named | by hand |
| 11 | ⚪ | A13 | Individual repo | 2. Where the work lives | Run (auditor) |
| 12 | ⚪ | A14 | Required repo files | 2. Where the work lives | Run (auditor) |
| 13 | ⚪ | A15 | README and credit | 2. Where the work lives | Run (auditor), Goldfish’s |
| 14 | 🔵 | A56 | Work saved in its native folder | 2. Where the work lives | Run (auditor) |
| 15 | ⚪ | A57 | Current names only | 2. Where the work lives | by hand, Goldfish’s |
| 16 | ⚪ | A16 | Metadata and self-audit | 2. Where the work lives | Run (auditor) |
| 17 | ⚪ | A17 | Git and deployment | 2. Where the work lives | Run (auditor) |
| 18 | ⚪ | A55 | Pictures | 3. Pictures and art | Run (auditor) |
| 19 | 🔵 | A02 | Nine emotions | 3. Pictures and art | Run (auditor) |
| 20 | 🔵 | A61 | Mood symbol spot | 3. Pictures and art | by hand |
| 21 | ⚪ | A03 | Emotion behavior | 3. Pictures and art | by hand |
| 22 | ⚪ | A58 | One art source | 3. Pictures and art | by hand |
| 23 | 🔵 | A04 | Art publication | 3. Pictures and art | by hand |
| 24 | 🔵 | A05 | Art format and provenance | 3. Pictures and art | Run (auditor) |
| 25 | 🔵 | A18 | Official tool and trick inventory | 4. Tools and safety | Run (auditor) |
| 26 | ⚪ | A19 | Tool behavior | 4. Tools and safety | by hand |
| 27 | 🔵 | A21 | Tool OFF enforcement | 4. Tools and safety | by hand |
| 28 | ⚪ | A20 | Manual maintenance light | 4. Tools and safety | by hand |
| 29 | 🔵 | A26 | Privacy and permissions | 4. Tools and safety | Run (auditor) |
| 30 | 🔵 | A25 | Integrations/accounts | 4. Tools and safety | by hand |
| 31 | ⚪ | A27 | Preview and recovery | 4. Tools and safety | by hand |
| 32 | ⚪ | A42 | Credential help | 4. Tools and safety | by hand |
| 33 | 🔵 | A28 | Pet connections | 4. Tools and safety | by hand |
| 34 | 🔵 | A23 | Chat-created tools | 5. Chat and agent | by hand |
| 35 | ⚪ | A24 | Ready indicator | 5. Chat and agent | by hand |
| 36 | 🔵 | A43 | Emotion/message hierarchy | 5. Chat and agent | by hand |
| 37 | ⚪ | A47 | The template's parts, in order | 6. The page | build (template) |
| 38 | ⚪ | A52 | Editorial status panel | 6. The page | build (template) |
| 39 | ⚪ | A62 | Cyberhome | 6. The page | build (template) |
| 40 | ⚪ | A63 | Title and version | 6. The page | build (template) |
| 41 | ⚪ | A64 | Quick summary | 6. The page | build (template) |
| 42 | ⚪ | A60 | System Map link | 6. The page | build (template) |
| 43 | ⚪ | A65 | Intelligence levels | 6. The page | build (template) |
| 44 | ⚪ | A66 | L1 control panel | 6. The page | build (template) |
| 45 | ⚪ | A67 | L2 control panel | 6. The page | build (template) |
| 46 | ⚪ | A68 | L3 control panel | 6. The page | build (template) |
| 47 | ⚪ | A69 | L4 control panel | 6. The page | build (template) |
| 48 | ⚪ | A70 | R W X panel | 6. The page | build (template) |
| 49 | ⚪ | A71 | Session notes | 6. The page | build (template) |
| 50 | ⚪ | A49 | Emotions | 6. The page | build (template) |
| 51 | ⚪ | A41 | Clicker Training | 6. The page | build (template) |
| 52 | ⚪ | A39 | Friends list | 6. The page | build (template) |
| 53 | ⚪ | A51 | Unified footer | 6. The page | build (template) |
| 54 | 🔵 | A22 | Chat | 6. The page | build (template) |
| 55 | ⚪ | A44 | Original yellow phone | 6. The page | build (template) |
| 56 | ⚪ | A46 | Program pills | 6. The page | build (template) |
| 57 | ⚪ | A48 | Paired lights | 6. The page | build (template) |
| 58 | ⚪ | A45 | Page width | 6. The page | by hand |
| 59 | ⚪ | A50 | Backdrop and text | 6. The page | by hand |
| 60 | ⚪ | A38 | Tool organization | 6. The page | by hand |
| 61 | ⚪ | A12 | Map/catalog navigation | 6. The page | by hand |
| 62 | ⚪ | A31 | Status and link labels | 6. The page | Run (auditor), Goldfish’s |
| 63 | 🔵 | A36 | First-visit tutorial | 7. Tutorials | by hand |
| 64 | 🔵 | A37 | Play and care SOPs | 7. Tutorials | by hand |
| 65 | 🔵 | A40 | Guided focus and functioning tour | 7. Tutorials | by hand |
| 66 | ⚪ | A29 | Notes/backlog | 8. Data, releases and records | by hand |
| 67 | ⚪ | A30 | Data continuity | 8. Data, releases and records | by hand |
| 68 | ⚪ | A32 | Pet Collar and release trust | 8. Data, releases and records | by hand |
| 69 | 🔵 | A33 | Registration/admission | 8. Data, releases and records | by hand |
| 70 | ⚪ | A34 | Generated artifacts/tests | 8. Data, releases and records | by hand |
| 71 | ⚪ | A35 | Handoff and unresolved work | 8. Data, releases and records | by hand |

## Every item

Counts are what is not a pass. Round 1 was checked by hand against all 71. Every other item so far has the
Run's and the build's checks only, so its hand checks are still to do ("next").

| # | Pet | Program | Stage | Missing | Incorrect | Not verified | Checks with a finding | Round |
|--:|---|---|---|--:|--:|--:|---|---|
| 1 | Friendly Farmer | The Farm | registered | 5 | 8 | 22 | see round 1 | [done](round-01-astras-pet-os-20261116.md) |
| 2 | GitHub Goldfish | GitHub Aquarium | registered | 0 | 0 | 0 | — (the Run leaves pet program 2 out: page checks only so far) | next |
| 3 | Data Chip | Data Dealer | registered | 4 | 1 | 0 | A15 A16 A55 A18 | next |
| 4 | API Fairy | API Fairy Ring | registered | 3 | 5 | 0 | A10 A15 A56 A17 A55 A18 | next |
| 5 | Unity Unicorn | Unity Stable | registered | 4 | 5 | 0 | A59 A54 A14 A56 A17 A55 A18 A31 | next |
| 6 | Python Panther | Python Jungle | registered | 6 | 2 | 0 | A59 A14 A15 A16 A17 A55 A18 | next |
| 7 | Astra Wisp | The Astral Plane | registered | 5 | 5 | 1 | A01 A10 A54 A15 A56 A16 A17 A55 | next |
| 8 | Health Hummy | The Nectar Nest | registered | 4 | 1 | 0 | A10 A15 A16 A55 A18 | next |
| 9 | Finance Finch | Nest Egg | registered | 4 | 1 | 0 | A10 A15 A16 A55 A18 | next |
| 10 | Mommy's Mommies | Mommy’s HQ | registered | 9 | 2 | 0 | A59 A07 A01 A10 A15 A16 A17 A55 A18 | next |
| 11 | Paper Patty | Paper Girl | registered | 4 | 6 | 0 | A59 A07 A10 A13 A14 A16 A55 A18 A31 | next |
| 12 | File Master | File Kingdom | registered | 3 | 4 | 1 | A10 A54 A15 A56 A55 | next |
| 13 | Discord Damsel | Discord Tower | registered | 2 | 2 | 1 | A59 A10 A16 A55 | next |
| 14 | Portfolio Puffer | Iced Out Iceberg | registered | 2 | 1 | 1 | A10 A15 A16 | next |
| 15 | Drum Dog | Bass & Biscuits | registered | 4 | 1 | 0 | A10 A54 A15 A16 A18 | next |
| 16 | VSCode Angel | Halo List | registered | 5 | 2 | 0 | A10 A54 A15 A16 A17 A55 A18 | next |
| 17 | Gone Ghost | Am I a Ghost? | registered | 2 | 3 | 0 | A59 A07 A16 A17 A18 | next |
| 18 | Project Parrot | Idea Perch | registered | 5 | 1 | 0 | A10 A54 A15 A16 A55 A18 | next |
| 19 | Voicemeeter Bug | Audio Rescue | registered | 4 | 3 | 1 | A59 A10 A54 A15 A56 A16 A55 | next |
| 20 | Spoonfed Sugarcube | Spoonfed | pipeline | 7 | 1 | 0 | A59 A10 A15 A16 A17 A55 A18 | next |
| 21 | Claude Bot | Claude Dock | pipeline | 6 | 0 | 0 | A59 A10 A16 A55 A18 A49 | next |
| 22 | RGBee | Light Hive | pipeline | 4 | 1 | 1 | A10 A54 A15 A16 A55 | next |
| 23 | Mine Mole | Crypto Burrow | pipeline | 6 | 0 | 0 | A10 A54 A15 A16 A55 A18 | next |
| 24 | Mail Snail | Mail Shell | pipeline | 5 | 0 | 0 | A59 A10 A16 A55 A18 | next |
| 25 | Patch Cat | The Litter Box | pipeline | 5 | 0 | 0 | A59 A10 A16 A55 A18 | next |
| 26 | Meme Fiend | Cursed Archive | pipeline | 5 | 0 | 0 | A59 A10 A54 A16 A18 | next |
| 27 | Gif Giraffe | Astra's GIF Maker | pipeline | 5 | 2 | 0 | A59 A14 A16 A55 A18 | next |
| 28 | Backup Beaver | Backup Dam | pipeline | 5 | 0 | 0 | A59 A10 A16 A55 A18 | next |
| 29 | Rift Rabbit | Wonderland Launchpad | pipeline | 4 | 2 | 1 | A59 A54 A14 A15 A16 A17 | next |
| 30 | Fuzzboi Friend | Fuzzboi Factory | pipeline | 3 | 5 | 0 | A10 A16 A55 A18 A31 | next |
| 31 | Wifi Butterfly | Signal Garden | pipeline | 4 | 1 | 0 | A59 A10 A15 A16 A18 | next |
| 32 | Deck Duck | Deck Pond | pipeline | 6 | 0 | 0 | A59 A10 A54 A16 A55 A18 | next |
| 33 | Mesh Moth | Mesh Lantern | pipeline | 6 | 0 | 0 | A59 A10 A54 A16 A55 A18 | next |
| 34 | Raspberry Pi Berry | Raspberry Pi Maker | pipeline | 6 | 1 | 0 | A59 A07 A10 A54 A16 A55 A18 | next |
| 35 | Chat Rat | Chat Stack | pipeline | 5 | 3 | 1 | A59 A09 A10 A15 A16 | next |
| 36 | Platform Platypus | Mirror Pool | registered | 4 | 4 | 0 | A59 A10 A54 A15 A55 A18 A31 | next |
| 37 | Dubstep Gunsmith | Dubstep Armory | seed | 7 | 1 | 0 | A59 A01 A09 A14 A16 A55 A18 | next |
| 38 | Pole Puff | Infinite Studio | seed | 6 | 1 | 0 | A59 A01 A09 A16 A55 A18 | next |
| 39 | Procreate Panda | Bamboo Studio | seed | 7 | 0 | 0 | A01 A09 A10 A16 A55 A18 | next |
| 40 | Skill Scout | Luna's Log | pipeline | 6 | 11 | 0 | A59 A01 A10 A56 A55 A18 A26 A49 | next |
| 41 | OSC Sealion | OSC Sonar | seed | 7 | 0 | 0 | A01 A09 A10 A16 A55 A18 | next |
| 42 | Piranesi Nessi | Nessi's Ocean | seed | 7 | 0 | 0 | A01 A09 A10 A16 A55 A18 | next |
| 43 | Photo Dodo | Photo Roost | seed | 7 | 0 | 0 | A01 A09 A10 A16 A55 A18 | next |
| 44 | Video Vulture | Video Vault | seed | 7 | 0 | 0 | A01 A09 A10 A16 A55 A18 | next |
| 45 | Closet Cat | The Cat's Closet | seed | 7 | 0 | 0 | A01 A09 A10 A16 A55 A18 | next |
| 46 | Gatekeeper Goddess | Iron Gates | pipeline | 8 | 2 | 0 | A59 A01 A09 A10 A16 A17 A55 A18 | next |
| 47 | Queue Quokka | Task Island | roadmap | 7 | 0 | 0 | A01 A09 A10 A16 A55 A18 | next |
| 48 | Log Lynx | Log Den | registered | 4 | 2 | 1 | A59 A10 A54 A15 A16 A31 | next |
| 49 | Server Salamander | Server Hearth | pipeline | 8 | 2 | 0 | A59 A01 A09 A10 A16 A17 A55 A18 | next |
| 50 | Docker Dragon | Container Hoard | roadmap | 7 | 0 | 0 | A01 A09 A10 A16 A55 A18 | next |
| 51 | Test Tortoise | Test Track | roadmap | 7 | 0 | 0 | A01 A09 A10 A16 A55 A18 | next |
| 52 | Token Toucan | Token Canopy | roadmap | 7 | 1 | 0 | A01 A09 A10 A16 A55 A18 A31 | next |
| 53 | Packet Piranha | Packet River | registered | 4 | 2 | 1 | A59 A10 A54 A15 A16 A31 | next |
| 54 | Calendar Crow | Crow's Nest | roadmap | 7 | 0 | 0 | A01 A09 A10 A16 A55 A18 | next |
| 55 | Browser Bat | Browser Belfry | roadmap | 7 | 0 | 0 | A01 A09 A10 A16 A55 A18 | next |
| 56 | Data Dragonfly | Data Marsh | roadmap | 7 | 0 | 0 | A01 A09 A10 A16 A55 A18 | next |
| 57 | Update Urchin | Update Tidepool | roadmap | 7 | 0 | 0 | A01 A09 A10 A16 A55 A18 | next |
| 58 | Linux Penguin | Linux Iceberg | pipeline | 6 | 1 | 1 | A01 A09 A10 A15 A16 A55 | next |
| 59 | Stock Fox | Market Meadow | roadmap | 7 | 0 | 0 | A01 A09 A10 A16 A55 A18 | next |
| 60 | Passport Pelican | Passport Harbor | roadmap | 7 | 0 | 0 | A01 A09 A10 A16 A55 A18 | next |
| 61 | Journal Jellyfish | Journal Lagoon | pipeline | 5 | 1 | 1 | A59 A01 A10 A16 A55 | next |
| 62 | Shell Squid | Shell Trench | roadmap | 7 | 0 | 0 | A01 A09 A10 A16 A55 A18 | next |
| 63 | Kernel Koala | Kernel Grove | pipeline | 6 | 3 | 1 | A59 A01 A10 A54 A56 A16 A17 A55 A26 | next |
| 64 | Proxy Axolotl | Proxy Lake | roadmap | 7 | 1 | 0 | A01 A09 A10 A16 A55 A18 A31 | next |
| 65 | Cluster Crab | Cluster Shore | roadmap | 7 | 0 | 0 | A01 A09 A10 A16 A55 A18 | next |
| 66 | Storage Stoat | Storage Warren | roadmap | 7 | 0 | 0 | A01 A09 A10 A16 A55 A18 | next |
| 67 | White Hat Weasel | White Hat Lab | pipeline | 8 | 3 | 0 | A59 A01 A09 A10 A16 A55 A18 A26 | next |
| 68 | Port Spider | Port Web | pipeline | 8 | 1 | 0 | A59 A01 A09 A10 A16 A55 A18 | next |
| 69 | Cipher Owl | Cipher Hollow | pipeline | 8 | 2 | 0 | A59 A01 A09 A10 A16 A17 A55 A18 | next |
| 70 | Forensic Ferret | Evidence Locker | registered | 4 | 2 | 1 | A59 A10 A54 A15 A16 A31 | next |
| 71 | Llama Librarian | Model Library | roadmap | 7 | 0 | 0 | A01 A09 A10 A16 A55 A18 | next |
| 72 | Inference Iguana | Benchmark Rock | pipeline | 6 | 1 | 1 | A59 A01 A10 A54 A16 A17 A55 | next |
| 73 | Agent Ant | Agent Colony | roadmap | 7 | 0 | 0 | A01 A09 A10 A16 A55 A18 | next |
| 74 | Roaming Raven | Roam Map | pipeline | 8 | 2 | 0 | A59 A01 A09 A10 A16 A17 A55 A18 | next |
| 75 | Cache Coyote | Cache Canyon | roadmap | 7 | 0 | 0 | A01 A09 A10 A16 A55 A18 | next |
| 76 | Sync Mink | Sync Stream | roadmap | 7 | 0 | 0 | A01 A09 A10 A16 A55 A18 | next |
| 77 | Triage Tapir | The Triage Desk | seed | 7 | 0 | 0 | A01 A09 A10 A16 A55 A18 | next |
| 78 | Pet Police Officer | The Police Station | pipeline | 10 | 3 | 0 | A59 A01 A09 A10 A15 A16 A17 A55 A18 | next |
| 79 | AI Dashund | AI Doghouse | pipeline | 8 | 4 | 1 | A59 A01 A09 A10 A15 A16 A55 A26 | next |
| 80 | Rescue Retriever | The Recovery Room | seed | 7 | 0 | 0 | A01 A09 A10 A16 A55 A18 | next |
| 81 | Intel Owl | Threat Observatory | seed | 7 | 0 | 0 | A01 A09 A10 A16 A55 A18 | next |
| 82 | Door Dormouse | The Threshold | pipeline | 7 | 4 | 1 | A59 A01 A09 A10 A15 A56 A16 A55 A31 | next |
| 83 | Role Fairy | Fairy Ring | pipeline | 7 | 4 | 0 | A59 A01 A10 A54 A15 A16 A55 A18 A31 | next |
| 84 | Workflow Whale | Workflow Whirlpool | pipeline | 4 | 0 | 1 | A59 A10 A16 A55 | next |
| 86 | PC Master | PC Master Race | pipeline | 5 | 1 | 1 | A59 A10 A54 A16 A55 A26 | next |
| 87 | Flowsheet Flamingo | The Pilot Plant | seed | 4 | 2 | 1 | A09 A10 A13 A16 A55 A26 | next |

All items: 497 Missing, 130 Incorrect, 42 Not verified.

<sub>Flash Audit, 2026-11-16, Claude Opus 5.5 (`claude-opus-5-5`). Read-only: nothing was clicked, launched or signed in to.</sub>
