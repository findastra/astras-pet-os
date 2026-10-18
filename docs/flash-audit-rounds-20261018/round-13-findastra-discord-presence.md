# Round 13: Discord Damsel — Discord Tower

[All rounds](README.md) · Stage: **registered** · Repo: [findastra/findastra-discord-presence](https://github.com/findastra/findastra-discord-presence) (public) · audited `main` at `10f5825`

<img src="../../art/icons/findastra-discord-presence-20261012.png" width="88" alt="Discord Damsel icon">

| Sleepy | Awake | Idle | Curious | Happy | Worried | Alarmed | Sick | Sad |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| <img src="../../art/frames/discord-damsel/sleep.png" width="64" alt="sleep"> | <img src="../../art/frames/discord-damsel/blink.png" width="64" alt="blink"> | <img src="../../art/frames/discord-damsel/idle.png" width="64" alt="idle"> | <img src="../../art/frames/discord-damsel/curious.png" width="64" alt="curious"> | <img src="../../art/frames/discord-damsel/happy.png" width="64" alt="happy"> | <img src="../../art/frames/discord-damsel/worried.png" width="64" alt="worried"> | <img src="../../art/frames/discord-damsel/alarmed.png" width="64" alt="alarmed"> | <img src="../../art/frames/discord-damsel/sick.png" width="64" alt="sick"> | <img src="../../art/frames/discord-damsel/sad.png" width="64" alt="sad"> |

### Exceptions

<sub>⚪ the Idle Flash Audit fixes it (a fix in code is named for the pet's chat) · 🔵 waits for your Active Flash Session</sub>

1. ⚪ **A10 Website route** — Incorrect. Program route https://github.com/findastra/findastra-discord-presence#start-it-about-2-minutes is a repo page posing as the program.  
   *Next:* Give it a real program page, or point the route at one.
2. ⚪ **A54 Third-party programs** — Missing. INTELLIGENCE-LEVELS lists programs made by others (Discord) but the page has no Third Party Programs row.  
   *Next:* The Intelligence Levels table lists programs made by others that the page does not show (or the other way round): match them.
3. 🔵 **A56 Saved in its own folder** — Incorrect. openai-discord-presence/src/detector.js: 1× a dated chat folder (e.g. "Documents\Codex\").  
   *Next:* A stray PC path in code or docs; moving files goes through a File Master plan.
4. ⚪ **A57 Current names only** — Incorrect. Retired names (Astra's Pet Apps, astras-pet-apps, findastra-pet-apps, Documents\Projects) in `CLAUDE.md`, `findastra-discord-presence-20261008.html`, `openai-discord-presence/DEVELOPMENT.md`, `openai-discord-presence/src/presence.js`, `openai-discord-presence/test/project-name-test-20261011.js`.  
   *Next:* A line that tells history, a file name, or a name inside the page's script (a storage key), so it was kept; anything else here is for the pet's chat.
5. ⚪ **A16 pet.json** — Missing. Metadata: framework declaration  
   *Next:* Framework metadata comes with the shared page framework (Codex's branch); not added by hand tonight.
6. ⚪ **A17 Git branches** — Incorrect. 3 branch(es) with work not on main and no open pull request: claude/girls-same-size-20261017 (+5), claude/one-art-source-20261017 (+4), claude/presence-names-shuffle-20261014 (+6).  
   *Next:* See Decisions: open a pull request, merge, or leave each branch.
7. 🔵 **A18 Tool list** — Missing. No declared tool inventory.  
   *Next:* No tool list yet. It comes with the shared page framework.
8. ⚪ **A52 L3 activity bubble** — On a branch. Required shared L3 activity bubble/config/script/style not found in the inspected entry source.  
   *Next:* It is built on unmerged branch `claude/rescue-damsel-unsaved-20261017` ([compare](https://github.com/findastra/findastra-discord-presence/compare/main...claude/rescue-damsel-unsaved-20261017)): merging that branch passes this.
9. ⚪ **A44 Yellow phone** — On a branch. Shared phone baseline not found.  
   *Next:* It is built on unmerged branch `claude/rescue-damsel-unsaved-20261017` ([compare](https://github.com/findastra/findastra-discord-presence/compare/main...claude/rescue-damsel-unsaved-20261017)): merging that branch passes this.
10. ⚪ **A45 Paper and zoom** — On a branch. Shared stationery source not found.  
   *Next:* It is built on unmerged branch `claude/rescue-damsel-unsaved-20261017` ([compare](https://github.com/findastra/findastra-discord-presence/compare/main...claude/rescue-damsel-unsaved-20261017)): merging that branch passes this.
11. ⚪ **A41 Clicker Training** — On a branch. No Clicker Training section found in the inspected entry source.  
   *Next:* It is built on unmerged branch `claude/rescue-damsel-unsaved-20261017` ([compare](https://github.com/findastra/findastra-discord-presence/compare/main...claude/rescue-damsel-unsaved-20261017)): merging that branch passes this.
12. **Checked by hand, not a problem:** the paths in both presence tests are test fixtures with made-up user folders (`me`, `private`), not personal paths (A26). Checked by hand on 2026-10-18; the auditor now skips those two names too (hub PR #76).

### Decisions

1. 🔵 **Branches with work not on main** and no pull request: [`claude/girls-same-size-20261017`](https://github.com/findastra/findastra-discord-presence/compare/main...claude%2Fgirls-same-size-20261017) (+5), [`claude/one-art-source-20261017`](https://github.com/findastra/findastra-discord-presence/compare/main...claude%2Fone-art-source-20261017) (+4), [`claude/presence-names-shuffle-20261014`](https://github.com/findastra/findastra-discord-presence/compare/main...claude%2Fpresence-names-shuffle-20261014) (+6). Open a PR, merge, or leave?

**Tools:** none declared in pet.json yet (A18).  
**Tutorial tools:** Play with, Care for — Not verified overnight.

<sub>Idle Flash Audit, 2026-10-18, Claude Opus 5.5. Read-only checks through the GitHub API; nothing was clicked, launched or signed in to.</sub>
