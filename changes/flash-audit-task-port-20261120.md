# The weekly Flash Audit task names no local address (2026-11-20)

By Claude Opus 5.5 (claude-opus-5-5), 2026-11-20. Astra: "Yes, fix it".

- `scheduled-tasks/farm-flash-audit-weekly/SKILL.md` (from #418) wrote the Flash Audit helper's loopback address and
  port out in full, so main's public-safety test failed. The task now reads the port from `HELPER_PORT` in
  `scripts/flash-audit-checks-20261108.mjs`, the one place it is set.
- The installed copy on the PC changes when Luna's Log's skill-install-tool installs this master again.
