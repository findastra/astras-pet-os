// The Friendly Farmer's farm-pets tool (`the-farm-v1.0-farm-pets-v1.0`, a native tool of The Farm): add one pet to a
// farm, or take one away, and keep the farm lock (farm-lock-20261021.json) saying exactly what the farm runs. Astra,
// 2026-10-20: "a pet pack zip first; then the Friendly Farmer adds one pet to a farm"; her answers of 2026-10-21 ("All
// recommended", docs/farm-lock-20261021.md, Part 5a of card 058). Developers call it a package manager: add installs a
// package with its dependencies, remove uninstalls one.
//
//   node scripts/farm-pets-20261021.mjs plan add <pet...>        what adding would do; changes nothing
//   node scripts/farm-pets-20261021.mjs add <pet...> --yes       do it
//   node scripts/farm-pets-20261021.mjs plan add <pet pack.zip> [--unchecked]     a pet with its code, from a pet pack
//   node scripts/farm-pets-20261021.mjs add <pet pack.zip> --yes [--unchecked]
//   node scripts/farm-pets-20261021.mjs plan remove <pet...> [--with-dependents] [--and-unneeded]
//   node scripts/farm-pets-20261021.mjs remove <pet...> --yes [--with-dependents] [--and-unneeded]
//   node scripts/farm-pets-20261021.mjs check                    is the farm what its farm lock says? changes nothing
//   node scripts/farm-pets-20261021.mjs lock                     write the farm lock for what is on the farm now
//   options: --farm <folder> (default: this copy of Astra's PetOS), --catalog <folder> (the farm's list of pets)
//
// A pet is named by its id, its repo or its name. A pet comes in from the farm's own list (its catalog): the pets of its
// release, which an installed Windows farm keeps in farm-catalog/. A pet pack (Part 5b, 2026-10-22) also brings the
// pet's code, checked file by file against the pet's own repo on GitHub (scripts/farm-pets-packs-20261022.mjs); one
// that cannot be checked comes in only with --unchecked, and its code goes into its own folder next to the farm. Its needs are
// checked in this order: required pets, all the way down (they come too); then this computer and the core; then
// third-party programs, which the Farmer never installs. A need he cannot add is said plainly and marked in the farm
// lock (answer 4). A pet that other pets on the farm require is not taken away without --with-dependents (answer 5),
// and a pet that came only as a need is taken away only with --and-unneeded. Nothing else ever goes: a pet's data on
// this computer, its pictures and its repo on GitHub stay. On an installed farm with desktop pets, a running Startup
// Star is restarted so the change shows. A hub copy (git) changes its pets.json only by pull request, so there add and
// remove refuse; check and lock work. It writes only the farm's pets.json, its draft list, its farm lock and the code
// folders of pets that came from packs (taken away again only while every file is the one it put there).
// Node built-ins only. Claude Opus 5.5 (claude-opus-5-5), 2026-10-21 and 2026-10-22.
import { execFileSync, spawn } from 'node:child_process';
import { existsSync, readFileSync, realpathSync, rmSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DRAFTS_LIST, RECEIPT, farmPets, readJson, writeAtomic, writeFarmFiles } from './farm-setup-20261019.mjs';
import { CATALOG, LOCK, SCHEMA, buildLock, chosenIds, coreParts, denverNow, entryHash, missingNeeds, requiredBy, requiredClosure,
  thisOs } from './farm-lock-20261021.mjs';
import { checkPack, folderChanges, packCode, readPack, writeCode } from './farm-pets-packs-20261022.mjs';

export const TOOL_LABEL = 'the-farm-v1.0-farm-pets-v1.0';
export const WRITTEN_BY = 'scripts/farm-pets-20261021.mjs';
export const INSTALL_RECEIPT = 'install-receipt.json';
const STAR = join('bin', 'desktop-pets-20261008.exe');
const ROUND = join('.github', 'workflows', 'farmer-daily-rounds.yml');

