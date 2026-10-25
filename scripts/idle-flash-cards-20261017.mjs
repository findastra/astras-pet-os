// Idle Flash Audit: owner-facing round cards (Flash Audit section 5) from the evidence ledger.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-17.
//   node scripts/idle-flash-cards-20261017.mjs <ledger.json> <fix-results.json> <names.json> <out-dir> [branch-ledger.json]
// Writes <out-dir>/README.md (index) and one round-NN-<repo>.md per program, for reading on a
// phone or iPad in GitHub. Images are relative to docs/flash-audit-rounds-<date>/ in the hub.
// Every exception starts with its matrix row's dot (Astra, 2026-10-18): ⚪ the Idle Flash Audit fixes it ("fixed in"
// its pull request when it did), 🔵 it waits for her Active Flash Session. The order and the dots are read from
// docs/flash-audit-20261014.md itself (flash-matrix-20261018.mjs), never kept here.
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { readMatrix, rowDot, decisionDot, DECISIONS, GREY, BLUE } from './flash-matrix-20261018.mjs';

const [ledgerPath, fixPath, namesPath, OUT, branchPath] = process.argv.slice(2);
const ledger = JSON.parse(readFileSync(ledgerPath, 'utf8')).sort((a, b) => a.number - b.number);
const fixes = existsSync(fixPath) ? JSON.parse(readFileSync(fixPath, 'utf8')) : {};
const names = JSON.parse(readFileSync(namesPath, 'utf8'));
const branch = branchPath && existsSync(branchPath) ? Object.fromEntries(JSON.parse(readFileSync(branchPath, 'utf8')).map((r) => [r.number, r])) : {};
// The run's date (FLASH_DATE, as the fixer takes it: 2026-10-18 or 20261018); today when it is not given.
const DATE = ((d) => `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`)((process.env.FLASH_DATE || new Date().toISOString().slice(0, 10)).replaceAll('-', ''));
// Astra-only on purpose (card 058, Part 3, 2026-10-20): the Flash Audit's round cards are about Astra's own repos. It keeps her account, findastra, and never reads a farm's pets.json github_owner.
const HUB = 'https://github.com/findastra/astras-pet-os';
const UP = '../..';
// The iPad answer sheet (an Artifact made by idle-flash-answers-page-20261017.mjs) for this run.
const ANSWERS = process.env.FLASH_ANSWERS_URL || 'https://claude.ai/artifact/W6FMZthEzhj9EWxBgggCyc';
mkdirSync(OUT, { recursive: true });

// Matrix order (section 3), most important first, and each row's dot: read from the matrix file.
const MATRIX = readMatrix();
const ORDER = MATRIX.order;
const rank = (c) => { const i = ORDER.indexOf(c); return i < 0 ? 999 : i; };
// Shorter names for a phone screen; any other check uses its name in the matrix.
const TITLE = { A06: 'Pet name', A07: 'Program name', A01: 'Icon', A53: 'Icon matches folder', A09: 'Program page', A10: 'Website route', A54: 'Third-party programs', A13: 'Repo', A14: 'Required files', A15: 'README and credit', A56: 'Saved in its own folder', A57: 'Current names only', A16: 'pet.json', A17: 'Git branches', A55: 'Pictures', A02: 'Nine emotions', A05: 'Art format', A18: 'Tool list', A26: 'Privacy', A52: 'L3 activity bubble', A44: 'Yellow phone', A45: 'Paper and zoom', A41: 'Clicker Training', A31: 'Links' };
const titleOf = (c) => TITLE[c] || MATRIX.title[c] || '';
const HUB_REPO = 'astras-pet-os';
const MOODS = [['sleep', 'Sleepy'], ['blink', 'Awake'], ['idle', 'Idle'], ['curious', 'Curious'], ['happy', 'Happy'], ['worried', 'Worried'], ['alarmed', 'Alarmed'], ['sick', 'Sick'], ['sad', 'Sad']];
const PLANNED = new Set(['seed', 'roadmap']);
const esc = (s) => String(s ?? '').replace(/\\/g, '\\\\').replace(/\|/g, '\\|');
const prShort = (url) => url ? url.replace('https://github.com/findastra/', '').replace('/pull/', '#') : '';

