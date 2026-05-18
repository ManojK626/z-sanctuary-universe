'use client';

import { useState } from 'react';
import { StudioShell } from '@/components/studio-shell';
import { PageMotion } from '@/components/page-motion';
import { CreativeReceipt } from '@/components/creative-receipt';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GeneratedScript {
  title: string;
  logline: string;
  scenes: { title: string; body: string }[];
}

export default function ScriptPage() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState<GeneratedScript | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error('Stub API failed');
      const data = (await res.json()) as GeneratedScript;
      setScript(data);
    } catch {
      setError('Could not generate mock script.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <StudioShell module="Script" lastAction={script ? 'Generated mock script' : 'Idle'}>
      <PageMotion>
        <div className="lg:hidden mb-4">
          <CreativeReceipt module="Script" lastAction={script ? 'Generated mock script' : 'Idle'} />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Script writer (stub)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Describe your scene, tone, or OMNAI narrative seed…"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Button onClick={handleGenerate} disabled={loading || !prompt.trim()}>
              {loading ? 'Generating…' : 'Generate Script'}
            </Button>
            {error && <p className="text-sm text-red-400">{error}</p>}
          </CardContent>
        </Card>
        {script && (
          <Card className="border-violet/30">
            <CardHeader>
              <CardTitle>{script.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{script.logline}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {script.scenes.map((scene, i) => (
                <div key={i} className="rounded-lg border border-border/50 bg-muted/20 p-4">
                  <h4 className="font-medium text-gold">{scene.title}</h4>
                  <p className="mt-2 whitespace-pre-wrap text-sm">{scene.body}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </PageMotion>
    </StudioShell>
  );
}
