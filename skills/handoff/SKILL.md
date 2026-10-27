---
name: handoff
description: Coordinate work between Astra's assistants using shared handoff cards, explicit file ownership, delivery evidence and review. Use when handing off work, resuming another assistant's task, coordinating parallel edits, or stopping with work for someone else.
---

# Handoffs

Shared workflow for Codex, Claude and other assistants. OpenAI Codex (GPT-6), 2026-10-20.

Keep durable rules here and in global instructions. Keep current assignments, file ownership,
progress and acceptance in the project's existing shared board or handoff cards. Reuse that
record; do not introduce a competing board or a second `agent-handoff` skill.

## Find and resume the actual work

1. Locate the project, its current instructions and shared record. For GitHub projects, fetch
   without disturbing active edits, inspect relevant branches and PRs, and read the current
   handoff and required project instructions. Keep the live checkout on its current branch
   when programs use it; use the project's approved worktree workflow for isolated edits.
2. Verify the recorded files, revision, output and test evidence exist. Inspect dirty work
   and other assistants' claims before editing. Search relevant remote branches and local
   artifacts before declaring work missing. Read the whole card: its header or index may
   lag later updates, artifacts and Git history. A closed chat or account/plan change does not
   establish that its work was lost or that its owner released the files.
3. Continue from existing deliverables. Rebuild only when evidence shows why they cannot be
   reused or Astra explicitly requests replacement; record what is reusable and the reason
   for replacing anything. A newer card is evidence of progress, not authority to override
   Astra's instructions. Resolve material contradictions before the affected changes.

Use current project assignments. Do not permanently assign implementation to Claude or
review to Codex: choose the implementer and reviewer from the task, available tools/access
and current context. Preserve Astra's explicit choices. Verify identity/workspace when
account-specific work needs it; a paid seat does not prove access, shared memory or migration.

## Claim a bounded scope

Record one implementer, exact writable files or a clearly bounded directory, reviewer (or
`unassigned`), next action and acceptance criteria. Only one active writer owns a file.
Parallel work needs disjoint write scopes. Review is read-only unless an edit scope is
explicitly transferred; the reviewer returns fixes to the implementer otherwise.

For a card, set `status: taken by <assistant/session>` and commit/publish the claim to the
authorized shared location before editing its scope. Recheck other claims and remote state.
Two claims on different branches are not a lock: stop overlapping writes and reconcile them.
Transfer ownership explicitly, with the old writer released and the recipient's acknowledgment.
Silence, an old timestamp, a tool result or editing a card is not acknowledgment.
If the former session is unavailable, use an explicit owner reassignment and check for
uncommitted work before taking over. Astra directly asking you to resume that task counts
as reassignment within her stated scope; do not ask her to repeat it. Still preserve unexplained
edits and reconcile any demonstrably active overlapping writer before changing those files.

## Deliver, receive, then complete

- **IN_PROGRESS:** the named writer works within the claimed scope.
- **READY_FOR_REVIEW:** record an exact commit or artifact version, changed files, test
  commands/results, known gaps and the next reviewer action. Publish to the authorized shared
  location and release the implementation write scope. No implementation writes continue
  during review; explicitly assign that scope back to a writer before making requested fixes.
  Delivery is not completion.
- **Receipt:** the recipient reads the record and artifacts, then records who received which
  revision, when, and the accepted scope/next action. Do not claim another assistant received
  it merely because a file or message was sent. This workflow does not authorize messaging
  another chat or person, scheduling runs, or granting access.
- **Review:** check the delivered revision against the acceptance criteria and record findings
  and verification. Changes after review need review of the changed revision. If no reviewer
  is assigned or available, leave it ready for review and name that gap.
- **DONE:** only after the required review, acceptance and any required integration/deployment
  checks. Record the accepted revision, reviewer, approval and integration evidence. Preserve
  separate approvals required by the project; never infer merge permission from delivery.
  Honor each approval's stated scope: approval limited to one revision does not cover a
  subsequent revision.

On interruption or a blocker, update the same record with completed work, location of partial
artifacts, remaining steps, any running processes and who can act next. Carry existing user
authorization forward; do not make Astra repeat it. Resume by checking that evidence again.

