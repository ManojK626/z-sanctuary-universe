// Z: core\ai_tower\z_super_ghost.js
// Super Ghost insight engine (AMK Goku personality map + autopilot data).
(function () {
  const STORAGE_KEY = 'zSuperGhostInsights';
  const REGISTER_ID = 'insight-lab';
  let lastInsight = null;

  function registerModule() {
    if (!window.ZModuleRegistry) return;
    window.ZModuleRegistry.register({
      id: REGISTER_ID,
      layer: 'insight',
      owner: 'SKK+RKPK',
      status: 'online',
      description: 'Super Ghost intelligence: micro details → macro wisdom.',
      chainTo: ['autopilot-replay', 'governance-report'],
    });
  }

  function readReplay() {
    if (!window.ZAutopilotReplay?.all) return [];
    return window.ZAutopilotReplay.all();
  }

  function getMetrics() {
    return (
      window.ZSystemMetrics?.get?.() || {
        stress: 0.35,
        load: 0.45,
        risk: 0.3,
        harmony: 0.62,
      }
    );
  }

  function computeSummary(replay) {
    if (!replay.length) return 'No replay events recorded yet.';
    const last = replay[replay.length - 1];
    return `Last action: ${last.action} (${last.value || 'no value'}) at ${new Date(last.t).toLocaleTimeString()}.`;
  }

  function computeCommonActions(replay) {
    const tally = {};
    replay.forEach((event) => {
      const key = event.action || 'unknown';
      tally[key] = (tally[key] || 0) + 1;
    });
    return Object.entries(tally)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([action, count]) => ({ action, count }));
  }

  function computeDriftWarning() {
    const trends = window.ZChainHistory?.getTrendWarnings?.() || [];
    const rising = trends.filter((entry) => entry.trend === 'rising');
    if (!rising.length) return 'Ethics drift is not detected.';
    return `Ethics watch: ${rising
      .slice(0, 2)
      .map((entry) => `${entry.id} trending up`)
      .join('; ')}.`;
  }

  function buildWeeklyReflection() {
    const memory = window.Z_LENS_MEMORY || {
      calm: { accepted: 0, dismissed: 0 },
      focus: { accepted: 0, dismissed: 0 },
      governance: { accepted: 0, dismissed: 0 },
    };
    if (!memory.calm && !memory.focus && !memory.governance) {
      return 'No lens interactions to reflect on yet.';
    }
    const calmScore = memory.calm.accepted - memory.calm.dismissed;
    const focusScore = memory.focus.accepted - memory.focus.dismissed;
    const governanceScore = memory.governance.accepted - memory.governance.dismissed;
    if (calmScore >= focusScore && calmScore >= governanceScore) {
      return 'Calm was accepted most often this week—stability held longer.';
    }
    if (governanceScore >= calmScore && governanceScore >= focusScore) {
      return 'Governance interventions dominated this week—caution kept the system stable.';
    }
    return 'Focus was chosen more than the other lenses—attention shaped the flow.';
  }

  function generateInsight(reason = 'scheduled') {
    const replay = readReplay();
    const chainHeat = window.ZChainHistory?.getWeeklyHeatSummary?.() || [];
    const trends = window.ZChainHistory?.getTrendWarnings?.() || [];
    const metrics = getMetrics();
    const actions = computeCommonActions(replay);
    const summary = computeSummary(replay);

    const insight = {
      id: `${Date.now()}-${reason}`,
      generatedAt: new Date().toISOString(),
      reason,
      summary,
      metrics,
      actions,
      chainHeat,
      trends,
      sample: replay.slice(-5),
      reflection: buildWeeklyReflection(),
      driftMessage: computeDriftWarning(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(insight));
    } catch (err) {
      // ignore storage issues
    }
    lastInsight = insight;
    if (window.ZInsightFeed?.push) {
      window.ZInsightFeed.push({
        id: insight.id,
        channel: 'insight',
        source: 'super-ghost',
        summary: insight.summary,
        metadata: {
          lens: window.Z_LENS_STATE?.mode || 'neutral',
          reason,
        },
      });
    }
    return insight;
  }

  function loadInsight() {
    if (lastInsight) return lastInsight;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        lastInsight = JSON.parse(raw);
        return lastInsight;
      }
    } catch (err) {
      // ignore parse errors
    }
    return generateInsight('init');
  }

  function schedule() {
    setInterval(() => {
      generateInsight('interval');
    }, 45000);
  }

  function init() {
    registerModule();
    loadInsight();
    schedule();
    if (document.readyState === 'complete') {
      window.ZModuleRegistry?.update(REGISTER_ID, { status: 'online' });
    }
  }

  window.ZSuperGhost = {
    generate: generateInsight,
    getInsight: loadInsight,
    last: () => lastInsight,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
