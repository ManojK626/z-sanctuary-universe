/**
 * Z-SEIF-1 Thin Slice 2 — public unauthenticated GitHub GET evidence.
 * Allowlisted target only. No auth, persistence, or identity promotion.
 */

function normalizeRepoSlug(value) {
  if (!value || typeof value !== 'string') return '';
  let s = value.trim();
  s = s.replace(/^git@github\.com:/i, '');
  s = s.replace(/^https?:\/\/github\.com\//i, '');
  s = s.replace(/^ssh:\/\/git@github\.com\//i, '');
  s = s.replace(/\.git$/i, '');
  s = s.replace(/\/+$/, '');
  return s.toLowerCase();
}

export const PUBLIC_HUB_ALLOWLIST = 'ManojK626/z-sanctuary-universe';
export const PUBLIC_HUB_ALLOWLIST_SLUG = 'manojk626/z-sanctuary-universe';
export const GITHUB_USER_AGENT = 'Z-SEIF-1-read-only-observer (public GET; no auth)';
export const GITHUB_ACCEPT = 'application/vnd.github+json';

const API_ROOT = 'https://api.github.com';

function notAttempted(extra = {}) {
  return {
    githubApiRead: 'NOT_ATTEMPTED',
    githubAuthMode: 'PUBLIC_UNAUTHENTICATED_GET',
    githubProbeTarget: PUBLIC_HUB_ALLOWLIST,
    observedGithubRepository: 'UNKNOWN',
    observedGithubVisibility: 'UNKNOWN',
    observedGithubArchived: 'UNKNOWN',
    observedDefaultBranch: 'UNKNOWN',
    observedRemoteBranchSha: 'UNKNOWN',
    observedLocalHeadRemoteExistence: 'UNKNOWN',
    observedRemoteCommitSha: 'UNKNOWN',
    observedWorkflowRuns: 'UNKNOWN',
    observedWorkflowState: 'UNKNOWN',
    githubObservedAt: 'UNKNOWN',
    githubRateLimitRemaining: 'UNKNOWN',
    githubReason: extra.reason || 'NOT_ATTEMPTED',
    githubAuthorityClass: 'OBSERVED_PROVIDER_EVIDENCE',
    localRemoteProviderConsistency: extra.consistency || 'UNKNOWN',
    requests: extra.requests || [],
    signal: extra.signal || null,
    ...extra,
  };
}

export function originMatchesAllowlist(originRemote) {
  const slug = normalizeRepoSlug(originRemote);
  return Boolean(slug) && slug === PUBLIC_HUB_ALLOWLIST_SLUG;
}

async function githubGet(path, { fetchImpl, timeoutMs, requests }) {
  const url = `${API_ROOT}${path}`;
  const headers = {
    Accept: GITHUB_ACCEPT,
    'User-Agent': GITHUB_USER_AGENT,
  };
  const record = { method: 'GET', url, headerNames: Object.keys(headers).sort() };
  requests.push(record);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetchImpl(url, {
      method: 'GET',
      headers,
      signal: controller.signal,
    });
    const remaining = res.headers?.get?.('x-ratelimit-remaining') ?? res.headers?.get?.('X-RateLimit-Remaining') ?? 'UNKNOWN';
    let data = null;
    let parseError = false;
    const text = typeof res.text === 'function' ? await res.text() : '';
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        parseError = true;
      }
    }
    record.status = res.status;
    return { status: res.status, data, remaining, parseError };
  } catch (err) {
    record.error = String(err?.name || err?.message || err);
    return { networkError: true, error: record.error, remaining: 'UNKNOWN' };
  } finally {
    clearTimeout(timer);
  }
}

