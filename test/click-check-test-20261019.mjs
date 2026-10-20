// The Friendly Farmer's click-check (scripts/click-check-20261019.mjs, the-farm-v1.0-click-check-v1.0): its rules
// without a browser, and one real click-through of a page with one of every kind of button. The browser test runs
// where an Edge or Chrome is found, except on GitHub's runners (CI); CLICK_CHECK_BROWSER_TEST=1 runs it anyway.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-19.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  LABEL, ROOT, VERDICTS, ORDER, classifyHttp, isLocalUrl, isSignInUrl, actsForReal, githubParts, generalize, groupFindings,
  readExpectations, wrongPlace, shown, sourceFor, judge, renderMarkdown, renderHtml, renderText, findBrowser, run, defaultPages, gitIgnored, KNOWN,
} from '../scripts/click-check-20261019.mjs';

const root = new URL('..', import.meta.url);
const read = (p) => fs.readFileSync(new URL(p, root), 'utf8');

test('an outside page\'s answer means what a person would see', () => {
  assert.equal(classifyHttp({ status: 200, finalUrl: 'https://example.com/' }).verdict, 'ok');
  assert.equal(classifyHttp({ status: 200, finalUrl: 'https://github.com/login?return_to=x' }).verdict, 'sign-in');
  assert.equal(classifyHttp({ status: 404 }).verdict, 'dead-end');
  assert.equal(classifyHttp({ status: 410 }).verdict, 'dead-end');
  assert.equal(classifyHttp({ status: 401 }).verdict, 'sign-in');
  for (const status of [403, 429, 500, 503]) assert.equal(classifyHttp({ status }).verdict, 'unsure', `${status} is not proof it is broken`);
  assert.equal(classifyHttp({ error: 'ENOTFOUND' }).verdict, 'dead-end');
  assert.equal(classifyHttp({ error: 'ETIMEDOUT' }).verdict, 'unsure');
});

test('it never opens a program on this PC, and it does not click what says it acts for real', () => {
  for (const u of ['http://127.0.0.1:38762/api/quit', 'http://localhost:5000/', 'http://[::1]:8080/', 'http://app.localhost/']) assert.ok(isLocalUrl(u), u);
  for (const u of ['https://github.com/findastra', 'file:///C:/x.html', 'mailto:a@example.com']) assert.ok(!isLocalUrl(u), u);
  for (const l of ['Delete everything', 'Send', 'Publish to GitHub', 'Sign out', 'Uninstall']) assert.ok(actsForReal(l), l);
  for (const l of ['Open today\'s app', 'Chat Stack: on', 'Export', 'Submit', 'Posted notes']) assert.ok(!actsForReal(l), l);
  assert.ok(isSignInUrl('https://claude.ai/login?next=/new'));
  assert.deepEqual(githubParts('https://github.com/findastra/drum-dog/tree/v0.1.1-20261009'), { owner: 'findastra', repo: 'drum-dog', kind: 'tree', ref: 'v0.1.1-20261009' });
  assert.equal(githubParts('https://github.com/findastra/chat-rat').kind, null);
});

test('one bug the generator copied onto many pages is one row in the report', () => {
  const page = (repo, n) => ({ page: `apps/pet-programs/${repo}-20261018.html`, fix: 'scripts/pet-program-pages-20261018.mjs', own: { repo, mapNode: `program-${n}`, number: n },
    findings: [{ verdict: 'dead-end', label: 'Private source release', target: `https://github.com/findastra/${repo}/tree/v0.1.1-20261009`, why: `the repo is there, but not "v0.1.1-20261009"` },
      { verdict: 'ok', label: 'Works', target: '', why: '' }] });
  const groups = groupFindings([page('drum-dog', 15), page('vscode-angel', 16), page('finance-finch', 9)]);
  assert.equal(groups.length, 1);
  assert.equal(groups[0].where.length, 3);
  assert.equal(groups[0].target, 'https://github.com/findastra/<repo>/tree/v0.1.1-20261009');
  assert.equal(generalize('program-35 and #35 on chat-rat', { repo: 'chat-rat', number: 35 }), 'program-<N> and #<N> on <repo>');
});

