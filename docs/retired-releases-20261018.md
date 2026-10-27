# Retired releases (the Cage era)

Astra, 2026-10-18: "why is there old cage software? Get rid of it." These two GitHub release pages were the old Cage and the old desktop Farmer (the Farmer dock). Their notes are kept here word for word, so deleting the pages loses nothing; their git tags stay too. Never install them: the one download is the installer zip of the latest release ([INSTALL.md](../INSTALL.md)). Saved by Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-18.

## Astra’s PetOS · 18 apps and a draggable Cage

- Tag: `v0.2.0-20261008` (target `main`), published 2026-10-09T03:19:46Z, pre-release: true, files attached: 0
- Page: https://github.com/findastra/astras-pet-os/releases/tag/v0.2.0-20261008

Notes, as published:

> Astra’s PetOS brings all 18 pets and their interfaces together. Every registered app now has its corresponding GitHub repository and source release. Double-click a pet to open its app.
> 
> The wider, lower Cage moves as a group when dragged by its enclosure, Farmer, optional local BSOD guest, or spinning star. Ghost is 25% smaller and the star is 5× larger with tiny RGB satellites. Creature sizes stay fixed. Flying pets float; ground pets roam and land on one floor. Chip uses the original Data Dealer artwork. The blond Farmer carries assorted produce.
> 
> The optional Windows Farmer companion now follows the real BSOD mini continuously from the right, at a fixed case-to-feet height. Browser group dragging is separate from the native mini.
> 
> Validation: 36 automated tests and the 18-entry registry check passed. Live browser checks verified all four drag handles, [launching each Pet's app], and selected interface workflows. Native tracking passed synthetic movement tests and an independent review.
> 
> Exact source: [1df0f2d57ed8f6ee8d166ebc988cfa95abe9d0c8](https://github.com/findastra/astras-pet-os/commit/1df0f2d57ed8f6ee8d166ebc988cfa95abe9d0c8). [Publication record](https://github.com/findastra/astras-pet-os/blob/main/docs/publications-20261008.md) and per-app source ledger are included. Open cage.html locally. This private source release does not create a new public hosted site.
> 
> Limits: several interfaces are useful drafts with manual local data; Project Parrot’s OneNote scanning/background reminders are not connected. Native Farmer supports the current BSOD mini on one display. External BSOD artwork is excluded; the browser guest uses an owner-supplied local sheet.
> 
> Rollback: restore immutable tag v0.2.0-20261008; close the optional Farmer companion to stop it. No installed Codex files or startup settings were modified.

## Desktop Farmer · faster mini following

- Tag: `v0.2.1-20261008` (target `main`), published 2026-10-09T03:31:15Z, pre-release: true, files attached: 0
- Page: https://github.com/findastra/astras-pet-os/releases/tag/v0.2.1-20261008

Notes, as published:

> The desktop Farmer could trail BSOD during dragging because every sample searched the accessibility tree and movement waited for a second timer. This patch reuses the verified BSOD image for fast position reads and immediately dispatches fresh positions to the Farmer. Fixed size and right-side attachment are preserved.
> 
> A scoped stationary query benchmark measured the original search at 7.93 ms median / 12.67 ms p95, compared with 0.09 ms / 0.21 ms for a cached rectangle read. These measurements describe query cost, not a guaranteed end-to-end display latency.
> 
> Validation: cached child-movement, fixed-size, duplicate-image and hidden-image checks passed, along with all 36 Cage tests and the registry check. The updated companion was restarted and verified as the single visible Farmer receiving live positions.
> 
> The helper continues to identify the exact BSOD image, hides on invalid or stale geometry, and only positions its own window. Installed Codex files and settings are not modified.
> 
> Exact source: [v0.2.1-20261008](https://github.com/findastra/astras-pet-os/tree/v0.2.1-20261008). Details are recorded in the [publication record](https://github.com/findastra/astras-pet-os/blob/main/docs/publications-20261008.md).
> 
> Rollback: close the Farmer and restore v0.2.0-20261008; its tag remains unchanged. This is a private source release and local companion update, not a new hosted website.
