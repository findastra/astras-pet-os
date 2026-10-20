# Every farm's own pets: whose they are, public or private, one pet at a time

**Decided by Astra, 2026-10-20: "All recommended. Build Parts 1 and 2."** Parts 1 and 2 are merged
(#157, card 058); Part 3 is pull request #164, waiting on Astra's OK; Part 4 is not built. By Claude Opus 5.5
(`claude-opus-5-5`), 2026-10-19 and 2026-10-20, from a session started by the beginner-guide chat.

## Astra's answers (2026-10-20, every recommendation)

| # | Question | Answer |
|---|---|---|
| 1 | How does a farm know whose it is? | Both: `github_owner` in pets.json, and the signed-in account must agree |
| 2 | Pets from two accounts on one farm? | Yes: each pet may name its account; without one it is the farm owner's |
| 3 | Keep the hub from going private? | Yes: the privatizer refuses the one art source |
| 4 | Before a pet goes public? | Scan every commit of every branch, and stop on a hit |
| 5 | Keep the name pet-privatizer? | Keep it, with the words `private` and `public` |
| 6 | "Download one pet" means first? | A pet pack zip first; then the Farmer adds one pet to a farm |
| 7 | Pictures copied into a pack? | Yes, in the zip only, never committed to a repo |
| 8 | Where each pet's needs are written? | pets.json, one place |
| 9 | In what order? | One part at a time: Parts 1 and 2 now, then 3, then 4 |

**Added while building (2026-10-20):** a pet whose entry says `stays_private` never goes public. Claude Bot's says why:
its art is an exact copy of ChatGPT's BSOD, which may not be public (an existing decision, recorded in
docs/pet-art-redesign-20261017.md). Without it, the scan would have let Claude Bot go public: it found nothing to stop.

## What Astra asked

- 2026-10-19: anyone can download Astra's PetOS, make their own farm and choose which pets are public or private. The
  first new farmer is her best friend Dev (GitHub `XxdevilishxX`), who is new to programming.
- 2026-10-19, on the first version of this proposal: *"People are going to be wanting to privatize and unprivatize their
  pets. And people are going to want to be able to download as an individual pet and not have to download the whole
  system. And I understand the dependencies problem there."* She is ready to do the rewrite now, while it is early.

## What I looked at

- Every top-level Markdown file in the hub, every skill, the open cards, the migration plan and the security docs.
- Every script that names an account, the animal guard, the pet-privatizer and its tests, the installer and how it
  writes a farm's `pets.json`, the Farmer's round and the Pets Board.
- GitHub: all 104 `findastra` repos (visibility, forks, stars, Pages sites), and the `pet.json` of three pets.
- Astra's PC: who `gh` is signed in as, which programs run from the pet folders, and how every local pet repo reaches
  the hub (pictures, pages, build icons).
- The Farm's pet program page, in the browser pane.

## What is true today

1. **One account is written into the code.** `findastra` appears in 24 hub scripts (plus the installer, two Linux
   package files and 12 tests), and on 59 lines of the registry data (`pets.json` 32, `system-map.json` 27). The animal guard
   says an animal must be on `findastra`; the privatizer, the Farmer's round, the pet-finder, the Pets Board and the
   pet program pages all ask GitHub about `findastra/<repo>`.
2. **That one word means two different things.** Sometimes it means *upstream*: where Astra's PetOS itself comes
   from (the installer download, the pictures, the guide, the official pets). Sometimes it means *this farm's owner*:
   whose pets these are. On Astra's farm they are the same account, so nobody noticed. On Dev's farm they are not:
   Dev's pictures and guide still come from Astra (upstream), but her pets are hers.
3. **A farm cannot hold pets from two accounts.** A pet's entry in `pets.json` says only `"repo": "meme-fiend"`; the
   account is assumed. Dev's farm will hold Astra's example pets (on `findastra`) and her own (on `XxdevilishxX`).
