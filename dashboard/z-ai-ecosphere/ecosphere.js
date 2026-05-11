const LEDGER = '../../data/reports/z_ai_ecosphere_ledger.json';
const SYSTEM_HEALTH = '../../data/reports/z_system_health.json';
const COMM_HEALTH = '../../data/reports/z_communication_health.json';
const KRTAA = '../../data/reports/z_krtaa_curriculum.json';
const PAPAO = '../../data/reports/z_papao_precaution_brief.json';
const ZUNO_JSON = '../../data/reports/zuno_system_state_report.json';
const ZUNO_MD = '../../data/reports/zuno_system_state_report.md';

/** @type {{ jsonText: string; mdText: string; obj: object | null }} */
let zunoCache = { jsonText: '', mdText: '', obj: null };

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function load() {
  const mount = document.getElementById('eco-loaded');
  try {
    const [ledgerRes, healthRes, commRes] = await Promise.all([
      fetch(LEDGER, { cache: 'no-store' }),
      fetch(SYSTEM_HEALTH, { cache: 'no-store' }),
      fetch(COMM_HEALTH, { cache: 'no-store' }),
    ]);
    if (!ledgerRes.ok) throw new Error(String(ledgerRes.status));
    const data = await ledgerRes.json();
    let health = null;
    if (healthRes.ok) {
      try {
        health = await healthRes.json();
      } catch {
        health = null;
      }
    }
    let commHealth = null;
    if (commRes.ok) {
      try {
        commHealth = await commRes.json();
      } catch {
        commHealth = null;
      }
    }
    const o = data.overall || {};
    const rings = Array.isArray(data.rings) ? data.rings : [];
    const tasks = data.task_accomplishments || {};

    const healthBlock =
      health && typeof health.health_score === 'number'
        ? `
      <div class="eco-health-card">
        <h2>Z-System — Structural Health</h2>
        <div>
          <strong>Health: ${escapeHtml(String(health.health_score))}%</strong>
          (${escapeHtml(health.status || 'n/a')}) · pressure: <strong>${escapeHtml(String(health.pressure ?? 'n/a'))}</strong>
        </div>
        <div class="eco-muted">
          Modules: ${escapeHtml(String(health.healthy_modules ?? 0))} healthy ·
          ${escapeHtml(String(health.warning_modules ?? 0))} warning ·
          ${escapeHtml(String(health.critical_modules ?? 0))} critical
          (total ${escapeHtml(String(health.modules_total ?? 0))})
        </div>
        <p class="eco-muted" style="margin:0.5rem 0 0">${escapeHtml(health.note || '')}</p>
        <p class="eco-muted" style="margin:0.35rem 0 0">Report: <code>data/reports/z_system_health.json</code> · <code>npm run ai:system:health</code></p>
      </div>
    `
        : `
      <div class="eco-health-card">
        <h2>Z-System — Structural Health</h2>
        <p class="eco-muted">Run <code>npm run ai:system:health</code> (or full garage scan) to generate.</p>
      </div>
    `;

    const src = commHealth?.sources || {};
    const gh = src.github_comms || {};
    const cf = src.cloudflare_comms || {};
    const aa = src.aafrtc_context || {};
    const flowLabel = commHealth?.flow_status || commHealth?.status || 'n/a';
    const commBlock =
      commHealth && typeof commHealth.health_score === 'number'
        ? `
      <div class="eco-comm-card">
        <h2>Z-Communication — Flow health</h2>
        <div>
          <strong>Flow: ${escapeHtml(String(flowLabel).toUpperCase())}</strong>
          · score: <strong>${escapeHtml(String(commHealth.health_score))}%</strong>
          · alignment: <strong>${escapeHtml(String(commHealth.observer_alignment ?? 'n/a'))}</strong>
        </div>
        <div class="eco-muted eco-comm-sources">
          <div><strong>GitHub</strong> · present ${escapeHtml(String(gh.present))} · fresh ${escapeHtml(String(gh.fresh))} · ok ${escapeHtml(gh.ok === null || gh.ok === undefined ? 'n/a' : String(gh.ok))}</div>
          <div><strong>Cloudflare</strong> · present ${escapeHtml(String(cf.present))} · fresh ${escapeHtml(String(cf.fresh))} · ok ${escapeHtml(cf.ok === null || cf.ok === undefined ? 'n/a' : String(cf.ok))}</div>
          <div><strong>AAFRTC</strong> · present ${escapeHtml(String(aa.present))} · fresh ${escapeHtml(String(aa.fresh))}</div>
        </div>
        <div class="eco-muted">
          Commflow: <strong>${escapeHtml(String(commHealth.commflow?.posture ?? 'n/a'))}</strong>
          ${Array.isArray(commHealth.issues) && commHealth.issues.length ? ` · issues: <strong>${escapeHtml(String(commHealth.issues.length))}</strong>` : ''}
        </div>
        <p class="eco-muted" style="margin:0.5rem 0 0">${escapeHtml(commHealth.note || '')}</p>
        <p class="eco-muted" style="margin:0.35rem 0 0">Report: <code>data/reports/z_communication_health.json</code> · <code>npm run ai:communication:health</code></p>
      </div>
    `
        : `
      <div class="eco-comm-card">
        <h2>Z-Communication — Flow health</h2>
        <p class="eco-muted">Run <code>npm run ai:communication:health</code> (or full garage scan) after comms reports exist.</p>
      </div>
    `;

    mount.innerHTML = `
      <p class="eco-muted">${escapeHtml(data.governance_note || '')}</p>
      <div class="eco-overall">
        <div class="eco-meter" style="color:${escapeHtml(o.color || '#789')}">${escapeHtml(String(o.sync_score ?? '—'))}%</div>
        <div>
          <strong>Overall ecosphere sync</strong><br />
          <span class="eco-muted">${escapeHtml(o.band || '')} — ${escapeHtml(o.potential_label || '')}</span>
        </div>
      </div>
      ${healthBlock}
      ${commBlock}
      <h2>Integration rings</h2>
      <div class="eco-rings">
        ${rings
          .map(
            (r) => `
          <div class="eco-ring" style="--ring-color:${escapeHtml(r.color || '#789')}">
            <h3>${escapeHtml(r.ring_title || r.id)}</h3>
            <div class="pct" style="color:${escapeHtml(r.color || '#cde')}">${escapeHtml(String(r.sync_score))}%</div>
            <div class="band">${escapeHtml(r.band)} · ${escapeHtml(r.potential_label || '')}</div>
          </div>
        `
          )
          .join('')}
      </div>
      <h2 style="margin-top:1.2rem">Task accomplishments (creator + business)</h2>
      <div class="eco-tasks eco-muted">
        Combined: <strong>${escapeHtml(String(tasks.total_entries ?? 0))}</strong>
        · avg rating: <strong>${escapeHtml(tasks.avg_rating_pct != null ? String(tasks.avg_rating_pct) : 'n/a')}</strong>
        ${
          tasks.by_namespace
            ? `<div style="margin-top:0.45rem">Creator: <strong>${escapeHtml(String(tasks.by_namespace.creator?.count ?? 0))}</strong> · Business: <strong>${escapeHtml(String(tasks.by_namespace.business?.count ?? 0))}</strong></div>`
            : ''
        }
        ${
          tasks.log_files?.csv_export
            ? `<div style="margin-top:0.35rem">CSV: <code>${escapeHtml(tasks.log_files.csv_export)}</code></div>`
            : ''
        }
        ${
          tasks.combined?.by_actor_class && Object.keys(tasks.combined.by_actor_class).length
            ? `<ul>${Object.entries(tasks.combined.by_actor_class)
                .map(([k, v]) => `<li>${escapeHtml(k)}: ${escapeHtml(String(v))}</li>`)
                .join('')}</ul>`
            : tasks.by_actor_class && Object.keys(tasks.by_actor_class).length
              ? `<ul>${Object.entries(tasks.by_actor_class)
                  .map(([k, v]) => `<li>${escapeHtml(k)}: ${escapeHtml(String(v))}</li>`)
                  .join('')}</ul>`
              : ''
        }
      </div>
    `;
  } catch (e) {
    mount.innerHTML = '<p class="eco-muted">Run <code>npm run ai:ecosphere:refresh</code> from hub root, then serve static files.</p>';
    console.error(e);
  }
}

