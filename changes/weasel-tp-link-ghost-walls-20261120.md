# White Hat Weasel's TP-Link and Ghost In The Walls tools (2026-11-20)

Astra, 2026-11-20: "I want a tool on the White Hat Weasel to just be a button that links me to this TP-Link network
login page. Like, just call it TP-Link, and that's the tool. ... I want the ghost in the walls tool to be a white hat
tool. And I want you to track attempted password logins to it somehow."

- **New tool `white-hat-lab-v1.0-tp-link-tool-v1.0`** (`tp-link-tool` in system-map.json): one button that opens the
  router's own sign-in page at `http://tplinkwifi.net` (it only answers on her home network). It keeps no password and
  changes nothing; router settings stay hers. The name, not the router's address, because the public-safety check
  refuses local network addresses on public pages.
- **New tool `white-hat-lab-v1.0-ghost-in-the-walls-tool-v1.0`** (`ghost-in-the-walls-tool`): her guest network's puzzle
  portal and its rabbit page (https://findastra.github.io/ghost-in-the-walls/). The portal pictures and the script that
  makes them stay on her PC, in `Astra's PetOS Data\white-hat-lab\ghost-in-the-walls`.
- Rebuilt with `node scripts/build.mjs`: TOOLS-AND-TRICKS.md, White Hat Lab's pet program page, its Markdown pets and the
  System Map.

Not done: tracking attempted logins. The router does not record wrong guest passwords. The closest is a list of every
device that joins the guest network, read with the tplinkrouterc6u library; that needs her router login through an API
Fairy key request, and its record stays on her PC. No TP-Link MCP server exists.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-20.
