import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ZMusicPanel from './ZMusicPanel.jsx';

describe('ZMusicPanel', () => {
  it('renders SME title and mode pills', () => {
    render(<ZMusicPanel ageMode="adults" />);
    expect(screen.getByRole('heading', { name: /Music Engine \(SME v1\.1\)/i }).textContent).toMatch(/v1\.1/);
    expect(screen.getByRole('button', { name: /ALIGNMENT/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /POWER/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /JOURNEY/i })).toBeTruthy();
  });

  it('logs mode selection to observer memory when pill clicked', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    render(<ZMusicPanel ageMode="adults" />);
    screen.getByRole('button', { name: /POWER/i }).click();
    expect(setItem).toHaveBeenCalled();
    setItem.mockRestore();
  });
});
