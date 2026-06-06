'use client';
import { useState, useEffect } from 'react';
import { Bell, Calendar, Plus, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

export function Header() {
  const [dateStr, setDateStr] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const today = new Date();
    setDateStr(today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));

    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUserName(data.user.name || '');
        }
      })
      .catch(err => console.error(err));
  }, []);

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

  const initials = userName ? userName.substring(0, 2).toUpperCase() : 'ME';

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-100 dark:border-slate-800">
      <div className="flex-1">
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-full shadow-sm text-sm text-slate-600 dark:text-slate-300 font-medium border border-slate-100 dark:border-slate-700">
          <Calendar className="w-4 h-4 text-violet-600" />
          {dateStr}
        </div>
        
        <button className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm text-slate-500 hover:text-violet-600 border border-slate-100 dark:border-slate-700 transition-colors">
          <Bell className="w-5 h-5" />
        </button>

        <Link href="/mood">
          <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-5 shadow-sm shadow-violet-200 dark:shadow-none gap-2">
            <Plus className="w-4 h-4" /> Log
          </Button>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full focus:ring-2 focus:ring-violet-500 outline-none">
            <Avatar className="border border-slate-200 dark:border-slate-700">
              <AvatarImage src="" alt="User" />
              <AvatarFallback className="bg-violet-100 text-violet-700">{initials}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5 text-sm font-semibold">My Account</div>
            <DropdownMenuSeparator />
            <Link href="/settings">
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-950" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
