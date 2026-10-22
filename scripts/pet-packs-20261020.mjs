// The Friendly Farmer's pet-packs tool (`the-farm-v1.0-pet-packs-v1.0`, a native tool of The Farm).
// Astra, 2026-10-19: "people are going to want to be able to download as an individual pet and not have to download the
// whole system. And I understand the dependencies problem there." Her answers of 2026-10-20 (all recommended, Part 4 of
// docs/farm-owner-and-single-pets-20261019.md, card 058): a pet pack zip first, then the Friendly Farmer adds one pet to a
// farm (farm.lock) later; pictures are copied into the zip when it is built, never committed to a pet's repo, so the hub
// stays the one art source (PET-FILES.md); what each pet needs is written in pets.json, one place (`needs`).
//
//   node scripts/pet-packs-20261020.mjs plan <repo...>          what would go in each pack and what it needs (offline)
//   node scripts/pet-packs-20261020.mjs build <repo...> [--ref <tag|branch|commit>] [--from <a local clone>]
//                                       [--out <folder>] [--date YYYYMMDD] [--private]
//
// One zip per pet, <repo>-pet-pack-<YYYYMMDD>.zip, in pet-packs/ (never committed: .gitignore):
//   <repo>-pet-pack-<YYYYMMDD>/
//     README.md                         what it is, how to open it, what works alone and what needs a farm
//     open-pet-program-20261020.html    double-click: opens its pet program page
//     pet-pack-20261020.json            every file with its SHA-256, the pet's version and commit, and its needs
//     <repo>/                           the pet's repo at that version (git, read only)
//     astras-pet-os/                    only this pet's pictures, its pet program page and its Markdown pet, at the
//                                       places a farm keeps them, so its own programs find them (..\astras-pet-os\)
// The page is the spawner's page for the pet (one source); every relative link in it that is not in the pack goes to
// Astra's PetOS's public site instead, so nothing in the pack points at a missing file.
// Only animals, never the host (install Astra's PetOS for that), never a pet whose entry says `stays_private`, and a
// private repo only with --private (the zip then holds private code: share it only with people you trust). The pet's
// files are scanned (scripts/public-safety-20261014.mjs) and the pack stops on a key, a token, a personal folder path or
// a local service address. It reads GitHub (a clone, with the PC's own git sign-in) and writes only its out folder.
// Node built-ins only. Claude Opus 5.5 (claude-opus-5-5), 2026-10-20.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, posix, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateRawSync, inflateRawSync } from 'node:zlib';
import { assertAnimal } from './animal-guard-20261013.mjs';
import { repoUrl, upstream } from './farm-owner-20261020.mjs';
import { readSpawnerSources, spawnerPages, buildPetProgramPage, pagePath } from './pet-program-pages-20261018.mjs';
import { buildMarkdownPet, petFacts, petPath } from './markdown-pets-20261019.mjs';
import { assertPublic, findSensitive } from './public-safety-20261014.mjs';

export const TOOL_LABEL = 'the-farm-v1.0-pet-packs-v1.0';
export const DATE = '20261020';
export const SCHEMA = 'astras-pet-os-pet-pack-v1';
export const OUT = 'pet-packs';
export const HUB_DIR = upstream().hub; // the folder name a farm's own programs look for next to them
export const OPENER = `open-pet-program-${DATE}.html`;
export const MANIFEST = `pet-pack-${DATE}.json`;
export const packName = (repo, date) => `${repo}-pet-pack-${date}`;
const MOODS = ['idle', 'blink', 'happy', 'curious', 'worried', 'sad', 'sick', 'alarmed', 'sleep'];
// Hub files a page may bring along: pictures and the page's own stylesheet and scripts, nothing else.
const ASSET = /\.(?:png|jpe?g|gif|webp|svg|ico|css|js|json|woff2?)$/i;
const ASSET_DIRS = ['art/', 'desktop-art/', 'apps/'];

// ---------- A zip file, with Node's own zlib (no dependencies) ----------

