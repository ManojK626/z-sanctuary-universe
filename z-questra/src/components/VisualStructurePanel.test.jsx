import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import VisualStructurePanel from './VisualStructurePanel.jsx';

describe('VisualStructurePanel', () => {
  it('shows local-only disclaimer', () => {
    render(<VisualStructurePanel />);
    expect(screen.getByText(/local UI only/i)).toBeTruthy();
    expect(screen.getByText(/does not call external/i)).toBeTruthy();
  });
});
