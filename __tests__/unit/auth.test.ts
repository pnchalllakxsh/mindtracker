import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signToken, verifyToken, getSession } from '../../src/lib/auth';
import { cookies } from 'next/headers';

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

describe('Auth Library', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('signToken & verifyToken', () => {
    it('should successfully sign and verify a token', () => {
      const userId = '12345';
      const token = signToken(userId);
      
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);

      const decoded = verifyToken(token);
      expect(decoded).not.toBeNull();
      expect(decoded?.id).toBe(userId);
    });

    it('should return null for an invalid token', () => {
      const decoded = verifyToken('invalid.token.string');
      expect(decoded).toBeNull();
    });
  });

  describe('getSession', () => {
    it('should return decoded token when a valid cookie is present', async () => {
      const userId = 'abcde';
      const validToken = signToken(userId);
      
      const mockGet = vi.fn().mockReturnValue({ value: validToken });
      (cookies as any).mockReturnValue({ get: mockGet });

      const session = await getSession();
      
      expect(cookies).toHaveBeenCalled();
      expect(mockGet).toHaveBeenCalledWith('auth_token');
      expect(session).not.toBeNull();
      expect(session?.id).toBe(userId);
    });

    it('should return null when the cookie is absent', async () => {
      const mockGet = vi.fn().mockReturnValue(undefined);
      (cookies as any).mockReturnValue({ get: mockGet });

      const session = await getSession();
      
      expect(session).toBeNull();
    });

    it('should return null when the cookie token is invalid', async () => {
      const mockGet = vi.fn().mockReturnValue({ value: 'bad.token' });
      (cookies as any).mockReturnValue({ get: mockGet });

      const session = await getSession();
      
      expect(session).toBeNull();
    });
  });
});
