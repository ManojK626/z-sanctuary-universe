// Z: core\z_trust_certificate_panel.js
// Trust Certificate Panel (read-only)
(function () {
  const mount = document.getElementById('trust-certificate');
  if (!mount) return;

  async function load() {
    try {
      const res = await fetch('../data/reports/Z_SYSTEM_HEALTH_CERTIFICATE.md', {
        cache: 'no-store',
      });
      const text = await res.text();
      mount.innerHTML = `
        <h3>Health Certificate</h3>
        <pre style="white-space: pre-wrap; background: rgba(18,20,26,0.92); padding: 12px; border-radius: 10px; font-size: 12px;">${text}</pre>
        <div class="z-muted" style="margin-top: 0.4rem">
          <a href="../data/reports/Z_SYSTEM_HEALTH_CERTIFICATE.sha256" target="_blank">Verify hash</a>
        </div>
      `;
    } catch {
      mount.textContent = 'Health Certificate unavailable.';
    }
  }

  load();
})();
