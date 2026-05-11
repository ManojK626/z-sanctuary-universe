import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import ZZebrasFamilyPanel from './ZZebrasFamilyPanel.jsx';

describe('ZZebrasFamilyPanel', () => {
  it('shows local-only inspector disclaimer', () => {
    render(<ZZebrasFamilyPanel />);
    expect(screen.getByText(/Local inspector preview only/i)).toBeTruthy();
    expect(screen.getByText(/No certification/i)).toBeTruthy();
  });

  it('lists AT Love Zebra heading', () => {
    render(<ZZebrasFamilyPanel />);
    expect(screen.getByRole('heading', { name: /AT Love Zebra/i })).toBeTruthy();
  });
});
