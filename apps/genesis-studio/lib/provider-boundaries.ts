/**
 * Genesis Studio — provider boundary registry (docs + gates).
 * No provider SDKs installed in stub phases. Adapters require human charter.
 */

export type ProviderId = 'replicate' | 'openai' | 'runway' | 'elevenlabs' | 'local';

export interface ProviderBoundary {
  id: ProviderId;
  /** Env var that must exist before any live call (never commit values) */
  envVar: string | null;
  humanApprovalRequired: true;
  costWarning: string;
  receiptRequired: true;
  drpSafeDefault: 'stub-only' | 'review-required';
  notes: string;
}

export const PROVIDER_BOUNDARIES: Record<ProviderId, ProviderBoundary> = {
  replicate: {
    id: 'replicate',
    envVar: 'REPLICATE_API_TOKEN',
    humanApprovalRequired: true,
    costWarning: 'Image/video models bill per run — operator must approve each batch.',
    receiptRequired: true,
    drpSafeDefault: 'review-required',
    notes:
      'Future SDXL/Flux storyboard lane. Store outputs in assets table only — not external URLs on scenes.',
  },
  openai: {
    id: 'openai',
    envVar: 'OPENAI_API_KEY',
    humanApprovalRequired: true,
    costWarning: 'Token usage scales with prompt length and model tier.',
    receiptRequired: true,
    drpSafeDefault: 'review-required',
    notes: 'Script + vision adapters — OMNAI provider wrapper after DRP gate.',
  },
  runway: {
    id: 'runway',
    envVar: 'RUNWAY_API_KEY',
    humanApprovalRequired: true,
    costWarning: 'Video generation is high-cost; mock-first until receipt chain exists.',
    receiptRequired: true,
    drpSafeDefault: 'review-required',
    notes: 'Future motion/storyboard-to-clip lane — not enabled in Phase 1 shell.',
  },
  elevenlabs: {
    id: 'elevenlabs',
    envVar: 'ELEVENLABS_API_KEY',
    humanApprovalRequired: true,
    costWarning: 'Voice synthesis billed per character — consent-first copy only.',
    receiptRequired: true,
    drpSafeDefault: 'review-required',
    notes: 'Audio page future adapter — separate from storyboard stub.',
  },
  local: {
    id: 'local',
    envVar: null,
    humanApprovalRequired: true,
    costWarning: 'Local GPU/time cost on operator machine — no cloud bill, still human-gated.',
    receiptRequired: true,
    drpSafeDefault: 'stub-only',
    notes: 'Offline or NAS_WAIT pipelines — no silent network egress.',
  },
};

/** Storyboard image lane — Replicate is the planned adapter, not active */
export const STORYBOARD_PLANNED_PROVIDER: ProviderId = 'replicate';

export function canInvokeProvider(
  providerId: ProviderId,
  opts: { envPresent: boolean; humanApproved: boolean }
): { allowed: boolean; reason: string } {
  const boundary = PROVIDER_BOUNDARIES[providerId];
  if (!opts.humanApproved) {
    return { allowed: false, reason: 'Human approval required before provider call.' };
  }
  if (boundary.envVar && !opts.envPresent) {
    return { allowed: false, reason: `${boundary.envVar} not configured — stub mode only.` };
  }
  return { allowed: false, reason: 'Stub phase — no live provider invocation.' };
}
