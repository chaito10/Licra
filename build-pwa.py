"""Build single-file static PWA from src/html.rs, static/style.css, static/app.js
Usage: python build-pwa.py
Output: static/index.html
"""
import base64, json, os

base = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(base, 'static', 'style.css'), 'r') as f:
    css = f.read()

with open(os.path.join(base, 'src', 'html.rs'), 'r') as f:
    html_rs = f.read()

body_start = html_rs.index('<body>') + len('<body>')
body_end = html_rs.index('</body>')
body_html = html_rs[body_start:body_end].strip()

manifest = json.dumps({
    'name': 'Granular License Generator',
    'short_name': 'GLG',
    'start_url': '.',
    'display': 'standalone',
    'background_color': '#0f1117',
    'theme_color': '#6366f1',
    'icons': [{
        'src': "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><rect width='512' height='512' rx='64' fill='%236366f1'/><text x='256' y='350' font-size='280' text-anchor='middle' fill='white' font-family='monospace' font-weight='bold'>G</text></svg>",
        'sizes': '512x512',
        'type': 'image/svg+xml'
    }]
}, separators=(',', ':'))
manifest_b64 = base64.b64encode(manifest.encode()).decode()

sw_code = "const CACHE='glg-pwa-v1';\nself.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./'])));self.skipWaiting()});\nself.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});\nself.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))});\n"
sw_b64 = base64.b64encode(sw_code.encode()).decode()

