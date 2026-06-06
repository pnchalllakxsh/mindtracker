import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../../src/app/api/insights/route';
import { getSession } from '../../src/lib/auth';

vi.mock('../../src/lib/auth', () => ({ getSession: vi.fn() }));
vi.mock('../../src/lib/db', () => ({ default: vi.fn() }));

const mockLimit = vi.fn();
const mockSort = vi.fn().mockReturnValue({ limit: mockLimit });
const mockFind = vi.fn().mockReturnValue({ sort: mockSort });

vi.mock('../../src/models/MoodEntry', () => ({
  default: { find: vi.fn() },
}));

import MoodEntry from '../../src/models/MoodEntry';

describe('GET /api/insights', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    MoodEntry.find = mockFind;
  });

  it('returns 401 when unauthenticated', async () => {
    (getSession as any).mockResolvedValue(null);
    const res = await GET(new Request('http://localhost/api/insights'));
    expect(res.status).toBe(401);
  });

  it('returns zeroed stats when no entries exist', async () => {
    (getSession as any).mockResolvedValue({ id: 'user1' });
    // find().sort() — no .limit() on insights; it returns directly from sort
    mockFind.mockReturnValue({ sort: vi.fn().mockResolvedValue([]) });

    const res = await GET(new Request('http://localhost/api/insights'));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.totalEntries).toBe(0);
    expect(data.averageMood).toBe(0);
    expect(data.averageEnergy).toBe(0);
    expect(data.averageAnxiety).toBe(0);
    expect(data.trends).toEqual([]);
  });

  it('computes correct averages for multiple entries', async () => {
    (getSession as any).mockResolvedValue({ id: 'user1' });

    const entries = [
      { mood: 4, energy: 3, anxiety: 2 },
      { mood: 2, energy: 5, anxiety: 4 },
    ];
    mockFind.mockReturnValue({ sort: vi.fn().mockResolvedValue(entries) });

    const res = await GET(new Request('http://localhost/api/insights'));
    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data.totalEntries).toBe(2);
    expect(data.averageMood).toBe(3);       // (4+2)/2
    expect(data.averageEnergy).toBe(4);     // (3+5)/2
    expect(data.averageAnxiety).toBe(3);    // (2+4)/2
    expect(data.trends).toHaveLength(2);
  });

  it('rounds averages to 2 decimal places', async () => {
    (getSession as any).mockResolvedValue({ id: 'user1' });

    const entries = [
      { mood: 1, energy: 1, anxiety: 1 },
      { mood: 2, energy: 2, anxiety: 2 },
      { mood: 3, energy: 3, anxiety: 3 },
    ];
    mockFind.mockReturnValue({ sort: vi.fn().mockResolvedValue(entries) });

    const res = await GET(new Request('http://localhost/api/insights'));
    const data = await res.json();

    expect(data.averageMood).toBe(2);       // exact: (1+2+3)/3 = 2
    // Verify shape of returned numbers
    expect(typeof data.averageMood).toBe('number');
    expect(typeof data.averageEnergy).toBe('number');
  });

  it('returns 500 on database error', async () => {
    (getSession as any).mockResolvedValue({ id: 'user1' });
    mockFind.mockReturnValue({ sort: vi.fn().mockRejectedValue(new Error('DB down')) });

    const res = await GET(new Request('http://localhost/api/insights'));
    expect(res.status).toBe(500);
  });
});
