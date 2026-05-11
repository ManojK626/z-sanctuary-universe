// Z: dashboard\skk-dashboard.js
import { initSkkAvatar } from './skk-avatar.js';
import { initRkpkAvatar } from './rkpk-avatar.js';

const stateEls = {
  overallCompletion: document.getElementById('overall-completion'),
  overallBar: document.getElementById('overall-bar'),
  nextPriority: document.getElementById('next-priority'),
  nextAction: document.getElementById('next-action'),
  nextReason: document.getElementById('next-reason'),
  prioritiesList: document.getElementById('priorities-list'),
  modulesList: document.getElementById('modules-list'),
  moduleCount: document.getElementById('module-count'),
};

const overlay = document.getElementById('skk-overlay');
const overlayElements = {
  mood: document.getElementById('skk-mood'),
  advice: document.getElementById('skk-advice'),
  priorities: document.getElementById('skk-priorities'),
  completion: document.getElementById('skk-completion'),
  completionBar: document.getElementById('skk-completion-bar'),
  fireworks: document.getElementById('skk-fireworks'),
  rkpkSupport: document.getElementById('rkpk-support'),
};

const buttons = {
  summon: document.getElementById('skk-summon'),
  close: document.getElementById('skk-close'),
  refresh: document.getElementById('refresh-state'),
  overlayRefresh: document.getElementById('skk-refresh'),
  speak: document.getElementById('skk-speak'),
  celebrate: document.getElementById('skk-celebrate'),
};

let lastOverall = null;
let currentAdvice = null;
let lastState = null;
let audioContext = null;
let avatarControllers = { skk: null, rkpk: null };
let currentMood = 'calm';

const fetchJson = async (url, options = {}) => {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
};

const setMood = (mood) => {
  const resolvedMood = mood || 'calm';
  currentMood = resolvedMood;
  document.body.classList.remove('mood-calm', 'mood-warn', 'mood-celebrate');
  document.body.classList.add(`mood-${resolvedMood}`);

  const moodLabel =
    resolvedMood === 'celebrate'
      ? 'Celebration Mode'
      : resolvedMood === 'warn'
        ? 'Root Alert'
        : 'Calm Guidance';
  overlayElements.mood.textContent = moodLabel;
  if (avatarControllers.skk?.setMood) {
    avatarControllers.skk.setMood(resolvedMood);
  }
  if (avatarControllers.rkpk?.setMood) {
    avatarControllers.rkpk.setMood(resolvedMood);
  }
  if (overlayElements.rkpkSupport) {
    overlayElements.rkpkSupport.textContent =
      rkpkSupportByMood[resolvedMood] || rkpkSupportByMood.calm;
  }
};

const rkpkSupportByMood = {
  calm: 'Compassion check: focus on one root at a time.',
  warn: 'Slow down and stabilize. Resolve the root without rush.',
  celebrate: 'Honor the progress and restore energy.',
};

const speak = (text) => {
  if (!text || typeof window === 'undefined') return;
  if (!window.speechSynthesis) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.92;
  utter.pitch = 0.9;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
};

const ensureAudio = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
};

const playTone = (type) => {
  const ctx = ensureAudio();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = type === 'warn' ? 196 : type === 'celebrate' ? 392 : 262;
  gain.gain.value = 0;
  osc.connect(gain);
  gain.connect(ctx.destination);
  gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
  osc.start(now);
  osc.stop(now + 1);
};

const triggerFireworks = (count = 4, color = '#f4c36b') => {
  if (!overlayElements.fireworks) return;
  for (let i = 0; i < count; i += 1) {
    const spark = document.createElement('div');
    spark.className = 'skk-firework';
    spark.style.left = `${10 + Math.random() * 80}%`;
    spark.style.top = `${10 + Math.random() * 60}%`;
    spark.style.color = color;
    overlayElements.fireworks.appendChild(spark);
    setTimeout(() => spark.remove(), 1200);
  }
};

const normalizePriority = (item) => {
  if (item.level !== undefined) return item;
  if (item.priorityLevel !== undefined) {
    return {
      level: item.priorityLevel,
      title: item.action,
      reason: item.reason,
    };
  }
  return item;
};

const renderPriorities = (items, container) => {
  container.innerHTML = '';
  if (!items.length) {
    const empty = document.createElement('div');
    empty.className = 'muted';
    empty.textContent = 'No priority signals detected.';
    container.appendChild(empty);
    return;
  }

  items
    .slice(0, 6)
    .map(normalizePriority)
    .forEach((item) => {
      const card = document.createElement('div');
      card.className = 'priority-item';
      card.innerHTML = `
      <div class="priority-title">P${item.level} - ${item.title}</div>
      <div class="priority-reason">${item.reason}</div>
    `;
      container.appendChild(card);
    });
};

