'use client';

import { useCallback, useState } from 'react';
import { StudioShell } from '@/components/studio-shell';
import { PageMotion } from '@/components/page-motion';
import { CreativeReceipt } from '@/components/creative-receipt';
import { CreativeDnaCard } from '@/components/creative-dna-card';
import { ScriptSceneCard } from '@/components/script-scene-card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DEFAULT_LIFE_STAGE,
  DEFAULT_TONE,
  LIFE_STAGES,
  TONES,
  type GenerateScriptResponse,
  type LifeStageId,
  type ScriptScene,
  type ToneId,
} from '@/lib/creative-profile';

function reorderScenes(scenes: ScriptScene[]): ScriptScene[] {
  return scenes.map((s, i) => ({ ...s, orderIndex: i }));
}

export default function ScriptPage() {
  const [prompt, setPrompt] = useState('');
  const [lifeStage, setLifeStage] = useState<LifeStageId>(DEFAULT_LIFE_STAGE);
  const [tone, setTone] = useState<ToneId>(DEFAULT_TONE);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateScriptResponse | null>(null);
  const [scenes, setScenes] = useState<ScriptScene[]>([]);
  const [error, setError] = useState<string | null>(null);

  const updateScene = useCallback((index: number, updated: ScriptScene) => {
    setScenes((prev) => prev.map((s, i) => (i === index ? updated : s)));
  }, []);

  const moveScene = useCallback((index: number, direction: -1 | 1) => {
    setScenes((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return reorderScenes(next);
    });
  }, []);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, lifeStage, tone }),
      });
      if (!res.ok) throw new Error('Stub API failed');
      const data = (await res.json()) as GenerateScriptResponse;
      setResult(data);
      setScenes([...data.scenes].sort((a, b) => a.orderIndex - b.orderIndex));
    } catch {
      setError('Could not generate mock script.');
    } finally {
      setLoading(false);
    }
  }

  const profile = result?.creativeProfile ?? { lifeStage, tone };
  const lastAction = result ? 'Generated mock script' : 'Idle';

  return (
    <StudioShell module="Script" lastAction={lastAction}>
      <PageMotion>
        <div className="mb-4 lg:hidden">
          <CreativeReceipt module="Script" lastAction={lastAction} />
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Script writer (stub)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-1.5 text-sm">
                    <span className="text-muted-foreground">Life-stage</span>
                    <select
                      className="w-full rounded-md border border-border bg-muted/30 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet"
                      value={lifeStage}
                      onChange={(e) => setLifeStage(e.target.value as LifeStageId)}
                    >
                      {LIFE_STAGES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1.5 text-sm">
                    <span className="text-muted-foreground">Tone</span>
                    <select
                      className="w-full rounded-md border border-border bg-muted/30 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet"
                      value={tone}
                      onChange={(e) => setTone(e.target.value as ToneId)}
                    >
                      {TONES.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <Textarea
                  placeholder="Describe your scene, tone, or OMNAI narrative seed…"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <Button onClick={handleGenerate} disabled={loading || !prompt.trim()}>
                  {loading ? 'Generating…' : 'Generate Script'}
                </Button>
                {error && <p className="text-sm text-red-400">{error}</p>}
              </CardContent>
            </Card>

            {result && (
              <Card className="border-violet/30">
                <CardHeader>
                  <CardTitle>{result.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{result.logline}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {scenes.map((scene, i) => (
                    <ScriptSceneCard
                      key={scene.id}
                      scene={scene}
                      index={i}
                      total={scenes.length}
                      onChange={(updated) => updateScene(i, updated)}
                      onMoveUp={() => moveScene(i, -1)}
                      onMoveDown={() => moveScene(i, 1)}
                    />
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          <aside className="space-y-4">
            <CreativeDnaCard profile={profile} governance={result?.governance} />
          </aside>
        </div>
      </PageMotion>
    </StudioShell>
  );
}
