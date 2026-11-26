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
  // A tool box in L1 since 2026-11-02 (Astra: "No special panels"), not a panel above the levels.
  assert.match(html,/<div class="toolbox pet-box dm-archive">/);
  assert.ok(html.indexOf('<div class="toolbox pet-box dm-archive">') > html.indexOf('discord-damsel-L1-control-panel'));
  assert.match(html,/id="dm-archive-open"/);
  assert.match(html,/adoption pending/);
  const launcher=html.slice(html.indexOf('<div class="toolbox pet-box dm-archive">'),html.indexOf('</fieldset>',html.indexOf('<div class="toolbox pet-box dm-archive">')));
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
