// Z: core\z_chain_view.js
// Chain View overlay: explainable edges with SKK/RKPK support.
(function () {
  const toggleBtn = document.getElementById('zChainToggleBtn');
  const explainBtn = document.getElementById('zChainExplainPathBtn');
  const suggestBtn = document.getElementById('zChainSuggestPathBtn');
  const timelapseBtn = document.getElementById('zChainTimelapseBtn');
  const clearBtn = document.getElementById('zChainClearSelectionBtn');
  const selectedCountEl = document.getElementById('zChainSelectedCount');
  const suggestionEl = document.getElementById('zChainSuggestion');
  const summaryEl = document.getElementById('zChainPathSummary');
  const statusEl = document.getElementById('zChainStatus');

  const selectedEdges = [];
  let highlightEdges = new Set();
  let enabled = false;
  let svgEl = null;
  let tooltipEl = null;
  let renderTimer = null;

  function ensureTooltip() {
    if (tooltipEl) return tooltipEl;
    tooltipEl = document.createElement('div');
    tooltipEl.className = 'z-chain-tooltip';
    tooltipEl.style.display = 'none';
    document.body.appendChild(tooltipEl);
    return tooltipEl;
  }

  function hideTooltip() {
    if (!tooltipEl) return;
    tooltipEl.style.display = 'none';
  }

  function showTooltip(text, x, y) {
    const el = ensureTooltip();
    el.textContent = text;
    el.style.left = `${x + 10}px`;
    el.style.top = `${y + 10}px`;
    el.style.display = 'block';
  }

  function getMetrics() {
    return window.ZSystemMetrics?.get?.() || { stress: 0.3, load: 0.4, risk: 0.4 };
  }

  function computeEdgeHeat(metrics) {
    const stress = metrics.stress ?? 0.3;
    const load = metrics.load ?? 0.4;
    const risk = metrics.risk ?? 0.4;
    return Math.max(0, Math.min(1, (stress + load + risk) / 3));
  }

  function computeEthicsScore(edge) {
    const ethics = edge.ethics || {};
    const transparency = ethics.transparency ?? 0.7;
    const reversibility = ethics.reversibility ?? 0.7;
    const humanImpact = ethics.humanImpact ?? 0.7;
    const escalationRisk = ethics.escalationRisk ?? 0.4;
    const score = (transparency + reversibility + humanImpact + (1 - escalationRisk)) / 4;
    return Math.max(0, Math.min(1, score));
  }

  function ethicsLabel(score) {
    if (score >= 0.8) return 'strong';
    if (score >= 0.6) return 'balanced';
    return 'caution';
  }

  function ensureVoice() {
    if (window.ZSKKVoice) return;
    window.ZSKKVoice = {
      speak: (text) => {
        if (!text) return;
        const muted = localStorage.getItem('zCompanionMute') === 'true';
        const night = document.body.classList.contains('z-night-mode');
        const whisperAllowed = window.ZConsent ? window.ZConsent.voiceWhisper !== false : true;
        if (muted || night || !whisperAllowed) return;
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.rate = 0.95;
        utter.pitch = 0.9;
        window.speechSynthesis.speak(utter);
      },
    };
  }

  function renderSelectionSummary() {
    if (selectedCountEl) selectedCountEl.textContent = String(selectedEdges.length);
    if (!summaryEl) return;
    if (!selectedEdges.length) {
      summaryEl.textContent = 'No path selected.';
      return;
    }
    const edges = selectedEdges
      .map((id) => {
        const parts = id.split('->');
        return `${parts[0]} -> ${parts[1]}`;
      })
      .join(' | ');
    summaryEl.textContent = `Path: ${edges}`;
  }

  function updateStatus(message) {
    if (!statusEl) return;
    statusEl.textContent = message;
  }

  function updateSuggestion(text) {
    if (suggestionEl) suggestionEl.textContent = text || '';
  }

  function toggleSelectEdge(edgeId, line) {
    const idx = selectedEdges.indexOf(edgeId);
    if (idx >= 0) {
      selectedEdges.splice(idx, 1);
      if (line) line.classList.remove('z-chain-selected');
    } else {
      selectedEdges.push(edgeId);
      if (line) line.classList.add('z-chain-selected');
    }
    renderSelectionSummary();
  }

  function explainSelectedPath() {
    if (!selectedEdges.length) return;
    ensureVoice();
    const edges = selectedEdges
      .map((id) => {
        const parts = id.split('->');
        return window.ZChainRegistry?.getEdge?.(parts[0], parts[1]);
      })
      .filter(Boolean);
    const narrative = window.ZChainRegistry?.buildPathNarrative?.(edges) || '';
    if (narrative) {
      window.ZSKKVoice.speak(`Full path: ${narrative}`);
    }
  }

  function suggestAlternativePath() {
    if (!selectedEdges.length) return;
    const metrics = getMetrics();
    const edges = selectedEdges
      .map((id) => {
        const parts = id.split('->');
        return window.ZChainRegistry?.getEdge?.(parts[0], parts[1]);
      })
      .filter(Boolean);
    const first = edges.find((edge) => edge.alternatives && edge.alternatives.length);
    if (!first || metrics.stress < 0.6) {
      updateSuggestion('No alternative suggested. Path is stable.');
      return;
    }
    const alt = first.alternatives[0];
    updateSuggestion(`RKPK suggestion: ${alt.reason}`);
  }

  function renderEdges(edges, options = {}) {
    if (!enabled) return;
    if (!svgEl) return;
    svgEl.innerHTML = '';
    const metrics = getMetrics();
    const historyTrends = window.ZChainHistory?.getTrendWarnings?.() || [];
    let rendered = 0;
    let missing = 0;

    edges.forEach((edge) => {
      const sourceEl = document.querySelector(`[data-module-id="${edge.source}"]`);
      const targetEl = document.querySelector(`[data-module-id="${edge.target}"]`);
      if (!sourceEl || !targetEl) {
        missing += 1;
        return;
      }
      const a = sourceEl.getBoundingClientRect();
      const b = targetEl.getBoundingClientRect();
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', String(a.right));
      line.setAttribute('y1', String(a.top + a.height / 2));
      line.setAttribute('x2', String(b.left));
      line.setAttribute('y2', String(b.top + b.height / 2));
      const fromHistory = Boolean(options?.fromHistory);
      line.setAttribute('stroke-dasharray', fromHistory ? '6 6' : '0');
      line.dataset.edgeId = edge.id;
      line.classList.add('z-chain-line');

      const heat = edge.heat ?? computeEdgeHeat(metrics);
      const ethicsScore = edge.ethicsScore ?? computeEthicsScore(edge);
      const label = ethicsLabel(ethicsScore);
      line.classList.add(`z-chain-ethics-${label}`);
      if (highlightEdges.has(edge.id)) {
        line.classList.add('z-chain-highlight');
      }
      const heatAlpha = 0.25 + heat * 0.5;
      const heatColor = `rgba(255, ${200 - Math.round(heat * 160)}, ${
        200 - Math.round(heat * 160)
      }, ${heatAlpha})`;
      line.style.stroke = heatColor;
      line.style.strokeWidth = String(2 + heat * 2);

      const trend = historyTrends.find((t) => t.id === edge.id);
      if (trend?.trend === 'rising') line.classList.add('z-chain-trend-up');
      if (trend?.trend === 'falling') line.classList.add('z-chain-trend-down');

      line.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleSelectEdge(edge.id, line);
        const registryEdge = window.ZChainRegistry?.getEdge?.(edge.source, edge.target);
        if (registryEdge?.explain?.skk) {
          ensureVoice();
          window.ZSKKVoice.speak(registryEdge.explain.skk);
        }
      });

      line.addEventListener('mouseenter', (event) => {
        const ethicsText = `Ethics: ${label}`;
        const safeText =
          metrics.stress > 0.7 || ethicsScore < 0.6
            ? 'RKPK: Consider a gentler path or simulation.'
            : 'RKPK: This chain is balanced.';
        showTooltip(`${ethicsText}. ${safeText}`, event.clientX, event.clientY);
      });
      line.addEventListener('mouseleave', hideTooltip);

      svgEl.appendChild(line);
      rendered += 1;
    });

    return { rendered, missing, total: edges.length };
  }

  function render() {
    if (!enabled) return;
    if (!svgEl) {
      svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgEl.classList.add('z-chain-svg');
      svgEl.classList.add('is-active');
      document.body.appendChild(svgEl);
    }
    const edges = window.ZChainRegistry?.getEdges?.() || [];
    const metrics = getMetrics();
    const withHeat = edges.map((edge) => ({
      ...edge,
      heat: computeEdgeHeat(metrics),
      ethicsScore: computeEthicsScore(edge),
    }));
    const result = renderEdges(withHeat) || { rendered: 0, missing: 0, total: edges.length };
    const registryPanel = document.getElementById('zModuleRegistryPanel');
    const registryHidden =
      registryPanel && window.getComputedStyle(registryPanel).display === 'none';
    const moduleCards = document.querySelectorAll('#zModuleRegistryList [data-module-id]').length;

    if (!window.ZModuleRegistry) {
      updateStatus('Status: module registry not ready.');
    } else if (registryHidden) {
      updateStatus('Status: enable Module Registry panel to render chains.');
    } else if (!moduleCards) {
      updateStatus('Status: waiting for module registry cards.');
    } else if (result.total === 0) {
      updateStatus('Status: no edges configured.');
    } else if (result.rendered === 0) {
      updateStatus('Status: no visible edges (modules hidden).');
    } else if (result.missing > 0) {
      updateStatus(`Status: rendered ${result.rendered}/${result.total} edges.`);
    } else {
      updateStatus(`Status: rendered ${result.rendered}/${result.total} edges.`);
    }
    if (suggestionEl && !suggestionEl.textContent) {
      const wisdom = window.ZWisdomRing?.getLatestSuggestion?.();
      if (wisdom?.message) {
        updateSuggestion(`Wisdom: ${wisdom.message}`);
      }
    }
    renderSelectionSummary();
  }

  function clear() {
    if (svgEl) svgEl.remove();
    svgEl = null;
    hideTooltip();
    updateStatus('Status: idle.');
  }

  function mapReplayToEdges(entry) {
    if (!entry) return [];
    const action = String(entry.action || '').toLowerCase();
    if (action.includes('simulation')) return ['autopilot-replay->autopilot-simulation'];
    if (action.includes('report')) return ['dependency-graph->governance-report'];
    if (action.includes('review')) return ['governance-report->governance-review'];
    if (action.includes('governance')) return ['autopilot-replay->dependency-graph'];
    return ['autopilot-replay->dependency-graph'];
  }

  function showForReplay(entry, options = {}) {
    const ids = mapReplayToEdges(entry);
    highlightEdges = new Set(ids);
    if (options.autoEnable && !enabled) {
      toggle();
    } else {
      render();
    }
    if (summaryEl) {
      summaryEl.textContent = entry?.action
        ? `Replay focus: ${entry.action}`
        : 'Replay focus: unknown action';
    }
    updateSuggestion(`Linked to replay: ${entry?.action || entry?.id || 'unknown'}`);
  }

  function toggle() {
    enabled = !enabled;
    if (enabled) {
      render();
      renderTimer = setInterval(render, 4000);
      window.ZChainHistory?.recordSnapshot?.('chain-view');
    } else {
      if (renderTimer) clearInterval(renderTimer);
      renderTimer = null;
      clear();
    }
    if (toggleBtn) toggleBtn.textContent = enabled ? 'Disable Chain View' : 'Enable Chain View';
  }

  function playTimelapse() {
    if (!enabled) toggle();
    window.ZChainHistory?.playTimeline?.({
      speed: 1,
      onFrame: (snapshot) => {
        if (!svgEl) return;
        const edges = snapshot.edges.map((edge) => ({
          ...edge,
          id: edge.id,
        }));
        renderEdges(edges, { fromHistory: true });
      },
    });
  }

  if (toggleBtn) toggleBtn.addEventListener('click', toggle);
  if (explainBtn) explainBtn.addEventListener('click', explainSelectedPath);
  if (suggestBtn) suggestBtn.addEventListener('click', suggestAlternativePath);
  if (timelapseBtn) timelapseBtn.addEventListener('click', playTimelapse);
  if (clearBtn)
    clearBtn.addEventListener('click', () => {
      selectedEdges.length = 0;
      highlightEdges = new Set();
      renderSelectionSummary();
      updateSuggestion('');
      render();
    });

  window.ZChainView = {
    toggle,
    render,
    clear,
    explainSelectedPath,
    suggestAlternativePath,
    playTimelapse,
    showForReplay,
  };
})();
