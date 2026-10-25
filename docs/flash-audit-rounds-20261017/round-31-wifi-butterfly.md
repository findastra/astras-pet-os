# Round 31: Wifi Butterfly — Signal Garden

[All rounds](README.md) · Stage: **pipeline** · Repo: [findastra/wifi-butterfly](https://github.com/findastra/wifi-butterfly) (public) · audited `main` at `6108bbb`

<img src="../../art/icons/wifi-butterfly-20261012.png" width="88" alt="Wifi Butterfly icon">

*Nine-emotion sheet: Missing (no art yet; generating it costs money, so it waits for your OK).*

**Fix PR waiting for you:** [wifi-butterfly#2](https://github.com/findastra/wifi-butterfly/pull/2)

### Exceptions

1. **A16 pet.json** — Missing. Metadata: framework declaration  
   *Next:* Framework metadata comes with the shared page framework (Codex's branch); not added by hand tonight.
2. **A18 Tool list** — Missing. No declared tool inventory.  
   *Next:* No tool list yet. It comes with the shared page framework.
3. **A52 L3 activity bubble** — Missing. Required shared L3 activity bubble/config/script/style not found in the inspected entry source.  
   *Next:* Open.
4. **A44 Yellow phone** — Missing. Shared phone baseline not found.  
   *Next:* Open.
5. **A45 Paper and zoom** — Missing. Shared stationery source not found.  
   *Next:* Open.
6. **A41 Clicker Training** — Missing. No Clicker Training section found in the inspected entry source.  
   *Next:* Open.

### Fixed tonight (in the fix PR, waiting for your merge)

- **A57 Current names only** — Retired names (the old hub names, findastra-pet-apps, Documents\Projects) in `AGENTS.md`, `README.md`, `desktop-pet-20261011.json`, `docs/plan-20261009.md`, `pet.json`, `sprite-20261009.json`.
- **A16 pet.json** — pet.json has no audit block (the registry has one).
- **A31 Links** — 4 links point at the old hub name or a missing file: <https://github.com/findastra/astras-pet-os/blob/main/handoffs/008-farmer-register-new-placeholders.md>, <https://github.com/findastra/astras-pet-os/blob/main/PET-FILES.md>, <https://github.com/findastra/astras-pet-os/blob/main/PET-WORDS.md>, <https://github.com/findastra/astras-pet-os>.

<details><summary>What the fix PR changes, exactly</summary>

- Retired names: 11 replacement(s) in AGENTS.md, README.md, desktop-pet-20261011.json, docs/plan-20261009.md, pet.json, sprite-20261009.json (old hub names / findastra-pet-apps -> astras-pet-os and Astra's PetOS, Documents\Projects -> Documents\Astra's PetOS). History lines kept as written.
- pet.json: audit block copied from the registry.
- README: the stale "Not in the Cage yet ... card 008" line now says it is a pipeline pet in pets.json (card 008 is an old dropped draft).
- 2026-10-18 refresh: Brought up to date with main (5 new commit(s) there); main's version was kept where both changed a line, and desktop-pet-20261011.json stays deleted as main deleted it. Retired names again after the merge: 2 in AGENTS.md, docs/plan-20261009.md. pet.json: audit block from the registry. Credit line is now "An Intelligent App, or Pet, by Astra." (card 033): 3 change(s) in README.md, index.html, wifi-butterfly-20261009.html. Art prompts and provenance notes keep their wording.

</details>

### Decisions

1. **Merge the fix PR** [wifi-butterfly#2](https://github.com/findastra/wifi-butterfly/pull/2)? It only holds fixes that need no decision (listed above).

**Tools:** none declared in pet.json yet (A18).  
**Tutorial tools:** Play with, Care for — Not verified overnight.

<sub>Idle Flash Audit, 2026-10-17, Claude Opus 5.5. Read-only checks through the GitHub API; nothing was clicked, launched or signed in to.</sub>
