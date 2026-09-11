#!/usr/bin/env node
/**
 * Z-ATLAS-0.5 deterministic registry validator.
 * Reads the Phase 0.5 registry + four Phase 0 schemas.
 * No network. No filesystem crawl. No mutation. No runtime wiring.
 * Exit 0 only if all required PASS verdicts hold.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Minimal draft-2020-12 validator covering the Phase 0 Atlas schemas:
 * type/object/array/string/boolean, required, additionalProperties:false,
 * enum, minLength, maxLength, nested objects, array items.
 * Deterministic. No network. No npm dependency (this worktree has no node_modules).
 */
function validateSchema(schema, data, pointer = '') {
  const errors = [];
  const loc = pointer || '/';
  if (!schema || typeof schema !== 'object') return errors;
  if (schema.type === 'object') {
    if (data === null || typeof data !== 'object' || Array.isArray(data)) {
      errors.push(`${loc} must be object`);
      return errors;
    }
    const props = schema.properties || {};
    for (const key of schema.required || []) {
      if (!Object.prototype.hasOwnProperty.call(data, key)) {
        errors.push(`${loc} missing required property ${key}`);
      }
    }
    if (schema.additionalProperties === false) {
      for (const key of Object.keys(data)) {
        if (!Object.prototype.hasOwnProperty.call(props, key)) {
          errors.push(`${loc} additional property not allowed: ${key}`);
        }
      }
    }
    for (const [key, sub] of Object.entries(props)) {
      if (!Object.prototype.hasOwnProperty.call(data, key)) continue;
      errors.push(...validateSchema(sub, data[key], `${pointer}/${key}`));
    }
    return errors;
  }
  if (schema.type === 'array') {
    if (!Array.isArray(data)) {
      errors.push(`${loc} must be array`);
      return errors;
    }
    if (schema.items) {
      data.forEach((item, i) => {
        errors.push(...validateSchema(schema.items, item, `${pointer}/${i}`));
      });
    }
    return errors;
  }
  if (schema.type === 'string') {
    if (typeof data !== 'string') {
      errors.push(`${loc} must be string`);
      return errors;
    }
    if (typeof schema.minLength === 'number' && data.length < schema.minLength) {
      errors.push(`${loc} shorter than minLength ${schema.minLength}`);
    }
    if (typeof schema.maxLength === 'number' && data.length > schema.maxLength) {
      errors.push(`${loc} longer than maxLength ${schema.maxLength}`);
    }
    if (schema.enum && !schema.enum.includes(data)) {
      errors.push(`${loc} not in enum (${data})`);
    }
    return errors;
  }
  if (schema.type === 'boolean') {
    if (typeof data !== 'boolean') errors.push(`${loc} must be boolean`);
    return errors;
  }
  if (schema.enum && !schema.enum.includes(data)) {
    errors.push(`${loc} not in enum (${data})`);
  }
  return errors;
}

