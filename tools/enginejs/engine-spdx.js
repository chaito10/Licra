// Ported from src/spdx.rs (GLG Rust -> JS)
(function () {
  if (typeof window !== 'undefined') window.GLGEngine = window.GLGEngine || {};
  var NS = (typeof window !== 'undefined') ? window.GLGEngine :
           (typeof self !== 'undefined' ? self : globalThis).GLGEngine = (typeof self !== 'undefined' ? self : globalThis).GLGEngine || {};

  function data() { return GLG_DATA ? GLG_DATA.spdx : []; }

  function hasOwn(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

  function makeError(tag, message, payload) {
    var e = new Error(message);
    e.name = 'SpdxError';
    e.variant = tag;
    e.payload = payload;
    e.spdx = {};
    e.spdx[tag] = payload;
    return e;
  }

  function errInvalidSyntax(msg) {
    return makeError('InvalidSyntax', 'invalid SPDX expression syntax: ' + msg, msg);
  }

  function errParseError(msg) {
    return makeError('ParseError', 'parse error: ' + msg, msg);
  }

  function errUnknownLicense(id) {
    return makeError('UnknownLicense', 'unknown license identifier: ' + id, id);
  }

  function errIncompatibleCombination(a, b) {
    return makeError('IncompatibleCombination', 'incompatible license combination: ' + a + ' and ' + b, [a, b]);
  }

  function expr(operator, operands) {
    return { operator: operator, operands: operands };
  }

  function areCompatible(a, b) {
    if (a.category === 'Public Domain' || b.category === 'Public Domain') return true;
    if (a.category === 'Permissive' && b.category === 'Permissive') return true;
    if (a.category === 'Permissive' && (b.category === 'Weakly Copyleft' || b.category === 'Copyleft')) return true;
    if (b.category === 'Permissive' && (a.category === 'Weakly Copyleft' || a.category === 'Copyleft')) return true;
    if (a.category === 'Weakly Copyleft' && b.category === 'Weakly Copyleft') return true;
    if (a.category === 'Copyleft' && b.category === 'Permissive') return true;
    if (a.category === 'Permissive' && b.category === 'Copyleft') return true;
    if (a.category === b.category) return true;
    if (a.category === 'Non Commercial' || b.category === 'Non Commercial') return false;
    return false;
  }

  function computeCompatibility(license, all) {
    var out = [];
    var i;
    for (i = 0; i < all.length; i++) {
      if (all[i].id === license.id) continue;
      if (areCompatible(license, all[i])) out.push(all[i].id);
    }
    return out;
  }

  function SpdxDatabase(licenseMap, compatibility, list) {
    this.licenses = licenseMap;
    this.compatibility = compatibility;
    this.list = list;
  }

  SpdxDatabase.prototype.getLicense = function (id) {
    if (hasOwn(this.licenses, id)) return this.licenses[id];
    return null;
  };

  SpdxDatabase.prototype.search = function (query) {
    var q = String(query).toLowerCase();
    var out = [];
    var i, l;
    for (i = 0; i < this.list.length; i++) {
      l = this.list[i];
      if (l.id.toLowerCase().indexOf(q) !== -1 || l.name.toLowerCase().indexOf(q) !== -1) out.push(l);
    }
    return out;
  };

  SpdxDatabase.prototype.allIds = function () {
    var out = [];
    var i;
    for (i = 0; i < this.list.length; i++) out.push(this.list[i].id);
    return out;
  };

  SpdxDatabase.prototype.validateId = function (id) {
    return hasOwn(this.licenses, id);
  };

  SpdxDatabase.prototype.getCompatible = function (id) {
    if (hasOwn(this.compatibility, id)) return this.compatibility[id].slice();
    return [];
  };

  function buildDatabase(licenses) {
    var list = licenses || [];
    var licenseMap = {};
    var compatibility = {};
    var i, n = list.length;
    for (i = 0; i < n; i++) licenseMap[list[i].id] = list[i];
    for (i = 0; i < n; i++) compatibility[list[i].id] = computeCompatibility(list[i], list);
    return new SpdxDatabase(licenseMap, compatibility, list);
  }

  function load() {
    return buildDatabase(data());
  }

  function newFromJson(jsonString) {
    var arr;
    try {
      arr = JSON.parse(jsonString);
    } catch (e) {
      arr = [];
    }
    if (!(arr instanceof Array)) arr = [];
    return buildDatabase(arr);
  }

  function Parser(input) {
    this.input = input;
    this.pos = 0;
  }

  Parser.prototype.skipWhitespace = function () {
    var s = this.input;
    while (this.pos < s.length) {
      var c = s.charCodeAt(this.pos);
      if (c === 32 || c === 9 || c === 10 || c === 13) this.pos++;
      else break;
    }
  };

  Parser.prototype.peekWord = function () {
    var saved = this.pos;
    var p = this.pos;
    var s = this.input;
    while (p < s.length) {
      var c = s.charCodeAt(p);
      if (c === 32 || c === 9 || c === 10 || c === 13 || c === 40 || c === 41) break;
      p++;
    }
    if (p === saved) return null;
    return s.substring(saved, p);
  };

  Parser.prototype.consumeWord = function () {
    var word = this.peekWord();
    if (word === null) return null;
    this.pos += word.length;
    return word;
  };

  Parser.prototype.expect = function (expected) {
    this.skipWhitespace();
    var remaining = this.input.substring(this.pos);
    if (remaining.indexOf(expected) === 0) {
      this.pos += expected.length;
      return;
    }
    var show = remaining.substring(0, Math.min(remaining.length, expected.length + 10));
    throw errInvalidSyntax("expected '" + expected + "' at position " + this.pos + ", found '" + show + "'");
  };

  Parser.prototype.parseOperand = function () {
    this.skipWhitespace();
    if (this.pos >= this.input.length) {
      throw errParseError('unexpected end of expression');
    }
    var ch = this.input.charCodeAt(this.pos);
    if (ch === 40) {
      this.pos++;
      var inner = this.parseExpression(null);
      this.expect(')');
      return { Expression: inner };
    }
    var word = this.consumeWord();
    if (word === null) {
      throw errParseError('expected license identifier at position ' + this.pos);
    }
    if (word.indexOf('LicenseRef-') === 0) {
      return { LicenseRef: word.substring(11) };
    }
    if (word.indexOf('LicenseRef:') === 0) {
      return { LicenseRef: word.substring(11) };
    }
    if (word.indexOf('(') !== -1 || word.indexOf(')') !== -1) {
      throw errInvalidSyntax("unexpected character in license id: '" + word + "'");
    }
    return { LicenseId: word };
  };

  Parser.prototype.parseWithException = function (left) {
    this.skipWhitespace();
    var pos = this.pos;
    var current = this.input.substring(pos);
    if (current.indexOf('WITH') === 0) {
      var nextChars = this.input.substring(pos + 4);
      if (nextChars.length === 0 || nextChars.charCodeAt(0) === 32 || nextChars.charCodeAt(0) === 9) {
        this.pos += 4;
        var right = this.parseOperand();
        return expr('With', [left, right]);
      }
    }
    return expr('Plus', [left]);
  };

  Parser.prototype.detectOperator = function () {
    var remaining = this.input.substring(this.pos);
    if (remaining.indexOf('AND ') === 0 || remaining.indexOf('AND\u0000') === 0) return 'And';
    if (remaining.indexOf('OR ') === 0 || remaining.indexOf('OR\u0000') === 0) return 'Or';
    return null;
  };

  Parser.prototype.parseExpression = function (minPrecedence) {
    var precedence = (minPrecedence === null || minPrecedence === undefined) ? 0 : minPrecedence;
    var operand = this.parseOperand();

    this.skipWhitespace();
    var current = this.input.substring(this.pos);
    if (current.charAt(0) === '+') {
      var next = this.input.substring(this.pos + 1);
      var atEnd = next.length === 0 ||
        next.charCodeAt(0) === 32 || next.charCodeAt(0) === 9 ||
        next.charCodeAt(0) === 10 || next.charCodeAt(0) === 13 || next.charCodeAt(0) === 41;
      if (atEnd) {
        this.pos++;
        operand = { Expression: expr('Plus', [operand]) };
      }
    }

    var left = this.parseWithException(operand);

    for (;;) {
      this.skipWhitespace();
      var op = this.detectOperator();
      var opPrec = 0;
      if (op === 'And') opPrec = 2;
      else if (op === 'Or') opPrec = 1;
      else break;

      if (opPrec < precedence) break;

      this.pos += (op === 'And') ? 3 : 2;
      var right = this.parseExpression(opPrec + 1);

      left = expr(op, [{ Expression: left }, { Expression: right }]);
    }

    return left;
  };

  function parse(expression) {
    var s = (expression === null || expression === undefined) ? '' : expression;
    var trimmed = String(s).trim();
    if (trimmed.length === 0) throw errInvalidSyntax('empty expression');

    var parser = new Parser(trimmed);
    var result = parser.parseExpression(null);
    parser.skipWhitespace();

    if (parser.pos < parser.input.length) {
      throw errInvalidSyntax("unexpected trailing content: '" + parser.input.substring(parser.pos) + "'");
    }

    return result;
  }

  function operandToString(outerOperator, operand) {
    if (typeof operand.LicenseId === 'string') return operand.LicenseId;
    if (typeof operand.LicenseRef === 'string') return 'LicenseRef-' + operand.LicenseRef;
    var inner = expressionToString(operand.Expression);
    if (outerOperator === 'Plus' || outerOperator === 'With') {
      var eop = operand.Expression.operator;
      if (eop === 'And' || eop === 'Or') return '(' + inner + ')';
      return inner;
    }
    return inner;
  }

  function expressionToString(exprObj) {
    var op = exprObj.operator;
    if (op === 'Plus') {
      if (exprObj.operands.length > 0) return operandToString('Plus', exprObj.operands[0]) + '+';
      return '+';
    }
    if (op === 'With') {
      var l = exprObj.operands.length > 0 ? operandToString('With', exprObj.operands[0]) : '';
      var r = exprObj.operands.length > 1 ? operandToString('With', exprObj.operands[1]) : '';
      return l + ' WITH ' + r;
    }
    var parts = [];
    for (var i = 0; i < exprObj.operands.length; i++) parts.push(operandToString(op, exprObj.operands[i]));
    return parts.join(op === 'And' ? ' AND ' : ' OR ');
  }

  function operandLicenseId(operand) {
    if (typeof operand.LicenseId === 'string') return operand.LicenseId;
    if (operand.Expression) {
      if (operand.Expression.operands.length > 0) return operandLicenseId(operand.Expression.operands[0]);
      return null;
    }
    return null;
  }

  function expressionValidate(exprObj, db) {
    var i, j;
    for (i = 0; i < exprObj.operands.length; i++) {
      var o = exprObj.operands[i];
      if (typeof o.LicenseId === 'string') {
        if (!db.validateId(o.LicenseId)) throw errUnknownLicense(o.LicenseId);
      } else if (o.Expression) {
        expressionValidate(o.Expression, db);
      }
    }
    if (exprObj.operator === 'And') {
      for (i = 0; i < exprObj.operands.length; i++) {
        for (j = i + 1; j < exprObj.operands.length; j++) {
          var a = operandLicenseId(exprObj.operands[i]);
          var b = operandLicenseId(exprObj.operands[j]);
          if (a !== null && b !== null) {
            if (db.getCompatible(a).indexOf(b) === -1) throw errIncompatibleCombination(a, b);
          }
        }
      }
    }
    return null;
  }

  var UUID_NAMESPACE_URL = [0x6b, 0xa7, 0xb8, 0x11, 0x9d, 0xad, 0x11, 0xd1, 0x80, 0xb4, 0x00, 0xc0, 0x4f, 0xd4, 0x30, 0xc8];

  function utf8Bytes(str) {
    var latin1 = unescape(encodeURIComponent(str));
    var out = [];
    var i;
    for (i = 0; i < latin1.length; i++) out.push(latin1.charCodeAt(i));
    return out;
  }

  function sha1Bytes(message) {
    var i, t;
    var ml = message.length;
    var n = ((ml + 8) >> 6) + 1;
    var blocks = [];
    for (i = 0; i < n * 16; i++) blocks[i] = 0;
    for (i = 0; i < ml; i++) blocks[i >> 2] |= message[i] << (24 - (i % 4) * 8);
    blocks[i >> 2] |= 0x80 << (24 - (i % 4) * 8);
    blocks[n * 16 - 1] = ml * 8;

    var h = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0];
    var w = [];
    for (t = 0; t < n * 16; t += 16) {
      for (i = 0; i < 16; i++) w[i] = blocks[t + i];
      for (i = 16; i < 80; i++) {
        w[i] = ((w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16]) << 1) | ((w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16]) >>> 31);
      }
      var a = h[0], b = h[1], c = h[2], d = h[3], e = h[4];
      var f, k, temp;
      for (i = 0; i < 80; i++) {
        if (i < 20) { f = (b & c) | (~b & d); k = 0x5A827999; }
        else if (i < 40) { f = b ^ c ^ d; k = 0x6ED9EBA1; }
        else if (i < 60) { f = (b & c) | (b & d) | (c & d); k = 0x8F1BBCDC; }
        else { f = b ^ c ^ d; k = 0xCA62C1D6; }
        temp = (((a << 5) | (a >>> 27)) + f + e + k + w[i]) | 0;
        e = d; d = c; c = (b << 30) | (b >>> 2); b = a; a = temp;
      }
      h[0] = (h[0] + a) | 0; h[1] = (h[1] + b) | 0;
      h[2] = (h[2] + c) | 0; h[3] = (h[3] + d) | 0; h[4] = (h[4] + e) | 0;
    }

    var out = [];
    for (i = 0; i < 20; i++) out[i] = (h[i >> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    return out;
  }

  function bytesToHex(bytes) {
    var hex = '0123456789abcdef';
    var s = '';
    var i;
    for (i = 0; i < bytes.length; i++) s += hex.charAt(bytes[i] >> 4) + hex.charAt(bytes[i] & 15);
    return s;
  }

  function formatUuid(bytes) {
    var h = bytesToHex(bytes);
    return h.substring(0, 8) + '-' + h.substring(8, 12) + '-' + h.substring(12, 16) + '-' + h.substring(16, 20) + '-' + h.substring(20, 32);
  }

  function uuidV5(namespaceBytes, nameBytes) {
    var hash = sha1Bytes(namespaceBytes.concat(nameBytes));
    hash[6] = (hash[6] & 0x0f) | 0x50;
    hash[8] = (hash[8] & 0x3f) | 0x80;
    return hash;
  }

  function toLicenseRef(customName) {
    var name = String(customName);
    var sanitized = name.replace(/[^A-Za-z0-9\-_.]/g, '-');
    var hash = uuidV5(UUID_NAMESPACE_URL, utf8Bytes(name));
    var shortId = bytesToHex(hash).substring(0, 8);
    return 'LicenseRef-' + sanitized + '-' + shortId;
  }

  function generateUniqueId() {
    var bytes = [];
    var i;
    for (i = 0; i < 16; i++) bytes.push(Math.floor(Math.random() * 256));
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    return formatUuid(bytes);
  }

  var defaultDbCache = null;

  function defaultDb() {
    if (!defaultDbCache) defaultDbCache = load();
    return defaultDbCache;
  }

  function validateId(id, db) {
    return (db || defaultDb()).validateId(id);
  }

  function getLicense(id, db) {
    return (db || defaultDb()).getLicense(id);
  }

  function search(query, db) {
    return (db || defaultDb()).search(query);
  }

  function allIds(db) {
    return (db || defaultDb()).allIds();
  }

  function getCompatible(id, db) {
    return (db || defaultDb()).getCompatible(id);
  }

  function validate(exprObj, db) {
    return expressionValidate(exprObj, db || defaultDb());
  }

  NS.Spdx = {
    parse: parse,
    toString: expressionToString,
    validate: validate,
    validateId: validateId,
    lookup: getLicense,
    getLicense: getLicense,
    search: search,
    allIds: allIds,
    getCompatible: getCompatible,
    load: load,
    newFromJson: newFromJson,
    toLicenseRef: toLicenseRef,
    generateUniqueId: generateUniqueId,
    Operator: {
      And: 'And',
      Or: 'Or',
      With: 'With',
      Plus: 'Plus'
    }
  };
})();