// Z: Amk_Goku Worldwide Loterry\ui\public_trust\trust_portal.js
async function loadJSON(path) {
  try {
    const res = await fetch(path);
    return await res.json();
  } catch {
    return null;
  }
}

function minutesSince(ts) {
  if (!ts) return null;
  const parsed = Date.parse(ts);
  if (Number.isNaN(parsed)) return null;
  return Math.floor((Date.now() - parsed) / 60000);
}

function toneClass(tone) {
  if (!tone || tone === 'neutral') return '';
  return ` badge-${tone}`;
}

function coverageTone(percent) {
  if (typeof percent !== 'number') return 'neutral';
  if (percent >= 60) return 'good';
  if (percent >= 30) return 'warn';
  return 'bad';
}

function priorityTone(openCount) {
  if (typeof openCount !== 'number') return 'neutral';
  if (openCount <= 2) return 'good';
  if (openCount <= 6) return 'warn';
  return 'bad';
}

function toneHint(tone, kind) {
  if (tone === 'warn' && kind === 'coverage') return 'Coverage below 60%';
  if (tone === 'bad' && kind === 'coverage') return 'Coverage below 30%';
  if (tone === 'warn' && kind === 'priority') return 'Open items above 2';
  if (tone === 'bad' && kind === 'priority') return 'Open items above 6';
  return '';
}

function sparkline(values) {
  if (!Array.isArray(values) || !values.length) return '--';
  const bars = '▁▂▃▄▅▆▇█';
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  return values
    .map((v) => {
      const idx = Math.max(
        0,
        Math.min(bars.length - 1, Math.round(((v - min) / span) * (bars.length - 1)))
      );
      return bars[idx];
    })
    .join('');
}

function zunoOpsTone(internalOps) {
  const value = String(internalOps || '').toLowerCase();
  if (value.includes('green')) return 'good';
  if (value.includes('hold')) return 'warn';
  return 'bad';
}

function deltaTone(delta, inverted = false) {
  if (typeof delta !== 'number') return 'neutral';
  if (delta === 0) return 'neutral';
  if (inverted) return delta < 0 ? 'good' : 'warn';
  return delta > 0 ? 'good' : 'warn';
}

/** Hub-wide Z-Zuno coverage + Phase 3 plan (read-only). Paths assume portal opened from hub repo layout. */
function hubZunoCoverageBlock(cov, plan) {
  if (!cov || !cov.summary_counts) {
    return `
    <h2>Hub Z-Zuno module coverage (read-only)</h2>
    <div class="box muted">
      Open this portal from <strong>ZSanctuary_Universe</strong> (hub root) and run
      <code>npm run zuno:coverage</code> · <code>npm run zuno:phase3-plan</code> so
      <code>../../../data/reports/z_zuno_coverage_audit.json</code> resolves.
    </div>`;
  }
  const c = cov.summary_counts;
  const h = cov.ancillary && cov.ancillary.master_registry_status_histogram;
  const histStr =
    h && typeof h === 'object' ? Object.entries(h).map(([k, v]) => `${k}: ${v}`).join(' · ') : '—';
  const planTime = plan && plan.generated_at ? plan.generated_at : '— (run npm run zuno:phase3-plan from hub)';
  return `
    <h2>Hub Z-Zuno module coverage (read-only)</h2>
    <div class="box">
      <div>Audit generated: <b>${cov.generated_at || '—'}</b></div>
      <div>
        FOUND_FULL: <b>${c.FOUND_FULL ?? '—'}</b> · FOUND_PARTIAL: <b>${c.FOUND_PARTIAL ?? '—'}</b> · MISSING:
        <b>${c.MISSING ?? '—'}</b>
      </div>
      <div>
        DUPLICATE_OR_CONFLICT: <b>${c.DUPLICATE_OR_CONFLICT ?? '—'}</b> · NEEDS_SAFETY_REVIEW:
        <b>${c.NEEDS_SAFETY_REVIEW ?? '—'}</b> · NEEDS_DECISION: <b>${c.NEEDS_DECISION ?? '—'}</b>
      </div>
      <div class="muted">Registry posture (master): ${histStr}</div>
      <div class="muted">Phase 3 plan generated: <b>${planTime}</b></div>
      <div class="muted" style="margin-top:8px;">
        <a href="../../../data/reports/z_zuno_coverage_audit.md" target="_blank" rel="noopener noreferrer">Coverage MD</a> ·
        <a href="../../../data/reports/z_zuno_coverage_audit.json" target="_blank" rel="noopener noreferrer">Coverage JSON</a> ·
        <a href="../../../data/reports/z_zuno_phase3_completion_plan.md" target="_blank" rel="noopener noreferrer">Phase 3 plan MD</a> ·
        <a href="../../../data/reports/z_zuno_phase3_completion_plan.json" target="_blank" rel="noopener noreferrer">Phase 3 plan JSON</a>
      </div>
      <div class="muted" style="margin-top:6px;">Read-only — no fix/build controls. Deployment HOLD.</div>
    </div>`;
}

