'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import TextareaAutosize from 'react-textarea-autosize';
import { messageSchema, type MessageInput } from '../../schemas/message.schema';
import { useCreateConversation } from '../../hooks/use-conversations';
import { useChatStream } from '../../hooks/use-chat-stream';
import { useChatStore } from '../../stores/chat-store';
import { Button } from '@/components/ui/button';
import { Send, Paperclip, StopCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

interface ChatInputEnhancedProps {
  conversationId?: string;
  onStreamingChange?: (isStreaming: boolean) => void;
}

export function ChatInputEnhanced({ conversationId, onStreamingChange }: ChatInputEnhancedProps) {
  const router = useRouter();
  const { setCurrentConversationId } = useChatStore();
  const createConversation = useCreateConversation();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [attachments, setAttachments] = useState<File[]>([]);

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
    watch,
    formState: { errors },
  } = useForm<MessageInput>({
    resolver: zodResolver(messageSchema),
  });

  const content = watch('content');
  const isEmpty = !content || content.trim().length === 0;

  const onSubmit = async (data: MessageInput) => {
    if (isEmpty || isStreaming) return;

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
      setAttachments([]);
      textareaRef.current?.focus();
    } catch (error) {
      console.error('Failed to send message:', error);
      onStreamingChange?.(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="border-t bg-background">
      <div className="mx-auto max-w-3xl p-4">
        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-md border bg-muted px-3 py-1 text-sm"
              >
                <span className="max-w-[200px] truncate">{file.name}</span>
                <button
                  onClick={() => removeAttachment(index)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input Container */}
        <form onSubmit={handleSubmit(onSubmit)} className="relative">
          <div
            className={cn(
              'flex items-end gap-2 rounded-2xl border bg-background px-3 py-2 shadow-sm transition-all focus-within:ring-2 focus-within:ring-ring',
              errors.content && 'border-destructive'
            )}
          >
            {/* File Upload Button */}
            <label htmlFor="file-upload" className="cursor-pointer">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                disabled={isStreaming}
                asChild
              >
                <div>
                  <Paperclip className="h-4 w-4" />
                  <span className="sr-only">Attach file</span>
                </div>
              </Button>
              <input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileUpload}
                disabled={isStreaming}
              />
            </label>

            {/* Textarea */}
            <TextareaAutosize
              {...register('content')}
              ref={(e) => {
                register('content').ref(e);
                // @ts-ignore
                textareaRef.current = e;
              }}
              placeholder="Message Claude..."
              className="max-h-[200px] min-h-[24px] flex-1 resize-none bg-transparent text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isStreaming}
              onKeyDown={handleKeyDown}
              minRows={1}
              maxRows={8}
            />

            {/* Send/Stop Button */}
            {isStreaming ? (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-8 w-8 shrink-0"
                onClick={() => {
                  // TODO: Implement stop generation
                }}
              >
                <StopCircle className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="icon"
                disabled={isEmpty || isStreaming}
                className="h-8 w-8 shrink-0"
              >
                {createConversation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>

          {/* Error Message */}
          {errors.content && (
            <p className="mt-1 text-xs text-destructive">{errors.content.message}</p>
          )}

          {/* Helper Text */}
          <div className="mt-2 flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span>Press Enter to send, Shift + Enter for new line</span>
            <span>•</span>
            <span>{content?.length || 0}/10000</span>
          </div>
        </form>
      </div>
    </div>
  );
}
