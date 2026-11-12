# Iced Out Iceberg shows what Portfolio Puffer looks after · 2026-11-11

Astra, 2026-11-11, looking at Portfolio Puffer's old page: "you need to update this program or maybe start from
scratch because this one looks so old. But the context on it needs to be put into the right format for a pet program
... The friendly farmer will have a template pet program, and you can also copy Wonderland Launchpad."

Iced Out Iceberg's page already had every panel of the framework (the spawner draws it like the Model Pet Program),
but it was nearly empty: Puffer had no links on the System Map, so it showed one 3rd party program and no native
programs. Like Wonderland Launchpad, its page now fills from the map and pets.json:

- **Native programs** (`system-map.json`): `findastra-portfolio` (findastra.github.io) and `portfolio-review-desk`
  (Puffer's first page, its `app_url`), plus the existing GitHub profile, each linked from `portfolio-puffer`.
- **3rd party programs:** GitHub (the portfolio runs on Pages) and LinkedIn, new and planned (card 019); LinkedIn is in
  Puffer's `needs`.
- **Native tricks:** `portfolio-update-round` (weekly, card 019) and `portfolio-pictures-refresh` (GitHub Goldfish's
  project-image-generator by grant), both planned and off until written.
- **L3's note** (`editorial` in pets.json) and **L4's approval** (`waiting_on_you`, card 019): the employer pages wait
  on Astra's word-for-word read.
- **Quick summary** (`pet-programs.json` mini descriptor, still `reviewed: false`): what Puffer looks after today.

`npm run build` rewrote the generated pages and lists. `npm test`: 412 pass, 6 skipped, 5 fail; the same 5
(farm-setup and pet-chat-helper tests) fail on untouched main bdce21da on this PC.

## Penguin colours and a button audit (same day)

Astra: "we need to change the background color of this pet program to match the penguin, so like pink or maybe yellow
because his feet are yellow. So change that and then do an audit of the buttons, make sure all the buttons work."

- **Colours** (`apps/pet-programs/pet-program-page-20261018.css`, `:root[data-pet="portfolio-puffer"]`): a deep penguin
  pink page (#7a0c62), panel lines in his belly pink (#fbbcda) and links, marks and the working-copy box in his feet
  yellow (#fbdc02), sampled from his desktop drawing.
- **Button audit** (The Farm's click-check on this page): 190 clicked, 187 work. The 3 it calls broken are not the
  page's: two links into private repos (Handwritten Message Manager in portfolio-puffer, social-row in github-goldfish)
  open only when signed in, and the chat's helper file is found two folders above the farm, so it is missing only when
  the page runs from a temporary copy (it is there for Astra's farm). The chat window, opened by hand, lists what needs
  her and answers its three quick questions.
- **Checks** (`checks` in pets.json): GitHub, findastra.github.io, the Portfolio Review Desk, the GitHub profile, Astra's
  Window Star and the System Map link are checked and work; the chat has an issue noted (no answer from a seat tried).
- Astra's Window Star's black box came from its own page (findastra/astras-star-window#5).

Built with Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-11.
