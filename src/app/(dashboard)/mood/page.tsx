import { MoodSelector } from '@/components/mood/MoodSelector';

/**
 * Daily mood check-in page.
 * Users log their mood, energy, and anxiety scores along with optional triggers and notes.
 */
export default function MoodPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Daily Check-in</h1>
        <p className="text-slate-500 mt-2 text-lg">Track your mood, energy, and anxiety levels to discover patterns.</p>
      </div>
      <MoodSelector />
    </div>
  );
}
