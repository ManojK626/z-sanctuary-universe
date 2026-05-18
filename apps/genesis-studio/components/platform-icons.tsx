'use client';

import { Button } from '@/components/ui/button';
import { Instagram, Mic2, Music2, Youtube } from 'lucide-react';

const PLATFORMS = [
  { id: 'youtube', label: 'YouTube', icon: Youtube },
  { id: 'tiktok', label: 'TikTok', icon: Music2 },
  { id: 'instagram', label: 'Instagram', icon: Instagram },
  { id: 'podcast', label: 'Podcast', icon: Mic2 },
] as const;

export function PlatformIcons() {
  return (
    <div className="flex flex-wrap gap-3">
      {PLATFORMS.map(({ id, label, icon: Icon }) => (
        <Button
          key={id}
          type="button"
          variant="outline"
          className="gap-2"
          onClick={() => {
            // Stub: future export routing per platform after human review
          }}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Button>
      ))}
    </div>
  );
}
