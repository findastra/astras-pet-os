// The Flash Audit's page checks, lined up with the Model Pet Program (Astra, 2026-11-12: "when we do audits and we're
// looking at user interface, that we're auditing it based off of what's on the template, and then those are items on
// the Flash audit"). Every part of the template (apps/pet-programs/model-pet-program-20261102.html) is one check in
// docs/flash-audit-20261014.md, section 3, "6. The page", in the order it sits on the page. Each check compares that part
// of a pet program page with the same part of the template as the spawner built it. What a part must match is read
// from the template itself wherever it can be (how it folds, its More details lines, its headings, its moods, its
// lights), so a change to the template changes what the audit asks for at the next build.
// Node's built-in modules only. Claude Opus 5.5 (claude-opus-5-5), 2026-11-12.

/** The template's parts, top to bottom, each with its Flash Audit check. */
export const TEMPLATE_PARTS = [
  { check: 'A52', part: 'editorial-status-panel', name: 'editorial status panel' },
  { check: 'A62', part: 'cyberhome-panel', name: 'cyberhome' },
  { check: 'A63', part: 'title', name: 'title and version' },
  { check: 'A64', part: 'quick-summary-panel', name: 'quick summary' },
  { check: 'A60', part: 'system-map-panel', name: 'System Map box' },
  { check: 'A65', part: 'intelligence-levels-panel', name: 'intelligence levels' },
  { check: 'A66', part: 'L1-control-panel', name: 'L1 control panel' },
  { check: 'A67', part: 'L2-control-panel', name: 'L2 control panel' },
  { check: 'A68', part: 'L3-control-panel', name: 'L3 control panel' },
  { check: 'A69', part: 'L4-control-panel', name: 'L4 control panel' },
  { check: 'A70', part: 'rwx-panel', name: 'R W X panel' },
  { check: 'A71', part: 'session-notes-panel', name: 'session notes' },
  { check: 'A49', part: 'emotions-panel', name: 'emotions' },
  { check: 'A41', part: 'clicker-training-panel', name: 'clicker training' },
  { check: 'A39', part: 'friends-list-panel', name: 'friends list' },
  { check: 'A51', part: 'unified-footer-panel', name: 'unified footer' },
  { check: 'A22', part: 'chat-panel', name: 'chat' },
];
// The checks about the whole page: every part in the template's order, every item a pill like the template's, every
// pair of lights one the template shows, and Data Chip's phone on Data Dealer's page only.
export const ORDER_CHECK = 'A47';
export const PAGE_CHECKS = [{ check: 'A44', name: 'Data Chip’s phone' }, { check: 'A46', name: 'pills' }, { check: 'A48', name: 'paired lights' }];
export const TEMPLATE_CHECKS = [ORDER_CHECK, ...TEMPLATE_PARTS.map((p) => p.check), ...PAGE_CHECKS.map((p) => p.check)];
// The three tricks every pet has in L2 (PET-PROGRAM-FRAMEWORK.md section 3, item 4; 2026-11-03, Flash Audit deck, answer 4).
export const EVERY_PET_TRICKS = ['self-audit', 'play-with', 'care-for'];
// The one page with Data Chip's phone (2026-11-03, Flash Audit deck, answer 2).
export const PHONE_PAGE = 'data-dealer';

const PART_IDS = TEMPLATE_PARTS.map((p) => p.part);
const partOfLabel = (label) => PART_IDS.filter((p) => label === p || label.endsWith(`-${p}`)).sort((a, b) => b.length - a.length)[0] || null;

/** Where the element that starts at `at` ends, counting its own tag (a tool panel holds other details). */
export function closeOf(html, at, tag) {
  const re = new RegExp(`<${tag}[\\s>]|</${tag}>`, 'g');
  re.lastIndex = at;
  let depth = 0;
  for (let m = re.exec(html); m; m = re.exec(html)) {
    depth += m[0][1] === '/' ? -1 : 1;
    if (!depth) return m.index + m[0].length;
  }
  return html.length;
}

