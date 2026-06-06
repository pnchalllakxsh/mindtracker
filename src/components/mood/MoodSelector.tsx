'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const MOODS = [
  { level: 1, emoji: '😢', label: 'Very Low', color: 'bg-red-500' },
  { level: 2, emoji: '😟', label: 'Low', color: 'bg-orange-500' },
  { level: 3, emoji: '😐', label: 'Neutral', color: 'bg-yellow-500' },
  { level: 4, emoji: '🙂', label: 'Good', color: 'bg-lime-500' },
  { level: 5, emoji: '😁', label: 'Excellent', color: 'bg-green-500' }
];

const PRESET_TRIGGERS = [
  'Study Pressure', 'Sleep Issues', 'Family Pressure', 
  'Peer Competition', 'Exam Fear', 'Physical Health', 'Motivation Loss'
];

export function MoodSelector() {
  const [mood, setMood] = useState<number | null>(null);
  const [energy, setEnergy] = useState<number>(3);
  const [anxiety, setAnxiety] = useState<number>(3);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [subject, setSubject] = useState('');
  const [examContext, setExamContext] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleTrigger = (trigger: string) => {
    if (selectedTriggers.includes(trigger)) {
      setSelectedTriggers(selectedTriggers.filter(t => t !== trigger));
    } else if (selectedTriggers.length < 10) {
      setSelectedTriggers([...selectedTriggers, trigger]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, energy, anxiety, triggers: selectedTriggers, note, subject, examContext })
      });
      if (res.ok) {
        setSuccess(true);
      }
    } catch (err) {
      console.error(err);
    }
    setIsSubmitting(false);
  };

  if (success) {
    return (
      <div className="p-6 text-center space-y-4 bg-green-50 dark:bg-green-900/20 rounded-xl" data-testid="success-message">
        <h3 className="text-xl font-bold text-green-600 dark:text-green-400">Recorded successfully!</h3>
        <p>Your mental health matters. MindTrack AI is here for you.</p>
        <Button onClick={() => setSuccess(false)}>Check in again</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">
      <div className="space-y-4">
        <Label className="text-lg">How are you feeling?</Label>
        <div className="flex justify-between gap-2">
          {MOODS.map(m => (
            <button
              key={m.level}
              type="button"
              data-mood={m.level}
              aria-label={`Mood: ${m.label}, score ${m.level}`}
              onClick={() => setMood(m.level)}
              className={`p-4 rounded-xl text-4xl transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none flex-1 flex flex-col items-center gap-2 ${mood === m.level ? 'ring-4 ring-blue-500 scale-105' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <span>{m.emoji}</span>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label>Energy Level (1-5)</Label>
        <Slider 
          value={[energy]} 
          onValueChange={(v) => setEnergy(Array.isArray(v) ? v[0] : v)} 
          min={1} max={5} step={1} 
          aria-label="Energy Level"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Exhausted</span>
          <span>Energetic</span>
        </div>
      </div>

      <div className="space-y-4">
        <Label>Anxiety Level (1-5)</Label>
        <Slider 
          value={[anxiety]} 
          onValueChange={(v) => setAnxiety(Array.isArray(v) ? v[0] : v)} 
          min={1} max={5} step={1}
          aria-label="Anxiety Level"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Calm</span>
          <span>Very Anxious</span>
        </div>
      </div>

      <div className="space-y-4">
        <Label>Triggers (Select up to 10)</Label>
        <div className="flex flex-wrap gap-2">
          {PRESET_TRIGGERS.map(t => (
            <Badge 
              key={t}
              variant={selectedTriggers.includes(t) ? 'default' : 'outline'}
              className="cursor-pointer text-sm p-2"
              data-trigger={t.toLowerCase().replace(' ', '-')}
              onClick={() => toggleTrigger(t)}
            >
              {t}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="subject">Subject Context</Label>
          <Input id="subject" value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Physics" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="examContext">Exam Context</Label>
          <Input id="examContext" value={examContext} onChange={e => setExamContext(e.target.value)} placeholder="e.g. JEE Mains" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">Optional Note</Label>
        <Textarea 
          id="note" 
          value={note} 
          onChange={e => setNote(e.target.value)} 
          maxLength={500}
          placeholder="What's on your mind?"
        />
        <div className="text-right text-xs text-muted-foreground">{note.length}/500</div>
      </div>

      <Button type="submit" className="w-full" disabled={!mood || isSubmitting} data-testid="submit-mood">
        {isSubmitting ? 'Saving...' : 'Save Check-in'}
      </Button>
    </form>
  );
}
