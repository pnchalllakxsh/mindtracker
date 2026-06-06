import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExamCountdown } from '../../src/components/exam/ExamCountdown';

describe('ExamCountdown', () => {
  it('renders correctly', () => {
    render(<ExamCountdown />);
    expect(screen.getByText('Exam Countdown')).toBeDefined();
  });
});
