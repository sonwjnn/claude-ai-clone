import { ChatInput } from '@/modules/chat/ui/components/chat-input';

export default function EmptyChatPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <h1 className="text-4xl font-bold">Claude AI Clone</h1>
          <p className="text-lg text-muted-foreground max-w-md">
            Start a new conversation or select an existing one from the sidebar
          </p>
        </div>
      </div>
      <ChatInput />
    </div>
  );
}
