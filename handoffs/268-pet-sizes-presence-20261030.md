status: taken by Codex (Damsel-only integration)
for: Codex
from: OpenAI Codex (GPT-6), 2026-10-30
needs: current hub rules, PR 268, Discord Tower PR 1, AI Discord Presence PR 50
---
## Task

Restore working OpenAI presence and provide accurate status and start/open controls for OpenAI and Anthropic in Discord Damsel.

## Ownership and state

State: IN_PROGRESS - narrowed integration review.

Implementer: root presence session, owning the previously claimed desktop hook, Damsel UI and generated page scope, this card and change record. Previous delegated implementation scope has been released and received. Reviewer: rules-review agent for narrowed desktop code; presence-diagnosis agent and root for the accepted service/UI. One active writer per file.

Astra's latest direction: "Don't worry about any of the pet stuff. Did you fix the AI Discord presence and did you fix the Discord Damosel? Please pull them up." Root is proceeding only with the requested presence/Damsel repair and opening. All sizing code, diagnostics and policy documentation are removed from the integration candidate. Historical uninstalled sizing proposal remains in commit c265417; it is not adopted.

## What I did

- Confirmed both companion servers were stopped despite saved ON indicators. Restored OpenAI from the real installation path: Automatic mode, connected, activity published and acknowledged by Discord. The visible Discord profile itself has not been inspected.
- Presence PR 50 fixes launcher entry detection through the old Windows directory junction. Root accepted source 652ad169ff1e5799e4dcfd70b0b6a5b27d3e26fc, receipt 6f6009e. All 108 tests passed, including red-before/green-after junction regressions; both required bundles were rebuilt and audited.
- Discord Tower PR 1 supplies the local fixed allowlisted launcher/status service. Accepted source 6f08015458a419c53d263673b07c601e4b92e906; backend SHA256 bef390b1555e0c10d475ccba52f0da2b8a5db7d5d5e92d3d5193ffb22836fb7f. Full 70 tests passed; independent review reran 11 backend tests and 5 UI tests.
- Damsel has visible Start and open, Open controls and Stop sharing actions, live publishing lights, guarded local-only control links, and a fixed hidden desktop launcher. Existing notes and reported maintenance state are preserved at the same canonical page URL.
- Hub build/check and 36 targeted UI/framework tests passed. Actual generated-page browser checks exercised stopped/start/published/stop, stale status protection, retained maintenance report, no JavaScript errors and no overflow at 360 pixels. Live Stop was not used.
- Full wider suite had six remaining unrelated baseline/environment failures after line-ending-only fixes: two developer-mode assertions reproduced on canonical main e7bdc5b, three sandboxed installer prerequisite/registry failures, one sandbox browser GPU startup failure. Their scripts are unchanged; no unsandboxed installer tests were run. The entire broad suite is not claimed green.
- Removed the previous sizing implementation at the owner's direction. Only the Damsel launch helper, double-click route and its self-test remain in desktop code. No artwork changes, size changes or size-report mode are part of this revision.

## Done when

The narrowed source has passed review and appropriate checks, the installed Damsel can start/open both companions and truthfully report publishing, and OpenAI remains connected and publishing. Open the requested Damsel and OpenAI panels. Record source adoption and remaining visual verification limits truthfully.

## Return

Record exact accepted revisions, review, integration and live checks here. Keep private paths, runtime access codes and owner notes out of public records.

## Receipt and review

Prior independent service/UI review accepted safe installation checks, sanitized errors and stale-response handling. Accepted hub generator SHA256 85479c521140f6152530c0351f44cedccd2c94d4ecf0315f40228bc4d93cc5cc; shared page JavaScript bd80565cc5ce6c297ad8a19f1f388b8ac1e54ff944335b6b19524fd9a1c9a914; companion f8bfd22271ff6bf1e26cf74fe21899dbcc886ef2e18da3343458dca55208b819; companion test 8cb82e1b7948e1b90c12929d8a697820db2f9511f70666efbdc796e78bfcf14d. These files are unchanged by narrowing.

Narrowed desktop review and integration checks follow below. The owner-reported maintenance flag remains available for the owner to clear.

Narrowed desktop review accepted SHA256 e4f544eccb719f5b64cca5fb65afa8e648ea987f851043dda6c72f46bd22095a. Reviewer verified the exact diff contains only the Damsel helper, fixed hidden launch route and self-test; no sizing, diagnostics, preview or encoding changes. Root rebuilt that exact source and the full native self-test passed; all five UI tests passed again. Implementation scope released for integration.
