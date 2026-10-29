// By Astra. OpenAI Codex (GPT-6), 2026-10-20.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {readSpawnerSources,spawnerFiles} from '../scripts/pet-program-pages-20261018.mjs';
test('Damsel archive remains a native program with a compact launcher and no private data', () => {
  const sources=readSpawnerSources('.');
  const node=sources.extra.nodes.find(n=>n.id==='dm-archive-review');
  assert.equal(node.type,'own-program'); assert.equal(node.of,'program-13');
  assert.equal(node.state,'planned');
  const html=spawnerFiles(sources)['apps/pet-programs/discord-tower-20261018.html'];
  assert.match(html,/discord-damsel-dm-archive-tool-panel/);
  assert.match(html,/id="dm-archive-open"/);
  assert.match(html,/adoption pending/);
  const launcher=html.slice(html.indexOf('<details class="panel dm-archive"'),html.indexOf('</fieldset></details>',html.indexOf('<details class="panel dm-archive"')));
  assert.ok(launcher.includes('id="dm-archive-open"'));
  assert.doesNotMatch(launcher,/type="file"/);
});
test('public launcher keeps a source link; file pages open the sibling pet without requests', () => {
  const js=readFileSync('apps/discord-damsel-archive-launcher-20261020.js','utf8');
  for(const protocol of ['https:','http:','file:']){
    const link={href:'source',textContent:'Get the local viewer'},note={textContent:'source note'};
    new Function('document','location',js)({getElementById:id=>id==='dm-archive-open'?link:note},{protocol});
    if(protocol==='file:'){
      assert.equal(link.href,'../../../discord-tower/discord-damsel-archive-review-20261020.html');
      assert.match(note.textContent,/does not check/);
    }else assert.equal(link.href,'source');
  }
  assert.doesNotMatch(js,/\bfetch\s*\(|XMLHttpRequest|localStorage/);
});
