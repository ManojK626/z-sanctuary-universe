'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { StudioShell } from '@/components/studio-shell';
import { ProjectCard } from '@/components/project-card';
import { Button } from '@/components/ui/button';
import { MOCK_PROJECTS } from '@/lib/mock-projects';
import { PageMotion } from '@/components/page-motion';

export default function DashboardPage() {
  return (
    <StudioShell module="Dashboard" lastAction="Viewed project list (stub)">
      <PageMotion>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Projects</h2>
            <p className="text-sm text-muted-foreground">
              OMNAI Creative Studio — movies, songs, eBooks, and media lanes (future).
            </p>
          </div>
          <Button
            variant="gold"
            className="gap-2"
            onClick={() => {
              // Stub: future create project via Supabase after auth
            }}
          >
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {MOCK_PROJECTS.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
        <motion.p
          className="text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Supabase: configure env vars to load real projects. Until then, mock list only.
        </motion.p>
      </PageMotion>
    </StudioShell>
  );
}
