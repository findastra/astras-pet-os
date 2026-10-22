status: open (merged as #136 on 2026-10-21 with Astra's OK in chat; tasks 2 to 4 left: 2 and 4 wait on Astra)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-19
needs: system-map.json (five `*-checker` tools of `program-2`), findastra/github-goldfish README and `index.html`
---
## What I did

**Why.** Astra, 2026-10-19, asked the GitHub Goldfish to look at every project her profile README links and check its
README says what that kind of project should (a VRChat world: what's in it, what's missing, what's updating now), as a
new kind of error and a panel in GitHub Aquarium. Then: "The GitHub Aquarium should have all the other tools ... like
the error checkers."

**Done and merged:**
- [findastra/github-goldfish#19](https://github.com/findastra/github-goldfish/pull/19), merge commit `0edac69`:
  **Showcase**, a fifth finding kind next to Document control, Blatant, Organizational and Systemic, and the Showcase
  panel on the Goldfish's page (one card per advertised project: kind, what the profile says, what the README says,
  ✓/✗ parts, last push, and with a token the last commits and open pull requests). CLI: `--showcase`. 66 tests pass.
  Memory aid (Claude's, not yet confirmed by Astra): the homepage is the shop window, each README is what's on the shelf.

**Done, not merged** (this card's pull request, branch `claude/aquarium-error-checkers-20261019`):
- `system-map.json`: five tools of GitHub Aquarium (`program-2`), all `now`: `document-control-checker`,
  `blatant-checker`, `organizational-checker`, `systemic-checker`, `showcase-checker`
  (labels `github-aquarium-v1.0-<tool>-v1.0`). CRLF kept.
- Rebuilt: the Goldfish's pet program page (L1 tool panel), the System Map page, TOOLS-AND-TRICKS.md, Markdown pets.
- Decision row in `skills/new-pet-or-tool/SKILL.md`.
- `npm test` 208 pass, `npm run check` OK. CodeQL passed on every push; the pull request conflicted three times only
  because other pull requests merged into `main` first (generated files: take `main`'s side, then `npm run build`).

**Merged, 2026-10-21** (Claude Opus 5.5, `claude-opus-5-5`, from the outstanding-items chat): `main` merged into the
branch four times (#167 to #189, #182 and #187), the card renumbered 057 → 067 → 068 (click-check, then Kernel Grove,
reached `main` first), its five map nodes put back on `main`'s system-map.json (which #187 had turned to LF line
endings), generated files rebuilt, `npm test` passed, then merged with Astra's OK in chat ("OK to merge #136 only for now. Hold
#190."). The branch is kept: hub #190 (GitHub Aquarium's outstanding-items) was built on it and is held.

## To do

1. **Merge this card's pull request** once its checks pass on the newest commit. Astra's OK is already given (quoted
   above). If it conflicts again: merge `main`, take `main`'s side of the generated files, `npm run build`, `npm test`,
   push, read the checks, merge.
2. **Not done, needs Astra:** the old Aquarium app page `apps/github-goldfish-20261008.html` is the public-only v0.1 of
   the audit (no Showcase, no pet roster, no private repos) and `pets.json` still links it as the Goldfish's app.
   Astra said it "probably should go away" now that the cyberhome is coming (cyberhome merged in #137, card 054). Ask
   her: replace it with the current github-goldfish page, or remove it and point to the pet program page.
3. **Not done:** github-goldfish's README "Pictures" line still calls the old app page its "program page"; point it at
   `apps/pet-programs/github-goldfish-20261018.html` (a pull request in github-goldfish).
4. Ask Astra whether "Showcase" is the name she wants (it was proposed, not confirmed).
