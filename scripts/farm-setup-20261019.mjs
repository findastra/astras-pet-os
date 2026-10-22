// The farm setup in Node (Astra, 2026-10-19): the same choice as the Windows installer's "Set up your farm" window,
// for the Linux package and any computer with Node. Astra's example pets, or from scratch: the core pets plus any
// example pets picked. It reads the same files as installer/install-astras-pet-os-20261014.ps1 (pets.json and the
// desktop draft list) and makes the same farm, so the two installers share one farm logic;
// test/linux-package-test-20261019.mjs checks on Windows that both list the same pets.
// Since 2026-10-21 (Part 5a of card 058, docs/farm-lock-20261021.md) a pet picked from scratch brings the pets it needs
// (required, all the way down), and setting up a farm writes its farm lock (scripts/farm-lock-20261021.mjs).
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-19 and 2026-10-21.
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { LOCK, buildLock, coreParts, denverNow, requiredClosure, thisOs } from './farm-lock-20261021.mjs';

export const DRAFTS_LIST = 'desktop-art/desktop-drafts-20261018.json';
export const RECEIPT = 'farm-receipt.json';

export const readJson = (path) => JSON.parse(readFileSync(path, 'utf8').replace(/^﻿/, ''));
const text = (value) => (value === undefined || value === null ? '' : String(value));

export function writeAtomic(path, body) {
  mkdirSync(dirname(path), { recursive: true });
  const temporary = `${path}.${process.pid}.tmp`;
  writeFileSync(temporary, body);
  renameSync(temporary, path);
}

/**
 * Every pet this release can put on a farm: the registered pets, then the desktop draft pets, as the installer's
 * Get-FarmPets lists them. Core pets (role "host" in pets.json, today the Friendly Farmer) are on every farm. Each one
 * carries its `needs` from pets.json (null when its entry writes none).
 */
