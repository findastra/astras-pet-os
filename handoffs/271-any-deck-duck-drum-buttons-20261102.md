status: open (for whoever is building Deck Duck's program)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-11-02
needs: Deck Duck's program (Deck Pond, #32) as it is being made now; Bass & Biscuits' APC64 deck and kit tool (this PR, #271)
---
## Task

Astra, 2026-11-02, about her Elgato Stream Deck: "can we add a button to the stream deck that just starts up the drum
instantly so I can play? How should we integrate a random sounds button", then "coordinate with the deck duck. its
program is being made now."

Deck Duck owns the Stream Deck, so the buttons belong to Deck Pond. Bass & Biscuits only supplies the addresses they
open. Please add these two buttons wherever Deck Pond keeps its Stream Deck buttons:

| Button | Stream Deck action | Opens |
|---|---|---|
| **Drums** | Website | `https://findastra.github.io/astras-pet-os/apps/drum-dog-apc64-deck-20261102.html` (the APC64 deck, ready to tap) |
| **Surprise kit** | Website | the same address plus `?kit=surprise` (the deck picks one of Astra's drum kits at random) |

Bass & Biscuits' page also shows the deck at
`https://findastra.github.io/astras-pet-os/apps/pet-programs/drum-dog-20261018.html#apc64-deck-guide-tool-panel`. The
deck page on its own opens faster and fills the window, so it is the better target for a button.

## Ownership and state

State: open. Nothing has been written in findastra/deck-duck. That repo's checkout on Astra's PC is on Codex's branch
`codex/l3-activity-20261016` and has uncommitted art, so it is left untouched.
Bass & Biscuits side: Claude, this PR, which owns `apps/drum-dog-*-20261102.*`. Deck Pond side: whoever is building it
now; it writes only in its own repo.

## What I did

- findastra/astras-pet-os#271 (branch `claude/learn-apc64-tool-20261102`) adds:
  - `apps/drum-dog-apc64-deck-20261102.html`, the deck;
  - `apps/drum-dog-apc64-drum-kits-20261102.html`, the kit tool (apc64-drum-kit-tool);
  - `apps/drum-dog-drum-sounds-20261102.js`, their shared sounds and kits.
- The deck reads `?kit=surprise` and picks a random kit. The addresses above work only after #271 merges, since that
  is when GitHub Pages publishes them.
- No Stream Deck profile, plugin or file was made. No Stream Deck app was found in this PC's installed-app list on
  2026-11-02, so it may need installing or may be on another computer.

## Done when

Pressing **Drums** on Astra's Stream Deck opens the deck, and **Surprise kit** opens it on a random kit. Astra presses
both herself.

## Return

Record receipt, the Deck Pond revision and the button test here, or in Deck Pond's own record with a link back to
this card.

## Receipt and review

Pending.
