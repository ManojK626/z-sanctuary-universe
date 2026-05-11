(function () {
  if (typeof document === 'undefined') return;

  var body = document.body;
  if (!body) return;

  body.classList.add('lumina-theme');

  var reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion) return;

  var ticking = false;
  function updateCursorVars(event) {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      var x = (event.clientX / window.innerWidth) * 100;
      var y = (event.clientY / window.innerHeight) * 100;
      body.style.setProperty('--lumina-cursor-x', x.toFixed(2) + '%');
      body.style.setProperty('--lumina-cursor-y', y.toFixed(2) + '%');
      ticking = false;
    });
  }

  window.addEventListener('pointermove', updateCursorVars, { passive: true });
})();
