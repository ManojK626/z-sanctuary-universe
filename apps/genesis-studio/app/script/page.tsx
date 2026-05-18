'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { StudioShell } from '@/components/studio-shell';
import { PageMotion } from '@/components/page-motion';
import { CreativeReceipt } from '@/components/creative-receipt';
import { CreativeDnaCard } from '@/components/creative-dna-card';
import { PersistenceReceiptCard } from '@/components/persistence-receipt-card';
import { ScriptSceneCard } from '@/components/script-scene-card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DEFAULT_LIFE_STAGE,
  DEFAULT_TONE,
  LIFE_STAGES,
  TONES,
  normalizeCreativeProfile,
  type GenerateScriptResponse,
  type LifeStageId,
  type ScriptScene,
  type ToneId,
} from '@/lib/creative-profile';
import {
  buildPersistenceReceipt,
  getActiveProjectId,
  getStorageLabel,
  loadProject,
  setActiveProjectId,
  type PersistenceReceipt,
  type ProjectStatus,
} from '@/lib/projects';
import { loadScenes, saveProjectScenes } from '@/lib/scenes';

function reorderScenes(scenes: ScriptScene[]): ScriptScene[] {
  return scenes.map((s, i) => ({ ...s, orderIndex: i }));
}

function ScriptPageInner() {
  const searchParams = useSearchParams();
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectTitle, setProjectTitle] = useState('Untitled Genesis Project');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectStatus, setProjectStatus] = useState<ProjectStatus>('draft');
  const [prompt, setPrompt] = useState('');
  const [lifeStage, setLifeStage] = useState<LifeStageId>(DEFAULT_LIFE_STAGE);
  const [tone, setTone] = useState<ToneId>(DEFAULT_TONE);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<GenerateScriptResponse | null>(null);
  const [scenes, setScenes] = useState<ScriptScene[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [persistenceReceipt, setPersistenceReceipt] = useState<PersistenceReceipt>(
    buildPersistenceReceipt({ storageMode: 'mock' })
  );

  const hydrateProject = useCallback(async (id: string) => {
    const { project, storageMode } = await loadProject(id);
    if (!project) return;
    setProjectId(project.id);
    setProjectTitle(project.title);
    setProjectDescription(project.description);
    setProjectStatus(project.status);
    if (project.lifeStage) setLifeStage(project.lifeStage as LifeStageId);
    if (project.tone) setTone(project.tone as ToneId);
    const { scenes: stored } = await loadScenes(id);
    if (stored.length > 0) setScenes(stored);
    setPersistenceReceipt(
      buildPersistenceReceipt({
        storageMode,
        storageLabel: getStorageLabel(storageMode),
        projectId: project.id,
        saveStatus: 'idle',
      })
    );
  }, []);

  useEffect(() => {
    const fromUrl = searchParams.get('projectId');
    const id = fromUrl ?? getActiveProjectId();
    if (!id) {
      setPersistenceReceipt(
        buildPersistenceReceipt({
          storageMode: 'mock',
          message: 'Select or create a project from Dashboard to persist scenes.',
        })
      );
      return;
    }
    setActiveProjectId(id);
    setProjectId(id);
    void hydrateProject(id);
  }, [searchParams, hydrateProject]);

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
      setProjectTitle(data.title);
      setScenes([...data.scenes].sort((a, b) => a.orderIndex - b.orderIndex));
    } catch {
      setError('Could not generate mock script.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!projectId) {
      setError('No active project. Create one from Dashboard first.');
      return;
    }
    if (scenes.length === 0) {
      setError('Generate or load scenes before saving.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const creativeProfile = normalizeCreativeProfile(
        result?.creativeProfile ?? { lifeStage, tone }
      );
      const { storageMode, savedAt } = await saveProjectScenes({
        projectId,
        title: projectTitle,
        description: projectDescription,
        status: projectStatus,
        lifeStage,
        tone,
        creativeProfile,
        scenes,
      });
      setPersistenceReceipt(
        buildPersistenceReceipt({
          storageMode,
          storageLabel: getStorageLabel(storageMode),
          projectId,
          lastSavedAt: savedAt,
          saveStatus: 'saved',
          message: 'Scenes and creative profile saved (explicit action).',
        })
      );
    } catch {
      setError('Could not save project.');
      setPersistenceReceipt((prev) => ({ ...prev, saveStatus: 'error' }));
    } finally {
      setSaving(false);
    }
  }

  const profile = result?.creativeProfile ?? { lifeStage, tone };
  const lastAction = saving
    ? 'Saving project…'
    : result
      ? 'Generated mock script'
      : projectId
        ? 'Editing project'
        : 'Idle';

  return (
    <StudioShell module="Script" lastAction={lastAction} showReceipt={false}>
      <PageMotion>
        <div className="mb-4 flex flex-col gap-4 lg:hidden">
          <CreativeReceipt module="Script" lastAction={lastAction} />
          <PersistenceReceiptCard receipt={persistenceReceipt} />
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project (Phase 3A)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <label className="block space-y-1 text-sm">
                  <span className="text-muted-foreground">Title</span>
                  <input
                    className="w-full rounded-md border border-border bg-muted/30 px-3 py-2 text-sm"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                  />
                </label>
                <label className="block space-y-1 text-sm">
                  <span className="text-muted-foreground">Description</span>
                  <Textarea
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    rows={2}
                  />
                </label>
                <label className="block space-y-1 text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <select
                    className="w-full rounded-md border border-border bg-muted/30 px-3 py-2 text-sm"
                    value={projectStatus}
                    onChange={(e) => setProjectStatus(e.target.value as ProjectStatus)}
                  >
                    <option value="draft">Draft</option>
                    <option value="review">Review</option>
                    <option value="published">Published</option>
                  </select>
                </label>
                {projectId && (
                  <p className="text-xs text-muted-foreground">
                    Project id: <span className="text-foreground">{projectId}</span>
                  </p>
                )}
              </CardContent>
            </Card>

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
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => void handleGenerate()}
                    disabled={loading || !prompt.trim()}
                  >
                    {loading ? 'Generating…' : 'Generate Script'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => void handleSave()}
                    disabled={saving || !projectId || scenes.length === 0}
                  >
                    {saving ? 'Saving…' : 'Save to Project'}
                  </Button>
                </div>
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

          <aside className="hidden space-y-4 lg:block">
            <CreativeDnaCard profile={profile} governance={result?.governance} />
            <PersistenceReceiptCard receipt={persistenceReceipt} />
            <CreativeReceipt module="Script" lastAction={lastAction} />
          </aside>
        </div>
      </PageMotion>
    </StudioShell>
  );
}

export default function ScriptPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading script…</div>}>
      <ScriptPageInner />
    </Suspense>
  );
}
