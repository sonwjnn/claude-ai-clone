import { ChatInputEnhanced } from '@/modules/chat/ui/components/chat-input-enhanced';

export default function EmptyChatPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 items-center justify-center">
        <div className="mx-auto max-w-2xl space-y-6 p-8 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-pink-600 mx-auto">
            <svg
              className="h-10 w-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold">How can Claude help you today?</h1>
          <p className="text-lg text-muted-foreground">
            Start a new conversation or select an existing one from the sidebar
          </p>
          
          <div className="grid gap-4 sm:grid-cols-2 text-left mt-8">
            <div className="rounded-lg border p-4 hover:border-primary cursor-pointer transition-colors">
              <div className="font-semibold mb-2">✨ Create & Edit</div>
              <p className="text-sm text-muted-foreground">
                Generate code, write content, or create artifacts
              </p>
            </div>
            <div className="rounded-lg border p-4 hover:border-primary cursor-pointer transition-colors">
              <div className="font-semibold mb-2">🧠 Analyze & Learn</div>
              <p className="text-sm text-muted-foreground">
                Get insights, explanations, or research assistance
              </p>
            </div>
            <div className="rounded-lg border p-4 hover:border-primary cursor-pointer transition-colors">
              <div className="font-semibold mb-2">💡 Brainstorm</div>
              <p className="text-sm text-muted-foreground">
                Generate ideas, solve problems, or plan projects
              </p>
            </div>
            <div className="rounded-lg border p-4 hover:border-primary cursor-pointer transition-colors">
              <div className="font-semibold mb-2">🔧 Debug & Fix</div>
              <p className="text-sm text-muted-foreground">
                Find bugs, optimize code, or troubleshoot issues
              </p>
            </div>
          </div>
        </div>
      </div>
      <ChatInputEnhanced />
    </div>
  );
}
