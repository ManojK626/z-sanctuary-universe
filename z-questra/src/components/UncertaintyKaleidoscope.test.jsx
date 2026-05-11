import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import UncertaintyKaleidoscope from './UncertaintyKaleidoscope.jsx';

describe('UncertaintyKaleidoscope', () => {
  it('renders canvas and control buttons', () => {
    render(<UncertaintyKaleidoscope comfort={{ motion: 'full', brightness: 'standard' }} />);
    expect(screen.getByTestId('zq-kaleidoscope-canvas')).toBeTruthy();
    expect(screen.getByTestId('zq-kaleido-random-wild')).toBeTruthy();
    fireEvent.click(screen.getByTestId('zq-kaleido-pattern-star'));
    fireEvent.click(screen.getByTestId('zq-kaleido-shuffle'));
    expect(screen.getByText(/visual learning toy/i)).toBeTruthy();
  });
});
