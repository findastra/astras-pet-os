status: done, merged with Astra's OK in chat (2026-11-08: "Yes, merge both", after #303)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-11-08, a side chat of the "PC Master Race" chat
needs: card 303 (#304 is stacked on #303)
---
## Task

Astra, 2026-11-08, on Discord Tower's page: "I don't see Discord Canary on here. Can you make sure that that's on
there? And then everything else that we've built?"

## What I did

- Discord Canary shows under 3rd party programs: the page now counts the programs a pet's tricks run on
  (typing-indicator runs on Canary).
- Ableton Live Discord Presence (v0.2.0) is one of Discord Damsel's programs on the System Map and in `pets.json`; her
  quick summary names OpenAI, Anthropic and Ableton Live. The full list and what was already there:
  `changes/discord-tower-everything-20261108.md`.
- `npm test`: 387 pass, 1 fail (installed farm from scratch, Windows), the same as on `main`.

## Done when

1. After Astra's OK, #303 merges, #304 is retargeted to `main` (`gh pr edit 304 --base main`), `main` merged in and
   rebuilt if needed, then #304 merges.
2. Her live page lists Discord Canary and Ableton Live Discord Presence.

## Not done

The hub's copy of a private pet's `pet.json` stays behind until the Farmer's round has a `FARMER_TOKEN` secret that
can read private repos: anything new in Discord Tower needs adding by hand until then.

## Receipt and review

- Astra gave her OK in chat: "Yes, merge both". #303 merged first; #304 retargeted to `main`, `main` merged in
  (no conflicts), `npm run build` (nothing changed), `npm test` again before the merge: 387 pass, 1 fail (installed farm from
  scratch, Windows), the same as on `main`.
