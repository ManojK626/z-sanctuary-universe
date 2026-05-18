'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AudioLines,
  Clapperboard,
  Film,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeft,
  PenLine,
  Upload,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const NAV = [
  { href: '/script', label: 'Script', icon: PenLine },
  { href: '/storyboard', label: 'Storyboard', icon: Clapperboard },
  { href: '/edit', label: 'Edit', icon: Film },
  { href: '/audio', label: 'Audio', icon: AudioLines },
  { href: '/publish', label: 'Publish', icon: Upload },
] as const;

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-border/60 bg-black/40 backdrop-blur-md transition-all duration-300',
        collapsed ? 'w-[72px]' : 'w-56'
      )}
    >
      <div className="flex items-center justify-between border-b border-border/40 p-3">
        {!collapsed && (
          <Link href="/" className="text-xs font-semibold uppercase tracking-widest text-gold">
            OMNAI
          </Link>
        )}
        <Button variant="ghost" size="icon" onClick={onToggle} aria-label="Toggle sidebar">
          {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </Button>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-2">
        <Link
          href="/"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-violet/20',
            pathname === '/' && 'bg-violet/30 text-white'
          )}
        >
          <LayoutDashboard className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Dashboard</span>}
        </Link>
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-violet/20',
              pathname === href && 'bg-violet/30 text-white'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{label}</span>}
          </Link>
        ))}
      </nav>
      {!collapsed && (
        <p className="border-t border-border/40 p-3 text-[10px] text-muted-foreground">
          Genesis Core Registry — future pipeline layer (hidden)
        </p>
      )}
    </aside>
  );
}
