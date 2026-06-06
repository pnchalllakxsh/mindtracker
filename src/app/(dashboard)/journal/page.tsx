import { JournalEditor } from '@/components/journal/JournalEditor';

/**
 * Reflective journal page — a private space for free-form writing.
 */
export default function JournalPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Reflective Journal</h1>
        <p className="text-slate-500 mt-2 text-lg">Express your thoughts freely. Your journal is completely private.</p>
      </div>
      <JournalEditor />
    </div>
  );
}
