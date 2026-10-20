# Idle Flash Audit: how to run one

Working name: **Idle Flash Audit**. It is the [Flash Audit](flash-audit-20261014.md) run while Astra is away
(overnight, usually): every pet program is checked, everything that needs no decision is fixed on a branch with a
pull request, every named pet gets a repo if it has none, and the decisions wait for her as round cards she can
read on an iPad. Owner: **GitHub Goldfish** (the Flash Audit's owner). First run: 2026-10-17, by Claude Opus 5.5
(`claude-opus-5-5`), at Astra's request ("do the flash audit … fix blatant errors that don't require my decision,
all night long"; "make sure you start a repo for every pet that exists"; "write down how to do an idle flash audit").

## When

Astra says so: "do an idle flash audit", "flash audit while I sleep", or the same in her words. Ten hours is plenty;
the checks themselves take about an hour.

## The rules

1. **Read first.** Pull and read the newest handoff (the global rules: `handoffs/`, `docs/handoff-*.md`, recent
   commits). A newer handoff overrides an older request; say so in the report.
2. **Branches and pull requests only.** Every fix goes to `claude/flash-audit-fixes-<date>` in that repo, with one
   pull request. Never merge, never push to a default branch, never force-push. Astra merges (or says
   "merge all" in chat, and then an assistant merges each one whose checks pass).
3. **Never touch the working copies.** Work in fresh clones in a short temp folder (`%TEMP%\idle-flash-audit`),
   never in `Documents\Astra's PetOS`. Other assistants may be working there right now.
4. **Route around other work.** List the running sessions and processes first (`list_sessions` in the Claude app,
   `Get-CimInstance Win32_Process`). Do not edit a file another assistant has uncommitted; do not rename or move
   a folder anything is running from.
5. **Fix only the grey-dot (⚪) checks.** In the [Flash Audit](flash-audit-20261014.md) matrix, ⚪ means the Idle
   Flash Audit checks and fixes it; 🔵 means it checks it and the answer waits for an Active Flash Session with Astra
   (a decision on a round card). A sentence in a row that starts with the other dot goes the other way. The lists
   below are the detail.
6. **Nothing that costs money, signs in, installs, or sends.** No art generation, no sign-ins, no live clicking,
   no messages. Those checks are reported **Not verified**, never Pass.
7. **Say what happened.** Keep a running log, then leave a morning report card in `handoffs/` and a chat message
   with every link.

### Fixed without asking (blatant)

- Retired names in documents (`.md`, `.json`, `.html` outside `<script>`, `.txt`, `.yml`, `.svg`): `Astra's Pet Apps`
  -> `Astra's PetOS`, `astras-pet-apps` / `findastra-pet-apps` -> `astras-pet-os`, `Documents\Projects` ->
  `Documents\Astra's PetOS`. Lines that tell history ("was", "renamed", "formerly") keep the old name.
- Links to renamed repos (GitHub redirects them, but the current name is correct).
- `pet.json` catching up with the registry (`pets.json`) and the one list of names (`pet-programs.json`): pet name,
  job and audit block. **Not** a field the pet has submitted to the Farmer (`cage.submit`): that is a decision.
- Required files that are simply missing: `CLAUDE.md`, `AGENTS.md`, an MIT `LICENSE` (public pet repos only, never
  on an art-only repo), and `pet.json` built from a decided registry entry.
- README: the credit `*By Astra.*` (Astra, 2026-10-20, card 059; a retired credit line, card 033's or the one before it, is changed to it), a **Limits** section (from `INTELLIGENCE-LEVELS.md`), and **Run it**
  for unbuilt seed repos.
- The `pet-app` topic on a public pet repo that the registry already lists.
- **A repo for every named pet that has none** (Astra, 2026-10-17). Same shape as the seed repos started on
  2026-10-14: README, `pet.json`, `AGENTS.md`, `CLAUDE.md`, MIT `LICENSE`, topics `astras-pet-os` and `pet-app`, one
  commit "Start <repo>". Public like the others; if the permission check will not create a public repo while Astra
  is away, start it private and put "make it public?" on its card. A pet with no name yet (`pet-program-#-icon-#`)
  waits for its name.
- Facts in the hub catalog that GitHub contradicts (for example `repo_exists`).
- **Every pet connected to its pet program** (A59, Astra 2026-10-18): pet.json `entry`, `interface_url` in
  `pets.json`, the profile line, The Farm's card, the System Map node and the README all link to the same, real
  program (A10, A12, A39). A registered or pipeline pet missing from `pet-programs.json` gets the next free number,
  its program called `pet-program-N` until Astra names it.
- Tool behavior with made-up data in a scratch copy, no sign-in (A19).

### Never fixed overnight

- 🔵 **Waits for Astra (Active Flash Session):** names (pet or program), what a pet does and jobs a pet submitted,
  which tools and tricks it has, visibility (public or private), art, accounts and connections, grants and
  permissions, merges (hers to OK, other assistants' branches included), file renames and folder moves (a File Master
  plan she approves), and checks that need her there (a click, a sign-in, a picture only she can take).
- ⚪ **Waits for the pet's own chat (no decision, but not overnight):** anything in code (a name in code can be a
  storage key or something the code looks for). The round card names the fix for that chat.

## The steps

The tools are in `scripts/` of this repo (Node 20 or newer, and `gh` signed in as findastra). On Astra's PC, find
Node with `where node` or under the Codex runtimes folder. Work from a short folder, for example:

```powershell
mkdir $env:TEMP\idle-flash-audit; cd $env:TEMP\idle-flash-audit
$hub = "$env:USERPROFILE\Documents\Astra's PetOS\astras-pet-os"
```

1. **Situation.** Note the time, the running sessions and processes, open hub pull requests, and the newest cards.
   Write them at the top of a log (`overnight-log.md` in the temp folder).
2. **Audit (read-only).** `node "$hub\scripts\idle-flash-audit-20261017.mjs" audit` writes `audit\ledger.json`: one
   record per program with each check's status and evidence. It reads every repo through the GitHub API (private
   ones too), never runs repo code, and uses Goldfish's preflight from
   `..\github-goldfish\scripts\flash-audit-local-20261015.mjs` when it is there (`FLASH_PREFLIGHT` overrides).
   Add program numbers (`3,4,5`) to audit only those. About 1,500 GitHub API calls for 80 repos; the limit is 5,000
   an hour (`gh api rate_limit`). A59 (`scripts/pet-program-link-20261018.mjs`) also reads the profile README and
   builds the System Map from the hub; its list-wide findings (a pet with no number, two pets on one program) go on
   the Farmer's round card, #1 (add `1` to the numbers to include it).
