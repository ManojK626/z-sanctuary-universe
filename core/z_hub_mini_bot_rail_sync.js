// Z: core/z_hub_mini_bot_rail_sync.js
// Canonical hub mini-bot rail: AWARENESS, SYNC, HEALTH, DECISION, EXECUTION, GUARDIAN, ALERTS from /data/reports/z_bot_*.json.
// Removes duplicate .edge-status-badge copies elsewhere in #zTopTabContainer (same class of issue as extra GUARDIAN/ALERTS).
(function () {
  const rail = document.getElementById('zTopTabContainer');
  if (!rail) return;

  const CANONICAL_BADGE_IDS = new Set([
    'zHubAwarenessMiniBadge',
    'zHubSyncMiniBadge',
    'zHubHealthMiniBadge',
    'zHubDecisionMiniBadge',
    'zHubExecutionMiniBadge',
    'zHubQosmeiMiniBadge',
    'zHubSpiMiniBadge',
    'zHubAdaptiveLearnMiniBadge',
    'zHubCrossSystemMiniBadge',
    'zHubPredictiveMiniBadge',
    'zHubPredValMiniBadge',
    'zHubGuardianMiniBadge',
    'zHubAlertsMiniBadge',
  ]);

  const HUB_BADGE_PREFIXES = [
    /^AW:/i,
    /^AWARENESS:/i,
    /^SYNC:/i,
    /^HLT:/i,
    /^HEALTH:/i,
    /^DC:/i,
    /^DEC:/i,
    /^DECISION:/i,
    /^EX:/i,
    /^EXECUTION:/i,
    /^QO:/i,
    /^QOSMEI:/i,
    /^SP:/i,
    /^SPI:/i,
    /^AL:/i,
    /^CS:/i,
    /^PR:/i,
    /^PV:/i,
    /^GRD:/i,
    /^GUARDIAN:/i,
    /^ALT:/i,
    /^ALERTS:/i,
  ];

  function setBadgeTone(el, tone) {
    el.classList.remove('edge-status-good', 'edge-status-warn', 'edge-status-bad');
    if (tone === 'good') el.classList.add('edge-status-good');
    else if (tone === 'warn') el.classList.add('edge-status-warn');
    else el.classList.add('edge-status-bad');
  }

  function removeDuplicateHubBadges() {
    rail.querySelectorAll('.edge-status-badge').forEach((el) => {
      if (CANONICAL_BADGE_IDS.has(el.id)) return;
      const raw = el.textContent.trim();
      for (let i = 0; i < HUB_BADGE_PREFIXES.length; i += 1) {
        if (HUB_BADGE_PREFIXES[i].test(raw)) {
          el.remove();
          return;
        }
      }
    });
  }

  function pendingDecisionCount(decisionsPayload) {
    const list = Array.isArray(decisionsPayload?.decisions) ? decisionsPayload.decisions : [];
    return list.filter((d) => String(d?.status || '').toLowerCase() === 'pending').length;
  }

  async function fetchJson(path) {
    try {
      const res = await fetch(path, { cache: 'no-store' });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  async function sync() {
    const awarenessEl = document.getElementById('zHubAwarenessMiniBadge');
    const syncEl = document.getElementById('zHubSyncMiniBadge');
    const healthEl = document.getElementById('zHubHealthMiniBadge');
    const decisionEl = document.getElementById('zHubDecisionMiniBadge');
    const executionEl = document.getElementById('zHubExecutionMiniBadge');
    const qosmeiEl = document.getElementById('zHubQosmeiMiniBadge');
    const spiEl = document.getElementById('zHubSpiMiniBadge');
    const alEl = document.getElementById('zHubAdaptiveLearnMiniBadge');
    const csEl = document.getElementById('zHubCrossSystemMiniBadge');
    const prEl = document.getElementById('zHubPredictiveMiniBadge');
    const pvEl = document.getElementById('zHubPredValMiniBadge');
    const gBadge = document.getElementById('zHubGuardianMiniBadge');
    const aBadge = document.getElementById('zHubAlertsMiniBadge');
    if (!awarenessEl || !syncEl || !healthEl || !decisionEl || !executionEl || !qosmeiEl || !spiEl || !alEl || !csEl || !prEl || !pvEl || !gBadge || !aBadge) return;

    const [g, a, health, sync, decisions, execution, qosmei, spi, al, cross, pred, pval] = await Promise.all([
      fetchJson('/data/reports/z_bot_guardian.json'),
      fetchJson('/data/reports/z_bot_alerts.json'),
      fetchJson('/data/reports/z_bot_health.json'),
      fetchJson('/data/reports/z_bot_sync.json'),
      fetchJson('/data/reports/z_bot_decisions.json'),
      fetchJson('/data/reports/z_bot_execution_result.json'),
      fetchJson('/data/reports/z_qosmei_core_signal.json'),
      fetchJson('/data/reports/z_structural_patterns.json'),
      fetchJson('/data/reports/z_adaptive_learning_state.json'),
      fetchJson('/data/reports/z_cross_system_learning.json'),
      fetchJson('/data/reports/z_predictive_intelligence.json'),
      fetchJson('/data/reports/z_prediction_validation.json'),
    ]);

    removeDuplicateHubBadges();

    const missing = g ? Number(g?.summary?.missing ?? 0) : null;
    const totalAlerts =
      a && typeof a.total_alerts === 'number'
        ? Number(a.total_alerts)
        : a && Array.isArray(a.alerts)
          ? a.alerts.length
          : null;
    const pending = decisions ? pendingDecisionCount(decisions) : null;

    let attentionSignals = 0;
    if (missing !== null && missing > 0) attentionSignals += 1;
    if (totalAlerts !== null && totalAlerts > 0) attentionSignals += 1;
    if (pending !== null && pending > 0) attentionSignals += 1;

    if (g === null || a === null || decisions === null) {
      awarenessEl.textContent = 'AW:n/a';
      awarenessEl.title =
        'Need guardian, alerts, and decisions JSON — serve hub root and run npm run bot:awareness (or bot:guardian, bot:alerts, bot:decision).';
      setBadgeTone(awarenessEl, 'warn');
    } else {
      awarenessEl.textContent =
        attentionSignals > 0 ? `AW:${attentionSignals}` : 'AW:OK';
      awarenessEl.title = `Signal categories needing attention: guardian paths missing (${missing}), rollup alerts (${totalAlerts}), pending decisions (${pending}).`;
      if (attentionSignals === 0) setBadgeTone(awarenessEl, 'good');
      else if (attentionSignals === 1) setBadgeTone(awarenessEl, 'warn');
      else setBadgeTone(awarenessEl, 'bad');
    }

    if (!sync) {
      syncEl.textContent = 'SYNC:n/a';
      syncEl.title = 'Missing data/reports/z_bot_sync.json — npm run bot:sync from hub root.';
      setBadgeTone(syncEl, 'warn');
    } else {
      const ok = Boolean(sync.copied);
      syncEl.textContent = ok ? 'SYNC:OK' : 'SYNC:—';
      syncEl.title = `Registry snapshot — ${sync.latest_snapshot_dir || 'see z_bot_sync.json'}`;
      setBadgeTone(syncEl, ok ? 'good' : 'warn');
    }

    if (!health) {
      healthEl.textContent = 'HLT:n/a';
      healthEl.title = 'Missing data/reports/z_bot_health.json — npm run bot:health';
      setBadgeTone(healthEl, 'warn');
    } else {
      const pct = Number(health?.memory?.used_pct);
      const p = Number.isFinite(pct) ? Math.round(pct * 10) / 10 : null;
      if (p === null) {
        healthEl.textContent = 'HLT:—';
        healthEl.title = 'z_bot_health.json has no memory.used_pct';
        setBadgeTone(healthEl, 'warn');
      } else if (p < 80) {
        healthEl.textContent = 'HLT:OK';
        healthEl.title = `Memory ~${p}% (z_bot_health.json)`;
        setBadgeTone(healthEl, 'good');
      } else if (p < 92) {
        healthEl.textContent = `HLT:${p}%`;
        healthEl.title = 'Memory watch band (z_bot_health.json)';
        setBadgeTone(healthEl, 'warn');
      } else {
        healthEl.textContent = `HLT:${p}%`;
        healthEl.title = 'High memory use (z_bot_health.json)';
        setBadgeTone(healthEl, 'bad');
      }
    }

    if (!decisions) {
      decisionEl.textContent = 'DC:n/a';
      decisionEl.title = 'Missing data/reports/z_bot_decisions.json — npm run bot:decision';
      setBadgeTone(decisionEl, 'warn');
    } else {
      const pend = pendingDecisionCount(decisions);
      decisionEl.textContent = pend > 0 ? `DC:${pend}` : 'DC:OK';
      decisionEl.title = `Pending governance decisions: ${pend} (z_bot_decisions.json)`;
      setBadgeTone(decisionEl, pend > 0 ? 'warn' : 'good');
    }

    if (!execution) {
      executionEl.textContent = 'EX:n/a';
      executionEl.title = 'Missing data/reports/z_bot_execution_result.json — npm run bot:execution:preview (or chain bot:awareness)';
      setBadgeTone(executionEl, 'warn');
    } else {
      const ok = Boolean(execution?.last_run?.ok);
      executionEl.textContent = ok ? 'EX:OK' : 'EX:FAIL';
      executionEl.title = execution?.last_run?.summary || 'z_bot_execution_result.json';
      setBadgeTone(executionEl, ok ? 'good' : 'bad');
    }

    if (!qosmei) {
      qosmeiEl.textContent = 'QO:n/a';
      qosmeiEl.title = 'Missing data/reports/z_qosmei_core_signal.json — npm run qosmei:signal';
      setBadgeTone(qosmeiEl, 'warn');
    } else {
      const score = Number(qosmei?.score?.composite);
      const posture = String(qosmei?.posture || '').toLowerCase();
      const lane = String(qosmei?.lane_priority || 'unknown');
      if (!Number.isFinite(score)) {
        qosmeiEl.textContent = 'QO:—';
        qosmeiEl.title = 'QOSMEI report present but score.composite is missing';
        setBadgeTone(qosmeiEl, 'warn');
      } else {
        qosmeiEl.textContent = score >= 75 ? 'QO:OK' : `QO:${Math.round(score)}`;
        qosmeiEl.title = `QOSMEI posture=${posture || 'unknown'} lane=${lane} score=${Math.round(score)} (z_qosmei_core_signal.json)`;
        if (score >= 75) setBadgeTone(qosmeiEl, 'good');
        else if (score >= 50) setBadgeTone(qosmeiEl, 'warn');
        else setBadgeTone(qosmeiEl, 'bad');
      }
    }

    if (!spi) {
      spiEl.textContent = 'SP:n/a';
      spiEl.title = 'Missing data/reports/z_structural_patterns.json — npm run spi:analyze';
      setBadgeTone(spiEl, 'warn');
    } else {
      const phase = String(spi?.system_phase || '').toLowerCase();
      const evo = String(spi?.evolution_phase || '').toLowerCase();
      const label =
        phase === 'optimized'
          ? 'SP:OPT'
          : phase === 'unstable'
            ? 'SP:!'
            : phase === 'learning'
              ? 'SP:LRN'
              : phase === 'stabilizing'
                ? 'SP:STB'
                : 'SP:—';
      let suffix = '';
      if (phase === 'optimized' && evo === 'baseline') suffix = '\u26A1';
      else if (phase === 'stabilizing') suffix = '~';
      else if (phase === 'learning') suffix = '\u2026';
      else if (phase === 'unstable') suffix = '\u26A0';
      spiEl.textContent = label + suffix;
      const sug0 = Array.isArray(spi?.decision_suggestions) ? spi.decision_suggestions[0] : null;
      const sugLine = sug0
        ? `Suggested: ${sug0.suggested_action} (${Math.round((sug0.confidence || 0) * 100)}%) — ${sug0.reason}`
        : spi?.top_note || 'z_structural_patterns.json';
      spiEl.title = `SPI phase=${phase || 'unknown'} evolution=${evo || 'n/a'} score=${spi?.structural_patterns_score ?? 'n/a'} risk=${spi?.risk_band ?? 'n/a'}. ${sugLine}`;
      if (phase === 'optimized') setBadgeTone(spiEl, 'good');
      else if (phase === 'unstable') setBadgeTone(spiEl, 'bad');
      else if (phase === 'learning') setBadgeTone(spiEl, 'warn');
      else setBadgeTone(spiEl, 'warn');
    }

    if (!al) {
      alEl.textContent = 'AL:n/a';
      alEl.title = 'Missing data/reports/z_adaptive_learning_state.json (optional Phase 3)';
      setBadgeTone(alEl, 'warn');
    } else {
      const cyc = Number(al?.learning_cycles);
      const wv = al?.weights && typeof al.weights === 'object' ? al.weights : {};
      const devs = Object.values(wv)
        .map((x) => (Number.isFinite(Number(x)) ? Math.abs(Number(x) - 1) : 0))
        .filter((d) => d > 0.0001);
      const maxD = devs.length ? Math.max.apply(null, devs) : 0;
      let label = 'AL:stb';
      if (!Number.isFinite(cyc) || cyc < 1) label = 'AL:off';
      else if (maxD > 0.02) label = 'AL:adj';
      alEl.textContent = label;
      alEl.title = `Adaptive learning cycles=${Number.isFinite(cyc) ? cyc : 0} max|w-1|≈${(maxD * 100).toFixed(0)}% — z_adaptive_learning_state.json (delete to reset)`;
      if (label === 'AL:stb' || label === 'AL:off') setBadgeTone(alEl, 'good');
      else setBadgeTone(alEl, 'warn');
    }

    if (!cross?.schema_version) {
      csEl.textContent = 'CS:n/a';
      csEl.title = 'Missing data/reports/z_cross_system_learning.json — npm run cross:system (after qosmei:signal)';
      setBadgeTone(csEl, 'warn');
    } else {
      const st = String(cross?.alignment?.status || '').toLowerCase();
      const conf = cross?.alignment?.confidence;
      let label = 'CS:—';
      if (st === 'aligned') label = 'CS:OK';
      else if (st === 'partial') label = 'CS:~';
      else if (st === 'conflict') label = 'CS:!';
      csEl.textContent = label;
      csEl.title = `Cross-system: ${st || 'unknown'} · confidence=${conf ?? 'n/a'} · z_cross_system_learning.json (advisory)`;
      if (st === 'aligned') setBadgeTone(csEl, 'good');
      else if (st === 'conflict') setBadgeTone(csEl, 'bad');
      else setBadgeTone(csEl, 'warn');
    }

    if (!pred?.schema_version) {
      prEl.textContent = 'PR:n/a';
      prEl.title = 'Missing data/reports/z_predictive_intelligence.json — npm run predictive:intel (after cross:system)';
      setBadgeTone(prEl, 'warn');
    } else {
      const highRisk = Number(pred?.summary?.high_risk_predictions ?? 0);
      const topC = Number(pred?.summary?.highest_confidence);
      const dom = String(pred?.summary?.dominant_signal || '');
      const capOn = pred?.learning_cycles != null && Number(pred.learning_cycles) < 20;
      const riskyDom =
        dom === 'drift_incoming' ||
        dom === 'phantom_risk' ||
        dom === 'likely_reopen' ||
        dom === 'over_control_risk';
      let plabel = 'PR:OK';
      if (highRisk > 0 || riskyDom) plabel = 'PR:!';
      else if (capOn || !Number.isFinite(topC) || topC < 0.6) plabel = 'PR:~';
      prEl.textContent = plabel;
      prEl.title = `Predictive foresight based on real learning cycles — n=${pred?.summary?.predictions_n ?? 0} top≈${Number.isFinite(topC) ? topC : 'n/a'} dominant=${dom || 'n/a'} · z_predictive_intelligence.json (advisory)`;
      if (plabel === 'PR:OK') setBadgeTone(prEl, 'good');
      else if (plabel === 'PR:~') setBadgeTone(prEl, 'warn');
      else setBadgeTone(prEl, 'bad');
    }

    if (!pval?.schema_version) {
      pvEl.textContent = 'PV:n/a';
      pvEl.title = 'Missing data/reports/z_prediction_validation.json — npm run prediction:validate (after predictive:intel)';
      setBadgeTone(pvEl, 'warn');
    } else {
      const vN = Number(pval?.validation_summary?.validated);
      const acc = Number(pval?.validation_summary?.accuracy);
      const aln = String(pval?.confidence_alignment || '');
      if (!Number.isFinite(vN) || vN < 2) {
        pvEl.textContent = 'PV:n/a';
        pvEl.title = `Not enough validation rows yet (n=${Number.isFinite(vN) ? vN : 0}) — z_prediction_validation.json`;
        setBadgeTone(pvEl, 'warn');
      } else if (!Number.isFinite(acc)) {
        pvEl.textContent = 'PV:—';
        pvEl.title = 'z_prediction_validation.json present but accuracy missing';
        setBadgeTone(pvEl, 'warn');
      } else {
        let plv = 'PV:OK';
        if (acc < 0.5) plv = 'PV:!';
        else if (acc < 0.7) plv = 'PV:~';
        pvEl.textContent = plv;
        pvEl.title = `Prediction vs reality: accuracy≈${(acc * 100).toFixed(0)}% · ${vN} scored in history · trend=${pval?.trend || 'n/a'} · ${aln} — advisory`;
        if (plv === 'PV:OK') setBadgeTone(pvEl, 'good');
        else if (plv === 'PV:~') setBadgeTone(pvEl, 'warn');
        else setBadgeTone(pvEl, 'bad');
      }
    }

    if (!g) {
      gBadge.textContent = 'GRD:n/a';
      gBadge.title =
        'Could not load data/reports/z_bot_guardian.json — serve ZSanctuary_Universe as Live Server root; npm run bot:guardian';
      setBadgeTone(gBadge, 'warn');
    } else {
      const m = Number(g?.summary?.missing ?? 0);
      gBadge.textContent = m > 0 ? `GRD:${m}` : 'GRD:OK';
      gBadge.title =
        m > 0
          ? `GUARDIAN: ${m} path(s) missing on disk (z_bot_guardian.json)`
          : 'PC-root registry vs disk — data/reports/z_bot_guardian.json';
      setBadgeTone(gBadge, m > 0 ? 'bad' : 'good');
    }

    if (!a) {
      aBadge.textContent = 'ALT:n/a';
      aBadge.title =
        'Could not load data/reports/z_bot_alerts.json — serve hub root; npm run bot:alerts';
      setBadgeTone(aBadge, 'warn');
    } else {
      const ta = typeof a.total_alerts === 'number' ? Number(a.total_alerts) : Array.isArray(a.alerts) ? a.alerts.length : 0;
      const high = Number(a?.by_level?.HIGH || 0);
      if (ta > 0) {
        aBadge.textContent = `ALT:${ta}`;
        aBadge.title = 'Notify-only rollup — data/reports/z_bot_alerts.json';
        setBadgeTone(aBadge, high > 0 ? 'bad' : 'warn');
      } else {
        aBadge.textContent = 'ALT:—';
        aBadge.title =
          'No rollup alerts in alerts[]. Registry drift is on GUARDIAN; folded alerts live in z_bot_alerts.json input_notes if any.';
        setBadgeTone(aBadge, 'good');
      }
    }
  }

  function boot() {
    sync();
    requestAnimationFrame(() => sync());
    setTimeout(sync, 2000);
    setInterval(sync, 12_000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
