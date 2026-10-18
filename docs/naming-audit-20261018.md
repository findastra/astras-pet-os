# Naming audit (Flash Audit A06 + A07), 2026-10-18

*Continues [the 2026-10-16 naming audit](naming-audit-20261016.md): only the pets and pet programs still unnamed. Run
for Astra by Claude Opus 5.5 (`claude-opus-5-5`). Owner: GitHub Goldfish (GitHub Aquarium). Procedure:
[Flash Audit](flash-audit-20261014.md), section 2, step 6 (four suggestions plus free text; Astra picks).*

## Where I looked
- `pet-programs.json` on `main` at `4a86d0e` (83 numbered pets), and the same file on every open branch
  (#23, #36, #22, #47's branch): no name decided there that `main` lacks.
- A06 across the in-repo lists passes: `test/name-list-test-20261016.mjs` (pets.json, system-map.json,
  INTELLIGENCE-LEVELS.md agree with pet-programs.json).
- **Not verified:** each pet repo's own `pet.json`. This session can reach only `astras-pet-os`. The 2026-10-16 audit
  found #11 Patty and #17 Gone Ghost still under their old names there.

## Left to name at the start
- **1 pet:** #77 (`pet-program-77-icon-77`).
- **41 pet programs:** #31–33, 39–41, 43–45, 47–77, 81.

## Round 1 (2026-10-18)
| # | Pet | Decided | Was |
|---|---|---|---|
| 77 | **Triage Tapir** (pet name) | Astra, from four suggestions | `pet-program-77-icon-77` |
| 31 | Wifi Butterfly | **Signal Garden** | idea, no preference on 2026-10-16 |
| 32 | Deck Duck | **Deck Pond** | idea, no preference on 2026-10-16 |
| 33 | Mesh Moth | **Mesh Lantern** | idea, no preference on 2026-10-16 |

Written to `pet-programs.json`, the #77 seed entry in `pets.json`, its colour key in `system-map.json`, and the three
rows in `INTELLIGENCE-LEVELS.md`; `npm run build` and `npm test` pass.

## Round 2 (2026-10-18)
| # | Pet | Decided | Note |
|---|---|---|---|
| 39 | Procreate Panda | **Bamboo Studio** | the suggested idea |
| 40 | Skill Scout | **Luna's Log** | Astra asked for something Sailor Moon themed (Skill Scout already nods to the Sailor Scouts); Luna is the cat who watches over the Scouts. A name only: the art stays Astra's own |
| 41 | OSC Sealion | **OSC Sonar** | the suggested idea |
| 43 | Photo Dodo | **Photo Roost** | the suggested idea |

Seeds now carry `program` in `pets.json` too.

## Round 3 (2026-10-18)
| # | Pet | Decided | Note |
|---|---|---|---|
| 44 | Video Vulture | **Video Vault** | the suggested idea |
| 45 | Closet Cat | **The Cat's Closet** | matches its repo, `the-cats-closet` |
| 77 | Triage Tapir | **The Triage Desk** | Codex's earlier suggestion |
| 81 | Intel Owl | **Threat Observatory** | the suggested idea |

Every pet that is registered, in the pipeline or a seed now has a named pet program.

## Round 4 (2026-10-18): the 30 roadmap pets
Astra saw all 30 suggested homes in one list and kept every one ("looks good to me"): #47 Task Island, #48 Log Den,
#49 Server Hearth, #50 Container Hoard, #51 Test Track, #52 Token Canopy, #53 Packet River, #54 Crow's Nest,
#55 Browser Belfry, #56 Data Marsh, #57 Update Tidepool, #58 Linux Iceberg, #59 Market Meadow, #60 Passport Harbor,
#61 Journal Lagoon, #62 Shell Trench, #63 Kernel Grove, #64 Proxy Lake, #65 Cluster Shore, #66 Storage Warren,
#67 White Hat Lab, #68 Port Web, #69 Cipher Hollow, #70 Evidence Locker, #71 Model Library, #72 Benchmark Rock,
#73 Agent Colony, #74 Roam Map, #75 Cache Canyon, #76 Sync Stream. Noted for later: #59's job is not decided yet.

## Left to name now
- **Nothing.** All 83 pets and all 83 pet programs in `pet-programs.json` have names (Flash Audit A06 and A07, in-repo
  lists).

## Not done
- The pet repos' own `pet.json` files are not updated here (each pet's chat does that, or the next Flash Audit round
  on each repo).
- Rounds 1 and 2 merged with PR #46; rounds 3 and 4 with the pull request after it.
- Not numbered yet (from the 2026-10-16 audit): Workflow Whale, Index Mole. Astra decides whether they join.
