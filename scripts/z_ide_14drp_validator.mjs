#!/usr/bin/env node
/**
 * Z-IDE-14DRP Agent Protocol Validator
 * Enforces 14 Deep Responsibility Principles for IDE agents and AI helpers
 * Blocks unsafe actions, enforces handoff, validates AMK approval
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseDir = path.resolve(__dirname, '..');

async function main() {
  try {
    // Load registry
    const registryPath = path.join(baseDir, 'data', 'z_ide_14drp_agent_protocol_registry.json');
    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));

    // Load optional active sessions
    const sessionsPath = path.join(baseDir, 'data', 'ide-fusion', 'active_sessions.json');
    let activeSessions = [];
    if (fs.existsSync(sessionsPath)) {
      activeSessions = JSON.parse(fs.readFileSync(sessionsPath, 'utf8'));
    }

    // Load optional handoff journal
    const handoffPath = path.join(baseDir, 'data', 'ide-fusion', 'handoff_journal.jsonl');
    let handoffs = [];
    if (fs.existsSync(handoffPath)) {
      const lines = fs.readFileSync(handoffPath, 'utf8').split('\n').filter(l => l.trim());
      handoffs = lines.map(l => JSON.parse(l));
    }

    // Validate 14 DRP compliance
    let signal = 'GREEN';
    let issues = [];
    let drp_violations = [];

    // Check 1: Registry valid
    if (!registry.schema || !registry['14_deep_responsibility_principles']) {
      signal = 'RED';
      drp_violations.push('Registry schema invalid');
    }

    // Check 2: Canonical repo root
    const canonicalRoot = registry.canonical_law === '14_deep_responsibility_principles' ? true : false;
    if (!canonicalRoot) {
      signal = 'RED';
      drp_violations.push('DRP-1 violation: canonical law not set');
    }

    // Check 3: Active sessions compliance
    let fileCollisions = [];
    let workspaceBoundaryViolations = [];

    if (activeSessions.length > 0) {
      for (const session of activeSessions) {
        // DRP-3: Session must have intent
        if (!session.intended_task) {
          signal = 'BLUE';
          issues.push(`Session ${session.session_id} missing intended_task (DRP-3)`);
        }

        // DRP-4: Workspace boundary
        const agent = registry.supported_agents.find(a => a.agent_id === session.agent_id);
        if (agent && session.workspace_id && !agent.allowed_workspaces.includes(session.workspace_id)) {
          signal = 'RED';
          workspaceBoundaryViolations.push(`Session ${session.session_id} violates workspace boundary (DRP-4)`);
        }

        // DRP-5 & DRP-9: High-risk file collision
        if (session.files_expected_to_touch && session.files_expected_to_touch.length > 0) {
          for (const file of session.files_expected_to_touch) {
            const isHighRisk = registry.related_docs.some(doc => file.includes(path.basename(doc)));

            if (isHighRisk) {
              // Check for other sessions touching same file
              const collision = activeSessions.find(s =>
                s.session_id !== session.session_id &&
                s.files_expected_to_touch &&
                s.files_expected_to_touch.includes(file)
              );

              if (collision) {
                // Check if handoff exists
                const hasHandoff = handoffs.find(h =>
                  h.session_id === session.session_id || h.session_id === collision.session_id
                );

                if (!hasHandoff) {
                  signal = 'RED';
                  fileCollisions.push(
                    `DRP-9 violation: Sessions ${session.session_id} and ${collision.session_id} editing ${file} without handoff`
                  );
                }
              }
            }
          }
        }

        // DRP-7: Check for forbidden actions
        const forbiddenInIntent = registry.forbidden_actions_absolute.some(action =>
          session.intended_task && session.intended_task.toLowerCase().includes(action.replace(/_/g, ' '))
        );

        if (forbiddenInIntent) {
          signal = 'RED';
          drp_violations.push(`DRP-7 violation: Session ${session.session_id} declares forbidden action`);
        }

        // DRP-6 & DRP-14: Sacred moves require approval
        const sacredMove = registry.sacred_moves.find(sm =>
          session.intended_task && session.intended_task.toLowerCase().includes(
            sm.display_name.toLowerCase()
          )
        );

        if (sacredMove && !session.sacred_move_approved) {
          signal = 'BLUE';
          issues.push(`DRP-6/14 advisory: Session ${session.session_id} mentions sacred move without approval (${sm.display_name})`);
        }
      }

      // Check for stale sessions
      const staleThreshold = Date.now() - (24 * 60 * 60 * 1000); // 24 hours
      for (const session of activeSessions) {
        if (session.started_at && new Date(session.started_at).getTime() < staleThreshold) {
          if (!handoffs.find(h => h.session_id === session.session_id)) {
            signal = signal === 'GREEN' ? 'YELLOW' : signal;
            issues.push(`DRP-8 advisory: Session ${session.session_id} older than 24h without handoff`);
          }
        }
      }
    }

    // Compile report
    const report = {
      ok: signal !== 'RED',
      overall_signal: signal,
      schema: 'z_ide_14drp_report_v1',
      generated_at: new Date().toISOString(),
      registry_valid: registry.schema ? true : false,
      active_sessions_count: activeSessions.length,
      workspace_boundary_violations: workspaceBoundaryViolations,
      file_collision_violations: fileCollisions,
      drp_violations: drp_violations,
      issues: issues,
      principles_enforced: registry['14_deep_responsibility_principles'].length,
      supported_agents: registry.supported_agents.map(a => a.display_name),
      autonomy_levels: registry.autonomy_levels.map(l => l.level),
      sacred_moves: registry.sacred_moves.map(m => m.display_name),
      next_amk_action: signal === 'BLUE' ? 'require_amk_approval' : (signal === 'RED' ? 'block_immediately' : 'continue_work'),
      locked_law: registry.locked_law
    };

    // Write reports
    const reportsDir = path.join(baseDir, 'data', 'reports');
    if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

    const jsonReport = path.join(reportsDir, 'z_ide_14drp_agent_session_status.json');
    fs.writeFileSync(jsonReport, JSON.stringify(report, null, 2));

    // Markdown report
    const mdReport = path.join(reportsDir, 'z_ide_14drp_agent_session_status.md');
    const mdContent = `# Z-IDE-14DRP Agent Protocol Report

- Generated: ${new Date().toISOString()}
- Overall signal: **${report.overall_signal}**
- Registry valid: **${report.registry_valid}**
- Active sessions: **${report.active_sessions_count}**
- Principles enforced: **${report.principles_enforced}**

## Supported agents

${report.supported_agents.map(a => `- ${a}`).join('\n')}

## Autonomy levels

${report.autonomy_levels.map(l => `- ${l}`).join('\n')}

## Sacred moves (require AMK approval)

${report.sacred_moves.map(m => `- ${m}`).join('\n')}

## DRP Violations

${report.drp_violations.length > 0 ? report.drp_violations.map(v => `- ${v}`).join('\n') : '(none)'}

## Issues / Advisories

${report.issues.length > 0 ? report.issues.map(i => `- ${i}`).join('\n') : '(none)'}

## Workspace boundary violations

${report.workspace_boundary_violations.length > 0 ? report.workspace_boundary_violations.map(v => `- ${v}`).join('\n') : '(none)'}

## File collision violations

${report.file_collision_violations.length > 0 ? report.file_collision_violations.map(v => `- ${v}`).join('\n') : '(none)'}

## Next AMK action

**${report.next_amk_action}**

## Locked law

${report.locked_law.map(l => `- ${l}`).join('\n')}
`;

    fs.writeFileSync(mdReport, mdContent);

    // Output
    console.log(JSON.stringify({
      ok: report.ok,
      overall_signal: report.overall_signal,
      out_json: jsonReport,
      out_md: mdReport
    }, null, 2));

    process.exit(report.ok ? 0 : 1);

  } catch (err) {
    console.error({
      ok: false,
      error: err.message
    });
    process.exit(1);
  }
}

main();
