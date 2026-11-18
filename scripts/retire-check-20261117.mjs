// retire-check: a tool of The Farm (Friendly Farmer). After a pet is retired or folded into another pet, it finds
// everything that still treats it as a pet: in the hub's registry, map, pages, Markdown pets, words and art; in every pet
// repo on the PC; in the PC's folders; and, with --github, its repo on GitHub.
// Astra, 2026-11-17: "make sure to delete it everywhere, not sure about pet deletion, if the farmer has a rule to scrub
// everything or archive, etc. make a protocol and update his software please". The protocol is the trick
// skills/retire-a-pet/SKILL.md. Claude Opus 5.5 (claude-opus-5-5), 2026-11-17.
//
// Read only: it reports, Astra decides, and the trick says what to do with each line. Records keep the old name on
// purpose (changes/, handoffs/, scan reports, audit rounds, dated snapshots): they say what happened.
//
//   node scripts/retire-check-20261117.mjs                    # every pet in pets.json `retired_pets`
//   node scripts/retire-check-20261117.mjs --pet port-web     # one of them
//   node scripts/retire-check-20261117.mjs --local "<folder holding the pet repos>" --data "<Astra's PetOS Data>"
//   node scripts/retire-check-20261117.mjs --github           # also asks GitHub (gh) whether its repo is archived
//   node scripts/retire-check-20261117.mjs --fetch            # fetches each pet repo first (each is read at its main on GitHub)
//   npm run retire-check
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

const read = (f) => JSON.parse(readFileSync(f, 'utf8'));
const lists = (registry) => ['pets', 'pipeline', 'seeds', 'candidates'].flatMap((k) => (Array.isArray(registry[k]) ? registry[k] : []));

/** Every retired pet: { repo, pet, program, number, retired, how, into, tool, repo_state, why } */
export function retiredPets(registry) {
  return Array.isArray(registry.retired_pets) ? registry.retired_pets : [];
}

// A record says what happened and keeps the old name; everything else is live and must not treat the pet as a pet.
const RECORD = [
  /^changes\//, /^handoffs\//, /^scans\//, /^reports\//, /^research_notes\//, /^status\//, /(^|\/)test\/fixtures\//,
  /^docs\/flash-audit-rounds-/, /^docs\/[^/]*(audit|assessment|review)[^/]*\.md$/, /^skills\/retire-a-pet\//, /^test\/retired-pets-test-/, /^docs\/architecture\/reference-/,
  /^docs\/linux-readiness-/, /^art\/drafts\//, /^art\/latest\/drafts\//, /(^|\/)data\/catalog(-public)?-\d{8}\./,
  /(^|\/)project-images(-\d{8})?\.(js|json)$/, /\.log$/,
];
export const isRecord = (path) => RECORD.some((r) => r.test(path.replace(/\\/g, '/')));

