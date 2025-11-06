'use client';

import { use, useState } from 'react';
import { useMessages } from '@/modules/chat/hooks/use-messages';
import { useChatStream } from '@/modules/chat/hooks/use-chat-stream';
import { MessageListEnhanced } from '@/modules/chat/ui/components/message-list-enhanced';
import { ChatInputEnhanced } from '@/modules/chat/ui/components/chat-input-enhanced';

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
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-hidden">
        <MessageListEnhanced
          messages={messages}
          isLoading={isLoading}
          streamingText={isStreaming ? streamingText : undefined}
          streamingArtifacts={isStreaming ? streamingArtifacts : undefined}
        />
      </div>
      <ChatInputEnhanced conversationId={conversationId} onStreamingChange={setIsStreaming} />
    </div>
  );
}
