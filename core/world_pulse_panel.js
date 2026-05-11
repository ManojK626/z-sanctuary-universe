// Z: core\world_pulse_panel.js
(function () {
  /**
   * Living Workspace Tag: World Pulse Panel
   * Description: renders the world pulse signals and Safe Pack + Harisha chips.
   */
  const PANEL_ID = 'zWorldPulsePanel';
  function createPanel() {
    if (document.getElementById(PANEL_ID)) return;
    const panel = document.createElement('div');
    panel.id = PANEL_ID;
    panel.style.cssText =
      'position:relative;padding:10px 12px;margin:10px;background:rgba(12,15,20,0.9);color:#edf4ff;font-family:"Inter",Segoe UI,sans-serif;font-size:12px;border-radius:10px;max-width:360px;';
    panel.innerHTML = `
      <div style="font-weight:600;margin-bottom:6px;">🌍 World Pulse (Observational) <span id="zWorldPulseStillness" style="font-size:10px;opacity:0.6;">Stillness: --</span></div>
      <div id="zRingCubeStatus" style="margin-bottom:6px;font-size:11px;opacity:0.75;">ZKairoCell: -- · WorldPulse: --</div>
      <div id="zWorldPulseContent">Waiting for signals…</div>
      <div id="zWorldPulseWebhook" style="margin-top:6px;font-size:11px;opacity:0.7;">No webhook events yet</div>
      <div id="zWorldPulseSafePack" style="margin-top:4px;font-size:11px;opacity:0.7;">Safe Pack status idle</div>
      <div id="zWorldPulseQuiet" style="margin-top:4px;font-size:11px;opacity:0.7;">Quiet mode: unknown</div>
      <div id="harishaChip" style="margin-top:4px;font-size:11px;opacity:0.7;">Harisha score pending</div>
    `;
    document.body.appendChild(panel);
  }
  function render(snapshot) {
    const container = document.getElementById('zWorldPulseContent');
    if (!container) return;
    const rows = snapshot.signals
      .map((sig) => {
        const pct = Math.round(sig.intensity * 100);
        return `<div style="display:flex;justify-content:space-between;margin:2px 0;"><span>${sig.topic}</span><span style="opacity:0.7;">${pct}%</span></div>`;
      })
      .join('');
    container.innerHTML = `<div style="opacity:0.6;font-size:11px;margin-bottom:4px;">${snapshot.ts}</div>${rows}`;
  }
  function buildHarishaTooltip(score = 100, state = 'calm', action = 'Observe with caution') {
    const prompt =
      score >= 80
        ? 'Harisha calm — proceed with standard observation.'
        : score >= 60
          ? 'Harisha attentive — stay in observe mode or safe actions.'
          : score >= 40
            ? 'Harisha tense — limit to read-only review.'
            : 'Harisha critical — pause and stabilize before acting.';
    return `Harisha score ${score} (${state}) → ${prompt} Action context: ${action}.`;
  }

  function updateHarishaTooltip(action = 'Observe context only') {
    const chip = document.getElementById('harishaChip');
    const score = lastHarisha.score ?? window.ZHarisha?.getScore?.();
    const state = lastHarisha.state ?? 'calm';
    if (chip) {
      chip.title = buildHarishaTooltip(score, state, action);
    }
  }

  let lastHarisha = {};

  function hookChronicle() {
    if (!window.ZChronicle) return;
    const originalRecord = window.ZChronicle.record;
    window.ZChronicle.record = function (entry) {
      originalRecord.call(this, entry);
      if (entry.module === 'world_pulse' && entry.meta) {
        render({ ts: entry.ts || new Date().toISOString(), signals: [entry.meta] });
      }
      if (entry.source === 'safe_pack' || entry.type?.startsWith('z.safe_pack')) {
        const summary = document.getElementById('zWorldPulseWebhook');
        if (summary) {
          summary.textContent = `${entry.type || entry.event || 'safe_pack'} status ${entry.pack?.status || 'ok'} (${entry.pack?.rule || entry.module || 'n/a'})`;
          summary.title = buildHarishaTooltip(
            lastHarisha.score,
            lastHarisha.state,
            'Safe Pack activity'
          );
        }
        const chip = document.getElementById('zWorldPulseSafePack');
        if (chip) {
          chip.textContent = `Safe Pack webhook ${entry.pack?.status || 'ok'} @ ${new Date(entry.ts || Date.now()).toLocaleTimeString()}`;
          chip.title = buildHarishaTooltip(
            lastHarisha.score,
            lastHarisha.state,
            'Safe Pack webhook'
          );
        }
      }
      if (entry.event === 'harisha.score' && entry.payload) {
        const harisha = document.getElementById('harishaChip');
        if (harisha) {
          harisha.textContent = `Harisha score ${entry.payload.score}`;
          harisha.className = `harisha-chip harisha-${entry.payload.score >= 80 ? 'calm' : entry.payload.score >= 60 ? 'alert' : entry.payload.score >= 40 ? 'tense' : 'critical'}`;
          lastHarisha = { score: entry.payload.score, state: entry.payload.state || 'calm' };
          updateHarishaTooltip('Monitor current pulse');
        }
      }
    };
  }

  async function refreshQuietMode() {
    const quiet = document.getElementById('zWorldPulseQuiet');
    const stillness = document.getElementById('zWorldPulseStillness');
    if (!quiet) return;
    if (window.ZQuietModeChip?.refresh) {
      window.ZQuietModeChip.refresh();
    }
    try {
      const urls = [
        '../Amk_Goku Worldwide Loterry/data/reports/system_status.json',
        '../Amk_Goku%20Worldwide%20Loterry/data/reports/system_status.json',
      ];
      let status = null;
      for (const url of urls) {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) continue;
        status = await res.json();
        break;
      }
      if (!status) return;
      const active = Boolean(status?.quiet_mode?.active);
      quiet.textContent = `Quiet mode: ${active ? 'active' : 'inactive'}`;
      quiet.title = `Reason: ${status?.quiet_mode?.reason || 'n/a'}`;
      if (stillness) {
        stillness.textContent = `Stillness: ${active ? 'active' : 'inactive'}`;
        stillness.title = `Reason: ${status?.quiet_mode?.reason || 'n/a'}`;
      }
    } catch {
      quiet.textContent = 'Quiet mode: unknown';
      if (stillness) stillness.textContent = 'Stillness: unknown';
    }
  }
  window.ZWorldPulsePanel = {
    setRuntimeStatus(payload = {}) {
      const el = document.getElementById('zRingCubeStatus');
      if (!el) return;
      const kairo = payload.kairoBound ? 'bound' : 'missing';
      const pulse = payload.worldPulseRunning ? 'running' : 'stopped';
      el.textContent = `ZKairoCell: ${kairo} · WorldPulse: ${pulse}`;
    },
    init() {
      createPanel();
      hookChronicle();
      console.info('[WorldPulsePanel] Ready');
      updateHarishaTooltip('Ready for pulse updates');
      refreshQuietMode();
      setInterval(refreshQuietMode, 60000);
    },
  };
})();
