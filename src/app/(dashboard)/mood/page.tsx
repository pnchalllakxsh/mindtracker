import { MoodSelector } from '@/components/mood/MoodSelector';

export default function MoodPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Daily Check-in</h1>
        <p className="text-muted-foreground">Track your mood, energy, and anxiety levels to discover patterns.</p>
      </div>
      <MoodSelector />
    </div>
  );
}
