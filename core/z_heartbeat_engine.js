// Z: core\z_heartbeat_engine.js
(function () {
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  const SOUND_ENABLED_KEY = 'zSystemSoundEnabled';
  const SOUND_VOLUME_KEY = 'zSystemSoundVolume';
  let context = null;
  let oscillator = null;
  let gain = null;
  let beatTimer = null;
  let enabled = localStorage.getItem(SOUND_ENABLED_KEY) !== '0';
  let volume = 0.6;
  let state = 'idle';
  const bpm = 60;

  function clampVolume(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return 0.6;
    return Math.min(1, Math.max(0, numeric));
  }

  function loadVolume() {
    const raw = localStorage.getItem(SOUND_VOLUME_KEY);
    if (raw == null) return 0.6;
    return clampVolume(raw);
  }

  function saveSettings() {
    localStorage.setItem(SOUND_ENABLED_KEY, enabled ? '1' : '0');
    localStorage.setItem(SOUND_VOLUME_KEY, String(volume));
  }

  function updateSoundHint() {
    const hint = document.getElementById('heartbeatSoundHint');
    if (!hint) return;
    const shouldShow = enabled && state === 'running';
    hint.style.display = shouldShow ? '' : 'none';
  }

  function getPulseGain() {
    return Math.max(0.01, volume * 0.2);
  }

  function init() {
    if (!AudioCtor) return;
    if (context) return;
    context = new AudioCtor();
    oscillator = context.createOscillator();
    gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = 120;
    gain.gain.value = 0;
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(0);
    beat();
  }

  function beat() {
    if (!gain || !context) return;
    const now = context.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(getPulseGain(), now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
  }

  async function start() {
    if (!enabled) return;
    if (!AudioCtor) return;
    init();
    if (context.state === 'suspended') {
      await context.resume().catch(() => {});
    }
    beat();
    if (!beatTimer) {
      beatTimer = setInterval(beat, 1000);
    }
    state = 'running';
    updateSoundHint();
  }

  function stop() {
    if (beatTimer) {
      clearInterval(beatTimer);
      beatTimer = null;
    }
    if (gain) {
      gain.gain.setValueAtTime(0, context.currentTime);
    }
    state = 'stopped';
    updateSoundHint();
  }

  async function resume() {
    if (!context || !AudioCtor) return;
    if (context.state === 'suspended') {
      await context.resume().catch(() => {});
    }
    start();
  }

  function setEnabled(flag) {
    enabled = Boolean(flag);
    saveSettings();
    if (!enabled) stop();
    updateSoundHint();
  }

  function setVolume(value) {
    volume = clampVolume(value);
    saveSettings();
  }

  async function test() {
    await start();
    beat();
  }

  function syncControls() {
    const toggle = document.getElementById('zSystemSoundToggle');
    const slider = document.getElementById('zSystemSoundVolume');
    const label = document.getElementById('zSystemSoundVolumeLabel');
    const testBtn = document.getElementById('zSystemSoundTest');

    if (label) {
      label.textContent = `${Math.round(volume * 100)}%`;
    }
    if (toggle) {
      toggle.checked = enabled;
      toggle.addEventListener('change', () => {
        setEnabled(toggle.checked);
      });
    }
    if (slider) {
      slider.value = String(Math.round(volume * 100));
      slider.addEventListener('input', () => {
        const value = Number(slider.value) / 100;
        setVolume(value);
        if (label) {
          label.textContent = `${Math.round(volume * 100)}%`;
        }
      });
    }
    if (testBtn) {
      testBtn.addEventListener('click', async () => {
        await test();
      });
    }
    updateSoundHint();
  }

  function getState() {
    return {
      state,
      enabled,
      bpm,
      volume: Math.round(volume * 100),
      contextState: context?.state || 'uninitialized',
      audioSupported: Boolean(AudioCtor),
      running: Boolean(beatTimer),
    };
  }

  document.addEventListener(
    'click',
    () => {
      start();
    },
    { once: true, capture: true }
  );

  const api = {
    start,
    stop,
    resume,
    setEnabled,
    setVolume,
    test,
    getState,
  };

  volume = loadVolume();
  saveSettings();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncControls, { once: true });
  } else {
    syncControls();
  }

  window.ZHeartbeat = api;
})();
