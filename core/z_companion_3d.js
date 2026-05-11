// Z: core\z_companion_3d.js
// ZUNO-4ROOT companion canvas — four-root symbolic governance (AMK-Goku center, SKK/RKPK/Zuno orbit).
// Illustrative only; mood/completion may use registry fetch when available — never fabricates metrics.
(function () {
  const canvas = document.getElementById('zCompanion3dCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const moodEl = document.getElementById('zCompanionMood');
  const completionEl = document.getElementById('zCompanionCompletion');
  const progressEl = document.getElementById('zCompanionProgress');
  const skkEl = document.getElementById('zCompanionSkk');
  const rkpkEl = document.getElementById('zCompanionRkpk');
  const amkEl = document.getElementById('zCompanionAmk');
  const zunoEl = document.getElementById('zCompanionZuno');
  const muteBtn = document.getElementById('zCompanionMuteBtn');

  const MUTE_KEY = 'zCompanionMute';
  const REGISTRY_URL = '/docs/z_module_registry.json';

  const moodPalette = {
    calm: '#00d4ff',
    balanced: '#a0e4cb',
    warning: '#ffb703',
    overload: '#ff006e',
    celebrate: '#ffe066',
  };

  let width = 0;
  let height = 0;
  let cx = 0;
  let cy = 0;
  let dpr = window.devicePixelRatio || 1;

  const state = {
    t: 0,
    mood: 'calm',
    message: 'Loading...',
    skk: '',
    rkpk: '',
    amk: '',
    zuno: '',
    completion: 0,
    lastMood: '',
    mute: localStorage.getItem(MUTE_KEY) === 'true',
    isMobile: window.innerWidth < 520,
    sparks: [],
  };

  const skkSprite = new Image();
  skkSprite.src = '/core/assets/skk.png';
  const rkpkSprite = new Image();
  rkpkSprite.src = '/core/assets/rkpk.png';

  const fov = 240;
  const tilt = 0.6;

  function isNightMode() {
    return document.body.classList.contains('z-night-mode') || window.ZNightMode === true;
  }

  function setMute(next) {
    state.mute = next;
    localStorage.setItem(MUTE_KEY, next ? 'true' : 'false');
    updateMuteLabel();
  }

  function updateMuteLabel() {
    if (!muteBtn) return;
    const suffix = !state.mute && isNightMode() ? ' (Night)' : '';
    muteBtn.textContent = (state.mute ? 'Voice: Off' : 'Voice: On') + suffix;
  }

  function updateMobileFlag() {
    state.isMobile = window.innerWidth < 520;
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = window.devicePixelRatio || 1;
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = width / 2;
    cy = height / 2;
    updateMobileFlag();
  }

  function project(point, orbitRadius) {
    const z = point.z + orbitRadius;
    const scale = fov / (fov + z);
    return {
      x: cx + point.x * scale,
      y: cy + point.y * scale,
      r: Math.max(3, 7 * scale),
      z,
    };
  }

  function tiltPoint(point) {
    const cos = Math.cos(tilt);
    const sin = Math.sin(tilt);
    return {
      x: point.x,
      y: point.y * cos - point.z * sin,
      z: point.y * sin + point.z * cos,
    };
  }

  function drawOrbit(orbitRadius, color) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(1, 0.45);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, orbitRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function drawCore() {
    const gradient = ctx.createRadialGradient(cx - 6, cy - 6, 4, cx, cy, 22);
    gradient.addColorStop(0, 'rgba(0, 212, 255, 0.9)');
    gradient.addColorStop(1, 'rgba(0, 212, 255, 0.15)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#f0f0f0';
    ctx.font = '10px Segoe UI, Tahoma, sans-serif';
    ctx.fillText('AMK-Goku', cx, cy - 4);
    ctx.fillStyle = '#8899aa';
    ctx.font = '9px Segoe UI, Tahoma, sans-serif';
    ctx.fillText('root', cx, cy + 8);
  }

  function drawSprite(img, node, fallbackColor, label) {
    const size = node.r * 2.4;
    if (img && img.naturalWidth > 0) {
      ctx.save();
      ctx.globalAlpha = 0.9;
      ctx.drawImage(img, node.x - size / 2, node.y - size / 2, size, size);
      ctx.restore();
    } else {
      ctx.fillStyle = fallbackColor;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#f0f0f0';
    ctx.font = '12px Segoe UI, Tahoma, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(label, node.x, node.y - node.r - 4);
  }

  function drawConnection(a, b) {
    ctx.strokeStyle = 'rgba(160, 228, 203, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  /** Doctrine emphasis: SKK/RKPK parent-guardian pair — visible red partner edge on the orbit graph. */
  function drawSkkRkpkPartnerEdge(a, b) {
    ctx.save();
    const night = isNightMode();
    ctx.strokeStyle = night ? 'rgba(251, 113, 133, 0.82)' : 'rgba(248, 113, 113, 0.95)';
    ctx.lineWidth = night ? 2.35 : 2.75;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = night ? 'rgba(244, 63, 94, 0.35)' : 'rgba(239, 68, 68, 0.55)';
    ctx.shadowBlur = night ? 6 : 10;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(254, 202, 202, 0.35)';
    ctx.lineWidth = 5;
    ctx.globalCompositeOperation = 'destination-over';
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    ctx.restore();
  }

  function spawnSparks() {
    if (isNightMode()) return;
    const count = state.isMobile ? 20 : 40;
    const baseColor = moodPalette[state.mood] || '#ffe066';
    for (let i = 0; i < count; i += 1) {
      state.sparks.push({
        angle: Math.random() * Math.PI * 2,
        radius: 4,
        speed: 0.6 + Math.random() * 0.6,
        life: 1,
        color: baseColor,
      });
    }
  }

  function drawSparks() {
    if (!state.sparks.length) return;
    const next = [];
    state.sparks.forEach((spark) => {
      const x = cx + Math.cos(spark.angle) * spark.radius;
      const y = cy + Math.sin(spark.angle) * spark.radius * 0.55;
      ctx.fillStyle = spark.color;
      ctx.globalAlpha = spark.life;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      spark.radius += spark.speed;
      spark.life -= 0.02;
      if (spark.life > 0) next.push(spark);
    });
    state.sparks = next;
  }

  function getRiskClass() {
    if (window.ZGovernanceHUD && typeof window.ZGovernanceHUD.getState === 'function') {
      return window.ZGovernanceHUD.getState().riskClass;
    }
    return 'unknown';
  }

  function computeCompletion(modules) {
    const list = Array.isArray(modules) ? modules : [];
    const total = list.reduce((sum, item) => sum + (item.weight || 0), 0);
    const done = list.reduce((sum, item) => sum + (item.done ? item.weight || 0 : 0), 0);
    return total > 0 ? Math.round((done / total) * 100) : 0;
  }

  async function loadRegistry() {
    try {
      const resp = await fetch(REGISTRY_URL, { cache: 'no-store' });
      if (!resp.ok) return [];
      const data = await resp.json();
      return data.modules || [];
    } catch (err) {
      return [];
    }
  }

  async function loadPatternSummary() {
    try {
      const resp = await fetch('/data/reports/z_bot_patterns.json', { cache: 'no-store' });
      if (!resp.ok) return { ok: false };
      const data = await resp.json();
      return {
        ok: true,
        total: typeof data.total_patterns === 'number' ? data.total_patterns : null,
        generated_at: data.generated_at || null,
      };
    } catch {
      return { ok: false };
    }
  }

  function computeMood(params) {
    const { completionPct, riskClass } = params;
    const roots = {
      amk: 'Sacred moves stay human-owned — consent before merge/deploy/payment.',
      zuno: 'Evidence before claims — audit reports are advisory, not authority.',
    };
    if (riskClass === 'high' || riskClass === 'sacred') {
      return {
        mood: 'warning',
        message: 'Stability risk detected. Address root failures first.',
        skk: 'Stabilize: fix failing checks and recurring errors.',
        rkpk: 'Slow down. One root fix at a time.',
        ...roots,
      };
    }
    if (completionPct >= 80) {
      return {
        mood: 'celebrate',
        message: 'Major milestones aligned. Celebrate progress responsibly.',
        skk: 'Lock releases. Tag versions. Protect stability.',
        rkpk: 'Take a breath. Enjoy the glow you earned.',
        ...roots,
      };
    }
    if (completionPct >= 50) {
      return {
        mood: 'balanced',
        message: 'Balanced momentum. Continue root-first improvements.',
        skk: 'Keep the chain clean: lint, tests, build, docs.',
        rkpk: 'Keep it kind and steady. Consistency beats intensity.',
        ...roots,
      };
    }
    if (completionPct < 35) {
      return {
        mood: 'overload',
        message: 'System load is high. Focus on essentials and rest cycles.',
        skk: 'Reduce scope. Prioritize top root blockers.',
        rkpk: 'Gentle pace. You are building a legacy.',
        ...roots,
      };
    }
    return {
      mood: 'calm',
      message: 'System stable. Proceed with priority roots.',
      skk: 'Advance the next root task.',
      rkpk: 'Stay gentle with yourself and the process.',
      ...roots,
    };
  }

  function updateUI() {
    if (moodEl) moodEl.textContent = `Mood: ${state.mood} | ${state.message}`;
    if (completionEl) completionEl.textContent = `Completion: ${state.completion}%`;
    if (progressEl) progressEl.style.width = `${state.completion}%`;
    if (skkEl) skkEl.textContent = state.skk || '...';
    if (rkpkEl) rkpkEl.textContent = state.rkpk || '...';
    if (amkEl) amkEl.textContent = state.amk || '…';
    if (zunoEl) zunoEl.textContent = state.zuno || '…';
  }

  function speak(text, opts) {
    const storedMute = localStorage.getItem(MUTE_KEY) === 'true';
    if (storedMute !== state.mute) {
      state.mute = storedMute;
      updateMuteLabel();
    }
    if (state.mute || isNightMode()) return;
    if (window.ZConsent && window.ZConsent.voiceWhisper === false) return;
    if (!window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = (opts && opts.rate) || 1.0;
    utter.pitch = (opts && opts.pitch) || 1.0;
    window.speechSynthesis.speak(utter);
  }

  function maybeSpeak() {
    if (!state.lastMood || state.lastMood === state.mood) return;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (state.skk) speak(`SKK: ${state.skk}`, { rate: 0.98, pitch: 0.9 });
    if (state.rkpk) {
      setTimeout(() => speak(`RKPK: ${state.rkpk}`, { rate: 0.95, pitch: 1.05 }), 600);
    }
  }

  async function refreshState() {
    const modules = await loadRegistry();
    const patterns = await loadPatternSummary();
    state.completion = computeCompletion(modules);
    const riskClass = getRiskClass();
    const next = computeMood({ completionPct: state.completion, riskClass });
    state.mood = next.mood;
    state.message = next.message;
    const patHint = patterns.ok
      ? ` | patterns:${patterns.total ?? 0}`
      : ' | patterns: n/a (hub: npm run bot:pattern)';
    state.skk = `${next.skk}${patHint}`;
    state.rkpk = `${next.rkpk}${patHint}`;
    state.amk = next.amk || '';
    state.zuno = next.zuno || '';
    updateUI();
    updateMuteLabel();
    if (state.mood === 'celebrate' && state.mood !== state.lastMood) {
      spawnSparks();
    }
    maybeSpeak();
    state.lastMood = state.mood;
  }

  function orbitBase(angle) {
    const orbitRadius = state.isMobile ? 54 : 70;
    return {
      x: orbitRadius * Math.cos(angle),
      y: 0,
      z: orbitRadius * Math.sin(angle),
    };
  }

  function tick() {
    const orbitRadius = state.isMobile ? 54 : 70;

    ctx.clearRect(0, 0, width, height);

    drawOrbit(orbitRadius, 'rgba(0, 212, 255, 0.35)');
    drawCore();

    const aR = state.t;
    const aS = state.t + Math.PI;
    const aZ = state.t - Math.PI / 2;

    const rkpkPos = tiltPoint(orbitBase(aR));
    const skkPos = tiltPoint(orbitBase(aS));
    const zunoPos = tiltPoint(orbitBase(aZ));

    const rkpk = project(rkpkPos, orbitRadius);
    const skk = project(skkPos, orbitRadius);
    const zuno = project(zunoPos, orbitRadius);

    const hub = { x: cx, y: cy, r: 16 };

    drawConnection(hub, skk);
    drawConnection(hub, rkpk);
    drawConnection(hub, zuno);
    drawConnection(rkpk, zuno);
    drawConnection(zuno, skk);
    drawSkkRkpkPartnerEdge(skk, rkpk);

    drawSprite(skkSprite, skk, moodPalette[state.mood] || '#00d4ff', 'SKK');
    drawSprite(rkpkSprite, rkpk, '#a0e4cb', 'RKPK');

    ctx.fillStyle = '#c9b8ff';
    ctx.beginPath();
    ctx.arc(zuno.x, zuno.y, Math.max(4, zuno.r), 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f0f0f0';
    ctx.font = '11px Segoe UI, Tahoma, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('Zuno', zuno.x, zuno.y - zuno.r - 4);

    ctx.fillStyle = '#8899aa';
    ctx.font = '10px Segoe UI, Tahoma, sans-serif';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    ctx.fillText('living root — continuity', cx, cy + 26);

    drawSparks();

    if (isNightMode() && state.sparks.length) {
      state.sparks = [];
    }

    const baseSpeed = state.isMobile ? 0.008 : 0.01;
    state.t += isNightMode() ? baseSpeed * 0.5 : baseSpeed;
    requestAnimationFrame(tick);
  }

  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      setMute(!state.mute);
    });
  }

  resize();
  setMute(state.mute);
  window.addEventListener('resize', resize);
  refreshState();
  const refreshRate = state.isMobile ? 30000 : 15000;
  setInterval(refreshState, refreshRate);
  tick();
})();