// Retired names and paths are reported under A57 (added tonight), not A56.
const isName = (r) => r.check === 'A56' && /retired/.test(r.detail);
const isPath = (r) => (r.check === 'A56' && !isName(r)) || r.check === 'A26';

// The fix run for a row: the hub's for A59 fixes that land in the hub (and the Farmer's own round card), else the pet's.
const fixRunOf = (rec, row) => (row?.fix?.where === 'hub' || rec.hub ? fixes[HUB_REPO] : fixes[rec.audited?.repo]);
function fixedBy(rec, row) {
  // A59: the fixer records the id of every link it connected.
  if (row.check === 'A59') { const fx = fixRunOf(rec, row); return !!(row.fix && fx?.pr && (fx.a59 || []).includes(row.fix.id)); }
  const fx = fixes[rec.audited?.repo];
  if (!fx?.pr) return false;
  if (branch[rec.number]) return !!row._fixed;
  const log = fx.log.join('\n');
  if (isName(row)) { const f = row.detail.split(':')[0]; return log.includes(f) && /\.(md|json|html?|txt|ya?ml|svg)$/i.test(f); }
  if (row.fix?.type === 'link') return (/Retired names/.test(log) && !/handoffs\/008-farmer/.test(row.detail)) || (!!row.fix.to && log.includes(`-> ${row.fix.to}.`));
  if (row.fix?.type === 'petjson-job') return /job now matches/.test(log);
  if (row.fix?.type === 'petjson-audit') return /audit block copied/.test(log);
  if (row.fix?.type === 'petjson-name') return /pet "/.test(log);
  if (row.fix?.type === 'credit') return /credit line/.test(log);
  if (row.fix?.type === 'limits') return /Limits section/.test(log);
  if (row.fix?.type === 'readme-title') return /the title is now its program's name/.test(log);
  if (row.check === 'A14' && /Required files/.test(row.detail)) return row.detail.replace(/^.*?:\s*/, '').split(/,\s*/).every((f) => log.includes(`Added ${f}`));
  if (row.check === 'A14' && /topic/.test(row.detail)) return TOPIC_ADDED.has(rec.audited.repo);
  return false;
}
const TOPIC_ADDED = new Set(['learn-python', 'claude-bot', 'rgbee', 'role-fairy']);

function nextStep(rec, row) {
  const c = row.check, d = row.detail;
  if (row.status === 'On a branch') return `It is built on unmerged branch \`${row.onBranch}\` ([compare](${row.link})): merging that branch passes this.`;
  if (row.next) return row.next; // A59 rows say their own next step
  if (c === 'A01' || c === 'A02' || c === 'A05') return 'Needs pet art. Generating art costs money, so it waits for your OK.';
  if (c === 'A07' || c === 'A06') return 'Your pick: see Decisions.';
  if (c === 'A10' && /sign-in/.test(d)) return 'Not verified: the route needs a sign-in, so nobody else can open it. Decide where this program should live publicly.';
  if (c === 'A10') return 'Give it a real program page, or point the route at one.';
  if (c === 'A13' && /repo_exists/.test(d)) return 'The hub PR for tonight fixes the catalog.';
  if (c === 'A13') return 'The catalog still names the old repo; GitHub redirects it. The hub catalog fix follows the GitHub name.';
  if (c === 'A16' && /submitted|differs/.test(d)) return 'The pet submitted a different job to the Farmer: see Decisions.';
  if (c === 'A16') return 'Framework metadata comes with the shared page framework (Codex\'s branch); not added by hand tonight.';
  if (c === 'A17') return 'See Decisions: open a pull request, merge, or leave each branch.';
  if (c === 'A18') return 'No tool list yet. It comes with the shared page framework.';
  if (c === 'A55' && row.status === 'In progress') return 'The pictures session has a branch for this.';
  if (c === 'A55') return 'Needs real pictures of the program working (you take some: card 026).';
  if (c === 'A54') return 'The Intelligence Levels table lists programs made by others that the page does not show (or the other way round): match them.';
  if (c === 'A31' && /008-farmer/.test(d)) return 'Card 008 (new placeholders) is an old draft on hub PR #5; the pet is already a pipeline pet. The fix PR replaces this line.';
  if (c === 'A31') return 'Fix or remove the link.';
  if (isPath(row)) return 'A stray PC path in code or docs; moving files goes through a File Master plan.';
  if (isName(row) && /\.(md|json|html?|txt|ya?ml|svg)$/i.test(d.split(':')[0])) return 'A line that tells history, a file name, or a name inside the page\'s script (a storage key), so it was kept; anything else here is for the pet\'s chat.';
  if (isName(row)) return 'Inside code (a storage key or a name the code looks for), so it was left alone tonight.';
  if (['A41', 'A44', 'A45', 'A52'].includes(c)) return 'Comes with Codex\'s shared page framework: card 035 asks Codex to bring its pull requests up to date.';
  if (c === 'A15' && PRODUCT_README.has(rec.audited?.repo)) return 'This README is the product\'s own, so tonight only names and links changed in it. Add a Limits section there?';
  if (c === 'A15' && /title/.test(d)) return 'The title is a naming choice, so it was left alone. Rename the heading?';
  if (c === 'A15') return 'Small README fix.';
  if (c === 'A09') return 'Add the program page and declare it as `entry` in pet.json.';
  return 'Open.';
}

