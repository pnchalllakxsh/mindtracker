import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { loginSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/login
 * Authenticates an existing user and sets an HttpOnly auth cookie.
 * Always returns a generic "Invalid credentials" on auth failure to
 * prevent user enumeration attacks.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate request body
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    await connectToDatabase();

    // Look up by normalised email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Use same message as wrong-password to avoid user enumeration
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = signToken(user._id.toString());
    cookies().set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    return NextResponse.json(
      { user: { id: user._id, email: user.email, name: user.name } },
      { status: 200 }
    );
  } catch (error) {
    console.error('[auth/login]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