const required = (needs) => (needs?.pets || []).filter((n) => n.how === 'required');
const same = (a, b) => String(a).toLowerCase() === String(b).trim().toLowerCase();
const find = (pets, name) => pets.find((p) => same(p.id, name) || same(p.repo, name) || same(p.name, name));
const git = (dir, args) => execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();

// ---------- The farm ----------

/**
 * Everything the Farmer knows about the farm in `dir`: its kind (an install, or a hub copy in git), its catalog (the
 * pets it may have), the pets on it, its farm lock and what it runs on. `catalogDir` overrides where the catalog is.
 */
export function readFarm(dir, { catalogDir = null } = {}) {
  const at = (p) => join(dir, p);
  let kind, info, layout, catalog = catalogDir;
  const os = thisOs();
  if (existsSync(at('.git'))) {
    kind = 'hub copy'; layout = 'hub';
    let commit = null;
    try { commit = git(dir, ['rev-parse', 'HEAD']); } catch { /* not a git checkout after all */ }
    const version = existsSync(at('package.json')) ? `v${readJson(at('package.json')).version}` : null;
    info = { release: { version, commit }, mode: 'farm', cameFrom: 'hub copy', round: existsSync(at(ROUND)) };
    catalog ||= dir;
  } else if (existsSync(at(INSTALL_RECEIPT))) {
    kind = 'installed'; layout = 'windows';
    const r = readJson(at(INSTALL_RECEIPT));
    info = { release: { version: r.version ?? null, commit: r.source_commit ?? null }, mode: r.mode === 'developer' ? 'developer' : 'farm', cameFrom: 'installer' };
    catalog ||= at(CATALOG);
  } else if (existsSync(at(RECEIPT))) {
    kind = 'installed'; layout = 'linux';
    const r = readJson(at(RECEIPT));
    info = { release: { version: r.version ?? null, commit: null }, mode: 'farm', cameFrom: 'installer' };
    catalog ||= r.release_dir;
  } else {
    throw new Error(`${dir} is not a farm: it has no ${INSTALL_RECEIPT}, ${RECEIPT} or git checkout. Name the farm with --farm.`);
  }
  if (!catalog || !existsSync(join(catalog, 'pets.json'))) {
    throw new Error(kind === 'installed' && existsSync(at(INSTALL_RECEIPT))
      ? 'This farm was installed before the Friendly Farmer kept its list of pets (farm-catalog). Run the installer once more from the unzipped release, then add pets here.'
      : `The farm's list of pets (its catalog) is not found${catalog ? ` in ${catalog}` : ''}. Name it with --catalog.`);
  }
  const parts = coreParts({ kind, os, mode: info.mode, round: info.round });
  const extraPath = [join(catalog, 'system-map.json'), at('system-map.json')].find((p) => existsSync(p));
  return {
    dir, kind, layout, catalogDir: catalog,
    catalog: farmPets(catalog), catalogRegistry: readJson(join(catalog, 'pets.json')),
    registry: readJson(at('pets.json')), drafts: existsSync(at(DRAFTS_LIST)) ? readJson(at(DRAFTS_LIST)) : { pets: [] },
    onFarm: farmPets(dir), lock: existsSync(at(LOCK)) ? readJson(at(LOCK)) : null,
    extra: extraPath ? readJson(extraPath) : {},
    info: { ...info, kind, os, parts, writtenBy: WRITTEN_BY },
  };
}

/** The ids the owner chose: from the farm lock, or every pet on the farm when it has none yet. */
const chosenOf = (farm) => new Set(farm.lock ? chosenIds(farm.lock) : farm.onFarm.filter((p) => !p.core).map((p) => p.id));

// ---------- Plans ----------

