import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import ReceiptPoster from './ReceiptPoster.jsx';

describe('ReceiptPoster', () => {
  it('renders poster copy and download controls', () => {
    render(
      <ReceiptPoster
        notebookMeta={{ pageCount: 3, highlightTones: ['mint'], firstPageTitle: 'Lab' }}
        ageMode="kids"
      />,
    );
    expect(screen.getByTestId('zq-receipt-poster')).toBeTruthy();
    expect(screen.getByTestId('zq-receipt-download-svg')).toBeTruthy();
    expect(screen.getByTestId('zq-receipt-download-png')).toBeTruthy();
    expect(screen.getByText(/Local session receipt/i)).toBeTruthy();
    expect(screen.getByText(/mint/)).toBeTruthy();
  });
});
