import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  let prompt = '';
  try {
    const body = (await request.json()) as { prompt?: string };
    prompt = body.prompt?.trim() ?? '';
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!prompt) {
    return NextResponse.json({ error: 'prompt is required' }, { status: 400 });
  }

  // Future: call OpenAI / OMNAI provider adapter here after DRP approval.
  const mock = {
    title: 'Genesis Draft — OMNAI Signal',
    logline: `A governed creative seed from: "${prompt.slice(0, 120)}${prompt.length > 120 ? '…' : ''}"`,
    scenes: [
      {
        title: 'Scene 1 — Threshold',
        body: 'INT. SANCTUARY STUDIO — NIGHT\n\nA violet glow washes the workspace. No AI claims authority. The operator reads the receipt and nods.',
      },
      {
        title: 'Scene 2 — Assembly',
        body: 'Storyboard frames wait empty. Audio tracks hum with silence. The timeline is mock — but the intention is real.',
      },
      {
        title: 'Scene 3 — Gate',
        body: 'EXPORT button sleeps. Human review required. The ecosystem breathes — slow, evidence-first, Turtle Mode.',
      },
    ],
  };

  return NextResponse.json(mock);
}
