// Optional desktop visual only. No farm enrollment, agent, startup change or network service.
// OpenAI Codex (GPT-6), 2026-10-18.
import { readFileSync, writeFileSync, mkdirSync, existsSync, renameSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { assertAnimal } from './animal-guard-20261013.mjs';
import { decodePng, MOODS } from './sheet-to-sprites.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const assetDate = '20261018';
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
export function websiteUrl(value) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash)
    throw new Error('Use the HTTPS address of The Threshold, without credentials, query or fragment.');
  return url.href;
}
export function updateDrafts(current, entry) {
  if (!current || !Array.isArray(current.pets) || current.pets.some(p => !p || typeof p.id !== 'string'))
    throw new Error('Invalid draft roster; nothing changed.');
  if (current.pets.filter(p => p.id === 'door-dormouse').length > 1)
    throw new Error('Duplicate Door Dormouse entries; nothing changed.');
  const pets = current.pets.map(p => p.id === 'door-dormouse' ? { ...p, ...entry } : p);
  if (!pets.some(p => p.id === 'door-dormouse')) pets.push(entry);
  return { ...current, pets };
}
function timestamp() {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Denver', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()).map(p => [p.type, p.value]));
  return `${parts.year}${parts.month}${parts.day}-${parts.hour}${parts.minute}${parts.second}`;
}
export function install({ website, localAppData, apply = false, sourceRoot = root }) {
  const url = websiteUrl(website);
  if (!localAppData) throw new Error('LOCALAPPDATA is required.');
  const registry = JSON.parse(readFileSync(join(sourceRoot, 'pets.json'), 'utf8'));
  assertAnimal(registry, 'astras-pet-os', 'prepare desktop visual');
  const folder = join(localAppData, 'astras-pet-apps');
  const roster = join(folder, 'desktop-drafts-20261011.json');
  const before = existsSync(roster) ? readFileSync(roster) : null;
  const current = before ? JSON.parse(before) : { pets: [] };
  const art = join(sourceRoot, 'desktop-art', 'door-dormouse');
  const frames = MOODS.map(mood => {
    const name = `${mood}-${assetDate}.png`, bytes = readFileSync(join(art, name));
    const png = decodePng(bytes);
    if (png.width !== 256 || png.height !== 256) throw new Error('Expected 256px mood frames.');
    return { name, bytes };
  });
  // Content-addressed cache keeps a previous installation recoverable when artwork changes.
  const revision = digest(Buffer.concat(frames.map(f => f.bytes))).slice(0, 12);
  const cache = join(folder, 'door-dormouse', revision);
  const entry = { id: 'door-dormouse', name: 'Door Dormouse', idle: join(cache, `idle-${assetDate}.png`), blink: join(cache, `blink-${assetDate}.png`), interface: url };
  const next = updateDrafts(current, entry);
  if (!apply) return { applied: false, pet: entry.id, existingPets: current.pets.length, nextPets: next.pets.length, website: url };
  mkdirSync(cache, { recursive: true });
  for (const { name, bytes } of frames) {
    const target = join(cache, name);
    if (existsSync(target)) { if (digest(readFileSync(target)) !== digest(bytes)) throw new Error('Cached art differs; nothing overwritten.'); }
    else writeFileSync(target, bytes, { flag: 'wx' });
  }
  // A concurrent editor's changes must never be overwritten by the previewed roster.
  const latest = existsSync(roster) ? readFileSync(roster) : null;
  if ((latest === null) !== (before === null) || (latest && !latest.equals(before))) throw new Error('Draft roster changed; rerun.');
  const changed = JSON.stringify(next) !== JSON.stringify(current);
  let backup = null;
  if (changed) {
    const stamp = timestamp();
    if (before) { backup = join(folder, `desktop-drafts-before-door-dormouse-${stamp}.json`); writeFileSync(backup, before, { flag: 'wx' }); }
    const pending = join(folder, `desktop-drafts-door-dormouse-pending-${stamp}.json`);
    writeFileSync(pending, JSON.stringify(next, null, 2) + '\n', { flag: 'wx' });
    renameSync(pending, roster);
  }
  return { applied: true, changed, pet: entry.id, totalDrafts: next.pets.length, backup, cache, website: url, restartRequired: changed };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2), at = args.indexOf('--website');
  if (at < 0 || !args[at + 1]) throw new Error('Pass --website <The Threshold HTTPS address>; add --apply to install.');
  console.log(JSON.stringify(install({ website: args[at + 1], localAppData: process.env.LOCALAPPDATA, apply: args.includes('--apply') }), null, 2));
}
