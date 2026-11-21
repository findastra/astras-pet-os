# The pet chat helper sends her message without a byte-order mark (2026-11-19)

Found while marking card 042 done (#388): on Windows, 4 of the pet chat helper's tests
(`test/pet-chat-helper-test-20261103.mjs`) failed when `npm test` ran from a PowerShell set to UTF-8, and passed from
Git Bash. Astra wants green tests on her PC before merges.

- **The cause:** .NET Framework opens a program's redirected stdin with `Console.InputEncoding` and writes that
  encoding's byte-order mark into the pipe as the program starts, before the helper writes anything. On a console whose
  input code page is UTF-8 (65001: `chcp 65001`, a PowerShell set to UTF-8, Windows' "Use Unicode UTF-8" option) the
  seat got U+FEFF in front of Astra's message. The other three failures followed from it: the test waits for the slow
  answer's message, exactly, so it never saw it start and could not stop it, and the seat stayed busy for Codex and the
  push.
- **`scripts/pet-chat-helper-20261103.cs`:** `Run.NoByteOrderMark()`, called before every program the helper starts,
  swaps a UTF-8 `Console.InputEncoding` that writes a mark for the same code page without one. The console itself does
  not change: it is already at 65001.
- **`test/pet-chat-helper-test-20261103.mjs`:** the helper now runs in a hidden console of its own set to UTF-8, so
  every Windows run checks this case, from any shell, and the console running the tests keeps its code page. Against the
  old helper the same 4 tests fail from Git Bash too.
- The helper on the PC is built into `bin/` by `build-desktop-pets-20261011.ps1` (gitignored): rebuild it after the
  merge. Started by Startup Star it gets a console with the PC's usual code page, so it most likely never sent the mark.

Not in this change: the farm-setup test ("from scratch, the installed farm ... (Windows)"), which another session is
fixing on `claude/main-tests-green-20261119`.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-19.
