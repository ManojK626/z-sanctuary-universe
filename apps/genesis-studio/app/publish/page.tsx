'use client';

import { StudioShell } from '@/components/studio-shell';
import { PageMotion } from '@/components/page-motion';
import { PlatformIcons } from '@/components/platform-icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function PublishPage() {
  return (
    <StudioShell module="Publish" lastAction="Viewed export placeholders">
      <PageMotion>
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardHeader className="flex flex-row items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            <CardTitle className="text-base">Human review required</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Export requires human review before publishing. No live platform APIs in this shell.
          </CardContent>
        </Card>
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gold">Target platforms (stub)</h3>
          <PlatformIcons />
        </div>
        <Button variant="gold" type="button">
          Export (placeholder)
        </Button>
      </PageMotion>
    </StudioShell>
  );
}