out_path = os.path.join(base, 'static', 'index.html')
with open(out_path, 'w', encoding='utf-8') as f:
    f.write('<!DOCTYPE html>\n<html lang="en" data-theme="dark">\n<head>\n')
    f.write('    <meta charset="UTF-8">\n')
    f.write('    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n')
    f.write('    <meta name="theme-color" content="#0f1117">\n')
    f.write('    <meta name="description" content="Granular License Generator - Create customized software licenses offline">\n')
    f.write('    <meta name="apple-mobile-web-app-capable" content="yes">\n')
    f.write('    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">\n')
    f.write('    <title>GLG - Granular License Generator</title>\n')
    f.write("    <link rel=\"icon\" type=\"image/svg+xml\" href=\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%236366f1'/><text x='16' y='23' font-size='20' text-anchor='middle' fill='white' font-family='monospace' font-weight='bold'>G</text></svg>\">\n")
    f.write(f'    <link rel="manifest" href="data:application/json;base64,{manifest_b64}">\n')
    f.write('    <style>\n')
    f.write(css)
    f.write('\n    </style>\n')
    f.write('</head>\n<body>\n')
    f.write(body_html)
    f.write('\n')

    # Read and patch app.js
    with open(os.path.join(base, 'static', 'app.js'), 'r') as jsfile:
        js = jsfile.read()

    # Stub out API calls
    js = js.replace(
        "function apiGet(path, params) {\n        var url = path;\n        if (params) {\n            var qs = Object.keys(params).map(function(k) {\n                return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);\n            }).join('&');\n            url += '?' + qs;\n        }\n        return fetch(url)\n            .then(function(resp) {\n                if (!resp.ok) throw new Error('HTTP ' + resp.status);\n                return resp.json();\n            })\n            .catch(function(e) {\n                toast('API error: ' + e.message, 'error');\n                return null;\n            });\n    }",
        "function apiGet(path, params) { return Promise.resolve(null); }"
    )
    js = js.replace(
        "function apiPost(path, body) {\n        return fetch(path, {\n            method: 'POST',\n            headers: { 'Content-Type': 'application/json' },\n            body: JSON.stringify(body),\n        })\n        .then(function(resp) {\n            if (!resp.ok) {\n                return resp.json().then(function(errData) {\n                    throw new Error(errData && errData.error ? errData.error : 'HTTP ' + resp.status);\n                }).catch(function(e) {\n                    if (e.message && e.message.indexOf('HTTP') !== -1) throw e;\n                    throw new Error('HTTP ' + resp.status);\n                });\n            }\n            return resp.json();\n        })\n        .catch(function(e) {\n            toast('API error: ' + e.message, 'error');\n            return null;\n        });\n    }",
        "function apiPost(path, body) { return Promise.resolve(null); }"
    )
    js = js.replace(
        "    function checkHealth() {\n        apiGet('/api/health').then(function(data) {\n            if (data && data.status === 'healthy') {\n                console.log('[GLG] Backend connected.');\n            }\n        });\n    }",
        "    function checkHealth() {}"
    )
    js = js.replace(
        """    function loadQuestions() {
        apiGet('/api/questionnaire').then(function(data) {
            if (data && data.questions) {
                state.questions = data.questions;
            } else {
                state.questions = getDefaultQuestions();
                toast('Using built-in questionnaire.', 'info');
            }
            renderSidebar();
            renderWizardStep(state.currentStep);
            updateButtons();
            updateStepIndicator();
            updateProgress();
            updatePreview();
        });
    }""",
        """    function loadQuestions() {
        state.questions = getDefaultQuestions();
        renderSidebar();
        renderWizardStep(state.currentStep);
        updateButtons();
        updateStepIndicator();
        updateProgress();
        updatePreview();
    }"""
    )
    js = js.replace(
        """    function generateLicense() {
        if (state.generating) return;
        state.generating = true;
        var genBtn = $('#btn-generate');
        genBtn.disabled = true;
        genBtn.innerHTML = '<span class="loading-spinner"></span> Generating...';

        var answersPayload = {};
        Object.keys(state.answers).forEach(function(k) {
            var v = state.answers[k];
            var q = (state.questions || []).find(function(q) { return q.id === k; });
            var qtype = q ? q.type : 'text';
            if (qtype === 'checkbox' || qtype === 'multi-select') {
                answersPayload[k] = { type: 'multi_choice', values: Array.isArray(v) ? v : [] };
            } else if (qtype === 'radio' || qtype === 'select') {
                answersPayload[k] = { type: 'choice', value: v || '' };
            } else {
                answersPayload[k] = { type: 'text', value: v || '' };
            }
        });

        var copyrightHolder = state.answers['copyright_holder'] || state.answers['project_name'] || 'Unknown';
        var year = new Date().getFullYear();

        var request = {
            project_name: state.answers['project_name'] || 'Untitled',
            copyright_holders: [{ name: copyrightHolder }],
            year: year,
            answers: Object.keys(answersPayload).map(function(k) {
                return { question_id: k, value: answersPayload[k] };
            }),
            custom_clauses: [],
        };

        apiPost('/api/compile', request).then(function(data) {
            if (data && data.license) {
                var licObj = data.license;
                if (typeof licObj === 'string') {
                    state.licenseText = licObj;
                } else if (licObj.full_text) {
                    state.licenseText = licObj.full_text;
                } else if (licObj.text) {
                    state.licenseText = licObj.text;
                } else {
                    state.licenseText = JSON.stringify(licObj, null, 2);
                }
                updatePreview();
                toast('License generated successfully!', 'success');
                $('#btn-export').disabled = false;
            } else if (data && data.error) {
                toast('Generation failed: ' + data.error, 'error');
            }
            state.generating = false;
            genBtn.disabled = false;
            genBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Generate License';
        });
    }""",
        """    function generateLicense() {
        if (state.generating) return;
        state.generating = true;
        var genBtn = $('#btn-generate');
        genBtn.disabled = true;
        genBtn.innerHTML = '<span class="loading-spinner"></span> Generating...';
        setTimeout(function() {
            state.licenseText = generateLicenseLocal(state.answers);
            updatePreview();
            toast('License generated successfully!', 'success');
            $('#btn-export').disabled = false;
            state.generating = false;
            genBtn.disabled = false;
            genBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Generate License';
        }, 300);
    }"""
    )
    js = js.replace(
        """    function validateLicense() {
        if (!state.licenseText) {
            toast('No license to validate. Generate one first.', 'warning');
            return;
        }
        apiPost('/api/validate', { license: state.licenseText }).then(function(data) {
            if (data) {
                if (data.is_valid !== undefined ? data.is_valid : data.valid) {
                    toast('License validation passed! Score: ' + (data.score || 'N/A'), 'success');
                } else {
                    var issues = data.errors || data.issues || [];
                    toast('Validation issues: ' + (issues.length ? issues.join('; ') : 'Unknown issues'), 'warning');
                }
            }
        });
    }""",
        """    function validateLicense() {
        if (!state.licenseText) {
            toast('No license to validate. Generate one first.', 'warning');
            return;
        }
        var vr = validateLicenseLocal(state.licenseText);
        if (vr.valid) { toast('License validation passed! Score: ' + vr.score, 'success'); }
        else { toast('Issues: ' + vr.issues.join('; '), 'warning'); }
    }"""
    )
    js = js.replace(
        """    function explainLicense() {
        if (!state.licenseText) {
            toast('No license to explain. Generate one first.', 'warning');
            return;
        }
        apiPost('/api/explain', { license_text: state.licenseText }).then(function(data) {
            if (data && (data.content || data.explanation)) {
                showModal('AI License Explanation',
                    '<div style="white-space:pre-wrap;line-height:1.7;">' + escapeHtml(data.content || data.explanation) + '</div>',
                    [{ label: 'Close', cls: 'btn-primary' }]
                );
            } else {
                toast('Explanation not available.', 'info');
            }
        });
    }""",
        """    function explainLicense() {
        if (!state.licenseText) {
            toast('No license to explain. Generate one first.', 'warning');
            return;
        }
        var exp = explainLicenseLocal(state.licenseText);
        showModal('License Explanation',
            '<div style="white-space:pre-wrap;line-height:1.7;">' + escapeHtml(exp) + '</div>',
            [{ label: 'Close', cls: 'btn-primary' }]
        );
    }"""
    )

    # Write script block with local functions + patched app.js
    f.write('    <script>\n')
    f.write("('use strict');\n")
    f.write(r"""
function generateLicenseLocal(answers) {
    var a = answers, lines = [], year = new Date().getFullYear(), sec = 1;
    var proj = a['project_name'] || 'Untitled';
    var holder = a['copyright_holder'] || proj;
    lines.push('GRANULAR LICENSE');
    lines.push('================');
    lines.push('');
    lines.push('Project: ' + proj);
    lines.push('Copyright (c) ' + year + ' ' + holder);
    lines.push('');
    if (a['license_type']) { lines.push(sec + '. LICENSE GRANT'); lines.push('   Licensed under ' + a['license_type'] + ' terms.'); lines.push(''); sec++; }
    if (a['ownership_type']) { lines.push(sec + '. OWNERSHIP'); lines.push('   Ownership model: ' + a['ownership_type'] + '.'); lines.push(''); sec++; }
    if (a['commercial_use']) { lines.push(sec + '. COMMERCIAL USE'); lines.push('   Commercial use: ' + a['commercial_use'] + '.'); lines.push(''); sec++; }
    if (a['patent_grant']) { lines.push(sec + '. PATENT GRANT'); lines.push('   ' + a['patent_grant'] + '.'); lines.push(''); sec++; }
    if (a['source_disclosure']) { lines.push(sec + '. SOURCE CODE'); lines.push('   Source disclosure: ' + a['source_disclosure'] + '.'); lines.push(''); sec++; }
    if (a['ai_usage']) { lines.push(sec + '. AI & DATA USAGE'); lines.push('   ' + a['ai_usage'] + '.'); lines.push(''); sec++; }
    if (a['modification_rights']) { lines.push(sec + '. MODIFICATION'); lines.push('   ' + a['modification_rights'] + '.'); lines.push(''); sec++; }
    if (a['distribution_scope'] && Array.isArray(a['distribution_scope'])) { lines.push(sec + '. DISTRIBUTION'); lines.push('   Allowed: ' + a['distribution_scope'].join(', ') + '.'); lines.push(''); sec++; }
    if (a['compliance_jurisdiction'] && Array.isArray(a['compliance_jurisdiction'])) { lines.push(sec + '. JURISDICTION'); lines.push('   Applies to: ' + a['compliance_jurisdiction'].join(', ') + '.'); lines.push(''); sec++; }
    if (a['special_governing_law']) { lines.push(sec + '. GOVERNING LAW'); lines.push('   ' + a['special_governing_law'] + '.'); lines.push(''); sec++; }
    if (a['special_dispute_resolution']) { lines.push(sec + '. DISPUTE RESOLUTION'); lines.push('   ' + a['special_dispute_resolution'] + '.'); lines.push(''); sec++; }
    if (a['warranty_disclaimer']) { lines.push(sec + '. WARRANTY DISCLAIMER'); lines.push('   ' + a['warranty_disclaimer'] + '.'); lines.push(''); sec++; }
    if (a['liability_cap']) { lines.push(sec + '. LIABILITY'); lines.push('   Max liability: ' + a['liability_cap'] + '.'); lines.push(''); sec++; }
    if (a['special_survival']) { lines.push(sec + '. SURVIVAL'); lines.push('   Obligations survive for: ' + a['special_survival'] + '.'); lines.push(''); sec++; }
    if (a['custom_terms']) { lines.push(sec + '. CUSTOM TERMS'); lines.push('   ' + a['custom_terms']); lines.push(''); sec++; }
    lines.push('---');
    lines.push('Generated by GLG (Granular License Generator) PWA');
    lines.push('Fingerprint: ' + simpleHash(lines.join('\n')));
    return lines.join('\n');
}
function simpleHash(s) { var h = 0; for (var i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h = h & h; } return Math.abs(h).toString(16).padStart(8, '0'); }
function validateLicenseLocal(text) {
    var issues = [];
    if (!text || text.trim().length < 20) issues.push('License text is too short');
    if (text.indexOf('GRANULAR LICENSE') === -1) issues.push('Missing license header');
    if (text.indexOf('Copyright') === -1) issues.push('Missing copyright notice');
    if (text.indexOf('WARRANTY') === -1 && text.indexOf('DISCLAIMER') === -1) issues.push('No warranty disclaimer found');
    return { valid: issues.length === 0, score: Math.max(0, 100 - issues.length * 25), issues: issues };
}
function explainLicenseLocal(text) {
    var lines = text.split('\n').filter(function(l) { return l.trim().length > 0; });
    var e = 'License Analysis:\n\n';
    e += 'This license contains ' + lines.length + ' lines of text.\n\n';
    if (text.indexOf('COMMERCIAL') !== -1) e += '- Contains commercial use terms\n';
    if (text.indexOf('PATENT') !== -1) e += '- Contains patent grant provisions\n';
    if (text.indexOf('SOURCE CODE') !== -1) e += '- Specifies source code disclosure\n';
    if (text.indexOf('MODIFICATION') !== -1) e += '- Addresses modification rights\n';
    if (text.indexOf('AI') !== -1) e += '- Includes AI/data usage provisions\n';
    if (text.indexOf('WARRANTY') !== -1 || text.indexOf('DISCLAIMER') !== -1) e += '- Includes warranty disclaimer\n';
    if (text.indexOf('LIABILITY') !== -1) e += '- Specifies liability limitations\n';
    if (text.indexOf('JURISDICTION') !== -1) e += '- Defines applicable jurisdictions\n';
    e += '\nGenerated entirely client-side. No data leaves your browser.';
    return e;
}
""")
    f.write(js)
    f.write('\n    </script>\n')
    f.write(f'    <script>\nif(\'serviceWorker\' in navigator){{var swCode=atob(\'{sw_b64}\');var swBlob=new Blob([swCode],{{type:\'application/javascript\'}});navigator.serviceWorker.register(URL.createObjectURL(swBlob)).catch(function(){{}});}}</script>\n')
    f.write('</body>\n</html>\n')

size = os.path.getsize(out_path)
print(f'Built: {out_path}')
print(f'Size: {size / 1024:.1f} KB')
