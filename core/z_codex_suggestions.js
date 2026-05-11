// Z: core\z_codex_suggestions.js
// Codex suggestions: reads data/z_codex_report.json and surfaces fixes.
(function () {
  const listEl = document.getElementById('zCodexSuggestionsList');
  const lastRunEl = document.getElementById('zCodexLastRun');
  if (!listEl) return;

  const FIXES = {
    MD040: 'Add a language to fenced code blocks: ```js, ```bash, ```txt.',
    MD036: 'Use headings for titles (## Title) or keep emphasis inline.',
    'no-unused-vars': 'Remove unused variables or prefix with `_`.',
    '@typescript-eslint/no-unused-vars': 'Remove unused variables or prefix with `_`.',
    'no-undef': 'Import or declare missing identifiers.',
    eqeqeq: 'Use strict equality (=== / !==) unless nullish check.',
    'prefer-const': 'Use const when a value is not reassigned.',
  };

  function formatTime(iso) {
    if (!iso) return 'never';
    const date = new Date(iso);
    return Number.isNaN(date.getTime()) ? 'never' : date.toLocaleTimeString();
  }

  function copyText(text) {
    if (!text) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    } else {
      window.prompt('Copy this fix:', text);
    }
  }

  function renderIssues(issues) {
    listEl.innerHTML = '';
    if (!issues.length) {
      const li = document.createElement('li');
      li.className = 'z-muted';
      li.textContent = 'No repeated issues detected.';
      listEl.appendChild(li);
      return;
    }

    issues.slice(0, 6).forEach((issue) => {
      const rule = issue.ZRule || issue.rule || 'unknown';
      const count = issue.ZCount || issue.count || 0;
      const li = document.createElement('li');
      li.className = 'z-codex-item';

      const title = document.createElement('div');
      title.className = 'z-codex-title';
      title.textContent = `${rule} (${count})`;

      const fix = document.createElement('div');
      fix.className = 'z-muted';
      fix.textContent = FIXES[rule] || 'See Z_AUTO_CODEX for guidance.';

      const btn = document.createElement('button');
      btn.className = 'z-panel-btn';
      btn.type = 'button';
      btn.textContent = 'Copy Fix';
      btn.addEventListener('click', () => copyText(fix.textContent));

      li.appendChild(title);
      li.appendChild(fix);
      li.appendChild(btn);
      listEl.appendChild(li);
    });
  }

  async function loadReport() {
    try {
      let resp = await fetch('/data/Z_codex_report.json', { cache: 'no-store' });
      if (!resp.ok) {
        resp = await fetch('/data/z_codex_report.json', { cache: 'no-store' });
      }
      if (!resp.ok) throw new Error('missing');
      const data = await resp.json();
      const generatedAt = data.ZGeneratedAt || data.generatedAt;
      if (lastRunEl) lastRunEl.textContent = formatTime(generatedAt);
      const issues =
        data.ZRepeatIssues && data.ZRepeatIssues.length
          ? data.ZRepeatIssues
          : data.repeatIssues && data.repeatIssues.length
            ? data.repeatIssues
            : data.ZIssues || data.issues || [];
      renderIssues(issues);
    } catch (err) {
      renderIssues([]);
    }
  }

  loadReport();
  setInterval(loadReport, 20000);
})();
