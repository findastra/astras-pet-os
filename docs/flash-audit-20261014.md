# Flash Audit: pet onboarding and review instruction sheet

Working name: **Flash Audit**. Owner: **GitHub Goldfish**, program **GitHub Aquarium**.
Tool label: `github-aquarium-v1.0-flash-audit-v1.0`.
By Astra. Compiled with OpenAI Codex (GPT-6), 2026-10-14.

This is a usable manual audit procedure and a specification for a future tool interface.
Goldfish now also has a read-only local metadata preflight at `scripts/flash-audit-local-20261015.mjs`. It is not a complete automated auditor, deployed service, or security certification.
Use it for new pets, existing pets, and the restarted rapid-question review of every pet.
Goldfish owns the audit; the Farmer owns registry/admission coordination. No new pet is needed.

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

All checks, A01-A59, are in one matrix in section 3, most important first. The dot at the start of each row says
whether it needs Astra (section 3, "Grey and blue dots").

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
| ⚪ A09 | Program interface | Inspect a real interface and required framework sections. Flag missing page, placeholder, dead controls or incomplete blocks. Missing framework sections are built to PET-PROGRAM-FRAMEWORK.md (code: the round card names the fix for the pet's chat). 🔵 What a program with no job yet should do waits for A08. |
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
| ⚪ A15 | README and credit | Check how-to-run and Limits, public credit "An Intelligent App, or Pet, by Astra.", model/version/date, license, truthful status and naming exceptions. |
| 🔵 A56 | Work saved in its native folder | Everything the project works on lives where a developer expects it: source, tools, pictures, docs and build output in its own repo folder (`%USERPROFILE%\Documents\Astra's PetOS\<repo>`); the user's own data (private records, saved chats, settings) in its declared data folder outside the repo (`%LOCALAPPDATA%\<repo>\`, recorded as `data_folder` in pet.json); caches and logs in that data folder, never in the repo. Nothing it makes lands in Downloads, the Desktop, a dated chat folder (`Documents\Codex\<date>`, `Documents\ChatGPT\...`), the hub or another pet's folder. Check pet.json, the code's write paths and a File Master scan of the PC. Report each stray file with its proper home; moving it goes through a File Master plan that Astra approves. ⚪ Declaring `data_folder` in pet.json and writing the plan rows are idle; changing where the code writes is named on the round card for the pet's chat. |
| ⚪ A57 | Current names only | Live text uses today's names: **Astra's PetOS** and `astras-pet-os` (never `Astra's Pet Apps`, `astras-pet-apps` or `findastra-pet-apps`), the folder `Documents\Astra's PetOS` (never `Documents\Projects`), each repo's current GitHub name, and the pet and program names in `pet-programs.json`. Lines that tell history keep the old name, and so do names that code depends on (browser storage keys, `%LOCALAPPDATA%\astras-pet-apps`, file names other programs open): report those with what a rename would take. Fix documents on a branch; code waits for its owner. Added by Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-17, in the first Idle Flash Audit. 🔵 Renaming a name that code depends on is Astra's. |
| ⚪ A16 | Metadata and self-audit | Validate pet.json including job, runs_on, entry, sprite, status, framework, tools, links and audit cadence/subject/needs. Hatching/growing/grown must reflect evidence. 🔵 A field the pet submitted itself (`cage.submit`) that the registry has not taken is a decision, not an idle fix. |
| ⚪ A17 | Git and deployment | Record dirty files, ahead/behind commits, pushed branch, merged state and deployed version separately. Do not reset/stash/discard another agent's work. |

### 3. Pictures and art
What people see first.

| ID | Check | Evidence required / exception to report |
|---|---|---|
| ⚪ A55 | Pictures | The README and the repo page show **several real pictures** of what the project does, best picture first: the pet, its program page, and the program working. Creative projects (worlds, art, sites, games) have **at least three**, including in-world or 3D views. Program PFDs (the System Map, diagrams, especially the 3D views) appear as pictures too. Pictures are committed in the repo (`docs/images/<name>-<date>.png`), have alt text, and show no personal data, private chats or other people without their OK. Made or refreshed with `project-image-generator` (GitHub Goldfish's tool; Portfolio Puffer uses it by grant), and the portfolio (findastra.github.io) shows them. Pet art alone or a placeholder is Missing, not Pass. 🔵 Pictures only Astra can take (in-world VRChat shots, her desktop, Discord or OBS, anyone else in the picture) wait for her (card 026). |
| 🔵 A02 | Nine emotions | Show Sleepy, Awake, Idle, Curious, Happy, Worried, Alarmed, Sick and Sad; inspect all frames for missing, duplicate, mislabeled or inconsistent expressions. New or redrawn art is Astra's (it costs money, and approved art is redrawn only with `--match`). |
| ⚪ A03 | Emotion behavior | Verify each state is reachable and means the correct runtime condition, not just that its PNG exists. Legacy filenames may remain stable; labels use the current nine states. Blink is an animation only. |
| ⚪ A58 | One art source | Every picture of the pet (desktop frames, web frames, mood sheets, icon, folder icon, README pet picture, portfolio copy) has **one home**: this hub's `art/` and `desktop-art/` folders, published at `https://raw.githubusercontent.com/findastra/astras-pet-os/main/<path>`. Programs and pages read the picture from there (that URL, or the hub's own folder on Astra's PC for the desktop pets), so changing the picture in that one place changes it everywhere without touching any program's code (the standard term is a single source of truth for assets). Run `node scripts/one-art-source-20261017.mjs` (read-only; `GITHUB_TOKEN` for every repo, `--branch <name>` to check open pull requests): it lists every picture in any findastra repo that is a copy of a hub file (git blob hash) or looks like pet art kept outside the hub, and reports Incorrect for each. The move to the hub was approved by Astra on 2026-10-18 and done in one pull request per repo ([docs/one-art-source-20261017.md](one-art-source-20261017.md)). The desktop pets' local draft list (`%LOCALAPPDATA%\astras-pet-apps\desktop-drafts-20261011.json`) must point into the hub, not into pet working copies. Exception: art that may not be public (Claude Bot's exact copy of ChatGPT's BSOD, Astra 2026-10-17) stays only in the pet's private repo; the hub keeps a public stand-in and says so. Recorded by Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-17. 🔵 Which art may not be public is Astra's, and so is deleting the old copies (agents never delete). |
| 🔵 A04 | Art publication | Compare local active assets with individual-repo blobs, including sheet, frames and sprite metadata. Report unpushed or stale art and invalid paths. Art is a draft until Astra approves it, so publishing new art is hers. ⚪ An invalid path to approved art already in the hub is fixed idle. |
| 🔵 A05 | Art format and provenance | Check transparent 256px source frames, approved style/body/size, black outline, no unwanted sparkles, source/license, and owner exceptions. Separate source resolution from desktop display size. A redraw is Astra's (it costs money). |
| ⚪ A49 | Emotion key | Sleepy, Awake, Idle, Curious, Happy, Worried, Alarmed, Sick, Sad in 3/2/1 columns. Label in white rounded bubble border, pet on right; blink is animation, not a state. Describe actual signal/threshold sources and unknown queues. |

### 4. Tools and safety

| ID | Check | Evidence required / exception to report |
|---|---|---|
| 🔵 A18 | Official tool and trick inventory | Separate implemented, owner-approved planned, and proposed tools. Record purpose, version, owner, permissions, dependencies and add-your-own decisions. List the pet's tricks the same way: its own skills (L2 module, kept by Skill Scout), apart from the harness skills the seat brings (L3; PET-PROGRAM-FRAMEWORK.md section 3). Which tools and tricks each pet should have is Astra's. ⚪ Listing what is built, merged or only on a branch, from the code, is idle. |
| ⚪ A19 | Tool behavior | Verify inputs, outputs, errors and intended actions for each tool. Use safe fixtures for changing actions; live checks require authorized scope. Fixture checks run in a scratch copy with made-up data and no sign-in. 🔵 A live check (Astra's real data, an account, her PC) needs her there. |
| 🔵 A21 | Tool OFF enforcement | Verify execution actually stops/prevents new work, state is controlled outside the tool, and security OFF cannot be self-reenabled. Report unsupported enforcement as a gap. Enforcement is a security change, so L4 (Astra) approves it, and checking it live needs her there. |
| ⚪ A20 | Manual maintenance light | Every tool has a maintenance light, the right one of its pair (blue working correctly, yellow requires maintenance; Astra, 2026-10-18), distinct from ON/OFF and automatic health. Report persists to backlog/Farmer; tests cannot silently clear it. |
| ⚪ A48 | Paired lights | Two buttons side by side before every item, never stacked (Astra's sketch, 2026-10-18; PET-PROGRAM-FRAMEWORK.md section 3): the left one ON/OFF, green on and red off; the right one maintenance, blue working correctly and yellow requires maintenance (yellow replaces orange). Fixed spacing and common positioning; tooltips, keyboard focus, a name a screen reader reads, state kept in the core, and actual gates. |
| 🔵 A26 | Privacy and permissions | Check exact allowed data/actions, owner approvals, secret storage and untrusted inputs. No private data or credentials in public repos/reports. Every permission, grant and leaked secret is Astra's (L4). ⚪ A personal path in a public document is replaced with `%USERPROFILE%` on a branch. |
| 🔵 A25 | Integrations/accounts | Check supported services, feature detection, account selection, connection denial, expiry, disconnect and provider-specific limits. No connection from domain guessing alone. Accounts and connections are Astra's; nothing signs in while she is away. |
| ⚪ A27 | Preview and recovery | For changes, verify appropriate preview/approval, undo or recovery, partial failures, retry safety and audit records. |
| ⚪ A42 | Credential help | Adjacent (?) What is this hover/focus memo explains optionality, purpose, scope, storage and destination without exposing secrets. |
| 🔵 A28 | Pet connections | Verify sender/receiver, purpose, granted scope, actual data flow, last exchange and independent connection OFF. Match registry relations and map. A connection and its grant are Astra's (L4). ⚪ Making `relations` in pets.json, system-map.json and the page agree with grants she already approved is idle. |

### 5. Chat and agent

| ID | Check | Evidence required / exception to report |
|---|---|---|
| 🔵 A22 | Chatbot and seat status | Click the exact pet-icon launcher; verify the shared chat panel, header [Pet name] Chat in the original yellow phone, actual L3 connection/model/task, consent, replies, close/reopen and honest disconnected state. A rendered panel alone is not a functioning chatbot. Needs a live seat and Astra there; the Idle Flash Audit marks it Not verified. |
| 🔵 A52 | L3 activity bubble | Every Pet Program has a visible yellow **[Pet name] · L3 activity** bubble, green LCD and black outline near the top. Show actual provider/task/session, timestamps and concise bounded events. Verify disconnected, idle, working, awaiting review, complete, error, OFF and stale states against a real authorized host. No invented activity, secrets, raw prompts or automatic job launch. The source preflight reports Missing or Not verified, never runtime Pass from an embed marker. Check desktop/mobile layout and persistence after regeneration. The live check needs a real seat and Astra there. ⚪ A bubble missing from the page is named on the round card for the pet's chat (shared framework code). |
| 🔵 A23 | Chat-created tools | Verify request capture, authorized agent dispatch, build progress, independent review, tests, version registration and list entry. No self-granted access. Needs a live seat and Astra there. |
| ⚪ A24 | Ready indicator | Green plus text refers to a checked version; connection and authorization are separate. Failures or unreviewed code cannot appear ready. |
| 🔵 A43 | Emotion/message hierarchy | Verify simultaneous conditions select one highest-priority unresolved message and matching emotion using explicit policy, not frame order. Test stale success, failure, owner-needed state, dismissal and cosmetic blink. Missing global hierarchy is Not verified, not an invented priority order. The priority order is Astra's to approve (the framework's emotions table holds a proposed order, 2026-10-18). |

### 6. Page layout standard

| ID | Check | Evidence required / exception to report |
|---|---|---|
| ⚪ A44 | Original yellow phone | Shared original Chip shell; current pet artwork; opens the actual pet chat without coin geometry or spinning animation. Preserve existing host handlers. |
| ⚪ A45 | Paper and zoom | Portrait paper width; normal initial view; Ctrl+wheel from full-page fit to 100%, no zoom bar; no horizontal overflow at 390px. Real browser acceptance is separate from handler tests. |
| ⚪ A46 | Program launch rows | Third Party Programs then Your Programs: square cloud-framed app icons with accessible names and real bounded launch routes; installer labels distinguish installation from an installed app. 🔵 Checking that a launch really opens the program on Astra's PC needs her there. |
| ⚪ A47 | Shared base | Your Tools followed by Your Tutorials/Your Notes side by side, stacking on narrow screens; exactly two Play/Care tutorials; visible Clicker Training and About. |
| ⚪ A50 | Backdrop and text | Each pet has a distinct stationery palette; Damsel blue wrinkles, purple/light-blue controls and restrained neon-pink sparkles. All text has a deliberate surface. No approved pet art regenerated. 🔵 A new palette or look is shown to Astra before it lands. |
| ⚪ A51 | Footer | Centered, spacious, slightly staggered wrapping groups between thin rules; status, Made by Astra/date, social icons and static Farmer home icon. No coin or horizontal scrollbar. Verify all links remain reachable. |
| ⚪ A41 | Clicker Training | Every program has a bordered list of real desktop click bindings. One click shows the most important emotion-linked message; two clicks show/hide the Pet Program window (background work is controlled separately); three clicks runs an explicitly assigned quick tool. Verify sequence disambiguation, drag suppression, OFF/permissions and honest unavailable states before claiming native support. 🔵 Binding more tools to clicks is Astra's choice, and the check on her desktop needs her there. |
| ⚪ A39 | Pet-icon navigation | Every cross-pet program hyperlink is the current pet icon, with accessible name, tooltip, keyboard focus and usable hit area. Check real destination, hosted/local assets and offline behavior where applicable. Missing program route shows unavailable, not a repo substituted as the program. |
| ⚪ A38 | Tool organization | Verify browsing by pet, subject category and nested groups, search and multi-category tags, while one canonical tool retains its identity/owner. Distinguish health category from software-health status. |
| ⚪ A12 | Map/catalog navigation | Check icon/program links, program-to-map node link, stable identity and correct relationships in both directions. |
| ⚪ A31 | Status and link labels | Check data owner, last entry, update/version, seat, map node, and links grouped by kind with origin/location/visibility labels. |

### 7. Tutorials

| ID | Check | Evidence required / exception to report |
|---|---|---|
| 🔵 A36 | First-visit tutorial | The Farm has tutorial-tools and a reopenable first-time-here-tutorial. Its page tool box launches the L3 chatbot into that tutorial and retains a left-side maintenance light and separate ON/OFF switch. Verify OFF prevents launch/stops the active tour. Launching the tour needs a live seat and Astra there. ⚪ The tool box, its lights and its switch on The Farm's page are idle (A20, A48). |
| 🔵 A37 | Play and care SOPs | Every pet has Play with and Care for numbered SOPs delivered in L3 chat. Click each page-listed tutorial tool; verify correct chat context, real steps, prerequisites, expected results, version and stop/help path. No standalone tutorial page or fictional steps for planned features. Clicking each tutorial needs a live seat and Astra there. ⚪ Drafting the numbered steps from what the program really does is idle. |
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


### Owner visual standard — 2026-10-15
Every visible text item must sit inside a bubble, card, label plate, or other intentional background; never leave raw copy floating on the stationery. Emotion labels use the normal page text color, set into the rounded speech-bubble border, with the pet on the right. Status and emotion settings need their own surfaces. Keep the portrait sheet fixed in width and let footer groups wrap into spacious, slightly staggered rows between its top and bottom rules. No horizontal footer scrollbar, clipping, or hidden footer links. Verify at desktop and mobile widths; preserve Clicker Training.


### Base structure and application launchers — owner correction 2026-10-15
Order: Third Party Programs, Your Programs, Your Tools, then one shared two-column section with Your Tutorials on the left and Your Notes on the right. Stack that pair on narrow screens. Preserve Clicker Training and About below it. Application rows use square cloud-framed tiles containing actual application icons and names, with one-click launch actions; do not hide launchers behind a disclosure or send an installed-app launcher to a marketing website. Clearly distinguish installers from standalone apps (BetterDiscord opens its verified installer; it is a Discord modification). Launch routes must be fixed and bounded, with visible failure feedback. Verify the real application launch separately from rendering. No invented app integrations. Damsel uses slightly deeper blue wrinkled stationery with purple/light-blue controls and small neon-pink accents; no pink base theme or sharp diagonal folds.


Tool controls standard (2026-10-15): two compact glossy, lightly sparkling status-light buttons stacked together on the left edge of each tool bubble, vertically centered when possible and aligned at the top for expanded content. Keep a fixed 6px gap between the lights; move the pair as one unit. Top: green on / red off. Bottom: blue working / orange owner-marked maintenance. No visible ON or Not Working text. Keep title tooltips, explicit accessible state labels, keyboard focus and reduced-motion support. Both lamps remain usable when collapsed or disabled; maintenance toggles persist and feed existing health reporting. Blue is the manual health flag, not proof of a successful runtime check.


Owner correction, 2026-10-15: cloud-shaped square tiles are for Third Party Programs only. OpenAI and Anthropic presence controllers belong under Your Tools in the regular rounded tool bubbles, with their paired left lights and Discord-style profile-card previews inside. Other owner-created programs use regular program/tool bubbles rather than third-party cloud tiles. Hide an empty Your Programs row.
