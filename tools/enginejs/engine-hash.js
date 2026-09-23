(function () {
  if (typeof window !== 'undefined') window.GLGEngine = window.GLGEngine || {};
  var ROOT = (typeof window !== 'undefined') ? window : (typeof self !== 'undefined' ? self : globalThis);
  ROOT.GLGEngine = ROOT.GLGEngine || {};
  var NS = ROOT.GLGEngine;

  // Ported from src/license.rs + src/crypto.rs (GLG Rust -> JS)

  function utf8Encode(str) {
    var out = [];
    var i = 0;
    var n = str.length;
    while (i < n) {
      var c = str.charCodeAt(i);
      if (c < 0x80) {
        out.push(c); i++;
      } else if (c < 0x800) {
        out.push(0xC0 | (c >> 6), 0x80 | (c & 0x3F)); i++;
      } else if (c >= 0xD800 && c <= 0xDBFF && i + 1 < n) {
        var c2 = str.charCodeAt(i + 1);
        if (c2 >= 0xDC00 && c2 <= 0xDFFF) {
          var cp = 0x10000 + ((c - 0xD800) << 10) + (c2 - 0xDC00);
          out.push(0xF0 | (cp >> 18), 0x80 | ((cp >> 12) & 0x3F), 0x80 | ((cp >> 6) & 0x3F), 0x80 | (cp & 0x3F));
          i += 2; continue;
        }
        out.push(0xEF, 0xBF, 0xBD); i++;
      } else if (c >= 0xDC00 && c <= 0xDFFF) {
        out.push(0xEF, 0xBF, 0xBD); i++;
      } else {
        out.push(0xE0 | (c >> 12), 0x80 | ((c >> 6) & 0x3F), 0x80 | (c & 0x3F)); i++;
      }
    }
    var bytes = new Uint8Array(out.length);
    for (var j = 0; j < out.length; j++) bytes[j] = out[j];
    return bytes;
  }

  // ── SHA-256 ────────────────────────────────────────────────────────────────
  var SHA256_K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];
  function sha256Hex(str) {
    var data = utf8Encode(str);
    var h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a,
        h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19;
    var bitLenHi = 0, bitLenLo = 0;
    var n = data.length;
    var paddedLen = (((n + 8) >> 6) + 1) << 6;
    var buf = new Uint8Array(paddedLen);
    buf.set(data);
    buf[n] = 0x80;
    bitLenLo = (n << 3) >>> 0;
    bitLenHi = Math.floor(n / 536870912) >>> 0;
    var view = new DataView(buf.buffer);
    view.setUint32(paddedLen - 8, bitLenHi);
    view.setUint32(paddedLen - 4, bitLenLo);
    var w = new Uint32Array(64);
    for (var off = 0; off < paddedLen; off += 64) {
      for (var t = 0; t < 16; t++) w[t] = view.getUint32(off + t * 4);
      for (t = 16; t < 64; t++) {
        var s0 = ((w[t - 15] >>> 7) | (w[t - 15] << 25)) ^ ((w[t - 15] >>> 18) | (w[t - 15] << 14)) ^ (w[t - 15] >>> 3);
        var s1 = ((w[t - 2] >>> 17) | (w[t - 2] << 15)) ^ ((w[t - 2] >>> 19) | (w[t - 2] << 13)) ^ (w[t - 2] >>> 10);
        w[t] = (w[t - 16] + s0 + w[t - 7] + s1) >>> 0;
      }
      var a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;
      for (t = 0; t < 64; t++) {
        var S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
        var ch = (e & f) ^ (~e & g);
        var temp1 = (h + S1 + ch + SHA256_K[t] + w[t]) >>> 0;
        var S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
        var maj = (a & b) ^ (a & c) ^ (b & c);
        var temp2 = (S0 + maj) >>> 0;
        h = g; g = f; f = e; e = (d + temp1) >>> 0; d = c; c = b; b = a; a = (temp1 + temp2) >>> 0;
      }
      h0 = (h0 + a) >>> 0; h1 = (h1 + b) >>> 0; h2 = (h2 + c) >>> 0; h3 = (h3 + d) >>> 0;
      h4 = (h4 + e) >>> 0; h5 = (h5 + f) >>> 0; h6 = (h6 + g) >>> 0; h7 = (h7 + h) >>> 0;
    }
    return hex8(h0) + hex8(h1) + hex8(h2) + hex8(h3) + hex8(h4) + hex8(h5) + hex8(h6) + hex8(h7);
  }

  // ── SHA3-256 (FIPS 202, Keccak-f[1600]) ───────────────────────────────────
  var RC_CONST = [
    0x0000000000000001n, 0x0000000000008082n, 0x800000000000808an, 0x8000000080008000n,
    0x000000000000808bn, 0x0000000080000001n, 0x8000000080008081n, 0x8000000000008009n,
    0x000000000000008an, 0x0000000000000088n, 0x0000000080008009n, 0x000000008000000an,
    0x000000008000808bn, 0x800000000000008bn, 0x8000000000008089n, 0x8000000000008003n,
    0x8000000000008002n, 0x8000000000000080n, 0x000000000000800an, 0x800000008000000an,
    0x8000000080008081n, 0x8000000000008080n, 0x0000000080000001n, 0x8000000080008008n
  ];
  var ROT_OFFSETS = [
    [0, 36, 3, 41, 18], [1, 44, 10, 45, 2], [62, 6, 43, 15, 61],
    [28, 55, 25, 21, 56], [27, 20, 39, 8, 14]
  ];
  var MASK64 = 0xFFFFFFFFFFFFFFFFn;
  function rol64(x, n) { return ((x << BigInt(n)) | (x >> BigInt(64 - n))) & MASK64; }
  function keccakF(state) {
    for (var round = 0; round < 24; round++) {
      var c = [0n, 0n, 0n, 0n, 0n];
      var i, x, y;
      for (i = 0; i < 5; i++) {
        c[i] = state[i] ^ state[i + 5] ^ state[i + 10] ^ state[i + 15] ^ state[i + 20];
      }
      var d = [0n, 0n, 0n, 0n, 0n];
      for (i = 0; i < 5; i++) {
        d[i] = c[(i + 4) % 5] ^ rol64(c[(i + 1) % 5], 1);
      }
      for (i = 0; i < 25; i++) state[i] = state[i] ^ d[i % 5];
      var B = new Array(25);
      for (x = 0; x < 5; x++) {
        for (y = 0; y < 5; y++) {
          // pi step: dest(y, 2*(x-y)%5) = rot(src(x,y))
          var dx = y;
          var dy = ((2 * (x - y)) % 5 + 5) % 5;
          B[dx + 5 * dy] = rol64(state[x + 5 * y], ROT_OFFSETS[x][y]);
        }
      }
      for (x = 0; x < 5; x++) {
        for (y = 0; y < 5; y++) {
          var idx = x + 5 * y;
          state[idx] = B[idx] ^ ((~B[(x + 1) % 5 + 5 * y]) & B[(x + 2) % 5 + 5 * y]);
        }
      }
      state[0] = state[0] ^ RC_CONST[round];
    }
  }
  function sha3_256Hex(str) {
    var data = utf8Encode(str);
    var rate = 136;
    var state = new Array(25).fill(0n);
    var block = new Uint8Array(rate);
    var n = data.length;
    var off = 0;
    while (off + rate <= n) {
      for (var i = 0; i < rate; i++) block[i] = data[off + i];
      absorbBytes(state, block);
      keccakF(state);
      off += rate;
    }
    block.fill(0);
    var rem = n - off;
    for (i = 0; i < rem; i++) block[i] = data[off + i];
    block[rem] = 0x06;
    block[rate - 1] |= 0x80;
    absorbBytes(state, block);
    keccakF(state);
    var out = '';
    for (i = 0; i < 4; i++) {
      var word = state[i];
      for (var b = 0; b < 8; b++) {
        var byte = Number((word >> BigInt(8 * b)) & 0xFFn);
        out += ('0' + byte.toString(16)).slice(-2);
      }
    }
    return out;
  }
  function absorbBytes(state, block) {
    for (var i = 0; i < 17; i++) {
      var lane = 0n;
      var base = i * 8;
      for (var b = 0; b < 8; b++) {
        lane |= BigInt(block[base + b]) << BigInt(8 * b);
      }
      state[i] = state[i] ^ lane;
    }
  }

  // ── BLAKE3 (hash mode, reference tree) ─────────────────────────────────────
  var B3_BLOCK_LEN = 64;
  var B3_CHUNK_LEN = 1024;
  var B3_CHUNK_START = 1, B3_CHUNK_END = 2, B3_PARENT = 4, B3_ROOT = 8;
  var B3_IV = [0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19];
  var B3_PERM = [2, 6, 3, 10, 7, 0, 4, 13, 1, 11, 12, 5, 9, 14, 15, 8];
  function b3_rotr(x, n) { return ((x >>> n) | (x << (32 - n))) >>> 0; }
  function b3_g(s, a, b, c, d, mx, my) {
    s[a] = (s[a] + s[b] + mx) >>> 0;
    s[d] = b3_rotr(s[d] ^ s[a], 16);
    s[c] = (s[c] + s[d]) >>> 0;
    s[b] = b3_rotr(s[b] ^ s[c], 12);
    s[a] = (s[a] + s[b] + my) >>> 0;
    s[d] = b3_rotr(s[d] ^ s[a], 8);
    s[c] = (s[c] + s[d]) >>> 0;
    s[b] = b3_rotr(s[b] ^ s[c], 7);
  }
  function b3_round(s, m) {
    b3_g(s, 0, 4, 8, 12, m[0], m[1]);
    b3_g(s, 1, 5, 9, 13, m[2], m[3]);
    b3_g(s, 2, 6, 10, 14, m[4], m[5]);
    b3_g(s, 3, 7, 11, 15, m[6], m[7]);
    b3_g(s, 0, 5, 10, 15, m[8], m[9]);
    b3_g(s, 1, 6, 11, 12, m[10], m[11]);
    b3_g(s, 2, 7, 8, 13, m[12], m[13]);
    b3_g(s, 3, 4, 9, 14, m[14], m[15]);
  }
  function b3_permute(m) {
    var nm = new Array(16);
    for (var i = 0; i < 16; i++) nm[i] = m[B3_PERM[i]];
    return nm;
  }
  function b3_compress(cv, blockWords, counter, blockLen, flags) {
    var s = new Array(16);
    for (var i = 0; i < 8; i++) s[i] = cv[i];
    for (i = 8; i < 16; i++) s[i] = B3_IV[i - 8];
    s[12] = (counter & 0xFFFFFFFF) >>> 0;
    s[13] = Math.floor(counter / 0x100000000) >>> 0;
    s[14] = blockLen >>> 0;
    s[15] = flags >>> 0;
    var m = blockWords.slice();
    var r;
    for (r = 0; r < 7; r++) {
      b3_round(s, m);
      m = b3_permute(m);
    }
    for (i = 0; i < 8; i++) {
      s[i] = (s[i] ^ s[i + 8]) >>> 0;
      s[i + 8] = (s[i + 8] ^ cv[i]) >>> 0;
    }
    return s;
  }
  function b3_blockWords(block, len) {
    var w = new Array(16).fill(0);
    var i;
    for (i = 0; i < 16; i++) {
      var v = 0;
      for (var b = 0; b < 4; b++) {
        var idx = i * 4 + b;
        v |= (idx < len ? block[idx] : 0) << (8 * b);
      }
      w[i] = v >>> 0;
    }
    return w;
  }
  function b3_largestPow2StrictLess(n) {
    var p = 1;
    while ((p << 1) < n) p <<= 1;
    return p;
  }
  function b3_hashImpl(data, key, flags, chunkCounter, isRoot) {
    var total = data.length;
    if (total <= B3_CHUNK_LEN) {
      var state = key.slice();
      var nblocks = Math.max(1, Math.ceil(total / B3_BLOCK_LEN));
      var bi, start, end, f;
      for (bi = 0; bi < nblocks; bi++) {
        start = bi * B3_BLOCK_LEN;
        end = Math.min(start + B3_BLOCK_LEN, total);
        f = flags;
        if (bi === 0) f |= B3_CHUNK_START;
        if (bi === nblocks - 1) {
          f |= B3_CHUNK_END;
          if (isRoot) f |= B3_ROOT;
        }
        var out = b3_compress(state, b3_blockWords(data.subarray(start, end), end - start), chunkCounter, end - start, f);
        state = out.slice(0, 8);
      }
      return state;
    } else {
      var numChunks = Math.ceil(total / B3_CHUNK_LEN);
      var leftChunks = b3_largestPow2StrictLess(numChunks);
      var leftBytes = leftChunks * B3_CHUNK_LEN;
      var left = data.subarray(0, leftBytes);
      var right = data.subarray(leftBytes);
      var leftCv = b3_hashImpl(left, key, flags, chunkCounter, false);
      var rightCv = b3_hashImpl(right, key, flags, chunkCounter + leftChunks, false);
      var block = leftCv.concat(rightCv);
      f = flags | B3_PARENT;
      if (isRoot) f |= B3_ROOT;
      var s = b3_compress(key, block, 0, B3_BLOCK_LEN, f);
      return s.slice(0, 8);
    }
  }
  function blake3Hex(str) {
    var data = utf8Encode(str);
    var cv = b3_hashImpl(data, B3_IV, 0, 0, true);
    var out = '';
    // reference: le_bytes_from_words_32 -> each u32 written little-endian
    function lb(w) {
      var s = '';
      for (var b = 0; b < 4; b++) s += hex8((w >>> (8 * b)) & 0xff).slice(6);
      return s;
    }
    for (var i = 0; i < 8; i++) {
      out += lb(cv[i]);
    }
    return out.slice(0, 64);
  }

  function hex8(x) {
    x >>>= 0;
    var s = x.toString(16);
    while (s.length < 8) s = '0' + s;
    return s;
  }

  NS.Hashing = {
    sha256: sha256Hex,
    sha3_256: sha3_256Hex,
    blake3: blake3Hex,
    compute: function (text) {
      return { blake3: blake3Hex(text), sha256: sha256Hex(text), sha3_256: sha3_256Hex(text) };
    }
  };
})();