/** A page's parts, top to bottom: { label, part, staysOpen, foldArrow, own } (`own` leaves out the panels inside it). */
export function pageParts(html) {
  const parts = [];
  for (const m of html.matchAll(/<details class="panel([^"]*)"([^>]*)><summary([^>]*)><span class="legend">([^<]+)<\/span><\/summary>/g)) {
    parts.push({ label: m[4], at: m.index, end: closeOf(html, m.index, 'details'), staysOpen: /data-stays-open/.test(m[2]), foldArrow: !/tabindex="-1"/.test(m[3]) });
  }
  const h1 = html.indexOf('<h1>');
  if (h1 >= 0) parts.push({ label: 'title', at: h1, end: html.indexOf('</h1>', h1) + 5, staysOpen: true, foldArrow: false });
  const chat = /<aside class="chat(?: [^"]*)?"[^>]*><span class="chat-label">([^<]+)<\/span>/.exec(html);
  if (chat) parts.push({ label: chat[1], at: chat.index, end: closeOf(html, chat.index, 'aside'), staysOpen: true, foldArrow: false });
  parts.sort((a, b) => a.at - b.at);
  for (const p of parts) {
    p.part = partOfLabel(p.label);
    let own = '', from = p.at;
    for (const q of parts) if (q !== p && q.at >= from && q.end <= p.end) { own += html.slice(from, q.at); from = q.end; }
    p.own = own + html.slice(from, p.end);
  }
  return parts;
}

// What the checks read inside a part.
const all = (re, s) => [...s.matchAll(re)].map((m) => m[1]);
/** The lines of a part's own More details (the last one in it: a tool box inside keeps its own paragraph). */
export function aboutLines(own) {
  const at = own.lastIndexOf('<details class="about">');
  return at < 0 ? [] : all(/<dt>([^<]+)<\/dt>/g, own.slice(at, closeOf(own, at, 'details')));
}
const headings = (own) => all(/<section><h3>([^<]+)<\/h3>/g, own).map((h) => { const m = /^(.*?) · (\d+)$/.exec(h); return { name: m ? m[1] : h, count: m ? Number(m[2]) : null }; });
const itemNames = (own) => all(/<span class="item-name">([^<]+)<\/span>/g, own);
const toolboxNames = (own) => all(/class="(?:toolbox-fold )?toolbox-name"[^>]*>([^<]+)</g, own);
/** Each pair of lights as a shape: which lights, and whether each has its name for a screen reader and its tooltip. */
export function lightShapes(html) {
  const groups = all(/<span class="lights">((?:<button[^>]*><\/button>|<span[^>]*><\/span>)*)<\/span>/g, html);
  const odd = (html.match(/<span class="lights">/g) || []).length - groups.length;
  return [...groups.map((g) => all(/<((?:button|span)[^>]*)>/g, g).map((a) => `${a.startsWith('button') ? 'button' : 'mark'} ${(/class="light ([a-z]+)/.exec(a) || [])[1] || '?'}${/aria-label="[^"]+"/.test(a) ? ' named' : ''}${/title="[^"]+"/.test(a) ? ' tooltip' : ''}`).join(' + ')),
    ...Array(Math.max(0, odd)).fill('something else')];
}
/** Each pill's shape: its lights, its name, its one line, and no app icon before its name (A46). */
export function pillShapes(html) {
  const out = [];
  for (const m of html.matchAll(/<li class="pill[^"]*"[^>]*>/g)) {
    const li = html.slice(m.index, closeOf(html, m.index, 'li'));
    const name = li.indexOf('class="item-name"');
    out.push([li.includes('<span class="lights">') ? 'lights' : 'no lights', name >= 0 ? 'name' : 'no name', li.includes('class="item-desc"') ? 'one line' : 'no line',
      name > 0 && li.slice(0, name).includes('<img') ? 'an icon' : 'no icon'].join(', '));
  }
  return out;
}
const list = (a) => (a.length ? a.map((x) => `“${x}”`).join(', ') : 'nothing');
const same = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);

