// Shared by update-readme.mjs, check-pets-20261018.mjs, build.mjs and the tests.
import { repoUrl, upstream } from './farm-owner-20261020.mjs';
// Astra's account, where Astra's PetOS comes from (upstream). Pets link to their own account with repoUrl() from
// scripts/farm-owner-20261020.mjs (card 058, Part 3); OWNER stays for scripts on other branches that import it.
export const OWNER = upstream().owner;
// The one download for people who want Astra's PetOS (the release's installer zip, never the repo). Astra, 2026-10-18.
export const INSTALLER_URL = upstream().installer;
export const START = '<!-- pets:start (generated from pets.json by scripts/update-readme.mjs; do not edit by hand) -->';
export const END = '<!-- pets:end -->';
export const STATUSES = ['hatching', 'growing', 'grown'];
export const ROLES = ['host', 'pet'];
export const ENTRY_KEYS = ['repo', 'pet', 'role', 'status', 'job', 'art', 'added', 'interface_url'];
// A dated page in the hub: an app copy in apps/, or a pet program page in apps/pet-programs/. Astra, 2026-10-19: "one
// click always points to program page (Pet Program)": interface_url opens the pet program, app_url today's app.
export const HUB_PAGE = /^apps\/(?:pet-programs\/)?[a-z0-9]+(?:-[a-z0-9]+)*-\d{8}(?:-\d{6})?\.html$/;
export const PROGRAM_PAGE = (repo) => `apps/pet-programs/${repo}-20261018.html`;
export const safeInterfaceURL = (value) => typeof value === 'string' && (/^https?:\/\/[^\s]+$/.test(value) || HUB_PAGE.test(value));

/** Optional dated assets for new pets; existing pets retain their original filenames. */
export function assetPaths(registry, id) {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) throw new Error(`Invalid art id: ${id}`);
  const entry = [...(registry.pets || []), ...(registry.mascots || [])].find((p) => p.art === id);
  const date = entry?.asset_date;
  if (date !== undefined && !/^\d{8}(?:-\d{6})?$/.test(date)) throw new Error(`${id}: asset_date must be YYYYMMDD or YYYYMMDD-HHMMSS`);
  const suffix = date ? `-${date}` : '';
  return {
    sheet: `art/sheets/${id}${suffix}.png`,
    fallback: `art/generated/${id}${suffix}.json`,
    approved: `art/sheets/.approved/${id}${suffix}.png`,
    frame: (mood) => {
      if (!/^[a-z]+$/.test(mood)) throw new Error(`Invalid mood: ${mood}`);
      return `art/frames/${id}/${mood}${suffix}.png`;
    },
    // The same drawing with no mood sticker, for the desktop pets (build-frames.mjs PLAIN).
    plainFrame: (mood) => {
      if (!/^[a-z]+$/.test(mood)) throw new Error(`Invalid mood: ${mood}`);
      return `art/frames/${id}/plain-${mood}${suffix}.png`;
    },
  };
}

// Escape backslashes too: otherwise a "\|" in a job would still end the table cell.
const esc = (s) => s.replace(/[\\|]/g, '\\$&');

export function buildTable(registry) {
  const rows = (registry.pets || []).map((p) => {
    const repo = repoUrl(registry, p.repo); // on the pet's own account (card 058, Part 3)
    const accessible = p.published !== false && p.visibility !== 'private';
    // The host is Astra's PetOS itself: it is installed with the installer, so its row never offers the repo's ZIP.
    const availability = p.role === 'host' ? `[Installer](${INSTALLER_URL})` : p.published === false ? 'not on GitHub yet' : p.visibility === 'private' ? 'private repo' : `[Download ZIP](${repo}/archive/refs/heads/main.zip)`;
    const get = `${p.interface_url ? `[Pet Program](${p.interface_url}) · ` : ''}${availability}`;
    const name = accessible ? `**[${esc(p.pet)}](${repo})**` : `**${esc(p.pet)}**`;
    return `| ${name} | ${p.role} | ${p.status} | ${esc(p.job)} | ${get} |`;
  });
  return ['| Pet | Role | Status | What it does | Get it |', '|---|---|---|---|---|', ...rows].join('\n');
}

