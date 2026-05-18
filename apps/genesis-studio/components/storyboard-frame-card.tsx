'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { GenerateStoryboardResponse } from '@/lib/storyboard-profile';
import { getStylePresetLabel, type StylePresetId } from '@/lib/storyboard-profile';
import { RefreshCw, Shield } from 'lucide-react';

interface StoryboardFrameCardProps {
  frame: GenerateStoryboardResponse;
  sceneTitle?: string;
  onRegenPlaceholder?: () => void;
}

export function StoryboardFrameCard({
  frame,
  sceneTitle,
  onRegenPlaceholder,
}: StoryboardFrameCardProps) {
  const presetLabel = getStylePresetLabel(frame.stylePreset as StylePresetId);
  const excerpt =
    sceneTitle ?? frame.promptPreview.split('scene=')[1]?.slice(0, 80) ?? 'Scene excerpt';

  return (
    <Card className="overflow-hidden border-border/60">
      <div
        className="aspect-video w-full bg-gradient-to-br from-violet-900/40 via-black to-amber-900/20"
        role="img"
        aria-label="Mock storyboard frame placeholder"
      />
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-2 text-sm">{excerpt}</CardTitle>
        <p className="text-xs text-muted-foreground">Style: {presetLabel}</p>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-[10px] font-mono text-muted-foreground line-clamp-3">
          {frame.promptPreview}
        </p>
        <div className="flex flex-wrap gap-1">
          <span className="inline-flex items-center gap-1 rounded-full border border-border/50 bg-muted/30 px-2 py-0.5 text-[10px]">
            <Shield className="h-3 w-3" />
            {frame.providerStatus}
          </span>
          {frame.humanReviewRequired && (
            <span className="rounded-full border border-violet/40 bg-violet/10 px-2 py-0.5 text-[10px] text-violet-200">
              Human review
            </span>
          )}
          {frame.drpSafe && (
            <span className="rounded-full border border-emerald-500/30 px-2 py-0.5 text-[10px] text-emerald-200/80">
              DRP safe
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full gap-2"
          onClick={onRegenPlaceholder}
          disabled
          title="Regenerate — stub only until Replicate charter"
        >
          <RefreshCw className="h-3 w-3" />
          Regen (placeholder)
        </Button>
      </CardFooter>
    </Card>
  );
}
