import { z } from 'zod';

/** Life-stage lanes for OMNAI creative profiling (Phase 1 UI) */
export const LIFE_STAGES = [
  { id: 'seedling', label: 'Seedling', description: 'Early ideas, discovery, gentle wonder' },
  { id: 'rising', label: 'Rising', description: 'Momentum, learning, hopeful ascent' },
  { id: 'prime', label: 'Prime', description: 'Full creative power, balanced confidence' },
  { id: 'reflection', label: 'Reflection', description: 'Memory, wisdom, quiet integration' },
  { id: 'legacy', label: 'Legacy', description: 'Transmission, honour, long-view storytelling' },
] as const;

/** Tone presets for script generation (Phase 1 UI) */
export const TONES = [
  { id: 'cinematic', label: 'Cinematic', description: 'Visual, atmospheric, film-forward' },
  { id: 'warm', label: 'Warm', description: 'Compassionate, human, sanctuary-safe' },
  { id: 'epic', label: 'Epic', description: 'Grand scale without hype-as-truth' },
  { id: 'minimal', label: 'Minimal', description: 'Sparse, precise, photophobia-friendly' },
  {
    id: 'playful',
    label: 'Playful',
    description: 'Light rhythm — never child-surveillance framing',
  },
] as const;

export type LifeStageId = (typeof LIFE_STAGES)[number]['id'];
export type ToneId = (typeof TONES)[number]['id'];

/** Future Phase 2+ — not exposed in UI yet */
export const EMOTIONAL_INTENSITY_LEVELS = ['subtle', 'moderate', 'intense'] as const;
export type EmotionalIntensity = (typeof EMOTIONAL_INTENSITY_LEVELS)[number];

export const PACING_STYLES = ['slow-burn', 'balanced', 'kinetic'] as const;
export type PacingStyle = (typeof PACING_STYLES)[number];

export const AUDIENCE_MODES = ['operator-only', 'family-safe', 'public-teaser'] as const;
export type AudienceMode = (typeof AUDIENCE_MODES)[number];

const lifeStageIdSchema = z.enum(['seedling', 'rising', 'prime', 'reflection', 'legacy']);

const toneIdSchema = z.enum(['cinematic', 'warm', 'epic', 'minimal', 'playful']);

/** Active profile fields (UI + API today) */
export const creativeProfileInputSchema = z.object({
  lifeStage: lifeStageIdSchema,
  tone: toneIdSchema,
});

export type CreativeProfileInput = z.infer<typeof creativeProfileInputSchema>;

/**
 * Future-ready OMNAI Creative Profile — extended fields optional until chartered.
 * Phase 2+ may enable emotionalIntensity, pacingStyle, audienceMode in UI.
 */
export const creativeProfileSchema = creativeProfileInputSchema.extend({
  // emotionalIntensity: z.enum(EMOTIONAL_INTENSITY_LEVELS).optional(),
  // pacingStyle: z.enum(PACING_STYLES).optional(),
  // audienceMode: z.enum(AUDIENCE_MODES).optional(),
  emotionalIntensity: z.enum(EMOTIONAL_INTENSITY_LEVELS).optional(),
  pacingStyle: z.enum(PACING_STYLES).optional(),
  audienceMode: z.enum(AUDIENCE_MODES).optional(),
});

export type CreativeProfile = z.infer<typeof creativeProfileSchema>;

export const generateScriptRequestSchema = z.object({
  prompt: z.string().min(1, 'prompt is required'),
  lifeStage: lifeStageIdSchema.optional(),
  tone: toneIdSchema.optional(),
});

export type GenerateScriptRequest = z.infer<typeof generateScriptRequestSchema>;

export const scriptSceneSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  orderIndex: z.number().int().nonnegative(),
});

export type ScriptScene = z.infer<typeof scriptSceneSchema>;

export const scriptGovernanceSchema = z.object({
  providerStatus: z.literal('stub-only'),
  humanReviewRequired: z.literal(true),
  drpSafe: z.literal(true),
});

export type ScriptGovernance = z.infer<typeof scriptGovernanceSchema>;

export const generateScriptResponseSchema = z.object({
  title: z.string(),
  logline: z.string(),
  creativeProfile: creativeProfileSchema,
  scenes: z.array(scriptSceneSchema),
  governance: scriptGovernanceSchema,
});

export type GenerateScriptResponse = z.infer<typeof generateScriptResponseSchema>;

export const SCRIPT_GOVERNANCE: ScriptGovernance = {
  providerStatus: 'stub-only',
  humanReviewRequired: true,
  drpSafe: true,
};

export const DEFAULT_LIFE_STAGE: LifeStageId = 'prime';
export const DEFAULT_TONE: ToneId = 'cinematic';

export function normalizeCreativeProfile(
  input: Partial<CreativeProfileInput> | undefined
): CreativeProfile {
  const parsed = creativeProfileInputSchema.safeParse({
    lifeStage: input?.lifeStage ?? DEFAULT_LIFE_STAGE,
    tone: input?.tone ?? DEFAULT_TONE,
  });

  const base = parsed.success ? parsed.data : { lifeStage: DEFAULT_LIFE_STAGE, tone: DEFAULT_TONE };

  return {
    ...base,
    // Future UI: set from operator controls when Phase 2+ ships
    // emotionalIntensity: 'moderate',
    // pacingStyle: 'balanced',
    // audienceMode: 'operator-only',
  };
}

export function getLifeStageLabel(id: LifeStageId): string {
  return LIFE_STAGES.find((s) => s.id === id)?.label ?? id;
}

export function getToneLabel(id: ToneId): string {
  return TONES.find((t) => t.id === id)?.label ?? id;
}

/** Engines that may consume Creative Profile later (display only) */
export const FUTURE_ENGINE_COMPAT = [
  'OMNAI Script',
  'Z-Music',
  'Visual Engine',
  'eBook Engine',
  'Podcast Engine',
  'Zuno Orchestrator',
] as const;
