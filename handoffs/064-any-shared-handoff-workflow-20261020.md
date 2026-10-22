status: open
for: any
from: OpenAI Codex (GPT-6), 2026-10-20
needs: skills/handoff/SKILL.md, AGENTS.md, CLAUDE.md, handoffs/README.md
---
## Task

Make the existing shared handoff workflow durable for Codex and Claude, with global routing,
matching personal installations, explicit file ownership, reuse of prior work and verified
receipt/review. Preserve each project's assignments and The Farm's existing ownership of
the handoff trick.

## Ownership and state

State: READY_FOR_REVIEW
Implementer: Codex, shared handoff workflow session.
Writable scope: skills/handoff/SKILL.md, the handoff routing in AGENTS.md and CLAUDE.md,
this card and its index/reservation. Local scope: the two providers' personal handoff
installations and global instructions.
Implementation write scope: released.
Reviewer: independent Codex instruction review and scenario evaluation completed.
Owner approval: Astra, 2026-10-20, "merge what you can and leave a note we are ending this chat".
Next action: publish, merge the reviewed source and record the verified merge before closing.

## What I did

- Source: findastra/astras-pet-os, branch `codex/handoff-workflow-20261020`, based on
  `1c64d69486eb83f9027c6df9d26cb0b0822be58e`; not merged.
  Reviewed implementation revision: `214357834690c57e58dd8e5346bfd8f50a952135`.
- Updated the existing handoff skill, retaining the card reader's status format and first-six-line
  metadata. Added bounded claims, one writer per file, recipient acknowledgment, exact revision
  delivery, review/acceptance, interrupted-work recovery and evidence-based reuse.
- Kept dynamic assignments in project records. Removed stale Cage UI references and replaced
  public personal-path requirements with private evidence records and portable locators.
- Added short routing to AGENTS.md and CLAUDE.md; no new workflow name, taxonomy change,
  runtime, registry, permission grant or generated file changes.
- Installed identical personal copies for Codex and Claude. Updated their global instructions
  to route here; preserved Codex's existing filename rule and added the same rule to Claude.
  Scoped installation checked original hashes before writing and verified resulting hashes.
  Existing global files were backed up privately.
- Independent instruction review found two older Claude global-rule conflicts (undated card
  example and a blanket stop for unrelated dirty work); both were corrected.
- Behavioral evaluation covered interrupted work with dirty files, unacknowledged delivery,
  a changed revision after review, an unrelated question and private evidence in public cards.
  It prompted explicit guidance for owner reassignment, releasing/reclaiming write scope and
  revision-specific approval.
- Targeted card-number and Farmer reader tests passed before delivery. The full suite on the
  unchanged `dcd5d81` baseline had 264 tests: 252 passed, 11 failed, 1 skipped. The implementation
  run reproduced those failures plus an unindexed new card after rebasing. The card index and
  reservation were then corrected and the targeted tests rerun; no product code changed.
- Baseline failures concern the browser GPU, developer-mode generated output and installer,
  farm setup installer, Linux menu entries, and generated registry/docs or CRLF comparisons.
  These are existing failures, not a clean full-suite pass. They remain outside this change.
- The bundled Python skill validator could not run because PyYAML is absent. Frontmatter was
  reviewed directly, and Codex's refreshed skill catalog discovered the installed `handoff`.
  Source and both personal installations have SHA-256
  `CF8019832BA03DD810D7E8E898BA7FCB89FC8F2BDB4A7D062B60A7B25DA51A9B`.
- Local evidence, exact private paths and installation hashes remain in the originating chat's
  private verification record. No service was rebuilt or restarted; the live checkout and its
  unrelated untracked files were preserved.
- Installation is verified. Reception by other already-running chats is not verified; they
  must read the updated rules explicitly. No messages were sent to other chats.

## Done when

The two installed copies match the reviewed skill; global routing and filename rules are
present; the existing reader remains compatible; the reviewed source branch is merged with
Astra's explicit approval. Any receiving assistant records the revision it actually read
before claiming receipt.

## Return

Record the reviewed source revision, checks, approval and merge commit here. Preserve the
private installation details in the originating chat. After approval, the acting assistant
merges and checks the source; Astra does not need to perform GitHub clicks.

## Receipt and review

Independent instruction review completed; the two identified global-rule conflicts were fixed.
Codex scenario reviewer explicitly received the skill at the SHA-256 above on 2026-10-20 and
approved its written behavior with no remaining blocker. The baseline reviewer also explicitly
read the installed skill. These receipts cover those review sessions, not unrelated ongoing
Codex or Claude chats.

Astra authorized the merge and this closing note on 2026-10-20. Merge verification is pending.
The chat is ending; source, installed rules and evidence above are the restart point.
