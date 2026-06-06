import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import JournalEntry from '@/models/JournalEntry';
import { getSession } from '@/lib/auth';
import { journalSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

/**
 * POST /api/journal
 * Creates a new journal entry for the authenticated user.
 * Body is validated with Zod; invalid payloads return 400 with field-level errors.
 */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = journalSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();
    const entry = await JournalEntry.create({ userId: session.id, ...parsed.data });
    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error('[journal POST]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * GET /api/journal
 * Returns the 50 most recent journal entries for the authenticated user,
 * sorted by newest first.
 */
export async function GET(_request: Request) {
  const session = await getSession();
  if (!session?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const entries = await JournalEntry.find({ userId: session.id })
      .sort({ createdAt: -1 })
      .limit(50);
    return NextResponse.json(entries, { status: 200 });
  } catch (error) {
    console.error('[journal GET]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