// A line that names the pet only to say it is gone, or what it was, is history, not a live use.
// Only the words near the name count, so one long generated line can't hide a live use.
export const HISTORY = /retire|fold|no longer a pet|until \d{4}-\d{2}-\d{2}|\(was |formerly|squish|archived/i;
export function nearName(text, terms, span = 120) {
  const low = text.toLowerCase();
  const at = Math.min(...terms.map((t) => low.indexOf(t.toLowerCase())).filter((i) => i >= 0));
  return Number.isFinite(at) ? text.slice(Math.max(0, at - span), at + span) : text;
}

/**
 * The hub's own places where a retired pet must not be: checked from the files, so the test can use it.
 * @returns {{ where: string, what: string }[]}
 */
export function hubLeftovers(root, pet) {
  const out = [];
  const add = (where, what) => out.push({ where, what });
  const programs = read(join(root, 'pet-programs.json')).programs;
  for (const p of programs) {
    if (p.repo === pet.repo) add('pet-programs.json', `pet program ${p.number} still has repo ${p.repo}`);
    if (pet.number != null && p.number === pet.number) add('pet-programs.json', `number ${p.number} is in use again (${p.icon}); a retired number stays unused`);
  }
  const registry = read(join(root, 'pets.json'));
  for (const p of lists(registry)) if (p.repo === pet.repo || (pet.pet && p.pet === pet.pet)) add('pets.json', `${p.pet} (${p.repo}) is still listed`);
  const map = read(join(root, 'system-map.json'));
  for (const n of map.nodes || []) if (n.id === pet.repo || n.of === pet.repo) add('system-map.json', `node ${n.id}`);
  for (const l of map.links || []) if (l.from === pet.repo || l.to === pet.repo) add('system-map.json', `link ${l.from} -> ${l.to}`);
  if (map.code?.repos?.[pet.repo]) add('system-map.json', `code.repos.${pet.repo}`);
  if (map.hats?.[pet.repo]) add('system-map.json', `hats.${pet.repo}`);
  const words = join(root, 'developer-words-20261019.json');
  if (existsSync(words) && new RegExp(`"${pet.repo}"\\s*:`).test(readFileSync(words, 'utf8'))) add('developer-words-20261019.json', `"${pet.repo}" still has developer words`);
  for (const f of [`apps/pet-programs/${pet.repo}-20261018.html`, `markdown-pets/${pet.repo}-20261019.md`]) if (existsSync(join(root, f))) add(f, 'its page is still built');
  const slug = pet.art || (pet.pet || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (slug) for (const f of [`desktop-art/${slug}`, `art/moods/${slug}`, `art/latest/moods/${slug}`, `art/latest/desktop-art/${slug}`]) if (existsSync(join(root, f))) add(f, 'its art is still in the art source');
  return out;
}

const gitOut = (dir, args) => execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['pipe', 'pipe', 'ignore'] });

// What a repo shares is its main on GitHub, not whatever branch a PC folder has checked out (an old branch, or another
// chat's work). So each pet repo is read at origin's default branch, as last fetched (--fetch fetches it first).
export function sharedRef(dir) {
  for (const r of ['origin/HEAD', 'origin/main', 'origin/master']) {
    try { gitOut(dir, ['rev-parse', '--verify', '--quiet', r]); return r; } catch { /* next */ }
  }
  return 'HEAD';
}
const remoteOf = (dir) => { try { return gitOut(dir, ['remote', 'get-url', 'origin']).trim().toLowerCase().replace(/\.git$/, ''); } catch { return null; } };

/** Tracked files in one repo (at `ref`, else the working tree) that name the pet, split into live mentions and records. */
export function textMentions(repoDir, pet, ref = null) {
  const terms = [pet.repo, pet.pet, pet.program].filter(Boolean);
  let raw = '';
  try {
    raw = gitOut(repoDir, ['grep', '-n', '-I', '-i', '-F', ...terms.flatMap((t) => ['-e', t]), ...(ref ? [ref] : []), '--', '.']);
  } catch { return { live: [], records: 0 }; }
  const live = []; let records = 0;
  for (let line of raw.split(/\r?\n/).filter(Boolean)) { // a file with CRLF endings leaves a \r, which "." won't match
    if (ref && line.startsWith(`${ref}:`)) line = line.slice(ref.length + 1);
    const m = line.match(/^(.*?):(\d+):(.*)$/); if (!m) continue;
    const [, file, n, text] = m;
    if (isRecord(file)) { records++; continue; }
    // The hub's registry is checked entry by entry (hubLeftovers); its retired_pets list keeps the name on purpose.
    if (file === 'pets.json' && existsSync(join(repoDir, 'pet-programs.json'))) continue;
    const near = nearName(text, terms);
    if (HISTORY.test(near)) continue;
    live.push({ file, line: Number(n), text: near.trim().slice(0, 160) });
  }
  return { live, records };
}

function gitRepos(folder) {
  if (!existsSync(folder)) return [];
  return readdirSync(folder).map((n) => join(folder, n)).filter((d) => { try { return statSync(d).isDirectory() && existsSync(join(d, '.git')); } catch { return false; } });
}