/** What adding `names` would do: { action, stops, changes, notes, missing, keep, chosen }. Changes nothing. */
export function planAdd(farm, names) {
  const here = farm.onFarm.map((p) => p.id);
  const chosen = chosenOf(farm);
  const stops = [], notes = [], picks = [];
  const nameOf = (repo) => find(farm.catalog, repo)?.name || repo;
  for (const name of names) {
    const pet = find(farm.catalog, name);
    if (!pet) {
      const can = farm.catalog.filter((p) => !p.core && !here.includes(p.id)).map((p) => p.id);
      stops.push(`There is no pet called '${name}' on this farm's list. ${can.length ? `You can add: ${can.join(', ')}` : 'Every pet on it is on your farm already.'}`);
    } else if (pet.core) notes.push(`${pet.name} is a core pet: always on the farm.`);
    else if (here.includes(pet.id) && !chosen.has(pet.id)) { notes.push(`${pet.name} is on your farm already, because another pet needs it. Now it counts as one you chose.`); chosen.add(pet.id); }
    else if (here.includes(pet.id)) notes.push(`${pet.name} is on your farm already.`);
    else if (!picks.includes(pet.id)) picks.push(pet.id);
  }
  const closure = requiredClosure(farm.catalog, picks, here);
  stops.push(...closure.stops);
  const coming = closure.keep.map((id) => farm.catalog.find((p) => p.id === id));
  const changes = coming.map((p) => {
    const by = closure.neededBy[p.id] || [];
    const why = by.map((r) => required(find(farm.catalog, r)?.needs).find((n) => n.repo === p.repo)?.why).filter(Boolean)[0];
    return { id: p.id, name: p.name, repo: p.repo, chosen: picks.includes(p.id),
      says: picks.includes(p.id) ? 'you asked for it' : `needed by ${by.map(nameOf).join(' and ')}${why ? `: ${why}` : ''}` };
  });
  const after = new Set([...here, ...closure.keep]);
  for (const p of coming) {
    for (const n of p.needs?.pets || []) {
      const other = find(farm.catalog, n.repo);
      if (n.how === 'optional' && other && !after.has(other.id)) notes.push(`${p.name} works with ${other.name} (${other.repo}, optional): not on your farm. ${n.why} Add it too if you like.`);
    }
  }
  const missing = coming.map((p) => ({ name: p.name, items: missingNeeds(p.needs, farm.info, farm.catalogRegistry, farm.extra)
    .map((m) => ({ ...m, why: whyOf(p.needs, m) })) })).filter((m) => m.items.length);
  if (coming.length && !stops.length) notes.push(desktopNote(farm, coming.map((p) => p.name)));
  for (const id of picks) chosen.add(id);
  return { action: 'add', stops, changes, notes, missing, keep: [...after].filter((id) => !farm.onFarm.find((p) => p.id === id)?.core), chosen: [...chosen] };
}

/**
 * What adding a pet pack would do (Part 5b): the pet's entry and the pets it needs, as planAdd says, and its code, after
 * every check in checkPack. `pack` is readPack(...); `getRepo` and `unchecked` go to checkPack. Changes nothing.
 */
export function planAddPack(farm, pack, { getRepo, unchecked = false } = {}) {
  const check = checkPack(farm, pack, { getRepo, unchecked });
  if (check.stops.length) return { action: 'add', stops: check.stops, changes: [], notes: check.notes, missing: [], keep: [], chosen: [], pack: null };
  const pet = check.pet;
  const plan = planAdd(farm, [pet.id]);
  const s = pack.manifest.source;
  const at = (x) => `${x.version || 'version'} at ${String(x.commit).slice(0, 7)}`;
  const how = check.checked ? `checked file by file against ${pack.manifest.source.repo} at ${s.commit.slice(0, 7)}` : 'NOT checked against GitHub (--unchecked)';
  const code = check.replaces
    ? `its code from ${pack.name} replaces ${check.replaces.pack} (${at(check.replaces)} becomes ${at(s)}), ${how}`
    : `its code from ${pack.name} (${at(s)}) goes into ${check.folder.abs}, ${how}`;
  const mine = plan.changes.find((c) => c.id === pet.id);
  if (mine) mine.says = `${mine.says}; ${code}`;
  else {
    plan.notes = plan.notes.filter((n) => !n.startsWith(`${pet.name} is on your farm already`));
    plan.changes.unshift({ id: pet.id, name: pet.name, repo: pet.repo, chosen: true, says: code });
    if (!plan.chosen.includes(pet.id)) plan.chosen.push(pet.id);
  }
  plan.notes.unshift(...check.notes, `Nothing from a pack runs by itself: run ${pet.name}'s program from its README in ${check.folder.abs} when you choose. Its pictures and page are the farm's own (one art source).`);
  plan.pack = { pack, check, code: packCode(pack, check) };
  return plan;
}

