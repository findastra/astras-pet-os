# One crash watch at sign-in instead of three

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-08, for Astra.

Astra asked why so many startup apps run ("can we simplify this"). This change follows #302, which made Startup Star the
only PetOS startup entry. Her answers to the three questions, on 2026-11-08: "All recommended".

1. Log Lynx (Log Den) runs the one combined watch.
2. Packet Piranha and Forensic Ferret keep their own menus in the star. Quit stops only that pet's part.
3. Packet River's and Evidence Locker's own programs stay in their repos, for menu clicks only.

- **log-den 0.3.0:** Log Den's program also runs Packet Piranha's network watch and Forensic Ferret's case watch.
  - Each runs on its own thread, under its own program's single-copy name, so `packet-river.exe` and
    `evidence-locker.exe` still reach it with `--tool`, `--quit` and `--open`.
  - A failure in one of them is recorded as a tool error and never stops the others.
- **packet-river 0.3.0 and evidence-locker 0.3.0:** their programs hand the watch to Log Den's program when it is built
  next door, then exit. `--alone` keeps a watch in its own program.
- **`scripts/desktop-pets-20261011.cs`:**
  - At sign-in the star starts Log Den's program, and no longer starts Packet River's or Evidence Locker's.
  - Those two menus are unchanged. Their running light comes from the watch's single-copy name, and their Start item
    runs `log-den-20261018.exe --startup`.
  - The self-test checks all of this.

Checks:
- Self-tests pass: Log Den 64, Packet River 36, Evidence Locker 37, and the star's.
- End to end, in a scratch data folder:
  - `packet-river.exe --startup` left one `log-den` process running all three watches.
  - Quitting Packet Piranha stopped only its watch, and Log Den's `--startup` started it again.
  - All three quit cleanly, with no tool errors.
- Hub tests: 383 pass. The one failure (installed farm from scratch) fails on main too.

Merge order: packet-river and evidence-locker, then log-den, then this one (stacked on #302). Log Den's build compiles the other
two repos' code, so all three must be on main before the PC is rebuilt.

After the merges, rebuild on the PC:
1. Quit the three pets from the star's menu.
2. Build packet-river and evidence-locker, then log-den.
3. Rebuild the star.
4. Restart the star.
