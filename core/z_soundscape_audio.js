// Z: core/z_soundscape_audio.js
// Phase 2: Consent-first microphone capture + feature extraction (RMS, spectrum, onset).
// All processing is local; no raw audio leaves the page. Z-ALD hook via z-soundscape-anomaly event.
(function () {
  const CONSENT_KEY = 'zSoundscapeMicConsent';
  const CONSENT_TS_KEY = 'zSoundscapeMicConsentAt';

  let audioContext = null;
  let analyser = null;
  let stream = null;
  let animationId = null;
  let rmsHistory = [];
  const HISTORY_LEN = 8;
  const ONSET_THRESHOLD = 0.35;
  const ONSET_COOLDOWN_MS = 800;

  const state = {
    rms: 0.5,
    onset: false,
    spectrumPeak: 0,
    consent: false,
    active: false,
    error: null,
  };

  window.ZSoundscapeAudio = state;

  function hasConsent() {
    try {
      return localStorage.getItem(CONSENT_KEY) === 'true';
    } catch {
      return false;
    }
  }

  function setConsent(granted) {
    try {
      localStorage.setItem(CONSENT_KEY, granted ? 'true' : 'false');
      localStorage.setItem(CONSENT_TS_KEY, new Date().toISOString());
    } catch (e) {
      void e;
    }
    state.consent = granted;
  }

  function emitAnomaly(payload) {
    const detail = Object.assign(
      { type: 'onset', timestamp: new Date().toISOString(), source: 'z_soundscape_audio' },
      payload
    );
    if (typeof window !== 'undefined' && window.__Z_SOUNDSCAPE_ANOMALY_DEBUG__) {
      if (typeof console !== 'undefined' && console.info) {
        console.info('[z-soundscape-anomaly]', detail);
      }
    }
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('z-soundscape-anomaly', { detail }));
    }
  }

  let lastOnsetAt = 0;

  function analyse() {
    if (!analyser || !audioContext) return;

    const n = analyser.fftSize;
    const timeData = new Uint8Array(n);
    analyser.getByteTimeDomainData(timeData);
    let tSum = 0;
    for (let i = 0; i < n; i++) {
      const x = (timeData[i] - 128) / 128;
      tSum += x * x;
    }
    const rms = Math.sqrt(tSum / n);
    // Map typical speech/room levels into ~0–1 for UI
    const level = rms;
    const freq = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(freq);
    let peak = 0;
    for (let i = 0; i < freq.length; i++) {
      const v = freq[i] / 255;
      if (v > peak) peak = v;
    }
    state.spectrumPeak = peak;

    rmsHistory.push(level);
    if (rmsHistory.length > HISTORY_LEN) rmsHistory.shift();
    const avgRms = rmsHistory.reduce((a, b) => a + b, 0) / rmsHistory.length;
    const delta = level - avgRms;

    state.rms = Math.max(0.01, Math.min(1, level * 5));

    const now = Date.now();
    if (delta > ONSET_THRESHOLD && now - lastOnsetAt > ONSET_COOLDOWN_MS) {
      lastOnsetAt = now;
      state.onset = true;
      emitAnomaly({
        confidence: Math.min(1, delta / 0.5),
        rms: level,
        delta,
        spectrumPeak: peak,
      });
    } else {
      state.onset = false;
    }

    animationId = requestAnimationFrame(analyse);
  }

  function stop() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      stream = null;
    }
    if (audioContext && audioContext.state !== 'closed') {
      audioContext.close().catch(function () {});
      audioContext = null;
    }
    analyser = null;
    state.active = false;
    state.rms = 0.5;
    state.onset = false;
    state.spectrumPeak = 0;
    state.error = null;
    rmsHistory = [];
  }

  function secureContextOrLocalhost() {
    if (typeof window === 'undefined') return true;
    if (window.isSecureContext) return true;
    const h = typeof location !== 'undefined' ? location.hostname : '';
    if (h === 'localhost' || h === '127.0.0.1' || h === '[::1]') return true;
    return false;
  }

  async function start() {
    if (!hasConsent()) {
      state.error = 'Consent required';
      return false;
    }
    if (!secureContextOrLocalhost()) {
      state.error = 'Microphone needs HTTPS or localhost (browsers require a secure context).';
      return false;
    }
    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      state.error = 'getUserMedia is not available in this context.';
      return false;
    }

    stop();

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        state.error = 'Web Audio API not supported';
        return false;
      }

      audioContext = new AudioContextClass();
      stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      const src = audioContext.createMediaStreamSource(stream);
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.7;
      src.connect(analyser);

      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      state.active = true;
      state.error = null;
      setConsent(true);
      analyse();
      return true;
    } catch (err) {
      state.active = false;
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
        stream = null;
      }
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close().catch(function () {});
        audioContext = null;
      }
      analyser = null;
      if (err && err.name === 'NotAllowedError') {
        state.error = 'Microphone was blocked. Allow access in the browser, then try again.';
      } else {
        state.error = (err && err.message) || 'Microphone is unavailable';
      }
      return false;
    }
  }

  window.ZSoundscapeAudioAPI = {
    hasConsent,
    setConsent,
    start,
    stop,
    startWithConsent: async function () {
      setConsent(true);
      return start();
    },
  };

  state.consent = hasConsent();
})();
