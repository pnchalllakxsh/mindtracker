'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        window.location.href = '/';
      } else {
        const data = await res.json();
        setError(data.error);
      }
    } catch {
      setError('An error occurred');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
      <form onSubmit={handleLogin} className="w-full max-w-md p-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">Login to MindTrack</h1>
        {error && <p className="text-red-500 text-sm text-center" role="alert">{error}</p>}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <Button type="submit" className="w-full">Login</Button>
        <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-4">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