async function loadKrtaa() {
  const mount = document.getElementById('eco-krtaa');
  if (!mount) return;
  try {
    const res = await fetch(KRTAA, { cache: 'no-store' });
    if (!res.ok) throw new Error(String(res.status));
    const cur = await res.json();
    const globals = Array.isArray(cur.global_lessons) ? cur.global_lessons : [];
    const students = Array.isArray(cur.students) ? cur.students : [];
    const notes = Array.isArray(cur.low_confidence_notes) ? cur.low_confidence_notes : [];

    const globalHtml = globals
      .map(
        (g) => `
      <div class="eco-krtaa-lesson">
        <strong>${escapeHtml(g.id)}</strong> (${escapeHtml(g.confidence || '')})
        <div>${escapeHtml(g.text || '')}</div>
        ${(g.citations || [])
          .map((c) => `<span class="eco-krtaa-cite">${escapeHtml(c.type)}: <code>${escapeHtml(c.ref)}</code></span>`)
          .join('')}
      </div>
    `
      )
      .join('');

    const studentHtml = students
      .map((s) => {
        const les = (s.lessons || [])
          .map(
            (le) => `
        <li><strong>${escapeHtml(le.id)}</strong> — ${escapeHtml(le.text || '')}</li>
      `
          )
          .join('');
        return `
      <div class="eco-krtaa-block">
        <h3>${escapeHtml(s.name || s.id)} <span class="eco-muted">(${escapeHtml(s.role || '')})</span></h3>
        <ul class="eco-links" style="margin-top:0.35rem">${les || '<li class="eco-muted">No lessons</li>'}</ul>
      </div>
    `;
      })
      .join('');

    const notesHtml =
      notes.length > 0
        ? `<p class="eco-muted" style="margin-top:0.75rem"><strong>Notes:</strong> ${notes.map((n) => escapeHtml(n)).join(' ')}</p>`
        : '';

    mount.innerHTML = `
      <h2>Z-KRTAAO curriculum</h2>
      <p class="eco-muted">${escapeHtml(cur.governance_note || '')} · <code>npm run krtaa:curriculum-emit</code> · ${escapeHtml(
        cur.generated_at || ''
      )}</p>
      <h3 style="margin-top:0.85rem">Global lessons</h3>
      ${globalHtml || '<p class="eco-muted">No lessons.</p>'}
      <h3 style="margin-top:1rem">Students (registry)</h3>
      ${studentHtml || '<p class="eco-muted">No students in curriculum.</p>'}
      ${notesHtml}
      <p class="eco-muted" style="margin-top:0.75rem">Report: <code>data/reports/z_krtaa_curriculum.json</code></p>
    `;
  } catch (e) {
    mount.innerHTML = `
      <h2>Z-KRTAAO curriculum</h2>
      <p class="eco-muted">Run <code>npm run krtaa:curriculum-emit</code> from hub root, then refresh. (${escapeHtml(
        e instanceof Error ? e.message : String(e)
      )})</p>
    `;
    console.error(e);
  }
}