test('wrong place: the registry says where each link on a pet program page should go', () => {
  const exp = readExpectations();
  assert.ok(exp.byPage.size >= 38, 'every spawned page has its expectations');
  const pageRel = 'apps/pet-programs/chat-rat-20261018.html';
  const d = exp.byPage.get(pageRel);
  const file = (rel, hash = '') => ({ url: pathToFileURL(path.join(ROOT, rel)).href + hash, kind: 'file', rel, hash, same: rel === pageRel });
  const web = (url) => ({ url, kind: 'web', rel: url, hash: '', same: false });
  assert.equal(wrongPlace({ pageRel, label: 'On the System Map', dest: file('system-map-20261012.html', `#node=${d.mapNode}`) }, exp), null);
  assert.match(wrongPlace({ pageRel, label: 'On the System Map', dest: file('system-map-20261012.html', '#node=program-2') }, exp), /own node is/);
  assert.match(wrongPlace({ pageRel, label: 'Repo', dest: web('https://github.com/findastra/drum-dog') }, exp), /this pet's repo is findastra\/chat-rat/);
  assert.equal(wrongPlace({ pageRel, label: 'Repo', dest: web('https://github.com/findastra/chat-rat') }, exp), null);
  assert.match(wrongPlace({ pageRel, label: 'This page', dest: file(pageRel) }, exp), /same page again/);
  assert.match(wrongPlace({ pageRel, label: 'GitHub Goldfish GitHub Aquarium', dest: file('apps/pet-programs/drum-dog-20261018.html') }, exp), /says GitHub Goldfish but opens drum-dog/);
  assert.equal(wrongPlace({ pageRel, label: 'GitHub Goldfish GitHub Aquarium', dest: file('apps/pet-programs/github-goldfish-20261018.html') }, exp), null);
});

test('every spawned page\'s own System Map, repo and today\'s-app links pass the wrong-place rules', () => {
  const exp = readExpectations();
  for (const [pageRel, d] of exp.byPage) {
    const html = read(pageRel);
    const base = pathToFileURL(path.join(ROOT, pageRel));
    for (const [, href, text] of html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([^<]*)<\/a>/g)) {
      const label = text.replace(/&#39;/g, '\'').replace(/&amp;/g, '&').trim();
      if (!/System Map|^Repo$|today's app/i.test(label)) continue;
      const url = new URL(href.replace(/&amp;/g, '&'), base).href;
      const hashAt = url.indexOf('#');
      const dest = url.startsWith('file:')
        ? { url, kind: 'file', rel: shown(url.split('#')[0]), hash: hashAt < 0 ? '' : url.slice(hashAt), same: false }
        : { url, kind: 'web', rel: url, hash: '', same: false };
      assert.equal(wrongPlace({ pageRel, label, dest }, exp), null, `${pageRel}: "${label}" → ${href}`);
    }
    assert.ok(d.mapNode, `${pageRel} has its own System Map node`);
  }
});

test('a click only counts for what it did itself, not what any press on the page does', () => {
  const noise = { paths: new Set(['#clock#text']), values: new Map([['#bubble#children', 'Awake']]) };
  const raw = (muts, extra = {}) => ({ item: { tag: 'button', href: null }, after: { muts, storage: [], href0: 'file:///p.html', href: 'file:///p.html', scrolled: 0, opened: [], clipboard: [], hash: '', hashFound: null }, ev: { exceptions: [], downloads: [], chooser: 0, dialogs: [], failed: [], blocked: [], navs: [] }, ...extra });
  assert.equal(judge(raw({ '#bubble#children': 'Awake', '#clock#text': '12:01' }), noise).verdict, 'nowhere');
  assert.equal(judge(raw({ '#bubble#children': 'Here is your reminder' }), noise).verdict, 'ok', 'the same place, a different result, is the button\'s own');
  assert.equal(judge(raw({ 'main>details:2@open': '' }), noise).effects[0], 'opens or closes a panel');
  const thrown = raw({});
  thrown.ev.exceptions.push('TypeError: x');
  assert.equal(judge(thrown, noise).verdict, 'throws');
  const hash = raw({});
  hash.item = { tag: 'a', href: '#' };
  hash.after.href = 'file:///p.html#';
  assert.match(judge(hash, noise).why, /just "#"/);
});

test('not broken: files kept on this PC on purpose, views shown by #name, the tab already open, known easter eggs', () => {
  const ignored = gitIgnored();
  assert.ok(ignored('apps/findastra-discord-presence-local-services-20261014.js'), 'local service addresses stay on the PC (docs/local-services-20261014.md)');
  assert.ok(ignored('apps/unity-unicorn-local-tools-20261011.js'));
  assert.ok(!ignored('apps/pet-programs/chat-rat-20261018.html'));
  const noise = { paths: new Set(), values: new Map() };
  const base = { item: { tag: 'a', href: '#agents' }, ev: { exceptions: [], downloads: [], chooser: 0, dialogs: [], failed: [], blocked: [], navs: [] } };
  const after = (muts) => ({ muts, storage: [], href0: 'file:///p.html', href: 'file:///p.html#agents', scrolled: 0, opened: [], clipboard: [], hash: 'agents', hashFound: false });
  assert.equal(judge({ ...base, after: after({}) }, noise).verdict, 'dead-end', 'a jump to a #name that is not there, and nothing else');
  assert.equal(judge({ ...base, after: after({ '#view#children': 'Agents' }) }, noise).verdict, 'ok', 'a #name that shows a view');
  const still = { muts: {}, storage: [], href0: 'file:///p.html', href: 'file:///p.html', scrolled: 0, opened: [], clipboard: [], hash: '', hashFound: null };
  assert.equal(judge({ ...base, item: { tag: 'a', href: '#flow' }, after: still, prep: { current: true } }, noise).effects[0], 'it is the one already open');
  assert.ok(KNOWN.every((k) => k.page && k.path && k.why), 'every known exception says why');
});

test('reports name files by their place in the repo, never by a path on this computer', () => {
  const inside = pathToFileURL(path.join(ROOT, 'apps', 'missing-20261019.html')).href;
  const outside = pathToFileURL(path.join(os.homedir(), 'Documents', 'secret.html')).href;
  assert.equal(shown(inside), 'apps/missing-20261019.html');
  assert.equal(shown(`${inside}#x`), 'apps/missing-20261019.html#x');
  assert.equal(shown(outside), '…/secret.html');
  const report = { date: '20261019', browser: 'Edg/155', seconds: 61, offline: false, pages: [{ page: 'apps/pet-programs/chat-rat-20261018.html', fix: sourceFor('apps/pet-programs/chat-rat-20261018.html'), own: { repo: 'chat-rat' }, clicked: 3,
    findings: [{ verdict: 'dead-end', label: 'Missing', target: shown(outside), why: `the file is not there (${shown(outside)})` }, { verdict: 'ok', label: 'Works', target: shown(inside), why: '' }] }] };
  for (const text of [renderMarkdown(report), renderHtml(report), renderText(report)]) {
    assert.ok(!text.includes(os.homedir()), 'no home folder');
    assert.ok(!/[A-Z]:\\/.test(text), 'no Windows path');
  }
  assert.match(renderHtml(report), /<title>Click check 20261019<\/title>/);
  assert.match(renderMarkdown(report), /\| 1 \| 🚫 Dead end \| Missing \|/);
});

test('the report says which file to fix: the generator for generated pages, never the page itself', () => {
  assert.match(sourceFor('apps/pet-programs/chat-rat-20261018.html'), /^scripts\/pet-program-pages-20261018\.mjs/);
  assert.match(sourceFor('apps/astras-pet-apps-20261008.html'), /build-interfaces-20261008\.mjs/);
  assert.match(sourceFor('apps/drum-dog-20261008.html'), /pet's own repo/);
  assert.equal(sourceFor('apps/beginner-guide-20261019.html'), 'apps/beginner-guide-20261019.html');
  assert.ok(defaultPages().some((p) => p.endsWith('pet-program-spawner-20261018.html')), 'it checks the spawner\'s list too');
});

test('click-check is a native tool of The Farm, on the map and in the registry table', () => {
  const map = JSON.parse(read('system-map.json'));
  const node = map.nodes.find((n) => n.id === 'click-check');
  assert.ok(node, 'system-map.json has the click-check node');
  assert.equal(node.type, 'tool');
  assert.equal(node.of, 'farm');
  assert.equal(node.label, LABEL);
  assert.equal(node.state, 'now');
  assert.match(read('TOOLS-AND-TRICKS.md'), new RegExp(`\\| click-check \\| \`${LABEL}\` \\| Works today \\|`));
  assert.match(read('package.json'), /"click-check": "node scripts\/click-check-20261019\.mjs"/);
  for (const v of ORDER) assert.ok(VERDICTS[v].mark && VERDICTS[v].means, v);
});

const browser = findBrowser();
const runBrowser = process.env.CLICK_CHECK_BROWSER_TEST === '1' || (!!browser && !process.env.CI);

test('in a real browser: one of every kind of button gets the right verdict', { skip: !runBrowser && 'no Edge or Chrome here, or on CI', timeout: 240000 }, async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'click-check-test-'));
  try {
    fs.writeFileSync(path.join(dir, 'other.html'), '<!doctype html><title>other</title><p>Other page</p>');
    fs.writeFileSync(path.join(dir, 'fixture.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>fixture</title></head><body>
<h1>Fixture</h1>
<p>Plain text, and a mood that changes at any press: <span id="mood">idle</span></p>
<button onclick="document.getElementById('out').textContent='clicked'">Works</button>
<button>Dead button</button>
<a href="#">Hash only</a>
<a href="missing-file.html">Missing file</a>
<a href="other.html">Other page</a>
<a href="fixture.html">This page</a>
<button onclick="null.x()">Throws</button>
<button id="keeps" aria-pressed="false">Keeps</button>
<button aria-pressed="false" onclick="localStorage.setItem('f','1'); this.setAttribute('aria-pressed','true')">Forgets</button>
<div style="position:relative;display:inline-block"><button>Covered</button><div style="position:absolute;inset:0;background:#c00"></div></div>
<form action="https://example.invalid/submit" method="post"><input name="q"><button>Save form</button></form>
<a href="#section">Jump</a> <a href="#nope">Jump nowhere</a>
<a href="http://127.0.0.1:9/never">Local service</a>
<button onclick="window.open('other.html')">Pop up</button>
<details><summary>Panel</summary><button onclick="this.textContent='inside clicked'">Inside panel</button></details>
<button>Delete everything</button>
<p id="out"></p>
<h2 id="section">Section</h2>
<script>
document.addEventListener('pointerdown', () => { document.getElementById('mood').textContent = 'awake'; });
const k = document.getElementById('keeps');
k.setAttribute('aria-pressed', localStorage.getItem('k') ? 'true' : 'false');
k.addEventListener('click', () => { localStorage.setItem('k', '1'); k.setAttribute('aria-pressed', 'true'); });
</script></body></html>`);
    const report = await run([path.join(dir, 'fixture.html')], { offline: true, tabs: 1, quiet: true, shots: false });
    const got = Object.fromEntries(report.pages[0].findings.filter((f) => f.label && !f.label.startsWith('(')).map((f) => [f.label, f.verdict]));
    assert.deepEqual(got, {
      'Works': 'ok', 'Dead button': 'nowhere', 'Hash only': 'nowhere', 'Missing file': 'dead-end', 'Other page': 'ok', 'This page': 'wrong-place',
      'Throws': 'throws', 'Keeps': 'ok', 'Forgets': 'forgets', 'Covered': 'covered', 'Save form': 'unsure', 'Jump': 'ok', 'Jump nowhere': 'dead-end',
      'Local service': 'service-off', 'Pop up': 'ok', 'Panel': 'ok', 'Inside panel': 'ok', 'Delete everything': 'skipped',
    });
    const form = report.pages[0].findings.find((f) => f.label === 'Save form');
    assert.match(form.why, /sends POST to example\.invalid; the tester never sends anything/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
