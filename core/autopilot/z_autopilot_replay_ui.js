// Z: core\autopilot\z_autopilot_replay_ui.js
// Autopilot replay panel UI.
(function () {
  const listEl = document.getElementById('zAutopilotReplayList');
  const detailEl = document.getElementById('zAutopilotReplayDetail');
  const filterEl = document.getElementById('zAutopilotReplayFilter');
  const exportBtn = document.getElementById('zAutopilotReplayExportBtn');
  const clearBtn = document.getElementById('zAutopilotReplayClearBtn');
  const explainBtn = document.getElementById('zAutopilotReplayExplainBtn');
  const copyBtn = document.getElementById('zAutopilotReplayCopyBtn');
  const openChainBtn = document.getElementById('zAutopilotReplayOpenChainBtn');

  if (!listEl || !detailEl || !filterEl || !window.ZAutopilotReplay) return;

  let selectedEntry = null;
  let selectedEntryId = null;
  let lastList = [];
  let searchQuery = '';

  function formatReason(reason) {
    if (!reason) return 'Not provided.';
    if (typeof reason === 'string') return reason;
    if (reason.summary) return reason.summary;
    if (reason.message) return reason.message;
    if (reason.reason) return reason.reason;
    return Object.entries(reason)
      .map(([key, value]) => `${key}: ${value}`)
      .slice(0, 3)
      .join(' ');
  }

  function formatState(state) {
    if (!state) return '';
    return ['calm', 'night', 'freeze', 'override', 'preset']
      .map((key) => `${key}: ${state[key] ?? 'n/a'}`)
      .join(' | ');
  }

  function renderNarrative(narrative) {
    if (!narrative) return '';
    const parts = [];
    if (narrative.skk) {
      parts.push(`<div class="z-replay-detail-narrative skk">${narrative.skk}</div>`);
    }
    if (narrative.rkpk) {
      parts.push(`<div class="z-replay-detail-narrative rkpk">${narrative.rkpk}</div>`);
    }
    if (narrative.context) {
      parts.push(`<div class="z-replay-detail-context">${narrative.context}</div>`);
    }
    if (narrative.stateSummary) {
      parts.push(`<div class="z-replay-detail-context">${narrative.stateSummary}</div>`);
    }
    return parts.join('');
  }

  function narrativeToText(narrative) {
    if (!narrative) return '';
    return [narrative.skk, narrative.rkpk, narrative.context, narrative.stateSummary]
      .filter(Boolean)
      .join('\n');
  }

  function renderDetail(entry) {
    if (!entry) {
      detailEl.textContent = 'Select an entry to view details.';
      return;
    }
    selectedEntry = entry;
    selectedEntryId = entry.id || null;
    const narrativeHtml = renderNarrative(entry.narrative);
    detailEl.innerHTML = `
      <div class="z-replay-detail-title">${entry.action}${entry.value ? ` - ${entry.value}` : ''}</div>
      <div class="z-replay-detail-reason">Reason: ${formatReason(entry.reason)}</div>
      <div class="z-replay-detail-state">State: ${formatState(entry.state)}</div>
      ${narrativeHtml}
      <pre class="z-replay-detail-json">${JSON.stringify(entry, null, 2)}</pre>
    `;
  }

  function buildNarrative(entry) {
    if (!entry) return null;
    const source = entry.source || entry.agent || 'autopilot';
    const action = entry.action || 'action';
    const reasonText = formatReason(entry.reason);
    const stateSummary = formatState(entry.state);
    const risk = window.ZGovernanceHUD?.getState?.().riskClass || 'low';
    const skk = `SKK: ${source} executed "${action}" because ${reasonText}`;
    const rkpk =
      risk === 'high' || risk === 'sacred'
        ? 'RKPK: Slow down and confirm consent before the next step.'
        : 'RKPK: Pace is stable. Continue gently.';
    return {
      skk,
      rkpk,
      context: entry.context ? `Context: ${JSON.stringify(entry.context)}` : '',
      stateSummary: stateSummary ? `State: ${stateSummary}` : '',
    };
  }

  function speakNarrative(text) {
    if (!text) return;
    const whisperAllowed = window.ZConsent ? window.ZConsent.voiceWhisper !== false : true;
    const muted = localStorage.getItem('zCompanionMute') === 'true';
    const night = document.body.classList.contains('z-night-mode');
    if (!whisperAllowed || muted || night) return;
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.95;
    utter.pitch = 0.9;
    window.speechSynthesis.speak(utter);
  }

  function explainSelected() {
    const entry = selectedEntry || lastList[0];
    if (!entry) {
      detailEl.textContent = 'Select an entry to explain its path.';
      return;
    }
    entry.narrative = buildNarrative(entry);
    renderDetail(entry);
    if (entry.narrative?.skk) {
      speakNarrative(entry.narrative.skk);
    }
  }

  function matchesQuery(item, query) {
    if (!query) return true;
    const haystack = [
      item.action,
      item.value,
      item.source,
      item.agent,
      item.reason && JSON.stringify(item.reason),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return haystack.includes(query);
  }

  function focusByQuery(query) {
    searchQuery = String(query || '').toLowerCase();
    renderList();
    if (searchQuery && !lastList.length) {
      searchQuery = '';
      renderList();
    }
  }

  function renderList() {
    const filter = filterEl.value || 'all';
    const items = window.ZAutopilotReplay.list({ limit: 30, action: filter });
    const filtered = items.filter((item) => matchesQuery(item, searchQuery));
    lastList = filtered;
    listEl.innerHTML = '';
    if (!filtered.length) {
      const empty = document.createElement('div');
      empty.className = 'z-replay-empty';
      empty.textContent = searchQuery
        ? 'No replay events match this filter.'
        : 'No replay events yet.';
      listEl.appendChild(empty);
      renderDetail(null);
      return;
    }

    if (selectedEntryId) {
      const match = filtered.find((item) => item.id === selectedEntryId);
      if (match) {
        selectedEntry = match;
      }
    }
    if (
      !selectedEntry ||
      (selectedEntryId && !filtered.find((item) => item.id === selectedEntryId))
    ) {
      selectedEntry = filtered[0];
      selectedEntryId = selectedEntry?.id || null;
    }
    if (selectedEntry) {
      window.ZAutopilotReplaySelected = selectedEntry;
      renderDetail(selectedEntry);
    }

    filtered.forEach((item, index) => {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'z-replay-item';
      row.textContent = `${item.t} | ${item.action} ${item.value || ''}`.trim();
      const rowId = item.id || `${item.t || 'entry'}-${index}`;
      row.dataset.replayId = rowId;
      if (selectedEntry && (item.id || rowId) === (selectedEntry.id || rowId)) {
        row.classList.add('is-selected');
      }
      row.addEventListener('click', () => {
        const entry = lastList.find((candidate) => candidate.id === row.dataset.replayId) || item;
        selectedEntry = entry;
        selectedEntryId = entry?.id || null;
        window.ZAutopilotReplaySelected = entry;
        renderDetail(entry);
        listEl.querySelectorAll('.z-replay-item.is-selected').forEach((el) => {
          el.classList.remove('is-selected');
        });
        row.classList.add('is-selected');
        if (window.ZChainView?.showForReplay) {
          window.ZChainView.showForReplay(entry, { autoEnable: false });
        }
      });
      listEl.appendChild(row);
    });
  }

  filterEl.addEventListener('change', renderList);

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      window.ZAutopilotReplay.exportJson();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (!confirm('Clear replay log?')) return;
      window.ZAutopilotReplay.clear();
      renderList();
    });
  }

  if (explainBtn) {
    explainBtn.addEventListener('click', explainSelected);
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const entry = selectedEntry || lastList[0];
      if (!entry) {
        detailEl.textContent = 'Select an entry to copy its narrative.';
        return;
      }
      if (!entry.narrative) {
        entry.narrative = buildNarrative(entry);
      }
      const text = narrativeToText(entry.narrative);
      try {
        await navigator.clipboard.writeText(text);
        if (window.ZStatusConsole?.log) {
          window.ZStatusConsole.log('[REPLAY] Narrative copied', 'active');
        }
      } catch (err) {
        window.prompt('Copy narrative:', text);
      }
    });
  }

  if (openChainBtn) {
    openChainBtn.addEventListener('click', () => {
      const entry = selectedEntry || lastList[0];
      window.ZLayoutOS?.revealPanel?.('zChainViewPanel', {
        userInitiated: true,
        intent: 'governance',
        label: 'Chain View',
      });
      if (entry && window.ZChainView?.showForReplay) {
        window.ZChainView.showForReplay(entry, { autoEnable: true });
      }
    });
  }

  window.ZAutopilotReplayUI = {
    focusByQuery,
  };

  renderList();
  setInterval(renderList, 2000);
})();
