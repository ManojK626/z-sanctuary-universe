import { NextResponse } from 'next/server';
import {
  buildAudioPlan,
  buildMockCues,
  generateAudioPlanRequestSchema,
  AUDIO_PLAN_GOVERNANCE,
  type GenerateAudioPlanResponse,
} from '@/lib/audio-profile';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = generateAudioPlanRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { sceneId, sceneText, narrationStyle, soundtrackMood, creativeProfile } = parsed.data;

  // Future provider adapters (not installed — stub only):
  // - ElevenLabs: voice / narration (ELEVENLABS_API_KEY + human approval + receipt)
  // - OpenAI audio: TTS / dialogue (OPENAI_API_KEY + DRP gate)
  // - local TTS: on-device synthesis — no cloud egress, still human-gated
  // - Z-Music Engine: sanctuary soundtrack lane — assets table only
  // - Suno / Udio / Replicate / Runway: explicitly out of scope until separate charter
  void buildAudioPlan(sceneText, narrationStyle, soundtrackMood, creativeProfile);

  const mock: GenerateAudioPlanResponse = {
    sceneId,
    narrationStyle,
    soundtrackMood,
    cues: buildMockCues(sceneId, narrationStyle, soundtrackMood),
    ...AUDIO_PLAN_GOVERNANCE,
  };

  return NextResponse.json(mock);
}
