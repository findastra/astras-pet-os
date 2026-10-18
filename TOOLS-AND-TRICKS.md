# Tools and tricks

What a pet **has** and what a pet **knows**. Companion to [PET-PROGRAM-FRAMEWORK.md](PET-PROGRAM-FRAMEWORK.md) and
[PROTECTION-RINGS.md](PROTECTION-RINGS.md). Astra, 2026-10-14; the three kinds and the runtime and security chart below
added 2026-10-18 (Astra: "we need to anticipate how tricks and tools will be regarded by security").

## Tools, tricks and harness skills: one line each

- A **tool** is code. A computer runs it the same way every time, with no AI. It lives on **L1**.
- A **trick** is instructions. **It is owned at L2 and followed at L3**: the pet keeps it (in its repo, on its page's
  L2 module, tracked by Skill Scout), and only an AI in the seat can carry it out. With nobody in the seat it is text
  that does nothing. That is why a pet without an agent has tools but no tricks it can use.
- A **harness skill** is instructions too, but it belongs to **the seat** (Claude Code or Codex, installed on this PC),
  not to any pet. It helps an AI work *on* a pet. It is shown on the pet's L3 module.

When an AI has to follow it, it is a trick or a harness skill, never a tool. A trick does the pet's own job; a harness
skill helps whoever builds or repairs the pet ([ASTRAS_PET_OS.md](ASTRAS_PET_OS.md), section 8.6: runtime and
development `SKILL.md`). Today no pet has a harness of its own, so every trick is followed by Claude Code or Codex in
the seat.

## The chart: what runs, and how security sees it

