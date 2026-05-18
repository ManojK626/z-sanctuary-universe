'use client';

import { useState } from 'react';
import { StudioShell } from '@/components/studio-shell';
import { PageMotion } from '@/components/page-motion';
import { StoryboardFrameCard } from '@/components/storyboard-frame-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DEFAULT_STYLE_PRESET,
  STYLE_PRESETS,
  type GenerateStoryboardResponse,
  type StylePresetId,
} from '@/lib/storyboard-profile';
import { DEFAULT_LIFE_STAGE, DEFAULT_TONE } from '@/lib/creative-profile';
import { Clapperboard, Loader2 } from 'lucide-react';

/** Local stub scenes — not persisted; Supabase sync in a future phase */
const STUB_SCENES = [
  {
    id: 'scene-1',
    title: 'Threshold',
    text: 'INT. SANCTUARY STUDIO — violet light, operator reads the Creative Receipt.',
  },
  {
    id: 'scene-2',
    title: 'Assembly',
    text: 'Empty storyboard grid waits. Mock frames only — no Replicate call.',
  },
  {
    id: 'scene-3',
    title: 'Gate',
    text: 'Export sleeps. Human review required before any publish lane.',
  },
] as const;

export default function StoryboardPage() {
  const [stylePreset, setStylePreset] = useState<StylePresetId>(DEFAULT_STYLE_PRESET);
  const [frames, setFrames] = useState<GenerateStoryboardResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState('Viewed storyboard shell');

  async function handleGenerateMock() {
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.all(
        STUB_SCENES.map(async (scene) => {
          const res = await fetch('/api/generate-storyboard', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sceneId: scene.id,
              sceneText: scene.text,
              stylePreset,
              creativeProfile: {
                lifeStage: DEFAULT_LIFE_STAGE,
                tone: DEFAULT_TONE,
              },
            }),
          });
          if (!res.ok) throw new Error(`Failed for ${scene.id}`);
          return (await res.json()) as GenerateStoryboardResponse;
        })
      );
      setFrames(results);
      setLastAction(`Generated ${results.length} mock storyboard frames`);
    } catch {
      setError('Could not generate mock storyboard frames.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <StudioShell module="Storyboard" lastAction={lastAction}>
      <PageMotion>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clapperboard className="h-5 w-5 text-gold" />
              Storyboard provider shell (stub)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-end gap-4">
            <label className="space-y-1.5 text-sm">
              <span className="text-muted-foreground">Style preset</span>
              <select
                className="w-full min-w-[180px] rounded-md border border-border bg-muted/30 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet"
                value={stylePreset}
                onChange={(e) => setStylePreset(e.target.value as StylePresetId)}
              >
                {STYLE_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>
            <Button type="button" onClick={handleGenerateMock} disabled={loading} className="gap-2">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Clapperboard className="h-4 w-4" />
              )}
              Generate storyboard mock
            </Button>
          </CardContent>
        </Card>

        {error && <p className="text-sm text-red-400">{error}</p>}

        {frames.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {frames.map((frame) => {
              const scene = STUB_SCENES.find((s) => s.id === frame.sceneId);
              return (
                <StoryboardFrameCard
                  key={frame.sceneId}
                  frame={frame}
                  sceneTitle={scene?.title}
                  onRegenPlaceholder={() => undefined}
                />
              );
            })}
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            No frames yet — generate mock storyboard (no Replicate, no external URLs).
          </p>
        )}
      </PageMotion>
    </StudioShell>
  );
}
