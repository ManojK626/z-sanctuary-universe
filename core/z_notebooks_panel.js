// Z: core\z_notebooks_panel.js
(function () {
  const PANEL_ID = 'zNotebookPanel';

  function render(entries) {
    const container = document.getElementById(PANEL_ID);
    if (!container) return;
    const contractLink =
      '<div class="z-notebook-contract"><a href="../docs/notebook_contract.md" target="_blank">Notebook Contract (v1)</a> · Reflections only (no execution)</div>';
    if (!entries.length) {
      container.innerHTML = `${contractLink}<p>No notebook insights yet.</p>`;
      return;
    }

    container.innerHTML =
      `${contractLink}` +
      entries
        .map(
          (entry) => `
      <div class="z-notebook-entry">
        <div class="z-notebook-head">
          ${entry.author_type?.toUpperCase() || 'NOTE'} · ${entry.context || 'observation'}
        </div>
        <div class="z-notebook-body">${entry.body}</div>
        <div class="z-notebook-meta">
          Linked ${entry.linked_formula?.join(', ') || '—'} · ${entry.dataset_state || 'manual'}
        </div>
      </div>
    `
        )
        .join('');
  }

  window.addEventListener('z-notebook-updated', () => {
    render(window.ZNotebooks?.listRecent(4) || []);
  });

  document.addEventListener('DOMContentLoaded', () => {
    render(window.ZNotebooks?.listRecent(4) || []);
  });
})();
