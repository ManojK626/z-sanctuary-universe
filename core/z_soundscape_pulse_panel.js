// Z: core/z_soundscape_pulse_panel.js
// Reads z_soundscape_posture.json and renders in Z-Living Pulse panel + optional soft CSS theme hints.
(function () {
  const bodyEl = document.getElementById('zSoundscapePostureBody');
  const meterFill = document.getElementById('zSoundscapeMeterFill');
  if (!bodyEl) return;

  const REPORT = '/data/reports/z_soundscape_posture.json';

  function badgeClass(status) {
    const s = String(status || '').toLowerCase();
    if (s === 'green') return 'z-autorun-ok';
    if (s === 'hold') return 'z-autorun-warn';
    return 'z-autorun-critical';
  }

  function isReducedMotion() {
    return (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  function applyVisualHints(report) {
    const root = document.documentElement;
    const reduced = isReducedMotion();
    if (reduced) {
      root.style.removeProperty('--z-soundscape-glow');
      root.style.removeProperty('--z-soundscape-glow-secondary');
      root.style.removeProperty('--z-soundscape-pulse-period');
      if (meterFill) meterFill.style.animation = 'none';
      return;
    }
    const v = report?.visual || {};
    const neon = v.neon_glow || {};
    if (neon.primary) root.style.setProperty('--z-soundscape-glow', neon.primary);
    if (neon.secondary) root.style.setProperty('--z-soundscape-glow-secondary', neon.secondary);
    const period = Number(v.pulse_period_sec);
    if (Number.isFinite(period) && period > 0) {
      root.style.setProperty('--z-soundscape-pulse-period', `${period}s`);
    }
    if (meterFill) {
      meterFill.style.animation = `z-soundscape-meter-breathe ${period || 2}s ease-in-out infinite`;
    }
  }

  async function loadJson(url) {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  }

  function render(report) {
    if (!report) {
      bodyEl.innerHTML =
        '<div class="z-muted">Soundscape: run task <b>Z: Soundscape Posture</b> (<code>node scripts/z_soundscape_posture.mjs</code>).</div>';
      if (meterFill) {
        meterFill.style.width = '0%';
        meterFill.style.animation = 'none';
      }
      return;
    }

    const vit = report.vitality_score ?? '—';
    const posture = report.organism_posture || '—';
    const mode = report.acoustic_mode || '—';
    const tier = report.soundscape_tier || '—';
    const st = report.status || 'unknown';

    bodyEl.innerHTML = `
      <div style="margin-bottom:0.35rem;">
        Posture: <span class="z-autorun-badge ${badgeClass(st)}">${String(st).toUpperCase()}</span>
        · Vitality <b>${vit}</b>/100
      </div>
      <div class="z-muted">Organism: <b>${posture}</b> · Mode: <b>${mode}</b> · Tier: <b>${tier}</b></div>
      <div class="z-muted" style="margin-top:0.35rem;font-size:0.72rem;">
        Z-ACG: passive (owl) + active (dolphin) signals from existing reports — see
        <a href="../../docs/Z-ACOUSTIC-LIVING-PULSE-ARCHITECTURE.md" target="_blank" rel="noopener">architecture</a>.
      </div>
    `;

    if (meterFill) {
      let pct = typeof vit === 'number' ? vit : 50;
      const live = window.ZSoundscapeAudio;
      if (!isReducedMotion() && live && live.active && typeof live.rms === 'number') {
        pct = pct * 0.5 + live.rms * 100 * 0.5;
      }
      meterFill.style.width = `${Math.max(8, Math.min(100, pct))}%`;
    }
    applyVisualHints(report);
  }

  async function refresh() {
    try {
      const report = await loadJson(REPORT);
      render(report);
    } catch {
      render(null);
    }
  }

  function updateMeterFromLive() {
    if (!meterFill || isReducedMotion()) return;
    const live = window.ZSoundscapeAudio;
    if (live && live.active && typeof live.rms === 'number') {
      const pct = Math.max(8, Math.min(100, live.rms * 100));
      meterFill.style.width = pct + '%';
    }
  }

  refresh();
  setInterval(refresh, 60_000);
  setInterval(updateMeterFromLive, 200);
})();
