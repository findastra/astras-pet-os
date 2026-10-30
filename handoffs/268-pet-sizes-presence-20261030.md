status: taken by OpenAI Codex, presence and sizing session
for: Codex
from: OpenAI Codex (GPT-6), 2026-10-30
needs: current hub rules, PR 268, Discord Tower bridge revision
---
## Task

Normalize desktop pet sizes, keep Workflow Whale largest but compact, and provide working OpenAI/Anthropic start/open controls on Discord Damsel's page.

## Ownership and state

State: IN_PROGRESS

Implementer: root presence/sizing session. Writable scope: `scripts/desktop-pets-20261011.cs`, sizing tests and dated sizing preview/docs, this card and `changes/pet-sizes-presence-20261030.md`.

Delegated implementer: Damsel agent in this session. Writable scope: `scripts/pet-program-pages-20261018.mjs`, Damsel companion JavaScript and tests, generated Discord Tower page, presence URL entries in `system-map.json`, and the narrow presence-managed hook in `apps/pet-programs/pet-program-page-20261018.js`. The Discord Tower service is developed on its own isolated branch. The delegate does not edit the desktop host.

Reviewer: rules-review agent for desktop sizing; root for Damsel controls and the separate launcher fix. No production artwork changes; active artwork review PR 267 remains separate. Live main and desktop executable remain unchanged until the reviewed core change is approved.

## What I did

- Inspected installed presence apps and confirmed both servers stopped despite saved ON indicators.
- Restored OpenAI from its actual installation path: Automatic mode, RPC connected, activity published and acknowledged by Discord. The visible profile itself is not yet visually verified.
- Found launcher entrypoint comparison fails through a Windows directory junction; separate presence source repair is underway.
- Confirmed the generated Damsel presence entries have no URL or working start control.
- Confirmed existing desktop size multipliers and pre-override cap allow oversized exceptions.
- Published isolated branch claim `29019ec` and draft PR 268 before implementation.

## Done when

Species size rules preserve artwork aspect ratios, shared human calibration and paired behavior; the whale has a modest upper bound and is the largest individual pet. Damsel shows accurate runtime state and can start/open either presence app. Tests, independent review, approved integration and live acceptance are recorded separately.

## Return

Record exact revisions, commands and results here. Keep local diagnostics private; publish only sanitized evidence.

## Receipt and review

Pending implementation and review. The owner-reported maintenance flag is preserved for the owner to clear.
