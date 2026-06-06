'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, MessageSquareHeart, Sparkles, TrendingUp, BookHeart } from 'lucide-react';

export default function DashboardPage() {
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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {userName ? `Good morning, ${userName}` : 'Good morning'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
            Here is your wellness overview for today. Take a deep breath.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Mood Check-in Card */}
        <Card className="group relative overflow-hidden border-slate-200 dark:border-slate-800 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity className="w-24 h-24 text-violet-600" />
          </div>
          <CardHeader>
            <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/50 rounded-xl flex items-center justify-center mb-4">
              <Activity className="w-6 h-6 text-violet-600 dark:text-violet-400" />
            </div>
            <CardTitle className="text-xl">Daily Mood</CardTitle>
            <CardDescription>Track your emotional state and energy levels.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/mood">
              <Button className="w-full bg-slate-900 hover:bg-violet-600 dark:bg-slate-800 dark:hover:bg-violet-600 transition-colors shadow-none mt-2" aria-label="Check in your mood">
                Log Mood
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* AI Wellness Coach Card */}
        <Card className="group relative overflow-hidden border-slate-200 dark:border-slate-800 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <MessageSquareHeart className="w-24 h-24 text-blue-600" />
          </div>
          <CardHeader>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center mb-4">
              <MessageSquareHeart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-xl">AI Wellness Coach</CardTitle>
            <CardDescription>Talk through your thoughts in a safe space.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/ai-coach">
              <Button className="w-full bg-slate-900 hover:bg-blue-600 dark:bg-slate-800 dark:hover:bg-blue-600 transition-colors shadow-none mt-2" aria-label="Chat with AI Wellness Coach">
                Start Session
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Journal Card */}
        <Card className="group relative overflow-hidden border-slate-200 dark:border-slate-800 hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <BookHeart className="w-24 h-24 text-pink-600" />
          </div>
          <CardHeader>
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/50 rounded-xl flex items-center justify-center mb-4">
              <BookHeart className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            </div>
            <CardTitle className="text-xl">Reflection Journal</CardTitle>
            <CardDescription>Write down your daily gratitude and thoughts.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/journal">
              <Button className="w-full bg-slate-900 hover:bg-pink-600 dark:bg-slate-800 dark:hover:bg-pink-600 transition-colors shadow-none mt-2" aria-label="Write a journal entry">
                New Entry
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-violet-600" />
                Mood Trends
              </CardTitle>
              <select className="text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-md px-2 py-1 outline-none text-slate-600 dark:text-slate-300 cursor-pointer">
                <option>This Week</option>
                <option>This Month</option>
              </select>
            </div>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center border-t border-slate-100 dark:border-slate-800/50">
            <p className="text-slate-400 text-sm">Chart visualization goes here</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-gradient-to-br from-violet-600 to-indigo-700 text-white border-none">
          <CardHeader>
            <CardTitle className="text-lg text-white">Daily Insight</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-violet-100 text-lg leading-relaxed italic">
              "Your mental health is a priority. Your happiness is an essential. Your self-care is a necessity."
            </p>
            <div className="mt-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm">VyanaWell AI</p>
                <p className="text-violet-200 text-xs">Generated for you</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