const CRC = new Uint32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
export function crc32(buf) { let c = 0xffffffff; for (const b of buf) c = CRC[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }

/** A zip of `files` ({ path: Buffer | string }, in that order), every entry dated `date` (YYYYMMDD) at noon, so the
 *  same files always give the same zip. Names are UTF-8. */
export function zip(files, date = DATE) {
  const y = Number(date.slice(0, 4)), m = Number(date.slice(4, 6)), d = Number(date.slice(6, 8));
  const dosTime = 12 << 11, dosDate = ((y - 1980) << 9) | (m << 5) | d;
  const local = [], central = [];
  let offset = 0;
  for (const [name, body] of Object.entries(files)) {
    const data = Buffer.isBuffer(body) ? body : Buffer.from(body, 'utf8');
    const packed = deflateRawSync(data, { level: 9 });
    const store = packed.length >= data.length;
    const out = store ? data : packed;
    const nameBuf = Buffer.from(name, 'utf8');
    const crc = crc32(data);
    const head = Buffer.alloc(30);
    head.writeUInt32LE(0x04034b50, 0); head.writeUInt16LE(20, 4); head.writeUInt16LE(0x0800, 6); head.writeUInt16LE(store ? 0 : 8, 8);
    head.writeUInt16LE(dosTime, 10); head.writeUInt16LE(dosDate, 12); head.writeUInt32LE(crc, 14);
    head.writeUInt32LE(out.length, 18); head.writeUInt32LE(data.length, 22); head.writeUInt16LE(nameBuf.length, 26); head.writeUInt16LE(0, 28);
    local.push(head, nameBuf, out);
    const dir = Buffer.alloc(46);
    dir.writeUInt32LE(0x02014b50, 0); dir.writeUInt16LE(20, 4); dir.writeUInt16LE(20, 6); dir.writeUInt16LE(0x0800, 8); dir.writeUInt16LE(store ? 0 : 8, 10);
    dir.writeUInt16LE(dosTime, 12); dir.writeUInt16LE(dosDate, 14); dir.writeUInt32LE(crc, 16); dir.writeUInt32LE(out.length, 20);
    dir.writeUInt32LE(data.length, 24); dir.writeUInt16LE(nameBuf.length, 28); dir.writeUInt32LE(offset, 42);
    central.push(dir, nameBuf);
    offset += 30 + nameBuf.length + out.length;
  }
  const size = central.reduce((n, b) => n + b.length, 0);
  const end = Buffer.alloc(22);
  const count = Object.keys(files).length;
  if (count > 0xffff || offset > 0xffffffff) throw new Error('This pet pack is too big for a plain zip (65,535 files or 4 GB).');
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(count, 8); end.writeUInt16LE(count, 10); end.writeUInt32LE(size, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...local, ...central, end]);
}

/** The files in a zip this tool wrote: { path: Buffer }. It checks every file's CRC. */
export function unzip(buf) {
  const end = buf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  if (end < 0) throw new Error('Not a zip file.');
  const count = buf.readUInt16LE(end + 10);
  let at = buf.readUInt32LE(end + 16);
  const files = {};
  for (let i = 0; i < count; i++) {
    if (buf.readUInt32LE(at) !== 0x02014b50) throw new Error('A broken zip directory.');
    const method = buf.readUInt16LE(at + 10), crc = buf.readUInt32LE(at + 16), packed = buf.readUInt32LE(at + 20);
    const nameLen = buf.readUInt16LE(at + 28), extra = buf.readUInt16LE(at + 30), note = buf.readUInt16LE(at + 32), start = buf.readUInt32LE(at + 42);
    const name = buf.subarray(at + 46, at + 46 + nameLen).toString('utf8');
    const body = buf.subarray(start + 30 + buf.readUInt16LE(start + 26) + buf.readUInt16LE(start + 28)).subarray(0, packed);
    const data = method === 8 ? inflateRawSync(body) : Buffer.from(body);
    if (crc32(data) !== crc) throw new Error(`${name}: its CRC does not match.`);
    files[name] = data;
    at += 46 + nameLen + extra + note;
  }
  return files;
}

// ---------- What a pet needs (pets.json `needs`, Astra 2026-10-20: one place) ----------

const KINDS = ['os', 'pets', 'core', 'programs'];

/** Every problem with the `needs` of every registered and pipeline pet: unknown kinds, a needed pet that is not on the
 *  farm, a program that is not a program on the System Map, a missing reason. [] when all is well. */
