// Z: scripts\z_policy_lint.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const schemasDir = path.join(repoRoot, 'schemas');
const rulesDir = path.join(repoRoot, 'rules');
const ignoreFiles = new Set(['Z_FORMULA_REGISTRY.json', 'Z_COMPATIBILITY_MAP.json']);
const ignoreDirs = new Set(['.vscode']);

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function collectJsonFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (ignoreDirs.has(entry.name)) continue;
      files.push(...collectJsonFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      if (ignoreFiles.has(entry.name)) continue;
      files.push(fullPath);
    }
  }
  return files;
}

function buildAjv() {
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);

  const schemaFiles = [
    'z_condition.schema.json',
    'z_action.schema.json',
    'z_rule.schema.json',
    'z_context_snapshot.schema.json',
    'z_audit_event.schema.json',
  ];

  for (const name of schemaFiles) {
    const schemaPath = path.join(schemasDir, name);
    if (!fs.existsSync(schemaPath)) continue;
    const schema = readJson(schemaPath);
    ajv.addSchema(schema, schema.$id || name);
  }

  return ajv;
}

function lintRule(rule, filePath) {
  const errors = [];

  if (rule.risk_class === 'sacred' && rule.consent?.level !== 'require_human') {
    errors.push('sacred rules must set consent.level to require_human');
  }

  if (rule.risk_class === 'high') {
    const cooldown = Number(rule.action_set?.cooldown_seconds ?? 0);
    if (!Number.isFinite(cooldown) || cooldown <= 0) {
      errors.push('high-risk rules must include a positive cooldown_seconds');
    }
  }

  if (errors.length) {
    return errors.map((msg) => `${filePath}: ${msg}`);
  }

  return [];
}

function formatAjvErrors(filePath, errors) {
  if (!errors || !errors.length) return [];
  return errors.map((err) => `${filePath}: ${err.instancePath || '/'} ${err.message || 'invalid'}`);
}

function main() {
  const ajv = buildAjv();
  const validate = ajv.getSchema('z_rule.schema.json');

  if (!validate) {
    console.error('z_policy_lint: missing z_rule.schema.json in schemas/');
    process.exit(1);
  }

  const ruleFiles = collectJsonFiles(rulesDir);
  if (!ruleFiles.length) {
    console.log('z_policy_lint: no rule files found in rules/');
    process.exit(0);
  }

  const failures = [];
  for (const filePath of ruleFiles) {
    let data;
    try {
      data = readJson(filePath);
    } catch (err) {
      failures.push(`${filePath}: invalid JSON (${err.message})`);
      continue;
    }

    const valid = validate(data);
    if (!valid) {
      failures.push(...formatAjvErrors(filePath, validate.errors));
      continue;
    }

    failures.push(...lintRule(data, filePath));
  }

  if (failures.length) {
    console.error('z_policy_lint: failures detected');
    failures.forEach((msg) => console.error(`- ${msg}`));
    process.exit(1);
  }

  console.log(`z_policy_lint: ${ruleFiles.length} rule file(s) validated`);
}

main();
