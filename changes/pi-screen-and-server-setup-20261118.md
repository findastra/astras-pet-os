# Raspberry Berry's touch screen and the server's setup (2026-11-18)

Astra, 2026-11-18: "i want to set up my new server with a raspberry pi to tell me stats/statis on it. get raspberry
berry (his supposed to be name) and self host sweetheatt ready ... i also have touch screen for raspberry pi and
intend on putting it in cyber deck." Her photos the same day show the hardware: a **GEEKOM A9 Mega** mini PC (the
server), a **Raspberry Pi 4 Model B** in a clear fan case, and the official **7" Touch Display** (V1.1). She will set
the screen on the server until she has a mount.

- **findastra/server-hearth** (branch `ccr-1b17636b-ttwc70`): a read-only stats agent
  (`scripts/stats-agent-20261118.py`, Python standard library, Linux and Windows), its systemd installer with a
  home-network-only firewall rule (`scripts/install-stats-agent-20261118.sh --lan`, Port Spider's rule), and the
  server's setup guide (`docs/setup-geekom-a9-mega-20261118.md`: Ubuntu Server, hostname `hearth`).
- **findastra/raspberry-berry** (same branch): Berry's touch screen (`pi-screen.html`, 800×480, Berry's own sprite
  shows the mood), its setup script (`scripts/setup-pi-screen-20261118.sh`: kiosk at login, no screen blanking) and
  the Pi's setup guide (`docs/setup-pi4-touch-display-20261118.md`: Imager, ribbon, two jumper wires, no screws
  needed for a Pi in its case).
- This hub: Raspberry Pi Berry's INTELLIGENCE-LEVELS.md row.

**Names unchanged.** "Self-host Sweetheart" is taken as the server pet, which Astra settled on 2026-11-12 is
Server Salamander. The Pi pet stays "Raspberry Pi Berry" in pet-programs.json; renaming him "Raspberry Berry" waits on
Astra (asked 2026-11-18, no answer yet).

Tested: the agent in a Linux container (JSON reading, 404, shell syntax); the screen in Chromium at 800×480 with the
agent answering and the server missing. Not yet tested on the real Pi or the A9 Mega.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-18.
