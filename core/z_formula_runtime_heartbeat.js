// Z: core/z_formula_runtime_heartbeat.js
// Live runtime line for 360/Cube formula stack.
(function () {
  const target = document.getElementById('zFormulaRuntimeHeartbeat');
  if (!target) return;

  function statusText() {
    const kairoOnline = Boolean(window.ZKairoCell?.evaluate);
    const pulse = window.ZWorldPulse?.getStatus?.() || {};
    const pulseRunning = Boolean(pulse.running);
    const last = pulse.lastObservedAt ? new Date(pulse.lastObservedAt).toLocaleTimeString() : '--';
    return `Runtime: KairoCell ${kairoOnline ? 'online' : 'offline'} | WorldPulse ${pulseRunning ? 'running' : 'idle'} | Last pulse ${last}`;
  }

  function refresh() {
    target.textContent = statusText();
  }

  refresh();
  setInterval(refresh, 10000);
})();
