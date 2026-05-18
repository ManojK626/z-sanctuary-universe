'use client';

import { useState, type ReactNode } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { StudioHeader } from '@/components/studio-header';
import { CreativeReceipt } from '@/components/creative-receipt';

interface StudioShellProps {
  children: ReactNode;
  module: string;
  lastAction: string;
  showReceipt?: boolean;
}

export function StudioShell({
  children,
  module,
  lastAction,
  showReceipt = true,
}: StudioShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-studio-gradient text-foreground">
      <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <StudioHeader />
        <main className="flex flex-1 gap-6 p-6">
          <div className="min-w-0 flex-1">{children}</div>
          {showReceipt && (
            <aside className="hidden w-64 shrink-0 lg:block">
              <CreativeReceipt module={module} lastAction={lastAction} />
            </aside>
          )}
        </main>
      </div>
    </div>
  );
}
