// Crypto Burrow's mining core (Mine Mole, pet program #23): the code the five mining tools share. SHA-256 written out
// in plain JavaScript (so a browser can guess thousands of times a second without waiting on crypto.subtle), the
// proof-of-work check, the money equations the lessons teach, and the ledger's saved format (schema
// crypto-burrow-ledger-v1, kept in this browser under "crypto-burrow-ledger", exported and imported as JSON).
// Works in a page (window.CryptoBurrow) and in Node for the tests (module.exports). No dependencies.
// Claude Opus 5.5 (claude-opus-5-5), 2026-11-21.
(function (root) {
  'use strict';

  // ---- SHA-256 (FIPS 180-4) ----
  var K = new Uint32Array([
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2]);
  var W = new Uint32Array(64);

  function utf8(s) {
    if (typeof TextEncoder !== 'undefined') return new TextEncoder().encode(s);
    return Uint8Array.from(Buffer.from(s, 'utf8'));
  }

  function sha256(bytes) {
    var len = bytes.length, bitLenHi = Math.floor(len / 0x20000000), bitLenLo = (len << 3) >>> 0;
    var total = ((len + 9 + 63) >> 6) << 6;
    var m = new Uint8Array(total);
    m.set(bytes); m[len] = 0x80;
    m[total - 8] = bitLenHi >>> 24; m[total - 7] = bitLenHi >>> 16; m[total - 6] = bitLenHi >>> 8; m[total - 5] = bitLenHi;
    m[total - 4] = bitLenLo >>> 24; m[total - 3] = bitLenLo >>> 16; m[total - 2] = bitLenLo >>> 8; m[total - 1] = bitLenLo;
    var h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a,
      h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19;
    for (var off = 0; off < total; off += 64) {
      for (var i = 0; i < 16; i++) {
        var j = off + i * 4;
        W[i] = (m[j] << 24) | (m[j + 1] << 16) | (m[j + 2] << 8) | m[j + 3];
      }
      for (i = 16; i < 64; i++) {
        var x = W[i - 15], y = W[i - 2];
        var s0 = ((x >>> 7) | (x << 25)) ^ ((x >>> 18) | (x << 14)) ^ (x >>> 3);
        var s1 = ((y >>> 17) | (y << 15)) ^ ((y >>> 19) | (y << 13)) ^ (y >>> 10);
        W[i] = (W[i - 16] + s0 + W[i - 7] + s1) | 0;
      }
      var a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;
      for (i = 0; i < 64; i++) {
        var S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
        var t1 = (h + S1 + ((e & f) ^ (~e & g)) + K[i] + W[i]) | 0;
        var S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
        var t2 = (S0 + ((a & b) ^ (a & c) ^ (b & c))) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
      }
      h0 = (h0 + a) | 0; h1 = (h1 + b) | 0; h2 = (h2 + c) | 0; h3 = (h3 + d) | 0;
      h4 = (h4 + e) | 0; h5 = (h5 + f) | 0; h6 = (h6 + g) | 0; h7 = (h7 + h) | 0;
    }
    var out = new Uint8Array(32), hs = [h0, h1, h2, h3, h4, h5, h6, h7];
    for (i = 0; i < 8; i++) {
      out[i * 4] = hs[i] >>> 24; out[i * 4 + 1] = hs[i] >>> 16; out[i * 4 + 2] = hs[i] >>> 8; out[i * 4 + 3] = hs[i];
    }
    return out;
  }

  function hex(bytes) {
    var s = '';
    for (var i = 0; i < bytes.length; i++) s += (bytes[i] < 16 ? '0' : '') + bytes[i].toString(16);
    return s;
  }
  function toBytes(v) { return typeof v === 'string' ? utf8(v) : v; }
  function sha256Hex(v) { return hex(sha256(toBytes(v))); }
  // Bitcoin hashes every block header twice: SHA-256 of the SHA-256.
  function doubleSha256(v) { return sha256(sha256(toBytes(v))); }
  function doubleSha256Hex(v) { return hex(doubleSha256(v)); }

  // ---- Proof of work ----
  // How many 0 bits the hash starts with. Each extra 0 bit halves the chance a guess wins.
  function leadingZeroBits(bytes) {
    var n = 0;
    for (var i = 0; i < bytes.length; i++) {
      var b = bytes[i];
      if (b === 0) { n += 8; continue; }
      while ((b & 0x80) === 0) { n++; b <<= 1; }
      return n;
    }
    return n;
  }
  // The first 48 bits of a hash as a number from 0 to just under 1: a hash "wins" when this is below 2^-bits, which
  // also works for difficulties between whole bits (12.5 bits).
  function hashFraction(bytes) {
    return (bytes[0] * 1099511627776 + bytes[1] * 4294967296 + bytes[2] * 16777216 + bytes[3] * 65536 + bytes[4] * 256 + bytes[5]) / 281474976710656;
  }
  function meetsTarget(bytes, bits) { return hashFraction(bytes) < Math.pow(2, -bits); }
  // Guess nonces start, start+1, ... until the double hash of header+nonce has `bits` zero bits, or `limit` tries.
  function findNonce(header, bits, start, limit) {
    for (var nonce = start || 0, end = (start || 0) + (limit || 1e6); nonce < end; nonce++) {
      var h = doubleSha256(utf8(header + nonce));
      if (meetsTarget(h, bits)) return { nonce: nonce, hash: hex(h), tries: nonce - (start || 0) + 1 };
    }
    return null;
  }

  // ---- The money equations (the lessons show each with its variables first) ----
  // Expected guesses to win at a difficulty of `bits` zero bits: E = 2^bits.
  function expectedHashes(bits) { return Math.pow(2, bits); }
  // Daily power cost: C = P × 24 ÷ 1000 × p  (P watts, p dollars per kWh).
  function dailyPowerCost(watts, pricePerKwh) { return watts * 24 / 1000 * pricePerKwh; }
  // Daily coins in a pool: D = (h ÷ H) × R × B × (1 − f)  (your hash rate, network hash rate, coins per block,
  // blocks per day, pool fee as a fraction).
  function dailyCoins(h, H, reward, blocksPerDay, fee) { return (h / H) * reward * blocksPerDay * (1 - (fee || 0)); }
  // Daily profit: N = D × v − C.
  function dailyProfit(coins, price, cost) { return coins * price - cost; }
  // Expected days until a solo miner finds one block: T = (H ÷ h) ÷ B.
  function soloDays(h, H, blocksPerDay) { return (H / h) / blocksPerDay; }

  // ---- The ledger (tracking) ----
  var LEDGER_KEY = 'crypto-burrow-ledger', LEDGER_SCHEMA = 'crypto-burrow-ledger-v1';
  function emptyLedger() { return { schema: LEDGER_SCHEMA, coin: 'ConceptCoin (CC), pretend', blocks: [], sessions: [] }; }
  function parseLedger(text) {
    var data = JSON.parse(text);
    if (!data || data.schema !== LEDGER_SCHEMA) throw new Error('Not a Crypto Burrow ledger: its schema is not ' + LEDGER_SCHEMA);
    var blocks = Array.isArray(data.blocks) ? data.blocks : [];
    var sessions = Array.isArray(data.sessions) ? data.sessions : [];
    var num = function (v) { return typeof v === 'number' && isFinite(v) ? v : 0; };
    return {
      schema: LEDGER_SCHEMA, coin: String(data.coin || 'ConceptCoin (CC), pretend'),
      blocks: blocks.slice(-5000).map(function (b) {
        return { block: num(b.block), reward: num(b.reward), finder: String(b.finder || '').slice(0, 40), seconds: num(b.seconds),
          hashes: num(b.hashes), bits: num(b.bits), kwh: num(b.kwh), cost: num(b.cost), at: String(b.at || '').slice(0, 30),
          hash: String(b.hash || '').slice(0, 64), payouts: (b.payouts && typeof b.payouts === 'object') ? b.payouts : {} };
      }),
      sessions: sessions.slice(-500).map(function (s) {
        return { started: String(s.started || '').slice(0, 30), seconds: num(s.seconds), hashes: num(s.hashes), kwh: num(s.kwh), cost: num(s.cost), blocks: num(s.blocks) };
      })
    };
  }
  function loadLedger(storage) {
    try { var t = storage && storage.getItem(LEDGER_KEY); return t ? parseLedger(t) : emptyLedger(); } catch (e) { return emptyLedger(); }
  }
  function saveLedger(storage, ledger) {
    try { storage.setItem(LEDGER_KEY, JSON.stringify(ledger)); return true; } catch (e) { return false; }
  }

  // ---- Formatting ----
  function fmtRate(h) {
    var u = ['H/s', 'kH/s', 'MH/s', 'GH/s', 'TH/s', 'PH/s', 'EH/s', 'ZH/s'], i = 0;
    while (h >= 1000 && i < u.length - 1) { h /= 1000; i++; }
    return (h >= 100 ? h.toFixed(0) : h >= 10 ? h.toFixed(1) : h.toFixed(2)) + ' ' + u[i];
  }
  function fmtNum(n, digits) {
    if (!isFinite(n)) return '∞';
    if (n !== 0 && Math.abs(n) < 0.0001) return n.toExponential(2);
    return n.toLocaleString('en-US', { maximumFractionDigits: digits == null ? 4 : digits });
  }
  function fmtMoney(n) {
    if (!isFinite(n)) return '∞';
    var a = Math.abs(n), s = n < 0 ? '−$' : '$';
    if (a !== 0 && a < 0.01) return s + a.toFixed(6);
    return s + a.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  var api = {
    utf8: utf8, sha256: sha256, sha256Hex: sha256Hex, doubleSha256: doubleSha256, doubleSha256Hex: doubleSha256Hex, hex: hex,
    leadingZeroBits: leadingZeroBits, hashFraction: hashFraction, meetsTarget: meetsTarget, findNonce: findNonce,
    expectedHashes: expectedHashes, dailyPowerCost: dailyPowerCost, dailyCoins: dailyCoins, dailyProfit: dailyProfit, soloDays: soloDays,
    LEDGER_KEY: LEDGER_KEY, LEDGER_SCHEMA: LEDGER_SCHEMA, emptyLedger: emptyLedger, parseLedger: parseLedger,
    loadLedger: loadLedger, saveLedger: saveLedger, fmtRate: fmtRate, fmtNum: fmtNum, fmtMoney: fmtMoney
  };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.CryptoBurrow = api;
})(typeof window !== 'undefined' ? window : this);