export function applyTable(readme, registry) {
  const a = readme.indexOf(START), b = readme.indexOf(END);
  if (a < 0 || b < a) throw new Error('README.md is missing the pets:start / pets:end markers');
  return readme.slice(0, a) + START + '\n' + buildTable(registry) + '\n' + readme.slice(b);
}

/** Problems with pets.json, the README table, and (when given) the built frames index
 *  (art/frames/index.json, written by build-frames.mjs). Empty list = fine. */
export function validate(registry, readme, art) {
  const problems = [];
  if (!registry || !Array.isArray(registry.pets)) return ['pets.json has no "pets" array'];
  const seen = new Set(), arts = new Set();
  for (const p of registry.pets) {
    for (const k of ENTRY_KEYS) if (!p[k]) problems.push(`${p.repo || '(entry)'}: missing "${k}"`);
    // "published" cannot go in ENTRY_KEYS: false is falsy, so the check above would flag every
    // unpublished pet. Omitting it silently claims the repo is live, so require it explicitly.
    if (typeof p.published !== 'boolean') problems.push(`${p.repo || '(entry)'}: "published" must be true or false (leaving it out claims the repo is already on GitHub)`);
    if (p.visibility !== undefined && !['public', 'private'].includes(p.visibility)) problems.push(`${p.repo}: visibility must be public or private`);
    if (!safeInterfaceURL(p.interface_url)) problems.push(`${p.repo}: interface_url must be an http(s) URL or a dated apps/ HTML path`);
    if (p.interface_local_url !== undefined && !HUB_PAGE.test(p.interface_local_url)) problems.push(`${p.repo}: interface_local_url must be a dated apps/ HTML path`);
    if (p.app_url !== undefined && !safeInterfaceURL(p.app_url)) problems.push(`${p.repo}: app_url (today's app) must be an http(s) URL or a dated apps/ HTML path`);
    if (p.repo && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.repo)) problems.push(`${p.repo}: repo names are lowercase words joined by hyphens`);
    try { assetPaths(registry, p.art); } catch (e) { problems.push(e.message); }
    if (p.status && !STATUSES.includes(p.status)) problems.push(`${p.repo}: status must be ${STATUSES.join(', ')}`);
    if (p.role && !ROLES.includes(p.role)) problems.push(`${p.repo}: role must be ${ROLES.join(' or ')}`);
    if (seen.has(p.repo)) problems.push(`${p.repo}: listed twice`);
    if (arts.has(p.art)) problems.push(`${p.repo}: art "${p.art}" is used twice`);
    seen.add(p.repo); arts.add(p.art);
    for (const c of p.companions || []) { if (arts.has(c)) problems.push(`${p.repo}: companion art "${c}" is used twice`); arts.add(c); }
    for (const id of Object.keys(p.says || {})) if (id !== p.art && !(p.companions || []).includes(id)) problems.push(`${p.repo}: "says" lists ${id}, which is not one of its characters`);
  }
  const hosts = registry.pets.filter((p) => p.role === 'host');
  if (hosts.length !== 1) problems.push(`there must be exactly one host (this hub's own pet, the Friendly Farmer); found ${hosts.length}`);
  else if (hosts[0].repo !== registry.cage) problems.push(`the host's repo must be this hub, "${registry.cage}"`);
  for (const m of registry.mascots || []) { if (!m.art || !m.name) problems.push('a mascot needs "name" and "art"'); arts.add(m.art); }
  if (art) for (const id of arts) if (!art.pets[id]) problems.push(`no art drawn for "${id}" (add its prompt to scripts/generate-pets.mjs, generate it, then npm run build)`);
  if (art) for (const id of Object.keys(art.pets)) if (!arts.has(id)) problems.push(`art "${id}" is drawn but not listed in pets.json`);
  try { if (applyTable(readme, registry) !== readme) problems.push('README.md pet table is out of date: run npm run build'); }
  catch (e) { problems.push(e.message); }
  return problems;
}
