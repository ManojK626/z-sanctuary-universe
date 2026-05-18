'use client';

import { useState } from 'react';
import { StudioShell } from '@/components/studio-shell';
import { PageMotion } from '@/components/page-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pause, Play, Upload } from 'lucide-react';

const TRACKS = ['Voiceover', 'Music', 'Effects'] as const;

export default function AudioPage() {
  const [playing, setPlaying] = useState(false);

  return (
    <StudioShell module="Audio" lastAction="Viewed track placeholders">
      <PageMotion>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="gap-2" type="button">
            <Upload className="h-4 w-4" />
            Upload audio (placeholder)
          </Button>
          <Button
            variant="default"
            className="gap-2"
            type="button"
            onClick={() => setPlaying((p) => !p)}
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {playing ? 'Pause' : 'Play'}
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {TRACKS.map((track) => (
            <Card key={track}>
              <CardHeader>
                <CardTitle className="text-base">{track}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                No audio loaded — stub waveform lane.
              </CardContent>
            </Card>
          ))}
        </div>
      </PageMotion>
    </StudioShell>
  );
}
