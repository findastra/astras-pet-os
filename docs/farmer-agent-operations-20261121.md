# The Farm — agent operations and HAZOP-inspired review
By Astra. Working specification, 2026-11-21. **Proposed tools are not claimed to run.** The dependency analyzer named below is the first read-only implementation.

## Purpose
The Farm is a *whole-life infrastructure control plane*, not a personal/work partition. Pet programs remain independent control hubs, following the existing pet template. The Farmer synthesizes health, reliability and cross-pet impact; he does not take over the specialist pets' work or permission boundaries.

## Reuse before building
| Existing owner/capability | Reuse; do not duplicate | Farmer addition |
| --- | --- | --- |
| `pets.json needs`, farm-pets and farm lock | Canonical required/optional pet, core, program and OS needs, package resolution and install state | `farm-dependency-impact`: graph, transitive dependents, cycles, missing references, shared dependency hotspots. **Read-only first version implemented** at `scripts/farm-dependency-impact-20261121.mjs`; not yet attached to the UI |
| System Map `relations` and per-pet related-pets / connection boxes | Who talks to whom (not necessarily an install requirement) | View dependency vs communication as distinct edge types, never infer required dependency from a connection |
| Log Lynx (Log Den) | Owns event format, logs, heartbeats, crash detection | `farm-pulse`: aggregate existing signals into timestamped health, error and stale-data status; must say unknown when no measurement exists |
| Agent Ant (Agent Colony) and individual pet tests | Own experiments and task-level evaluation | `farm-reliability-lab`: Farmer's qualification scorecard consuming signed/reproducible test results; experiment execution stays with owner |
| Flash Audit, Idle Flash Audit, `click-check` | Existing numbered checks, interactive decisions, functional button/link testing | `flash-audit-impact-view`: rank existing check IDs by risk and number of downstream affected pets; never renumber or silently reorder canonical matrix |
| broken-tools-on-the-farm and pet sick/maintenance lights | Existing defect queues and user signals | Orange **Needs attention** is an intake signal; agent investigates and proposes evidence-backed cause, never silently declares what the human meant |
| Iron Gates / Gatekeeper Goddess and Pet Police Officer | Permissions, approvals, security monitoring and isolation | Farmer displays *status only*; cannot grant, approve, or contain |
| Forensic Ferret | Case investigation and custody | `failure-investigator` is a dispatch/view linking existing cases, not a second evidence store |

## New Farmer tools and sequence
1. **farm-dependency-impact** — deterministic, read-only, consumes `pets.json`; implemented CLI v0 on this branch. Add System Map link and each pet's **Dependencies** panel in the page generator after checking existing UI, with *required*, *optional*, *communication*, *core*, *3rd party*, and *unknown* clearly distinct. A single canonical source; do not copy the dependency list into each HTML page manually.
2. **farm-pulse** — read-only aggregate view: heartbeat age, last observation time, task completion ratio with sample size, p50/p95 duration, failure categories, missing telemetry. No fabricated scores. Log Lynx supplies events; Farmer displays computed summary.
3. **farm-reliability-lab** — catalogue test suites, baseline/edited versions, repeated attempts, pass/fail, regression rates, model and template versions, independent checker findings. Agent Ant executes evaluations; Farmer gates promotion reporting only.
4. **agent-hazop** — structured, *human-reviewed* hazard/operability worksheet for each node of the farm: design intent, parameter, guide word, deviation, causes, consequences, safeguards with evidence, recommendations, owner, disposition and signoff. Suggested scenarios are hypotheses, not verified hazards or safeguards.
5. **handoff-inspector**, **change-impact**, **coordination-optimizer** — reuse test evidence, dependency graph and agent handoff cards; never build new event or grant registries.
6. **flash-audit-impact-view** — a derived presentation ordering, not a replacement for the audited check IDs. Put high-risk/high-propagation failures first for early value; retain the official matrix order as a selectable alternative.

## Priority and evidence
Suggested risk-first sort (not a safety certification):
`priority = severity × likelihood × detectability × (1 + verified downstream dependent count)`.
The first three inputs require documented assessor-selected scales (e.g., 1–5), with *unknown* scored as unassessed rather than zero; use capped propagation multiplier if the graph is large. Never infer hazard frequency from an LLM. Stable tie-breaker: existing Flash Audit ID. Also support fast-first mode (quick deterministic checks), but default to severe/high-propagation safeguards first.

## Orange light interaction
**Blue** = existing maintenance status; do not silently repurpose. A distinct orange **Needs attention** request enters the normal notes/backlog with optional text and evidence. The Farmer may gather diagnostics and suggest a reason. Only the owner clears the user's signal. No security action is performed based solely on a color.

## Agent HAZOP worksheet schema
`node_id`, `source_revision`, `design_intent`, `parameter`, `guide_word`, `deviation`, `cause`, `consequence`, `safeguard`, `safeguard_verified`, `recommendation`, `owner`, `review_status`, `reviewer`, `evidence_links`, `last_updated`.
Review statuses: draft / awaiting SME / reviewed / rejected. A hazard is not a safe operating conclusion merely because an LLM populated a row.

## Industrial HAZOP product concept (separate from the Farmer)
The Farm's `agent-hazop` reviews **agentic software processes**. A future purpose-built process-safety product would need versioned P&IDs, equipment/tag graph and node boundaries, guide-word matrix, assumptions and operating modes, process simulation adapters (DWSIM first), deterministic consequence rules, document control, multi-person review and audit trails. An AI assistant lives **inside** the system; it cannot replace a qualified facilitator or safety engineer. Do not claim regulatory compliance or automate approval. No new repo created.

## Acceptance before UI integration
- Read-only script produces stable output and handles all declared pet records.
- Graph distinguishes required/optional and communication edges; no made-up links.
- Cycle checks, transitive reachability and unknown dependency references have tests.
- Existing Flash Audit labels, IDs, lights and ordering remain intact.
- No new storage of private health, finance, employer or process-safety data in public GitHub.
- Dashboard links to a tested real result, never to a nonfunctional ON/OFF switch.
- Maker/checker review, tests and Astra's merge approval before production.
