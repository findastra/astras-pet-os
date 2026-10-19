// Flash Audit A59, Pet program and its link (Astra, 2026-10-18). Every pet has exactly one pet program: its numbered
// entry in pet-programs.json, with a repo that exists. Every place that shows the pet links to that same program:
// pet.json `entry`, `interface_url` and `interface_local_url` in pets.json, the profile line's home link, The Farm's
// card, the System Map node and the README.
// The checks are pure: the Idle Flash Audit passes in what it read from GitHub. The fixes change documents and
// metadata only (pet.json, README.md, pets.json, pet-programs.json, system-map.json), never code.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-18.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

export const OWNER = 'findastra';
export const HUB = 'astras-pet-os';
export const PAGES = `https://${OWNER}.github.io/${HUB}`;
export const pagesOf = (repo) => `https://${OWNER}.github.io/${repo}/`;
const BLUE = '🔵';
const slug = (s) => String(s).toLowerCase().replace(/['’]/g, '').replace(/&/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const base = (p) => String(p || '').split(/[\\/]/).pop();
const same = (a, b) => !!a && !!b && a.replace(/\/$/, '') === b.replace(/\/$/, '');
const isUrl = (u) => /^https?:\/\//.test(u || '');
const programLabel = (prog) => (prog.assigned ? prog.program : `pet-program-${prog.number}`);

/** A pet's program page in the hub, written by the Friendly Farmer's pet program spawner (2026-10-18). */
export const programPage = (repo) => `apps/pet-programs/${repo}-20261018.html`;
const isProgramPage = (p) => /^apps\/pet-programs\//.test(p || '');

/** The program's own page, worked out the way the Farmer's profile round does (farmer-profile-20261009.mjs): its
 *  pet program page on The Farm (Astra, 2026-10-19: "one click always points to program page (Pet Program)"), else
 *  profile.tools home_url, else a live github.io site. */
export function programHome(reg, tools) {
  const live = /^https:\/\/[^/]+\.github\.io\//.test(reg?.interface_live_url || '') ? reg.interface_live_url : null;
  const farmPage = reg?.interface_url && !isUrl(reg.interface_url) ? `${PAGES}/${reg.interface_url}` : null;
  return farmPage || tools?.home_url || live || null;
}

/** The profile line's home link the round writes for this program (null: an unlinked name). */
export function expectedProfileHome(prog, reg, tools, repo) {
  const target = programHome(reg, tools);
  const homeRepo = tools?.home_repo || prog.repo;
  const name = prog.assigned ? slug(prog.program) : `pet-program-${prog.number}`;
  return target || (name === homeRepo && repo?.exists && !repo.private ? `https://github.com/${OWNER}/${homeRepo}` : null);
}

/** The home sub-bullet of every numbered pet on the profile README: Map number -> { href, name }. */
export function parseProfileHomes(md) {
  const out = new Map();
  let inPets = false, cur = null;
  for (const line of String(md || '').split(/\r?\n/)) {
    if (/^#{2,4} /.test(line) && !/align=/.test(line)) { inPets = /pet apps|petos|pet_os/i.test(line); cur = null; continue; }
    if (!inPets) continue;
    const pet = /^(\d+)\. \*\*/.exec(line);
    if (pet) { cur = Number(pet[1]); out.set(cur, { href: null, name: null }); continue; }
    if (cur === null || !/^\s+- /.test(line)) continue;
    const home = /^\s+- (?:\[`([^`]+)`\]\(([^)]*)\)|`([^`]+)`(?: \*\(private\)\*)?) -- (?:(?:\*[^*]+\*, )?the pet program|pet program(?: and its repo)?, not named yet)/.exec(line);
    const e = out.get(cur);
    if (home && !e.name) { e.name = home[1] || home[3]; e.href = home[2] || null; }
  }
  return out;
}

/** A59 findings for one numbered pet program. Rows: { check: 'A59', status, detail, next, fix?, dot? }.
 *  prog      its pet-programs.json entry            reg     its pets.json entry (registered or pipeline), or null
 *  tools     pets.json profile.tools[repo], or null  repo    { exists, private, name } as GitHub says
 *  pet       its pet.json, or null                  tree    file paths on the audited branch of its repo
 *  hubTree   file paths on the hub's main           readme  its README.md text, or null
 *  profile   parseProfileHomes()'s map, or null when the profile could not be read
 *  map       { node, home, programNodes, linked, private } from the System Map, or null when not built
 *  entryLive whether its entry answers on the repo's own GitHub Pages site */
export function a59ForPet({ prog, reg = null, tools = null, repo, pet = null, tree = [], hubTree = [], readme = null, profile = null, map = null, entryLive = false }) {
  const rows = [];
  const add = (status, detail, next, fix = null, dot = null) => rows.push({ check: 'A59', status, detail, next, ...(fix ? { fix } : {}), ...(dot ? { dot } : {}) });
  const animal = ['registered', 'pipeline'].includes(prog.stage);
  const label = programLabel(prog);
  if (!repo?.exists) {
    if (animal) add('Missing', `${prog.icon}'s pet program #${prog.number} names repo ${prog.repo}, which is not on GitHub, so nothing can link to it (A13).`, 'Start or find the repo (A13); the links follow.');
    return rows;
  }
  const name = repo.name || prog.repo;
  // Today's app in the hub (app_url since 2026-10-19; interface_* before that), the page pet.json `entry` matches.
  const appHub = (u) => (u && !isUrl(u) && !isProgramPage(u) ? u : null);
  const hubPage = appHub(reg?.app_url) || appHub(reg?.interface_local_url) || appHub(reg?.interface_url);
  const page = programPage(prog.repo);
  const pageIn = hubTree.includes(page);
  const hubBase = hubPage ? base(hubPage) : null;
  const home = programHome(reg, tools);
  const entry = pet?.entry || null;
  const entryIn = !!entry && tree.includes(entry);
  const servedAt = (e) => (repo.private || !e ? null : e === 'index.html' ? pagesOf(name) : pagesOf(name) + e);
  const entryUrl = entryIn && entryLive ? servedAt(entry) : null;
  const regFix = {};
  const setReg = (key, to) => {
    if (regFix[key] !== undefined) return null;
    regFix[key] = to;
    return { type: 'a59-registry', where: 'hub', id: `registry:${prog.repo}:${key}`, repo: prog.repo, key, to };
  };
  const CONNECT = 'The Idle Flash Audit connects it on its fix branch (documents and metadata only).';

  // pet.json `entry`: the program page in the pet's own repo.
  if (pet) {
    const topHtml = tree.filter((p) => !p.includes('/') && /\.html?$/i.test(p));
    const want = hubBase && tree.includes(hubBase) ? hubBase : topHtml.length === 1 ? topHtml[0] : null;
    if (!entryIn && want) {
      add(entry ? 'Incorrect' : 'Missing', entry ? `pet.json entry "${entry}" is not in the repo; its program page is ${want}.` : `pet.json has no entry; its program page is ${want}.`,
        CONNECT, { type: 'a59-entry', where: 'repo', id: 'entry', to: want });
    } else if (entryIn && hubBase && base(entry) !== hubBase && !(home && same(home, servedAt(entry)))) {
      if (tree.includes(hubBase)) add('Incorrect', `pet.json entry opens ${entry}, but the hub shows ${hubPage} as ${prog.icon}'s app, and ${hubBase} is in the repo.`, CONNECT, { type: 'a59-entry', where: 'repo', id: 'entry', to: hubBase });
      else add('Incorrect', `pet.json entry opens ${entry}, but the hub shows ${hubPage} as ${prog.icon}'s app, and the repo has no ${hubBase}.`, 'Not changed: the pet\'s chat says which one is the app, then the other link follows.');
    }
    // No page to point at: A09 reports the missing program page.
  }

  // pets.json interface_url and interface_local_url, which The Farm's card, the README, the profile and the desktop pet
  // open. Once the pet's program page is in the hub, both open it (Astra, 2026-10-19: "one click always points to
  // program page (Pet Program)"); today's app moves to app_url, so its link is kept.
  if (reg) {
    const inHub = (p) => hubTree.includes(p);
    const hubCopy = entry && inHub(`apps/${base(entry)}`) ? `apps/${base(entry)}` : hubPage && inHub(hubPage) ? hubPage : null;
    const ownLive = reg.interface_live_url && same(reg.interface_live_url, pagesOf(name)) ? reg.interface_live_url : null;
    for (const key of ['interface_url', 'interface_local_url']) {
      const v = reg[key];
      if (pageIn && v !== page) {
        const fix = setReg(key, page);
        if (fix && key === 'interface_url' && v && !reg.app_url) fix.also = { app_url: v };
        add(v ? 'Incorrect' : 'Missing', v ? `pets.json ${key} is ${v}, but one click opens ${prog.icon}'s pet program, ${page}.` : `pets.json has no ${key} for ${prog.icon}; its pet program page is ${page}.`, CONNECT, fix);
      } else if (!v && prog.stage === 'registered') {
        const to = key === 'interface_url' ? ownLive || hubCopy : hubCopy;
        add('Missing', `pets.json has no ${key} for ${prog.icon}.`, to ? CONNECT : `Nothing in the hub to point at: ${prog.icon}'s page is not built (A09).`, to ? setReg(key, to) : null);
      } else if (v && !isUrl(v) && !inHub(v)) {
        add('Incorrect', `pets.json ${key} is ${v}, which is not in the hub.`, hubCopy ? CONNECT : 'Point it at the program page once it is in the hub (A09).', hubCopy ? setReg(key, hubCopy) : null);
      } else if (v && isUrl(v)) {
        const other = /^https:\/\/findastra\.github\.io\/([^/]+)\//.exec(v)?.[1];
        if (other && other !== name && other !== HUB) add('Incorrect', `pets.json ${key} is ${v}, the site of ${other}, not ${name}.`, 'Not changed: the pet\'s chat says which site is the program, then the link follows.');
      }
    }
    if (!reg.interface_url && !pageIn && prog.stage === 'pipeline' && entryUrl) {
      const fix = setReg('interface_url', entryUrl);
      if (fix) fix.also = { interface_live_url: entryUrl };
      add('Missing', `pets.json has no interface_url for ${prog.icon}, though its program answers at ${entryUrl}, so the profile and the Pets Board cannot link it.`, CONNECT, fix);
    }
  }

  // The Farm's card (registered pets): it opens interface_url, else <repo>-20261008.html beside the Farm page.
  if (reg && prog.stage === 'registered') {
    const u = reg.interface_url || `${reg.repo}-20261008.html`;
    const farmUrl = isUrl(u) ? u : `${PAGES}/apps/${u.replace(/^apps\//, '')}`;
    if (!reg.interface_url && !hubTree.includes(`apps/${u}`)) add('Incorrect', `The Farm's card opens apps/${u}, which is not in the hub.`, 'Follows the interface_url fix above.');
    const ownLive = reg.interface_live_url && same(reg.interface_live_url, pagesOf(name)) ? reg.interface_live_url : null;
    if (reg.interface_url && home && !same(farmUrl, home)) {
      const to = pageIn ? page : ownLive && same(home, ownLive) ? ownLive : null;
      add('Incorrect', `The Farm's card opens ${farmUrl}, but the profile opens ${home}: two pages for one program.`,
        to ? CONNECT : 'Not changed: which page is the program is for the pet\'s chat (or Astra, for a home she set).',
        to ? setReg('interface_url', to) : null);
    }
  }

  // The profile line's home link (findastra/findastra README), written by the Farmer's profile round from the hub.
  if (profile) {
    const want = expectedProfileHome(prog, reg, tools, repo);
    const line = profile.get(prog.number);
    const ROUND = 'The Farmer\'s profile round writes this line from the hub; if it is still wrong after the hub merges, the round is not running.';
    // A private or archived repo may be out of the round's sight, so only a public one is missed for certain.
    if (!line) { if (!repo.private && !repo.archived) add('Incorrect', `${prog.icon} (#${prog.number}) is not on the profile's pet list, though its repo is public on GitHub.`, ROUND); }
    else if ((line.href || null) !== (want || null)) add('Incorrect', `The profile's home link for ${prog.icon} goes to ${line.href || 'nothing (an unlinked name)'}; the hub says ${want || 'no page yet'}.`, ROUND);
  }

  // The System Map: the pet's node, its program's node, and the line between them.
  if (map && !map.private) {
    // The map is built from pets.json, so a pet missing from it is missing from the registry: moving it in is
    // Astra's (A33, nobody becomes an animal by saying so).
    if (!map.node) { if (animal) add('Missing', `${prog.icon} is not on the System Map${reg ? '' : ', because pets.json does not list it'}.`, reg ? 'The map is built from pets.json: rebuild it (npm run build).' : 'Yours: register it in pets.json (A33), then the map shows it.', null, reg ? null : BLUE); }
    else if (map.home && map.home.number !== prog.number) add('Incorrect', `The System Map links ${prog.icon} to pet program #${map.home.number} (${map.home.name}), not #${prog.number}.`, 'Not changed: two programs share a repo or a pet name; the hub list needs one program per pet.', null, BLUE);
    else if (prog.assigned && animal && map.programNodes.length > 1) add('Incorrect', `The System Map has ${map.programNodes.length} nodes for ${label}: ${map.programNodes.join(', ')}.`, 'Keep one node in system-map.json for the program.');
    else if (prog.assigned && animal && map.programNodes.length === 1 && !map.linked) {
      add('Missing', `The System Map shows ${label} (${map.programNodes[0]}) but draws no line from ${prog.icon} to it.`, CONNECT,
        { type: 'a59-map-link', where: 'hub', id: `map:${prog.number}`, from: map.node, to: map.programNodes[0], why: `${label} is ${prog.icon}'s own program (pet-programs.json, #${prog.number}).` });
    }
  }

  // The README links to the program's page.
  if (readme) {
    const targets = [home, entryUrl, hubPage ? `${PAGES}/${hubPage}` : null].filter(Boolean);
    const rel = entry ? new RegExp(`\\]\\((?:\\./)?${entry.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`) : null;
    const linked = targets.some((u) => readme.includes(u.replace(/\/$/, ''))) || (rel && rel.test(readme));
    const to = home || entryUrl;
    if (!linked && to) add('Missing', `README does not link to ${label} (${to}).`, CONNECT, { type: 'a59-readme', where: 'repo', id: 'readme', to, label });
  }
  return rows;
}

/** A59 for the whole list (the Farmer's round card): a registered or pipeline pet with no number gets the next free
 *  one, its program called pet-program-N until Astra names it; two pets on one program wait for her. */
export function a59ForCatalog(catalog, registry) {
  const rows = [];
  const byRepo = new Map();
  for (const p of catalog) if (p.repo) byRepo.set(p.repo, [...(byRepo.get(p.repo) || []), p]);
  for (const [repo, list] of byRepo) if (list.length > 1) {
    rows.push({ check: 'A59', status: 'Incorrect', dot: BLUE, detail: `Pet programs ${list.map((p) => `#${p.number} (${p.icon})`).join(' and ')} all name repo ${repo}: two pets on one program.`, next: 'Yours: which pet keeps this program? The other gets its own.' });
  }
  let next = Math.max(0, ...catalog.map((p) => p.number)) + 1;
  for (const [stage, list] of [['registered', registry.pets], ['pipeline', registry.pipeline]]) {
    for (const e of list || []) {
      if (!e.repo || byRepo.has(e.repo)) continue;
      const n = next++;
      const entry = { number: n, program: `pet-program-${n}`, assigned: false, icon: e.pet, idea: null, stage, repo: e.repo, repo_exists: e.published !== false,
        mini_descriptor: { label: `pet-program-${n}-v1.0-mini-descriptor-v1.0`, text: e.job || 'Not decided yet.', reviewed: false } };
      rows.push({ check: 'A59', status: 'Missing', detail: `${e.pet} (${e.repo}) is a ${stage} pet with no number in pet-programs.json.`,
        next: `Numbered #${n} on the fix branch, its program called pet-program-${n} until you name it (A07).`, fix: { type: 'a59-number', where: 'hub', id: `number:${e.repo}`, entry } });
    }
  }
  return rows;
}

// ---- Fixes (documents and metadata only). Each returns the log lines it applied; a fix it cannot make safely is skipped.

const eolOf = (raw) => (raw.includes('\r\n') ? '\r\n' : '\n');
const indentOf = (raw) => ((raw.match(/\n( +)"/) || [, '  '])[1]).length;

/** Sets a top-level field of a JSON file, keeping its layout where it can. */
export function setTopField(raw, key, value) {
  const obj = JSON.parse(raw);
  const ind = indentOf(raw);
  if (JSON.stringify(obj, null, ind) + '\n' === raw.replace(/\r\n/g, '\n')) {
    obj[key] = value;
    return (JSON.stringify(obj, null, ind) + '\n').replace(/\n/g, eolOf(raw));
  }
  const pad = ' '.repeat(ind);
  const lines = raw.split('\n');
  const at = lines.findIndex((l) => l.startsWith(`${pad}"${key}":`));
  if (at >= 0) lines[at] = lines[at].replace(/^(\s*"[^"]+":\s*)"(?:[^"\\]|\\.)*"/, (m, k) => `${k}${JSON.stringify(value)}`);
  else lines.splice(1, 0, `${pad}"${key}": ${JSON.stringify(value)},${eolOf(raw) === '\r\n' ? '\r' : ''}`);
  const out = lines.join('\n');
  if (JSON.parse(out)[key] !== value) throw new Error(`could not set ${key}`);
  return out;
}

/** Sets a field on one pets.json entry (found by its "repo" line), keeping the file's own layout. */
export function setRegistryField(raw, repo, key, value) {
  const lines = raw.split('\n');
  const at = lines.findIndex((l) => l.trim().replace(/\r$/, '') === `"repo": ${JSON.stringify(repo)},`);
  if (at < 0) throw new Error(`no pets.json entry for ${repo}`);
  const pad = lines[at].match(/^ */)[0];
  const close = lines.findIndex((l, i) => i > at && new RegExp(`^${pad.slice(2)}}`).test(l));
  if (close < 0) throw new Error(`the pets.json entry for ${repo} has no end`);
  const cr = lines[at].endsWith('\r') ? '\r' : '';
  const own = lines.findIndex((l, i) => i > at && i < close && l.startsWith(`${pad}"${key}":`));
  if (own >= 0) lines[own] = lines[own].replace(/^(\s*"[^"]+":\s*)"(?:[^"\\]|\\.)*"/, (m, k) => `${k}${JSON.stringify(value)}`);
  else lines.splice(at + 1, 0, `${pad}"${key}": ${JSON.stringify(value)},${cr}`);
  const out = lines.join('\n');
  const parsed = JSON.parse(out);
  const e = [...(parsed.pets || []), ...(parsed.pipeline || [])].find((x) => x.repo === repo);
  if (!e || e[key] !== value) throw new Error(`could not set ${key} for ${repo}`);
  return out;
}

/** Adds one link at the top of system-map.json "links", in the file's own layout. */
export function addMapLink(raw, link) {
  const eol = eolOf(raw);
  const lines = raw.split('\n');
  const at = lines.findIndex((l) => /^  "links": \[\r?$/.test(l));
  if (at < 0) throw new Error('system-map.json has no "links" list');
  const cr = eol === '\r\n' ? '\r' : '';
  const body = Object.entries(link).map(([k, v], i, all) => `      ${JSON.stringify(k)}: ${JSON.stringify(v)}${i < all.length - 1 ? ',' : ''}${cr}`);
  lines.splice(at + 1, 0, `    {${cr}`, ...body, `    },${cr}`);
  const out = lines.join('\n');
  if (!JSON.parse(out).links.some((l) => l.from === link.from && l.to === link.to)) throw new Error('link not added');
  return out;
}

/** Puts "**Pet program:** [label](url)" under the title, or under the credit line when it follows the title. */
export function addReadmeLink(readme, label, url) {
  const line = `**Pet program:** [${label}](${url})`;
  const eol = eolOf(readme);
  const lines = readme.split('\n');
  const isCredit = (l) => /^\*(?:An Intelligent App, or Pet, by Astra|A pet app by Astra)\.\*/.test(l);
  const h1 = lines.findIndex((l) => /^#\s.+/.test(l));
  let at = h1 >= 0 ? h1 : lines.findIndex(isCredit);
  if (h1 >= 0) {
    const next = lines.findIndex((l, i) => i > h1 && l.trim());
    if (next > h1 && isCredit(lines[next])) at = next;
  }
  if (at < 0) return `${line}${eol}${eol}${readme}`;
  const cr = eol === '\r\n' ? '\r' : '';
  lines.splice(at + 1, 0, cr, `${line}${cr}`);
  return lines.join('\n');
}

/** Repo fixes in a clone of the pet's repo: pet.json entry and the README link. */
export function applyA59Repo(dir, rows, { readme = true } = {}) {
  const log = [], applied = [];
  for (const r of rows) {
    const f = r.fix;
    if (r.check !== 'A59' || !f || f.where !== 'repo') continue;
    try {
      if (f.type === 'a59-entry' && existsSync(`${dir}/pet.json`) && existsSync(`${dir}/${f.to}`)) {
        const raw = readFileSync(`${dir}/pet.json`, 'utf8');
        if (JSON.parse(raw).entry === f.to) continue;
        writeFileSync(`${dir}/pet.json`, setTopField(raw, 'entry', f.to));
        log.push(`pet.json: entry now opens ${f.to}, the program page (A59).`); applied.push(f.id);
      }
      if (f.type === 'a59-readme' && readme && existsSync(`${dir}/README.md`)) {
        const raw = readFileSync(`${dir}/README.md`, 'utf8');
        if (raw.includes(f.to.replace(/\/$/, ''))) continue;
        writeFileSync(`${dir}/README.md`, addReadmeLink(raw, f.label, f.to));
        log.push(`README: links to its pet program, ${f.label} (${f.to}) (A59).`); applied.push(f.id);
      }
    } catch (e) { log.push(`Not changed (A59 ${f.id}): ${e.message}.`); }
  }
  return { log, applied };
}

/** Hub fixes in a clone of astras-pet-os: pets.json links, new numbers in pet-programs.json, System Map lines.
 *  Run `node scripts/build.mjs --metadata-only` afterwards so the generated files follow. */
export function applyA59Hub(dir, fixes) {
  const log = [], applied = [];
  const edit = (file, fn) => { const raw = readFileSync(`${dir}/${file}`, 'utf8'); const out = fn(raw); if (out !== raw) writeFileSync(`${dir}/${file}`, out); return out !== raw; };
  for (const f of fixes) {
    try {
      if (f.type === 'a59-registry') {
        const sets = { [f.key]: f.to, ...(f.also || {}) };
        let changed = false;
        for (const [k, v] of Object.entries(sets)) changed = edit('pets.json', (raw) => setRegistryField(raw, f.repo, k, v)) || changed;
        if (changed) { log.push(`pets.json: ${f.repo} ${Object.entries(sets).map(([k, v]) => `${k} -> ${v}`).join(', ')} (A59).`); applied.push(f.id); }
      } else if (f.type === 'a59-number') {
        const changed = edit('pet-programs.json', (raw) => {
          const obj = JSON.parse(raw);
          if (obj.programs.some((p) => p.repo === f.entry.repo)) return raw;
          if (JSON.stringify(obj, null, 2) + '\n' !== raw.replace(/\r\n/g, '\n')) throw new Error('pet-programs.json is not in its usual layout');
          // The number is taken again here, so two fixes in one run never share one.
          const n = Math.max(...obj.programs.map((p) => p.number)) + 1;
          const entry = n === f.entry.number ? f.entry : { ...f.entry, number: n, program: `pet-program-${n}`, mini_descriptor: { ...f.entry.mini_descriptor, label: `pet-program-${n}-v1.0-mini-descriptor-v1.0` } };
          obj.programs.push(entry);
          return (JSON.stringify(obj, null, 2) + '\n').replace(/\n/g, eolOf(raw));
        });
        if (changed) { log.push(`pet-programs.json: ${f.entry.icon} (${f.entry.repo}) numbered, its program called pet-program-N until Astra names it (A59).`); applied.push(f.id); }
      } else if (f.type === 'a59-map-link') {
        const changed = edit('system-map.json', (raw) => (JSON.parse(raw).links.some((l) => l.from === f.from && l.to === f.to) ? raw : addMapLink(raw, { from: f.from, to: f.to, carries: 'opens', state: 'now', why: f.why })));
        if (changed) { log.push(`system-map.json: a line from ${f.from} to its program ${f.to} (A59).`); applied.push(f.id); }
      }
    } catch (e) { log.push(`Not changed (A59 ${f.id}): ${e.message}.`); }
  }
  return { log, applied };
}
