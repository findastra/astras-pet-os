// The Friendly Farmer's pet-privatizer (the-farm-v1.0-pet-privatizer-v1.0): makes a pet's repo private or public on
// GitHub, checks a whole farm, and makes a private copy of a repo that GitHub cannot make private (a fork of a public repo).
// Astra, 2026-10-18: "I need to build a farmer tool that privatizes pets from public to private. people need their farm
// repos to spawn on GitHub as entirely private." Astra, 2026-10-20: on any farm's own account, and both ways ("people
// are going to be wanting to privatize and unprivatize their pets"). Claude Opus 5.5 (claude-opus-5-5), 2026-10-18, 2026-10-20.
//
//   node scripts/pet-privatizer-20261018.mjs plan [private|public] <repo...>   what would change, and what would be lost or shown (read-only)
//   node scripts/pet-privatizer-20261018.mjs plan [private|public] --all        the same for every pet of the farm
//   node scripts/pet-privatizer-20261018.mjs apply [private|public] <repo...> --yes [--accept-losses]
//   node scripts/pet-privatizer-20261018.mjs copy <owner/repo> <new-name> --yes
//   private is the default, so `plan <repo>` and `apply <repo> --yes` work as they always did.
//
// Only this farm's own pets: animals (pets.json) on the farm owner's account (`github_owner` in pets.json), and only
// while you are signed in to GitHub as that owner (scripts/animal-guard-20261013.mjs). --yes is the owner's (L4) OK.
// Private: stars and watchers are erased, forks are cut loose and stay public, and a free account's Pages site stops;
// apply refuses when there is any of that to lose, unless --accept-losses. It never makes the one art source private
// (findastra/astras-pet-os: every farm's pet pictures and pages come from its public site). Public: every commit of
// every branch becomes visible, so plan scans them all first (scripts/public-safety-20261014.mjs), and apply stops on a
// key, a token, a personal folder path or a local service address; a pet whose entry says `stays_private` never goes
// public. After apply, pets.json follows: run `npm run build` and put the change on a branch, like every hub change.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync, rmSync, realpathSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { animalRepos, assertAnimal, assertOwnPet, assertSignedInAsOwner, farmOwner, petOwner, sameAccount } from './animal-guard-20261013.mjs';
import { findSensitive } from './public-safety-20261014.mjs';
import { OWNER as ART_OWNER, HUB as ART_HUB } from './one-art-source-20261017.mjs';
import { setRegistryField } from './pet-program-link-20261018.mjs';

export const TOOL = 'the-farm-v1.0-pet-privatizer-v1.0';
export const WAYS = ['private', 'public'];

/** What making one repo private (or public) would do. `meta` is GitHub's repo record; `pages` whether it has a Pages site. */
export function assess(meta, pages = false, way = 'private') {
  const out = { repo: meta.name, private: !!meta.private, fork: !!meta.fork, losses: [], shown: [], action: way === 'public' ? 'publicize' : 'privatize', why: '' };
  if (way === 'public') {
    if (!meta.private) return { ...out, action: 'none', why: 'already public' };
    if (meta.fork) return { ...out, action: 'none', why: `it is a fork of ${meta.parent?.full_name || 'another repo'}, and GitHub never changes a fork's visibility` };
    out.shown.push('every commit on every branch, with its files and messages', 'its issues, pull requests and releases', 'its Actions logs');
    out.why = `making it public shows ${out.shown.join('; ')}`;
    return out;
  }
  if (meta.private) return { ...out, action: 'none', why: 'already private' };
  if (meta.fork) {
    return { ...out, action: 'copy', why: `it is a fork of ${meta.parent?.full_name || 'a public repo'}, and GitHub keeps a fork of a public repo public: make a private copy instead (copy)` };
  }
  if (meta.stargazers_count > 0) out.losses.push(`${meta.stargazers_count} star(s) are erased`);
  // The owner watches their own repo, so one watcher is normal.
  if (meta.subscribers_count > 1) out.losses.push(`${meta.subscribers_count - 1} other watcher(s) are erased`);
  if (meta.forks_count > 0) out.losses.push(`${meta.forks_count} fork(s) stay public and are cut loose`);
  if (pages) out.losses.push('its GitHub Pages site stops (a free account has no Pages for private repos)');
  out.why = out.losses.length ? `making it private: ${out.losses.join('; ')}` : 'nothing to lose: it has no stars, other watchers, forks or Pages site';
  return out;
}

