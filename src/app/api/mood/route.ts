import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import MoodEntry from '@/models/MoodEntry';
import { getSession } from '@/lib/auth';
import { moodSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

/**
 * POST /api/mood
 * Creates a new mood log entry for the authenticated user.
 * Body is validated with Zod; invalid payloads return 400 with field-level errors.
 */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = moodSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();
    const entry = await MoodEntry.create({ userId: session.id, ...parsed.data });
    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error('[mood POST]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * GET /api/mood
 * Returns the 30 most recent mood entries for the authenticated user,
 * sorted by newest first.
 */
export async function GET(_request: Request) {
  const session = await getSession();
  if (!session?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const entries = await MoodEntry.find({ userId: session.id })
      .sort({ createdAt: -1 })
      .limit(30);
    return NextResponse.json(entries, { status: 200 });
  } catch (error) {
    console.error('[mood GET]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
