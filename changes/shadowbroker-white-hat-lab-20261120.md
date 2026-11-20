# ShadowBroker: a third-party program of White Hat Lab (2026-11-20)

**Astra, 2026-11-20:** "https://github.com/BigBodyCobain/Shadowbroker Make this a third-party application on my White
Hat Weasel and download it."

## What changed

- `system-map.json`: a new third-party program node, `shadowbroker` (state `planned`: not installed on Astra's PC), and
  the link White Hat Lab → ShadowBroker. TOOLS-AND-TRICKS.md, the System Map and White Hat Lab's pet program page rebuilt.
- `pets.json`: White Hat Lab's `needs` lists it as optional.

## What ShadowBroker is (read from the quarantined copy, commit 3f786b1, never run)

A self-hosted OSINT map (AGPL-3.0, Next.js and FastAPI in Docker): aircraft, ships, satellites, outages, CISA KEV and
malware C2 feeds, a recon toolkit (DNS, WHOIS, BGP, CVE) and an optional Shodan connector. Its compose file binds ports
3000 and 8000 to 127.0.0.1 and refuses to start without an `ADMIN_KEY`. By default it joins a public peer-to-peer testnet
(`MESH_INFONET_FLEET_JOIN=true`); set it to `false` before the first run. Its agent command channel gives an agent read
and write access to every layer; keep it off until Iron Gates has a grant for it.

## Not done

- Not installed or run on Astra's PC (no computer was attached to this session). Installing it needs Docker Desktop.
- No grant for it yet; its recon and Shodan tools follow White Hat Weasel's rule: Astra's own devices and network only.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-20.