4. **The privatizer goes one way, on one account.** `plan` and `apply` only make repos private, only on `findastra`.
   Only `copy` uses the signed-in account. Run from `Documents\Astra's PetOS` (a junction), it prints nothing and does
   nothing, because Node sees the real folder for the script and the junction for the command line (checked on
   Astra's PC, 2026-10-19).
5. **The hub has to stay public for everyone's pictures and pages.** Every pet picture lives only in the hub (one art
   source), and every pet program page is the hub's. Pet pages and programs load them from
   `findastra.github.io/astras-pet-os` or `raw.githubusercontent.com/findastra/astras-pet-os`. Five repos have a
   GitHub Pages site: `astras-pet-os`, `paper-girl`, `ghost-protocol`, `platform-platypus`, `fuzzboi-friend`. A free
   account has no Pages for private repos, and raw files of a private repo need a sign-in. So a private hub would
   turn off the System Map, the guide, every pet program page and every pet's pictures, for everyone.
6. **Visibility is written in three places that can disagree.** `pets.json` `visibility`, each pet's own `pet.json`
   `visibility`, and GitHub. Meme Fiend's `pet.json` says private; the registry and GitHub say public.
7. **Making a repo private loses things** (GitHub's own rules): its stars and watchers are erased for good, its forks
   stay public and are cut loose, and a free account's Pages site stops. On `findastra` today: 101 public and 3
   private repos, no forks, one star (`learn-python`).
8. **Making a repo public shows everything in it:** every commit of every branch, its issues, releases and Actions
   logs. A key or a personal folder path in an old commit becomes public. The hub already has a scanner for this,
   `scripts/public-safety-20261014.mjs` (`findSensitive`), used by `test/public-safety-test-20261014.mjs`.
9. **A single pet can already be downloaded, but it leans on the hub.** Every public pet has a **Download ZIP** link
   in the README (its repo as a zip). What that zip does not bring:

   | What | Where it lives today | Without the hub |
   |---|---|---|
   | Its pictures | the hub (`art/`), one art source | Pages load them online; offline they are blank |
   | Its desktop pet | Startup Star and the desktop pets program, built from the hub | No desktop pet |
   | Its pet program page (one click) | the hub (`apps/pet-programs/`) | Windows pets such as API Fairy say "I can't find my pet program page" |
   | Its app icon when it is built | the hub, next to the pet's folder | Log Den builds without one, and says so |
   | Pets it works with | their own repos | Forensic Ferret reads Log Lynx's events; alone it has nothing to read |

10. **The Farmer's round and the Pets Board look at `findastra`.** On another farm they would report on Astra's pets.
    GitHub turns scheduled workflows off in a fork until its owner turns them on, and a private repo's Actions use the
    free account's monthly minutes (public repos use none).

## The proposal

### Part 1: whose farm, and whose pet (one pull request, with Part 2)

- **The farm says its owner.** `pets.json` gets `"github_owner": "findastra"` next to `"owner": "Astra"`. It is in the
  core, so on any farm it changes only through a pull request that farm's L4 merges.
- **Each pet may say its own account.** An entry may carry `"github_owner"`; without it, the pet is on the farm
  owner's account. Astra's farm needs none (every pet is hers). On Dev's farm, Astra's example pets say `findastra`
  and Dev's own say nothing.
- **The animal guard reads both.** An animal is a pet in the registry, on its own account. A malformed name
  (`owner/name/extra`) is refused, as Codex proposed on its 2026-10-14 to 2026-10-16 branches. Account names are
  compared ignoring letter case, as GitHub does.
- **Only your own pets, only while signed in as you.** Before a tool changes anything on GitHub, the signed-in
  account (`gh api user`) must be the farm's owner, and the pet must be on the farm owner's account. Otherwise it
  stops and says why ("Meme Fiend is Astra's pet (findastra). Make your own private copy with `copy`").
- **The junction fix:** compare real paths, so the privatizer runs from `Documents\Astra's PetOS` too.

### Part 2: public and private, both ways (same pull request)

- `plan private <pet>` and `plan public <pet>` say what would happen; `apply private|public <pet> --yes` does it.
- **Private:** as today, it lists what is lost and refuses when something would be, unless `--accept-losses`. New: it
  refuses the farm's **art source** (the hub on Astra's farm), because every farm's pictures and pages come from it.
