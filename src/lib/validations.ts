import { z } from 'zod';

export const moodSchema = z.object({
  mood: z.number().int().min(1).max(5),
  energy: z.number().int().min(1).max(5),
  anxiety: z.number().int().min(1).max(5),
  triggers: z.array(z.string().max(50)).max(10).default([]),
  note: z.string().max(500).optional(),
  subject: z.string().max(100).optional(),
  examContext: z.string().max(50).optional(),
});

export const journalSchema = z.object({
  content: z.string().min(1).max(5000),
  prompt: z.string().optional(),
  sentiment: z.number().min(-1).max(1).optional(),
  tags: z.array(z.string().max(30)).max(10).default([]),
});