async function copyZunoPayload(text, kind) {
  const status = document.getElementById('ecoZunoCopyStatus');
  const setStatus = (msg, ok) => {
    if (status) {
      status.textContent = msg;
      status.style.color = ok ? '#7cfd9a' : '#ff8a8a';
    }
  };
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setStatus(`Copied ${kind} to clipboard.`, true);
  } catch (e) {
    setStatus(`Copy failed — open the file or try again. (${e instanceof Error ? e.message : String(e)})`, false);
  }
}

function renderExecGrid(ex) {
  const keys = [
    ['internal_operations', 'Internal ops'],
    ['public_launch', 'Public launch'],
    ['automation', 'Automation'],
    ['shadow_foundation', 'Shadow foundation'],
    ['extension_guard', 'Extension guard'],
    ['data_leak_watch', 'Data leak'],
    ['disturbance_watch', 'Disturbance'],
  ];
  return keys
    .map(([k, label]) => {
      const v = ex[k];
      return `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(v != null ? String(v) : 'n/a')}</strong></div>`;
    })
    .join('');
}

async function loadZuno() {
  const mount = document.getElementById('eco-zuno');
  if (!mount) return;
  try {
    const [jRes, mRes] = await Promise.all([
      fetch(ZUNO_JSON, { cache: 'no-store' }),
      fetch(ZUNO_MD, { cache: 'no-store' }),
    ]);
    if (!jRes.ok) throw new Error(`Zuno JSON ${jRes.status}`);
    const jsonText = await jRes.text();
    let obj = null;
    try {
      obj = JSON.parse(jsonText);
    } catch {
      obj = null;
    }
    const mdText = mRes.ok ? await mRes.text() : '';
    zunoCache = { jsonText, mdText, obj };

    const ex = (obj && obj.executive_status) || {};
    const comm = (obj && obj.communication_health) || {};
    const ext = (obj && obj.external_observers_health) || {};
    const traffic = (obj && obj.traffic_intelligence) || {};
    const fusion = (obj && obj.fusion_council) || {};
    const gen = (obj && obj.generated_at) || '';

    mount.innerHTML = `
      <h2>Zuno — full system state report</h2>
      <p class="eco-muted">Generated <strong>${escapeHtml(gen)}</strong> · regenerate: <code>node scripts/z_zuno_state_report.mjs</code></p>
      <h3 style="margin:0.85rem 0 0.35rem;font-size:0.95rem;color:#b8a8ff">Executive status</h3>
      <div class="eco-zuno-exec">${renderExecGrid(ex)}</div>
      <div class="eco-muted" style="margin:0.5rem 0 0">
        <strong>Communication</strong> · flow ${escapeHtml(String(comm.flow_status || 'n/a'))}
        · score ${escapeHtml(String(comm.health_score != null ? comm.health_score : 'n/a'))}%
        · commflow <strong>${escapeHtml(String(comm.commflow_posture || 'n/a'))}</strong>
      </div>
      <div class="eco-muted" style="margin:0.35rem 0 0">
        <strong>Traffic (RTRO)</strong> · ${escapeHtml(String(traffic.traffic_state || 'n/a'))}
        · bottleneck <strong>${escapeHtml(String(traffic.bottleneck || 'n/a'))}</strong>
      </div>
      <div class="eco-muted" style="margin:0.35rem 0 0">
        <strong>Observers</strong> · ${escapeHtml(String(ext.status || 'n/a'))}
        ${ext.max_age_hours != null ? ` · max age ${escapeHtml(String(ext.max_age_hours))}h` : ''}
      </div>
      <p class="eco-muted" style="margin:0.5rem 0 0">
        <strong>Fusion council:</strong> ${escapeHtml(fusion.final_recommendation || 'n/a')}
      </p>
      <div class="eco-zuno-actions">
        <button type="button" class="eco-zuno-btn" id="ecoZunoCopyJson" aria-label="Copy full Zuno report as JSON">Copy full report (JSON)</button>
        <button type="button" class="eco-zuno-btn" id="ecoZunoCopyMd" aria-label="Copy full Zuno report as Markdown" ${mdText ? '' : 'disabled'}>Copy full report (Markdown)</button>
        <a class="eco-zuno-btn" style="text-decoration:none;display:inline-block" href="${ZUNO_JSON}" target="_blank" rel="noopener">Open JSON</a>
        ${
          mdText
            ? `<a class="eco-zuno-btn" style="text-decoration:none;display:inline-block" href="${ZUNO_MD}" target="_blank" rel="noopener">Open Markdown</a>`
            : '<span class="eco-muted" style="align-self:center">Markdown not available (run Zuno, then refresh)</span>'
        }
      </div>
      <p class="eco-zuno-status" id="ecoZunoCopyStatus" role="status" aria-live="polite"></p>
      <p class="eco-muted" style="margin:0.6rem 0 0">Reports: <code>data/reports/zuno_system_state_report.json</code> · <code>data/reports/zuno_system_state_report.md</code></p>
    `;

    const bj = document.getElementById('ecoZunoCopyJson');
    const bm = document.getElementById('ecoZunoCopyMd');
    if (bj) bj.addEventListener('click', () => copyZunoPayload(zunoCache.jsonText, 'JSON'));
    if (bm && mdText) bm.addEventListener('click', () => copyZunoPayload(zunoCache.mdText, 'Markdown'));
  } catch (e) {
    mount.innerHTML = `
      <h2>Zuno — full system state report</h2>
      <p class="eco-muted">Run <code>node scripts/z_zuno_state_report.mjs</code> from hub root, then refresh. (${escapeHtml(
        e instanceof Error ? e.message : String(e)
      )})</p>
      <p class="eco-muted">Expected files: <code>data/reports/zuno_system_state_report.json</code> · <code>.md</code></p>
    `;
    console.error(e);
  }
}

