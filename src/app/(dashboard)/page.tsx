'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, MessageSquareHeart, Sparkles, TrendingUp, BookHeart } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

/** Shape of a mood trend data point used in the chart. */
interface TrendPoint {
  date: string;
  mood: number;
  energy: number;
}

/** Formats an ISO date string to a short "Mon DD" label for chart axes. */
function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function DashboardPage() {
  const [userName, setUserName] = useState('');
  const [trendData, setTrendData] = useState<TrendPoint[]>([]);
  const [insightLoading, setInsightLoading] = useState(true);

  useEffect(() => {
    // Fetch user profile
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => { if (data.user) setUserName(data.user.name || ''); })
      .catch(err => console.error('[dashboard] auth/me:', err));

    // Fetch mood trends for the chart
    fetch('/api/insights')
      .then(res => res.json())
      .then(data => {
        if (data.trends) {
          const points: TrendPoint[] = data.trends.map((entry: any) => ({
            date: formatDate(entry.createdAt),
            mood: entry.mood,
            energy: entry.energy,
          }));
          setTrendData(points);
        }
        setInsightLoading(false);
      })
      .catch(err => {
        console.error('[dashboard] insights:', err);
        setInsightLoading(false);
      });
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {userName ? `${greeting()}, ${userName}` : greeting()}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
          Here is your wellness overview for today. Take a deep breath.
        </p>
      </div>

      {/* Quick-action cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Mood Check-in Card */}
        <Card className="group relative overflow-hidden hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity" aria-hidden="true">
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
              <Button
                className="w-full bg-slate-900 hover:bg-violet-600 dark:bg-slate-800 dark:hover:bg-violet-600 transition-colors shadow-none mt-2"
                aria-label="Check in your mood"
              >
                Log Mood
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* AI Wellness Coach Card */}
        <Card className="group relative overflow-hidden hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity" aria-hidden="true">
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
              <Button
                className="w-full bg-slate-900 hover:bg-blue-600 dark:bg-slate-800 dark:hover:bg-blue-600 transition-colors shadow-none mt-2"
                aria-label="Chat with AI Wellness Coach"
              >
                Start Session
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Journal Card */}
        <Card className="group relative overflow-hidden hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity" aria-hidden="true">
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
              <Button
                className="w-full bg-slate-900 hover:bg-pink-600 dark:bg-slate-800 dark:hover:bg-pink-600 transition-colors shadow-none mt-2"
                aria-label="Write a journal entry"
              >
                New Entry
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Charts + Insight row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Mood Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-violet-600" />
              Mood Trends (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {insightLoading ? (
              <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
                Loading chart…
              </div>
            ) : trendData.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-sm gap-2">
                <TrendingUp className="w-8 h-8 opacity-30" />
                <p>No mood data yet. Log your first check-in!</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={trendData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} />
                  <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11 }} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                  />
                  <Line type="monotone" dataKey="mood" stroke="#7c3aed" strokeWidth={2} dot={{ r: 3 }} name="Mood" />
                  <Line type="monotone" dataKey="energy" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="Energy" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Daily Insight */}
        <Card className="bg-gradient-to-br from-violet-600 to-indigo-700 text-white border-none">
          <CardHeader>
            <CardTitle className="text-lg text-white">Daily Insight</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-violet-100 text-lg leading-relaxed italic">
              &quot;Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.&quot;
            </p>
            <div className="mt-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md" aria-hidden="true">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm">MindTrack AI</p>
                <p className="text-violet-200 text-xs">Generated for you</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
