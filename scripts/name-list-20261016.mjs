// One list of names (Astra, 2026-10-16). pet-programs.json is the ONLY place a pet name (icon) or a pet program
// (home) name is decided. Every other list must agree with it; this module finds where one does not.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-16. Guarded by test/name-list-test-20261016.mjs.
//
// The other lists it checks: pets.json (pets, pipeline, seeds), system-map.json (roadmap nodes and pet program nodes), and
// INTELLIGENCE-LEVELS.md (the Pet column). PET-PROGRAMS.md, ROSTER.md and the profile README are generated.

/** @returns {string[]} one line per disagreement; empty when every list matches pet-programs.json */
export function nameDrift({ programs, registry, systemMap = null, intelligence = null }) {
  const out = [];
  const byRepo = new Map(programs.map((p) => [p.repo, p]));
  const byIcon = new Map(programs.map((p) => [p.icon, p]));
  const seen = new Map();
  for (const p of programs) {
    if (seen.has(p.icon)) out.push(`pet-programs.json: "${p.icon}" is used by #${seen.get(p.icon)} and #${p.number}`);
    seen.set(p.icon, p.number);
  }
  for (const key of ['pets', 'pipeline']) {
    for (const p of registry[key] || []) {
      const q = byRepo.get(p.repo);
      if (!q) out.push(`pets.json ${key}: ${p.repo} (${p.pet}) has no entry in pet-programs.json`);
      else if (q.icon !== p.pet) out.push(`pets.json ${key}: ${p.repo} is "${p.pet}", the list says "${q.icon}"`);
    }
  }
  for (const s of registry.seeds?.pets || []) {
    const q = byIcon.get(s.pet);
    if (!q) { out.push(`pets.json seeds: "${s.pet}" is not in pet-programs.json`); continue; }
    if (q.assigned && s.program !== q.program) out.push(`pets.json seeds: ${s.pet}'s program is "${s.program || '(none)'}", the list says "${q.program}"`);
    if (!q.assigned && s.program) out.push(`pets.json seeds: ${s.pet} has program "${s.program}", but the list has not assigned one`);
  }
  const byNumber = new Map(programs.map((p) => [p.number, p]));
  for (const n of systemMap?.nodes || []) {
    if (n.type === 'roadmap' && !byIcon.has(n.name)) out.push(`system-map.json: roadmap node "${n.name}" is not a pet in pet-programs.json`);
    // A pet program node names its number; its name must be the list's (2026-10-17: the System Map's ring 3).
    if (n.program === undefined) continue;
    const q = byNumber.get(n.program);
    if (!q) out.push(`system-map.json: ${n.id} is pet program #${n.program}, which is not in pet-programs.json`);
    else if (q.program !== n.name) out.push(`system-map.json: ${n.id} is "${n.name}", the list says "${q.program}"`);
  }
  if (intelligence) {
    for (const line of intelligence.split('\n')) {
      const m = /^\| <img[^|]*\| ([^|]+?) \| (registered|pipeline|seed|unregistered|roadmap) \|/.exec(line);
      if (m && !byIcon.has(m[1].trim())) out.push(`INTELLIGENCE-LEVELS.md: "${m[1].trim()}" is not a pet in pet-programs.json`);
      // The "1 Program" column names the pet's own program first, in bold, after "Made by Astra:" (2026-10-18): it must
      // be the list's name. Once the list names a program, an italic suggestion or a missing name is drift too.
      const q = m && byIcon.get(m[1].trim());
      if (!q?.assigned) continue;
      const named = /\*\*Made by Astra:\*\* \*\*\[?([^*\]]+)/.exec(line)?.[1].trim();
      if (named !== q.program) out.push(`INTELLIGENCE-LEVELS.md: ${q.icon}'s program is ${named ? `"${named}"` : 'not named in bold'}, the list says "${q.program}"`);
    }
  }
  return out;
}

if (process.argv[1] && process.argv[1].endsWith('name-list-20261016.mjs')) {
  const { readFileSync } = await import('node:fs');
  const read = (f) => readFileSync(new URL('../' + f, import.meta.url), 'utf8');
  const drift = nameDrift({ programs: JSON.parse(read('pet-programs.json')).programs, registry: JSON.parse(read('pets.json')), systemMap: JSON.parse(read('system-map.json')), intelligence: read('INTELLIGENCE-LEVELS.md') });
  console.log(drift.length ? drift.map((d) => '- ' + d).join('\n') : 'Every list matches pet-programs.json.');
  process.exitCode = drift.length ? 1 : 0;
}
