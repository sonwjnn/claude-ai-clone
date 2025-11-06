'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { messageSchema, type MessageInput } from '../../schemas/message.schema';
import { useCreateConversation } from '../../hooks/use-conversations';
import { useChatStream } from '../../hooks/use-chat-stream';
import { useChatStore } from '../../stores/chat-store';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ChatInputProps {
  conversationId?: string;
  onStreamingChange?: (isStreaming: boolean) => void;
}

export function ChatInput({ conversationId, onStreamingChange }: ChatInputProps) {
  const router = useRouter();
  const { setCurrentConversationId } = useChatStore();
  const createConversation = useCreateConversation();

  const { sendMessage, isStreaming } = useChatStream({
    conversationId: conversationId || '',
    onComplete: () => {
      onStreamingChange?.(false);
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MessageInput>({
    resolver: zodResolver(messageSchema),
  });

  const onSubmit = async (data: MessageInput) => {
    try {
      let currentConvId = conversationId;

      // If no conversation exists, create one
      if (!currentConvId) {
        const newConv = await createConversation.mutateAsync();
        currentConvId = newConv.id;
        setCurrentConversationId(currentConvId);
        router.push(`/chat/${currentConvId}`);

        // Wait a bit for navigation
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Send message with streaming
      onStreamingChange?.(true);
      await sendMessage(data.content);

      reset();
    } catch (error) {
      console.error('Failed to send message:', error);
      onStreamingChange?.(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="border-t p-4 bg-background">
      <div className="flex gap-2">
        <Textarea
          {...register('content')}
          placeholder="Type your message... (Try: 'Create a React component' or 'Show me HTML code')"
          className="min-h-[60px] max-h-[200px]"
          disabled={isStreaming}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(onSubmit)();
            }
          }}
        />
        <Button type="submit" size="icon" disabled={isStreaming}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
      {errors.content && (
        <p className="text-sm text-destructive mt-2">{errors.content.message}</p>
      )}
    </form>
  );
}