3. **Look for false alarms** in the ledger before fixing anything. Examples from the first run: test fixtures
   that use a made-up user folder (`you`) are not personal paths; a hub page whose file name still says `astras-pet-apps` must keep
   its name.
4. **Dry run the fixer** and read every change:
   `node "$hub\scripts\idle-flash-fix-20261017.mjs" audit\ledger.json --dry`, then
   `node "$hub\scripts\idle-flash-showdiff-20261017.mjs" c`. Fix the tool, not the output, when something is wrong.
5. **Fix for real** (same command without `--dry`). It clones, commits as findastra with the assistant as
   co-author, pushes the fix branch, opens the pull request and records it in `fix-results.json`. Running it again
   skips repos that already have their pull request. A59 links are fixed the same way: pet.json `entry` and the
   README link in the pet's fix branch; pets.json, pet-programs.json and system-map.json in one fix branch of the hub
   (it runs `npm run build -- --metadata-only` there), merged like every hub change, after Astra's OK in chat.
6. **Start missing repos:** `node "$hub\scripts\idle-flash-new-repos-20261017.mjs" --dry`, then without `--dry`.
   A farm's repos start private (Astra, 2026-10-18); on Astra's own farm add `--public`, because her pets are public
   by her choice (only Data Dealer is private).
7. **See what is left:** audit again with `AUDIT_REF=claude/flash-audit-fixes-<date>` set, so each repo is read
   from its fix branch. Whatever disappears is fixed by the pull request.
8. **Round cards** for the iPad:
   `node "$hub\scripts\idle-flash-cards-20261017.mjs" audit\ledger.json fix-results.json <name-options.json> <out> [branch-ledger.json]`
   writes `README.md` (the index: answer-these-first, every round, every pull request) and one
   `round-NN-<repo>.md` per program, in the owner-round format (pictures, then exceptions in priority order, then
   decisions with four explained name options). Put them in `docs/flash-audit-rounds-<date>/` in this repo with the
   ledger, on a `claude/` branch with a pull request. Every exception starts with its matrix row's dot: ⚪ the Idle
   Flash Audit fixes it ("Fixed in" its pull request when it did), 🔵 it waits for the Active Flash Session. The
   order and the dots are read from the matrix itself (`scripts/flash-matrix-20261018.mjs`), so a new check or a
   changed dot needs no change in the tools.
9. **Answer sheet** for the iPad:
   `node "$hub\scripts\idle-flash-answers-page-20261017.mjs" <out>\decisions.json audit\ledger.json fix-results.json $hub answers.html <cards-url>`
   builds one tap-to-answer page of every blue-dot (🔵) decision (names with their four options, merges, visibility,
   branches); grey-dot items stay on the round cards.
   Publish it as a private Artifact with the `db` capability; each tap saves a document in its `answers`
   collection, which the next assistant reads (`ArtifactData` `list`). Put its link at the top of the round cards
   (`FLASH_ANSWERS_URL` when building them) and in the report.
10. **Morning report.** A card in `handoffs/` (next free number, and its row in the table) and a chat message: what
   changed, every link, what was added to the Flash Audit, what waits on Astra, and what was Not verified.

## What it does not check

Anything that needs a person or a signed-in browser (the 🔵 checks that need Astra there): double-clicking a desktop
pet (A11), tools on Astra's real data, accounts or PC (A19's live part), tutorials (A36, A37, A40), chat seats and
what they do (A22, A23, A52), live routes behind a sign-in (A10). Those stay **Not verified** until an Active Flash Session.

## Lessons from the first run (2026-10-17)

- `pets.json` `seeds` is an object (`seeds.pets` is the list), not a list.
- The catalog's `repo_exists` said false for 41 repos started on 2026-10-14: always ask GitHub.
- Windows long paths are off on Astra's PC: work in a short temp folder.
- Bash heredocs on this PC can eat backslashes; write files with an editor tool when they contain `\`.
- Four pets had submitted jobs the registry never took (`cage.submit`); the Farmer's daily round needs fixing
  (hub PR #46) so submissions stop piling up.
