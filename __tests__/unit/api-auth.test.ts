import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST as registerPOST } from '../../src/app/api/auth/register/route';
import { POST as loginPOST } from '../../src/app/api/auth/login/route';

// ── Shared mocks ──────────────────────────────────────────────────────────────
vi.mock('../../src/lib/db', () => ({ default: vi.fn() }));
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({ set: vi.fn(), get: vi.fn() })),
}));

const mockFindOne = vi.fn();
const mockCreate = vi.fn();
vi.mock('../../src/models/User', () => ({
  default: { findOne: vi.fn(), create: vi.fn() },
}));

import User from '../../src/models/User';
import bcrypt from 'bcryptjs';
vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashed_password'),
    compare: vi.fn(),
  },
}));

// ── Register ──────────────────────────────────────────────────────────────────
describe('POST /api/auth/register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    User.findOne = mockFindOne;
    User.create = mockCreate;
  });

  it('returns 400 when required fields are missing', async () => {
    const req = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const res = await registerPOST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Validation failed');
  });

  it('returns 400 for an invalid email', async () => {
    const req = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: 'Alice', email: 'not-an-email', password: 'password123' }),
    });
    const res = await registerPOST(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 for a password shorter than 8 characters', async () => {
    const req = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: 'Alice', email: 'alice@test.com', password: 'short' }),
    });
    const res = await registerPOST(req);
    expect(res.status).toBe(400);
  });

  it('returns 409 when email already exists', async () => {
    mockFindOne.mockResolvedValue({ _id: 'existing', email: 'alice@test.com' });

    const req = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: 'Alice', email: 'alice@test.com', password: 'password123' }),
    });
    const res = await registerPOST(req);
    expect(res.status).toBe(409);
    const data = await res.json();
    expect(data.error).toBe('User already exists');
  });

  it('creates a user and returns 201 on valid data', async () => {
    mockFindOne.mockResolvedValue(null);
    mockCreate.mockResolvedValue({
      _id: 'new_id',
      email: 'alice@test.com',
      name: 'Alice',
    });

    const req = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: 'Alice', email: 'ALICE@TEST.COM', password: 'password123' }),
    });
    const res = await registerPOST(req);
    expect(res.status).toBe(201);

    const data = await res.json();
    expect(data.user.email).toBe('alice@test.com');
    // Should normalise to lowercase before lookup
    expect(mockFindOne).toHaveBeenCalledWith({ email: 'alice@test.com' });
  });
});

// ── Login ─────────────────────────────────────────────────────────────────────
describe('POST /api/auth/login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    User.findOne = mockFindOne;
  });

  it('returns 400 when fields are missing', async () => {
    const req = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const res = await loginPOST(req);
    expect(res.status).toBe(400);
  });

  it('returns 401 when user does not exist', async () => {
    mockFindOne.mockResolvedValue(null);

    const req = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'ghost@test.com', password: 'password123' }),
    });
    const res = await loginPOST(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    // Must use generic message to prevent user enumeration
    expect(data.error).toBe('Invalid credentials');
  });

  it('returns 401 when password is wrong', async () => {
    mockFindOne.mockResolvedValue({ _id: 'id', email: 'alice@test.com', password: 'hashed' });
    (bcrypt.compare as any).mockResolvedValue(false);

    const req = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'alice@test.com', password: 'wrongpass' }),
    });
    const res = await loginPOST(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe('Invalid credentials');
  });

  it('returns 200 and user data on valid credentials', async () => {
    mockFindOne.mockResolvedValue({
      _id: 'user_id',
      email: 'alice@test.com',
      name: 'Alice',
      password: 'hashed',
    });
    (bcrypt.compare as any).mockResolvedValue(true);

    const req = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'alice@test.com', password: 'password123' }),
    });
    const res = await loginPOST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.user.email).toBe('alice@test.com');
    expect(data.user.name).toBe('Alice');
  });
});
