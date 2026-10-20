// The farm setup in Node (Astra, 2026-10-19): the same choice as the Windows installer's "Set up your farm" window,
// for the Linux package and any computer with Node. Astra's example pets, or from scratch: the core pets plus any
// example pets picked. It reads the same files as installer/install-astras-pet-os-20261014.ps1 (pets.json and the
// desktop draft list) and makes the same farm, so the two installers share one farm logic;
// test/linux-package-test-20261019.mjs checks on Windows that both list the same pets.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-19.
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

export const DRAFTS_LIST = 'desktop-art/desktop-drafts-20261018.json';
export const RECEIPT = 'farm-receipt.json';

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8').replace(/^﻿/, ''));
const text = (value) => (value === undefined || value === null ? '' : String(value));

function writeAtomic(path, body) {
  mkdirSync(dirname(path), { recursive: true });
  const temporary = `${path}.${process.pid}.tmp`;
  writeFileSync(temporary, body);
  renameSync(temporary, path);
}

/**
 * Every pet this release can put on a farm: the registered pets, then the desktop draft pets, as the installer's
 * Get-FarmPets lists them. Core pets (role "host" in pets.json, today the Friendly Farmer) are on every farm.
 */
export function farmPets(root) {
  const registry = readJson(join(root, 'pets.json'));
  const jobs = new Map((registry.pipeline || []).filter(Boolean).map((p) => [text(p.repo), text(p.job)]));
  const list = (registry.pets || []).map((p) => ({
    id: text(p.art), name: text(p.pet), repo: text(p.repo), job: text(p.job), core: p.role === 'host', draft: false,
  }));
  const drafts = join(root, DRAFTS_LIST);
  if (existsSync(drafts)) {
    for (const d of readJson(drafts).pets || []) {
      if (d.private === true) continue; // Claude Bot's art is private (a copy of ChatGPT's BSOD): never in a release
      const id = text(d.id);
      if (list.some((p) => p.id === id)) continue;
      const repo = text(d.interface).replace(/^https:\/\/github\.com\/[^/]+\//, ''); // on any account (card 058, Part 3)
      list.push({ id, name: text(d.name), repo, job: jobs.get(repo) ?? '', core: false, draft: true });
    }
  }
  return list;
}

/**
 * The farm someone chose. `farm` is "example" (every pet) or "scratch" (the core pets, plus `pets`: ids, repo names
 * or pet names, comma-separated or as a list). An unknown pet stops it and names the ids it knows, as the installer does.
 */
export function choosePets(all, { farm, pets = [] } = {}) {
  const kind = text(farm).toLowerCase();
  if (kind !== 'example' && kind !== 'scratch') {
    throw new Error("Choose a farm: example (all of Astra's example pets) or scratch (the core pets, plus any you pick).");
  }
  const examples = all.filter((p) => !p.core);
  const keep = [];
  if (kind === 'scratch') {
    const names = [pets].flat().flatMap((x) => text(x).split(',')).map((s) => s.trim()).filter(Boolean);
    for (const name of names) {
      // Case does not matter, as with the installer's -eq: --pets Goldfish and goldfish are the same pet.
      const same = (value) => value.toLowerCase() === name.toLowerCase();
      const match = examples.find((p) => same(p.id) || same(p.repo) || same(p.name));
      if (!match) throw new Error(`There is no example pet called '${name}'. You can pick: ${examples.map((p) => p.id).join(', ')}`);
      if (!keep.includes(match.id)) keep.push(match.id);
    }
  }
  const onFarm = all.filter((p) => p.core || kind === 'example' || keep.includes(p.id));
  return { farm: kind, keep, onFarm };
}

/**
 * Writes the farm into `dir` (on Linux, ~/.local/share/astras-pet-os/farm): its own pets.json and draft list, kept to
 * the chosen pets as the installer's Set-FarmPets keeps them, and a receipt. The release itself is never changed.
 * Running it again changes the farm.
 */
export function writeFarm(root, dir, choice, { version = '', extra = {} } = {}) {
  const registry = readJson(join(root, 'pets.json'));
  const draftsPath = join(root, DRAFTS_LIST);
  const drafts = existsSync(draftsPath) ? readJson(draftsPath) : { pets: [] };
  if (choice.farm === 'scratch') {
    registry.pets = (registry.pets || []).filter((p) => p.role === 'host' || choice.keep.includes(p.art));
    drafts.pets = (drafts.pets || []).filter((d) => choice.keep.includes(d.id));
  }
  writeAtomic(join(dir, 'pets.json'), `${JSON.stringify(registry, null, 2)}\n`);
  writeAtomic(join(dir, DRAFTS_LIST), `${JSON.stringify(drafts, null, 2)}\n`);
  const receipt = {
    product: "Astra's PetOS", version, set_up: new Date().toISOString(), farm: choice.farm,
    pets: choice.onFarm.map((p) => p.id), release_dir: root, ...extra,
  };
  writeAtomic(join(dir, RECEIPT), `${JSON.stringify(receipt, null, 2)}\n`);
  return receipt;
}
