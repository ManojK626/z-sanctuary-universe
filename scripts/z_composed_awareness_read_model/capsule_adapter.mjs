import { loadJsonSource } from './source_loader.mjs';

const DECLARED_FIELDS = [
  'schema',
  'project_id',
  'project_name',
  'primary_domain',
  'current_signal',
  'growth_percent',
  'required_checks',
  'api_health',
  'smoke_gate',
  'build_gate',
  'docs_gate',
  'autonomy_level',
  'allowed_auto_checks',
  'human_gated_actions',
  'related_docs',
  'related_reports',
  'notes',
];

export function loadCapsuleIfPath(root, capsulePath) {
  if (typeof capsulePath !== 'string' || capsulePath.length === 0) {
    return { posture: 'MISSING', present: 'MISSING' };
  }
  const loaded = loadJsonSource(root, capsulePath);
  if (!loaded.ok) {
    return { posture: loaded.reason, present: 'MISSING', source_path: capsulePath };
  }
  const source_declared = {};
  for (const key of DECLARED_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(loaded.data, key)) {
      source_declared[key] = {
        value: loaded.data[key],
        origin: 'REAL_SOURCE',
        label: 'SOURCE_DECLARED',
      };
    } else {
      source_declared[key] = { posture: 'MISSING' };
    }
  }
  return {
    posture: 'PRESENT',
    present: 'PRESENT',
    source_path: capsulePath,
    sha256: loaded.sha256,
    origin: 'REAL_SOURCE',
    source_declared,
  };
}
