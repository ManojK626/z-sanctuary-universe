// Z: core/z_pc_root_projects_panel.js
// All projects block in Control Centre — reads data/z_pc_root_projects.json

(function () {
  const BODY_ID = 'zAllProjectsBody';
  const DATA_URL = '/data/z_pc_root_projects.json';

  function render(projects, hub, pcRoot) {
    if (!Array.isArray(projects) || projects.length === 0) {
      return '<p class="z-muted">No projects in list. Edit <code>data/z_pc_root_projects.json</code>.</p>';
    }
    var intro = '';
    if (pcRoot) {
      intro +=
        '<p class="z-muted" style="font-size: 0.75rem; margin: 0 0 0.5rem 0;">PC root (Z-EAII / Overseer scope): <code>' +
        escapeHtml(pcRoot) +
        '</code> · Hub <code>' +
        escapeHtml(hub || 'ZSanctuary_Universe') +
        '</code> runs full Z-SSWS. <strong>Z-SSWSs</strong> = per-project two-root workspaces at PC root (<code>Z_SSWS_Shadow__&lt;id&gt;.code-workspace</code>) from <code>npm run ssws:shadow-emit</code> — hub + one assignment only (no mix-ups). Members marked <strong>shadow</strong> in JSON opt into the shadow label in the all-projects workspace.</p>';
    }
    var html =
      intro + '<ul class="z-list z-all-projects-list" style="list-style: none; padding-left: 0;">';
    function shadowJsonFlag(proj) {
      return (
        proj.ssws_shadow &&
        (proj.ssws_shadow === true ||
          (typeof proj.ssws_shadow === 'object' && proj.ssws_shadow.enabled !== false))
      );
    }
    function sswsShadowEligible(proj) {
      if (proj.role === 'hub' || proj.role === 'external') return false;
      if (!proj.path || String(proj.path).trim() === '') return false;
      if (proj.ssws_shadow && typeof proj.ssws_shadow === 'object' && proj.ssws_shadow.enabled === false)
        return false;
      return proj.formula_aware === true || shadowJsonFlag(proj);
    }
    projects.forEach(function (p) {
      var roleClass = p.role === 'hub' ? 'z-all-projects-hub' : 'z-all-projects-member';
      var roleLabel = 'member';
      if (p.role === 'hub') roleLabel = 'hub';
      else if (p.role === 'external') roleLabel = 'external';
      else if (shadowJsonFlag(p)) roleLabel = 'shadow';
      var sswsLocal = sswsShadowEligible(p);
      var formulaLabel = p.formula_aware ? ' formula' : '';
      var link = '';
      if (p.dashboard_url) {
        link = ' <a href="' + escapeHtml(p.dashboard_url) + '" target="_blank" rel="noopener noreferrer" title="Open dashboard">Dashboard</a>';
      } else if (p.eaii_launch_task) {
        link = ' <span class="z-muted" title="Launch from Cursor/EAII">' + escapeHtml(p.eaii_launch_task) + '</span>';
      }
      html += '<li class="' + roleClass + '" style="margin-bottom: 0.4rem;">';
      html += '<span class="z-summary-badge" style="font-size: 0.65rem;">' + escapeHtml(roleLabel) + '</span>';
      if (p.ssws) {
        html += ' <span class="z-summary-badge" style="font-size: 0.65rem;" title="Full Z-SSWS host">SSWS</span>';
      }
      if (sswsLocal) {
        html +=
          ' <span class="z-summary-badge" style="font-size: 0.65rem;" title="Eligible for Z_SSWS_Shadow__ workspace (hub + this folder only)">Z-SSWSs</span>';
      }
      if (formulaLabel) {
        html += ' <span class="z-summary-badge" style="font-size: 0.65rem;">formula</span>';
      }
      html += ' <strong>' + escapeHtml(p.name || p.id) + '</strong>';
      html += link;
      html += '</li>';
    });
    html += '</ul>';
    return html;
  }

  function escapeHtml(s) {
    if (s == null) return '';
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function load() {
    var body = document.getElementById(BODY_ID);
    if (!body) return;

    fetch(DATA_URL, { cache: 'no-store' })
      .then(function (res) {
        if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
        return res.json();
      })
      .then(function (data) {
        var projects = data.projects || [];
        var hub = data.hub || 'ZSanctuary_Universe';
        var pcRoot = data.pc_root || '';
        body.innerHTML = render(projects, hub, pcRoot);
      })
      .catch(function (err) {
        body.innerHTML = '<p class="z-muted">Projects list unavailable. Run server from repo root (e.g. 5502).</p>';
        if (typeof console !== 'undefined' && console.warn) {
          console.warn('Z All Projects panel:', err.message);
        }
      });
  }

  function boot() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', load);
    } else {
      load();
    }
  }

  boot();
})();