async function loadPapao() {
  const mount = document.getElementById('eco-papao');
  if (!mount) return;
  try {
    const res = await fetch(PAPAO, { cache: 'no-store' });
    if (!res.ok) throw new Error(String(res.status));
    const brief = await res.json();
    const alerts = Array.isArray(brief.alerts) ? brief.alerts : [];
    const pre = Array.isArray(brief.precautions) ? brief.precautions : [];

    const alertHtml = alerts
      .map(
        (a) => `
      <div class="eco-krtaa-lesson">
        <strong>${escapeHtml(a.code || '')}</strong> (${escapeHtml(a.severity || '')})
        <div>${escapeHtml(a.message || '')}</div>
        <span class="eco-krtaa-cite">citation: <code>${escapeHtml(a.citation || '')}</code></span>
      </div>
    `
      )
      .join('');

    const preHtml = pre
      .map(
        (p) => `
      <li>${escapeHtml(p.text || '')}<div class="eco-krtaa-cite"><code>${escapeHtml(p.citation || '')}</code>${
          p.doc ? ` · <code>${escapeHtml(p.doc)}</code>` : ''
        }</div></li>
    `
      )
      .join('');

    mount.innerHTML = `
      <h2>Z-PAPAO pre-alert brief</h2>
      <p class="eco-muted">${escapeHtml(brief.governance_note || '')} · <code>npm run papao:precaution-emit</code> · ${escapeHtml(
        brief.generated_at || ''
      )}</p>
      <h3 style="margin-top:0.85rem">Pre-alerts</h3>
      ${alertHtml || '<p class="eco-muted">No alerts from current reports.</p>'}
      <h3 style="margin-top:1rem">Precautions</h3>
      <ul class="eco-links" style="margin-top:0.35rem">${preHtml || '<li class="eco-muted">None listed.</li>'}</ul>
      <p class="eco-muted" style="margin-top:0.75rem">Report: <code>data/reports/z_papao_precaution_brief.json</code></p>
    `;
  } catch (e) {
    mount.innerHTML = `
      <h2>Z-PAPAO pre-alert brief</h2>
      <p class="eco-muted">Run <code>npm run papao:precaution-emit</code> from hub root, then refresh. (${escapeHtml(
        e instanceof Error ? e.message : String(e)
      )})</p>
    `;
    console.error(e);
  }
}

load();
loadKrtaa();
loadPapao();
loadZuno();
