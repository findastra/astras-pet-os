# The weekly Flash Audit task names no local address (2026-11-20)

`npm test` failed on `main` after #418: `scheduled-tasks/farm-flash-audit-weekly/SKILL.md` wrote the Flash Audit
helper's address with its port. The hub's public-safety test (`test/public-safety-test-20261014.mjs`) forbids that in
any committed file, because GitHub Pages publishes the whole repo (`docs/local-services-20261014.md`).

- Step 1 of the task now reads the helper's address the way The Farm's page does. The helper writes it into
  `flash-audit-helper-page-data.js` in its data folder on Astra's PC when it starts (`window.flashAuditHelper.control`).
  The task then posts to `<control>/run`.
- Step 2 also covers a missing file: the task runs the auditor itself, as before.
- Nothing else in #418 changed.

The copy installed on Astra's PC (`%USERPROFILE%\.claude\scheduled-tasks\farm-flash-audit-weekly\SKILL.md`) keeps the
old wording until Luna's Log's skill-install-tool installs this master again. It still works in the meantime: the
helper's address has not changed.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-20.
