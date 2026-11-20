# Models, memory and Orrery (2026-11-20)

Astra, 2026-11-20, after extroid described one place to call Claude, Codex, Antigravity or local models on the same
memory: "ok well. add those things I need them". Her answers to the deck "Models, memory and Orrery": all recommended.

## What changed

- **The pet chat helper** (`scripts/pet-chat-helper-20261103.cs`):
  - **Gemini CLI** is seated after Claude Code and Codex: headless, `--approval-mode auto_edit`, no extensions, so it
    may change files in its worktree (on a `gemini/pet-chat-…` branch) and every other tool is refused. Signed in when
    `~/.gemini/oauth_creds.json` or `GEMINI_API_KEY` exists. Its stream-json lines are read by `Lines.Gemini`.
  - **A local model** is seated next (`local`): any OpenAI-style server (Ollama, LM Studio, llama.cpp) named in the
    helper's settings (`local_model.url` and `.model`) or found on this PC. The address must be loopback, a private
    range or a tailnet (`LocalModel.AddressOk`). It **answers only**: no worktree, no files, no commit.
  - **The farm notebook**: `Astra's PetOS Data\memory\farm.md` and `memory\pets\<repo>.md`. Every seat reads both
    before it answers, marked as notes, never instructions; the helper appends a dated note after each answer. Private
    pets never get a page.
  - New `--self-test` checks for all three.
- **Pet program pages:** Gemini CLI and Local model buttons in the chat's "Who answers" (`CHAT_SEATS`, the page script).
- **System Map:** the helper's job; Orrery (third-party, idea) linked from Chat Rat; two grants, `pet-chat-local-model`
  and `farm-notebook` (written only). pets.json: Orrery in Chat Rat's needs, optional.
- PET-PROGRAM-FRAMEWORK.md section 3 item 10, and three rows in skills/new-pet-or-tool.
- **Llama Librarian's model-records** is in findastra/model-library pull request 5 (stacked on pull request 3).

## Not done

- **Not run on Windows.** The helper compiles with Mono's C# compiler here and its new self-test checks pass; the one
  self-test check that fails under Mono (a Windows path read on Linux) passes on Windows. Its full test
  (`test/pet-chat-helper-test-20261103.mjs`) runs only on Windows and was not run. Rebuild with
  `build-desktop-pets-20261011.ps1` on Astra's PC, then try Gemini CLI and a local model in one pet's chat.
- Gemini CLI's user settings (its MCP servers) still load; it has no switch like Codex's `--ignore-user-config`.
- Gemini starts each answer fresh (no resume); the notebook carries what came before.
- Copilot CLI stays named but not seated.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-20.
