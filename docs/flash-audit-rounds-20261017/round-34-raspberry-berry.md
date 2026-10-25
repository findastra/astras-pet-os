# Round 34: Raspberry Pi Berry — Raspberry Pi Maker

[All rounds](README.md) · Stage: **pipeline** · Repo: [findastra/raspberry-berry](https://github.com/findastra/raspberry-berry) (public) · audited `main` at `2c83018`

<img src="../../art/icons/raspberry-berry-20261012.png" width="88" alt="Raspberry Pi Berry icon">

*Nine-emotion sheet: Missing (no art yet; generating it costs money, so it waits for your OK).*

**Fix PR waiting for you:** [raspberry-berry#3](https://github.com/findastra/raspberry-berry/pull/3)

### Exceptions

1. **A07 Program name** — Incorrect. Page title "Raspberry Berry" names neither the pet nor the program "Raspberry Pi Maker".  
   *Next:* Your pick: see Decisions.
2. **A54 Third-party programs** — Missing. INTELLIGENCE-LEVELS lists programs made by others (the Raspberry Pi itself) but the page has no Third Party Programs row.  
   *Next:* The Intelligence Levels table lists programs made by others that the page does not show (or the other way round): match them.
3. **A57 Current names only** — Incorrect. Retired names (the old hub names, findastra-pet-apps, Documents\Projects) in `scripts/draw-berry.mjs`.  
   *Next:* Inside code (a storage key or a name the code looks for), so it was left alone tonight.
4. **A16 pet.json** — Missing. Metadata: framework declaration  
   *Next:* Framework metadata comes with the shared page framework (Codex's branch); not added by hand tonight.
5. **A16 pet.json** — Incorrect. pet.json job differs from the registry. pet.json: "Keeps track of Astra's Raspberry Pi projects and tells her which Pis need a backup or an OS update." pet.json status "growing" differs from the registry "hatching".  
   *Next:* The pet submitted a different job to the Farmer: see Decisions.
6. **A55 Pictures** — Missing. README shows 1 picture(s).  
   *Next:* Needs real pictures of the program working (you take some: card 026).
7. **A18 Tool list** — Missing. No declared tool inventory.  
   *Next:* No tool list yet. It comes with the shared page framework.
8. **A52 L3 activity bubble** — Missing. Required shared L3 activity bubble/config/script/style not found in the inspected entry source.  
   *Next:* Open.
9. **A44 Yellow phone** — Missing. Shared phone baseline not found.  
   *Next:* Open.
10. **A45 Paper and zoom** — Missing. Shared stationery source not found.  
   *Next:* Open.
11. **A41 Clicker Training** — Missing. No Clicker Training section found in the inspected entry source.  
   *Next:* Open.

### Fixed tonight (in the fix PR, waiting for your merge)

- **A57 Current names only** — Retired names (the old hub names, findastra-pet-apps, Documents\Projects) in `AGENTS.md`, `CLAUDE.md`, `README.md`, `desktop-pet-20261011.json`.
- **A31 Links** — Link to the hub under its old repo name: repo renamed to astras-pet-os.

<details><summary>What the fix PR changes, exactly</summary>

- Retired names: 8 replacement(s) in AGENTS.md, CLAUDE.md, README.md, desktop-pet-20261011.json (old hub names / findastra-pet-apps -> astras-pet-os and Astra's PetOS, Documents\Projects -> Documents\Astra's PetOS). History lines kept as written.
- Not changed: pet.json job differs from the registry, and the pet submitted a job to the Farmer on 2026-10-13. That submission needs the Farmer and Astra.
- 2026-10-18 refresh: Brought up to date with main (3 new commit(s) there); main's version was kept where both changed a line, and desktop-pet-20261011.json stays deleted as main deleted it. Retired names again after the merge: 2 in README.md. Not changed: the pet submitted its own job on 2026-10-13; that waits on the Farmer and Astra. Credit line is now "An Intelligent App, or Pet, by Astra." (card 033): 2 change(s) in AGENTS.md, README.md. Art prompts and provenance notes keep their wording.

</details>

### Decisions

1. **Job:** Raspberry Pi Berry submitted its own job to the Farmer (2026-10-13), and the registry says something else. Which one is right?
  - Pet's own: "Keeps track of Astra's Raspberry Pi projects and tells her which Pis need a backup or an OS update."
  - Registry: "Raspberry Pi Berry’s pet program is Raspberry Pi Maker (Astra, 2026-10-13): keeps track of Astra’s Raspberry Pi projects and tells her which Pis need a backup or an OS update."
2. **Merge the fix PR** [raspberry-berry#3](https://github.com/findastra/raspberry-berry/pull/3)? It only holds fixes that need no decision (listed above).

**Tools:** none declared in pet.json yet (A18).  
**Tutorial tools:** Play with, Care for — Not verified overnight.

<sub>Idle Flash Audit, 2026-10-17, Claude Opus 5.5. Read-only checks through the GitHub API; nothing was clicked, launched or signed in to.</sub>