const renderModules = (modules) => {
  stateEls.modulesList.innerHTML = '';
  stateEls.moduleCount.textContent = `${modules.length} modules`;

  modules.forEach((mod) => {
    const card = document.createElement('div');
    card.className = 'module-card';
    const statusClass = mod.status.connected ? '' : mod.status.uploaded ? 'pending' : 'warn';
    const statusLabel = mod.status.connected
      ? 'Connected'
      : mod.status.uploaded
        ? 'Uploaded'
        : 'Missing';
    card.innerHTML = `
      <h4>${mod.name}</h4>
      <div class="module-meta">
        <span><span class="status-dot ${statusClass}"></span>${statusLabel}</span>
        <span>${mod.completion.overall}% complete</span>
      </div>
      <div class="module-meta">
        <span>depends: ${mod.relationships.dependsOn.length}</span>
        <span>feeds: ${mod.relationships.feedsInto.length}</span>
        <span>watched: ${mod.relationships.observedBy.length}</span>
      </div>
      <div class="module-progress">
        <span style="width: ${mod.completion.overall}%"></span>
      </div>
    `;
    stateEls.modulesList.appendChild(card);
  });
};

const updateState = (state) => {
  lastState = state;
  stateEls.overallCompletion.textContent = `${state.overallCompletion}%`;
  stateEls.overallBar.style.width = `${state.overallCompletion}%`;
  stateEls.nextPriority.textContent = `P${state.next?.priorityLevel ?? '-'}`;
  stateEls.nextAction.textContent = state.next?.action ?? 'No next action.';
  stateEls.nextReason.textContent = state.next?.reason ?? '';
  renderPriorities(state.priorities || [], stateEls.prioritiesList);
  renderModules(state.modules || []);
};

const updateAdvice = (advice) => {
  currentAdvice = advice;
  overlayElements.advice.textContent = advice?.advice ?? 'Summon SKK + RKPK to receive guidance.';
  overlayElements.completion.textContent = `${advice?.overallCompletion ?? '--'}%`;
  overlayElements.completionBar.style.width = `${advice?.overallCompletion ?? 0}%`;
  const priorities = lastState?.priorities?.length
    ? lastState.priorities
    : advice?.next
      ? [advice.next]
      : [];
  renderPriorities(priorities, overlayElements.priorities);
  setMood(advice?.mood ?? 'calm');

  if (advice?.fx?.fireworks) {
    triggerFireworks(5, advice.fx.aura === 'gold' ? '#f4c36b' : '#6fd1c7');
  }

  if (!overlay.classList.contains('hidden') && advice?.mood === 'warn') {
    playTone('warn');
  }
};

const refreshAll = async () => {
  try {
    const state = await fetchJson('/api/dashboard/state');
    updateState(state);

    const advice = await fetchJson('/api/dashboard/skk-advice', { method: 'POST', body: '{}' });
    updateAdvice(advice);

    if (typeof lastOverall === 'number' && state.overallCompletion >= lastOverall + 5) {
      triggerFireworks(6, '#f4c36b');
      playTone('celebrate');
    }
    lastOverall = state.overallCompletion;
  } catch (err) {
    stateEls.nextReason.textContent = 'Unable to load dashboard state.';
  }
};

buttons.refresh.addEventListener('click', refreshAll);
buttons.overlayRefresh.addEventListener('click', refreshAll);

buttons.summon.addEventListener('click', () => {
  overlay.classList.remove('hidden');
  overlay.setAttribute('aria-hidden', 'false');
  refreshAll();
  if (avatarControllers.skk?.resize || avatarControllers.rkpk?.resize) {
    requestAnimationFrame(() => {
      avatarControllers.skk?.resize?.();
      avatarControllers.rkpk?.resize?.();
    });
  }
});

buttons.close.addEventListener('click', () => {
  overlay.classList.add('hidden');
  overlay.setAttribute('aria-hidden', 'true');
});

buttons.speak.addEventListener('click', () => {
  if (currentAdvice?.advice) {
    speak(currentAdvice.advice);
  }
});

buttons.celebrate.addEventListener('click', () => {
  triggerFireworks(6, '#f4c36b');
  playTone('celebrate');
});

Promise.all([
  initSkkAvatar(document.getElementById('skk-avatar')),
  initRkpkAvatar(document.getElementById('rkpk-avatar')),
]).then(([skkController, rkpkController]) => {
  avatarControllers = { skk: skkController, rkpk: rkpkController };
  if (avatarControllers.skk?.setMood) {
    avatarControllers.skk.setMood(currentMood);
  }
  if (avatarControllers.rkpk?.setMood) {
    avatarControllers.rkpk.setMood(currentMood);
  }
  if (!overlay.classList.contains('hidden')) {
    requestAnimationFrame(() => {
      avatarControllers.skk?.resize?.();
      avatarControllers.rkpk?.resize?.();
    });
  }
});
refreshAll();
setInterval(refreshAll, 30000);
