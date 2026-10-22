status: open (waiting on Astra: merge the hub pull request; her answer on what a trick is; the tray part is in progress)
for: any
from: Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-21
needs: PET-PROGRAM-FRAMEWORK.md (section 3), scripts/pet-program-pages-20261018.mjs, apps/pet-programs/pet-program-page-20261018.css and .js, test/pet-program-pages-test-20261018.mjs, handoffs/045-any-crash-watch-pets-20261018.md
---
## What I did

Astra, 2026-10-21: a marked-up screenshot of Unity Stable's pet program page (Unity Unicorn's), with notes for every
pet program page and one about the tray. Her four answers came from the slides
[Unity Stable notes: 4 questions](https://claude.ai/artifact/QBEAZZWjBXevnxmDo16dVh): "1. A, 2. A I think ... More on
this, 3. B, 4. A".

**Every pet program page** (branch `claude/page-notes-unity-stable-20261021` of astras-pet-os, made in a worktree in
Claude's scratchpad; the live hub folder stayed on `main`):
- The cyberhome and the System Map box are always **squares**. Beside the title their side is the title column's
  height (210 to 260px, set by the page script; 220px without it); too narrow, the two sit side by side with the title
  below both; narrower than 340px, they stack.
- **No bubble in the cyberhome** ("get rid of this entirely; select from 9 emotions at bottom what to 'light up'"):
  the mood the pet is in lights up in `<pet>-emotions` (idle, awake, sad are the ones the page knows); one click on
  the pet shows the reminder in the lights' small bubble.
- Labels: `astras-pet-os-system-map` (the hub's map) and `<home>-quick-summary`; the node id under the map link is gone.
- Title: name and version on one line, then the version on its own line below when too narrow. **Versions**:
  pets.json `version` for all 42 pets, 22 from their own pet.json on GitHub, 20 (no version there) start at 0.1.0 with
  `version_assigned: true`; the Farmer's round copies a pet.json version from now on (`adoptVersion` in
  scripts/farmer-rounds-20261009.mjs, tested in test/rounds-test-20261009.mjs).
- **Open app** instead of "Open today's app"; **no Repo button** (answer 1: A); the repo stays in the footer and passport.
- Unity Stable's quick summary is Astra's own words (pet-programs.json, `reviewed: true`). "A working closet by
  Devilish" is Dev's closet, still draft findastra/unity-unicorn#27.
- Lights: the ON/OFF light is never grey; something not built yet is off and says so when clicked, and only its
  maintenance light is grey ("not checked yet"). Every level tool panel (and a pet's own tool panels with an activity
  light) has its paired lights left of its label, in the border line; the activity light stays after the label.
- Pills: the lights sit in the top border, left of the name; one line under the name says what it does.
- Headings count what they hold: `3rd party programs · 5`, `Native programs · 1`, `Native tools · N` (or the avatar
  and world sides), `Native tricks · N`.
- **What every program does**: a `does` line on all 82 program and native program nodes in system-map.json (58 + 24),
  Astra's own words for VRChat and Unity Hub. Audit found one wrong description: OVR Pager is a walkie-talkie for
  voice messages (its READ-ME-FIRST.txt in `C:\Program Files\OVRPager`), not a notification viewer; its job is fixed.
- Developer mode's words follow the new label (`-quick-summary` becomes `-summary`).
- Docs: PET-PROGRAM-FRAMEWORK.md section 3, PET-WORDS.md, README.md ("Open app"), AGENTS.md (built-with line).
- Checked: `npm run build`, `npm test` 281 pass, 0 fail, 1 skipped, `npm run check` OK, in an LF worktree. In the
  browser pane (a temporary node server on 127.0.0.1:49771 serving the worktree): Unity Stable at 1440, 900 and 375px
  wide (squares 210, 240 and 165px; nothing wider than the phone screen), the idle mood lit, awake after a click, a
  planned light's bubble, the L1 panel's ON/OFF switching off without folding the panel, the pet's reminder. Test
  marks were cleared from that browser's storage afterwards.

The underline Astra saw on cloud-physics-check was her pointer resting on it: every name underlines when pointed at;
none is a direct link. Nothing changed for it.

## Still open

1. **What a trick is** (her answer 2, "A I think ... A trick can be a WAY a tool is used too. What was it before?").
   Explained in chat: before, a tool is code that runs alone; a trick is the steps the pet's seated AI follows with
   that pet's tools. Proposed, waiting on her word: "a trick is a way of using the pet's tools (steps in order); it runs
   on the pet's schedule (L2) or the seated AI follows it (L3)". Nothing changed in AGENTS.md, TOOLS-AND-TRICKS.md,
   PET-WORDS.md or the skills yet.
2. **The tray** (her note: "these are not supposed to be in the tray. only the Startup Star should ever be in the
   tray. please fix the recent change that directed this"). The recent change is card 045, which built Log Lynx, Packet
   Piranha and Forensic Ferret as tray programs. Answers: 3 B (no pop-up: Log Lynx turns alarmed on the desktop) and
   4 A (Voicemeeter Bug's tray icon goes too; his menu moves into Startup Star's). In progress in this chat.
3. Open hub pull requests that touch the same spawner lines: #167 (private repos: "Today's app is private" and the
   Repo button's private label) and #177 (Codex's Damsel archive panel). Whichever merges second merges `main` in.

## Return

Merge the hub pull request with Astra's OK, then set this card done or hand the open items on.
