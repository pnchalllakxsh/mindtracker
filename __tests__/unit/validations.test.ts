import { describe, it, expect } from 'vitest';
import { moodSchema, journalSchema, registerSchema, loginSchema } from '../../src/lib/validations';

describe('moodSchema', () => {
  it('accepts a fully valid mood entry', () => {
    const data = { mood: 4, energy: 3, anxiety: 2, triggers: ['Study Pressure'], note: 'Feeling okay' };
    expect(moodSchema.safeParse(data).success).toBe(true);
  });

  it('accepts minimum valid mood entry (required fields only)', () => {
    const data = { mood: 1, energy: 1, anxiety: 1 };
    expect(moodSchema.safeParse(data).success).toBe(true);
  });

  it('defaults triggers to empty array when not provided', () => {
    const data = { mood: 3, energy: 3, anxiety: 3 };
    const result = moodSchema.safeParse(data);
    expect(result.success).toBe(true);
    expect(result.data?.triggers).toEqual([]);
  });

  it('rejects mood value above max (6)', () => {
    expect(moodSchema.safeParse({ mood: 6, energy: 3, anxiety: 2 }).success).toBe(false);
  });

  it('rejects mood value below min (0)', () => {
    expect(moodSchema.safeParse({ mood: 0, energy: 3, anxiety: 2 }).success).toBe(false);
  });

  it('rejects non-integer mood values', () => {
    expect(moodSchema.safeParse({ mood: 3.5, energy: 3, anxiety: 2 }).success).toBe(false);
  });

  it('rejects triggers array exceeding 10 items', () => {
    const triggers = Array.from({ length: 11 }, (_, i) => `trigger${i}`);
    expect(moodSchema.safeParse({ mood: 3, energy: 3, anxiety: 3, triggers }).success).toBe(false);
  });

  it('rejects a trigger string exceeding 50 chars', () => {
    const longTrigger = 'a'.repeat(51);
    expect(moodSchema.safeParse({ mood: 3, energy: 3, anxiety: 3, triggers: [longTrigger] }).success).toBe(false);
  });

  it('rejects missing required fields', () => {
    expect(moodSchema.safeParse({ mood: 3 }).success).toBe(false);
    expect(moodSchema.safeParse({}).success).toBe(false);
  });
});

describe('journalSchema', () => {
  it('accepts a valid journal entry', () => {
    const data = { content: 'Feeling stressed but okay.', tags: ['study'] };
    expect(journalSchema.safeParse(data).success).toBe(true);
  });

  it('rejects empty content', () => {
    expect(journalSchema.safeParse({ content: '' }).success).toBe(false);
  });

  it('rejects content exceeding 5000 chars', () => {
    expect(journalSchema.safeParse({ content: 'a'.repeat(5001) }).success).toBe(false);
  });

  it('defaults tags to empty array when not provided', () => {
    const result = journalSchema.safeParse({ content: 'Hello' });
    expect(result.success).toBe(true);
    expect(result.data?.tags).toEqual([]);
  });

  it('rejects sentiment outside -1 to 1 range', () => {
    expect(journalSchema.safeParse({ content: 'Hi', sentiment: 1.5 }).success).toBe(false);
    expect(journalSchema.safeParse({ content: 'Hi', sentiment: -1.1 }).success).toBe(false);
  });
});

describe('registerSchema', () => {
  it('accepts valid registration data', () => {
    const data = { name: 'Alice', email: 'alice@test.com', password: 'securepassword' };
    expect(registerSchema.safeParse(data).success).toBe(true);
  });

  it('rejects invalid email format', () => {
    expect(registerSchema.safeParse({ name: 'A', email: 'bad-email', password: 'password123' }).success).toBe(false);
  });

  it('rejects password shorter than 8 characters', () => {
    expect(registerSchema.safeParse({ name: 'A', email: 'a@b.com', password: 'short' }).success).toBe(false);
  });

  it('rejects empty name', () => {
    expect(registerSchema.safeParse({ name: '', email: 'a@b.com', password: 'password123' }).success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('accepts valid login credentials', () => {
    expect(loginSchema.safeParse({ email: 'a@b.com', password: 'anything' }).success).toBe(true);
  });

  it('rejects invalid email', () => {
    expect(loginSchema.safeParse({ email: 'bad', password: 'pass' }).success).toBe(false);
  });

  it('rejects empty password', () => {
    expect(loginSchema.safeParse({ email: 'a@b.com', password: '' }).success).toBe(false);
  });
});
