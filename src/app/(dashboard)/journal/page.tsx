import { JournalEditor } from '@/components/journal/JournalEditor';

export default function JournalPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reflective Journal</h1>
        <p className="text-muted-foreground">Express your thoughts freely. Your journal is completely private.</p>
      </div>
      <JournalEditor />
    </div>
  );
}
