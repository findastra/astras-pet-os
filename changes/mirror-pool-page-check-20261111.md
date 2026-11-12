# Mirror Pool's page-check, working on the page (2026-11-11)

Astra, 2026-11-11: Platform Platypus's pet program should be built from the Friendly Farmer's template or copy
Wonderland Launchpad, and shown in the browser pane in chat.

Mirror Pool already had its page from the pet program spawner (`apps/pet-programs/platform-platypus-20261018.html`).
What Wonderland Launchpad has and it lacked, added the same way PC Master Race got it (data only, the generator is
unchanged):

- **Its tool working on the page:** `page-check` (`mirror-pool-v1.0-page-check-v1.0`) in system-map.json, with
  `embed`, `frame: wide` and `in_pill`, so it opens in its own tool box in L1. The tool page is
  `apps/platform-platypus-page-check-20261111.html`: the checker from findastra/platform-platypus `index.html` (main,
  e171f99), with Check a page, Compare screenshots and Sites I watch, in the blueprint colours, without that page's
  own header, LCD pet, L3 box and footer. It tells its box how tall it is, so the box has no scroll bar.
- **L3's note at the top:** `editorial` for Platform Platypus in pets.json, signed like Rift Rabbit's.

`npm run build` changed only Mirror Pool's page, its Markdown pet, TOOLS-AND-TRICKS.md and the System Map page.

Checked in the browser pane from this branch's own copy, served on 127.0.0.1: the tool box draws in L1; Try the sample
then Check it shows 5 screens and "8 things to fix", and the box grows to fit the report (2389 px) with no scroll bar.
`npm test`: 423 tests, 416 pass, 6 skipped, 1 fails: the Windows farm-setup test, which fails on `main` the same way
(run on main, 2026-11-11).

## Later the same day (Astra: "Pick like a dark purple color for the background that matches him ... and get rid of the more details in the unified footer")

- **Mirror Pool's own colours**, taken from his drawing: a dark plum page and lighter violet panel lines from his fur, his
  banana-yellow bill for links, marks and pill edges, his cyan phone for L3's note (`:root[data-pet="platform-platypus"]`
  in pet-program-page-20261018.css). page-check's own panels are a neutral dark now, so it fits his page.
- **No More details in the unified footer**, on every pet program page: the footer is the same on all of them, so the
  spawner drops it for everyone. The test that every panel ends with More details now leaves out the footer too.
  `npm run build` rewrote every pet program page; each one loses only that footer line.

Not done: Platypus's own repo still has its old `index.html`; whether it should become this page or link to it is a
separate step.

Claude Opus 5.5 (`claude-opus-5-5`), branch `claude/mirror-pool-page-check-20261111`.
