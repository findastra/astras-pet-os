# Round 10: Mommy's Mommies — Mommy’s Green Room

[All rounds](README.md) · Stage: **registered** · Repo: [findastra/mommys-mommies](https://github.com/findastra/mommys-mommies) (public) · audited `main` at `0707e69`

*Icon: Missing*

| Sleepy | Awake | Idle | Curious | Happy | Worried | Alarmed | Sick | Sad |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| <img src="../../art/frames/mommys-mommies/sleep.png" width="64" alt="sleep"> | <img src="../../art/frames/mommys-mommies/blink.png" width="64" alt="blink"> | <img src="../../art/frames/mommys-mommies/idle.png" width="64" alt="idle"> | <img src="../../art/frames/mommys-mommies/curious.png" width="64" alt="curious"> | <img src="../../art/frames/mommys-mommies/happy.png" width="64" alt="happy"> | <img src="../../art/frames/mommys-mommies/worried.png" width="64" alt="worried"> | <img src="../../art/frames/mommys-mommies/alarmed.png" width="64" alt="alarmed"> | <img src="../../art/frames/mommys-mommies/sick.png" width="64" alt="sick"> | <img src="../../art/frames/mommys-mommies/sad.png" width="64" alt="sad"> |

**Fix PR waiting for you:** [mommys-mommies#5](https://github.com/findastra/mommys-mommies/pull/5)

### Exceptions

<sub>⚪ the Idle Flash Audit fixes it (a fix in code is named for the pet's chat) · 🔵 waits for your Active Flash Session</sub>

1. ⚪ **A07 Program name** — Incorrect. Page title "Mommy&#x27;s Mommies · Astra" names neither the pet nor the program "Mommy’s Green Room".  
   *Next:* Your pick: see Decisions.
2. 🔵 **A01 Icon** — Missing. No icon in astras-pet-os art/icons.  
   *Next:* Needs pet art. Generating art costs money, so it waits for your OK.
3. ⚪ **A15 README and credit** — Incorrect. README title "Mommys" is neither the repo name in Title Case ("Mommys Mommies") nor the pet name.  
   *Next:* The title is a naming choice, so it was left alone. Rename the heading?
4. ⚪ **A16 pet.json** — Missing. Metadata: framework declaration  
   *Next:* Framework metadata comes with the shared page framework (Codex's branch); not added by hand tonight.
5. ⚪ **A17 Git branches** — Incorrect. 2 branch(es) with work not on main and no open pull request: claude/girls-same-size-20261017 (+5), claude/one-art-source-20261017 (+4).  
   *Next:* See Decisions: open a pull request, merge, or leave each branch.
6. ⚪ **A55 Pictures** — Missing. README shows 1 picture(s).  
   *Next:* Needs real pictures of the program working (you take some: card 026).
7. 🔵 **A18 Tool list** — Missing. No declared tool inventory.  
   *Next:* No tool list yet. It comes with the shared page framework.
8. ⚪ **A52 L3 activity bubble** — Missing. Required shared L3 activity bubble/config/script/style not found in the inspected entry source.  
   *Next:* Comes with Codex's shared page framework: card 035 asks Codex to bring its pull requests up to date.
9. ⚪ **A44 Yellow phone** — Missing. Shared phone baseline not found.  
   *Next:* Comes with Codex's shared page framework: card 035 asks Codex to bring its pull requests up to date.
10. ⚪ **A45 Paper and zoom** — Missing. Shared stationery source not found.  
   *Next:* Comes with Codex's shared page framework: card 035 asks Codex to bring its pull requests up to date.
11. ⚪ **A41 Clicker Training** — Missing. No Clicker Training section found in the inspected entry source.  
   *Next:* Comes with Codex's shared page framework: card 035 asks Codex to bring its pull requests up to date.

### Fixed tonight (in the fix PR, waiting for your merge)

- ⚪ **A31 Links** — Broken link https://github.com/findastra/mommys/tree/v0.1.1-20261009: repo renamed: mommys is now mommys-mommies. Fixed in [mommys-mommies#5](https://github.com/findastra/mommys-mommies/pull/5).

<details><summary>What the fix PR changes, exactly</summary>

- README.md: link to a renamed repo, https://github.com/findastra/mommys/tree/v0.1.1-20261009 -> https://github.com/findastra/mommys-mommies/tree/v0.1.1-20261009.
- pet.json: link to a renamed repo, https://github.com/findastra/mommys/tree/v0.1.1-20261009 -> https://github.com/findastra/mommys-mommies/tree/v0.1.1-20261009.

</details>

### Decisions

1. 🔵 **Branches with work not on main** and no pull request: [`claude/girls-same-size-20261017`](https://github.com/findastra/mommys-mommies/compare/main...claude%2Fgirls-same-size-20261017) (+5), [`claude/one-art-source-20261017`](https://github.com/findastra/mommys-mommies/compare/main...claude%2Fone-art-source-20261017) (+4). Open a PR, merge, or leave?
2. 🔵 **Merge the fix PR** [mommys-mommies#5](https://github.com/findastra/mommys-mommies/pull/5)? It only holds fixes that need no decision (listed above).

**Tools:** none declared in pet.json yet (A18).  
**Tutorial tools:** Play with, Care for — Not verified overnight.

<sub>Idle Flash Audit, 2026-10-18, Claude Opus 5.5. Read-only checks through the GitHub API; nothing was clicked, launched or signed in to.</sub>
