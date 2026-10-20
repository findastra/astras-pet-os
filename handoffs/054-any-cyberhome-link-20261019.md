status: open (waiting on Astra: OK to merge; then the six questions below, first of all the link in Startup Star)
for: any (the desktop parts: whoever builds the desktop pets, Claude or Codex)
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-19
needs: PET-PROGRAM-FRAMEWORK.md (section 3, items 1 and 10, and "Activity lights"), scripts/pet-program-pages-20261018.mjs, apps/pet-programs/pet-program-page-20261018.js, scripts/desktop-pets-20261011.cs, scripts/pet-dock-tracker-20261011.cs, skills/farm-security
---
## What I did

Astra, 2026-10-19, looking at Python Jungle's page: the cyberhome should be **empty until the page opens, then the pet
migrates up into it** from wherever it is (roaming, lined up, or not shown at all, when Startup Star opens and lets it
out). She also asked for a chat window that opens at once and connects to whatever agent the person has, and for lights
that show which level is working: "L4 should always be on when I'm on". She said yes to building first the parts that
need no link to the PC.

On branch `claude/cyberhome-chat-20261019` of astras-pet-os (its pull request is linked from this card's commit), made
in a clone in Claude's scratchpad so the live hub folder stayed as it was:
- **The cyberhome:** every spawned page starts with an empty den and Startup Star's door in its top corner (an inline
  drawing of the yellow star with small rectangle eyes, so no picture file). When the page opens the star opens, the
  pet comes in, the star closes, and the bubble says it came in through the star. "Reduce motion" skips the flight.
  Pets with no art bring their no-picture box.
- **Activity lights:** L4 is on (green, and its tool panel glows) while the page is in front of you and you used it in the
  last two minutes, dim after two quiet minutes, off while the page is hidden. L1 to L3 are grey and say "not connected
  yet: it needs Startup Star's link". The script finds the level tool panels by their label pattern
  (`-L4-tool-panel` since #129, which merged while this was open).
- **The chat window:** the chat button opens it at once with the cursor in the box. It asks who should answer: **My
  Claude** or **My ChatGPT** (a new tab opens claude.ai or chatgpt.com with the message and the pet program's name typed
  in; the message is copied too, in case that box is empty), **Claude Code or Codex on this PC** (not built: the message
  waits in the backlog), or **Just leave a note** (the backlog). It remembers the choice on this device, refuses while
  the chat's left light is off, keeps no keys and sends nothing itself. Private pets (Health Hummy, Finance Finch) warn
  that a message to Claude or ChatGPT leaves the PC; private repos are never named in the message.
- **Docs:** PET-PROGRAM-FRAMEWORK.md items 1 and 10 and a new "Activity lights" paragraph (the "what the activity light
  means" item is gone from "Waiting on Astra"), an AGENTS.md credit line, this card.
- **Tests:** new `test/cyberhome-chat-test-20261019.mjs` (10 tests) runs the page script against a pretend page:
  the arrival steps, reduced motion, L4 live, idle, off, the chat window, the claude.ai and chatgpt.com links, the
  switched-off chat, the backlog, private repos. `npm test` in an LF clone: 193 tests, 192 pass, 0 fail, 1 skipped
  (the Pets Board); `npm run check` OK.
- **Checked:** the browser pane on a local-only server (127.0.0.1) showed the empty cyberhome, the arrival and the
  glowing L4 panel; headless Edge at 1280 by 900 and 390 by 760 showed the same and the open chat window, with no page
  errors. The claude.ai `?q=` and chatgpt.com `?q=` links are not documented by Anthropic or OpenAI and were not tried
  with Astra's accounts: the copied message is the fallback.
- On Astra's PC: nothing changed.

## Task

1. **The live link (waits on Astra's OK; a new way into the farm, so L4 approves it first).** Startup Star serves the
   pet program pages from this PC (127.0.0.1 only) and keeps a two-way connection to each open page. Page and star then
   share one origin, so Brave and Chrome need no permission prompt (Brave lets a page served from the PC reach the PC).
   It accepts only the farm's own pages and only these messages: the page is open and where its cyberhome is, the pet
   arrived, the page is closing, the page's mood; it never runs anything a page sends. Agents start only as the L3
   switch allows. Its port stays out of the hub's public files (the hub's privacy test checks it). Record it as a tool
   of The Farm (Startup Star) in `system-map.json` with its grant.
2. **The desktop flight** (after 1), in `scripts/desktop-pets-20261011.cs`. The page says where its cyberhome is. The star
   checks the exact spot with the UI Automation reading it already uses to dock beside BSOD
   (`scripts/pet-dock-tracker-20261011.cs`), so zoom and screen scaling are right. Then:
   roaming, the pet stops and flies into the box; lined up, it hops out and its spot stays open with a small star;
   hidden, the star comes out, opens, lets the pet out, and goes back. When the pet lands, the desktop window hides and
   the page shows it (the page's arrival, without the star step). When the page closes, the pet goes back to its spot.
   If the browser crashes, the star brings it back after a few seconds. No flying across the screen while a
   full-screen game (VRChat) is in front.
3. **L1 to L3 activity** (after 1): L1 from the process list and each tool's run records, L2 from the farm event log
   (Log Den's record format) and connection data arriving, L3 from the chat it started and from Claude Code or Codex
   working in the pet's repo folder (the way Discord Damsel's presence tools already detect the model and project).
4. **The chat on this PC** (after 1): "Claude Code or Codex on this PC" starts that harness in the pet's folder as the
   seat, streams replies into the window, and lights L3. Never route Astra's Max account through a proxy or a shared bot.
5. **Room art people can change** (waits on Astra's answer 5): layers (wall, floor, a bed or perch where it sleeps, two
   or three decor spots, a neon accent colour), a Decorate button, saved per pet with export (framework section 6).

### Questions for Astra (asked in chat, 2026-10-19)

1. Build the live link in Startup Star?
2. When you switch to another tab, does the pet stay home, or come back to the desktop?
3. The L3 switch as Block / Ask / Allow, with Ask as the default?
4. A switch, a "report a problem" button and the glow, replacing the two dots?
5. First room art: one shared room recoloured, or one room per home?
6. The cyberhome is the box where the pet lives: record it, and fix the `skills/dev-mindset` row that says the cyberhome
   is the whole pet program (card 047, task 5)?

## Done when

The pet flies in from the desktop and back, L1 to L3 light up from real activity, and the chat reaches an agent on this
PC, each with Astra's OK.

## Return

Update `## What I did` with each repo, pull request and commit; set `status: done`; commit on a branch.
