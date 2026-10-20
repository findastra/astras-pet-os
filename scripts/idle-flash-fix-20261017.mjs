// Idle Flash Audit: the fixer. Claude Opus 5.5 (claude-opus-5-5), 2026-10-17.
// How to run it: docs/idle-flash-audit-20261017.md.
// Applies only fixes that need no decision from Astra, each in a fresh clone on branch
// claude/flash-audit-fixes-20261017, then pushes and opens a pull request. Never touches the
// working copies on Astra's PC, never pushes to a default branch.
//   node scripts/idle-flash-fix-20261017.mjs <ledger.json> [repo,repo] [--dry]
// A59 (every pet linked to its one pet program, Claude Opus 5.5, 2026-10-18): pet.json `entry` and the README link go
// in each pet's fix branch; pets.json, pet-programs.json and system-map.json fixes go in one fix branch of the hub
// (same branch name, pull request against main). Documents and metadata only, never code.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { applyA59Repo, applyA59Hub, HUB } from './pet-program-link-20261018.mjs';

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
// Astra-only on purpose (card 058, Part 3, 2026-10-20): the Flash Audit fixes Astra's own repos, from her hub. It keeps her account, findastra, and never reads a farm's pets.json github_owner.
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
  const out = text.split(/(<script\b[\s\S]*?<\/script\b[^>]*>)/i).map((seg) => /^<script\b/i.test(seg) ? seg
    : seg.split(/(?<=>)|(?=<)/).map((piece) => retireChunk(piece, count)).join(''));
  return { text: out.join(''), n: count.n };
}

// Drop HTML tags, and an unclosed `<…` too, with a character scan: no `<` is left, so no `<script` can be
// (CodeQL js/incomplete-multi-character-sanitization; a regex replace can leave a tag behind).
const stripTags = (s) => { let out = '', inTag = false; for (const ch of String(s)) { if (ch === '<') inTag = true; else if (ch === '>' && inTag) inTag = false; else if (!inTag) out += ch; } return out; };
const clean = (s) => stripTags((s || '').replace(/<br\s*\/?>/gi, '; ')).replace(/\$\\color\{red\}\{\\textsf\{([^}]*)\}\}\$/g, '$1').replace(/\s+/g, ' ').trim();

