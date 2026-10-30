status: open (reviewed; waiting on Astra for integration)
for: Codex
from: OpenAI Codex (GPT-6), 2026-10-30
needs: current hub rules, PR 268, Discord Tower bridge revision
---
## Task

Normalize desktop pet sizes, keep Workflow Whale largest but compact, and provide working OpenAI/Anthropic start/open controls on Discord Damsel's page.

## Ownership and state

State: READY_FOR_REVIEW — source review accepted; integration pending

Implementer: root presence/sizing session. Writable scope: `scripts/desktop-pets-20261011.cs`, sizing tests and dated sizing preview/docs, this card and `changes/pet-sizes-presence-20261030.md`.

Delegated implementer: Damsel agent in this session. Writable scope: `scripts/pet-program-pages-20261018.mjs`, Damsel companion JavaScript and tests, generated Discord Tower page, presence URL entries in `system-map.json`, and the narrow presence-managed hook in `apps/pet-programs/pet-program-page-20261018.js`. The Discord Tower service is developed on its own isolated branch. The delegate does not edit the desktop host.

Reviewer: rules-review agent for desktop sizing; root for Damsel controls and the separate launcher fix. No production artwork changes; active artwork review PR 267 remains separate. Live main and desktop executable remain unchanged until the reviewed core change is approved.

Both implementation scopes are released. Source review is accepted as recorded below; no live desktop adoption or final owner acceptance is claimed.

## What I did

- Inspected installed presence apps and confirmed both servers stopped despite saved ON indicators.
- Restored OpenAI from its actual installation path: Automatic mode, RPC connected, activity published and acknowledged by Discord. The visible profile itself is not yet visually verified.
- Found launcher entrypoint comparison fails through a Windows directory junction; separate presence source repair is underway.
- Confirmed the generated Damsel presence entries have no URL or working start control.
- Confirmed existing desktop size multipliers and pre-override cap allow oversized exceptions.
- Published isolated branch claim `29019ec` and draft PR 268 before implementation.
- Replaced per-pet multipliers with bounded species sizes, preserving aspect ratios, shared human calibration and paired movement. Whale maximum dimension is 64 logical pixels (previously about 78); Claude Bot is 48 high (previously 88.125). Source drawings are unchanged; the Farmer's different head/body ratio remains an artwork issue.
- Added the fixed hidden Damsel launcher hook, visible Start/open/Stop controls, verified publishing lights and local-only control links. The pet-owned service is delivered separately in Discord Tower; the junction guard fix is AI Discord Presence PR 50.
- Candidate desktop build and complete native `--self-test` passed. The diagnostic `--size-report` loads current art without starting the live pets.
- `npm run build` and `npm run check` passed; derived changes are the Damsel page and System Map. The 36 targeted page/framework tests passed. Headless Edge exercised the actual Damsel page using a fake local adapter: stopped, start, published, stop, no stale saved ON, existing owner report preserved, no JS errors, no 360-pixel overflow. No live Stop action was used.
- Size comparison loaded all 18 distinct source images, toggled before/after and zoom, and passed narrow-screen overflow and script-error checks.
- Full hub suite: 353 tests, 342 passed, 8 failed, 3 skipped. Remaining failures are in browser GPU startup, sandboxed installer prerequisites/registry access, and existing CRLF-sensitive checks. They are recorded explicitly; the suite is not claimed fully green. Baseline confirmation follows below.
- Checked current outstanding-items across the account before proposing integration. Unrelated failing scheduled jobs and stale/conflicting work are not dependencies of this repair. No image assets or other active artwork scope changed.

## Done when

Species size rules preserve artwork aspect ratios, shared human calibration and paired behavior; the whale has a modest upper bound and is the largest individual pet. Damsel shows accurate runtime state and can start/open either presence app. Tests, independent review, approved integration and live acceptance are recorded separately.

## Return

Record exact revisions, commands and results here. Keep local diagnostics private; publish only sanitized evidence.

## Receipt and review

Rules-review agent received and accepted the complete desktop C# implementation at SHA256 `777db51fbd43fd73a38c41440ddfe920edbea702a9aea7db63ff5b8270a0f677`, including fixed hidden command routing, final size caps, aspect ratios and existing shared human calibration. No blocking static findings; root ran the full native self-test separately.

The presence-diagnosis reviewer independently reviewed the Damsel service and UI, ran 11 backend tests and 5 UI tests, and accepted the fixes for unverified timeouts, stale responses and private OS-error messages. Root inspected the visible desktop/phone page evidence and confirmed the live host uses the same canonical page URL, preserving file-page storage. Exact service revision is recorded in its own handoff.

Discord Tower PR 1 service source was received and accepted at `6f08015458a419c53d263673b07c601e4b92e906` (backend SHA256 `bef390b1555e0c10d475ccba52f0da2b8a5db7d5d5e92d3d5193ffb22836fb7f`). The same reviewer accepted hub generator `85479c521140f6152530c0351f44cedccd2c94d4ecf0315f40228bc4d93cc5cc`, shared page JS `bd80565cc5ce6c297ad8a19f1f388b8ac1e54ff944335b6b19524fd9a1c9a914`, companion `f8bfd22271ff6bf1e26cf74fe21899dbcc886ef2e18da3343458dca55208b819`, and companion test `8cb82e1b7948e1b90c12929d8a697820db2f9511f70666efbdc796e78bfcf14d`.

Baseline follow-up: the independent reviewer reproduced the two developer-mode assertion/parsing failures on canonical main `e7bdc5b`. The key-request/Linux failures were CRLF-only checkout differences; restoring those unchanged files to LF made both selected checks pass without any Git content diff. Three installer failures were blocked by the sandbox's Windows PowerShell/registry prerequisites, and the browser test's GPU process exited in the sandbox; their scripts/tests are byte-identical to baseline and no unsandboxed installer rerun was attempted. Six wider-suite baseline/environment failures therefore remain documented, with all feature-specific and desktop checks passing.

The separate junction launcher fix was accepted by root at `652ad169ff1e5799e4dcfd70b0b6a5b27d3e26fc`, with receipt committed as `6f6009e` in AI Discord Presence PR 50.

The owner-reported maintenance flag is preserved for the owner to clear. Merge and live adoption await Astra's explicit approval; the current OpenAI process is restored and publishing, but the new controls and size policy are still the reviewed candidate.
