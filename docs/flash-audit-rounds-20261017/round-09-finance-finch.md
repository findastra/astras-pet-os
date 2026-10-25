# Round 9: Finance Finch — Nest Egg

[All rounds](README.md) · Stage: **registered** · Repo: [findastra/finance-finch](https://github.com/findastra/finance-finch) (public) · audited `main` at `3d45aca`

<img src="../../art/icons/finance-finch-20261012.png" width="88" alt="Finance Finch icon">

| Sleepy | Awake | Idle | Curious | Happy | Worried | Alarmed | Sick | Sad |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| <img src="../../art/frames/finance-finch/sleep.png" width="64" alt="sleep"> | <img src="../../art/frames/finance-finch/blink.png" width="64" alt="blink"> | <img src="../../art/frames/finance-finch/idle.png" width="64" alt="idle"> | <img src="../../art/frames/finance-finch/curious.png" width="64" alt="curious"> | <img src="../../art/frames/finance-finch/happy.png" width="64" alt="happy"> | <img src="../../art/frames/finance-finch/worried.png" width="64" alt="worried"> | <img src="../../art/frames/finance-finch/alarmed.png" width="64" alt="alarmed"> | <img src="../../art/frames/finance-finch/sick.png" width="64" alt="sick"> | <img src="../../art/frames/finance-finch/sad.png" width="64" alt="sad"> |

**Fix PR waiting for you:** [finance-finch#2](https://github.com/findastra/finance-finch/pull/2)

### Exceptions

1. **A16 pet.json** — Missing. Metadata: framework declaration  
   *Next:* Framework metadata comes with the shared page framework (Codex's branch); not added by hand tonight.
2. **A55 Pictures** — Missing. README shows 1 picture(s).  
   *Next:* Needs real pictures of the program working (you take some: card 026).
3. **A18 Tool list** — Missing. No declared tool inventory.  
   *Next:* No tool list yet. It comes with the shared page framework.
4. **A52 L3 activity bubble** — Missing. Required shared L3 activity bubble/config/script/style not found in the inspected entry source.  
   *Next:* Open.
5. **A44 Yellow phone** — Missing. Shared phone baseline not found.  
   *Next:* Open.
6. **A45 Paper and zoom** — Missing. Shared stationery source not found.  
   *Next:* Open.
7. **A41 Clicker Training** — Missing. No Clicker Training section found in the inspected entry source.  
   *Next:* Open.

### Fixed tonight (in the fix PR, waiting for your merge)

- **A57 Current names only** — Retired names (the old hub names, findastra-pet-apps, Documents\Projects) in `AGENTS.md`, `README.md`, `desktop-pet-20261011.json`, `finance-finch-20261008.html`, `pet.json`, `sprite-20261008.json`.
- **A16 pet.json** — pet.json job differs from the registry. pet.json: "Personal finance tracker. A yellow canary. Your data stays on your PC and is never committed."
- **A16 pet.json** — pet.json has no audit block (the registry has one).
- **A31 Links** — Link to the hub under its old repo name: repo renamed to astras-pet-os.

<details><summary>What the fix PR changes, exactly</summary>

- Retired names: 7 replacement(s) in AGENTS.md, README.md, desktop-pet-20261011.json, finance-finch-20261008.html, pet.json, sprite-20261008.json (old hub names / findastra-pet-apps -> astras-pet-os and Astra's PetOS, Documents\Projects -> Documents\Astra's PetOS). History lines kept as written.
- pet.json: job now matches the registry; audit block copied from the registry.
- 2026-10-18 refresh: Brought up to date with main (3 new commit(s) there); main's version was kept where both changed a line, and desktop-pet-20261011.json stays deleted as main deleted it. Retired names again after the merge: 2 in AGENTS.md, finance-finch-20261008.html. pet.json: audit block from the registry. Credit line is now "An Intelligent App, or Pet, by Astra." (card 033): 2 change(s) in AGENTS.md, README.md. Art prompts and provenance notes keep their wording.

</details>

### Decisions

1. **Merge the fix PR** [finance-finch#2](https://github.com/findastra/finance-finch/pull/2)? It only holds fixes that need no decision (listed above).

**Tools:** none declared in pet.json yet (A18).  
**Tutorial tools:** Play with, Care for — Not verified overnight.

<sub>Idle Flash Audit, 2026-10-17, Claude Opus 5.5. Read-only checks through the GitHub API; nothing was clicked, launched or signed in to.</sub>
