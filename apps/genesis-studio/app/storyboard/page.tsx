'use client';

import { StudioShell } from '@/components/studio-shell';
import { PageMotion } from '@/components/page-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ImagePlus } from 'lucide-react';

const FRAMES = [1, 2, 3, 4, 5, 6];

export default function StoryboardPage() {
  return (
    <StudioShell module="Storyboard" lastAction="Viewed empty frame grid">
      <PageMotion>
        <div className="flex justify-end">
          <Button variant="outline" className="gap-2" type="button">
            <ImagePlus className="h-4 w-4" />
            Upload frame (placeholder)
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FRAMES.map((n) => (
            <Card key={n} className="aspect-video">
              <CardContent className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Frame {n} — No frames yet
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground">No frames yet</p>
      </PageMotion>
    </StudioShell>
  );
}
