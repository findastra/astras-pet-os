// Idle Flash Audit: refresh. Brings every fix branch up to date with its repo's default branch (that branch
// wins where both changed a line; files it deleted stay deleted), then applies the fixes again on top.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-18.
//   FLASH_DATE=<date of the fix branches> node scripts/idle-flash-refresh-20261018.mjs <ledger.json> [repo,repo] [--dry]
// How to run it: docs/idle-flash-audit-20261017.md.
// Applies only fixes that need no decision from Astra, each in a fresh clone on branch
// claude/flash-audit-fixes-20261017, then pushes and opens a pull request. Never touches the
// working copies on Astra's PC, never pushes to a default branch.
//   node scripts/idle-flash-fix-20261017.mjs <ledger.json> [repo,repo] [--dry]
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { applyA59Repo } from './pet-program-link-20261018.mjs';

const [ledgerPath, onlyArg] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const DRY = process.argv.includes('--dry');
const ONLY = (onlyArg || '').split(',').filter(Boolean);
const DATE = (process.env.FLASH_DATE || new Date().toISOString().slice(0, 10)).replaceAll('-', '');
const BRANCH = `claude/flash-audit-fixes-${DATE}`;
const ISO = `${DATE.slice(0, 4)}-${DATE.slice(4, 6)}-${DATE.slice(6)}`;
// The assistant running the audit records itself (house rule: model and version on every change).
const MODEL = process.env.FLASH_MODEL || 'Claude Opus 5.5 (`claude-opus-5-5`)';
const COAUTHOR = process.env.FLASH_COAUTHOR || 'Claude Opus 5.5 <noreply@anthropic.com>';
// Fresh clones live in a short temp folder (Windows long paths are off on Astra's PC).
const W = process.env.FLASH_WORK || `${tmpdir()}/idle-flash-audit`.replaceAll('\\', '/');
mkdirSync(W, { recursive: true });
const ledger = JSON.parse(readFileSync(ledgerPath, 'utf8'));
const levels = execFileSync('gh', ['api', '-H', 'Accept: application/vnd.github.raw', 'repos/findastra/astras-pet-os/contents/INTELLIGENCE-LEVELS.md?ref=main'], { encoding: 'utf8', maxBuffer: 32 << 20 });
const levelRows = {};
for (const line of levels.split('\n')) {
  if (!line.startsWith('| <img')) continue;
  const c = line.split('|').map((s) => s.trim());
  const repo = (c[4].match(/\]\(https:\/\/github\.com\/findastra\/([^)]+)\)/) || [])[1] || c[4];
  levelRows[repo] = { program: c[5], runtime: c[6], updates: c[7], harness: c[8] };
}

