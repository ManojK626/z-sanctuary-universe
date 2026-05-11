import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORTS_DIR, 'z_legal_readiness_delta.json');
const OUT_MD = path.join(REPORTS_DIR, 'z_legal_readiness_delta.md');

function readJson(filePath, fallback = null) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

const now = new Date().toISOString();
fs.mkdirSync(REPORTS_DIR, { recursive: true });

const privacyGate = readJson(path.join(REPORTS_DIR, 'z_privacy_gate_check.json'), {});
const privacyReport = readJson(path.join(REPORTS_DIR, 'privacy', 'z_privacy_report.json'), {});
const protectionAudit = readJson(path.join(REPORTS_DIR, 'z_protection_audit.json'), {});
const sswsDaily = readJson(path.join(REPORTS_DIR, 'z_ssws_daily_report.json'), {});
const policyShadow = readJson(path.join(REPORTS_DIR, 'z_policy_shadow_gate.json'), {});
const troublemaker = readJson(path.join(REPORTS_DIR, 'z_troublemaker_scan.json'), {});
const formulaRegistry = readJson(path.join(ROOT, 'rules', 'Z_FORMULA_REGISTRY.json'), {});

const localControls = [
  {
    id: 'privacy_gate',
    status:
      String(privacyGate?.status || '').toLowerCase() === 'pass' ||
      Number(privacyReport?.summary?.high_risk ?? 1) === 0
        ? 'pass'
        : privacyGate?.status
          ? 'watch'
          : 'unknown',
    evidence: fs.existsSync(path.join(REPORTS_DIR, 'z_privacy_gate_check.json'))
      ? 'data/reports/z_privacy_gate_check.json'
      : 'data/reports/privacy/z_privacy_report.json',
  },
  {
    id: 'protection_audit',
    status: (() => {
      const passCount = Number(protectionAudit?.pass_count ?? protectionAudit?.protected_count ?? 0);
      const totalCount = Number(protectionAudit?.total_count ?? protectionAudit?.checked_count ?? 0);
      if (totalCount > 0 && passCount === totalCount) return 'pass';
      if (totalCount > 0 && passCount < totalCount) return 'watch';
      return 'unknown';
    })(),
    evidence: 'data/reports/z_protection_audit.json',
  },
  {
    id: 'formula_registry_internal_only',
    status: String(formulaRegistry?.status || '').toLowerCase() === 'internal-only' ? 'pass' : 'fail',
    evidence: 'rules/Z_FORMULA_REGISTRY.json',
  },
  {
    id: 'policy_shadow_gate',
    status: String(policyShadow?.status || '').toLowerCase() === 'ready' ? 'pass' : 'watch',
    evidence: 'data/reports/z_policy_shadow_gate.json',
  },
  {
    id: 'disturbance_watch',
    status: String(troublemaker?.status || '').toLowerCase() === 'green' ? 'pass' : 'watch',
    evidence: 'data/reports/z_troublemaker_scan.json',
  },
  {
    id: 'ssws_daily_report_present',
    status: sswsDaily?.generated_at ? 'pass' : 'watch',
    evidence: 'data/reports/z_ssws_daily_report.json',
  },
];

const externalLegalWorkstreams = [
  {
    area: 'US consumer protection (AI claims and unfair/deceptive practices)',
    status: 'required',
    owner: 'Legal + Product',
    next_action: 'Maintain substantiated claims, add periodic legal review of public AI messaging.',
    source: 'https://www.ftc.gov/policy/advocacy-research/tech-at-ftc/2025/01/ai-risk-consumer-harm',
  },
  {
    area: 'US privacy commitments',
    status: 'required',
    owner: 'Legal + Security',
    next_action: 'Ensure public privacy commitments match actual data handling and retention practices.',
    source:
      'https://www.ftc.gov/policy/advocacy-research/tech-at-ftc/2024/01/ai-companies-uphold-your-privacy-confidentiality-commitments',
  },
  {
    area: 'EU AI Act phased compliance (if EU users are served)',
    status: 'required_if_eu',
    owner: 'Legal + Compliance',
    next_action: 'Map product functions to AI Act obligations and timelines before EU launch.',
    source: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai',
  },
  {
    area: 'UK ICO AI/data protection alignment (if UK users are served)',
    status: 'required_if_uk',
    owner: 'Legal + DPO',
    next_action: 'Validate lawful basis, transparency notices, and user-rights handling for AI outputs.',
    source:
      'https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/artificial-intelligence/',
  },
  {
    area: 'UK gambling licensing boundary (if moving beyond analytics into facilitation)',
    status: 'required_if_gambling_facilities',
    owner: 'Legal + Operations',
    next_action: 'Confirm whether product scope remains analytics-only or triggers licensing obligations.',
    source:
      'https://www.gamblingcommission.gov.uk/licensees-and-businesses/licences-and-fees/sector/remote',
  },
];

const localPass = localControls.filter((x) => x.status === 'pass').length;
const localTotal = localControls.length;
const localPct = Number(((localPass / localTotal) * 100).toFixed(1));

const result = {
  generated_at: now,
  disclaimer: 'Operational compliance snapshot only; not legal advice.',
  verdict: {
    operational_lawful_safety: localPct >= 80 ? 'strong' : 'watch',
    legal_certification_readiness: 'pending_jurisdictional_counsel',
  },
  local_controls: {
    pass: localPass,
    total: localTotal,
    completion_pct: localPct,
    controls: localControls,
  },
  external_workstreams: externalLegalWorkstreams,
  final_delta: [
    'Local control plane is strong and green-leaning.',
    'Formal legal pass requires jurisdiction-specific counsel sign-off.',
    'Keep product messaging aligned with actual behavior and internal-only boundaries.',
  ],
};

fs.writeFileSync(OUT_JSON, `${JSON.stringify(result, null, 2)}\n`, 'utf8');

const md = [
  '# Z Legal Readiness Delta',
  '',
  `Generated: ${now}`,
  '',
  `Disclaimer: ${result.disclaimer}`,
  '',
  '## Verdict',
  `- Operational lawful safety: **${result.verdict.operational_lawful_safety}**`,
  `- Legal certification readiness: **${result.verdict.legal_certification_readiness}**`,
  '',
  '## Local Controls',
  `- Completion: **${localPass}/${localTotal} (${localPct}%)**`,
  ...localControls.map((c) => `- ${c.status.toUpperCase()} ${c.id} (${c.evidence})`),
  '',
  '## External Legal Workstreams',
  ...externalLegalWorkstreams.map(
    (w) => `- ${w.status}: ${w.area} | Owner: ${w.owner} | Next: ${w.next_action}\n  - Source: ${w.source}`
  ),
  '',
  '## Final Delta',
  ...result.final_delta.map((line) => `- ${line}`),
  '',
].join('\n');

fs.writeFileSync(OUT_MD, md, 'utf8');
console.log('Z legal readiness delta report written.');
