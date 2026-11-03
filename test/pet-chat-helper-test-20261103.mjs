// The pet chat helper (scripts/pet-chat-helper-20261103.cs, card 283), built with the C# compiler that ships with
// Windows and run against stand-in agents (test/fixtures/pet-chat-stand-in-agent-20261103.mjs), a made-up pet folder
// and its own pretend GitHub (a bare repo): nothing reaches a real agent, account or repo. It checks what Astra asked for
// on 2026-11-03: Claude Code first, then Codex; agents change things, supervised, on their own branch; and the safety
// rules the helper enforces itself. Windows only. Claude Opus 5.5 (claude-opus-5-5), 2026-11-03.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url)).replace(/[\\/]$/, '');
const csc = path.join(process.env.WINDIR || 'C:\\Windows', 'Microsoft.NET', 'Framework64', 'v4.0.30319', 'csc.exe');
const skip = process.platform !== 'win32' || !fs.existsSync(csc) ? 'needs Windows and its C# compiler' : false;
const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Denver' }).replace(/-/g, '');

let dir, exe, data, pets, origin, record, helper;
const git = (cwd, ...args) => {
  const r = spawnSync('git', ['-C', cwd, ...args], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`git ${args.join(' ')}: ${r.stderr}`);
  return r.stdout.trim();
};
const pageData = () => {
  const t = fs.readFileSync(path.join(data, 'pet-chat-page-data.js'), 'utf8');
  return JSON.parse(t.slice(t.indexOf('{'), t.lastIndexOf('}') + 1));
};
const waitFor = async (ok, what) => {
  for (let i = 0; i < 200; i++) { try { if (ok()) return; } catch { /* not yet */ } await new Promise((r) => setTimeout(r, 100)); }
  throw new Error(`timed out waiting for ${what}`);
};
const post = (route, body, { origin: from = 'null', code } = {}) => fetch(pageData().url + route, {
  method: 'POST', headers: { 'Content-Type': 'text/plain', Origin: from }, body: JSON.stringify({ code: code ?? pageData().code, ...body }),
});
const lines = async (res) => (await res.text()).split('\n').filter(Boolean).map((l) => JSON.parse(l));
const recorded = () => fs.readFileSync(record, 'utf8').trim().split('\n').map((l) => JSON.parse(l));

function startHelper(confirm) {
  const shim = (kind) => {
    const f = path.join(dir, `stand-in-${kind}.cmd`);
    fs.writeFileSync(f, `@node "${path.join(root, 'test', 'fixtures', 'pet-chat-stand-in-agent-20261103.mjs')}" ${kind} "${record}" %*\r\n`);
    return f;
  };
  const env = { ...process.env, CLAUDECODE: '1', CLAUDE_CODE_OAUTH_TOKEN: 'not-a-token', ANTHROPIC_API_KEY: 'not-a-key', OPENAI_API_KEY: 'not-a-key',
    GIT_AUTHOR_NAME: 'Pet chat test', GIT_AUTHOR_EMAIL: 'pet-chat@example.invalid', GIT_COMMITTER_NAME: 'Pet chat test', GIT_COMMITTER_EMAIL: 'pet-chat@example.invalid' };
  helper = spawn(exe, ['--test', '--confirm', confirm, '--agent', `claude-code=${shim('claude')}`, '--agent', `codex=${shim('codex')}`, '--agent', 'gemini=none', '--agent', 'copilot=none',
    '--hub', root, '--pets', pets, '--data', data, '--menu', path.join(dir, 'menu')], { env, stdio: 'ignore' });
  return waitFor(() => pageData().on === true && pageData().time > (startHelper.last || ''), 'the helper to start').then(() => { startHelper.last = pageData().time; });
}
async function quitHelper() {
  const done = new Promise((r) => helper.once('exit', r));
  await post('quit', {});
  await done;
}

before(async () => {
  if (skip) return;
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pet-chat-test-'));
  exe = path.join(dir, 'pet-chat-helper-check.exe');
  const build = spawnSync(csc, ['/nologo', '/platform:x64', '/target:exe', '/reference:System.dll', '/reference:System.Core.dll', '/reference:System.Windows.Forms.dll',
    '/reference:System.Web.Extensions.dll', `/out:${exe}`, path.join(root, 'scripts', 'pet-chat-helper-20261103.cs')], { encoding: 'utf8' });
  assert.equal(build.status, 0, build.stdout);
  data = path.join(dir, 'data'); pets = path.join(dir, 'pets'); origin = path.join(dir, 'origin', 'mail-snail.git'); record = path.join(dir, 'record.jsonl');
  fs.writeFileSync(record, '');
  // Mail Snail, a pipeline pet, with its own pretend GitHub; Astra's own copy is on another branch with work in it.
  fs.mkdirSync(path.join(pets, 'mail-snail'), { recursive: true });
  const snail = path.join(pets, 'mail-snail');
  spawnSync('git', ['init', '-q', '-b', 'main', snail]);
  fs.writeFileSync(path.join(snail, 'README.md'), '# Mail Snail\n');
  git(snail, '-c', 'user.name=t', '-c', 'user.email=t@example.invalid', 'add', '-A');
  git(snail, '-c', 'user.name=t', '-c', 'user.email=t@example.invalid', 'commit', '-q', '-m', 'start');
  spawnSync('git', ['clone', '-q', '--bare', snail, origin]);
  git(snail, 'remote', 'add', 'origin', origin);
  git(snail, 'fetch', '-q', 'origin');
  git(snail, 'remote', 'set-head', 'origin', 'main');
  git(snail, 'checkout', '-q', '-b', 'codex/her-own-work');
  fs.writeFileSync(path.join(snail, 'her-work.txt'), 'not committed\n');
  await startHelper('yes');
});
after(async () => {
  if (skip) return;
  try { if (helper && helper.exitCode === null) await quitHelper(); } catch { helper.kill(); }
  fs.rmSync(dir, { recursive: true, force: true, maxRetries: 5 });
});

