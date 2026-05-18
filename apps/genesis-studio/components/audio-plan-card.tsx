'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { GenerateAudioPlanResponse } from '@/lib/audio-profile';
import {
  getNarrationStyleLabel,
  getSoundtrackMoodLabel,
  type NarrationStyleId,
  type SoundtrackMoodId,
} from '@/lib/audio-profile';
import { Headphones, RefreshCw, Shield } from 'lucide-react';

interface AudioPlanCardProps {
  plan: GenerateAudioPlanResponse;
  sceneTitle?: string;
  sceneExcerpt?: string;
  onRegenPlaceholder?: () => void;
}

export function AudioPlanCard({
  plan,
  sceneTitle,
  sceneExcerpt,
  onRegenPlaceholder,
}: AudioPlanCardProps) {
  const narrationLabel = getNarrationStyleLabel(plan.narrationStyle as NarrationStyleId);
  const moodLabel = getSoundtrackMoodLabel(plan.soundtrackMood as SoundtrackMoodId);

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Headphones className="h-4 w-4 text-gold" />
          {sceneTitle ?? `Scene ${plan.sceneId}`}
        </CardTitle>
        {sceneExcerpt && (
          <p className="line-clamp-2 text-xs text-muted-foreground">{sceneExcerpt}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Narration: {narrationLabel} · Soundtrack: {moodLabel}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <ul className="space-y-2">
          {plan.cues.map((cue) => (
            <li
              key={cue.id}
              className="rounded-md border border-border/50 bg-muted/20 px-3 py-2 text-xs"
            >
              <div className="flex justify-between gap-2 font-medium text-gold/90">
                <span>{cue.label}</span>
                <span className="capitalize text-muted-foreground">{cue.type}</span>
              </div>
              <p className="mt-1 text-muted-foreground">{cue.timingHint}</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground/80">{cue.notes}</p>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-1">
          <span className="inline-flex items-center gap-1 rounded-full border border-border/50 bg-muted/30 px-2 py-0.5 text-[10px]">
            <Shield className="h-3 w-3" />
            {plan.providerStatus}
          </span>
          {plan.humanReviewRequired && (
            <span className="rounded-full border border-violet/40 bg-violet/10 px-2 py-0.5 text-[10px] text-violet-200">
              Human review
            </span>
          )}
          {plan.drpSafe && (
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
          title="Regenerate plan — stub only until audio provider charter"
        >
          <RefreshCw className="h-3 w-3" />
          Regenerate plan (placeholder)
        </Button>
      </CardFooter>
    </Card>
  );
}
