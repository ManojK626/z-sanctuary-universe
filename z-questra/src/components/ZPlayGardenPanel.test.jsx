import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import ZPlayGardenPanel from './ZPlayGardenPanel.jsx';

const meta = { pageCount: 2, highlightTones: ['gold'], firstPageTitle: 'Study' };
const comfort = { motion: 'full', brightness: 'standard' };

describe('ZPlayGardenPanel', () => {
  it('renders PlayGarden, kaleidoscope, receipt, and badges', () => {
    render(<ZPlayGardenPanel notebookMeta={meta} comfort={comfort} ageMode="adults" />);
    expect(screen.getByTestId('zq-play-garden-panel')).toBeTruthy();
    expect(screen.getByTestId('zq-uncertainty-kaleidoscope')).toBeTruthy();
    expect(screen.getByTestId('zq-receipt-poster')).toBeTruthy();
    expect(screen.getByTestId('zq-badge-studio')).toBeTruthy();
    expect(screen.getByRole('heading', { name: /Z PlayGarden/i })).toBeTruthy();
  });
});
