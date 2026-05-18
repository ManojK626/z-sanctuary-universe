/**
 * Genesis Core Registry — hidden future layer (not a UI tab yet).
 *
 * Future bridge for OMNAI Creative Engine outputs across the Z-Sanctuary stack:
 * script → scenes → storyboard → audio → edit → publish → receipt
 *
 * Later: Z-Music, Visual Engine, eBook Engine, Podcast Engine, Zuno Orchestrator.
 * No runtime registration in Phase 0 shell — types and pipeline order only.
 */

export type GenesisPipelineStage =
  | 'script'
  | 'scenes'
  | 'storyboard'
  | 'audio'
  | 'edit'
  | 'publish'
  | 'receipt';

export type GenesisAssetKind =
  | 'script'
  | 'storyboard_frame'
  | 'audio_track'
  | 'video_clip'
  | 'image'
  | 'ebook'
  | 'song'
  | 'podcast'
  | 'poster';

export interface GenesisCreativeReceipt {
  stage: GenesisPipelineStage;
  module: string;
  lastAction: string;
  providerStatus: 'stub' | 'pending_approval' | 'live';
  drpStatus: 'safe_placeholder' | 'human_review_required';
  recordedAt: string;
}

export const GENESIS_PIPELINE_ORDER: GenesisPipelineStage[] = [
  'script',
  'scenes',
  'storyboard',
  'audio',
  'edit',
  'publish',
  'receipt',
];

/** Future: persist receipt rows to Supabase or hub data spine after human gate */
export function buildStubReceipt(module: string, lastAction: string): GenesisCreativeReceipt {
  return {
    stage: 'script',
    module,
    lastAction,
    providerStatus: 'stub',
    drpStatus: 'human_review_required',
    recordedAt: new Date().toISOString(),
  };
}