/** Why this farm may not make the animal `repo` private or public, or '' when it may. Asks nothing of GitHub. */
export function refusal(registry, repo, way = 'private') {
  const home = petOwner(registry, repo);
  const farm = farmOwner(registry);
  if (!sameAccount(home, farm)) return `it is ${home}'s pet, not ${farm}'s, so only ${home} changes it: make your own private copy instead (copy ${home}/${repo} <new-name> --yes)`;
  if (way === 'private' && sameAccount(home, ART_OWNER) && repo === ART_HUB) {
    return `it is the one art source (${ART_OWNER}/${ART_HUB}): every farm's pet pictures and pet program pages, the System Map and the guide come from its public site, and a free account has no Pages site for a private repo. Only its owner changes that, in GitHub's own Settings`;
  }
  // A pet that must never be public says why in its registry entry (Claude Bot: a copy of someone else's art).
  const entry = [...(registry.pets || []), ...(registry.pipeline || [])].find((p) => p.repo === repo);
  if (way === 'public' && entry?.stays_private) return `it stays private: ${entry.stays_private}`;
  return '';
}

/** The repos `--all` means: every animal on the farm (registered and pipeline pets, and the hub). */
export const farmRepos = (registry) => [...animalRepos(registry)].sort();

/** pets.json text with `repo` set to `way` (private or public), keeping the file's own layout. */
export function markVisibility(raw, repo, way) {
  const reg = JSON.parse(raw);
  const e = [...(reg.pets || []), ...(reg.pipeline || [])].find((x) => x.repo === repo);
  if (!e || e.visibility === way) return raw;
  return setRegistryField(raw, repo, 'visibility', way);
}
export const markPrivate = (raw, repo) => markVisibility(raw, repo, 'private');

// What must stop a repo going public (anything that looks like a secret, a personal folder path, a local service
// address), and what is only noted: a local network address is often teaching material (the hub's own public-safety
// test skips that kind in committed files too).
const isStop = (hit) => hit.secret || hit.kind !== 'local network address';

/**
 * Every file in every commit of every branch and tag of a git repo (`gitDir`, bare or not), and every commit message,
 * through findSensitive. Returns { stop, notes, scanned, skipped }; each hit names its kind, count, file and the first
 * commit that has it, never the matched text. Files over `maxBytes` and binary files are skipped (and counted).
 */
export function scanHistory(gitDir, { maxBytes = 5 << 20 } = {}) {
  const git = (args, input) => execFileSync('git', ['--git-dir', gitDir, ...args], { input, maxBuffer: 1 << 30, stdio: ['pipe', 'pipe', 'pipe'] });
  const paths = new Map();
  for (const line of git(['rev-list', '--objects', '--all']).toString('utf8').split('\n')) {
    const [sha, ...rest] = line.split(' ');
    if (sha && !paths.has(sha)) paths.set(sha, rest.join(' '));
  }
  const blobs = [];
  let skipped = 0; // binary or very large files
  for (const line of git(['cat-file', '--batch-check'], [...paths.keys()].join('\n') + '\n').toString('utf8').split('\n')) {
    const [sha, type, size] = line.split(' ');
    if (type !== 'blob') continue;
    if (Number(size) > maxBytes) skipped++; else blobs.push(sha);
  }
  let scanned = 0;
  const hits = [];
  const record = (found, file, sha) => { for (const f of found) hits.push({ ...f, file, sha }); };
  for (let i = 0; i < blobs.length; i += 400) {
    const out = git(['cat-file', '--batch'], blobs.slice(i, i + 400).join('\n') + '\n');
    let at = 0;
    while (at < out.length) {
      const eol = out.indexOf(10, at);
      const [sha, , size] = out.subarray(at, eol).toString('utf8').split(' ');
      const body = out.subarray(eol + 1, eol + 1 + Number(size));
      at = eol + 1 + Number(size) + 1;
      if (body.subarray(0, 8000).includes(0)) { skipped++; continue; }
      scanned++;
      record(findSensitive(body.toString('utf8')), paths.get(sha) || sha, sha);
    }
  }
  for (const entry of git(['log', '--all', '--format=%h%x00%B%x01']).toString('utf8').split('\x01')) {
    const [h, msg = ''] = entry.replace(/^\n/, '').split('\0');
    if (h) record(findSensitive(msg), `the message of commit ${h}`, null);
  }
  for (const hit of hits) {
    hit.commit = hit.sha ? git(['log', '--all', '--reverse', '--format=%h', `--find-object=${hit.sha}`]).toString('utf8').split('\n')[0] : '';
    delete hit.sha;
  }
  return { stop: hits.filter(isStop), notes: hits.filter((h) => !isStop(h)), scanned, skipped };
}

