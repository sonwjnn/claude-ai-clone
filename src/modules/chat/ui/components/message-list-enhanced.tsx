import { MessageWithArtifacts } from '../../types/chat.types';
import { MessageBubble } from './message-bubble';
import { StreamingMessage } from './streaming-message';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Artifact } from '@/lib/db/schema';

interface MessageListEnhancedProps {
  messages?: MessageWithArtifacts[];
  isLoading: boolean;
  streamingText?: string;
  streamingArtifacts?: Artifact[];
}

export function MessageListEnhanced({
  messages,
  isLoading,
  streamingText,
  streamingArtifacts,
}: MessageListEnhancedProps) {
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <div className="mx-auto max-w-md space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-pink-600 mx-auto">
            <svg
              className="h-8 w-8 text-white"
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
          <h2 className="text-2xl font-bold">Start a conversation</h2>
          <p className="text-muted-foreground">
            Send a message to begin chatting with Claude. I can help you with coding, writing,
            analysis, math, and much more.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div>
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {streamingText && (
          <StreamingMessage content={streamingText} artifacts={streamingArtifacts || []} />
        )}
      </div>
    </ScrollArea>
  );
}
