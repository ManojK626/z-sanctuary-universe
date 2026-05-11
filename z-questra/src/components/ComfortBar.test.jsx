import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import ComfortBar from './ComfortBar.jsx';
import { DEFAULT_COMFORT_PREFS } from '../theme/accessibilityPrefs.js';

describe('ComfortBar', () => {
  it('invokes onChange when XL text size chosen', () => {
    const onChange = vi.fn();
    render(<ComfortBar prefs={DEFAULT_COMFORT_PREFS} onChange={onChange} />);
    const textGroup = screen.getByTestId('zq-comfort-text-size');
    fireEvent.click(within(textGroup).getByRole('button', { name: /^XL$/i }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toMatchObject({ textSize: 'xl' });
  });

  it('invokes onChange for dyslexia-friendly reading mode', () => {
    const onChange = vi.fn();
    render(<ComfortBar prefs={DEFAULT_COMFORT_PREFS} onChange={onChange} />);
    const readingGroup = screen.getByTestId('zq-comfort-reading');
    fireEvent.click(within(readingGroup).getByRole('button', { name: /Dyslexia-friendly/i }));
    expect(onChange.mock.calls[0][0]).toMatchObject({ reading: 'dyslexia' });
  });
});
