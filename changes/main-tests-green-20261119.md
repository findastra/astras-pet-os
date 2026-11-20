# main's tests pass again on Astra's PC · 2026-11-19

`npm test` on main (5179d856) failed 3 of 494 tests on Astra's PC. They came up while fixing CodeQL alert 28 (#391),
which did not cause them.

- **Public safety:** White Hat Weasel's port watch test (#385) used a made-up user folder with a name the safety
  check does not know, so it read as a personal folder path. #393 fixed it first (the name is now `example`, the
  made-up name the check allows in any file), so this change leaves that file as main has it.
- **PowerShell parse check (Cung List's dev tools):** the script's path went inside '...' in a PowerShell command,
  and the apostrophe in "Astra's PetOS" ended the string. The path now goes in an environment variable.
- **Farm from scratch (installer):** a git worktree's `.git` is a file, and the installer's copy skipped `.git`
  only as a folder. A farm installed from a worktree got that pointer, so the Friendly Farmer took it for a hub copy
  and refused to add pets, and git there would have used the hub's history. The copy now skips the `.git` file too,
  and a test pins it. The Farmer's hub copy guard is unchanged. A farm installed from a clone or a release was never
  affected.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-19.
