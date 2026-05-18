export interface GenesisProject {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'review' | 'published';
  updatedAt: string;
}

/** Local stub projects when Supabase is not configured */
export const MOCK_PROJECTS: GenesisProject[] = [
  {
    id: 'proj-aurora',
    title: 'Aurora Gate — Short Film',
    description: 'Cinematic opener for Z-Sanctuary OMNAI narrative shell.',
    status: 'draft',
    updatedAt: '2026-05-16T10:00:00.000Z',
  },
  {
    id: 'proj-echo',
    title: 'Echo Verse — Podcast Pilot',
    description: 'Audio-first creative lane (stub).',
    status: 'draft',
    updatedAt: '2026-05-15T14:30:00.000Z',
  },
  {
    id: 'proj-prism',
    title: 'Prism Atlas — eBook Teaser',
    description: 'Future eBook + poster expansion placeholder.',
    status: 'review',
    updatedAt: '2026-05-14T09:15:00.000Z',
  },
];
