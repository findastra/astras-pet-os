# 305 · One crash watch at sign-in (for Astra)

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-08. Status: **done** (merged and rebuilt on the PC, 2026-11-08).

## What I did

Astra answered the three questions on 2026-11-08: "All recommended".
1. Log Lynx owns the one watch.
2. The other two keep their menus.
3. Their own programs stay, for clicks only.

| # | PR | What |
|---|---|---|
| 1 | findastra/packet-river#15 | Packet Piranha's watch can run inside Log Den's program |
| 2 | findastra/evidence-locker#15 | Forensic Ferret's watch can run inside Log Den's program |
| 3 | findastra/log-den#15 | Log Den's program runs all three watches (it compiles 1 and 2) |
| 4 | findastra/astras-pet-os#305 | The star starts only Log Den's program (stacked on #302) |

Details and checks are in `changes/one-crash-watch-20261108.md`.

## Done, 2026-11-08
- Astra: "Yes, merge all four".
  - Merged packet-river#15, evidence-locker#15 and log-den#15.
  - #305 was moved to main (after #302 had merged), test-merged with main (#298, #301) and re-tested: the star's self-test
    passes, and hub tests have 384 passing and the known failure. Then merged.
- Rebuilt on the PC, after Astra's "Yes, rebuild now":
  - The three old watchers were quit; Packet River, Evidence Locker and Log Den were built (self-tests 36, 37 and 64).
  - The star was quit, rebuilt and started again through its scheduled task.
  - Task Manager now has one `log-den-20261018.exe` (Packet River and Evidence Locker have none). All three pets' mood
    files were written at 15:32.
- Not rebuilt: the pet chat helper was running, so the star's build skipped it (unchanged code).
