// The farm lock (Astra, 2026-10-21: "All recommended on the six farm lock questions"; Part 5 of
// docs/farm-owner-and-single-pets-20261019.md, card 058; the proposal is docs/farm-lock-20261021.md). It says exactly
// which pets a farm runs: where each one's entry came from with a SHA-256 of it, which pets need which, and what each
// still needs that the Friendly Farmer cannot add. Developers call it a lockfile; the Friendly Farmer is the package
// manager, and `needs` in pets.json are the dependencies.
//   - It lives on the computer, in the farm's own folder next to the install receipt, and is never committed (answer 1;
//     .gitignore lists it). Its paths are relative to the farm folder, so it holds no personal folder path.
//   - Its name follows Astra's file-name rule (answer 2): farm-lock-20261021.json.
//   - A pet that needs a program or core part the Farmer cannot add still comes in, and the lock marks it (answer 4).
//   - A pet that other pets on the farm require is not taken away without --with-dependents (answer 5).
//   - The installer ticks the pets a picked pet needs, with this same check (answer 6).
// Three programs write it: the installer (installer/install-astras-pet-os-20261014.ps1, whose PowerShell twin of the
// functions below is tested to give the same lock), the Linux farm setup (scripts/farm-setup-20261019.mjs) and the
// Friendly Farmer's farm-pets tool (scripts/farm-pets-20261021.mjs). Node built-ins only.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-21.
import { createHash } from 'node:crypto';
import { farmOwner } from './animal-guard-20261013.mjs';
import { ownerOf } from './farm-owner-20261020.mjs';

export const LOCK = 'farm-lock-20261021.json';
export const SCHEMA = 'astras-pet-os-farm-lock-v1';
// An installed Windows farm keeps the release's own pets.json and draft list here, unfiltered, so a pet can be added
// later without the unzipped release (the farm's own pets.json holds only the pets on it).
export const CATALOG = 'farm-catalog';

const entries = (registry) => [...(registry?.pets || []), ...(registry?.pipeline || [])];

// ---------- One text for one value, in Node and in the installer's PowerShell ----------

/** JSON with every object's keys in order (by UTF-16 code unit) and no spaces. pets.json holds whole numbers only. */
export function canonicalJson(value) {
  if (value === null || typeof value !== 'object') {
    if (typeof value === 'number' && !Number.isInteger(value)) throw new Error(`canonicalJson: ${value} is not a whole number`);
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  return `{${Object.keys(value).sort().map((k) => `${JSON.stringify(k)}:${canonicalJson(value[k])}`).join(',')}}`;
}

/** The SHA-256 of a pet's entry (its pets.json entry, or its line in the draft list), as written on the farm. */
export const entryHash = (entry) => createHash('sha256').update(canonicalJson(entry), 'utf8').digest('hex');

/** This computer, in needs_key's words (`os`). */
export const thisOs = (platform = process.platform) => ({ win32: 'windows', linux: 'linux', darwin: 'macos' })[platform] || platform;

/** Now in America/Denver, as Astra's records are dated: 2026-10-21T22:30:00-06:00. */
export function denverNow(date = new Date()) {
  const at = new Date(Math.floor(date.getTime() / 1000) * 1000);
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Denver', hourCycle: 'h23', year: 'numeric',
    month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).formatToParts(at).map((x) => [x.type, x.value]));
  const offset = Math.round((Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second) - at.getTime()) / 60000);
  const pad = (n) => String(Math.abs(n)).padStart(2, '0');
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}${offset < 0 ? '-' : '+'}${pad(Math.trunc(offset / 60))}:${pad(offset % 60)}`;
}

// ---------- What a pet needs ----------

/** A pet's `needs` from pets.json (registered or pipeline), or null when its entry writes none. */
export const needsOf = (registry, repo) => entries(registry).find((p) => p.repo === repo)?.needs || null;

const requiredPets = (needs) => (needs?.pets || []).filter((n) => n.how === 'required').map((n) => n.repo);

/**
 * The pets that must come too when `picks` (ids) come to a farm: every required pet, all the way down (answer 6).
 * `pets` is the farm's list of pets it may have (farmPets of the release, each with its `needs`); `here` the ids already
 * on the farm. Returns { keep: ids coming, in the list's order; neededBy: { id: [repos that need it] } for the ones that
 * come only as a need; stops: why it cannot go ahead }. Optional pets never pull anything in.
 */
export function requiredClosure(pets, picks, here = []) {
  const byRepo = new Map(pets.map((p) => [p.repo, p]));
  const on = new Set(here);
  const coming = new Set(), neededBy = {}, stops = [];
  const visit = (pet, path) => {
    for (const repo of requiredPets(pet.needs)) {
      const next = byRepo.get(repo);
      if (path.includes(repo)) { stops.push(`a loop of required pets: ${[...path, repo].join(' > ')}`); continue; }
      if (!next) { stops.push(`${pet.name} needs ${repo}, which is not one of this farm's pets (its release or hub copy): get it with a pet pack, or register it first`); continue; }
      if (on.has(next.id)) continue;
      (neededBy[next.id] ||= []).includes(pet.repo) || neededBy[next.id].push(pet.repo);
      if (coming.has(next.id)) continue;
      coming.add(next.id);
      visit(next, [...path, repo]);
    }
  };
  for (const id of picks) {
    const pet = pets.find((p) => p.id === id);
    if (!pet || on.has(id)) continue;
    coming.add(id);
    visit(pet, [pet.repo]);
  }
  for (const id of picks) delete neededBy[id];
  return { keep: pets.filter((p) => coming.has(p.id)).map((p) => p.id), neededBy, stops };
}