/** What taking `names` away would do. Changes nothing. */
export function planRemove(farm, names, { withDependents = false, andUnneeded = false } = {}) {
  const chosen = chosenOf(farm);
  const stops = [], notes = [], removing = new Map(); // id -> why
  for (const name of names) {
    const pet = find(farm.onFarm, name);
    if (!pet) { notes.push(find(farm.catalog, name) ? `${find(farm.catalog, name).name} is not on your farm.` : `There is no pet called '${name}' on this farm.`); continue; }
    if (pet.core) { stops.push(`${pet.name} is a core pet: on every farm, it cannot be taken away.`); continue; }
    removing.set(pet.id, 'you asked for it');
  }
  const nameOfRepo = (repo) => find(farm.onFarm, repo)?.name || repo;
  for (;;) {
    const gone = new Set([...removing.keys()].map((id) => farm.onFarm.find((p) => p.id === id).repo));
    const stay = farm.onFarm.filter((p) => !removing.has(p.id));
    const deps = stay.filter((p) => required(p.needs).some((n) => gone.has(n.repo)));
    if (deps.length) {
      const needs = (p) => required(p.needs).filter((n) => gone.has(n.repo)).map((n) => nameOfRepo(n.repo)).join(' and ');
      if (!withDependents || deps.some((p) => p.core)) {
        for (const p of deps) stops.push(p.core ? `${p.name}, a core pet, needs ${needs(p)}, so it stays.` : `${p.name} needs ${needs(p)}: take ${p.name} away first, or both together with --with-dependents.`);
        break;
      }
      for (const p of deps) removing.set(p.id, `it needs ${needs(p)} (--with-dependents)`);
      continue;
    }
    const unneeded = stay.filter((p) => !p.core && !chosen.has(p.id) && !requiredBy(stay, p.repo).length && requiredBy(farm.onFarm, p.repo).some((r) => gone.has(r)));
    if (unneeded.length && andUnneeded) { for (const p of unneeded) removing.set(p.id, 'it came only as a need, and nothing on the farm needs it now (--and-unneeded)'); continue; }
    for (const p of unneeded) notes.push(`${p.name} came only because another pet needed it, and nothing on your farm needs it now. Take it away too with --and-unneeded.`);
    for (const p of stay) for (const n of p.needs?.pets || []) if (n.how === 'optional' && gone.has(n.repo)) notes.push(`${p.name} works with ${nameOfRepo(n.repo)} (optional) and loses that: ${n.why}`);
    break;
  }
  const changes = [...removing].map(([id, says]) => { const p = farm.onFarm.find((x) => x.id === id); return { id, name: p.name, repo: p.repo, says }; });
  // The code a pet pack brought goes too, but only while every file in its folder is the one the Farmer put there.
  const folders = [];
  for (const c of changes) {
    const code = (farm.lock?.pets || []).find((p) => p.id === c.id)?.code;
    if (code?.came_from !== 'pet-pack') continue;
    const abs = resolve(farm.dir, code.folder);
    const changed = folderChanges(abs, code.files || {});
    if (!existsSync(abs)) continue;
    folders.push({ name: c.name, abs, ok: !changed.length });
    if (changed.length) notes.push(`${c.name}'s code in ${abs} stays: it changed since its pack came in (${changed.slice(0, 3).join('; ')}${changed.length > 3 ? `; and ${changed.length - 3} more` : ''}). Delete it yourself when you are done with it.`);
    else c.says = `${c.says}; its code from its pet pack in ${abs} goes too`;
  }
  if (changes.length && !stops.length) notes.push(`Nothing else goes: each pet's data on this computer, its pictures and its repo on GitHub stay.`, desktopNote(farm, changes.map((c) => c.name)));
  for (const id of removing.keys()) chosen.delete(id);
  return { action: 'remove', stops, changes, notes, missing: [], folders,
    keep: farm.onFarm.filter((p) => !p.core && !removing.has(p.id)).map((p) => p.id), chosen: [...chosen] };
}

