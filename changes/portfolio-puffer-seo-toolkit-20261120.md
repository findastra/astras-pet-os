# Portfolio Puffer's seo-toolkit (2026-11-20)

Astra, 2026-11-20: "I'm starting to publish projects that are not able to be searched up very easily, and I want you
to be able to just search them up by their title, especially just using their dashes ... pills that represent
different pages ... a tool and a toolkit that does that for everything I request you do SEO on." Then: "I think this
just needs to be a portfolio [puffer] job. I don't think it needs a whole other agent."

- **Owner:** Portfolio Puffer (Iced Out Iceberg, `program-14`), not a new SEO Sea Lion and not OSC Sealion. Recorded in
  `skills/new-pet-or-tool/SKILL.md`.
- **seo-toolkit** (`iced-out-iceberg-v1.0-seo-toolkit-v1.0`, a native tool, in its own tool box in L1):
  `apps/portfolio-puffer-seo-toolkit-20261120.html` shows one pill per page with a green, yellow or red light; tap one
  for each check and the head tags to paste. The checks are `apps/portfolio-puffer-seo-check-20261120.js` (code, no AI,
  the same file in the browser and in Node). The page list is `apps/portfolio-puffer-seo-pages-20261120.json`
  (schema `portfolio-puffer-seo-pages-v1`, 12 pages found live on 2026-11-20).
- **The sweep:** `node scripts/portfolio-puffer-seo-sweep-20261120.mjs [--out <folder>]` fetches every page and writes
  `apps/portfolio-puffer-seo-results-20261120.js` (schema `portfolio-puffer-seo-results-v1`); `--out` also writes the
  sitemap.xml and robots.txt for the root of findastra.github.io. Behind a proxy, run it with `NODE_USE_ENV_PROXY=1`.
- **seo-fix-round** (`iced-out-iceberg-v1.0-seo-fix-round-trick-v1.0`, planned trick): the fix goes to each page's repo
  as a pull request Astra merges. Written steps only on the System Map; not a skill file yet.
- **Dashes:** search engines read a dash as a space, so the check wants the name in words *and* the dashed name in
  the title ("Liminal Doors (liminal-doors)"). The dashed-name check is a "should" (yellow), not a "must".
- **First sweep, 2026-11-20:** 0 green, 6 yellow, 6 red. No page has a canonical address, link-preview tags or
  structured data; findastra.github.io has no sitemap.xml or robots.txt (both 404); astras-pet-os has no front page
  (404 at its root).
- **Not done:** no page has been fixed yet; Google Search Console and Bing Webmaster Tools are not verified (only
  Astra can sign in); the sitemap is not in the findastra.github.io repo yet.
- Tests: `test/portfolio-puffer-seo-test-20261120.mjs` (10 tests, no network).

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-20.
