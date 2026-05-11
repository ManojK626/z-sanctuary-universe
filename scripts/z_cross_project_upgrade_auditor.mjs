import fs from 'node:fs';
import path from 'node:path';

const HUB_ROOT = process.cwd();
const ORGANISER_ROOT = path.resolve(HUB_ROOT, '..');
const REGISTRY_PATH = path.join(ORGANISER_ROOT, 'z-eaii-registry.json');
const OUT_JSON = path.join(HUB_ROOT, 'data', 'reports', 'z_cross_project_upgrade_audit.json');
const OUT_MD = path.join(HUB_ROOT, 'data', 'reports', 'z_cross_project_upgrade_audit.md');

function readJsonSafe(filePath, fallback = null) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function fileExists(...parts) {
  return fs.existsSync(path.join(...parts));
}

function hasScript(pkg, scriptName) {
  return Boolean(pkg?.scripts && typeof pkg.scripts[scriptName] === 'string' && pkg.scripts[scriptName].trim().length > 0);
}

function hasAnyScriptContaining(pkg, token) {
  if (!pkg?.scripts || typeof pkg.scripts !== 'object') return false;
  return Object.keys(pkg.scripts).some((k) => k.includes(token));
}

function countByExtension(absDir, ext, maxDepth = 3, depth = 0) {
  if (!fs.existsSync(absDir) || depth > maxDepth) return 0;
  let count = 0;
  let entries = [];
  try {
    entries = fs.readdirSync(absDir, { withFileTypes: true });
  } catch {
    return 0;
  }
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const full = path.join(absDir, entry.name);
    if (entry.isDirectory()) {
      count += countByExtension(full, ext, maxDepth, depth + 1);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(ext)) {
      count += 1;
    }
  }
  return count;
}

function findFileByName(absDir, targetName, maxDepth = 4, depth = 0) {
  if (!fs.existsSync(absDir) || depth > maxDepth) return null;
  let entries = [];
  try {
    entries = fs.readdirSync(absDir, { withFileTypes: true });
  } catch {
    return null;
  }
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const full = path.join(absDir, entry.name);
    if (entry.isFile() && entry.name.toLowerCase() === targetName.toLowerCase()) return full;
    if (entry.isDirectory()) {
      const found = findFileByName(full, targetName, maxDepth, depth + 1);
      if (found) return found;
    }
  }
  return null;
}

