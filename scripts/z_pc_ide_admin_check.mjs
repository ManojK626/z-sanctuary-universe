#!/usr/bin/env node

/**
 * Z_PC_IDE_ADMIN_1 — VS Code Admin Mode Safety Check
 * 
 * Purpose:
 * - Detect whether current process is running elevated/admin on Windows
 * - Verify cwd is not under .cursor/projects (cache/archive)
 * - Confirm real hub root exists: C:\Cursor Projects Organiser\Z_Sanctuary_Universe
 * - Report recommended launch command for normal (non-admin) mode
 * - Signal: GREEN/YELLOW/RED with appropriate exit codes
 * 
 * Locked law:
 * - Administrator mode ≠ project health
 * - Elevated terminal ≠ permission
 * - Normal mode is default
 * - .cursor/projects ≠ build root
 * - GREEN ≠ deploy
 * - AMK-Goku owns sacred moves
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Configuration
const HUB_ROOT = 'C:\\Cursor Projects Organiser\\Z_Sanctuary_Universe';
const CURSOR_PROJECTS_ARCHIVE = '.cursor/projects';
const REPORT_DIR = 'data/reports';
const JSON_REPORT = path.join(REPORT_DIR, 'z_pc_ide_admin_report.json');
const MD_REPORT = path.join(REPORT_DIR, 'z_pc_ide_admin_report.md');

// Create reports directory if it doesn't exist
if (!fs.existsSync(REPORT_DIR)) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
}

/**
 * Check if current process is elevated/admin on Windows
 */
function isProcessElevated() {
  try {
    // On Windows, use 'whoami /groups' to check if current user has admin token
    const output = execSync('whoami /groups').toString();
    // Check for S-1-5-32-544 (BUILTIN\Administrators)
    return output.includes('S-1-5-32-544');
  } catch (e) {
    // Fallback: try to detect from process env
    try {
      execSync('fsutil fsinfo drives', { stdio: 'ignore' });
      return true; // If this succeeds, we have elevation
    } catch {
      return false;
    }
  }
}

/**
 * Get current working directory
 */
function getCwd() {
  return process.cwd();
}

/**
 * Check if cwd is under .cursor/projects (archive path)
 */
function isCwdInArchive(cwd) {
  return cwd.toLowerCase().includes('.cursor' + path.sep + 'projects') ||
         cwd.toLowerCase().includes('.cursor/projects');
}

/**
 * Check if real hub root exists
 */
function hubRootExists() {
  return fs.existsSync(HUB_ROOT);
}

/**
 * Determine signal color based on checks
 */
function determineSignal(isElevated, cwd, hubExists) {
  if (isCwdInArchive(cwd)) {
    return { signal: 'RED', reason: 'Working directory is under .cursor/projects (archive path)' };
  }
  
  if (!hubExists) {
    return { signal: 'RED', reason: 'Real hub root does not exist: ' + HUB_ROOT };
  }
  
  if (isElevated) {
    return { signal: 'YELLOW', reason: 'Process is running elevated/admin mode' };
  }
  
  return { signal: 'GREEN', reason: 'Normal mode, safe hub path, all checks pass' };
}

/**
 * Generate reports
 */