const git = (cwd, ...a) => execFileSync('git', a, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const results = existsSync(`${W}/fix-results.json`) ? JSON.parse(readFileSync(`${W}/fix-results.json`, 'utf8')) : {};
const save = () => writeFileSync(`${W}/fix-results.json`, JSON.stringify(results, null, 1));

// Repos whose README is a product's own README, not a pet README: names and links only.
const PRODUCT_README = new Set(['data-dealer']);
// Role Fairy is a pet again (Astra, 2026-10-17, card 020), which overrides the 2026-10-09 "go away".
const SKIP_REPO = new Set([]);
const registry = JSON.parse(execFileSync('gh', ['api', '-H', 'Accept: application/vnd.github.raw', 'repos/findastra/astras-pet-os/contents/pets.json?ref=main'], { encoding: 'utf8', maxBuffer: 32 << 20 }));
const regOf = (repo) => [...(registry.pets || []), ...(registry.pipeline || [])].find((e) => e.repo === repo);
// Art-only repos: a software licence on art is Astra's call, not a blatant fix.
const NO_LICENSE = new Set(['spoonfed']);
const HISTORY = /\b(was|were|renamed|formerly|previously|retired|old name|used to|then `)\b/i;
const STATE_PATH = /LOCALAPPDATA|LocalApplicationData|AppData[\\/]+Local/i;
const SKIP_FILE = (p) => /^handoffs\//.test(p) || /^docs\/.*(handoff|publications|audit-?record)/i.test(p) || /(^|\/)(node_modules|\.git)\//.test(p) || /\.min\.js$/.test(p);
const TEXT = /\.(md|json|html?|txt|yml|yaml|toml|svg)$/i;
// Code files (js, mjs, cs, ps1...) are left alone: a name inside code can be behaviour (old-name detection, test fixtures). They are reported in the round cards instead.

// A name followed by "-" or ".x" is a file name (apps/astras-pet-apps-20261008.html still exists in
// the hub), and a name inside <script> can be a storage key, so both are left as they are.
const OLD = '(astras-pet-apps|findastra-pet-apps)(?![-\\w]|\\.[a-z])';
function retireChunk(chunk, count) {
  if (HISTORY.test(chunk)) return chunk;
  let l = chunk;
  const swap = (re, to) => { l = l.replace(re, (...m) => { count.n++; return typeof to === 'function' ? to(...m) : to; }); };
  if (!STATE_PATH.test(l)) {
    swap(new RegExp(`findastra/${OLD}`, 'g'), 'findastra/astras-pet-os');
    swap(new RegExp(`\\b${OLD}`, 'g'), 'astras-pet-os');
  }
  swap(/Astra(['’]|&#x27;|&#39;|&apos;|&rsquo;)s Pet Apps/g, (m, q) => `Astra${q}s PetOS`);
  swap(/Documents([\\/]+)Projects(?=[\\/])/g, (m, s) => `Documents${s}Astra's PetOS`);
  // A bare `Projects\astras-pet-os` (the hub's old folder, written short) is now `Astra's PetOS\astras-pet-os`.
  swap(/(?<![\w\\/])Projects([\\/]+)(?=astras-pet-os\b)/g, (m, s) => `Astra's PetOS${s}`);
  return l;
}
function retire(text, html = false) {
  const count = { n: 0 };
  if (!html) return { text: text.split('\n').map((line) => retireChunk(line, count)).join('\n'), n: count.n };
  // HTML: skip script blocks; judge history per piece of text between tags, not per (one-line) file.
  const out = text.split(/(<script\b[\s\S]*?<\/script>)/i).map((seg) => /^<script\b/i.test(seg) ? seg
    : seg.split(/(?<=>)|(?=<)/).map((piece) => retireChunk(piece, count)).join(''));
  return { text: out.join(''), n: count.n };
}

const clean = (s) => (s || '').replace(/<br\s*\/?>/gi, '; ').replace(/<[^>]+>/g, '').replace(/\$\\color\{red\}\{\\textsf\{([^}]*)\}\}\$/g, '$1').replace(/\s+/g, ' ').trim();


