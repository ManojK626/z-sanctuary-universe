// Z: core\social_layer.js
(function () {
  const panel = document.getElementById('zSocialPanel');
  if (!panel) return;
  function setStatus(message) {
    panel.textContent = message;
  }
  setStatus('Social layer ready � no active teammates.');
})();