function checkProject(project) {
  const absPath = project.path;
  const pathExists = fs.existsSync(absPath);
  const statusText = String(project.status || '').toLowerCase();
  const missingExpected = statusText.includes('missing') || statusText.includes('retired') || statusText.includes('archive');
  const isHubProject = String(project.name || '').toLowerCase() === 'zsanctuary_universe';
  const packageJsonPath = path.join(absPath, 'package.json');
  const packageJson = readJsonSafe(packageJsonPath, null);
  const runtimeManifestPath = path.join(absPath, 'z_project_runtime.json');
  const runtimeManifest = readJsonSafe(runtimeManifestPath, null);
  const hasRuntimeManifest = Boolean(runtimeManifest && typeof runtimeManifest === 'object');

  const scripts = {
    lint: hasScript(packageJson, 'lint'),
    test: hasScript(packageJson, 'test'),
    verifyFull: hasScript(packageJson, 'verify:full') || hasAnyScriptContaining(packageJson, 'verify'),
  };

  const zHtmlDoPath = findFileByName(absPath, 'z-html-do.html', 5);
  const zSanctuaryLinkExists = fileExists(absPath, 'z_sanctuary_link.json');
  const ps1Count = countByExtension(absPath, '.ps1');
  const mdCount = countByExtension(absPath, '.md');

  const checks = [
    {
      id: 'path_exists',
      status: pathExists ? 'PASS' : missingExpected ? 'GAPS' : 'FAIL',
      evidence: pathExists ? absPath : `${absPath} (registry status: ${project.status || 'unknown'})`,
    },
    {
      id: 'package_json',
      status: missingExpected ? 'N/A' : packageJson || hasRuntimeManifest ? 'PASS' : 'GAPS',
      evidence: missingExpected
        ? 'project marked missing/retired in registry'
        : packageJson
          ? packageJsonPath
          : hasRuntimeManifest
            ? runtimeManifestPath
            : 'missing',
    },
    {
      id: 'scripts_lint_test_verify',
      status: missingExpected
        ? 'N/A'
        : packageJson
          ? scripts.lint && scripts.test && scripts.verifyFull
            ? 'PASS'
            : 'GAPS'
          : 'N/A',
      evidence: missingExpected
        ? 'project marked missing/retired in registry'
        : packageJson
          ? `lint=${scripts.lint}, test=${scripts.test}, verify=${scripts.verifyFull}`
          : 'non-node-runtime-or-missing-package',
    },
    {
      id: 'dashboard_z_html_do',
      status: missingExpected ? 'N/A' : zHtmlDoPath ? 'PASS' : 'GAPS',
      evidence: missingExpected
        ? 'project marked missing/retired in registry'
        : zHtmlDoPath || 'z-html-do.html not found (depth<=5)',
    },
    {
      id: 'sanctuary_link_file',
      status: isHubProject || missingExpected ? 'N/A' : zSanctuaryLinkExists ? 'PASS' : 'GAPS',
      evidence: isHubProject
        ? 'hub skipped by emitter design'
        : missingExpected
          ? 'project marked missing/retired in registry'
          : zSanctuaryLinkExists
            ? 'z_sanctuary_link.json present'
            : 'missing',
    },
    {
      id: 'powershell_docs_presence',
      status: missingExpected ? 'N/A' : mdCount > 0 && (ps1Count > 0 || hasRuntimeManifest) ? 'PASS' : 'GAPS',
      evidence: missingExpected
        ? 'project marked missing/retired in registry'
        : `.ps1=${ps1Count}, .md=${mdCount}, runtime_manifest=${hasRuntimeManifest} (sample depth<=3)`,
    },
  ];

  const hasFail = checks.some((c) => c.status === 'FAIL');
  const hasGaps = checks.some((c) => c.status === 'GAPS');
  const verdict = hasFail ? 'FAIL' : hasGaps ? 'PASS_WITH_GAPS' : 'PASS';

  return {
    name: project.name,
    path: absPath,
    markers: project.markers || [],
    ports: project.ports || {},
    checks,
    verdict,
  };
}

function run() {
  const registry = readJsonSafe(REGISTRY_PATH, null);
  if (!registry || !Array.isArray(registry.projects)) {
    throw new Error(`Registry missing or invalid: ${REGISTRY_PATH}`);
  }

  const projects = registry.projects.map(checkProject);
  const summary = {
    total_projects: projects.length,
    pass: projects.filter((p) => p.verdict === 'PASS').length,
    pass_with_gaps: projects.filter((p) => p.verdict === 'PASS_WITH_GAPS').length,
    fail: projects.filter((p) => p.verdict === 'FAIL').length,
  };
  const overall = summary.fail > 0 ? 'FAIL' : summary.pass_with_gaps > 0 ? 'PASS_WITH_GAPS' : 'PASS';

  const payload = {
    generated_at: new Date().toISOString(),
    organiser_root: ORGANISER_ROOT,
    registry_path: REGISTRY_PATH,
    overall,
    summary,
    projects,
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  const md = [
    '# Z Cross-Project Upgrade Audit',
    '',
    `Generated: ${payload.generated_at}`,
    `Overall: ${overall}`,
    `Projects: ${summary.total_projects} (PASS ${summary.pass} | PASS_WITH_GAPS ${summary.pass_with_gaps} | FAIL ${summary.fail})`,
    '',
    '## Project Verdicts',
    ...projects.map((p) => `- ${p.verdict}: ${p.name} (\`${p.path}\`)`),
    '',
    '## Evidence Table',
    '| Project | Check | Status | Evidence |',
    '| --- | --- | --- | --- |',
    ...projects.flatMap((p) => p.checks.map((c) => `| ${p.name} | ${c.id} | ${c.status} | ${String(c.evidence).replaceAll('|', '\\|')} |`)),
    '',
  ];
  fs.writeFileSync(OUT_MD, md.join('\n'), 'utf8');

  console.log(`Cross-project upgrade audit written: ${OUT_JSON}`);
}

run();
