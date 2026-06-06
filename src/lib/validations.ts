import { z } from 'zod';

/**
 * Schema for validating mood log submissions.
 * All numeric fields are integers in 1-5 range (1=lowest, 5=highest).
 */
export const moodSchema = z.object({
  mood: z.number().int().min(1).max(5),
  energy: z.number().int().min(1).max(5),
  anxiety: z.number().int().min(1).max(5),
  triggers: z.array(z.string().max(50)).max(10).default([]),
  note: z.string().max(500).optional(),
  subject: z.string().max(100).optional(),
  examContext: z.string().max(50).optional(),
});

/**
 * Schema for validating journal entry submissions.
 * Content is required; all other fields are optional metadata.
 */
export const journalSchema = z.object({
  content: z.string().min(1, 'Content cannot be empty').max(5000, 'Content too long'),
  prompt: z.string().max(200).optional(),
  sentiment: z.number().min(-1).max(1).optional(),
  tags: z.array(z.string().max(30)).max(10).default([]),
});

/**
 * Schema for user registration requests.
 * Enforces minimum password strength and valid email format.
 */
export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long'),
});

/**
 * Schema for user login requests.
 */
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type MoodPayload = z.infer<typeof moodSchema>;
export type JournalPayload = z.infer<typeof journalSchema>;
export type RegisterPayload = z.infer<typeof registerSchema>;
export type LoginPayload = z.infer<typeof loginSchema>;
