// Z: core\z_world_pulse.js
(function () {
  const CONFIG = {
    intervalMs: 60 * 60 * 1000,
    maxSignals: 5,
  };

  let timer = null;
  let lastObservedAt = null;

  function observe() {
    lastObservedAt = new Date().toISOString();
    const snapshot = {
      ts: lastObservedAt,
      domain: 'world',
      summary: 'Global signal snapshot (observational)',
      signals: [
        { topic: 'economy', intensity: 0.42 },
        { topic: 'conflict', intensity: 0.31 },
        { topic: 'climate', intensity: 0.55 },
        { topic: 'technology', intensity: 0.61 },
      ].slice(0, CONFIG.maxSignals),
    };

    normalize(snapshot);
  }

  function normalize(snapshot) {
    snapshot.signals.forEach((signal, idx) => {
      const ringAngle = Math.round((360 / snapshot.signals.length) * idx);
      const event = {
        module: 'world_pulse',
        intent: 'observe',
        angleDeg: ringAngle,
        vector: [Math.cos((ringAngle * Math.PI) / 180), Math.sin((ringAngle * Math.PI) / 180)],
        space: 'world',
        sizeUnit: 'signal',
        sizeValue: signal.intensity,
        cellIndex: [idx, signal.intensity > 0.5 ? 1 : 0],
        posture: 'GLOBAL',
        meta: {
          topic: signal.topic,
          intensity: signal.intensity,
        },
      };

      if (window.ZKairoCell) {
        window.ZKairoCell.evaluate(event);
      }
    });
  }

  function start() {
    if (timer) return;
    if (!window.ZKairoCell?.evaluate) {
      console.warn('[WorldPulse] ZKairoCell unavailable. Pulse start deferred.');
      return;
    }
    observe();
    timer = setInterval(observe, CONFIG.intervalMs);
    console.info('[WorldPulse] Started');
    window.ZChronicle?.write?.({ type: 'z.world_pulse.start', ts: new Date().toISOString() });
  }

  function stop() {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
    console.info('[WorldPulse] Stopped');
  }

  function getStatus() {
    return {
      running: Boolean(timer),
      lastObservedAt,
      hasKairoCell: Boolean(window.ZKairoCell?.evaluate),
    };
  }

  window.ZWorldPulse = { start, stop, getStatus };
  start();
})();
