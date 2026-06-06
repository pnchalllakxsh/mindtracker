'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Lock, Mail, ShieldCheck } from 'lucide-react';

export default function ProfilePage() {
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
    // Mock API call
    setTimeout(() => {
      setIsUpdating(false);
      setMessage('Profile updated successfully.');
      setTimeout(() => setMessage(''), 3000);
    }, 1000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    // Mock API call
    setTimeout(() => {
      setIsUpdating(false);
      setMessage('Password updated successfully.');
      setTimeout(() => setMessage(''), 3000);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Profile Settings</h1>
        <p className="text-slate-500 mt-2">Manage your account details and security preferences.</p>
      </div>

      {message && (
        <div className="p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2 border border-green-200">
          <ShieldCheck className="w-5 h-5" />
          <span className="font-medium">{message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card className="border-slate-200 shadow-sm dark:border-slate-800">
          <form onSubmit={handleUpdateProfile}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <User className="w-5 h-5 text-violet-600" />
                Personal Information
              </CardTitle>
              <CardDescription>Update your basic profile details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input id="name" defaultValue={user?.name || ''} key={user?.name || 'loading-name'} className="pl-9" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input id="email" type="email" defaultValue={user?.email || ''} key={user?.email || 'loading-email'} className="pl-9" required />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isUpdating} className="bg-violet-600 hover:bg-violet-700 text-white w-full md:w-auto">
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Security & Password */}
        <Card className="border-slate-200 shadow-sm dark:border-slate-800">
          <form onSubmit={handleUpdatePassword}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Lock className="w-5 h-5 text-violet-600" />
                Security
              </CardTitle>
              <CardDescription>Update your password to keep your account secure.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" required />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isUpdating} variant="outline" className="w-full md:w-auto border-violet-200 text-violet-700 hover:bg-violet-50">
                {isUpdating ? 'Updating...' : 'Update Password'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
