'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { GenesisProject } from '@/lib/mock-projects';

interface ProjectCardProps {
  project: GenesisProject;
  index: number;
  onOpen?: () => void;
}

export function ProjectCard({ project, index, onOpen }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
    >
      <Card
        className="hover:border-violet/50 transition-colors cursor-pointer"
        onClick={onOpen}
        onKeyDown={(e) => {
          if (onOpen && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onOpen();
          }
        }}
        role={onOpen ? 'button' : undefined}
        tabIndex={onOpen ? 0 : undefined}
      >
        <CardHeader>
          <CardTitle className="text-base">{project.title}</CardTitle>
          <CardDescription>{project.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-between text-xs text-muted-foreground">
          <span className="capitalize rounded bg-muted/40 px-2 py-0.5">{project.status}</span>
          <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
        </CardContent>
      </Card>
    </motion.div>
  );
}