function githubState(owner, repo) {
  try {
    const s = execFileSync('gh', ['repo', 'view', `${owner}/${repo}`, '--json', 'isArchived,visibility'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    const j = JSON.parse(s); return j.isArchived ? `archived (${j.visibility.toLowerCase()})` : `NOT archived (${j.visibility.toLowerCase()})`;
  } catch { return 'gone, or gh cannot see it'; }
}

export function check({ root, local, data, github = false, only = null, fetch = false }) {
  const registry = read(join(root, 'pets.json'));
  const owner = registry.github_owner || registry.owner || 'findastra';
  const pets = retiredPets(registry).filter((p) => !only || p.repo === only);
  return pets.map((pet) => {
    const hub = hubLeftovers(root, pet);
    const repos = [];
    // The hub is checked as it is (the branch being changed); every other repo once, at its main on GitHub, however many
    // folders on the PC hold a copy of it.
    const seen = new Set([remoteOf(root)].filter(Boolean));
    const { live: hubLive, records: hubRecords } = textMentions(root, pet);
    if (hubLive.length || hubRecords) repos.push({ repo: 'hub', live: hubLive, records: hubRecords });
    for (const dir of gitRepos(local)) {
      const r = resolve(dir);
      if (r.split(/[\\/]/).pop() === pet.repo) continue; // its own clone is reported as a PC folder
      const remote = remoteOf(dir) || r.toLowerCase();
      if (seen.has(remote)) continue; seen.add(remote);
      if (fetch) { try { gitOut(dir, ['fetch', '--quiet', 'origin']); } catch { /* offline: last fetch */ } }
      const ref = sharedRef(dir);
      const { live, records } = textMentions(dir, pet, ref);
      const name = remote.split('/').pop();
      if (live.length || records) repos.push({ repo: ref === 'HEAD' ? `${name} (this folder)` : `${name} (GitHub main)`, live, records });
    }
    const folders = [];
    if (local && existsSync(join(local, pet.repo))) folders.push(join(local, pet.repo));
    if (data && existsSync(join(data, pet.repo))) folders.push(join(data, pet.repo));
    return { pet, hub, repos, folders, github: github ? githubState(owner, pet.repo) : null };
  });
}

function main(argv) {
  const here = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const arg = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : null; };
  // The pet repos live in Documents, in the Astra's PetOS folder (Astra, 2026-10-17), never next to a worktree in Temp.
  const local = arg('--local') || join(homedir(), 'Documents', "Astra's PetOS");
  const data = arg('--data') || resolve(local, '..', "Astra's PetOS Data");
  const results = check({ root: here, local, data, github: argv.includes('--github'), fetch: argv.includes('--fetch'), only: arg('--pet') });
  if (!results.length) { console.log('No retired pets in pets.json (retired_pets).'); return 0; }
  let left = 0;
  for (const r of results) {
    const p = r.pet;
    console.log(`\n${p.pet} (${p.program}, pet program ${p.number}, ${p.repo}): ${p.how} ${p.retired}${p.into ? ` into ${p.into}` : ''}`);
    if (r.github) console.log(`  GitHub: ${r.github}`);
    for (const h of r.hub) { left++; console.log(`  HUB   ${h.where}: ${h.what}`); }
    for (const x of r.repos) {
      for (const l of x.live) { left++; console.log(`  LIVE  ${x.repo}/${l.file}:${l.line}  ${l.text}`); }
      if (x.records) console.log(`  kept  ${x.repo}: ${x.records} line(s) in records (history keeps the old name)`);
    }
    for (const f of r.folders) { left++; console.log(`  PC    ${f} (check for unsaved work and running programs, then the Recycle Bin)`); }
  }
  console.log(left ? `\n${left} thing(s) still treat a retired pet as a pet. skills/retire-a-pet/SKILL.md says what to do with each.` : '\nClean: nothing treats a retired pet as a pet.');
  return left ? 1 : 0;
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) process.exitCode = main(process.argv.slice(2));
