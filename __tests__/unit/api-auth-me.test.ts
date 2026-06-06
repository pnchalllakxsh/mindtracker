import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET as meGET } from '../../src/app/api/auth/me/route';
import { POST as logoutPOST } from '../../src/app/api/auth/logout/route';
import { signToken } from '../../src/lib/auth';

// ── Shared mocks ──────────────────────────────────────────────────────────────
vi.mock('../../src/lib/db', () => ({ default: vi.fn() }));

const mockGet = vi.fn();
const mockDelete = vi.fn();
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({ get: mockGet, delete: mockDelete, set: vi.fn() })),
}));

const mockFindById = vi.fn();
vi.mock('../../src/models/User', () => ({
  default: { findById: vi.fn() },
}));

import User from '../../src/models/User';

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
describe('GET /api/auth/me', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    User.findById = mockFindById;
  });

  it('returns 401 when no cookie is present', async () => {
    mockGet.mockReturnValue(undefined);
    const res = await meGET();
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe('Unauthorized');
  });

  it('returns 401 when the token is invalid', async () => {
    mockGet.mockReturnValue({ value: 'bad.token.here' });
    const res = await meGET();
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe('Invalid token');
  });

  it('returns 404 when user does not exist in DB', async () => {
    const validToken = signToken('ghost_id');
    mockGet.mockReturnValue({ value: validToken });
    // Simulate .findById().select() chain
    mockFindById.mockReturnValue({ select: vi.fn().mockResolvedValue(null) });

    const res = await meGET();
    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.error).toBe('User not found');
  });

  it('returns 200 with user profile when authenticated', async () => {
    const userId = 'user123';
    const validToken = signToken(userId);
    mockGet.mockReturnValue({ value: validToken });

    const mockUser = { _id: userId, name: 'Alice', email: 'alice@test.com' };
    mockFindById.mockReturnValue({ select: vi.fn().mockResolvedValue(mockUser) });

    const res = await meGET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.user.name).toBe('Alice');
    expect(data.user.email).toBe('alice@test.com');
  });

  it('does not return password field in response', async () => {
    const validToken = signToken('user456');
    mockGet.mockReturnValue({ value: validToken });

    // The route uses .select('-password') — confirm the mock reflects no password
    const mockUser = { _id: 'user456', name: 'Bob', email: 'bob@test.com' };
    mockFindById.mockReturnValue({ select: vi.fn().mockResolvedValue(mockUser) });

    const res = await meGET();
    const data = await res.json();
    expect(data.user.password).toBeUndefined();
  });
});

// ── POST /api/auth/logout ─────────────────────────────────────────────────────
describe('POST /api/auth/logout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 200 and deletes the auth cookie', async () => {
    const res = await logoutPOST();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(mockDelete).toHaveBeenCalledWith('auth_token');
  });

  it('is idempotent — succeeds even when no cookie exists', async () => {
    // delete() on a non-existent cookie should not throw
    mockDelete.mockImplementation(() => {});
    const res = await logoutPOST();
    expect(res.status).toBe(200);
  });
});
