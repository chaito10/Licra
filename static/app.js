(function() {
    'use strict';

    var GLG = window.GLG || {};

    var STEPS = [
        { id: 'intro',     label: 'Introduction',    icon: '01' },
        { id: 'ownership', label: 'Ownership',       icon: '02' },
        { id: 'copyright', label: 'Copyright',       icon: '03' },
        { id: 'commercial',label: 'Commercial Use',  icon: '04' },
        { id: 'patent',    label: 'Patent',          icon: '05' },
        { id: 'source',    label: 'Source Code',     icon: '06' },
        { id: 'distribution',label:'Distribution',   icon: '07' },
        { id: 'modification',label:'Modification',   icon: '08' },
        { id: 'aidata',    label: 'AI & Data',       icon: '09' },
        { id: 'compliance',label: 'Compliance',      icon: '10' },
        { id: 'special',   label: 'Special Terms',   icon: '11' },
        { id: 'review',    label: 'Review',          icon: '12' },
        { id: 'export',    label: 'Export',          icon: '13' },
    ];

    var state = {
        currentStep: 0,
        answers: {},
        questions: null,
        licenseText: '',
        generating: false,
    };

    var $ = function(sel, ctx) { return (ctx || document).querySelector(sel); };
    var $$ = function(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

    function saveProgress() {
        try {
            localStorage.setItem('glg_state', JSON.stringify({
                currentStep: state.currentStep,
                answers: state.answers,
            }));
        } catch (e) { /* storage unavailable */ }
    }

    function loadProgress() {
        try {
            var raw = localStorage.getItem('glg_state');
            if (raw) {
                var data = JSON.parse(raw);
                if (data && typeof data.answers === 'object') {
                    state.answers = data.answers;
                    if (typeof data.currentStep === 'number' && data.currentStep < STEPS.length) {
                        state.currentStep = data.currentStep;
                    }
                }
            }
        } catch (e) { /* ignore */ }
    }

    function toast(message, type) {
        type = type || 'info';
        var container = $('#toast-container');
        var el = document.createElement('div');
        el.className = 'toast toast-' + type;
        var icons = {
            success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
            warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
            error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
            info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
        };
        el.innerHTML = '<span class="toast-icon">' + (icons[type] || icons.info) + '</span>' +
            '<span class="toast-message">' + escapeHtml(message) + '</span>' +
            '<button class="toast-close" aria-label="Close"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>';
        el.querySelector('.toast-close').addEventListener('click', function() { dismissToast(el); });
        container.appendChild(el);
        setTimeout(function() { dismissToast(el); }, 5000);
    }

    function dismissToast(el) {
        if (el.classList.contains('removing')) return;
        el.classList.add('removing');
        setTimeout(function() { el.remove(); }, 300);
    }

    function escapeHtml(str) {
        var d = document.createElement('div');
        d.appendChild(document.createTextNode(str));
        return d.innerHTML;
    }

    function showModal(title, bodyHtml, buttons) {
        $('#modal-title').textContent = title;
        $('#modal-body').innerHTML = bodyHtml;
        var footer = $('#modal-footer');
        footer.innerHTML = '';
        if (buttons && buttons.length) {
            buttons.forEach(function(b) {
                var btn = document.createElement('button');
                btn.className = 'btn ' + (b.cls || 'btn-secondary');
                btn.textContent = b.label;
                btn.addEventListener('click', function() {
                    if (b.action) b.action();
                    hideModal();
                });
                footer.appendChild(btn);
            });
        }
        $('#modal-overlay').classList.remove('hidden');
    }

    function hideModal() {
        $('#modal-overlay').classList.add('hidden');
    }

    function apiGet(path, params) {
        var url = path;
        if (params) {
            var qs = Object.keys(params).map(function(k) {
                return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
            }).join('&');
            url += '?' + qs;
        }
        return fetch(url)
            .then(function(resp) {
                if (!resp.ok) throw new Error('HTTP ' + resp.status);
                return resp.json();
            })
            .catch(function(e) {
                toast('API error: ' + e.message, 'error');
                return null;
            });
    }

    function apiPost(path, body) {
        return fetch(path, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })
        .then(function(resp) {
            if (!resp.ok) {
                return resp.json().then(function(errData) {
                    throw new Error(errData && errData.error ? errData.error : 'HTTP ' + resp.status);
                }).catch(function(e) {
                    if (e.message && e.message.indexOf('HTTP') !== -1) throw e;
                    throw new Error('HTTP ' + resp.status);
                });
            }
            return resp.json();
        })
        .catch(function(e) {
            toast('API error: ' + e.message, 'error');
            return null;
        });
    }

    function renderSidebar() {
        var list = $('#step-list');
        list.innerHTML = '';
        STEPS.forEach(function(step, i) {
            var li = document.createElement('li');
            li.className = 'step-item' + (i === state.currentStep ? ' active' : '') + (isStepCompleted(i) ? ' completed' : '');
            li.setAttribute('data-step', i);
            li.innerHTML = '<span class="step-number">' + (isStepCompleted(i) ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : step.icon) + '</span>' +
                '<span class="step-label">' + step.label + '</span>';
            li.addEventListener('click', function() { goToStep(i); });
            list.appendChild(li);
        });
    }

    function isStepCompleted(idx) {
        if (!state.questions) return false;
        var qs = getQuestionsForStep(idx);
        if (!qs || qs.length === 0) return true;
        return qs.every(function(q) {
            if (!q.required) return true;
            var val = state.answers[q.id];
            if (val === undefined || val === null || val === '') return false;
            if (Array.isArray(val) && val.length === 0) return false;
            return true;
        });
    }

    function updateProgress() {
        var total = STEPS.length;
        var completed = 0;
        for (var i = 0; i < total; i++) {
            if (isStepCompleted(i)) completed++;
        }
        var pct = Math.round((completed / total) * 100);
        $('#progress-pct').textContent = pct + '%';
        $('#progress-fill').style.width = pct + '%';
    }

    function updateStepIndicator() {
        var container = $('#step-indicator');
        container.innerHTML = '';
        STEPS.forEach(function(_, i) {
            var dot = document.createElement('div');
            dot.className = 'step-dot' + (i === state.currentStep ? ' active' : '') + (isStepCompleted(i) && i !== state.currentStep ? ' completed' : '');
            container.appendChild(dot);
        });
    }

    function updateButtons() {
        var prev = $('#btn-prev');
        var next = $('#btn-next');
        var gen = $('#btn-generate');
        var exp = $('#btn-export');
        prev.disabled = state.currentStep === 0;
        if (state.currentStep === STEPS.length - 1) {
            next.classList.add('hidden');
            gen.classList.remove('hidden');
        } else {
            next.classList.remove('hidden');
            gen.classList.add('hidden');
        }
        exp.disabled = !state.licenseText;
    }

    function getQuestionsForStep(stepIdx) {
        if (!state.questions) return [];
        var stepId = STEPS[stepIdx].id;
        return state.questions.filter(function(q) { return q.step === stepId; });
    }

    function renderWizardStep(stepIdx) {
        var container = $('#wizard-steps');
        container.innerHTML = '';
        var step = STEPS[stepIdx];
        var qs = getQuestionsForStep(stepIdx);

        var stepDiv = document.createElement('div');
        stepDiv.className = 'wizard-step active';

        var header = document.createElement('div');
        header.className = 'step-header';
        header.innerHTML = '<h2>' + step.label + '</h2>';
        if (stepIdx === 0) {
            header.innerHTML += '<p>Welcome to the Granular License Generator. Answer the questions below to create a customized software license tailored to your needs.</p>';
        } else {
            header.innerHTML += '<p>Step ' + (stepIdx + 1) + ' of ' + STEPS.length + '</p>';
        }
        stepDiv.appendChild(header);

        if (qs.length === 0 && stepIdx > 0 && stepIdx < STEPS.length - 2) {
            var empty = document.createElement('div');
            empty.className = 'question-card';
            empty.innerHTML = '<p class="text-muted text-sm">No questions for this step yet. Click Next to continue.</p>';
            stepDiv.appendChild(empty);
        }

        qs.forEach(function(q) {
            stepDiv.appendChild(renderQuestion(q));
        });

        if (stepIdx === STEPS.length - 2) {
            stepDiv.appendChild(renderReviewStep());
        }
        if (stepIdx === STEPS.length - 1) {
            stepDiv.appendChild(renderExportStep());
        }

        container.appendChild(stepDiv);
    }

    function renderQuestion(q) {
        var card = document.createElement('div');
        card.className = 'question-card';
        card.setAttribute('data-question-id', q.id);

        var labelHtml = '<div class="question-label">';
        if (q.required) labelHtml += '<span class="required">*</span>';
        labelHtml += '<span>' + escapeHtml(q.label) + '</span></div>';
        card.innerHTML = labelHtml;

        if (q.description) {
            var desc = document.createElement('div');
            desc.className = 'question-description';
            desc.textContent = q.description;
            card.appendChild(desc);
        }

        var inputWrap = document.createElement('div');

        switch (q.type) {
            case 'checkbox':
                inputWrap.appendChild(renderCheckboxGroup(q));
                break;
            case 'radio':
                inputWrap.appendChild(renderRadioGroup(q));
                break;
            case 'text':
                inputWrap.appendChild(renderTextInput(q));
                break;
            case 'textarea':
                inputWrap.appendChild(renderTextarea(q));
                break;
            case 'select':
                inputWrap.appendChild(renderSelect(q));
                break;
            case 'multi-select':
                inputWrap.appendChild(renderMultiSelect(q));
                break;
            case 'license-text':
                inputWrap.appendChild(renderLicenseTextarea(q));
                break;
            default:
                inputWrap.appendChild(renderTextInput(q));
        }
        card.appendChild(inputWrap);

        var errDiv = document.createElement('div');
        errDiv.className = 'question-error';
        errDiv.textContent = 'This field is required.';
        card.appendChild(errDiv);

        return card;
    }

    function renderTextInput(q) {
        var inp = document.createElement('input');
        inp.type = 'text';
        inp.className = 'form-input';
        inp.id = 'q-' + q.id;
        inp.placeholder = q.placeholder || '';
        if (state.answers[q.id] !== undefined) inp.value = state.answers[q.id];
        inp.addEventListener('input', function() {
            state.answers[q.id] = inp.value;
            saveProgress();
            updateProgress();
            clearQuestionError(q.id);
        });
        return inp;
    }

    function renderTextarea(q) {
        var ta = document.createElement('textarea');
        ta.className = 'form-textarea';
        ta.id = 'q-' + q.id;
        ta.placeholder = q.placeholder || '';
        if (state.answers[q.id] !== undefined) ta.value = state.answers[q.id];
        ta.addEventListener('input', function() {
            state.answers[q.id] = ta.value;
            saveProgress();
            updateProgress();
            clearQuestionError(q.id);
        });
        return ta;
    }

    function renderLicenseTextarea(q) {
        var ta = document.createElement('textarea');
        ta.className = 'form-textarea';
        ta.id = 'q-' + q.id;
        ta.rows = 8;
        ta.placeholder = q.placeholder || 'Paste or type your custom license text here...';
        ta.style.fontFamily = 'var(--font-mono)';
        ta.style.fontSize = '0.82rem';
        if (state.answers[q.id] !== undefined) ta.value = state.answers[q.id];
        ta.addEventListener('input', function() {
            state.answers[q.id] = ta.value;
            saveProgress();
            updateProgress();
            updatePreview();
            clearQuestionError(q.id);
        });
        return ta;
    }

    function renderSelect(q) {
        var sel = document.createElement('select');
        sel.className = 'form-select';
        sel.id = 'q-' + q.id;
        var placeholderOpt = document.createElement('option');
        placeholderOpt.value = '';
        placeholderOpt.textContent = q.placeholder || 'Select an option...';
        placeholderOpt.disabled = true;
        placeholderOpt.selected = !state.answers[q.id];
        sel.appendChild(placeholderOpt);
        if (q.options) {
            q.options.forEach(function(opt) {
                var o = document.createElement('option');
                o.value = typeof opt === 'string' ? opt : opt.value;
                o.textContent = typeof opt === 'string' ? opt : opt.label;
                if (state.answers[q.id] === o.value) o.selected = true;
                sel.appendChild(o);
            });
        }
        sel.addEventListener('change', function() {
            state.answers[q.id] = sel.value;
            saveProgress();
            updateProgress();
            clearQuestionError(q.id);
        });
        return sel;
    }

    function renderCheckboxGroup(q) {
        var group = document.createElement('div');
        group.className = 'checkbox-group';
        var selected = Array.isArray(state.answers[q.id]) ? state.answers[q.id] : [];
        if (q.options) {
            q.options.forEach(function(opt) {
                var val = typeof opt === 'string' ? opt : opt.value;
                var lbl = typeof opt === 'string' ? opt : opt.label;
                var item = document.createElement('label');
                item.className = 'checkbox-item' + (selected.indexOf(val) !== -1 ? ' selected' : '');
                item.innerHTML = '<input type="checkbox" value="' + escapeHtml(val) + '">' +
                    '<span class="check-indicator"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>' +
                    '<span class="check-label">' + escapeHtml(lbl) + '</span>';
                var inp = item.querySelector('input');
                inp.checked = selected.indexOf(val) !== -1;
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    inp.checked = !inp.checked;
                    item.classList.toggle('selected', inp.checked);
                    var arr = Array.isArray(state.answers[q.id]) ? state.answers[q.id].slice() : [];
                    if (inp.checked) {
                        if (arr.indexOf(val) === -1) arr.push(val);
                    } else {
                        arr = arr.filter(function(v) { return v !== val; });
                    }
                    state.answers[q.id] = arr;
                    saveProgress();
                    updateProgress();
                    clearQuestionError(q.id);
                });
                group.appendChild(item);
            });
        }
        return group;
    }

    function renderRadioGroup(q) {
        var group = document.createElement('div');
        group.className = 'radio-group';
        var current = state.answers[q.id] || '';
        if (q.options) {
            q.options.forEach(function(opt) {
                var val = typeof opt === 'string' ? opt : opt.value;
                var lbl = typeof opt === 'string' ? opt : opt.label;
                var item = document.createElement('label');
                item.className = 'radio-item' + (current === val ? ' selected' : '');
                item.innerHTML = '<input type="radio" name="' + q.id + '" value="' + escapeHtml(val) + '">' +
                    '<span class="check-indicator"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="6"/></svg></span>' +
                    '<span class="check-label">' + escapeHtml(lbl) + '</span>';
                var inp = item.querySelector('input');
                inp.checked = current === val;
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    $$('.radio-item', group).forEach(function(ri) { ri.classList.remove('selected'); ri.querySelector('input').checked = false; });
                    item.classList.add('selected');
                    inp.checked = true;
                    state.answers[q.id] = val;
                    saveProgress();
                    updateProgress();
                    clearQuestionError(q.id);
                });
                group.appendChild(item);
            });
        }
        return group;
    }

    function renderMultiSelect(q) {
        var wrap = document.createElement('div');
        wrap.className = 'multi-select';
        var selected = Array.isArray(state.answers[q.id]) ? state.answers[q.id] : [];
        if (q.options) {
            q.options.forEach(function(opt) {
                var val = typeof opt === 'string' ? opt : opt.value;
                var lbl = typeof opt === 'string' ? opt : opt.label;
                var chip = document.createElement('span');
                chip.className = 'chip' + (selected.indexOf(val) !== -1 ? ' selected' : '');
                chip.textContent = lbl;
                chip.addEventListener('click', function() {
                    chip.classList.toggle('selected');
                    var arr = Array.isArray(state.answers[q.id]) ? state.answers[q.id].slice() : [];
                    if (chip.classList.contains('selected')) {
                        if (arr.indexOf(val) === -1) arr.push(val);
                    } else {
                        arr = arr.filter(function(v) { return v !== val; });
                    }
                    state.answers[q.id] = arr;
                    saveProgress();
                    updateProgress();
                    clearQuestionError(q.id);
                });
                wrap.appendChild(chip);
            });
        }
        return wrap;
    }

    function renderReviewStep() {
        var card = document.createElement('div');
        card.className = 'question-card';
        var html = '<div class="question-label"><span>Review Your Answers</span></div>';
        html += '<div class="question-description">Please review all your selections before generating the license.</div>';
        html += '<div id="review-summary" class="mt-2"></div>';
        card.innerHTML = html;
        setTimeout(populateReview, 0);
        return card;
    }

    function populateReview() {
        var container = $('#review-summary');
        if (!container || !state.questions) return;
        var html = '<table class="data-table"><thead><tr><th>Category</th><th>Setting</th><th>Value</th></tr></thead><tbody>';
        STEPS.forEach(function(step) {
            var qs = getQuestionsForStep(STEPS.indexOf(step));
            qs.forEach(function(q) {
                var val = state.answers[q.id];
                if (val === undefined || val === null || val === '') val = '<span class="text-muted">Not set</span>';
                else if (Array.isArray(val)) val = val.length ? val.join(', ') : '<span class="text-muted">None</span>';
                else val = escapeHtml(String(val));
                html += '<tr><td>' + escapeHtml(step.label) + '</td><td>' + escapeHtml(q.label) + '</td><td>' + val + '</td></tr>';
            });
        });
        html += '</tbody></table>';
        container.innerHTML = html;
    }

    function renderExportStep() {
        var card = document.createElement('div');
        card.className = 'question-card';
        var html = '<div class="question-label"><span>Export Your License</span></div>';
        html += '<div class="question-description">Your license has been generated. Choose an export format below.</div>';
        html += '<div class="mt-2" style="display:flex;gap:10px;flex-wrap:wrap;">';
        html += '<button class="btn btn-primary" onclick="window.__glgExport(\'text\')">Plain Text (.txt)</button>';
        html += '<button class="btn btn-secondary" onclick="window.__glgExport(\'markdown\')">Markdown (.md)</button>';
        html += '<button class="btn btn-secondary" onclick="window.__glgExport(\'html\')">HTML (.html)</button>';
        html += '<button class="btn btn-secondary" onclick="window.__glgExport(\'json\')">JSON (.json)</button>';
        html += '</div>';
        card.innerHTML = html;
        return card;
    }

    function clearQuestionError(qid) {
        var card = document.querySelector('[data-question-id="' + qid + '"]');
        if (card) card.classList.remove('has-error');
    }

    function validateCurrentStep() {
        var qs = getQuestionsForStep(state.currentStep);
        var valid = true;
        qs.forEach(function(q) {
            if (!q.required) return;
            var val = state.answers[q.id];
            var isEmpty = val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0);
            var card = document.querySelector('[data-question-id="' + q.id + '"]');
            if (isEmpty) {
                valid = false;
                if (card) card.classList.add('has-error');
            } else {
                if (card) card.classList.remove('has-error');
            }
        });
        if (!valid) {
            toast('Please fill in all required fields.', 'warning');
        }
        return valid;
    }

    function goToStep(idx) {
        if (idx < 0 || idx >= STEPS.length) return;
        state.currentStep = idx;
        saveProgress();
        renderSidebar();
        renderWizardStep(idx);
        updateButtons();
        updateStepIndicator();
        updateProgress();
        updatePreview();
        $('#main-scroll').scrollTop = 0;
    }

    function updatePreview() {
        var content = $('#preview-content');
        if (state.licenseText) {
            content.innerHTML = '<div class="license-text">' + escapeHtml(state.licenseText) + '</div>';
            return;
        }
        var hasAny = Object.keys(state.answers).some(function(k) {
            var v = state.answers[k];
            return v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0);
        });
        if (hasAny) {
            var preview = generatePreviewText();
            if (preview) {
                content.innerHTML = '<div class="license-text">' + escapeHtml(preview) + '</div>';
                return;
            }
        }
        content.innerHTML = '<div class="preview-placeholder">' +
            '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" opacity="0.3"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' +
            '<p>License preview will appear here as you answer questions.</p></div>';
    }

    function generatePreviewText() {
        var a = state.answers;
        var sections = [];
        sections.push('GRANULAR LICENSE');
        sections.push('================\n');
        if (a['project_name']) sections.push('Project: ' + a['project_name']);
        if (a['copyright_holder']) sections.push('Copyright (c) ' + new Date().getFullYear() + ' ' + a['copyright_holder']);
        sections.push('');

        if (a['license_type']) {
            sections.push('1. LICENSE GRANT');
            sections.push('   This software is licensed under the ' + a['license_type'] + ' terms.');
            sections.push('');
        }
        if (a['commercial_use']) {
            sections.push('2. COMMERCIAL USE');
            sections.push('   Commercial use is ' + a['commercial_use'] + '.');
            sections.push('');
        }
        if (a['patent_grant']) {
            sections.push('3. PATENT GRANT');
            sections.push('   ' + a['patent_grant']);
            sections.push('');
        }
        if (a['source_disclosure']) {
            sections.push('4. SOURCE CODE');
            sections.push('   Source code disclosure: ' + a['source_disclosure']);
            sections.push('');
        }
        if (a['ai_usage']) {
            sections.push('5. AI & DATA USAGE');
            sections.push('   ' + a['ai_usage']);
            sections.push('');
        }
        if (a['modification_rights']) {
            sections.push('6. MODIFICATION');
            sections.push('   ' + a['modification_rights']);
            sections.push('');
        }
        if (a['warranty_disclaimer']) {
            sections.push('DISCLAIMER: ' + a['warranty_disclaimer']);
        }
        return sections.join('\n');
    }

    function generateLicense() {
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
    }

    function validateLicense() {
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
    }

    function explainLicense() {
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
    }

    function exportLicense(format) {
        if (!state.licenseText) {
            toast('No license to export.', 'warning');
            return;
        }
        var blob, filename, mime;
        switch (format) {
            case 'json':
                blob = new Blob([JSON.stringify({ answers: state.answers, license: state.licenseText }, null, 2)], { type: 'application/json' });
                filename = 'license.json';
                break;
            case 'markdown':
                var md = '# License\n\n' + state.licenseText;
                blob = new Blob([md], { type: 'text/markdown' });
                filename = 'LICENSE.md';
                break;
            case 'html':
                var h = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>License</title><style>body{font-family:sans-serif;max-width:800px;margin:40px auto;padding:20px;line-height:1.7;color:#333;}pre{background:#f5f5f5;padding:16px;border-radius:6px;overflow-x:auto;}</style></head><body><pre>' + escapeHtml(state.licenseText) + '</pre></body></html>';
                blob = new Blob([h], { type: 'text/html' });
                filename = 'license.html';
                break;
            default:
                blob = new Blob([state.licenseText], { type: 'text/plain' });
                filename = 'LICENSE.txt';
        }
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast('Exported as ' + filename, 'success');
    }

    function searchLocal(query) {
        var results = $('#search-results');
        if (!state.questions) {
            results.innerHTML = '<div class="search-no-results">No data loaded yet.</div>';
            results.classList.remove('hidden');
            return;
        }
        var matches = state.questions.filter(function(q) {
            return q.label.toLowerCase().indexOf(query) !== -1 ||
                   (q.description && q.description.toLowerCase().indexOf(query) !== -1) ||
                   q.id.toLowerCase().indexOf(query) !== -1;
        });
        if (matches.length === 0) {
            results.innerHTML = '<div class="search-no-results">No results found.</div>';
        } else {
            results.innerHTML = '';
            matches.forEach(function(q) {
                var stepName = STEPS.find(function(s) { return s.id === q.step; });
                var div = document.createElement('div');
                div.className = 'search-result-item';
                div.innerHTML = '<div class="sr-label">' + escapeHtml(q.label) + '</div>' +
                    '<div class="sr-step">' + (stepName ? stepName.label : q.step) + '</div>';
                div.addEventListener('click', function() {
                    var idx = STEPS.findIndex(function(s) { return s.id === q.step; });
                    if (idx !== -1) {
                        goToStep(idx);
                        setTimeout(function() {
                            var card = document.querySelector('[data-question-id="' + q.id + '"]');
                            if (card) {
                                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                card.style.boxShadow = '0 0 0 2px var(--accent)';
                                setTimeout(function() { card.style.boxShadow = ''; }, 2000);
                            }
                        }, 100);
                    }
                    results.classList.add('hidden');
                    $('#search-input').value = '';
                });
                results.appendChild(div);
            });
        }
        results.classList.remove('hidden');
    }

    function setupSearch() {
        var input = $('#search-input');
        var results = $('#search-results');
        var debounceTimer = null;

        input.addEventListener('input', function() {
            clearTimeout(debounceTimer);
            var query = input.value.trim().toLowerCase();
            if (query.length < 2) {
                results.classList.add('hidden');
                return;
            }
            debounceTimer = setTimeout(function() { searchLocal(query); }, 250);
        });

        input.addEventListener('focus', function() {
            if (input.value.trim().length >= 2) {
                results.classList.remove('hidden');
            }
        });

        document.addEventListener('click', function(e) {
            if (!e.target.closest('.search-container')) {
                results.classList.add('hidden');
            }
        });
    }

    function setupTheme() {
        var toggle = $('#theme-toggle');
        var stored = null;
        try { stored = localStorage.getItem('glg_theme'); } catch (e) { /* ignore */ }
        if (stored) document.documentElement.setAttribute('data-theme', stored);

        toggle.addEventListener('click', function() {
            var current = document.documentElement.getAttribute('data-theme');
            var next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            try { localStorage.setItem('glg_theme', next); } catch (e) { /* ignore */ }
        });
    }

    function setupKeyboard() {
        document.addEventListener('keydown', function(e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
                if (e.key === 'Escape') e.target.blur();
                return;
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                $('#search-input').focus();
                return;
            }
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                if (state.currentStep < STEPS.length - 1) goToStep(state.currentStep + 1);
            }
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                if (state.currentStep > 0) goToStep(state.currentStep - 1);
            }
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                if (state.currentStep === STEPS.length - 1) generateLicense();
                else if (state.currentStep < STEPS.length - 1) goToStep(state.currentStep + 1);
            }
        });
    }

    function setupModal() {
        $('#modal-close').addEventListener('click', hideModal);
        $('#modal-overlay').addEventListener('click', function(e) {
            if (e.target === $('#modal-overlay')) hideModal();
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !$('#modal-overlay').classList.contains('hidden')) {
                hideModal();
            }
        });
    }

    function setupMobileSidebar() {
        var backdrop = document.createElement('div');
        backdrop.className = 'sidebar-backdrop';
        document.body.appendChild(backdrop);

        $('#sidebar-toggle').addEventListener('click', function() {
            $('#sidebar').classList.toggle('mobile-open');
            backdrop.classList.toggle('visible');
        });

        backdrop.addEventListener('click', function() {
            $('#sidebar').classList.remove('mobile-open');
            backdrop.classList.remove('visible');
        });

        var previewPanel = $('#preview-panel');
        if (previewPanel) {
            $('#btn-toggle-preview').addEventListener('click', function() {
                previewPanel.classList.toggle('collapsed');
                previewPanel.classList.toggle('mobile-open');
            });
        }
    }

    function getDefaultQuestions() {
        return [
            { id: 'project_name', step: 'intro', type: 'text', label: 'Project Name', description: 'What is the name of your project?', placeholder: 'e.g., MyAwesomeProject', required: true },
            { id: 'intro_overview', step: 'intro', type: 'radio', label: 'License Complexity', description: 'How complex do you want your license to be?', options: ['Simple', 'Standard', 'Comprehensive'], required: false },

            { id: 'ownership_type', step: 'ownership', type: 'radio', label: 'Ownership Model', description: 'Who holds the primary copyright?', options: ['Individual', 'Organization', 'Community', 'Multiple Holders'], required: true },
            { id: 'copyright_holder', step: 'ownership', type: 'text', label: 'Copyright Holder', description: 'Name of the copyright holder.', placeholder: 'e.g., Jane Doe or Acme Corp', required: true },
            { id: 'cla_required', step: 'ownership', type: 'radio', label: 'Contributor License Agreement', description: 'Require contributors to sign a CLA?', options: ['Yes', 'No', 'Optional'], required: false },

            { id: 'copyright_notice', step: 'copyright', type: 'radio', label: 'Copyright Notice Requirement', description: 'Should users include a copyright notice?', options: ['Required', 'Recommended', 'Optional'], required: true },
            { id: 'license_header', step: 'copyright', type: 'radio', label: 'License Header in Files', description: 'Require license headers in source files?', options: ['Yes, every file', 'Yes, top-level files only', 'No'], required: false },
            { id: 'patent_clause', step: 'copyright', type: 'checkbox', label: 'Additional Copyright Clauses', description: 'Select any additional clauses.', options: ['Moral rights waiver', 'Attribution requirement', 'Change log requirement', 'Version tracking'], required: false },

            { id: 'commercial_use', step: 'commercial', type: 'radio', label: 'Commercial Use', description: 'Is commercial use allowed?', options: ['Allowed without restriction', 'Allowed with attribution', 'Allowed with royalty', 'Prohibited'], required: true },
            { id: 'saa_threshold', step: 'commercial', type: 'text', label: 'SaaS Threshold', description: 'Revenue threshold for triggering requirements (USD, blank if N/A).', placeholder: 'e.g., 100000', required: false },
            { id: 'dual_license', step: 'commercial', type: 'radio', label: 'Dual Licensing', description: 'Offer under a commercial alternative?', options: ['Yes', 'No'], required: false },
            { id: 'ad_clause', step: 'commercial', type: 'radio', label: 'Anti-Competitive Clause', description: 'Restrict use by direct competitors?', options: ['Yes', 'No'], required: false },

            { id: 'patent_grant', step: 'patent', type: 'radio', label: 'Patent Grant', description: 'Grant patent rights to users?', options: ['Explicit grant with retaliation', 'Explicit grant, no retaliation', 'No patent grant', 'Deferred grant'], required: true },
            { id: 'patent_retaliation', step: 'patent', type: 'radio', label: 'Patent Retaliation', description: 'Revoke patent rights if user sues for patent infringement?', options: ['Yes', 'No'], required: false },
            { id: 'patent_claims', step: 'patent', type: 'checkbox', label: 'Patent Scope', description: 'Which patent aspects to cover?', options: ['Method patents', 'System patents', 'Design patents', 'All patent types'], required: false },

            { id: 'source_disclosure', step: 'source', type: 'radio', label: 'Source Code Disclosure', description: 'When must source code be disclosed?', options: ['On distribution', 'On first use', 'On demand', 'Never required'], required: true },
            { id: 'source_format', step: 'source', type: 'multi-select', label: 'Accepted Source Formats', description: 'Which source formats are acceptable?', options: ['Git repository', 'Archive (tar.gz/zip)', 'Direct file distribution', 'SCM export'], required: false },
            { id: 'source_window', step: 'source', type: 'select', label: 'Source Availability Window', description: 'How long must source be available?', options: ['Indefinitely', '3 years', '5 years', '10 years', 'Until project ends'], required: false },

            { id: 'distribution_scope', step: 'distribution', type: 'multi-select', label: 'Distribution Scope', description: 'What types of distribution are permitted?', options: ['Binary distribution', 'Source distribution', 'SaaS/cloud', 'Mobile app stores', 'Embedded devices'], required: true },
            { id: 'distribution_restrictions', step: 'distribution', type: 'checkbox', label: 'Distribution Restrictions', description: 'Any restrictions on distribution?', options: ['No distribution of modified versions', 'Geographic restrictions', 'Age restrictions', 'Platform restrictions'], required: false },
            { id: 'redistribution_fee', step: 'distribution', type: 'radio', label: 'Redistribution Fee', description: 'Allow charging for redistribution?', options: ['Allowed', 'Not allowed', 'Allowed with source included'], required: false },

            { id: 'modification_rights', step: 'modification', type: 'radio', label: 'Modification Rights', description: 'Can users modify the software?', options: ['Yes, unlimited', 'Yes, for personal use', 'Yes, with attribution only', 'No modifications allowed'], required: true },
            { id: 'modification_disclosure', step: 'modification', type: 'radio', label: 'Modification Disclosure', description: 'Must modifications be disclosed?', options: ['Required if distributed', 'Required always', 'Never required', 'Required if commercial'], required: false },
            { id: 'derivative_scope', step: 'modification', type: 'select', label: 'Derivative Works Scope', description: 'How broadly are derivative works defined?', options: ['Narrow (direct modifications only)', 'Medium (includes linking)', 'Broad (includes aggregation)', 'Very broad (includes usage)'], required: false },

            { id: 'ai_usage', step: 'aidata', type: 'radio', label: 'AI Training Usage', description: 'Can this software be used to train AI models?', options: ['Allowed without restriction', 'Allowed with attribution', 'Allowed for non-commercial only', 'Prohibited'], required: true },
            { id: 'data_collection', step: 'aidata', type: 'radio', label: 'Data Collection', description: 'Can the software collect user data?', options: ['Allowed with consent', 'Prohibited', 'Allowed for telemetry only'], required: false },
            { id: 'ml_model_clause', step: 'aidata', type: 'checkbox', label: 'AI/ML Specific Clauses', description: 'Additional AI-related provisions.', options: ['Model output must be disclosed', 'Training data must be disclosed', 'AI-generated code treated as derivative', 'No non-compete for AI products'], required: false },

            { id: 'compliance_jurisdiction', step: 'compliance', type: 'multi-select', label: 'Applicable Jurisdictions', description: 'Which jurisdictions does this license apply to?', options: ['United States', 'European Union', 'United Kingdom', 'Global', 'Other'], required: true },
            { id: 'compliance_mechanism', step: 'compliance', type: 'select', label: 'Compliance Mechanism', description: 'How should compliance be enforced?', options: ['Self-certification', 'Third-party audit', 'Community review', 'Legal action only'], required: false },
            { id: 'compliance_notices', step: 'compliance', type: 'checkbox', label: 'Required Notices', description: 'What notices must be included?', options: ['License text', 'Copyright notice', 'Author attribution', 'Modification notice', 'Disclaimer'], required: false },

            { id: 'special_survival', step: 'special', type: 'select', label: 'License Survival Period', description: 'How long do obligations survive after termination?', options: ['30 days', '60 days', '90 days', '1 year', 'Indefinite'], required: false },
            { id: 'special_severability', step: 'special', type: 'radio', label: 'Severability Clause', description: 'Include a severability clause?', options: ['Yes', 'No'], required: false },
            { id: 'special_governing_law', step: 'special', type: 'text', label: 'Governing Law', description: 'Specify the governing law jurisdiction.', placeholder: 'e.g., State of California, USA', required: false },
            { id: 'special_dispute_resolution', step: 'special', type: 'select', label: 'Dispute Resolution', description: 'How should disputes be resolved?', options: ['Arbitration', 'Mediation then arbitration', 'Court litigation', 'Informal resolution first'], required: false },
            { id: 'warranty_disclaimer', step: 'special', type: 'radio', label: 'Warranty Disclaimer', description: 'Level of warranty disclaimer.', options: ['Full disclaimer (AS IS)', 'Limited warranty (90 days)', 'Limited warranty (1 year)', 'No disclaimer'], required: true },
            { id: 'liability_cap', step: 'special', type: 'select', label: 'Liability Cap', description: 'Maximum liability for damages.', options: ['No limitation', 'Direct damages only', 'Limited to license fee', 'Limited to $100', 'Limited to $1000'], required: false },
            { id: 'custom_terms', step: 'special', type: 'license-text', label: 'Custom License Terms', description: 'Add any custom license terms or clauses.', placeholder: 'Enter custom license text...', required: false },

            { id: 'review_checklist', step: 'review', type: 'checkbox', label: 'Review Checklist', description: 'Confirm you have reviewed the following:', options: ['All copyright holders identified', 'Commercial terms verified', 'Patent clauses reviewed', 'Source disclosure requirements clear', 'Distribution scope confirmed', 'AI/data provisions reviewed', 'Compliance mechanism selected', 'Special terms finalized'], required: true },
        ];
    }

    function loadQuestions() {
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
    }

    function setupEventListeners() {
        $('#btn-next').addEventListener('click', function() {
            if (!validateCurrentStep()) return;
            if (state.currentStep < STEPS.length - 1) goToStep(state.currentStep + 1);
        });

        $('#btn-prev').addEventListener('click', function() {
            if (state.currentStep > 0) goToStep(state.currentStep - 1);
        });

        $('#btn-generate').addEventListener('click', generateLicense);
        $('#btn-validate').addEventListener('click', validateLicense);
        $('#btn-explain').addEventListener('click', explainLicense);

        $('#btn-copy').addEventListener('click', function() {
            var text = state.licenseText || '';
            if (!text) {
                toast('Nothing to copy.', 'warning');
                return;
            }
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(function() {
                    toast('Copied to clipboard!', 'success');
                }).catch(function() {
                    fallbackCopy(text);
                });
            } else {
                fallbackCopy(text);
            }
        });

        $('#btn-reset').addEventListener('click', function() {
            showModal('Reset All Answers', '<p>Are you sure you want to reset all your answers? This cannot be undone.</p>', [
                { label: 'Cancel', cls: 'btn-secondary' },
                { label: 'Reset', cls: 'btn-danger', action: function() {
                    state.answers = {};
                    state.licenseText = '';
                    state.currentStep = 0;
                    saveProgress();
                    try { localStorage.removeItem('glg_state'); } catch (e) { /* ignore */ }
                    renderSidebar();
                    renderWizardStep(0);
                    updateButtons();
                    updateStepIndicator();
                    updateProgress();
                    updatePreview();
                    toast('All answers have been reset.', 'info');
                }}
            ]);
        });

        $('#btn-export').addEventListener('click', function() {
            exportLicense('text');
        });
    }

    function fallbackCopy(text) {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand('copy');
            toast('Copied to clipboard!', 'success');
        } catch (e) {
            toast('Failed to copy.', 'error');
        }
        document.body.removeChild(ta);
    }

    function checkHealth() {
        apiGet('/api/health').then(function(data) {
            if (data && data.status === 'healthy') {
                console.log('[GLG] Backend connected.');
            }
        });
    }

    function init() {
        loadProgress();
        setupTheme();
        setupEventListeners();
        setupSearch();
        setupModal();
        setupKeyboard();
        setupMobileSidebar();
        loadQuestions();
        checkHealth();
    }

    GLG.version = '1.0.0';
    GLG.state = state;
    GLG.STEPS = STEPS;
    GLG.exportLicense = exportLicense;
    window.GLG = GLG;
    window.__glgExport = exportLicense;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
