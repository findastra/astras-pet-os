// seo-toolkit's checks: a native tool of Iced Out Iceberg (Portfolio Puffer). Plain code, no AI, no network: it reads
// one page's HTML and says what a search engine needs that the page is missing, then writes the missing head tags.
// The same file runs in the toolkit page (double-click or hosted) and in Node (scripts/portfolio-puffer-seo-sweep).
// Astra, 2026-11-20: "I want you to be able to just search them up by their title, especially just using their
// dashes"; "I think this just needs to be a portfolio [puffer] job". Search engines read a dash as a space, so a title
// carries both forms: "Liminal Doors (liminal-doors)". Claude Opus 5.5 (claude-opus-5-5), 2026-11-20.
(function (root, make) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = make();
  else root.SeoCheck = make();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var decode = function (s) {
    return String(s || '')
      .replace(/&quot;/g, '"').replace(/&#39;|&apos;|&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  };
  var esc = function (s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  // The <head> tags, read with patterns rather than a DOM so the browser and Node agree exactly.
  function attrs(tag) {
    var out = {}; var re = /([a-zA-Z:-]+)\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/g; var m;
    while ((m = re.exec(tag))) out[m[1].toLowerCase()] = decode(m[3] != null ? m[3] : m[4] != null ? m[4] : m[5]);
    return out;
  }
  function metas(html) {
    return (html.match(/<meta\b[^>]*>/gi) || []).map(attrs);
  }
  function meta(html, key, value) {
    var hit = metas(html).find(function (a) { return (a[key] || '').toLowerCase() === value; });
    return hit ? (hit.content || '') : null;
  }
  function links(html, rel) {
    return (html.match(/<link\b[^>]*>/gi) || []).map(attrs).filter(function (a) {
      return (a.rel || '').toLowerCase().split(/\s+/).indexOf(rel) !== -1;
    });
  }
  function title(html) {
    var m = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
    return m ? decode(m[1].replace(/<[^>]+>/g, '')) : '';
  }

  // Words: lower case, apostrophes dropped, dashes and punctuation read as spaces (as search engines read them).
  var words = function (s) {
    return decode(s).toLowerCase().replace(/['’]/g, '').split(/[^a-z0-9]+/).filter(Boolean);
  };
  function hasWords(text, name) {
    var have = ' ' + words(text).join(' ') + ' ';
    var want = words(name).join(' ');
    return !!want && have.indexOf(' ' + want + ' ') !== -1;
  }
  function hasSlug(text, slug) {
    var t = String(text || '').toLowerCase(); var s = String(slug || '').toLowerCase(); var i = t.indexOf(s);
    while (s && i !== -1) {
      var before = i === 0 ? '' : t[i - 1]; var after = t[i + s.length] || '';
      if (!/[a-z0-9-]/.test(before) && !/[a-z0-9-]/.test(after)) return true;
      i = t.indexOf(s, i + 1);
    }
    return false;
  }

  // Each check: must (red when it fails) or should (yellow). `fix` says what to do in plain words.
  function checkPage(html, page, fetched) {
    var checks = [];
    var add = function (id, level, label, ok, found, fix) {
      checks.push({ id: id, level: level, label: label, ok: !!ok, found: found == null ? '' : String(found), fix: ok ? '' : fix });
    };
    if (typeof html !== 'string' || !html) {
      add('reachable', 'must', 'The page opens', false, 'HTTP ' + ((fetched && fetched.status) || 'no answer'),
        'Check that GitHub Pages is on for this repo and the address is right.');
      return finish(checks);
    }
    add('reachable', 'must', 'The page opens', true, 'HTTP ' + ((fetched && fetched.status) || 200), '');
    var robots = (meta(html, 'name', 'robots') || '') + ' ' + (meta(html, 'name', 'googlebot') || '');
    add('indexable', 'must', 'Search engines may list it (no noindex)', !/noindex/i.test(robots), robots.trim() || 'no robots tag',
      'Remove "noindex" from the robots meta tag.');
    var t = title(html);
    add('title-words', 'must', 'The title has the name in words', hasWords(t, page.name), t || 'no title',
      'Put "' + page.name + '" in the <title>.');
    add('title-slug', 'should', 'The title has the dashed name', hasSlug(t, page.slug), t || 'no title',
      'Add "(' + page.slug + ')" to the <title>, so the name you type is in it too.');
    add('title-length', 'should', 'The title is 10 to 65 characters', t.length >= 10 && t.length <= 65, t.length + ' characters',
      'Keep the title between 10 and 65 characters so it is not cut off in results.');
    var d = meta(html, 'name', 'description');
    add('description', 'must', 'It has a description (50 to 160 characters)', d && d.length >= 50 && d.length <= 160,
      d ? d.length + ' characters' : 'none', 'Add a one-sentence <meta name="description">: what it is, in plain words.');
    var h1 = (html.match(/<h1\b/gi) || []).length;
    add('one-h1', 'should', 'It has exactly one main heading (h1)', h1 === 1, h1 + ' h1', 'Use one <h1> with the name.');
    var canon = links(html, 'canonical')[0];
    add('canonical', 'should', 'It names its own address (canonical)', canon && canon.href === page.url, canon ? canon.href : 'none',
      'Add <link rel="canonical" href="' + page.url + '">.');
    var lang = /<html\b[^>]*\blang\s*=/i.test(html);
    add('lang', 'should', 'It says its language', lang, lang ? 'yes' : 'no', 'Add lang="en" to the <html> tag.');
    var vp = meta(html, 'name', 'viewport');
    add('viewport', 'must', 'It fits phones (viewport)', !!vp, vp || 'none', 'Add <meta name="viewport" content="width=device-width,initial-scale=1">.');
    var og = ['og:title', 'og:description', 'og:url', 'og:image'].filter(function (k) { return !meta(html, 'property', k); });
    add('og', 'should', 'It has a link preview (Open Graph)', og.length === 0, og.length ? 'missing ' + og.join(', ') : 'all four',
      'Add the Open Graph tags so shared links show a title, a line and a picture.');
    var tw = meta(html, 'name', 'twitter:card');
    add('twitter', 'should', 'It has a card for X and Discord previews', !!tw, tw || 'none', 'Add <meta name="twitter:card" content="summary_large_image">.');
    var ld = /<script\b[^>]*type\s*=\s*["']application\/ld\+json["']/i.test(html);
    add('json-ld', 'should', 'It tells search engines what it is (structured data)', ld, ld ? 'yes' : 'none',
      'Add a small JSON-LD block (schema.org WebSite or SoftwareApplication) with the name.');
    return finish(checks, { title: t, description: d || '' });
  }
  function finish(checks, extra) {
    var bad = checks.filter(function (c) { return !c.ok; });
    var light = bad.some(function (c) { return c.level === 'must'; }) ? 'red' : bad.length ? 'yellow' : 'green';
    var out = { light: light, passed: checks.length - bad.length, total: checks.length, checks: checks };
    if (extra) { out.title = extra.title; out.description = extra.description; }
    return out;
  }

  // The tags to paste into <head> for what failed. The description is Astra's words: never made up here.
  function suggestHead(page, result) {
    var failed = {}; (result.checks || []).forEach(function (c) { if (!c.ok) failed[c.id] = true; });
    var full = page.name + ' (' + page.slug + ')';
    var desc = result.description && result.description.length >= 50 ? result.description
      : '[ONE SENTENCE BY ASTRA: what ' + page.name + ' is, 50 to 160 characters]';
    var out = [];
    if (failed['title-words'] || failed['title-slug'] || failed['title-length']) out.push('<title>' + esc(full) + '</title>');
    if (failed.description) out.push('<meta name="description" content="' + esc(desc) + '">');
    if (failed.viewport) out.push('<meta name="viewport" content="width=device-width,initial-scale=1">');
    if (failed.canonical) out.push('<link rel="canonical" href="' + esc(page.url) + '">');
    if (failed.og) {
      out.push('<meta property="og:title" content="' + esc(full) + '">');
      out.push('<meta property="og:description" content="' + esc(desc) + '">');
      out.push('<meta property="og:url" content="' + esc(page.url) + '">');
      out.push('<meta property="og:image" content="' + esc(page.image || '[ADDRESS OF A 1200x630 PREVIEW PICTURE]') + '">');
    }
    if (failed.twitter) out.push('<meta name="twitter:card" content="summary_large_image">');
    if (failed['json-ld']) {
      out.push('<script type="application/ld+json">' + JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebSite',
        name: page.name, alternateName: page.slug, url: page.url, author: { '@type': 'Person', name: 'Astra' } })
        .replace(/</g, '\\u003c') + '</script>');
    }
    if (failed.lang) out.push('<!-- and on the <html> tag: lang="en" -->');
    if (failed.indexable) out.push('<!-- remove "noindex" from the robots meta tag -->');
    return out.join('\n');
  }

  function sitemapXml(urls, date) {
    var seen = {}; var list = urls.filter(function (u) { return !seen[u] && (seen[u] = true); });
    return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      list.map(function (u) { return '  <url><loc>' + esc(u) + '</loc>' + (date ? '<lastmod>' + date + '</lastmod>' : '') + '</url>'; }).join('\n') +
      '\n</urlset>\n';
  }
  function robotsTxt(sitemapUrl) {
    return 'User-agent: *\nAllow: /\nSitemap: ' + sitemapUrl + '\n';
  }

  return { checkPage: checkPage, suggestHead: suggestHead, sitemapXml: sitemapXml, robotsTxt: robotsTxt,
    hasWords: hasWords, hasSlug: hasSlug, title: title, version: 'v1.0' };
});
