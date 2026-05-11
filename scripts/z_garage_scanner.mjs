import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const DATA_DIR = path.join(ROOT, 'data');
const REPORTS_DIR = path.join(DATA_DIR, 'reports');
const OUTPUT_PATH = path.join(REPORTS_DIR, 'z_garage_system_map.json');
const REGISTRY_PATH = path.join(DATA_DIR, 'z_garage_capability_registry.json');

const IGNORE = ['node_modules', '.git', '.next', 'dist', 'build'];

function readDirSafe(dir) {
  try {
    return fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
}

function extractPackageInfo(folderPath) {
  const pkgPath = path.join(folderPath, 'package.json');

  if (!fs.existsSync(pkgPath)) return null;

  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

    return {
      name: pkg.name || null,
      version: pkg.version || null,
      scripts: pkg.scripts ? Object.keys(pkg.scripts) : [],
      dependencies: pkg.dependencies ? Object.keys(pkg.dependencies) : [],
    };
  } catch {
    return null;
  }
}

function detectCapabilities(folderPath) {
  const files = readDirSafe(folderPath).map((f) => f.name);
  const capabilities = [];
  const packageInfo = extractPackageInfo(folderPath);
  const p = folderPath.replace(/\\/g, '/').toLowerCase();

  if (files.includes('package.json')) capabilities.push('node_project');
  if (files.includes('scripts')) capabilities.push('has_scripts');
  if (files.includes('data')) capabilities.push('has_data');
  if (files.includes('ui')) capabilities.push('has_ui');

  if (p.includes('z_bridge')) capabilities.push('z_bridge_module');
  if (p.includes('zuno')) capabilities.push('zuno_core');
  if (p.includes('readiness')) capabilities.push('readiness_gate');
  if (p.includes('enforcer')) capabilities.push('execution_enforcer');

  if (packageInfo?.scripts?.length) {
    capabilities.push('scriptable');

    if (packageInfo.scripts.includes('start')) capabilities.push('runnable_app');
    if (packageInfo.scripts.includes('build')) capabilities.push('build_system');
    if (packageInfo.scripts.includes('test')) capabilities.push('test_system');
    if (packageInfo.scripts.includes('lint')) capabilities.push('lint_system');
  }

  return {
    capabilities,
    packageInfo,
  };
}

function scanDirectory(basePath, depth = 0) {
  if (depth > 2) return [];

  const entries = readDirSafe(basePath);
  const results = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (IGNORE.includes(entry.name)) continue;

    const fullPath = path.join(basePath, entry.name);
    const { capabilities, packageInfo } = detectCapabilities(fullPath);

    const node = {
      name: entry.name,
      path: '.' + fullPath.slice(ROOT.length).replace(/\\/g, '/'),
      depth,
      capabilities,
      package: packageInfo,
      children: scanDirectory(fullPath, depth + 1),
    };

    results.push(node);
  }

  return results;
}

function countNodes(nodes) {
  let count = 0;
  for (const node of nodes) {
    count++;
    if (node.children?.length) {
      count += countNodes(node.children);
    }
  }
  return count;
}

function classifyProject(node) {
  const caps = node.capabilities || [];

  if (caps.includes('zuno_core')) return 'ai_system';
  if (caps.includes('execution_enforcer')) return 'infra';
  if (caps.includes('readiness_gate')) return 'infra';

  if (caps.includes('z_bridge_module')) {
    if (caps.includes('has_ui')) return 'frontend';
    if (caps.includes('has_data')) return 'data_system';
    return 'bridge';
  }

  if (caps.includes('has_ui')) return 'frontend';
  if (caps.includes('has_data')) return 'data_system';

  if (caps.includes('node_project')) return 'backend';

  return 'unknown';
}

function detectWeaknesses(node) {
  const weaknesses = [];
  const scripts = node.package?.scripts || [];
  const caps = node.capabilities || [];

  if (!scripts.length) {
    if (caps.includes('node_project')) {
      weaknesses.push('no_scripts');
    }
  } else {
    if (!scripts.includes('test')) weaknesses.push('no_tests');
    if (!scripts.includes('lint')) weaknesses.push('no_lint');
  }

  if (caps.length === 0) {
    weaknesses.push('no_capabilities_detected');
  }

  return weaknesses;
}

function detectRelationships(node) {
  const relations = [];
  const caps = node.capabilities || [];

  if (caps.includes('z_bridge_module')) {
    relations.push('connected_to_z_bridge');
  }

  if (caps.includes('zuno_core')) {
    relations.push('connected_to_zuno');
  }

  if (caps.includes('execution_enforcer')) {
    relations.push('governed_by_enforcer');
  }

  if (caps.includes('readiness_gate')) {
    relations.push('uses_readiness_gate');
  }

  return relations;
}

function buildCapabilityRegistry(nodes, registry = []) {
  for (const node of nodes) {
    if (node.capabilities?.length) {
      const type = classifyProject(node);
      const weaknesses = detectWeaknesses(node);
      const relationships = detectRelationships(node);

      registry.push({
        name: node.name,
        path: node.path,
        type,
        capabilities: node.capabilities,
        scripts: node.package?.scripts || [],
        weaknesses,
        relationships,
      });
    }

    if (node.children?.length) {
      buildCapabilityRegistry(node.children, registry);
    }
  }

  return registry;
}

function runScanner() {
  const startedAt = new Date().toISOString();
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(REPORTS_DIR, { recursive: true });

  const structure = scanDirectory(ROOT);

  const registry = buildCapabilityRegistry(structure);

  const report = {
    generated_at: startedAt,
    root: '.',
    summary: {
      total_nodes: countNodes(structure),
    },
    structure,
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(report, null, 2), 'utf8');

  fs.writeFileSync(
    REGISTRY_PATH,
    JSON.stringify(
      {
        generated_at: startedAt,
        total_entries: registry.length,
        registry,
      },
      null,
      2,
    ),
    'utf8',
  );

  console.log('Z-Garage Scanner complete');
  console.log(`Output: ${OUTPUT_PATH}`);
  console.log(`Registry: ${REGISTRY_PATH}`);
}

runScanner();
