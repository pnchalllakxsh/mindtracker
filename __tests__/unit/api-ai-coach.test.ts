import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../../src/app/api/ai-coach/route';

vi.mock('../../src/lib/auth', () => ({ getSession: vi.fn() }));
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({ get: vi.fn(), set: vi.fn() })),
}));

import { getSession } from '../../src/lib/auth';

describe('POST /api/ai-coach', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when unauthenticated', async () => {
    (getSession as any).mockResolvedValue(null);

    const req = new Request('http://localhost/api/ai-coach', {
      method: 'POST',
      body: JSON.stringify({ message: 'Hello' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('returns 400 when message is empty', async () => {
    (getSession as any).mockResolvedValue({ id: 'user1' });

    const req = new Request('http://localhost/api/ai-coach', {
      method: 'POST',
      body: JSON.stringify({ message: '' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Validation failed');
  });

  it('returns 400 when message exceeds 2000 characters', async () => {
    (getSession as any).mockResolvedValue({ id: 'user1' });

    const req = new Request('http://localhost/api/ai-coach', {
      method: 'POST',
      body: JSON.stringify({ message: 'a'.repeat(2001) }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns a streaming response when authenticated with valid message', async () => {
    (getSession as any).mockResolvedValue({ id: 'user1' });

    const req = new Request('http://localhost/api/ai-coach', {
      method: 'POST',
      body: JSON.stringify({ message: 'How do I manage exam stress?' }),
    });
    const res = await POST(req);

    // Should be a streaming text response (not JSON)
    expect(res.headers.get('Content-Type')).toContain('text/plain');
    expect(res.body).not.toBeNull();
  });

  it('returns 400 when message field is missing entirely', async () => {
    (getSession as any).mockResolvedValue({ id: 'user1' });

    const req = new Request('http://localhost/api/ai-coach', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
