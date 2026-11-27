# White Hat Lab: TP-Link opens in a new tab, and its tools' lights come from real checks (2026-11-27)

Astra, 2026-11-27: "the TP link wasnt working and I am trying to set the button to orange but its not changeable".
On the lights: "the correct key is on there, use that its on the page already. so you should have shown blue because
you thgought it worked but once i checked and it had issues, i was supposed to be able to click it from blue to
orange. yellow is rare it means you found it needs an update".

- **TP-Link:** the router's sign-in page refuses to be shown inside a frame (X-Frame-Options: deny), and the Claude
  chat's browser pane blocks the router page's own scripts, so "Open it" left a blank "Opening..." page in place of the
  pet program. A pill whose link is a device's own plain-http page now opens it in a new tab
  (`scripts/pet-program-pages-20261018.mjs`, the `elsewhere` test). Links to websites open as before; only TP-Link's
  button changes today. Its text on the System Map says the chat's pane cannot show the router page.
- **Lights:** White Hat Lab had no `checks` in pets.json, so every tool's second light showed orange ("not checked
  yet"), and a click to report an issue left it orange. Checked on 2026-11-27 and recorded: port-check-tool,
  port-watch-tool, ghost-in-the-walls-tool and Wireshark work (blue, so a click turns them orange); TP-Link has an
  issue (orange) until it is seen working in her own browser. The key on the page is unchanged: blue works, orange
  report issues, yellow update waiting, grey not created.
- Rebuilt with `npm run build`: White Hat Lab's page, its Markdown pets and the System Map.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-27.
