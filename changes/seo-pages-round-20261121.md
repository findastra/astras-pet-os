# seo-toolkit: the first round of fixes (2026-11-21)

Astra, 2026-11-21: "merge and do it all for me."

- **findastra.github.io:** `sitemap.xml` and `robots.txt` (#212, #214), and search tags on the portfolio, the OpenAI
  IPO guide and the weekly digest (#213).
- **Search tags and a 1200x630 link preview** merged in astras-photostar #2, astras-star-window #6, the-cooling-tower #8,
  liminal-doors #11, ghost-protocol #18, papermon #29, fuzzboi-factory #6 and pocket-message-board #8. Every title now
  carries the dashed name ("The Cooling Tower (the-cooling-tower)").
- **Page list** (`apps/portfolio-puffer-seo-pages-20261120.json`): added the OpenAI IPO guide and the weekly digest; the
  Fuzzboi Forge at its real page (`fuzzboi-factory/site/`); a new `left_out` list with why: the Anthropic IPO guide (it
  has Astra's own investment numbers; finance data stays private until she says), OpenAI Discord Presence (moved),
  astras-pet-os (no front page), Ghost in the Walls and the drafts.
- **The description check** no longer fails a description for being longer than 160 characters: results cut it off,
  and Astra's own words are never trimmed. New test.
- **After:** 12 pages. Yellow on purpose or by design: the portfolio has no preview picture (its top shows the full
  name), and Papermon and the OpenAI IPO guide have no h1 in their page source. Red: Spoonfed, a built copy, to fix in
  the private spoonfed repo's source. Sitemap and robots.txt live.
- **Not done (Astra's step):** submit `https://findastra.github.io/sitemap.xml` in Google Search Console and Bing
  Webmaster Tools.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-21.
