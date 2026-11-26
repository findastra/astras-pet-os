# The three weekly checks run on a schedule (2026-11-20)

Astra, 2026-11-20, "yes to all": merge #415 and put its three planned weekly tricks on a real schedule.

## What changed

- **Two Claude scheduled tasks for The Farm**, with masters here in `scheduled-tasks/`, installed by Luna's Log's
  skill-install-tool like File Master's Sunday check-in:
  - `farm-click-check-weekly` (Saturdays, 10:00 Denver): the click test over every page in a fresh clone; clear causes
    in the page builder are fixed on one branch with one pull request for Astra; never merged by itself.
  - `farm-flash-audit-weekly` (Saturdays, 13:00 Denver): asks the Flash Audit helper for a run, compares it with the
    last one and lists what is new by pet number. It changes nothing.
- **GitHub Aquarium's branch sweep** (`github-aquarium-branch-sweep-weekly`, Sundays, 10:00 Denver): its master is in
  findastra/github-goldfish. It only lists; deleting waits for Astra's yes in chat.
- `system-map.json`: `click-check-round`, `flash-audit-round` and `branch-sweep-round` are now `now`, with their day and
  time, and say where their masters are.

The tasks run while the Claude app is open; a task that was due while it was closed runs when it opens again.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-20.
