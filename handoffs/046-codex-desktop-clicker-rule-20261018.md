status: open
for: codex
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-18
needs: PET-PROGRAM-FRAMEWORK.md (section 3, item 8), docs/flash-audit-20261014.md (A41), handoffs/044-any-pet-program-spawner-20261018.md, scripts/desktop-pets-20261011.cs (`PetClicks`, `ResolveClicks`, `OpenPet`), docs/tray-star-handoff-20261011.md
---
## What I did

Astra, 2026-10-18: "the clicker training first 2 clicks are the same across the board, and starting at 3 they can be
tool assigned. so 1 click shows the current reminder dialog box (blurb like BSOD does) which has yet to be created as a
compoinent, and, 2 clicks opens/closes the pet program."

- On branch `claude/clicker-rule-20261018` of astras-pet-os (its pull request is linked from the commit): the rule in
  PET-PROGRAM-FRAMEWORK.md section 3 item 8 (it said "three clicks: refresh the tools and the tool list", which
  disagreed with A41 and with Astra), the Tool row in `skills/dev-mindset`, and the clicker-training box on all 38
  pet program pages (`scripts/pet-program-pages-20261018.mjs`; `apps/pet-programs/`). Card 044, task 1, is answered.
- Read, not changed: `scripts/desktop-pets-20261011.cs` (yours; PLAN.md "Who edits what"). Today, in `ResolveClicks`:
  one click does nothing, except Voicemeeter Bug, where it runs `--repair`; two clicks call `OpenPet`, which opens
  `interface_url` (each pet's old app page) and never closes it; three clicks only reroll Fuzzboi Friend's body style.
  The star keeps its own clicks (one: hide or show the pets; two: line up or roam); this rule is about pets.

## Task (Codex)

Make the desktop pets follow the rule, the same for every pet:

1. **Two clicks open or close the pet program:** its page `apps/pet-programs/<repo>-20261018.html` in the hub (a page
   that must work by double-click), not `interface_url`. A second double-click closes the window it opened: track the
   window you start (for example a dedicated browser app window) and close only that one. The Farmer's two clicks open
   The Farm's page the same way. Voicemeeter Bug's `--status` window is today's app; its program page now has an
   "Open today's app" button.
2. **One click shows the current reminder in a dialog box,** a blurb like BSOD's. That dialog is a new component; it
   is not built anywhere yet. PET-WORDS.md has the **bubble** (a short one-way line over the pet); whether the dialog is
   the bubble or a new part with its own name is Astra's word, so ask before naming it. Its text: the pet's most
   urgent need from `status/pets-status.json` (`needs`), else its mood line, as A41 says.
3. **Three clicks or more run assigned tools.** Fuzzboi Friend's body-style reroll stays on three clicks. **Voicemeeter
   Bug's one-click repair has to move** (one click is the reminder for every pet): to three clicks, unless Astra says
   otherwise. Ask her in chat, since it changes what her click does today.
4. Keep `PetClicks`' disambiguation, drag suppression and the cross-pet cancel, and add self-test cases for 1, 2
   (open, then close) and 3 clicks. Rebuild and run `--self-test` as card 031/032 describe. Do not restart Astra's
   running star yourself; she starts it.

## Done when

On Astra's desktop, one click on any pet shows its reminder dialog, two clicks open and then close its program page,
three clicks run its assigned tool or nothing, and the self-test covers all three.

## Return

Update `## What I did` with the commit, the self-test output and what Astra answered, set `status: done`, commit.