export function needsProblems(registry, extra) {
  const key = registry.needs_key || {};
  const how = new Set(Object.keys(key.how || {}));
  const os = new Set(Object.keys(key.os || {}));
  const core = new Set(Object.keys(key.core || {}));
  const all = [...(registry.pets || []), ...(registry.pipeline || [])];
  const repos = new Set(all.map((p) => p.repo));
  const programs = new Set((extra.nodes || []).filter((n) => n.type === 'program').map((n) => n.id));
  const out = [];
  for (const p of all) {
    const n = p.needs;
    if (!n || typeof n !== 'object' || Array.isArray(n)) { out.push(`${p.repo}: no needs (pets.json, needs_key says how to write them)`); continue; }
    for (const k of Object.keys(n)) if (!KINDS.includes(k)) out.push(`${p.repo}: unknown kind of need "${k}" (known: ${KINDS.join(', ')})`);
    for (const k of KINDS) if (!Array.isArray(n[k])) out.push(`${p.repo}: needs.${k} is not a list`);
    if (KINDS.some((k) => !Array.isArray(n[k]))) continue;
    for (const o of n.os) if (!os.has(o)) out.push(`${p.repo}: unknown os "${o}" (known: ${[...os].join(', ')})`);
    const item = (kind, field, i, known, what) => {
      const name = i?.[field];
      if (!known.has(name)) out.push(`${p.repo}: needs.${kind} names ${JSON.stringify(name)}, which is ${what}`);
      if (!how.has(i?.how)) out.push(`${p.repo}: needs.${kind} ${name}: unknown how "${i?.how}" (known: ${[...how].join(', ')})`);
      if (!String(i?.why || '').trim()) out.push(`${p.repo}: needs.${kind} ${name}: say why`);
    };
    for (const i of n.pets) { item('pets', 'repo', i, repos, 'not a registered or pipeline pet on this farm'); if (i?.repo === p.repo) out.push(`${p.repo}: needs itself`); }
    for (const i of n.core) item('core', 'part', i, core, `not a part of the core in needs_key (known: ${[...core].join(', ')})`);
    for (const i of n.programs) item('programs', 'node', i, programs, 'not a third-party program on the System Map (system-map.json, type program)');
    for (const k of ['pets', 'core', 'programs']) {
      const ids = n[k].map((i) => i?.repo || i?.part || i?.node);
      if (new Set(ids).size !== ids.length) out.push(`${p.repo}: needs.${k} names one twice`);
    }
  }
  return out;
}

/** A pet's needs with names a person reads: { os, pets, core, programs, required, optional }. */
export function resolveNeeds(registry, extra, repo) {
  const all = [...(registry.pets || []), ...(registry.pipeline || [])];
  const entry = all.find((p) => p.repo === repo);
  const n = entry?.needs || { os: [], pets: [], core: [], programs: [] };
  const key = registry.needs_key || {};
  const nodes = new Map((extra.nodes || []).map((x) => [x.id, x]));
  const pets = n.pets.map((i) => ({ kind: 'pet', id: i.repo, name: all.find((p) => p.repo === i.repo)?.pet || i.repo, how: i.how, why: i.why }));
  const core = n.core.map((i) => ({ kind: 'core', id: i.part, name: key.core?.[i.part]?.name || i.part, how: i.how, why: i.why }));
  const programs = n.programs.map((i) => ({ kind: 'program', id: i.node, name: nodes.get(i.node)?.name || i.node, how: i.how, why: i.why }));
  const os = n.os.map((o) => ({ kind: 'os', id: o, name: String(key.os?.[o] || o).replace(/\.$/, '') }));
  const every = [...pets, ...core, ...programs];
  return { os, pets, core, programs, required: every.filter((i) => i.how === 'required'), optional: every.filter((i) => i.how === 'optional') };
}

// ---------- Which pets can be packed ----------

/** Why `repo` cannot be packed on this farm, or '' when it can. `allowPrivate` is --private. */
export function packRefusal(registry, repo, { allowPrivate = false } = {}) {
  const entry = [...(registry.pets || []), ...(registry.pipeline || [])].find((p) => p.repo === repo);
  if (!entry) return `${repo} is not a registered or pipeline pet on this farm (pets.json)`;
  if (entry.role === 'host') return `${entry.pet} is the core of Astra's PetOS: install it with the installer (INSTALL.md), not as a pet pack`;
  if (entry.stays_private) return `${entry.pet} stays private, so it is never packed: ${entry.stays_private}`;
  if (entry.visibility === 'private' && !allowPrivate) return `${entry.pet}'s repo is private: a pack would hand its code to whoever gets the zip. Add --private if that is what you want (share it only with people you trust)`;
  return '';
}

// ---------- The pack's files ----------