function classifyHttpFailure(status) {
  if (status === 403 || status === 429) {
    return { githubApiRead: 'UNAVAILABLE', githubReason: 'ACCESS_OR_RATE_LIMIT', githubProviderState: 'UNKNOWN' };
  }
  if (status === 404) {
    return { githubApiRead: 'AVAILABLE', githubReason: 'NOT_FOUND_OR_NOT_VISIBLE', githubProviderState: 'UNKNOWN' };
  }
  return { githubApiRead: 'UNAVAILABLE', githubReason: 'PROVIDER_STATE_UNKNOWN', githubProviderState: 'UNKNOWN' };
}

export async function readGithubPublicEvidence({
  originRemote,
  localHead,
  fetchImpl = globalThis.fetch,
  timeoutMs = 15000,
  observedAt,
} = {}) {
  const requests = [];
  if (!originMatchesAllowlist(originRemote)) {
    return notAttempted({
      reason: 'ORIGIN_NOT_ALLOWLISTED',
      signal: 'REPOSITORY_MISMATCH',
      consistency: 'UNKNOWN',
      requests,
    });
  }

  const ownerRepo = PUBLIC_HUB_ALLOWLIST;
  const githubObservedAt = observedAt || new Date().toISOString();
  const out = {
    githubApiRead: 'AVAILABLE',
    githubAuthMode: 'PUBLIC_UNAUTHENTICATED_GET',
    githubProbeTarget: ownerRepo,
    observedGithubRepository: 'UNKNOWN',
    observedGithubVisibility: 'UNKNOWN',
    observedGithubArchived: 'UNKNOWN',
    observedDefaultBranch: 'UNKNOWN',
    observedRemoteBranchSha: 'UNKNOWN',
    observedLocalHeadRemoteExistence: 'UNKNOWN',
    observedRemoteCommitSha: 'UNKNOWN',
    observedWorkflowRuns: 'UNKNOWN',
    observedWorkflowState: 'UNKNOWN',
    githubObservedAt,
    githubRateLimitRemaining: 'UNKNOWN',
    githubReason: '',
    githubAuthorityClass: 'OBSERVED_PROVIDER_EVIDENCE',
    localRemoteProviderConsistency: 'UNKNOWN',
    githubProviderState: 'UNKNOWN',
    parseFailed: false,
    requests,
    signal: null,
  };

  const repoRes = await githubGet(`/repos/${ownerRepo}`, { fetchImpl, timeoutMs, requests });
  if (repoRes.networkError) {
    return {
      ...out,
      githubApiRead: 'UNAVAILABLE',
      githubReason: 'NETWORK_UNAVAILABLE',
      githubProviderState: 'UNKNOWN',
      signal: 'PROVIDER_STATE_UNKNOWN',
    };
  }
  if (repoRes.parseError) {
    return { ...out, parseFailed: true, githubApiRead: 'UNAVAILABLE', githubReason: 'MALFORMED_RESPONSE' };
  }
  out.githubRateLimitRemaining = repoRes.remaining;
  if (repoRes.status !== 200) {
    const fail = classifyHttpFailure(repoRes.status);
    return { ...out, ...fail, signal: 'PROVIDER_STATE_UNKNOWN' };
  }

  const repo = repoRes.data || {};
  out.observedGithubRepository = repo.full_name || 'UNKNOWN';
  out.observedGithubVisibility = repo.private === true ? 'PRIVATE' : repo.private === false ? 'PUBLIC' : 'UNKNOWN';
  out.observedGithubArchived = repo.archived === true ? 'YES' : repo.archived === false ? 'NO' : 'UNKNOWN';
  out.observedDefaultBranch = repo.default_branch || 'UNKNOWN';
  if (normalizeRepoSlug(out.observedGithubRepository) === PUBLIC_HUB_ALLOWLIST_SLUG) {
    out.localRemoteProviderConsistency = 'MATCH';
  } else if (out.observedGithubRepository !== 'UNKNOWN') {
    out.localRemoteProviderConsistency = 'CONFLICT';
  }

  const branchName = out.observedDefaultBranch !== 'UNKNOWN' ? out.observedDefaultBranch : 'main';
  const branchRes = await githubGet(`/repos/${ownerRepo}/branches/${encodeURIComponent(branchName)}`, {
    fetchImpl,
    timeoutMs,
    requests,
  });
  if (branchRes.networkError) {
    out.githubApiRead = 'UNAVAILABLE';
    out.signal = 'PROVIDER_STATE_UNKNOWN';
    out.githubReason = 'NETWORK_UNAVAILABLE';
    return out;
  }
  if (branchRes.parseError) {
    out.parseFailed = true;
    out.githubReason = 'MALFORMED_RESPONSE';
    return out;
  }
  out.githubRateLimitRemaining = branchRes.remaining;
  if (branchRes.status === 200) {
    out.observedRemoteBranchSha = branchRes.data?.commit?.sha || 'UNKNOWN';
  } else {
    const fail = classifyHttpFailure(branchRes.status);
    out.githubReason = fail.githubReason;
    out.githubProviderState = fail.githubProviderState;
    if (fail.githubApiRead === 'UNAVAILABLE') out.githubApiRead = 'UNAVAILABLE';
  }

  const sha = localHead && localHead !== 'UNKNOWN' ? localHead : '';
  if (sha) {
    const commitRes = await githubGet(`/repos/${ownerRepo}/commits/${encodeURIComponent(sha)}`, {
      fetchImpl,
      timeoutMs,
      requests,
    });
    if (commitRes.networkError) {
      out.githubApiRead = 'UNAVAILABLE';
      out.signal = 'PROVIDER_STATE_UNKNOWN';
      out.githubReason = 'NETWORK_UNAVAILABLE';
      return out;
    }
    if (commitRes.parseError) {
      out.parseFailed = true;
      out.githubReason = 'MALFORMED_RESPONSE';
      return out;
    }
    out.githubRateLimitRemaining = commitRes.remaining;
    if (commitRes.status === 200) {
      out.observedRemoteCommitSha = commitRes.data?.sha || sha;
      out.observedLocalHeadRemoteExistence = 'YES';
    } else if (commitRes.status === 404) {
      out.observedLocalHeadRemoteExistence = 'NO';
      out.githubReason = out.githubReason || 'NOT_FOUND_OR_NOT_VISIBLE';
    } else {
      const fail = classifyHttpFailure(commitRes.status);
      out.observedLocalHeadRemoteExistence = 'UNKNOWN';
      out.githubReason = fail.githubReason;
      if (fail.githubApiRead === 'UNAVAILABLE') out.githubApiRead = 'UNAVAILABLE';
    }

    const runsRes = await githubGet(`/repos/${ownerRepo}/actions/runs?head_sha=${encodeURIComponent(sha)}`, {
      fetchImpl,
      timeoutMs,
      requests,
    });
    if (runsRes.networkError) {
      out.githubApiRead = 'UNAVAILABLE';
      out.signal = 'PROVIDER_STATE_UNKNOWN';
      out.githubReason = 'NETWORK_UNAVAILABLE';
      return out;
    }
    if (runsRes.parseError) {
      out.parseFailed = true;
      out.githubReason = 'MALFORMED_RESPONSE';
      return out;
    }
    out.githubRateLimitRemaining = runsRes.remaining;
    if (runsRes.status === 200) {
      const runs = Array.isArray(runsRes.data?.workflow_runs) ? runsRes.data.workflow_runs : [];
      out.observedWorkflowRuns = String(runs.length);
      if (runs.length === 0) {
        out.observedWorkflowState = 'NO_RUNS_FOUND';
      } else {
        out.observedWorkflowState = runs
          .map((run) => `${run.name || 'workflow'}:${run.conclusion || run.status || 'UNKNOWN'}`)
          .join(', ');
      }
    } else {
      const fail = classifyHttpFailure(runsRes.status);
      out.githubReason = fail.githubReason;
      if (fail.githubApiRead === 'UNAVAILABLE') out.githubApiRead = 'UNAVAILABLE';
    }
  }

  return out;
}

export function parseObserveArgs(argv = []) {
  return { githubPublic: argv.includes('--github-public') };
}