/** One line about a scan, safe to print: kinds, counts and where, never the text found. */
export function describeScan(scan) {
  const say = (h) => `${h.count} ${h.kind}${h.count > 1 ? (h.kind.endsWith('s') ? 'es' : 's') : ''} in ${h.file}${h.commit ? ` (first in commit ${h.commit})` : ''}`;
  const list = (hits) => hits.slice(0, 8).map(say).join('; ') + (hits.length > 8 ? `; and ${hits.length - 8} more` : '');
  if (scan.error) return `the scan could not read its history (${scan.error}), so it stays private`;
  if (scan.stop.length) return `the scan found ${list(scan.stop)}: remove these from the history (and revoke any key) first, then plan public again`;
  const notes = scan.notes.length ? `; noted, not stopping: ${list(scan.notes)}` : '';
  return `the scan of every commit found nothing to stop it (${scan.scanned} file${scan.scanned === 1 ? '' : 's'}${scan.skipped ? `, ${scan.skipped} binary or very large skipped` : ''})${notes}`;
}

const gh = (...a) => execFileSync('gh', a, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 << 20 }).trim();
const ghJson = (path) => { try { return JSON.parse(gh('api', path)); } catch { return null; } };
const hasPages = (owner, repo) => { try { gh('api', `repos/${owner}/${repo}/pages`); return true; } catch { return false; } };
const signedIn = () => { try { return gh('api', 'user', '--jq', '.login'); } catch { return ''; } };
const REG_PATH = fileURLToPath(new URL('../pets.json', import.meta.url));

function scanRepo(owner, repo) {
  const dir = mkdtempSync(join(tmpdir(), 'pet-privatizer-scan-'));
  try {
    gh('repo', 'clone', `${owner}/${repo}`, join(dir, 'src.git'), '--', '--bare', '--quiet');
    return scanHistory(join(dir, 'src.git'));
  } catch (e) {
    return { stop: [], notes: [], scanned: 0, skipped: 0, error: String(e.message || e).split('\n')[0] };
  } finally { rmSync(dir, { recursive: true, force: true }); }
}

function plan(registry, repos, way) {
  const rows = [];
  const ask = [];
  for (const repo of repos) {
    assertAnimal(registry, repo, 'plan a visibility change for');
    const no = refusal(registry, repo, way);
    rows.push(no ? { repo, action: 'none', why: no } : null);
    if (!no) ask.push(rows.length - 1);
  }
  if (!ask.length) return rows;
  assertSignedInAsOwner(registry, signedIn());
  const owner = farmOwner(registry);
  for (const i of ask) {
    const repo = repos[i];
    const meta = ghJson(`repos/${owner}/${repo}`);
    if (!meta) { rows[i] = { repo, action: 'none', why: `not on GitHub as ${owner}/${repo}` }; continue; }
    rows[i] = assess(meta, way === 'private' && !meta.private && hasPages(owner, repo), way);
    if (rows[i].action === 'publicize') {
      rows[i].scan = scanRepo(owner, repo);
      rows[i].why += `. ${describeScan(rows[i].scan)}`;
    }
  }
  return rows;
}

