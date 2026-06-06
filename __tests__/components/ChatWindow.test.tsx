import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatWindow } from '../../src/components/ai/ChatWindow';

global.fetch = vi.fn(() =>
  Promise.resolve({
    body: {
      getReader: () => {
        let first = true;
        return {
          read: () => {
            if (first) {
              first = false;
              return Promise.resolve({ value: new TextEncoder().encode('Test response'), done: false });
            }
            return Promise.resolve({ done: true });
          }
        };
      }
    }
  })
) as any;

describe('ChatWindow', () => {
  it('renders initial message', () => {
    render(<ChatWindow />);
    expect(screen.getByText(/I am MindTrack AI/i)).toBeDefined();
  });

  it('sends message and displays it', async () => {
    render(<ChatWindow />);
    const input = screen.getByLabelText('Message to AI Coach');
    fireEvent.change(input, { target: { value: 'Hello AI' } });
    fireEvent.click(screen.getByText('Send'));
    
    expect(await screen.findByText('Hello AI')).toBeDefined();
    expect(await screen.findByText('Test response')).toBeDefined();
  });
});
