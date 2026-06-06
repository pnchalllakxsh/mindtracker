import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MoodSelector } from '../../src/components/mood/MoodSelector';

global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true }),
  })
) as any;

describe('MoodSelector', () => {
  it('renders mood buttons', () => {
    render(<MoodSelector />);
    expect(screen.getByLabelText(/Mood: Excellent/i)).toBeDefined();
  });

  it('submits form when mood is selected', async () => {
    render(<MoodSelector />);
    fireEvent.click(screen.getByLabelText(/Mood: Good/i));
    fireEvent.click(screen.getByTestId('submit-mood'));
    
    const successMsg = await screen.findByTestId('success-message');
    expect(successMsg).toBeDefined();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
