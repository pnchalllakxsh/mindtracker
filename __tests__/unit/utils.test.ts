import { describe, it, expect } from 'vitest';
import { cn } from '../../src/lib/utils';

describe('cn utility', () => {
  it('merges tailwind classes correctly', () => {
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
    expect(cn('px-2 py-1', 'p-4')).toBe('p-4');
  });
});
