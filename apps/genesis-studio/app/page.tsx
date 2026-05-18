'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { StudioShell } from '@/components/studio-shell';
import { ProjectCard } from '@/components/project-card';
import { PersistenceReceiptCard } from '@/components/persistence-receipt-card';
import { Button } from '@/components/ui/button';
import { PageMotion } from '@/components/page-motion';
import {
  buildPersistenceReceipt,
  createProject,
  getStorageLabel,
  listProjects,
  setActiveProjectId,
  type GenesisProjectRecord,
  type PersistenceReceipt,
  type StorageMode,
} from '@/lib/projects';

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<GenesisProjectRecord[]>([]);
  const [storageMode, setStorageMode] = useState<StorageMode>('mock');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [receipt, setReceipt] = useState<PersistenceReceipt>(
    buildPersistenceReceipt({ storageMode: 'mock' })
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    const { projects: list, storageMode: mode } = await listProjects();
    setProjects(list);
    setStorageMode(mode);
    setReceipt(
      buildPersistenceReceipt({
        storageMode: mode,
        storageLabel: getStorageLabel(mode),
        saveStatus: 'idle',
      })
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function handleNewProject() {
    setCreating(true);
    try {
      const { project, storageMode: mode } = await createProject();
      setStorageMode(mode);
      setReceipt(
        buildPersistenceReceipt({
          storageMode: mode,
          storageLabel: getStorageLabel(mode),
          projectId: project.id,
          lastSavedAt: project.updatedAt,
          saveStatus: 'saved',
          message: 'Draft project created. Open Script to generate and save scenes.',
        })
      );
      await refresh();
      router.push(`/script?projectId=${encodeURIComponent(project.id)}`);
    } finally {
      setCreating(false);
    }
  }

  function openProject(projectId: string) {
    setActiveProjectId(projectId);
    router.push(`/script?projectId=${encodeURIComponent(projectId)}`);
  }

  const lastAction = loading
    ? 'Loading projects…'
    : creating
      ? 'Creating draft project…'
      : `Viewed ${projects.length} project(s)`;

  return (
    <StudioShell module="Dashboard" lastAction={lastAction} showReceipt={false}>
      <PageMotion>
        <motion.div className="mb-4 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <PersistenceReceiptCard receipt={receipt} />
        </motion.div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl font-semibold">Projects</h2>
            <p className="text-sm text-muted-foreground">
              OMNAI Creative Studio — governed project persistence (Phase 3A).
            </p>
          </motion.div>
          <Button
            variant="gold"
            className="gap-2"
            disabled={creating}
            onClick={() => void handleNewProject()}
          >
            <Plus className="h-4 w-4" />
            {creating ? 'Creating…' : 'New Project'}
          </Button>
        </div>

        <motion.p
          className="mt-3 rounded-md border border-border/60 bg-muted/20 px-3 py-2 text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="font-medium text-foreground">Storage: </span>
          {getStorageLabel(storageMode)}
        </motion.p>

        {loading ? (
          <p className="mt-8 text-sm text-muted-foreground">Loading projects…</p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {projects.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                onOpen={() => openProject(project.id)}
              />
            ))}
          </div>
        )}

        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_280px]">
          <motion.p
            className="text-xs text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            RLS: Supabase rows require <code className="text-foreground">auth.uid() = user_id</code>
            . Sign in via Supabase Auth when env is configured. Saves occur only on explicit action
            in Script — no background sync.
          </motion.p>
          <aside className="hidden lg:block">
            <PersistenceReceiptCard receipt={receipt} />
          </aside>
        </div>
      </PageMotion>
    </StudioShell>
  );
}