for (const rec of ledger) {
  if (!rec.audited) continue;
  const repo = rec.audited.repo;
  if (ONLY.length && !ONLY.includes(repo)) continue;
  if (SKIP_REPO.has(repo)) { console.error(`${repo}: skipped (decision)`); continue; }
  if (results[repo]?.pr) { console.error(`${repo}: already has PR ${results[repo].pr}`); continue; }
  const dir = `${W}/c/${repo}`;
  const log = [];
  try {
    if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
    mkdirSync(`${W}/c`, { recursive: true });
    execFileSync('gh', ['repo', 'clone', `findastra/${repo}`, dir, '--', '--filter=blob:none', '--quiet'], { stdio: 'ignore' });
    git(dir, 'checkout', '-q', '-B', BRANCH, `origin/${rec.audited.ref}`);
    git(dir, 'config', 'user.name', 'findastra');
    git(dir, 'config', 'user.email', '88600745+findastra@users.noreply.github.com');
    const files = git(dir, 'ls-files').split('\n').filter((p) => TEXT.test(p) && !SKIP_FILE(p));

    // 1. Retired names and folders in live text.
    let renamed = 0; const touched = [];
    for (const p of files) {
      const full = `${dir}/${p}`;
      let t; try { t = readFileSync(full, 'utf8'); } catch { continue; }
      if (t.includes('\u0000')) continue;
      const { text, n } = retire(t, /\.html?$/i.test(p));
      if (n) { writeFileSync(full, text); renamed += n; touched.push(p); }
    }
    if (renamed) log.push(`Retired names: ${renamed} replacement(s) in ${touched.join(', ')} (astras-pet-apps / findastra-pet-apps -> astras-pet-os, Astra's Pet Apps -> Astra's PetOS, Documents\\Projects -> Documents\\Astra's PetOS). History lines kept as written.`);

    // 2. pet.json catches up with the registry and the one list of names.
    const pjPath = `${dir}/pet.json`;
    // A pipeline pet with a decided job and audit in the registry but no pet.json gets one built
    // from the registry entry (PET-FILES.md step 1). No sprite yet: its art waits on Astra.
    const reg = regOf(repo);
    if (!existsSync(pjPath) && reg && reg.job && reg.audit && !/placeholder|not decided/i.test(reg.job) && repo === 'role-fairy') {
      const pj = { pet: reg.pet, kind: 'pet-app', owner: 'Astra', program: rec.program, job: reg.job, runs_on: 'Node 24.17 or newer on Astra’s PC, with her own Discord bot application (see README).', entry: 'src/bot.js', status: reg.status || 'hatching',
        cage: { topic: 'pet-app', home: 'README.md', repository: 'https://github.com/findastra/astras-pet-os' },
        audit: reg.audit, built_with: `pet.json from the registry entry by ${MODEL.replaceAll('`', '')}, ${ISO} (Idle Flash Audit)`, updated: ISO };
      writeFileSync(pjPath, JSON.stringify(pj, null, 2) + '\n');
      log.push('Added pet.json from its registry entry (job, status and audit as the registry has them; no sprite yet, its art waits on Astra).');
    }
    if (existsSync(pjPath) && rec.pet) {
      const raw = readFileSync(pjPath, 'utf8');
      let pj; try { pj = JSON.parse(raw); } catch { pj = null; }
      if (pj) {
        const changes = [];
        // A field the pet has submitted to the Farmer (cage.submit) is waiting on the Farmer and
        // Astra; copying the registry over it would undo the submission, so it is reported instead.
        const sub = pj.cage?.submit || {};
        const nameRow = rec.rows.find((r) => r.check === 'A06' && r.fix?.type === 'petjson-name');
        if (nameRow && pj.pet !== rec.icon && !sub.pet) { changes.push(`pet "${pj.pet}" -> "${rec.icon}" (pet-programs.json)`); pj.pet = rec.icon; }
        const jobRow = rec.rows.find((r) => r.fix?.type === 'petjson-job');
        if (jobRow && !sub.job) { changes.push('job now matches the registry'); pj.job = jobRow.fix.to; }
        else if (jobRow) log.push(`Not changed: pet.json job differs from the registry, and the pet submitted a job to the Farmer on ${sub.date || 'an unknown date'}. That submission needs the Farmer and Astra.`);
        const auditRow = rec.rows.find((r) => r.fix?.type === 'petjson-audit');
        if (auditRow && !pj.audit && !sub.audit) { changes.push('audit block copied from the registry'); pj.audit = auditRow.fix.audit; }
        if (changes.length) {
          const indent = (raw.match(/\n( +)"/) || [, '  '])[1].length;
          writeFileSync(pjPath, JSON.stringify(pj, null, indent) + '\n');
          log.push(`pet.json: ${changes.join('; ')}.`);
        }
      }
    }

    // 3. Required files that are simply absent.
    const add = rec.fixes.find((f) => f.type === 'add-files')?.files || [];
    const addFile = (name, body) => { if (!existsSync(`${dir}/${name}`)) { writeFileSync(`${dir}/${name}`, body); return true; } return false; };
    if (add.includes('CLAUDE.md') && addFile('CLAUDE.md', `# Assistant handoff\n\nRead and follow [AGENTS.md](AGENTS.md) first, then the hub's rules in [findastra/astras-pet-os](https://github.com/findastra/astras-pet-os/blob/main/AGENTS.md). Public credit is Astra. Record the model and version for changes.\n\nAdded by ${MODEL}, ${ISO}, in the Idle Flash Audit (A14).\n`)) log.push('Added CLAUDE.md (pointer to AGENTS.md and the hub rules).');
    if (add.includes('AGENTS.md') && addFile('AGENTS.md', `# Assistant rules for ${repo}\n\nPublic credit is always Astra.\n\nThis pet is registered in Astra's PetOS. Read the hub's rules before changing anything: [AGENTS.md](https://github.com/findastra/astras-pet-os/blob/main/AGENTS.md), [PET-FILES.md](https://github.com/findastra/astras-pet-os/blob/main/PET-FILES.md) and [PET-PROGRAM-FRAMEWORK.md](https://github.com/findastra/astras-pet-os/blob/main/PET-PROGRAM-FRAMEWORK.md). Changes to this pet's name, job, status, bubble lines or audit are submitted to the Friendly Farmer through \`cage.submit\` in \`pet.json\`.\n\nKeep keys, \`.env\` files and personal data out of this repo. Record the model and version when an assistant changes it.\n\nAdded by ${MODEL}, ${ISO}, in the Idle Flash Audit (A14).\n`)) log.push('Added AGENTS.md (house rules pointer).');
    if (add.includes('LICENSE') && !rec.repoMeta.private && !NO_LICENSE.has(repo) && addFile('LICENSE', `MIT License\n\nCopyright (c) 2026 findastra\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n`)) log.push('Added LICENSE (MIT, the house default for public pet repos).');

    // 4. README: credit line and a Limits section from INTELLIGENCE-LEVELS.md.
    const rmPath = `${dir}/README.md`;
    if (existsSync(rmPath) && !PRODUCT_README.has(repo)) {
      let rm = readFileSync(rmPath, 'utf8'); const before = rm;
      // Seed and roadmap skeletons started 2026-10-14: same credit in the house wording, and their
      // "Status: nothing is built" block becomes the required "Run it" and "Limits" sections.
      const SKEL = /## Status\r?\n\r?\nNothing is built here yet\. When it is, it follows the (\[Pet Program Framework\]\([^)]+\))\r?\nand passes its checklist\./;
      if (SKEL.test(rm)) {
        rm = rm.replace(/ \*A pet program by Astra\.\*/, '');
        rm = rm.replace(SKEL, (m, link) => `## Run it\n\nNothing to run here yet. When it is built, it follows the ${link} and passes its checklist.\n\n## Limits\n\n- Nothing is built in this repo yet: no program, no runtime, no agent.\n- No pet art yet. Generating art costs money, so it waits on Astra.${/^pet-program-/.test(rec.program) ? '\n- The pet program has no name yet.' : ''}`);
        log.push('README: "Status" became the "Run it" and "Limits" sections the pet file rules ask for.');
        const made = existsSync(`${dir}/AGENTS.md`) && readFileSync(`${dir}/AGENTS.md`, 'utf8').match(/^Created by .+?, \d{4}-\d\d-\d\d, at Astra's request\./m);
        if (made && !/Created by|Started by|Built with/i.test(rm)) { rm = rm.replace(/\s*$/, '') + `\n\n${made[0]}\n`; log.push('README: records who made it and when (copied from AGENTS.md).'); }
      }
      // A pet-program-N title left after the repo took its program's name follows pet-programs.json.
      const titleRow = rec.rows.find((r) => r.fix?.type === 'readme-title');
      if (titleRow && /^#[ \t]+pet-program-\d+[ \t]*\r?$/m.test(rm)) {
        rm = rm.replace(/^#[ \t]+pet-program-\d+[ \t]*(\r?)$/m, (m, cr) => `# ${titleRow.fix.to}${cr}`);
        log.push(`README: the title is now its program's name, ${titleRow.fix.to} (pet-programs.json).`);
      }
      if (rec.rows.some((r) => r.fix?.type === 'credit') && !/An Intelligent App, or Pet, by Astra|A pet app by Astra/i.test(rm)) {
        rm = /^#\s.+$/m.test(rm) ? rm.replace(/^(#\s.+)$/m, '$1\n\n*An Intelligent App, or Pet, by Astra.*') : `*An Intelligent App, or Pet, by Astra.*\n\n${rm}`;
        log.push('README: added the credit line "*An Intelligent App, or Pet, by Astra.*".');
      }
      const row = levelRows[repo];
      if (rec.rows.some((r) => r.fix?.type === 'limits') && row && !/^#{2,3}\s.*(limit|not done|known)/im.test(rm)) {
        rm = rm.replace(/\s*$/, '') + `\n\n## Limits\n\nWhat is not done, plainly. From the hub's [intelligence levels](https://github.com/findastra/astras-pet-os/blob/main/INTELLIGENCE-LEVELS.md) (checked ${ISO}):\n\n- **Program (L1/L2):** ${clean(row.program)}\n- **Runtime (L2):** ${clean(row.runtime)}\n- **Agentic harness (L3):** ${clean(row.harness).replace(/^—\s*$/, '— not built yet')}\n`;
        log.push('README: added a Limits section from INTELLIGENCE-LEVELS.md.');
      }
      // Seeds and roadmap pets have no row in INTELLIGENCE-LEVELS.md (it lists what is built): their Limits say so.
      else if (rec.rows.some((r) => r.fix?.type === 'limits') && !row && ['seed', 'roadmap'].includes(rec.stage) && !/^#{2,3}\s.*(limit|not done|known)/im.test(rm)) {
        rm = rm.replace(/\s*$/, '') + `\n\n## Limits\n\n- This is a ${rec.stage} pet program: it is designed, and nothing runs yet (no program, no runtime, no agent). What is here is its design and its documents.\n- It is not registered: it waits at the gate until Astra lets it in.\n`;
        log.push(`README: added a Limits section (a ${rec.stage}: designed, nothing runs yet).`);
      }
      if (rm !== before) writeFileSync(rmPath, rm);
    }

    // 4b. Links to renamed repos (GitHub redirects them, but the current name is correct), where the audit found them.
    for (const r of rec.rows.filter((x) => x.fix?.type === 'link' && x.fix.to)) {
      for (const f of ['README.md', 'pet.json']) {
        const p = `${dir}/${f}`;
        if (!existsSync(p)) continue;
        const t = readFileSync(p, 'utf8');
        if (!t.includes(r.fix.from)) continue;
        writeFileSync(p, t.split(r.fix.from).join(r.fix.to));
        log.push(`${f}: link to a renamed repo, ${r.fix.from} -> ${r.fix.to}.`);
      }
    }

    // 5. A59: pet.json `entry` opens the program page, and the README links to the program. A product's own README
    // (PRODUCT_README) keeps its text; its missing link stays on the round card.
    const a59 = applyA59Repo(dir, rec.rows, { readme: !PRODUCT_README.has(repo) });
    log.push(...a59.log);

    const status = git(dir, 'status', '--porcelain');
    results[repo] = { log, changed: !!status, a59: a59.applied };
    if (!status) { console.error(`${repo}: nothing to fix`); save(); continue; }
    if (DRY) { results[repo].diff = git(dir, 'diff', '--stat'); console.error(`${repo} (dry):\n  ${log.join('\n  ')}`); save(); continue; }
    git(dir, 'add', '-A');
    git(dir, 'commit', '-q', '-m', `Flash Audit fixes that need no decision (${ISO})\n\n${log.map((l) => '- ' + l).join('\n')}\n\nFound by the overnight Flash Audit (astras-pet-os docs/flash-audit-20261014.md).\n\nCo-Authored-By: ${COAUTHOR}`);
    git(dir, 'push', '-q', '-u', 'origin', BRANCH);
    const body = `Idle Flash Audit, ${ISO}, by ${MODEL}. Only fixes that need no decision from Astra:\n\n${log.map((l) => '- ' + l).join('\n')}\n\nAudited ${rec.audited.ref} at ${rec.audited.commit?.slice(0, 7)}. Decisions and anything not verified are in the round card in astras-pet-os (docs/flash-audit-rounds-${DATE}/).\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)`;
    const pr = execFileSync('gh', ['pr', 'create', '-R', `findastra/${repo}`, '--base', rec.audited.ref, '--head', BRANCH, '--title', `#${rec.number} ${rec.icon}: Flash Audit fixes that need no decision`, '--body', body], { encoding: 'utf8' }).trim().split('\n').pop();
    results[repo].pr = pr; results[repo].commit = git(dir, 'rev-parse', '--short', 'HEAD');
    console.error(`${repo}: ${pr}`);
  } catch (e) {
    results[repo] = { log, error: String(e.stderr || e.message).slice(0, 400) };
    console.error(`${repo}: ERROR ${results[repo].error}`);
  }
  save();
}

// The hub's A59 fixes, in one fix branch of astras-pet-os: pets.json links, a number in pet-programs.json for a pet
// that has none, the System Map line from a pet to its program. The hub is the core: its pull request waits for
// Astra's OK in chat like every other.
const hubFixes = [...new Map(ledger.flatMap((rec) => rec.rows.filter((r) => r.check === 'A59' && r.fix?.where === 'hub').map((r) => [r.fix.id, r.fix]))).values()];
if (hubFixes.length && (!ONLY.length || ONLY.includes(HUB)) && !results[HUB]?.pr) {
  const dir = `${W}/c/${HUB}`;
  const log = [];
  try {
    if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
    mkdirSync(`${W}/c`, { recursive: true });
    execFileSync('gh', ['repo', 'clone', `findastra/${HUB}`, dir, '--', '--filter=blob:none', '--quiet'], { stdio: 'ignore' });
    git(dir, 'checkout', '-q', '-B', BRANCH, 'origin/main');
    git(dir, 'config', 'user.name', 'findastra');
    git(dir, 'config', 'user.email', '88600745+findastra@users.noreply.github.com');
    const a59 = applyA59Hub(dir, hubFixes);
    log.push(...a59.log);
    // The generated files (the README table, the System Map page) follow pets.json; no art is built.
    if (a59.applied.length) { execFileSync(process.execPath, ['scripts/build.mjs', '--metadata-only'], { cwd: dir, stdio: 'ignore' }); log.push('Ran `npm run build -- --metadata-only` so the generated files follow.'); }
    const status = git(dir, 'status', '--porcelain');
    results[HUB] = { log, changed: !!status, a59: a59.applied };
    if (!status) console.error(`${HUB}: nothing to fix`);
    else if (DRY) { results[HUB].diff = git(dir, 'diff', '--stat'); console.error(`${HUB} (dry):\n  ${log.join('\n  ')}`); }
    else {
      git(dir, 'add', '-A');
      git(dir, 'commit', '-q', '-m', `A59: every pet linked to its one pet program (${ISO})\n\n${log.map((l) => '- ' + l).join('\n')}\n\nFound by the Idle Flash Audit (docs/flash-audit-20261014.md, A59).\n\nCo-Authored-By: ${COAUTHOR}`);
      git(dir, 'push', '-q', '-u', 'origin', BRANCH);
      const body = `Idle Flash Audit, ${ISO}, by ${MODEL}. A59 fixes in the hub that need no decision from Astra (documents and metadata only):\n\n${log.map((l) => '- ' + l).join('\n')}\n\nThe hub is the core: this waits for Astra's OK in chat. The round cards (docs/flash-audit-rounds-${DATE}/) say "fixed in" this pull request for each finding it fixes.\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)`;
      results[HUB].pr = execFileSync('gh', ['pr', 'create', '-R', `findastra/${HUB}`, '--base', 'main', '--head', BRANCH, '--title', `#1 Friendly Farmer: A59 links that need no decision (${ISO})`, '--body', body], { encoding: 'utf8' }).trim().split('\n').pop();
      results[HUB].commit = git(dir, 'rev-parse', '--short', 'HEAD');
      console.error(`${HUB}: ${results[HUB].pr}`);
    }
  } catch (e) {
    results[HUB] = { log, error: String(e.stderr || e.message).slice(0, 400) };
    console.error(`${HUB}: ERROR ${results[HUB].error}`);
  }
  save();
}
console.error('done');
