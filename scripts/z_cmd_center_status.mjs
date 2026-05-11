#!/usr/bin/env node

/**
 * Z_CMD_CENTER_1 — Windows Command Center MiniBot Status Checker
 * 
 * Purpose:
 * - Read-only command center guide for Windows
 * - Know project roots and IDE commands
 * - Detect availability of code/cursor CLIs
 * - Verify safe command environment
 * - Report command recommendations
 * - Signal GREEN/YELLOW/BLUE/RED
 * 
 * Locked law:
 * - Command center ≠ command authority
 * - MiniBot guide ≠ autonomous operator
 * - Windows Terminal layout ≠ deployment
 * - PowerShell shortcut ≠ permission
 * - NAS declared ≠ mounted
 * - Cloudflare declared ≠ deployed
 * - GREEN ≠ deploy
 * - AMK-Goku owns sacred moves
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Configuration
const REGISTRY_PATH = 'data/z_cmd_center_registry.json';
const REPORT_DIR = 'data/reports';
const JSON_REPORT = path.join(REPORT_DIR, 'z_cmd_center_report.json');
const MD_REPORT = path.join(REPORT_DIR, 'z_cmd_center_report.md');

// Create reports directory if it doesn't exist
if (!fs.existsSync(REPORT_DIR)) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
}

/**
 * Load registry
 */
function loadRegistry() {
  try {
    const content = fs.readFileSync(REGISTRY_PATH, 'utf8');
    return JSON.parse(content);
  } catch (e) {
    throw new Error('Failed to load registry: ' + e.message);
  }
}

/**
 * Check if a path exists
 */
function pathExists(p) {
  return fs.existsSync(p);
}

/**
 * Check if a command is available in PATH
 */
