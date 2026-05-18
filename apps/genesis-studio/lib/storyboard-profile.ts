import { z } from 'zod';
import {
  creativeProfileSchema,
  normalizeCreativeProfile,
  type CreativeProfile,
} from '@/lib/creative-profile';

export const STYLE_PRESETS = [
  {
    id: 'cinematic',
    label: 'Cinematic',
    description: 'Film lighting, depth, violet-gold OMNAI palette',
  },
  {
    id: 'documentary',
    label: 'Documentary',
    description: 'Natural light, grounded, evidence-first framing',
  },
  {
    id: 'abstract',
    label: 'Abstract',
    description: 'Symbolic shapes, minimal literal faces, sanctuary-safe',
  },
] as const;

export type StylePresetId = (typeof STYLE_PRESETS)[number]['id'];

export const stylePresetSchema = z.enum(['cinematic', 'documentary', 'abstract']);
export const sceneIdSchema = z.string().min(1, 'sceneId is required');
export const sceneTextSchema = z.string().min(1, 'sceneText is required');

export const generateStoryboardRequestSchema = z.object({
  sceneId: sceneIdSchema,
  sceneText: sceneTextSchema,
  stylePreset: stylePresetSchema,
  creativeProfile: creativeProfileSchema.partial().optional(),
});

export type GenerateStoryboardRequest = z.infer<typeof generateStoryboardRequestSchema>;

export const storyboardGovernanceSchema = z.object({
  providerStatus: z.literal('stub-only'),
  humanReviewRequired: z.literal(true),
  drpSafe: z.literal(true),
});

export type StoryboardGovernance = z.infer<typeof storyboardGovernanceSchema>;

export const generateStoryboardResponseSchema = z.object({
  sceneId: z.string(),
  stylePreset: stylePresetSchema,
  promptPreview: z.string(),
  /** Empty in stub phase — UI renders local gradient placeholder */
  imageUrl: z.string(),
  providerStatus: z.literal('stub-only'),
  humanReviewRequired: z.literal(true),
  drpSafe: z.literal(true),
});

export type GenerateStoryboardResponse = z.infer<typeof generateStoryboardResponseSchema>;

export const STORYBOARD_GOVERNANCE: StoryboardGovernance = {
  providerStatus: 'stub-only',
  humanReviewRequired: true,
  drpSafe: true,
};

export const DEFAULT_STYLE_PRESET: StylePresetId = 'cinematic';

export function getStylePresetLabel(id: StylePresetId): string {
  return STYLE_PRESETS.find((p) => p.id === id)?.label ?? id;
}

/**
 * Builds a governed prompt string for future Replicate/SDXL/Flux adapters.
 * No network call — preview only until provider charter + env + human gate.
 */
export function buildStoryboardPrompt(
  sceneText: string,
  stylePreset: StylePresetId,
  creativeProfile?: Partial<CreativeProfile>
): string {
  const profile = normalizeCreativeProfile(creativeProfile);
  const excerpt = sceneText.trim().slice(0, 400);
  const preset = getStylePresetLabel(stylePreset);

  return [
    '[GENESIS-STORYBOARD-STUB]',
    `style=${preset}`,
    `life_stage=${profile.lifeStage}`,
    `tone=${profile.tone}`,
    'governance=human_review_required',
    'no_faces_of_minors',
    'no_biometric_inference',
    `scene=${excerpt}`,
  ].join(' | ');
}
