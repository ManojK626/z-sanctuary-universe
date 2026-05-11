// Z: core\z_governance_hud.js
// Governance HUD: read-only audit-first dashboard
const ZGovernanceHUD = (() => {
  const ruleSet = [
    { id: 'WB-001', name: 'Gentle Rest Nudge', risk: 'low', consent: 'notify' },
    { id: 'WB-010', name: 'Auto-Dim + Slow Effects', risk: 'medium', consent: 'auto' },
    { id: 'WB-020', name: 'Gambling Cooldown Gate', risk: 'high', consent: 'require human' },
    { id: 'WB-900', name: 'Emergency Assist', risk: 'sacred', consent: 'require human' },
  ];

  const maxAudit = 8;
  const auditTrail = [];
  let initialized = false;
  let lastRiskClass = 'unknown';
  let lastConsent = 'notify';

  const riskEl = document.getElementById('zGovRisk');
  const consentEl = document.getElementById('zGovConsent');
  const aiEl = document.getElementById('zGovAi');
  const humanEl = document.getElementById('zGovHuman');
  const governorEl = document.getElementById('zGovGovernor');
  const snapshotEl = document.getElementById('zGovSignals');
  const sepcEl = document.getElementById('zGovSepc');
  const companionEl = document.getElementById('zGovCompanion');
  const resolutionEl = document.getElementById('zGovResolution');
  const listeningEl = document.getElementById('zGovListening');
  const whisperEl = document.getElementById('zGovVoiceWhisper');
  const silenceBtn = document.getElementById('zGovSilenceVoiceBtn');
  const exportBtn = document.getElementById('zGovExportSnapshotBtn');
  const ruleCountEl = document.getElementById('zGovRuleCount');
  const ruleListEl = document.getElementById('zRuleItems');
  const auditEl = document.getElementById('zAuditTrail');
  const timelineEl = document.getElementById('zGovTimelineList');
  const p1CountEl = document.getElementById('zGovP1Count');
  const p1ListEl = document.getElementById('zGovP1List');
  const wisdomEl = document.getElementById('zGovWisdomNote');
  const wisdomStampEl = document.getElementById('zGovWisdomStamp');

  if (!riskEl || !consentEl || !ruleListEl || !auditEl) return {};

  function formatTime(ts) {
    return new Date(ts).toLocaleTimeString();
  }

  function formatNumber(value, digits = 0) {
    if (typeof value !== 'number' || Number.isNaN(value)) return '--';
    return value.toFixed(digits);
  }

  function classifyRisk(load, coherence) {
    if (typeof load !== 'number' || typeof coherence !== 'number') {
      return { riskClass: 'unknown', consent: 'notify' };
    }
    let riskClass = 'low';
    if (load >= 95 || coherence <= 20) riskClass = 'sacred';
    else if (load >= 85 || coherence <= 30) riskClass = 'high';
    else if (load >= 70 || coherence <= 45) riskClass = 'medium';

    const consent =
      riskClass === 'low' ? 'auto' : riskClass === 'medium' ? 'notify' : 'require human';
    return { riskClass, consent };
  }

  function governorState(load, coherence) {
    if (typeof load !== 'number' || typeof coherence !== 'number') return 'waiting';
    if (load >= 85 || coherence <= 30) return 'engaged';
    if (load >= 70 || coherence <= 45) return 'guarded';
    return 'stable';
  }

  function logAudit(message, level = 'info') {
    auditTrail.unshift({ timestamp: Date.now(), message, level });
    if (auditTrail.length > maxAudit) auditTrail.pop();
    renderAudit();
    renderTimeline();
  }

  function exportSnapshot() {
    const snapshot = {
      ts: new Date().toISOString(),
      risk: riskEl?.textContent || 'unknown',
      consent: consentEl?.textContent || 'notify',
      aiBoundary: aiEl?.textContent || 'observe / suggest',
      humanOverride: humanEl?.textContent || 'available',
      governor: governorEl?.textContent || 'waiting',
      snapshot: snapshotEl?.textContent || 'E:-- H:-- C:-- L:--',
      listening: listeningEl?.textContent || 'off',
      voiceWhisper: whisperEl?.textContent || 'off',
      sepc: sepcEl?.textContent || 'active',
      companion: companionEl?.textContent || 'SKK + RKPK',
      resolution: resolutionEl?.textContent || 'de-escalation first',
    };

    const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `governance_snapshot_${snapshot.ts.replace(/[:.]/g, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
    logAudit('Governance snapshot exported', 'info');
  }

  function renderAudit() {
    auditEl.innerHTML = auditTrail
      .map((entry) => {
        const levelClass = `z-audit-${entry.level}`;
        return `<div class="z-audit-item">
          <span class="z-audit-time">${formatTime(entry.timestamp)}</span>
          <span class="z-audit-level ${levelClass}">${entry.level}</span>
          <span>${entry.message}</span>
        </div>`;
      })
      .join('');
  }

  function renderTimeline() {
    if (!timelineEl) return;
    timelineEl.innerHTML = '';
    auditTrail.slice(0, 10).forEach((entry) => {
      const li = document.createElement('li');
      li.className = 'z-rule-item';
      li.textContent = `${formatTime(entry.timestamp)} - ${entry.message}`;
      timelineEl.appendChild(li);
    });
  }

  function renderWisdom() {
    if (!wisdomEl) return;
    const note = window.ZWisdomRing?.getLatestSuggestion?.();
    if (!note) {
      wisdomEl.textContent = 'No wisdom notes yet.';
      if (wisdomStampEl) wisdomStampEl.textContent = '';
      return;
    }
    wisdomEl.textContent = note.message || 'Wisdom note recorded.';
    if (wisdomStampEl) {
      wisdomStampEl.textContent = note.t ? new Date(note.t).toLocaleTimeString() : '';
    }
  }

  function renderRules() {
    ruleListEl.innerHTML = '';
    ruleSet.forEach((rule) => {
      const li = document.createElement('li');
      li.className = 'z-rule-item';
      li.innerHTML = `<span class="z-rule-id">${rule.id}</span> ${rule.name}`;
      ruleListEl.appendChild(li);
    });
    if (ruleCountEl) ruleCountEl.textContent = `(${ruleSet.length})`;
  }

  function formatIssueTitle(issue, fallback) {
    return issue.message || issue.title || issue.rule || issue.code || fallback || 'Repeat issue';
  }

  async function refreshP1Blockers() {
    if (!p1ListEl) return;
    let report = { repeatIssues: [] };
    try {
      let resp = await fetch('/data/Z_codex_report.json', { cache: 'no-store' });
      if (!resp.ok) {
        resp = await fetch('/data/z_codex_report.json', { cache: 'no-store' });
      }
      if (resp.ok) report = await resp.json();
    } catch (err) {
      report = { repeatIssues: [] };
    }
    const repeaters = Array.isArray(report.ZRepeatIssues)
      ? report.ZRepeatIssues
      : Array.isArray(report.repeatIssues)
        ? report.repeatIssues
        : Array.isArray(report.ZIssues)
          ? report.ZIssues
          : [];
    const blockers = repeaters.map((issue, idx) => ({
      id: issue.ZCode || issue.code || issue.ZRule || issue.rule || issue.id || `repeat-${idx + 1}`,
      title: formatIssueTitle(issue, `repeat-${idx + 1}`),
    }));

    p1ListEl.innerHTML = '';
    if (!blockers.length) {
      const li = document.createElement('li');
      li.className = 'z-muted';
      li.textContent = 'None';
      p1ListEl.appendChild(li);
    } else {
      blockers.slice(0, 5).forEach((blocker) => {
        const li = document.createElement('li');
        li.className = 'z-rule-item';
        li.textContent = `${blocker.id} - ${blocker.title}`;
        p1ListEl.appendChild(li);
      });
    }
    if (p1CountEl) p1CountEl.textContent = `(${blockers.length})`;
  }

  function updateStatus() {
    const energyState =
      window.ZEnergyResponse && window.ZEnergyResponse.getState
        ? window.ZEnergyResponse.getState()
        : null;
    const emotionState =
      window.ZEmotionFilter && window.ZEmotionFilter.getEmotionalState
        ? window.ZEmotionFilter.getEmotionalState()
        : null;

    const load = energyState ? energyState.load : null;
    const coherence = emotionState ? emotionState.coherence : null;
    const energy = energyState ? energyState.energy : null;
    const harmony = energyState ? energyState.harmony : null;

    const classification = classifyRisk(load, coherence);
    const governor = governorState(load, coherence);

    if (!initialized) {
      lastRiskClass = classification.riskClass;
      lastConsent = classification.consent;
      initialized = true;
    } else {
      if (classification.riskClass !== lastRiskClass && classification.riskClass !== 'unknown') {
        const level =
          classification.riskClass === 'high' || classification.riskClass === 'sacred'
            ? 'error'
            : 'warn';
        logAudit(`Risk class changed to ${classification.riskClass}`, level);
        lastRiskClass = classification.riskClass;
      }
      if (classification.consent !== lastConsent && classification.riskClass !== 'unknown') {
        logAudit(`Consent gate set to ${classification.consent}`, 'info');
        lastConsent = classification.consent;
      }
    }

    riskEl.textContent = classification.riskClass;
    riskEl.className = `z-badge z-risk-${classification.riskClass}`;
    consentEl.textContent = classification.consent;
    if (aiEl) aiEl.textContent = 'observe / suggest';
    if (humanEl) humanEl.textContent = 'available';
    if (governorEl) governorEl.textContent = governor;
    if (sepcEl) sepcEl.textContent = 'active';
    if (companionEl) companionEl.textContent = 'SKK + RKPK';
    if (resolutionEl) resolutionEl.textContent = 'de-escalation first';
    if (listeningEl) {
      const listening = window.ZConsent?.listening ? 'on' : 'off';
      listeningEl.textContent = listening;
    }
    if (whisperEl) {
      const whisper = window.ZConsent?.voiceWhisper ? 'on' : 'off';
      whisperEl.textContent = whisper;
    }
    if (snapshotEl) {
      snapshotEl.textContent = `E:${formatNumber(energy)} H:${formatNumber(harmony)} C:${formatNumber(
        coherence
      )} L:${formatNumber(load)}`;
    }
  }

  function init() {
    renderRules();
    logAudit('Governance HUD online', 'info');
    updateStatus();
    refreshP1Blockers();
    renderWisdom();
    setInterval(updateStatus, 2000);
    setInterval(refreshP1Blockers, 15000);
    setInterval(renderWisdom, 20000);
    renderTimeline();
  }

  if (silenceBtn) {
    silenceBtn.addEventListener('click', () => {
      localStorage.setItem('zCompanionMute', 'true');
      if (window.ZLayoutOS?.setVoiceWhisper) {
        window.ZLayoutOS.setVoiceWhisper(false);
      }
      if (window.ZLayoutOS?.setVoiceControlEnabled) {
        window.ZLayoutOS.setVoiceControlEnabled(false);
      } else {
        localStorage.setItem('zVoiceControlEnabled', '0');
      }
      updateStatus();
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener('click', () => exportSnapshot());
  }

  init();

  return {
    logAudit,
    getState: () => ({
      riskClass: lastRiskClass,
      consent: lastConsent,
    }),
  };
})();

window.ZGovernanceHUD = ZGovernanceHUD;