test('the helper\'s own checks pass', { skip }, () => {
  const r = spawnSync(exe, ['--self-test'], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stdout);
  assert.match(r.stdout, /^PASS/);
});

test('it writes where it listens (this PC only), its code, who it found in the farm\'s order, and the star\'s menu', { skip }, () => {
  const d = pageData();
  assert.equal(d.schema, 'astras-pet-os-pet-chat-v1');
  assert.equal(d.tool, 'the-farm-v1.0-pet-chat-helper-v1.0');
  assert.match(d.url, /^http:\/\/127\.0\.0\.1:\d+\/$/);
  assert.match(d.code, /^[0-9a-f]{48}$/);
  assert.deepEqual(d.agents.map((a) => a.id), ['claude-code', 'codex', 'gemini', 'copilot'], 'Claude Code first, then Codex (Astra, 2026-11-03)');
  assert.deepEqual(d.agents.map((a) => a.ready), [true, true, false, false]);
  const menu = JSON.parse(fs.readFileSync(path.join(dir, 'menu', 'menu-20261021.json'), 'utf8'));
  assert.equal(menu.schema, 'astras-pet-os-menu-v1');
  assert.deepEqual(menu.items[0], { text: 'Stop pet chat', args: ['--quit'] });
});

test('a web site, a wrong code or anything but POST is refused', { skip }, async () => {
  assert.equal((await post('hello', { pet: 'mail-snail' }, { origin: 'https://example.com' })).status, 403);
  assert.equal((await post('hello', { pet: 'mail-snail' }, { code: 'wrong' })).status, 401);
  assert.equal((await fetch(pageData().url + 'hello')).status, 405);
  const ok = await post('hello', { pet: 'mail-snail' }, { origin: 'http://127.0.0.1:8793' });
  assert.equal(ok.headers.get('access-control-allow-origin'), 'http://127.0.0.1:8793');
});

test('only a pet on the farm gets a seat, and never a private one', { skip }, async () => {
  assert.equal((await (await post('hello', { pet: 'mail-snail' })).json()).pet_ok, true);
  const hummy = await (await post('hello', { pet: 'health-hummy' })).json();
  assert.equal(hummy.pet_ok, false);
  assert.match(hummy.pet_why, /private/);
  assert.match((await (await post('hello', { pet: '../astras-pet-os' })).json()).pet_why, /not a pet/);
  const asked = await (await post('ask', { pet: 'health-hummy', agent: 'claude-code', text: 'hi' })).json();
  assert.equal(asked.ok, false);
  assert.match(asked.said, /private/);
});

