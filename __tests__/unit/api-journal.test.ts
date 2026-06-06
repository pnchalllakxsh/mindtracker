import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '../../src/app/api/journal/route';
import { getSession } from '../../src/lib/auth';
import connectToDatabase from '../../src/lib/db';
import JournalEntry from '../../src/models/JournalEntry';

vi.mock('../../src/lib/auth', () => ({
  getSession: vi.fn(),
}));

vi.mock('../../src/lib/db', () => ({
  default: vi.fn(),
}));

// Mocking mongoose query chain
const mockLimit = vi.fn();
const mockSort = vi.fn().mockReturnValue({ limit: mockLimit });
const mockFind = vi.fn().mockReturnValue({ sort: mockSort });

vi.mock('../../src/models/JournalEntry', () => ({
  default: {
    find: vi.fn(),
    create: vi.fn(),
  },
}));

describe('Journal API Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    JournalEntry.find = mockFind;
  });

  describe('GET /api/journal', () => {
    it('returns 401 if unauthorized', async () => {
      (getSession as any).mockResolvedValue(null);

      const request = new Request('http://localhost/api/journal');
      const response = await GET(request);

      expect(response.status).toBe(401);
    });

    it('fetches entries successfully when authenticated', async () => {
      (getSession as any).mockResolvedValue({ id: 'user123' });
      
      const mockEntries = [
        { content: 'Dear diary...', tags: ['personal'] }
      ];
      mockLimit.mockResolvedValue(mockEntries);

      const request = new Request('http://localhost/api/journal');
      const response = await GET(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(connectToDatabase).toHaveBeenCalled();
      expect(mockFind).toHaveBeenCalledWith({ userId: 'user123' });
      expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(mockLimit).toHaveBeenCalledWith(50);
      
      expect(data).toEqual(mockEntries);
    });

    it('returns 500 on database error', async () => {
      (getSession as any).mockResolvedValue({ id: 'user123' });
      mockLimit.mockRejectedValue(new Error('DB Error'));

      const request = new Request('http://localhost/api/journal');
      const response = await GET(request);

      expect(response.status).toBe(500);
    });
  });

  describe('POST /api/journal', () => {
    it('returns 401 if unauthorized', async () => {
      (getSession as any).mockResolvedValue(null);

      const request = new Request('http://localhost/api/journal', {
        method: 'POST',
        body: JSON.stringify({ content: 'Hello' })
      });
      const response = await POST(request);

      expect(response.status).toBe(401);
    });

    it('returns 400 for invalid payload', async () => {
      (getSession as any).mockResolvedValue({ id: 'user123' });

      // content is missing
      const request = new Request('http://localhost/api/journal', {
        method: 'POST',
        body: JSON.stringify({ tags: ['test'] })
      });
      const response = await POST(request);

      expect(response.status).toBe(400);
    });

    it('creates a journal entry successfully', async () => {
      (getSession as any).mockResolvedValue({ id: 'user123' });
      
      const validPayload = { content: 'My first entry!', tags: ['test'], sentiment: 0.8 };
      const createdEntry = { _id: 'entry1', userId: 'user123', ...validPayload };
      
      (JournalEntry.create as any).mockResolvedValue(createdEntry);

      const request = new Request('http://localhost/api/journal', {
        method: 'POST',
        body: JSON.stringify(validPayload)
      });
      const response = await POST(request);

      expect(response.status).toBe(201);
      const data = await response.json();
      
      expect(connectToDatabase).toHaveBeenCalled();
      expect(data).toEqual(createdEntry);
    });
  });
});
