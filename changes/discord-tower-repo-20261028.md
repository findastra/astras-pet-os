# Discord Tower moves to its own repo, discord-tower (2026-10-28)

**Astra, 2026-10-28**, about findastra-discord-presence: other projects were bleeding into its README; nothing about
deleting messages or Discord Damsel should be in any of its files, except a small line on its front saying the pet
manages it. On a four-question deck she answered "all reccd": a new private repo, `discord-tower`, for everything of
Discord Damsel's except the two presence apps, with the hub pointing Discord Tower (#13) at it.

What changed here:

- `pet-programs.json` and `pets.json`: #13's repo is `discord-tower`; her entry is `private`, her pet program page is
  `apps/pet-programs/discord-tower-20261018.html`, and the relations and Mommy's Mommies' needs follow the new repo.
- `system-map.json`: her node id follows the repo (links, examples, the languages of her repo measured again); the
  Sticker Manager, CLI Proxy API manager, DM archive review and dm-cleanup point at `discord-tower`; the Sticker Manager,
  BetterDiscord and their three links work today (what #168 said on 2026-10-20, brought up to date: plugin 1.0.4 since
  2026-10-24); CLI Proxy API has not run since the restart on 2026-10-20.
- The spawner keeps the old page address, `apps/pet-programs/findastra-discord-presence-20261018.html`, as a page that
  sends you on (`MOVED_PAGES`), because findastra.github.io links it. Her published companion page keeps its file name
  through the interface builder's `file` key, as the-astral-plane's did on 2026-10-17.
- Her icon is `art/icons/discord-tower-20261012.png` (the same picture); `art/latest/icons/discord-tower.png` follows.
- INTELLIGENCE-LEVELS.md: her row links the new repo and her tools there; the Sticker Manager is installed; the old
  "three lines of presence work on branches" error is gone (those PRs were closed on 2026-10-28; their presence work
  was already on findastra-discord-presence's `main`). TOOLS-AND-TRICKS.md: the Sticker Manager works today.
- Tests follow the repo name. Every pet repo is private now, so two visibility tests skip ("no pet is public").

Records dated before today keep the old name. The other side: findastra-discord-presence#38 (presence only),
`findastra/discord-tower` card 010, and the "Moved" pages in anthropic-discord-presence#1 and openai-discord-presence#1.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-28.
