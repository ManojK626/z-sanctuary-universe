'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FUTURE_ENGINE_COMPAT,
  getLifeStageLabel,
  getToneLabel,
  type CreativeProfile,
  type ScriptGovernance,
} from '@/lib/creative-profile';
import { Dna } from 'lucide-react';

interface CreativeDnaCardProps {
  profile: CreativeProfile;
  governance?: ScriptGovernance;
}

export function CreativeDnaCard({ profile, governance }: CreativeDnaCardProps) {
  return (
    <Card className="border-gold/25 bg-gradient-to-br from-violet/10 to-transparent">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base text-gold">
          <Dna className="h-4 w-4" />
          Creative DNA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <span className="text-xs text-muted-foreground">Life-stage</span>
            <p className="font-medium">{getLifeStageLabel(profile.lifeStage)}</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Tone</span>
            <p className="font-medium">{getToneLabel(profile.tone)}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-border/60 bg-muted/30 px-2 py-0.5">
            Provider: stub only
          </span>
          <span className="rounded-full border border-violet/40 bg-violet/10 px-2 py-0.5 text-violet-200">
            Governance: human review required
          </span>
          {governance?.drpSafe && (
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-emerald-200/90">
              DRP: safe placeholder
            </span>
          )}
        </div>
        <div>
          <p className="mb-1 text-xs text-muted-foreground">Future engine compatibility</p>
          <ul className="flex flex-wrap gap-1">
            {FUTURE_ENGINE_COMPAT.map((engine) => (
              <li
                key={engine}
                className="rounded border border-border/50 bg-black/20 px-2 py-0.5 text-[10px] text-muted-foreground"
              >
                {engine}
              </li>
            ))}
          </ul>
        </div>
        {/* Phase 2+: emotionalIntensity, pacingStyle, audienceMode */}
      </CardContent>
    </Card>
  );
}
