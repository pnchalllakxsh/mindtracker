import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '../../src/app/api/mood/route';
import { getSession } from '../../src/lib/auth';
import connectToDatabase from '../../src/lib/db';
import MoodEntry from '../../src/models/MoodEntry';

vi.mock('../../src/lib/auth', () => ({
  getSession: vi.fn(),
}));

vi.mock('../../src/lib/db', () => ({
  default: vi.fn(),
}));

// Mocking mongoose query chain (find -> sort -> limit)
const mockLimit = vi.fn();
const mockSort = vi.fn().mockReturnValue({ limit: mockLimit });
const mockFind = vi.fn().mockReturnValue({ sort: mockSort });

vi.mock('../../src/models/MoodEntry', () => ({
  default: {
    find: vi.fn(),
    create: vi.fn(),
  },
}));

describe('Mood API Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    MoodEntry.find = mockFind;
  });

  describe('GET /api/mood', () => {
    it('returns 401 if unauthorized', async () => {
      (getSession as any).mockResolvedValue(null);

      const request = new Request('http://localhost/api/mood');
      const response = await GET(request);

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });

    it('fetches entries successfully when authenticated', async () => {
      (getSession as any).mockResolvedValue({ id: 'user123' });
      
      const mockEntries = [
        { mood: 'happy', intensity: 8, notes: 'Great day!' }
      ];
      mockLimit.mockResolvedValue(mockEntries);

      const request = new Request('http://localhost/api/mood');
      const response = await GET(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(connectToDatabase).toHaveBeenCalled();
      expect(mockFind).toHaveBeenCalledWith({ userId: 'user123' });
      expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(mockLimit).toHaveBeenCalledWith(30);
      
      expect(data).toEqual(mockEntries);
    });

    it('returns 500 on database error', async () => {
      (getSession as any).mockResolvedValue({ id: 'user123' });
      mockLimit.mockRejectedValue(new Error('DB Error'));

      const request = new Request('http://localhost/api/mood');
      const response = await GET(request);

      expect(response.status).toBe(500);
    });
  });

  describe('POST /api/mood', () => {
    it('returns 401 if unauthorized', async () => {
      (getSession as any).mockResolvedValue(null);

      const request = new Request('http://localhost/api/mood', {
        method: 'POST',
        body: JSON.stringify({ mood: 'happy' })
      });
      const response = await POST(request);

      expect(response.status).toBe(401);
    });

    it('returns 400 for invalid payload', async () => {
      (getSession as any).mockResolvedValue({ id: 'user123' });

      // Missing required fields
      const request = new Request('http://localhost/api/mood', {
        method: 'POST',
        body: JSON.stringify({ notes: 'missing mood entirely' })
      });
      const response = await POST(request);

      expect(response.status).toBe(400);
    });

    it('creates an entry successfully', async () => {
      (getSession as any).mockResolvedValue({ id: 'user123' });
      
      const validPayload = { mood: 5, energy: 4, anxiety: 2, note: 'Fantastic' };
      const createdEntry = { _id: 'entry1', userId: 'user123', ...validPayload };
      
      (MoodEntry.create as any).mockResolvedValue(createdEntry);

      const request = new Request('http://localhost/api/mood', {
        method: 'POST',
        body: JSON.stringify(validPayload)
      });
      const response = await POST(request);

      expect(response.status).toBe(201);
      const data = await response.json();
      
      expect(connectToDatabase).toHaveBeenCalled();
      expect(MoodEntry.create).toHaveBeenCalledWith({
        userId: 'user123',
        triggers: [],
        ...validPayload
      });
      expect(data).toEqual(createdEntry);
    });
  });
});
