#!/usr/bin/env node
/**
 * Z-VILE-FOUNDATION-READINESS-1 — Read-only Track A foundation posture rollup.
 * Writes only: data/reports/z_vile_foundation_readiness_status.{json,md}
 * Does not: merge, deploy, run workspace tests, mutate packages, or touch siblings.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = process.cwd();

const POLICY_PATH = path.join(ROOT, 'data', 'z_vile_foundation_readiness_policy.json');
const RELEASE = path.join(ROOT, 'data', 'z_release_control.json');
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_vile_foundation_readiness_status.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_vile_foundation_readiness_status.md');
const SCHEMA = 'z_vile_foundation_readiness_status_v1_1';

const PIPELINE_STAGES = [
  { id: 'architecture', label: 'Architecture' },
  { id: 'review', label: 'Review' },
  { id: 'merge_hold', label: 'Merge Hold' },
  { id: 'approved', label: 'Approved' },
  { id: 'main', label: 'Main' },
  { id: 'verification', label: 'Verification' },
  { id: 'foundation_ready', label: 'Foundation Ready' },
];

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function exists(p) {
  return fs.existsSync(path.join(ROOT, p));
}

function mtimeIso(p) {
  const full = path.join(ROOT, p);
  try {
    if (!fs.existsSync(full)) return null;
    return fs.statSync(full).mtime.toISOString();
  } catch {
    return null;
  }
}

function git(args) {
  const r = spawnSync('git', args, { cwd: ROOT, encoding: 'utf8' });
  return { ok: r.status === 0, out: (r.stdout || '').trim(), err: (r.stderr || '').trim() };
}

function fileOnMain(relPath) {
  const r = git(['log', '-1', '--format=%H', 'main', '--', relPath]);
  return r.ok && Boolean(r.out);
}

function parseReceiptTests(receiptPath, expected) {
  const full = path.join(ROOT, receiptPath);
  if (!fs.existsSync(full)) return { pass: null, found: false };
  const text = fs.readFileSync(full, 'utf8');

  const frac = text.match(/(\d+)\s*\/\s*(\d+)\s*(?:pass|,\s*0 skipped)/i);
  if (frac && Number(frac[2]) === expected) {
    return { pass: Number(frac[1]), found: true, source: 'fraction_line' };
  }

  const passDash = text.match(/\*\*PASS\*\*\s*—\s*(\d+)\/(\d+)/i);
  if (passDash && Number(passDash[2]) === expected) {
    return { pass: Number(passDash[1]), found: true, source: 'pass_dash' };
  }

  const passRows = (text.match(/\|\s*Pass\s*\|/gi) || []).length;
  if (passRows >= expected) {
    return { pass: passRows, found: true, source: 'pass_rows' };
  }

  if (/Unit tests\s*\|\s*Yes/i.test(text)) {
    return { pass: expected, found: true, source: 'checklist_yes' };
  }

  return { pass: null, found: true, source: 'receipt_present' };
}

function docCoverage(pkgFolder) {
  const required = ['README.md', 'CHANGELOG.md', 'ROLLBACK.md', 'GREEN_RECEIPT.md', 'package.json'];
  const present = required.filter((f) => exists(path.join(pkgFolder, f)));
  const ratio = present.length / required.length;
  let status = 'red';
  if (ratio >= 1) status = 'green';
  else if (ratio >= 0.6) status = 'yellow';
  return { required, present, ratio, status };
}

function shortPackageName(npmName) {
  return String(npmName || '').replace(/^@z-sanctuary\//, '');
}

function buildEvidenceLedger(pkgPolicy, pkgReview, mergeHoldActive) {
  const readyForReview =
    pkgReview.on_disk &&
    pkgReview.documentation.status === 'green' &&
    pkgReview.governance_compliance.green_receipt;

  const evidence = (pkgPolicy.evidence_refs || []).map((ref) => ({
    label: ref.label,
    path: ref.path,
    present: exists(ref.path),
    mtime: mtimeIso(ref.path),
  }));

  const notMergedReason = pkgReview.on_main
    ? 'On main'
    : mergeHoldActive
      ? 'Not merged because governance intentionally says WAIT — Merge Hold ACTIVE until human review completes'
      : 'Not merged — pending human approval and merge gate';

  return {
    package_short_name: shortPackageName(pkgReview.npm_name),
    npm_name: pkgReview.npm_name,
    branch: pkgReview.branch,
    review_status: readyForReview ? 'Ready for review' : 'Incomplete',
    merge_status: pkgReview.on_main ? 'On main' : 'Pending',
    merge_hold: mergeHoldActive ? 'Active' : 'Review release control',
    not_merged_reason: notMergedReason,
    evidence,
    evidence_summary: evidence
      .filter((e) => e.present)
      .map((e) => e.label)
      .join(' · '),
  };
}

function resolvePackagePipelineStage(pkgReview, mergeHoldActive) {
  if (!pkgReview.on_disk) return 'architecture';
  const readyForReview =
    pkgReview.documentation.status === 'green' &&
    pkgReview.governance_compliance.green_receipt;
  if (pkgReview.on_main) return 'main';
  if (readyForReview && mergeHoldActive) return 'merge_hold';
  if (readyForReview && !mergeHoldActive) return 'approved';
  if (readyForReview) return 'review';
  return 'architecture';
}

function buildReadinessPipeline(pkgReviews, gov, verify, drp) {
  const mergeHoldActive = gov.merge_hold_active;
  const onMainCount = pkgReviews.filter((p) => p.on_main).length;
  const allReadyForReview = pkgReviews.every(
    (p) =>
      p.on_disk &&
      p.documentation.status === 'green' &&
      p.governance_compliance.green_receipt
  );

  const stageStatus = {
    architecture: allReadyForReview ? 'complete' : 'partial',
    review: allReadyForReview ? 'complete' : 'pending',
    merge_hold: mergeHoldActive ? 'active' : onMainCount === 0 ? 'released' : 'complete',
    approved: !mergeHoldActive && onMainCount === 0 && allReadyForReview ? 'awaiting' : 'pending',
    main:
      onMainCount === 3 ? 'complete' : onMainCount > 0 ? 'partial' : mergeHoldActive ? 'blocked' : 'pending',
    verification:
      onMainCount === 3 && verify.documented_test_total >= 30 ? 'recommended' : 'blocked',
    foundation_ready:
      onMainCount === 3 && drp.package_present ? 'reachable' : 'blocked',
  };

  let currentStageId = 'architecture';
  let whyWaiting =
    'Foundation packages still being assembled or documented on disk.';

  if (!allReadyForReview) {
    currentStageId = 'architecture';
    whyWaiting = 'Architecture or documentation incomplete on one or more packages.';
  } else if (mergeHoldActive && onMainCount === 0) {
    currentStageId = 'merge_hold';
    whyWaiting =
      'Not merged because governance intentionally says WAIT — Merge Hold ACTIVE (manual_release). Human review of green receipts required before main.';
  } else if (!mergeHoldActive && onMainCount === 0 && allReadyForReview) {
    currentStageId = 'approved';
    whyWaiting = 'Merge Hold released — awaiting human merge to main.';
  } else if (onMainCount > 0 && onMainCount < 3) {
    currentStageId = 'main';
    whyWaiting = `Partial merge (${onMainCount}/3 on main) — complete remaining package merges.`;
  } else if (onMainCount === 3 && !drp.package_present) {
    currentStageId = 'verification';
    whyWaiting =
      'Packages on main — run verify:full:technical and charter zuno-drp when gated.';
  } else if (onMainCount === 3 && drp.package_present) {
    currentStageId = 'foundation_ready';
    whyWaiting = 'Foundation track approaching stable green — MC-0.8 when authorized.';
  } else if (allReadyForReview) {
    currentStageId = 'review';
    whyWaiting = 'Ready for human review of VILE Packages 1–3 evidence ledger.';
  }

  const current = PIPELINE_STAGES.find((s) => s.id === currentStageId) || PIPELINE_STAGES[0];

  return {
    stages: PIPELINE_STAGES,
    current_stage_id: currentStageId,
    current_stage_label: current.label,
    why_waiting: whyWaiting,
    stage_status: stageStatus,
    ascii: [
      'Architecture',
      '      │',
      '      ▼',
      'Review',
      '      │',
      '      ▼',
      'Merge Hold  ◄── current when governance says WAIT',
      '      │',
      '      ▼',
      'Approved',
      '      │',
      '      ▼',
      'Main',
      '      │',
      '      ▼',
      'Verification',
      '      │',
      '      ▼',
      'Foundation Ready',
    ].join('\n'),
    per_package_stage: pkgReviews.map((p) => ({
      package: shortPackageName(p.npm_name),
      current_stage_id: resolvePackagePipelineStage(p, mergeHoldActive),
    })),
  };
}

function reviewStatus(pkg, onMain) {
  const folder = pkg.folder;
  const present = exists(folder);
  const receipt = parseReceiptTests(pkg.green_receipt, pkg.expected_tests);
  const docs = docCoverage(folder);
  const dist = exists(path.join(folder, 'dist'));
  const testsMatch =
    receipt.pass === null ? 'unknown' : receipt.pass === pkg.expected_tests ? 'match' : 'mismatch';

  let signal = 'red';
  if (!present) signal = 'red';
  else if (onMain && docs.status === 'green' && testsMatch !== 'mismatch') signal = 'green';
  else if (present && docs.status === 'green' && receipt.found) signal = 'yellow';

  const reasons = [];
  if (present) reasons.push('Package folder present on disk');
  else reasons.push('Package folder missing');
  if (docs.status === 'green')
    reasons.push('Documentation set complete (README, CHANGELOG, ROLLBACK, GREEN_RECEIPT)');
  else reasons.push(`Documentation partial (${docs.present.length}/${docs.required.length})`);
  if (receipt.found) reasons.push('Green receipt on disk');
  if (receipt.pass != null) reasons.push(`${receipt.pass}/${pkg.expected_tests} tests per receipt`);
  if (dist) reasons.push('dist/ build artifacts present');
  if (!onMain) reasons.push('Not merged to main — Merge Hold / human review');
  else reasons.push('Present on main branch');

  return {
    id: pkg.id,
    npm_name: pkg.npm_name,
    folder,
    branch: pkg.branch,
    on_disk: present,
    on_main: onMain,
    signal,
    tests: {
      expected: pkg.expected_tests,
      receipt_pass: receipt.pass,
      receipt_match: testsMatch,
    },
    documentation: docs,
    boundaries: {
      has_package_json: exists(path.join(folder, 'package.json')),
      has_src: exists(path.join(folder, 'src')),
      has_tests: exists(path.join(folder, 'tests')),
      dist_present: dist,
    },
    governance_compliance: {
      merge_hold_expected: true,
      green_receipt: receipt.found,
      rollback_doc: exists(path.join(folder, 'ROLLBACK.md')),
    },
    reasons,
    review_checklist: [
      {
        item: 'Package boundaries verified (static)',
        done: present && exists(path.join(folder, 'src')),
      },
      { item: 'Documentation reviewed', done: docs.status === 'green' },
      { item: 'Green receipt filed', done: receipt.found },
      { item: 'Merged to main', done: onMain },
    ],
    doc_links: {
      green_receipt: pkg.green_receipt,
      readme: `${folder}/README.md`,
    },
  };
}

function zunoDrpStatus(policy) {
  const p4 = policy.package_4;
  const charterOk = exists(p4.charter);
  const pkgOk = exists(p4.folder);
  let signal = 'blue';
  const reasons = [];
  if (pkgOk) {
    signal = 'yellow';
    reasons.push('Package folder exists — verify charter gate was released');
  } else {
    reasons.push('Package not implemented — charter only');
  }
  if (charterOk) reasons.push('Phase 2A Package 4 charter on disk');
  else reasons.push('Charter missing');
  reasons.push('Blocked until Packages 1–3 on main (per charter)');

  return {
    id: p4.id,
    npm_name: p4.npm_name,
    folder: p4.folder,
    signal,
    charter_present: charterOk,
    package_present: pkgOk,
    blocked_until: p4.blocked_until,
    reasons,
    status_label: pkgOk ? 'IN_PROGRESS' : 'CHARTER_ONLY',
  };
}

function verificationStatus(packages, integrationDocs) {
  const integrationPresent = integrationDocs.every((d) => exists(d));
  const totalTests = packages.reduce((n, p) => n + (p.tests.receipt_pass || 0), 0);
  const allReceipts = packages.every((p) => p.governance_compliance.green_receipt);
  const signals = packages.map((p) => p.signal);
  const worst = signals.includes('red') ? 'red' : signals.includes('yellow') ? 'yellow' : 'green';

  const reasons = [];
  if (integrationPresent) reasons.push('Foundation integration report + green receipt present');
  else reasons.push('Integration documentation incomplete');
  if (totalTests >= 30) reasons.push(`${totalTests}/30 tests documented in green receipts`);
  else reasons.push(`Test count from receipts: ${totalTests} (expected 30)`);
  if (allReceipts) reasons.push('All package green receipts filed');

  return {
    signal: integrationPresent && totalTests >= 30 ? worst : 'yellow',
    integration_docs_present: integrationPresent,
    documented_test_total: totalTests,
    expected_test_total: 30,
    full_technical_verify_recommended: 'npm run verify:full:technical (after merge to main)',
    reasons,
  };
}

function governanceCompliance() {
  let mergeHold = true;
  let mergeHoldSource = 'default_assumed';
  try {
    const rel = readJson(RELEASE);
    mergeHold = Boolean(rel.manual_release);
    mergeHoldSource = RELEASE;
  } catch {
    mergeHold = true;
  }

  const turtleDoc = exists('data/z_vile_foundation_readiness_policy.json')
    ? exists('.cursor/rules/z-turtle-mode-cursor-agents.mdc')
    : false;

  const reasons = [];
  if (mergeHold) reasons.push('manual_release / Merge Hold ACTIVE in z_release_control.json');
  else reasons.push('Merge Hold not flagged in release control — verify before merge');
  if (turtleDoc) reasons.push('Turtle Mode rule present');
  reasons.push('DRP law referenced — hub governance, not zuno-drp package');

  return {
    merge_hold_active: mergeHold,
    merge_hold_source: mergeHoldSource,
    turtle_mode_documented: turtleDoc,
    drp_referenced: exists('docs/Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md'),
    signal: mergeHold ? 'hold' : 'yellow',
    reasons,
  };
}

function recommendedNextHumanAction(pkgReviews, drp, gov, verify) {
  const notOnMain = pkgReviews.filter((p) => !p.on_main);
  if (notOnMain.length === pkgReviews.length) {
    return {
      priority: 'P0',
      action:
        'Review VILE Packages 1–3 green receipts and integration report; release Merge Hold; merge to main in order (human gate)',
      derived_from: 'all_packages_off_main',
    };
  }
  if (!drp.package_present && drp.charter_present) {
    return {
      priority: 'P0',
      action:
        'Charter and implement @z-sanctuary/zuno-drp on branch cursor/zsanctuary/vile-zuno-drp-2a after main merge',
      derived_from: 'packages_on_main_drp_pending',
    };
  }
  if (verify.signal !== 'green') {
    return {
      priority: 'P0',
      action: 'Run npm run verify:full:technical after foundation on main',
      derived_from: 'verification_pending',
    };
  }
  return {
    priority: 'P1',
    action: 'Track A stable — proceed MC-0.8 charter when authorized',
    derived_from: 'foundation_ready',
  };
}

function buildMd(report) {
  const lines = [
    '# Z-Sanctuary Track A — VILE Foundation Readiness Report',
    '',
    `Generated: ${report.generated_at}`,
    '',
    '**Posture:** Read-only · Turtle Mode · Merge Hold · no runtime · no deploy',
    '',
    '> Strong foundations make future development faster.',
    '',
    '## Executive summary',
    '',
    `| Signal | ${report.overall_signal} |`,
    `| Track | A — VILE Foundation Integration (P0) |`,
    `| Packages on main | ${report.summary.packages_on_main}/3 |`,
    `| Why not on main | ${report.summary.packages_on_main_note} |`,
    `| Documented tests (receipts) | ${report.verification.documented_test_total}/30 |`,
    `| zuno-drp | ${report.zuno_drp.status_label} |`,
    `| Pipeline stage | **${report.readiness_pipeline.current_stage_label}** |`,
    '',
    '## Readiness pipeline',
    '',
    '```text',
    report.readiness_pipeline.ascii.replace(
      'Merge Hold  ◄── current when governance says WAIT',
      report.readiness_pipeline.current_stage_id === 'merge_hold'
        ? 'Merge Hold  ◄── YOU ARE HERE'
        : 'Merge Hold'
    ),
    '```',
    '',
    `**Current stage:** ${report.readiness_pipeline.current_stage_label}`,
    '',
    report.readiness_pipeline.why_waiting,
    '',
    '## Foundation evidence ledger',
    '',
    '| Package | Branch | Review | Merge | Merge Hold | Evidence |',
    '| ------- | ------ | ------ | ----- | ---------- | -------- |',
  ];

  for (const row of report.foundation_evidence_ledger) {
    lines.push(
      `| ${row.package_short_name} | \`${row.branch}\` | ${row.review_status} | ${row.merge_status} | ${row.merge_hold} | ${row.evidence_summary} |`
    );
  }

  lines.push(
    '',
    '### Not merged — why',
    '',
    ...report.foundation_evidence_ledger.map(
      (row) => `- **${row.package_short_name}:** ${row.not_merged_reason}`
    ),
    '',
    '## Package review status',
    '',
    '| Package | Signal | On main | Docs | Tests (receipt) |',
    '| ------- | ------ | ------- | ---- | --------------- |'
  );

  for (const p of report.packages) {
    lines.push(
      `| ${p.npm_name} | ${p.signal.toUpperCase()} | ${p.on_main ? 'yes' : 'no'} | ${p.documentation.status} | ${p.tests.receipt_pass ?? '—'}/${p.tests.expected} |`
    );
  }

  lines.push(
    '',
    '## zuno-drp status',
    '',
    `**Signal:** ${report.zuno_drp.signal.toUpperCase()} · **${report.zuno_drp.status_label}**`,
    '',
    ...report.zuno_drp.reasons.map((r) => `- ${r}`),
    '',
    '## Verification status',
    '',
    ...report.verification.reasons.map((r) => `- ${r}`),
    '',
    '## Governance compliance',
    '',
    `| Merge Hold | ${report.governance.merge_hold_active ? 'ACTIVE' : 'review'} |`,
    `| Turtle Mode | ${report.governance.turtle_mode_documented ? 'documented' : 'unknown'} |`,
    '',
    '## Recommended next human action',
    '',
    `**${report.recommended_next_human_action.priority}:** ${report.recommended_next_human_action.action}`,
    '',
    '_Derived from registry and on-disk receipts — not invented._',
    '',
    'Command: `npm run z:vile:foundation:readiness`'
  );

  return lines.join('\n');
}

function main() {
  const policy = readJson(POLICY_PATH);
  const generatedAt = new Date().toISOString();

  const pkgReviews = policy.packages.map((pkg) => {
    const onMain = fileOnMain(pkg.folder);
    return reviewStatus(pkg, onMain);
  });

  const drp = zunoDrpStatus(policy);
  const gov = governanceCompliance();
  const verify = verificationStatus(pkgReviews, policy.integration_docs);

  const evidenceLedger = policy.packages.map((pkg, i) =>
    buildEvidenceLedger(pkg, pkgReviews[i], gov.merge_hold_active)
  );
  const pipeline = buildReadinessPipeline(pkgReviews, gov, verify, drp);

  const onMainCount = pkgReviews.filter((p) => p.on_main).length;
  let overall = 'yellow';
  if (onMainCount === 3 && drp.package_present) overall = 'green';
  else if (pkgReviews.some((p) => !p.on_disk)) overall = 'red';
  else if (gov.merge_hold_active && onMainCount === 0) overall = 'hold';

  const next = recommendedNextHumanAction(pkgReviews, drp, gov, verify);

  const report = {
    schema: SCHEMA,
    system_id: policy.system_id,
    track: policy.track,
    priority: policy.priority,
    generated_at: generatedAt,
    overall_signal: overall,
    posture: policy.posture,
    summary: {
      packages_total: pkgReviews.length,
      packages_on_main: onMainCount,
      packages_on_main_note:
        onMainCount === 3
          ? 'All foundation packages on main'
          : gov.merge_hold_active
            ? 'Not merged because governance intentionally says WAIT — Merge Hold ACTIVE until human VILE review completes'
            : 'Pending human approval and merge to main',
      packages_on_disk: pkgReviews.filter((p) => p.on_disk).length,
      merge_hold_active: gov.merge_hold_active,
      turtle_mode: true,
    },
    foundation_evidence_ledger: evidenceLedger,
    readiness_pipeline: pipeline,
    packages: pkgReviews,
    zuno_drp: drp,
    verification: verify,
    documentation_coverage: {
      packages: pkgReviews.map((p) => ({
        npm_name: p.npm_name,
        status: p.documentation.status,
        present: p.documentation.present,
      })),
      integration_docs: policy.integration_docs.map((d) => ({
        path: d,
        present: exists(d),
        mtime: mtimeIso(d),
      })),
    },
    governance: gov,
    merge_hold_status: {
      active: gov.merge_hold_active,
      label: gov.merge_hold_active ? 'Merge Hold ACTIVE' : 'Review release control',
    },
    turtle_mode_status: {
      active: true,
      label: 'Turtle Mode — small branches, PRs, no auto-merge',
      rule_path: '.cursor/rules/z-turtle-mode-cursor-agents.mdc',
    },
    recommended_next_human_action: next,
    dashboard_sections: [
      'Readiness Pipeline',
      'Foundation Evidence Ledger',
      'VILE Packages 1–3 Review Status',
      'zuno-drp Status',
      'Verification Status',
      'Documentation Coverage',
      'Governance Compliance',
      'Merge Hold Status',
      'Turtle Mode Status',
      'Recommended Next Human Action',
    ],
    doc_refs: {
      overseer: 'docs/vile/Z_VILE_FOUNDATION_READINESS_OVERSEER.md',
      track_a: 'docs/vile/TRACK_A_VILE_FOUNDATION_INTEGRATION.md',
      integration_report: 'docs/vile/PHASE_2A_FOUNDATION_INTEGRATION_REPORT.md',
    },
    law_note: 'Mission Control observes — human approves merge and implementation',
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  fs.writeFileSync(OUT_MD, `${buildMd(report)}\n`, 'utf8');

  console.log(
    JSON.stringify({
      ok: true,
      overall_signal: overall,
      packages_on_main: onMainCount,
      out_json: OUT_JSON,
      out_md: OUT_MD,
    })
  );
}

main();
