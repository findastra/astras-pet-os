// The Cung List, items 2, 4, 7 and the PC install script (docs/cung-list-20261026.md). Node's built-in modules only.
// The PowerShell script cannot run here, so this checks its text: it parses, every package and command it uses is in
// the docs, Docker only on a yes and never silent, no administrator of its own, nothing near Claude's credentials.
// When PowerShell (pwsh) is on PATH, its own parser checks the script too.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-26.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = (p) => readFileSync(`${root}/${p}`, 'utf8');
const SCRIPT = 'scripts/cung-list-install-20261026.ps1';
const DOC = 'docs/cung-list-20261026.md';
const ps1 = read(SCRIPT);
const doc = read(DOC);

// Strip comments and string literals so bracket counting sees only code.
function codeOnly(src) {
  let out = '';
  for (let i = 0; i < src.length;) {
    const two = src.slice(i, i + 2);
    if (two === '<#') { const end = src.indexOf('#>', i + 2); assert.ok(end > 0, 'block comment is closed'); i = end + 2; continue; }
    const c = src[i];
    if (c === '#') { const end = src.indexOf('\n', i); i = end < 0 ? src.length : end; continue; }
    if (c === "'") { // single-quoted: '' is an escaped quote
      let j = i + 1;
      for (;;) { const k = src.indexOf("'", j); assert.ok(k > 0, `single quote at ${i} is closed`); if (src[k + 1] === "'") { j = k + 2; continue; } i = k + 1; break; }
      out += "''"; continue;
    }
    if (c === '"') { // double-quoted: `" is an escaped quote; $(...) inside is code but fine to drop here
      let j = i + 1;
      while (j < src.length && src[j] !== '"') j += src[j] === '`' ? 2 : 1;
      assert.ok(j < src.length, `double quote at ${i} is closed`); i = j + 1; out += '""'; continue;
    }
    out += c; i += 1;
  }
  return out;
}

