import { NextResponse } from 'next/server';
import {
  buildStoryboardPrompt,
  generateStoryboardRequestSchema,
  STORYBOARD_GOVERNANCE,
  type GenerateStoryboardResponse,
} from '@/lib/storyboard-profile';
import { STORYBOARD_PLANNED_PROVIDER } from '@/lib/provider-boundaries';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = generateStoryboardRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { sceneId, sceneText, stylePreset, creativeProfile } = parsed.data;
  const promptPreview = buildStoryboardPrompt(sceneText, stylePreset, creativeProfile);

  // Future: Replicate / SDXL / Flux adapter — gated by PROVIDER_BOUNDARIES[replicate]
  // - require REPLICATE_API_TOKEN in env (never commit)
  // - require humanApproved + cost acknowledgement receipt
  // - write binary to assets table; set scenes.storyboard_asset_id only
  // - do NOT persist external CDN URLs on scenes row
  void STORYBOARD_PLANNED_PROVIDER;

  const mock: GenerateStoryboardResponse = {
    sceneId,
    stylePreset,
    promptPreview,
    imageUrl: '',
    ...STORYBOARD_GOVERNANCE,
  };

  return NextResponse.json(mock);
}