// Group rows by check, status and dot so a card stays short.
function groups(rec, rows) {
  const out = new Map();
  for (const r of rows) {
    const check = isName(r) ? 'A57' : r.check;
    const dot = rowDot({ ...r, check }, MATRIX);
    const fixed = fixedBy(rec, r);
    const pr = fixed ? fixRunOf(rec, r)?.pr : null;
    const key = `${check}|${r.status}|${fixed ? 'fixed' : 'open'}|${r.onBranch || ''}|${dot}|${pr || ''}`;
    if (!out.has(key)) out.set(key, { check, status: r.status, fixed, dot, pr, rows: [] });
    out.get(key).rows.push(r);
  }
  return [...out.values()].sort((a, b) => rank(a.check) - rank(b.check) || (a.fixed - b.fixed));
}
function sentence(g) {
  const r = g.rows[0];
  if (g.check === 'A57') return `Retired names (the old hub names, findastra-pet-apps, Documents\\Projects) in ${g.rows.map((x) => '`' + x.detail.split(':')[0] + '`').filter((v, i, a) => a.indexOf(v) === i).join(', ')}.`;
  if (g.check === 'A31' && g.rows.length > 1) return `${g.rows.length} links point at the old hub name or a missing file: ${g.rows.map((x) => (x.detail.match(/link (\S+):/) || [])[1]).filter(Boolean).map((u) => `<${u}>`).slice(0, 4).join(', ')}.`;
  if (['A41', 'A44', 'A45', 'A52'].includes(g.check) && r.status === 'On a branch') return r.detail.replace(/ It exists on unmerged branch .*$/, '');
  return g.rows.map((x) => x.detail).join(' ');
}

// With a ledger of the fix branches, "open" is what that branch still shows and "fixed" is what
// the branch no longer shows. Stray-name rows compare by file, so a partly fixed file stays open.
// Rows whose wording changes with the branch (A17 names it; the preflight's A16 "Metadata:" lists what is
// missing) are one row per check, so they are never shown as both open and fixed.
const rowKey = (r) => (r.check === 'A56' || r.check === 'A26') ? `${r.check}|${r.detail.split(':')[0]}|${/retired/.test(r.detail) ? 'name' : 'path'}`
  : r.check === 'A17' ? 'A17' : (r.check === 'A16' && /^Metadata:/.test(r.detail)) ? 'A16|Metadata' : `${r.check}|${r.detail}`;
