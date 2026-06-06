'use client';
import { useState, useEffect } from 'react';

/** Represents the authenticated user's public profile. */
export interface CurrentUser {
  id: string;
  name: string;
  email: string;
}

/**
 * Custom hook that fetches and caches the current authenticated user's profile.
 * Components across the app use this instead of each repeating `fetch('/api/auth/me')`.
 *
 * @returns `{ user, loading, error }` — `user` is null when unauthenticated or loading.
 */
export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/auth/me')
      .then(res => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
      })
      .then(data => {
        if (!cancelled && data.user) {
          setUser(data.user);
        }
      })
      .catch(err => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { user, loading, error };
}
