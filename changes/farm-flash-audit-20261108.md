# The Flash Audit on The Farm: every check a tool, Run on this PC

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-08, for Astra.

Astra: "I think the flash audit needs to be a panel on the farm so that each of those shows up as a tool and I can
click it and it will go through all of whatever we have right now and all the other pet programs and check to see if
those components of those other programs are up to standard." Deck "The Farm: art and lights": "All recommended"
(3: a tool box in The Farm's L1; 4: the last results at once, Run through a helper on her PC; 5: The Farm owns it,
GitHub Goldfish keeps the checks about words on GitHub).

- **The tool box** (`scripts/pet-program-pages-20261018.mjs`, `flashAuditBody`): The Farm's L1 has `flash-audit`,
  folded to its name, with the Flash Audit's 61 checks as tools in the matrix's order, each with its grey (fixed
  without her) or blue (waits for her answer) dot. A check opens to the last saved run over every pet program: how many
  pass, and each pet program that needs work with what the auditor found. The 37 checks the auditor runs by itself have
  a Run button; the others say an assistant checks them. A15, A31 and A57 are marked as GitHub Goldfish's.
- **The last saved run**: `docs/flash-audit-rounds-20261108/ledger-main.json`, the read-only auditor
  (`scripts/idle-flash-audit-20261017.mjs`) over every pet program on 2026-11-08, with Goldfish's preflight.
- **Run** (`apps/flash-audit-control-20261108.js`, only on The Farm's page): on a page this PC serves, it asks the
  Flash Audit helper to check every pet program again and shows the newest run in every check when it is done.
- **The helper** (`scripts/flash-audit-helper-20261108.mjs`, port 38778): runs the auditor, one run at a time, and
  writes the newest run to `Documents\Astra's PetOS Data\astras-pet-os\flash-audit`. It answers only on 127.0.0.1 and
  takes a run only from a page this PC serves. Startup Star starts it at sign-in (`scripts/desktop-pets-20261011.cs`,
  its self-test now counts six helpers; the candidate build's self-test passes).
- **Ownership**: the `flash-audit` tool is The Farm's on the System Map (`the-farm-v1.0-flash-audit-v1.0`), and
  `docs/flash-audit-20261014.md` and `docs/idle-flash-audit-20261017.md` say so.
- `scripts/flash-audit-checks-20261108.mjs` holds which checks the auditor runs, Goldfish's word checks and where the
  runs are; `test/flash-audit-test-20261108.mjs` checks all of it, the helper with a stand-in auditor included.

Checked in the pane, served from this branch: the tool box starts folded, holds 61 checks, a check opens to its
findings, and Run went through a stand-in helper and replaced the results.

After the merge, on Astra's PC: rebuild Startup Star (`build-desktop-pets-20261011.ps1`; `bin` is not in git) and
restart it, so it starts the Flash Audit helper. Until then Run says the helper is not running.