const isRelative = (u) => !!u && !/^(?:[a-z][a-z0-9+.-]*:|\/\/|#|\/)/i.test(u);
const split = (u) => { const m = /^([^?#]*)([?#].*)?$/.exec(u); return [m[1], m[2] || '']; };

/** Every relative src and href in an HTML text (page path `from`, relative to the hub), rewritten by `decide(hubPath)`:
 *  keep (the file is in the pack), or a full address to use instead. */
export function relinkHtml(html, from, decide) {
  return html.replace(/\b(src|href)="([^"]*)"/g, (all, attr, url) => {
    const raw = url.replace(/&amp;/g, '&');
    if (!isRelative(raw)) return all;
    const [path, rest] = split(raw);
    if (!path) return all;
    const hubPath = posix.normalize(posix.join(posix.dirname(from), decodeURI(path)));
    if (hubPath.startsWith('../')) return all; // outside the hub: not the pack's to change
    const to = decide(hubPath);
    return to === true ? all : `${attr}="${String(to + rest).replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"`;
  });
}

/** The hub paths of every picture of this pet: its desktop drawing, registered frames, draft frames, icon and the app
 *  icons its Windows programs build with. Never a private drawing (Claude Bot's stays in his own repo). */
export function petPictures(reg, { drafts, exists, list }) {
  const out = new Set();
  const privateArt = new Set((drafts?.pets || []).filter((d) => d.private).map((d) => d.id));
  const draft = (drafts?.pets || []).find((d) => d.repo === reg.repo || d.id === reg.repo || (reg.art && d.id === reg.art) || d.name === reg.pet);
  const ids = [...new Set([reg.art, reg.repo, draft?.id].filter(Boolean))].filter((id) => !privateArt.has(id));
  const mood = (n) => new RegExp(`^(?:${MOODS.join('|')})(?:-\\d{8})?\\.png$`).test(n);
  for (const id of ids) {
    for (const n of list(`art/frames/${id}`)) if (mood(n)) out.add(`art/frames/${id}/${n}`);
    for (const n of list(`desktop-art/${id}`)) if (/\.(?:png|json)$/.test(n)) out.add(`desktop-art/${id}/${n}`);
    for (const n of list(`art/drafts/${id}`)) if (mood(n)) out.add(`art/drafts/${id}/${n}`);
  }
  for (const n of list('art/icons')) if (new RegExp(`^${reg.repo}-\\d{8}\\.png$`).test(n)) out.add(`art/icons/${n}`);
  for (const n of list(`art/app-icons/${reg.repo}`)) if (ASSET.test(n)) out.add(`art/app-icons/${reg.repo}/${n}`);
  return [...out].filter(exists).sort();
}

const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');

/** The pack's README: plain words, what works alone and what needs a farm. */
export function packReadme(f) {
  const { d, needs, source, date, hubPrivate } = f;
  const day = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6)}`;
  const home = d.assigned ? d.home : `pet-program-${d.number}`;
  const page = `${HUB_DIR}/${pagePath(d.repo)}`;
  const md = `${HUB_DIR}/${petPath(d.repo)}`;
  const progs = (how) => needs.programs.filter((p) => p.how === how);
  const os = needs.os.length ? needs.os.map((o) => o.name).join(' or ') : null;
  const desktop = needs.core.find((c) => c.id === 'startup-star');
  const otherCore = needs.core.filter((c) => c.id !== 'startup-star');
  const alone = [
    `**Its pet program page**, ${home}, with its pictures: every tool panel, the lights and the session notes. What you change there is saved in that browser only.`,
    `**Its Markdown pet** (\`${md}\`): give it to an AI and say *"Read this file and help me the way this pet does. Follow its rules."*`,
    `**Its own code** in \`${d.repo}/\`${os ? `, which runs on ${os}` : ''}. Its README says how to run it.`,
    ...(f.app ? [`**Today's app** (\`${HUB_DIR}/${f.app}\`), from the page's **Open today's app** button.`] : []),
  ];
  const farm = [
    ...(desktop ? [`**Its desktop pet** (${desktop.how}): ${desktop.why} A pack has no desktop pets: [install Astra's PetOS](${upstream().blob}/INSTALL.md) for them.`] : []),
    ...otherCore.map((c) => `**${c.name}** (${c.how}): ${c.why}`),
    `**Its moods and self-audits** come from the Friendly Farmer's daily round, which runs only on a farm. In a pack the pet's face rests.`,
    ...needs.pets.map((p) => `**${p.name}** (\`${p.id}\`, ${p.how}): ${p.why} It is not in this pack: build its own pet pack, or install a farm.`),
    `**The System Map and other pets' pages**: their links open on Astra's PetOS's public site (${upstream().pages}).${hubPrivate ? ' The hub is private now, so they answer only once it is public again.' : ''}`,
  ];
  const programs = [
    ...progs('required').map((p) => `**${p.name}** (required): ${p.why}`),
    ...progs('optional').map((p) => `**${p.name}** (optional): ${p.why}`),
  ];
  const bullets = (xs) => xs.map((x) => `- ${x}`).join('\n');
  return assertPublic(`# ${d.pet} pet pack

*By Astra. One pet from Astra's PetOS, without the whole system. Built ${day} by the Friendly Farmer's pet-packs tool (\`${TOOL_LABEL}\`).*

**${d.pet}** looks after **${home}** (pet program #${d.number}). ${d.summary || d.job}

## Open it

1. Unzip it (right-click the zip, then **Extract All**). Nothing is installed.
2. Double-click **\`${OPENER}\`**: ${home}'s pet program page opens in your browser.
3. Want help from an AI? Give it \`${md}\`.
4. Want to run the pet's own program? Open \`${d.repo}/\` and follow its README.

## What is inside

| File or folder | What it is |
| --- | --- |
| \`${OPENER}\` | Opens the pet program page (\`${page}\`). |
| \`${d.repo}/\` | ${d.pet}'s repo, [${source.repo}](${source.url}), at ${source.tag ? `tag \`${source.tag}\`, ` : ''}commit \`${source.commit.slice(0, 7)}\`${source.ref ? ` (${source.ref})` : ''}. |
| \`${HUB_DIR}/\` | Only ${d.pet}'s pictures, its pet program page and its Markdown pet, in the places a farm keeps them, so its own programs find them. It is **not** the whole Astra's PetOS. |
| \`${MANIFEST}\` | Everything in this pack, with a SHA-256 for each file, the version, and what ${d.pet} needs. |

## What works on its own

${bullets(alone)}

## What needs a farm

${bullets(farm)}

## Programs it uses (not included: install them yourself)

${programs.length ? bullets(programs) : os ? `- None, apart from ${os}.` : '- None: everything here opens in a web browser.'}
${f.privateData ? `\n${d.pet} is a private pet: its data never leaves its owner's computer, and no other pet reads it. Its data is never in a pack.\n` : ''}${f.privateRepo ? `\n**This pack holds code from a private repo.** Share it only with people you trust.\n` : ''}
## Pictures

