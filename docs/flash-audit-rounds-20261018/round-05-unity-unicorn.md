# Round 5: Unity Unicorn — Unity Stable

[All rounds](README.md) · Stage: **registered** · Repo: [findastra/unity-unicorn](https://github.com/findastra/unity-unicorn) (public) · audited `main` at `fda7b54`

<img src="../../art/icons/unity-unicorn-20261012.png" width="88" alt="Unity Unicorn icon">

| Sleepy | Awake | Idle | Curious | Happy | Worried | Alarmed | Sick | Sad |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| <img src="../../art/frames/unity-unicorn/sleep.png" width="64" alt="sleep"> | <img src="../../art/frames/unity-unicorn/blink.png" width="64" alt="blink"> | <img src="../../art/frames/unity-unicorn/idle.png" width="64" alt="idle"> | <img src="../../art/frames/unity-unicorn/curious.png" width="64" alt="curious"> | <img src="../../art/frames/unity-unicorn/happy.png" width="64" alt="happy"> | <img src="../../art/frames/unity-unicorn/worried.png" width="64" alt="worried"> | <img src="../../art/frames/unity-unicorn/alarmed.png" width="64" alt="alarmed"> | <img src="../../art/frames/unity-unicorn/sick.png" width="64" alt="sick"> | <img src="../../art/frames/unity-unicorn/sad.png" width="64" alt="sad"> |

### Exceptions

<sub>⚪ the Idle Flash Audit fixes it (a fix in code is named for the pet's chat) · 🔵 waits for your Active Flash Session</sub>

1. ⚪ **A54 Third-party programs** — Missing. INTELLIGENCE-LEVELS lists programs made by others (Unity, VRChat Creator Companion, Blender) but the page has no Third Party Programs row.  
   *Next:* The Intelligence Levels table lists programs made by others that the page does not show (or the other way round): match them.
2. ⚪ **A16 pet.json** — Missing. Metadata: framework declaration  
   *Next:* Framework metadata comes with the shared page framework (Codex's branch); not added by hand tonight.
3. ⚪ **A17 Git branches** — Incorrect. 1 branch(es) with work not on main and no open pull request: claude/realistic-props-20261018 (+2).  
   *Next:* See Decisions: open a pull request, merge, or leave each branch.
4. ⚪ **A55 Pictures** — Missing. README shows 0 picture(s).  
   *Next:* Needs real pictures of the program working (you take some: card 026).
5. 🔵 **A18 Tool list** — Missing. No declared tool inventory.  
   *Next:* No tool list yet. It comes with the shared page framework.
6. ⚪ **A52 L3 activity bubble** — Missing. Required shared L3 activity bubble/config/script/style not found in the inspected entry source.  
   *Next:* Comes with Codex's shared page framework: card 035 asks Codex to bring its pull requests up to date.
7. ⚪ **A44 Yellow phone** — Missing. Shared phone baseline not found.  
   *Next:* Comes with Codex's shared page framework: card 035 asks Codex to bring its pull requests up to date.
8. ⚪ **A45 Paper and zoom** — Missing. Shared stationery source not found.  
   *Next:* Comes with Codex's shared page framework: card 035 asks Codex to bring its pull requests up to date.
9. ⚪ **A41 Clicker Training** — Missing. No Clicker Training section found in the inspected entry source.  
   *Next:* Comes with Codex's shared page framework: card 035 asks Codex to bring its pull requests up to date.

### Decisions

1. 🔵 **Branches with work not on main** and no pull request: [`claude/realistic-props-20261018`](https://github.com/findastra/unity-unicorn/compare/main...claude%2Frealistic-props-20261018) (+2). Open a PR, merge, or leave?

**Tools:** none declared in pet.json yet (A18).  
**Tutorial tools:** Play with, Care for — Not verified overnight.

<sub>Idle Flash Audit, 2026-10-18, Claude Opus 5.5. Read-only checks through the GitHub API; nothing was clicked, launched or signed in to.</sub>
