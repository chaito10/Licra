// Ported from src/compatibility.rs (GLG Rust -> JS)
(function () {
  if (typeof window !== 'undefined') window.GLGEngine = window.GLGEngine || {};
  var NS = (typeof window !== 'undefined') ? window.GLGEngine :
           (typeof self !== 'undefined' ? self : globalThis).GLGEngine = (typeof self !== 'undefined' ? self : globalThis).GLGEngine || {};

  var data = null;
  var ROOT = (typeof window !== 'undefined') ? window : (typeof self !== 'undefined' ? self : globalThis);

  function load() {
    if (ROOT.GLG_DATA && ROOT.GLG_DATA.compatibility) {
      data = ROOT.GLG_DATA.compatibility;
    } else {
      data = { matrix: {}, upgrade_paths: {} };
    }
    return data;
  }

  function matrixData() {
    if (!data) load();
    return data.matrix;
  }

  function upgradeData() {
    if (!data) load();
    return data.upgrade_paths;
  }

  function areCompatible(a, b) {
    var m = matrixData();
    if (m[a] && Object.prototype.hasOwnProperty.call(m[a], b)) {
      return m[a][b];
    }
    if (m[b] && Object.prototype.hasOwnProperty.call(m[b], a)) {
      return m[b][a];
    }
    return false;
  }

  function getCompatibleLicenses(license) {
    var m = matrixData();
    var row = m[license];
    if (!row) return [];
    var out = [];
    for (var k in row) {
      if (Object.prototype.hasOwnProperty.call(row, k) && row[k] === true) {
        out.push(k);
      }
    }
    return out;
  }

  function getIncompatibleLicenses(license) {
    var m = matrixData();
    var row = m[license];
    if (!row) return [];
    var out = [];
    for (var k in row) {
      if (Object.prototype.hasOwnProperty.call(row, k) && row[k] === false) {
        out.push(k);
      }
    }
    return out;
  }

  function findUpgrade(license) {
    var up = upgradeData();
    if (Object.prototype.hasOwnProperty.call(up, license)) {
      return up[license].slice();
    }
    return [];
  }

  function explain(a, b) {
    var compatible = areCompatible(a, b);
    var reason = compatible
      ? a + " and " + b + " are compatible"
      : a + " and " + b + " are incompatible";
    var suggestions = [];

    if (!compatible) {
      var upgradesA = upgradeData()[a] || [];
      for (var i = 0; i < upgradesA.length; i++) {
        var upA = upgradesA[i];
        if (areCompatible(upA, b)) {
          suggestions.push("Upgrade " + a + " to " + upA + " for compatibility with " + b);
        }
      }

      var upgradesB = upgradeData()[b] || [];
      for (var j = 0; j < upgradesB.length; j++) {
        var upB = upgradesB[j];
        if (areCompatible(a, upB)) {
          suggestions.push("Upgrade " + b + " to " + upB + " for compatibility with " + a);
        }
      }

      var compA = getCompatibleLicenses(a);
      var compB = getCompatibleLicenses(b);
      var common = [];
      for (var k = 0; k < compA.length; k++) {
        if (compB.indexOf(compA[k]) !== -1) {
          common.push(compA[k]);
        }
      }

      if (common.length) {
        suggestions.push("Consider using one of these mutually compatible licenses: " + common.join(", "));
      }
    }

    return {
      license_a: a,
      license_b: b,
      compatible: compatible,
      reason: reason,
      suggestions: suggestions
    };
  }

  function checkBatch(licenses) {
    var pairwise_results = [];
    var conflicts = [];
    var all_suggestions = [];

    for (var i = 0; i < licenses.length; i++) {
      for (var j = i + 1; j < licenses.length; j++) {
        var result = explain(licenses[i], licenses[j]);
        if (!result.compatible) {
          conflicts.push([licenses[i], licenses[j]]);
          for (var s = 0; s < result.suggestions.length; s++) {
            if (all_suggestions.indexOf(result.suggestions[s]) === -1) {
              all_suggestions.push(result.suggestions[s]);
            }
          }
        }
        pairwise_results.push(result);
      }
    }

    var overall_compatible = conflicts.length === 0;

    if (!overall_compatible) {
      var parts = [];
      for (var c = 0; c < conflicts.length; c++) {
        parts.push(conflicts[c][0] + " <-> " + conflicts[c][1]);
      }
      var msg = "Found " + conflicts.length + " incompatible pair(s): " + parts.join(", ");
      if (all_suggestions.indexOf(msg) === -1) {
        all_suggestions.push(msg);
      }
    }

    return {
      licenses: licenses.slice(),
      pairwise_results: pairwise_results,
      overall_compatible: overall_compatible,
      conflicts: conflicts,
      suggestions: all_suggestions
    };
  }

  function allLicenseIds() {
    return Object.keys(matrixData()).sort();
  }

  function getMatrixDisplay() {
    var ids = allLicenseIds();
    var display = [];
    var header = [""];
    for (var h = 0; h < ids.length; h++) {
      header.push(ids[h]);
    }
    display.push(header);

    for (var i = 0; i < ids.length; i++) {
      var row = [ids[i]];
      for (var j = 0; j < ids.length; j++) {
        row.push(areCompatible(ids[i], ids[j]) ? "Y" : "N");
      }
      display.push(row);
    }
    return display;
  }

  NS.Compat = {
    areCompatible: areCompatible,
    getCompatibleLicenses: getCompatibleLicenses,
    getIncompatibleLicenses: getIncompatibleLicenses,
    findUpgrade: findUpgrade,
    checkBatch: checkBatch,
    explain: explain,
    allLicenseIds: allLicenseIds,
    getMatrixDisplay: getMatrixDisplay
  };
})();