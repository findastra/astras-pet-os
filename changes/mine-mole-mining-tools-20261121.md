# Crypto Burrow's five mining tools (2026-11-21)

Astra, 2026-11-21, after a chat about mining: "lets start a mining operation, but for concept since I understand I wont
get jack", then "teach me from the beginning like i am brand new. set up the pet program. include educational tools and
management tool and tracking tools."

**Not a new pet.** `pet-programs.json` already gives this job to **Mine Mole** (#23), whose pet program is **Crypto
Burrow**: "Manages the cryptocurrency mining program on Astra's PC and checks whether mining is worth the power." The
tools need no program, data or schedule of their own (skills/new-pet-or-tool), so they are native tools of Crypto
Burrow, embedded wide in its L1 tool panel the way Raspberry Pi Maker's guide is (2026-11-20). No names were added.

| Tool | Label | Kind of tool | Page |
|---|---|---|---|
| learn-mining-tool | `crypto-burrow-v1.0-learn-mining-tool-v1.0` | education: twelve lessons from zero, every equation with its variables, the equation and a solved scenario (skills/explain-equations), a quiz | `apps/mine-mole-learn-mining-20261121.html` (open) |
| hash-lab-tool | `crypto-burrow-v1.0-hash-lab-tool-v1.0` | education: SHA-256 by hand and a nonce hunt | `apps/mine-mole-hash-lab-20261121.html` (starts closed) |
| mining-operation-tool | `crypto-burrow-v1.0-mining-operation-tool-v1.0` | management: a practice operation that really mines a pretend coin, ConceptCoin, with rigs, speeds, watts, pool shares, retargets, halvings and a power bill | `apps/mine-mole-mining-operation-20261121.html` (open) |
| mining-ledger-tool | `crypto-burrow-v1.0-mining-ledger-tool-v1.0` | tracking: every block and session, coins against power cost, luck, payouts by rig, export and import | `apps/mine-mole-mining-ledger-20261121.html` (starts closed) |
| worth-the-power-tool | `crypto-burrow-v1.0-worth-the-power-tool-v1.0` | tracking: whether a real miner pays for its power, worked out step by step, with a list of checks | `apps/mine-mole-worth-the-power-20261121.html` (starts closed) |

Shared by all five: `apps/mine-mole-mining-core-20261121.js` (SHA-256 in plain JavaScript, proof of work, the money
equations, the ledger's `crypto-burrow-ledger-v1` schema), `apps/mine-mole-tools-20261121.css` (the classic blueprint)
and `apps/mine-mole-in-tool-20261121.js` (fits each page to its tool box). Test:
`test/mine-mole-mining-tools-test-20261121.mjs` (7 tests: the pages and map nodes, no remote scripts, text-only
writes, SHA-256 against Node's, proof of work, the worked examples' arithmetic, the ledger schema).

**Ring and grants.** Ring 3 (Crypto Burrow's tools, the same as its pet program). Each page reads and writes only its
own keys in the browser's storage (R W, enforced by the browser's same-origin rule), runs nothing on the PC (no X), and
fetches nothing. No new grant.

**Limits, said plainly.**
- ConceptCoin is pretend. No real coin, wallet, network or pool is touched, and nothing here installs or runs a real
  miner. Running a real one (XMRig, for example) on Astra's PC is still Mine Mole's job to build, with her OK.
- The "rigs" are slices of one browser tab and their watts are what you type in; only the hashing is real.
- The presets in worth-the-power-tool and the network sizes in the lessons are November 2026 examples, not live data.
- Tool ON/OFF lights keep the choice in this browser only, as on every page (PET-PROGRAM-FRAMEWORK.md, section 3).
- The pet's own repo, findastra/mine-mole (private), is unchanged: this session could not reach it. Its `pet.json`
  tool list should gain these five in that repo's own pull request.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-21.