Copied in when this pack was built, from Astra's PetOS's one art source (\`${upstream().repo}\`${f.hubCommit ? ` at commit \`${f.hubCommit.slice(0, 7)}\`` : ''}). They are never committed to ${d.pet}'s repo. Drawings are drafts unless Astra approved them.

## Limits

- The pack is not signed yet: check each file against the SHA-256 in \`${MANIFEST}\`.
- The Friendly Farmer cannot add a pack to a farm yet (that is next: \`farm.lock\`).
- A pack is a copy at one version. It does not update itself.

The license is in \`${d.repo}/LICENSE\`.
`, `${d.repo} pet pack README`);
}

/** The page that opens the pet program page with one double-click. */
export function opener(d) {
  const page = `${HUB_DIR}/${pagePath(d.repo)}`;
  const home = d.assigned ? d.home : `pet-program-${d.number}`;
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(home)} · ${esc(d.pet)}</title>
<meta http-equiv="refresh" content="0; url=${esc(page)}">
</head>
<body style="background:#26272b;color:#e6e0c9;font:16px/1.5 system-ui,sans-serif;margin:16px">
<p><a href="${esc(page)}" style="color:#7df9ff">Open ${esc(home)}, ${esc(d.pet)}'s pet program</a></p>
</body>
</html>
`;
}

/** Everything in the pack except the repo's own files: { files: { path in the hub folder: Buffer|string }, app, page }.
 *  `src` is readSpawnerSources(root), `root` the hub. Pure apart from reading the hub's own files. */
export function hubPart(src, repo, root = '.') {
  const pages = spawnerPages(src);
  const d = pages.find((p) => p.repo === repo);
  if (!d) throw new Error(`${repo} has no pet program page (it is not a registered or pipeline pet).`);
  const reg = [...src.registry.pets, ...src.registry.pipeline].find((p) => p.repo === repo);
  const files = new Map();
  const readHub = (p) => readFileSync(join(root, p));
  const queue = [];
  const decideFor = () => (hubPath) => {
    if (files.has(hubPath)) return true;
    if (ASSET.test(hubPath) && ASSET_DIRS.some((dir) => hubPath.startsWith(dir)) && src.exists(hubPath)) {
      files.set(hubPath, readHub(hubPath));
      if (/\.css$/i.test(hubPath)) queue.push(hubPath);
      return true;
    }
    return `${upstream().pages}/${hubPath}`;
  };
  const page = pagePath(repo);
  files.set(page, ''); // the page itself, filled in below
  // Today's app, when it is a page of the hub: it comes along, so the page's button opens it.
  const appPath = d.appHref && !/^https?:/.test(d.appHref) ? posix.normalize(posix.join(posix.dirname(page), d.appHref)) : null;
  const app = appPath && src.exists(appPath) ? appPath : null;
  if (app) files.set(app, '');
  files.set(page, relinkHtml(buildPetProgramPage(d), page, decideFor()));
  if (app) files.set(app, relinkHtml(readHub(app).toString('utf8'), app, decideFor()));
  // A stylesheet's url(...) pictures come too (today the page's has only data: pictures).
  for (const css of queue) {
    const text = files.get(css).toString('utf8').replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g, (all, q, url) => {
      if (!isRelative(url)) return all;
      const to = decideFor()(posix.normalize(posix.join(posix.dirname(css), split(url)[0])));
      return to === true ? all : `url(${q}${to}${q})`;
    });
    files.set(css, text);
  }
  for (const p of petPictures(reg, src)) if (!files.has(p)) files.set(p, readHub(p));
  // Its Markdown pet, pointing at the pack's own page and picture.
  const facts = petFacts(d);
  const mdPath = petPath(repo);
  const local = (p) => posix.relative(posix.dirname(mdPath), p);
  const md = buildMarkdownPet({ ...facts, programPage: `${local(page)} (in this pack; online: ${facts.programPage})`,
    app: app ? local(app) : facts.app, picture: d.art?.frames?.idle && files.has(d.art.frames.idle) ? local(d.art.frames.idle) : facts.picture });
  files.set(mdPath, assertPublic(md, mdPath));
  return { d, reg, app, page, files };
}

// ---------- The pet's repo at a version (git, read only) ----------

const gitIn = (gitDir) => (args, input) => execFileSync('git', ['--git-dir', gitDir, ...args], { input, maxBuffer: 1 << 30, stdio: ['pipe', 'pipe', 'pipe'] });

/** Every file of the repo at `ref` (raw bytes, as committed): { commit, tag, files: { path: Buffer }, skipped: [] }.
 *  Links and submodules are skipped and named. */
export function repoAt(gitDir, ref = 'HEAD') {
  const git = gitIn(gitDir);
  const commit = git(['rev-parse', '--verify', `${ref}^{commit}`]).toString('utf8').trim();
  let tag = null;
  try { tag = git(['describe', '--tags', '--exact-match', commit]).toString('utf8').trim() || null; } catch { /* no tag here */ }
  const files = {}, skipped = [];
  const entries = git(['ls-tree', '-r', '-z', '--full-tree', commit]).toString('utf8').split('\0').filter(Boolean)
    .map((line) => { const [meta, path] = line.split('\t'); const [mode, type, sha] = meta.split(' '); return { mode, type, sha, path }; });
  const blobs = [];
  for (const e of entries) {
    if (e.type === 'blob' && e.mode !== '120000') blobs.push(e);
    else skipped.push(`${e.path} (${e.mode === '120000' ? 'a link' : e.type === 'commit' ? 'a submodule' : e.type})`);
  }
  for (let i = 0; i < blobs.length; i += 400) {
    const chunk = blobs.slice(i, i + 400);
    const out = git(['cat-file', '--batch'], chunk.map((b) => b.sha).join('\n') + '\n');
    let at = 0;
    for (const b of chunk) {
      const eol = out.indexOf(10, at);
      const size = Number(out.subarray(at, eol).toString('utf8').split(' ')[2]);
      files[b.path] = Buffer.from(out.subarray(eol + 1, eol + 1 + size));
      at = eol + 1 + size + 1;
    }
  }
  return { commit, tag, files, skipped };
}

/** What in the repo's files must stop a pack: secrets, personal folder paths, local service addresses (a local network
 *  address is often teaching material, so it is only noted, as the pet-privatizer does). Never the text found. */
export function scanFiles(files) {
  const stop = [], notes = [];
  for (const [path, buf] of Object.entries(files)) {
    if (buf.subarray(0, 8000).includes(0)) continue; // binary
    for (const hit of findSensitive(buf.toString('utf8'))) (hit.secret || hit.kind !== 'local network address' ? stop : notes).push({ ...hit, file: path });
  }
  return { stop, notes };
}

/** One pet pack: { name, zip: Buffer, manifest, files }. `repoFiles` is repoAt(...) for the pet's repo. */
export function buildPack(src, repo, { repoFiles, ref = null, date = DATE, root = '.', allowPrivate = false, hubCommit = null } = {}) {
  const no = packRefusal(src.registry, repo, { allowPrivate });
  if (no) throw new Error(`Not packed: ${no}.`);
  assertAnimal(src.registry, repo, 'pack');
  const scan = scanFiles(repoFiles.files);
  if (scan.stop.length) {
    throw new Error(`Not packed: ${repo} at ${repoFiles.commit.slice(0, 7)} has ${scan.stop.slice(0, 6).map((h) => `${h.count} ${h.kind}${h.count > 1 ? 's' : ''} in ${h.file}`).join('; ')}${scan.stop.length > 6 ? `; and ${scan.stop.length - 6} more` : ''}. Take them out of the repo (and revoke any key) first.`);
  }
  const part = hubPart(src, repo, root);
  const extra = src.extra;
  const needs = resolveNeeds(src.registry, extra, repo);
  const host = src.registry.pets.find((p) => p.role === 'host');
  const source = { repo: `${repoUrl(src.registry, repo).replace('https://github.com/', '')}`, url: repoUrl(src.registry, repo), ref, commit: repoFiles.commit, tag: repoFiles.tag };
  let version = null;
  try { version = JSON.parse(repoFiles.files['pet.json']?.toString('utf8') || 'null')?.version || null; } catch { /* a pet.json that is not JSON says nothing */ }
  const top = packName(repo, date);
  const facts = { d: part.d, needs, source, date, app: part.app, hubPrivate: host?.visibility === 'private', hubCommit,
    privateData: part.d.isPrivate, privateRepo: part.reg.visibility === 'private' };
  const body = new Map();
  body.set(`${top}/README.md`, packReadme(facts));
  body.set(`${top}/${OPENER}`, opener(part.d));
  for (const [p, b] of Object.entries(repoFiles.files)) body.set(`${top}/${repo}/${p}`, b);
  for (const [p, b] of part.files) body.set(`${top}/${HUB_DIR}/${p}`, b);
  const list = [...body].map(([p, b]) => { const buf = Buffer.isBuffer(b) ? b : Buffer.from(b, 'utf8'); return { path: p.slice(top.length + 1), sha256: sha256(buf), bytes: buf.length }; });
  const manifest = {
    schema: SCHEMA, tool: TOOL_LABEL, built: `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6)}`,
    pet: part.d.pet, repo, program: part.d.home, number: part.d.number, stage: part.d.stage,
    source: { ...source, version }, skipped: repoFiles.skipped,
    pictures_from: { repo: upstream().repo, commit: hubCommit, note: 'Copied in when the pack was built; never committed to the pet\'s repo (one art source, PET-FILES.md).' },
    opens: `${HUB_DIR}/${part.page}`, markdown_pet: `${HUB_DIR}/${petPath(repo)}`,
    // As pets.json writes it, with each name: what the Friendly Farmer reads when he adds this pet to a farm (farm.lock, next).
    needs: { os: needs.os.map((o) => o.id), pets: needs.pets.map((i) => ({ repo: i.id, name: i.name, how: i.how, why: i.why })),
      core: needs.core.map((i) => ({ part: i.id, name: i.name, how: i.how, why: i.why })), programs: needs.programs.map((i) => ({ node: i.id, name: i.name, how: i.how, why: i.why })) },
    scan_notes: scan.notes.map((h) => ({ kind: h.kind, count: h.count, file: h.file })),
    files: list,
  };
  body.set(`${top}/${MANIFEST}`, JSON.stringify(manifest, null, 2) + '\n');
  const files = Object.fromEntries(body);
  return { name: `${top}.zip`, zip: zip(files, date), manifest, files };
}

/** What `plan` prints for one pet: whether it can be packed, what it needs, and what would come from the hub. */
export function planPack(src, repo, { allowPrivate = false } = {}) {
  const no = packRefusal(src.registry, repo, { allowPrivate });
  if (no) return { repo, ok: false, why: no };
  const part = hubPart(src, repo);
  return { repo, ok: true, needs: resolveNeeds(src.registry, src.extra, repo), hubFiles: [...part.files.keys()], app: part.app };
}

// ---------- The command line ----------

const denverToday = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Denver', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()).replace(/-/g, '');

function cloneFor(registry, repo, ref) {
  const dir = mkdtempSync(join(tmpdir(), 'pet-packs-'));
  execFileSync('git', ['clone', '--bare', '--quiet', `${repoUrl(registry, repo)}.git`, join(dir, 'src.git')], { stdio: ['ignore', 'pipe', 'pipe'] });
  return { gitDir: join(dir, 'src.git'), done: () => rmSync(dir, { recursive: true, force: true }), ref: ref || 'HEAD' };
}

function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  const opt = (name) => { const i = rest.indexOf(name); return i >= 0 ? rest.splice(i, 2)[1] : null; };
  const ref = opt('--ref'), from = opt('--from'), out = opt('--out') || OUT, date = opt('--date') || denverToday();
  const allowPrivate = rest.includes('--private');
  const repos = rest.filter((a) => !a.startsWith('--'));
  if (!/^\d{8}$/.test(date)) throw new Error('--date is YYYYMMDD.');
  const root = fileURLToPath(new URL('..', import.meta.url));
  process.chdir(root);
  const src = { ...readSpawnerSources('.') };
  if (cmd === 'plan') {
    if (!repos.length) throw new Error('Name the pets to plan, by repo (pets.json).');
    for (const r of repos) {
      const p = planPack(src, r, { allowPrivate });
      if (!p.ok) { console.log(`${r}: not packed: ${p.why}.`); continue; }
      const say = (xs) => xs.map((i) => `${i.name}${i.kind === 'pet' ? ` (${i.id})` : ''}`).join(', ') || 'nothing';
      console.log(`${r}: can be packed. Needs: ${say(p.needs.required)}; optional: ${say(p.needs.optional)}${p.needs.os.length ? `; runs on ${p.needs.os.map((o) => o.name).join(' or ')}` : ''}. From the hub: ${p.hubFiles.length} files${p.app ? `, with today's app (${p.app})` : ''}.`);
    }
  } else if (cmd === 'build') {
    if (!repos.length) throw new Error('Name the pets to pack, by repo (pets.json).');
    let hubCommit = null;
    try { hubCommit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { /* not a git checkout */ }
    mkdirSync(out, { recursive: true });
    for (const r of repos) {
      const no = packRefusal(src.registry, r, { allowPrivate });
      if (no) { console.log(`${r}: not packed: ${no}.`); process.exitCode = 1; continue; }
      if (from && repos.length > 1) throw new Error('--from names one pet\'s clone: build one pet at a time with it.');
      const clone = from ? { gitDir: execFileSync('git', ['-C', from, 'rev-parse', '--absolute-git-dir'], { encoding: 'utf8' }).trim(), done: () => {}, ref: ref || 'HEAD' } : cloneFor(src.registry, r, ref);
      try {
        const repoFiles = repoAt(clone.gitDir, clone.ref);
        const pack = buildPack(src, r, { repoFiles, ref: ref || 'the default branch', date, allowPrivate, hubCommit });
        writeFileSync(join(out, pack.name), pack.zip);
        console.log(`${r}: ${join(out, pack.name)} (${pack.manifest.files.length} files, ${r} at ${repoFiles.commit.slice(0, 7)}${repoFiles.tag ? `, ${repoFiles.tag}` : ''}).`);
      } catch (e) { console.log(`${r}: ${e.message}`); process.exitCode = 1; } finally { clone.done(); }
    }
  } else {
    const head = readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n');
    console.log(head.slice(0, head.findIndex((l) => !l.startsWith('//'))).join('\n').replace(/^\/\/ ?/gm, ''));
  }
}

// Real paths on both sides, so it runs through the Documents\Astra's PetOS junction too (the pet-privatizer's fix).
const real = (p) => { try { return realpathSync(p); } catch { return resolve(p); } };
if (process.argv[1] && real(fileURLToPath(import.meta.url)) === real(resolve(process.argv[1]))) {
  try { main(); } catch (e) { console.error(e.message); process.exitCode = 1; }
}