function apply(registry, repos, way, { acceptLosses }) {
  const rows = plan(registry, repos, way);
  const owner = farmOwner(registry);
  let raw = readFileSync(REG_PATH, 'utf8');
  for (const r of rows) {
    if (r.action !== (way === 'public' ? 'publicize' : 'privatize')) { console.log(`${r.repo}: not changed (${r.why}).`); continue; }
    if (r.losses.length && !acceptLosses) { console.log(`${r.repo}: not changed: ${r.why}. Run again with --accept-losses if that is fine.`); continue; }
    if (way === 'public' && (r.scan.error || r.scan.stop.length)) { console.log(`${r.repo}: not changed: ${describeScan(r.scan)}.`); continue; }
    assertOwnPet(registry, r.repo, `make ${way}`); // the guard once more, right before GitHub changes
    gh('repo', 'edit', `${owner}/${r.repo}`, '--visibility', way, '--accept-visibility-change-consequences');
    const now = ghJson(`repos/${owner}/${r.repo}`);
    if (!now || now.private !== (way === 'private')) { console.log(`${r.repo}: GitHub did not make it ${way}; nothing else changed.`); continue; }
    raw = markVisibility(raw, r.repo, way);
    console.log(`${r.repo}: ${way} now${r.losses.length ? ` (${r.losses.join('; ')})` : ''}.`);
    let own = null;
    try { own = JSON.parse(gh('api', '-H', 'Accept: application/vnd.github.raw', `repos/${owner}/${r.repo}/contents/pet.json`)).visibility; } catch { /* no pet.json */ }
    if (own && own !== way) console.log(`${r.repo}: its own pet.json still says "${own}"; its chat updates it (the Farmer's round flags the difference until then).`);
  }
  writeFileSync(REG_PATH, raw);
  console.log('pets.json follows. Next: npm run build, then put the change on a branch with a pull request.');
}

// A private copy: a new private repo on the signed-in account with every branch and tag of the source. It is not
// linked to the source the way a fork is: get updates with `git pull <source url> main` (or add it as `upstream`).
function copy(registry, source, name) {
  if (!/^[^/]+\/[^/]+$/.test(source || '')) throw new Error('Name the source as owner/repo, like findastra/astras-pet-os.');
  const [owner, repo] = source.split('/');
  const me = gh('api', 'user', '--jq', '.login');
  if (!sameAccount(owner, me)) assertAnimal(registry, source, 'copy');
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name || '')) throw new Error('The new name is lowercase words joined by hyphens, like jordans-pet-os.');
  if (ghJson(`repos/${me}/${name}`)) throw new Error(`${me}/${name} already exists; nothing changed.`);
  const dir = mkdtempSync(join(tmpdir(), 'pet-privatizer-'));
  try {
    gh('repo', 'create', `${me}/${name}`, '--private', '--description', `Private copy of ${owner}/${repo} (${TOOL})`);
    execFileSync('git', ['clone', '--bare', '--quiet', `https://github.com/${owner}/${repo}.git`, `${dir}/src.git`], { stdio: 'ignore' });
    execFileSync('git', ['push', '--mirror', '--quiet', `https://github.com/${me}/${name}.git`], { cwd: `${dir}/src.git`, stdio: 'ignore' });
  } finally { rmSync(dir, { recursive: true, force: true }); }
  console.log(`${me}/${name}: private copy of ${owner}/${repo}. Updates: git pull https://github.com/${owner}/${repo}.git main`);
}

function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  const flags = new Set(rest.filter((a) => a.startsWith('--')));
  const args = rest.filter((a) => !a.startsWith('--'));
  const way = WAYS.includes(args[0]) ? args.shift() : 'private';
  const registry = JSON.parse(readFileSync(REG_PATH, 'utf8'));
  if (cmd === 'plan') {
    const repos = flags.has('--all') ? farmRepos(registry) : args;
    if (!repos.length) throw new Error('Name the repos, or --all.');
    for (const r of plan(registry, repos, way)) console.log(`${r.repo}: ${r.action === 'none' ? 'no change' : r.action}; ${r.why}.`);
  } else if (cmd === 'apply') {
    if (!flags.has('--yes')) throw new Error('apply changes GitHub: run plan first, then add --yes when the farm owner says so.');
    if (!args.length) throw new Error(`Name the repos to make ${way} (apply never takes --all).`);
    apply(registry, args, way, { acceptLosses: flags.has('--accept-losses') });
  } else if (cmd === 'copy') {
    if (!flags.has('--yes')) throw new Error('copy makes a new private repo: add --yes when the farm owner says so.');
    copy(registry, args[0], args[1]);
  } else {
    const head = readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n');
    console.log(head.slice(0, head.findIndex((l) => !l.startsWith('//'))).join('\n').replace(/^\/\/ ?/gm, ''));
  }
}

// Real paths on both sides: through a junction (Documents\Astra's PetOS) Node gives the script's real folder in
// import.meta.url but the junction in argv[1], and a plain comparison made the tool silently do nothing.
const real = (p) => { try { return realpathSync(p); } catch { return resolve(p); } };
if (process.argv[1] && real(fileURLToPath(import.meta.url)) === real(resolve(process.argv[1]))) {
  try { main(); } catch (e) { console.error(e.message); process.exitCode = 1; }
}
