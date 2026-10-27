---
name: pet-app
description: Build, update, audit or publish an Intelligent App (Pet) in Astra's PetOS, including its GitHub registration and visible UI. Use for pet program work in Codex or Claude, not real animals or ChatGPT Work pet customization.
---

# Intelligent App development

OpenAI Codex (GPT-6), 2026-10-18. Shared instructions for OpenAI Codex and Anthropic Claude. The six build stages
were added by Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-26.

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

## Building a new pet: six stages in order (Astra, 2026-10-26, Cung List item 4)

Every new pet, and every new tool or trick big enough to need its own pull request, goes through these six stages in
order. They follow the Superpowers method (obra/superpowers: brainstorm, plan, test first, review, verify), fitted to
the steps above. Every step above still applies; the stages say when each one happens. Do not skip a stage because the
task looks small. A one-line fix can make its plan one line long, but it still has a test and a verification.

1. **Brainstorm: what is it for, and whose is it?** Before any file is written:
   - Restate the need in one line and give its standard software term (`skills/dev-mindset`).
   - Run `skills/new-pet-or-tool`: the three tests (own program, own data, own schedule), the permissions it needs and
     the privacy check. Recommend one owner and one alternative.
   - Write down every question only Astra can answer (names, homes, owner, scope, keys) and ask them as one slideshow
     (`skills/questions-as-slides`). Names come only from `pet-programs.json`; never invent one. A key goes through
     `skills/key-request`.
   - Done when Astra has agreed to the design. A small design is agreed in chat; a larger one is written down as
     `docs/<topic>-design-YYYYMMDD.md` in the pet's repo.
2. **Written plan: what exactly will change.** Before any code:
   - List every file you will create or change (repo-relative paths, the house file names: lowercase, dated before the
     extension), every test you will write, and which PET-PROGRAM-FRAMEWORK.md checklist items the work meets.
   - Name the ring, each grant with its R W X, and whether each one is enforced, written only or planned
     (`skills/farm-security`).
   - Break the work into small tasks, each with the command that proves it works.
   - Claim the scope: a handoff card with the implementer, the exact files and the reviewer (`skills/handoff`). Put the
     plan in the card, or in `docs/<topic>-plan-YYYYMMDD.md` linked from it.
   - Work on a `claude/` or `codex/` branch in an isolated worktree, never a second clone (above).
3. **Test first.** For each task, write the test before the code (`node --test` in the hub, or the pet's own test
   runner). Run it and watch it fail for the reason you expect. A test that passes before the code exists proves nothing.
   Tools get tests that run with no network and no AI; a trick gets a check that every program, tool and trick it names
   exists (TOOLS-AND-TRICKS.md, "lock the tools, review the tricks").
4. **Build.** Write the smallest code that makes the test pass, then the next task. Keep the rules above: pet.json,
   README.md, AGENTS.md, CLAUDE.md and LICENSE; art only from the hub; Node's built-in modules only in the hub;
   generated files only through the repo's scripts; keys from environment variables, never in the repo. Commit after
   each green task.
5. **Self-review.** Read your own whole diff against the plan before anyone else does:
   - Does it do what the plan said, and nothing it did not say?
   - The framework checklist, the privacy and file-name audits, and the grants (no write or run wider than planned).
   - Names only from `pet-programs.json`, public credit "Astra", no personal paths, no keys, no legal names.
   - Then the maker-checker rule (`skills/farm-security`, section 7): a separate read-only checker (another model or a
     fresh session) reviews the diff. Fix what it finds, or write down why not.
6. **Verification: evidence before claims.** Run the full checks fresh and read their output: `npm test` in the hub and
   in the pet's repo, `npm run build` and `npm run check` where they apply, `npm run click-check` for pages. Look at the
   page and every mood in a browser, not only the build result. Write the commands and their pass counts in the card's
   `## What I did` and the pull request. Anything that only Astra's PC can prove (a desktop pet, a headset, a
   connection) is written as **not verified here**, with the exact command for her PC. Then push the branch, open the
   pull request, give the merge order (`skills/merge-order`) and wait for Astra's OK to merge.

### Superpowers itself: an optional third-party plugin for the seat

[Superpowers](https://github.com/obra/superpowers) (MIT, by Jesse Vincent and Prime Radiant) is a set of skills that
makes Claude Code or Codex follow this same method on its own. It is a **third-party harness skill set** (community
tier): it belongs to the seat, brings no permissions, and is not part of any pet. Installing it is Astra's choice; read
its skills before you turn it on (TOOLS-AND-TRICKS.md, "Third-party tools and tricks"). Claude Code, either of:

```
/plugin install superpowers@claude-plugins-official
```

```
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace
```

Codex: open `/plugins`, search `superpowers`, choose Install Plugin. Its brainstorming page loads a logo from its
makers' website that reports the Superpowers version; to turn that off, set the Windows user environment variable
`SUPERPOWERS_DISABLE_TELEMETRY=1`. Restart the session after installing.

Where Superpowers and this skill disagree, this skill and the hub rules win:
- **Never merge.** Its last step offers "merge locally"; here the answer is always a pushed branch and a pull request,
  merged only after Astra's OK in chat.
- **File names.** It saves designs and plans to `docs/superpowers/specs/` and `docs/superpowers/plans/` with the date
  first. Here they are `docs/<topic>-design-YYYYMMDD.md` and `docs/<topic>-plan-YYYYMMDD.md`, or the handoff card.
- **Questions** go to Astra as a slideshow (`skills/questions-as-slides`), not one at a time.
- **Worktrees** are welcome, but in the canonical repo's own worktree list, never a second clone.

## Pet programs are control panels (Astra, 2026-10-19)

A pet program is a control panel (Astra, 2026-10-19): its page shows how things are and gives you the switches. When something gets too big for a tool panel, it becomes its own website that the pet program manages, and the page keeps one tool panel that shows how it is doing and opens it. Too big means it needs a screen of its own: tabs or menus, an editor, a gallery, or a long list to search. The website is a native program of the pet program (a page in its repo, or its own repo with Astra's OK). The full rule is PET-PROGRAM-FRAMEWORK.md, section 3.

## Both providers

The maintained source is `astras-pet-os/skills/pet-app/SKILL.md`. Install the same file in `%USERPROFILE%/.codex/skills/pet-app/SKILL.md` and `%USERPROFILE%/.claude/skills/pet-app/SKILL.md`. Do not edit bundled or cached skills. Verify the copies match and validate the frontmatter. A newly installed skill may need a new provider session to appear in its skill catalog; direct file reading still works.
