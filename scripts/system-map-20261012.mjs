// Builds system-map-20261012.html: the 3D map of every pet, model, program and piece of
// infrastructure in Astra's PetOS, and everything that flows between them.
// Sources: pets.json (pets, pipeline, seeds, relations), pet-programs.json (every pet program's name) and
// system-map.json (everything that is not a pet with a repo, the rings and the grants). Run by npm run build.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-12. Rings and grants, 2026-10-17 (Astra, option A): a ring says where a
// thing lives; who may read, write or run it is a grant with a status (enforced, written only, planned).
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { allPets } from './farmer-rounds-20261009.mjs';

const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const RWX_VALUES = ['yes', 'pr', 'ask', 'grant', 'no'];
const LEVELS = ['L1', 'L2', 'L3', 'L4'];
// Native tools and tricks (Astra, 2026-10-19): they belong to a pet program (`of`) and are never drawn on the map; the
// map lists them on their pet program's card, and TOOLS-AND-TRICKS.md lists them in the registry table.
export const PARTS = ['tool', 'trick'];

/** Every node and link, checked: a link to an unknown node throws instead of vanishing.
    programs is pet-programs.json's list; pet program names come only from there (AGENTS.md, one list). */
export function systemMapData(registry, extra, programs = []) {
  const nodes = new Map();
  const add = (n) => { if (nodes.has(n.id)) throw new Error(`duplicate node ${n.id}`); nodes.set(n.id, n); };
  for (const p of allPets(registry)) {
    add({ id: p.repo, name: p.pet,
      type: p.role === 'host' ? 'host' : p.stage === 'pipeline' ? 'pipeline' : 'pet',
      state: 'now', job: p.job || '', status: p.status || null, repo: p.repo, visibility: p.visibility || null, art: p.art || null });
  }
  for (const s of registry.seeds?.pets || []) {
    add({ id: slug(s.pet), name: s.pet, type: 'seed', state: 'planned', job: s.job === 'undecided' ? 'Job undecided.' : s.job, repo: null });
  }
  add({ id: 'astra', name: 'Astra (you)', type: 'you', state: 'now', job: 'Every pet reports to you, and you approve anything that matters.' });
  for (const n of extra.nodes) add({ ...n });

  // Pet programs from the one list. A node with a "program" number takes its name from the list; every pet's program
  // that has no node yet gets one, linked from its pet, so the map never falls behind the list: built for registered and
  // pipeline pets, planned for seeds and roadmap pets (Astra, 2026-10-18), which are not animals until registered.
  const programByNumber = new Map(programs.map((p) => [p.number, p]));
  for (const n of nodes.values()) {
    if (n.program === undefined) continue;
    const p = programByNumber.get(n.program);
    if (programs.length && !p) throw new Error(`${n.id}: no pet program #${n.program} in pet-programs.json`);
    if (p) n.name = p.program;
  }
  // Private pets (pets.json relations.private) send nothing but their registry entry, so their programs stay off the map.
  const privatePets = new Set(registry.relations?.private || []);
  for (const id of privatePets) if (nodes.has(id)) nodes.get(id).private = true;
  const generatedLinks = [];
  for (const p of programs) {
    if (!p.assigned || privatePets.has(p.repo)) continue;
    if ([...nodes.values()].some((n) => n.program === p.number)) continue;
    const early = ['seed', 'roadmap'].includes(p.stage);
    if (!early && !['registered', 'pipeline'].includes(p.stage)) continue;
    // Its pet: a registered or pipeline pet by repo, a seed or roadmap pet by name.
    const pet = early ? [...nodes.values()].find((n) => ['seed', 'roadmap'].includes(n.type) && n.name === p.icon) : nodes.get(p.repo);
    if (!pet) continue; // its pet is not on the map yet: nothing to hang the program on
    const state = !early && p.repo_exists ? 'now' : 'planned';
    add({ id: `program-${p.number}`, name: p.program, type: 'own-program', state, program: p.number, category: early ? 'Planned' : 'Made by Astra',
      job: p.mini_descriptor?.text || `${p.icon}'s pet program.` });
    generatedLinks.push({ from: pet.id, to: `program-${p.number}`, carries: 'opens', state,
      why: early ? `${p.program} will be ${p.icon}'s own program (pet-programs.json, #${p.number}).` : `${p.program} is ${p.icon}'s own program (pet-programs.json, #${p.number}).` });
  }
  // Each pet's own pet program, for its card.
  for (const n of nodes.values()) {
    if (!['host', 'pet', 'pipeline', 'seed', 'roadmap'].includes(n.type)) continue;
    const p = programs.find((x) => (n.repo && x.repo === n.repo) || x.icon === n.name);
    if (!p) continue;
    const home = [...nodes.values()].find((m) => m.program === p.number);
    n.home = { number: p.number, name: p.program, assigned: !!p.assigned, node: home ? home.id : null };
  }

  for (const n of nodes.values()) {
    const code = extra.code?.repos?.[n.repo || n.id];
    if (code) n.code = code;
    n.layer ??= extra.type_layers[n.type];
    if (!extra.layers[n.layer]) throw new Error(`${n.id} has no layer`);
  }

  // Rings: where a thing lives (system-map.json "rings"). A tool or a trick sits on its pet program's ring.
  const rings = extra.rings;
  const ringIds = new Set(rings.list.map((r) => r.ring));
  const ringOf = (n) => {
    if (rings.by_id[n.id]) return rings.by_id[n.id];
    if (PARTS.includes(n.type)) { const o = nodes.get(n.of); if (!o) throw new Error(`${n.type} ${n.id} belongs to unknown ${n.of}`); const r = ringOf(o); return r === '2' ? '3' : r; }
    return rings.by_type[n.type];
  };
  for (const n of nodes.values()) { n.ring = ringOf(n); if (!ringIds.has(n.ring)) throw new Error(`${n.id} has no ring`); }
  // Animals: the core, the Farmer, registered and pipeline pets, and the programs Astra made for them. Seeds and
  // roadmap pets, and their programs, are not animals until Astra registers them.
  const stageOf = (n) => programByNumber.get(n.program)?.stage;
  // A tool placed outside the glass (rings.by_id, Astra 2026-10-18: everything-search) is not an animal there.
  const animalOf = (n) => {
    if (PARTS.includes(n.type)) { const o = nodes.get(n.of); return o.ring === '2' ? ['host', 'pet', 'pipeline'].includes(o.type) : animalOf(o); }
    if (n.ring === '0' || n.ring === '1') return true;
    if (n.ring === '2') return ['host', 'pet', 'pipeline'].includes(n.type);
    if (n.ring === '3') return n.program !== undefined && programs.length ? ['registered', 'pipeline'].includes(stageOf(n)) : n.state === 'now';
    return false;
  };
  for (const n of nodes.values()) n.animal = animalOf(n);

  const group = (t) => [...nodes.values()].filter((n) => n.type === t).map((n) => n.id);
  // Groups (Astra, 2026-10-18): a node whose members name it with "in" (the 13 trackers, the 4 base stations, the two
  // controllers) is a group, not a device of its own. A line drawn to a group reaches each member; a line between two
  // groups stays one line between them.
  const members = (id) => [...nodes.values()].filter((m) => m.in === id).map((m) => m.id);
  for (const n of nodes.values()) if (members(n.id).length) n.group = true;
  const isGroup = (id) => !!nodes.get(id)?.group;
  const expand = (id) => id === '@pets' || id === 'pets' ? [...group('pet'), ...group('pipeline')]
    : id === '@seeds' ? group('seed') : id === '@roadmap' ? group('roadmap') : isGroup(id) ? members(id) : [id];
  const links = [];
  const push = (from, to, carries, state, why, everyApp = false, medium) => {
    const pair = isGroup(from) && isGroup(to);
    for (const a of pair ? [from] : expand(from)) for (const b of pair ? [to] : expand(to)) {
      if (!nodes.has(a)) throw new Error(`unknown "from": ${a}`);
      if (!nodes.has(b)) throw new Error(`unknown "to": ${b}`);
      if (a === b) continue;
      links.push({ from: a, to: b, carries, state, why, everyApp, ...(medium ? { medium } : {}) });
    }
  };
  for (const l of registry.relations.links) push(l.from, l.to, l.carries, l.state, l.why);
  for (const s of registry.seeds?.pets || []) for (const w of s.works_with || []) push(slug(s.pet), w.pet, 'findings', 'planned', w.why);
  for (const l of extra.links) push(l.from, l.to, l.carries, l.state, l.why, [l.from, l.to].includes('@pets'), l.medium); // medium: how a network link physically travels (2026-10-14)
  for (const l of generatedLinks) push(l.from, l.to, l.carries, l.state, l.why);

  // Which architecture layer a link belongs to, so its colour matches Astra's chart:
  // 0 development (assistants building pets, the art pipeline): outside the running system;
  // 1 anything touching you, a device or the Farm; 2 the registry (Pet Directory, Program Manager);
  // 5 anything touching an AI model or the harness, or code an assistant builds; 3 anything else the
  // Farmer does; 6 anything touching a real program; 4 pet talking directly to pet.
  const L = (id) => nodes.get(id).layer;
  for (const l of links) {
    const ends = [l.from, l.to], has = (layer) => ends.some((id) => L(id) === layer);
    l.layer = (has(0) || l.carries === 'builds' || l.carries === 'art') ? 0
      : has(1) ? 1 : (l.carries === 'registry' || has(2)) ? 2
      : (has(5) || l.carries === 'model') ? 5
      : ends.some((id) => nodes.get(id).type === 'host') ? 3
      : (has(6) || ['opens', 'manages', 'runs-on'].includes(l.carries)) ? 6 : 4;
  }
  const carries = { ...registry.relations.carries, ...extra.carries };
  const states = { ...extra.states };
  for (const l of links) {
    if (!carries[l.carries]) throw new Error(`unknown kind: ${l.carries}`);
    if (!states[l.state]) throw new Error(`unknown state: ${l.state}`);
  }

  // Grants: who may read, write or run which things (system-map.json "access"). Each node lists the grants it holds
  // ("by") and the grants that reach it ("on"). A grant with R, W and X all "no" shows only on its subject's card.
  const access = extra.access;
  const seen = new Set();
  const matches = (sel, n) => {
    if (sel === '*') return true;
    const [kind, value] = sel.split(':');
    if (kind === 'ring') { if (!ringIds.has(value)) throw new Error(`unknown ring in ${sel}`); return n.ring === value; }
    if (kind === 'animal') { if (!ringIds.has(value)) throw new Error(`unknown ring in ${sel}`); return n.ring === value && n.animal; }
    if (kind === 'type') { if (!extra.types[value]) throw new Error(`unknown type in ${sel}`); return n.type === value; }
    if (kind === 'id') { if (!nodes.has(value)) throw new Error(`unknown node in ${sel}`); return n.id === value; }
    throw new Error(`unknown selector ${sel}`);
  };
  for (const g of access.grants) {
    if (seen.has(g.id)) throw new Error(`duplicate grant ${g.id}`); seen.add(g.id);
    for (const k of ['r', 'w', 'x']) if (!RWX_VALUES.includes(g[k]) || !access.values[g[k]]) throw new Error(`grant ${g.id}: ${k} is "${g[k]}"`);
    if (!access.statuses[g.status]) throw new Error(`grant ${g.id}: unknown status ${g.status}`);
    if (!g.subjects.length) throw new Error(`grant ${g.id} has no subjects`);
    // Who holds it, in L1 to L4 (Astra, 2026-10-18); empty for the adviser and other farms, outside your levels.
    if (!Array.isArray(g.level) || g.level.some((l) => !LEVELS.includes(l))) throw new Error(`grant ${g.id}: level must list L1 to L4`);
  }
  // A grant's own subject is not listed as something it reaches, except for "self" (a pet's own folder).
  for (const n of nodes.values()) {
    const holds = (g) => g.subjects.some((s) => matches(s, n));
    const by = access.grants.filter(holds);
    const on = access.grants.filter((g) => ['r', 'w', 'x'].some((k) => g[k] !== 'no')
      && (g.resources.includes('self') ? holds(g) : !holds(g) && g.resources.some((s) => matches(s, n))));
    n.access = { by: by.map((g) => g.id), on: on.map((g) => g.id) };
  }

  return { nodes: [...nodes.values()], links, carries, states, types: extra.types, layers: extra.layers, hats: extra.hats || {}, examples: extra.examples || {}, codeChecked: extra.code?.checked || null,
    rings: rings.list, access: { values: access.values, statuses: access.statuses, grants: access.grants } };
}

