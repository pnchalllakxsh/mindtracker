import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import MoodEntry from '@/models/MoodEntry';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/insights
 * Computes mood analytics for the authenticated user over the last 30 days.
 *
 * Returns:
 * - averageMood: mean mood score (1-5), rounded to 2 decimal places
 * - averageEnergy: mean energy score (1-5)
 * - averageAnxiety: mean anxiety score (1-5)
 * - totalEntries: number of mood logs in the period
 * - trends: raw array of entries sorted oldest-to-newest (for chart rendering)
 */
export async function GET(_request: Request) {
  const session = await getSession();
  if (!session?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const entries = await MoodEntry.find({
      userId: session.id,
      createdAt: { $gte: thirtyDaysAgo },
    }).sort({ createdAt: 1 });

    const totalEntries = entries.length;

    if (totalEntries === 0) {
      return NextResponse.json({
        averageMood: 0,
        averageEnergy: 0,
        averageAnxiety: 0,
        totalEntries: 0,
        trends: [],
      });
    }

    // Compute averages in a single pass for efficiency
    const sums = entries.reduce(
      (acc, entry) => ({
        mood: acc.mood + entry.mood,
        energy: acc.energy + entry.energy,
        anxiety: acc.anxiety + entry.anxiety,
      }),
      { mood: 0, energy: 0, anxiety: 0 }
    );

    const round2 = (n: number) => Math.round((n / totalEntries) * 100) / 100;

    return NextResponse.json({
      averageMood: round2(sums.mood),
      averageEnergy: round2(sums.energy),
      averageAnxiety: round2(sums.anxiety),
      totalEntries,
      trends: entries,
    });
  } catch (error) {
    console.error('[insights GET]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
