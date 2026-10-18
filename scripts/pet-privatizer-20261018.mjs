// The Friendly Farmer's pet-privatizer (the-farm-v1.0-pet-privatizer-v1.0): makes a pet's repo private on GitHub, or
// every repo of a farm, and makes a private copy of a repo that GitHub cannot make private (a fork of a public repo).
// Astra, 2026-10-18: "I need to build a farmer tool that privatizes pets from public to private. people need their farm
// repos to spawn on GitHub as entirely private." Claude Opus 5.5 (claude-opus-5-5), 2026-10-18.
//
//   node scripts/pet-privatizer-20261018.mjs plan <repo...>          what would change, and what would be lost (read-only)
//   node scripts/pet-privatizer-20261018.mjs plan --all               the same for every repo of the farm
//   node scripts/pet-privatizer-20261018.mjs apply <repo...> --yes [--accept-losses]
//   node scripts/pet-privatizer-20261018.mjs copy <owner/repo> <new-name> --yes
//
// Only animals (registered and pipeline pets in pets.json, and the hub itself) on the farm's own GitHub account
// (scripts/animal-guard-20261013.mjs). It changes repo settings with the farm owner's GitHub sign-in, so it runs only
// when the owner (L4) asks: --yes is that OK. Making a repo private erases its stars and watchers on GitHub, cuts its
// forks loose (they stay public) and stops its GitHub Pages site on a free account: apply refuses when there is any of
// that to lose, unless --accept-losses. After apply, pets.json says `private` (the Farmer's daily round would copy it
// from GitHub too); run `npm run build` and put the change on a branch, like every hub change.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GITHUB_OWNER, animalRepos, assertAnimal } from './animal-guard-20261013.mjs';
import { setRegistryField } from './pet-program-link-20261018.mjs';

export const TOOL = 'the-farm-v1.0-pet-privatizer-v1.0';

/** What making one repo private would do. `meta` is GitHub's repo record; `pages` whether it has a Pages site. */
export function assess(meta, pages = false) {
  const out = { repo: meta.name, private: !!meta.private, fork: !!meta.fork, losses: [], action: 'privatize', why: '' };
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

/** The repos `--all` means: every animal on the farm (registered and pipeline pets, and the hub). */
export const farmRepos = (registry) => [...animalRepos(registry)].sort();

/** pets.json text with `repo` set to private, keeping the file's own layout (the hub is the Friendly Farmer's entry). */
export function markPrivate(raw, repo) {
  const reg = JSON.parse(raw);
  const e = [...(reg.pets || []), ...(reg.pipeline || [])].find((x) => x.repo === repo);
  if (!e || e.visibility === 'private') return raw;
  return setRegistryField(raw, repo, 'visibility', 'private');
}

const gh = (...a) => execFileSync('gh', a, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 << 20 }).trim();
const ghJson = (path) => { try { return JSON.parse(gh('api', path)); } catch { return null; } };
const hasPages = (owner, repo) => { try { gh('api', `repos/${owner}/${repo}/pages`); return true; } catch { return false; } };
const REG_PATH = fileURLToPath(new URL('../pets.json', import.meta.url));

function plan(registry, repos) {
  const rows = [];
  for (const repo of repos) {
    assertAnimal(registry, repo, 'plan a visibility change for');
    const meta = ghJson(`repos/${GITHUB_OWNER}/${repo}`);
    if (!meta) { rows.push({ repo, action: 'none', why: 'not on GitHub' }); continue; }
    rows.push(assess(meta, !meta.private && hasPages(GITHUB_OWNER, repo)));
  }
  return rows;
}

function apply(registry, repos, { acceptLosses }) {
  const rows = plan(registry, repos);
  let raw = readFileSync(REG_PATH, 'utf8');
  for (const r of rows) {
    if (r.action !== 'privatize') { console.log(`${r.repo}: not changed (${r.why}).`); continue; }
    if (r.losses.length && !acceptLosses) { console.log(`${r.repo}: not changed: ${r.why}. Run again with --accept-losses if that is fine.`); continue; }
    gh('repo', 'edit', `${GITHUB_OWNER}/${r.repo}`, '--visibility', 'private', '--accept-visibility-change-consequences');
    const now = ghJson(`repos/${GITHUB_OWNER}/${r.repo}`);
    if (!now?.private) { console.log(`${r.repo}: GitHub did not make it private; nothing else changed.`); continue; }
    raw = markPrivate(raw, r.repo);
    console.log(`${r.repo}: private now${r.losses.length ? ` (${r.losses.join('; ')})` : ''}.`);
  }
  writeFileSync(REG_PATH, raw);
  console.log('pets.json follows. Next: npm run build, then put the change on a branch with a pull request.');
}

// A private copy: a new private repo on the signed-in account with every branch and tag of the source. It is not
// linked to the source the way a fork is: get updates with `git pull <source url> main` (or add it as `upstream`).
function copy(registry, source, name) {
  const [owner, repo] = source.split('/');
  const me = gh('api', 'user', '--jq', '.login');
  if (owner !== me) assertAnimal(registry, source, 'copy');
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
  const registry = JSON.parse(readFileSync(REG_PATH, 'utf8'));
  if (cmd === 'plan') {
    const repos = flags.has('--all') ? farmRepos(registry) : args;
    if (!repos.length) throw new Error('Name the repos, or --all.');
    for (const r of plan(registry, repos)) console.log(`${r.repo}: ${r.action === 'none' ? 'no change' : r.action}; ${r.why}.`);
  } else if (cmd === 'apply') {
    if (!flags.has('--yes')) throw new Error('apply changes GitHub: run plan first, then add --yes when the farm owner says so.');
    if (!args.length) throw new Error('Name the repos to make private (apply never takes --all).');
    apply(registry, args, { acceptLosses: flags.has('--accept-losses') });
  } else if (cmd === 'copy') {
    if (!flags.has('--yes')) throw new Error('copy makes a new private repo: add --yes when the farm owner says so.');
    copy(registry, args[0], args[1]);
  } else {
    console.log(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(0, 16).join('\n').replace(/^\/\/ ?/gm, ''));
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  try { main(); } catch (e) { console.error(e.message); process.exitCode = 1; }
}
