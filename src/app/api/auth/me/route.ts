import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

/**
 * GET /api/auth/me
 * Returns the currently authenticated user's public profile (no password).
 * Used by client components to hydrate the user's name and email.
 */
export async function GET() {
  try {
    const token = cookies().get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded?.id) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('[auth/me GET]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
