---
name: show-pet-panel
description: Keep the pet's program page (its panels) open in the browser pane on the right while working on any of Astra's pets. Use at the start of every task that touches a pet, its pet program, its repo, its tools or tricks, or a world or avatar a pet looks after (Unity Stable, Infinite Studio, AI Doghouse, The Farm, ...), and again after changing that page.
---

# Show the pet's panels on the right (Astra, 2026-10-19)

Astra: "every time we work on something involving these pets, the panel is always pulled up right here to the right."

## The page being worked on, one at a time (Astra, 2026-11-02)

Astra: "Stop giving me the live pages. I want to look at the page that we're working on actively... I'm sick of
getting a bunch of conflated programs opening at once."

- **Show the working version, never the live site.** Until a change is merged, the live GitHub Pages address shows the
  old page, so never give it to her or open it as "what we're working on". Show the page built from your branch or
  worktree, and say in one line which branch and commit it is and that it is not live.
- **One page, one place.** Open only the page she is looking at, in the browser pane. Do not also open it, or other
  pages, programs or tools, in her own browser or on her desktop. If she asks to see something there, open that one
  thing only.
- **Live only when she asks,** or once, right after a merge, to confirm the merge reached the live site. Say that it is
  the live page.
- **The editorial status panel is the sign** (Astra, 2026-11-02): on every pet program page it shows, headed "Working
  copy: not the live site.", everywhere except the live site (`<owner>.github.io`), where it is hidden. Before showing
  her a page, check the editorial panel is there. If it is missing, you opened the live page by mistake. The tool in
  "How" also puts an **EDITORIAL** bar across the top of the page (repo, branch, commit, merged or not); the live site
  never has it.

The maintained source is `astras-pet-os/skills/show-pet-panel/SKILL.md`; Luna's Log's `skill-install-tool` installs it at
`%USERPROFILE%/.claude/skills/show-pet-panel/SKILL.md` and `%USERPROFILE%/.agents/skills/show-pet-panel/SKILL.md`.

## When
- At the start of any work on a pet, before or alongside reading its repo. If the work involves several pets, open the
  one being changed; open the others in more tabs of the browser pane.
- After you change the page, it reloads by itself (the bar's Auto-reload), so Astra sees the new version; scroll to the
  panel you changed. A page the build writes (`npm run build`) reloads when the build writes it.

## Which page
Pick the first that exists:
1. **The version you are changing:** the pet repo's own page (`entry` in its `pet.json`, e.g. Unity Unicorn's
   `unity-unicorn-20261008.html`) from your branch. Check the branch out in a worktree in a short `%TEMP%\<name>`
   folder (never in the live working copy another chat may be using).
2. **What is on `main`:** the same page from the PC working copy (`%USERPROFILE%\Documents\Astra's PetOS\<repo>`) or a
   fresh worktree of `origin/main`.
3. **The pet's GitHub Pages site,** when it has one (`gh api repos/findastra/<repo>/pages`), and only when nothing is
   being changed (no branch or worktree of yours exists). Say that it is the live page.
4. **The hub's spawned page:** `astras-pet-os/apps/pet-programs/<repo>-20261018.html`, for pets whose own repo has no
   page yet.

Pet names and program names come from the hub's `pet-programs.json` (Unity Unicorn's program is Unity Stable).

## How
Skill Scout's editorial-preview-tool does the serving (Astra, 2026-11-12; its trick is `show-working-copy` in
[findastra/lunas-log](https://github.com/findastra/lunas-log/blob/main/skills/show-working-copy/SKILL.md), installed
next to this one).
- The browser pane can't open `file://` pages. Run the tool on the folder you are showing (your worktree, or the PC
  working copy for `main`):
  `node "%USERPROFILE%/.claude/tools/editorial-preview-tool/editorial-preview-tool-20261111.mjs" open "<folder>"`.
  It opens the repo's `entry` (`pet.json`) or `index.html`; add `--page "<file>"` for another page, for example the
  hub's `apps/pet-programs/<repo>-20261018.html`. It serves the folder on 127.0.0.1 only (one server per folder,
  shared by every chat, so run it again rather than starting another), and serves `Documents\Astra's PetOS Data`
  read-only so the program lights, key requests, outstanding items and pet chat show. It prints `url` and `say`.
- Open it with the built-in browser: `preview_start` with that `url`, then `show_pane` `"preview"`, then
  `tabs_context`: the pane must say it is displayed. If the app will not bring it forward, put the `url` first in your
  reply and say so.
- Scroll to the panel you are working on: `find` its label (for example `unity-unicorn-assets-we-created`), then
  `computer` `scroll_to` that ref, and take a screenshot to check it drew.
- Tell Astra the `say` line: which version is showing (branch or `main`) and whether it is merged.
- When you finish, leave the server if she is still looking (it stops by itself after two hours with nobody looking),
  or stop it with `... stop "<folder>"` before you remove the temporary worktree.
- If the tool is not installed (no file at that path), install it from Luna's Log with Astra's OK
  (`node tools/editorial-preview-tool/editorial-preview-tool-20261111.mjs install --yes`); do not fall back to
  `python -m http.server`, which shows no bar and no PC data.

## Never
- Never show or link the live page as the work in progress (see the top).
- Never open several pages, programs or windows at once, and never `Start-Process` pages into her own browser while
  the pane can show them.
- Never type into the page's forms or press its buttons for Astra: its lights and notes save in her browser storage.
- Never serve on `0.0.0.0` or any address other than `127.0.0.1`.
- Never publish the page as an Artifact to show it, and never open it in Chrome unless she asks for Chrome. In Claude
  Code, hooks from the same tool send a chat back when it changed a page without showing it here.
