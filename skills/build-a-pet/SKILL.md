---
name: build-a-pet
description: Build, update, audit or publish a Pet (Agent) and its Pet Program (Agent's Living Space) in Astra's PetOS, including its GitHub registration and visible UI. Use for Pet and Pet Program work in Codex or Claude, not real animals or ChatGPT Work pet customization.
---

# Build a Pet

OpenAI Codex (GPT-6), 2026-10-18. Shared instructions for OpenAI Codex and Anthropic Claude. Named `pet-app` until
2026-10-26, when Astra retired that word (PET-WORDS.md): a **Pet (Agent)** lives in its **Pet Program (Agent's Living
Space)**, as Rift Rabbit lives in Wonderland Launchpad. Renamed by Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-26.

## Read the complete current rules before work

Claude in the desktop app: keep the pet's program page open in the browser pane on the right for the whole task (skill `show-pet-panel`, Astra 2026-10-19).

Locate the canonical `astras-pet-os` repo under `%USERPROFILE%/Documents/Astra's PetOS` and the target pet repo. Fetch their remotes without changing active work. Read **every top-level `.md` file in both repos in full**, including AGENTS.md and CLAUDE.md. Enumerate the files; do not substitute this skill, memory, a fixed filename list, excerpts or a summary. Chunk long reads until complete and account for truncated output.

Also read every applicable SKILL.md, handoffs/README.md and open cards for the active provider or `any`, pet.json and docs/migration/PLAN.md. Check remote branches for newer instructions and read unique changed skill versions. Follow the current hub rules when this skill is stale. Report what was read and any unavailable files. Recheck after fetching changes.

Keep the live canonical checkout on its existing branch: Startup Star can read it continuously. Use an isolated Git worktree when branch edits would alter live state; do not create a second clone. Preserve unrelated work. Do not rebuild or restart the desktop host without reading current handoffs and preserving pending behavior.

## Names, scope and authorization

Use the hub's new-pet-or-tool skill. `pet-programs.json` is the sole name/number authority; update it before derivative lists. Workflow Whale is the character, Workflow Whirlpool the program, and ipad-workflow-caster its tool. Future iPhone/Android tools remain unbuilt until implemented.

Carry forward the user's explicit authorization for the current task. New GitHub repositories, external connections and public disclosures need authorization; do not ask again when already supplied. Core changes require a branch and reviewable PR, followed by Astra's explicit merge approval. A candidate or proposed pipeline entry does not itself grant live harness access. Follow animal-guard and protection-ring rules; never disable them to make a push work.

## Implementation and publication

Read PET-FILES.md, PET-PROGRAM-FRAMEWORK.md, INTELLIGENCE-LEVELS.md, PROTECTION-RINGS.md and TOOLS-AND-TRICKS.md from the current hub. Use their current schema and UI checklist. Each pet has pet.json, README.md, AGENTS.md, CLAUDE.md and LICENSE; required filenames are explicit exceptions to the owner's dated lowercase convention. Credit Astra. Record author/model/date. Never commit personal paths, legal names, tokens, captures or private notes.

Keep pet artwork in the hub's canonical art directories, with draft art clearly distinguished. Reuse existing art before considering paid generation; do not regenerate approved artwork. Other programs reference the single art source. Check every required mood visually and the actual UI, not only a build result.

Keep L1 program, L2 runtime and L3 agent status truthful. Launcher switches are not security enforcement. A guaranteed OFF requires disabling the underlying capability. These development skills belong to the provider's L3 seat; they are not Workflow Whale's runtime tools and confer no permissions.

Run appropriate checks, privacy and filename audits. Update the hub registry proposal, System Map, authoritative program list, art index/draft list and profile source as applicable. Generate derived files using the repo's scripts. Keep a concrete handoff describing exact changes, evidence, pending adoption and unverified integrations. Push authorized source branches and attach created PRs. Do not claim a merged registration, installed native pet, iPad acceptance or live chat delivery without evidence.

## Pet programs are control panels (Astra, 2026-10-19)

A pet program is a control panel (Astra, 2026-10-19): its page shows how things are and gives you the switches. When something gets too big for a tool panel, it becomes its own website that the pet program manages, and the page keeps one tool panel that shows how it is doing and opens it. Too big means it needs a screen of its own: tabs or menus, an editor, a gallery, or a long list to search. The website is a native program of the pet program (a page in its repo, or its own repo with Astra's OK). The full rule is PET-PROGRAM-FRAMEWORK.md, section 3.

## Both providers

The maintained source is `astras-pet-os/skills/build-a-pet/SKILL.md`. Install the same file in `%USERPROFILE%/.codex/skills/build-a-pet/SKILL.md` and `%USERPROFILE%/.claude/skills/build-a-pet/SKILL.md`, and remove the old `pet-app` folder from both (`%USERPROFILE%/.codex/skills/pet-app`, `%USERPROFILE%/.claude/skills/pet-app`) so the retired name stops loading. Do not edit bundled or cached skills. Verify the copies match and validate the frontmatter. A newly installed skill may need a new provider session to appear in its skill catalog; direct file reading still works.