## GitHub card format

For repos using numbered cards, use `handoffs/NNN-short-name-YYYYMMDD.md` (optionally
`-HHMMSS` after the date), where NNN is the number of the pull request that adds the card
(below). Apply Astra's lowercase naming rule and America/Denver time.
Keep existing filenames. Required `SKILL.md`, `AGENTS.md` and `CLAUDE.md` keep their
loader-required names; surface that reserved-name exception before creating a new one.

Keep `status:` and `for:` in the **first six lines**, with these existing statuses:
`open`, `taken by <who>`, `done`. Put detailed workflow state in the body so the Farmer's
reader remains compatible. Descriptive suffixes retain those base statuses. Leave
review-pending work open or taken by its reviewer.
When an owner decision is needed, use `status: open (waiting on Astra: <specific decision>)`.

```markdown
status: open
for: <recipient or any>
from: <assistant and known model/version>, <YYYY-MM-DD>
needs: <current instructions, source files, earlier card>
---
## Task
<One deliverable; current owner request and scope.>
## Ownership and state
State: READY_FOR_REVIEW
Implementer: <session>; writable files: <paths>; ownership: released
Reviewer: <session or unassigned>; next action: <review this revision>
## What I did
<Repos, branches, exact revisions/artifact versions, changed files, tests/results,
published or local-only state, running processes, unfinished work and blockers.>
## Done when
<Observable acceptance criteria, review and required integration checks.>
## Return
<Where the recipient records receipt, review findings, fixes and acceptance evidence.>
## Receipt and review
<Pending until the recipient records the revision read and the review result.>
```

Every card requires `## What I did`; update it on pickup and delivery. Use repo-relative
paths and shareable evidence in public cards. Keep personal absolute paths, private logs,
account details and secrets in an authorized private record, with a safe locator in the card.
For example, identify "private local verification report, available from the owner" without
publishing its personal path. The recipient must obtain access to required evidence before
claiming to have verified it; missing access remains an explicit gap.
Do not claim an unknown model version; identify the assistant/session you can verify.

A new card's number is the number of the pull request that adds it (Astra, 2026-10-21, hub
card 069). Open the pull request first, then name the card `handoffs/<that number>-...` in its
next commit. GitHub hands out the number, so there is nothing to reserve and no shared list to
edit: `handoffs/README.md` gets no row, and the card's own first lines are its status. Cards
numbered before 2026-10-22 keep their numbers; where two of them share one, the card that
reaches `main` first keeps it and the other takes its pull request's number. Branch commits and
PRs are discoverable delivery, but do not claim they are merged or installed.

## Astra's PetOS projects

GitHub is the shared desk for the farm. "Tell the Farmer" means a card in
`findastra/astras-pet-os/handoffs/`, subject to the existing authorization for that work.
The catalog assigns this existing trick to The Farm; provider copies are installations,
not a change of ownership, runtime capability or permissions.
For Pet and Pet Program development, use the current `build-a-pet` skill and the hub's full reading requirements,
including its architecture, migration plan and ownership assignments. Its registration,
framework, security and `cage.submit` rules remain authoritative; do not revive the retired
Cage UI. Resolve these references from the hub root, not this installed skill's folder.

Follow branch/PR and merge rules. Where Astra's explicit merge approval is required,
prepare the reviewed result first, then obtain that approval and perform the approved merge.

## Maintain the two provider installs

The maintained source is `findastra/astras-pet-os`, `skills/handoff/SKILL.md`, normally under
`%USERPROFILE%/Documents/Astra's PetOS/astras-pet-os`. Install the same file at
`%USERPROFILE%/.codex/skills/handoff/SKILL.md` and
`%USERPROFILE%/.claude/skills/handoff/SKILL.md`; never edit bundled/cached plugin skills.
When updating, compare the source revision and installed contents, preserve unrelated local
changes, validate frontmatter and verify both copies match. Report pending source merge
separately from local installation. New sessions can discover the installed skill; an existing
session must read the updated instructions explicitly. Installation alone does not prove it did.