- **Public:** before anything changes, it scans every commit of every branch with `findSensitive` (keys, tokens,
  personal folder paths, local addresses) and refuses on any hit, naming the commit and file. It lists what becomes
  visible (commits, branches, issues, releases) and then asks for `--yes`. A pet whose data must stay on the PC (Health
  Hummy, Finance Finch: `relations.private`) still may be public, because its data is never in its repo; the plan says
  so.
- **Every record follows:** `pets.json` `visibility` (then `npm run build` and a pull request), and a note when the
  pet's own `pet.json` disagrees.

### Part 3: upstream and farm owner, everywhere else (next pull request)

One small module answers both questions: `upstream()` (Astra's PetOS: releases, pictures, guide, official pets) and
`farmOwner()` (from `pets.json`). Every farm-facing script uses the right one: the Farmer's round and its workflow, the
pet-finder, the Pets Board, the pet program spawner (its Source and Pedigree links), the Farmer's desk, the installer's
farm list, `farm-setup`, the desktop draft list and `publish-pet-tags`. Astra-only tools keep `findastra` on purpose and
say so: her profile round, the Flash Audit and the one-art-source check. Plus a **make-it-yours** command that sets a
new farm's owner and marks the examples as Astra's, so a beginner never edits JSON by hand.

**As built (pull request #164, 2026-10-20):**
- The module is `scripts/farm-owner-20261020.mjs`. Its `ownerOf()` gives one repo's account: the pet's own
  `github_owner`, else the farm owner's. A candidate is the farm owner's. A repo the farm's pets.json does not list
  is upstream's.
- make-it-yours is `node scripts/make-it-yours-20261020.mjs <GitHub name> [--dry-run]`. The Friendly Farmer, the farm's
  own hub copy, becomes the new owner's.
- On Astra's farm no generated file changes, except the new tool's own row.
- Left for later:
  - the hub's own name inside pets.json (a copy with another name);
  - a public page for a farm's own pets (Part 4);
  - the System Map's per-node repo links.

### Part 4: one pet at a time (later pull requests)

- **A pet pack:** one zip per pet on a release, built by the hub: the pet's repo at its version, its pictures, its pet
  program page made to work on its own, and its Markdown pet. The pictures are copied into the zip when it is built
  and never committed to the pet's repo, so the hub stays the one art source.
- **What a pet needs, written down:** `needs` in its `pets.json` entry: other pets (required or optional), the core
  (Startup Star for a desktop pet) and third-party programs. The pack's page says plainly what works alone and what
  needs a farm.
- **The installer, one pet:** `-Farm Scratch -Pets <id>` already installs the core with one pet. Next, the Friendly
  Farmer adds or removes one pet on an existing farm and records it in `farm.lock` (he is the package manager), then
  the Kennel's adoptions use the same path.

## What it would take

| Part | What changes | Size | Depends on |
|---|---|---|---|
| 1 and 2 | The animal guard, the privatizer, `pets.json` (one field), tests, MAKE-IT-YOURS.md, the guide's public-or-private step, farm-security, the tool's job on the map | One pull request: about 200 lines of code and 15 tests | Astra's answers |
| 3 | About 15 scripts, the round's workflow, the spawner's links, a make-it-yours command, tests | One or two pull requests; every pet page rebuilds | Part 1 |
| 4 | A pet-pack builder, a page mode that works without the hub, `needs` for every pet, the installer, release notes | Two or three pull requests, then each pet's own repo later if Astra wants `needs` there too | Part 3 |

## On Astra's farm

Signed in as `findastra`, everything behaves as today. What changes only on bad input: signed out or as another
account, the tools stop and say so; a malformed repo name is refused; the hub cannot be made private by mistake.

## Risks, plainly

- **The registry gains a field every script must read.** Part 3 is where most of the rewrite is; until it lands,
  scripts other than the guard and the privatizer still assume `findastra` (documented, tested on Astra's farm).
- **The scan before going public finds the patterns it knows**, not every secret. GitHub's secret scanning (free on
  public repos) is the second check after a repo is public; a leaked key is revoked, not hidden.
- **Nothing here is enforced against a person.** These are checks in the farm's own tools. GitHub's own permissions
  are what stop Dev changing Astra's repos, and Astra changing Dev's.
