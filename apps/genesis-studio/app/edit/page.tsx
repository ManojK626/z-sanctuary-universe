'use client';

import { StudioShell } from '@/components/studio-shell';
import { PageMotion } from '@/components/page-motion';
import { TimelinePlaceholder } from '@/components/timeline-placeholder';

export default function EditPage() {
  return (
    <StudioShell module="Edit" lastAction="Viewed mock timeline">
      <PageMotion>
        <TimelinePlaceholder />
      </PageMotion>
    </StudioShell>
  );
}