// What each part must show, beyond what every part shares (how it folds, its fold arrow, its More details lines).
// `p` is the page's part, `t` the template's, `ctx` { slug, tslug, html, liveCheck }. Each returns the problems found:
// a sentence when the part differs (Incorrect), { missing } when something in it is not there yet (Missing).
const RULES = {
  'editorial-status-panel': (p, t, ctx) => [
    !p.own.includes('<p class="working-copy">Working copy: not the live site.</p>') && 'its first line is not “Working copy: not the live site.”',
    ctx.liveCheck && !ctx.html.includes(ctx.liveCheck) && 'the live site does not hide it: the page lacks the template’s check in <head>',
  ],
  'cyberhome-panel': (p, t, ctx) => [
    !p.own.includes(`<span class="render-name">${ctx.slug}-cyberhome</span>`) && `no ${ctx.slug}-cyberhome tool inside it`,
    !/<img class="pet[^"]*"[^>]* src="[^"]+"/.test(p.own) && 'no picture of the pet in it',
  ],
  title: (p) => {
    const name = (/<span class="title-name">([^<]*)<\/span>/.exec(p.own) || [])[1];
    const version = (/<span class="version"[^>]*>([^<]*)<\/span>/.exec(p.own) || [])[1];
    return [!name?.trim() && 'no pet program name', !/^v\d+\.\d+\.\d+ \/\/ (\d{8}|YYYYMMDD)$/.test(version || '') && `the version reads ${list([version || ''])}, not v<major.minor.patch> // <YYYYMMDD>`];
  },
  'quick-summary-panel': (p) => [!/<p>[^<]*\S[^<]*<\/p>/.test(p.own) && 'no sentence on what the pet program does', /<button|class="button"/.test(p.own) && 'buttons under the summary (crossed out 2026-10-21)'],
  'system-map-panel': (p, t, ctx) => [
    !p.own.includes(`<span class="render-name">${ctx.slug}-system-map</span>`) && `no ${ctx.slug}-system-map tool inside it`,
    !/href="\.\.\/\.\.\/system-map-20261012\.html#node=[^"]+"/.test(p.own) && 'it does not open the System Map on the pet program’s node',
  ],
  'intelligence-levels-panel': (p, t) => {
    const keys = (s) => all(/<span class="key ([a-z]+)"><\/span>/g, s);
    return [!same(keys(p.own), keys(t.own)) && `its key to the lights shows ${list(keys(p.own))}; the template’s shows ${list(keys(t.own))}`];
  },
  'L1-control-panel': (p, t) => {
    const names = new Set(headings(t.own).map((h) => h.name));
    return headings(p.own).flatMap((h) => [h.count === null && `the heading “${h.name}” has no count`,
      !names.has(h.name) && !/^[A-Z][a-z]+ tools$/.test(h.name) && `the heading “${h.name}” is not one of the template’s (${list([...names])}, or the tools’ sides)`]);
  },
  'L2-control-panel': (p, t) => {
    const names = new Set(headings(t.own).map((h) => h.name)), have = itemNames(p.own);
    return [...headings(p.own).flatMap((h) => [h.count === null && `the heading “${h.name}” has no count`, !names.has(h.name) && `the heading “${h.name}” is not the template’s (${list([...names])})`]),
      ...EVERY_PET_TRICKS.filter((x) => !have.includes(x)).map((x) => `no ${x} trick`)];
  },
  'L3-control-panel': (p, t) => {
    const want = headings(t.own).map((h) => h.name), have = headings(p.own);
    return [!same(have.map((h) => h.name), want) && `its sections are ${list(have.map((h) => h.name))}; the template’s are ${list(want)}`,
      ...have.filter((h) => h.count === null).map((h) => `the section “${h.name}” has no count`)];
  },
  'L4-control-panel': (p, t, ctx) => {
    const bare = (names, slug) => names.map((n) => n.replace(new RegExp(`^${slug}-`), '<pet>-'));
    const want = bare(toolboxNames(t.own), ctx.tslug), have = bare(toolboxNames(p.own), ctx.slug);
    return [!same(have, want) && `its tool boxes are ${list(have)}; the template’s are ${list(want)}`];
  },
  'rwx-panel': (p, t) => {
    const marks = (s) => all(/<p class="rwx-key">([\s\S]*?)<\/p>/g, s).flatMap((k) => all(/<span class="mark ([a-z]+)">/g, k));
    // A level may take more than one row (the template's L3 has two: its own folder and everything else); every level
    // has at least one, L1 at the top.
    const levels = (s) => [...new Set(all(/<details class="rwx-row"><summary><span class="lv">([^<]+)<\/span>/g, s))];
    const want = levels(t.own), have = levels(p.own), gone = want.filter((l) => !have.includes(l));
    return [!same(marks(p.own), marks(t.own)) && `its key shows ${list(marks(p.own))}; the template’s shows ${list(marks(t.own))}`,
      gone.length > 0 && { missing: `no row for ${list(gone)} (the template has one for each level)` },
      !gone.length && !same(have, want) && `its levels run ${list(have)}; the template’s run ${list(want)}`];
  },
  'session-notes-panel': (p) => [!p.own.includes('<span class="toolbox-name">notes</span>') && 'no notes tool box', !/<textarea/.test(p.own) && 'no text box',
    !/type="file"/.test(p.own) && 'no add file', !/>submit</.test(p.own) && 'no submit'],
  'emotions-panel': (p, t) => {
    const moods = (s) => all(/<figure class="mood[^"]*" data-mood="([a-z]+)"/g, s);
    const bare = [...p.own.matchAll(/<figure class="mood[^"]*" data-mood="([a-z]+)"[\s\S]*?<\/figure>/g)].filter((m) => !/<img [^>]*src="[^"]+"/.test(m[0]))
      .map((m) => (/<legend>([^<]+)<\/legend>/.exec(m[0]) || m)[1]);
    return [!same(moods(p.own), moods(t.own)) && `its moods are ${list(moods(p.own))}; the template’s are ${list(moods(t.own))}`,
      bare.length > 0 && { missing: `no picture for ${list(bare)} (the pet’s art for them is A02)` }];
  },
  'clicker-training-panel': (p, t) => {
    const want = itemNames(t.own).filter((n) => /clicks?$/.test(n)), have = itemNames(p.own);
    return [!same(have.slice(0, want.length), want) && `its clicks are ${list(have)}; the template’s start ${list(want)}`];
  },
  'friends-list-panel': (p) => [...p.own.matchAll(/<li class="mood related-pet">([\s\S]*?)<\/li>/g)].flatMap((m) => {
    const who = (/<legend>([^<]+)<\/legend>/.exec(m[1]) || [])[1];
    return [!who && 'a friend with no name in its cloud', !/<img [^>]*src="[^"]+"/.test(m[1]) && `${who || 'a friend'} has no picture`];
  }),
  'unified-footer-panel': (p) => [
    ...[['footer-title">By Astra<', 'By Astra'], ['class="footer-sparkle"', 'the sparkle'], ['class="footer-star"', 'her photostar'], ['footer-title">Find Out More<', 'Find Out More']]
      .filter(([s]) => !p.own.includes(s)).map(([, what]) => `no ${what}`),
    /<code/.test(p.own.replace(/<details class="about">[\s\S]*$/, '')) && 'code languages in it (crossed out 2026-10-24)',
  ],
  'chat-panel': (p, t, ctx) => [!p.own.includes(`<span class="chat-name">${ctx.slug}-chat</span>`) && `no ${ctx.slug}-chat tool`, !p.own.includes('class="chat-open"') && 'no open button',
    !/class="chat-panel"[^>]*role="dialog"/.test(p.own) && 'no chat window'],
};

