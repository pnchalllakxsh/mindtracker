import { ChatWindow } from '@/components/ai/ChatWindow';

/**
 * AI Wellness Coach page — private chat with an AI-powered mental health assistant.
 */
export default function AICoachPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">AI Wellness Coach</h1>
        <p className="text-slate-500 mt-2 text-lg">Chat confidentially about stress, anxiety, or study techniques.</p>
      </div>
      <ChatWindow />
    </div>
  );
}
