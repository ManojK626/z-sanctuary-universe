#!/usr/bin/env node
/**
 * Z-Continuous Verification Monitor
 * Real-time aggregation of all system gates and state
 * Reports: what's happening NOW and what changed
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseDir = path.resolve(__dirname, '..');

async function main() {
  try {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();

    // Load protocol registry
    const protocolPath = path.join(baseDir, 'data', 'z_continuous_verification_protocol_registry.json');
    const protocol = JSON.parse(fs.readFileSync(protocolPath, 'utf8'));

    // Initialize status
    let overallSignal = 'GREEN';
    let gateResults = [];
    let alerts = [];
    let healthCategories = {};

    // Run critical gates (quick check mode)
    const quickCheckGates = protocol.verification_modes.find(m => m.mode_id === 'quick_check').gates;

    for (const gateId of quickCheckGates) {
      const gate = protocol.monitored_gates.find(g => g.gate_id === gateId);
      if (!gate) continue;

      const gateStart = Date.now();
      let gateStatus = 'UNKNOWN';
      let gateSignal = 'YELLOW';
      let gateError = null;
      let executionTime = 0;

      try {
        // Convert npm commands to direct node calls to avoid npm preamble
        let cmd = gate.command;
        if (cmd.startsWith('npm run ')) {
          const scriptName = cmd.replace('npm run ', '');
          const scriptMap = {
            'z:ide:fusion': 'scripts/z_ide_fusion_status.mjs',
            'z:ide:14drp': 'scripts/z_ide_14drp_validator.mjs',
            'verify:md': 'scripts/verify.mjs',
            'z:traffic': 'scripts/z_traffic.mjs',
            'z:car2': 'scripts/z_car2.mjs'
          };
          const scriptPath = scriptMap[scriptName];
          if (scriptPath) {
            cmd = `node ${scriptPath}`;
          }
        }

        const output = execSync(cmd, {
          cwd: baseDir,
          timeout: gate.timeout * 1000,
          encoding: 'utf8',
          stdio: ['pipe', 'pipe', 'pipe']
        });

        // Extract JSON from output (skip any npm preamble)
        const jsonMatch = output.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON found in output');

        const result = JSON.parse(jsonMatch[0]);

        gateStatus = 'PASS';
        gateSignal = result.overall_signal || 'GREEN';
        executionTime = Date.now() - gateStart;

        if (gateSignal === 'RED') {
          overallSignal = 'RED';
          alerts.push({
            timestamp,
            level: 'RED',
            gate: gate.gate_name,
            message: `${gate.gate_name} returned RED signal`
          });
        } else if (gateSignal === 'YELLOW') {
          if (overallSignal !== 'RED') overallSignal = 'YELLOW';
        }
      } catch (err) {
        gateStatus = 'FAIL';
        gateSignal = 'RED';
        gateError = err.message.substring(0, 100);
        overallSignal = 'RED';
        executionTime = Date.now() - gateStart;

        alerts.push({
          timestamp,
          level: 'RED',
          gate: gate.gate_name,
          message: `${gate.gate_name} failed: ${gateError}`
        });
      }

      gateResults.push({
        gate_id: gateId,
        gate_name: gate.gate_name,
        status: gateStatus,
        signal: gateSignal,
        execution_time_ms: executionTime,
        error: gateError,
        checked_at: timestamp
      });
    }

    // Calculate health categories
    healthCategories.documentation_health = gateResults.find(g => g.gate_id === 'verify_md')?.signal || 'UNKNOWN';
    healthCategories.ide_health = gateResults.find(g => g.gate_id === 'z_ide_fusion')?.signal || 'UNKNOWN';
    healthCategories.compliance_health = gateResults.find(g => g.gate_id === 'z_ide_14drp')?.signal || 'UNKNOWN';

    // Load active sessions if present
    let activeSessions = [];
    const sessionsPath = path.join(baseDir, 'data', 'ide-fusion', 'active_sessions.json');
    if (fs.existsSync(sessionsPath)) {
      try {
        const sessionsData = JSON.parse(fs.readFileSync(sessionsPath, 'utf8'));
        activeSessions = Array.isArray(sessionsData) ? sessionsData : [sessionsData];
      } catch (e) {
        // Sessions file may be invalid, continue
      }
    }

    // Create comprehensive report
    const report = {
      schema: 'z_continuous_verification_report_v1',
      timestamp,
      generation_time_ms: Date.now() - startTime,
      overall_signal: overallSignal,
      gate_status_summary: {
        total_gates_checked: gateResults.length,
        passed: gateResults.filter(g => g.status === 'PASS').length,
        failed: gateResults.filter(g => g.status === 'FAIL').length,
        gates: gateResults
      },
      health_categories: healthCategories,
      active_sessions: {
        count: activeSessions.length,
        sessions: activeSessions.map(s => ({
          session_id: s.session_id,
          agent_id: s.agent_id,
          workspace_id: s.workspace_id,
          intended_task: s.intended_task,
          started_at: s.started_at
        }))
      },
      alerts: alerts,
      latest_alerts: alerts.slice(-5),
      alert_count: {
        RED: alerts.filter(a => a.level === 'RED').length,
        BLUE: alerts.filter(a => a.level === 'BLUE').length,
        YELLOW: alerts.filter(a => a.level === 'YELLOW').length
      },
      next_recommended_action:
        overallSignal === 'RED' ? 'STOP_AND_REPORT' :
        overallSignal === 'BLUE' ? 'NOTIFY_AMK' :
        overallSignal === 'YELLOW' ? 'MONITOR' :
        'CONTINUE_NORMAL_OPERATIONS'
    };

    // Write JSON report
    const reportsDir = path.join(baseDir, 'data', 'reports');
    if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

    const jsonReportPath = path.join(reportsDir, 'z_continuous_verification_status.json');
    fs.writeFileSync(jsonReportPath, JSON.stringify(report, null, 2));

    // Write Markdown report
    const mdContent = `# Z-Continuous Verification Status

**Generated:** ${timestamp}
**Overall Signal:** **${report.overall_signal}**
**Generation time:** ${report.generation_time_ms}ms

## Gate Status Summary

| Gate | Status | Signal | Time (ms) | Last Check |
|------|--------|--------|-----------|-----------|
${report.gate_status_summary.gates.map(g =>
  `| ${g.gate_name} | ${g.status} | ${g.signal} | ${g.execution_time_ms} | ${g.checked_at.substring(11, 19)} |`
).join('\n')}

**Summary:** ${report.gate_status_summary.passed} passed, ${report.gate_status_summary.failed} failed

## Health Categories

- **Documentation Health:** ${report.health_categories.documentation_health}
- **IDE Health:** ${report.health_categories.ide_health}
- **Compliance Health:** ${report.health_categories.compliance_health}

## Active Sessions

${report.active_sessions.count > 0 ?
  report.active_sessions.sessions.map(s =>
    `- **${s.session_id}** (${s.agent_id}) in ${s.workspace_id}: ${s.intended_task}`
  ).join('\n') :
  '(no active sessions)'
}

## Latest Alerts (RED/BLUE/YELLOW)

${report.latest_alerts.length > 0 ?
  report.latest_alerts.map(a =>
    `- **${a.level}** — ${a.gate}: ${a.message}`
  ).join('\n') :
  '(no recent alerts)'
}

## Alert Count

- 🔴 RED: ${report.alert_count.RED}
- 🔵 BLUE: ${report.alert_count.BLUE}
- 🟡 YELLOW: ${report.alert_count.YELLOW}

## Next Recommended Action

**${report.next_recommended_action}**

---

*Latest awareness of Z-Sanctuary state. No stale information. Everything visible.*
`;

    const mdReportPath = path.join(reportsDir, 'z_continuous_verification_status.md');
    fs.writeFileSync(mdReportPath, mdContent);

    // Append to timeline
    const timelineDir = path.join(baseDir, 'data', 'ide-fusion');
    if (!fs.existsSync(timelineDir)) fs.mkdirSync(timelineDir, { recursive: true });

    const timelineEntry = {
      timestamp,
      event: 'verification_check_completed',
      overall_signal: report.overall_signal,
      gates_checked: report.gate_status_summary.total_gates_checked,
      gates_passed: report.gate_status_summary.passed,
      gates_failed: report.gate_status_summary.failed,
      active_sessions: report.active_sessions.count,
      alert_count: report.alert_count.RED + report.alert_count.BLUE + report.alert_count.YELLOW
    };

    const timelinePath = path.join(timelineDir, 'continuous_verification_timeline.jsonl');
    fs.appendFileSync(timelinePath, JSON.stringify(timelineEntry) + '\n');

    // Output
    console.log(JSON.stringify({
      ok: report.overall_signal !== 'RED',
      overall_signal: report.overall_signal,
      out_json: jsonReportPath,
      out_md: mdReportPath,
      gates_checked: report.gate_status_summary.total_gates_checked,
      gates_passed: report.gate_status_summary.passed,
      gates_failed: report.gate_status_summary.failed,
      active_sessions: report.active_sessions.count,
      alert_count: report.alert_count.RED + report.alert_count.BLUE + report.alert_count.YELLOW
    }, null, 2));

    process.exit(report.overall_signal === 'RED' ? 1 : 0);

  } catch (err) {
    console.error({
      ok: false,
      error: err.message
    });
    process.exit(1);
  }
}

main();
