'use client';

import { use } from 'react';
import { useMessages } from '@/modules/chat/hooks/use-messages';
import { MessageList } from '@/modules/chat/ui/components/message-list';
import { ChatInput } from '@/modules/chat/ui/components/chat-input';

export default function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = use(params);
  const { data: messages, isLoading } = useMessages(conversationId);

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4">
        <h2 className="font-semibold">Conversation</h2>
      </div>
      <div className="flex-1 overflow-hidden">
        <MessageList messages={messages} isLoading={isLoading} />
      </div>
      <ChatInput conversationId={conversationId} />
    </div>
  );
}
