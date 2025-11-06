import { MessageWithArtifacts } from '../../types/chat.types';
import { MessageItem } from './message-item';
import { StreamingMessage } from './streaming-message';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Artifact } from '@/lib/db/schema';

interface MessageListProps {
  messages?: MessageWithArtifacts[];
  isLoading: boolean;
  streamingText?: string;
  streamingArtifacts?: Artifact[];
}

export function MessageList({
  messages,
  isLoading,
  streamingText,
  streamingArtifacts,
}: MessageListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <h2 className="text-2xl font-bold mb-2">Start a conversation</h2>
        <p className="text-muted-foreground">
          Send a message to begin chatting with Claude
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="divide-y">
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
        {streamingText && (
          <StreamingMessage content={streamingText} artifacts={streamingArtifacts || []} />
        )}
      </div>
    </ScrollArea>
  );
}
