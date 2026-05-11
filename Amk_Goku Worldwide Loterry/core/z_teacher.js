// Z: Amk_Goku Worldwide Loterry\core\z_teacher.js
// Z-Teacher (cooldown + reflection)
(function () {
  const KEY = 'zTeacher.cooldownUntil';
  const REASON_KEY = 'zTeacher.reason';

  function now() {
    return Date.now();
  }

  function inCooldown() {
    const until = parseInt(localStorage.getItem(KEY) || '0', 10);
    return until && now() < until;
  }

  function setCooldown(minutes = 10, reason = 'Boundary crossed') {
    const until = now() + minutes * 60 * 1000;
    localStorage.setItem(KEY, String(until));
    localStorage.setItem(REASON_KEY, reason);

    const event = {
      source: 'z_teacher',
      action: 'cooldown_set',
      minutes,
      reason,
      until: new Date(until).toISOString(),
    };
    if (window.ZChronicle) window.ZChronicle.record(event);
    if (window.ZSuperGhost) window.ZSuperGhost.ingest(event);

    document.dispatchEvent(new CustomEvent('zteacher:cooldown', { detail: event }));
  }

  function clearCooldown() {
    localStorage.removeItem(KEY);
    localStorage.removeItem(REASON_KEY);

    const event = { source: 'z_teacher', action: 'cooldown_cleared' };
    if (window.ZChronicle) window.ZChronicle.record(event);
    if (window.ZSuperGhost) window.ZSuperGhost.ingest(event);

    document.dispatchEvent(new CustomEvent('zteacher:restored'));
  }

  function reason() {
    return localStorage.getItem(REASON_KEY) || 'Let’s pause and reflect.';
  }

  window.ZTeacher = { inCooldown, setCooldown, clearCooldown, reason };
})();