test('Claude Code answers as the pet, streamed, restricted, in its own worktree and branch; the helper commits the change', { skip }, async () => {
  const res = await post('ask', { pet: 'mail-snail', agent: 'claude-code', text: 'Please write a note' });
  assert.match(res.headers.get('content-type'), /ndjson/);
  const got = await lines(res);
  const branch = `claude/pet-chat-mail-snail-${today}`;
  assert.deepEqual(got.find((l) => l.type === 'seat'), { type: 'seat', agent: 'Claude Code', branch });
  assert.equal(got.filter((l) => l.type === 'say').map((l) => l.text).join(''), 'Hello, I am here. Ünïcode ✓');
  assert.ok(got.some((l) => l.type === 'doing' && l.text === 'Changing chat-note.md'));
  const done = got.at(-1);
  assert.equal(done.type, 'done');
  assert.deepEqual(done.changed, ['chat-note.md']);
  assert.equal(done.unpushed, 1);

  const run = recorded().at(-1);
  assert.equal(run.kind, 'claude');
  for (const word of ['-p', '--restricted', '--strict-mcp-config', 'Read,Glob,Grep,Edit,Write', 'acceptEdits', 'stream-json', '--append-system-prompt-file']) assert.ok(run.args.includes(word), `Claude Code starts with ${word}`);
  assert.ok(!run.args.includes('--resume'), 'a new conversation');
  assert.equal(run.input, 'Please write a note', 'her message goes in on stdin, never on the command line');
  assert.deepEqual(run.env, [], 'no Claude app session and no API keys reach the seat');
  const worktree = path.join(data, 'worktrees', 'mail-snail');
  assert.equal(path.resolve(run.cwd).toLowerCase(), path.resolve(worktree).toLowerCase());
  const rules = fs.readFileSync(run.args[run.args.indexOf('--append-system-prompt-file') + 1], 'utf8');
  assert.match(rules, /You are Mail Snail/);
  assert.match(rules, /Read the plan/);
  assert.ok(fs.existsSync(path.join(data, 'plan', 'ASTRAS_PET_OS.md')), 'a fresh copy of the plan to read');

  assert.equal(git(worktree, 'branch', '--show-current'), branch);
  assert.match(git(worktree, 'log', '-1', '--format=%s'), /^Mail Snail's chat: Please write a note/);
  const snail = path.join(pets, 'mail-snail');
  assert.equal(git(snail, 'branch', '--show-current'), 'codex/her-own-work', 'her own copy stays on her branch');
  assert.equal(git(snail, 'status', '--porcelain'), '?? her-work.txt', 'and her work in it is untouched');
  assert.ok(!git(origin, 'branch', '--list').includes('pet-chat'), 'nothing is pushed without her yes');
  const log = fs.readFileSync(path.join(data, 'log', `pet-chat-${today}.jsonl`), 'utf8');
  assert.match(log, /"what":"answer","pet":"mail-snail"/);
});

test('the next message continues the same conversation', { skip }, async () => {
  await lines(await post('ask', { pet: 'mail-snail', agent: 'claude-code', text: 'A second note' }));
  const run = recorded().at(-1);
  assert.equal(run.args[run.args.indexOf('--resume') + 1], 's-stand-in');
  const hello = await (await post('hello', { pet: 'mail-snail' })).json();
  assert.equal(hello.seat.unpushed, 2);
  assert.equal(hello.seat.last_asked, 'A second note');
});

test('Stop ends an answer at once, and nothing else runs while one is answering', { skip }, async () => {
  const slow = post('ask', { pet: 'mail-snail', agent: 'claude-code', text: 'Please be slow' });
  await waitFor(() => recorded().at(-1).input === 'Please be slow', 'the slow answer to start');
  const busy = await (await post('ask', { pet: 'mail-snail', agent: 'claude-code', text: 'Me too' })).json();
  assert.equal(busy.ok, false);
  assert.match(busy.said, /still answering/);
  const t0 = Date.now();
  assert.equal((await (await post('stop', { pet: 'mail-snail' })).json()).ok, true);
  const got = await lines(await slow);
  assert.ok(Date.now() - t0 < 20000, 'stopped well before the minute was up');
  assert.match(got.find((l) => l.type === 'problem').text, /^Stopped/);
});

test('Codex can sit in the seat too: sandboxed, without her config\'s plugins, the rules leading its first message', { skip }, async () => {
  const got = await lines(await post('ask', { pet: 'mail-snail', agent: 'codex', text: 'Codex, a second look' }));
  assert.equal(got.filter((l) => l.type === 'say').map((l) => l.text).join(''), 'Codex here: done.');
  const run = recorded().at(-1);
  assert.equal(run.kind, 'codex');
  for (const word of ['exec', '--json', '--ignore-user-config', '-']) assert.ok(run.args.includes(word), `Codex starts with ${word}`);
  assert.ok(run.args.some((a) => /^sandbox_mode=/.test(a)), 'in its workspace-write sandbox');
  assert.match(run.input, /^You are Mail Snail/);
  assert.match(run.input, /Astra's message:\nCodex, a second look$/);
});

test('a push happens only after her yes, and only the chat\'s branch, never main', { skip }, async () => {
  const d = await (await post('push', { pet: 'mail-snail' })).json();
  assert.equal(d.ok, true, d.said);
  const branch = `claude/pet-chat-mail-snail-${today}`;
  assert.ok(git(origin, 'branch', '--list').includes(branch));
  assert.ok(!git(origin, 'log', '-1', '--format=%s', 'main').includes('chat'), 'main is untouched');
  assert.equal((await (await post('push', { pet: 'mail-snail' })).json()).said, `Nothing new to push on ${branch}.`);

  await quitHelper();
  assert.equal(pageData().on, false, 'a stopped helper says so');
  assert.equal(pageData().code, '');
  await startHelper('no');
  await lines(await post('ask', { pet: 'mail-snail', agent: 'claude-code', text: 'One more note' }));
  const no = await (await post('push', { pet: 'mail-snail' })).json();
  assert.equal(no.ok, false);
  assert.match(no.said, /you said no/);
  assert.equal(git(origin, 'rev-parse', branch), git(path.join(data, 'worktrees', 'mail-snail'), 'rev-parse', 'HEAD~1'), 'the declined change stays on this PC');
});
