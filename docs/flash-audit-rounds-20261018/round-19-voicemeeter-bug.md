# Round 19: Voicemeeter Bug — Audio Rescue

[All rounds](README.md) · Stage: **registered** · Repo: [findastra/voicemeeter-bug](https://github.com/findastra/voicemeeter-bug) (public) · audited `master` at `b9c3ccf`

<img src="../../art/icons/voicemeeter-bug-20261012.png" width="88" alt="Voicemeeter Bug icon">

| Sleepy | Awake | Idle | Curious | Happy | Worried | Alarmed | Sick | Sad |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| <img src="../../art/frames/voicemeeter-bug/sleep-20261008.png" width="64" alt="sleep"> | <img src="../../art/frames/voicemeeter-bug/blink-20261008.png" width="64" alt="blink"> | <img src="../../art/frames/voicemeeter-bug/idle-20261008.png" width="64" alt="idle"> | <img src="../../art/frames/voicemeeter-bug/curious-20261008.png" width="64" alt="curious"> | <img src="../../art/frames/voicemeeter-bug/happy-20261008.png" width="64" alt="happy"> | <img src="../../art/frames/voicemeeter-bug/worried-20261008.png" width="64" alt="worried"> | <img src="../../art/frames/voicemeeter-bug/alarmed-20261008.png" width="64" alt="alarmed"> | <img src="../../art/frames/voicemeeter-bug/sick-20261008.png" width="64" alt="sick"> | <img src="../../art/frames/voicemeeter-bug/sad-20261008.png" width="64" alt="sad"> |

**Fix PR waiting for you:** [voicemeeter-bug#3](https://github.com/findastra/voicemeeter-bug/pull/3)

### Exceptions

<sub>⚪ the Idle Flash Audit fixes it (a fix in code is named for the pet's chat) · 🔵 waits for your Active Flash Session</sub>

1. ⚪ **A59 Pet program and its link** — Incorrect. pet.json entry opens build-voicemeeter-bug-20261008.ps1, but the hub shows apps/voicemeeter-bug-20261008.html as Voicemeeter Bug's program, and the repo has no voicemeeter-bug-20261008.html.  
   *Next:* Not changed: the pet's chat says which one is the program, then the other link follows.
2. ⚪ **A54 Third-party programs** — Missing. INTELLIGENCE-LEVELS lists programs made by others (Voicemeeter Potato. He watches its outputs A1 (CA-2890PRO speaker bar), A2 (Steam Streaming Speakers) and A3 (Razer Krak) but the page has no Third Party Programs row.  
   *Next:* The Intelligence Levels table lists programs made by others that the page does not show (or the other way round): match them.
3. ⚪ **A16 pet.json** — Missing. Metadata: framework declaration  
   *Next:* Framework metadata comes with the shared page framework (Codex's branch); not added by hand tonight.
4. ⚪ **A55 Pictures** — Missing. README shows 1 picture(s).  
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

### Fixed tonight (in the fix PR, waiting for your merge)

- ⚪ **A59 Pet program and its link** — README does not link to Audio Rescue (https://findastra.github.io/astras-pet-os/apps/voicemeeter-bug-20261008.html). Fixed in [voicemeeter-bug#3](https://github.com/findastra/voicemeeter-bug/pull/3).

<details><summary>What the fix PR changes, exactly</summary>

- README: links to its pet program, Audio Rescue (https://findastra.github.io/astras-pet-os/apps/voicemeeter-bug-20261008.html) (A59).

</details>

### Decisions

1. 🔵 **pets.json says Voicemeeter Bug is private, but GitHub says public.** Change the repo, or keep it and update the registry?
2. 🔵 **Merge the fix PR** [voicemeeter-bug#3](https://github.com/findastra/voicemeeter-bug/pull/3)? It only holds fixes that need no decision (listed above).

**Tools:** none declared in pet.json yet (A18).  
**Tutorial tools:** Play with, Care for — Not verified overnight.

<sub>Idle Flash Audit, 2026-10-18, Claude Opus 5.5. Read-only checks through the GitHub API; nothing was clicked, launched or signed in to.</sub>
