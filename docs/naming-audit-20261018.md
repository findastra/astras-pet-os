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

## Left to name now
- **0 pets.**
- **30 pet programs**, all roadmap pets (#47–76), each with a suggested `idea` in `pet-programs.json`.

## Not done
- The pet repos' own `pet.json` files are not updated here (each pet's chat does that, or the next Flash Audit round
  on each repo).
- Rounds 1 and 2 are on `main` (PR #46). Round 3 is on branch `claude/tender-gauss-m2nbhp` until it merges.