test('the install script is plain ASCII with balanced brackets (Windows PowerShell 5.1 reads it without a BOM)', () => {
  assert.ok(/^[\x09\x0a\x0d\x20-\x7e]*$/.test(ps1), 'only ASCII characters');
  const code = codeOnly(ps1);
  const pairs = { '(': ')', '{': '}', '[': ']' };
  const stack = [];
  for (const ch of code) {
    if (pairs[ch]) stack.push(pairs[ch]);
    else if (Object.values(pairs).includes(ch)) assert.equal(stack.pop(), ch, `unbalanced ${ch}`);
  }
  assert.deepEqual(stack, [], 'every bracket is closed');
  assert.match(ps1, /\[CmdletBinding\(\)\]\s*param\(/);
  assert.match(ps1, /Set-StrictMode -Version Latest/);
  for (const sw of ['DryRun', 'SkipDocker']) assert.match(ps1, new RegExp(`\\[switch\\]\\$${sw}`));
});

test('PowerShell parses the script, when PowerShell is on this computer', (t) => {
  const pwsh = ['pwsh', 'powershell'].find((p) => spawnSync(p, ['-NoProfile', '-Command', '1'], { encoding: 'utf8' }).status === 0);
  if (!pwsh) { t.skip('no PowerShell here: run the script with -DryRun on Windows'); return; }
  const cmd = `$e=$null; [void][System.Management.Automation.Language.Parser]::ParseFile('${root}/${SCRIPT}', [ref]$null, [ref]$e); $e.Count`;
  assert.equal(execFileSync(pwsh, ['-NoProfile', '-Command', cmd], { encoding: 'utf8' }).trim(), '0');
});

const WINGET = ['Ollama.Ollama', 'OpenJS.NodeJS.LTS', 'astral-sh.uv', 'Docker.DockerDesktop', 'Dyad.Dyad'];

test('every winget package the script installs is one checked in the catalog and listed in the docs', () => {
  const used = new Set([...ps1.matchAll(/Install-WingetPackage '([^']+)'/g)].map((m) => m[1]));
  const looked = new Set([...ps1.matchAll(/Test-WingetPackage '([^']+)'/g)].map((m) => m[1]));
  assert.deepEqual([...used].sort(), [...WINGET].sort());
  for (const id of looked) assert.ok(used.has(id), `${id} is checked but never installed`);
  for (const id of WINGET) {
    assert.ok(doc.includes(`winget install --id ${id}`), `${DOC} shows how ${id} installs`);
    assert.ok(doc.includes(`\`${id}\``), `${DOC} lists ${id} with the catalog check`);
  }
  assert.ok(/Install-WingetPackage 'Ollama\.Ollama' -Scope 'user'/.test(ps1) && /Install-WingetPackage 'Dyad\.Dyad' -Scope 'user'/.test(ps1),
    'Ollama and Dyad install for this user only, with no administrator');
});

test('every command the script runs is in the docs, and each step skips what is already there', () => {
  for (const words of [
    'npm install -g @google/gemini-cli',
    'npx -y ccusage@latest daily --since',
    'uvx --from git+https://github.com/oraios/serena serena --version',
    '/plugin install superpowers@claude-plugins-official',
  ]) {
    const flat = ps1.replace(/'/g, '').replace(/@\(|\)|,/g, ' ').replace(/\s+/g, ' ');
    assert.ok(flat.includes(words), `the script runs: ${words}`);
    assert.ok(doc.includes(words), `${DOC} names: ${words}`);
  }
  for (const cmd of ['ollama', 'node', 'uv', 'docker', 'gemini']) assert.match(ps1, new RegExp(`Test-Command '${cmd}'`), `checks for ${cmd} first`);
  assert.match(ps1, /Test-Path \$dyadFolder/);
  assert.match(ps1, /https:\/\/www\.dyad\.sh\//, 'Dyad falls back to its download page');
});

test('Docker Desktop installs only after a yes, in its own installer window, never silently', () => {
  const docker = ps1.slice(ps1.indexOf("$step = 'Docker Desktop'"), ps1.indexOf("$step = 'Gemini CLI'"));
  assert.match(docker, /Read-Host/);
  assert.match(docker, /if \(\$answer -match '\^\(y\|yes\)\$'\)/);
  assert.match(docker, /Install-WingetPackage 'Docker\.DockerDesktop' -Interactive/);
  assert.doesNotMatch(docker, /--silent|-Silent|--disable-interactivity/);
  assert.ok(docker.indexOf('Read-Host') < docker.indexOf('Install-WingetPackage'), 'it asks before it installs');
});

test('no administrator of its own, no startup entries, nothing near Claude credentials or API keys', () => {
  assert.doesNotMatch(ps1, /-Verb\s+RunAs|Start-Process[^\n]*RunAs/i, 'never raises itself to administrator');
  assert.match(ps1, /IsInRole\(\[Security\.Principal\.WindowsBuiltInRole\]::Administrator\)/, 'refuses to run as administrator');
  const code = codeOnly(ps1);
  for (const bad of [/\.credentials/i, /\.claude[\\/]/i, /ANTHROPIC_API_KEY/, /OPENAI_API_KEY/, /claude\s+(login|setup-token)/i,
    /CurrentVersion\\Run/i, /New-Item[^\n]*Startup/i, /Set-ItemProperty/i, /SetEnvironmentVariable/]) {
    assert.doesNotMatch(code, bad, `the script's code never touches ${bad}`);
  }
});

test('.mcp.json wires Context7 (remote) and Serena (uvx, Claude Code context, this project) with no secrets', () => {
  const cfg = JSON.parse(read('.mcp.json'));
  assert.deepEqual(Object.keys(cfg.mcpServers).sort(), ['context7', 'serena']);
  assert.deepEqual(cfg.mcpServers.context7, { type: 'http', url: 'https://mcp.context7.com/mcp' });
  const s = cfg.mcpServers.serena;
  assert.equal(s.command, 'uvx');
  assert.deepEqual(s.args.slice(0, 4), ['--from', 'git+https://github.com/oraios/serena', 'serena', 'start-mcp-server']);
  const arg = (flag) => s.args[s.args.indexOf(flag) + 1];
  assert.equal(arg('--context'), 'claude-code');
  assert.equal(arg('--project'), '${CLAUDE_PROJECT_DIR:-.}');
  assert.equal(arg('--agent-interface'), 'tools');
  assert.equal(arg('--open-web-dashboard'), 'false');
  assert.doesNotMatch(read('.mcp.json'), /authorization|bearer|api[_-]?key|token/i);
  assert.match(read('.serena/project.yml'), /^language_servers:\n- typescript$/m);
  assert.match(read('.gitignore'), /^\.serena\/memories\/$/m);
  for (const words of ['--context codex', 'bearer_token_env_var = "CONTEXT7_API_KEY"', '[mcp_servers.serena]', '[mcp_servers.context7]'])
    assert.ok(doc.includes(words.replace('--context codex', '"--context", "codex"')) || doc.includes(words), `the Codex snippet has ${words}`);
});

test('the pet-app skill keeps every earlier section and adds the six stages, in order', () => {
  const skill = read('skills/pet-app/SKILL.md');
  assert.match(skill, /^---\nname: pet-app\ndescription: [^\n]+\n---\n/);
  for (const h of ['## Read the complete current rules before work', '## Names, scope and authorization', '## Implementation and publication',
    '## Pet programs are control panels (Astra, 2026-10-19)', '## Both providers']) assert.ok(skill.includes(h), `keeps ${h}`);
  const stages = ['1. **Brainstorm', '2. **Written plan', '3. **Test first', '4. **Build', '5. **Self-review', '6. **Verification'];
  const at = stages.map((s) => skill.indexOf(s));
  assert.ok(at.every((i) => i > 0), 'all six stages are there');
  assert.deepEqual([...at].sort((a, b) => a - b), at, 'in order');
  for (const s of ['skills/new-pet-or-tool', 'skills/questions-as-slides', 'skills/handoff', 'skills/farm-security', 'skills/merge-order', 'skills/key-request'])
    assert.ok(skill.includes(s), `a stage points to ${s}`);
  for (const cmd of ['/plugin install superpowers@claude-plugins-official', '/plugin marketplace add obra/superpowers-marketplace',
    '/plugin install superpowers@superpowers-marketplace']) {
    assert.ok(skill.includes(cmd) && doc.includes(cmd), `skill and docs both give: ${cmd}`);
  }
  assert.match(skill, /\*\*Never merge\.\*\*/);
  assert.ok(!existsSync(`${root}/skills/brainstorming`) && !existsSync(`${root}/skills/test-driven-development`), 'no Superpowers files copied in');
});

test('the Cung List index names all 15 items, each with a repo and a cung-list branch', () => {
  const items = doc.slice(doc.indexOf('## The 15 items'), doc.indexOf('## Run once on the PC'));
  const rows = items.split('\n').filter((l) => /^\| \d+ \|/.test(l));
  assert.deepEqual(rows.map((r) => Number(r.split('|')[1])), Array.from({ length: 15 }, (_, i) => i + 1));
  for (const r of rows) {
    const cells = r.split('|').map((c) => c.trim());
    assert.equal(cells.length, 7, `five columns: ${r.slice(0, 40)}`);
    assert.match(cells[3], /`claude\/cung-list-[a-z0-9-]+-20261026`/, `item ${cells[1]} names its branch`);
    assert.ok(cells[4] && cells[5], `item ${cells[1]} has a status and a PC note`);
  }
  assert.match(doc, /Tyson Cung/);
  assert.match(doc, /By Astra\./);
});
