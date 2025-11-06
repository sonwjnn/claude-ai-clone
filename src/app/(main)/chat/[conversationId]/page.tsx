'use client';

import { use, useState } from 'react';
import { useMessages } from '@/modules/chat/hooks/use-messages';
import { useChatStream } from '@/modules/chat/hooks/use-chat-stream';
import { MessageList } from '@/modules/chat/ui/components/message-list';
import { ChatInput } from '@/modules/chat/ui/components/chat-input';

export default function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = use(params);
  const { data: messages, isLoading } = useMessages(conversationId);
  const [isStreaming, setIsStreaming] = useState(false);

  const { streamingText, streamingArtifacts } = useChatStream({
    conversationId,
    onComplete: () => setIsStreaming(false),
  });

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4">
        <h2 className="font-semibold">Conversation</h2>
      </div>
      <div className="flex-1 overflow-hidden">
        <MessageList
          messages={messages}
          isLoading={isLoading}
          streamingText={isStreaming ? streamingText : undefined}
          streamingArtifacts={isStreaming ? streamingArtifacts : undefined}
        />
      </div>
      <ChatInput conversationId={conversationId} onStreamingChange={setIsStreaming} />
    </div>
  );
}
