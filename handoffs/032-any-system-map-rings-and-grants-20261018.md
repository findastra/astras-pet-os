status: open (waiting on Astra: review and merge the pull request; finding 12 needs her decision)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-18
needs: PROTECTION-RINGS.md, system-map.json (`rings`, `access`), scripts/system-map-20261012.mjs, scripts/system-map-template-20261012.html, test/system-map-test-20261012.mjs
---
## What I did
Astra asked to redo the System Map (2026-10-17) and was worried about R W X: the map gave every ring one R W X tag, as
if a ring were a permission and every rule a lock.

- **Rules first (Astra chose option A, 2026-10-17).** A ring says **where a thing lives** and grants nothing. R W X lives
  on **grants**: who, on what, R W X, and a status: **enforced**, **written only** or **planned**. The 12 grants are in
  `system-map.json` (`access`). `npm run build` writes them and the ring list into [PROTECTION-RINGS.md](../PROTECTION-RINGS.md)
  between markers, so the page and the map cannot disagree; a test fails if they do. Known gap 4 now reads "accepted
  risk" (Astra, 2026-10-17); gap 13 records the old ring tags. The farm-security skill (section 1), two dev-mindset
  glossary rows and an ASTRAS_PET_OS amendment say the same.
- **Honest statuses.** Most rules are written only: agents work on Astra's own account and `main` has no branch
  protection. Enforced: Astra's own rights, the Farmer's round opening a pull request (guarded by a test), and Claude
  Code and Codex asking before commands or files outside the project folder.
- **The map** keeps its address and every `#node=` link. The nested spheres stay (Astra's design). Names are placed by
  importance and only where they fit, so none overlap. Lines stay faint until you point at something ("Every line
  bright" turns them all on). Every card shows **Who may use it** and **What it may use**: R W X boxes and the status,
  opening to how it holds, what is planned next and the known gaps. Clicking a ring in the key opens its card: everything
  on it and the grants that reach it. The naming box sits in the key panel instead of covering the map. The opening view
  fits the window: beside the panel on a computer, below it on a phone.
- **2D | 3D** (Astra, 2026-10-18): the map opens in 3D (nested spheres). A 2D | 3D switch in the bottom bar, just right of
  Spin, folds every sphere flat into a circle on the ground and back, in a smooth 1.2-second fold: lines bend, the decor crossfades, every
  node keeps its direction, and the camera stays on the selected node. Astra compared three private previews (spheres,
  flat rings, spheres that fold flat) and chose the third.
- **Groups** (Astra, 2026-10-18): the 13 trackers, 4 base stations and 2 controllers are groups, not devices of their
  own. A line drawn to a group reaches each member, so every tracker connects to SteamVR, Space Calibrator, Double Hip
  Tracker, OVR Smooth Tracking and its own 2.4 GHz dongle on the PC, and feeds VRChat full-body tracking (Astra); a line between two groups (base stations to
  trackers, a new `tracking` kind) stays one line. The group itself is an invisible, clickable centre with its name.
- **Claude Code and Codex are rings around their AI** (Astra, 2026-10-18): thin rings around Claude (Anthropic) and
  OpenAI. A line to the agent app ends on its ring; a direct model call goes straight to the planet. The donut seat on top
  of the glass is gone.
- **Pet program names come from pet-programs.json.** Map nodes carry their program number. This fixed File Kingdom,
  Unity Stable, Audio Rescue, Fuzzboi Factory and Dubstep Armory (they showed as `pet-program-#`). Every registered or
  pipeline pet's program is on the map now (25 added), except the private pets' (health-hummy, finance-finch,
  meme-fiend): they send nothing, so their programs stay off. `scripts/name-list-20261016.mjs` now checks these nodes.
- **Tests:** five new ones in `test/system-map-test-20261012.mjs` (rings, animals, grants and their statuses, the
  PROTECTION-RINGS.md tables, program names).
- **Pictures:** `docs/images/astras-pet-os-system-map-20261018.png` (whole map) and
  `docs/images/astras-pet-os-system-map-grants-20261018.png` (Claude Code's card), in the README. The older map pictures
  are left in place, since other pages may link them.
- On Astra's PC nothing in the project folder changed: the work was in a worktree in Claude's temp folder.

## Decisions
- **Option A** (Astra, 2026-10-17): rings show where things live; R W X moves onto grants; each card says whether a rule
  is enforced, written only or planned.
- **Spheres, with a ring around each AI** (Astra, 2026-10-18): not flat rings, and no big seat ring on the glass.
- **Version 3 by default, with a 2D | 3D switch** (Astra, 2026-10-18), in the bottom bar just right of the other view
  buttons; the fold is smooth and follows the selected node.
- **Trackers connect to what uses them** (Astra, 2026-10-18), not to a "13 trackers" node.

## What is not done
0. Which body spot each tracker is on is still Astra's to label.
1. **Codex's PR #23 chain** (with #26 merged into it) rewrites PROTECTION-RINGS.md as "topology is not authority" and
   changes this template (provider planets, optional rings). Option A replaces its PROTECTION-RINGS.md rewrite; its
   reference verifier (`scripts/access-policy-20261014.mjs`) fits as a tested prototype for the planned Iron Gates
   grants. Whichever merges second keeps option A and runs `npm run build`.
2. **Finding 12 / known gap 12:** the public map still names about a hundred devices and programs. The item list is in
   the public `system-map.json`, so hiding items on the page alone would not help. Astra decides whether item-level data
   moves to a file kept on the PC.
3. **PR #36 (Fuzzboi Factory)** renames the `fuzzbois-site` node: after it merges, run `npm run build`.
4. Card 032 is listed in `handoffs/README.md`, and the next free number is now 033. Open pull requests that also edit that
   table may conflict there; keep every row.

## Done when
The pull request is merged and the live map shows the spheres with grants on every card.

## Return
Update `## What I did`, set `status: done`, commit on a branch.
