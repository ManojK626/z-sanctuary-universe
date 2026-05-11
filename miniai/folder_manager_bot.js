// Z: miniai/folder_manager_bot.js
/**
 * FolderManagerBot
 * Watches folder manager status and reports safe operational state.
 */
(function () {
  const base = window.ZBaseBot || {};
  // Site-root path: dashboard pages live under /dashboard/Html/, so ../data would miss hub data/reports.
  const REPORT_PATH = '/data/reports/z_folder_manager_status.json';
  const REFRESH_MS = 60000;
  let lastStatus = null;

  async function fetchStatus() {
    try {
      const resp = await fetch(`${REPORT_PATH}?ts=${Date.now()}`, { cache: 'no-store' });
      if (!resp.ok) throw new Error('status report unavailable');
      return await resp.json();
    } catch (err) {
      return null;
    }
  }

  const FolderManagerBot = Object.assign({}, base, {
    name: 'FolderManagerBot',
    async sync() {
      const report = await fetchStatus();
      if (!report) {
        this.log(
          'status',
          { state: 'unavailable', note: 'folder manager status missing' },
          'warning'
        );
        return;
      }

      const guardFail = Array.isArray(report.guard_checks)
        ? report.guard_checks.filter((c) => !c.pass).length
        : 0;
      const key = `${report.status}|${report.mode}|${report.candidate_changes || 0}|${guardFail}`;
      if (key === lastStatus) return;
      lastStatus = key;

      this.log('status', {
        state: report.status,
        mode: report.mode,
        latest_snapshot: report.latest_snapshot || report.source_snapshot || null,
        candidate_changes: report.candidate_changes || 0,
        guard_failures: guardFail,
      });
    },
    start() {
      this.sync();
      setInterval(() => this.sync(), REFRESH_MS);
    },
  });

  window.ZFolderManagerBot = FolderManagerBot;
})();
