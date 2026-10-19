#!/bin/sh
# The astras-pet-os command, installed as /usr/bin/astras-pet-os by the Linux package (Astra's PetOS, a tool of
# The Farm). The program is read only in /usr/share/astras-pet-os; your farm is in ~/.local/share/astras-pet-os.
# Claude Opus 5.5 (claude-opus-5-5), 2026-10-19.
exec node /usr/share/astras-pet-os/scripts/linux-cli-20261019.mjs "$@"
