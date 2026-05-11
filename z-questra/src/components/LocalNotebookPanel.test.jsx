import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import LocalNotebookPanel from './LocalNotebookPanel.jsx';

describe('LocalNotebookPanel', () => {
  it('renders Notes heading and export control', () => {
    render(<LocalNotebookPanel />);
    expect(screen.getByRole('heading', { name: /Z tools → Notes · Local Notebook/i })).toBeTruthy();
    expect(screen.getByTestId('zq-notebook-export')).toBeTruthy();
  });

  it('toggles notebook remember checkbox', () => {
    render(<LocalNotebookPanel />);
    const box = screen.getByTestId('zq-notebook-remember');
    expect(box.checked).toBe(false);
    fireEvent.click(box);
    expect(box.checked).toBe(true);
    fireEvent.click(box);
    expect(box.checked).toBe(false);
  });

  it('offers Import JSON control', () => {
    render(<LocalNotebookPanel />);
    expect(screen.getByTestId('zq-notebook-import')).toBeTruthy();
  });
});
