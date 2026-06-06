import { describe, it, expect } from 'vitest';
import { moodSchema, journalSchema } from '../../src/lib/validations';

describe('validations', () => {
  describe('moodSchema', () => {
    it('validates a correct mood entry', () => {
      const data = { mood: 4, energy: 3, anxiety: 2, triggers: ['Study Pressure'] };
      const result = moodSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('rejects invalid mood values', () => {
      const data = { mood: 6, energy: 3, anxiety: 2 };
      const result = moodSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('journalSchema', () => {
    it('validates a correct journal entry', () => {
      const data = { content: 'Feeling stressed but okay.', tags: ['study'] };
      const result = journalSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('rejects empty content', () => {
      const data = { content: '' };
      const result = journalSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });
});
