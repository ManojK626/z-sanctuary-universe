import { z } from 'zod';
import {
  creativeProfileSchema,
  normalizeCreativeProfile,
  type CreativeProfile,
} from '@/lib/creative-profile';

export const NARRATION_STYLES = [
  { id: 'warm_guide', label: 'Warm guide', description: 'Compassionate narrator — sanctuary-safe' },
  { id: 'documentary', label: 'Documentary', description: 'Grounded, evidence-first delivery' },
  {
    id: 'cinematic_trailer',
    label: 'Cinematic trailer',
    description: 'Punchy beats — no false urgency',
  },
  {
    id: 'child_friendly',
    label: 'Child friendly',
    description: 'Gentle tone — not surveillance or coercive',
  },
  { id: 'elder_wisdom', label: 'Elder wisdom', description: 'Reflective pace, dignity-first' },
] as const;

export const SOUNDTRACK_MOODS = [
  { id: 'ambient', label: 'Ambient', description: 'Soft beds, low motion' },
  { id: 'uplifting', label: 'Uplifting', description: 'Hopeful lift without hype' },
  { id: 'mysterious', label: 'Mysterious', description: 'Tension without horror cues' },
  { id: 'playful', label: 'Playful', description: 'Light rhythm — governed play' },
  { id: 'dramatic', label: 'Dramatic', description: 'Weight and scale — human-gated' },
] as const;

export const AUDIO_CUE_TYPES = [
  { id: 'narration', label: 'Narration' },
  { id: 'music', label: 'Music' },
  { id: 'ambience', label: 'Ambience' },
  { id: 'effect', label: 'Effect' },
  { id: 'silence', label: 'Silence' },
] as const;

export type NarrationStyleId = (typeof NARRATION_STYLES)[number]['id'];
export type SoundtrackMoodId = (typeof SOUNDTRACK_MOODS)[number]['id'];
export type AudioCueTypeId = (typeof AUDIO_CUE_TYPES)[number]['id'];

export const narrationStyleSchema = z.enum([
  'warm_guide',
  'documentary',
  'cinematic_trailer',
  'child_friendly',
  'elder_wisdom',
]);

export const soundtrackMoodSchema = z.enum([
  'ambient',
  'uplifting',
  'mysterious',
  'playful',
  'dramatic',
]);

export const audioCueTypeSchema = z.enum(['narration', 'music', 'ambience', 'effect', 'silence']);

export const sceneIdSchema = z.string().min(1, 'sceneId is required');
export const sceneTextSchema = z.string().min(1, 'sceneText is required');

export const audioCueSchema = z.object({
  id: z.string(),
  type: audioCueTypeSchema,
  label: z.string(),
  timingHint: z.string(),
  notes: z.string(),
});

export type AudioCue = z.infer<typeof audioCueSchema>;

export const generateAudioPlanRequestSchema = z.object({
  sceneId: sceneIdSchema,
  sceneText: sceneTextSchema,
  narrationStyle: narrationStyleSchema,
  soundtrackMood: soundtrackMoodSchema,
  creativeProfile: creativeProfileSchema.partial().optional(),
});

export type GenerateAudioPlanRequest = z.infer<typeof generateAudioPlanRequestSchema>;

export const generateAudioPlanResponseSchema = z.object({
  sceneId: z.string(),
  narrationStyle: narrationStyleSchema,
  soundtrackMood: soundtrackMoodSchema,
  cues: z.array(audioCueSchema),
  providerStatus: z.literal('stub-only'),
  humanReviewRequired: z.literal(true),
  drpSafe: z.literal(true),
});

export type GenerateAudioPlanResponse = z.infer<typeof generateAudioPlanResponseSchema>;

export const AUDIO_PLAN_GOVERNANCE = {
  providerStatus: 'stub-only' as const,
  humanReviewRequired: true as const,
  drpSafe: true as const,
};

export const DEFAULT_NARRATION_STYLE: NarrationStyleId = 'warm_guide';
export const DEFAULT_SOUNDTRACK_MOOD: SoundtrackMoodId = 'ambient';

export function getNarrationStyleLabel(id: NarrationStyleId): string {
  return NARRATION_STYLES.find((s) => s.id === id)?.label ?? id;
}

export function getSoundtrackMoodLabel(id: SoundtrackMoodId): string {
  return SOUNDTRACK_MOODS.find((m) => m.id === id)?.label ?? id;
}

/**
 * Builds a governed audio plan descriptor for future TTS / soundtrack adapters.
 * No provider call — planning text only until charter + env + human gate.
 */
export function buildAudioPlan(
  sceneText: string,
  narrationStyle: NarrationStyleId,
  soundtrackMood: SoundtrackMoodId,
  creativeProfile?: Partial<CreativeProfile>
): string {
  const profile = normalizeCreativeProfile(creativeProfile);
  const excerpt = sceneText.trim().slice(0, 400);

  return [
    '[GENESIS-AUDIO-PLAN-STUB]',
    `narration=${getNarrationStyleLabel(narrationStyle)}`,
    `soundtrack=${getSoundtrackMoodLabel(soundtrackMood)}`,
    `life_stage=${profile.lifeStage}`,
    `tone=${profile.tone}`,
    'governance=human_review_required',
    'no_biometric_voice_inference',
    `scene=${excerpt}`,
  ].join(' | ');
}

export function buildMockCues(
  sceneId: string,
  narrationStyle: NarrationStyleId,
  soundtrackMood: SoundtrackMoodId
): AudioCue[] {
  return [
    {
      id: `${sceneId}-cue-narration`,
      type: 'narration',
      label: `${getNarrationStyleLabel(narrationStyle)} voice-over`,
      timingHint: '0:00–0:20',
      notes: 'Stub cue — future ElevenLabs / OpenAI audio / local TTS after approval.',
    },
    {
      id: `${sceneId}-cue-music`,
      type: 'music',
      label: `${getSoundtrackMoodLabel(soundtrackMood)} bed`,
      timingHint: '0:00–end',
      notes: 'Stub cue — future Z-Music Engine / soundtrack generator.',
    },
    {
      id: `${sceneId}-cue-ambience`,
      type: 'ambience',
      label: 'Room tone',
      timingHint: 'under dialogue',
      notes: 'Low-level atmosphere — no startling SFX.',
    },
    {
      id: `${sceneId}-cue-silence`,
      type: 'silence',
      label: 'Breath beat',
      timingHint: 'before gate moment',
      notes: 'Intentional pause for human review pacing.',
    },
  ];
}
