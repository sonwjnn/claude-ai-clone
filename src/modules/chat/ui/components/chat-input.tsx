'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { messageSchema, type MessageInput } from '../../schemas/message.schema';
import { useCreateMessage } from '../../hooks/use-messages';
import { useCreateConversation } from '../../hooks/use-conversations';
import { useChatStore } from '../../stores/chat-store';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ChatInputProps {
  conversationId?: string;
}

export function ChatInput({ conversationId }: ChatInputProps) {
  const router = useRouter();
  const { setCurrentConversationId } = useChatStore();
  const createMessage = useCreateMessage();
  const createConversation = useCreateConversation();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setIsSubmitting(true);

      let currentConvId = conversationId;

      // If no conversation exists, create one
      if (!currentConvId) {
        const newConv = await createConversation.mutateAsync();
        currentConvId = newConv.id;
        setCurrentConversationId(currentConvId);
        router.push(`/chat/${currentConvId}`);
      }

      // Send user message
      await createMessage.mutateAsync({
        content: data.content,
        conversationId: currentConvId,
      });

      // Simulate AI response (in a real app, this would call an AI API)
      setTimeout(async () => {
        await createMessage.mutateAsync({
          content: `I received your message: "${data.content}". This is a simulated response. In a production app, this would be an actual AI response.`,
          conversationId: currentConvId!,
        });
      }, 1000);

      reset();
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="border-t p-4 bg-background">
      <div className="flex gap-2">
        <Textarea
          {...register('content')}
          placeholder="Type your message..."
          className="min-h-[60px] max-h-[200px]"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(onSubmit)();
            }
          }}
        />
        <Button type="submit" size="icon" disabled={isSubmitting}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
      {errors.content && (
        <p className="text-sm text-destructive mt-2">{errors.content.message}</p>
      )}
    </form>
  );
}
