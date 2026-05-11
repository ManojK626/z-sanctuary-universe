// Z: core/z_ambient_weather_audio.js
// Procedural Web Audio: soft wind + rain (no external samples). Gated by dashboard "Z-Sound Effects".
(function () {
  let audioCtx = null;
  let masterGain = null;
  /** @type {AudioBufferSourceNode[]} */
  const activeSources = [];

  function reducedMotion() {
    return (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  function ensureGraph() {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    if (!audioCtx) {
      audioCtx = new Ctx();
      masterGain = audioCtx.createGain();
      masterGain.gain.value = reducedMotion() ? 0.06 : 0.14;
      masterGain.connect(audioCtx.destination);
    }
    return audioCtx;
  }

  function pushLoopingNoise(ctx, filterSetup, wetLevel) {
    const dur = 1.5;
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i += 1) {
      d[i] = Math.random() * 2 - 1;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filterSetup(filter);
    const wet = ctx.createGain();
    wet.gain.value = wetLevel;
    src.connect(filter);
    filter.connect(wet);
    wet.connect(masterGain);
    src.start(0);
    activeSources.push(src);
  }

  function stopInternal() {
    while (activeSources.length) {
      const s = activeSources.pop();
      try {
        s.stop(0);
      } catch (e) {
        void e;
      }
    }
    if (audioCtx && audioCtx.state === 'running') {
      audioCtx.suspend().catch(function () {});
    }
  }

  window.ZAmbientWeather = {
    /**
     * @param {{ rain?: number; wind?: number }} opts — 0..1 mix weights
     * @returns {boolean}
     */
    start(opts) {
      stopInternal();
      const ctx = ensureGraph();
      if (!ctx || !masterGain) return false;
      const rainW = Math.max(0, Math.min(1, Number(opts && opts.rain != null ? opts.rain : 0.4)));
      const windW = Math.max(0, Math.min(1, Number(opts && opts.wind != null ? opts.wind : 0.35)));
      if (rainW < 0.03 && windW < 0.03) return true;

      ctx.resume().catch(function () {});

      if (windW >= 0.03) {
        pushLoopingNoise(
          ctx,
          function (f) {
            f.type = 'lowpass';
            f.frequency.value = 380 + Math.random() * 120;
            f.Q.value = 0.7;
          },
          0.07 * windW
        );
      }
      if (rainW >= 0.03) {
        pushLoopingNoise(
          ctx,
          function (f) {
            f.type = 'bandpass';
            f.frequency.value = 2200 + Math.random() * 600;
            f.Q.value = 0.55;
          },
          0.055 * rainW
        );
      }
      return true;
    },
    stop() {
      stopInternal();
    }
  };
})();