const whyOf = (needs, m) => (m.kind === 'core' ? needs.core.find((c) => c.part === m.id)?.why : m.kind === 'program' ? needs.programs.find((p) => p.node === m.id)?.why : '') || '';

function desktopNote(farm, names) {
  if (farm.info.parts['startup-star']) return `Desktop pets: if Startup Star is running from this farm, it restarts so ${names.join(', ')} ${names.length === 1 ? 'shows' : 'show'} the change.`;
  return `No desktop pets on this farm (${farm.info.mode === 'developer' ? 'developer mode' : 'Startup Star runs on Windows'}): each pet lives on its pet program page.`;
}

/** A plan in plain words, one line each. */
export function formatPlan(plan, command) {
  const verb = plan.action === 'add' ? 'Add to your farm' : 'Take away from your farm';
  const out = [`${verb}:`];
  for (const c of plan.changes) out.push(`  ${plan.action === 'add' ? '+' : '-'} ${c.name} (${c.repo}): ${c.says.replace(/[.!?]$/, '')}.`);
  if (!plan.changes.length) out.push('  nothing.');
  for (const m of plan.missing) {
    for (const i of m.items) {
      const what = i.state === 'not checked' ? 'install it yourself; the Farmer cannot check it' : i.state === 'not this computer' ? `its own program runs on ${i.name}, not this computer; its page and Markdown pet work here` : `not on this farm`;
      out.push(`  ! ${m.name} needs ${i.kind === 'os' ? 'another computer' : i.name}${i.kind === 'os' ? '' : ' (required)'}: ${what}.${i.why ? ` ${i.why}` : ''}`);
    }
  }
  for (const n of plan.notes) out.push(`  ${n}`);
  for (const s of plan.stops) out.push(`  STOP: ${s}`);
  if (plan.stops.length) out.push('Nothing was changed.');
  else if (plan.changes.length && command) out.push(`Nothing changed yet. To do it: ${command} --yes`);
  return out.join('\n');
}

// ---------- Doing it ----------

/** Writes the farm the plan says, and its farm lock. Returns the new lock. `restart` restarts Startup Star. */
export function applyPlan(farm, plan, { restart = restartStar, now = denverNow() } = {}) {
  if (farm.kind === 'hub copy') throw new Error(hubCopyRefusal);
  if (plan.stops.length) throw new Error(`Not done: ${plan.stops.join(' ')}`);
  writeFarmFiles(farm.catalogDir, farm.dir, plan.keep);
  const code = {};
  if (plan.pack) { writeCode(plan.pack.check.folder, plan.pack.pack.code); code[plan.pack.check.pet.id] = plan.pack.code; }
  for (const f of plan.folders || []) if (f.ok) rmSync(f.abs, { recursive: true, force: true });
  const did = { did: plan.action, pets: plan.changes.map((c) => c.repo), ...(plan.pack ? { from: plan.pack.pack.name } : {}) };
  const lock = writeLock(readFarm(farm.dir, { catalogDir: farm.catalogDir }), { chosen: plan.chosen, did, now, code });
  const star = plan.changes.length && farm.info.parts['startup-star'] ? restart(farm.dir) : 'none';
  return { lock, star };
}

const hubCopyRefusal = "This farm is a hub copy (git): its pets.json is the farm's registry, which changes only by pull request (MAKE-IT-YOURS.md, section 2). Add or take away pets there in a pull request, or on an installed farm.";

/** Writes the farm lock for what is on `farm` now. `code` ({ id: code }) is what the plan just put on the farm. */
export function writeLock(farm, { chosen = null, did = { did: 'lock', pets: [] }, now = denverNow(), code: given = {} } = {}) {
  const code = { ...given };
  if (farm.kind === 'hub copy') for (const p of farm.onFarm) { const c = cloneCode(farm.dir, p.repo); if (c) code[p.id] = c; }
  const lock = buildLock({ farm: { registry: farm.registry, drafts: farm.drafts }, onFarm: farm.onFarm, chosen: chosen ?? [...chosenOf(farm)],
    info: farm.info, extra: farm.extra, previous: farm.lock, did, now, code });
  writeAtomic(join(farm.dir, LOCK), `${JSON.stringify(lock, null, 2)}\n`);
  return lock;
}

