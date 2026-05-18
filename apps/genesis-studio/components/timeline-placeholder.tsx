'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TRACKS = ['Video', 'Voice', 'Music', 'Effects'] as const;

export function TimelinePlaceholder() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Timeline (mock)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">
          Placeholder for react-timeline-editor — no real media engine wired.
        </p>
        {TRACKS.map((track) => (
          <div key={track} className="space-y-1">
            <div className="text-xs font-medium text-gold/90">{track}</div>
            <div className="h-10 rounded-md border border-dashed border-border/80 bg-muted/20" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
