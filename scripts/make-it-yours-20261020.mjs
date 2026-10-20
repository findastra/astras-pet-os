// The Friendly Farmer's make-it-yours (`the-farm-v1.0-make-it-yours-v1.0`, a tool of The Farm). Astra, 2026-10-20 ("All
// recommended", Part 3 of docs/farm-owner-and-single-pets-20261019.md, card 058): a new farm says whose it is, and a
// beginner never edits JSON by hand. Run it once, in your own copy of Astra's PetOS:
//
//   node scripts/make-it-yours-20261020.mjs <your GitHub name> --dry-run   says what it would change; changes nothing
//   node scripts/make-it-yours-20261020.mjs <your GitHub name>             changes pets.json, then rebuilds the pages
//
// It sets pets.json `github_owner` to your account and gives every pet that came with Astra's PetOS its own
// `"github_owner": "findastra"`, so it stays Astra's: the Friendly Farmer's tools then change only your own pets, and her
// examples still link to her repos. The Friendly Farmer (your copy of the hub) becomes yours, and pets you add later are
// yours without a mark. Run again with another name (a typo, a renamed account), it moves the farm and your own pets to
// that name and leaves Astra's examples hers. It changes only this copy's files, and asks GitHub nothing: you commit the
// change yourself (in a pull request if you like to check first), like every change to your farm's core.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-20.
import { execFileSync } from 'node:child_process';
import { readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assertAccount, farmOwner, sameAccount, upstream } from './farm-owner-20261020.mjs';

export const TOOL = 'the-farm-v1.0-make-it-yours-v1.0';

/** `entry` with `github_owner` set to `owner`, placed right after its repo so it reads next to it. */
function marked(entry, owner) {
  const out = {};
  for (const [k, v] of Object.entries(entry)) { out[k] = v; if (k === 'repo') out.github_owner = owner; }
  if (!('github_owner' in out)) out.github_owner = owner;
  return out;
}

/**
 * The farm `registry` (pets.json) made `account`'s. Returns { registry, was, owner, kept, changed }: `kept` lists the
 * repos marked as Astra's. Never changes the `registry` it is given.
 */
export function makeItYours(registry, account) {
  const owner = assertAccount(typeof account === 'string' ? account.trim().replace(/^@/, '') : account, 'Your GitHub name');
  const was = farmOwner(registry);
  const astra = upstream().owner;
  if (sameAccount(owner, astra) && !sameAccount(was, astra)) {
    throw new Error(`${owner} is Astra's own account. make-it-yours gives a farm to its new owner; to give this one back, change "github_owner" in its pets.json with a pull request.`);
  }
  const kept = [];
  // Only a farm that is still Astra's, as it came, has examples to mark: on a farm that is already someone's, a pet
  // without a mark is that person's own, and moves with the farm.
  const firstTime = sameAccount(was, astra) && !sameAccount(owner, astra);
  const mark = (list) => (list || []).map((e) => {
    if (!firstTime || e.role === 'host' || e.github_owner !== undefined || !e.repo) return e;
    kept.push(e.repo);
    return marked(e, astra);
  });
  const next = {};
  for (const [k, v] of Object.entries(registry)) {
    next[k] = ['pets', 'pipeline', 'candidates'].includes(k) ? mark(v) : v;
    if (k === 'owner' && !('github_owner' in registry)) next.github_owner = owner; // an older copy without the field
  }
  next.github_owner = owner;
  return { registry: next, was, owner, kept, changed: JSON.stringify(next) !== JSON.stringify(registry) };
}

/** What happened, in plain words, for the person who ran it. */
export function report({ was, owner, kept, changed }, { dryRun = false, host = 'the hub' } = {}) {
  const would = (now, then) => (dryRun ? then : now);
  if (!changed) return [`This farm is already ${owner}'s (pets.json "github_owner": "${owner}"). Nothing to change.`];
  const lines = [would(`This farm is now ${owner}'s.`, `This would make the farm ${owner}'s.`) + ` pets.json "github_owner" ${would('was', 'is')} "${was}".`];
  if (kept.length) lines.push(`${kept.length} of Astra's pets ${would('stay', 'would stay')} hers, each marked "github_owner": "${upstream().owner}", so her repos are never changed from here${dryRun ? `: ${kept.join(', ')}` : ''}.`);
  lines.push(`The Friendly Farmer (your copy of the hub, ${host}) ${would('is', 'would be')} yours, and so is every pet you add later.`);
  if (dryRun) lines.push('Nothing was changed. Run it again without --dry-run to make the change.');
  return lines;
}

const real = (p) => { try { return realpathSync(p); } catch { return resolve(p); } };
if (process.argv[1] && real(fileURLToPath(import.meta.url)) === real(resolve(process.argv[1]))) {
  const args = process.argv.slice(2);
  const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
  const name = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--registry');
  const hubRoot = fileURLToPath(new URL('..', import.meta.url));
  const file = opt('--registry') ? resolve(opt('--registry')) : resolve(hubRoot, 'pets.json');
  const dryRun = args.includes('--dry-run');
  if (!name) {
    console.error('Say your GitHub name: node scripts/make-it-yours-20261020.mjs <your GitHub name> [--dry-run]\n(gh auth status shows the name you are signed in with.)');
    process.exit(2);
  }
  try {
    const registry = JSON.parse(readFileSync(file, 'utf8'));
    const result = makeItYours(registry, name);
    console.log(report(result, { dryRun, host: registry.cage || 'the hub' }).join('\n'));
    if (result.changed && !dryRun) {
      writeFileSync(file, `${JSON.stringify(result.registry, null, 2)}\n`);
      if (!args.includes('--no-build') && !opt('--registry')) {
        console.log('Rebuilding the pages from pets.json (npm run build) ...');
        execFileSync(process.execPath, ['scripts/build.mjs', '--metadata-only'], { cwd: hubRoot, stdio: 'inherit' });
      }
      console.log(`Next: save this as a commit in your copy, for example: git commit -am "Make the farm mine". The Friendly Farmer's tools now change only your own pets, and only while you are signed in to GitHub as ${result.owner} (gh auth status shows who that is).`);
    }
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}