/** Every finding on one page: [{ check, status, detail }], Missing when a part is not there, Incorrect when it differs. */
export function checkPage(templateHtml, html, { repo } = {}) {
  const tparts = pageParts(templateHtml), parts = pageParts(html);
  const slugOf = (ps) => (ps.find((p) => p.part === 'cyberhome-panel')?.label || '').replace(/-cyberhome-panel$/, '');
  const ctx = { slug: slugOf(parts), tslug: slugOf(tparts), html, liveCheck: (/<script>[^<]*github\.io[^<]*<\/script>/.exec(templateHtml) || [])[0] };
  const rows = [];
  const add = (check, status, detail) => rows.push({ check, status, detail });
  // A47: the template's parts in its order, and no panel the template does not have.
  const order = parts.filter((p) => p.part).map((p) => p.part), want = tparts.filter((p) => p.part).map((p) => p.part);
  const shared = order.filter((x) => want.includes(x)), wantShared = want.filter((x) => order.includes(x));
  if (!same(shared, wantShared)) add(ORDER_CHECK, 'Incorrect', `Its parts run ${list(shared)}; the template’s run ${list(wantShared)}.`);
  for (const p of parts.filter((x) => !x.part)) add(ORDER_CHECK, 'Incorrect', `“${p.label}” is a panel the template does not have.`);
  // One check per part.
  for (const { check, part, name } of TEMPLATE_PARTS) {
    const t = tparts.find((x) => x.part === part), p = parts.find((x) => x.part === part);
    if (!t) continue; // the template no longer has this part: the test asks for the matrix to change
    if (!p) { add(check, 'Missing', `No ${name}.`); continue; }
    const problems = [
      p.staysOpen !== t.staysOpen && (t.staysOpen ? 'it folds; the template’s always stays open' : 'it always stays open; the template’s folds'),
      p.foldArrow !== t.foldArrow && (t.foldArrow ? 'its label has no fold arrow; the template’s has one' : 'its label has a fold arrow; the template’s has none'),
      !same(aboutLines(p.own), aboutLines(t.own)) && `More details says ${list(aboutLines(p.own))}; the template’s says ${list(aboutLines(t.own))}`,
      ...RULES[part](p, t, ctx),
    ].filter(Boolean);
    const differs = problems.filter((x) => typeof x === 'string'), missing = problems.filter((x) => x.missing).map((x) => x.missing);
    if (missing.length) add(check, 'Missing', `The ${name}: ${missing.join('; ')}.`);
    if (differs.length) add(check, 'Incorrect', `The ${name}: ${differs.join('; ')}.`);
  }
  // A44: Data Chip's phone on Data Dealer's page only.
  const phone = /class="phone-mini"/.test(html);
  if (repo && phone !== (repo === PHONE_PAGE)) add('A44', 'Incorrect', phone ? 'The chat opens as Data Chip’s phone, which is Data Dealer’s only.' : 'Data Dealer’s chat is not Data Chip’s phone.');
  // A46 and A48: every pill and every pair of lights is one the template shows.
  const tPills = new Set(pillShapes(templateHtml)), tLights = new Set(lightShapes(templateHtml));
  const oddPills = [...new Set(pillShapes(html).filter((s) => !tPills.has(s)))], oddLights = [...new Set(lightShapes(html).filter((s) => !tLights.has(s)))];
  if (oddPills.length) add('A46', 'Incorrect', `Pills unlike the template’s: ${list(oddPills)} (${pillShapes(html).filter((s) => !tPills.has(s)).length}).`);
  if (oddLights.length) add('A48', 'Incorrect', `Lights unlike the template’s: ${list(oddLights)} (${lightShapes(html).filter((s) => !tLights.has(s)).length}).`);
  return rows;
}

/**
 * Every pet program page against the template, as a ledger the Flash Audit's pills read like a saved run:
 * { pets: [{ icon, program, repo, audited, rows }] }. `pages` is [{ repo, pet, home, page, html }].
 */
export function templateAudit(templateHtml, pages) {
  return { pets: pages.map(({ repo, pet, home, page, html }) => ({ icon: pet, program: home, repo, audited: { ref: 'as built', page }, rows: checkPage(templateHtml, html, { repo }) })) };
}