/** Each pet's idle mood frame, embedded so icons also work when the page is opened by double-click.
    Pets without registered frames (pipeline pets, seeds) use their small icon in art/icons/,
    keyed "node:<id>" (make-icons-20261012.mjs). */
export function petIcons(index) {
  const icons = Object.fromEntries(Object.entries(index.pets).map(([art, p]) => [art, 'data:image/png;base64,' + readFileSync(p.frames.idle).toString('base64')]));
  if (existsSync('art/icons')) for (const f of readdirSync('art/icons').sort()) {
    const m = /^(.+)-\d{8}\.png$/.exec(f);
    if (m) icons['node:' + m[1]] = 'data:image/png;base64,' + readFileSync('art/icons/' + f).toString('base64');
  }
  return icons;
}

export function buildSystemMap(registry, extra, template, icons = {}, programs = []) {
  const data = systemMapData(registry, extra, programs);
  // A pet's own icon in art/icons/ (its newest look) wins over its older mood frame.
  for (const n of data.nodes) { n.icon = icons['node:' + n.id] || (n.art && icons[n.art]) || null; delete n.art; }
  return template.replace('__DATA__', () => JSON.stringify(data).replaceAll('<', '\\u003c'));
}

// PROTECTION-RINGS.md: the rings and the grants, written from the same data as the map so the two never disagree.
const CELL = { yes: 'yes', pr: '🔒 PR', ask: 'asks', grant: '🔑 grant', no: '–' };
const cell = (s) => String(s).replace(/\\/g, '\\\\').replace(/\|/g, '\\|'); // backslashes first, then the table's pipes
export function ringsTable(extra) {
  return ['| Ring | Name | What lives there | Animal? |', '|---|---|---|---|',
    ...extra.rings.list.map((r) => r.ring === 'H'
      ? `| — | **${cell(r.name)}** | ${cell(r.what)} | ${cell(r.animal)} |`
      : `| ${r.ring} | ${cell(r.name)} | ${cell(r.what)} | ${r.animal === 'yes' || r.animal.startsWith('yes') ? '🐾 ' : ''}${cell(r.animal)} |`)].join('\n');
}
export function grantsTable(extra) {
  const { grants, statuses } = extra.access;
  return ['| # | Level | Who | On what | R | W | X | Status | How it holds |', '|---|---|---|---|---|---|---|---|---|',
    ...grants.map((g, i) => `| ${i + 1} | ${g.level.length ? g.level.join(', ') : '—'} | ${cell(g.who)} | ${cell(g.on)} | ${CELL[g.r]} | ${CELL[g.w]} | ${CELL[g.x]} | **${statuses[g.status].name}** | ${cell(g.how)}`
      + (g.next ? ` **Next (planned):** ${cell(g.next)}` : '') + (g.gaps?.length ? ` Known gap${g.gaps.length > 1 ? 's' : ''} ${g.gaps.join(', ')}.` : '') + ' |')].join('\n');
}
const between = (md, name, body) => {
  const re = new RegExp(`(<!-- ${name}:start[^>]*-->)[\\s\\S]*?(<!-- ${name}:end -->)`);
  if (!re.test(md)) throw new Error(`PROTECTION-RINGS.md has no ${name}:start / ${name}:end markers`);
  return md.replace(re, (m, a, b) => `${a}\n${body}\n${b}`);
};
export const applyAccessDoc = (md, extra) => between(between(md, 'rings', ringsTable(extra)), 'access', grantsTable(extra));

