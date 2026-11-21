// Written by scripts/portfolio-puffer-seo-sweep-20261120.mjs; do not edit by hand. Data, not code.
window.SEO_RESULTS = {
 "schema": "portfolio-puffer-seo-results-v1",
 "checked": "2026-11-20T18:59:47.761Z",
 "tool": "iced-out-iceberg-v1.0-seo-toolkit-v1.0",
 "site": {
  "url": "https://findastra.github.io/",
  "sitemap": {
   "url": "https://findastra.github.io/sitemap.xml",
   "status": 404,
   "pages": 0
  },
  "robots": {
   "status": 404,
   "names_sitemap": false
  }
 },
 "pages": [
  {
   "url": "https://findastra.github.io/",
   "slug": "findastra",
   "name": "findastra",
   "repo": "findastra.github.io",
   "light": "yellow",
   "passed": 8,
   "total": 14,
   "checks": [
    {
     "id": "reachable",
     "level": "must",
     "label": "The page opens",
     "ok": true,
     "found": "HTTP 200",
     "fix": ""
    },
    {
     "id": "indexable",
     "level": "must",
     "label": "Search engines may list it (no noindex)",
     "ok": true,
     "found": "no robots tag",
     "fix": ""
    },
    {
     "id": "title-words",
     "level": "must",
     "label": "The title has the name in words",
     "ok": true,
     "found": "findastra",
     "fix": ""
    },
    {
     "id": "title-slug",
     "level": "should",
     "label": "The title has the dashed name",
     "ok": true,
     "found": "findastra",
     "fix": ""
    },
    {
     "id": "title-length",
     "level": "should",
     "label": "The title is 10 to 65 characters",
     "ok": false,
     "found": "9 characters",
     "fix": "Keep the title between 10 and 65 characters so it is not cut off in results."
    },
    {
     "id": "description",
     "level": "must",
     "label": "It has a description (50 to 160 characters)",
     "ok": true,
     "found": "65 characters",
     "fix": ""
    },
    {
     "id": "one-h1",
     "level": "should",
     "label": "It has exactly one main heading (h1)",
     "ok": true,
     "found": "1 h1",
     "fix": ""
    },
    {
     "id": "canonical",
     "level": "should",
     "label": "It names its own address (canonical)",
     "ok": false,
     "found": "none",
     "fix": "Add \u003clink rel=\"canonical\" href=\"https://findastra.github.io/\">."
    },
    {
     "id": "lang",
     "level": "should",
     "label": "It says its language",
     "ok": true,
     "found": "yes",
     "fix": ""
    },
    {
     "id": "viewport",
     "level": "must",
     "label": "It fits phones (viewport)",
     "ok": true,
     "found": "width=device-width, initial-scale=1",
     "fix": ""
    },
    {
     "id": "og",
     "level": "should",
     "label": "It has a link preview (Open Graph)",
     "ok": false,
     "found": "missing og:title, og:description, og:url, og:image",
     "fix": "Add the Open Graph tags so shared links show a title, a line and a picture."
    },
    {
     "id": "twitter",
     "level": "should",
     "label": "It has a card for X and Discord previews",
     "ok": false,
     "found": "none",
     "fix": "Add \u003cmeta name=\"twitter:card\" content=\"summary_large_image\">."
    },
    {
     "id": "json-ld",
     "level": "should",
     "label": "It tells search engines what it is (structured data)",
     "ok": false,
     "found": "none",
     "fix": "Add a small JSON-LD block (schema.org WebSite or SoftwareApplication) with the name."
    },
    {
     "id": "in-sitemap",
     "level": "should",
     "label": "It is in the sitemap",
     "ok": false,
     "found": "there is no sitemap.xml yet",
     "fix": "Add it to sitemap.xml at the root of findastra.github.io."
    }
   ],
   "title": "findastra",
   "description": "Audra, a.k.a. Astra: worlds, projects, pets, and how to reach me.",
   "head": "\u003ctitle>findastra (findastra)\u003c/title>\n\u003clink rel=\"canonical\" href=\"https://findastra.github.io/\">\n\u003cmeta property=\"og:title\" content=\"findastra (findastra)\">\n\u003cmeta property=\"og:description\" content=\"Audra, a.k.a. Astra: worlds, projects, pets, and how to reach me.\">\n\u003cmeta property=\"og:url\" content=\"https://findastra.github.io/\">\n\u003cmeta property=\"og:image\" content=\"[ADDRESS OF A 1200x630 PREVIEW PICTURE]\">\n\u003cmeta name=\"twitter:card\" content=\"summary_large_image\">\n\u003cscript type=\"application/ld+json\">{\"@context\":\"https://schema.org\",\"@type\":\"WebSite\",\"name\":\"findastra\",\"alternateName\":\"findastra\",\"url\":\"https://findastra.github.io/\",\"author\":{\"@type\":\"Person\",\"name\":\"Astra\"}}\u003c/script>"
  },
  {
   "url": "https://findastra.github.io/astras-pet-os/",
   "slug": "astras-pet-os",
   "name": "Astra's PetOS",
   "repo": "astras-pet-os",
   "note": "No front page yet: only the files under it are served.",
   "light": "red",
   "passed": 0,
   "total": 1,
   "checks": [
    {
     "id": "reachable",
     "level": "must",
     "label": "The page opens",
     "ok": false,
     "found": "HTTP 404",
     "fix": "Check that GitHub Pages is on for this repo and the address is right."
    }
   ],
   "head": ""
  },
  {
   "url": "https://findastra.github.io/astras-photostar/",
   "slug": "astras-photostar",
   "name": "Astra's Photo Star",
   "repo": "astras-photostar",
   "light": "yellow",
   "passed": 8,
   "total": 14,
   "checks": [
    {
     "id": "reachable",
     "level": "must",
     "label": "The page opens",
     "ok": true,
     "found": "HTTP 200",
     "fix": ""
    },
    {
     "id": "indexable",
     "level": "must",
     "label": "Search engines may list it (no noindex)",
     "ok": true,
     "found": "no robots tag",
     "fix": ""
    },
    {
     "id": "title-words",
     "level": "must",
     "label": "The title has the name in words",
     "ok": true,
     "found": "Astra's Photo Star",
     "fix": ""
    },
    {
     "id": "title-slug",
     "level": "should",
     "label": "The title has the dashed name",
     "ok": false,
     "found": "Astra's Photo Star",
     "fix": "Add \"(astras-photostar)\" to the \u003ctitle>, so the name you type is in it too."
    },
    {
     "id": "title-length",
     "level": "should",
     "label": "The title is 10 to 65 characters",
     "ok": true,
     "found": "18 characters",
     "fix": ""
    },
    {
     "id": "description",
     "level": "must",
     "label": "It has a description (50 to 160 characters)",
     "ok": true,
     "found": "110 characters",
     "fix": ""
    },
    {
     "id": "one-h1",
     "level": "should",
     "label": "It has exactly one main heading (h1)",
     "ok": true,
     "found": "1 h1",
     "fix": ""
    },
    {
     "id": "canonical",
     "level": "should",
     "label": "It names its own address (canonical)",
     "ok": false,
     "found": "none",
     "fix": "Add \u003clink rel=\"canonical\" href=\"https://findastra.github.io/astras-photostar/\">."
    },
    {
     "id": "lang",
     "level": "should",
     "label": "It says its language",
     "ok": true,
     "found": "yes",
     "fix": ""
    },
    {
     "id": "viewport",
     "level": "must",
     "label": "It fits phones (viewport)",
     "ok": true,
     "found": "width=device-width,initial-scale=1",
     "fix": ""
    },
    {
     "id": "og",
     "level": "should",
     "label": "It has a link preview (Open Graph)",
     "ok": false,
     "found": "missing og:title, og:description, og:url, og:image",
     "fix": "Add the Open Graph tags so shared links show a title, a line and a picture."
    },
    {
     "id": "twitter",
     "level": "should",
     "label": "It has a card for X and Discord previews",
     "ok": false,
     "found": "none",
     "fix": "Add \u003cmeta name=\"twitter:card\" content=\"summary_large_image\">."
    },
    {
     "id": "json-ld",
     "level": "should",
     "label": "It tells search engines what it is (structured data)",
     "ok": false,
     "found": "none",
     "fix": "Add a small JSON-LD block (schema.org WebSite or SoftwareApplication) with the name."
    },
    {
     "id": "in-sitemap",
     "level": "should",
     "label": "It is in the sitemap",
     "ok": false,
     "found": "there is no sitemap.xml yet",
     "fix": "Add it to sitemap.xml at the root of findastra.github.io."
    }
   ],
   "title": "Astra's Photo Star",
   "description": "Put your favorite photos in a fat neon star and download your photo star. Your photos never leave your device.",
   "head": "\u003ctitle>Astra's Photo Star (astras-photostar)\u003c/title>\n\u003clink rel=\"canonical\" href=\"https://findastra.github.io/astras-photostar/\">\n\u003cmeta property=\"og:title\" content=\"Astra's Photo Star (astras-photostar)\">\n\u003cmeta property=\"og:description\" content=\"Put your favorite photos in a fat neon star and download your photo star. Your photos never leave your device.\">\n\u003cmeta property=\"og:url\" content=\"https://findastra.github.io/astras-photostar/\">\n\u003cmeta property=\"og:image\" content=\"[ADDRESS OF A 1200x630 PREVIEW PICTURE]\">\n\u003cmeta name=\"twitter:card\" content=\"summary_large_image\">\n\u003cscript type=\"application/ld+json\">{\"@context\":\"https://schema.org\",\"@type\":\"WebSite\",\"name\":\"Astra's Photo Star\",\"alternateName\":\"astras-photostar\",\"url\":\"https://findastra.github.io/astras-photostar/\",\"author\":{\"@type\":\"Person\",\"name\":\"Astra\"}}\u003c/script>"
  },
  {
   "url": "https://findastra.github.io/astras-star-window/",
   "slug": "astras-star-window",
   "name": "Astra's Window Star",
   "repo": "astras-star-window",
   "light": "yellow",
   "passed": 8,
   "total": 14,
   "checks": [
    {
     "id": "reachable",
     "level": "must",
     "label": "The page opens",
     "ok": true,
     "found": "HTTP 200",
     "fix": ""
    },
    {
     "id": "indexable",
     "level": "must",
     "label": "Search engines may list it (no noindex)",
     "ok": true,
     "found": "no robots tag",
     "fix": ""
    },
    {
     "id": "title-words",
     "level": "must",
     "label": "The title has the name in words",
     "ok": true,
     "found": "Astra's Window Star",
     "fix": ""
    },
    {
     "id": "title-slug",
     "level": "should",
     "label": "The title has the dashed name",
     "ok": false,
     "found": "Astra's Window Star",
     "fix": "Add \"(astras-star-window)\" to the \u003ctitle>, so the name you type is in it too."
    },
    {
     "id": "title-length",
     "level": "should",
     "label": "The title is 10 to 65 characters",
     "ok": true,
     "found": "19 characters",
     "fix": ""
    },
    {
     "id": "description",
     "level": "must",
     "label": "It has a description (50 to 160 characters)",
     "ok": true,
     "found": "153 characters",
     "fix": ""
    },
    {
     "id": "one-h1",
     "level": "should",
     "label": "It has exactly one main heading (h1)",
     "ok": true,
     "found": "1 h1",
     "fix": ""
    },
    {
     "id": "canonical",
     "level": "should",
     "label": "It names its own address (canonical)",
     "ok": false,
     "found": "none",
     "fix": "Add \u003clink rel=\"canonical\" href=\"https://findastra.github.io/astras-star-window/\">."
    },
    {
     "id": "lang",
     "level": "should",
     "label": "It says its language",
     "ok": true,
     "found": "yes",
     "fix": ""
    },
    {
     "id": "viewport",
     "level": "must",
     "label": "It fits phones (viewport)",
     "ok": true,
     "found": "width=device-width,initial-scale=1",
     "fix": ""
    },
    {
     "id": "og",
     "level": "should",
     "label": "It has a link preview (Open Graph)",
     "ok": false,
     "found": "missing og:title, og:description, og:url, og:image",
     "fix": "Add the Open Graph tags so shared links show a title, a line and a picture."
    },
    {
     "id": "twitter",
     "level": "should",
     "label": "It has a card for X and Discord previews",
     "ok": false,
     "found": "none",
     "fix": "Add \u003cmeta name=\"twitter:card\" content=\"summary_large_image\">."
    },
    {
     "id": "json-ld",
     "level": "should",
     "label": "It tells search engines what it is (structured data)",
     "ok": false,
     "found": "none",
     "fix": "Add a small JSON-LD block (schema.org WebSite or SoftwareApplication) with the name."
    },
    {
     "id": "in-sitemap",
     "level": "should",
     "label": "It is in the sitemap",
     "ok": false,
     "found": "there is no sitemap.xml yet",
     "fix": "Add it to sitemap.xml at the root of findastra.github.io."
    }
   ],
   "title": "Astra's Window Star",
   "description": "Astra's Window Star: a fat star that fades between Astra's favorite pictures of her avatar. One hosted picture: change it here and it changes everywhere.",
   "head": "\u003ctitle>Astra's Window Star (astras-star-window)\u003c/title>\n\u003clink rel=\"canonical\" href=\"https://findastra.github.io/astras-star-window/\">\n\u003cmeta property=\"og:title\" content=\"Astra's Window Star (astras-star-window)\">\n\u003cmeta property=\"og:description\" content=\"Astra's Window Star: a fat star that fades between Astra's favorite pictures of her avatar. One hosted picture: change it here and it changes everywhere.\">\n\u003cmeta property=\"og:url\" content=\"https://findastra.github.io/astras-star-window/\">\n\u003cmeta property=\"og:image\" content=\"[ADDRESS OF A 1200x630 PREVIEW PICTURE]\">\n\u003cmeta name=\"twitter:card\" content=\"summary_large_image\">\n\u003cscript type=\"application/ld+json\">{\"@context\":\"https://schema.org\",\"@type\":\"WebSite\",\"name\":\"Astra's Window Star\",\"alternateName\":\"astras-star-window\",\"url\":\"https://findastra.github.io/astras-star-window/\",\"author\":{\"@type\":\"Person\",\"name\":\"Astra\"}}\u003c/script>"
  },
  {
   "url": "https://findastra.github.io/the-cooling-tower/",
   "slug": "the-cooling-tower",
   "name": "The Cooling Tower",
   "repo": "the-cooling-tower",
   "light": "red",
   "passed": 7,
   "total": 14,
   "checks": [
    {
     "id": "reachable",
     "level": "must",
     "label": "The page opens",
     "ok": true,
     "found": "HTTP 200",
     "fix": ""
    },
    {
     "id": "indexable",
     "level": "must",
     "label": "Search engines may list it (no noindex)",
     "ok": true,
     "found": "no robots tag",
     "fix": ""
    },
    {
     "id": "title-words",
     "level": "must",
     "label": "The title has the name in words",
     "ok": true,
     "found": "The Cooling Tower",
     "fix": ""
    },
    {
     "id": "title-slug",
     "level": "should",
     "label": "The title has the dashed name",
     "ok": false,
     "found": "The Cooling Tower",
     "fix": "Add \"(the-cooling-tower)\" to the \u003ctitle>, so the name you type is in it too."
    },
    {
     "id": "title-length",
     "level": "should",
     "label": "The title is 10 to 65 characters",
     "ok": true,
     "found": "17 characters",
     "fix": ""
    },
    {
     "id": "description",
     "level": "must",
     "label": "It has a description (50 to 160 characters)",
     "ok": false,
     "found": "162 characters",
     "fix": "Add a one-sentence \u003cmeta name=\"description\">: what it is, in plain words."
    },
    {
     "id": "one-h1",
     "level": "should",
     "label": "It has exactly one main heading (h1)",
     "ok": true,
     "found": "1 h1",
     "fix": ""
    },
    {
     "id": "canonical",
     "level": "should",
     "label": "It names its own address (canonical)",
     "ok": false,
     "found": "none",
     "fix": "Add \u003clink rel=\"canonical\" href=\"https://findastra.github.io/the-cooling-tower/\">."
    },
    {
     "id": "lang",
     "level": "should",
     "label": "It says its language",
     "ok": true,
     "found": "yes",
     "fix": ""
    },
    {
     "id": "viewport",
     "level": "must",
     "label": "It fits phones (viewport)",
     "ok": true,
     "found": "width=device-width, initial-scale=1, viewport-fit=cover",
     "fix": ""
    },
    {
     "id": "og",
     "level": "should",
     "label": "It has a link preview (Open Graph)",
     "ok": false,
     "found": "missing og:title, og:description, og:url, og:image",
     "fix": "Add the Open Graph tags so shared links show a title, a line and a picture."
    },
    {
     "id": "twitter",
     "level": "should",
     "label": "It has a card for X and Discord previews",
     "ok": false,
     "found": "none",
     "fix": "Add \u003cmeta name=\"twitter:card\" content=\"summary_large_image\">."
    },
    {
     "id": "json-ld",
     "level": "should",
     "label": "It tells search engines what it is (structured data)",
     "ok": false,
     "found": "none",
     "fix": "Add a small JSON-LD block (schema.org WebSite or SoftwareApplication) with the name."
    },
    {
     "id": "in-sitemap",
     "level": "should",
     "label": "It is in the sitemap",
     "ok": false,
     "found": "there is no sitemap.xml yet",
     "fix": "Add it to sitemap.xml at the root of findastra.github.io."
    }
   ],
   "title": "The Cooling Tower",
   "description": "World portfolio for The Cooling Tower, a VRChat rave world inside a nuclear plant: real photos, the science behind each one, and how the DJ and the crowd play it.",
   "head": "\u003ctitle>The Cooling Tower (the-cooling-tower)\u003c/title>\n\u003cmeta name=\"description\" content=\"World portfolio for The Cooling Tower, a VRChat rave world inside a nuclear plant: real photos, the science behind each one, and how the DJ and the crowd play it.\">\n\u003clink rel=\"canonical\" href=\"https://findastra.github.io/the-cooling-tower/\">\n\u003cmeta property=\"og:title\" content=\"The Cooling Tower (the-cooling-tower)\">\n\u003cmeta property=\"og:description\" content=\"World portfolio for The Cooling Tower, a VRChat rave world inside a nuclear plant: real photos, the science behind each one, and how the DJ and the crowd play it.\">\n\u003cmeta property=\"og:url\" content=\"https://findastra.github.io/the-cooling-tower/\">\n\u003cmeta property=\"og:image\" content=\"[ADDRESS OF A 1200x630 PREVIEW PICTURE]\">\n\u003cmeta name=\"twitter:card\" content=\"summary_large_image\">\n\u003cscript type=\"application/ld+json\">{\"@context\":\"https://schema.org\",\"@type\":\"WebSite\",\"name\":\"The Cooling Tower\",\"alternateName\":\"the-cooling-tower\",\"url\":\"https://findastra.github.io/the-cooling-tower/\",\"author\":{\"@type\":\"Person\",\"name\":\"Astra\"}}\u003c/script>"
  },
  {
   "url": "https://findastra.github.io/liminal-doors/",
   "slug": "liminal-doors",
   "name": "Liminal Doors",
   "repo": "liminal-doors",
   "light": "yellow",
   "passed": 8,
   "total": 14,
   "checks": [
    {
     "id": "reachable",
     "level": "must",
     "label": "The page opens",
     "ok": true,
     "found": "HTTP 200",
     "fix": ""
    },
    {
     "id": "indexable",
     "level": "must",
     "label": "Search engines may list it (no noindex)",
     "ok": true,
     "found": "no robots tag",
     "fix": ""
    },
    {
     "id": "title-words",
     "level": "must",
     "label": "The title has the name in words",
     "ok": true,
     "found": "Liminal Doors · Found Floors",
     "fix": ""
    },
    {
     "id": "title-slug",
     "level": "should",
     "label": "The title has the dashed name",
     "ok": false,
     "found": "Liminal Doors · Found Floors",
     "fix": "Add \"(liminal-doors)\" to the \u003ctitle>, so the name you type is in it too."
    },
    {
     "id": "title-length",
     "level": "should",
     "label": "The title is 10 to 65 characters",
     "ok": true,
     "found": "28 characters",
     "fix": ""
    },
    {
     "id": "description",
     "level": "must",
     "label": "It has a description (50 to 160 characters)",
     "ok": true,
     "found": "98 characters",
     "fix": ""
    },
    {
     "id": "one-h1",
     "level": "should",
     "label": "It has exactly one main heading (h1)",
     "ok": true,
     "found": "1 h1",
     "fix": ""
    },
    {
     "id": "canonical",
     "level": "should",
     "label": "It names its own address (canonical)",
     "ok": false,
     "found": "none",
     "fix": "Add \u003clink rel=\"canonical\" href=\"https://findastra.github.io/liminal-doors/\">."
    },
    {
     "id": "lang",
     "level": "should",
     "label": "It says its language",
     "ok": true,
     "found": "yes",
     "fix": ""
    },
    {
     "id": "viewport",
     "level": "must",
     "label": "It fits phones (viewport)",
     "ok": true,
     "found": "width=device-width,initial-scale=1,viewport-fit=cover",
     "fix": ""
    },
    {
     "id": "og",
     "level": "should",
     "label": "It has a link preview (Open Graph)",
     "ok": false,
     "found": "missing og:title, og:description, og:url, og:image",
     "fix": "Add the Open Graph tags so shared links show a title, a line and a picture."
    },
    {
     "id": "twitter",
     "level": "should",
     "label": "It has a card for X and Discord previews",
     "ok": false,
     "found": "none",
     "fix": "Add \u003cmeta name=\"twitter:card\" content=\"summary_large_image\">."
    },
    {
     "id": "json-ld",
     "level": "should",
     "label": "It tells search engines what it is (structured data)",
     "ok": false,
     "found": "none",
     "fix": "Add a small JSON-LD block (schema.org WebSite or SoftwareApplication) with the name."
    },
    {
     "id": "in-sitemap",
     "level": "should",
     "label": "It is in the sitemap",
     "ok": false,
     "found": "there is no sitemap.xml yet",
     "fix": "Add it to sitemap.xml at the root of findastra.github.io."
    }
   ],
   "title": "Liminal Doors · Found Floors",
   "description": "Astra's Liminal Doors, a VRChat world: every floor so far, with a check for each one you've found.",
   "head": "\u003ctitle>Liminal Doors (liminal-doors)\u003c/title>\n\u003clink rel=\"canonical\" href=\"https://findastra.github.io/liminal-doors/\">\n\u003cmeta property=\"og:title\" content=\"Liminal Doors (liminal-doors)\">\n\u003cmeta property=\"og:description\" content=\"Astra's Liminal Doors, a VRChat world: every floor so far, with a check for each one you've found.\">\n\u003cmeta property=\"og:url\" content=\"https://findastra.github.io/liminal-doors/\">\n\u003cmeta property=\"og:image\" content=\"[ADDRESS OF A 1200x630 PREVIEW PICTURE]\">\n\u003cmeta name=\"twitter:card\" content=\"summary_large_image\">\n\u003cscript type=\"application/ld+json\">{\"@context\":\"https://schema.org\",\"@type\":\"WebSite\",\"name\":\"Liminal Doors\",\"alternateName\":\"liminal-doors\",\"url\":\"https://findastra.github.io/liminal-doors/\",\"author\":{\"@type\":\"Person\",\"name\":\"Astra\"}}\u003c/script>"
  },
  {
   "url": "https://findastra.github.io/ghost-protocol/",
   "slug": "ghost-protocol",
   "name": "Ghost Protocol",
   "repo": "ghost-protocol",
   "light": "yellow",
   "passed": 8,
   "total": 14,
   "checks": [
    {
     "id": "reachable",
     "level": "must",
     "label": "The page opens",
     "ok": true,
     "found": "HTTP 200",
     "fix": ""
    },
    {
     "id": "indexable",
     "level": "must",
     "label": "Search engines may list it (no noindex)",
     "ok": true,
     "found": "no robots tag",
     "fix": ""
    },
    {
     "id": "title-words",
     "level": "must",
     "label": "The title has the name in words",
     "ok": true,
     "found": "Ghost Protocol",
     "fix": ""
    },
    {
     "id": "title-slug",
     "level": "should",
     "label": "The title has the dashed name",
     "ok": false,
     "found": "Ghost Protocol",
     "fix": "Add \"(ghost-protocol)\" to the \u003ctitle>, so the name you type is in it too."
    },
    {
     "id": "title-length",
     "level": "should",
     "label": "The title is 10 to 65 characters",
     "ok": true,
     "found": "14 characters",
     "fix": ""
    },
    {
     "id": "description",
     "level": "must",
     "label": "It has a description (50 to 160 characters)",
     "ok": true,
     "found": "126 characters",
     "fix": ""
    },
    {
     "id": "one-h1",
     "level": "should",
     "label": "It has exactly one main heading (h1)",
     "ok": true,
     "found": "1 h1",
     "fix": ""
    },
    {
     "id": "canonical",
     "level": "should",
     "label": "It names its own address (canonical)",
     "ok": false,
     "found": "none",
     "fix": "Add \u003clink rel=\"canonical\" href=\"https://findastra.github.io/ghost-protocol/\">."
    },
    {
     "id": "lang",
     "level": "should",
     "label": "It says its language",
     "ok": true,
     "found": "yes",
     "fix": ""
    },
    {
     "id": "viewport",
     "level": "must",
     "label": "It fits phones (viewport)",
     "ok": true,
     "found": "width=device-width, initial-scale=1.0",
     "fix": ""
    },
    {
     "id": "og",
     "level": "should",
     "label": "It has a link preview (Open Graph)",
     "ok": false,
     "found": "missing og:title, og:description, og:url, og:image",
     "fix": "Add the Open Graph tags so shared links show a title, a line and a picture."
    },
    {
     "id": "twitter",
     "level": "should",
     "label": "It has a card for X and Discord previews",
     "ok": false,
     "found": "none",
     "fix": "Add \u003cmeta name=\"twitter:card\" content=\"summary_large_image\">."
    },
    {
     "id": "json-ld",
     "level": "should",
     "label": "It tells search engines what it is (structured data)",
     "ok": false,
     "found": "none",
     "fix": "Add a small JSON-LD block (schema.org WebSite or SoftwareApplication) with the name."
    },
    {
     "id": "in-sitemap",
     "level": "should",
     "label": "It is in the sitemap",
     "ok": false,
     "found": "there is no sitemap.xml yet",
     "fix": "Add it to sitemap.xml at the root of findastra.github.io."
    }
   ],
   "title": "Ghost Protocol",
   "description": "A free personal cybersecurity checklist, easiest fixes first and deep-cut steps last. Your progress stays in your own browser.",
   "head": "\u003ctitle>Ghost Protocol (ghost-protocol)\u003c/title>\n\u003clink rel=\"canonical\" href=\"https://findastra.github.io/ghost-protocol/\">\n\u003cmeta property=\"og:title\" content=\"Ghost Protocol (ghost-protocol)\">\n\u003cmeta property=\"og:description\" content=\"A free personal cybersecurity checklist, easiest fixes first and deep-cut steps last. Your progress stays in your own browser.\">\n\u003cmeta property=\"og:url\" content=\"https://findastra.github.io/ghost-protocol/\">\n\u003cmeta property=\"og:image\" content=\"[ADDRESS OF A 1200x630 PREVIEW PICTURE]\">\n\u003cmeta name=\"twitter:card\" content=\"summary_large_image\">\n\u003cscript type=\"application/ld+json\">{\"@context\":\"https://schema.org\",\"@type\":\"WebSite\",\"name\":\"Ghost Protocol\",\"alternateName\":\"ghost-protocol\",\"url\":\"https://findastra.github.io/ghost-protocol/\",\"author\":{\"@type\":\"Person\",\"name\":\"Astra\"}}\u003c/script>"
  },
  {
   "url": "https://findastra.github.io/papermon/",
   "slug": "papermon",
   "name": "Papermon",
   "repo": "papermon",
   "light": "yellow",
   "passed": 8,
   "total": 14,
   "checks": [
    {
     "id": "reachable",
     "level": "must",
     "label": "The page opens",
     "ok": true,
     "found": "HTTP 200",
     "fix": ""
    },
    {
     "id": "indexable",
     "level": "must",
     "label": "Search engines may list it (no noindex)",
     "ok": true,
     "found": "no robots tag",
     "fix": ""
    },
    {
     "id": "title-words",
     "level": "must",
     "label": "The title has the name in words",
     "ok": true,
     "found": "Papermon — Your daily science rabbit hole",
     "fix": ""
    },
    {
     "id": "title-slug",
     "level": "should",
     "label": "The title has the dashed name",
     "ok": true,
     "found": "Papermon — Your daily science rabbit hole",
     "fix": ""
    },
    {
     "id": "title-length",
     "level": "should",
     "label": "The title is 10 to 65 characters",
     "ok": true,
     "found": "41 characters",
     "fix": ""
    },
    {
     "id": "description",
     "level": "must",
     "label": "It has a description (50 to 160 characters)",
     "ok": true,
     "found": "102 characters",
     "fix": ""
    },
    {
     "id": "one-h1",
     "level": "should",
     "label": "It has exactly one main heading (h1)",
     "ok": false,
     "found": "0 h1",
     "fix": "Use one \u003ch1> with the name."
    },
    {
     "id": "canonical",
     "level": "should",
     "label": "It names its own address (canonical)",
     "ok": false,
     "found": "none",
     "fix": "Add \u003clink rel=\"canonical\" href=\"https://findastra.github.io/papermon/\">."
    },
    {
     "id": "lang",
     "level": "should",
     "label": "It says its language",
     "ok": true,
     "found": "yes",
     "fix": ""
    },
    {
     "id": "viewport",
     "level": "must",
     "label": "It fits phones (viewport)",
     "ok": true,
     "found": "width=device-width, initial-scale=1",
     "fix": ""
    },
    {
     "id": "og",
     "level": "should",
     "label": "It has a link preview (Open Graph)",
     "ok": false,
     "found": "missing og:title, og:description, og:url, og:image",
     "fix": "Add the Open Graph tags so shared links show a title, a line and a picture."
    },
    {
     "id": "twitter",
     "level": "should",
     "label": "It has a card for X and Discord previews",
     "ok": false,
     "found": "none",
     "fix": "Add \u003cmeta name=\"twitter:card\" content=\"summary_large_image\">."
    },
    {
     "id": "json-ld",
     "level": "should",
     "label": "It tells search engines what it is (structured data)",
     "ok": false,
     "found": "none",
     "fix": "Add a small JSON-LD block (schema.org WebSite or SoftwareApplication) with the name."
    },
    {
     "id": "in-sitemap",
     "level": "should",
     "label": "It is in the sitemap",
     "ok": false,
     "found": "there is no sitemap.xml yet",
     "fix": "Add it to sitemap.xml at the root of findastra.github.io."
    }
   ],
   "title": "Papermon — Your daily science rabbit hole",
   "description": "Discover real scientific papers, free plain-language explanations, and a little illustrated curiosity.",
   "head": "\u003clink rel=\"canonical\" href=\"https://findastra.github.io/papermon/\">\n\u003cmeta property=\"og:title\" content=\"Papermon (papermon)\">\n\u003cmeta property=\"og:description\" content=\"Discover real scientific papers, free plain-language explanations, and a little illustrated curiosity.\">\n\u003cmeta property=\"og:url\" content=\"https://findastra.github.io/papermon/\">\n\u003cmeta property=\"og:image\" content=\"[ADDRESS OF A 1200x630 PREVIEW PICTURE]\">\n\u003cmeta name=\"twitter:card\" content=\"summary_large_image\">\n\u003cscript type=\"application/ld+json\">{\"@context\":\"https://schema.org\",\"@type\":\"WebSite\",\"name\":\"Papermon\",\"alternateName\":\"papermon\",\"url\":\"https://findastra.github.io/papermon/\",\"author\":{\"@type\":\"Person\",\"name\":\"Astra\"}}\u003c/script>"
  },
  {
   "url": "https://findastra.github.io/fuzzboi-factory/",
   "slug": "fuzzboi-factory",
   "name": "Fuzzbois",
   "repo": "fuzzboi-factory",
   "light": "red",
   "passed": 5,
   "total": 14,
   "checks": [
    {
     "id": "reachable",
     "level": "must",
     "label": "The page opens",
     "ok": true,
     "found": "HTTP 200",
     "fix": ""
    },
    {
     "id": "indexable",
     "level": "must",
     "label": "Search engines may list it (no noindex)",
     "ok": true,
     "found": "no robots tag",
     "fix": ""
    },
    {
     "id": "title-words",
     "level": "must",
     "label": "The title has the name in words",
     "ok": true,
     "found": "Fuzzbois",
     "fix": ""
    },
    {
     "id": "title-slug",
     "level": "should",
     "label": "The title has the dashed name",
     "ok": false,
     "found": "Fuzzbois",
     "fix": "Add \"(fuzzboi-factory)\" to the \u003ctitle>, so the name you type is in it too."
    },
    {
     "id": "title-length",
     "level": "should",
     "label": "The title is 10 to 65 characters",
     "ok": false,
     "found": "8 characters",
     "fix": "Keep the title between 10 and 65 characters so it is not cut off in results."
    },
    {
     "id": "description",
     "level": "must",
     "label": "It has a description (50 to 160 characters)",
     "ok": false,
     "found": "none",
     "fix": "Add a one-sentence \u003cmeta name=\"description\">: what it is, in plain words."
    },
    {
     "id": "one-h1",
     "level": "should",
     "label": "It has exactly one main heading (h1)",
     "ok": false,
     "found": "0 h1",
     "fix": "Use one \u003ch1> with the name."
    },
    {
     "id": "canonical",
     "level": "should",
     "label": "It names its own address (canonical)",
     "ok": false,
     "found": "none",
     "fix": "Add \u003clink rel=\"canonical\" href=\"https://findastra.github.io/fuzzboi-factory/\">."
    },
    {
     "id": "lang",
     "level": "should",
     "label": "It says its language",
     "ok": true,
     "found": "yes",
     "fix": ""
    },
    {
     "id": "viewport",
     "level": "must",
     "label": "It fits phones (viewport)",
     "ok": true,
     "found": "width=device-width,initial-scale=1",
     "fix": ""
    },
    {
     "id": "og",
     "level": "should",
     "label": "It has a link preview (Open Graph)",
     "ok": false,
     "found": "missing og:title, og:description, og:url, og:image",
     "fix": "Add the Open Graph tags so shared links show a title, a line and a picture."
    },
    {
     "id": "twitter",
     "level": "should",
     "label": "It has a card for X and Discord previews",
     "ok": false,
     "found": "none",
     "fix": "Add \u003cmeta name=\"twitter:card\" content=\"summary_large_image\">."
    },
    {
     "id": "json-ld",
     "level": "should",
     "label": "It tells search engines what it is (structured data)",
     "ok": false,
     "found": "none",
     "fix": "Add a small JSON-LD block (schema.org WebSite or SoftwareApplication) with the name."
    },
    {
     "id": "in-sitemap",
     "level": "should",
     "label": "It is in the sitemap",
     "ok": false,
     "found": "there is no sitemap.xml yet",
     "fix": "Add it to sitemap.xml at the root of findastra.github.io."
    }
   ],
   "title": "Fuzzbois",
   "description": "",
   "head": "\u003ctitle>Fuzzbois (fuzzboi-factory)\u003c/title>\n\u003cmeta name=\"description\" content=\"[ONE SENTENCE BY ASTRA: what Fuzzbois is, 50 to 160 characters]\">\n\u003clink rel=\"canonical\" href=\"https://findastra.github.io/fuzzboi-factory/\">\n\u003cmeta property=\"og:title\" content=\"Fuzzbois (fuzzboi-factory)\">\n\u003cmeta property=\"og:description\" content=\"[ONE SENTENCE BY ASTRA: what Fuzzbois is, 50 to 160 characters]\">\n\u003cmeta property=\"og:url\" content=\"https://findastra.github.io/fuzzboi-factory/\">\n\u003cmeta property=\"og:image\" content=\"[ADDRESS OF A 1200x630 PREVIEW PICTURE]\">\n\u003cmeta name=\"twitter:card\" content=\"summary_large_image\">\n\u003cscript type=\"application/ld+json\">{\"@context\":\"https://schema.org\",\"@type\":\"WebSite\",\"name\":\"Fuzzbois\",\"alternateName\":\"fuzzboi-factory\",\"url\":\"https://findastra.github.io/fuzzboi-factory/\",\"author\":{\"@type\":\"Person\",\"name\":\"Astra\"}}\u003c/script>"
  },
  {
   "url": "https://findastra.github.io/pocket-message-board/",
   "slug": "pocket-message-board",
   "name": "Pocket Message Board",
   "repo": "pocket-message-board",
   "light": "red",
   "passed": 7,
   "total": 14,
   "checks": [
    {
     "id": "reachable",
     "level": "must",
     "label": "The page opens",
     "ok": true,
     "found": "HTTP 200",
     "fix": ""
    },
    {
     "id": "indexable",
     "level": "must",
     "label": "Search engines may list it (no noindex)",
     "ok": true,
     "found": "no robots tag",
     "fix": ""
    },
    {
     "id": "title-words",
     "level": "must",
     "label": "The title has the name in words",
     "ok": true,
     "found": "Pocket Message Board",
     "fix": ""
    },
    {
     "id": "title-slug",
     "level": "should",
     "label": "The title has the dashed name",
     "ok": false,
     "found": "Pocket Message Board",
     "fix": "Add \"(pocket-message-board)\" to the \u003ctitle>, so the name you type is in it too."
    },
    {
     "id": "title-length",
     "level": "should",
     "label": "The title is 10 to 65 characters",
     "ok": true,
     "found": "20 characters",
     "fix": ""
    },
    {
     "id": "description",
     "level": "must",
     "label": "It has a description (50 to 160 characters)",
     "ok": false,
     "found": "162 characters",
     "fix": "Add a one-sentence \u003cmeta name=\"description\">: what it is, in plain words."
    },
    {
     "id": "one-h1",
     "level": "should",
     "label": "It has exactly one main heading (h1)",
     "ok": true,
     "found": "1 h1",
     "fix": ""
    },
    {
     "id": "canonical",
     "level": "should",
     "label": "It names its own address (canonical)",
     "ok": false,
     "found": "none",
     "fix": "Add \u003clink rel=\"canonical\" href=\"https://findastra.github.io/pocket-message-board/\">."
    },
    {
     "id": "lang",
     "level": "should",
     "label": "It says its language",
     "ok": true,
     "found": "yes",
     "fix": ""
    },
    {
     "id": "viewport",
     "level": "must",
     "label": "It fits phones (viewport)",
     "ok": true,
     "found": "width=device-width, initial-scale=1, viewport-fit=cover",
     "fix": ""
    },
    {
     "id": "og",
     "level": "should",
     "label": "It has a link preview (Open Graph)",
     "ok": false,
     "found": "missing og:title, og:description, og:url, og:image",
     "fix": "Add the Open Graph tags so shared links show a title, a line and a picture."
    },
    {
     "id": "twitter",
     "level": "should",
     "label": "It has a card for X and Discord previews",
     "ok": false,
     "found": "none",
     "fix": "Add \u003cmeta name=\"twitter:card\" content=\"summary_large_image\">."
    },
    {
     "id": "json-ld",
     "level": "should",
     "label": "It tells search engines what it is (structured data)",
     "ok": false,
     "found": "none",
     "fix": "Add a small JSON-LD block (schema.org WebSite or SoftwareApplication) with the name."
    },
    {
     "id": "in-sitemap",
     "level": "should",
     "label": "It is in the sitemap",
     "ok": false,
     "found": "there is no sitemap.xml yet",
     "fix": "Add it to sitemap.xml at the root of findastra.github.io."
    }
   ],
   "title": "Pocket Message Board",
   "description": "A scrolling LED sign for any screen: neon green board, big black letters you can read from the street. Fills a phone, tablet or computer window and turns with it.",
   "head": "\u003ctitle>Pocket Message Board (pocket-message-board)\u003c/title>\n\u003cmeta name=\"description\" content=\"A scrolling LED sign for any screen: neon green board, big black letters you can read from the street. Fills a phone, tablet or computer window and turns with it.\">\n\u003clink rel=\"canonical\" href=\"https://findastra.github.io/pocket-message-board/\">\n\u003cmeta property=\"og:title\" content=\"Pocket Message Board (pocket-message-board)\">\n\u003cmeta property=\"og:description\" content=\"A scrolling LED sign for any screen: neon green board, big black letters you can read from the street. Fills a phone, tablet or computer window and turns with it.\">\n\u003cmeta property=\"og:url\" content=\"https://findastra.github.io/pocket-message-board/\">\n\u003cmeta property=\"og:image\" content=\"[ADDRESS OF A 1200x630 PREVIEW PICTURE]\">\n\u003cmeta name=\"twitter:card\" content=\"summary_large_image\">\n\u003cscript type=\"application/ld+json\">{\"@context\":\"https://schema.org\",\"@type\":\"WebSite\",\"name\":\"Pocket Message Board\",\"alternateName\":\"pocket-message-board\",\"url\":\"https://findastra.github.io/pocket-message-board/\",\"author\":{\"@type\":\"Person\",\"name\":\"Astra\"}}\u003c/script>"
  },
  {
   "url": "https://findastra.github.io/spoonfed/",
   "slug": "spoonfed",
   "name": "Spoonfed",
   "repo": "spoonfed",
   "light": "red",
   "passed": 6,
   "total": 14,
   "checks": [
    {
     "id": "reachable",
     "level": "must",
     "label": "The page opens",
     "ok": true,
     "found": "HTTP 200",
     "fix": ""
    },
    {
     "id": "indexable",
     "level": "must",
     "label": "Search engines may list it (no noindex)",
     "ok": true,
     "found": "no robots tag",
     "fix": ""
    },
    {
     "id": "title-words",
     "level": "must",
     "label": "The title has the name in words",
     "ok": true,
     "found": "Spoonfed",
     "fix": ""
    },
    {
     "id": "title-slug",
     "level": "should",
     "label": "The title has the dashed name",
     "ok": true,
     "found": "Spoonfed",
     "fix": ""
    },
    {
     "id": "title-length",
     "level": "should",
     "label": "The title is 10 to 65 characters",
     "ok": false,
     "found": "8 characters",
     "fix": "Keep the title between 10 and 65 characters so it is not cut off in results."
    },
    {
     "id": "description",
     "level": "must",
     "label": "It has a description (50 to 160 characters)",
     "ok": false,
     "found": "42 characters",
     "fix": "Add a one-sentence \u003cmeta name=\"description\">: what it is, in plain words."
    },
    {
     "id": "one-h1",
     "level": "should",
     "label": "It has exactly one main heading (h1)",
     "ok": false,
     "found": "0 h1",
     "fix": "Use one \u003ch1> with the name."
    },
    {
     "id": "canonical",
     "level": "should",
     "label": "It names its own address (canonical)",
     "ok": false,
     "found": "none",
     "fix": "Add \u003clink rel=\"canonical\" href=\"https://findastra.github.io/spoonfed/\">."
    },
    {
     "id": "lang",
     "level": "should",
     "label": "It says its language",
     "ok": true,
     "found": "yes",
     "fix": ""
    },
    {
     "id": "viewport",
     "level": "must",
     "label": "It fits phones (viewport)",
     "ok": true,
     "found": "width=device-width, initial-scale=1, shrink-to-fit=no",
     "fix": ""
    },
    {
     "id": "og",
     "level": "should",
     "label": "It has a link preview (Open Graph)",
     "ok": false,
     "found": "missing og:title, og:description, og:url, og:image",
     "fix": "Add the Open Graph tags so shared links show a title, a line and a picture."
    },
    {
     "id": "twitter",
     "level": "should",
     "label": "It has a card for X and Discord previews",
     "ok": false,
     "found": "none",
     "fix": "Add \u003cmeta name=\"twitter:card\" content=\"summary_large_image\">."
    },
    {
     "id": "json-ld",
     "level": "should",
     "label": "It tells search engines what it is (structured data)",
     "ok": false,
     "found": "none",
     "fix": "Add a small JSON-LD block (schema.org WebSite or SoftwareApplication) with the name."
    },
    {
     "id": "in-sitemap",
     "level": "should",
     "label": "It is in the sitemap",
     "ok": false,
     "found": "there is no sitemap.xml yet",
     "fix": "Add it to sitemap.xml at the root of findastra.github.io."
    }
   ],
   "title": "Spoonfed",
   "description": "A little less deciding. A lot more eating.",
   "head": "\u003ctitle>Spoonfed (spoonfed)\u003c/title>\n\u003cmeta name=\"description\" content=\"[ONE SENTENCE BY ASTRA: what Spoonfed is, 50 to 160 characters]\">\n\u003clink rel=\"canonical\" href=\"https://findastra.github.io/spoonfed/\">\n\u003cmeta property=\"og:title\" content=\"Spoonfed (spoonfed)\">\n\u003cmeta property=\"og:description\" content=\"[ONE SENTENCE BY ASTRA: what Spoonfed is, 50 to 160 characters]\">\n\u003cmeta property=\"og:url\" content=\"https://findastra.github.io/spoonfed/\">\n\u003cmeta property=\"og:image\" content=\"[ADDRESS OF A 1200x630 PREVIEW PICTURE]\">\n\u003cmeta name=\"twitter:card\" content=\"summary_large_image\">\n\u003cscript type=\"application/ld+json\">{\"@context\":\"https://schema.org\",\"@type\":\"WebSite\",\"name\":\"Spoonfed\",\"alternateName\":\"spoonfed\",\"url\":\"https://findastra.github.io/spoonfed/\",\"author\":{\"@type\":\"Person\",\"name\":\"Astra\"}}\u003c/script>"
  },
  {
   "url": "https://findastra.github.io/openai-discord-presence/",
   "slug": "openai-discord-presence",
   "name": "OpenAI Discord Presence",
   "repo": "openai-discord-presence",
   "note": "Its page says it moved.",
   "light": "red",
   "passed": 7,
   "total": 14,
   "checks": [
    {
     "id": "reachable",
     "level": "must",
     "label": "The page opens",
     "ok": true,
     "found": "HTTP 200",
     "fix": ""
    },
    {
     "id": "indexable",
     "level": "must",
     "label": "Search engines may list it (no noindex)",
     "ok": true,
     "found": "no robots tag",
     "fix": ""
    },
    {
     "id": "title-words",
     "level": "must",
     "label": "The title has the name in words",
     "ok": true,
     "found": "OpenAI Discord Presence moved",
     "fix": ""
    },
    {
     "id": "title-slug",
     "level": "should",
     "label": "The title has the dashed name",
     "ok": false,
     "found": "OpenAI Discord Presence moved",
     "fix": "Add \"(openai-discord-presence)\" to the \u003ctitle>, so the name you type is in it too."
    },
    {
     "id": "title-length",
     "level": "should",
     "label": "The title is 10 to 65 characters",
     "ok": true,
     "found": "29 characters",
     "fix": ""
    },
    {
     "id": "description",
     "level": "must",
     "label": "It has a description (50 to 160 characters)",
     "ok": false,
     "found": "none",
     "fix": "Add a one-sentence \u003cmeta name=\"description\">: what it is, in plain words."
    },
    {
     "id": "one-h1",
     "level": "should",
     "label": "It has exactly one main heading (h1)",
     "ok": true,
     "found": "1 h1",
     "fix": ""
    },
    {
     "id": "canonical",
     "level": "should",
     "label": "It names its own address (canonical)",
     "ok": false,
     "found": "https://github.com/findastra/ai-discord-presence",
     "fix": "Add \u003clink rel=\"canonical\" href=\"https://findastra.github.io/openai-discord-presence/\">."
    },
    {
     "id": "lang",
     "level": "should",
     "label": "It says its language",
     "ok": true,
     "found": "yes",
     "fix": ""
    },
    {
     "id": "viewport",
     "level": "must",
     "label": "It fits phones (viewport)",
     "ok": true,
     "found": "width=device-width,initial-scale=1",
     "fix": ""
    },
    {
     "id": "og",
     "level": "should",
     "label": "It has a link preview (Open Graph)",
     "ok": false,
     "found": "missing og:title, og:description, og:url, og:image",
     "fix": "Add the Open Graph tags so shared links show a title, a line and a picture."
    },
    {
     "id": "twitter",
     "level": "should",
     "label": "It has a card for X and Discord previews",
     "ok": false,
     "found": "none",
     "fix": "Add \u003cmeta name=\"twitter:card\" content=\"summary_large_image\">."
    },
    {
     "id": "json-ld",
     "level": "should",
     "label": "It tells search engines what it is (structured data)",
     "ok": false,
     "found": "none",
     "fix": "Add a small JSON-LD block (schema.org WebSite or SoftwareApplication) with the name."
    },
    {
     "id": "in-sitemap",
     "level": "should",
     "label": "It is in the sitemap",
     "ok": false,
     "found": "there is no sitemap.xml yet",
     "fix": "Add it to sitemap.xml at the root of findastra.github.io."
    }
   ],
   "title": "OpenAI Discord Presence moved",
   "description": "",
   "head": "\u003ctitle>OpenAI Discord Presence (openai-discord-presence)\u003c/title>\n\u003cmeta name=\"description\" content=\"[ONE SENTENCE BY ASTRA: what OpenAI Discord Presence is, 50 to 160 characters]\">\n\u003clink rel=\"canonical\" href=\"https://findastra.github.io/openai-discord-presence/\">\n\u003cmeta property=\"og:title\" content=\"OpenAI Discord Presence (openai-discord-presence)\">\n\u003cmeta property=\"og:description\" content=\"[ONE SENTENCE BY ASTRA: what OpenAI Discord Presence is, 50 to 160 characters]\">\n\u003cmeta property=\"og:url\" content=\"https://findastra.github.io/openai-discord-presence/\">\n\u003cmeta property=\"og:image\" content=\"[ADDRESS OF A 1200x630 PREVIEW PICTURE]\">\n\u003cmeta name=\"twitter:card\" content=\"summary_large_image\">\n\u003cscript type=\"application/ld+json\">{\"@context\":\"https://schema.org\",\"@type\":\"WebSite\",\"name\":\"OpenAI Discord Presence\",\"alternateName\":\"openai-discord-presence\",\"url\":\"https://findastra.github.io/openai-discord-presence/\",\"author\":{\"@type\":\"Person\",\"name\":\"Astra\"}}\u003c/script>"
  }
 ]
};
