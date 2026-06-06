import { ChatWindow } from '@/components/ai/ChatWindow';

export default function AICoachPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Wellness Coach</h1>
        <p className="text-muted-foreground">Chat confidentially about stress, anxiety, or study techniques.</p>
      </div>
      <ChatWindow />
    </div>
  );
}