// TOOLS-AND-TRICKS.md: the registry of every native program, native tool, native trick and third-party program, by pet
// program, written from the same data as the map (Astra, 2026-10-19: "make sure that the entire tool trick and program
// registry is a table on github"). A pet program itself is a row of PET-PROGRAMS.md, so it is the group here, not a row.
const KINDS = [['own-program', 'native program'], ['tool', 'native tool'], ['trick', 'native trick'], ['program', 'third-party program']];
const PET_TYPES = ['host', 'pet', 'pipeline', 'seed', 'roadmap'];
export function partsRows(registry, extra, programs) {
  const data = systemMapData(registry, extra, programs);
  const nodes = new Map(data.nodes.map((n) => [n.id, n]));
  const byNumber = new Map(programs.map((p) => [p.number, p]));
  // The pet program a thing belongs to: a pet program node, or the pet program of a pet.
  const programOf = (n) => {
    if (!n) return null;
    if (n.program !== undefined) { const p = byNumber.get(n.program); return p ? { number: p.number, pet: p.icon, program: p.program } : null; }
    if (PET_TYPES.includes(n.type) && n.home) return { number: n.home.number, pet: n.name, program: n.home.name };
    if (n.of) return programOf(nodes.get(n.of));
    return null;
  };
  // A native program with no `of` belongs to the pet or pet program that opens or manages it, else to the one with a
  // line to it (as its pet program page lists it).
  const ownerOf = (n) => {
    if (n.of) return programOf(nodes.get(n.of));
    const from = (x) => x.to === n.id && programOf(nodes.get(x.from));
    const l = data.links.find((x) => from(x) && ['opens', 'manages'].includes(x.carries)) || data.links.find(from);
    return l ? programOf(nodes.get(l.from)) : null;
  };
  const rows = new Map();
  const add = (owner, n, kind, state) => {
    if (!owner) return;
    const key = `${owner.number}:${n.id}`;
    const old = rows.get(key);
    if (!old) rows.set(key, { ...owner, kind, name: n.name, label: n.label || '', state, id: n.id });
    else if (state === 'now') old.state = 'now';
  };
  for (const n of data.nodes) {
    if (n.private) continue;
    if (n.type === 'tool' || n.type === 'trick') add(programOf(nodes.get(n.of)), n, n.type, n.state);
    else if (n.type === 'own-program' && n.program === undefined) add(ownerOf(n) || { number: Infinity, pet: '—', program: 'no pet program yet' }, n, n.type, n.state);
  }
  // Third-party programs: every line between one and a pet, its pet program or one of its programs, tools or tricks.
  for (const l of data.links) {
    if (l.state === 'architecture') continue;
    for (const [mine, other] of [[l.from, l.to], [l.to, l.from]]) {
      const o = nodes.get(other), m = nodes.get(mine);
      if (o?.type !== 'program' || !m || m.private) continue;
      add(m.type === 'own-program' && m.program === undefined ? ownerOf(m) : programOf(m), o, 'program', l.state);
    }
  }
  const order = Object.fromEntries(KINDS.map(([k], i) => [k, i]));
  return [...rows.values()].sort((a, b) => (a.number === b.number ? 0 : a.number < b.number ? -1 : 1) || order[a.kind] - order[b.kind] || (a.state === 'now' ? 0 : 1) - (b.state === 'now' ? 0 : 1) || a.name.localeCompare(b.name));
}
export function partsTable(registry, extra, programs) {
  const rows = partsRows(registry, extra, programs);
  const kindName = Object.fromEntries(KINDS);
  const counts = KINDS.map(([k, name]) => `${rows.filter((r) => r.kind === k).length} ${name}s`).join(', ');
  const state = (s) => extra.states[s] ? extra.states[s].split(' (')[0] : s;
  return [`${rows.length} rows: ${counts}. A pet program itself is listed in [PET-PROGRAMS.md](PET-PROGRAMS.md); a third-party program is listed once for each pet program that runs it.`, '',
    '| # | Pet | Pet program | Kind | Name | Label | State |', '|---|---|---|---|---|---|---|',
    ...rows.map((r) => `| ${Number.isFinite(r.number) ? r.number : '—'} | ${cell(r.pet)} | ${cell(r.program)} | ${kindName[r.kind]} | ${cell(r.name)} | ${r.label ? '`' + cell(r.label) + '`' : ''} | ${cell(state(r.state))} |`)].join('\n');
}
export const applyPartsDoc = (md, registry, extra, programs) => {
  const re = /(<!-- registry:start[^>]*-->)[\s\S]*?(<!-- registry:end -->)/;
  if (!re.test(md)) throw new Error('TOOLS-AND-TRICKS.md has no registry:start / registry:end markers');
  return md.replace(re, (m, a, b) => `${a}\n${partsTable(registry, extra, programs)}\n${b}`);
};

export const SYSTEM_MAP = { output: 'system-map-20261012.html', template: 'scripts/system-map-template-20261012.html', extra: 'system-map.json', programs: 'pet-programs.json', doc: 'PROTECTION-RINGS.md', parts: 'TOOLS-AND-TRICKS.md' };
export const readSystemMapSources = () => ({ extra: JSON.parse(readFileSync(SYSTEM_MAP.extra, 'utf8')), template: readFileSync(SYSTEM_MAP.template, 'utf8'),
  programs: JSON.parse(readFileSync(SYSTEM_MAP.programs, 'utf8')).programs,
  icons: petIcons(JSON.parse(readFileSync('art/frames/index.json', 'utf8'))) });
