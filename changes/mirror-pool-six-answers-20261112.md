# Mirror Pool: Astra's six answers (Safari's engine, site-watch, one checker, accessibility, Playwright MCP)

Astra, 2026-11-12, after the critical look at Mirror Pool (Platform Platypus, pet program #36): "do a critical
assessment of this pet program and try to identify tools that I need that I don't have. Is there an MCP for this that
I need?", then **"all rec"** to the six-slide deck. The answers are recorded on findastra/platform-platypus card 003.

## In this hub

- **page-check v1.1** (`apps/platform-platypus-page-check-20261111.html`, `mirror-pool-v1.0-page-check-v1.1`):
  three accessibility checks were added, written into the page with no library:
  - text contrast: WCAG 2.2's 4.5:1, or 3:1 for large text; text over a picture is not measured
  - buttons, links, fields and pictures with no name a screen reader can read
  - things that react to a click but that Tab never reaches, and tabindex above 0

  They run on every screen with the other checks and show in the same report. Guarded by
  `test/mirror-pool-a11y-test-20261112.mjs`.
- **The dead address:** Platypus's `app_url` and `interface_live_url` in pets.json pointed at
  findastra.github.io/platform-platypus/. That is a 404: the repo is private with no Pages site. Both now point at
  Mirror Pool's page in the hub.
- **System Map:**
  - fit-check and device-shots are v1.1 (engines).
  - page-check is v1.1.
  - New node: `site-watch`, planned until findastra/platform-platypus#11 merges and its weekly task is installed.
- **MCP Roadmap** row 14, Playwright MCP, moved from Later to approved (Checked and approved, 2026-11-12):
  - MCP Inspector 2.13.0 listed 25 tools, 7 of them read-only.
  - With `mcp/playwright-mcp-config-20261112.json` it runs WebKit, headless, with an isolated profile, and may load only
    `http://127.0.0.1:*` and `https://findastra.github.io`.
  - Checked by hand: the Pocket Message Board opened; example.com was blocked ("Blocked by Web Inspector").
  - `mcp/register-playwright-mcp-20261112.ps1` registers it with Claude Code and Codex. Astra runs it from her own
    PowerShell window, as with the Farm's own server.
- **Who checks what:** Mirror Pool owns how a page looks and fits on each screen. Browser Bat owns links, uptime and
  publishing. This is written in platform-platypus AGENTS.md.

- **Latest check on Mirror Pool's page** (Astra, 2026-11-13: "this should be on that page. It can be smaller than
  it is, but it should be on that page"): `apps/platform-platypus-latest-check-20261113.html` sits in device-shots'
  pill (its System Map `embed`). It shows the last page checked, Spoonfed's working copy (cc3872d), with every screen
  at its real size (Astra, 2026-11-13: "I want each screen to be like the actual size you would see it in real life on
  my pc monitor. I dont care if this pet program has to be wider than normal"). One picture pixel is one CSS pixel. It
  can show Brave/Chrome, Safari, or both side by side, with what was fixed and what is still open. The 38 pictures
  (2 MB of JPEGs) are in `apps/platform-platypus-latest-check/`.
- **A new tool frame, `full`** (System Map `"frame": "full"`): the tool
   stays in its pill and fills it; the page holding one has no width limit, and what is still wider scrolls sideways inside the tool. Only
  device-shots uses it today.

## In findastra/platform-platypus (#11)

- fit-check and device-shots v1.1 take `--engine chromium|webkit|firefox|all`. WebKit and Firefox come from Playwright
  1.64.1, an optional dependency.
- site-watch v1.0 checks every public page in pets.json each week, in both engines. Results go to
  `Documents\Astra's PetOS Data\platform-platypus\site-watch`, and Mirror Pool's mood is set from them.
- `index.html` is now a short page that points here: one copy of the checker.

## Not done

- **Firefox does not start on Astra's PC.** Playwright's build stops with a Windows side-by-side error. Chromium and
  WebKit work.
- **Playwright MCP is approved, not connected.** It is connected when Astra runs the register script. Then a new chat
  lists it, and row 14 and Mirror Pool's map move to "now".
- **site-watch's weekly task** is installed after #11 merges. Mirror Pool's page does not show site-watch's mood yet.
- **Android over USB:** later (answer 4). Revisit only if a bug shows on the phone but not in WebKit or Chromium.

Claude Opus 5.5 (claude-opus-5-5), 2026-11-12.
