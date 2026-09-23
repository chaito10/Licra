// Ported from src/export.rs + src/license.rs (GLG Rust -> JS)
(function () {
  if (typeof window !== 'undefined') window.GLGEngine = window.GLGEngine || {};
  var ROOT = (typeof window !== 'undefined') ? window : (typeof self !== 'undefined' ? self : globalThis);
  ROOT.GLGEngine = ROOT.GLGEngine || {};
  var NS = ROOT.GLGEngine;

  // ── Small helpers (ES5) ────────────────────────────────────────────────────

  function rep(s, n) {
    var r = '';
    for (var i = 0; i < n; i++) r += s;
    return r;
  }

  function pad2(n) {
    return (n < 10 ? '0' : '') + n;
  }

  function pad4(n) {
    var s = '' + n;
    while (s.length < 4) s = '0' + s;
    return s;
  }

  // Rust String::len() is byte length (UTF-8).
  function utf8Len(s) {
    if (!s) return 0;
    var n = 0;
    for (var i = 0; i < s.length; i++) {
      var c = s.charCodeAt(i);
      if (c < 0x80) n += 1;
      else if (c < 0x800) n += 2;
      else if (c >= 0xD800 && c <= 0xDBFF) { n += 4; i++; }
      else n += 3;
    }
    return n;
  }

  function isSome(v) {
    return v !== null && v !== undefined;
  }

  function isBlank(v) {
    return v === null || v === undefined || v === '';
  }

  function parseDate(s) {
    var d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  }

  // chrono `%Y-%m-%d %H:%M:%S UTC`
  function fmtDateTime(s) {
    var d = parseDate(s);
    if (!d) return String(s);
    return pad4(d.getUTCFullYear()) + '-' + pad2(d.getUTCMonth() + 1) + '-' + pad2(d.getUTCDate()) +
      ' ' + pad2(d.getUTCHours()) + ':' + pad2(d.getUTCMinutes()) + ':' + pad2(d.getUTCSeconds()) + ' UTC';
  }

  // chrono `%Y-%m-%dT%H:%M:%SZ`
  function fmtIsoZ(s) {
    var d = parseDate(s);
    if (!d) return String(s);
    return pad4(d.getUTCFullYear()) + '-' + pad2(d.getUTCMonth() + 1) + '-' + pad2(d.getUTCDate()) +
      'T' + pad2(d.getUTCHours()) + ':' + pad2(d.getUTCMinutes()) + ':' + pad2(d.getUTCSeconds()) + 'Z';
  }

  // chrono DateTime<Utc>::to_rfc3339() -> "+00:00" offset form, subseconds kept when present
  function fmtRfc3339(s) {
    var d = parseDate(s);
    if (!d) return String(s);
    var frac = '';
    var m = /\.(\d+)/.exec(String(s));
    if (m) {
      var digits = m[1].replace(/0+$/, '');
      if (digits.length) frac = '.' + digits;
    }
    return pad4(d.getUTCFullYear()) + '-' + pad2(d.getUTCMonth() + 1) + '-' + pad2(d.getUTCDate()) +
      'T' + pad2(d.getUTCHours()) + ':' + pad2(d.getUTCMinutes()) + ':' + pad2(d.getUTCSeconds()) +
      frac + '+00:00';
  }

  // chrono `%Y`
  function fmtYear(s) {
    var d = parseDate(s);
    if (!d) return String(s).slice(0, 4);
    return '' + d.getUTCFullYear();
  }

  // escape_xml from src/export.rs
  function escXml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  // escape_html from src/license.rs
  function escHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // escape_yaml / escape_toml from src/license.rs (replacement ORDER matters)
  function escYamlToml(s) {
    return String(s)
      .replace(/"/g, '\\"')
      .replace(/\\/g, '\\\\')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
  }

  // Debug {:?} for a clause category stored via serde snake_case ("permission" -> "Permission")
  function catDebug(cat) {
    if (!cat) return '';
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  }

  // serde snake_case of a clause category ("Permission" -> "permission")
  function catSnake(cat) {
    if (!cat) return '';
    if (cat.charAt(0) === cat.charAt(0).toUpperCase() && cat.charAt(0) !== cat.charAt(0).toLowerCase()) {
      return cat.toLowerCase();
    }
    return cat;
  }

  function sortedClauses(license) {
    var arr = (license.clauses || []).slice();
    arr.sort(function (a, b) { return a.priority - b.priority; });
    return arr;
  }

  // author_line from src/export.rs
  function authorLine(license) {
    var parts = [];
    var authors = license.metadata.authors || [];
    for (var i = 0; i < authors.length; i++) {
      var a = authors[i];
      var line = a.name;
      if (isSome(a.organization)) line += ' (' + a.organization + ')';
      if (isSome(a.email)) line += ' <' + a.email + '>';
      parts.push(line);
    }
    return parts.join(', ');
  }

  // spdx_license_id from src/export.rs
  function spdxLicenseId(license) {
    if (isSome(license.metadata.spdx_id)) return license.metadata.spdx_id;
    if (isSome(license.metadata.id.spdx_identifier)) return license.metadata.id.spdx_identifier;
    return 'LicenseRef-' + license.metadata.id.uuid;
  }

  // License::to_spdx (src/license.rs lines ~154-204) — exact
  function toSpdxHeader(license) {
    var spdx = '';
    var id;
    if (isSome(license.metadata.spdx_id)) {
      id = license.metadata.spdx_id;
    } else if (isSome(license.metadata.id.spdx_identifier)) {
      id = license.metadata.id.spdx_identifier;
    } else {
      id = 'LicenseRef-' + license.metadata.id.uuid;
    }
    spdx += 'SPDX-License-Identifier: ' + id + '\n';
    spdx += 'SPDX-FileCopyrightText: ';
    var authors = license.metadata.authors || [];
    for (var i = 0; i < authors.length; i++) {
      if (i > 0) spdx += ', ';
      spdx += authors[i].name;
      if (isSome(authors[i].organization)) spdx += ' (' + authors[i].organization + ')';
    }
    spdx += '\n';
    spdx += 'SPDX-Version: SPDX-3.0\n';
    spdx += 'SPDX-DataLicense: CC0-1.0\n';
    if (isSome(license.metadata.id.spdx_identifier)) {
      spdx += 'SPDX-LicenseID: ' + license.metadata.id.spdx_identifier + '\n';
    }
    spdx += 'SPDX-Comment: ' + license.metadata.description + '\n';
    if (license.conditions && license.conditions.length) {
      spdx += '# Conditions:\n';
      for (var c1 = 0; c1 < license.conditions.length; c1++) {
        spdx += '#   - ' + license.conditions[c1] + '\n';
      }
    }
    if (license.permissions && license.permissions.length) {
      spdx += '# Permissions:\n';
      for (var p1 = 0; p1 < license.permissions.length; p1++) {
        spdx += '#   - ' + license.permissions[p1] + '\n';
      }
    }
    if (license.restrictions && license.restrictions.length) {
      spdx += '# Restrictions:\n';
      for (var r1 = 0; r1 < license.restrictions.length; r1++) {
        spdx += '#   - ' + license.restrictions[r1] + '\n';
      }
    }
    return spdx;
  }

  // category counts keyed by Debug name, ordered by first appearance (HashMap -> insertion order here)
  function categoryCounts(clauses) {
    var order = [];
    var counts = {};
    clauses = clauses || [];
    for (var i = 0; i < clauses.length; i++) {
      var key = catDebug(clauses[i].category);
      if (!counts[key]) { counts[key] = 0; order.push(key); }
      counts[key] += 1;
    }
    return { order: order, counts: counts };
  }

  // ── Plain Text ─────────────────────────────────────────────────────────────

  function exportToText(license) {
    var m = license.metadata;
    var text = '';

    text += rep('=', 60) + '\n';
    text += m.name + '\n';
    text += rep('=', 60) + '\n';
    text += '\n';

    text += 'Version:      ' + m.version + '\n';
    text += 'Category:     ' + m.category + '\n';
    text += 'Created:      ' + fmtDateTime(m.created_at) + '\n';
    text += 'Modified:     ' + fmtDateTime(m.modified_at) + '\n';
    text += 'UUID:         ' + m.id.uuid + '\n';
    text += 'Fingerprint:  ' + m.id.fingerprint + '\n';
    if (isSome(m.spdx_id)) text += 'SPDX ID:      ' + m.spdx_id + '\n';
    if (m.authors && m.authors.length) text += 'Authors:      ' + authorLine(license) + '\n';
    if (m.tags && m.tags.length) text += 'Tags:         ' + m.tags.join(', ') + '\n';

    text += '\n';
    text += rep('-', 60) + '\n';
    text += '\n';

    if (license.preamble) {
      text += 'PREAMBLE\n';
      text += rep('-', 40) + '\n\n';
      text += license.preamble + '\n\n';
    }

    var clauses = sortedClauses(license);
    for (var i = 0; i < clauses.length; i++) {
      var c = clauses[i];
      text += c.name.toUpperCase() + ' (Section ' + c.priority + ')\n';
      text += rep('-', utf8Len(c.name) + 20) + '\n';
      text += c.content + '\n\n';
    }

    if (license.permissions && license.permissions.length) {
      text += 'PERMISSIONS\n';
      text += rep('-', 40) + '\n';
      for (var pi = 0; pi < license.permissions.length; pi++) {
        text += '  * ' + license.permissions[pi] + '\n';
      }
      text += '\n';
    }

    if (license.conditions && license.conditions.length) {
      text += 'CONDITIONS\n';
      text += rep('-', 40) + '\n';
      for (var ci = 0; ci < license.conditions.length; ci++) {
        text += '  * ' + license.conditions[ci] + '\n';
      }
      text += '\n';
    }

    if (license.restrictions && license.restrictions.length) {
      text += 'RESTRICTIONS\n';
      text += rep('-', 40) + '\n';
      for (var ri = 0; ri < license.restrictions.length; ri++) {
        text += '  * ' + license.restrictions[ri] + '\n';
      }
      text += '\n';
    }

    if (isSome(license.patent_grant)) {
      text += 'PATENT GRANT\n';
      text += rep('-', 40) + '\n';
      text += license.patent_grant + '\n\n';
    }

    if (license.warranty_disclaimer) {
      text += 'WARRANTY DISCLAIMER\n';
      text += rep('-', 40) + '\n';
      text += license.warranty_disclaimer + '\n\n';
    }

    text += rep('-', 60) + '\n';
    text += 'Blake3:    ' + license.hash.blake3 + '\n';
    text += 'SHA-256:   ' + license.hash.sha256 + '\n';
    text += 'SHA3-256:  ' + license.hash.sha3_256 + '\n';
    text += rep('-', 60) + '\n';

    return text;
  }

  // ── Markdown ───────────────────────────────────────────────────────────────

  function exportToMarkdown(license) {
    var m = license.metadata;
    var md = '';

    md += '# ' + m.name + '\n\n';
    md += '**Version:** `' + m.version + '` &nbsp;&nbsp; **Category:** `' + m.category + '`\n\n';

    if (m.authors && m.authors.length) {
      md += '**Authors:** ';
      var names = [];
      for (var i = 0; i < m.authors.length; i++) {
        var a = m.authors[i];
        names.push(a.name + (isSome(a.email) ? ' <' + a.email + '>' : ''));
      }
      md += names.join(', ');
      md += '\n\n';
    }

    md += '**Created:** `' + fmtDateTime(m.created_at) + '` &nbsp;&nbsp; **Modified:** `' + fmtDateTime(m.modified_at) + '`\n\n';
    md += '**UUID:** `' + m.id.uuid + '`\n\n';
    md += '**Fingerprint:** `' + m.id.fingerprint + '`\n\n';

    if (isSome(m.spdx_id)) md += '**SPDX ID:** `' + m.spdx_id + '`\n\n';

    if (m.tags && m.tags.length) {
      var tagParts = [];
      for (var t = 0; t < m.tags.length; t++) tagParts.push('`' + m.tags[t] + '`');
      md += '**Tags:** ' + tagParts.join(', ') + '\n\n';
    }

    md += '---\n\n';

    if (license.preamble) {
      md += '## Preamble\n\n';
      md += license.preamble + '\n\n';
    }

    var clauses = sortedClauses(license);
    if (clauses.length) {
      md += '## Clauses\n\n';
      for (var ci = 0; ci < clauses.length; ci++) {
        md += '### ' + clauses[ci].name + ' `(' + catDebug(clauses[ci].category) + ')`\n\n';
        md += clauses[ci].content + '\n\n';
      }
    }

    if (license.permissions && license.permissions.length) {
      md += '## Permissions\n\n';
      for (var p1 = 0; p1 < license.permissions.length; p1++) {
        md += '- ' + license.permissions[p1] + '\n';
      }
      md += '\n';
    }

    if (license.conditions && license.conditions.length) {
      md += '## Conditions\n\n';
      for (var c1 = 0; c1 < license.conditions.length; c1++) {
        md += '- ' + license.conditions[c1] + '\n';
      }
      md += '\n';
    }

    if (license.restrictions && license.restrictions.length) {
      md += '## Restrictions\n\n';
      for (var r1 = 0; r1 < license.restrictions.length; r1++) {
        md += '- ' + license.restrictions[r1] + '\n';
      }
      md += '\n';
    }

    if (isSome(license.patent_grant)) {
      md += '## Patent Grant\n\n';
      md += license.patent_grant + '\n\n';
    }

    if (license.warranty_disclaimer) {
      md += '## Warranty Disclaimer\n\n';
      md += license.warranty_disclaimer + '\n\n';
    }

    md += '---\n\n';
    md += '### Hashes\n\n';
    md += '| Algorithm | Hash |\n';
    md += '|-----------|------|\n';
    md += '| Blake3 | `' + license.hash.blake3 + '` |\n';
    md += '| SHA-256 | `' + license.hash.sha256 + '` |\n';
    md += '| SHA3-256 | `' + license.hash.sha3_256 + '` |\n';

    return md;
  }

  // ── Mini markdown -> HTML renderer (pulldown-cmark subset) ────────────────

  var KNOWN_ENTITIES = {
    amp: '&', lt: '<', gt: '>', quot: '"', apos: "'",
    nbsp: '\u00A0', copy: '\u00A9', reg: '\u00AE', trade: '\u2122',
    hellip: '\u2026', ndash: '\u2013', mdash: '\u2014',
    lsquo: '\u2018', rsquo: '\u2019', ldquo: '\u201C', rdquo: '\u201D',
    laquo: '\u00AB', raquo: '\u00BB', deg: '\u00B0', plusmn: '\u00B1',
    cent: '\u00A2', pound: '\u00A3', yen: '\u00A5', euro: '\u20AC',
    sect: '\u00A7', para: '\u00B6', middot: '\u00B7', bull: '\u2022',
    dagger: '\u2020', Dagger: '\u2021', permil: '\u2030',
    lsaquo: '\u2039', rsaquo: '\u203A', times: '\u00D7', divide: '\u00F7',
    minus: '\u2212', frac12: '\u00BD', frac14: '\u00BC', frac34: '\u00BE',
    sup2: '\u00B2', sup3: '\u00B3', micro: '\u00B5', shy: '\u00AD',
    nbsp2: '\u00A0'
  };

  var ENTITY_RE = /^&(#\d+|#x[0-9a-fA-F]+|[A-Za-z][A-Za-z0-9]*);/;

  function decodeEntity(src) {
    var m = ENTITY_RE.exec(src);
    if (!m) return null;
    var body = m[0].slice(1, -1);
    if (body.charAt(0) === '#') {
      if (body.charAt(1) === 'x' || body.charAt(1) === 'X') {
        return String.fromCharCode(parseInt(body.slice(2), 16));
      }
      return String.fromCharCode(parseInt(body.slice(1), 10));
    }
    if (KNOWN_ENTITIES[body]) return KNOWN_ENTITIES[body];
    return null; // unknown entity -> literal text (will be escaped)
  }

  function escTextBuf(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  var AUTOLINK_RE = /^<([A-Za-z][A-Za-z0-9+.\-]{1,31}:[^<>\s]*)>/;
  var HTML_TAG_RE = /^<\/?[A-Za-z][A-Za-z0-9-]*(?:\s[^<>]*)?\/?>/;

  function flushText(buf, out) {
    if (buf.length) out.push(escTextBuf(buf.join('')));
    buf.length = 0;
  }

  function renderInlines(src) {
    var out = [];
    var buf = [];
    var i = 0;
    while (i < src.length) {
      var ch = src.charAt(i);

      if (ch === '`') {
        var j = src.indexOf('`', i + 1);
        if (j !== -1) {
          flushText(buf, out);
          out.push('<code>' + escTextBuf(src.slice(i + 1, j)) + '</code>');
          i = j + 1;
          continue;
        }
        buf.push(ch);
        i++;
        continue;
      }

      if (ch === '*' && src.charAt(i + 1) === '*') {
        var close2 = src.indexOf('**', i + 2);
        if (close2 !== -1) {
          flushText(buf, out);
          out.push('<strong>' + renderInlines(src.slice(i + 2, close2)) + '</strong>');
          i = close2 + 2;
          continue;
        }
      }
      if (src.slice(i, i + 2) === '~~') {
        var closeS = src.indexOf('~~', i + 2);
        if (closeS !== -1) {
          flushText(buf, out);
          out.push('<del>' + renderInlines(src.slice(i + 2, closeS)) + '</del>');
          i = closeS + 2;
          continue;
        }
      }
      if (ch === '*') {
        var closeE = src.indexOf('*', i + 1);
        if (closeE !== -1) {
          flushText(buf, out);
          out.push('<em>' + renderInlines(src.slice(i + 1, closeE)) + '</em>');
          i = closeE + 1;
          continue;
        }
      }

      if (ch === '&') {
        var decoded = decodeEntity(src.slice(i));
        if (decoded !== null) {
          buf.push(decoded);
          i += ENTITY_RE.exec(src.slice(i))[0].length;
          continue;
        }
        buf.push(ch);
        i++;
        continue;
      }

      if (ch === '<') {
        var auto = AUTOLINK_RE.exec(src.slice(i));
        if (auto) {
          flushText(buf, out);
          var target = auto[1];
          out.push('<a href="' + escTextBuf(target) + '">' + escTextBuf(target) + '</a>');
          i += auto[0].length;
          continue;
        }
        var tag = HTML_TAG_RE.exec(src.slice(i));
        if (tag) {
          flushText(buf, out);
          out.push(tag[0]);
          i += tag[0].length;
          continue;
        }
        var comment = /^<!--[\s\S]*?-->/.exec(src.slice(i));
        if (comment) {
          flushText(buf, out);
          out.push(comment[0]);
          i += comment[0].length;
          continue;
        }
        buf.push(ch);
        i++;
        continue;
      }

      if (ch === '\\' && i + 1 < src.length) {
        buf.push(src.charAt(i + 1));
        i += 2;
        continue;
      }

      buf.push(ch);
      i++;
    }
    flushText(buf, out);
    return out.join('');
  }

  function isThematicBreak(line) {
    return /^ {0,3}(?:(?:- *){3,}|(?:\* *){3,}|(?:_ *){3,})$/.test(line);
  }

  function atxHeading(line) {
    var m = /^ {0,3}(#{1,6})(?:[ \t]+(.*?))?[ \t]*(?:#+)?[ \t]*$/.exec(line);
    if (!m) return null;
    return { level: m[1].length, text: m[2] || '' };
  }

  function isListItem(line) {
    return /^ {0,3}[-*+][ \t]+/.test(line);
  }

  // render_markdown_to_html from src/export.rs (STRIKETHROUGH enabled)
  function renderMarkdownToHtml(md) {
    var lines = md.split('\n');
    var out = '';
    var i = 0;
    while (i < lines.length) {
      var line = lines[i];
      if (line === '' || /^[ \t]*$/.test(line)) { i++; continue; }

      if (isThematicBreak(line)) {
        out += '<hr />\n';
        i++;
        continue;
      }

      var h = atxHeading(line);
      if (h) {
        out += '<h' + h.level + '>' + renderInlines(h.text) + '</h' + h.level + '>\n';
        i++;
        continue;
      }

      if (isListItem(line)) {
        var items = [];
        while (i < lines.length && isListItem(lines[i])) {
          var itemLine = lines[i];
          itemLine = itemLine.replace(/^ {0,3}[-*+][ \t]+/, '');
          items.push(itemLine);
          i++;
        }
        out += '<ul>\n';
        for (var k = 0; k < items.length; k++) {
          out += '<li>' + renderInlines(items[k]) + '</li>\n';
        }
        out += '</ul>\n';
        continue;
      }

      var para = [];
      while (i < lines.length && lines[i] !== '' &&
             /^[ \t]*$/.test(lines[i]) !== true &&
             !isThematicBreak(lines[i]) &&
             !atxHeading(lines[i]) &&
             !isListItem(lines[i])) {
        para.push(lines[i]);
        i++;
      }
      out += '<p>';
      for (var j = 0; j < para.length; j++) {
        if (j > 0) out += '\n';
        out += renderInlines(para[j]);
      }
      out += '</p>\n';
    }
    return out;
  }

  // ── HTML ───────────────────────────────────────────────────────────────────

  function exportToHtml(license) {
    var md = exportToMarkdown(license);
    var bodyHtml = renderMarkdownToHtml(md);

    var html = '';
    html += '<!DOCTYPE html>\n<html lang="en">\n<head>\n';
    html += '  <meta charset="UTF-8">\n';
    html += '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
    html += '  <title>' + escXml(license.metadata.name) + '</title>\n';
    html += '  <style>\n';
    html += '    :root { --bg: #ffffff; --fg: #1a1a1a; --accent: #2563eb; --border: #e5e7eb; --code-bg: #f3f4f6; }\n';
    html += '    @media (prefers-color-scheme: dark) {\n';
    html += '      :root { --bg: #1a1a2e; --fg: #e0e0e0; --accent: #60a5fa; --border: #374151; --code-bg: #1f2937; }\n';
    html += '    }\n';
    html += '    * { box-sizing: border-box; margin: 0; padding: 0; }\n';
    html += "    body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--fg); line-height: 1.7; padding: 2rem; max-width: 900px; margin: 0 auto; }\n";
    html += '    h1 { font-size: 2rem; border-bottom: 3px solid var(--accent); padding-bottom: 0.5rem; margin-bottom: 1.5rem; }\n';
    html += '    h2 { font-size: 1.4rem; margin-top: 2rem; margin-bottom: 0.8rem; color: var(--accent); }\n';
    html += '    h3 { font-size: 1.1rem; margin-top: 1.2rem; margin-bottom: 0.5rem; }\n';
    html += '    p { margin-bottom: 1rem; }\n';
    html += '    ul, ol { margin-left: 1.5rem; margin-bottom: 1rem; }\n';
    html += '    li { margin-bottom: 0.3rem; }\n';
    html += '    code { background: var(--code-bg); padding: 0.15em 0.4em; border-radius: 4px; font-size: 0.9em; }\n';
    html += '    pre { background: var(--code-bg); padding: 1rem; border-radius: 8px; overflow-x: auto; margin-bottom: 1rem; }\n';
    html += '    pre code { background: none; padding: 0; }\n';
    html += '    table { border-collapse: collapse; width: 100%%; margin-bottom: 1rem; }\n';
    html += '    th, td { border: 1px solid var(--border); padding: 0.5rem 1rem; text-align: left; }\n';
    html += '    th { background: var(--code-bg); font-weight: 600; }\n';
    html += '    hr { border: none; border-top: 1px solid var(--border); margin: 2rem 0; }\n';
    html += '    strong { font-weight: 600; }\n';
    html += '    .meta-badge { display: inline-block; background: var(--code-bg); border: 1px solid var(--border); border-radius: 6px; padding: 0.25rem 0.75rem; margin: 0.25rem 0.25rem 0.25rem 0; font-size: 0.85rem; }\n';
    html += '    .hash-section { font-family: monospace; font-size: 0.85rem; }\n';
    html += '  </style>\n';
    html += '</head>\n<body>\n';
    html += bodyHtml;
    html += '\n</body>\n</html>';

    return html;
  }

  // ── JSON (serde_json::to_string_pretty, field order) ──────────────────────

  function toJsonLicense(license) {
    var m = license.metadata;
    var obj = {
      metadata: {
        id: {
          uuid: m.id.uuid,
          fingerprint: m.id.fingerprint,
          spdx_identifier: isSome(m.id.spdx_identifier) ? m.id.spdx_identifier : null
        },
        name: m.name,
        description: m.description,
        version: m.version,
        created_at: m.created_at,
        modified_at: m.modified_at,
        authors: (m.authors || []).map(function (a) {
          return {
            name: a.name,
            email: isSome(a.email) ? a.email : null,
            organization: isSome(a.organization) ? a.organization : null,
            url: isSome(a.url) ? a.url : null
          };
        }),
        tags: (m.tags || []).slice(),
        category: m.category,
        spdx_id: isSome(m.spdx_id) ? m.spdx_id : null,
        custom_id: isSome(m.custom_id) ? m.custom_id : null
      },
      preamble: license.preamble,
      clauses: (license.clauses || []).map(function (c) {
        return {
          clause_uuid: c.clause_uuid,
          name: c.name,
          content: c.content,
          category: catSnake(c.category),
          priority: c.priority
        };
      }),
      conditions: (license.conditions || []).slice(),
      permissions: (license.permissions || []).slice(),
      restrictions: (license.restrictions || []).slice(),
      patent_grant: isSome(license.patent_grant) ? license.patent_grant : null,
      warranty_disclaimer: license.warranty_disclaimer,
      full_text: license.full_text,
      hash: {
        blake3: license.hash.blake3,
        sha256: license.hash.sha256,
        sha3_256: license.hash.sha3_256
      }
    };
    return obj;
  }

  function exportToJson(license) {
    return JSON.stringify(toJsonLicense(license), null, 2);
  }

  // ── YAML (serde_yaml style, structure/key order) ──────────────────────────

  function yamlNeedsQuote(s) {
    if (/^[ \t]/.test(s) || /[ \t]$/.test(s)) return true;
    if (/[\n\r\t]/.test(s)) return true;
    if (s.indexOf(': ') !== -1) return true;
    if (s.indexOf(' #') !== -1) return true;
    if (/^[-?:,[\]{}#&*!|>'"%@`]/.test(s)) return true;
    if (/^[^A-Za-z0-9_\-\[\]{},.:/\s]/.test(s)) return true;
    if (/^-?(0|[1-9][0-9]*|[1-9][0-9_]*|0[0-7]+|0x[0-9a-fA-F]+|0b[01]+)$/.test(s)) return true;
    if (/^-?((0|[1-9][0-9]*)(\.[0-9]*)?|\.[0-9]+)([eE][-+]?[0-9]+)?$/.test(s)) {
      if (s === '1.0' || /[-+]?\.[0-9]+$/.test(s)) return true;
      if (/^[-]?[0-9]+(\.[0-9]+)?([eE][-+]?[0-9]+)?$/.test(s)) {
        if (s.indexOf('.') === -1 || /[eE]/.test(s)) return true;
        return false;
      }
      return false;
    }
    if (/^(true|false|yes|no|on|off|null|~)$/i.test(s)) return true;
    if (/^\.[0-9]+$/.test(s)) return true;
    return false;
  }

  function yamlQuote(s) {
    var escaped = String(s)
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
    escaped = escaped.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, function (m) {
      var h = m.charCodeAt(0).toString(16).toUpperCase();
      return '\\u00' + (h.length < 2 ? '0' + h : h);
    });
    return '"' + escaped + '"';
  }

  function yamlScalar(v) {
    if (v === null || v === undefined) return 'null';
    if (typeof v === 'boolean') return v ? 'true' : 'false';
    if (typeof v === 'number') {
      if (!isFinite(v)) return '"' + v + '"';
      return String(v);
    }
    var s = String(v);
    if (s === '') return '""';
    if (yamlNeedsQuote(s)) return yamlQuote(s);
    return s;
  }

  function isArray(v) {
    return Object.prototype.toString.call(v) === '[object Array]';
  }

  function isMap(v) {
    return typeof v === 'object' && v !== null && !isArray(v);
  }

  function yamlEntry(key, val, indent) {
    var pad = rep(' ', indent);
    if (isArray(val)) {
      if (val.length === 0) return pad + key + ': []\n';
      if (isMap(val[0])) {
        var s = pad + key + ':\n';
        for (var j = 0; j < val.length; j++) {
          s += yamlMapBody(val[j], indent + 4, pad + '  - ');
        }
        return s;
      }
      var s2 = pad + key + ':\n';
      for (var k = 0; k < val.length; k++) {
        s2 += pad + '  - ' + yamlScalar(val[k]) + '\n';
      }
      return s2;
    }
    if (isMap(val)) {
      var keys = Object.keys(val);
      if (keys.length === 0) return pad + key + ': {}\n';
      return pad + key + ':\n' + yamlMap(val, indent + 2);
    }
    return pad + key + ': ' + yamlScalar(val) + '\n';
  }

  function yamlMapBody(map, keyIndent, firstPrefix) {
    var keys = Object.keys(map);
    var s = '';
    for (var i = 0; i < keys.length; i++) {
      var e = yamlEntry(keys[i], map[keys[i]], keyIndent);
      if (i === 0) {
        var prefix = rep(' ', keyIndent);
        if (e.indexOf(prefix) === 0) {
          e = firstPrefix + e.slice(prefix.length);
        }
      }
      s += e;
    }
    return s;
  }

  function yamlMap(map, indent) {
    var keys = Object.keys(map);
    var s = '';
    for (var i = 0; i < keys.length; i++) {
      s += yamlEntry(keys[i], map[keys[i]], indent);
    }
    return s;
  }

  function toYamlLicense(license) {
    var m = license.metadata;
    return {
      metadata: {
        id: {
          uuid: m.id.uuid,
          fingerprint: m.id.fingerprint,
          spdx_identifier: isSome(m.id.spdx_identifier) ? m.id.spdx_identifier : null
        },
        name: m.name,
        description: m.description,
        version: m.version,
        created_at: m.created_at,
        modified_at: m.modified_at,
        authors: (m.authors || []).map(function (a) {
          return {
            name: a.name,
            email: isSome(a.email) ? a.email : null,
            organization: isSome(a.organization) ? a.organization : null,
            url: isSome(a.url) ? a.url : null
          };
        }),
        tags: (m.tags || []).slice(),
        category: m.category,
        spdx_id: isSome(m.spdx_id) ? m.spdx_id : null,
        custom_id: isSome(m.custom_id) ? m.custom_id : null
      },
      preamble: license.preamble,
      clauses: (license.clauses || []).map(function (c) {
        return {
          clause_uuid: c.clause_uuid,
          name: c.name,
          content: c.content,
          category: catSnake(c.category),
          priority: c.priority
        };
      }),
      conditions: (license.conditions || []).slice(),
      permissions: (license.permissions || []).slice(),
      restrictions: (license.restrictions || []).slice(),
      patent_grant: isSome(license.patent_grant) ? license.patent_grant : null,
      warranty_disclaimer: license.warranty_disclaimer,
      full_text: license.full_text,
      hash: {
        blake3: license.hash.blake3,
        sha256: license.hash.sha256,
        sha3_256: license.hash.sha3_256
      }
    };
  }

  function exportToYaml(license) {
    return yamlMap(toYamlLicense(license), 0);
  }

  // ── TOML (toml crate style, values before tables) ─────────────────────────

  function tomlStr(s) {
    return yamlQuote(s);
  }

  function tomlArr(arr) {
    arr = arr || [];
    var parts = [];
    for (var i = 0; i < arr.length; i++) parts.push(tomlStr(arr[i]));
    return '[' + parts.join(', ') + ']';
  }

  function exportToToml(license) {
    var m = license.metadata;
    var out = '';

    out += 'preamble = ' + tomlStr(license.preamble) + '\n';
    out += 'conditions = ' + tomlArr(license.conditions) + '\n';
    out += 'permissions = ' + tomlArr(license.permissions) + '\n';
    out += 'restrictions = ' + tomlArr(license.restrictions) + '\n';
    if (isSome(license.patent_grant)) out += 'patent_grant = ' + tomlStr(license.patent_grant) + '\n';
    out += 'warranty_disclaimer = ' + tomlStr(license.warranty_disclaimer) + '\n';
    out += 'full_text = ' + tomlStr(license.full_text) + '\n';

    out += '\n[metadata]\n';
    out += 'name = ' + tomlStr(m.name) + '\n';
    out += 'description = ' + tomlStr(m.description) + '\n';
    out += 'version = ' + tomlStr(m.version) + '\n';
    out += 'created_at = "' + m.created_at + '"\n';
    out += 'modified_at = "' + m.modified_at + '"\n';
    out += 'tags = ' + tomlArr(m.tags) + '\n';
    out += 'category = ' + tomlStr(m.category) + '\n';
    if (isSome(m.spdx_id)) out += 'spdx_id = ' + tomlStr(m.spdx_id) + '\n';
    if (isSome(m.custom_id)) out += 'custom_id = ' + tomlStr(m.custom_id) + '\n';

    out += '\n[metadata.id]\n';
    out += 'uuid = "' + m.id.uuid + '"\n';
    out += 'fingerprint = ' + tomlStr(m.id.fingerprint) + '\n';
    if (isSome(m.id.spdx_identifier)) out += 'spdx_identifier = ' + tomlStr(m.id.spdx_identifier) + '\n';

    var authors = m.authors || [];
    for (var a = 0; a < authors.length; a++) {
      out += '\n[[metadata.authors]]\n';
      out += 'name = ' + tomlStr(authors[a].name) + '\n';
      if (isSome(authors[a].email)) out += 'email = ' + tomlStr(authors[a].email) + '\n';
      if (isSome(authors[a].organization)) out += 'organization = ' + tomlStr(authors[a].organization) + '\n';
      if (isSome(authors[a].url)) out += 'url = ' + tomlStr(authors[a].url) + '\n';
    }

    var clauses = sortedClauses(license);
    for (var c = 0; c < clauses.length; c++) {
      out += '\n[[clauses]]\n';
      out += 'clause_uuid = "' + clauses[c].clause_uuid + '"\n';
      out += 'name = ' + tomlStr(clauses[c].name) + '\n';
      out += 'content = ' + tomlStr(clauses[c].content) + '\n';
      out += 'category = ' + tomlStr(catSnake(clauses[c].category)) + '\n';
      out += 'priority = ' + clauses[c].priority + '\n';
    }

    out += '\n[hash]\n';
    out += 'blake3 = ' + tomlStr(license.hash.blake3) + '\n';
    out += 'sha256 = ' + tomlStr(license.hash.sha256) + '\n';
    out += 'sha3_256 = ' + tomlStr(license.hash.sha3_256) + '\n';

    return out;
  }

  // ── XML ────────────────────────────────────────────────────────────────────

  function xmlIndent(depth) {
    return rep('  ', depth);
  }

  function exportToXml(license) {
    var m = license.metadata;
    var xml = '';
    xml += '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<license>\n';

    var d = 1;
    xml += xmlIndent(d) + '<metadata>\n';
    xml += xmlIndent(d + 1) + '<name>' + escXml(m.name) + '</name>\n';
    xml += xmlIndent(d + 1) + '<version>' + escXml(m.version) + '</version>\n';
    xml += xmlIndent(d + 1) + '<description>' + escXml(m.description) + '</description>\n';
    xml += xmlIndent(d + 1) + '<category>' + m.category + '</category>\n';
    xml += xmlIndent(d + 1) + '<created_at>' + fmtRfc3339(m.created_at) + '</created_at>\n';
    xml += xmlIndent(d + 1) + '<modified_at>' + fmtRfc3339(m.modified_at) + '</modified_at>\n';
    xml += xmlIndent(d + 1) + '<uuid>' + m.id.uuid + '</uuid>\n';
    xml += xmlIndent(d + 1) + '<fingerprint>' + escXml(m.id.fingerprint) + '</fingerprint>\n';
    if (isSome(m.spdx_id)) {
      xml += xmlIndent(d + 1) + '<spdx_id>' + escXml(m.spdx_id) + '</spdx_id>\n';
    }
    if (isSome(m.custom_id)) {
      xml += xmlIndent(d + 1) + '<custom_id>' + escXml(m.custom_id) + '</custom_id>\n';
    }

    xml += xmlIndent(d + 1) + '<authors>\n';
    var authors = m.authors || [];
    for (var i = 0; i < authors.length; i++) {
      xml += xmlIndent(d + 2) + '<author>\n';
      xml += xmlIndent(d + 3) + '<name>' + escXml(authors[i].name) + '</name>\n';
      if (isSome(authors[i].email)) xml += xmlIndent(d + 3) + '<email>' + escXml(authors[i].email) + '</email>\n';
      if (isSome(authors[i].organization)) xml += xmlIndent(d + 3) + '<organization>' + escXml(authors[i].organization) + '</organization>\n';
      if (isSome(authors[i].url)) xml += xmlIndent(d + 3) + '<url>' + escXml(authors[i].url) + '</url>\n';
      xml += xmlIndent(d + 2) + '</author>\n';
    }
    xml += xmlIndent(d + 1) + '</authors>\n';

    if (m.tags && m.tags.length) {
      xml += xmlIndent(d + 1) + '<tags>\n';
      for (var t = 0; t < m.tags.length; t++) {
        xml += xmlIndent(d + 2) + '<tag>' + escXml(m.tags[t]) + '</tag>\n';
      }
      xml += xmlIndent(d + 1) + '</tags>\n';
    }

    xml += xmlIndent(d) + '</metadata>\n';

    if (license.preamble) {
      xml += xmlIndent(d) + '<preamble>' + escXml(license.preamble) + '</preamble>\n';
    }

    var clauses = sortedClauses(license);
    if (clauses.length) {
      xml += xmlIndent(d) + '<clauses>\n';
      for (var c = 0; c < clauses.length; c++) {
        xml += xmlIndent(d + 1) + '<clause>\n';
        xml += xmlIndent(d + 2) + '<name>' + escXml(clauses[c].name) + '</name>\n';
        xml += xmlIndent(d + 2) + '<uuid>' + clauses[c].clause_uuid + '</uuid>\n';
        xml += xmlIndent(d + 2) + '<category>' + catDebug(clauses[c].category) + '</category>\n';
        xml += xmlIndent(d + 2) + '<priority>' + clauses[c].priority + '</priority>\n';
        xml += xmlIndent(d + 2) + '<content>' + escXml(clauses[c].content) + '</content>\n';
        xml += xmlIndent(d + 1) + '</clause>\n';
      }
      xml += xmlIndent(d) + '</clauses>\n';
    }

    if (license.permissions && license.permissions.length) {
      xml += xmlIndent(d) + '<permissions>\n';
      for (var p = 0; p < license.permissions.length; p++) {
        xml += xmlIndent(d + 1) + '<permission>' + escXml(license.permissions[p]) + '</permission>\n';
      }
      xml += xmlIndent(d) + '</permissions>\n';
    }

    if (license.conditions && license.conditions.length) {
      xml += xmlIndent(d) + '<conditions>\n';
      for (var co = 0; co < license.conditions.length; co++) {
        xml += xmlIndent(d + 1) + '<condition>' + escXml(license.conditions[co]) + '</condition>\n';
      }
      xml += xmlIndent(d) + '</conditions>\n';
    }

    if (license.restrictions && license.restrictions.length) {
      xml += xmlIndent(d) + '<restrictions>\n';
      for (var r = 0; r < license.restrictions.length; r++) {
        xml += xmlIndent(d + 1) + '<restriction>' + escXml(license.restrictions[r]) + '</restriction>\n';
      }
      xml += xmlIndent(d) + '</restrictions>\n';
    }

    if (isSome(license.patent_grant)) {
      xml += xmlIndent(d) + '<patent_grant>' + escXml(license.patent_grant) + '</patent_grant>\n';
    }

    if (license.warranty_disclaimer) {
      xml += xmlIndent(d) + '<warranty_disclaimer>' + escXml(license.warranty_disclaimer) + '</warranty_disclaimer>\n';
    }

    xml += xmlIndent(d) + '<hashes>\n';
    xml += xmlIndent(d + 1) + '<blake3>' + escXml(license.hash.blake3) + '</blake3>\n';
    xml += xmlIndent(d + 1) + '<sha256>' + escXml(license.hash.sha256) + '</sha256>\n';
    xml += xmlIndent(d + 1) + '<sha3_256>' + escXml(license.hash.sha3_256) + '</sha3_256>\n';
    xml += xmlIndent(d) + '</hashes>\n';

    xml += '</license>\n';
    return xml;
  }

  // ── SPDX (JSON document from src/export.rs) ────────────────────────────────

  function spdxJsonDoc(license) {
    var spdx_id = spdxLicenseId(license);
    var author_text = authorLine(license);

    var spdx = '';
    spdx += '{\n';
    spdx += '  "spdxVersion": "SPDX-3.0",\n';
    spdx += '  "dataLicense": "CC0-1.0",\n';
    spdx += '  "SPDXID": "SPDXRef-DOCUMENT",\n';
    spdx += '  "name": "' + escXml(license.metadata.name) + '",\n';
    spdx += '  "documentNamespace": "https://glg-project.org/licenses/' + license.metadata.id.uuid + '",\n';
    spdx += '  "creationInfo": {\n    "created": "' + fmtIsoZ(license.metadata.created_at) + '",\n    "creators": ["Tool: glg-' + license.metadata.version + '"]\n  },\n';
    spdx += '  "externalDocumentRefs": [\n    {"referenceType": "SPDXReference-DOCUMENT", "referenceCategory": "SECURITY", "referenceLocator": "https://spdx.org/licenses/' + escXml(spdx_id) + '"}\n  ],\n';
    spdx += '  "packages": [\n';
    spdx += '    {\n';
    spdx += '      "name": "' + escXml(license.metadata.name) + '",\n';
    spdx += '      "SPDXID": "SPDXRef-Package",\n';
    spdx += '      "downloadLocation": "NOASSERTION",\n';
    spdx += '      "copyrightText": "' + escXml(author_text) + '",\n';
    spdx += '      "licenseConcluded": "' + escXml(spdx_id) + '",\n';
    spdx += '      "licenseDeclared": "' + escXml(spdx_id) + '",\n';
    spdx += '      "description": "' + escXml(license.metadata.description) + '",\n';
    spdx += '      "externalRefs": []\n';
    spdx += '    }\n';
    spdx += '  ],\n';

    spdx += '  "relationships": [\n';
    spdx += '    {\n';
    spdx += '      "spdxElementId": "SPDXRef-DOCUMENT",\n';
    spdx += '      "relationshipType": "DESCRIBES",\n';
    spdx += '      "relatedSpdxElement": "SPDXRef-Package"\n';
    spdx += '    }\n';
    spdx += '  ],\n';

    spdx += '  "annotations": [\n';
    spdx += '    {\n';
    spdx += '      "annotationDate": "' + fmtIsoZ(license.metadata.modified_at) + '",\n';
    spdx += '      "annotationType": "OTHER",\n';
    spdx += '      "spdxElementId": "SPDXRef-DOCUMENT",\n';
    spdx += '      "comment": "BLAKE3: ' + license.hash.blake3 + ' | SHA-256: ' + license.hash.sha256 + ' | SHA3-256: ' + license.hash.sha3_256 + '"\n';
    spdx += '    }\n';
    spdx += '  ],\n';

    spdx += '  "snippets": [\n';
    spdx += '    {\n';
    spdx += '      "name": "License-Summary",\n';
    spdx += '      "SPDXID": "SPDXRef-Snippet-Summary",\n';
    spdx += '      "copyrightText": "' + escXml(author_text) + '",\n';
    spdx += '      "licenseConcluded": "NOASSERTION",\n';
    spdx += '      "comment": "Category: ' + license.metadata.category + ' | Clauses: ' + (license.clauses || []).length +
      ' | Permissions: ' + (license.permissions || []).length +
      ' | Conditions: ' + (license.conditions || []).length +
      ' | Restrictions: ' + (license.restrictions || []).length + '"\n';
    spdx += '    }\n';
    spdx += '  ]\n';

    spdx += '}\n';
    return spdx;
  }

  // ── CycloneDX SBOM ─────────────────────────────────────────────────────────

  function exportCycloneDX(license) {
    return generateCycloneDxSbom(license);
  }

  function generateCycloneDxSbom(license) {
    var spdx_id = spdxLicenseId(license);
    var author_text = authorLine(license);

    var cdx = '';
    cdx += '{\n';
    cdx += '  "bomFormat": "CycloneDX",\n';
    cdx += '  "specVersion": "1.5",\n';
    cdx += '  "version": 1,\n';
    cdx += '  "metadata": {\n';
    cdx += '    "tools": [\n';
    cdx += '      {\n';
    cdx += '        "vendor": "glg-project",\n';
    cdx += '        "name": "glg",\n';
    cdx += '        "version": "' + escXml(license.metadata.version) + '"\n';
    cdx += '      }\n';
    cdx += '    ],\n';
    cdx += '    "licenses": [\n';
    cdx += '      {\n';
    cdx += '        "license": {\n';
    cdx += '          "id": "' + escXml(spdx_id) + '",\n';
    cdx += '          "name": "' + escXml(license.metadata.name) + '"\n';
    cdx += '        }\n';
    cdx += '      }\n';
    cdx += '    ],\n';
    cdx += '    "supplier": {\n      "name": "' + escXml(author_text) + '"\n    },\n';
    cdx += '    "timestamp": "' + fmtIsoZ(license.metadata.created_at) + '"\n';
    cdx += '  },\n';

    cdx += '  "components": [\n';
    cdx += '    {\n';
    cdx += '      "type": "library",\n';
    cdx += '      "name": "' + escXml(license.metadata.name) + '",\n';
    cdx += '      "version": "' + escXml(license.metadata.version) + '",\n';
    cdx += '      "licenses": [\n';
    cdx += '        {\n';
    cdx += '          "license": {\n';
    cdx += '            "id": "' + escXml(spdx_id) + '",\n';
    cdx += '            "name": "' + escXml(license.metadata.name) + '"\n';
    cdx += '          }\n';
    cdx += '        }\n';
    cdx += '      ],\n';
    cdx += '      "properties": [\n';

    cdx += '        { "name": "glg.category", "value": "' + license.metadata.category + '" },\n';
    cdx += '        { "name": "glg.clauses.count", "value": "' + (license.clauses || []).length + '" },\n';
    cdx += '        { "name": "glg.permissions.count", "value": "' + (license.permissions || []).length + '" },\n';
    cdx += '        { "name": "glg.conditions.count", "value": "' + (license.conditions || []).length + '" },\n';
    cdx += '        { "name": "glg.restrictions.count", "value": "' + (license.restrictions || []).length + '" },\n';
    cdx += '        { "name": "glg.hash.blake3", "value": "' + escXml(license.hash.blake3) + '" },\n';
    cdx += '        { "name": "glg.hash.sha256", "value": "' + escXml(license.hash.sha256) + '" },\n';
    cdx += '        { "name": "glg.hash.sha3_256", "value": "' + escXml(license.hash.sha3_256) + '" }\n';

    cdx += '      ]\n';
    cdx += '    }\n';
    cdx += '  ],\n';

    cdx += '  "externalReferences": [\n';
    cdx += '    {\n      "type": "license",\n      "url": "https://spdx.org/licenses/' + escXml(spdx_id) + '"\n    }\n';
    cdx += '  ],\n';

    cdx += '  "dependencies": []\n';
    cdx += '}\n';

    return cdx;
  }

  // ── Notice ─────────────────────────────────────────────────────────────────

  function exportNotice(license) {
    var notice = '';
    var year = fmtYear(license.metadata.created_at);
    var modified_year = fmtYear(license.metadata.modified_at);

    notice += license.metadata.name + ' ' + license.metadata.version + '  -  License Notice\n';
    notice += rep('=', 50) + '\n';
    notice += '\n';

    notice += 'Copyright (c) ';
    if (year === modified_year) {
      notice += year;
    } else {
      notice += year + '-' + modified_year;
    }
    notice += '  ';
    notice += authorLine(license);
    notice += '\n\n';

    notice += 'This software and associated documentation files (the "Software") are\n';
    notice += 'provided under the terms of the following license:\n\n';

    if (isSome(license.metadata.spdx_id)) {
      notice += 'SPDX License Identifier: ' + license.metadata.spdx_id + '\n\n';
    }

    if (license.permissions && license.permissions.length) {
      notice += 'PERMISSIONS:\n';
      for (var i = 0; i < license.permissions.length; i++) {
        notice += '  - ' + license.permissions[i] + '\n';
      }
      notice += '\n';
    }

    if (license.conditions && license.conditions.length) {
      notice += 'CONDITIONS:\n';
      for (var i2 = 0; i2 < license.conditions.length; i2++) {
        notice += '  - ' + license.conditions[i2] + '\n';
      }
      notice += '\n';
    }

    if (license.restrictions && license.restrictions.length) {
      notice += 'RESTRICTIONS:\n';
      for (var i3 = 0; i3 < license.restrictions.length; i3++) {
        notice += '  - ' + license.restrictions[i3] + '\n';
      }
      notice += '\n';
    }

    if (license.warranty_disclaimer) {
      notice += license.warranty_disclaimer;
      notice += '\n';
    }

    return notice;
  }

  // ── Copying ────────────────────────────────────────────────────────────────

  function exportCopying(license) {
    var copying = '';
    var sep = rep('=', 60);
    var thin_sep = rep('-', 60);

    copying += sep + '\n';
    copying += '  ' + license.metadata.name + '\n';
    copying += '  Version ' + license.metadata.version + '\n';
    copying += sep + '\n';
    copying += '\n';

    copying += 'Category: ' + license.metadata.category + '\n';
    if (isSome(license.metadata.spdx_id)) copying += 'SPDX ID: ' + license.metadata.spdx_id + '\n';
    copying += '\n';

    copying += 'Copyright holders:\n';
    var authors = license.metadata.authors || [];
    for (var a = 0; a < authors.length; a++) {
      var entry = '  ' + authors[a].name;
      if (isSome(authors[a].organization)) entry += ' (' + authors[a].organization + ')';
      if (isSome(authors[a].email)) entry += ' <' + authors[a].email + '>';
      if (isSome(authors[a].url)) entry += ' [' + authors[a].url + ']';
      copying += entry + '\n';
    }
    copying += '\n';

    copying += 'This license governs the use, copying, distribution, and modification\n';
    copying += 'of the software.\n\n';

    if (license.preamble) {
      copying += 'PREAMBLE\n';
      copying += thin_sep + '\n';
      copying += license.preamble + '\n\n';
    }

    var clauses = sortedClauses(license);
    for (var c = 0; c < clauses.length; c++) {
      var title = clauses[c].name.toUpperCase() + ' (Section ' + clauses[c].priority + ')';
      copying += title + '\n';
      copying += rep('-', utf8Len(title)) + '\n';
      copying += clauses[c].content + '\n\n';
    }

    if (license.permissions && license.permissions.length) {
      copying += 'PERMISSIONS\n';
      copying += thin_sep + '\n';
      for (var p = 0; p < license.permissions.length; p++) {
        copying += '  ' + license.permissions[p] + '\n';
      }
      copying += '\n';
    }

    if (license.conditions && license.conditions.length) {
      copying += 'CONDITIONS\n';
      copying += thin_sep + '\n';
      for (var c2 = 0; c2 < license.conditions.length; c2++) {
        copying += '  ' + license.conditions[c2] + '\n';
      }
      copying += '\n';
    }

    if (license.restrictions && license.restrictions.length) {
      copying += 'RESTRICTIONS\n';
      copying += thin_sep + '\n';
      for (var r = 0; r < license.restrictions.length; r++) {
        copying += '  ' + license.restrictions[r] + '\n';
      }
      copying += '\n';
    }

    if (isSome(license.patent_grant)) {
      copying += 'PATENT GRANT\n';
      copying += thin_sep + '\n';
      copying += license.patent_grant + '\n\n';
    }

    if (license.warranty_disclaimer) {
      copying += 'WARRANTY DISCLAIMER\n';
      copying += thin_sep + '\n';
      copying += license.warranty_disclaimer + '\n\n';
    }

    copying += thin_sep + '\n';
    copying += 'Blake3:    ' + license.hash.blake3 + '\n';
    copying += 'SHA-256:   ' + license.hash.sha256 + '\n';
    copying += 'SHA3-256:  ' + license.hash.sha3_256 + '\n';
    copying += thin_sep + '\n';
    copying += 'END OF LICENSE\n';

    return copying;
  }

  // ── Summary ────────────────────────────────────────────────────────────────

  function padRight(s, n) {
    var w = s.length;
    if (w >= n) return s;
    return s + rep(' ', n - w);
  }

  function exportSummary(license) {
    var m = license.metadata;
    var summary = '';

    summary += 'License:      ' + m.name + ' v' + m.version + '\n';
    summary += 'Category:     ' + m.category + '\n';
    if (isSome(m.spdx_id)) summary += 'SPDX ID:      ' + m.spdx_id + '\n';
    summary += 'Authors:      ' + authorLine(license) + '\n';
    summary += 'Created:      ' + fmtDateTime(m.created_at) + '\n';
    summary += 'Modified:     ' + fmtDateTime(m.modified_at) + '\n';
    summary += 'UUID:         ' + m.id.uuid + '\n';
    summary += 'Fingerprint:  ' + m.id.fingerprint + '\n';
    summary += '\n';

    summary += 'Clauses:      ' + (license.clauses || []).length + '\n';
    summary += 'Permissions:  ' + (license.permissions || []).length + '\n';
    summary += 'Conditions:   ' + (license.conditions || []).length + '\n';
    summary += 'Restrictions: ' + (license.restrictions || []).length + '\n';
    summary += 'Patent grant: ' + (isSome(license.patent_grant) ? 'Yes' : 'No') + '\n';
    summary += 'Warranty:     ' + (license.warranty_disclaimer ? 'Disclaimer included' : 'None') + '\n';
    summary += '\n';

    var cc = categoryCounts(license.clauses);
    summary += 'Clause breakdown:\n';
    for (var i = 0; i < cc.order.length; i++) {
      summary += '  ' + padRight(cc.order[i], 20) + ' ' + cc.counts[cc.order[i]] + '\n';
    }
    summary += '\n';

    summary += 'Hashes:\n';
    summary += '  Blake3:    ' + license.hash.blake3 + '\n';
    summary += '  SHA-256:   ' + license.hash.sha256 + '\n';
    summary += '  SHA3-256:  ' + license.hash.sha3_256 + '\n';
    summary += '\n';

    summary += 'Full text length:  ' + utf8Len(license.full_text) + ' chars\n';

    return summary;
  }

  // ── AI Summary (rule-based) ────────────────────────────────────────────────

  function containsAny(s, needles) {
    var lower = String(s).toLowerCase();
    for (var i = 0; i < needles.length; i++) {
      if (lower.indexOf(needles[i]) !== -1) return true;
    }
    return false;
  }

  function exportAiSummary(license) {
    var m = license.metadata;
    var ai = '';

    ai += '# AI Summary: ' + m.name + ' v' + m.version + '\n\n';
    ai += '**Category:** ' + m.category + '\n\n';

    if (m.description && m.description !== '') {
      ai += '**Description:** ' + m.description + '\n\n';
    }

    ai += '**SPDX License Identifier:** `' + spdxLicenseId(license) + '`\n\n';

    if (license.permissions && license.permissions.length) {
      ai += '**This license permits:**\n';
      for (var p = 0; p < license.permissions.length; p++) {
        ai += '- ' + license.permissions[p] + '\n';
      }
      ai += '\n';
    }

    if (license.conditions && license.conditions.length) {
      ai += '**This license requires:**\n';
      for (var c = 0; c < license.conditions.length; c++) {
        ai += '- ' + license.conditions[c] + '\n';
      }
      ai += '\n';
    }

    if (license.restrictions && license.restrictions.length) {
      ai += '**This license restricts:**\n';
      for (var r = 0; r < license.restrictions.length; r++) {
        ai += '- ' + license.restrictions[r] + '\n';
      }
      ai += '\n';
    }

    if (isSome(license.patent_grant)) {
      ai += '**Patent grant:** ' + license.patent_grant + '\n\n';
    }

    if (license.warranty_disclaimer) {
      ai += '**Warranty disclaimer:** ' + license.warranty_disclaimer + '\n\n';
    }

    var cc = categoryCounts(license.clauses);
    ai += '**Clause breakdown:**\n';
    for (var i = 0; i < cc.order.length; i++) {
      ai += '- ' + cc.order[i] + ': ' + cc.counts[cc.order[i]] + '\n';
    }
    ai += '\n';

    ai += '**Total clauses:** ' + (license.clauses || []).length + '\n\n';

    if (isSome(license.patent_grant)) {
      ai += '**Contains explicit patent grant:** Yes\n\n';
    } else {
      ai += '**Contains explicit patent grant:** No\n\n';
    }

    var has_copyleft = containsAny((license.conditions || []).join(' '), ['copyleft', 'same license']);
    var has_commercial = containsAny((license.restrictions || []).join(' '), ['commercial', 'non-commercial']);
    var has_ai_restriction = containsAny((license.restrictions || []).join(' '), ['machine learning', 'artificial intelligence', 'ai training']);

    ai += '**License characteristics:**\n';
    ai += '- Copyleft: ' + (has_copyleft ? 'Yes' : 'No') + '\n';
    ai += '- Commercial use restricted: ' + (has_commercial ? 'Yes' : 'No') + '\n';
    ai += '- AI training restricted: ' + (has_ai_restriction ? 'Yes' : 'No') + '\n';
    ai += '- Public domain: ' + (m.category === 'PublicDomain' ? 'Yes' : 'No') + '\n';

    ai += '\n';
    ai += '**License hash (Blake3):** `' + license.hash.blake3 + '`\n';

    return ai;
  }

  // ══ LicenseOutput::generate_* (src/license.rs) for generateAll ════════════

  function genMarkdown(license) {
    var m = license.metadata;
    var md = '';

    md += '# ' + m.name + '\n\n';
    md += '**Version:** ' + m.version + '\n\n';
    md += '**Category:** ' + m.category + '\n\n';

    if (m.authors && m.authors.length) {
      md += '**Authors:**\n';
      for (var i = 0; i < m.authors.length; i++) {
        md += '- ' + m.authors[i].name + ' ' + (isSome(m.authors[i].email) ? '<' + m.authors[i].email + '>' : '') + '\n';
      }
      md += '\n';
    }

    md += '**Created:** ' + fmtDateTime(m.created_at) + '\n\n';
    md += '**Modified:** ' + fmtDateTime(m.modified_at) + '\n\n';

    if (m.tags && m.tags.length) {
      md += '**Tags:** ' + m.tags.join(', ') + '\n\n';
    }

    if (license.preamble) {
      md += '## Preamble\n\n' + license.preamble + '\n\n';
    }

    var clauses = sortedClauses(license);
    if (clauses.length) {
      md += '## Clauses\n\n';
      for (var c = 0; c < clauses.length; c++) {
        md += '### ' + clauses[c].name + '\n\n' + clauses[c].content + '\n\n';
      }
    }

    if (license.permissions && license.permissions.length) {
      md += '## Permissions\n\n';
      for (var p = 0; p < license.permissions.length; p++) {
        md += '- ' + license.permissions[p] + '\n';
      }
      md += '\n';
    }

    if (license.conditions && license.conditions.length) {
      md += '## Conditions\n\n';
      for (var co = 0; co < license.conditions.length; co++) {
        md += '- ' + license.conditions[co] + '\n';
      }
      md += '\n';
    }

    if (license.restrictions && license.restrictions.length) {
      md += '## Restrictions\n\n';
      for (var r = 0; r < license.restrictions.length; r++) {
        md += '- ' + license.restrictions[r] + '\n';
      }
      md += '\n';
    }

    if (isSome(license.patent_grant)) {
      md += '## Patent Grant\n\n' + license.patent_grant + '\n\n';
    }

    if (license.warranty_disclaimer) {
      md += '## Warranty Disclaimer\n\n' + license.warranty_disclaimer + '\n\n';
    }

    md += '---\n\n';
    md += '*Blake3: `' + license.hash.blake3 + '`*\n';
    md += '*SHA-256: `' + license.hash.sha256 + '`*\n';
    md += '*SHA3-256: `' + license.hash.sha3_256 + '`*\n';

    return md;
  }

  function genHtml(license) {
    var m = license.metadata;
    var html = '';
    html += '<!DOCTYPE html>\n<html lang="en">\n<head>\n';
    html += '  <meta charset="UTF-8">\n';
    html += '  <title>' + escHtml(m.name) + '</title>\n';
    html += "  <style>\n    body { font-family: sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; }\n";
    html += '    h1 { border-bottom: 2px solid #333; padding-bottom: 0.5rem; }\n';
    html += '    .meta { color: #666; margin-bottom: 2rem; }\n    pre { background: #f5f5f5; padding: 1rem; overflow-x: auto; }\n';
    html += '  </style>\n</head>\n<body>\n';
    html += '  <h1>' + escHtml(m.name) + '</h1>\n';
    html += '  <div class="meta">\n    <p><strong>Version:</strong> ' + escHtml(m.version) + '</p>\n';
    html += '    <p><strong>Category:</strong> ' + m.category + '</p>\n';
    html += '    <p><strong>Created:</strong> ' + fmtDateTime(m.created_at) + '</p>\n';
    html += '  </div>\n';

    if (license.preamble) {
      html += '  <section>\n    <h2>Preamble</h2>\n    <p>' + escHtml(license.preamble).replace(/\n/g, '<br>') + '</p>\n  </section>\n';
    }

    var clauses = sortedClauses(license);
    if (clauses.length) {
      html += '  <section>\n    <h2>Clauses</h2>\n';
      for (var c = 0; c < clauses.length; c++) {
        html += '    <h3>' + escHtml(clauses[c].name) + '</h3>\n    <p>' + escHtml(clauses[c].content).replace(/\n/g, '<br>') + '</p>\n';
      }
      html += '  </section>\n';
    }

    if (license.permissions && license.permissions.length) {
      html += '  <section>\n    <h2>Permissions</h2>\n    <ul>\n';
      for (var p = 0; p < license.permissions.length; p++) {
        html += '      <li>' + escHtml(license.permissions[p]) + '</li>\n';
      }
      html += '    </ul>\n  </section>\n';
    }

    if (license.conditions && license.conditions.length) {
      html += '  <section>\n    <h2>Conditions</h2>\n    <ul>\n';
      for (var co = 0; co < license.conditions.length; co++) {
        html += '      <li>' + escHtml(license.conditions[co]) + '</li>\n';
      }
      html += '    </ul>\n  </section>\n';
    }

    if (license.restrictions && license.restrictions.length) {
      html += '  <section>\n    <h2>Restrictions</h2>\n    <ul>\n';
      for (var r = 0; r < license.restrictions.length; r++) {
        html += '      <li>' + escHtml(license.restrictions[r]) + '</li>\n';
      }
      html += '    </ul>\n  </section>\n';
    }

    if (isSome(license.patent_grant)) {
      html += '  <section>\n    <h2>Patent Grant</h2>\n    <p>' + escHtml(license.patent_grant).replace(/\n/g, '<br>') + '</p>\n  </section>\n';
    }

    if (license.warranty_disclaimer) {
      html += '  <section>\n    <h2>Warranty Disclaimer</h2>\n    <p>' + escHtml(license.warranty_disclaimer).replace(/\n/g, '<br>') + '</p>\n  </section>\n';
    }

    html += '  <footer>\n    <p>Blake3: <code>' + escHtml(license.hash.blake3) + '</code></p>\n';
    html += '    <p>SHA-256: <code>' + escHtml(license.hash.sha256) + '</code></p>\n';
    html += '    <p>SHA3-256: <code>' + escHtml(license.hash.sha3_256) + '</code></p>\n';
    html += '  </footer>\n</body>\n</html>';

    return html;
  }

  function genYaml(license) {
    var m = license.metadata;
    var yaml = '';

    yaml += 'name: "' + m.name + '"\n';
    yaml += 'version: "' + m.version + '"\n';
    yaml += 'category: "' + m.category + '"\n';
    yaml += 'description: "' + escYamlToml(m.description) + '"\n';
    yaml += 'created_at: "' + fmtIsoZ(m.created_at) + '"\n';
    yaml += 'modified_at: "' + fmtIsoZ(m.modified_at) + '"\n';
    yaml += 'uuid: "' + m.id.uuid + '"\n';
    yaml += 'fingerprint: "' + m.id.fingerprint + '"\n';
    if (isSome(m.spdx_id)) {
      yaml += 'spdx_id: "' + m.spdx_id + '"\n';
    }

    if (m.authors && m.authors.length) {
      yaml += 'authors:\n';
      for (var a = 0; a < m.authors.length; a++) {
        yaml += '  - name: "' + m.authors[a].name + '"\n';
        if (isSome(m.authors[a].email)) yaml += '    email: "' + m.authors[a].email + '"\n';
        if (isSome(m.authors[a].organization)) yaml += '    organization: "' + m.authors[a].organization + '"\n';
        if (isSome(m.authors[a].url)) yaml += '    url: "' + m.authors[a].url + '"\n';
      }
    }

    if (m.tags && m.tags.length) {
      yaml += 'tags:\n';
      for (var t = 0; t < m.tags.length; t++) {
        yaml += '  - "' + m.tags[t] + '"\n';
      }
    }

    if (license.preamble) {
      yaml += 'preamble: |\n  ' + escYamlToml(license.preamble).replace(/\n/g, '\n  ') + '\n';
    }

    var clauses = sortedClauses(license);
    if (clauses.length) {
      yaml += 'clauses:\n';
      for (var c = 0; c < clauses.length; c++) {
        yaml += '  - name: "' + clauses[c].name + '"\n';
        yaml += '    uuid: "' + clauses[c].clause_uuid + '"\n';
        yaml += '    category: "' + catDebug(clauses[c].category) + '"\n';
        yaml += '    priority: ' + clauses[c].priority + '\n';
        yaml += '    content: |\n      ' + escYamlToml(clauses[c].content).replace(/\n/g, '\n      ') + '\n';
      }
    }

    if (license.permissions && license.permissions.length) {
      yaml += 'permissions:\n';
      for (var p = 0; p < license.permissions.length; p++) {
        yaml += '  - "' + license.permissions[p] + '"\n';
      }
    }

    if (license.conditions && license.conditions.length) {
      yaml += 'conditions:\n';
      for (var co = 0; co < license.conditions.length; co++) {
        yaml += '  - "' + license.conditions[co] + '"\n';
      }
    }

    if (license.restrictions && license.restrictions.length) {
      yaml += 'restrictions:\n';
      for (var r = 0; r < license.restrictions.length; r++) {
        yaml += '  - "' + license.restrictions[r] + '"\n';
      }
    }

    if (isSome(license.patent_grant)) {
      yaml += 'patent_grant: |\n  ' + escYamlToml(license.patent_grant).replace(/\n/g, '\n  ') + '\n';
    }

    yaml += 'warranty_disclaimer: |\n  ' + escYamlToml(license.warranty_disclaimer).replace(/\n/g, '\n  ') + '\n';

    yaml += 'blake3: "' + license.hash.blake3 + '"\n';
    yaml += 'sha256: "' + license.hash.sha256 + '"\n';
    yaml += 'sha3_256: "' + license.hash.sha3_256 + '"\n';

    return yaml;
  }

  function genToml(license) {
    var m = license.metadata;
    var toml = '';

    toml += '[metadata]\n';
    toml += 'name = "' + m.name + '"\n';
    toml += 'version = "' + m.version + '"\n';
    toml += 'category = "' + m.category + '"\n';
    toml += 'description = "' + escYamlToml(m.description) + '"\n';
    toml += 'created_at = "' + fmtIsoZ(m.created_at) + '"\n';
    toml += 'modified_at = "' + fmtIsoZ(m.modified_at) + '"\n';
    toml += 'uuid = "' + m.id.uuid + '"\n';
    toml += 'fingerprint = "' + m.id.fingerprint + '"\n';
    if (isSome(m.spdx_id)) {
      toml += 'spdx_id = "' + m.spdx_id + '"\n';
    }

    if (m.authors && m.authors.length) {
      toml += '\n[authors]\n';
      for (var a = 0; a < m.authors.length; a++) {
        toml += '[[authors.list]]\n';
        toml += 'name = "' + m.authors[a].name + '"\n';
        if (isSome(m.authors[a].email)) toml += 'email = "' + m.authors[a].email + '"\n';
        if (isSome(m.authors[a].organization)) toml += 'organization = "' + m.authors[a].organization + '"\n';
        if (isSome(m.authors[a].url)) toml += 'url = "' + m.authors[a].url + '"\n';
      }
    }

    if (m.tags && m.tags.length) {
      toml += 'tags = [';
      for (var t = 0; t < m.tags.length; t++) {
        if (t > 0) toml += ', ';
        toml += '"' + m.tags[t] + '"';
      }
      toml += ']\n';
    }

    toml += '\n';
    toml += '[hash]\n';
    toml += 'blake3 = "' + license.hash.blake3 + '"\n';
    toml += 'sha256 = "' + license.hash.sha256 + '"\n';
    toml += 'sha3_256 = "' + license.hash.sha3_256 + '"\n';

    return toml;
  }

  function yearLine(license) {
    var m = license.metadata;
    var createdYear = fmtYear(m.created_at);
    if (m.authors && m.authors.length) {
      var years = [];
      for (var i = 0; i < m.authors.length; i++) years.push(parseInt(createdYear, 10));
      var y = years.length ? years[0] : parseInt(createdYear, 10);
      for (var j = 0; j < years.length; j++) {
        if (years[j] < y) y = years[j];
      }
      var maxY = years.length ? years[0] : parseInt(fmtYear(m.modified_at), 10);
      for (var k = 0; k < years.length; k++) {
        if (years[k] > maxY) maxY = years[k];
      }
      if (y === maxY) return '' + y;
      return y + '-' + maxY;
    }
    return createdYear;
  }

  function genNotice(license) {
    var notice = '';
    notice += license.metadata.name + ' ' + license.metadata.version + '\n';
    notice += 'Copyright (c) ' + yearLine(license) + '\n';
    notice += '\n';
    notice += 'This software and associated documentation files (the "Software") are\n';
    notice += 'provided under the terms of the following license:\n\n';

    if (license.permissions && license.permissions.length) {
      notice += 'PERMISSIONS:\n';
      for (var i = 0; i < license.permissions.length; i++) {
        notice += '  - ' + license.permissions[i] + '\n';
      }
      notice += '\n';
    }

    if (license.conditions && license.conditions.length) {
      notice += 'CONDITIONS:\n';
      for (var i2 = 0; i2 < license.conditions.length; i2++) {
        notice += '  - ' + license.conditions[i2] + '\n';
      }
      notice += '\n';
    }

    if (license.restrictions && license.restrictions.length) {
      notice += 'RESTRICTIONS:\n';
      for (var i3 = 0; i3 < license.restrictions.length; i3++) {
        notice += '  - ' + license.restrictions[i3] + '\n';
      }
      notice += '\n';
    }

    if (license.warranty_disclaimer) {
      notice += license.warranty_disclaimer;
      notice += '\n';
    }

    return notice;
  }

  function genCopying(license) {
    var m = license.metadata;
    var copying = '';

    copying += rep(' ', 20) + m.name + rep(' ', 20) + '\n';
    copying += rep('=', 20 + utf8Len(m.name)) + '\n';
    copying += '\n';
    copying += 'Version: ' + m.version + '\n';
    copying += 'Category: ' + m.category + '\n';
    copying += '\n';

    if (m.authors && m.authors.length) {
      copying += 'Copyright holders:\n';
      for (var a = 0; a < m.authors.length; a++) {
        var org = isSome(m.authors[a].organization) ? ' (' + m.authors[a].organization + ')' : '';
        var email = isSome(m.authors[a].email) ? ' <' + m.authors[a].email + '>' : '';
        copying += '  ' + m.authors[a].name + org + email + '\n';
      }
      copying += '\n';
    }

    copying += 'This license governs the use, copying, distribution, and modification\n';
    copying += 'of the software.\n\n';

    if (license.preamble) {
      copying += 'PREAMBLE\n';
      copying += rep('-', 40) + '\n\n';
      copying += license.preamble + '\n\n';
    }

    var clauses = sortedClauses(license);
    for (var c = 0; c < clauses.length; c++) {
      copying += clauses[c].name.toUpperCase() + '\n';
      copying += rep('-', utf8Len(clauses[c].name)) + '\n';
      copying += clauses[c].content + '\n\n';
    }

    if (license.permissions && license.permissions.length) {
      copying += 'PERMISSIONS\n';
      copying += rep('-', 10) + '\n';
      for (var p = 0; p < license.permissions.length; p++) {
        copying += '  * ' + license.permissions[p] + '\n';
      }
      copying += '\n';
    }

    if (license.conditions && license.conditions.length) {
      copying += 'CONDITIONS\n';
      copying += rep('-', 10) + '\n';
      for (var co = 0; co < license.conditions.length; co++) {
        copying += '  * ' + license.conditions[co] + '\n';
      }
      copying += '\n';
    }

    if (license.restrictions && license.restrictions.length) {
      copying += 'RESTRICTIONS\n';
      copying += rep('-', 11) + '\n';
      for (var r = 0; r < license.restrictions.length; r++) {
        copying += '  * ' + license.restrictions[r] + '\n';
      }
      copying += '\n';
    }

    if (isSome(license.patent_grant)) {
      copying += 'PATENT GRANT\n';
      copying += rep('-', 12) + '\n';
      copying += license.patent_grant + '\n\n';
    }

    if (license.warranty_disclaimer) {
      copying += 'DISCLAIMER\n';
      copying += rep('-', 10) + '\n';
      copying += license.warranty_disclaimer + '\n\n';
    }

    copying += 'END OF LICENSE\n';

    return copying;
  }

  function genSummary(license) {
    var m = license.metadata;
    var summary = '';

    summary += 'License: ' + m.name + ' v' + m.version + '\n';
    summary += 'Category: ' + m.category + '\n';
    if (isSome(m.spdx_id)) summary += 'SPDX: ' + m.spdx_id + '\n';
    var authorNames = [];
    for (var a = 0; a < (m.authors || []).length; a++) authorNames.push(m.authors[a].name);
    summary += 'Authors: ' + authorNames.join(', ') + '\n';
    summary += 'Clauses: ' + (license.clauses || []).length + '\n';
    summary += 'Permissions: ' + (license.permissions || []).length + '\n';
    summary += 'Conditions: ' + (license.conditions || []).length + '\n';
    summary += 'Restrictions: ' + (license.restrictions || []).length + '\n';
    summary += 'Has patent grant: ' + (isSome(license.patent_grant) ? 'true' : 'false') + '\n';
    summary += 'Has warranty disclaimer: ' + (license.warranty_disclaimer ? 'true' : 'false') + '\n';
    summary += 'Blake3: ' + license.hash.blake3 + '\n';
    summary += 'Full text length: ' + utf8Len(license.full_text) + ' chars\n';

    return summary;
  }

  function genAiSummary(license) {
    var m = license.metadata;
    var ai = '';

    ai += '# AI Summary: ' + m.name + ' v' + m.version + '\n\n';
    ai += '**Category:** ' + m.category + '\n\n';

    if (m.description && m.description !== '') {
      ai += '**Description:** ' + m.description + '\n\n';
    }

    if (license.permissions && license.permissions.length) {
      ai += '**This license permits:**\n';
      for (var p = 0; p < license.permissions.length; p++) {
        ai += '- ' + license.permissions[p] + '\n';
      }
      ai += '\n';
    }

    if (license.conditions && license.conditions.length) {
      ai += '**This license requires:**\n';
      for (var c = 0; c < license.conditions.length; c++) {
        ai += '- ' + license.conditions[c] + '\n';
      }
      ai += '\n';
    }

    if (license.restrictions && license.restrictions.length) {
      ai += '**This license restricts:**\n';
      for (var r = 0; r < license.restrictions.length; r++) {
        ai += '- ' + license.restrictions[r] + '\n';
      }
      ai += '\n';
    }

    if (isSome(license.patent_grant)) {
      ai += '**Patent grant:** ' + license.patent_grant + '\n\n';
    }

    if (license.warranty_disclaimer) {
      ai += '**Warranty disclaimer:** ' + license.warranty_disclaimer + '\n\n';
    }

    var cc = categoryCounts(license.clauses);
    ai += '**Clause breakdown:**\n';
    for (var i = 0; i < cc.order.length; i++) {
      ai += '- ' + cc.order[i] + ': ' + cc.counts[cc.order[i]] + '\n';
    }

    ai += '\n**License hash (Blake3):** `' + license.hash.blake3 + '`\n';

    return ai;
  }

  function generateAll(license) {
    return {
      plain_text: license.full_text,
      markdown: genMarkdown(license),
      html: genHtml(license),
      json: exportToJson(license),
      yaml: genYaml(license),
      toml: genToml(license),
      spdx: toSpdxHeader(license),
      notice: genNotice(license),
      copying: genCopying(license),
      summary: genSummary(license),
      ai_summary: genAiSummary(license)
    };
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  NS.Export = NS.Export || {};
  NS.Export.exportToText = exportToText;
  NS.Export.exportToMarkdown = exportToMarkdown;
  NS.Export.exportToHtml = exportToHtml;
  NS.Export.renderMarkdownToHtml = renderMarkdownToHtml;
  NS.Export.exportToJson = exportToJson;
  NS.Export.exportToYaml = exportToYaml;
  NS.Export.exportToToml = exportToToml;
  NS.Export.exportToXml = exportToXml;
  NS.Export.toSpdxHeader = toSpdxHeader;
  NS.Export.exportToSpdx = function (license) {
    return spdxJsonDoc(license);
  };
  NS.Export.exportCycloneDX = exportCycloneDX;
  NS.Export.generateCycloneDxSbom = generateCycloneDxSbom;
  NS.Export.exportNotice = exportNotice;
  NS.Export.exportCopying = exportCopying;
  NS.Export.exportSummary = exportSummary;
  NS.Export.exportAiSummary = exportAiSummary;
  NS.Export.generateAll = generateAll;
  NS.Export.spdxLicenseId = spdxLicenseId;
  NS.Export.authorLine = authorLine;
  NS.Export.utf8Len = utf8Len;
})();