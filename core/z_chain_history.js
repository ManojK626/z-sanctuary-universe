// Z: core\z_chain_history.js
// Chain history: record edge heat over time and compute trends.
(function () {
  const STORAGE_KEY = 'zChainHistory';
  const MAX_ENTRIES = 240;
  const SNAPSHOT_INTERVAL_MS = 10 * 60 * 1000;

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      return [];
    }
  }

  function save(entries) {
    const trimmed = entries.slice(-MAX_ENTRIES);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch (err) {
      // Ignore storage failures.
    }
  }

  function clamp01(value) {
    return Math.max(0, Math.min(1, value));
  }

  function computeEdgeHeat(edge, metrics) {
    const stress = metrics.stress ?? 0.3;
    const load = metrics.load ?? 0.4;
    const risk = metrics.risk ?? 0.4;
    return clamp01((stress + load + risk) / 3);
  }

  function computeEthicsScore(edge) {
    const ethics = edge.ethics || {};
    const transparency = ethics.transparency ?? 0.7;
    const reversibility = ethics.reversibility ?? 0.7;
    const humanImpact = ethics.humanImpact ?? 0.7;
    const escalationRisk = ethics.escalationRisk ?? 0.4;
    const riskScore = 1 - escalationRisk;
    return clamp01((transparency + reversibility + humanImpact + riskScore) / 4);
  }

  function recordSnapshot(reason = 'interval') {
    const edges = window.ZChainRegistry?.getEdges?.() || [];
    const metrics = window.ZSystemMetrics?.get?.() || {};
    const snapshot = {
      t: Date.now(),
      reason,
      metrics,
      edges: edges.map((edge) => ({
        id: edge.id || `${edge.source}->${edge.target}`,
        source: edge.source,
        target: edge.target,
        heat: computeEdgeHeat(edge, metrics),
        ethics: computeEthicsScore(edge),
      })),
    };
    const history = load();
    history.push(snapshot);
    save(history);
    return snapshot;
  }

  function getHistory() {
    return load();
  }

  function getWeeklyHeatSummary() {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const history = load().filter((entry) => entry.t >= weekAgo);
    const map = {};
    history.forEach((entry) => {
      entry.edges.forEach((edge) => {
        const bucket = map[edge.id] || {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          values: [],
        };
        bucket.values.push(edge.heat);
        map[edge.id] = bucket;
      });
    });
    return Object.values(map).map((bucket) => {
      const avg = bucket.values.reduce((sum, v) => sum + v, 0) / bucket.values.length;
      const peak = Math.max(...bucket.values);
      return {
        id: bucket.id,
        source: bucket.source,
        target: bucket.target,
        avgHeat: Number.isFinite(avg) ? avg : 0,
        peakHeat: Number.isFinite(peak) ? peak : 0,
      };
    });
  }

  function getWeeklyBuckets(weeks = 4) {
    const now = Date.now();
    const buckets = [];
    for (let i = 0; i < weeks; i += 1) {
      const end = now - i * 7 * 24 * 60 * 60 * 1000;
      const start = end - 7 * 24 * 60 * 60 * 1000;
      buckets.push({ start, end });
    }
    return buckets.reverse();
  }

  function getTrendWarnings() {
    const history = load();
    const buckets = getWeeklyBuckets(4);
    const perEdge = {};
    history.forEach((entry) => {
      buckets.forEach((bucket, idx) => {
        if (entry.t < bucket.start || entry.t >= bucket.end) return;
        entry.edges.forEach((edge) => {
          if (!perEdge[edge.id]) {
            perEdge[edge.id] = {
              id: edge.id,
              source: edge.source,
              target: edge.target,
              buckets: [],
            };
          }
          perEdge[edge.id].buckets[idx] = perEdge[edge.id].buckets[idx] || [];
          perEdge[edge.id].buckets[idx].push(edge.heat);
        });
      });
    });

    const warnings = [];
    Object.values(perEdge).forEach((edge) => {
      const averages = edge.buckets.map((values) => {
        if (!values || !values.length) return null;
        return values.reduce((sum, v) => sum + v, 0) / values.length;
      });
      const valid = averages.filter((v) => v !== null);
      if (valid.length < 2) return;
      const first = valid[0];
      const last = valid[valid.length - 1];
      const slope = last - first;
      if (slope > 0.1) {
        warnings.push({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          trend: 'rising',
          slope,
        });
      } else if (slope < -0.1) {
        warnings.push({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          trend: 'falling',
          slope,
        });
      }
    });
    return warnings;
  }

  function playTimeline(options = {}) {
    const speed = options.speed || 1;
    const onFrame = options.onFrame;
    const history = load();
    let idx = 0;
    const timer = setInterval(() => {
      if (idx >= history.length) {
        clearInterval(timer);
        return;
      }
      if (typeof onFrame === 'function') {
        onFrame(history[idx]);
      }
      idx += 1;
    }, 1000 / speed);
  }

  window.ZChainHistory = {
    recordSnapshot,
    getHistory,
    getWeeklyHeatSummary,
    getTrendWarnings,
    playTimeline,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      recordSnapshot('startup');
      setInterval(() => recordSnapshot('interval'), SNAPSHOT_INTERVAL_MS);
    });
  } else {
    recordSnapshot('startup');
    setInterval(() => recordSnapshot('interval'), SNAPSHOT_INTERVAL_MS);
  }
})();
