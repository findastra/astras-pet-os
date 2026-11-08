# The Farm's page audit: every friend's picture and its own words

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-08, for Astra.

Astra, on the Friendly Farmer's page: "Do an audit of the page and find errors and fix them", then "a lot of these pets
and their descriptions are wrong and the images just aren't there. So you need to go in and get the new stuff", and "I
think a lot of these buttons aren't really working on the farm".

What the audit found (the page served from main on 127.0.0.1, its console and requests, an in-page check, and The
Farm's click-check):

- **The friends list said the same thing for every pet.** The Friendly Farmer's links to every pet, every roadmap pet
  and every seed each carry one line, so 53 friends quoted "Every pet submits changes to its name, job, status..." and
  the roadmap pets and seeds "The Farmer incubates every ...". Now, when three or more friends would share a line, each
  quotes the first sentence of its own job (pets.json, its seed entry, or the System Map). Pages whose friends have
  their own reasons keep them.
- **34 pets had no picture** (11 hatched, among them Gatekeeper Goddess, Inference Iguana and Linux Penguin, and 23
  roadmap pets) and 7 roadmap pets only an icon. The newest drawings were in the art review, hub #267 (Codex, round 6
  of 2026-10-31, `art/drafts/body-and-center-review-20261031/`): their 256px neutral pictures are copied in unchanged
  (the same files, so #267 still merges cleanly), and the page builder uses a pet's newest review drawing when it has
  no drawing of its own. They are drafts until Astra approves them in #267; a pet that has a drawing keeps it. Skill
  Scout's icon is now found by its pet's name (its repo is lunas-log).
- **click-check flagged six labels that go nowhere**: the labels of the panels that always stay open (#301). They are
  names, not buttons, so click-check no longer clicks them.
- Not page errors: the request for `Astra's PetOS Data/.../programs-page-data.js` and the chat's helper file only fail
  when the page is opened outside Astra's farm folder; the live site never asks for them.

Files: `scripts/pet-program-pages-20261018.mjs`, `scripts/click-check-20261019.mjs`, 41 drawings in
`art/drafts/body-and-center-review-20261031/normalized/`, and what `npm run build` made from them (pages, Markdown
pets, `art/latest`).

Not done here: how every button on the page is meant to work (many lights only switch in the browser, and the 3rd
party lights need Inference Iguana's watch), and the Flash Audit as tools on The Farm.
