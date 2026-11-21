# White Hat Weasel's port watch (2026-11-19)

Astra, 2026-11-19: "The White Hat Weasel should be monitoring ports and asking me intermittently if I can close some.
... lets make the tool. I want to be able to click on a port, labeled, and I can read info about the latest traffic."
Her answers to the deck "Weasel port watch questions": "All recommended".

- **New tool `white-hat-lab-v1.0-port-watch-tool-v1.0`** (`port-watch-tool` in system-map.json), the second tool box
  in White Hat Lab's L1, under the port check.
- **`scripts/port-watch-20261119.mjs`:** one look every 10 minutes with Get-NetTCPConnection and Win32_Process (no
  administrator, no port of its own). Each port gets a label, a kind (our own, chat preview, app, Windows), who can reach
  it, who is connected now and from where, and the last 12 peers seen. Writes only on her PC: the page data in
  `Astra's PetOS Data\white-hat-lab`, and its menu and mood for Startup Star and pet-moods. User folders are written as
  `%USERPROFILE%`.
- **The daily ask:** chat preview servers open more than two hours look left over. Once a day his mood turns curious and
  his menu in Startup Star starts with a line naming them.
- **Closing:** only our own servers (PetOS helpers and chat previews), only by her click on Close in that menu
  (`--close <port>` checks again and refuses anything else).
- **`apps/white-hat-lab-port-watch-20261119.html` + `.js`:** the tool box: the ask, filters, and every port as a labeled
  row; click one for what it is, who can reach it, who is connected, peers seen and how to close it. textContent only;
  it sends nothing. Anywhere but her PC it says the list is private.
- **Startup Star** (`scripts/desktop-pets-20261011.cs`): starts the port watch at sign-in and runs its menu items with
  the script's path first (`MenuPrefix`). The star has to be rebuilt on the PC after the merge (bin is gitignored).
- Tests: `test/port-watch-test-20261119.mjs`.

Not done: byte counts per connection (would need an administrator helper; Astra chose not to). UDP ports are not listed.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-19.