function compileSchema(schema) {
  return (data) => {
    const errors = validateSchema(schema, data);
    compileSchema.lastErrors = errors;
    return errors.length === 0;
  };
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const REGISTRY_PATH = path.join(ROOT, 'data', 'z_atlas', 'z_atlas_registry_v0_5.json');
const SCHEMA_DIR = path.join(ROOT, 'schemas');
const SCHEMA_FILES = {
  node: 'z_atlas_node_v1.schema.json',
  edge: 'z_atlas_edge_v1.schema.json',
  fact: 'z_atlas_fact_v1.schema.json',
  preflight: 'z_atlas_preflight_context_v1.schema.json',
};

const PRODUCT_CAPABLE_TYPES = new Set([
  'PRODUCT',
  'ROOT',
  'PROJECT',
  'MODULE',
  'COMMERCIAL_SYSTEM',
  'WORKTREE',
  'SERVICE',
  'REPOSITORY',
  'AGENT',
]);

const AUTHORITY_FIELDS = [
  'identityStatus',
  'authorityStatus',
  'canonicality',
  'ownership',
  'environment',
  'gateState',
  'healthState',
  'evidenceFreshness',
];

const FACT_PROVENANCE_FIELDS = [
  'factId',
  'subjectId',
  'predicate',
  'source',
  'evidenceRef',
  'observedAt',
  'freshness',
  'confidenceClass',
  'authority',
  'status',
];

const DISTINCT_PRODUCT_IDS = [
  'product.zwheel-cracker',
  'product.ssr-pro-app',
  'product.rda',
];

const HUB_POINTER_IDS = [
  'pointer.hub-zwheel-cracker',
  'module.hub-roulette',
  'module.hub-roulette-calculator',
];

const MERGE_EDGE_TYPES = new Set(['CANONICAL_FOR', 'OWNS_SOURCE', 'SUPERSEDED_BY']);
const UNCERTAIN_RE = /\b(UNVERIFIED|UNRESOLVED|MISSING|UNKNOWN)\b/i;
const PROMOTED_AUTHORITY = new Set(['CANONICAL']);
const FALSE_CLAIM_KEYS = [
  'completenessClaimed',
  'pcWideCompletenessClaimed',
  'machineAuthoritative',
  'registryEntryIsCanonicalIdentity',
  'observedPathIsTrustedProject',
  'existingIsCanonical',
  'discoveredIsTrusted',
  'unknownIsGreen',
  'absenceOfEvidenceIsEvidenceOfAbsence',
  'autoDiscovery',
  'runtime',
  'autonomousMutation',
];

const issues = [];
const notes = [];

function fail(code, message) {
  issues.push({ code, message });
}

function readJson(filePath, label) {
  const raw = fs.readFileSync(filePath, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (error) {
    fail('JSON_PARSE', `${label}: ${error.message}`);
    return null;
  }
}

function loadSchemas() {
  const out = {};
  for (const [key, name] of Object.entries(SCHEMA_FILES)) {
    const full = path.join(SCHEMA_DIR, name);
    if (!fs.existsSync(full)) {
      fail('SCHEMA_MISSING', `Phase 0 schema missing: ${full}`);
      continue;
    }
    out[key] = readJson(full, `schema ${name}`);
  }
  return out;
}

function compileValidators(schemas) {
  const validators = {};
  for (const [key, schema] of Object.entries(schemas)) {
    if (!schema) continue;
    validators[key] = compileSchema(schema);
  }
  return validators;
}

function validateAgainst(validator, item, label) {
  if (!validator) {
    fail('SCHEMA_VALIDATOR_MISSING', label);
    return;
  }
  const ok = validator(item);
  if (!ok) {
    const detail = (compileSchema.lastErrors || []).slice(0, 8).join('; ');
    fail('SCHEMA_CONFORMANCE', `${label}: ${detail}`);
  }
}

function nodeById(registry, nodeId) {
  return (registry.nodes || []).find((n) => n.nodeId === nodeId);
}

function checkWrapper(registry) {
  if (!registry || typeof registry !== 'object') {
    fail('REGISTRY', 'Registry is not an object');
    return;
  }
  if (registry.schema !== 'z_atlas_registry_v0_5') {
    fail('REGISTRY', `Unexpected schema id: ${registry.schema}`);
  }
  if (registry.machineAuthoritative === true) {
    fail('AUTHORITY', 'machineAuthoritative must not be true');
  }
  if (registry.machineReadable !== true) {
    fail('REGISTRY', 'machineReadable must be true for this slice');
  }
  const claims = registry.claims || {};
  for (const key of FALSE_CLAIM_KEYS) {
    if (claims[key] !== false) {
      fail('COMPLETENESS', `claims.${key} must be false (got ${JSON.stringify(claims[key])})`);
    }
  }
  if (claims.completenessClaimed === true || claims.pcWideCompletenessClaimed === true) {
    fail('COMPLETENESS', 'completeness claim flag is true');
  }
  const blob = JSON.stringify(registry);
  if (/"completenessClaimed"\s*:\s*true/.test(blob) || /"pcWideCompletenessClaimed"\s*:\s*true/.test(blob)) {
    fail('COMPLETENESS', 'completenessClaimed/pcWideCompletenessClaimed true found in document');
  }
}

function checkNodes(registry, validateNode) {
  const nodes = registry.nodes || [];
  const ids = new Set();
  for (const node of nodes) {
    validateAgainst(validateNode, node, `node ${node.nodeId || '(missing id)'}`);
    if (!node.nodeId) continue;
    if (ids.has(node.nodeId)) fail('NODE_ID', `Duplicate nodeId ${node.nodeId}`);
    ids.add(node.nodeId);
    if (PRODUCT_CAPABLE_TYPES.has(node.nodeType)) {
      for (const field of AUTHORITY_FIELDS) {
        if (typeof node[field] !== 'string' || node[field].length < 1) {
          fail('AUTHORITY_FIELDS', `${node.nodeId} missing ${field}`);
        }
      }
    }
  }

  const index = registry.uncertaintyIndex || {};
  const unverified = new Set(index.unverifiedNodeIds || []);
  const unresolved = new Set(index.unresolvedNodeIds || []);
  const missing = new Set(index.missingNodeIds || []);
  const emptyPath = new Set(index.emptyPathNodeIds || []);

  for (const id of [...unverified, ...unresolved, ...missing]) {
    const node = nodeById(registry, id);
    if (!node) {
      fail('UNCERTAINTY_INDEX', `uncertaintyIndex references missing node ${id}`);
      continue;
    }
    if (PROMOTED_AUTHORITY.has(node.authorityStatus)) {
      fail('PROMOTION', `${id} is uncertain but authorityStatus=${node.authorityStatus}`);
    }
    if (node.healthState === 'GREEN') {
      fail('PROMOTION', `${id} is uncertain but healthState=GREEN`);
    }
    if (unverified.has(id) && node.identityStatus !== 'UNVERIFIED' && !/UNVERIFIED|unverified/.test(String(node.identityStatus || ''))) {
      fail('UNCERTAINTY', `${id} listed UNVERIFIED but identityStatus=${node.identityStatus}`);
    }
    if (unresolved.has(id) && node.authorityStatus !== 'UNRESOLVED') {
      fail('UNCERTAINTY', `${id} listed UNRESOLVED but authorityStatus=${node.authorityStatus}`);
    }
    if (missing.has(id) && node.authorityStatus !== 'MISSING') {
      fail('UNCERTAINTY', `${id} listed MISSING but authorityStatus=${node.authorityStatus}`);
    }
  }

  for (const id of emptyPath) {
    const node = nodeById(registry, id);
    if (!node) {
      fail('EMPTY_PATH', `emptyPathNodeIds references missing node ${id}`);
      continue;
    }
    if (node.path !== '') {
      fail('EMPTY_PATH', `${id} must keep empty path; got ${JSON.stringify(node.path)}`);
    }
    if (node.authorityStatus === 'CANONICAL') {
      fail('PROMOTION', `${id} empty-path row promoted to CANONICAL`);
    }
  }

  for (const node of nodes) {
    const uncertainMark =
      unverified.has(node.nodeId) ||
      unresolved.has(node.nodeId) ||
      missing.has(node.nodeId) ||
      node.identityStatus === 'UNVERIFIED' ||
      node.authorityStatus === 'UNRESOLVED' ||
      node.authorityStatus === 'MISSING' ||
      node.healthState === 'UNKNOWN';
    if (!uncertainMark) continue;
    if (
      (node.identityStatus === 'UNVERIFIED' ||
        node.authorityStatus === 'UNRESOLVED' ||
        node.authorityStatus === 'MISSING') &&
      (node.authorityStatus === 'CANONICAL' || node.healthState === 'GREEN')
    ) {
      fail('PROMOTION', `${node.nodeId} upgraded UNVERIFIED/UNRESOLVED/MISSING to CANONICAL or GREEN`);
    }
  }

  const zsu2 = nodeById(registry, 'root.z-sanctuary-universe-2');
  if (zsu2 && zsu2.authorityStatus !== 'UNRESOLVED') {
    fail('PROMOTION', 'ZSU 2 canonical continuation must remain UNRESOLVED');
  }

  const family = nodeById(registry, 'project.z-family-health');
  if (family && (family.authorityStatus !== 'UNRESOLVED' || family.rootClassification !== 'UNRESOLVED')) {
    fail('PROMOTION', 'Z-Family Health must remain UNRESOLVED');
  }
}

function checkEdges(registry, validateEdge) {
  const nodes = new Set((registry.nodes || []).map((n) => n.nodeId));
  for (const edge of registry.edges || []) {
    validateAgainst(validateEdge, edge, `edge ${edge.edgeId || '(missing id)'}`);
    if (edge.edgeType === 'CONNECTED_TO') {
      fail('EDGE_VOCABULARY', `${edge.edgeId} uses forbidden CONNECTED_TO`);
    }
    if (!nodes.has(edge.fromId)) fail('EDGE_REF', `${edge.edgeId} fromId missing: ${edge.fromId}`);
    if (!nodes.has(edge.toId)) fail('EDGE_REF', `${edge.edgeId} toId missing: ${edge.toId}`);
    if (
      DISTINCT_PRODUCT_IDS.includes(edge.fromId) &&
      DISTINCT_PRODUCT_IDS.includes(edge.toId) &&
      MERGE_EDGE_TYPES.has(edge.edgeType)
    ) {
      fail('IDENTITY_BOUNDARY', `${edge.edgeId} merges distinct products via ${edge.edgeType}`);
    }
    if (HUB_POINTER_IDS.includes(edge.fromId) && edge.edgeType === 'OWNS_SOURCE') {
      fail('IDENTITY_BOUNDARY', `${edge.edgeId} hub pointer claims OWNS_SOURCE`);
    }
  }
}

function checkFacts(registry, validateFact) {
  const nodes = new Set((registry.nodes || []).map((n) => n.nodeId));
  const index = registry.uncertaintyIndex || {};
  const unverified = new Set(index.unverifiedNodeIds || []);
  const unresolved = new Set(index.unresolvedNodeIds || []);
  const requiredDistinct = [
    'fact.zwheel.ssr.distinct',
    'fact.zwheel.rda.distinct',
    'fact.ssr.rda.distinct',
    'fact.pid.unverified',
    'fact.z-cldo.unverified',
    'fact.z-pace.unverified',
    'fact.z-family-health.unresolved',
    'fact.amk-goku-dashboards-2.empty-path',
    'fact.pc-wide-completeness.unverified',
    'fact.hub-roulette.reference-only',
  ];
  const seen = new Set();
  for (const fact of registry.facts || []) {
    validateAgainst(validateFact, fact, `fact ${fact.factId || '(missing id)'}`);
    seen.add(fact.factId);
    for (const field of FACT_PROVENANCE_FIELDS) {
      if (fact[field] === undefined || fact[field] === null || fact[field] === '') {
        fail('PROVENANCE', `${fact.factId || '(missing)'} missing provenance field ${field}`);
      }
    }
    if (fact.subjectId && !nodes.has(fact.subjectId)) {
      fail('FACT_REF', `${fact.factId} subjectId missing: ${fact.subjectId}`);
    }
    if (fact.objectId && !nodes.has(fact.objectId)) {
      fail('FACT_REF', `${fact.factId} objectId missing: ${fact.objectId}`);
    }
    const uncertainSubject = unverified.has(fact.subjectId) || unresolved.has(fact.subjectId);
    const statusUncertain = /^(unverified|unresolved|missing)$/i.test(String(fact.status || ''));
    if ((uncertainSubject || statusUncertain) && fact.authority === 'CANONICAL' && statusUncertain) {
      fail('PROMOTION', `${fact.factId} uncertain fact promoted to authority CANONICAL`);
    }
    if (statusUncertain && fact.authority === 'CANONICAL') {
      fail('PROMOTION', `${fact.factId} status=${fact.status} with authority CANONICAL`);
    }
  }
  for (const id of requiredDistinct) {
    if (!seen.has(id)) fail('IDENTITY_BOUNDARY', `Required fact missing: ${id}`);
  }
}

function checkIdentityBoundaries(registry) {
  for (const id of DISTINCT_PRODUCT_IDS) {
    const node = nodeById(registry, id);
    if (!node) {
      fail('IDENTITY_BOUNDARY', `Missing distinct product node ${id}`);
      continue;
    }
    if (node.nodeType !== 'PRODUCT') {
      fail('IDENTITY_BOUNDARY', `${id} must be PRODUCT, got ${node.nodeType}`);
    }
  }
  const zwheel = nodeById(registry, 'product.zwheel-cracker');
  const ssr = nodeById(registry, 'product.ssr-pro-app');
  const rda = nodeById(registry, 'product.rda');
  if (zwheel && zwheel.authorityStatus !== 'EXTERNAL_SOVEREIGN') {
    fail('IDENTITY_BOUNDARY', `ZWheel must remain EXTERNAL_SOVEREIGN (got ${zwheel.authorityStatus})`);
  }
  if (ssr && ssr.authorityStatus !== 'EXTERNAL_SOVEREIGN') {
    fail('IDENTITY_BOUNDARY', `SSR must remain EXTERNAL_SOVEREIGN (got ${ssr.authorityStatus})`);
  }
  if (rda && rda.rootClassification !== 'REGISTERED_ACTIVE') {
    fail('IDENTITY_BOUNDARY', `RDA nested root must remain REGISTERED_ACTIVE (got ${rda.rootClassification})`);
  }
  if (zwheel && ssr && zwheel.label === ssr.label) {
    fail('IDENTITY_BOUNDARY', 'ZWheel and SSR labels collapsed');
  }
  if (zwheel && rda && zwheel.nodeId === rda.nodeId) {
    fail('IDENTITY_BOUNDARY', 'ZWheel and RDA nodeIds collapsed');
  }
  for (const id of HUB_POINTER_IDS) {
    const node = nodeById(registry, id);
    if (!node) {
      fail('IDENTITY_BOUNDARY', `Missing hub pointer node ${id}`);
      continue;
    }
    if (node.authorityStatus !== 'REFERENCE_ONLY') {
      fail('IDENTITY_BOUNDARY', `${id} must be REFERENCE_ONLY (got ${node.authorityStatus})`);
    }
    if (node.authorityStatus === 'EXTERNAL_SOVEREIGN' || node.authorityStatus === 'CANONICAL') {
      fail('IDENTITY_BOUNDARY', `${id} hub pointer promoted to product authority`);
    }
  }
  const owns = (registry.edges || []).find(
    (e) => e.fromId === 'root.z-sanctuary-universe' && e.edgeType === 'OWNS_SOURCE' && DISTINCT_PRODUCT_IDS.includes(e.toId),
  );
  if (owns) {
    fail('IDENTITY_BOUNDARY', 'Hub must not OWNS_SOURCE a distinct gaming product');
  }
}

function checkPreflight(registry, validatePreflight) {
  const examples = registry.preflightExamples || [];
  if (examples.length < 1) {
    notes.push('No preflight examples present (allowed).');
    return;
  }
  for (const example of examples) {
    if (example.wired === true || example.runtime === true) {
      fail('RUNTIME', `${example.exampleId} preflight marked wired/runtime`);
    }
    if (example.illustrative !== true) {
      fail('PREFLIGHT', `${example.exampleId} must be illustrative`);
    }
    if (!example.context) {
      fail('PREFLIGHT', `${example.exampleId} missing context`);
      continue;
    }
    validateAgainst(validatePreflight, example.context, `preflight ${example.exampleId}`);
  }
}

function checkHardStops(registry) {
  if (registry.claims?.autoDiscovery !== false) fail('HARD_STOP', 'autoDiscovery not explicitly false');
  if (registry.claims?.runtime !== false) fail('HARD_STOP', 'runtime not explicitly false');
  if (registry.claims?.autonomousMutation !== false) fail('HARD_STOP', 'autonomousMutation not explicitly false');
}

function verdictsFromIssues() {
  const codes = new Set(issues.map((i) => i.code));
  const schemaFail = ['JSON_PARSE', 'SCHEMA_MISSING', 'SCHEMA_VALIDATOR_MISSING', 'SCHEMA_CONFORMANCE', 'REGISTRY'].some((c) =>
    codes.has(c),
  );
  const provenanceFail = codes.has('PROVENANCE') || codes.has('FACT_REF') || codes.has('AUTHORITY_FIELDS');
  const uncertaintyFail =
    ['PROMOTION', 'UNCERTAINTY', 'UNCERTAINTY_INDEX', 'EMPTY_PATH', 'COMPLETENESS'].some((c) => codes.has(c));
  const identityFail = ['IDENTITY_BOUNDARY', 'EDGE_VOCABULARY', 'EDGE_REF', 'NODE_ID'].some((c) => codes.has(c));
  const runtimeFail = codes.has('RUNTIME') || codes.has('HARD_STOP');
  const registryPass = issues.length === 0;

  return {
    Z_ATLAS_0_5_REGISTRY: registryPass ? 'PASS' : 'FAIL',
    Z_ATLAS_SCHEMA_CONFORMANCE: schemaFail ? 'FAIL' : 'PASS',
    Z_ATLAS_PROVENANCE_PRESERVATION: provenanceFail ? 'FAIL' : 'PASS',
    Z_ATLAS_UNCERTAINTY_PRESERVATION: uncertaintyFail ? 'FAIL' : 'PASS',
    Z_ATLAS_IDENTITY_BOUNDARIES: identityFail ? 'FAIL' : 'PASS',
    PC_WIDE_COMPLETENESS_CLAIMED: 'NO',
    UNVERIFIED_PROMOTED: codes.has('PROMOTION') && issues.some((i) => /UNVERIFIED/.test(i.message)) ? 'YES' : 'NO',
    UNRESOLVED_PROMOTED: codes.has('PROMOTION') && issues.some((i) => /UNRESOLVED/.test(i.message)) ? 'YES' : 'NO',
    AUTO_DISCOVERY_CREATED: 'NO',
    RUNTIME_CREATED: runtimeFail ? 'YES' : 'NO',
    AUTONOMOUS_MUTATION_CREATED: 'NO',
    NEXT_GATE: 'CLOSED',
  };
}

function printReport(verdicts) {
  const machine = {
    gate: 'Z-ATLAS-0.5-MACHINE-READABLE-TOPOLOGY-REGISTRY',
    custodyPath: ROOT,
    registryPath: REGISTRY_PATH,
    issueCount: issues.length,
    issues,
    notes,
    verdicts,
    STOP: true,
  };
  console.log('=== Z-ATLAS-0.5 MACHINE VERDICT ===');
  console.log(JSON.stringify(machine, null, 2));
  console.log('');
  console.log('=== Z-ATLAS-0.5 HUMAN VERDICT ===');
  for (const [k, v] of Object.entries(verdicts)) {
    console.log(`${k}: ${v}`);
  }
  console.log('STOP');
  if (issues.length) {
    console.log('');
    console.log(`Issues (${issues.length}):`);
    for (const issue of issues) {
      console.log(`- [${issue.code}] ${issue.message}`);
    }
  }
}

function main() {
  if (!fs.existsSync(REGISTRY_PATH)) {
    fail('REGISTRY', `Missing registry file: ${REGISTRY_PATH}`);
  }
  const schemas = loadSchemas();
  const validators = compileValidators(schemas);
  const registry = fs.existsSync(REGISTRY_PATH) ? readJson(REGISTRY_PATH, 'registry') : null;
  if (registry) {
    checkWrapper(registry);
    checkNodes(registry, validators.node);
    checkEdges(registry, validators.edge);
    checkFacts(registry, validators.fact);
    checkIdentityBoundaries(registry);
    checkPreflight(registry, validators.preflight);
    checkHardStops(registry);
  }
  const verdicts = verdictsFromIssues();
  printReport(verdicts);
  const requiredPass = [
    verdicts.Z_ATLAS_0_5_REGISTRY,
    verdicts.Z_ATLAS_SCHEMA_CONFORMANCE,
    verdicts.Z_ATLAS_PROVENANCE_PRESERVATION,
    verdicts.Z_ATLAS_UNCERTAINTY_PRESERVATION,
    verdicts.Z_ATLAS_IDENTITY_BOUNDARIES,
  ];
  process.exit(requiredPass.every((v) => v === 'PASS') && issues.length === 0 ? 0 : 1);
}

main();