(async function () {
  const root = document.getElementById('trust-root');
  const badges = document.getElementById('trustBadges');

  const trust = await loadJSON('../../data/reports/trust/summary.json');
  const drift = await loadJSON('../../data/drift_watch/summary.json');
  const vault = await loadJSON('../../data/lottery_vault/health.json');
  const status = await loadJSON('../../data/reports/system_status.json');
  const jailcell = await loadJSON('../../data/jailcell/public_summary.json');
  const aiStatus = await loadJSON('../../data/reports/z_ai_status.json');
  const zOctave = await loadJSON('../../data/reports/z_octave_readiness.json');
  const zOctavePilotSeed = await loadJSON('../../data/reports/z_octave_pilot_seed.json');
  const moduleAudit = await loadJSON('../../data/reports/z_module_registry_audit.json');
  const priorityAudit = await loadJSON('../../data/reports/z_priority_audit.json');
  const zunoState = await loadJSON('../../data/reports/zuno_system_state_report.json');
  const zunoHistory = await loadJSON('../../data/reports/zuno_state_history.json');
  const zunoHubCoverage = await loadJSON('../../../data/reports/z_zuno_coverage_audit.json');
  const zunoPhase3PlanRoot = await loadJSON('../../../data/reports/z_zuno_phase3_completion_plan.json');
  const zProof = await loadJSON('../../data/reports/z_proof_mesh_card.json');
  const zDataLeak = await loadJSON('../../data/reports/z_data_leak_audit.json');
  const aiAgeMin = minutesSince(aiStatus?.generated_at);
  const aiFresh = aiAgeMin !== null && aiAgeMin <= 60;
  const zunoRows = Array.isArray(zunoHistory) ? zunoHistory.slice(-7) : [];
  const zunoModuleSpark = sparkline(
    zunoRows.map((r) => Number(r?.metrics?.module_completion_pct || 0))
  );
  const zunoPendingSpark = sparkline(zunoRows.map((r) => Number(r?.metrics?.pending_total || 0)));
  const zunoOps = zunoState?.executive_status?.internal_operations || 'unknown';
  const zunoOpsToneValue = zunoOpsTone(zunoOps);
  const zunoModuleDelta = zunoState?.trend_7d?.module_completion_delta_pct;
  const zunoOpenDelta = zunoState?.trend_7d?.task_open_delta;
  const zunoPendingDelta = zunoState?.trend_7d?.pending_delta;

  const trustPackStatus = await loadJSON('../../exports/trust_pack_2026-01/TRUST_PACK_STATUS.json');

  root.innerHTML = `
    <h2>Latest Trust Snapshot <a href="#" onclick="openLearningCard('learning.trust.basics')" style="font-size:11px;opacity:.7;text-decoration:underline;">Why?</a></h2>
    <div class="box muted" style="display:flex;gap:10px;flex-wrap:wrap;">
      <span class="badge">Quiet: ${status?.quiet_mode?.active ? 'active' : 'inactive'}</span>
      <span class="badge">Trust Pack: ${trustPackStatus?.core_version || 'v1.0'} (${trustPackStatus?.status || 'reference'})</span>
      <a class="badge" href="../../exports/trust_pack_2026-01/" target="_blank">Open Trust Pack</a>
    </div>
    <div class="box muted" style="display:flex;gap:10px;flex-wrap:wrap;">
      <span>
        Gentle Trust Mode:
        <a href="../../docs/gentle_trust_mode.md" target="_blank">Open walkthrough</a>
      </span>
      <span>
        Stillness explained:
        <a href="#" onclick="openLearningCard('learning.rhythm.basics')">Why we pause</a>
      </span>
    </div>
    <div class="box">
      <div>Run ID: <b>${trust?.run_id || 'unknown'}</b></div>
      <div>Timestamp: ${trust?.ts || '—'}</div>
      <div>Covered lotteries: ${trust?.covered?.join(', ') || '—'}</div>
      <div>Skipped lotteries: ${trust?.skipped?.join(', ') || '—'}</div>
      <div class="muted">${trust?.notes || ''}</div>
    </div>

    <h2>AI Status (Read-Only)</h2>
    <div class="box">
      <div>Generated: <b>${aiStatus?.generated_at || '—'}</b></div>
      <div>Freshness: <b>${aiAgeMin === null ? 'unknown' : aiFresh ? 'fresh' : 'stale'}</b></div>
      <div>Scope: ${aiStatus?.scope || '—'}</div>
      <div>Summary: ${aiStatus?.summary || 'No live summary available.'}</div>
      <div class="muted">
        <a href="../../data/reports/z_ai_status.json" target="_blank">Open AI Status JSON</a>
      </div>
    </div>

    <h2>Z-OCTAVE Readiness (Read-Only)</h2>
    <div class="box">
      <div>Generated: <b>${zOctave?.generated_at || '—'}</b></div>
      <div>Public Ready: <b>${zOctave?.ready ? 'yes' : 'no'}</b></div>
      <div class="muted">Product: ${zOctave?.product || 'Z-OCTAVE'}</div>
      <div>Pilot seed: <b>${zOctave?.pilot_seed || zOctavePilotSeed ? 'present' : 'missing'}</b></div>
      <div style="margin-top:8px;">
        <b>Gates</b>
        <ul class="muted">
          ${
            zOctave?.gates
              ? zOctave.gates
                  .map(
                    (g) =>
                      `<li>${g.label}: ${g.pass ? 'pass' : 'hold'} ${g.note ? `— ${g.note}` : ''}</li>`
                  )
                  .join('')
              : '<li>—</li>'
          }
        </ul>
      </div>
      <div class="muted">
        <a href="../../data/reports/z_octave_readiness.json" target="_blank">Open Z-OCTAVE readiness JSON</a>
      </div>
      <div class="muted">
        <a href="../../ethics/crisis-charter.md" target="_blank">Open Crisis & Ethics Charter</a>
      </div>
    </div>

    <h2>Module Registry & Priority (Read-Only)</h2>
    <div class="box">
      <div>
        Module audit:
        <span class="pill${toneClass(coverageTone(moduleAudit?.coverage_percent))}">${moduleAudit?.coverage_percent ?? '—'}%</span>
        coverage
        ${
          toneHint(coverageTone(moduleAudit?.coverage_percent), 'coverage')
            ? `<span class="muted" style="margin-left:6px;">(${toneHint(coverageTone(moduleAudit?.coverage_percent), 'coverage')})</span>`
            : ''
        }
      </div>
      <div>
        Total modules:
        <span class="pill">${moduleAudit?.total ?? '—'}</span>
        · Done:
        <span class="pill">${moduleAudit?.done ?? '—'}</span>
      </div>
      <div>Audit updated: ${moduleAudit?.generated_at || '—'}</div>
      <div class="muted">
        <a href="../../data/reports/z_module_registry_audit.json" target="_blank">Open module audit JSON</a>
      </div>
    </div>
    <div class="box">
      <div>
        Priority audit:
        <span class="pill${toneClass(priorityTone(priorityAudit?.open))}">${priorityAudit?.open ?? '—'}</span>
        open
        ${
          toneHint(priorityTone(priorityAudit?.open), 'priority')
            ? `<span class="muted" style="margin-left:6px;">(${toneHint(priorityTone(priorityAudit?.open), 'priority')})</span>`
            : ''
        }
      </div>
      <div>
        P1: <span class="pill">${priorityAudit?.by_priority?.P1 ?? '—'}</span>
        · P2: <span class="pill">${priorityAudit?.by_priority?.P2 ?? '—'}</span>
      </div>
      <div>Audit updated: ${priorityAudit?.generated_at || '—'}</div>
      <div class="muted">
        <a href="../../data/reports/z_priority_audit.json" target="_blank">Open priority audit JSON</a>
      </div>
    </div>

    <h2>Drift Watch <a href="#" onclick="openLearningCard('learning.rhythm.basics')" style="font-size:11px;opacity:.7;text-decoration:underline;">Why?</a></h2>
    <div class="box">
      <div>Status: <b>${drift?.status || 'unknown'}</b></div>
      <div>Notes: ${drift?.notes || '—'}</div>
    </div>

    <h2>Lottery Vault (Manual Sources) <a href="#" onclick="openLearningCard('learning.orientation.level0')" style="font-size:11px;opacity:.7;text-decoration:underline;">Why?</a></h2>
    <div class="box">
      <div>Manual sources present: <b>${vault?.manual_present ?? '—'}</b> / ${vault?.manual_total ?? '—'}</div>
      <div class="muted">Missing: ${vault?.manual_missing ?? '—'}</div>
      <div class="muted">Updated: ${vault?.generated_at || '—'}</div>
    </div>

    <h2>System Status <a href="#" onclick="openLearningCard('learning.orientation.level0')" style="font-size:11px;opacity:.7;text-decoration:underline;">Why?</a></h2>
    <div class="box">
      <div>Generated: <b>${status?.generated_at || '—'}</b></div>
      <div>Manual missing: ${status?.data_coverage?.missing ?? '—'}</div>
      <div>Drift codes: ${status?.drift_codes || '—'}</div>
      <div>Rhythm state: ${status?.rhythm_state || '—'}</div>
      <div>Quiet mode: ${status?.quiet_mode?.active ? 'active' : 'inactive'}</div>
      <div>Jailcell total: ${status?.observatory?.jailcell_total ?? '—'}</div>
      <div>APICON avg: ${status?.observatory?.apicon_avg ?? '—'}</div>
      <div>Feeling Analyzer: Observational only</div>
      <div class="muted">Latest trust bundle: ${status?.trust_bundle || '—'}</div>
    </div>

    <h2>State of System (Concise)</h2>
    <div class="box">
      <div>
        <a href="../../data/reports/z_state_brief.md" target="_blank">Open Z State Brief</a>
      </div>
      <div>
        <a href="../../SYSTEM_STATUS.md" target="_blank">Open SYSTEM_STATUS.md</a>
      </div>
      <div class="muted">Short, professional summary for quick trust review.</div>
    </div>

    ${hubZunoCoverageBlock(zunoHubCoverage, zunoPhase3PlanRoot)}

    <h2>Zuno 7-Day Trend (Read-Only)</h2>
    <div class="box">
      <div>Generated: <b>${zunoState?.generated_at || '—'}</b></div>
      <div>
        Internal operations:
        <span class="pill badge${toneClass(zunoOpsToneValue)}">${zunoOps}</span>
      </div>
      <div>
        Public launch:
        <span class="pill badge${toneClass(zunoState?.executive_status?.public_launch === 'ready' ? 'good' : 'warn')}">${zunoState?.executive_status?.public_launch || '—'}</span>
      </div>
      <div style="margin-top:6px;">
        Module completion:
        <span class="pill">${zunoState?.current?.metrics?.module_completion_pct ?? '—'}%</span>
        <span class="pill" style="font-family:Consolas,'Courier New',monospace;">${zunoModuleSpark}</span>
      </div>
      <div>
        Pending audit:
        <span class="pill">${zunoState?.current?.metrics?.pending_total ?? '—'}</span>
        <span class="pill" style="font-family:Consolas,'Courier New',monospace;">${zunoPendingSpark}</span>
      </div>
      <div class="muted">
        7d deltas:
        <span class="pill badge${toneClass(deltaTone(zunoModuleDelta))}">module ${zunoModuleDelta ?? 'n/a'} pt</span>
        <span class="pill badge${toneClass(deltaTone(zunoOpenDelta, true))}">open ${zunoOpenDelta ?? 'n/a'}</span>
        <span class="pill badge${toneClass(deltaTone(zunoPendingDelta, true))}">pending ${zunoPendingDelta ?? 'n/a'}</span>
      </div>
      <div class="muted">
        <a href="../../data/reports/zuno_system_state_report.md" target="_blank">Open Zuno system report</a>
      </div>
    </div>

    <h2>Z-Proof Mesh Card (Read-Only)</h2>
    <div class="box">
      <div>Generated: <b>${zProof?.generated_at || '—'}</b></div>
      <div>
        Status:
        <span class="pill badge${toneClass(zProof?.status === 'green' ? 'good' : zProof?.status === 'hold' ? 'warn' : 'bad')}">${zProof?.status || '—'}</span>
      </div>
      <div>
        Score:
        <span class="pill">${zProof?.score_pct ?? '—'}%</span>
        · Checks:
        <span class="pill">${zProof?.pass_count ?? '—'}/${zProof?.total_checks ?? '—'}</span>
      </div>
      <div class="muted">
        signatures:
        trust_hash=${zProof?.signatures?.trust_pack_hashes_sha256 ? 'yes' : 'no'},
        health_hash=${zProof?.signatures?.health_certificate_sha256 ? 'yes' : 'no'}
      </div>
      <div class="muted">
        <a href="../../data/reports/z_proof_mesh_card.json" target="_blank">Open proof card JSON</a>
      </div>
    </div>

    <h2>Data Leak Watch (Read-Only)</h2>
    <div class="box">
      <div>Generated: <b id="zDataLeakGeneratedAt">${zDataLeak?.generated_at || '—'}</b></div>
      <div>
        Status:
        <span id="zDataLeakStatusPill" class="pill badge${toneClass(zDataLeak?.status === 'green' ? 'good' : zDataLeak?.status === 'hold' ? 'warn' : 'bad')}">${zDataLeak?.status || 'unknown'}</span>
      </div>
      <div>
        Findings:
        <span id="zDataLeakFindings" class="pill">${zDataLeak?.findings_count ?? '—'}</span>
        · critical:
        <span id="zDataLeakCritical" class="pill">${zDataLeak?.counts?.critical ?? '—'}</span>
        · high:
        <span id="zDataLeakHigh" class="pill">${zDataLeak?.counts?.high ?? '—'}</span>
      </div>
      <div id="zDataLeakNote" class="muted">${zDataLeak?.note || 'Audit-only detector. No automatic file mutation.'}</div>
      <div class="muted">
        <a href="../../data/reports/z_data_leak_audit.json" target="_blank">Open data leak audit JSON</a>
      </div>
    </div>

    <h2>Registry Legend</h2>
    <div class="box">
      <div>🟦 Registered format</div>
      <div>⬜ No data yet (manual / missing)</div>
      <div>🟩 Verified history ingested</div>
    </div>

    <h2>Known Issues & Handling (Z-JAILCELL) <a href="#" onclick="openLearningCard('learning.jailcell.basics')" style="font-size:11px;opacity:.7;text-decoration:underline;">Why?</a></h2>
    <div class="box">
      <div>Status: <b>${jailcell?.status || 'unknown'}</b></div>
      <div>Total specimens: ${jailcell?.total ?? '—'}</div>
      <div style="margin-top:8px;">
        <b>By category</b>
        <ul class="muted">
          ${
            jailcell?.by_category
              ? Object.entries(jailcell.by_category)
                  .map(([k, v]) => `<li>${k}: ${v}</li>`)
                  .join('')
              : '<li>—</li>'
          }
        </ul>
      </div>
      <div>
        <b>By severity</b>
        <ul class="muted">
          ${
            jailcell?.by_severity
              ? Object.entries(jailcell.by_severity)
                  .map(([k, v]) => `<li>${k}: ${v}</li>`)
                  .join('')
              : '<li>—</li>'
          }
        </ul>
      </div>
      <div class="muted">
        ${jailcell?.notes || 'Specimens are observed, categorized, and studied. No execution.'}
      </div>
    </div>

    <h2>Artifacts</h2>
    <div class="box">
      <div>
        <a href="../../data/reports/trust/${trust?.pdf || ''}" target="_blank">
        Latest Trust PDF
        </a>
      </div>
      <div class="muted">
        Generated automatically from ingested historical data.
      </div>
    </div>

    <h2>Disclaimer</h2>
    <div class="box muted">
      This system is an observational and analytical platform.
      It does not provide guarantees, betting advice, or predictive certainty.
      All outputs are derived from historical data and published transparently.
      Detected anomalies are quarantined in Z-JAILCELL for analysis and learning; they never trigger actions or predictions.
    </div>

    <div class="box muted">
      Z-Sanctuary is designed to pause. Not every cycle produces change. Stillness is how trust compounds.
    </div>
  `;

  if (badges) {
    const items = [
      { label: 'Feeling Analyzer — Observational', tone: 'neutral' },
      { label: 'Rhythm — Observational', tone: 'neutral' },
      { label: 'Trust Bond — Consent First', tone: 'neutral' },
      {
        label: aiStatus ? `AI Status — ${aiFresh ? 'Fresh' : 'Stale'}` : 'AI Status — Missing',
        tone: aiFresh ? 'good' : 'warn',
      },
      {
        label: moduleAudit
          ? `Module Coverage — ${moduleAudit.coverage_percent ?? 0}%`
          : 'Module Coverage — --',
        tone: coverageTone(moduleAudit?.coverage_percent),
      },
      {
        label: priorityAudit
          ? `Priority Open — ${priorityAudit.open ?? '—'}`
          : 'Priority Open — --',
        tone: priorityTone(priorityAudit?.open),
      },
      {
        label: zunoState
          ? `Zuno 7d — ${zunoState?.trend_7d?.hygiene_green_days ?? 0}/${zunoState?.trend_7d?.window_days ?? 0} green`
          : 'Zuno 7d — --',
        tone: (zunoState?.executive_status?.internal_operations || '').includes('green')
          ? 'good'
          : 'warn',
      },
      {
        label: zProof
          ? `Proof Mesh — ${zProof.score_pct ?? 0}% (${zProof.status || 'hold'})`
          : 'Proof Mesh — --',
        tone: zProof?.status === 'green' ? 'good' : zProof?.status === 'hold' ? 'warn' : 'bad',
      },
      {
        label: zDataLeak
          ? `Data Leak Watch — ${zDataLeak.findings_count ?? 0} (${zDataLeak.status || 'unknown'})`
          : 'Data Leak Watch — --',
        id: 'zDataLeakBadge',
        tone:
          zDataLeak?.status === 'green' ? 'good' : zDataLeak?.status === 'hold' ? 'warn' : 'bad',
      },
    ];
    badges.innerHTML = items
      .map((item) => {
        const idAttr = item.id ? ` id="${item.id}"` : '';
        return `<span${idAttr} class="badge${toneClass(item.tone)}">${item.label}</span>`;
      })
      .join('');
  }

  async function refreshDataLeakWatch() {
    const latest = await loadJSON('../../data/reports/z_data_leak_audit.json');
    if (!latest) return;

    const status = latest.status || 'unknown';
    const tone = status === 'green' ? 'good' : status === 'hold' ? 'warn' : 'bad';

    const generatedEl = document.getElementById('zDataLeakGeneratedAt');
    if (generatedEl) generatedEl.textContent = latest.generated_at || '—';

    const statusEl = document.getElementById('zDataLeakStatusPill');
    if (statusEl) {
      statusEl.textContent = status;
      statusEl.classList.remove('badge-good', 'badge-warn', 'badge-bad');
      statusEl.classList.add(`badge-${tone}`);
    }

    const findingsEl = document.getElementById('zDataLeakFindings');
    if (findingsEl) findingsEl.textContent = String(latest.findings_count ?? '—');

    const criticalEl = document.getElementById('zDataLeakCritical');
    if (criticalEl) criticalEl.textContent = String(latest?.counts?.critical ?? '—');

    const highEl = document.getElementById('zDataLeakHigh');
    if (highEl) highEl.textContent = String(latest?.counts?.high ?? '—');

    const noteEl = document.getElementById('zDataLeakNote');
    if (noteEl)
      noteEl.textContent = latest.note || 'Audit-only detector. No automatic file mutation.';

    const badgeEl = document.getElementById('zDataLeakBadge');
    if (badgeEl) {
      badgeEl.textContent = `Data Leak Watch — ${latest.findings_count ?? 0} (${status})`;
      badgeEl.classList.remove('badge-good', 'badge-warn', 'badge-bad');
      badgeEl.classList.add(`badge-${tone}`);
    }
  }

  const reqName = document.getElementById('zReqName');
  const reqOrg = document.getElementById('zReqOrg');
  const reqEmail = document.getElementById('zReqEmail');
  const reqTopic = document.getElementById('zReqTopic');
  const reqBody = document.getElementById('zReqBody');
  const reqMailto = document.getElementById('zReqMailto');
  const reqStatus = document.getElementById('zReqStatus');

  function buildRequestText() {
    const parts = [
      `Topic: ${reqTopic?.value || 'general'}`,
      reqName?.value ? `Name: ${reqName.value}` : null,
      reqOrg?.value ? `Organization: ${reqOrg.value}` : null,
      reqEmail?.value ? `Email: ${reqEmail.value}` : null,
      '',
      reqBody?.value ? reqBody.value : 'Questions:',
    ].filter(Boolean);
    return parts.join('\n');
  }

  function syncMailto() {
    if (!reqMailto) return;
    const body = encodeURIComponent(buildRequestText());
    const subject = encodeURIComponent(
      `Z‑Sanctuary info request (${reqTopic?.value || 'general'})`
    );
    reqMailto.href = `mailto:trust@z-sanctuary.local?subject=${subject}&body=${body}`;
    reqMailto.style.pointerEvents = 'auto';
    reqMailto.style.opacity = '1';
  }

  function onInputChange() {
    if (reqStatus) reqStatus.textContent = 'Ready to open email request.';
    syncMailto();
  }

  [reqName, reqOrg, reqEmail, reqTopic, reqBody].forEach((el) => {
    if (el) el.addEventListener('input', onInputChange);
  });
  if (reqTopic) reqTopic.addEventListener('change', onInputChange);
  setInterval(refreshDataLeakWatch, 60_000);
})();
