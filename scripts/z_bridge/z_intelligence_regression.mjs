#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { calculatePriorityScore, applyIntelligentAllocation } from './z_intelligence_engine.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const REPORT_DIR = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORT_DIR, 'z_bridge_intelligence_regression.json');
const OUT_MD = path.join(REPORT_DIR, 'z_bridge_intelligence_regression.md');

const CASES = [
  {
    id: 'low_usage_boost',
    user: { reputation_score: 1.2, daily_allocated: 0, flagged: false },
    requested: 10,
    expectedPriority: 1.16,
    expectedAdjusted: 11,
  },
  {
    id: 'heavy_usage_dampen',
    user: { reputation_score: 1.0, daily_allocated: 16, flagged: false },
    requested: 10,
    expectedPriority: 0.8,
    expectedAdjusted: 8,
  },
  {
    id: 'flagged_penalty',
    user: { reputation_score: 1.0, daily_allocated: 2, flagged: true },
    requested: 10,
    expectedPriority: 0.99,
    expectedAdjusted: 9,
  },
];

function approxEq(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function runCase(testCase) {
  const priority = calculatePriorityScore(testCase.user);
  const allocation = applyIntelligentAllocation(testCase.requested, testCase.user);
  const pass =
    approxEq(priority, testCase.expectedPriority) &&
    approxEq(allocation.priority_score, testCase.expectedPriority) &&
    allocation.adjusted_amount === testCase.expectedAdjusted;
  return {
    id: testCase.id,
    pass,
    expected_priority: testCase.expectedPriority,
    actual_priority: priority,
    expected_adjusted: testCase.expectedAdjusted,
    actual_adjusted: allocation.adjusted_amount,
  };
}

function writeReports(results) {
  const allPass = results.every((r) => r.pass);
  const payload = {
    generated_at: new Date().toISOString(),
    status: allPass ? 'pass' : 'fail',
    cases_total: results.length,
    cases_pass: results.filter((r) => r.pass).length,
    cases_fail: results.filter((r) => !r.pass).length,
    cases: results,
  };

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  const md = [
    '# Z-Bridge Intelligence Regression',
    '',
    `Generated: ${payload.generated_at}`,
    `Status: **${payload.status.toUpperCase()}**`,
    '',
    '| Case | Status | Expected Priority | Actual Priority | Expected Adjusted | Actual Adjusted |',
    '| --- | --- | ---: | ---: | ---: | ---: |',
    ...results.map(
      (r) =>
        `| ${r.id} | ${r.pass ? 'PASS' : 'FAIL'} | ${r.expected_priority} | ${r.actual_priority} | ${r.expected_adjusted} | ${r.actual_adjusted} |`
    ),
    '',
  ];
  fs.writeFileSync(OUT_MD, md.join('\n'), 'utf8');
  return payload;
}

const results = CASES.map(runCase);
const payload = writeReports(results);
console.log(
  `[z_bridge_intelligence_regression] ${payload.status.toUpperCase()} (${payload.cases_pass}/${payload.cases_total}) -> ${OUT_JSON}`
);
if (payload.status !== 'pass') {
  process.exitCode = 1;
}
