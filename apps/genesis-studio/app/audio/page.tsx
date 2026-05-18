'use client';

import { useState } from 'react';
import { StudioShell } from '@/components/studio-shell';
import { PageMotion } from '@/components/page-motion';
import { AudioPlanCard } from '@/components/audio-plan-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DEFAULT_NARRATION_STYLE,
  DEFAULT_SOUNDTRACK_MOOD,
  NARRATION_STYLES,
  SOUNDTRACK_MOODS,
  type GenerateAudioPlanResponse,
  type NarrationStyleId,
  type SoundtrackMoodId,
} from '@/lib/audio-profile';
import { DEFAULT_LIFE_STAGE, DEFAULT_TONE } from '@/lib/creative-profile';
import { Headphones, Loader2, Pause, Play, Upload } from 'lucide-react';

const STUB_SCENES = [
  {
    id: 'scene-1',
    title: 'Threshold',
    text: 'Operator enters the studio. Creative Receipt glows violet-gold.',
  },
  {
    id: 'scene-2',
    title: 'Assembly',
    text: 'Narration bed planned. No TTS call — mock cues only.',
  },
  {
    id: 'scene-3',
    title: 'Gate',
    text: 'Silence beat before export. Human review required.',
  },
] as const;

const TRACKS = ['Voiceover', 'Music', 'Effects'] as const;

export default function AudioPage() {
  const [narrationStyle, setNarrationStyle] = useState<NarrationStyleId>(DEFAULT_NARRATION_STYLE);
  const [soundtrackMood, setSoundtrackMood] = useState<SoundtrackMoodId>(DEFAULT_SOUNDTRACK_MOOD);
  const [plans, setPlans] = useState<GenerateAudioPlanResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState('Viewed audio shell');

  async function handleGeneratePlans() {
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.all(
        STUB_SCENES.map(async (scene) => {
          const res = await fetch('/api/generate-audio-plan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sceneId: scene.id,
              sceneText: scene.text,
              narrationStyle,
              soundtrackMood,
              creativeProfile: {
                lifeStage: DEFAULT_LIFE_STAGE,
                tone: DEFAULT_TONE,
              },
            }),
          });
          if (!res.ok) throw new Error(`Failed for ${scene.id}`);
          return (await res.json()) as GenerateAudioPlanResponse;
        })
      );
      setPlans(results);
      setLastAction(`Generated ${results.length} mock audio plans`);
    } catch {
      setError('Could not generate mock audio plans.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <StudioShell module="Audio" lastAction={lastAction}>
      <PageMotion>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Headphones className="h-5 w-5 text-gold" />
              Narrative audio intelligence (Phase 2B — stub)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5 text-sm">
                <span className="text-muted-foreground">Narration style</span>
                <select
                  className="w-full rounded-md border border-border bg-muted/30 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet"
                  value={narrationStyle}
                  onChange={(e) => setNarrationStyle(e.target.value as NarrationStyleId)}
                >
                  {NARRATION_STYLES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1.5 text-sm">
                <span className="text-muted-foreground">Soundtrack mood</span>
                <select
                  className="w-full rounded-md border border-border bg-muted/30 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet"
                  value={soundtrackMood}
                  onChange={(e) => setSoundtrackMood(e.target.value as SoundtrackMoodId)}
                >
                  {SOUNDTRACK_MOODS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                onClick={handleGeneratePlans}
                disabled={loading}
                className="gap-2"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Headphones className="h-4 w-4" />
                )}
                Generate audio plan mock
              </Button>
              <Button variant="outline" className="gap-2" type="button" disabled title="Stub only">
                <Upload className="h-4 w-4" />
                Upload audio (placeholder)
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                type="button"
                disabled
                onClick={() => setPlaying((p) => !p)}
                title="No audio files — plan only"
              >
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                Play (placeholder)
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && <p className="text-sm text-red-400">{error}</p>}

        {plans.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {plans.map((plan) => {
              const scene = STUB_SCENES.find((s) => s.id === plan.sceneId);
              return (
                <AudioPlanCard
                  key={plan.sceneId}
                  plan={plan}
                  sceneTitle={scene?.title}
                  sceneExcerpt={scene?.text}
                />
              );
            })}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {TRACKS.map((track) => (
              <Card key={track}>
                <CardHeader>
                  <CardTitle className="text-base">{track}</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  No audio loaded — generate a plan mock or upload in a future phase.
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </PageMotion>
    </StudioShell>
  );
}