/** A hub copy's clone of a pet next to it (the folder a farm keeps it in): its commit, and whether it has changes not committed. */
export function cloneCode(dir, repo) {
  const folder = join(dirname(real(dir)), repo);
  if (!existsSync(join(folder, '.git'))) return null;
  try { return { came_from: 'clone', folder: `../${repo}`, commit: git(folder, ['rev-parse', 'HEAD']), uncommitted: git(folder, ['status', '--porcelain']) !== '' }; }
  catch { return null; }
}

/** Is the farm what its farm lock says? Problems in plain words, [] when it is. Changes nothing. */
export function checkFarm(farm) {
  const out = [];
  const lock = farm.lock;
  if (!lock) return [`This farm has no farm lock (${LOCK}) yet: write one with lock.`];
  if (lock.schema !== SCHEMA) out.push(`The farm lock is ${lock.schema}, not ${SCHEMA}.`);
  const inLock = new Map((lock.pets || []).map((p) => [p.id, p]));
  for (const p of farm.onFarm) {
    const l = inLock.get(p.id);
    if (!l) { out.push(`${p.name} is on the farm but not in the farm lock.`); continue; }
    const entry = p.draft ? farm.drafts.pets.find((d) => d.id === p.id) : farm.registry.pets.find((x) => x.art === p.id);
    if (entryHash(entry) !== l.entry?.sha256) out.push(`${p.name}'s entry is not the one the farm lock was written with (its SHA-256 differs): changed by hand?`);
    if (farm.catalogDir !== farm.dir) {
      const listed = p.draft ? (readJson(join(farm.catalogDir, DRAFTS_LIST)).pets || []).find((d) => d.id === p.id) : farm.catalogRegistry.pets.find((x) => x.art === p.id);
      if (!listed) out.push(`${p.name} is not on the farm's list (its catalog).`);
      else if (entryHash(listed) !== entryHash(entry)) out.push(`${p.name}'s entry differs from the one on the farm's list (its catalog).`);
    }
    for (const n of required(p.needs)) if (!farm.onFarm.some((x) => x.repo === n.repo)) out.push(`${p.name} needs ${n.repo}, which is not on this farm.`);
    if (l.code?.came_from === 'pet-pack') {
      const changed = folderChanges(resolve(farm.dir, l.code.folder), l.code.files || {});
      if (changed.length) out.push(`${p.name}'s code in ${resolve(farm.dir, l.code.folder)} is not what its pet pack brought: ${changed.slice(0, 3).join('; ')}${changed.length > 3 ? `; and ${changed.length - 3} more` : ''}.`);
    }
  }
  for (const id of inLock.keys()) if (!farm.onFarm.some((p) => p.id === id)) out.push(`${inLock.get(id).pet} is in the farm lock but not on the farm.`);
  return out;
}

const q = (s) => `'${String(s).replace(/'/g, "''")}'`;
const pause = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

