'use client';

import { Sparkles } from 'lucide-react';

export function StudioHeader() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 bg-black/30 px-6 py-4 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <Sparkles className="h-6 w-6 text-gold" />
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Genesis Studio</h1>
          <p className="text-xs text-muted-foreground">Z-Sanctuary OMNAI Creative Engine shell</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <span className="rounded-full border border-border/60 bg-muted/30 px-3 py-1">
          Project status: <strong className="text-gold">Draft</strong>
        </span>
        <span className="rounded-full border border-violet/40 bg-violet/10 px-3 py-1 text-violet-200">
          Governance: <strong>Human Review Required</strong>
        </span>
      </div>
    </header>
  );
}