// A row read from a fix branch is worded against main, which is where Astra merges.
const asMain = (r, fixRef, mainRef) => { if (!fixRef || fixRef === mainRef) return r; const s = (v) => typeof v === 'string' ? v.split(`compare/${fixRef}...`).join(`compare/${mainRef}...`).split(`not on ${fixRef}`).join(`not on ${mainRef}`) : v; return { ...r, detail: s(r.detail), link: s(r.link) }; };
const PRODUCT_README = new Set(['data-dealer']);
// The hub's registry beside the cards (docs/flash-audit-rounds-<date>/../../pets.json), for the visibility question.
const registryOf = (() => { try { const r = JSON.parse(readFileSync(`${OUT}/${UP}/pets.json`, 'utf8')); const all = [...(r.pets || []), ...(r.pipeline || [])]; return (repo) => all.find((e) => e.repo === repo); } catch { return () => null; } })();
const FALSE =existsSync(`${OUT}/false-alarms.json`) ? JSON.parse(readFileSync(`${OUT}/false-alarms.json`, 'utf8')) : [];
const seedSheets = (() => { try { return readdirSync(`${OUT}/${UP}/art/seeds`).filter((f) => f.endsWith('.png')); } catch { return []; } })();
const hubIcons = (() => { try { return readdirSync(`${OUT}/${UP}/art/icons`); } catch { return []; } })();
// The auditor finds icons by repo name; seed and roadmap icons are filed under the pet's name.
const iconOf = (rec) => rec.iconPath || ((f) => f ? `art/icons/${f}` : null)(hubIcons.find((f) => f.startsWith(`${slug(rec.icon)}-`) && f.endsWith('.png')));
const slug = (s) => String(s).toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const index = [];
const allDecisions = [];
for (const rec of ledger) {
  const fx = fixRunOf(rec) || {};
  const planned = PLANNED.has(rec.stage);
  const b0 = fx.pr && branch[rec.number];
  const b = b0 && { ...b0, rows: b0.rows.map((r) => asMain(r, b0.audited?.ref, rec.audited?.ref)) };
  const keep = (r) => !(r.check === 'A13' && r.status === 'Missing (planned)');
  const fixedRows = b ? rec.rows.filter(keep).filter((r) => !b.rows.some((x) => rowKey(x) === rowKey(r))) : [];
  for (const r of fixedRows) r._fixed = true;
  const rows = b ? [...b.rows.filter(keep), ...fixedRows] : rec.rows.filter(keep);
  // Seeds and roadmap pets: unbuilt parts are Missing (planned), listed on one line.
  const plannedChecks = planned ? rows.filter((r) => (r.check !== 'A01' || !iconOf(rec)) && ['A01', 'A02', 'A05', 'A09', 'A16', 'A18', 'A41', 'A44', 'A45', 'A52', 'A55'].includes(r.check) && r.status !== 'On a branch') : [];
  // False alarms checked by hand (false-alarms.json beside the cards): kept out of the exceptions, said once.
  const isFalse = (r) => FALSE.find((f) => f.repo === rec.audited?.repo && f.check === r.check && r.detail.includes(f.match));
  const falseNotes = [...new Set(rows.filter(isFalse).map((r) => isFalse(r).why))];
  const shown = rows.filter((r) => !isFalse(r) && !plannedChecks.includes(r) && !(planned && r.check === 'A15' && /how to run|model, version|title/.test(r.detail)));
  const gs = groups(rec, shown);
  const open = gs.filter((g) => !g.fixed), done = gs.filter((g) => g.fixed);
  const decisions = [];
  const fname = `round-${String(rec.number).padStart(2, '0')}-${rec.audited?.repo || rec.repo}.md`;

  // Decisions.
  if (names[`${rec.number}-pet`] && /^pet-program-\d+-icon-\d+$/.test(rec.icon)) decisions.push({ kind: 'Pet name', text: `**Pet name** (it is still \`${rec.icon}\`). Pick one, or write your own:`, options: names[`${rec.number}-pet`] });
  if (names[rec.number] && (!rec.assigned || /^pet-program-/.test(rec.program))) decisions.push({ kind: 'Program name', text: `**Program name** for ${rec.icon} (now \`${rec.program}\`). Pick one, or write your own:`, options: names[rec.number] });
  for (const l of fx.log || []) if (/^Not changed: pet.json job/.test(l)) decisions.push({ kind: 'Job', text: `**Job:** ${rec.icon} submitted its own job to the Farmer (${(l.match(/on (\d{4}-\d\d-\d\d)/) || [])[1] || 'date unknown'}), and the registry says something else. Which one is right?\n  - Pet's own: "${esc(rec.pet?.cage?.submit?.job || rec.pet?.job)}"\n  - Registry: "${esc(rec.rows.find((r) => r.fix?.type === 'petjson-job')?.fix.to)}"` });
  const unmerged = rec.rows.find((r) => r.check === 'A17');
  if (unmerged) decisions.push({ kind: 'Branches', text: `**Branches with work not on ${rec.audited.ref}** and no pull request: ${(rec.branches || []).filter((b) => !(rec.openPRs || []).some((p) => p.head === b.name) && !/pictures-20261017|flash-audit-fixes-\d{8}/.test(b.name)).map((b) => `[\`${b.name}\`](https://github.com/findastra/${rec.audited.repo}/compare/${rec.audited.ref}...${encodeURIComponent(b.name)}) (+${b.ahead})`).join(', ')}. Open a PR, merge, or leave?` });
  // Visibility, art and routes are asked from what this run found, never from a list of pets (the first run's
  // questions about Spoonfed, Role Fairy, two private seed repos and Data Dealer were answered on 2026-10-18).
  const regVis = registryOf(rec.audited?.repo || rec.repo)?.visibility;
  if (rec.repoMeta && regVis && (regVis === 'private') !== !!rec.repoMeta.private) decisions.push({ kind: 'Visibility', text: `**pets.json says ${rec.icon} is ${regVis}, but GitHub says ${rec.repoMeta.private ? 'private' : 'public'}.** Change the repo, or keep it and update the registry?` });
  else if (rec.repoMeta?.private && PLANNED.has(rec.stage)) decisions.push({ kind: 'Visibility', text: `**${rec.icon}'s repo is private**, while seed and roadmap repos are usually public. Make it public?` });
  if (rec.rows.some((r) => r.check === 'A02' && r.status === 'Missing')) decisions.push({ kind: 'Art', text: `**${rec.icon} needs art** (its nine moods). Generating art costs money: OK to generate?` });
  const signIn = rec.rows.find((r) => r.check === 'A10' && /sign-in/.test(r.detail));
  if (signIn) decisions.push({ kind: 'Route', text: `**${rec.icon}'s program route** lands behind a sign-in (${esc(signIn.detail)}). Should it point at a public page (GitHub Pages), or stay private?` });
  // A59's blue sentences (two pets on one program, a map that links the pet to another program) are hers.
  for (const r of rec.rows) if (r.check === 'A59' && rowDot(r, MATRIX) === BLUE) decisions.push({ kind: 'Pet program', text: `**Pet program:** ${r.detail} ${r.next || ''}`.trim() });
  if (fx.pr) decisions.push({ kind: 'Merge', text: `**Merge the fix PR** [${prShort(fx.pr)}](${fx.pr})? It only holds fixes that need no decision (listed above).` });
  for (const d of decisions) { d.check = DECISIONS[d.kind]?.check ?? null; d.dot = decisionDot(d.kind, MATRIX); }
  for (const d of decisions) allDecisions.push({ rec, fname, ...d });

  // The card.
  const L = [];
  L.push(`# Round ${rec.number}: ${rec.icon} — ${rec.program}`, '');
  L.push(`[All rounds](README.md) · Stage: **${rec.stage}** · Repo: ${rec.hub ? `[findastra/${HUB_REPO}](https://github.com/findastra/${HUB_REPO}) · the whole pet list (A59)` : rec.audited ? `[findastra/${rec.audited.repo}](https://github.com/findastra/${rec.audited.repo}) (${rec.repoMeta?.private ? 'private' : 'public'})` : 'none'}${rec.audited?.commit ? ` · audited \`${rec.audited.ref}\` at \`${rec.audited.commit.slice(0, 7)}\`` : ''}`, '');
  const icon = iconOf(rec) ? `<img src="${UP}/${iconOf(rec)}" width="88" alt="${esc(rec.icon)} icon">` : '*Icon: Missing*';
  L.push(icon, '');
  if (rec.frames && Object.keys(rec.frames).length) {
    L.push(`| ${MOODS.map(([, n]) => n).join(' | ')} |`, `|${MOODS.map(() => ':-:').join('|')}|`);
    L.push(`| ${MOODS.map(([m]) => rec.frames[m] ? `<img src="${UP}/${rec.frames[m]}" width="64" alt="${m}">` : '—').join(' | ')} |`, '');
  } else {
    const sheet = seedSheets.find((f) => f.startsWith(`${slug(rec.icon)}-sheet-`));
    if (sheet) L.push(`<img src="${UP}/art/seeds/${sheet}" width="360" alt="${esc(rec.icon)} draft sheet"><br>*Draft seed sheet (not approved art; no frames in the hub yet).*`, '');
    else L.push('*Nine-emotion sheet: Missing (no art yet; generating it costs money, so it waits for your OK).*', '');
  }
  if (fx.pr) L.push(`**Fix PR waiting for you:** [${prShort(fx.pr)}](${fx.pr})`, '');

  L.push('### Exceptions', '');
  if (open.length) L.push(`<sub>${GREY} the Idle Flash Audit fixes it (a fix in code is named for the pet's chat) · ${BLUE} waits for your Active Flash Session</sub>`, '');
  if (!open.length && !plannedChecks.length) L.push('No exceptions left in the checks completed (live clicking, desktop launch and tutorials are Not verified overnight).');
  let n = 0;
  for (const g of open) L.push(`${++n}. ${g.dot} **${g.check} ${titleOf(g.check)}** — ${g.status}. ${sentence(g)}  \n   *Next:* ${nextStep(rec, g.rows[0])}`);
  for (const w of falseNotes) L.push(`${++n}. **Checked by hand, not a problem:** ${w}`);
  if (plannedChecks.length) L.push(`${++n}. **Not built yet (planned):** ${[...new Set(plannedChecks.map((r) => r.check))].sort((a, b) => rank(a) - rank(b)).map((c) => `${c} ${titleOf(c)}`.trim()).join(', ')}. Normal for a ${rec.stage}; not a failure.`);
  L.push('');
  if (done.length) {
    L.push('### Fixed tonight (in the fix PR, waiting for your merge)', '');
    for (const g of done) L.push(`- ${g.dot} **${g.check} ${titleOf(g.check)}** — ${sentence(g)}${g.pr ? ` Fixed in [${prShort(g.pr)}](${g.pr}).` : ''}`);
    L.push('');
  }
  if (fx.log?.length) { L.push('<details><summary>What the fix PR changes, exactly</summary>', ''); for (const l of fx.log) L.push(`- ${l}`); L.push('', '</details>', ''); }

  L.push('### Decisions', '');
  if (!decisions.length) L.push('None.');
  let k = 0;
  for (const d of decisions) {
    L.push(`${++k}. ${d.dot} ${d.text}`);
    if (d.options) for (const [i, [nm, why]] of d.options.entries()) L.push(`   - **${String.fromCharCode(65 + i)}. ${nm}** — ${why}`);
  }
  L.push('');
  if (!rec.hub) L.push('**Tools:** none declared in pet.json yet (A18).  ', '**Tutorial tools:** Play with, Care for — Not verified overnight.', '');
  L.push(`<sub>Idle Flash Audit, ${DATE}, Claude Opus 5.5. Read-only checks through the GitHub API; nothing was clicked, launched or signed in to.</sub>`, '');
  writeFileSync(`${OUT}/${fname}`, L.join('\n'));
  index.push({ rec, fname, open: open.length + (plannedChecks.length ? 1 : 0), fixed: done.length, decisions: decisions.filter((d) => d.kind !== 'Merge').length, pr: fx.pr });
}

// Index.
const I = [];
// Astra, 2026-10-18: keep the top short; the decisions live on the answer sheet, not here.
I.push(`# Flash Audit rounds, ${DATE}`, '');
I.push(`One row per pet, in the order they were made. Tap a number for that pet's round card. Decisions waiting on you: [Flash Audit Answers](${ANSWERS}). What is going on right now: the [Pets Board](https://github.com/findastra/astras-pet-os/blob/board/BOARD.md).`, '');
// Every program links to where it runs: the link the profile README gives it (FLASH_PROFILE, a copy of
// findastra/findastra's README), else its repo. Order: the catalog's numbers, which is the order the pets were
// made and the order of the profile README (FLASH_CATALOG: pet-programs.json). FLASH_EXTRA_PRS adds pull
// requests made outside the fix run (JSON: {"repo": ["url", ...]}).
const readOpt = (env) => { try { return process.env[env] ? readFileSync(process.env[env], 'utf8') : null; } catch { return null; } };
const programLink = {};
{
  const md = readOpt('FLASH_PROFILE') || '';
  const lines = md.split('\n');
  lines.forEach((l, i) => {
    const pet = l.match(/^\s*\d+\. \*\*(?:\[[^\]]+\]\(https:\/\/github\.com\/findastra\/([^)/]+)\)|[^*]+)\*\*/);
    const sub = (lines[i + 1] || '').match(/^\s*- \[`[^`]+`\]\((https:[^)]+)\) -- the pet program/);
    if (pet && pet[1] && sub) programLink[pet[1]] = sub[1];
  });
}
const catalogAll = (() => { const t = readOpt('FLASH_CATALOG'); return t ? JSON.parse(t).programs : ledger.map((r) => ({ number: r.number, icon: r.icon, program: r.program, repo: r.audited?.repo || r.repo })); })();
const extraPrs = (() => { const t = readOpt('FLASH_EXTRA_PRS'); return t ? JSON.parse(t) : {}; })();
const byNumber = Object.fromEntries(index.map((x) => [x.rec.number, x]));
const repoUrl = (repo) => `https://github.com/findastra/${repo}`;
const progUrl = (repo) => programLink[repo] || repoUrl(repo);
// One chart (Astra, 2026-10-18: "combined or split … the second list needs to be a chart"): every pet in
// the order they were made, the same order as findastra's profile README.
I.push('<a id="every-round"></a><a id="all-fix-prs-in-one-list"></a>', '');
I.push('| # | Pet | Program | Stage | Open | Fixed | Decisions | Pull requests | Card |', '|--:|---|---|---|--:|--:|--:|---|---|');
for (const p of [...catalogAll].sort((a, b) => a.number - b.number)) {
  const x = byNumber[p.number];
  const repo = x?.rec.audited?.repo || p.repo;
  const iconPath = (x && iconOf(x.rec)) || ((f) => f ? `art/icons/${f}` : null)(hubIcons.find((f) => f.startsWith(`${repo}-`) && f.endsWith('.png')));
  const ic = iconPath ? `<img src="${UP}/${iconPath}" width="28" alt=""> ` : '';
  const prs = [x?.pr, ...(extraPrs[repo] || [])].filter(Boolean);
  const card = x ? `[Round ${p.number}](${x.fname})` : 'done 2026-10-14 (Codex)';
  I.push(`| ${x ? `[${p.number}](${x.fname})` : p.number} | ${ic}[${esc(p.icon)}](${repoUrl(repo)}) | [${esc(p.program)}](${progUrl(repo)}) | ${x?.rec.stage || p.stage} | ${x ? x.open : '—'} | ${x ? x.fixed : '—'} | ${x ? x.decisions : '—'} | ${prs.length ? prs.map((u) => `[${prShort(u)}](${u})`).join('<br>') : '—'} | ${card} |`);
}
I.push('');
I.push('**Open**: still to do after the pull requests merge. **Fixed**: what they fix. The order is the pet list in [findastra\'s profile README](https://github.com/findastra/findastra#readme).', '');
I.push(`<sub>Idle Flash Audit, ${DATE}, Claude Opus 5.5 (\`claude-opus-5-5\`). Built by \`scripts/idle-flash-cards-20261017.mjs\` from the evidence ledger in this folder.</sub>`, '');
writeFileSync(`${OUT}/README.md`, I.join('\n'));
writeFileSync(`${OUT}/decisions.json`, JSON.stringify(allDecisions.map((d) => ({ round: d.rec.number, pet: d.rec.icon, program: d.rec.program, repo: d.rec.audited?.repo || d.rec.repo, card: d.fname, kind: d.kind, check: d.check, dot: d.dot, text: d.text, options: d.options || null })), null, 1));
console.error(`wrote ${index.length} rounds and the index to ${OUT}`);
