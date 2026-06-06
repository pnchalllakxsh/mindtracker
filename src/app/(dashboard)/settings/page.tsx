'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { User, Lock, Mail, ShieldCheck, Bell, Moon } from 'lucide-react';

export default function SettingsPage() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState<{name?: string, email?: string} | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      setMessage('Profile updated successfully.');
      setTimeout(() => setMessage(''), 3000);
    }, 1000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      setMessage('Password updated successfully.');
      setTimeout(() => setMessage(''), 3000);
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 mt-2 text-lg">Manage your account details and app preferences.</p>
      </div>

      {message && (
        <div className="p-4 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl flex items-center gap-2 border border-green-200 dark:border-green-800 transition-all">
          <ShieldCheck className="w-5 h-5" />
          <span className="font-medium">{message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Information */}
          <Card>
            <form onSubmit={handleUpdateProfile}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <User className="w-5 h-5 text-violet-600" />
                  Personal Information
                </CardTitle>
                <CardDescription>Update your basic profile details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-slate-600 font-medium">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input id="name" defaultValue={user?.name || ''} key={user?.name || 'loading-name'} className="pl-10 h-11 bg-slate-50 border-slate-200 focus-visible:ring-violet-500 rounded-xl" required />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-slate-600 font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input id="email" type="email" defaultValue={user?.email || ''} key={user?.email || 'loading-email'} className="pl-10 h-11 bg-slate-50 border-slate-200 focus-visible:ring-violet-500 rounded-xl" required />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button type="submit" disabled={isUpdating} className="bg-violet-600 hover:bg-violet-700 text-white w-full md:w-auto px-8 rounded-xl shadow-sm">
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Security & Password */}
          <Card>
            <form onSubmit={handleUpdatePassword}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Lock className="w-5 h-5 text-violet-600" />
                  Security
                </CardTitle>
                <CardDescription>Update your password to keep your account secure.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-3">
                  <Label htmlFor="current-password" className="text-slate-600 font-medium">Current Password</Label>
                  <Input id="current-password" type="password" className="h-11 bg-slate-50 border-slate-200 focus-visible:ring-violet-500 rounded-xl" required />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="new-password" className="text-slate-600 font-medium">New Password</Label>
                  <Input id="new-password" type="password" className="h-11 bg-slate-50 border-slate-200 focus-visible:ring-violet-500 rounded-xl" required />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="confirm-password" className="text-slate-600 font-medium">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" className="h-11 bg-slate-50 border-slate-200 focus-visible:ring-violet-500 rounded-xl" required />
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button type="submit" disabled={isUpdating} variant="outline" className="w-full md:w-auto px-8 rounded-xl border-violet-200 text-violet-700 hover:bg-violet-50">
                  {isUpdating ? 'Updating...' : 'Update Password'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        {/* App Preferences */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">App Preferences</CardTitle>
              <CardDescription>Customize your experience.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base flex items-center gap-2">
                    <Bell className="w-4 h-4 text-violet-600" /> Daily Reminders
                  </Label>
                  <p className="text-sm text-slate-500">Receive notifications to log your mood.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="h-px bg-slate-100 dark:bg-slate-800 my-4" />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base flex items-center gap-2">
                    <Moon className="w-4 h-4 text-violet-600" /> Dark Mode
                  </Label>
                  <p className="text-sm text-slate-500">Toggle dark theme layout.</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
