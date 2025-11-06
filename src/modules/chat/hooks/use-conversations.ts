import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getConversations } from '../api/get-conversations';
import { createConversation } from '../api/create-conversation';

export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: getConversations,
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}
