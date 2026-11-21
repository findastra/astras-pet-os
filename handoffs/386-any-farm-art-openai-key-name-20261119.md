status: open (waiting on Astra: merge #386 and findastra/ai-discord-presence#60, then copy the key to its new name)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-11-19
needs: skills/key-request/SKILL.md ("Never reuse ANTHROPIC_API_KEY or OPENAI_API_KEY")
---
## Task

Astra's answer in the key safety deck (2026-11-19, "all recommended"), question 3: the OpenAI key used for pet art
is renamed from `OPENAI_API_KEY` to `FARM_ART_OPENAI_API_KEY`, because Codex and other tools read `OPENAI_API_KEY`.

## Ownership and state

State: READY_FOR_REVIEW
Implementer: Claude Opus 5.5; writable files: the ones listed below; ownership: released after merge
Reviewer: pending

## What I did

- Branch `claude/farm-art-openai-key-name-20261119`, pull request #386.
- `scripts/generate-pets.mjs`: its header comment names `FARM_ART_OPENAI_API_KEY` (the script never reads the key
  itself; the image bridge does).
- `docs/linux-readiness-20261018.md`: same name in the `npm run generate` row.
- The image bridge, which reads the key, is changed in findastra/ai-discord-presence#60: new name first,
  `OPENAI_API_KEY` as a fallback so nothing breaks before the key is moved. API Fairy's own example names are
  changed in findastra/api-fairy (same branch name).
- API Fairy's key request (on Astra's PC only, never in a repo) now names `FARM_ART_OPENAI_API_KEY`, status requested.

## Not done / next

- Astra copies the value to the new Windows user variable herself, then deletes `OPENAI_API_KEY`. API Fairy then
  moves the request to "has a key".
- The PC's loose `image-bridge` folder (not a git repo; the hub runs `../image-bridge/imagine.mjs` from it) is an old
  copy of the bridge. Until it is refreshed from ai-discord-presence after the merge, `npm run generate` keeps using
  `OPENAI_API_KEY`.
- Left as is: `scripts/pet-chat-helper-20261103.cs` keeps seats from inheriting `OPENAI_API_KEY`; it could also strip
  `FARM_ART_OPENAI_API_KEY` (a separate safety change, not the art key's use).

## Receipt and review

Pending.
