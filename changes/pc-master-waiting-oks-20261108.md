# PC Master Race's waiting OKs, where the Model Pet Program has them (2026-11-08)

Astra, 2026-11-08: "The Friendly Farmer has some kind of repo somewhere that is a template pet program page. That's the
one you should be following. And if you needed another example, then Rift Rabbit." The template is the Model Pet
Program (`apps/pet-programs/model-pet-program-20261102.html`). PC Master Race's page already had its panels and
sections, but it showed nothing waiting on her, though two decisions are hers. Asked "Show his waiting OKs where the
template has them?", she said "Yes, add them".

- **Where they go**: L4's `approvals-waiting-on-you`, where the template keeps "a decision only you can make". The
  framework keeps L3's "L3 asks you" for updates the update audit found, and neither of these is an update, so L3 asks
  you stays empty.
- **The data**: a new pets.json field, `waiting_on_you`, a list of `{ need, card, on }`. The Farmer's round finds these
  only in a pet's own repo, and PC Master Race's repo is private (no `FARMER_TOKEN` yet). PC Master Race's two:
  1. Accept Microsoft's Sysinternals license for Autoruns, TCPView and Coreinfo, so their previews show.
  2. LatencyMon: install 7.40 from its maker's site, or keep it held.
- **The page**: the line under the list names where they come from: "From card 282 in the hub.", or the card and the
  Friendly Farmer's last merged round when both have some. They count in the chat's Needs you, as "your OK". L4's More
  details says the pet's own approvals come from pets.json, on every page. The Model Pet Program's list looks the same.
- **Rules**: PET-PROGRAM-FRAMEWORK.md's L4 row names the field. A new test checks PC Master Race's list and its source
  line, and that the model's example still comes from the round.
- **Not done**: Goldfish's Pets Board still takes needs only from the Farmer's round.

`npm test`: 392 tests, 390 pass, 1 skipped, 1 fails: the Windows farm-setup test, which fails on `main` the same way.

Claude Opus 5.5 (`claude-opus-5-5`).