function generateReports(isElevated, cwd, hubExists, signal, reason) {
  const timestamp = new Date().toISOString();
  const recommendedCommand = 'code "' + HUB_ROOT + '"';
  
  // JSON Report
  const jsonReport = {
    timestamp,
    phase: 'Z_PC_IDE_ADMIN_1',
    signal,
    reason,
    checks: {
      isElevated,
      cwdInArchive: isCwdInArchive(cwd),
      hubRootExists: hubExists,
      currentCwd: cwd
    },
    hubRoot: HUB_ROOT,
    recommendations: {
      launchCommand: recommendedCommand,
      notes: [
        'Administrator mode is not the default operating mode.',
        'Admin mode may increase confusion and risk with paths and permissions.',
        'Use normal VS Code for Sanctuary repo editing and task execution.',
        'Use admin mode only for rare OS-level tasks, outside normal Sanctuary work.',
        'Explorer context menu is convenience only; CLI path proof is stronger.',
        'Normal mode is the locked law default.',
        '.cursor/projects is cache/archive, not the build root.',
        'GREEN signal means safe to proceed; not deployment approval.'
      ]
    },
    exitCode: signal === 'RED' ? 1 : 0
  };
  
  // Markdown Report
  const mdReport = `# Z-PC-IDE-ADMIN-1 Safety Check Report

**Generated:** ${timestamp}

## Signal: ${signal}

${reason}

## Current Environment

- **Process Elevated:** ${isElevated ? 'YES ⚠️' : 'NO ✓'}
- **Current Directory:** ${cwd}
- **In Archive Path:** ${isCwdInArchive(cwd) ? 'YES ⚠️' : 'NO ✓'}
- **Hub Root Exists:** ${hubExists ? 'YES ✓' : 'NO ⚠️'}
- **Hub Root Path:** ${HUB_ROOT}

## Status by Check

| Check | Result | Impact |
|-------|--------|--------|
| Admin Mode Detection | ${isElevated ? '❌ Elevated' : '✅ Normal'} | ${isElevated ? 'May increase confusion/risk' : 'Safe operating mode'} |
| CWD Archive Check | ${isCwdInArchive(cwd) ? '❌ In archive' : '✅ Real hub'} | ${isCwdInArchive(cwd) ? 'Not build root' : 'Correct location'} |
| Hub Root Existence | ${hubExists ? '✅ Exists' : '❌ Missing'} | ${hubExists ? 'Can access real hub' : 'Cannot access hub'} |

## Recommended Action

\`\`\`powershell
${recommendedCommand}
\`\`\`

## Locked Laws

\`\`\`
Administrator mode ≠ project health.
Elevated terminal ≠ permission.
Explorer menu ≠ authority.
CLI path proof beats right-click.
.cursor/projects ≠ build root.
GREEN ≠ deploy.
AMK-Goku owns sacred moves.
\`\`\`

## Key Guidelines

1. **Use normal VS Code** for Z-Sanctuary repo editing and task gate execution
2. **Use admin mode only** for rare OS-level maintenance tasks outside normal Sanctuary workflow
3. **Never use admin as default** for build cockpit or development IDE
4. **Verify with CLI** – path proof via terminal is stronger than Explorer context menus
5. **Normal mode is default** – if unclear, reopen VS Code normally from the real hub path

## Exit Code

- **0 (GREEN/YELLOW):** Safe to proceed
- **1 (RED):** Critical issue requires attention

---

Phase: Z_PC_IDE_ADMIN_1  
Status: ${signal}  
Locked: Normal mode default · AMK-Goku authorized moves only
`;
  
  fs.writeFileSync(JSON_REPORT, JSON.stringify(jsonReport, null, 2));
  fs.writeFileSync(MD_REPORT, mdReport);
  
  return {
    jsonReport,
    recommendedCommand,
    exitCode: signal === 'RED' ? 1 : 0
  };
}

/**
 * Main execution
 */
async function main() {
  const isElevated = isProcessElevated();
  const cwd = getCwd();
  const hubExists = hubRootExists();
  
  const { signal, reason } = determineSignal(isElevated, cwd, hubExists);
  const { recommendedCommand, exitCode } = generateReports(isElevated, cwd, hubExists, signal, reason);
  
  // Console output
  const colors = {
    RED: '\x1b[31m',
    YELLOW: '\x1b[33m',
    GREEN: '\x1b[32m',
    RESET: '\x1b[0m'
  };
  
  const color = colors[signal] || colors.RESET;
  
  console.log(`${color}[${signal}]${colors.RESET} Z-PC-IDE-ADMIN-1 Safety Check`);
  console.log(`├─ ${reason}`);
  console.log(`├─ Reports written:`);
  console.log(`│  ├─ ${JSON_REPORT}`);
  console.log(`│  └─ ${MD_REPORT}`);
  
  if (isElevated) {
    console.log(`├─ ⚠️  Running in elevated/admin mode`);
    console.log(`│  └─ Recommended: Reopen VS Code normally:`);
    console.log(`│     ${recommendedCommand}`);
  }
  
  console.log(`└─ Exit code: ${exitCode}`);
  
  process.exit(exitCode);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
