const REG = '../../data/z_qa_rp_registry.json';

async function load() {
  const mount = document.getElementById('qrp-loaded');
  try {
    const res = await fetch(REG, { cache: 'no-store' });
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();

    const stages = (data.pathways && data.pathways.stages) || [];
    const feeds = Array.isArray(data.ecosystem_feeds) ? data.ecosystem_feeds : [];
    const templates = Array.isArray(data.self_inquiry_templates) ? data.self_inquiry_templates : [];
    const rules = Array.isArray(data.handoff_rules) ? data.handoff_rules : [];

    mount.innerHTML = `
      <h2>${escapeHtml(data.title || 'Z-Q&A&RP')}</h2>
      <p class="qrp-muted">${escapeHtml(data.subtitle || '')}</p>
      <p>${escapeHtml(data.purpose || '')}</p>

      <h3 style="margin-top:1rem;font-size:0.95rem;color:#7ef0d8">DRP (${data.drp && data.drp.gates_count || 14} gates)</h3>
      <p class="qrp-muted">Verifier checklist: <code>${escapeHtml((data.drp && data.drp.canonical_doc) || '')}</code></p>

      <h3 style="margin-top:1rem;font-size:0.95rem;color:#7ef0d8">Pathway stages</h3>
      <ol class="qrp-list">${stages.map((s) => `<li><span class="qrp-tag">${escapeHtml(s)}</span></li>`).join('')}</ol>

      <h3 style="margin-top:1rem;font-size:0.95rem;color:#7ef0d8">Ecosystem feeds (read for answers)</h3>
      <ul class="qrp-list">${feeds.map((f) => `<li><strong>${escapeHtml(f.id)}</strong> — <code>${escapeHtml(f.path)}</code> · ${escapeHtml(f.role || '')}</li>`).join('')}</ul>

      <h3 style="margin-top:1rem;font-size:0.95rem;color:#7ef0d8">Self-inquiry templates (for genius AIs)</h3>
      <ul class="qrp-list">${templates.map((t) => `<li>${escapeHtml(t)}</li>`).join('')}</ul>

      <h3 style="margin-top:1rem;font-size:0.95rem;color:#7ef0d8">Handoff rules</h3>
      <ul class="qrp-list">${rules.map((r) => `<li>${escapeHtml(r)}</li>`).join('')}</ul>

      <p class="qrp-muted" style="margin-top:1rem">Intake log (append-only, human-approved): <code>${escapeHtml(data.intake_log_append_only || '')}</code></p>
    `;
  } catch (e) {
    mount.innerHTML = '<p class="qrp-muted">Could not load registry. Serve hub root and ensure <code>data/z_qa_rp_registry.json</code> exists.</p>';
    console.error(e);
  }
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

load();
