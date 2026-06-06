import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const AI_SYSTEM_PROMPT = `You are MindTrack AI, a compassionate mental wellness coach specialized in supporting Indian students preparing for competitive exams (JEE, NEET, CUET, CAT, GATE, UPSC). Keep responses concise, empathetic, and actionable.`;

/** Validates the incoming chat request body. */
const chatSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(2000, 'Message too long'),
});

/**
 * POST /api/ai-coach
 * Streams a response from the configured AI provider.
 * Falls back to a generic stream when AI_API_URL / AI_API_KEY are not set.
 *
 * Body: { message: string }
 */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = chatSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { message } = parsed.data;
    const API_URL = process.env.AI_API_URL;
    const API_KEY = process.env.AI_API_KEY;

    // If a real AI provider is configured, proxy to it
    if (API_URL && API_KEY) {
      const aiRes = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            { role: 'system', content: AI_SYSTEM_PROMPT },
            { role: 'user', content: message },
          ],
          stream: true,
        }),
      });

      if (!aiRes.ok) {
        console.error('[ai-coach] upstream error', aiRes.status);
        return NextResponse.json({ error: 'AI service unavailable' }, { status: 502 });
      }

      return new Response(aiRes.body, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    // Fallback: generic mock stream for environments without AI configured
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const reply =
          "I'm MindTrack AI. I'm here to support you through your exam preparation journey. " +
          'Configure AI_API_URL and AI_API_KEY in .env.local to connect a real language model.';

        for (const word of reply.split(' ')) {
          controller.enqueue(encoder.encode(word + ' '));
          await new Promise(resolve => setTimeout(resolve, 40));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error) {
    console.error('[ai-coach POST]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
