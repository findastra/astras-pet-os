// Crypto Burrow's mining tools (Mine Mole, pet program #23): the five tool pages exist, each is a native tool node of
// mine-mole on the System Map that works inside its own tool box, the pages load nothing from the internet, and the
// shared mining core computes SHA-256 and the money equations correctly. No network, no AI.
// Claude Opus 5.5 (claude-opus-5-5), 2026-11-21.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';

const root = new URL('../', import.meta.url);
const read = (p) => readFileSync(new URL(p, root), 'utf8');
const require = createRequire(import.meta.url);

const TOOLS = {
  'learn-mining-tool': 'apps/mine-mole-learn-mining-20261121.html',
  'hash-lab-tool': 'apps/mine-mole-hash-lab-20261121.html',
  'mining-operation-tool': 'apps/mine-mole-mining-operation-20261121.html',
  'mining-ledger-tool': 'apps/mine-mole-mining-ledger-20261121.html',
  'worth-the-power-tool': 'apps/mine-mole-worth-the-power-20261121.html',
};
const CORE = 'apps/mine-mole-mining-core-20261121.js';

test('every mining tool page and the shared scripts exist', () => {
  for (const file of [...Object.values(TOOLS), CORE, 'apps/mine-mole-in-tool-20261121.js']) {
    assert.ok(existsSync(new URL(file, root)), `${file} is missing`);
  }
});

test('each tool is a native tool of mine-mole that works in its own tool box', () => {
  const map = JSON.parse(read('system-map.json'));
  for (const [id, file] of Object.entries(TOOLS)) {
    const n = map.nodes.find((x) => x.id === id);
    assert.ok(n, `${id} is not on the System Map`);
    assert.equal(n.of, 'mine-mole');
    assert.equal(n.type, 'tool');
    assert.equal(n.label, `crypto-burrow-v1.0-${id}-v1.0`);
    assert.equal(n.embed, `https://findastra.github.io/astras-pet-os/${file}`);
    assert.equal(n.in_pill, true);
    assert.ok(n.does && n.job, `${id} needs does and job`);
  }
});

test('the tool pages load nothing from the internet and never write data as HTML', () => {
  for (const file of Object.values(TOOLS)) {
    const html = read(file);
    assert.doesNotMatch(html, /<script[^>]+src=["']https?:/i, `${file} loads a remote script`);
    assert.doesNotMatch(html, /<link[^>]+href=["']https?:/i, `${file} loads a remote stylesheet`);
    assert.doesNotMatch(html, /innerHTML|outerHTML|insertAdjacentHTML|document\.write/, `${file} writes HTML from data`);
    assert.match(html, /mine-mole-in-tool-20261121\.js/, `${file} does not fit its tool box`);
    assert.match(html, /claude-opus-5-5/, `${file} does not say who wrote it`);
  }
});

test('the core hashes like SHA-256', () => {
  const core = require(new URL(CORE, root).pathname);
  for (const s of ['', 'abc', 'hello, concept', 'x'.repeat(200), 'ünïcødé ⛏']) {
    assert.equal(core.sha256Hex(s), createHash('sha256').update(s, 'utf8').digest('hex'), `sha256(${JSON.stringify(s)})`);
  }
  const once = createHash('sha256').update('block').digest();
  assert.equal(core.doubleSha256Hex('block'), createHash('sha256').update(once).digest('hex'));
});

test('the core counts leading zero bits and finds a nonce that meets the target', () => {
  const core = require(new URL(CORE, root).pathname);
  assert.equal(core.leadingZeroBits(Uint8Array.from([0, 0, 0x0f, 0xff])), 20);
  assert.equal(core.leadingZeroBits(Uint8Array.from([0x80])), 0);
  const found = core.findNonce('ConceptCoin block 1', 8, 0, 1e6);
  assert.ok(found, 'no nonce found for 8 zero bits in a million tries');
  assert.ok(core.leadingZeroBits(core.doubleSha256(core.utf8(`ConceptCoin block 1${found.nonce}`))) >= 8);
});

test('the money equations match the worked examples on the pages', () => {
  const core = require(new URL(CORE, root).pathname);
  // A 3,500 W miner at $0.15 per kWh: 3,500 × 24 ÷ 1,000 × 0.15 = $12.60 a day.
  assert.equal(Math.round(core.dailyPowerCost(3500, 0.15) * 100) / 100, 12.6);
  // A 4 kH/s laptop on a 5 GH/s Monero network, 720 blocks a day of 0.6 XMR: 0.0003456 XMR a day.
  const coins = core.dailyCoins(4e3, 5e9, 0.6, 720, 0);
  assert.ok(Math.abs(coins - 0.0003456) < 1e-10, `dailyCoins gave ${coins}`);
  // Expected guesses for 20 zero bits: 2^20 = 1,048,576.
  assert.equal(core.expectedHashes(20), 1048576);
  // Profit = coins × price − cost.
  assert.equal(core.dailyProfit(2, 10, 5), 15);
});

test('the ledger keeps its schema and refuses a file that is not one', () => {
  const core = require(new URL(CORE, root).pathname);
  const empty = core.emptyLedger();
  assert.equal(empty.schema, 'crypto-burrow-ledger-v1');
  assert.deepEqual(empty.blocks, []);
  const back = core.parseLedger(JSON.stringify({ ...empty, blocks: [{ block: 1, reward: 50, finder: 'rig-1', seconds: 2, hashes: 9, bits: 12, kwh: 0, at: '2026-11-21T00:00:00Z' }] }));
  assert.equal(back.blocks.length, 1);
  assert.throws(() => core.parseLedger('{"schema":"something-else"}'), /schema/);
  assert.throws(() => core.parseLedger('not json'));
});
