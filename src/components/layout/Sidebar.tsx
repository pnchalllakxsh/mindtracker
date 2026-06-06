'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Activity, BookHeart, BrainCircuit, GraduationCap, Settings, HelpCircle, LogOut } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

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

  const navItems = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Mood', href: '/mood', icon: Activity },
    { name: 'Journal', href: '/journal', icon: BookHeart },
    { name: 'AI Coach', href: '/ai-coach', icon: BrainCircuit },
    { name: 'Exam Prep', href: '/exam-prep', icon: GraduationCap },
  ];

  const bottomNavItems = [
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const [userName, setUserName] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUserName(data.user.name || '');
        }
      })
      .catch(err => console.error(err));
  }, []);

  const initials = userName ? userName.substring(0, 2).toUpperCase() : 'ME';

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 min-h-screen p-4 justify-between" aria-label="Sidebar Navigation">
      <div>
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-6 h-6 rounded bg-violet-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">M</span>
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white">MindTrack</span>
        </div>
        
        <nav className="flex flex-col space-y-1 mb-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                  isActive 
                    ? 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-violet-600 dark:text-violet-400' : ''}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <nav className="flex flex-col space-y-1">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                  isActive 
                    ? 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl cursor-pointer">
          <div className="flex items-center gap-3">
            <Avatar className="w-9 h-9 border border-slate-200 dark:border-slate-700">
              <AvatarImage src="" />
              <AvatarFallback className="bg-violet-100 text-violet-700 text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900 dark:text-white leading-none">{userName || 'Loading...'}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">Free Tier</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-2">
          <AlertDialog>
            <AlertDialogTrigger className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
              <LogOut className="w-5 h-5" />
              Logout
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will log you out of your account. You will need to sign in again to access your tracker.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700">Log out</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </aside>
  );
}
