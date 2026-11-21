# The weekly Flash Audit task no longer names the helper's port (2026-11-20)

`scheduled-tasks/farm-flash-audit-weekly/SKILL.md` (from #418) wrote out the Flash Audit helper's local address, so
`npm test` failed on main: "no committed file publishes a secret, a local service address or a personal folder path".
Local addresses stay on Astra's PC (`docs/local-services-20261014.md`).

## What changed

- Step 1 now tells the task to read the helper's address from `flash-audit-helper-page-data.js` (its `control`
  value), which the helper writes in `Astra's PetOS Data\astras-pet-os\flash-audit` when it starts. The Farm's page
  reads the same file. The steps are otherwise unchanged.
- The installed copy of the task on Astra's PC is not changed here. Luna's Log's skill-install-tool installs it from
  this master.

Found while rebasing #416, and fixed here at Astra's request ("Do this task here"). Claude Opus 5.5 (`claude-opus-5-5`),
2026-11-20.
