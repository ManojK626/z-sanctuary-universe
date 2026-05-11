// Z: core\safe_pack_reflection.js
(function () {
  const container = document.getElementById('zSafePackReflection');
  if (!container) return;
  const summary = window.ZSafePack?.getSummary?.() ?? { total: 0, applied: 0, rollback: 0 };
  container.textContent = `Safe pack reflection: ${summary.applied} applied, ${summary.rollback} rollbacks (${summary.total} entries).`;
})();