export function farmPets(root) {
  const registry = readJson(join(root, 'pets.json'));
  const jobs = new Map((registry.pipeline || []).filter(Boolean).map((p) => [text(p.repo), text(p.job)]));
  const needs = new Map([...(registry.pets || []), ...(registry.pipeline || [])].filter(Boolean).map((p) => [text(p.repo), p.needs || null]));
  const list = (registry.pets || []).map((p) => ({
    id: text(p.art), name: text(p.pet), repo: text(p.repo), job: text(p.job), core: p.role === 'host', draft: false, needs: p.needs || null,
  }));
  const drafts = join(root, DRAFTS_LIST);
  if (existsSync(drafts)) {
    for (const d of readJson(drafts).pets || []) {
      if (d.private === true) continue; // Claude Bot's art is private (a copy of ChatGPT's BSOD): never in a release
      const id = text(d.id);
      if (list.some((p) => p.id === id)) continue;
      // A draft points to its repo on GitHub, on any account (card 058, Part 3), or (since 2026-10-19) to its pet program
      // page in the hub.
      const repo = text(d.interface).replace(/^https:\/\/github\.com\/[^/]+\//, '').replace(/^apps\/pet-programs\/(.+)-\d{8}\.html$/, '$1');
      list.push({ id, name: text(d.name), repo, job: jobs.get(repo) ?? '', core: false, draft: true, needs: needs.get(repo) ?? null });
    }
  }
  return list;
}

/**
 * The farm someone chose. `farm` is "example" (every pet) or "scratch" (the core pets, plus `pets`: ids, repo names
 * or pet names, comma-separated or as a list). An unknown pet stops it and names the ids it knows, as the installer does.
 * A pet picked from scratch brings every pet it requires, all the way down (Astra's answer 6, 2026-10-21): `keep` is the
 * picks and those, `picked` the picks alone, and `neededBy` says which pets need each one that came along.
 */
export function choosePets(all, { farm, pets = [] } = {}) {
  const kind = text(farm).toLowerCase();
  if (kind !== 'example' && kind !== 'scratch') {
    throw new Error("Choose a farm: example (all of Astra's example pets) or scratch (the core pets, plus any you pick).");
  }
  const examples = all.filter((p) => !p.core);
  const picked = [];
  if (kind === 'scratch') {
    const names = [pets].flat().flatMap((x) => text(x).split(',')).map((s) => s.trim()).filter(Boolean);
    for (const name of names) {
      // Case does not matter, as with the installer's -eq: --pets Goldfish and goldfish are the same pet.
      const same = (value) => value.toLowerCase() === name.toLowerCase();
      const match = examples.find((p) => same(p.id) || same(p.repo) || same(p.name));
      if (!match) throw new Error(`There is no example pet called '${name}'. You can pick: ${examples.map((p) => p.id).join(', ')}`);
      if (!picked.includes(match.id)) picked.push(match.id);
    }
  }
  const needs = requiredClosure(all, picked, all.filter((p) => p.core).map((p) => p.id));
  if (needs.stops.length) throw new Error(`This farm cannot be set up: ${needs.stops.join('; ')}.`);
  const keep = kind === 'scratch' ? needs.keep : [];
  const onFarm = all.filter((p) => p.core || kind === 'example' || keep.includes(p.id));
  return { farm: kind, keep, picked: kind === 'scratch' ? picked : examples.map((p) => p.id), neededBy: kind === 'scratch' ? needs.neededBy : {}, onFarm };
}

/**
 * The farm's own pets.json and draft list in `dir`, from the release's in `root`: kept to the core pets and the ids in
 * `keep` as the installer's Set-FarmPets keeps them, or every pet when `keep` is null. Everything but the pet lists
 * stays as released.
 */
export function writeFarmFiles(root, dir, keep) {
  const registry = readJson(join(root, 'pets.json'));
  const draftsPath = join(root, DRAFTS_LIST);
  const drafts = existsSync(draftsPath) ? readJson(draftsPath) : { pets: [] };
  if (keep) {
    registry.pets = (registry.pets || []).filter((p) => p.role === 'host' || keep.includes(p.art));
    drafts.pets = (drafts.pets || []).filter((d) => keep.includes(d.id));
  }
  writeAtomic(join(dir, 'pets.json'), `${JSON.stringify(registry, null, 2)}\n`);
  writeAtomic(join(dir, DRAFTS_LIST), `${JSON.stringify(drafts, null, 2)}\n`);
}

/**
 * Writes the farm into `dir` (on Linux, ~/.local/share/astras-pet-os/farm): its own pets.json and draft list, kept to
 * the chosen pets as the installer's Set-FarmPets keeps them, a receipt and the farm lock. The release itself is never
 * changed. Running it again changes the farm; the farm lock keeps its history.
 */
export function writeFarm(root, dir, choice, { version = '', extra = {}, now = denverNow() } = {}) {
  writeFarmFiles(root, dir, choice.farm === 'scratch' ? choice.keep : null);
  const receipt = {
    product: "Astra's PetOS", version, set_up: new Date().toISOString(), farm: choice.farm,
    pets: choice.onFarm.map((p) => p.id), release_dir: root, ...extra,
  };
  writeAtomic(join(dir, RECEIPT), `${JSON.stringify(receipt, null, 2)}\n`);
  const lockPath = join(dir, LOCK);
  const os = thisOs();
  const lock = buildLock({
    farm: { registry: readJson(join(dir, 'pets.json')), drafts: readJson(join(dir, DRAFTS_LIST)) },
    onFarm: farmPets(dir), chosen: choice.picked || choice.keep,
    info: { kind: 'installed', release: { version, commit: null }, mode: 'farm', os, parts: coreParts({ kind: 'installed', os, mode: 'farm' }),
      writtenBy: 'scripts/farm-setup-20261019.mjs', cameFrom: 'installer' },
    extra: existsSync(join(root, 'system-map.json')) ? readJson(join(root, 'system-map.json')) : {},
    previous: existsSync(lockPath) ? readJson(lockPath) : null,
    did: { did: 'set up', pets: choice.onFarm.map((p) => p.repo) }, now,
  });
  writeAtomic(lockPath, `${JSON.stringify(lock, null, 2)}\n`);
  return receipt;
}
