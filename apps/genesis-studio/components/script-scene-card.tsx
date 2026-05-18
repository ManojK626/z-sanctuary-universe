'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ScriptScene } from '@/lib/creative-profile';
import { ArrowDown, ArrowUp, GripVertical } from 'lucide-react';

interface ScriptSceneCardProps {
  scene: ScriptScene;
  index: number;
  total: number;
  onChange: (updated: ScriptScene) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function ScriptSceneCard({
  scene,
  index,
  total,
  onChange,
  onMoveUp,
  onMoveDown,
}: ScriptSceneCardProps) {
  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground" aria-hidden />
          <CardTitle className="text-sm text-gold">Scene {index + 1}</CardTitle>
        </div>
        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={index === 0}
            onClick={onMoveUp}
            aria-label="Move scene up"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={index >= total - 1}
            onClick={onMoveDown}
            aria-label="Move scene down"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <input
          className="w-full rounded-md border border-border bg-muted/30 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet"
          value={scene.title}
          onChange={(e) => onChange({ ...scene, title: e.target.value })}
          aria-label="Scene title"
        />
        <Textarea
          value={scene.body}
          onChange={(e) => onChange({ ...scene, body: e.target.value })}
          className="min-h-[100px] font-mono text-xs"
          aria-label="Scene body"
        />
        <p className="text-[10px] text-muted-foreground">
          Reorder placeholder — local edit only; Supabase sync in a future phase.
        </p>
      </CardContent>
    </Card>
  );
}
