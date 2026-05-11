// Z: core\safe_pack_panel.js
(function () {
  const panelId = 'zSafePackPanel';
  const candidateId = 'zSafePackCandidate';
  const applyBtnId = 'zSafePackApplyPreview';
  const logListId = 'zSafePackLogList';
  const webhookHistoryId = 'zSafePackWebhookHistory';
  const BACKUP_HOOK_CMD = 'python scripts/backup_hook.py';
  const BACKUP_BUTTON_TEXT = 'Copy backup hook command';

  function updateWebhookSummary(history = []) {
    const summary = document.getElementById('zWebhookStatusCard');
    if (!summary) return;
    const counts = history.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});
    summary.innerHTML =
      Object.entries(counts)
        .map(
          ([status, value]) =>
            `<span style="display:inline-block;margin-right:6px;">${status}: ${value}</span>`
        )
        .join('') || 'No webhook events yet';
  }

  function renderPackList(packs) {
    const list = document.getElementById(logListId);
    if (!list) return;
    list.innerHTML = '';
    packs
      .slice(-10)
      .reverse()
      .forEach((pack) => {
        const row = document.createElement('div');
        row.className = 'z-safe-pack-row';
        row.innerHTML = `
        <div>
          <b>${pack.rule}</b>
          <span class="z-muted">${pack.file} • ${new Date(pack.ts).toLocaleTimeString()}</span>
        </div>
        <div class="z-safe-pack-actions">
          <button data-pack="${pack.id}" class="z-button z-button-subtle">Rollback</button>
        </div>
      `;
        list.appendChild(row);
      });
    updateWebhookSummary(window.ZSafePack?.getWebhookHistory?.() || []);
  }

  function refreshPackList() {
    renderPackList(window.ZSafePack?.list?.() || []);
  }

  function setCandidatePreview(candidate) {
    const box = document.getElementById(candidateId);
    if (!box) return;
    if (!candidate) {
      box.textContent = 'No suggestions available.';
      delete box.dataset.candidate;
      return;
    }
    box.textContent = `${candidate.description} (rule ${candidate.rule})`;
    box.dataset.candidate = JSON.stringify(candidate);
  }

  function loadCandidate() {
    fetch('data/safe_pack_candidates.json')
      .then((res) => res.json())
      .then((candidates) => setCandidatePreview(candidates[0] || null))
      .catch(() => setCandidatePreview(null));
  }

  function applyCandidate() {
    const box = document.getElementById(candidateId);
    if (!box) return;
    const candidate = box.dataset.candidate ? JSON.parse(box.dataset.candidate) : null;
    if (!candidate) return;
    window.ZSafePack?.applyPack?.(candidate);
    refreshPackList();
    window.ZChronicle?.write?.({
      type: 'z.safe_pack.preview_applied',
      packId: candidate.id,
      file: candidate.file,
      rule: candidate.rule,
    });
  }

  function refreshWebhookHistory() {
    const historyEl = document.getElementById(webhookHistoryId);
    if (!historyEl) return;
    const history = window.ZSafePack?.getWebhookHistory?.() || [];
    historyEl.innerHTML = history
      .slice(-10)
      .reverse()
      .map(
        (item) =>
          `<div class="z-webhook-row"><span>${item.ts}</span><span>${item.event}</span><span>${item.status}</span><span>${item.detail}</span></div>`
      )
      .join('');
    updateWebhookSummary(history);
  }

  let lastHarisha = { score: null, state: 'calm' };

  function buildHarishaTooltip(action) {
    const score = lastHarisha.score ?? window.ZHarisha?.getScore?.() ?? 100;
    const state = lastHarisha.state || 'calm';
    const prompt =
      score >= 70
        ? 'Harisha clear — proceed with allowed automation.'
        : score >= 50
          ? 'Harisha moderate — prefer review before execution.'
          : 'Harisha low — observe-only, wait for stability.';
    return `Harisha score ${score} (${state}) → ${prompt} Action: ${action}.`;
  }

  function updateHarishaTooltips() {
    const applyBtn = document.getElementById(applyBtnId);
    if (applyBtn) {
      applyBtn.title = buildHarishaTooltip('Apply candidate');
    }
    const exportBtn = document.getElementById('zSafePackExport');
    if (exportBtn) {
      exportBtn.title = buildHarishaTooltip('Export webhook history');
    }
    const refreshBtn = document.getElementById('zSafePackRefresh');
    if (refreshBtn) {
      refreshBtn.title = buildHarishaTooltip('Refresh Safe Pack list');
    }
  }

  window.addEventListener('harisha:update', (event) => {
    if (event?.detail) {
      lastHarisha = { score: event.detail.score, state: event.detail.state };
      updateHarishaTooltips();
    }
  });

  function initSafePackPanel() {
    const panel = document.getElementById(panelId);
    if (!panel) return;
    const refreshBtn = document.getElementById('zSafePackRefresh');
    const previewBtn = document.getElementById(applyBtnId);
    refreshBtn?.addEventListener('click', () => {
      refreshPackList();
      refreshWebhookHistory();
    });
    const exportBtn = document.getElementById('zSafePackExport');
    exportBtn?.addEventListener('click', () => {
      const history = window.ZSafePack?.getWebhookHistory?.() || [];
      if (!history.length) return;
      const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `safe-pack-webhooks-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
      window.ZSafePack?.exportWebhookHistory?.();
    });
    previewBtn?.addEventListener('click', () => applyCandidate());

    panel.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-pack]');
      if (!btn) return;
      const packId = btn.dataset.pack;
      window.ZSafePack?.rollback?.(packId);
      refreshPackList();
    });

    refreshPackList();
    loadCandidate();
    refreshWebhookHistory();

    const backupBtn = document.getElementById('zSafePackBackup');
    backupBtn?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(BACKUP_HOOK_CMD);
        backupBtn.textContent = 'Command copied';
        setTimeout(() => {
          backupBtn.textContent = BACKUP_BUTTON_TEXT;
        }, 2500);
      } catch (err) {
        alert(`Copy failed. Run:\n${BACKUP_HOOK_CMD}`);
      }
    });
  }

  initSafePackPanel();
})();
