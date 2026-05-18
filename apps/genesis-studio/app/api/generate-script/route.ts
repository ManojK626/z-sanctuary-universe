import { NextResponse } from 'next/server';
import {
  generateScriptRequestSchema,
  normalizeCreativeProfile,
  SCRIPT_GOVERNANCE,
  getLifeStageLabel,
  getToneLabel,
  type GenerateScriptResponse,
} from '@/lib/creative-profile';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = generateScriptRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { prompt, lifeStage, tone } = parsed.data;
  const creativeProfile = normalizeCreativeProfile({ lifeStage, tone });
  const stageLabel = getLifeStageLabel(creativeProfile.lifeStage);
  const toneLabel = getToneLabel(creativeProfile.tone);

  // Future: call OpenAI / OMNAI provider adapter here after DRP approval.
  const mock: GenerateScriptResponse = {
    title: `Genesis Draft — ${toneLabel} / ${stageLabel}`,
    logline: `A governed ${toneLabel.toLowerCase()} story at the ${stageLabel.toLowerCase()} stage: "${prompt.slice(0, 100)}${prompt.length > 100 ? '…' : ''}"`,
    creativeProfile,
    scenes: [
      {
        id: 'scene-1',
        title: 'Scene 1 — Threshold',
        body: `INT. SANCTUARY STUDIO — NIGHT\n\nLife-stage: ${stageLabel}. Tone: ${toneLabel}.\n\nA violet glow washes the workspace. No AI claims authority.`,
        orderIndex: 0,
      },
      {
        id: 'scene-2',
        title: 'Scene 2 — Assembly',
        body: 'Storyboard frames wait empty. Audio tracks hum with silence. The timeline is mock — but the intention is real.',
        orderIndex: 1,
      },
      {
        id: 'scene-3',
        title: 'Scene 3 — Gate',
        body: 'EXPORT button sleeps. Human review required. The ecosystem breathes — slow, evidence-first, Turtle Mode.',
        orderIndex: 2,
      },
    ],
    governance: SCRIPT_GOVERNANCE,
  };

  return NextResponse.json(mock);
}
