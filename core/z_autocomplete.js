// Z: core\z_autocomplete.js
// Rule/Commit Autocompletion logic for Z-Sanctuary Universe
(function () {
  const panel = document.getElementById('zAutocompletePanel');
  const input = document.getElementById('autocompleteInput');
  const preview = document.getElementById('autocompletePreview');
  const generateBtn = document.getElementById('generateAutocompleteBtn');
  const recentPanel = document.getElementById('zRecentSuggestions');
  const suggestionList = document.getElementById('suggestionList');
  const autopilotStatus = document.getElementById('autopilotStatus');
  const viewAuditBtn = document.getElementById('viewAuditBtn');
  const toggleAutocompleteBtn = document.getElementById('toggleAutocompleteBtn');
  const toggleSuggestionsBtn = document.getElementById('toggleSuggestionsBtn');
  const scribeEndpointInput = document.getElementById('scribeEndpointInput');
  const scribeModelInput = document.getElementById('scribeModelInput');
  const saveScribeConfigBtn = document.getElementById('saveScribeConfigBtn');
  const resetScribeConfigBtn = document.getElementById('resetScribeConfigBtn');
  const testScribeConfigBtn = document.getElementById('testScribeConfigBtn');
  const scribeConfigStatus = document.getElementById('scribeConfigStatus');
  const scribeConnectionStatus = document.getElementById('scribeConnectionStatus');
  const suggestionFilterRow = document.getElementById('suggestionFilters');
  const suggestionFilterLabel = document.getElementById('suggestionFilterLabel');
  const controlElements = [
    input,
    generateBtn,
    scribeEndpointInput,
    scribeModelInput,
    saveScribeConfigBtn,
    resetScribeConfigBtn,
    testScribeConfigBtn,
  ].filter(Boolean);
  let previewBackup = '';
  let placeholderBackup = '';

  if (!panel || !input || !preview || !generateBtn || !recentPanel || !suggestionList) {
    return;
  }

  const defaultScribeConfig = {
    endpoint: 'http://127.0.0.1:11434/api/generate',
    model: 'qwen2.5-coder:7b',
  };
  const previewClasses = [
    'z-preview-low',
    'z-preview-medium',
    'z-preview-high',
    'z-preview-sacred',
    'z-preview-unknown',
    'z-preview-rule',
    'z-preview-commit',
  ];
  const AUTO_OPEN_SUGGESTIONS = false;
  let suggestionFilter = 'all';

  function togglePanel(target) {
    target.style.display = target.style.display === 'none' ? '' : 'none';
  }

  function shouldAutoOpenSuggestions() {
    if (AUTO_OPEN_SUGGESTIONS) return true;
    const risk = window.ZGovernanceHUD?.getState?.().riskClass;
    return risk === 'high' || risk === 'sacred';
  }

  function maybeOpenSuggestions() {
    if (!recentPanel) return;
    if (!shouldAutoOpenSuggestions()) return;
    if (recentPanel.style.display === 'none') recentPanel.style.display = '';
  }

  // Show panel on double-click Autopilot Status
  if (autopilotStatus) {
    autopilotStatus.addEventListener('dblclick', function () {
      togglePanel(panel);
    });
  }

  // Show recent suggestions panel on double-click Audit Log button
  if (viewAuditBtn) {
    viewAuditBtn.addEventListener('dblclick', function () {
      togglePanel(recentPanel);
    });
  }

  // Visible toggles for panels
  if (toggleAutocompleteBtn) {
    toggleAutocompleteBtn.addEventListener('click', function () {
      togglePanel(panel);
    });
  }
  if (toggleSuggestionsBtn) {
    toggleSuggestionsBtn.addEventListener('click', function () {
      togglePanel(recentPanel);
    });
  }

  function setFilter(filter) {
    suggestionFilter = filter || 'all';
    updateFilterChips();
    updateFilterLabel();
    renderSuggestions();
  }

  function formatFilterLabel(filter) {
    if (!filter || filter === 'all') return 'All';
    return filter.charAt(0).toUpperCase() + filter.slice(1);
  }

  function updateFilterLabel() {
    if (!suggestionFilterLabel) return;
    suggestionFilterLabel.textContent = `Filter: ${formatFilterLabel(suggestionFilter)}`;
  }

  function updateFilterChips() {
    if (!suggestionFilterRow) return;
    const chips = suggestionFilterRow.querySelectorAll('[data-risk]');
    chips.forEach((chip) => {
      const isActive = chip.getAttribute('data-risk') === suggestionFilter;
      chip.classList.toggle('z-filter-active', isActive);
    });
  }

  if (suggestionFilterRow) {
    const chips = suggestionFilterRow.querySelectorAll('[data-risk]');
    chips.forEach((chip) => {
      chip.addEventListener('click', function () {
        setFilter(chip.getAttribute('data-risk'));
      });
    });
  }

  function normalizeConfig(config) {
    return {
      endpoint: (config && config.endpoint) || defaultScribeConfig.endpoint,
      model: (config && config.model) || defaultScribeConfig.model,
    };
  }

  function setConfigStatus(message) {
    if (scribeConfigStatus) scribeConfigStatus.textContent = message;
  }

  function setConnectionStatus(message) {
    if (!scribeConnectionStatus) return;
    scribeConnectionStatus.textContent = message;
    scribeConnectionStatus.classList.remove('z-status-ok', 'z-status-warn', 'z-status-error');
    if (!message) return;
    if (message.startsWith('OK')) {
      scribeConnectionStatus.classList.add('z-status-ok');
    } else if (message.startsWith('Testing') || message.startsWith('Timeout')) {
      scribeConnectionStatus.classList.add('z-status-warn');
    } else if (message.startsWith('Failed')) {
      scribeConnectionStatus.classList.add('z-status-error');
    }
  }

  function applyScribeConfig(config) {
    const normalized = normalizeConfig(config);
    window.ZScribeConfig = normalized;
    if (scribeEndpointInput) scribeEndpointInput.value = normalized.endpoint;
    if (scribeModelInput) scribeModelInput.value = normalized.model;
  }

  function clearPreviewClasses() {
    preview.classList.remove(...previewClasses);
  }

  function riskFromText(text) {
    const lower = text.toLowerCase();
    const match = lower.match(/\brisk\s*:\s*(low|medium|high|sacred)\b/);
    if (match) return match[1];
    const tagMatch = lower.match(/\[risk:(low|medium|high|sacred)\]/);
    if (tagMatch) return tagMatch[1];
    return null;
  }

  function riskFromJson(text) {
    const trimmed = text.trim();
    if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return null;
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        const first = parsed.find((item) => item && typeof item === 'object');
        return first && first.risk_class ? String(first.risk_class) : null;
      }
      if (parsed && typeof parsed === 'object' && parsed.risk_class) {
        return String(parsed.risk_class);
      }
    } catch (e) {
      return null;
    }
    return null;
  }

  function previewType(text) {
    const trimmed = text.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) return 'rule';
    return 'commit';
  }

  function applyPreviewStyling(text) {
    clearPreviewClasses();
    if (!text) {
      preview.classList.add('z-preview-unknown');
      return;
    }
    const type = previewType(text);
    const risk = riskFromJson(text) || riskFromText(text) || 'unknown';
    preview.classList.add(`z-preview-${risk}`);
    preview.classList.add(type === 'rule' ? 'z-preview-rule' : 'z-preview-commit');
  }

  function loadScribeConfig() {
    let config = normalizeConfig(window.ZScribeConfig);
    const raw = localStorage.getItem('zScribeConfig');
    if (raw) {
      try {
        config = normalizeConfig(JSON.parse(raw));
        setConfigStatus('Loaded');
      } catch (e) {
        setConfigStatus('Invalid saved config');
      }
    } else {
      setConfigStatus('Defaults');
    }
    applyScribeConfig(config);
  }

  if (saveScribeConfigBtn) {
    saveScribeConfigBtn.addEventListener('click', function () {
      const config = normalizeConfig({
        endpoint: scribeEndpointInput ? scribeEndpointInput.value.trim() : undefined,
        model: scribeModelInput ? scribeModelInput.value.trim() : undefined,
      });
      localStorage.setItem('zScribeConfig', JSON.stringify(config));
      applyScribeConfig(config);
      setConfigStatus('Saved');
      setConnectionStatus('');
    });
  }

  if (resetScribeConfigBtn) {
    resetScribeConfigBtn.addEventListener('click', function () {
      localStorage.removeItem('zScribeConfig');
      applyScribeConfig(defaultScribeConfig);
      setConfigStatus('Defaults');
      setConnectionStatus('');
    });
  }

  loadScribeConfig();
  setFilter('all');

  function setNightPaused(enabled) {
    if (enabled) {
      if (!previewBackup) previewBackup = preview.textContent;
      if (!placeholderBackup) placeholderBackup = input.placeholder || '';
      preview.textContent = 'Paused in Night Mode.';
      input.placeholder = 'Night mode active';
      controlElements.forEach((el) => {
        el.disabled = true;
      });
      return;
    }
    controlElements.forEach((el) => {
      el.disabled = false;
    });
    if (previewBackup) {
      preview.textContent = previewBackup;
      previewBackup = '';
    }
    input.placeholder = placeholderBackup || input.placeholder;
    placeholderBackup = '';
  }

  window.addEventListener('znightmodechange', (event) => {
    const enabled = event && event.detail ? event.detail.enabled : false;
    setNightPaused(enabled);
  });
  if (window.ZNightMode === true) {
    setNightPaused(true);
  }

  async function testScribeConnection() {
    const config = normalizeConfig(window.ZScribeConfig);
    if (!config.endpoint) {
      setConnectionStatus('Missing endpoint');
      return;
    }
    setConnectionStatus('Testing...');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    try {
      const resp = await fetch(config.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: config.model, prompt: 'ping', stream: false }),
        signal: controller.signal,
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      let data = {};
      try {
        data = await resp.json();
      } catch (err) {
        data = {};
      }
      const text =
        data.response ||
        data.output ||
        data.text ||
        (data.choices && data.choices[0] && data.choices[0].text) ||
        '';
      setConnectionStatus(text ? 'OK' : 'OK (no text)');
    } catch (err) {
      const message = err && err.name === 'AbortError' ? 'Timeout' : err.message || 'Failed';
      setConnectionStatus(`Failed: ${message}`);
    } finally {
      clearTimeout(timeout);
    }
  }

  if (testScribeConfigBtn) {
    testScribeConfigBtn.addEventListener('click', testScribeConnection);
  }

  // Store recent suggestions in memory
  const recentSuggestions = [];
  function addSuggestion(text) {
    const risk = riskFromJson(text) || riskFromText(text) || 'unknown';
    const type = previewType(text);
    recentSuggestions.unshift({ text, ts: Date.now(), risk, type });
    if (recentSuggestions.length > 8) recentSuggestions.pop();
    renderSuggestions();
    maybeOpenSuggestions();
  }
  function renderSuggestions() {
    suggestionList.innerHTML = '';
    const filtered =
      suggestionFilter === 'all'
        ? recentSuggestions
        : recentSuggestions.filter((s) => s.risk === suggestionFilter);
    if (!filtered.length) {
      const empty = document.createElement('li');
      empty.className = 'z-muted';
      empty.textContent = 'No suggestions for this filter.';
      suggestionList.appendChild(empty);
      return;
    }
    filtered.forEach((s) => {
      const li = document.createElement('li');
      const badge = document.createElement('span');
      const time = document.createElement('span');
      const text = document.createElement('pre');
      badge.className = `z-badge z-suggestion-badge z-risk-${s.risk || 'unknown'}`;
      badge.textContent = s.risk || 'unknown';
      time.style.color = '#888';
      time.textContent = new Date(s.ts).toLocaleTimeString();
      text.style.display = 'inline';
      text.style.background = 'none';
      text.style.color = '#f0f0f0';
      text.textContent = s.text;
      li.appendChild(badge);
      li.appendChild(document.createTextNode(' '));
      li.appendChild(time);
      li.appendChild(document.createTextNode(' '));
      li.appendChild(text);
      suggestionList.appendChild(li);
    });
  }

  function buildPrompt(desc) {
    return [
      'You are Z-Commit Scribe.',
      'Return either a Conventional Commit message or a JSON Z-Rule draft based on the description.',
      'If the description mentions rules, governance, or Z-Flow, return JSON only.',
      'If returning a commit message, format:',
      '  <type>(<scope>): <summary> [risk:low|medium|high|sacred]',
      '  ',
      '  Risk: <low|medium|high|sacred>',
      '  Consent: <auto|notify|require_human|n/a>',
      '  Ethical-Intent: <short reason>',
      '  ',
      'Keep it concise and actionable.',
      'Description:',
      desc,
    ].join('\n');
  }

  async function callScribe(desc) {
    const config = normalizeConfig(window.ZScribeConfig);
    const endpoint = config.endpoint;
    const model = config.model;
    const payload = { model, prompt: buildPrompt(desc), stream: false };

    const resp = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!resp.ok) throw new Error('Scribe not available');
    const data = await resp.json();
    return (
      data.response ||
      data.output ||
      data.text ||
      (data.choices && data.choices[0] && data.choices[0].text) ||
      ''
    );
  }

  // Generate commit message or rule using local AI scribe
  generateBtn.onclick = async function () {
    const desc = input.value.trim();
    if (!desc) {
      preview.textContent = 'Enter a description.';
      applyPreviewStyling('');
      return;
    }
    preview.textContent = 'Generating...';
    applyPreviewStyling('Generating');
    try {
      const suggestion = await callScribe(desc);
      if (!suggestion.trim()) throw new Error('Empty suggestion');
      preview.textContent = suggestion.trim();
      applyPreviewStyling(suggestion.trim());
      addSuggestion(suggestion.trim());
    } catch (e) {
      // Fallback: simulate with template
      const simulated = desc.startsWith('{')
        ? desc
        : `feat: ${desc} [risk:low]\nRisk: low\nConsent: require_human\nEthical-Intent: preserve dignity`;
      preview.textContent = simulated;
      applyPreviewStyling(simulated);
      addSuggestion(simulated);
    }
  };

  // Optionally, expose rule template helper
  window.generateZRuleTemplate = function (desc) {
    return JSON.stringify(
      {
        rule_id: 'custom-' + Date.now(),
        rule_name: desc,
        trigger: { type: 'manual', source: 'user', event_type: 'custom', payload_schema_ref: '' },
        context_requirements: {
          z_state: true,
          lpbs_state: true,
          ggaesp_360: true,
          wellbeing_state: true,
          session_meta: true,
        },
        conditions: [],
        risk_class: 'low',
        consent: { level: 'require_human', timeout_policy: 'wait', timeout_seconds: 0 },
        action_set: {
          allowed_actions: [],
          max_repetitions: 1,
          cooldown_seconds: 0,
          rollback_allowed: true,
        },
        governance: {
          ai_allowed: ['observe', 'suggest'],
          ai_forbidden: ['execute', 'authorize', 'modify_rules', 'bypass_consent'],
          human_override: 'always_true',
        },
        audit_seal: {
          ethical_intent: 'preserve dignity',
          creator_signature: 'user',
          creation_time: new Date().toISOString(),
          version: '1.0.0',
        },
        lifecycle: {
          status: 'draft',
          activation_date: new Date().toISOString(),
          review_interval_days: 30,
        },
      },
      null,
      2
    );
  };
})();
