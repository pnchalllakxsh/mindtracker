import { ExamCountdown } from '@/components/exam/ExamCountdown';

export default function ExamPrepPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Exam Preparation</h1>
        <p className="text-slate-500 mt-2 text-lg">Keep your eyes on the goal without losing your peace of mind.</p>
      </div>
      <ExamCountdown />
    </div>
  );
}