/** The farm's core parts, as needs_key names them: { 'startup-star': bool, 'daily-round': bool }. */
export function coreParts({ kind, os, mode, round = false }) {
  return { 'startup-star': os === 'windows' && mode !== 'developer', 'daily-round': kind === 'hub copy' && round };
}

/**
 * What a pet needs that this farm does not have and the Friendly Farmer cannot add (answer 4: it still comes in, and the
 * lock marks it): its own program on another computer, a required core part the farm lacks, and each required
 * third-party program, which he cannot check. [{ kind, id, name, state }].
 */
export function missingNeeds(needs, { os, parts }, registry, extra) {
  if (!needs) return [];
  const key = registry?.needs_key || {};
  const nodes = new Map((extra?.nodes || []).map((n) => [n.id, n.name]));
  const out = [];
  if ((needs.os || []).length && !needs.os.includes(os)) {
    out.push({ kind: 'os', id: needs.os.join(','), name: needs.os.map((o) => String(key.os?.[o] || o).replace(/\.$/, '')).join(' or '), state: 'not this computer' });
  }
  for (const c of needs.core || []) {
    if (c.how === 'required' && !parts[c.part]) out.push({ kind: 'core', id: c.part, name: key.core?.[c.part]?.name || c.part, state: 'not on this farm' });
  }
  for (const p of needs.programs || []) {
    if (p.how === 'required') out.push({ kind: 'program', id: p.node, name: nodes.get(p.node) || p.node, state: 'not checked' });
  }
  return out;
}

/** The repos of the pets on the farm that require `repo`. */
export const requiredBy = (pets, repo) => pets.filter((p) => requiredPets(p.needs).includes(repo)).map((p) => p.repo);

// ---------- The farm lock ----------

/**
 * The farm lock for a farm, from what is on it now.
 *   farm     { registry, drafts }: the farm's own pets.json and draft list, as written on the farm
 *   onFarm   farmPets of the farm (each with id, name, repo, core, draft, needs)
 *   chosen   ids the owner picked; the other pets came only because another one needs them
 *   info     { kind: 'installed'|'hub copy', release: { version, commit }, mode, os, parts, writtenBy, cameFrom }
 *   previous the lock before (its history and each pet's `code` are kept), did { did, pets }, now (Denver time)
 *   code     { id: code } to write instead of the previous lock's (a hub copy's clones next to it)
 */
export function buildLock({ farm, onFarm, chosen, info, extra, previous = null, did, now = denverNow(), code = {} }) {
  const picked = new Set(chosen);
  const before = new Map((previous?.pets || []).map((p) => [p.id, p]));
  const pets = onFarm.map((p) => {
    const entry = p.draft ? (farm.drafts?.pets || []).find((d) => d.id === p.id) : (farm.registry.pets || []).find((x) => x.art === p.id);
    if (!entry) throw new Error(`${p.name} (${p.id}) is on the farm's list but has no entry in its ${p.draft ? 'draft list' : 'pets.json'}`);
    return {
      id: p.id, repo: p.repo, pet: p.name, account: ownerOf(farm.registry, p.repo), core: p.core, draft: p.draft,
      version: entries(farm.registry).find((x) => x.repo === p.repo)?.version ?? null,
      entry: { came_from: info.cameFrom, release: info.release.version, sha256: entryHash(entry) },
      code: code[p.id] ?? before.get(p.id)?.code ?? null,
      chosen: p.core || picked.has(p.id),
      needed_by: requiredBy(onFarm, p.repo),
      needs: p.needs ?? null,
      missing: missingNeeds(p.needs, info, farm.registry, extra),
    };
  });
  return {
    schema: SCHEMA, written_by: info.writtenBy, updated: now,
    farm: { github_owner: farmOwner(farm.registry), kind: info.kind, release: info.release, mode: info.mode, os: info.os, core_parts: info.parts },
    pets,
    history: [...(previous?.history || []), { at: now, did: did.did, pets: did.pets, ...(did.from ? { from: did.from } : {}), by: info.writtenBy }],
  };
}

/** The ids a lock says the owner chose (core pets aside). */
export const chosenIds = (lock) => (lock?.pets || []).filter((p) => p.chosen && !p.core).map((p) => p.id);
