'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const EXAMS = [
  { name: 'JEE Mains', date: '2026-01-24' },
  { name: 'NEET', date: '2026-05-03' },
  { name: 'UPSC Prelims', date: '2026-05-24' },
  { name: 'CAT', date: '2026-11-29' },
];

export function ExamCountdown() {
  const [selectedExam, setSelectedExam] = useState<string>('');
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    if (selectedExam) {
      const exam = EXAMS.find(e => e.name === selectedExam);
      if (exam) {
        const diff = new Date(exam.date).getTime() - new Date().getTime();
        setDaysLeft(Math.ceil(diff / (1000 * 3600 * 24)));
      }
    }
  }, [selectedExam]);

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Exam Countdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select onValueChange={(val) => setSelectedExam(val || '')} value={selectedExam}>
          <SelectTrigger aria-label="Select your target exam">
            <SelectValue placeholder="Select your target exam" />
          </SelectTrigger>
          <SelectContent>
            {EXAMS.map(exam => (
              <SelectItem key={exam.name} value={exam.name}>{exam.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {daysLeft !== null && (
          <div className="text-center p-8 bg-violet-50 dark:bg-violet-900/20 rounded-2xl border border-violet-100 dark:border-violet-800/50 shadow-sm mt-4">
            <p className="text-6xl font-extrabold text-violet-600 dark:text-violet-400">{daysLeft}</p>
            <p className="text-sm font-bold text-violet-500 uppercase tracking-widest mt-3">Days Remaining</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
