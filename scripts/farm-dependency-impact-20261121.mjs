// The Farm: read-only dependency impact report from the canonical pets.json "needs" records.
// Usage: node scripts/farm-dependency-impact-20261121.mjs [repo-name] [--json]
// This NEVER changes the registry, filesystem, farm lock, permissions or tools.
// By Astra. Implementation by OpenAI GPT-6, 2026-11-21.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname, join } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const groups = ['pets', 'pipeline', 'seeds', 'candidates'];
const types = ['pets', 'core', 'programs'];
export function analyze(registry) {
  const entries = groups.flatMap(stage => (Array.isArray(registry[stage]) ? registry[stage] : []).map(p => ({ ...p, stage }))).filter(p => typeof p.repo === 'string');
  const byRepo = new Map(entries.map(p => [p.repo, p]));
  const edges = [];
  const warnings = [];
  for (const p of entries) {
    for (const type of types) {
      for (const need of (p.needs?.[type] || [])) {
        const target = type === 'pets' ? need.repo : (type === 'core' ? need.part : need.node);
        if (!target) { warnings.push({ repo: p.repo, kind: 'missing-target', type }); continue; }
        edges.push({ from: p.repo, to: target, type, how: need.how || 'unspecified', why: need.why || '' });
        if (type === 'pets' && !byRepo.has(target)) warnings.push({ repo: p.repo, kind: 'unregistered-pet-dependency', target });
      }
    }
    if (!p.needs) warnings.push({ repo: p.repo, kind: 'no-needs-record' });
  }
  const required = edges.filter(e => e.type === 'pets' && e.how === 'required');
  const downstream = new Map(entries.map(p => [p.repo, new Set()]));
  for (const p of entries) {
    const visited = new Set();
    const visit = (target) => {
      for (const e of required.filter(x => x.to === target)) {
        if (e.from === p.repo || visited.has(e.from)) continue;
        visited.add(e.from);
        visit(e.from);
      }
    };
    visit(p.repo); downstream.set(p.repo, visited);
  }
  const cycles = [];
  const active = new Set(), done = new Set(), stack = [];
  const walk = (repo) => {
    if (active.has(repo)) { const i = stack.indexOf(repo); cycles.push([...stack.slice(i), repo]); return; }
    if (done.has(repo)) return;
    active.add(repo); stack.push(repo);
    for (const e of required.filter(x => x.from === repo && byRepo.has(x.to))) walk(e.to);
    stack.pop(); active.delete(repo); done.add(repo);
  };
  for (const p of entries) walk(p.repo);
  const impact = entries.map(p => ({
    repo: p.repo, stage: p.stage, directlyRequiredBy: required.filter(e => e.to === p.repo).map(e => e.from).sort(),
    transitiveDependents: [...downstream.get(p.repo)].sort(),
    impactCount: downstream.get(p.repo).size,
    needs: edges.filter(e => e.from === p.repo)
  })).sort((a,b) => b.impactCount - a.impactCount || a.repo.localeCompare(b.repo));
  return { schema: 'farm-dependency-impact-v1', provenance: 'pets.json needs', computed: true,
    totals: { pets: entries.length, edges: edges.length }, impact, cycles, warnings };
}
const invoked = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) {
  const args = process.argv.slice(2), name = args.find(x => !x.startsWith('--'));
  const report = analyze(JSON.parse(readFileSync(join(root,'pets.json'),'utf8')));
  const shown = name ? report.impact.filter(p => p.repo === name) : report.impact;
  if (name && !shown.length) { console.error('Unknown pet repo: ' + name); process.exitCode = 2; }
  else if (args.includes('--json')) console.log(JSON.stringify({ ...report, impact: shown }, null, 2));
  else {
    console.log('Farm dependency impact (read-only; canonical pets.json) — ' + report.totals.pets + ' pets, ' + report.totals.edges + ' declared edges');
    for (const p of shown) console.log(p.repo + ' [' + p.stage + ']: ' + p.impactCount + ' transitive required dependents; ' + p.needs.length + ' declared needs');
    if (report.cycles.length) console.log('Required dependency cycles: ' + JSON.stringify(report.cycles));
    if (report.warnings.length) console.log('Registry warnings: ' + JSON.stringify(report.warnings));
  }
}
