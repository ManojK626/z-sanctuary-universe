// Z: dashboard/scripts/z-orchestration-status-readonly.js
// Phase 2B — read-only orchestration foundation card (no execution, no buttons).
// Expects #zOrchestrationStatusCockpit; data-z-reports-base (default ../../data/reports);
// data-z-contracts-package (default ../../packages/zuno-orchestrator-contracts/package.json).
(function () {
  function esc(x) {
    return String(x ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function pill(label, tone) {
    var bg =
      tone === 'pass'
        ? 'rgba(34,197,94,0.22)'
        : tone === 'fail'
          ? 'rgba(248,113,113,0.2)'
          : tone === 'hold'
            ? 'rgba(251,191,36,0.18)'
            : 'rgba(148,163,184,0.18)';
    var border =
      tone === 'pass'
        ? 'rgba(34,197,94,0.45)'
        : tone === 'fail'
          ? 'rgba(248,113,113,0.45)'
          : tone === 'hold'
            ? 'rgba(251,191,36,0.4)'
            : 'rgba(148,163,184,0.35)';
    return (
      '<span style="display:inline-block;font-size:0.72rem;padding:0.12rem 0.45rem;border-radius:999px;background:' +
      bg +
      ';border:1px solid ' +
      border +
      ';font-weight:600">' +
      esc(label) +
      '</span>'
    );
  }

  function row(k, vHtml) {
    return (
      '<tr><td style="padding:3px 10px 3px 0;opacity:0.92;vertical-align:middle">' +
      esc(k) +
      '</td><td style="vertical-align:middle">' +
      vHtml +
      '</td></tr>'
    );
  }

  async function run() {
    var el = document.getElementById('zOrchestrationStatusCockpit');
    if (!el) return;
    var baseRaw = el.getAttribute('data-z-reports-base') || '../../data/reports';
    var pkgRaw =
      el.getAttribute('data-z-contracts-package') ||
      '../../packages/zuno-orchestrator-contracts/package.json';
    var base = baseRaw.replace(/\/+$/, '') + '/';

    el.innerHTML =
      '<p class="z-muted" style="font-size:0.78rem;margin:0">Loading orchestration status…</p>';

    var contractsPresent = false;
    var contractsLabel = 'unknown';
    var examples = null;
    var taskLint = null;
    var fetchErr = false;

    try {
      var [rPkg, rEx, rLint] = await Promise.all([
        fetch(pkgRaw, { cache: 'no-store' }),
        fetch(base + 'zuno_orchestrator_contract_examples_check.json', { cache: 'no-store' }),
        fetch(base + 'zuno_task_plan_lint_report.json', { cache: 'no-store' })
      ]);

      if (rPkg.ok) {
        var pj = await rPkg.json();
        contractsPresent =
          pj &&
          typeof pj === 'object' &&
          String(pj.name || '') === '@z-sanctuary/zuno-orchestrator-contracts';
        contractsLabel = contractsPresent ? 'present' : 'unexpected package.json';
      } else {
        contractsLabel = 'not reachable';
      }

      if (rEx.ok) examples = await rEx.json();
      if (rLint.ok) taskLint = await rLint.json();
    } catch (_) {
      fetchErr = true;
    }

    if (fetchErr && !examples && !taskLint && !contractsPresent) {
      el.innerHTML =
        '<p class="z-muted" style="font-size:0.78rem;margin:0">Orchestration reports not reachable. Serve hub from repo root (e.g. <code>npx http-server . -p 5502</code>) per dashboard README.</p>';
      return;
    }

    var exPass = examples && examples.ok === true;
    var exTone = examples ? (exPass ? 'pass' : 'fail') : 'muted';
    var exHtml = examples
      ? pill(exPass ? 'PASS' : 'FAIL', exTone)
      : pill('UNKNOWN', 'muted');

    var lintPass = taskLint && taskLint.ok === true;
    var lintTone = taskLint ? (lintPass ? 'pass' : 'fail') : 'muted';
    var lintHtml = taskLint ? pill(lintPass ? 'PASS' : 'FAIL', lintTone) : pill('UNKNOWN', 'muted');
    if (taskLint && Array.isArray(taskLint.warnings) && taskLint.warnings.length > 0) {
      lintHtml +=
        ' <span class="z-muted" style="font-size:0.7rem">(' +
        esc(String(taskLint.warnings.length)) +
        ' warnings)</span>';
    }

    var contractsHtml = contractsPresent
      ? pill('PRESENT', 'pass')
      : pill('MISSING / unreadable', contractsLabel === 'unexpected package.json' ? 'hold' : 'fail');

    var staticRows =
      row('Runtime orchestrator', pill('CLOSED', 'hold')) +
      row('Provider adapters', pill('DISABLED', 'hold')) +
      row('Deployment', pill('HOLD', 'hold'));

    var genEx = examples && examples.generated_at ? esc(examples.generated_at) : '—';
    var genLint = taskLint && taskLint.generated_at ? esc(taskLint.generated_at) : '—';

    el.innerHTML =
      '<div style="font-size:0.82rem;border:1px solid rgba(255,255,255,0.12);border-radius:8px;padding:0.5rem 0.65rem;background:rgba(0,0,0,0.22)">' +
      '<strong>Zuno orchestration foundation (read-only)</strong>' +
      '<div class="z-muted" style="font-size:0.72rem;margin-top:0.2rem;line-height:1.35">Phase 2B · visibility only · no execution</div>' +
      '<table style="margin-top:0.4rem;font-size:0.8rem;border-collapse:collapse">' +
      row('Contracts package', contractsHtml) +
      row('Examples check', exHtml) +
      row('Task-plan lint', lintHtml) +
      staticRows +
      '</table>' +
      '<div class="z-muted" style="margin-top:0.35rem;font-size:0.7rem;line-height:1.35">Examples report: ' +
      genEx +
      ' · Task-plan lint: ' +
      genLint +
      '</div>' +
      '<div style="margin-top:0.45rem;font-size:0.72rem;line-height:1.45">' +
      '<a href="' +
      base +
      'zuno_orchestrator_contract_examples_check.md" target="_blank" rel="noopener noreferrer">Examples MD</a> · ' +
      '<a href="' +
      base +
      'zuno_orchestrator_contract_examples_check.json" target="_blank" rel="noopener noreferrer">Examples JSON</a> · ' +
      '<a href="' +
      base +
      'zuno_task_plan_lint_report.md" target="_blank" rel="noopener noreferrer">Task-plan lint MD</a> · ' +
      '<a href="' +
      base +
      'zuno_task_plan_lint_report.json" target="_blank" rel="noopener noreferrer">Task-plan lint JSON</a> · ' +
      '<a href="../../docs/orchestration/README.md" target="_blank" rel="noopener noreferrer">Orchestration docs</a>' +
      '</div>' +
      '<p class="z-muted" style="margin:0.4rem 0 0;font-size:0.68rem;line-height:1.35">Regenerate: <code>npm run examples:check --workspace=@z-sanctuary/zuno-orchestrator-contracts</code> · <code>npm run task-plan:lint --workspace=@z-sanctuary/zuno-orchestrator-contracts</code></p>' +
      '</div>';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
