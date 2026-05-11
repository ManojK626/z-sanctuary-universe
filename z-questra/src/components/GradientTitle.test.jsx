import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import GradientTitle from './GradientTitle.jsx';

describe('GradientTitle', () => {
  it('renders children', () => {
    render(
      <GradientTitle as="h2" variant="platform">
        Z-QUESTRA
      </GradientTitle>,
    );
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Z-QUESTRA');
  });
});