/** Restarts this farm's Startup Star when it is running, so the desktop pets show the change: 'restarted', 'not running' or 'none'. */
export function restartStar(dir) {
  const exe = join(dir, STAR);
  if (process.platform !== 'win32' || !existsSync(exe) || process.env.ASTRAS_PET_OS_NO_STAR_RESTART) return 'none';
  let running = false;
  try {
    running = execFileSync('powershell', ['-NoProfile', '-Command', `@(Get-Process -ErrorAction SilentlyContinue | Where-Object { $_.Path -and $_.Path.StartsWith(${q(`${dir.replace(/[\\/]+$/, '')}\\`)}, [StringComparison]::OrdinalIgnoreCase) }).Count`],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() !== '0';
  } catch { /* cannot tell: leave it */ }
  if (!running) return 'not running';
  try { execFileSync(exe, [dir, '--quit'], { stdio: 'ignore', timeout: 15000 }); } catch { /* it may already be stopping */ }
  pause(1000);
  spawn(exe, [dir], { detached: true, stdio: 'ignore' }).unref();
  return 'restarted';
}

// ---------- The command line ----------

function main() {
  const args = process.argv.slice(2);
  const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args.splice(i, 2)[1] : null; };
  const dir = resolve(opt('--farm') || fileURLToPath(new URL('..', import.meta.url)));
  const catalogDir = opt('--catalog');
  const flag = (name) => { const i = args.indexOf(name); if (i >= 0) args.splice(i, 1); return i >= 0; };
  const yes = flag('--yes'), withDependents = flag('--with-dependents'), andUnneeded = flag('--and-unneeded'), unchecked = flag('--unchecked');
  let [cmd, ...rest] = args;
  const planOnly = cmd === 'plan';
  if (planOnly) [cmd, ...rest] = rest;
  const say = (s) => console.log(s);
  if (cmd === 'add' || cmd === 'remove') {
    if (!rest.length) throw new Error(`Name the pets to ${cmd}, by id, repo or name, or a pet pack (.zip) to add.`);
    const farm = readFarm(dir, { catalogDir: catalogDir && resolve(catalogDir) });
    if (farm.kind === 'hub copy') throw new Error(hubCopyRefusal);
    if (!farm.lock) say(`This farm has no farm lock yet: every pet on it counts as one you chose.`);
    const zips = rest.filter((r) => /\.zip$/i.test(r));
    if (zips.length && (cmd !== 'add' || rest.length !== 1)) throw new Error('Add one pet pack at a time, on its own: add <pet pack.zip>.');
    const plan = zips.length
      ? planAddPack(farm, readPack(readFileSync(resolve(zips[0])), basename(zips[0])), { unchecked })
      : cmd === 'add' ? planAdd(farm, rest) : planRemove(farm, rest, { withDependents, andUnneeded });
    const again = [process.env.ASTRAS_PET_OS_FARM_PETS_COMMAND || 'node scripts/farm-pets-20261021.mjs', cmd, ...rest, ...(withDependents ? ['--with-dependents'] : []),
      ...(andUnneeded ? ['--and-unneeded'] : []), ...(unchecked ? ['--unchecked'] : [])].join(' ');
    say(formatPlan(plan, planOnly || !yes ? again : null));
    if (plan.stops.length) { process.exitCode = 1; return; }
    if (planOnly || !yes || !plan.changes.length) return;
    const { star } = applyPlan(farm, plan);
    say(`Done. The farm lock (${LOCK}) says what your farm runs now.`);
    if (star === 'restarted') say('Startup Star restarted, so your desktop pets show it.');
    else if (star === 'not running') say("Startup Star is not running: your desktop pets show it the next time you start Astra's PetOS.");
  } else if (cmd === 'check' && !planOnly) {
    const problems = checkFarm(readFarm(dir, { catalogDir: catalogDir && resolve(catalogDir) }));
    say(problems.length ? problems.map((p) => `  ${p}`).join('\n') : 'The farm is what its farm lock says.');
    if (problems.length) process.exitCode = 1;
  } else if (cmd === 'lock' && !planOnly) {
    const lock = writeLock(readFarm(dir, { catalogDir: catalogDir && resolve(catalogDir) }));
    say(`Wrote ${LOCK}: ${lock.pets.length} ${lock.pets.length === 1 ? 'pet' : 'pets'} (${lock.pets.map((p) => p.pet).join(', ')}).`);
  } else {
    const head = readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n');
    say(head.slice(0, head.findIndex((l) => !l.startsWith('//'))).join('\n').replace(/^\/\/ ?/gm, ''));
  }
}

// Real paths on both sides, so it runs through the Documents\Astra's PetOS junction too (the pet-privatizer's fix).
const real = (p) => { try { return realpathSync(p); } catch { return resolve(p); } };
if (process.argv[1] && real(fileURLToPath(import.meta.url)) === real(resolve(process.argv[1]))) {
  try { main(); } catch (e) { console.error(e.message); process.exitCode = 1; }
}