// ---- fix2: re-apply the Flash Audit fixes on top of each repo's current default branch ----
const TODAY = new Date().toISOString().slice(0, 10);
const NEWCREDIT = 'An Intelligent App, or Pet, by Astra';
const CREDIT_SKIP = (p) => /prompt|provenance|(^|\/)handoffs\/|node_modules|\.min\./i.test(p);
function credit(text, html) {
  let n = 0;
  const swap = (t) => t
    .replace(/\*A pet app by Astra\.\*/g, () => { n++; return `*${NEWCREDIT}.*`; })
    .replace(/<em>A pet app by Astra\.<\/em>/g, () => { n++; return `<em>${NEWCREDIT}.</em>`; })
    .replace(/\bA pet app by Astra(?=[,.])/g, () => { n++; return NEWCREDIT; })
    .replace(/\b(is|,) a pet app by Astra\b/g, (m, w) => { n++; return `${w} an Intelligent App, or Pet, by Astra`; });
  if (!html) return { text: swap(text), n };
  return { text: text.split(/(<script\b[\s\S]*?<\/script>)/i).map((seg) => /^<script\b/i.test(seg) ? seg : swap(seg)).join(''), n };
}
const catalogNow = Object.fromEntries(JSON.parse(execFileSync('gh', ['api', '-H', 'Accept: application/vnd.github.raw', 'repos/findastra/astras-pet-os/contents/pet-programs.json?ref=main'], { encoding: 'utf8', maxBuffer: 32 << 20 })).programs.map((p) => [p.number, p]));
const CARD008 = /Not in the Cage yet\. Registering it is \[card 008\]\(https:\/\/github\.com\/findastra\/astras-pet-(?:os|apps)\/blob\/main\/handoffs\/008-farmer-register-new-placeholders\.md\) for the Friendly Farmer\./;
const results2 = {};
for (const rec of ledger) {
  if (!rec.audited) continue;
  const repo = rec.audited.repo;
  if (ONLY.length && !ONLY.includes(repo)) continue;
  if (!results[repo]?.pr) continue;
  const dir = `${W}/c/${repo}`;
  const log = [];
  const g = (...a) => git(dir, ...a);
  try {
    if (!existsSync(dir)) execFileSync('gh', ['repo', 'clone', `findastra/${repo}`, dir, '--', '--filter=blob:none', '--quiet'], { stdio: 'ignore' });
    try { g('merge', '--abort'); } catch {}
    g('fetch', '-q', 'origin');
    g('checkout', '-q', '-f', BRANCH);
    g('reset', '-q', '--hard', `origin/${BRANCH}`);
    g('config', 'user.name', 'findastra'); g('config', 'user.email', '88600745+findastra@users.noreply.github.com');
    const base = rec.audited.ref;
    const behind = Number(g('rev-list', '--count', `HEAD..origin/${base}`));
    if (behind) {
      try { g('merge', '-q', '--no-edit', '-X', 'theirs', '-m', `Merge ${base} into the Flash Audit fixes (today's ${base} wins where they overlap)`, `origin/${base}`); log.push(`Brought up to date with ${base} (${behind} new commit(s) there); where both changed a line, ${base}'s version was kept and the fixes below were applied again on top.`); }
      catch (e) {
        // -X theirs settles overlapping edits; a file today's base deleted (and this branch edited) is
        // deleted too, because the base moved it on purpose (A58 one art source). Anything else waits.
        const st = g('status', '--porcelain').split('\n').filter((l) => /^(UU|AA|DU|UD|AU|UA|DD) /.test(l));
        const goneOnBase = st.filter((l) => l.startsWith('UD ')).map((l) => l.slice(3));
        const other = st.filter((l) => !l.startsWith('UD '));
        if (!other.length && goneOnBase.length) {
          for (const f of goneOnBase) g('rm', '-q', '--', f);
          g('commit', '-q', '--no-edit');
          log.push(`Brought up to date with ${base} (${behind} new commit(s) there); ${base}'s version was kept where both changed a line, and ${goneOnBase.join(', ')} stays deleted as ${base} deleted it.`);
        } else { try { g('merge', '--abort'); } catch {} throw new Error(`merge with ${base} needs a person: ${st.join('; ') || String(e.stderr || e.message).slice(0, 200)}`); }
      }
    }
    const files = g('ls-files').split('\n').filter((p) => TEXT.test(p) && !SKIP_FILE(p));
    // 1. Retired names.
    let renamed = 0; const touched = [];
    for (const p of files) {
      let t; try { t = readFileSync(`${dir}/${p}`, 'utf8'); } catch { continue; }
      if (t.includes('\u0000')) continue;
      const { text, n } = retire(t, /\.html?$/i.test(p));
      if (n) { writeFileSync(`${dir}/${p}`, text); renamed += n; touched.push(p); }
    }
    if (renamed) log.push(`Retired names again after the merge: ${renamed} in ${touched.join(', ')}.`);
    // 2. pet.json from today's registry and list of names (never over a pending submission).
    const pjPath = `${dir}/pet.json`;
    if (existsSync(pjPath)) {
      const raw = readFileSync(pjPath, 'utf8'); let pj = null; try { pj = JSON.parse(raw); } catch {}
      if (pj) {
        const sub = pj.cage?.submit || {}; const reg = regOf(repo); const cat = catalogNow[rec.number]; const ch = [];
        if (cat?.icon && !/^pet-program-/.test(cat.icon) && pj.pet !== cat.icon && !sub.pet) { ch.push(`pet "${pj.pet}" -> "${cat.icon}"`); pj.pet = cat.icon; }
        if (reg?.job && pj.job !== reg.job && !/placeholder|not decided/i.test(reg.job)) { if (!sub.job) { ch.push('job now matches the registry'); pj.job = reg.job; } else log.push(`Not changed: the pet submitted its own job on ${sub.date || '?'}; that waits on the Farmer and Astra.`); }
        if (reg?.audit && !pj.audit && !sub.audit) { ch.push('audit block from the registry'); pj.audit = reg.audit; }
        if (ch.length) { const indent = (raw.match(/\n( +)"/) || [, '  '])[1].length; writeFileSync(pjPath, JSON.stringify(pj, null, indent) + '\n'); log.push(`pet.json: ${ch.join('; ')}.`); }
      }
    }
    // 3. Missing required files.
    const addFile = (name, body) => { if (!existsSync(`${dir}/${name}`)) { writeFileSync(`${dir}/${name}`, body); return true; } return false; };
    if (addFile('CLAUDE.md', `# Assistant handoff\n\nRead and follow [AGENTS.md](AGENTS.md) first, then the hub's rules in [findastra/astras-pet-os](https://github.com/findastra/astras-pet-os/blob/main/AGENTS.md). Public credit is Astra. Record the model and version for changes.\n\nAdded by ${MODEL}, ${TODAY}, in the Idle Flash Audit (A14).\n`)) log.push('Added CLAUDE.md.');
    // 4. README: credit, Limits, the stale card 008 line.
    const rmPath = `${dir}/README.md`;
    if (existsSync(rmPath) && !PRODUCT_README.has(repo)) {
      let rm = readFileSync(rmPath, 'utf8'); const before = rm;
      if (!/An Intelligent App, or Pet, by Astra|A pet app by Astra/i.test(rm)) { rm = /^#\s.+$/m.test(rm) ? rm.replace(/^(#\s.+)$/m, `$1\n\n*${NEWCREDIT}.*`) : `*${NEWCREDIT}.*\n\n${rm}`; log.push(`README: credit line "*${NEWCREDIT}.*".`); }
      const row = levelRows[repo];
      if (row && !/^#{2,3}\s.*(limit|not done|known)/im.test(rm)) { rm = rm.replace(/\s*$/, '') + `\n\n## Limits\n\nWhat is not done, plainly. From the hub's [intelligence levels](https://github.com/findastra/astras-pet-os/blob/main/INTELLIGENCE-LEVELS.md) (checked ${TODAY}):\n\n- **Program (L1/L2):** ${clean(row.program)}\n- **Runtime (L2):** ${clean(row.runtime)}\n- **Agentic harness (L3):** ${clean(row.harness).replace(/^—\s*$/, '— not built yet')}\n`; log.push('README: Limits section from INTELLIGENCE-LEVELS.md.'); }
      if (CARD008.test(rm)) { rm = rm.replace(CARD008, "In the hub's registry as a pipeline pet ([pets.json](https://github.com/findastra/astras-pet-os/blob/main/pets.json)): it has its own repo and is not registered yet."); log.push('README: the stale card 008 line now says it is a pipeline pet.'); }
      if (rm !== before) writeFileSync(rmPath, rm);
    }
    // 5. Card 033 credit everywhere it shows.
    let cn = 0; const ct = [];
    for (const p of g('ls-files').concat('\n').split('\n').filter((f) => /\.(md|html?)$/i.test(f) && !CREDIT_SKIP(f))) {
      let t; try { t = readFileSync(`${dir}/${p}`, 'utf8'); } catch { continue; }
      const r = credit(t, /\.html?$/i.test(p)); if (r.n) { writeFileSync(`${dir}/${p}`, r.text); cn += r.n; ct.push(p); }
    }
    if (cn) log.push(`Credit line is now "${NEWCREDIT}." (card 033): ${cn} change(s) in ${ct.join(', ')}. Art prompts and provenance notes keep their wording.`);
    // 6. A59: pet.json entry and the README link to the pet program, again on top of today's base.
    const a59 = applyA59Repo(dir, rec.rows, { readme: !PRODUCT_README.has(repo) });
    log.push(...a59.log);
    const status = g('status', '--porcelain');
    results2[repo] = { log, changed: !!status || !!behind, a59: a59.applied };
    if (status) { g('add', '-A'); g('commit', '-q', '-m', `Flash Audit fixes on today's ${base}; credit line for card 033 (${TODAY})\n\n${log.map((l) => '- ' + l).join('\n')}\n\nCo-Authored-By: ${COAUTHOR}`); }
    if (!DRY && (status || behind)) g('push', '-q', 'origin', BRANCH);
    console.error(`${repo}: ${DRY ? 'dry' : 'pushed'} — ${log.length} note(s)`);
  } catch (e) { results2[repo] = { log, error: String(e.message || e).slice(0, 300) }; console.error(`${repo}: ERROR ${results2[repo].error}`); }
}
writeFileSync(`${W}/fix2-results.json`, JSON.stringify(results2, null, 1));
console.error('done');
