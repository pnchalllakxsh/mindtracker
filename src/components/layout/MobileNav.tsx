'use client';
import Link from 'next/link';

export function MobileNav() {
  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="md:hidden flex justify-around items-center bg-slate-900 text-white p-4 fixed bottom-0 w-full z-40" aria-label="Mobile Navigation">
      <Link href="/" className="p-2 focus:ring-2 focus:ring-blue-500 rounded-md text-xs">Home</Link>
      <Link href="/mood" className="p-2 focus:ring-2 focus:ring-blue-500 rounded-md text-xs">Mood</Link>
      <Link href="/journal" className="p-2 focus:ring-2 focus:ring-blue-500 rounded-md text-xs">Journal</Link>
      <Link href="/ai-coach" className="p-2 focus:ring-2 focus:ring-blue-500 rounded-md text-xs">AI</Link>
      <button onClick={handleLogout} className="p-2 focus:ring-2 focus:ring-red-500 rounded-md text-xs text-slate-400">Logout</button>
    </nav>
  );
}
