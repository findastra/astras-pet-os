# Flash Audit: pet onboarding and review instruction sheet

Working name: **Flash Audit**. Owner: **Friendly Farmer**, program **The Farm** (since 2026-11-08; GitHub Goldfish's,
program GitHub Aquarium, from 2026-10-14).
Tool label: `the-farm-v1.0-flash-audit-v1.0` (was `github-aquarium-v1.0-flash-audit-v1.0`).
By Astra. Compiled with OpenAI Codex (GPT-6), 2026-10-14.

This is a usable manual audit procedure and a specification for a future tool interface.
Goldfish now also has a read-only local metadata preflight at `scripts/flash-audit-local-20261015.mjs`. It is not a complete automated auditor, deployed service, or security certification.
Use it for new pets, existing pets, and the restarted rapid-question review of every pet.
**On The Farm** (Astra, 2026-11-08: "the flash audit needs to be a panel on the farm so that each of those shows up as
a tool and I can click it"; deck "The Farm: art and lights", "All recommended"): The Farm's L1 has a `flash-audit` tool
box with every check below as a tool, in this order. Each shows the last saved run over every pet program
(`docs/flash-audit-rounds-<date>/ledger-main.json`); Run asks the Flash Audit helper on Astra's PC
(`scripts/flash-audit-helper-20261108.mjs`, started by Startup Star) to run the read-only auditor again. The auditor
checks the rows listed in `scripts/flash-audit-checks-20261108.mjs` by itself; the others say an assistant checks them.
The Farm owns the audit and registry/admission coordination; **GitHub Goldfish keeps the checks about words on GitHub**
(A15 README and credit, A31 Status and link labels, A57 Current names only), marked as Goldfish's in the tool box.
**The page checks are the template** (Astra, 2026-11-12: "when we do audits and we're looking at user interface, that
we're auditing it based off of what's on the template, and then those are items on the Flash audit"): section 3, "6.
The page", has one check for each part of the Model Pet Program, in its order, and `npm run build` compares every pet
program page with the template part by part, so those checks on The Farm show the result as built, with no Run.

## 1. Source rules and precedence

Read the target repository's current AGENTS.md, CLAUDE.md, every applicable SKILL.md,
open handoffs, and pet.json before changing it. Fetch and inspect remote branches for
relevant unpublished work; record the branch and commit actually audited. Do not run
untrusted repository code merely to inspect it.

The sheet combines Astra's approved audit matrix and latest instructions with:

- [Pet files](../PET-FILES.md): required files, metadata, art, audit schedule, submission.
- [Pet Program Framework](../PET-PROGRAM-FRAMEWORK.md): page, tools, chat, backlog, data and links.
- [New pet or tool](../skills/new-pet-or-tool/SKILL.md): ownership and admission decisions.
- [Farm security](../skills/farm-security/SKILL.md) and [protection rings](../PROTECTION-RINGS.md).
- [Canonical architecture](../ASTRAS_PET_OS.md), [pet words](../PET-WORDS.md),
  [intelligence levels](../INTELLIGENCE-LEVELS.md), and [handoff rules](../skills/handoff/SKILL.md).
- [Security implementation limits](security-boundaries-20261014.md): planned enforcement
  must never be reported as deployed protection.

GitHub main source snapshot inspected: `04cb6416015f02478f716c0869f31066ff8133cd`.
The earlier left-side maintenance-control refinement and selected names are on the Codex working
branch, checkpoint `6ecb54b`, not necessarily main. Re-read current sources each run.

Resolve conflicts explicitly: direct owner instructions take precedence; the canonical
architecture governs conflicting legacy product descriptions. The Cage is retired as
a product concept: preserve compatibility files but do not demand new Cage behavior.
Missing optional software that was never installed is asleep / "not on this PC",
not a defect. A selected required connection that needs the owner is a blocked check.
Do not overwrite approved artwork to satisfy older generic palette/accessory rules.
Keep stable IDs and compatibility filenames unless a migration is authorized.
If source rules remain contradictory, report the conflict rather than silently choosing.

## 2. Run procedure

1. Load the canonical numbered catalog and registry; preserve chosen names and stable IDs.
   Include registered, pipeline, seed and roadmap pets, with their stage shown honestly.
2. Select one pet. Record program/icon names, number, owner repo, branches/commits,
   local source, deployed URL/version, and what access is actually available.
3. Show its current icon and nine-emotion sheet. Inspect desktop, page and repo versions.
4. Run the matrix below. Store evidence for every result, including passes. Do not infer
   a working app from HTTP 200, a file's existence, a passing build, or a successful launch request.
5. Tell Astra only **Missing**, **Incorrect**, and **Not verified** findings, in the matrix's priority order. Do not list
   successful checks. Artwork and unresolved questions remain visible as review materials.
6. Ask rapid questions only for unresolved decisions: four name suggestions with a short
   explanation each plus free text; implemented vs approved-planned vs proposed tools;
   integrations and an add-your-own option. Keep existing choices unless Astra changes them.
7. Save answers immediately. Apply only authorized fixes; audit permission is not permission
   to connect accounts, send mail, delete data, install software, or grant access.
8. Recheck affected items, publish a branch checkpoint and record what remains. Advance
   through the list without marking unchecked items complete.

### Mandatory checkpoint and preview after every round

After **each round**, and after substantial owner corrections within a round:

1. Save decisions, evidence, unresolved questions, next pet number and remaining count
   to a dated repository audit record before relying on chat history. Preserve answers
   across context/token limits. Distinguish reviewed rounds from repaired applications.
2. Run checks appropriate to the changes, commit the round's authorized files and push
   to GitHub. Verify push success and record the branch/commit. If nothing changed,
   verify synchronization without making an empty commit. Do not reset other work.
3. Refresh the existing right-side preview after changing its displayed content, so
   Astra can inspect the result. Preserve entered data; do not reload a dirty form
   without addressing unsaved work. Keep the relevant preview visible for the round.
4. A public GitHub Pages view only changes after deployment. A branch push does not
   deploy or authorize merging. Refresh/check after confirmed deployment and say plainly
   when the public page remains old. For documentation-only changes, show the updated
   instruction/audit file; do not suggest the unchanged app has been updated.
5. Hand off the next round with exact progress and open decisions. Never count a
   Not verified check as passed merely to finish a round.

All checks, A01-A71, are in one matrix in section 3, most important first. The dot at the start of each row says
whether it needs Astra (section 3, "Grey and blue dots"). The page checks (section 3, "6. The page") follow the Model
Pet Program part by part, and every build compares every pet program page with it.

### Idle Flash Audit (Astra, 2026-10-17)

The same audit can run while Astra is away: every program checked, fixes that need no decision on branches with
pull requests, a repo started for any named pet without one, and round cards for her to read on an iPad. It fixes the
grey-dot (⚪) checks and leaves the blue-dot (🔵) ones as questions. How to run it, and exactly what counts as needing
no decision: [idle-flash-audit-20261017.md](idle-flash-audit-20261017.md).
First run: [flash-audit-rounds-20261017/](flash-audit-rounds-20261017/README.md).

### Active Flash Session (Astra, 2026-10-18)

The Flash Audit with Astra there. She answers what the Idle Flash Audit left, the blue-dot (🔵) checks, in the same
priority order, from the round cards and the answer sheet. The assistant saves each answer straight away and applies
it. The checks that need her there (a double-click on her desktop, a chat seat, a tutorial, a sign-in, a picture only
she can take) are done with her.

## 3. Complete audit matrix, most important first

**Priority rule (Astra, 2026-10-17):** checks run and are reported in this order, most imperative first. A new check is inserted at its priority position in the right tier, never appended at the end. IDs never change or renumber (other files link to them); a new check takes the next free ID. Report findings in this order too.

**Grey and blue dots (Astra, 2026-10-18).** The dot at the start of each row says who a check needs. Dots never move
a row: the order above stays.

- ⚪ **Grey: Idle Flash Audit.** Checked and fixed without Astra: facts, files, links, and connecting each pet to its
  pet program. The fix goes on a branch with a pull request; a fix in a program's code is named on the round card for
  that pet's chat. Astra only gives her OK for the merges, in chat.
- 🔵 **Blue: Active Flash Session.** The Idle Flash Audit still checks it and puts what it found on the round card,
  but the answer needs Astra: a decision (names, what each pet does, which tools and tricks it has, art, public or
  private, accounts, grants, anything that costs money), or Astra there for a click, a sign-in or a picture only she
  can take.
- A sentence inside a row that starts with the other dot goes the other way. For example, in A06 a name that differs
  from `pet-programs.json` is fixed idle, but a new name is Astra's.

### 1. Is it a pet, and is it named
Nothing else matters until these pass.

| ID | Check | Evidence required / exception to report |
|---|---|---|
| ⚪ A59 | Pet program and its link | Every pet has exactly one pet program: its numbered entry in `pet-programs.json` (`icon` is the pet, `program` the program, `repo` its repo) and a repo that exists (A13). Every place that shows the pet links to that program, and to the same one: pet.json `entry`, `interface_url` and `interface_local_url` in pets.json, the profile line's home link, The Farm's card, the System Map node and the README. A missing, broken or wrong link is connected by the audit itself on a branch. **The program they all open is the pet program page** in the hub, `apps/pet-programs/<repo>-20261018.html`, and today's app is `app_url`, a button on that page (Astra, 2026-10-19: "one click always points to program page (Pet Program)"); `pet.json` `entry` is the app in the pet's own repo. Whether the link opens the right, working app is A10; the program's name is A07; a program page not built yet is A09, Missing (planned). A registered or pipeline pet with no number in `pet-programs.json` gets the next free one, its program called `pet-program-N` until Astra names it (A07). **A pet shows on the System Map and The Farm only when `pets.json` lists it** (registered or pipeline; both are built from it): a pet that `pet-programs.json` numbers but `pets.json` does not list is reported here (Astra, 2026-10-18, after Chat Rat). 🔵 Something that is not a pet yet (a candidate, a repo that only says it is one), two pets on one program, or a numbered pet that `pets.json` does not list, is Astra's: putting it in `pets.json` moves it through the gate (A33; nobody becomes an animal by saying so). Added by Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-18. |
| ⚪ A06 | Pet name | Compare mascot name across page, registry, map and metadata. Report conflicts, typos and placeholders. A place that differs is brought in line with `pet-programs.json` on a branch. 🔵 A placeholder or a new name is Astra's: four explained options and free text. |
| 🔵 A07 | Program name/version | Preserve chosen names; check versioned labels and stable numbers. Ask four suggestions plus custom only where undecided. ⚪ A versioned label or number that differs from `pet-programs.json` is fixed idle. |
| 🔵 A01 | Current icon | Show the actual image; identify desktop and page sources. Report absent, stale or inconsistent art. New or redrawn art is Astra's (it costs money). ⚪ A page or folder showing a stale copy is pointed at the hub's icon (A58). |
| ⚪ A53 | Program icon matches its folder | Every program a pet folder opens (its shortcut in the folder, the Start menu copy, the Desktop copy) wears the same icon as that folder, never the program's generic icon. Startup Star's folder is the Windows star (`shell32.dll,43`), so its shortcut is the star. Read the folder's `desktop.ini` IconResource and each shortcut's IconLocation; check installers set the folder icon too, so a reinstall does not undo it. A folder with no icon of its own is reported, not passed (🔵 Astra picks its icon). Fix: `scripts/match-shortcut-icons-20261017.ps1` (only changes shortcut icons). Recorded by Claude Opus 5.5 (`claude-opus-5-5`). |
| ⚪ A09 | Program interface | Inspect a real interface and required framework sections. Flag missing page, placeholder, dead controls or incomplete blocks. The pet program page's parts are checked against the Model Pet Program one by one in "6. The page" below. Missing framework sections are built to PET-PROGRAM-FRAMEWORK.md (code: the round card names the fix for the pet's chat). 🔵 What a program with no job yet should do waits for A08. |
| 🔵 A11 | Desktop launch | Exercise the actual pet's double-click and verify the intended interface appears. If unavailable, mark Not verified. Needs Astra there for the click on her desktop. |
| ⚪ A10 | Website route | Open configured program URL, follow redirects and inspect destination. Flag repo links posing as applications, wrong apps, errors and unexplained auth gates. A wrong or broken configured link is connected to the real program on a branch (A59). 🔵 A route behind a sign-in is checked with Astra, and putting a program on a new public site (GitHub Pages) is hers. |
| ⚪ A54 | Third-party programs | List every program made by others that the pet runs or looks after (L1, ring 5): name, where it is installed, version, and whether it is on this PC (not installed is asleep, "not on this PC", not a defect). It must match the page's Third Party Programs row, pet.json, the Made by others column in INTELLIGENCE-LEVELS.md and the System Map. Launch routes are real and bounded (A46). Report any program missing from one list or listed but never used. Lists that disagree are brought in line with what the code and the PC show. 🔵 Adding a program for the pet to look after, dropping one, or installing one is Astra's. |
| 🔵 A08 | Purpose and scope | Compare intended job with actual behavior; distinguish program, runtime and harness. Flag overlaps and planned features claimed as built. What each pet should do, and which pet owns an overlap, is Astra's. ⚪ A planned feature written as if built is reworded as planned, and a decided job is copied into pet.json and the README (never over a job the pet submitted itself). |

### 2. Where the work lives
Repo, files and folders.

| ID | Check | Evidence required / exception to report |
|---|---|---|
| ⚪ A13 | Individual repo | Verify repo association, source, entry point, metadata and artwork. Look at relevant branches before saying work is absent. Ask GitHub, not the catalog's `repo_exists`. **Every named pet has a repo (Astra, 2026-10-17):** a pet without one gets it started by the audit itself (the seed-repo shape in [idle-flash-audit-20261017.md](idle-flash-audit-20261017.md)), so it is never left for later. 🔵 Public or private is Astra's: when the audit cannot create a public repo, it starts a private one and asks. |
| ⚪ A14 | Required repo files | Check pet.json, sprite target, entry target, README, AGENTS.md, CLAUDE.md, LICENSE and applicable pet-app topic. |
| ⚪ A15 | README and credit | Check how-to-run and Limits, public credit "By Astra." (Astra, 2026-10-20; a README that still has a retired credit line is a finding, card 059), model/version/date, license, truthful status and naming exceptions. |
| 🔵 A56 | Work saved in its native folder | Everything the project works on lives where a developer expects it: source, tools, pictures, docs and build output in its own repo folder (`%USERPROFILE%\Documents\Astra's PetOS\<repo>`); the user's own data (private records, saved chats, settings) in its declared data folder outside the repo (`%LOCALAPPDATA%\<repo>\`, recorded as `data_folder` in pet.json); caches and logs in that data folder, never in the repo. Nothing it makes lands in Downloads, the Desktop, a dated chat folder (`Documents\Codex\<date>`, `Documents\ChatGPT\...`), the hub or another pet's folder. Check pet.json, the code's write paths and a File Master scan of the PC. Report each stray file with its proper home; moving it goes through a File Master plan that Astra approves. ⚪ Declaring `data_folder` in pet.json and writing the plan rows are idle; changing where the code writes is named on the round card for the pet's chat. |
| ⚪ A57 | Current names only | Live text uses today's names: **Astra's PetOS** and `astras-pet-os` (never `Astra's PetOS`, `astras-pet-os` or `findastra-pet-apps`), the folder `Documents\Astra's PetOS` (never `Documents\Projects`), each repo's current GitHub name, and the pet and program names in `pet-programs.json`. Lines that tell history keep the old name, and so do names that code depends on (browser storage keys, `%LOCALAPPDATA%\astras-pet-os`, file names other programs open): report those with what a rename would take. Fix documents on a branch; code waits for its owner. Added by Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-17, in the first Idle Flash Audit. 🔵 Renaming a name that code depends on is Astra's. |
| ⚪ A16 | Metadata and self-audit | Validate pet.json including job, runs_on, entry, sprite, status, framework, tools, links and audit cadence/subject/needs. Hatching/growing/grown must reflect evidence. 🔵 A field the pet submitted itself (`cage.submit`) that the registry has not taken is a decision, not an idle fix. |
| ⚪ A17 | Git and deployment | Record dirty files, ahead/behind commits, pushed branch, merged state and deployed version separately. Do not reset/stash/discard another agent's work. |

### 3. Pictures and art
What people see first.

| ID | Check | Evidence required / exception to report |
|---|---|---|
| ⚪ A55 | Pictures | The README and the repo page show **several real pictures** of what the project does, best picture first: the pet, its program page, and the program working. Creative projects (worlds, art, sites, games) have **at least three**, including in-world or 3D views. Program PFDs (the System Map, diagrams, especially the 3D views) appear as pictures too. Pictures are committed in the repo (`docs/images/<name>-<date>.png`), have alt text, and show no personal data, private chats or other people without their OK. Made or refreshed with `project-image-generator` (GitHub Goldfish's tool; Portfolio Puffer uses it by grant), and the portfolio (findastra.github.io) shows them. Pet art alone or a placeholder is Missing, not Pass. 🔵 Pictures only Astra can take (in-world VRChat shots, her desktop, Discord or OBS, anyone else in the picture) wait for her (card 026). |
| 🔵 A02 | Nine emotions | Show Sleepy, Awake, Idle, Curious, Happy, Worried, Alarmed, Sick and Sad; inspect all frames for missing, duplicate, mislabeled or inconsistent expressions. New or redrawn art is Astra's (it costs money, and approved art is redrawn only with `--match`). |
| 🔵 A61 | Mood symbol spot | Every mood picture keeps its sticker, one of the nine that are the same on every pet (Astra, 2026-10-24: idle's three dots, awake's two yellow twinkles, happy's note, curious's ?, worried's sweat drop, sad's grey cloud, sick's blue wavy lines, alarmed's !, sleepy's Z), in the same spot beside the pet's head, top right, with the same room around it, in every pet's nine moods. A pet whose symbols sit elsewhere, or whose pictures are drawn at different sizes, is reported for redrawing (Astra's art, A02). Added by Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-22 (Astra, circling the spot on every Unity Unicorn mood: "those spaces need to be standardized across the board, among all pets. add to flash audit"). |
| ⚪ A03 | Emotion behavior | Verify each state is reachable and means the correct runtime condition, not just that its PNG exists. Legacy filenames may remain stable; labels use the current nine states. Awake always shows its own drawing, the `blink` frame with its two yellow twinkles, in the emotions panel and in the cyberhome, and nothing blinks (Astra, 2026-10-24: the pages are still; 2026-11-03, Flash Audit deck, answer 1: A). A real pet whose `blink` frame still has its eyes shut is reported for an awake drawing with open eyes, which waits for Astra's OK on new art (A02); the Model Pet Program has one. |
| ⚪ A58 | One art source | Every picture of the pet (desktop frames, web frames, mood sheets, icon, folder icon, README pet picture, portfolio copy) has **one home**: this hub's `art/` and `desktop-art/` folders, published at `https://raw.githubusercontent.com/findastra/astras-pet-os/main/<path>`. Programs and pages read the picture from there (that URL, or the hub's own folder on Astra's PC for the desktop pets), so changing the picture in that one place changes it everywhere without touching any program's code (the standard term is a single source of truth for assets). Run `node scripts/one-art-source-20261017.mjs` (read-only; `GITHUB_TOKEN` for every repo, `--branch <name>` to check open pull requests): it lists every picture in any findastra repo that is a copy of a hub file (git blob hash) or looks like pet art kept outside the hub, and reports Incorrect for each. The move to the hub was approved by Astra on 2026-10-18 and done in one pull request per repo ([docs/one-art-source-20261017.md](one-art-source-20261017.md)). The desktop pets' local draft list (`%LOCALAPPDATA%\astras-pet-os\desktop-drafts-20261011.json`) must point into the hub, not into pet working copies. Exception: art that may not be public (Claude Bot's exact copy of ChatGPT's BSOD, Astra 2026-10-17) stays only in the pet's private repo; the hub keeps a public stand-in and says so. Recorded by Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-17. 🔵 Which art may not be public is Astra's, and so is deleting the old copies (agents never delete). |
| 🔵 A04 | Art publication | Compare local active assets with individual-repo blobs, including sheet, frames and sprite metadata. Report unpushed or stale art and invalid paths. Art is a draft until Astra approves it, so publishing new art is hers. ⚪ An invalid path to approved art already in the hub is fixed idle. |
| 🔵 A05 | Art format and provenance | Check transparent 256px source frames, approved style/body/size, black outline, no unwanted sparkles, source/license, and owner exceptions. Separate source resolution from desktop display size. A redraw is Astra's (it costs money). |

### 4. Tools and safety

| ID | Check | Evidence required / exception to report |
|---|---|---|
| 🔵 A18 | Official tool and trick inventory | Separate implemented, owner-approved planned, and proposed tools. Record purpose, version, owner, permissions, dependencies and add-your-own decisions. List the pet's tricks the same way: its own skills (L2 tool panel, kept by Skill Scout), apart from the harness skills the seat brings (L3; PET-PROGRAM-FRAMEWORK.md section 3). Which tools and tricks each pet should have is Astra's. ⚪ Listing what is built, merged or only on a branch, from the code, is idle. |
| ⚪ A19 | Tool behavior | Verify inputs, outputs, errors and intended actions for each tool. Use safe fixtures for changing actions; live checks require authorized scope. Fixture checks run in a scratch copy with made-up data and no sign-in. 🔵 A live check (Astra's real data, an account, her PC) needs her there. |
| 🔵 A21 | Tool OFF enforcement | Verify execution actually stops/prevents new work, state is controlled outside the tool, and security OFF cannot be self-reenabled. Report unsupported enforcement as a gap. Enforcement is a security change, so L4 (Astra) approves it, and checking it live needs her there. |
| ⚪ A20 | Manual maintenance light | Every tool has a maintenance light, the right one of its pair (Astra, 2026-10-24 and 2026-10-26: blue checked and works, orange report issues or not checked yet, yellow an update waiting for her OK, grey not created), distinct from ON/OFF and automatic health. Report persists to backlog/Farmer; tests cannot silently clear it. |
| 🔵 A26 | Privacy and permissions | Check exact allowed data/actions, owner approvals, secret storage and untrusted inputs. No private data or credentials in public repos/reports. Every permission, grant and leaked secret is Astra's (L4). ⚪ A personal path in a public document is replaced with `%USERPROFILE%` on a branch. |
| 🔵 A25 | Integrations/accounts | Check supported services, feature detection, account selection, connection denial, expiry, disconnect and provider-specific limits. No connection from domain guessing alone. Accounts and connections are Astra's; nothing signs in while she is away. |
| ⚪ A27 | Preview and recovery | For changes, verify appropriate preview/approval, undo or recovery, partial failures, retry safety and audit records. |
| ⚪ A42 | Credential help | Adjacent (?) What is this hover/focus memo explains optionality, purpose, scope, storage and destination without exposing secrets. |
| 🔵 A28 | Pet connections | Verify sender/receiver, purpose, granted scope, actual data flow, last exchange and independent connection OFF. Match registry relations and map. A connection and its grant are Astra's (L4). ⚪ Making `relations` in pets.json, system-map.json and the page agree with grants she already approved is idle. |

### 5. Chat and agent

| ID | Check | Evidence required / exception to report |
|---|---|---|
| 🔵 A23 | Chat-created tools | Verify request capture, authorized agent dispatch, build progress, independent review, tests, version registration and list entry. No self-granted access. Needs a live seat and Astra there. |
| ⚪ A24 | Ready indicator | Green plus text refers to a checked version; connection and authorization are separate. Failures or unreviewed code cannot appear ready. |
| 🔵 A43 | Emotion/message hierarchy | Verify simultaneous conditions select one highest-priority unresolved message and matching emotion using explicit policy, not frame order. Test stale success, failure, owner-needed state, dismissal and cosmetic blink. Missing global hierarchy is Not verified, not an invented priority order. The priority order is Astra's to approve (the framework's emotions table holds a proposed order, 2026-10-18). |

### 6. The page: the Model Pet Program, part by part

**The template is the standard** (Astra, 2026-11-12: "when we do audits and we're looking at user interface, that
we're auditing it based off of what's on the template, and then those are items on the Flash audit"). The template is
the Model Pet Program, [apps/pet-programs/model-pet-program-20261102.html](../apps/pet-programs/model-pet-program-20261102.html)
([PET-PROGRAM-FRAMEWORK.md](../PET-PROGRAM-FRAMEWORK.md), section 3). Each part of it is one check below, in the order
it sits on the page, top to bottom; the checks about the whole page follow. The page audited is each pet's pet program
page in the hub, `apps/pet-programs/<repo>-20261018.html` (A59).

**Checked at every build.** `npm run build` compares every pet program page with the template, part by part
(`scripts/flash-template-20261112.mjs`), and The Farm's flash-audit checks show the result, so it is never older than the
pages you see. What a part must match is read from the template itself where it can be: whether it folds, its fold
arrow, its More details lines, its headings, moods, clicks, tool boxes and lights. When the template changes, the
audit asks for the new way at the next build. A new part on the template gets its check here: the test fails until it
has one. What a build cannot see (how the page fits a screen, its colours, anything live) stays an assistant's check.

| ID | Check | Evidence required / exception to report |
|---|---|---|
| ⚪ A47 | The template's parts, in order | Every part of the template, in the template's order, and no tool panel the template does not have (Astra, 2026-11-02: "No special panels"; a pet's own tool is a tool box in L1, A66). Whether each part is there and drawn like the template is its own check below. Was "Shared base" until 2026-11-12: its L1 headings, session notes, `play-with` and `care-for`, Clicker Training and More details are now the checks of their parts (A66, A71, A67, A41), and every part's check compares its More details with the template's: the same four lines (how it works, where it comes from, your rules, not built yet), none in the three top boxes or the unified footer, only the arrow in the chat (2026-11-03, Flash Audit deck, answer 8: A; the footer's taken off 2026-11-11). |
| ⚪ A52 | Editorial status panel | First, full width: L3's note to you on how the site is coming along, the pet's `editorial` in pets.json, never made up ("No note from L3 yet" when there is none). Its first line is "Working copy: not the live site.", and the live site hides it with the same check in `<head>` as the template (2026-10-23, 2026-11-02). No L3 activity bubble (2026-11-03, Flash Audit deck, answer 3: A). Always open, no fold arrow. Was "L3 on the page" until 2026-11-12; the L3 control panel is A68. |
| ⚪ A62 | Cyberhome | Top left, a square the size of the System Map box: the `<pet>-cyberhome` tool as a pill with its paired lights (off: not built yet), and the pet at its desktop size, from its desktop drawing when it has one (2026-10-19 to 2026-11-08). No words, bubble or star door in it; no fold arrow and no More details (2026-11-06). Added by Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-12. |
| ⚪ A63 | Title and version | The pet program's name (A07), then `v<major.minor.patch> // <YYYYMMDD>` always to its right, from the pet's pet.json `version` (v0.1.0 when the hub assigns it); nothing listed under it (2026-10-20, 2026-10-21). A version without its patch number (`v0.1`) is Incorrect: the fix is the pet's pet.json `version`. Added 2026-11-12. |
| ⚪ A64 | Quick summary | Under the title: one to three plain sentences on what the pet program is, fitted to its box, and no buttons under it (2026-10-20, 2026-10-21). Always open, no fold arrow, no More details. Added 2026-11-12. |
| ⚪ A60 | System Map link | Every pet program page links back to the System Map, always: a `<pet>-system-map` panel in the top right, opposite the `<pet>-cyberhome`, that opens the map on the pet program's own node (`system-map-20261012.html#node=<node id>`), and comes first on a phone. The box inside is the `<pet>-system-map` tool with its paired lights, and nothing is written in the square (2026-10-23). A missing, misplaced or wrong link is fixed on a branch; the spawned pages get it from the Friendly Farmer's pet program spawner (`npm run build`). Added by Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-19 (Astra: "There's always going to be a system map link back… on the right side of the top right of the page, kind of like where the cyber home is, but on the other side"). |
| ⚪ A65 | Intelligence levels | One tool panel holding the four level panels stacked, L1 at the top, the key to the lights first (on, off, checked and works, report issues, update waiting for your OK, not created). It folds, and so does each level inside it (2026-10-18, 2026-10-21, 2026-10-26). Added 2026-11-12. |
| ⚪ A66 | L1 control panel | 3rd party programs, native programs, shared programs, native tools (or the tools' sides, like Avatar tools and World tools) and devices it looks after, each heading with its count (2026-10-21); every item a pill (A46); a pet's own tool, and every tool that works on the page, in its own tool box; a toolset as one rounded box with its tools inside (2026-11-02). Which programs and tools a pet has is A18 and A54. Added 2026-11-12. |
| ⚪ A67 | L2 control panel | Native tricks with their count, each with how often it runs when it repeats; `self-audit`, `play-with` and `care-for` on every page, play and care off until L3 can run them in the chat (2026-10-22; 2026-11-03, Flash Audit deck, answer 4: A). Nothing else (2026-10-24). What the tutorials teach is A37. Added 2026-11-12. |
| ⚪ A68 | L3 control panel | Only L3 talking with you about this pet program, in the template's three sections with their counts: L3 asks you (an update waiting for your yes, with the yellow light), Suggestions for you, and Seat (2026-10-24). No invented activity, secrets, raw prompts or automatic job launch. 🔵 That the seat it shows is the one the pet chat helper really seated needs a real seat and Astra there (A22). Added 2026-11-12, from A52. |
| ⚪ A69 | L4 control panel | The template's five rounded tool boxes, folded to their names, each with its paired lights: `approvals-waiting-on-you` (approve and decline, from the Farmer's last round and the pet's `waiting_on_you`), `grants`, `keys`, `<pet>-required-maintenance` and `pet-id` (2026-10-22, 2026-10-24, 2026-11-08). What the Pet ID holds is A32. Added 2026-11-12. |
| ⚪ A70 | R W X panel | Right after the four levels, beside the session notes: what each level should be (R W X, at least one row per level, L1 at the top), whether it is ✓ In code, ⚠︎ Rule only or ○ Not built, each row opening to its grants and their proof, then what the pet program may use; from `system-map.json` `access` (2026-10-19). A level with no row is Missing. 🔵 The grants themselves are Astra's (A26, A28). Added 2026-11-12. |
| ⚪ A71 | Session notes | The `notes` tool box with its paired lights: a text box, what the note is about (the whole program or one of its items), add file and submit. Beside the R W X panel, stacking on a narrow window (2026-10-22). That every note reaches the backlog first is A29. Added 2026-11-12. |
| ⚪ A49 | Emotions | The template's nine moods in its order, three to a row (sleepy, awake, idle / curious, happy, worried / alarmed, sick, sad), each the pet beside a cloud with its name in the border and when it shows; awake shows its own drawing, the `blink` frame (A03). A mood with no picture is Missing: the art is A02, new art is Astra's. Describe actual signal/threshold sources and unknown queues. Was "Emotion key" in section 3 ("Pictures and art") until 2026-11-12. |
| ⚪ A41 | Clicker Training | Every program has a bordered list of real desktop click bindings, each number of clicks a pill with its paired lights, in the template's order. One click shows the most important emotion-linked message; two clicks show/hide the Pet Program window (background work is controlled separately); three clicks runs an explicitly assigned quick tool. Verify sequence disambiguation, drag suppression, OFF/permissions and honest unavailable states before claiming native support. 🔵 Binding more tools to clicks is Astra's choice, and the check on her desktop needs her there. |
| ⚪ A39 | Friends list | Just above the footer: every pet it talks to or is planned to, each in a cloud like the emotions with its name in the border ("I manage <its pet program>"), its picture beside it, and the whole of it opening that pet's program page (2026-10-19, 2026-10-22). Each link has an accessible name, keyboard focus and a usable hit area; a pet program not named yet says planned, never a repo standing in for the program. Always open. Was "Pet-icon navigation" until 2026-11-12. |
| ⚪ A51 | Unified footer | One box like every panel: By Astra, a sparkle, her photostar, a sparkle, Find Out More and her links, on one line (Astra, 2026-10-22 and 2026-10-24); no code languages, coin or horizontal scrollbar. Always open, with no More details (2026-11-11). Verify all links remain reachable. |
| 🔵 A22 | Chat | Fixed bottom right: the `<pet>-chat` tool, a pill with its paired lights, its name, a count of what needs you and the open button, opening its square window at once (2026-10-19, 2026-10-20; the framework's section 3, item 10). ⚪ The tool, its button and its window are compared with the template at every build. Then click it (on Data Dealer's page, Data Chip's yellow phone, A44): verify the pet's face, name and seat, the actual L3 connection, agent and task from the pet chat helper, consent, replies, close/reopen and honest disconnected state. A rendered panel alone is not a functioning chatbot. Needs a live seat and Astra there; the Idle Flash Audit marks it Not verified. Was "Chatbot and seat status" in section 5 until 2026-11-12. |
| ⚪ A44 | Original yellow phone | Data Dealer's page only (Astra, 2026-11-03, Flash Audit deck, answer 2: "i like the phone on data dealer, its program needs its own chat"): the `data-chip-chat` tool's open button is the original Chip shell from Data Dealer's dashboard, his face from its drawing on the screen, and the window opens as the phone, its screens LCD green. It is the actual pet chat (the same window, ids and pet chat helper as every pet), with no coin geometry or spinning animation. Every other page has the arrow and the plain window, no phone (answer 2 for the rest: A). Checked at every build. |
| ⚪ A46 | Program pills | Every item is a pill with its two lights, its name and its one line, like the template's pills, the same on every page (Astra, 2026-10-19), and no app icon (2026-11-03, Flash Audit deck, answer 5: A): 3rd party programs, native programs and native tools in L1, each with an accessible name and a real bounded launch route; installer labels distinguish installation from an installed app. 🔵 Checking that a launch really opens the program on Astra's PC needs her there. |
| ⚪ A48 | Paired lights | Two buttons side by side before every item, never stacked (Astra's sketch, 2026-10-18; PET-PROGRAM-FRAMEWORK.md section 3): the left one ON/OFF, green on and red off; the right one maintenance, blue checked and works, orange report issues or not checked yet, yellow an update waiting for Astra's OK, grey not created (2026-10-24 and 2026-10-26). Every pair is one the template shows, each light with its tooltip and a name a screen reader reads. Fixed spacing and common positioning, keyboard focus, state kept in the core, and actual gates. Moved from section 4 on 2026-11-12. |
| ⚪ A45 | Page width | Keep the wide page (Astra, 2026-11-03, Flash Audit deck, answer 7: A): up to 1180 px inside the quiet frame (0.75 inch margins, 2026-10-14 and 2026-10-19), pills three to a row, then two, then one (2026-10-21). No sideways scroll on any screen, checked by Platform Platypus's `fit-check` at desktop, tablet and 390px, on the template first. Real browser acceptance is separate from handler tests. |
| ⚪ A50 | Backdrop and text | Every page is the classic blueprint, the template's colours (Astra, 2026-11-03), and a pet gets colours of its own only when Astra asks, shown to her first (2026-11-03, Flash Audit deck, answer 6: A). Today the Farm, Wonderland Launchpad and Bass & Biscuits have their own, and Data Chip's phone on Data Dealer keeps his neon and LCD greens. All text has a deliberate surface. No approved pet art regenerated. 🔵 A new palette or look is shown to Astra before it lands. |
| ⚪ A38 | Tool organization | Verify browsing by pet, subject category and nested groups, search and multi-category tags, while one canonical tool retains its identity/owner. Distinguish health category from software-health status. |
| ⚪ A12 | Map/catalog navigation | Check icon/program links, program-to-map node link, stable identity and correct relationships in both directions. The link back from every pet program page to its node is A60. |
| ⚪ A31 | Status and link labels | Check data owner, last entry, update/version, seat, map node, and links grouped by kind with origin/location/visibility labels. |

### 7. Tutorials

| ID | Check | Evidence required / exception to report |
|---|---|---|
| 🔵 A36 | First-visit tutorial | The Farm has tutorial-tools and a reopenable first-time-here-tutorial. Its page tool box launches the L3 chatbot into that tutorial and retains a left-side maintenance light and separate ON/OFF switch. Verify OFF prevents launch/stops the active tour. Launching the tour needs a live seat and Astra there. ⚪ The tool box, its lights and its switch on The Farm's page are idle (A20, A48). |
| 🔵 A37 | Play and care SOPs | Every pet has Play with and Care for numbered SOPs delivered in L3 chat, listed as the tricks `play-with` and `care-for` in its L2 control panel and off until L3 can run them there (Astra, 2026-11-03, Flash Audit deck, answer 4: A). Click each one; verify correct chat context, real steps, prerequisites, expected results, version and stop/help path. No standalone tutorial page or fictional steps for planned features. Clicking each tutorial needs a live seat and Astra there. ⚪ Drafting the numbered steps from what the program really does is idle. |
| 🔵 A40 | Guided focus and functioning tour | Exercise Next/Back/Pause/Resume/Exit. Only a step number and soft border/background glow appear at the real target; explanations remain in chat. Verify scroll/resize alignment, missing-target handling, keyboard access, reduced motion, and cleanup on completion/OFF. Verify actual user-visible results, not just source/tests. Needs Astra there; the Idle Flash Audit marks it Not verified. |

### 8. Data, releases and records

| ID | Check | Evidence required / exception to report |
|---|---|---|
| ⚪ A29 | Notes/backlog | Verify notes, screenshots, requests and defect reports persist, retain tool/version association, and reach the actual destination. 🔵 A test that reaches a real outside place (an issue, a message) waits for Astra. |
| ⚪ A30 | Data continuity | Verify export/import, schema version, backup/migration on update and persistence across versions. Private test data stays private. |
| ⚪ A32 | Pet Collar and release trust | Check provenance, signature claims, install/update history and recovery evidence. Planned signing is not verified signing. 🔵 Signing is Astra's (her security key, touch required). |
| 🔵 A33 | Registration/admission | Check candidate/pipeline/registered stage, owner admission, pet-app discovery, registration handoff and dated submission. No automatic trust from discovery. Moving a pet in (candidate, pipeline, registered) is Astra's: nobody becomes an animal by saying so. ⚪ A stage or fact the catalog states wrongly, against GitHub, is corrected idle. |
| ⚪ A34 | Generated artifacts/tests | Use canonical sources/builders; check generated registry/docs/art, documented build/check/tests, visual inspection and relevant runtime acceptance. |
| ⚪ A35 | Handoff and unresolved work | Record exact evidence, commits, touched files, remaining issues, owners and next steps. Say explicitly what is only on a branch. |

Harness seats are model-independent through supported authorized adapters. Do not
force a single provider choice or claim every model already connects automatically.

## 4. New-pet onboarding gate

Before creating anything, decide whether the work belongs to an existing pet. A new pet
needs a distinct program, data and schedule that no current owner covers. A tool belongs
to its parent program and gets no additional permissions merely by existing.

For an approved new pet:

1. Obtain required owner approval for a new repository/admission, paid art and connections.
   Reuse the canonical local checkout; work on an assistant branch.
2. Create required repo files and metadata, including a real entry and sprite file, audit
   block, framework/tool declarations and the pet-app topic. Rules link back to this hub.
3. Use lowercase dated names for new ordinary files. Required names such as pet.json,
   AGENTS.md, README.md and LICENSE conflict with the generic naming rule: surface that
   exception before creating them. Do not rename existing required files.
4. Keep art a draft until approved. Preserve approved reference sheets; never reroll the
   whole herd for one change. Follow the current art pipeline and Chip's native-art exception.
   Preserve Mommy's Mommies as one shared sprite. Use approved mood overlays where applicable.
5. Submit metadata changes through dated cage.submit for the existing compatibility path;
   leave a Farmer registration card. Discovery/pipeline presence does not grant access.
6. Have the Farmer coordinate registry/art/relations; owner approval precedes admission.
   Build generated outputs from canonical sources rather than editing generated files.
7. Run this audit, documented checks and relevant live acceptance. Unbuilt seed functionality
   is recorded as Missing (planned), not a fabricated runtime failure.
8. Commit/push the approved scope, record branch/commit and handoff, and distinguish merge
   and deployment. Do not mark grown merely because the files pass a static check.

## 5. Results and rapid-question format

Keep a private evidence ledger per run: run ID/date, pet/program number, check ID,
status (Pass / Missing / Incorrect / Not verified / Not applicable), evidence location,
source commit/deployed version, impact, proposed fix, owner decision and retest result.
Not applicable needs a reason. Missing access is Not verified, never Pass.
Do not publish personal paths, addresses, mailbox contents or credentials with evidence.

Owner-facing round:

Use a strict **Tools:** list with one exact tool name per line and its status.
List **Tutorial tools:** separately, currently Play with and Care for, rather than
mixing them into the regular tool inventory.
Where source has only a feature/button and no official tool ID, label the suggested
ID **proposed name for existing feature**. Keep implemented source, live deployment,
approved plans and new proposals distinct. Follow with exceptions keyed to tool name
or Program-wide, then a short keep/add/remove/rename question. Never substitute a
vague grouped description for the individual tool list.

> **Round N: icon name — program name**
>
> Current icon and labeled nine-emotion sheet (or Missing).
>
> **Exceptions:** check ID, Missing/Incorrect/Not verified, one plain sentence and next action.
>
> **Decisions:** only unresolved names, tools, integrations, artwork choices or scope.
> Give four explained name options and free text; allow adding tools in plain language.

If no exceptions remain, use one line: "No exceptions found in the checks completed."
Do not claim an unaudited pet, live interaction, security boundary or deployment passed.

## 6. Goldfish tool contract and remaining implementation

The manual procedure can be used now. Its future tool box must have the versioned label,
left-side maintenance light, enforced ON/OFF, scope selector, run/progress/cancel,
exception matrix, evidence links, review questions and exportable report. Account access
must be declared; read-only inspection is the default. Repair is a separate authorized action.

Goldfish's pet.json and README record partial implementation: manual instructions plus
the read-only local preflight. The complete interactive audit flow is still pending.
No MCP endpoint or schedule is created by this sheet or the local CLI.

## 7. Name suggestions (unselected alternatives)

Owner refinement, 2026-10-14: tutorial-tools belongs to The Farm; each pet owns its
Play with / Care for numbered SOPs, indexed by The Farm. Cross-pet navigation uses
icon hyperlinks throughout the programs. The shared framework defines these standards;
checks A36-A40 enforce them. Tutorials run in L3 chat, launched from page tool boxes
that retain manual health reporting and ON/OFF. This supersedes the earlier standalone,
agent-optional tutorial wording. These are requirements, not implemented UI claims.

- **Flash Audit**: the owner's working name; quick rounds backed by thorough checks.
- **Fin Check**: short and specific to GitHub Goldfish. Recommended pet-themed option.
- **School Inspection**: a school of fish reviewing the whole pet collection.
- **Pet Collar Check**: emphasizes identity, provenance and readiness, though the audit
  also covers behavior and tools beyond the collar.

Keep Flash Audit until Astra chooses otherwise; no renaming based on suggestions alone.

## Current visual checks A44–A52 — owner corrections, 2026-10-15

These replace the October 14 coin, pink-theme, hidden-control and never-wrap footer rules.

Rows moved into the matrix in section 3, in priority order.

## Program icons — owner correction, 2026-10-17

Rows moved into the matrix in section 3, in priority order.

## Mandatory Clicker Training preservation — owner correction, 2026-10-15

A41 is a required shared Pet Program control, not an optional tutorial or a chat-launcher description. Every page must visibly retain a bordered Clicker Training section with One click, Two clicks, and Three clicks rows. Do not collapse it into a generic Click bindings bubble, remove it during a layout migration, or replace it with phone/chat instructions. Display the actual assigned quick tool and verification state; say unassigned or not verified where appropriate. Audit desktop and 390px mobile layouts, and confirm the section remains after regeneration. Native timing, drag suppression, permissions and OFF checks remain required before claiming the desktop bindings work.

Recorded by OpenAI Codex (GPT-6).

## The Flash Audit against the pages — owner answers, 2026-11-03

Claude Opus 5.5 (`claude-opus-5-5`, the "Friendly Farmer" chat) checked every row above about pet program pages
against the framework, Astra's later decisions and the Model Pet Program, and asked her eight questions in a slide deck.
Astra, 2026-11-03: "i like the phone on data dealer, its program needs its own chat, all other reccd". The rows now say:

| Question | Her answer | Rows |
|---|---|---|
| 1. Awake and idle look the same | A: awake shows its own drawing with the twinkles; the model has an open-eyed one; real pets keep theirs until she OKs new art | A03, A49 |
| 2. The yellow phone | Data Dealer's chat is Data Chip's own phone; every other page keeps the arrow and the plain window | A22, A44 |
| 3. The L3 activity bubble | A: no bubble; the editorial status panel and the L3 control panel do its job | A52 |
| 4. Play and care tutorials | A: two tricks, `play-with` and `care-for`, in L2 on every page, off until L3 runs them | A37, A47 |
| 5. App icons on program pills | A: names only | A46 |
| 6. One palette, or one per pet | A: the blueprint, a pet's own colours only on request, shown to her first | A50 |
| 7. Page width | A: keep the wide page, no sideways scroll on any screen (Platform Platypus's `fit-check`) | A45 |
| 8. More details | A: four lines on every panel (how it works, where it comes from, your rules, not built yet), only the arrow in the two top squares and the chat | A47 |

Rows a later decision of hers had already replaced are updated to it: A20 and A48 (the lights' colours, 2026-10-24 and
2026-10-26), A61 (the nine stickers, 2026-10-24), A51 (the footer, 2026-10-22 and 2026-10-24), A46 (pills, 2026-10-19)
and A47 (the L1 headings, 2026-10-21). The 2026-10-15 notes below keep their history; where one disagrees with a row,
the row wins.

## The page checks follow the Model Pet Program — 2026-11-12

Astra, 2026-11-12: "We need to focus on the Flash audit and how it works, and its connection to the template pet
program, because those two things kind of need to go hand in hand, so that when we do audits and we're looking at user
interface, that we're auditing it based off of what's on the template, and then those are items on the Flash audit."
Claude Opus 5.5 (`claude-opus-5-5`) lined section 3's page checks up with the template, one check per part, in the
template's order, and made every build compare every pet program page with it (`scripts/flash-template-20261112.mjs`).
No ID changed; a check that moved keeps its ID.

| Part of the template | Check | Before |
|---|---|---|
| (every part, in order) | A47 | "Shared base": its pieces are now the checks of their parts |
| editorial status panel | A52 | "L3 on the page" (its L3 control panel half is A68) |
| cyberhome | A62 | new |
| title and version | A63 | new |
| quick summary | A64 | new |
| System Map box | A60 | the same |
| intelligence levels | A65 | new |
| L1 control panel | A66 | new (L1's headings were in A47) |
| L2 control panel | A67 | new (`play-with` and `care-for` were in A47) |
| L3 control panel | A68 | new (was half of A52) |
| L4 control panel | A69 | new |
| R W X panel | A70 | new |
| session notes | A71 | new (was in A47) |
| emotions | A49 | "Emotion key", in section 3 ("Pictures and art") |
| clicker training | A41 | the same |
| friends list | A39 | "Pet-icon navigation" |
| unified footer | A51 | "Footer" |
| chat | A22 | "Chatbot and seat status", in section 5 |
| (the whole page) | A44, A46, A48, A45, A50 | A48 from section 4; the rest the same |

The auditor stopped taking four of Goldfish's preflight rows that looked in each pet's own app for markers the pages
no longer use (A41's old section, A44's phone on every page, A45's old stationery, A52's activity bubble: 83 findings
each on 2026-11-08), and stopped counting as its own the checks the preflight only marks Not verified, which The Farm
had shown as "all pass" (`PREFLIGHT_LEFT_OUT` in `scripts/flash-audit-checks-20261108.mjs`).


### Owner visual standard — 2026-10-15
Every visible text item must sit inside a bubble, card, label plate, or other intentional background; never leave raw copy floating on the stationery. Emotion labels use the normal page text color, set into the rounded speech-bubble border, with the pet on the right. Status and emotion settings need their own surfaces. Keep the portrait sheet fixed in width (replaced 2026-11-03: the wide page, A45) and let footer groups wrap into spacious, slightly staggered rows between its top and bottom rules. No horizontal footer scrollbar, clipping, or hidden footer links. Verify at desktop and mobile widths; preserve Clicker Training.


### Base structure and application launchers — owner correction 2026-10-15
Replaced in part: every item is a pill with no app icon (2026-10-19 and 2026-11-03, A46), and the tutorials are two
tricks in L2 (2026-11-03, A37, A47). Order: Third Party Programs, Your Programs, Your Tools, then one shared two-column section with Your Tutorials on the left and Your Notes on the right. Stack that pair on narrow screens. Preserve Clicker Training and About below it. Application rows use square cloud-framed tiles containing actual application icons and names, with one-click launch actions; do not hide launchers behind a disclosure or send an installed-app launcher to a marketing website. Clearly distinguish installers from standalone apps (BetterDiscord opens its verified installer; it is a Discord modification). Launch routes must be fixed and bounded, with visible failure feedback. Verify the real application launch separately from rendering. No invented app integrations. Damsel uses slightly deeper blue wrinkled stationery with purple/light-blue controls and small neon-pink accents; no pink base theme or sharp diagonal folds.


Tool controls standard (2026-10-15; replaced in part by Astra's sketch of 2026-10-18: the two lights side by side
before the name, never stacked, with the maintenance colours of A20 and A48): two compact glossy, lightly sparkling status-light buttons stacked together on the left edge of each tool bubble, vertically centered when possible and aligned at the top for expanded content. Keep a fixed 6px gap between the lights; move the pair as one unit. Top: green on / red off. Bottom: blue working / orange owner-marked maintenance. No visible ON or Not Working text. Keep title tooltips, explicit accessible state labels, keyboard focus and reduced-motion support. Both lamps remain usable when collapsed or disabled; maintenance toggles persist and feed existing health reporting. Blue is the manual health flag, not proof of a successful runtime check.


Owner correction, 2026-10-15 (replaced 2026-10-19: every item is a pill, A46): cloud-shaped square tiles are for Third Party Programs only. OpenAI and Anthropic presence controllers belong under Your Tools in the regular rounded tool bubbles, with their paired left lights and Discord-style profile-card previews inside. Other owner-created programs use regular program/tool bubbles rather than third-party cloud tiles. Hide an empty Your Programs row.
