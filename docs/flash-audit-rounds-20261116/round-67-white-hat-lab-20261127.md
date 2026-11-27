# Round 67: White Hat Weasel — White Hat Lab

[All rounds](README.md) · Stage: **pipeline** (`pets.json` status `hatching`) · Repo:
[findastra/white-hat-lab](https://github.com/findastra/white-hat-lab) (private) · audited `main` at `225fbaa` · hub
`main` at `8892f753` · Flash Audit, 2026-11-27

All 72 checks were run in the matrix's order. The first table lists only what is not a pass, as the earlier rounds do.
The second lists every check with its result. Nothing was changed in any repo.

**Fixed in the same pull request** (after the audit, 2026-11-27; `changes/white-hat-lab-tp-link-checks-20261127.md`):
TP-Link's "Open it" opens in a new tab (A19, first half), and `pets.json` now has White Hat Lab's `checks` (A20, part
2): port-check-tool, port-watch-tool, ghost-in-the-walls-tool and Wireshark blue (checked, works), TP-Link orange (the
Claude chat's browser pane blocks the router page's scripts), MCP Inspector and MacAttack grey (not created). Astra
settled part 1 the same day: the key stays as it is, blue until she clicks a light orange. Everything else below is
still open.

## How it was checked

- **The Run's checks:** the auditor ran again for item 67 alone (`idle-flash-audit-20261017.mjs <out> 67`), with
  Goldfish's preflight from her PC. It ran from a scratch folder behind a write guard, and wrote only
  `run-67/ledger.json` there. It found 10 rows: A09, A10, A59, A16 three times, A18, A26 twice and A55.
- **The page checks:** `checkPage` (`scripts/flash-template-20261112.mjs`) compared White Hat Lab's page with the Model
  Pet Program. Nothing differs: its 17 parts are in the template's order, and its 16 pills and 25 pairs of lights all have
  the template's shapes (`template-check-67.json`).
- **By hand:** the repo's `README.md`, `AGENTS.md`, `CLAUDE.md`, `SECURITY.md`, `LICENSE` and `pet.json`, the list of its
  scans and skills, its two open pull requests and its branches. In the hub: White Hat Lab's `pets.json` entry, its
  nodes, links and grants in `system-map.json`, the built System Map, `TOOLS-AND-TRICKS.md`, `INTELLIGENCE-LEVELS.md`,
  the page with its script and style, the server and the Ghost In The Walls watch, and Startup Star's code. Open hub pull
  requests that touch these files were listed too.
  - **Tests:** the server's, the guest list's and the own-server tests pass, 24 of 24.
  - **On the PC (read only):** the server runs as its own `node` process, started by Startup Star. Its data folder,
    menu, mood and logs were read, and nothing was copied out. The `white-hat-lab` folder was looked at too.
  - **click-check, outside links not followed:** 164 clicks, nothing broken. The public tool pages each answer 200.
  - **Width, in headless Edge at 390, 768 and 1280 px:** no sideways scroll at any width.
  - **Live site:** the public copy of the page is the same as `main`, apart from line endings. Pages last built
    `8892f753`.
- **Not done:** nothing was clicked for Astra, launched for her or signed in to, and the router was not contacted. So
  the router's frame header behind the TP-Link finding was not checked again this round.

## Missing, Incorrect and Not verified

| Check | Result | What was found | Fix |
|---|---|---|---|
| ⚪ A59 Pet program and its link | Missing | The README never links to White Hat Lab's pet program page. Every other place does: `pets.json` `interface_url` and `interface_local_url`, the profile, The Farm's card and the System Map. | ⚪ Add the link to the README (the auditor's `a59-readme` fix): `https://findastra.github.io/astras-pet-os/apps/pet-programs/white-hat-lab-20261018.html`. |
| ⚪ A53 Program icon matches its folder | Missing | The PC folder `white-hat-lab` has no `desktop.ini`, so it has no icon of its own. It holds no shortcuts. It is not in `pet-folder-icons-20261014`'s assignments. The hub has its icon, `art/icons/white-hat-lab-20261012.png`. | 🔵 Astra picks its folder icon. The hub icon is the obvious one. |
| ⚪ A09 Program interface | Missing (metadata) | The Run says `pet.json` declares no `entry`. The interface itself is real and complete: the hub page has 4 working native tools and matches the template. The program lives in the hub (its tools and its server), and the repo has no app. So the Pet ID says "App: no app wired up yet". | 🔵 Is the hub page White Hat Lab's app, as for its server, or does the repo get an app of its own? Until that is decided, `entry` has nothing in the repo to point at. |
| ⚪ A10 Website route | Missing | `pets.json` has no `interface_live_url`, and the repo is private with no `homepage`. The page is public on the hub's site and answers 200. | 🔵 The same question as round 8, decision 3: register the hub page as the address? This is a private pet, so it is Astra's. |
| ⚪ A54 Third-party programs | Incorrect | Two programs made by others that White Hat Lab runs are on no list. **REA** (Reverse Engineer Anything) is on her PC and registered with Claude Code, and White Hat Lab keeps its skill (white-hat-lab#12). **`tplinkrouterc6u` 5.42.0** is the Python library the Ghost In The Walls reader runs. The lists they are missing from: the page's 3 third-party programs, `pets.json` `needs.programs` (lines 3938–3949: MCP Inspector and Wireshark only), `system-map.json` (no node, no link) and `TOOLS-AND-TRICKS.md:460-466`. `INTELLIGENCE-LEVELS.md` has **no White Hat Weasel row at all**: 53 rows, and other pipeline pets such as Kernel Koala have one. `pet.json` lists none. | ⚪ Make the lists agree with the code and the PC: add a REA node and a `tplinkrouterc6u` node with links from `white-hat-lab`, add them to `needs.programs`, add a White Hat Weasel row to `INTELLIGENCE-LEVELS.md`, then build. Mechanical. `INTELLIGENCE-LEVELS.md` is touched by 9 open hub pull requests, but a new row is a pure addition. |
| ⚪ A15 README and credit (Goldfish's) | Incorrect | The credit, the model and date, and the license are fine. The status is out of date. `README.md:6` says "Stage: **Roadmap**: named and approved, not built yet", but it has been pipeline since 2026-11-02. `README.md:10-12` "Run it" says "Nothing to run here yet", but the server runs at sign-in and 4 tools work. `README.md:27-28` Limits says "Nothing is built … no runtime" and "No pet art yet", but nine drawings have been in the hub since 2026-11-15, unregistered. No tool and no server is named. | ⚪ Rewrite Stage, Run it and Limits. Run it: the page in the hub, plus `node scripts/white-hat-lab-server-20261120.mjs`, which Startup Star starts. Limits: ON/OFF not enforced, MacAttack and MCP Inspector planned, art not registered. Mechanical, facts only. |
| 🔵 A56 Work saved in its native folder | Missing | `pet.json` declares no `data`. The server writes to `%USERPROFILE%\Documents\Astra's PetOS Data\white-hat-lab` (page data, state, logs) and to `%LOCALAPPDATA%\astras-pet-os\white-hat-lab` (menu, mood, lock), and never to a repo. A leftover `port-watch-20261119.lock` from the server's old name (2026-11-20) still sits beside the new `white-hat-lab-server-20261120.lock`. The code lives in the hub, which was decided (the server line), so that is not a finding. | ⚪ Declare `data` in `pet.json`, the way pc-master-race's `pet.json` does. The stale lock is a File Master plan row: removing it is Astra's OK. |
| ⚪ A57 Current names only | Incorrect | `SECURITY.md:3` calls the program "`pet-program-67`", the placeholder name. Startup Star's menu says "Quit the port watch" (`scripts/white-hat-lab-server-20261120.mjs:247`), but it stops all of White Hat Lab's server, the Ghost In The Walls watch included. Other servers' menus say "<program>'s server". `pet.json:5` and `pet.json:16` say `pet-app` (held on #256). | ⚪ `SECURITY.md`: "White Hat Lab". Menu text: "Quit White Hat Lab's server". `test/port-watch-test-20261119.mjs:131` asserts the old text, so change it in the same change. Mechanical. `pet-app` waits on #256. |
| ⚪ A16 Metadata and self-audit | Missing + Incorrect | `pet.json:12` status is `roadmap`, but the registry says `hatching` (`pets.json:3916`). `AGENTS.md:5` still says "This pet is a roadmap: it is not an animal on the farm until Astra lets it in at the gate". There is no `audit` block (the registry has one, `pets.json:3921-3925`). It has no `runs_on`, `entry`, `sprite`, `tools`, `data`, `built_with`, `implementation_status`, `updated` or `links`. | ⚪ Status `hatching`. Copy the audit block. `runs_on`: Windows 10 or 11 with Node, the server started by Startup Star, and Python with `tplinkrouterc6u` for the guest reader. List the 4 tools from `system-map.json`. Add `built_with` and `updated`. Fix the `AGENTS.md` line. All mechanical. `sprite` waits on the art. `entry` waits on A09. |
| ⚪ A55 Pictures | Missing | The README shows 0 pictures. | ⚪ Add pictures of the page and its tool boxes, as on the public page (which shows no private report), with `project-image-generator`. The pet's own picture waits on the redraw. |
| 🔵 A18 Official tool and trick inventory | Missing + Incorrect | `pet.json` declares no tools (preflight). The page, `TOOLS-AND-TRICKS.md` and `system-map.json` agree on 4 native tools (port-check-tool, port-watch-tool, TP-Link, ghost-in-the-walls-tool) and 3 third-party programs. The page's tricks are self-audit (works today), play-with and care-for (planned), and L3's weekly-suggestions (planned). The repo's own skill, `skills/reverse-engineer-anything` (merged in white-hat-lab#12, "White Hat Lab keeps its master"), appears nowhere in the hub: neither as an L2 trick nor as an L3 harness skill. | ⚪ Write the 4 tools into `pet.json` (with A16). 🔵 Is the REA skill a White Hat Lab trick (L2) or a harness skill (L3)? It is a copy of someone else's skill (MIT). |
| ⚪ A19 Tool behavior | Incorrect | Two buttons go wrong. (1) **Known:** TP-Link's "Open it" (`href="http://tplinkwifi.net"`) has no `target`. `scripts/pet-program-pages-20261018.mjs:555` adds `target="_blank" rel="noopener"` only for `i.inPill` tools, and TP-Link has no embed, so inside a frame the router's frame header blocks it. (2) ghost-in-the-walls-tool's box shows the guest list, but its "Open it full screen" opens the public puzzle portal instead, because `system-map.json:909` `url` is `https://findastra.github.io/ghost-in-the-walls/` while `embed` is the guest list page. What works: fixtures 24/24. The server's logs show the port watch looking every 10 minutes and the guest watch every 30 minutes today. The tool pages answer 200 and click-check found nothing broken. A live run of each tool with Astra is Not verified. | (1) ⚪ Being fixed by someone else: give non-pill "Open it" links to outside pages `target="_blank" rel="noopener"`. Mechanical. (2) ⚪ Set `url` to `https://findastra.github.io/astras-pet-os/apps/white-hat-lab-ghost-walls-20261126.html` and keep the portal's link in its job text, then build. Mechanical. |
| 🔵 A21 Tool OFF enforcement | Missing (gap) | Every ON/OFF light on the page says "your choice, saved in this browser. Nothing on the PC switches yet". Switching port-watch-tool or ghost-in-the-walls-tool OFF does not stop the server's watches. Only "Quit" in Startup Star's menu stops them, and it stops both together. That is allowed by one server per pet. | 🔵 Enforcement is a security change (L4). This is the framework's known gap. It is reported, not fixed. |
| ⚪ A20 Manual maintenance light | Incorrect | (1) **Known:** the care light looks the same orange for "not checked yet" and "you reported an issue". `care()` (`apps/pet-programs/pet-program-page-20261018.js:107`) returns `fix` for both. The click handler (line 279, care branch line 286, report toggled line 291, message line 297) repaints the same class. `.light.care.is-fix` is `var(--update)` orange (`pet-program-page-20261018.css:455`). So a click changes nothing you can see. (2) **`pets.json` has no `checks` block for white-hat-lab** (entry `pets.json:3913-3951`). All 8 lights say "not checked yet", even for the 5 items the page calls "works today". Their keys: `tool:port-check-tool`, `tool:port-watch-tool`, `tool:tp-link-tool`, `tool:ghost-in-the-walls-tool`, `third-party:wireshark`, `third-party:mcp-inspector`, `third-party:macattack`, `device:flipper-zero`. (3) Planned and idea items (MCP Inspector, MacAttack, the Flipper Zero) show orange, not grey "not created". Line 109 leaves `data-unseen` items out of `none`, which goes against L1's own More details ("Something not built yet is off and its second light grey"). (4) A report stays in this browser only. It never reaches the backlog or the Farmer. (5) The comment at lines 102–105 names the colours the other way round from the CSS (455, 459) and the matrix. | (1) 🔵 Matrix A20 puts both states on orange by Astra's own colour rule, so telling "you reported" apart needs her pick of a mark (an outline, say). (2) ⚪ Add `checks` once each has evidence. Seen today: port-watch-tool and ghost-in-the-walls-tool look on schedule (logs). Wireshark 4.6.9 and Npcap are installed. TP-Link fails in a frame (`issues`). MacAttack is an idea (`missing` makes it grey). port-check-tool and MCP Inspector need a fresh check. (3) ⚪ Let a planned third-party or device item be `none` (grey) unless a check says it is on this PC. Mechanical, but it changes every page. (4) Planned (A29). (5) ⚪ Fix the comment. Mechanical. |
| 🔵 A26 Privacy and permissions | Incorrect | **Private repo:** the Run found personal `C:\Users` paths in the two zero-breach scan logs: 209× in `scans/pc-spyware-scan-zero-breach-20261028-110155.json` and 61× in the `.txt`. The scan logs also hold local addresses, as a private record should. Card 372 already lists this. **Public hub:** `scripts/ghost-walls-watch-20261126.mjs:5` and `changes/ghost-walls-watch-20261126.md:5` name the home router's exact make and model, not only its brand. The public page holds no findings: the reports and the guest list stay on the PC. | 🔵 Keep the scan logs' paths, since it is a private record, or write `%USERPROFILE%`? This is the same question for six private repos. 🔵 Reword the two public lines to "the home TP-Link router"? The wording is mechanical. Whether it matters is Astra's. |
| ⚪ A28 Pet connections | Incorrect | White Hat Lab's server has three rights with no grant written for them. It reads every open port on the PC (`Get-NetTCPConnection`). It reads the router's guest list with her router login. It stops "our own servers" (other pets' servers, the Flash Audit helper and chat previews) when she clicks. In `system-map.json` `access.grants` (from line 10060), nothing is White Hat Lab's. Its node is reached only by the shared `pet-own-folder`, `pet-elsewhere` and `call-models` grants, while Kernel Grove, which does a similar job, has `kernel-koala-look` and `kernel-koala-stop`. So its R W X panel shows no row of its own. The relations otherwise match the friends list and the map. | ⚪ Write the grants she approved in chat (2026-11-19 "All recommended", 2026-11-20, 2026-11-26) as `written` (not enforced): `white-hat-weasel-look` (R: ports, the router's guest list) and `white-hat-weasel-stop` (X: our own servers, on her click). Rebuild. 🔵 Enforcement is hers. |
| ⚪ A41 Clicker Training | Incorrect | "two clicks: Open or close White Hat Lab, this page" is marked **works today**, but White Hat Weasel is not a desktop pet. He is not one of the 42 that Startup Star shows (its status file), because `pets.json` has no `art` and `art/frames/index.json` no frames for him, so `PetSprite.Load` (`scripts/desktop-pets-20261011.cs:248-251`) cannot load him. `scripts/pet-program-pages-20261018.mjs:1188` sets `state: 'now'` for every pet. | ⚪ When a pet has no desktop pet, mark one and two clicks "not on the desktop yet". Mechanical, in the generator. White Hat Weasel's desktop pet itself waits on the art being registered (A04). |
| ⚪ A48 Paired lights | Incorrect (minor) | The Flipper Zero's ON/OFF tooltip says "green while SteamVR has it on, or while it is plugged in". That is the shared device tooltip (`scripts/pet-program-pages-20261018.mjs:455`, `deviceTip`), and it has nothing to do with this device. All 25 pairs have the template's shape. | ⚪ Mention SteamVR only for SteamVR devices. Mechanical. |
| ⚪ A31 Status and link labels (Goldfish's) | Incorrect | `README.md:33` opens the System Map at `#node=white-hat-weasel`, which is not a node. The pet's node is `white-hat-lab` and the program's is `program-67`. `openFromHash` (`scripts/system-map-template-20261012.html:1381`) ignores an unknown id, so the map opens with nothing selected. The Run's link check does not look at fragments. | ⚪ `#node=program-67`, as the page's System Map box does. Mechanical. |
| ⚪ A35 Handoff and unresolved work | Incorrect | 2 pull requests are open in the repo, both mergeable. white-hat-lab#6 is the roadmap doc (2026-11-12, untouched for 15 days). #11 is the device list (2026-11-20), whose record is hub draft #384. In the hub, **#403 still edits `scripts/port-watch-20261119.mjs`**, the server's name before #425. #444 (conflicting), #289, #402 (draft, adds ShadowBroker to White Hat Lab) and #384 (draft) all rebuild White Hat Lab's page. Card 372 is open. | 🔵 These belong to their own chats. #403 has to move to `white-hat-lab-server-20261120.mjs` before it can merge. |
| Art: A02, A61, A03, A04, A05 | Waits on the redraw | Nine drawings dated 2026-11-15 are in `desktop-art/white-hat-weasel` and `art/moods/white-hat-weasel`, but `pets.json` registers no `art`. | Checked on the new drawings when they land. |
| A11, A08, A25, A27, A23, A24, A43, A22 (live), A38, A37, A40, A29, A30, A32 | Not verified | These need Astra there (a click, a sign-in, a live seat), a live tool run, or a pass of their own. Notes below. | 🔵 Next Active Flash Session. |

Notes on what was not verified:

- **A11:** there is no desktop pet to double-click (see A41).
- **A08:** the port watch's daily ask about left-over chat preview servers overlaps Kernel Grove's leftover-watch, which
  finds "the leftovers vibe coding leaves behind and stops what Astra picks". 🔵 Who owns left-over servers?
- **A25:** the router login comes from a Windows user variable, through API Fairy's key request. The watch looks only
  once it is set (tested). L4's `keys` box still says "No agent keys yet". That is the same text on every page
  (`scripts/pet-program-pages-20261018.mjs:1122`), and it is about agent keys, but the page shows no key White Hat Lab
  uses.
- **A27:** the tests show close refusing every program that is not ours. The port check runs only with her OK, which is
  a rule only.
- **A30:** the schemas are versioned (`white-hat-lab-port-watch-v1`, `white-hat-lab-ghost-walls-v1`), and the state file
  kept its name across the rename. The old lock is left over (A56).

Out of 72: **31 pass, 20 Missing or Incorrect, 5 waiting on the art, 14 Not verified and 2 not applicable.**

## Every check

| # | ID | Check | Result | Evidence |
|--:|---|---|---|---|
| 1 | ⚪ A59 | Pet program and its link | Missing | README has no link to the page. `pets.json`, the profile, The Farm's card and the map do (Run). |
| 2 | ⚪ A06 | Pet name | Pass | "White Hat Weasel" in `pet-programs.json`, `pets.json`, `pet.json`, the map and the page title (Run). |
| 3 | 🔵 A07 | Program name/version | Pass | "White Hat Lab" and `v0.1.0` everywhere: README title, `pet.json`, `pets.json`, the page. |
| 4 | 🔵 A01 | Current icon | Pass | `art/icons/white-hat-lab-20261012.png`, made from `desktop-art/white-hat-weasel/idle-20261114.png` (Run, icon record). No desktop pet uses it (A41). |
| 5 | ⚪ A53 | Program icon matches its folder | Missing | No `desktop.ini` in the PC folder. 🔵 Astra picks its icon. |
| 6 | ⚪ A09 | Program interface | Missing (metadata) | No `entry` in `pet.json`. The hub page is complete and its 4 tools work. |
| 7 | 🔵 A11 | Desktop launch | Not verified | Not a desktop pet. A click needs Astra. |
| 8 | ⚪ A10 | Website route | Missing | No `interface_live_url`. The hub page answers 200. 🔵 |
| 9 | ⚪ A54 | Third-party programs | Incorrect | REA and `tplinkrouterc6u` on no list. No `INTELLIGENCE-LEVELS.md` row. |
| 10 | 🔵 A08 | Purpose and scope | Not verified | The job matches what is built. Overlap with Kernel Grove's leftover-watch is a question. |
| 11 | ⚪ A13 | Individual repo | Pass | findastra/white-hat-lab, private, `main` = local `225fbaa`, not archived. |
| 12 | ⚪ A14 | Required repo files | Pass | `pet.json`, `README.md`, `AGENTS.md`, `CLAUDE.md`, `LICENSE` (MIT), `SECURITY.md`. Sprite and entry are counted in A16 and A09. The topic is not checked (#256). |
| 13 | ⚪ A15 | README and credit | Incorrect | Stage, Run it and Limits are out of date (lines 6, 10–12, 27–28). |
| 14 | 🔵 A56 | Work saved in its native folder | Missing | No `data` in `pet.json`. An old-name lock is left in `%LOCALAPPDATA%`. |
| 15 | ⚪ A57 | Current names only | Incorrect | `SECURITY.md:3` "pet-program-67". Menu "Quit the port watch". `pet-app` held. |
| 16 | ⚪ A16 | Metadata and self-audit | Missing + Incorrect | Status `roadmap` against `hatching`. No audit block and 9 other fields missing. `AGENTS.md:5`. |
| 17 | ⚪ A17 | Git and deployment | Pass | The local repo is clean and equal to `origin/main`. Both branches have open pull requests. The live page is the same as hub `main`, built at `8892f753`. |
| 18 | ⚪ A55 | Pictures | Missing | 0 pictures in the README. |
| 19 | 🔵 A02 | Nine emotions | Waits on the redraw | |
| 20 | 🔵 A61 | Mood symbol spot | Waits on the redraw | |
| 21 | ⚪ A03 | Emotion behavior | Waits on the redraw | |
| 22 | ⚪ A58 | One art source | Pass | The pet repo holds no pictures on any branch. The page reads `art/moods/white-hat-weasel/` from the hub. No local desktop draft list names him. |
| 23 | 🔵 A04 | Art publication | Waits on the redraw | The drawings are in the hub, with no `art` in `pets.json`. |
| 24 | 🔵 A05 | Art format and provenance | Waits on the redraw | |
| 25 | 🔵 A18 | Official tool and trick inventory | Missing + Incorrect | No tools in `pet.json`. The REA skill is not listed in the hub. |
| 26 | ⚪ A19 | Tool behavior | Incorrect | TP-Link's "Open it" has no target (known). Ghost walls' "Open it full screen" opens the portal. Fixtures 24/24. Live use not verified. |
| 27 | 🔵 A21 | Tool OFF enforcement | Missing (gap) | Page OFF is browser-only. Only Startup Star's Quit stops the watches. |
| 28 | ⚪ A72 | Its own server | Pass | `scripts/white-hat-lab-server-20261120.mjs` (name right; kept in the hub by decision), written once at `pets.json:3920`. Startup Star reads it (`ServerIn`, `desktop-pets-20261011.cs:698`) and starts it at sign-in as its own `node` process. It has a Quit of its own, and the Ghost In The Walls watch runs inside it (one server per pet). Notes: the menu label (A57) and the old lock (A56). |
| 29 | ⚪ A20 | Manual maintenance light | Incorrect | Same orange for both states (known). No `checks`. Planned items orange, not grey. Reports browser-only. |
| 30 | 🔵 A26 | Privacy and permissions | Incorrect | Personal paths in the private scans. The router's exact model in 2 public hub files. |
| 31 | 🔵 A25 | Integrations/accounts | Not verified | The router login is set and the watch looks (logs). Expiry and disconnect not tried. The L4 keys box shows no key. |
| 32 | ⚪ A27 | Preview and recovery | Not verified | Close refuses non-PetOS programs (tests). No live run. |
| 33 | ⚪ A42 | Credential help | Not applicable | No credential field on the page. The router login is set outside it, through API Fairy's key request. |
| 34 | 🔵 A28 | Pet connections | Incorrect | No grant for the port watch's R and X or the guest watch's router read. |
| 35 | 🔵 A23 | Chat-created tools | Not verified | Needs a live seat. |
| 36 | ⚪ A24 | Ready indicator | Not verified | Seat empty, said honestly. Needs a live seat. |
| 37 | 🔵 A43 | Emotion/message hierarchy | Not verified | The server writes idle or curious (mood file today: idle). No priority test. |
| 38 | ⚪ A47 | The template's parts, in order | Pass | Build: 17 parts in order, no extra panel. |
| 39 | ⚪ A52 | Editorial status panel | Pass | Build. Its note (2026-11-17) predates the port watch, TP-Link and the guest list, but is not wrong. |
| 40 | ⚪ A62 | Cyberhome | Pass | Build. |
| 41 | ⚪ A63 | Title and version | Pass | `v0.1.0 // 20261102`. |
| 42 | ⚪ A64 | Quick summary | Pass | One sentence, no buttons. |
| 43 | ⚪ A60 | System Map link | Pass | `#node=program-67`, and that node exists on the built map. |
| 44 | ⚪ A65 | Intelligence levels | Pass | Build. |
| 45 | ⚪ A66 | L1 control panel | Pass | Build. Native tools come first, by Astra's 2026-11-17 order (port-check-tool first). Shared programs appear only when there are some. |
| 46 | ⚪ A67 | L2 control panel | Pass | Build: self-audit, play-with, care-for. |
| 47 | ⚪ A68 | L3 control panel | Pass | Build. |
| 48 | ⚪ A69 | L4 control panel | Pass | Build: the five tool boxes. |
| 49 | ⚪ A70 | R W X panel | Pass | Build: every level has rows. White Hat Lab's own grants are missing (A28). |
| 50 | ⚪ A71 | Session notes | Pass | Build. |
| 51 | ⚪ A49 | Emotions | Pass | Build: nine moods with pictures. The art itself is A02. |
| 52 | ⚪ A41 | Clicker Training | Incorrect | Two clicks "works today" with no desktop pet. |
| 53 | ⚪ A39 | Friends list | Pass | Build: 6 friends, each with a picture and a name. |
| 54 | ⚪ A51 | Unified footer | Pass | Build. |
| 55 | 🔵 A22 | Chat | Not verified | The build part passes. A live seat needs Astra. |
| 56 | ⚪ A44 | Original yellow phone | Pass | No phone (Data Dealer's only). |
| 57 | ⚪ A46 | Program pills | Pass | 16 pills, all the template's shape, no app icons. |
| 58 | ⚪ A48 | Paired lights | Incorrect (minor) | Device tooltip mentions SteamVR. |
| 59 | ⚪ A45 | Page width | Pass | No sideways scroll at 390, 768 or 1280 px (headless Edge). |
| 60 | ⚪ A50 | Backdrop and text | Pass | Its own black and white look, on Astra's request (2026-11-17, 2026-11-25). The matrix's list of pages with their own colours is out of date (The Farm's, not this pet's). |
| 61 | ⚪ A38 | Tool organization | Not verified | The Farm's browsing. Not checked here. |
| 62 | ⚪ A12 | Map/catalog navigation | Pass | Page → `program-67` → the pet node `white-hat-lab` → the page. The README's link is A31. |
| 63 | ⚪ A31 | Status and link labels | Incorrect | `README.md:33` points at a node that does not exist. |
| 64 | 🔵 A36 | First-visit tutorial | Not applicable | The Farm's. |
| 65 | 🔵 A37 | Play and care SOPs | Not verified | Both planned, off until L3. |
| 66 | 🔵 A40 | Guided focus and functioning tour | Not verified | Needs Astra. |
| 67 | ⚪ A29 | Notes/backlog | Not verified | A test would reach a real place. |
| 68 | ⚪ A30 | Data continuity | Not verified | Versioned schemas. Old lock left over. |
| 69 | ⚪ A32 | Pet Collar and release trust | Not verified | No tag or release. The Pet ID says honestly that the microchip is not signed. Recovery not checked. |
| 70 | 🔵 A33 | Registration/admission | Pass | Pipeline in `pet-programs.json`, `pets.json` and `PET-PROGRAMS.md`, as Astra decided on 2026-11-02. The repo's own files lag behind (A16, A15). |
| 71 | ⚪ A34 | Generated artifacts/tests | Pass | The template check is clean, 24/24 tests pass, and the live page is the same as the build. Full `npm test` was not run. |
| 72 | ⚪ A35 | Handoff and unresolved work | Incorrect | 2 open repo pull requests. Hub #403 edits the server's old name. 4 hub pull requests rebuild the page. |

## Decisions waiting on you

1. A09 and A10: is the hub page White Hat Lab's app, as it is for its server, and should it be registered as its
   address (`interface_live_url`)? That is the same question as round 8, decision 3.
2. A26: keep the personal paths in the private scan logs (card 372, six repos)? And reword the two public lines that
   name the router's exact model?
3. A53: give the `white-hat-lab` folder the hub's White Hat Lab icon?
4. A20: how should a light show "you reported an issue", when your colour rule puts it on the same orange as "not
   checked yet"?
5. A18: is the REA skill a White Hat Lab trick (L2) or a harness skill (L3)?
6. A08: who owns left-over servers, the port watch's daily ask or Kernel Grove's leftover-watch?
7. A21: page OFF does not stop the watches. Keep it as the framework's known gap for now?

<sub>Flash Audit, 2026-11-27, Claude Opus 5.5 (`claude-opus-5-5`). Checks were read-only. Nothing was clicked for you,
launched or signed in to.</sub>
