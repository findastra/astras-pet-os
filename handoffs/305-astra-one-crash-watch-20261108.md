# 305 · One crash watch at sign-in (for Astra)

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-08. Status: four PRs open, waiting for Astra's OK on each.

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

## What is left
- Astra's OK for each PR, merged in the order above. Retarget #305 to main before #302 merges (stacked PRs).
- On the PC after the merges:
  1. Quit the three pets from the star's menu.
  2. Pull and build packet-river and evidence-locker, then log-den.
  3. Rebuild and restart the star.
  4. Check that Task Manager shows one `log-den-20261018.exe` and no `packet-river-` or `evidence-locker-` program.
- Until log-den is rebuilt, the old star still starts all three. That stays safe: Packet River and Evidence Locker see
  their watch running in Log Den and exit.