| | **Tool** (L1) | **Trick** (owned at L2, followed at L3) | **Harness skill** (the seat, L3) |
|---|---|---|---|
| What it is | Code a pet program owns: a script, page, program or section. The pet's hands. | Written steps for doing the pet's job with its tools. The pet's training. | Written steps that help an AI work on a pet (build it, test it, hand it off) |
| Developer word | Program, module, utility | **Skill** (a `SKILL.md` file), prompt, workflow (runtime skill) | **Skill**, agent instructions (development skill) |
| Owner | One pet program | One pet program (its repo) | The seat: Claude Code or Codex on this PC (`%USERPROFILE%\.claude\skills`, `%USERPROFILE%\.codex\skills`) |
| Who runs it | The computer | The AI in the pet's seat (L3) | The AI in the seat, on every pet it works on |
| Needs AI to run | No | Yes; without an agent it does nothing | Yes |
| Same result every time | Yes | No: a model reads it and decides | No |
| Permissions | Its own ring and grants (R W X), never more | **None of its own.** It uses only tools the pet already has, under the pet's grants. It never brings new code or permissions. | **None of its own.** It uses the seat's permissions, which reach every pet the seat works on |
| Main risk | Bad or changed code, a stranger's code (supply chain), a grant that is too wide | Prompt injection, steps that drift, steps that steer an agent into misusing a tool | The same as a trick, across every pet the seat touches |
| What actually holds | The grant, the ON/OFF switch in the core, tests; the sandbox (planned) | **Only the grants on the tools it uses.** The text holds nothing: skill instructions are not security boundaries (ASTRAS_PET_OS.md, section 8.6) | The harness's own permission questions (grant 4 in PROTECTION-RINGS.md) and the rules in AGENTS.md |
| How security checks it | Tests, the file's hash, a code diff, its ring and grants | Skill Scout's diff (what changed, who, why), a checker agent, and a read for asks to download, reveal secrets or break a rule; the list of tools it names | The same as a trick, plus which pets it can reach |
| On the page | A tool box: `<pet-program>-v<version>-<tool>-v<tool version>` (L1 module) | A trick box: `<pet-program>-v<version>-<trick>-trick-v<trick version>`, with where it came from and which tools it uses (L2 module; "running now" on the L3 module) | Listed on the pet's L3 module as what the seat brings |
| Turning it off | ON/OFF on its tool box; the state lives in the core, so the tool cannot turn itself back on | ON/OFF on its trick box. This holds only while the agent obeys it ([known gap 14](PROTECTION-RINGS.md#known-gaps)); to stop a trick for certain, also switch off the tools it uses | Remove it from the seat |
| Who keeps track | Its pet program | **Skill Scout** tracks every trick: what changed, who changed it and why | Skill Scout (it watches every `SKILL.md`, the seat's too) |
| From a stranger (the Shed) | Quarantine, a checker agent, L4, then it runs in the sandbox (planned) | Quarantine; read as data first; never adds a tool; L4 | The same as a trick |
| When it fails | A crash or a wrong answer you can repeat | An agent does something that sounds right but is wrong; hard to repeat | The same as a trick, on any pet |

**For security, in short: lock the tools, review the tricks.** A trick can do no more than the tools it can reach,
so its review lists every tool it names, and Skill Scout flags a trick that starts naming a new tool.

## Real examples

| Pet | Tool (what it has) | Trick (what it knows) |
|---|---|---|
| File Master | `repo-catcher`: a PowerShell script that lists repos on the PC that were never pushed | **Weekly stale-repo sweep:** run repo-catcher, read its report, pick the repos that matter, and write a handoff card asking Astra which to push or archive |
| Friendly Farmer (The Farm) | `astras-pet-os-system-map`: the 3D map page | **How to Take Care of Your Farm!:** the first-run tutorial, walking a new farmer around the map one ring at a time |
| Gone Ghost (Am I a Ghost?) | `name-eraser`: replaces a name with `USER` in files | **Scrub before posting:** before a vet-clinic ticket goes out, run name-eraser as a dry run, run the secret scan, show L4 the exact text, then post |
| Unity Unicorn | `harness-strapper`: a Unity editor tool that rigs avatars | **Rig a new avatar:** import it, run harness-strapper, check the bones, then record which avatar it is rigged on in the tool box |
| Unity Unicorn | `prop-decomposer`: a Blender script that takes a real model apart into its parts | **Make a prop look real** (`unity-stable-v0.3.0-make-a-prop-look-real-trick-v1.0`, 2026-10-18, on the branch `claude/realistic-props-20261018`, not merged): start from a real CC0 model, run prop-decomposer, restyle by mask, paint brands out of every map, mount at true size |

Tricks that already exist: `skills/handoff`, `skills/pet-finder` and `skills/pet-organizer` in this repo are The Farm's
tricks. They are instructions, and they only use tools the agents already have (git, files, the pet-finder tool).
A harness skill that exists: `vrchat-unity-world` in Claude Code on Astra's PC, which helps any AI work on Astra's
VRChat worlds; no pet owns it.

## Shared tools and grants

One tool can be used by several pets. There is only **one copy**, owned by one pet program; other pets get a **grant**.

- A grant says exactly which **folders**, which of **R W X**, and what **limits** (how many results, how often).
- Gatekeeper Goddess (Iron Gates) issues grants; L4 approves them. Both pets show the grant in their connection box.
- Example: `pet-program-12-v1.0-everything-search-v1.0` is File Master's connector to Everything (a third-party
  search program). File Master's grant: the whole PC, read only. Wifi Butterfly's grant: its own folder only,
  read only, 50 results per search.

Never make a separate copy for each pet (`friendly-farmer-everything-search`, `wifi-butterfly-everything-search`):
copies drift apart, and a security patch has to be applied to every copy.

## Third-party tools and tricks: the Shed

Other creators make tools and tricks too. They are welcome, and they are treated like a pet from another farm.

- **The Shed** is the public place for third-party tools and tricks, as the Kennel is for pets
  ([findastra/the-shed](https://github.com/findastra/the-shed)). Creators submit them; the community and the
  maintainers review them.
- A **third-party trick** is only text, but text can steer an agent (prompt injection). A **third-party tool** is code
  from a stranger. Both go into quarantine, a checker agent reviews them, and the farm's L4 approves before they run.
- Trust tiers, highest first: **official** (signed by the maintainers), **Shed-verified** (reviewed and adopted
  through the Shed), **community** (anything else, always shown with a warning).
- Developer words: third-party tricks are **skills** or **prompts**; third-party tools that connect an agent to a
  program are **plugins** or **MCP servers**.
