# Round 34: Raspberry Pi Berry — Raspberry Pi Maker

[All rounds](README.md) · Stage: **pipeline** · Repo: [findastra/raspberry-berry](https://github.com/findastra/raspberry-berry) (public) · audited `main` at `21f2383`

<img src="../../art/icons/raspberry-berry-20261012.png" width="88" alt="Raspberry Pi Berry icon">

*Nine-emotion sheet: Missing (no art yet; generating it costs money, so it waits for your OK).*

### Exceptions

<sub>⚪ the Idle Flash Audit fixes it (a fix in code is named for the pet's chat) · 🔵 waits for your Active Flash Session</sub>

1. ⚪ **A07 Program name** — Incorrect. Page title "Raspberry Berry" names neither the pet nor the program "Raspberry Pi Maker".  
   *Next:* Your pick: see Decisions.
2. ⚪ **A54 Third-party programs** — Missing. INTELLIGENCE-LEVELS lists programs made by others (the Raspberry Pi itself) but the page has no Third Party Programs row.  
   *Next:* The Intelligence Levels table lists programs made by others that the page does not show (or the other way round): match them.
3. ⚪ **A57 Current names only** — Incorrect. Retired names (the old hub names, findastra-pet-apps, Documents\Projects) in `scripts/draw-berry.mjs`.  
   *Next:* Inside code (a storage key or a name the code looks for), so it was left alone tonight.
4. ⚪ **A16 pet.json** — Missing. Metadata: framework declaration  
   *Next:* Framework metadata comes with the shared page framework (Codex's branch); not added by hand tonight.
5. ⚪ **A16 pet.json** — Incorrect. pet.json status "growing" differs from the registry "hatching".  
   *Next:* The pet submitted a different job to the Farmer: see Decisions.
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

### Decisions

1. 🔵 **pets.json says Raspberry Pi Berry is private, but GitHub says public.** Change the repo, or keep it and update the registry?

**Tools:** none declared in pet.json yet (A18).  
**Tutorial tools:** Play with, Care for — Not verified overnight.

<sub>Idle Flash Audit, 2026-10-18, Claude Opus 5.5. Read-only checks through the GitHub API; nothing was clicked, launched or signed in to.</sub>
