import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { registerSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/register
 * Creates a new user account and sets an HttpOnly auth cookie.
 * Validates input with Zod; returns 400 on validation errors.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate request body against schema
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password, name } = parsed.data;

    await connectToDatabase();

    // Check for duplicate email (case-insensitive)
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name.trim(),
    });

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
      { status: 201 }
    );
  } catch (error) {
    console.error('[auth/register]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
