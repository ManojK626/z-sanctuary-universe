(function () {
  const toggleButton = document.getElementById('zLowLightToggle');
  if (!toggleButton) return;

  const storageKey = 'z.lowLightMode';
  const body = document.body;

  function applyMode(enabled) {
    if (enabled) {
      body.classList.add('low-light');
      toggleButton.textContent = 'Low Light On';
      toggleButton.classList.add('is-active');
    } else {
      body.classList.remove('low-light');
      toggleButton.textContent = 'Low Light Off';
      toggleButton.classList.remove('is-active');
    }
    try {
      localStorage.setItem(storageKey, enabled ? 'on' : 'off');
    } catch (error) {
      console.debug('z_low_light_toggle: storage unavailable', error?.message);
    }
  }

  let initial = false;
  try {
    initial = localStorage.getItem(storageKey) === 'on';
  } catch {
    initial = body.classList.contains('low-light');
  }

  applyMode(initial);

  toggleButton.addEventListener('click', () => {
    applyMode(!body.classList.contains('low-light'));
  });
})();
