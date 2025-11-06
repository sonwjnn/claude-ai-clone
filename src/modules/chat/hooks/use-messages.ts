import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMessages } from '../api/get-messages';
import { createMessage } from '../api/create-message';
import { MessageInput } from '../schemas/message.schema';

export function useMessages(conversationId: string) {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => getMessages(conversationId),
    enabled: !!conversationId,
  });
}

export function useCreateMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MessageInput) => createMessage(data),
    onSuccess: (_, variables) => {
      if (variables.conversationId) {
        queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
      }
    },
  });
}
