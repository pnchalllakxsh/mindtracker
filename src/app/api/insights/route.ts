import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import MoodEntry from '@/models/MoodEntry';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await getSession();
  if (!session?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectToDatabase();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const entries = await MoodEntry.find({ 
      userId: session.id,
      createdAt: { $gte: thirtyDaysAgo }
    }).sort({ createdAt: 1 });

    const totalEntries = entries.length;
    const averageMood = totalEntries > 0 
      ? entries.reduce((acc, curr) => acc + curr.mood, 0) / totalEntries 
      : 0;

    return NextResponse.json({ 
      averageMood,
      totalEntries,
      trends: entries 
    }, { status: 200 });
  } catch (error) {
    console.error("[insights GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