function commandExists(cmd) {
  try {
    execSync(`where ${cmd}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Get current working directory
 */
function getCwd() {
  return process.cwd();
}

/**
 * Check if cwd is in archive path
 */
function isCwdInArchive(cwd) {
  return cwd.toLowerCase().includes('.cursor' + path.sep + 'projects') ||
         cwd.toLowerCase().includes('.cursor/projects');
}

/**
 * Check if process is elevated
 */
function isProcessElevated() {
  try {
    const output = execSync('whoami /groups').toString();
    return output.includes('S-1-5-32-544');
  } catch {
    try {
      execSync('fsutil fsinfo drives', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Determine signal based on checks
 */
function determineSignal(registry, checks) {
  // RED: Critical issues
  if (checks.cwdInArchive) {
    return { signal: 'RED', reason: 'Working directory is in .cursor/projects (archive path)' };
  }
  
  if (!checks.mainHubExists) {
    return { signal: 'RED', reason: 'Main hub root does not exist' };
  }
  
  // BLUE: AMK decision required
  if (!checks.codeAvailable && !checks.cursorAvailable) {
    return { signal: 'BLUE', reason: 'No IDE commands available - AMK decision needed' };
  }
  
  // YELLOW: Warnings
  const warnings = [];
  if (!checks.codeAvailable) warnings.push('code command not available');
  if (!checks.cursorAvailable) warnings.push('cursor command not available');
  if (!checks.labsExists) warnings.push('Labs workspace missing');
  
  if (warnings.length > 0) {
    return { signal: 'YELLOW', reason: 'Minor issues: ' + warnings.join(', ') };
  }
  
  // GREEN: All good
  return { signal: 'GREEN', reason: 'All checks pass - command center ready' };
}

/**
 * Generate reports
 */
function generateReports(registry, checks, signal, reason) {
  const timestamp = new Date().toISOString();
  
  // JSON Report
  const jsonReport = {
    timestamp,
    phase: 'Z_CMD_CENTER_1',
    signal,
    reason,
    checks,
    registry_version: registry.schema,
    detected_roots: {
      main_hub_exists: checks.mainHubExists,
      labs_exists: checks.labsExists,
      cwd_safe: !checks.cwdInArchive
    },
    detected_ide_commands: {
      code_available: checks.codeAvailable,
      cursor_available: checks.cursorAvailable
    },
    system_status: {
      process_elevated: checks.isElevated,
      current_cwd: checks.cwd
    },
    safe_command_recommendations: registry.command_recommendations,
    future_domains: Object.keys(registry.future_declared_domains),
    next_actions: [
      'Use command recommendations to open IDE from correct root',
      'Run safe commands from main hub: npm run z:pc:ide-path, z:ssws:cockpit, etc.',
      'Do NOT modify registry, profiles, or auto-launch settings',
      'Future NAS/Cloudflare integration pending AMK approval',
      'Report signal: ' + signal
    ],
    locked_laws: registry.locked_laws,
    exitCode: signal === 'RED' ? 1 : 0
  };
  
  // Markdown Report
  const mdReport = `# Z-CMD-CENTER-1 Windows Command Center Report

**Generated:** ${timestamp}

## Signal: ${signal}

${reason}

## Current Environment

- **Process Elevated:** ${checks.isElevated ? 'YES ⚠️' : 'NO ✓'}
- **Current Directory:** ${checks.cwd}
- **In Archive Path:** ${checks.cwdInArchive ? 'YES ⚠️' : 'NO ✓'}

## Root Status

| Root | Path | Exists | Notes |
|------|------|--------|-------|
| Main Hub | C:\\Cursor Projects Organiser\\Z_Sanctuary_Universe | ${checks.mainHubExists ? '✅' : '❌'} | Primary project root |
| Labs | C:\\Cursor Projects Organiser\\Z_Sanctuary_Universe\\ZSanctuary_Labs | ${checks.labsExists ? '✅' : '❌'} | Experimental workspace |
| Archive | C:\\Users\\manoj\\.cursor\\projects | N/A | Avoid as build root |

## IDE Commands

| Command | Available | Purpose |
|---------|-----------|---------|
| code | ${checks.codeAvailable ? '✅' : '❌'} | VS Code CLI |
| cursor | ${checks.cursorAvailable ? '✅' : '❌'} | Cursor IDE CLI |

## Safe Command Recommendations

\`\`\`powershell
# Open main hub in VS Code (normal mode, recommended)
code "C:\\Cursor Projects Organiser\\Z_Sanctuary_Universe"

# Open Labs workspace in VS Code
code "C:\\Cursor Projects Organiser\\Z_Sanctuary_Universe\\ZSanctuary_Labs"

# Open Labs in Cursor IDE (if available)
cursor "C:\\Cursor Projects Organiser\\Z_Sanctuary_Universe\\ZSanctuary_Labs"
\`\`\`

## Safe Command Queue

Run these read-only checks:

1. \`npm run z:pc:ide-path\` – IDE path and configuration verification
2. \`npm run z:ssws:cockpit\` – Super Saiyan Workspace Cockpit status
3. \`npm run z:ide:fusion\` – IDE fusion operator rhythm
4. \`npm run verify:md\` – Documentation verification
5. \`npm run z:traffic\` – Traffic monitor
6. \`npm run z:car2\` – Car2 status
7. \`npm run dashboard:registry-verify\` – Dashboard integrity

## Future Declared Domains (Read-Only Status)

These domains are **declared but not yet integrated**:

- **NAS/Synology:** Pending NAS mount approval
- **Cloudflare:** Pending deployment gate approval
- **External Storage:** Pending integration decision

**Status:** All future integrations require explicit AMK approval.

## Locked Laws

\`\`\`
Command center ≠ command authority.
MiniBot guide ≠ autonomous operator.
Windows Terminal layout ≠ deployment.
PowerShell shortcut ≠ permission.
NAS declared ≠ mounted.
Cloudflare declared ≠ deployed.
GREEN ≠ deploy.
AMK-Goku owns sacred moves.
\`\`\`

## Key Principles

1. **Read-Only First:** This phase detects and reports only; it does not execute sacred actions.
2. **Root Awareness:** Command center knows all known roots and can recommend safe paths.
3. **No Auto-Launch:** IDE suggestions are printed for manual execution, never auto-launched.
4. **No Profile Modification:** PowerShell profile shortcuts are future opt-in; not set automatically.
5. **No NAS/Cloudflare:** Future domains are declared but not connected or deployed.
6. **AMK Gate:** Any live operations require explicit AMK-Goku approval.

## Recommended Next Steps

1. ✅ Use command recommendations to open IDE safely
2. ✅ Run safe command queue for verification
3. ⏳ Request AMK approval for optional profile shortcuts (Phase 2)
4. ⏳ Wait for NAS/Cloudflare integration decisions (Future phases)
5. ⏳ Do NOT modify registry, profiles, or auto-launch settings

## Exit Code

- **0 (GREEN/YELLOW/BLUE):** Safe to proceed
- **1 (RED):** Critical issue requires attention

---

Phase: Z_CMD_CENTER_1  
Status: ${signal}  
Mode: Read-Only Command Center  
Locked: Command authority stays with AMK-Goku
`;
  
  fs.writeFileSync(JSON_REPORT, JSON.stringify(jsonReport, null, 2));
  fs.writeFileSync(MD_REPORT, mdReport);
  
  return {
    jsonReport,
    exitCode: signal === 'RED' ? 1 : 0
  };
}

/**
 * Main execution
 */
async function main() {
  try {
    const registry = loadRegistry();
    const cwd = getCwd();
    const cwdInArchive = isCwdInArchive(cwd);
    const mainHubExists = pathExists(registry.known_roots.main_hub.path);
    const labsExists = pathExists(registry.known_roots.labs.path);
    const codeAvailable = commandExists('code');
    const cursorAvailable = commandExists('cursor');
    const isElevated = isProcessElevated();
    
    const checks = {
      mainHubExists,
      labsExists,
      cwdInArchive,
      cwd,
      codeAvailable,
      cursorAvailable,
      isElevated
    };
    
    const { signal, reason } = determineSignal(registry, checks);
    const { exitCode } = generateReports(registry, checks, signal, reason);
    
    // Console output
    const colors = {
      RED: '\x1b[31m',
      YELLOW: '\x1b[33m',
      GREEN: '\x1b[32m',
      BLUE: '\x1b[34m',
      RESET: '\x1b[0m'
    };
    
    const color = colors[signal] || colors.RESET;
    
    console.log(`${color}[${signal}]${colors.RESET} Z-CMD-CENTER-1 Windows Command Center`);
    console.log(`├─ ${reason}`);
    console.log(`├─ Main Hub: ${mainHubExists ? '✓' : '✗'}`);
    console.log(`├─ IDE: code=${codeAvailable ? '✓' : '✗'} cursor=${cursorAvailable ? '✓' : '✗'}`);
    console.log(`├─ Reports written:`);
    console.log(`│  ├─ ${JSON_REPORT}`);
    console.log(`│  └─ ${MD_REPORT}`);
    console.log(`└─ Exit code: ${exitCode}`);
    
    process.exit(exitCode);
  } catch (err) {
    console.error('Fatal error:', err.message);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
