# Gone Ghost is public in pets.json; the hub's copy of his pet interface follows ghost-protocol (2026-11-11)

Astra, 2026-11-11, on the audit's recommendations: "all recomm do for me". Two of them, in this pull request (branch
`claude/tender-keller-dksbbl`).

## 1. Gone Ghost's visibility: private to public

- `pets.json`: `visibility` for `ghost-protocol` is `"public"`. GitHub says the repo is public
  (`gh api repos/findastra/ghost-protocol` on 2026-11-11: `"private": false`), and pets.json follows what GitHub says,
  as the Farmer's round does (`scripts/farmer-rounds-20261009.mjs` writes `visibility` from GitHub and names the change
  in its pull request). `visibility` is the only place the hub records it.
- `npm run build` carried it to the generated files, none edited by hand: the README pet table and ROSTER.md (the repo
  is linked, with Download ZIP), Gone Ghost's pet program page (`apps/pet-programs/ghost-protocol-20261018.html`: the
  Pet ID's pedigree links the repo; the chat's `repoUrl`), his Markdown pets and the farm list in `markdown-pets/`, and
  the System Map page (his node says public).

### GitHub Pages for ghost-protocol is off

- Pages went off when Astra made most repos private on 2026-10-20 (a free account has no Pages site for a private repo).
  The repo is public again, but Pages was not switched back on: GitHub's API says `"has_pages": false` (2026-11-11), and
  the 2026-11-08 Flash Audit ledger records https://findastra.github.io/ghost-protocol/ answering 404
  (`docs/flash-audit-rounds-20261108/ledger-main.json`, Gone Ghost's A10 and A31).
- **Only Astra can switch it back on**: findastra/ghost-protocol › Settings › Pages, branch `main`, folder `/ (root)`.

### What the hub shows while Pages is off (a judgment call, left as the build makes it)

The build decides whether "today's app" can be opened from `visibility` alone. pets.json has no field that says whether
a repo's Pages site is on, and the build asks GitHub nothing. While Gone Ghost was marked private, his page said "its
app (private: ghost-protocol)", which was untrue once the repo went public. Marked public, the build now links his
`interface_live_url`, https://findastra.github.io/ghost-protocol/, in three places, and each of them answers 404 until
Pages is back on:

- his pet program page, L4's Pet ID: "App: the app it had before";
- `markdown-pets/ghost-protocol-20261019.md` and `markdown-pets/all-pets-20261019.md`: "Its app: https://findastra.github.io/ghost-protocol/";
- `markdown-pets/README.md` and `all-pets-20261019.md`, the farm list: "opens in a browser".

Making these true without Pages needs a choice that is Astra's, so nothing was changed for it here: turn Pages on (then
every link is right as built); or record Pages being off in the data, which needs a new pets.json field that the
spawner and the Markdown pets read (a code change); or point `app_url` at the hub's copy and drop
`interface_live_url` until Pages is on.

Written by hand, and still saying the site is live (not changed here):
- README.md, under the pet table: "Gone Ghost's website, Ghost Protocol, is already live";
- INTELLIGENCE-LEVELS.md, Gone Ghost's row: findastra.github.io/ghost-protocol as "the public security website";
- `system-map.json`, the `ghost-protocol-site` node (`state: "now"`) and its link to GitHub, "Published on GitHub Pages".

## 2. The hub's copy of the pet interface

- `apps/ghost-protocol-20261008.html` is now byte-identical to `ghost-protocol-20261008.html` on findastra/ghost-protocol
  `main` at `e121a5d` (git blob `991d7bc8e823fa53775303fd52988ba331909c75`, SHA-256
  `a2e14000eeb28c1f1ec3750b783dc9f00286d0d77ae0527203b22fa93c4e333f`, LF line endings as in the source). It brings the
  unified footer (ghost-protocol, 2026-11-09) and the accessibility fixes of 2026-11-11 (24 px tap targets, readable
  eyebrow text, tier names as headings). The page links no files beside it, so nothing is missing in `apps/`.
- `test/ghost-protocol-escape-test-20261017.mjs` reads this file: 4 of 4 pass.

## Checks

- `npm run build` (run twice: the second changes nothing) and `npm run check`: "Pets OK: 23 pet apps".
- `npm test`: 423 tests, 393 pass, 6 fail, 24 skipped. The same 6 fail on clean `main` in the same cloud session (the
  farm lock and pet pack tests that expect Windows: tests 99 to 102, 109 and 110). None is about Gone Ghost.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-11.
