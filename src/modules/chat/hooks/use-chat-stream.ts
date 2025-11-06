import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Artifact } from '@/lib/db/schema';

interface StreamMessage {
  type: 'text' | 'artifact' | 'done' | 'error';
  content?: string;
  artifact?: Artifact;
  messageId?: string;
  error?: string;
}

interface UseChatStreamOptions {
  conversationId: string;
  onComplete?: () => void;
}

export function useChatStream({ conversationId, onComplete }: UseChatStreamOptions) {
  const queryClient = useQueryClient();
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [streamingArtifacts, setStreamingArtifacts] = useState<Artifact[]>([]);

  const sendMessage = useCallback(
    async (content: string) => {
      setIsStreaming(true);
      setStreamingText('');
      setStreamingArtifacts([]);

      try {
        const response = await fetch('/api/chat/stream', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content,
            conversationId,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to send message');
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error('No reader available');
        }

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = JSON.parse(line.slice(6)) as StreamMessage;

              if (data.type === 'text') {
                setStreamingText((prev) => prev + data.content);
              } else if (data.type === 'artifact' && data.artifact) {
                setStreamingArtifacts((prev) => [...prev, data.artifact!]);
              } else if (data.type === 'done') {
                // Refresh messages
                await queryClient.invalidateQueries({
                  queryKey: ['messages', conversationId],
                });
                await queryClient.invalidateQueries({
                  queryKey: ['conversations'],
                });
                onComplete?.();
              } else if (data.type === 'error') {
                console.error('Stream error:', data.error);
              }
            }
          }
        }
      } catch (error) {
        console.error('Failed to send message:', error);
      } finally {
        setIsStreaming(false);
        setStreamingText('');
        setStreamingArtifacts([]);
      }
    },
    [conversationId, queryClient, onComplete]
  );

  return {
    sendMessage,
    isStreaming,
    streamingText,
    streamingArtifacts,
  };
}
