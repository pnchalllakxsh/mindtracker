import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/logout
 * Clears the auth_token cookie and ends the user's session.
 * Returns 200 regardless of whether a token existed (idempotent).
 */
export async function POST() {
  cookies().delete('auth_token');
  return NextResponse.json({ success: true }, { status: 200 });
}
