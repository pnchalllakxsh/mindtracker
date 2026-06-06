import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

const AI_SYSTEM_PROMPT = `You are MindTrack AI, a compassionate mental wellness coach specialized in supporting Indian students preparing for competitive exams (JEE, NEET, CUET, CAT, GATE, UPSC).`;

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { message } = await request.json();
    if (!message) return NextResponse.json({ error: "Message is required" }, { status: 400 });

    const API_URL = process.env.AI_API_URL || 'https://api.example.com/v1/chat/completions';
    const API_KEY = process.env.AI_API_KEY || '';

    // Generic Mock Stream for UI testing without specific AI
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const words = "I'm your generic MindTrack AI Coach. I'm here to listen and help you manage your study stress! (Configure AI_API_URL and AI_API_KEY in .env.local to connect a real model)".split(' ');
        
        for (const word of words) {
          controller.enqueue(encoder.encode(word + ' '));
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        controller.close();
      }
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error) {
    console.error("[ai-coach POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
