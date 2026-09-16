#!/usr/bin/env node
/**
 * Z-SEIF-1-READ-ONLY-OBSERVER-THIN-SLICE-1
 * Local-first Z-Sanctuary self-observation. No registry, schema, persistence,
 * Cloudflare API, or product-tree reads. GitHub GET is opt-in via --github-public.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parseObserveArgs, readGithubPublicEvidence } from './z_seif_github_public_evidence.mjs';

export const EVIDENCE_CLASS = Object.freeze({
  CANONICAL_AUTHORITY: 'CANONICAL_AUTHORITY',
  OBSERVED_PROVIDER_EVIDENCE: 'OBSERVED_PROVIDER_EVIDENCE',
  LOCAL_RECEIPT_EVIDENCE: 'LOCAL_RECEIPT_EVIDENCE',
  HISTORICAL_REFERENCE: 'HISTORICAL_REFERENCE',
  UNKNOWN: 'UNKNOWN',
  CONFLICT: 'CONFLICT',
});

export const COMPARE = Object.freeze({
  MATCH: 'MATCH',
  UNKNOWN: 'UNKNOWN',
  CONFLICT: 'CONFLICT',
  NOT_APPLICABLE: 'NOT_APPLICABLE',
});

const HUB_NODE_ID = 'root.z-sanctuary-universe';
const HUB_PC_ROOT_ID = 'z-sanctuary-universe';
const HUB_REPO_ROLES = new Set(['hub', 'sanctuary_hub', 'canonical_hub', 'z_sanctuary_universe']);
const SECRETISH = /(ghp_|gho_|github_pat_|sk-|CLOUDFLARE_API|BEGIN [A-Z ]*PRIVATE KEY)/i;

function readJsonSafe(absPath) {
  try {
    if (!fs.existsSync(absPath)) return { ok: false, missing: true, data: null };
    return { ok: true, missing: false, data: JSON.parse(fs.readFileSync(absPath, 'utf8')) };
  } catch (err) {
    return { ok: false, missing: false, data: null, error: String(err?.message || err) };
  }
}

function git(cwd, args) {
  const r = spawnSync('git', args, {
    cwd,
    encoding: 'utf8',
    maxBuffer: 2 * 1024 * 1024,
    windowsHide: true,
  });
  if (r.error || r.status !== 0) {
    return { ok: false, out: '', err: (r.stderr || r.error?.message || 'git failed').trim() };
  }
  return { ok: true, out: (r.stdout || '').trim(), err: '' };
}

export function normalizeRepoSlug(value) {
  if (!value || typeof value !== 'string') return '';
  let s = value.trim();
  s = s.replace(/^git@github\.com:/i, '');
  s = s.replace(/^https?:\/\/github\.com\//i, '');
  s = s.replace(/^ssh:\/\/git@github\.com\//i, '');
  s = s.replace(/\.git$/i, '');
  s = s.replace(/\/+$/, '');
  return s.toLowerCase();
}

function discoverHubRoot(startDir) {
  let dir = path.resolve(startDir);
  for (let i = 0; i < 12; i += 1) {
    const pkg = path.join(dir, 'package.json');
    const atlas = path.join(dir, 'data', 'z_atlas', 'z_atlas_registry_v0_5.json');
    if (fs.existsSync(pkg) && fs.existsSync(atlas)) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return path.resolve(startDir);
}

function loadCanonicalIdentity(hubRoot) {
  const atlasPath = path.join(hubRoot, 'data', 'z_atlas', 'z_atlas_registry_v0_5.json');
  const atlasRead = readJsonSafe(atlasPath);
  if (!atlasRead.ok) {
    return {
      ok: false,
      parseFailed: !atlasRead.missing,
      missingAtlas: atlasRead.missing,
      identity: 'UNKNOWN',
      identitySource: 'UNKNOWN',
      evidenceClass: EVIDENCE_CLASS.UNKNOWN,
      gateState: 'UNKNOWN',
      healthState: 'UNKNOWN',
      deploymentState: 'UNKNOWN',
      signals: ['IDENTITY_CONFLICT'],
      error: atlasRead.missing
        ? 'missing data/z_atlas/z_atlas_registry_v0_5.json'
        : atlasRead.error || 'atlas parse failed',
    };
  }

  const nodes = Array.isArray(atlasRead.data?.nodes) ? atlasRead.data.nodes : [];
  const hubNode = nodes.find((n) => n && n.nodeId === HUB_NODE_ID);
  if (!hubNode) {
    return {
      ok: false,
      parseFailed: false,
      missingAtlas: false,
      identity: 'UNKNOWN',
      identitySource: 'Z-Atlas registry v0.5 (hub node absent)',
      evidenceClass: EVIDENCE_CLASS.UNKNOWN,
      gateState: 'UNKNOWN',
      healthState: 'UNKNOWN',
      deploymentState: 'UNKNOWN',
      signals: ['IDENTITY_CONFLICT'],
      error: `Atlas node ${HUB_NODE_ID} not found`,
    };
  }

  const pcRootPath = path.join(hubRoot, 'data', 'z_pc_root_projects.json');
  const pcRoot = readJsonSafe(pcRootPath);
  const pcMatch =
    pcRoot.ok && Array.isArray(pcRoot.data?.projects)
      ? pcRoot.data.projects.find((p) => p && p.id === HUB_PC_ROOT_ID)
      : null;

  const sourceParts = ['Z-Atlas registry v0.5'];
  if (pcMatch) sourceParts.push('data/z_pc_root_projects.json (supplemental)');

  return {
    ok: true,
    parseFailed: false,
    missingAtlas: false,
    identity: hubNode.label || HUB_NODE_ID,
    nodeId: HUB_NODE_ID,
    identitySource: sourceParts.join('; '),
    evidenceClass: EVIDENCE_CLASS.CANONICAL_AUTHORITY,
    gateState: hubNode.gateState || 'UNKNOWN',
    healthState: hubNode.healthState || 'UNKNOWN',
    deploymentState: hubNode.deploymentState || 'UNKNOWN',
    environment: hubNode.environment || 'UNKNOWN',
    signals: [],
    atlas: atlasRead.data,
    pcMatch: Boolean(pcMatch),
  };
}

function resolveExpectedRepository(hubRoot, identity, atlas) {
  const ghPath = path.join(hubRoot, 'data', 'z_ecosystem_github_identity.json');
  const gh = readJsonSafe(ghPath);
  if (gh.ok && Array.isArray(gh.data?.ecosystem_repos)) {
    const hubRepo = gh.data.ecosystem_repos.find((row) => {
      const role = String(row?.role || '').toLowerCase();
      return HUB_REPO_ROLES.has(role) && row.full_name;
    });
    if (hubRepo?.full_name) {
      return {
        slug: normalizeRepoSlug(hubRepo.full_name),
        display: String(hubRepo.full_name),
        source: 'data/z_ecosystem_github_identity.json',
        evidenceClass: EVIDENCE_CLASS.CANONICAL_AUTHORITY,
      };
    }
  }

  const nodes = Array.isArray(atlas?.nodes) ? atlas.nodes : [];
  const edges = Array.isArray(atlas?.edges) ? atlas.edges : [];
  const repoNodes = nodes.filter((n) => n && n.nodeType === 'REPOSITORY');
  const linked = repoNodes.find((n) =>
    edges.some(
      (e) =>
        (e.fromId === identity.nodeId && e.toId === n.nodeId) ||
        (e.toId === identity.nodeId && e.fromId === n.nodeId)
    )
  );
  const linkedSlug = normalizeRepoSlug(linked?.label || linked?.path || '');
  if (linked && linkedSlug.includes('/')) {
    return {
      slug: linkedSlug,
      display: linked.label || linkedSlug,
      source: 'Z-Atlas REPOSITORY node',
      evidenceClass: EVIDENCE_CLASS.CANONICAL_AUTHORITY,
    };
  }

  return {
    slug: '',
    display: 'UNKNOWN',
    source: 'UNKNOWN',
    evidenceClass: EVIDENCE_CLASS.UNKNOWN,
  };
}

function readLocalGit(hubRoot) {
  const origin = git(hubRoot, ['remote', 'get-url', 'origin']);
  const branch = git(hubRoot, ['rev-parse', '--abbrev-ref', 'HEAD']);
  const head = git(hubRoot, ['rev-parse', 'HEAD']);
  const porcelain = git(hubRoot, ['status', '--porcelain']);
  return {
    originRemote: origin.ok ? origin.out : 'UNKNOWN',
    originOk: origin.ok,
    branch: branch.ok ? branch.out : 'UNKNOWN',
    head: head.ok ? head.out : 'UNKNOWN',
    porcelain: porcelain.ok ? porcelain.out : '',
    evidenceClass: EVIDENCE_CLASS.OBSERVED_PROVIDER_EVIDENCE,
  };
}

function compareRepositories(expectedSlug, observedOrigin) {
  if (!expectedSlug) {
    return { match: COMPARE.UNKNOWN, signal: null };
  }
  const observed = normalizeRepoSlug(observedOrigin);
  if (!observed) {
    return { match: COMPARE.UNKNOWN, signal: 'PROVIDER_STATE_UNKNOWN' };
  }
  if (observed === expectedSlug) {
    return { match: COMPARE.MATCH, signal: null };
  }
  return { match: COMPARE.CONFLICT, signal: 'REPOSITORY_MISMATCH' };
}

function readProvenance(hubRoot) {
  const manifestPath = path.join(hubRoot, 'config', 'provenance_manifest.json');
  const manifest = readJsonSafe(manifestPath);
  if (manifest.missing) {
    return { status: 'UNKNOWN', detail: 'provenance_manifest absent', evidenceClass: EVIDENCE_CLASS.UNKNOWN };
  }
  if (!manifest.ok) {
    return { status: 'UNKNOWN', detail: 'provenance_manifest unreadable', evidenceClass: EVIDENCE_CLASS.UNKNOWN };
  }
  const entries = Array.isArray(manifest.data?.entries) ? manifest.data.entries : [];
  if (entries.length === 0) {
    return { status: 'UNKNOWN', detail: 'provenance_manifest empty', evidenceClass: EVIDENCE_CLASS.UNKNOWN };
  }
  let failed = 0;
  for (const entry of entries) {
    const rel = entry?.path;
    if (!rel) {
      failed += 1;
      continue;
    }
    const full = path.join(hubRoot, rel);
    if (!fs.existsSync(full)) {
      failed += 1;
      continue;
    }
    const actual = createHash('sha256').update(fs.readFileSync(full)).digest('hex');
    if (actual !== entry.sha256) failed += 1;
  }
  return {
    status: failed === 0 ? 'PASS' : 'FAIL',
    detail: `${entries.length - failed}/${entries.length} hashes match (in-memory; no report written)`,
    evidenceClass: EVIDENCE_CLASS.LOCAL_RECEIPT_EVIDENCE,
  };
}

function readReceipts(hubRoot) {
  const dir = path.join(hubRoot, 'docs', 'z_seif');
  if (!fs.existsSync(dir)) {
    return { status: 'UNKNOWN', refs: [], evidenceClass: EVIDENCE_CLASS.UNKNOWN };
  }
  const refs = fs
    .readdirSync(dir)
    .filter((name) => /RECEIPT/i.test(name) && name.endsWith('.md'))
    .sort();
  if (refs.length === 0) {
    return { status: 'UNKNOWN', refs: [], evidenceClass: EVIDENCE_CLASS.UNKNOWN };
  }
  return {
    status: `${refs.length} discovered`,
    refs: refs.map((name) => `docs/z_seif/${name}`),
    evidenceClass: EVIDENCE_CLASS.LOCAL_RECEIPT_EVIDENCE,
  };
}

function readProductionAuthority(hubRoot) {
  const receiptPath = path.join(hubRoot, 'docs', 'z_seif', 'Z_SEIF_PHASE_0_RECEIPT.md');
  if (!fs.existsSync(receiptPath)) return 'UNKNOWN';
  const text = fs.readFileSync(receiptPath, 'utf8');
  if (/PRODUCTION_AUTHORITY:\s*NONE/.test(text)) return 'NONE';
  return 'UNKNOWN';
}

function readCloudflareThinSlice(hubRoot) {
  const contingencyPath = path.join(hubRoot, 'data', 'z_cloudflare_contingency_identity.json');
  const present = fs.existsSync(contingencyPath);
  return {
    runtime: COMPARE.UNKNOWN,
    evidence: 'LIVE_READ_NOT_AUTHORIZED_IN_THIS_SLICE',
    historical: present ? 'CONTINGENCY_IDENTITY present (HISTORICAL_REFERENCE only; not runtime proof)' : 'CONTINGENCY_IDENTITY absent',
    evidenceClass: EVIDENCE_CLASS.UNKNOWN,
  };
}

function containsSecretish(text) {
  return SECRETISH.test(text);
}

export function formatReport(result) {
  const conflicts = result.conflicts.length ? result.conflicts.join('; ') : 'NONE';
  const unknowns = result.unknownItems.length ? result.unknownItems.join('; ') : 'NONE';
  const signals = result.signals.length ? result.signals.join(', ') : 'NONE';
  return [
    'Z-SEIF PHASE 1 READ-ONLY OBSERVER',
    '---------------------------------',
    '',
    `PROJECT_IDENTITY: ${result.projectIdentity}`,
    `IDENTITY_SOURCE: ${result.identitySource}`,
    '',
    `LOCAL_REPOSITORY: ${result.localRepository}`,
    `LOCAL_BRANCH: ${result.localBranch}`,
    `LOCAL_HEAD: ${result.localHead}`,
    `ORIGIN_REMOTE: ${result.originRemote}`,
    '',
    `EXPECTED_REPOSITORY: ${result.expectedRepository}`,
    `REPOSITORY_MATCH: ${result.repositoryMatch}`,
    `LOCAL_REMOTE_PROVIDER_CONSISTENCY: ${result.localRemoteProviderConsistency}`,
    '',
    `GITHUB_API_READ: ${result.githubApiRead}`,
    `GITHUB_AUTH_MODE: ${result.githubAuthMode}`,
    `GITHUB_PROBE_TARGET: ${result.githubProbeTarget}`,
    `OBSERVED_GITHUB_REPOSITORY: ${result.observedGithubRepository}`,
    `OBSERVED_GITHUB_VISIBILITY: ${result.observedGithubVisibility}`,
    `OBSERVED_GITHUB_ARCHIVED: ${result.observedGithubArchived}`,
    `OBSERVED_DEFAULT_BRANCH: ${result.observedDefaultBranch}`,
    `OBSERVED_REMOTE_BRANCH_SHA: ${result.observedRemoteBranchSha}`,
    `OBSERVED_LOCAL_HEAD_REMOTE_EXISTENCE: ${result.observedLocalHeadRemoteExistence}`,
    `OBSERVED_REMOTE_COMMIT_SHA: ${result.observedRemoteCommitSha}`,
    `OBSERVED_WORKFLOW_RUNS: ${result.observedWorkflowRuns}`,
    `OBSERVED_WORKFLOW_STATE: ${result.observedWorkflowState}`,
    `GITHUB_RATE_LIMIT_REMAINING: ${result.githubRateLimitRemaining}`,
    `GITHUB_OBSERVED_AT: ${result.githubObservedAt}`,
    '',
    `ATLAS_GATE_STATE: ${result.atlasGateState}`,
    `ATLAS_HEALTH_STATE: ${result.atlasHealthState}`,
    `ATLAS_DEPLOYMENT_STATE: ${result.atlasDeploymentState}`,
    '',
    `PROVENANCE: ${result.provenance}`,
    `RECEIPT_EVIDENCE: ${result.receiptEvidence}`,
    '',
    `CLOUDFLARE_RUNTIME: ${result.cloudflareRuntime}`,
    `CLOUDFLARE_EVIDENCE: ${result.cloudflareEvidence}`,
    '',
    `PRODUCTION_AUTHORITY: ${result.productionAuthority}`,
    '',
    `CONFLICTS: ${conflicts}`,
    `UNKNOWN_ITEMS: ${unknowns}`,
    `SIGNALS: ${signals}`,
    `OBSERVED_AT: ${result.observedAt}`,
    '',
  ].join('\n');
}

export async function observe(options = {}) {
  const hubRoot = path.resolve(options.hubRoot || discoverHubRoot(process.cwd()));
  const observedAt = options.observedAt || new Date().toISOString();
  const githubPublic = Boolean(options.githubPublic);
  const signals = [];
  const conflicts = [];
  const unknownItems = [];

  const universeRegistry = path.join(hubRoot, 'data', 'z_universe_project_registry.json');
  if (fs.existsSync(universeRegistry)) {
    unknownItems.push('data/z_universe_project_registry.json unexpectedly present; still unused');
  }

  const identity = loadCanonicalIdentity(hubRoot);
  if (identity.signals) signals.push(...identity.signals);

  const gitEv = options.git || readLocalGit(hubRoot);
  const expected = options.expectedRepository
    ? {
        slug: normalizeRepoSlug(options.expectedRepository),
        display: options.expectedRepository,
        source: 'test override',
        evidenceClass: EVIDENCE_CLASS.CANONICAL_AUTHORITY,
      }
    : resolveExpectedRepository(hubRoot, identity, identity.atlas);
  const originRemote = options.originRemote || gitEv.originRemote;
  const cmp = compareRepositories(expected.slug, originRemote);
  if (cmp.signal) signals.push(cmp.signal);

  if (cmp.match === COMPARE.CONFLICT) {
    conflicts.push(`expected ${expected.display} vs observed origin`);
  }
  if (!expected.slug) unknownItems.push('EXPECTED_REPOSITORY');
  if (identity.deploymentState === 'UNKNOWN') unknownItems.push('ATLAS_DEPLOYMENT_STATE');
  if (!identity.ok) unknownItems.push('PROJECT_IDENTITY');

  const provenance = readProvenance(hubRoot);
  const receipts = readReceipts(hubRoot);
  if (provenance.status === 'UNKNOWN') unknownItems.push('PROVENANCE');
  if (receipts.status === 'UNKNOWN') unknownItems.push('RECEIPT_EVIDENCE');

  const cf = readCloudflareThinSlice(hubRoot);
  unknownItems.push('CLOUDFLARE_RUNTIME');
  signals.push('PROVIDER_STATE_UNKNOWN');

  const productionAuthority = readProductionAuthority(hubRoot);
  if (productionAuthority === 'UNKNOWN') unknownItems.push('PRODUCTION_AUTHORITY');

  let github = {
    githubApiRead: 'NOT_ATTEMPTED',
    githubAuthMode: 'PUBLIC_UNAUTHENTICATED_GET',
    githubProbeTarget: 'ManojK626/z-sanctuary-universe',
    observedGithubRepository: 'UNKNOWN',
    observedGithubVisibility: 'UNKNOWN',
    observedGithubArchived: 'UNKNOWN',
    observedDefaultBranch: 'UNKNOWN',
    observedRemoteBranchSha: 'UNKNOWN',
    observedLocalHeadRemoteExistence: 'UNKNOWN',
    observedRemoteCommitSha: 'UNKNOWN',
    observedWorkflowRuns: 'UNKNOWN',
    observedWorkflowState: 'UNKNOWN',
    githubObservedAt: 'NOT_ATTEMPTED',
    githubRateLimitRemaining: 'UNKNOWN',
    githubReason: 'NOT_ATTEMPTED',
    githubAuthorityClass: 'OBSERVED_PROVIDER_EVIDENCE',
    localRemoteProviderConsistency: 'UNKNOWN',
    parseFailed: false,
    requests: [],
    signal: null,
  };
  if (githubPublic) {
    github = await readGithubPublicEvidence({
      originRemote,
      localHead: gitEv.head,
      fetchImpl: options.fetchImpl || globalThis.fetch,
      observedAt,
    });
    if (github.signal) signals.push(github.signal);
    if (github.githubApiRead === 'UNAVAILABLE' || github.githubReason === 'NOT_FOUND_OR_NOT_VISIBLE') {
      unknownItems.push('GITHUB_PROVIDER_STATE');
    }
  }

  const uniqueSignals = [...new Set(signals)];
  const uniqueUnknown = [...new Set(unknownItems)];
  const uniqueConflicts = [...new Set(conflicts)];

  const result = {
    ok: !identity.parseFailed && !identity.missingAtlas && !github.parseFailed,
    projectIdentity: identity.identity,
    identitySource: identity.identitySource,
    localRepository: path.basename(hubRoot),
    localRepositoryPath: hubRoot,
    localBranch: gitEv.branch,
    localHead: gitEv.head,
    originRemote,
    expectedRepository: expected.display,
    expectedRepositorySource: expected.source,
    repositoryMatch: cmp.match,
    atlasGateState: identity.gateState,
    atlasHealthState: identity.healthState,
    atlasDeploymentState: identity.deploymentState,
    provenance: `${provenance.status} — ${provenance.detail}`,
    receiptEvidence: receipts.refs.length ? receipts.refs.join(', ') : receipts.status,
    cloudflareRuntime: cf.runtime,
    cloudflareEvidence: cf.evidence,
    cloudflareHistorical: cf.historical,
    productionAuthority,
    conflicts: uniqueConflicts,
    unknownItems: uniqueUnknown,
    signals: uniqueSignals,
    observedAt,
    universeRegistryUsed: false,
    cloudflareLiveRead: 'NOT_ATTEMPTED',
    githubLiveApi: github.githubApiRead,
    githubApiRead: github.githubApiRead,
    githubAuthMode: github.githubAuthMode,
    githubProbeTarget: github.githubProbeTarget,
    observedGithubRepository: github.observedGithubRepository,
    observedGithubVisibility: github.observedGithubVisibility,
    observedGithubArchived: github.observedGithubArchived,
    observedDefaultBranch: github.observedDefaultBranch,
    observedRemoteBranchSha: github.observedRemoteBranchSha,
    observedLocalHeadRemoteExistence: github.observedLocalHeadRemoteExistence,
    observedRemoteCommitSha: github.observedRemoteCommitSha,
    observedWorkflowRuns: github.observedWorkflowRuns,
    observedWorkflowState: github.observedWorkflowState,
    githubObservedAt: github.githubObservedAt,
    githubRateLimitRemaining: github.githubRateLimitRemaining,
    githubReason: github.githubReason || 'NONE',
    githubAuthorityClass: github.githubAuthorityClass,
    localRemoteProviderConsistency: github.localRemoteProviderConsistency,
    githubRequests: github.requests || [],
  };

  const report = formatReport(result);
  if (containsSecretish(report)) {
    result.ok = false;
    result.secretLeak = true;
  }
  result.report = report;
  return result;
}

function invokedDirectly() {
  const self = fileURLToPath(import.meta.url);
  const argv1 = process.argv[1] ? path.resolve(process.argv[1]) : '';
  return argv1 && path.normalize(self.toLowerCase()) === path.normalize(argv1.toLowerCase());
}

if (invokedDirectly()) {
  const flags = parseObserveArgs(process.argv.slice(2));
  const result = await observe({ githubPublic: flags.githubPublic });
  process.stdout.write(`${result.report}\n`);
  process.exit(result.ok ? 0 : 1);
}
